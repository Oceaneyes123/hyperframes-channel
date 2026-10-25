import assert from "node:assert/strict";
import { test } from "node:test";
import { connectedProcessExample } from "../workflow/examples/connected-process.ts";
import { connectedProcessSequence } from "./fixtures/connected-process.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { validateMotion, expandMotionShot, motionBeatSchema } from "../workflow/motion.ts";
import { frameSchema } from "../workflow/visuals.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { inspectMotion } from "../workflow/production.ts";

test("connected process handles forward, branching and feedback routes under root motion", () => {
  for (const example of [connectedProcessExample(), connectedProcessSequence()]) {
    validateMotion(example.plan, example.board, hashMotionSource);
    assert.equal(compileMotion(example.plan, example.board).durationFrames, 180 * example.plan.shots.length);
    assert.equal(inspectMotion(example.plan).presetUsage["edge-trace@1"], 2 * example.plan.shots.length);
  }
  const shot = expandMotionShot(connectedProcessExample().plan.shots[0]);
  assert.equal(shot.actions.filter((action) => action.to.traceProgress === 1).length, 2);
  assert.ok(shot.actions.some((action) => action.targetIds[0] === "object-1.classify" && action.to.arrivalPulse === 1 && action.startFrame === 54));
  assert.ok(shot.actions.some((action) => action.targetIds[0] === "object-1.review" && action.to.arrivalPulse === 0));
});

test("edge presets reject root, node, unknown, hidden, masked and not-yet-drawn targets", () => {
  for (const kind of ["root", "node", "unknown", "hidden", "masked", "undrawn", "short"]) {
    const { plan, board } = connectedProcessExample(), shot = plan.shots[0], trace = shot.beats![1];
    if (kind === "root") trace.targetIds = ["object-1"];
    if (kind === "node") trace.targetIds = ["object-1.classify"];
    if (kind === "unknown") trace.targetIds = ["object-1.missing"];
    if (kind === "hidden") shot.objects[0].initialParts!.classify.opacity = 0;
    if (kind === "masked") shot.objects[0].initialParts!.request.reveal = .5;
    if (kind === "undrawn") shot.beats!.shift();
    if (kind === "short") trace.endFrame = trace.startFrame + 11;
    assert.throws(() => validateMotion(plan, board, hashMotionSource), kind);
  }
});

test("dependency changes, concurrent traces and reading holds cannot race edge travel", () => {
  for (const kind of ["draw-overlap", "hidden-root", "duplicate-trace", "hold"]) {
    const { plan, board } = connectedProcessExample(), shot = plan.shots[0];
    if (kind === "draw-overlap") shot.beats![0].endFrame = 40;
    if (kind === "duplicate-trace") shot.beats!.push({ ...shot.beats![1], id: "duplicate" });
    if (kind === "hidden-root") shot.beats!.push(motionBeatSchema.parse({ ...shot.beats![0], id: "hide-root", startFrame: 30, endFrame: 45, presetId: "snap-overshoot@1", targetIds: ["object-1"], parameters: { to: { opacity: 0 }, anticipation: .9, overshoot: 1.1 } }));
    if (kind === "hold") Object.assign(shot.beats!.at(-1)!, { startFrame: 40, endFrame: 70 });
    shot.beats!.sort((a, b) => a.startFrame - b.startFrame);
    assert.throws(() => validateMotion(plan, board, hashMotionSource), kind);
  }
});

test("new fields fail closed outside edge parts and accept no paths or alternate destinations", () => {
  const { board, plan } = connectedProcessExample();
  if (board.output.kind !== "storyboard") throw new Error();
  const frame = board.output.shots[0].startFrame;
  frame.shapes[0].parts!.classify.strokeProgress = .5;
  assert.throws(() => frameSchema.parse(frame), /diagram edge/);
  for (const parameters of [{ path: "M0 0L1 1" }, { destinationId: "inquiry" }, { onComplete: "code" }]) assert.throws(() => motionBeatSchema.parse({ ...plan.shots[0].beats![1], parameters }));
  const bad = connectedProcessExample(); bad.plan.shots[0].objects[0].initialParts!.request.strokeProgress = 2;
  assert.throws(() => validateMotion(bad.plan, bad.board, hashMotionSource));
});
