import assert from "node:assert/strict";
import { test } from "node:test";
import { compileMotion } from "../engine/compile-motion.ts";
import { validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { motionEngineFixture } from "./fixtures/motion-engine.ts";

test("compiler retains a shared actor across continuous shots and schedules overlap once", () => {
  const { plan, board } = motionEngineFixture(); validateMotion(plan, board, hashMotionSource);
  const compiled = compileMotion(plan, board);
  assert.equal(compiled.durationFrames, 345); assert.equal(compiled.groups.length, 2);
  const group = compiled.groups[0]; assert.equal(group.durationFrames, 240); assert.equal(group.actors.length, 5);
  assert.equal(group.shots[0].targets["object-1"], group.shots[1].targets["object-1"]);
  assert.equal(group.actors.find((actor) => actor.id === group.shots[0].targets["object-1"])?.endFrame, 240);
  assert.deepEqual(compiled.shots.map((shot) => shot.startFrame), [0, 120, 225]);
});

test("unsupported motion is rejected instead of silently falling back to a cut", () => {
  const { plan, board } = motionEngineFixture();
  plan.shots[1].incoming.type = "motion-match"; assert.throws(() => compileMotion(plan, board), /Velocity/);
  plan.shots[1].incoming.type = "continuous";
  plan.shots[0].actions.push({ ...plan.shots[0].actions[0], targetIds: ["object-3"], to: { width: 20 } });
  assert.throws(() => compileMotion(plan, board), /Text width/);
});

test("continuous appearance/camera discontinuities are rejected by the source validator", () => {
  const { plan, board } = motionEngineFixture();
  plan.shots[1].camera.x = 0; assert.throws(() => validateMotion(plan, board, hashMotionSource), /camera/);
  plan.shots[1].camera.x = -4; plan.shots[1].incoming.presentation = "cut";
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /shared/);
});
