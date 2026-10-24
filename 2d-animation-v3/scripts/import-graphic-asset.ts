import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync, openSync, closeSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { parseVectorAsset } from "../workflow/vector-assets.ts";

const [mode, input] = process.argv.slice(2);
if (!["--check", "--install"].includes(mode) || !input) throw new Error("Usage: node scripts/import-graphic-asset.ts --check|--install artwork.json");
const bytes = readFileSync(input);
if (bytes.length > 200_000) throw new Error("Artwork exceeds the 200KB import limit.");
// JSON is the import format: executable SVG/XML, URL references and arbitrary attributes fail closed.
const asset = parseVectorAsset(JSON.parse(bytes.toString("utf8")));
const contentHash = createHash("sha256").update(JSON.stringify(asset)).digest("hex");
if (mode === "--install") {
  const path = resolve("workflow/graphic-pack.json"), lock = `${path}.lock`;
  const descriptor = openSync(lock, "wx");
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    const original = readFileSync(path, "utf8"), pack = JSON.parse(original) as { contentHash: string; asset: { id: string } }[];
    if (pack.some((entry) => entry.asset.id === asset.id) || asset.id === "complaint-workflow@1") throw new Error("Existing asset versions are immutable. Use a new version.");
    writeFileSync(temporary, JSON.stringify([...pack, { contentHash, asset }], null, 2) + "\n", { flag: "wx", flush: true });
    if (readFileSync(path, "utf8") !== original) throw new Error("Registry changed during import. Retry explicitly.");
    renameSync(temporary, path);
  } finally { if (existsSync(temporary)) unlinkSync(temporary); closeSync(descriptor); unlinkSync(lock); }
}
console.log(JSON.stringify({ id: asset.id, contentHash, mode, layers: asset.layers.map((layer) => layer.id), reviewRequired: true }));
