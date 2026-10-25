import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, join, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { comparisonSources, comparisonReferenceSchema, comparisonData, comparisonSourceSchema, formatComparisonValue } from "../workflow/comparison.ts";

test("comparison sources have exact hashes and reject invented values or source substitutions", () => {
  for (const entry of comparisonSources) {
    assert.equal(createHash("sha256").update(JSON.stringify(entry.source)).digest("hex"), entry.contentHash);
    const reference = { sourceId: entry.source.id, contentHash: entry.contentHash, recordIds: entry.source.records.slice(0, 2).map((record) => record.id) };
    assert.equal(comparisonData(comparisonReferenceSchema.parse(reference)).records.length, 2);
    for (const changes of [{ contentHash: "0".repeat(64) }, { recordIds: ["fabricated", "candidate"] }, { values: [1, 2] }, { recordIds: [reference.recordIds[0], reference.recordIds[0]] }]) assert.throws(() => comparisonReferenceSchema.parse({ ...reference, ...changes }));
  }
});

test("common scales bound signed/zero values and money uses exact static minor-unit formatting", () => {
  const source = comparisonSources[0].source;
  assert.throws(() => comparisonSourceSchema.parse({ ...source, maximum: 1 }));
  const signed = comparisonSourceSchema.parse({ ...source, minimum: -100, records: [{ id: "a", label: "Loss", value: -100 }, { id: "b", label: "Zero", value: 0 }] });
  assert.equal(formatComparisonValue(signed.records[0].value, signed.unit), "-$1.00");
  assert.equal(formatComparisonValue(0, signed.unit), "$0.00");
  assert.equal(formatComparisonValue(123456789, signed.unit), "$1,234,567.89");
  assert.throws(() => comparisonSourceSchema.parse({ ...source, unit: { kind: "currency", currency: "USD", minorDigits: 3 } }));
});

test("source importer writes atomically and refuses duplicate versions without changing prior data", () => {
  const base = resolve(".data"); mkdirSync(base, { recursive: true });
  const root = mkdtempSync(join(base, "comparison-import-"));
  try {
    mkdirSync(join(root, "scripts")); mkdirSync(join(root, "workflow"));
    cpSync("scripts/import-comparison-source.mjs", join(root, "scripts/import-comparison-source.mjs"));
    cpSync("workflow/comparison.ts", join(root, "workflow/comparison.ts"));
    const registry = join(root, "workflow/comparison-sources.json"), input = join(root, "source.json");
    writeFileSync(registry, "[]\n"); writeFileSync(input, JSON.stringify(comparisonSources[0].source));
    const run = () => spawnSync(process.execPath, [join(root, "scripts/import-comparison-source.mjs"), input], { encoding: "utf8" });
    assert.equal(run().status, 0);
    const before = readFileSync(registry); assert.equal(JSON.parse(before.toString())[0].contentHash, comparisonSources[0].contentHash);
    assert.notEqual(run().status, 0); assert.ok(readFileSync(registry).equals(before));
    writeFileSync(input, "{}"); assert.notEqual(run().status, 0); assert.ok(readFileSync(registry).equals(before));
  } finally {
    assert.ok(root.startsWith(base + sep)); rmSync(root, { recursive: true, force: true });
  }
});
