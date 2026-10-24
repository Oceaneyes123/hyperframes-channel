import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectMotion } from "../workflow/production.ts";
import { presetScene, presetShape } from "./fixtures/motion-presets.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";

test("intentional reading holds are excluded from stillness diagnostics", () => {
  const { plan } = presetScene([presetShape(42)], [presetShape(42)], [[0, 0]], { presetId: "snap-overshoot@1", parameters: { to: {}, anticipation: .9, overshoot: 1.08 }, targetIds: ["object-1"] });
  plan.shots[0].beats = [{ ...plan.shots[0].beats![0], type: "hold", presetId: "hold@1", parameters: {}, startFrame: 0, endFrame: 118 }];
  assert.deepEqual(inspectMotion(plan).findings, []);
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

test("renderer text metrics, contrast, clipping and crowding detect weak settled layouts", () => {
  const { plan, board } = motionBeatFixture(); const shot = plan.shots[0];
  const text = shot.objects.find((object) => object.type === "heading")!;
  text.label = "A crowded label with far too much text"; text.initial.width = 8; text.initial.color = "#172020";
  const duplicate = structuredClone(text); duplicate.id = "duplicate"; shot.objects.push(duplicate); shot.camera.x = 95;
  const report = inspectMotion(plan, board), rules = new Set(report.findings.map((finding) => finding.ruleId));
  assert.ok(rules.has("text-size")); assert.ok(rules.has("contrast")); assert.ok(rules.has("clipping")); assert.ok(rules.has("text-crowding"));
});
