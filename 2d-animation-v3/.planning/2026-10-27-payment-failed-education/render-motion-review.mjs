import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { scheduleMotion } from "../../workflow/motion.ts";
import { readConfig } from "../../server/config.ts";
import { openMotion } from "../../server/motion-store.ts";
import { openVisuals } from "../../server/visual-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const motion = openMotion(config.dataDirectory, config.videosDirectory);
const visuals = openVisuals(config.dataDirectory, config.videosDirectory);
const motionId = motion.latest(projectId);
const artifact = motionId ? motion.read(projectId, motionId) : null;
const board = artifact ? visuals.read(projectId, artifact.source.storyboardId) : null;
if (!artifact || !board || board.output.kind !== "storyboard") throw new Error("Current motion unavailable.");
const durationFrames = scheduleMotion(artifact.plan).durationFrames;
motion.close();
visuals.close();

const output = resolve("output/playwright/payment-failed-motion-review");
mkdirSync(output, { recursive: true });
const entry = join(output, "register.tsx");
const motionImport = JSON.stringify(resolve("engine/motion-composition.tsx").replaceAll("\\", "/"));
writeFileSync(entry, `import {Composition,registerRoot} from 'remotion';import Motion from ${motionImport};
registerRoot(()=> <Composition id="PaymentMotion" component={Motion} width={1080} height={1920} fps={30} durationInFrames={${durationFrames}} defaultProps={${JSON.stringify({ plan: artifact.plan, board })}}/>);`);

const serveUrl = await bundle({ entryPoint: entry });
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const composition = await selectComposition({ serveUrl, id: "PaymentMotion", browserExecutable });
const samples = [0, 30, 60, 100, 119, 130, 250, 330, 450, 500, 600, 720, 870, 990, 1150, 1300, 1420, 1600, 1772];
for (const frame of samples) {
  await renderStill({ serveUrl, composition, frame, browserExecutable, imageFormat: "png", output: join(output, `frame-${String(frame).padStart(4, "0")}.png`) });
}
const preview = join(output, "silent-review.mp4");
await renderMedia({ serveUrl, composition, browserExecutable, codec: "h264", crf: 20, pixelFormat: "yuv420p", scale: .5, concurrency: 2, outputLocation: preview });
rmSync(entry, { force: true });
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
writeFileSync(join(output, "receipt.json"), JSON.stringify({
  projectId, storyboardId: board.id, motionId, durationFrames, fps: 30, silent: true,
  preview: "silent-review.mp4", previewSha256: hash(preview), samples,
  humanMotionReview: false, productionApproval: false,
}, null, 2) + "\n");
console.log(`MOTION_ID=${motionId}`);
console.log(`DURATION_FRAMES=${durationFrames}`);
console.log(`PREVIEW=${preview}`);
