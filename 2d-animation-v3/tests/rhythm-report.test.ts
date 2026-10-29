import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { rhythmReport } from "../scripts/rhythm-report.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";

test("rhythm report expands beats without counting holds or mutating input", () => {
  const { plan, board } = motionBeatFixture();
  const before = JSON.stringify(plan), report = rhythmReport({ plan }, board);
  assert.equal(JSON.stringify(plan), before);
  assert.equal(report.durationFrames, plan.shots.reduce((sum, shot) => sum + shot.durationFrames - shot.incoming.overlapFrames, 0));
  assert.equal(report.summary.presetHistogram["hold@1"], undefined);
  assert.ok(report.summary.presetHistogram["snap-overshoot@1"] > 0);
  assert.ok(report.events.some((event) => event.kind === "transformation"));
  assert.equal(report.backgroundMeasured, true);
  assert.equal(report.windows.reduce((sum, window) => sum + window.changeEvents, 0), report.events.length);
});

test("windows are half-open, include partial tails, and count staggered targets once", () => {
  const { plan } = motionBeatFixture();
  const shot = plan.shots[0]; plan.shots = [shot];
  plan.interpreterVersion = "2"; delete shot.beats; shot.durationFrames = 125;
  const object = shot.objects[0];
  object.initial.opacity = 0;
  shot.objects = [object, { ...structuredClone(object), id: "second" }];
  shot.actions = [
    { behavior: "fade", targetIds: [object.id, "second"], startFrame: 60, endFrame: 66, staggerFrames: 3, ease: "linear", to: { opacity: 1 } },
    { behavior: "hold", targetIds: [object.id], startFrame: 70, endFrame: 80, staggerFrames: 0, ease: "linear", to: {} },
    { behavior: "transform", targetIds: [object.id], startFrame: 80, endFrame: 90, staggerFrames: 0, ease: "linear", to: { opacity: 1 } },
  ];
  const report = rhythmReport(plan);
  assert.deepEqual(report.windows.map((window) => window.changeEvents), [0, 2, 0]);
  assert.equal(report.windows[2].endSeconds, 125 / 30);
  assert.deepEqual(report.events.map((event) => event.startFrame), [60, 63]);
  assert.equal(report.backgroundMeasured, false);
});

test("touching transform phases merge while separate actions remain distinct", () => {
  const { plan } = motionBeatFixture(); const shot = plan.shots[0]; plan.shots = [shot]; plan.interpreterVersion = "2"; delete shot.beats;
  const object = shot.objects[0]; shot.objects = [object];
  shot.actions = [
    { behavior: "transform", targetIds: [object.id], startFrame: 10, endFrame: 20, staggerFrames: 0, ease: "linear", to: { scale: 1.1 } },
    { behavior: "transform", targetIds: [object.id], startFrame: 20, endFrame: 30, staggerFrames: 0, ease: "linear", to: { scale: 1 } },
    { behavior: "transform", targetIds: [object.id], startFrame: 50, endFrame: 60, staggerFrames: 0, ease: "linear", to: { scale: 1.2 } },
  ];
  const transforms = rhythmReport(plan).events.filter((event) => event.kind === "transformation");
  assert.deepEqual(transforms.map((event) => [event.startFrame, event.endFrame]), [[10, 30], [50, 60]]);
});

test("text and illustration exposure uses visible roots and reports reuse across shots", () => {
  const { plan } = motionBeatFixture();
  for (const shot of plan.shots) {
    plan.interpreterVersion = "2"; delete shot.beats; shot.actions = [];
    const object = shot.objects[0];
    shot.objects = [{ ...object, id: "words", type: "heading", label: "Two words", initial: { ...object.initial, opacity: 1 } },
      { ...object, id: "hidden", type: "caption", label: "Hidden words", initial: { ...object.initial, opacity: 0 } },
      { ...object, id: "picture", type: "document", label: "", initial: { ...object.initial, opacity: 1 } }];
  }
  const report = rhythmReport(plan);
  assert.equal(report.windows[0].textElements, 1);
  assert.equal(report.windows[0].textWords, 2);
  assert.equal(report.windows[0].peakConcurrentTextElements, 1);
  assert.equal(report.summary.illustrationShots.document.length, plan.shots.length);
});

test("overlapping shots use renderer scheduling and combine concurrent text", () => {
  const { plan } = motionBeatFixture(); plan.shots = plan.shots.slice(0, 2);
  for (const shot of plan.shots) {
    plan.interpreterVersion = "2"; delete shot.beats; shot.actions = []; shot.durationFrames = 90;
    const object = shot.objects[0]; shot.objects = [{ ...object, type: "heading", label: "One", initial: { ...object.initial, opacity: 1 } }];
  }
  plan.shots[1].incoming = { type: "reveal", presentation: "wipe", overlapFrames: 30, anchor: null };
  const report = rhythmReport(plan);
  assert.equal(report.durationFrames, 150);
  assert.equal(report.windows[1].peakConcurrentTextElements, 2);
});

test("invalid inputs and MP4-only invocation fail without producing a report", () => {
  assert.throws(() => rhythmReport({ shots: [] }));
  const { plan, board } = motionBeatFixture();
  if (board.output.kind === "storyboard") board.output.shots[0].startFrame.background = "#010203";
  assert.throws(() => rhythmReport(plan, board), /hash does not match/);
  const result = spawnSync(process.execPath, ["scripts/rhythm-report.ts", "movie.mp4"], { encoding: "utf8" });
  assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.match(result.stderr, /requires its motion plan/);
});

