import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compareRhythm } from "../scripts/rhythm-compare.ts";
import { rhythmProfileSchema, rhythmReviewOptionsSchema } from "../workflow/rhythm-profile.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";

test("skill profile keeps empirical statistics unknown and compares real shot lengths", () => {
  const profile = JSON.parse(readFileSync("docs/motion-principles-profile.json", "utf8"));
  const { plan } = motionBeatFixture(), before = JSON.stringify(plan);
  const report = compareRhythm(profile, { plan });
  assert.equal(JSON.stringify(plan), before);
  assert.ok(Object.values(report.measuredReference).every((value) => value === null));
  assert.equal(report.shotLengthsSeconds.length, plan.shots.length);
  assert.equal(report.reviewTargets.maxInactiveFrames, 45);
  assert.equal(report.reviewTargets.maxPrimaryPresetShare, .4);
  assert.throws(() => rhythmProfileSchema.parse({ ...profile, measuredReference: { ...profile.measuredReference, cameraMovesPerMinute: 12 } }));
  for (const options of [{ maxInactiveFrames: 0 }, { maxInactiveFrames: 1.5 }, { maxPrimaryPresetShare: 2 }, { minimumPrimaryBeats: 1 }]) assert.throws(() => rhythmReviewOptionsSchema.parse(options));
});
