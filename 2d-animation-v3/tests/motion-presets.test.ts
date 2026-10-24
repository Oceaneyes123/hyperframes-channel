import assert from "node:assert/strict";
import { test } from "node:test";
import { validateMotion, expandMotionShot, motionBeatSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { presetShape as shape, presetScene, motionPresetSequence } from "./fixtures/motion-presets.ts";
import { compileMotion } from "../engine/compile-motion.ts";

test("fifteen-second sequence exercises all six semantic presets with intentional holds", () => {
  const { plan, board } = motionPresetSequence();
  validateMotion(plan, board, hashMotionSource);
  assert.equal(compileMotion(plan, board).durationFrames, 450);
  assert.equal(new Set(plan.shots.map((shot) => shot.beats![0].presetId)).size, 6);
  assert.ok(plan.shots.every((shot) => shot.beats!.at(-1)?.type === "hold"));
});

test("cascade introduces hidden actors in a bounded stagger and settles each approved endpoint", () => {
  const anchor = shape(42, 15), left = shape(20), right = shape(65);
  const { plan, board } = presetScene([anchor], [anchor, left, right], [[0, 0], [null, 1], [null, 2]], { presetId: "cascade@1", parameters: { staggerFrames: 3, offsetY: 6, overshoot: 1.1 }, targetIds: ["object-2", "object-3"] });
  validateMotion(plan, board, hashMotionSource);
  const actions = expandMotionShot(plan.shots[0]).actions;
  assert.deepEqual(actions.filter((action) => action.to.opacity === 0).map((action) => action.startFrame), [5, 8]);
  assert.equal(Math.max(...actions.map((action) => action.endFrame)), 35);
  const invalid = structuredClone(plan); invalid.shots[0].beats![0].targetIds = ["object-1"];
  assert.throws(() => validateMotion(invalid, board, hashMotionSource), /hidden/);
});

test("convergence consumes known source actors and reveals a distinct result without changing identities", () => {
  const { plan, board } = presetScene([shape(20), shape(65)], [shape(42)], [[0, null], [1, null], [null, 0]], { presetId: "converge-assemble@1", parameters: { resultId: "object-3", overshoot: 1.1 }, targetIds: ["object-1", "object-2"] });
  validateMotion(plan, board, hashMotionSource);
  const actions = expandMotionShot(plan.shots[0]).actions;
  assert.equal(actions.filter((action) => action.to.opacity === 0).length, 2);
  assert.ok(actions.some((action) => action.targetIds[0] === "object-3" && action.to.opacity === 1));
  const invalid = structuredClone(plan); const beat = invalid.shots[0].beats![0];
  if (beat.presetId === "converge-assemble@1") beat.parameters.resultId = "missing";
  assert.throws(() => validateMotion(invalid, board, hashMotionSource), /hidden result/);
});

test("punch zoom keeps the focal point stable, restores its camera and rejects competing ownership", () => {
  const { plan, board } = presetScene([shape(42)], [shape(42)], [[0, 0]], { presetId: "punch-zoom@1", parameters: { focusId: "object-1", zoom: 1.2 }, targetIds: ["camera"] });
  validateMotion(plan, board, hashMotionSource);
  const shot = expandMotionShot(plan.shots[0]), peak = shot.actions[0].to;
  assert.ok(Math.abs(peak.x! + peak.scale! * 50 - 50) < 1e-9);
  assert.ok(Math.abs(peak.y! + peak.scale! * 46 - 46) < 1e-9);
  assert.deepEqual(shot.actions.at(-1)?.to, plan.shots[0].camera);
  plan.shots[0].camera.rotation = 30;
  const rotated = expandMotionShot(plan.shots[0]).actions[0].to;
  const angle = Math.PI / 6, x = 540 * Math.cos(angle) - 883.2 * Math.sin(angle), y = 540 * Math.sin(angle) + 883.2 * Math.cos(angle);
  assert.ok(Math.abs(rotated.x! * 10.8 + rotated.scale! * x - x) < 1e-9);
  assert.ok(Math.abs(rotated.y! * 19.2 + rotated.scale! * y - y) < 1e-9);
  const competing = structuredClone(plan.shots[0].beats![0]); competing.id = "competing";
  plan.shots[0].beats!.push(competing);
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /same property/);
});

test("geometric presets reject concurrent motion of a focal actor instead of using its future state", () => {
  const { plan, board } = presetScene([shape(42)], [shape(42)], [[0, 0]], { presetId: "punch-zoom@1", parameters: { focusId: "object-1", zoom: 1.2 }, targetIds: ["camera"] });
  plan.shots[0].beats!.push(motionBeatSchema.parse({ ...plan.shots[0].beats![0], id: "moving-focus", presetId: "snap-overshoot@1", targetIds: ["object-1"], startFrame: 10, endFrame: 25, parameters: { to: { x: 42 }, anticipation: .9, overshoot: 1.08 } }));
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /moving during/);
});

test("flow hands an exiting packet to a known destination and visibly reacts there", () => {
  const packet = shape(15), destination = { ...shape(65), type: "server" as const };
  const { plan, board } = presetScene([packet, destination], [destination], [[0, null], [1, 0]], { presetId: "flow-handoff@1", parameters: { destinationId: "object-2", reactionScale: 1.1 }, targetIds: ["object-1"] });
  validateMotion(plan, board, hashMotionSource);
  const actions = expandMotionShot(plan.shots[0]).actions;
  assert.ok(actions.some((action) => action.targetIds[0] === "object-1" && action.to.x === 65));
  assert.ok(actions.some((action) => action.targetIds[0] === "object-2" && action.to.scale === 1.1));
  const beat = plan.shots[0].beats![0]; if (beat.presetId === "flow-handoff@1") beat.parameters.destinationId = "object-1";
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /distinct/);
});

test("split replaces its source with explicit children and settles their approved geometry", () => {
  const { plan, board } = presetScene([shape(42)], [shape(20, 55), shape(65, 55)], [[0, null], [null, 0], [null, 1]], { presetId: "split-disperse@1", parameters: { childIds: ["object-2", "object-3"] }, targetIds: ["object-1"] });
  validateMotion(plan, board, hashMotionSource);
  const actions = expandMotionShot(plan.shots[0]).actions;
  assert.equal(actions.filter((action) => action.to.opacity === 1).length, 2);
  const beat = plan.shots[0].beats![0]; if (beat.presetId === "split-disperse@1") beat.parameters.childIds = ["object-2", "object-2"];
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /distinct hidden/);
});
