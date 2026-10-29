import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { presetScene, presetShape } from "./fixtures/motion-presets.ts";

const inspectRules = ["rhythm-inactivity", "primary-preset-share", "neighbor-illustration-reuse", "text-element-budget", "audience-disclaimer-label"];

test("rhythm diagnostics are review-only, deterministic and preserve source plans", () => {
  const { plan, board } = motionBeatFixture(), before = JSON.stringify({ plan, board });
  const report = inspectCreativeMotion(plan, board);
  assert.deepEqual(report, inspectCreativeMotion(plan, board));
  assert.equal(JSON.stringify({ plan, board }), before);
  const findings = report.findings.filter((finding) => inspectRules.includes(finding.ruleId));
  assert.ok(findings.length);
  assert.ok(findings.every((finding) => finding.severity === "review" && finding.heuristic));
  assert.equal(report.requiresHumanReview, true);
});

test("inactive spans include holds in calm plans, skip no-op actions, and obey the configured boundary", () => {
  const { plan } = presetScene([presetShape(42)], [presetShape(42)], [[0, 0]], { presetId: "snap-overshoot@1", parameters: { to: {}, anticipation: .9, overshoot: 1.08 }, targetIds: ["object-1"] });
  plan.energyProfile = "calm";
  const shot = plan.shots[0];
  shot.beats = [{ ...shot.beats![0], type: "hold", presetId: "hold@1", parameters: {}, startFrame: 0, endFrame: 118 }];
  assert.ok(inspectCreativeMotion(plan).findings.some((finding) => finding.ruleId === "rhythm-inactivity"));
  assert.ok(!inspectCreativeMotion(plan, null, { maxInactiveFrames: 120 }).findings.some((finding) => finding.ruleId === "rhythm-inactivity"));
  delete shot.beats; plan.interpreterVersion = "2";
  shot.actions = [{ behavior: "transform", targetIds: [shot.objects[0].id], startFrame: 0, endFrame: 119, staggerFrames: 0, ease: "linear", to: { opacity: shot.objects[0].initial.opacity } }];
  assert.ok(inspectCreativeMotion(plan).findings.some((finding) => finding.ruleId === "rhythm-inactivity"));
  assert.throws(() => inspectCreativeMotion(plan, null, { maxInactiveFrames: -1 }));
});

test("primary share excludes holds/supporting beats and flags nonconsecutive dominance", () => {
  const { plan } = motionBeatFixture();
  const before = inspectCreativeMotion(plan);
  assert.ok(before.findings.some((finding) => finding.ruleId === "primary-preset-share"));
  const primaryCount = plan.shots.flatMap((shot) => shot.beats!).filter((beat) => beat.type !== "hold" && beat.importance === "primary").length;
  assert.equal(Object.values(before.primaryPresetUsage).reduce((sum, count) => sum + count, 0), primaryCount);
  assert.ok(!inspectCreativeMotion(plan, null, { maxPrimaryPresetShare: 1 }).findings.some((finding) => finding.ruleId === "primary-preset-share"));
  for (const shot of plan.shots) for (const beat of shot.beats!) beat.importance = "supporting";
  assert.ok(!inspectCreativeMotion(plan).findings.some((finding) => finding.ruleId === "primary-preset-share"));
});

test("illustration reuse reports adjacent identities while retaining continuity as a review exception", () => {
  const { plan } = motionBeatFixture();
  const originals = structuredClone(plan.shots[0].objects);
  for (const shot of plan.shots) { delete shot.beats; shot.actions = []; shot.objects = structuredClone(originals); }
  plan.interpreterVersion = "2";
  assert.ok(inspectCreativeMotion(plan).findings.some((finding) => finding.ruleId === "neighbor-illustration-reuse"));
  plan.shots = [plan.shots[0]];
  assert.ok(!inspectCreativeMotion(plan).findings.some((finding) => finding.ruleId === "neighbor-illustration-reuse"));
});

test("text budget ignores permanently hidden roots and disclaimer detection preserves meaningful demo text", () => {
  const { plan } = motionBeatFixture(); plan.shots = [plan.shots[0]];
  const shot = plan.shots[0]; delete shot.beats; shot.actions = []; plan.interpreterVersion = "2";
  const base = shot.objects.find((object) => object.type === "heading")!;
  shot.objects = ["Illustrative", "Demo", "Test illustration", "Run demo command"].map((label, index) => ({ ...structuredClone(base), id: `label-${index}`, label, initial: { ...base.initial, opacity: 1 } }));
  const rules = inspectCreativeMotion(plan).findings;
  assert.equal(rules.filter((finding) => finding.ruleId === "audience-disclaimer-label").length, 3);
  assert.ok(rules.some((finding) => finding.ruleId === "text-element-budget"));
  shot.objects.forEach((object) => object.initial.opacity = 0);
  assert.ok(!inspectCreativeMotion(plan).findings.some((finding) => ["audience-disclaimer-label", "text-element-budget"].includes(finding.ruleId)));
});
