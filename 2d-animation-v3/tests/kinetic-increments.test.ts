import assert from "node:assert/strict";
import { test } from "node:test";
import { kineticExample, kineticExamples } from "../workflow/examples/kinetic.ts";
import { validateMotion, expandMotionShot, motionActionSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";

test("each kinetic example validates exact approved start/end correspondence", () => {
  for (const entry of kineticExamples) {
    const { board, plan } = kineticExample(entry.id);
    if (board.output.kind !== "storyboard") throw new Error();
    for (const shot of plan.shots) shot.sourceHash = hashMotionSource(board.output.shots[shot.sourceIndex]);
    validateMotion(plan, board, hashMotionSource);
  }
});

test("UI handoff preserves word identity, uses a single token and ends in the authored review slot", () => {
  const { plan } = kineticExample("handoff"), shot = plan.shots[0];
  assert.deepEqual(shot.objects.slice(1).map((object) => object.label), ["Request", "Category", "Review"]);
  assert.equal(shot.objects.filter((object) => object.type === "inbox-panel@1").length, 1);
  const actions = expandMotionShot(shot).actions.filter((action) => action.targetIds.includes("object-1.packet"));
  assert.ok(actions.some((action) => action.to.x === 0 && action.to.y === 0));
  assert.equal(actions.at(-1)!.to.scale, 1);
  assert.throws(() => motionActionSchema.parse({ ...actions[0], to: { label: "Changed identity" } }));
});
