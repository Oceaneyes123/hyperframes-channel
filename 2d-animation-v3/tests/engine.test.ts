import assert from "node:assert/strict";
import { test } from "node:test";
import { compileMotion } from "../engine/compile-motion.ts";
import { validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { motionEngineFixture } from "./fixtures/motion-engine.ts";
import { scheduleMotion } from "../workflow/motion.ts";
import { splitPanel } from "../workflow/motion.ts";
import { frameSchema } from "../workflow/visuals.ts";
import { inspectMotion } from "../workflow/production.ts";

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

test("interpreter 2 gives every boundary an explicit presentation and rejects substitutes", () => {
  for (const [type, presentation, overlapFrames] of [["hard-cut", "cut", 0], ["match-cut", "cut", 0], ["continuous", "shared", 0], ["camera", "slide", 20], ["reveal", "wipe", 20], ["split-screen", "split", 30]] as const) {
    const { plan } = motionEngineFixture(); plan.interpreterVersion = "2"; plan.shots = plan.shots.slice(0, 2);
    Object.assign(plan.shots[1].incoming, { type, presentation, overlapFrames });
    assert.equal(scheduleMotion(plan).durationFrames, 240 - overlapFrames);
    plan.shots[1].incoming.presentation = presentation === "cut" ? "fade" : "cut";
    assert.throws(() => scheduleMotion(plan));
  }
  assert.deepEqual(splitPanel(.6, false), { width: .5, left: 0 }); assert.deepEqual(splitPanel(.6, true), { width: .5, left: .5 });
  for (const progress of [0, .2, .4, .6, .8, 1]) assert.ok(Math.abs(splitPanel(progress, true).width + splitPanel(progress, false).width - 1) < 1e-10);
});

test("safe visual symbols remain bounded declarative data", () => {
  for (const type of ["document", "browser", "database", "server", "cloud", "person", "chip", "coin", "centered-text"]) {
    assert.equal(frameSchema.parse({ background: "#000000", shapes: [{ type, x: 10, y: 10, width: 70, height: 70, color: "#ffffff", label: "" }] }).shapes[0].type, type);
  }
  assert.throws(() => frameSchema.parse({ background: "#000000", shapes: [{ type: "svg", markup: "<script/>" }] }));
});

test("centered labels retain text motion restrictions", () => {
  const { plan, board } = motionEngineFixture();
  const object = plan.shots[0].objects.find((item) => item.type === "text")!;
  object.type = "centered-text";
  assert.doesNotThrow(() => compileMotion(plan, board));
  object.label = "A long centered label still needs a phone readability review";
  assert.ok(inspectMotion(plan).warnings.some((warning) => warning.includes("inspect long text")));
  plan.shots[0].actions.push({ ...plan.shots[0].actions[0], targetIds: [object.id], to: { width: 20 } });
  assert.throws(() => compileMotion(plan, board), /Text width/);
});
