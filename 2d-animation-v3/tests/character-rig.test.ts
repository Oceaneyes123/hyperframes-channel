import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { characterRig as rig, characterRigHash, rigReferenceSchema, characterPresets, characterPose, solveArm, type CharacterCue } from "../workflow/character-rig.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { validateMotion, expandMotionShot, motionBeatSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";

function world(hand: readonly number[], lean: number, lift: number) {
  const [x, y] = rig.torsoPivot, a = lean * Math.PI / 180;
  return [x + (hand[0] - x) * Math.cos(a) - (hand[1] - y) * Math.sin(a), y + (hand[0] - x) * Math.sin(a) + (hand[1] - y) * Math.cos(a) + lift];
}
const smooth = (p: number) => { const t = Math.min(1, Math.max(0, p)); return t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2; };

test("reviewed character identity binds the original artwork, joints and prop anchors", () => {
  assert.equal(createHash("sha256").update(JSON.stringify(rig)).digest("hex"), characterRigHash);
  assert.equal(rig.license, "CC0-1.0"); rigReferenceSchema.parse({ id: rig.id, contentHash: characterRigHash });
  for (const changes of [{ id: "unknown@1" }, { contentHash: "0".repeat(64) }, { joints: [] }]) assert.throws(() => rigReferenceSchema.parse({ id: rig.id, contentHash: characterRigHash, ...changes }));
});
test("all five actions keep finite attached limbs and return the exact neutral body", () => {
  const rest = characterPose([], 0, 0);
  for (const presetId of characterPresets) {
    const cue: CharacterCue = { presetId, startFrame: 0, endFrame: 120, direction: "left" };
    for (let frame = 0; frame <= 120; frame++) {
      const progress = presetId === "character-hand-off@1" ? smooth((frame - 48) / 42) : 0;
      const pose = characterPose([cue], frame, progress);
      assert.ok(Math.abs(pose.lean) <= 3 && Math.abs(pose.head) <= 7);
      for (const arm of [pose.left, pose.right]) {
        assert.ok(Math.abs(Math.hypot(arm.elbow[0] - arm.shoulder[0], arm.elbow[1] - arm.shoulder[1]) - rig.upperLength) < 1e-8);
        assert.ok(Math.abs(Math.hypot(arm.hand[0] - arm.elbow[0], arm.hand[1] - arm.elbow[1]) - rig.lowerLength) < 1e-8);
        assert.ok([arm.upper, arm.lower, ...arm.hand].every(Number.isFinite));
      }
      if (frame === 0 || frame === 120) for (const key of ["lean", "lift", "head", "gaze", "concern", "blink", "typing", "pointing", "notify"] as const) assert.ok(pose[key] === rest[key], `${presetId} ${key} did not settle`);
      if (presetId === "character-hand-off@1" && frame >= 30 && frame <= 96) {
        const hand = world(pose.right.hand, pose.lean, pose.lift);
        assert.ok(Math.hypot(hand[0] - pose.document[0] - rig.document.grip[0], hand[1] - pose.document[1] - rig.document.grip[1]) < 1e-8);
      }
      if (presetId === "character-type@1" && frame >= 30 && frame <= 90) for (const arm of [pose.left, pose.right]) {
        const hand = world(arm.hand, pose.lean, pose.lift); assert.ok(hand[0] >= 95 && hand[0] <= 252 && hand[1] >= 355 && hand[1] <= 373);
      }
    }
  }
  assert.throws(() => solveArm([0, 0], [1000, 0], "left")); assert.throws(() => characterPose([], 0, 2));
});
test("character choreography preserves endpoints and rejects unsafe props, timing and overlapping gestures", () => {
  const { plan, board } = kineticExample("character-rig"); if (board.output.kind !== "storyboard") throw Error();
  plan.shots[0].sourceHash = hashMotionSource(board.output.shots[0]); validateMotion(plan, board, hashMotionSource);
  assert.equal(new Set(plan.shots[0].beats!.filter((beat) => beat.presetId.startsWith("character-")).map((beat) => beat.presetId)).size, 5);
  assert.equal(expandMotionShot(plan.shots[0]).actions.filter((action) => action.to.handoffProgress === 1).length, 1);
  const changed = structuredClone(plan); changed.shots[0].beats![0].endFrame = 30; assert.throws(() => validateMotion(changed, board, hashMotionSource));
  const overlap = structuredClone(plan); overlap.shots[0].beats![2].startFrame = 30; overlap.shots[0].beats!.sort((a, b) => a.startFrame - b.startFrame); assert.throws(() => validateMotion(overlap, board, hashMotionSource));
  assert.throws(() => motionBeatSchema.parse({ ...plan.shots[0].beats![4], parameters: { prop: "unregistered" } }));
});
