import assert from "node:assert/strict";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia, renderStill, renderFrames } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { performance } from "node:perf_hooks";

const browserExecutable = process.env.BENCHMARK_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
assert.ok(existsSync(browserExecutable), "Set BENCHMARK_CHROME to installed Chrome");
const run = process.argv.includes("--run") ? process.argv[process.argv.indexOf("--run") + 1] : "measured";
assert.match(run, /^[a-z][a-z0-9-]{0,40}$/, "Run name must stay within output/");
const output = resolve("output", run);
assert.ok(!existsSync(output), "Preserve prior results; use a new output directory explicitly before rerunning");
mkdirSync(output, { recursive: true });
const started = performance.now(); const serveUrl = await bundle({ entryPoint: resolve("src/register.tsx") });
const report = { schemaVersion: 1, bundleMs: performance.now() - started, runtime: process.version,
  browser: execFileSync("powershell", ["-NoProfile", "-Command", "(Get-Item -LiteralPath $env:GSAP_BENCHMARK_BROWSER).VersionInfo.ProductVersion"],
    { env: { ...process.env, GSAP_BENCHMARK_BROWSER: browserExecutable }, encoding: "utf8", windowsHide: true, timeout: 10000 }).trim(),
  scope: "Synthetic matched variants, one render worker; RSS measures Node parent only, excludes browser/encoder.", runs: [], stills: [] };
const save = () => writeFileSync(join(output, "report.json"), JSON.stringify(report, null, 2) + "\n");
for (const engine of ["native", "gsap"]) {
  const props = { engine, variant: false }; const composition = await selectComposition({ serveUrl, id: "MixedShots", browserExecutable, inputProps: props });
  const directory = join(output, engine); mkdirSync(directory);
  await renderFrames({ serveUrl, composition, browserExecutable, inputProps: props, outputDir: join(directory, "frames"), imageFormat: "png", concurrency: 1 });
  const frames = [0, 59, 60, 61, 74, 88, 89, 90, 91, 179, 180, 181, 209, 269, 270, 271, 359];
  for (const frame of [...frames].reverse().concat([0, 74, 180])) {
    const path = join(directory, `seek-${report.stills.length}.png`);
    await renderStill({ serveUrl, composition, browserExecutable, inputProps: props, frame, imageFormat: "png", output: path });
    const digest = createHash("sha256").update(readFileSync(path)).digest("hex");
    const expected = createHash("sha256").update(readFileSync(join(directory, "frames", `element-${String(frame).padStart(3, "0")}.png`))).digest("hex");
    assert.equal(digest, expected, `${engine} fresh still differs from sequential frame ${frame}`);
    report.stills.push({ engine, frame, sha256: digest }); save();
  }
  console.log(`${engine}: all sequential lossless frames and ${frames.length + 3} fresh nonsequential stills match`);
}
if (!process.argv.includes("--proof-only")) {
  for (const label of ["cold", "warm-1", "warm-2", "warm-3"]) for (const engine of ["native", "gsap"]) {
    const props = { engine, variant: false }; const composition = await selectComposition({ serveUrl, id: "MixedShots", browserExecutable, inputProps: props });
    let parentPeakRss = process.memoryUsage().rss; const timer = setInterval(() => { parentPeakRss = Math.max(parentPeakRss, process.memoryUsage().rss); }, 100);
    const path = join(output, `${engine}-${label}.mp4`); const start = performance.now();
    try { await renderMedia({ serveUrl, composition, browserExecutable, inputProps: props, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: path, overwrite: false }); }
    finally { clearInterval(timer); }
    const elapsedMs = performance.now() - start;
    const metadata = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-of", "json", path], { encoding: "utf8" }));
    assert.equal(metadata.streams.length, 1); const stream = metadata.streams[0];
    assert.equal(stream.width, 1080); assert.equal(stream.height, 1920); assert.equal(stream.r_frame_rate, "30/1"); assert.equal(Number(stream.nb_frames), 360); assert.equal(Number(stream.duration), 12);
    const decoded = execFileSync("ffmpeg", ["-v", "error", "-i", path, "-f", "framemd5", "-"], { encoding: "utf8", maxBuffer: 1_000_000 });
    const frameHash = createHash("sha256").update(decoded).digest("hex");
    const previous = report.runs.find((row) => row.engine === engine);
    if (previous) assert.equal(frameHash, previous.decodedFrameHash, `${engine} repeated decoded frames changed`);
    const row = { engine, label, elapsedMs, parentPeakRssBytes: parentPeakRss, decodedFrameHash: frameHash, frameCount: 360, silent: true };
    report.runs.push(row); save(); console.log(JSON.stringify(row));
  }
}
save(); console.log(`Evidence saved to ${output}`);
