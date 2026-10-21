import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia, renderStill } from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";

mkdirSync("output", { recursive: true });
const browserExecutable = process.env.BENCHMARK_CHROME;
if (!browserExecutable) throw new Error("Set BENCHMARK_CHROME to an installed Chrome executable");
const bundleStart = performance.now();
const serveUrl = await bundle({ entryPoint: resolve("src/register.tsx") });
const composition = await selectComposition({ serveUrl, id: "MixedShots", browserExecutable });
const stillsOnly = process.argv.includes("--stills-only");
const report = stillsOnly ? JSON.parse(readFileSync("output/render-metrics.json", "utf8")) : { engine: "remotion", bundleMs: performance.now() - bundleStart, concurrency: 1, runs: [], frames: [] };
for (const label of stillsOnly ? [] : ["cold", "warm-1", "warm-2", "warm-3"]) {
  let parentPeakRss = process.memoryUsage().rss;
  const sample = setInterval(() => { parentPeakRss = Math.max(parentPeakRss, process.memoryUsage().rss); }, 100);
  const started = performance.now();
  try {
    await renderMedia({ serveUrl, composition, browserExecutable, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: resolve(`output/${label}.mp4`), overwrite: false });
  } finally { clearInterval(sample); }
  report.runs.push({ label, elapsedMs: performance.now() - started, parentPeakRssBytes: parentPeakRss, memoryScope: "Node parent only; excludes browser/encoder children" });
  writeFileSync("output/render-metrics.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.runs.at(-1)));
}
report.frames = [];
for (const variant of [false, true]) {
  // Selected metadata carries resolved props; inputProps alone does not replace it.
  const stillComposition = await selectComposition({ serveUrl, id: "MixedShots", browserExecutable, inputProps: { variant } });
  for (const frame of [0, 59, 60, 89, 90, 179, 180, 269, 270, 359]) {
    const output = resolve(`output/${variant ? "variant" : "base"}-${frame}.png`);
    await renderStill({ serveUrl, composition: stillComposition, browserExecutable, frame, inputProps: { variant }, imageFormat: "png", output, overwrite: stillsOnly });
    report.frames.push({ frame, variant, path: output });
  }
}
writeFileSync("output/render-metrics.json", JSON.stringify(report, null, 2));
