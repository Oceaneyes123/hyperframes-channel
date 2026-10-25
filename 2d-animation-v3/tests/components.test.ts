import assert from "node:assert/strict";
import { test } from "node:test";
import { frameSchema } from "../workflow/visuals.ts";
import { componentParts, componentRegistry, type ComponentType } from "../workflow/components.ts";
import { validateMotion, expandMotionShot, motionBeatSchema, hydrateMotion, energyProfileSchema } from "../workflow/motion.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { motionComponentFixture } from "./fixtures/motion-components.ts";

test("registered component parts animate independently and retain approved endpoints", () => {
  const { plan, board } = motionComponentFixture();
  validateMotion(plan, board, hashMotionSource);
  const group = compileMotion(plan, board).groups[0];
  assert.equal(group.shots[0].targets["object-1.message"], "actor-0.message");
  assert.equal(group.actors.length, 1);
  assert.deepEqual(Object.keys(componentParts("inbox-panel@1", "#9BA7FF")), ["message", "highlight", "extracted", "packet"]);
  const generated = { shots: plan.shots.map(({ durationFrames, camera, incoming, beats, objects }) => ({ durationFrames, camera, incoming, beats, objects: objects.map(({ id, startIndex, endIndex }) => ({ id, startIndex, endIndex })) })) };
  const hydrated = hydrateMotion(generated, board, hashMotionSource, undefined, "3");
  assert.deepEqual(hydrated.shots[0].objects[0].initialParts, plan.shots[0].objects[0].initialParts); validateMotion(hydrated, board, hashMotionSource);
  for (const profile of energyProfileSchema.options) {
    const variant = hydrateMotion(generated, board, hashMotionSource, undefined, "3", profile);
    assert.equal(variant.energyProfile, profile); assert.deepEqual(variant.shots, hydrated.shots, "A profile must never multiply submitted timings or remove reading holds.");
  }
});

test("approval and API components reuse the same validated part and actor contracts", () => {
  for (const type of Object.keys(componentRegistry) as ComponentType[]) {
    const { plan, board } = motionComponentFixture(type);
    validateMotion(plan, board, hashMotionSource);
    assert.equal(compileMotion(plan, board).groups[0].actors.length, 1);
    assert.ok(Object.keys(plan.shots[0].objects[0].initialParts!).length >= 1);
  }
});

test("mask reveal is bounded to known parts and reaches its exact approved final mask", () => {
  const { plan, board } = motionComponentFixture();
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  const shot = plan.shots[0]; shot.objects[0].initialParts!.message.reveal = 0;
  board.output.shots[0].startFrame.shapes[0].parts = { message: { ...shot.objects[0].initialParts!.message } };
  shot.sourceHash = hashMotionSource(board.output.shots[0]);
  shot.beats!.push(motionBeatSchema.parse({ ...shot.beats![0], id: "mask", presetId: "mask-reveal@1", startFrame: 20, endFrame: 32, parameters: { reveal: 1 } }));
  shot.beats!.sort((a, b) => a.startFrame - b.startFrame);
  validateMotion(plan, board, hashMotionSource);
  assert.ok(expandMotionShot(shot).actions.some((action) => action.to.reveal === 1));
  shot.beats!.find((beat) => beat.id === "mask")!.targetIds = ["object-1"];
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /registered component parts/);
});

test("charts require supplied integer units and phrases reject excessive text", () => {
  const chart = motionComponentFixture("cost-chart@1").board;
  if (chart.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  const frame = structuredClone(chart.output.shots[0].startFrame); frame.shapes[0].values = [-1, 2];
  assert.throws(() => frameSchema.parse(frame));
  delete frame.shapes[0].values;
  assert.throws(() => frameSchema.parse(frame));
  frame.shapes[0].type = "kinetic-phrase@1"; frame.shapes[0].label = "too many words to read quickly here";
  assert.throws(() => frameSchema.parse(frame));
});

test("component part markup, unknown selectors, invalid properties and holds fail closed", () => {
  const { plan, board } = motionComponentFixture();
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  const frame = structuredClone(board.output.shots[0].endFrame);
  frame.shapes[0].parts!["script"] = { x: 0, y: 0, opacity: 1, scale: 1, color: "#ffffff" };
  assert.throws(() => frameSchema.parse(frame));
  const unknown = structuredClone(plan); unknown.shots[0].beats![0].targetIds = ["object-1.unknown"];
  assert.throws(() => validateMotion(unknown, board, hashMotionSource), /Unknown/);
  const resized = structuredClone(plan); const beat = resized.shots[0].beats![0];
  if (beat.presetId === "snap-overshoot@1") beat.parameters.to.width = 20;
  assert.throws(() => validateMotion(resized, board, hashMotionSource), /Component parts support/);
  const held = structuredClone(plan); held.shots[0].beats!.at(-1)!.startFrame = 1;
  held.shots[0].beats!.sort((a, b) => a.startFrame - b.startFrame);
  assert.throws(() => validateMotion(held, board, hashMotionSource), /hold/);
  const mismatched = structuredClone(plan); mismatched.shots[0].objects[0].initialParts!.message.opacity = 1;
  assert.throws(() => validateMotion(mismatched, board, hashMotionSource), /Initial component/);
});
