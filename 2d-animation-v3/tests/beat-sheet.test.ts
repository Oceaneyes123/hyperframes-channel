import assert from "node:assert/strict";
import { test } from "node:test";
import { beatSheetSchema } from "../workflow/beat-sheet.ts";
import { scriptLinesSchema } from "../workflow/scriptwriting.ts";
import { shotSchema, scriptLines } from "../workflow/visuals.ts";
import { boardFixture } from "./fixtures/visuals.ts";

export const exampleBeat = { startFrame: 0, endFrame: 45, event: "transform" as const, motionVerb: "route message into review", soundCue: "click" as const, onScreenText: null };
const sheet = (numbers: number[]) => ({ timing: "estimated" as const, lines: numbers.map((lineNumber) => ({ lineNumber, beats: [{ ...exampleBeat }] })) });

test("beat sheets validate line references and keep narration separate", () => {
  const lines = [{ text: "Start here.", claimIds: [] }, { text: "Watch it change.", claimIds: [] }, { text: "Here is the result.", claimIds: [] }];
  const legacy = scriptLinesSchema.parse({ lines });
  const planned = scriptLinesSchema.parse({ lines, beatSheet: sheet([1, 2, 3]) });
  assert.equal(planned.lines.map((line) => line.text).join("\n"), legacy.lines.map((line) => line.text).join("\n"));
  assert.deepEqual(scriptLines(planned.lines.map((line) => line.text).join("\n")), [{ number: 1, text: lines[0].text }, { number: 2, text: lines[1].text }, { number: 3, text: lines[2].text }]);
  assert.throws(() => scriptLinesSchema.parse({ lines, beatSheet: sheet([1, 3]) }));
  const shot = boardFixture().shots[0];
  assert.ok(shotSchema.parse({ ...shot, beatSheet: sheet([1]) }).beatSheet);
  assert.throws(() => shotSchema.parse({ ...shot, beatSheet: sheet([2]) }));
  assert.equal(shotSchema.parse(shot).beatSheet, undefined);
});

test("beat sheets reject gaps, overlap, wrong duration, duplicates and executable cue names", () => {
  assert.ok(beatSheetSchema.parse(sheet([1])));
  for (const beat of [{ ...exampleBeat, startFrame: 1 }, { ...exampleBeat, endFrame: 29 }, { ...exampleBeat, endFrame: 61 }, { ...exampleBeat, soundCue: "run python" }]) assert.throws(() => beatSheetSchema.parse({ timing: "estimated", lines: [{ lineNumber: 1, beats: [beat] }] }));
  assert.throws(() => beatSheetSchema.parse(sheet([1, 1])));
  assert.throws(() => beatSheetSchema.parse({ timing: "estimated", lines: [{ lineNumber: 1, beats: [exampleBeat, { ...exampleBeat, startFrame: 44, endFrame: 89 }] }] }));
  assert.throws(() => beatSheetSchema.parse({ ...sheet([1]), timing: "measured" }));
});
