import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { comparisonSourceSchema } from "../workflow/comparison.ts";

if (!process.argv[2]) throw new Error("Usage: node scripts/import-comparison-source.mjs <supplied-source.json>");
const source = comparisonSourceSchema.parse(JSON.parse(readFileSync(process.argv[2], "utf8")));
const path = new URL("../workflow/comparison-sources.json", import.meta.url), entries = JSON.parse(readFileSync(path, "utf8"));
if (entries.some((entry) => entry.source.id === source.id)) throw new Error("Source version exists; use a new version to preserve prior bindings.");
const contentHash = createHash("sha256").update(JSON.stringify(source)).digest("hex");
const temporary = new URL(`../workflow/.comparison-${randomUUID()}.json`, import.meta.url);
writeFileSync(temporary, JSON.stringify([...entries, { source, contentHash }], null, 2) + "\n", { flag: "wx" });
renameSync(temporary, path);
console.log(`Imported ${source.id} ${contentHash}; supplied provenance is not independent factual verification.`);
