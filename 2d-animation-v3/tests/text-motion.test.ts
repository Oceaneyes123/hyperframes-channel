import assert from "node:assert/strict";
import { test } from "node:test";
import { textMotionLibrary, textMotionSchema, textMotionProgress, textMotionSegments } from "../workflow/text-motion.ts";
import { motionPlanSchema, generatedBeatMotionSchema, scopedBeatMotionSchema, hydrateMotion, validateMotion, expandMotionShot } from "../workflow/motion.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { textMotionFixture } from "./fixtures/text-motion.ts";

test("all ten text treatments validate, compile, settle and appear in quality usage", () => {
  const { plan, board } = textMotionFixture();
  assert.equal(new Set(textMotionLibrary.map((preset) => preset.id)).size, 10);
  validateMotion(plan, board, hashMotionSource);
  assert.equal(compileMotion(plan, board).durationFrames, 900);
  const quality = inspectCreativeMotion(plan, board);
  for (const shot of plan.shots) {
    const motion = shot.textMotions![0];
    for (const frame of [100, -1, 15, 36, 6, 35, 36]) {
      const { progress, eased } = textMotionProgress(motion, frame, 3, 4);
      assert.ok(progress >= 0 && progress <= 1 && eased >= 0 && eased <= 1);
    }
    assert.deepEqual(textMotionProgress(motion, 5, 3, 4), { progress: 0, eased: 0 });
    assert.deepEqual(textMotionProgress(motion, 36, 3, 4), { progress: 1, eased: 1 });
    assert.equal(quality.presetUsage[motion.presetId], 1);
  }
});

test("text splitting preserves whitespace and complete emoji/combining graphemes", () => {
  const label = "A  cafe\u0301 👩‍💻";
  for (const preset of textMotionLibrary) assert.equal(textMotionSegments(label, preset.id).join(""), label);
  assert.deepEqual(textMotionSegments("e\u0301👩‍💻", "character-rise@1"), ["e\u0301", "👩‍💻"]);
  assert.deepEqual(textMotionSegments("one  two", "word-stagger@1"), ["one", "  ", "two"]);
});

test("full and scoped proposal schemas preserve text treatment without changing labels", () => {
  const { board, plan } = textMotionFixture();
  const generated = generatedBeatMotionSchema.parse({ shots: plan.shots.map(({ camera, durationFrames, incoming, beats, textMotions, objects }) => ({ camera, durationFrames, incoming, beats, textMotions,
    objects: objects.map(({ id, startIndex, endIndex }) => ({ id, startIndex, endIndex })) })) });
  const hydrated = hydrateMotion(generated, board, hashMotionSource, undefined, "3");
  validateMotion(hydrated, board, hashMotionSource);
  assert.deepEqual(hydrated.shots[0].textMotions, plan.shots[0].textMotions);
  const { camera, durationFrames, incoming, beats, textMotions } = plan.shots[0];
  assert.deepEqual(scopedBeatMotionSchema.parse({ camera, durationFrames, incoming, beats, textMotions }).textMotions, textMotions);
});

test("unknown presets, executable extras and invalid intervals fail closed", () => {
  const motion = textMotionFixture().plan.shots[0].textMotions![0];
  for (const changes of [{ presetId: "unknown@1" }, { endFrame: 10 }, { startFrame: -1 }, { startFrame: .5 }, { html: "<script/>" }]) {
    assert.throws(() => textMotionSchema.parse({ ...motion, ...changes }));
  }
});

test("nontext, duplicate, missing, hold-overlapping and too-late targets fail", () => {
  for (const kind of ["nontext", "duplicate", "missing", "hold", "late", "continuous"]) {
    const { plan } = textMotionFixture(), shot = plan.shots[0], motion = shot.textMotions![0];
    if (kind === "nontext") shot.objects[0].type = "rect";
    if (kind === "duplicate") shot.textMotions!.push({ ...motion });
    if (kind === "missing") motion.targetId = "missing";
    if (kind === "hold") motion.endFrame = 45;
    if (kind === "late") { shot.beats = []; motion.endFrame = 80; }
    if (kind === "continuous") shot.incoming = { type: "continuous", presentation: "shared", overlapFrames: 0, anchor: { previousObjectId: "object-1", objectId: "object-1" } };
    assert.throws(() => motionPlanSchema.parse(plan), kind);
  }
});

test("treatments reject invisible actors and competing root motion", () => {
  const { plan } = textMotionFixture();
  const shot = expandMotionShot(plan.shots[0]); shot.beats = undefined;
  shot.objects[0].initial.opacity = 0;
  assert.throws(() => expandMotionShot(shot), /visible/);
  shot.actions.unshift({ behavior: "fade", targetIds: ["object-1"], startFrame: 0, endFrame: 6, staggerFrames: 0, ease: "linear", to: { opacity: 1 } });
  assert.doesNotThrow(() => expandMotionShot(shot));
  shot.actions[0].endFrame = 7;
  assert.throws(() => expandMotionShot(shot), /overlap root/);
});
