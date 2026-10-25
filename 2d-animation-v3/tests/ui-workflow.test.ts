import assert from "node:assert/strict";
import { test } from "node:test";
import { uiWorkflowSchema } from "../workflow/ui-workflow.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { expandMotionShot, validateMotion, motionBeatSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { frameSchema } from "../workflow/visuals.ts";

function fixture() {
  const data = kineticExample("ui-workflow"); if (data.board.output.kind !== "storyboard") throw Error();
  for (const shot of data.plan.shots) shot.sourceHash = hashMotionSource(data.board.output.shots[shot.sourceIndex]);
  return data;
}
test("semantic UI keeps one inquiry identity across five states and a continuous shot boundary", () => {
  const { plan, board } = fixture(); validateMotion(plan, board, hashMotionSource);
  assert.equal(compileMotion(plan, board).groups[0].actors.length, 1);
  assert.deepEqual(plan.shots.flatMap((shot) => expandMotionShot(shot).actions.filter((action) => action.to.uiStage !== undefined).map((action) => action.to.uiStage)), [1, 2, 3, 4]);
  assert.deepEqual(plan.shots[0].objects[0].ui, plan.shots[1].objects[0].ui);
  assert.equal(plan.shots[0].objects[0].ui!.inquiry.value, "Is Friday available?");
});
test("UI field schemas reject changed origins, duplicate IDs and changed authored text", () => {
  const data = fixture().plan.shots[0].objects[0].ui!;
  for (const mutate of [
    (ui: typeof data) => { ui.draft.from = "unknown"; },
    (ui: typeof data) => { ui.category.id = ui.inquiry.id; },
    (ui: typeof data) => { ui.inquiry.lines = ["Rewritten question"]; },
  ]) { const next = structuredClone(data); mutate(next); assert.throws(() => uiWorkflowSchema.parse(next)); }
});
test("UI transitions reject wrong triggers, skipped/hidden states and incompatible target parts", () => {
  const original = fixture().plan.shots[0];
  for (const mutate of [
    (shot: typeof original) => { const b = shot.beats!.find((beat) => beat.presetId === "ui-state-transition@1")!; if (b.presetId === "ui-state-transition@1") b.parameters.trigger = "model-returned"; },
    (shot: typeof original) => { shot.objects[0].initialParts!.inquiry.opacity = 0; },
    (shot: typeof original) => { shot.objects[0].initialParts!.surface.uiStage = 4; },
    (shot: typeof original) => { shot.beats![1].targetIds = ["object-1.draft"]; },
    (shot: typeof original) => { shot.beats![1].endFrame = shot.beats![1].startFrame + 10; },
  ]) { const next = structuredClone(original); mutate(next); assert.throws(() => expandMotionShot(next)); }
  const transition = original.beats!.find((beat) => beat.presetId === "ui-state-transition@1")!;
  assert.throws(() => motionBeatSchema.parse({ ...transition, parameters: { trigger: "approve-response" } }));
});
test("UI redraws/review cannot rewrite fields or remove source results", () => {
  const { plan, board } = fixture(); if (board.output.kind !== "storyboard") throw Error();
  const end = board.output.shots[1].endFrame;
  end.shapes[0].ui!.draft.value = "Unplanned reply"; end.shapes[0].ui!.draft.lines = ["Unplanned reply"];
  plan.shots[1].sourceHash = hashMotionSource(board.output.shots[1]);
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /UI field identity/);
  const { board: original } = fixture(); if (original.output.kind !== "storyboard") throw Error();
  const review = original.output.shots[1].endFrame; review.shapes[0].parts!.draft.reveal = 0;
  assert.throws(() => frameSchema.parse(review), /Review state/);
});
