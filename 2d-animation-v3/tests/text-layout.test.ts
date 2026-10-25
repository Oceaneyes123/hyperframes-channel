import assert from "node:assert/strict";
import { test } from "node:test";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { expandMotionShot, validateMotion, motionPlanSchema, scopedBeatMotionSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";

function fixture(id: "text-layout" | "word-to-ui" | "keyword-focus" | "type-match" = "text-layout") {
  const data = kineticExample(id);
  if (data.board.output.kind !== "storyboard") throw Error("Expected storyboard");
  for (const shot of data.plan.shots) shot.sourceHash = hashMotionSource(data.board.output.shots[shot.sourceIndex]);
  return data;
}
test("authored text layout recipes validate fixed identities and use the existing scoped/GSAP path", () => {
  for (const id of ["text-layout", "word-to-ui", "keyword-focus", "type-match"] as const) {
    const { plan, board } = fixture(id); validateMotion(plan, board, hashMotionSource);
    for (const shot of plan.shots) {
      scopedBeatMotionSchema.parse({ camera: shot.camera, durationFrames: shot.durationFrames, incoming: shot.incoming, beats: shot.beats });
      assert.ok(expandMotionShot(shot).actions.length);
    }
  }
});
test("layout rejects in-flight collisions, missing destinations, overlapping entrances and external transforms", () => {
  const { plan } = fixture(), original = plan.shots[0];
  for (const mutate of [
    (shot: typeof original) => { const b = shot.beats![0]; if (b.presetId === "text-layout-morph@1") b.parameters.route = "horizontal-first"; },
    (shot: typeof original) => { shot.beats![0].targetIds = ["object-1"]; },
    (shot: typeof original) => { shot.beats![0].endFrame = 23; },
    (shot: typeof original) => { shot.camera.scale = 1.1; },
    (shot: typeof original) => { shot.objects[0].typography = undefined; },
    (shot: typeof original) => { const b = shot.beats![0]; if (b.presetId === "text-layout-morph@1") b.parameters.destinations["object-2"].x = 90; },
    (shot: typeof original) => { shot.textMotions = [{ targetId: "object-1", presetId: "mask-rise@1", startFrame: 12, endFrame: 30 }]; },
    (shot: typeof original) => { shot.beats!.splice(1, 0, { id: "interference", purpose: "Invalid overlapping root change", type: "emphasis", presetId: "snap-overshoot@1", parameters: { to: { x: 20 }, anticipation: .9, overshoot: 1.04 }, targetIds: ["object-1"], startFrame: 16, endFrame: 26, importance: "supporting", narrationAnchor: null, continuity: null }); },
  ]) { const changed = structuredClone(original); mutate(changed); assert.throws(() => expandMotionShot(changed)); }
});
test("typographic matched cuts preserve content/profile while untagged historical cuts retain their semantics", () => {
  const { plan, board } = fixture("type-match"); if (board.output.kind !== "storyboard") throw Error();
  const shot = plan.shots[1], drawing = board.output.shots[1];
  shot.objects[0].label = "Replacement";
  drawing.startFrame.shapes[0].label = "Replacement"; drawing.endFrame.shapes[0].label = "Replacement";
  shot.sourceHash = hashMotionSource(drawing);
  assert.throws(() => validateMotion(plan, board, hashMotionSource), /Typographic match-cut/);
  delete shot.incoming.textMatch;
  validateMotion(plan, board, hashMotionSource);
  const invalid = structuredClone(plan); Object.assign(invalid.shots[1].incoming, { textMatch: "typographic-match-cut@2" });
  assert.throws(() => motionPlanSchema.parse(invalid));
});
