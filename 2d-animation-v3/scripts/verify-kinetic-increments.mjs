import assert from "node:assert/strict";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderFrames, renderStill } from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import { kineticExample, kineticExamples } from "../workflow/examples/kinetic.ts";
import { validateMotion, scheduleMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";

const selected = process.argv[2];
const cases = selected ? kineticExamples.filter((entry) => entry.id === selected) : kineticExamples;
assert.ok(cases.length, "Unknown example");
const output = resolve(`.data/kinetic-increments-${Date.now()}`); mkdirSync(output, { recursive: true });
const sourceHash = hashEngine(), results = [];
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
for (const item of cases) {
  const props = kineticExample(item.id);
  for (const shot of props.plan.shots) shot.sourceHash = hashMotionSource(props.board.output.shots[shot.sourceIndex]);
  validateMotion(props.plan, props.board, hashMotionSource);
  const durationFrames = scheduleMotion(props.plan).durationFrames;
  const entry = join(output, `${item.id}.tsx`), folder = join(output, item.id); mkdirSync(folder);
  writeFileSync(entry, `import{Composition,registerRoot}from'remotion';import Motion from '../../engine/motion-composition.tsx';registerRoot(()=> <Composition id="Proof" component={Motion} width={1080} height={1920} fps={30} durationInFrames={${durationFrames}} defaultProps={${JSON.stringify(props)}}/>);`);
  const serveUrl = await bundle({ entryPoint: entry, publicDir: resolve("public"), webpackOverride: (config) => ({ ...config, cache: false }) });
  const composition = await selectComposition({ serveUrl, id: "Proof", browserExecutable });
  await renderFrames({ serveUrl, composition, browserExecutable, outputDir: join(folder, "frames"), imageFormat: "png", concurrency: 2 });
  const seeks = [durationFrames - 1, 0, 6, 18, 36, 60, 90, 18];
  for (const [index, frame] of seeks.entries()) {
    const path = join(folder, `seek-${index}.png`);
    await renderStill({ serveUrl, composition, browserExecutable, frame, imageFormat: "png", output: path });
    assert.ok(readFileSync(path).equals(readFileSync(join(folder, "frames", `element-${String(frame).padStart(3, "0")}.png`))), `${item.id} seek ${frame}`);
  }
  results.push({ id: item.id, frames: durationFrames, freshSeeks: seeks.length, inputHash: createHash("sha256").update(JSON.stringify(props)).digest("hex") });
  console.log(`${item.id}: PASS ${durationFrames} full-resolution frames and eight exact fresh seeks`);
}
assert.equal(hashEngine(), sourceHash, "Engine changed during proof");
writeFileSync(join(output, "verification.json"), JSON.stringify({ syntheticOnly: true, productionApproval: false, engineHash: sourceHash, results }, null, 2));
console.log(output);
