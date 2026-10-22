import assert from "node:assert/strict";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
const output = resolve("output", "variants"); assert.ok(!existsSync(output), "Preserve prior variant evidence"); mkdirSync(output, { recursive: true });
const browserExecutable = process.env.BENCHMARK_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveUrl = await bundle({ entryPoint: resolve("src/register.tsx") }); const results = [];
for (const frame of [74, 209, 359]) {
  const hashes = [];
  for (const variant of [false, true]) {
    const inputProps = { engine: "gsap", variant }; const composition = await selectComposition({ serveUrl, id: "MixedShots", inputProps, browserExecutable });
    const path = join(output, `${frame}-${variant}.png`);
    await renderStill({ serveUrl, composition, inputProps, frame, browserExecutable, imageFormat: "png", output: path });
    hashes.push(createHash("sha256").update(readFileSync(path)).digest("hex"));
  }
  assert.equal(hashes[0] === hashes[1], frame !== 209, `Variant scope failed at ${frame}`);
  results.push({ frame, outsideSelectedShot: frame !== 209, hashes });
}
writeFileSync(join(output, "verification.json"), JSON.stringify(results, null, 2) + "\n"); console.log("Selected-shot variant changes frame 209 only; outside frames match exactly.");
