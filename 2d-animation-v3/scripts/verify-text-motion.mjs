import assert from "node:assert/strict";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderFrames, renderStill } from "@remotion/renderer";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { textMotionFixture } from "../tests/fixtures/text-motion.ts";
import { validateMotion, scheduleMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";

const props = textMotionFixture();
validateMotion(props.plan, props.board, hashMotionSource);
const engineHash = hashEngine(), duration = scheduleMotion(props.plan).durationFrames;
const output = resolve(`.data/text-motion-proof-${Date.now()}`);
mkdirSync(output, { recursive: true });
const entry = join(output, "register.tsx");
writeFileSync(entry, `import{Composition,registerRoot}from'remotion';import Motion from '../../engine/motion-composition.tsx';registerRoot(()=> <Composition id="TextProof" component={Motion} width={1080} height={1920} fps={30} durationInFrames={${duration}} defaultProps={${JSON.stringify(props)}}/>);`);
const serveUrl = await bundle({ entryPoint: entry, webpackOverride: (config) => ({ ...config, cache: false }) });
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const composition = await selectComposition({ serveUrl, id: "TextProof", browserExecutable });
await renderFrames({ serveUrl, composition, browserExecutable, outputDir: join(output, "frames"), imageFormat: "png", scale: .5, concurrency: 2 });
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const results = [];
for (const [index, shot] of props.plan.shots.entries()) {
  const frames = [0, 18, 36, 70].map((frame) => index * 90 + frame);
  for (const frame of frames.reverse()) {
    const path = join(output, `seek-${frame}.png`);
    await renderStill({ serveUrl, composition, browserExecutable, frame, scale: .5, imageFormat: "png", output: path });
    assert.equal(hash(path), hash(join(output, "frames", `element-${String(frame).padStart(3, "0")}.png`)), `Fresh seek ${frame} differs`);
    results.push({ presetId: shot.textMotions[0].presetId, frame, hash: hash(path) });
  }
  console.log(`${shot.textMotions[0].presetId}: sequential/fresh frame comparisons pass`);
}
const samples = props.plan.shots.map((_, index) => join(output, `seek-${index * 90 + 18}.png`));
execFileSync("ffmpeg", ["-v", "error", ...samples.flatMap((path) => ["-i", path]), "-filter_complex",
  `${samples.map((_, index) => `[${index}:v]crop=540:180:0:780/2[s${index}]`).join(";")};${samples.map((_, index) => `[s${index}]`).join("")}xstack=inputs=10:layout=0_0|540_0|1080_0|1620_0|2160_0|0_180|540_180|1080_180|1620_180|2160_180`,
  "-frames:v", "1", join(output, "contact-sheet.png")], { stdio: "pipe" });
assert.equal(hashEngine(), engineHash, "Engine changed during proof; rerun against final sources.");
writeFileSync(join(output, "verification.json"), JSON.stringify({ syntheticOnly: true, productionApproval: false, engineHash, sequentialFrames: duration, renderScale: .5, freshSeeks: results, presets: props.plan.shots.map((shot) => shot.textMotions[0].presetId) }, null, 2));
console.log(`PASS: ${duration} sequential frames, ${results.length} exact fresh seeks. ${output}`);
