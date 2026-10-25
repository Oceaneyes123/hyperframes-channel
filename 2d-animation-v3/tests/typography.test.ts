import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { headingFont, verifyHeadingFont, fitHeading } from "../workflow/typography.ts";
import { textMotionFixture } from "./fixtures/text-motion.ts";
import { resolveBeatTiming } from "../workflow/timing.ts";
import { motionPlanSchema, validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";

test("pinned font integrity rejects missing or substituted bytes", async () => {
  const bytes = Uint8Array.from(readFileSync(`public/${headingFont.path}`)).buffer;
  await verifyHeadingFont(bytes);
  await assert.rejects(verifyHeadingFont(new ArrayBuffer(0)), /font/);
  const changed = bytes.slice(0); new Uint8Array(changed)[20] ^= 1;
  await assert.rejects(verifyHeadingFont(changed), /font/);
});

test("authored heading fitting respects measured widths and two-line height", () => {
  const measure = (text: string, size: number) => Array.from(text).length * size * .6;
  const layout = fitHeading("Review first\nPublish later", 400, 160, 1, measure);
  assert.equal(layout.lines.length, 2);
  assert.ok(layout.lines.every((line) => line.width <= 400));
  assert.ok(layout.size * 2 * 1.4 <= 160);
  for (const text of ["", "one\n\nthree", "one\ntwo\nthree"]) assert.throws(() => fitHeading(text, 400, 160, 1, measure));
});

test("text anchors resolve measured spans, warn on fallback and reject conflicts after resolution", () => {
  const { plan, board } = textMotionFixture();
  plan.shots = plan.shots.slice(0, 1);
  const motion = plan.shots[0].textMotions![0]; motion.narrationAnchor = { kind: "word", lineNumber: 1, anchorId: "keyword" };
  const timing = { timing: [{ number: 1, startFrame: 1, endFrame: 90 }], anchors: [{ id: "keyword", kind: "word", lineNumber: 1, text: "clear", startFrame: 8, endFrame: 14, provenance: "manual" }] };
  const resolved = resolveBeatTiming(plan, timing as Parameters<typeof resolveBeatTiming>[1]);
  assert.equal(resolved.plan.shots[0].textMotions![0].startFrame, 8); assert.equal(resolved.warnings.length, 0);
  timing.anchors = [];
  assert.match(resolveBeatTiming(plan, timing as Parameters<typeof resolveBeatTiming>[1]).warnings[0], /using measured line/);
  timing.timing[0].startFrame = 30;
  assert.throws(() => motionPlanSchema.parse(resolveBeatTiming(plan, timing as Parameters<typeof resolveBeatTiming>[1]).plan), /reading-hold/);
  const wrong = textMotionFixture(); wrong.plan.shots[0].objects[0].typography = "inter-heading@1";
  assert.throws(() => validateMotion(wrong.plan, wrong.board, hashMotionSource), /Typography profile/);
  assert.ok(board);
});
