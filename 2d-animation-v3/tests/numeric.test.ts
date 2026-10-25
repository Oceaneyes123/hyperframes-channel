import assert from "node:assert/strict";
import { test } from "node:test";
import { numericReferenceSchema, numericData, numericColumns } from "../workflow/numeric.ts";
import { comparisonSources, comparisonSourceSchema, formatComparisonValue } from "../workflow/comparison.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { validateMotion, expandMotionShot } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { createHash } from "node:crypto";
import atlas from "../workflow/numeric-glyphs.json" with { type: "json" };
import { headingFont } from "../workflow/typography.ts";

test("numeric outlines preserve the licensed pinned source and cover every supported formatted character", () => {
  assert.equal(atlas.sourceSha256, headingFont.sha256); assert.equal(atlas.license, "OFL-1.1");
  assert.equal(createHash("sha256").update(JSON.stringify(atlas)).digest("hex"), "53dedd641137dc61e88dd7f570af25fca497c79415196d572d91109b26a4cc26");
  for (const unit of [{ kind: "count", label: "Count" }, { kind: "percent", representation: "basis-points" }, ...["USD", "PHP", "EUR", "GBP"].map((currency) => ({ kind: "currency", currency, minorDigits: 2 }))] as Parameters<typeof formatComparisonValue>[1][]) {
    for (const value of [-1_000_000_000, -123, 0, 3250, 9999, 10000, 1_000_000_000]) for (const character of formatComparisonValue(value, unit)) assert.ok(character === " " || Object.hasOwn(atlas.glyphs, character), `Missing ${character}`);
  }
});

test("numeric records and transitions require exact hashes, known endpoints and a supplied relationship", () => {
  const entry = comparisonSources.find((entry) => entry.source.id === "synthetic-volume@1")!;
  const reference = { sourceId: entry.source.id, contentHash: entry.contentHash, recordId: "current", previousRecordId: "previous", relationshipId: "next-sample" };
  assert.equal(numericData(reference).initial, "9,999"); assert.equal(numericData(reference).final, "10,000");
  for (const change of [{ contentHash: "0".repeat(64) }, { recordId: "fabricated" }, { relationshipId: "invented" }, { previousRecordId: "zero" }, { value: 42 }]) assert.throws(() => numericReferenceSchema.parse({ ...reference, ...change }));
  assert.throws(() => comparisonSourceSchema.parse({ ...entry.source, relationships: [{ id: "bad", from: "current", to: "unknown", meaning: "invalid" }] }));
});

test("fixed cells retain exact endpoints for carry, borrow, zero, signs, currencies and percent precision", () => {
  for (const [initial, final] of [["9,999", "10,000"], ["10,000", "9,999"], ["-19", "0"], ["", "-$1,234,567.89"], ["", "£0.00"], ["", "32.50%"]]) {
    const columns = numericColumns(initial, final);
    assert.equal(columns.map((column) => column.first).join("").trim(), initial);
    assert.equal(columns.map((column) => column.last).join("").trim(), final);
    for (const column of columns) if (column.digits) { assert.equal(column.digits.at(-1), column.last); assert.equal(column.digits.length, column.distance + 1); }
  }
  assert.equal(formatComparisonValue(3250, { kind: "percent", representation: "basis-points" }), "32.50%");
  for (const currency of ["USD", "PHP", "EUR", "GBP"] as const) assert.match(formatComparisonValue(-123, { kind: "currency", currency, minorDigits: 2 }), /1\.23/);
});

test("numeric beat correspondence, duration, visibility, geometry and reading hold fail closed", () => {
  for (const id of ["rolling-value", "value-transition", "percent"] as const) {
    const { plan, board } = kineticExample(id); if (board.output.kind !== "storyboard") throw Error("Expected storyboard");
    plan.shots[0].sourceHash = hashMotionSource(board.output.shots[0]); validateMotion(plan, board, hashMotionSource);
    assert.equal(expandMotionShot(plan.shots[0]).actions[0].to.numericProgress, 1);
    for (const mutate of [
      (p: typeof plan) => { p.shots[0].beats![0].endFrame = 20; },
      (p: typeof plan) => { p.shots[0].beats![0].endFrame = 115; },
      (p: typeof plan) => { p.shots[0].objects[0].initialParts!.digits.opacity = 0; },
      (p: typeof plan) => { p.shots[0].objects[0].numeric!.recordId = "zero"; },
      (p: typeof plan) => { p.shots[0].beats![0].targetIds = ["object-1"]; },
      (p: typeof plan) => { p.shots[0].beats![1].startFrame = 60; },
    ]) { const changed = structuredClone(plan); mutate(changed); assert.throws(() => validateMotion(changed, board, hashMotionSource)); }
  }
});

test("continuous handoffs cannot silently replace the authoritative numeric source", () => {
  const first = kineticExample("rolling-value"), next = kineticExample("percent");
  if (first.board.output.kind !== "storyboard" || next.board.output.kind !== "storyboard") throw Error("Expected storyboard");
  const drawing = next.board.output.shots[0], shot = next.plan.shots[0];
  drawing.startFrame.shapes[0].parts!.digits.numericProgress = 1;
  shot.objects[0].initialParts!.digits.numericProgress = 1;
  shot.beats = [shot.beats![1]];
  shot.id = "shot-2"; shot.sourceIndex = 1;
  drawing.transition = "continuous";
  shot.incoming = { type: "continuous", presentation: "shared", overlapFrames: 0, anchor: { objectId: "object-1", previousObjectId: "object-1" } };
  first.board.output.shots.push(drawing); first.plan.shots.push(shot);
  for (const [index, item] of first.plan.shots.entries()) item.sourceHash = hashMotionSource(first.board.output.shots[index]);
  assert.throws(() => validateMotion(first.plan, first.board, hashMotionSource), /Continuous anchor appearance/);
});
