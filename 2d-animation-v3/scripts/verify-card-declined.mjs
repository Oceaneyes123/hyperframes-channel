import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderFrames, renderStill, renderMedia, selectComposition } from "@remotion/renderer";
import { financeFixture, styleDirections } from "../tests/fixtures/finance.ts";
import { validateMotion } from "../workflow/motion.ts";
import { scheduleMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";

const output = resolve(process.argv[2] ?? `.data/card-declined-review-${Date.now()}`);
mkdirSync(output, { recursive: false });
const sha = (data) => createHash("sha256").update(data).digest("hex");
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const engineHash = hashEngine();
const fixture = financeFixture();
validateMotion(fixture.plan, fixture.board, hashMotionSource);
const duration = scheduleMotion(fixture.plan).durationFrames;
assert.equal(duration, 240, "The synthetic proof must be exactly eight seconds at 30 fps.");

const entry = join(output, "register.tsx");
const motionImport = JSON.stringify(resolve("engine/motion-composition.tsx").replaceAll("\\", "/"));
const planningImport = JSON.stringify(resolve("app/projects/[id]/visuals/frame.tsx").replaceAll("\\", "/"));
const styles = styleDirections.map((direction) => direction.frame);
writeFileSync(entry, `import {Composition,registerRoot} from 'remotion';import Motion from ${motionImport};import PlanningFrame from ${planningImport};
const Planning=({frame})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Synthetic styleframe review"/></div>;
registerRoot(()=> <><Composition id="Proof" component={Motion} width={1080} height={1920} fps={30} durationInFrames={240} defaultProps={${JSON.stringify(fixture)}}/>
${styles.map((frame, index) => `<Composition id="Style${index + 1}" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{frame:${JSON.stringify(frame)}}}/>`).join("\n")}</>);`);

const serveUrl = await bundle({ entryPoint: entry });
for (let index = 0; index < styles.length; index++) {
  const name = `style-${index + 1}`;
  const composition = await selectComposition({ serveUrl, id: `Style${index + 1}`, browserExecutable });
  await renderStill({ serveUrl, composition, frame: 0, browserExecutable, imageFormat: "png", output: join(output, `${name}.png`) });
}

const composition = await selectComposition({ serveUrl, id: "Proof", browserExecutable });
await renderFrames({ serveUrl, composition, browserExecutable, outputDir: join(output, "frames"), imageFormat: "png", concurrency: 1 });
const samples = [0, 20, 88, 119, 120, 180, 239];
const freshSeeks = [];
for (const frame of samples) {
  const path = join(output, `seek-${frame}.png`);
  await renderStill({ serveUrl, composition, browserExecutable, frame, imageFormat: "png", output: path });
  const hash = sha(readFileSync(path));
  assert.equal(hash, sha(readFileSync(join(output, "frames", `element-${String(frame).padStart(3, "0")}.png`))), `Fresh seek differs at frame ${frame}.`);
  freshSeeks.push({ frame, sha256: hash });
}

const video = join(output, "card-declined-synthetic-proof.mp4");
await renderMedia({ serveUrl, composition, browserExecutable, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: video });
assert.equal(hashEngine(), engineHash, "Engine changed during review render.");
writeFileSync(join(output, "verification.json"), JSON.stringify({ version: 1, project: "card-declined", syntheticOnly: true,
  productionApproval: false, silent: true, width: 1080, height: 1920, fps: 30, durationInFrames: duration,
  styleframes: styles.map((frame, index) => ({ name: styleDirections[index].title, file: `style-${index + 1}.png`, sha256: sha(readFileSync(join(output, `style-${index + 1}.png`))) })),
  freshSeeks, engineHash, proof: "card-declined-synthetic-proof.mp4" }, null, 2) + "\n");
console.log(`Card Declined synthetic review outputs saved to ${output}`);
