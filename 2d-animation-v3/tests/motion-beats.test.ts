import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, cpSync, appendFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { motionPlanSchema, expandMotionShot, validateMotion, scheduleMotion } from "../workflow/motion.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { hashEngine } from "../server/production-store.ts";

test("preset source participates in the exact production engine binding", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-beat-engine-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ["engine", "workflow", "server", "app", "next.config.ts", "package-lock.json"]) cpSync(path, join(root, path), { recursive: true });
  assert.equal(hashEngine(root), hashEngine());
  const before = hashEngine(root);
  appendFileSync(join(root, "engine/motion-presets/index.ts"), "\n// Synthetic isolated change.\n");
  assert.notEqual(hashEngine(root), before);
});

test("legacy interpreter plans retain exact compiled output", () => {
  for (const version of ["1", "2"]) {
    const fixture = JSON.parse(readFileSync(new URL(`./fixtures/legacy-motion-${version}.json`, import.meta.url), "utf8"));
    assert.deepEqual(validateMotion(fixture.plan, fixture.board, hashMotionSource), fixture.plan);
    assert.deepEqual(compileMotion(fixture.plan, fixture.board), fixture.compiled);
  }
});

test("versioned beats expand deterministically into anticipation, impact, settling and hold", () => {
  const { plan, board } = motionBeatFixture(); const before = structuredClone(plan);
  assert.deepEqual(validateMotion(plan, board, hashMotionSource), plan);
  const shot = expandMotionShot(plan.shots[0]);
  assert.deepEqual(shot, expandMotionShot(plan.shots[0]));
  assert.deepEqual(shot.actions.map((action) => action.to.scale), [.9, 1.12, 1, undefined]);
  assert.equal(shot.actions.at(-1)?.behavior, "hold");
  assert.equal(compileMotion(plan, board).durationFrames, scheduleMotion(plan).durationFrames);
  assert.deepEqual(plan, before, "Expansion must not rewrite immutable source beats");
});

test("beat validation rejects unsafe versions, targets, intervals, holds and final states", () => {
  const fixture = motionBeatFixture();
  const invalid = [
    (p: typeof fixture.plan) => { p.interpreterVersion = "2"; },
    (p: typeof fixture.plan) => { p.shots[0].actions = expandMotionShot(p.shots[0]).actions; },
    (p: typeof fixture.plan) => { p.shots[0].beats![0].targetIds = ["missing"]; },
    (p: typeof fixture.plan) => { p.shots[0].beats![0].targetIds = ["object-1", "object-1"]; },
    (p: typeof fixture.plan) => { p.shots[0].beats![0].endFrame = 12; },
    (p: typeof fixture.plan) => { p.shots[0].beats![1].startFrame = 30; },
    (p: typeof fixture.plan) => { p.shots[0].beats![0].narrationAnchor!.lineNumber = 99; },
    (p: typeof fixture.plan) => { p.shots[0].beats![0].continuity = { targetId: "object-1", nextShotId: "missing" }; },
    (p: typeof fixture.plan) => { const beat = p.shots[0].beats![0]; if (beat.presetId === "snap-overshoot@1") beat.parameters.to.width = 35; },
    (p: typeof fixture.plan) => { const beat = p.shots[0].beats![0]; if (beat.presetId === "snap-overshoot@1") beat.parameters.overshoot = Infinity; },
  ];
  for (const mutate of invalid) {
    const plan = structuredClone(fixture.plan); mutate(plan);
    assert.throws(() => validateMotion(plan, fixture.board, hashMotionSource));
  }
  const unknown = structuredClone(fixture.plan);
  Object.assign(unknown.shots[0].beats![0], { presetId: "snap-overshoot@2" });
  assert.throws(() => motionPlanSchema.parse(unknown));
});
