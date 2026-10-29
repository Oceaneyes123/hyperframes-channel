import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectMotion } from "../workflow/production.ts";
import { presetScene, presetShape } from "./fixtures/motion-presets.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { defaultEnergyProfile, motionPacingGuidance } from "../workflow/motion.ts";

test("intentional holds exclude legacy stillness but retain advisory inactivity evidence", () => {
  const { plan } = presetScene([presetShape(42)], [presetShape(42)], [[0, 0]], { presetId: "snap-overshoot@1", parameters: { to: {}, anticipation: .9, overshoot: 1.08 }, targetIds: ["object-1"] });
  plan.shots[0].beats = [{ ...plan.shots[0].beats![0], type: "hold", presetId: "hold@1", parameters: {}, startFrame: 0, endFrame: 118 }];
  const held = inspectMotion(plan).findings;
  assert.ok(!held.some((finding) => finding.ruleId === "stillness"));
  assert.ok(held.some((finding) => finding.ruleId === "rhythm-inactivity" && finding.severity === "review"));
  plan.shots[0].beats[0].endFrame = 15;
  assert.ok(inspectMotion(plan).findings.some((finding) => finding.ruleId === "stillness"));
});

test("weak choreography produces stable, frame-linked evidence rather than a universal quality score", () => {
  const { plan } = motionBeatFixture();
  const report = inspectMotion(plan);
  assert.ok(report.findings.some((finding) => finding.ruleId === "repetitive-preset"));
  assert.deepEqual(report, inspectMotion(plan));
  assert.equal(Object.hasOwn(report, "score"), false);
  assert.ok(report.findings.every((finding) => finding.shotId && finding.startFrame >= 0 && finding.endFrame >= finding.startFrame && finding.evidence && finding.suggestion));
});

test("motion review catches long passive holds and three-shot reveal templates", () => {
  const { plan } = motionBeatFixture();
  plan.shots.forEach((shot) => {
    shot.durationFrames = 180;
    const entry = shot.beats![0]; if (entry.presetId !== "snap-overshoot@1") throw new Error();
    shot.beats = [{ ...entry, type: "entry", startFrame: 10, endFrame: 30 },
      { ...shot.beats!.find((beat) => beat.type === "hold")!, startFrame: 45, endFrame: 179 }];
  });
  const rules = new Set(inspectMotion(plan).findings.map((finding) => finding.ruleId));
  assert.ok(rules.has("long-hold"));
  assert.ok(rules.has("passive-sequence"));
});

test("renderer text metrics, contrast, clipping and crowding detect weak settled layouts", () => {
  const { plan, board } = motionBeatFixture(); const shot = plan.shots[0];
  const text = shot.objects.find((object) => object.type === "heading")!;
  text.label = "A crowded label with far too much text"; text.initial.width = 8; text.initial.color = "#172020";
  const duplicate = structuredClone(text); duplicate.id = "duplicate"; shot.objects.push(duplicate); shot.camera.x = 95;
  const report = inspectMotion(plan, board), rules = new Set(report.findings.map((finding) => finding.ruleId));
  assert.ok(rules.has("text-size")); assert.ok(rules.has("contrast")); assert.ok(rules.has("clipping")); assert.ok(rules.has("text-crowding"));
});

test("high-energy review catches declared holds and drawn-out motion without rewriting saved plans", () => {
  assert.equal(defaultEnergyProfile, "intense"); assert.match(motionPacingGuidance("intense"), /6–12 frames/);
  const { plan } = motionBeatFixture(); plan.energyProfile = "intense";
  const shot = plan.shots[0]; shot.durationFrames = 120;
  const entry = shot.beats![0]; entry.type = "entry"; entry.startFrame = 0; entry.endFrame = 30;
  shot.beats![1].startFrame = 35; shot.beats![1].endFrame = 119;
  const original = JSON.stringify(plan), report = inspectMotion(plan);
  const rules = new Set(report.findings.filter((finding) => finding.shotId === shot.id).map((finding) => finding.ruleId));
  for (const rule of ["development-gap", "slow-development", "missing-causal-beat", "slow-entrance"]) assert.ok(rules.has(rule), rule);
  assert.equal(JSON.stringify(plan), original); assert.equal(report.requiresHumanReview, true); assert.equal(Object.hasOwn(report, "score"), false);
  plan.energyProfile = "calm";
  assert.ok(!inspectMotion(plan).findings.some((finding) => ["development-gap", "slow-development", "missing-causal-beat"].includes(finding.ruleId)));
});

test("short causal beats and comprehension holds can satisfy intense pacing without continuous motion", () => {
  const { plan } = motionBeatFixture(); plan.energyProfile = "intense";
  plan.shots = [plan.shots[0]]; const shot = plan.shots[0]; shot.durationFrames = 58;
  shot.beats![0].startFrame = 0; shot.beats![0].endFrame = 12;
  shot.beats![1].startFrame = 14; shot.beats![1].endFrame = 30;
  const report = inspectMotion(plan);
  assert.ok(!report.findings.some((finding) => ["development-gap", "slow-development", "missing-causal-beat", "slow-entrance", "reading-hold"].includes(finding.ruleId)));
});

test("cause/reaction review distinguishes a receiving actor from an isolated impact and exposes whole-video rhythm", () => {
  const { plan } = presetScene([presetShape(15), { ...presetShape(65), type: "server" }], [{ ...presetShape(65), type: "server" }], [[0, null], [1, 0]], { presetId: "flow-handoff@1", parameters: { destinationId: "object-2", reactionScale: 1.1 }, targetIds: ["object-1"] });
  plan.energyProfile = "intense";
  const handoff = inspectMotion(plan); assert.ok(!handoff.findings.some((finding) => finding.ruleId === "missing-reaction"));
  const isolated = motionBeatFixture().plan; isolated.energyProfile = "intense";
  const report = inspectMotion(isolated);
  assert.ok(report.findings.some((finding) => finding.ruleId === "missing-reaction"));
  assert.equal(report.rhythm.shots.length, isolated.shots.length); assert.equal(report.rhythm.requiresHumanReview, true);
  assert.ok(report.rhythm.shots.some((shot) => shot.missingReactions > 0));
});
