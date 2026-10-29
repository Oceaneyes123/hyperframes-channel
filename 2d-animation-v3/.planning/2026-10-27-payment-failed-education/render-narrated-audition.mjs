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

const audioPath = resolve("output/playwright/payment-failed-narration-review/qwen-ryan-composite-trimmed.wav");
const audio = readFileSync(audioPath);
const audioUrl = `data:audio/wav;base64,${audio.toString("base64")}`;
const output = resolve("output/playwright/payment-failed-narrated-review");
mkdirSync(output, { recursive: true });
const entry = join(output, "register.tsx");
const motionImport = JSON.stringify(resolve("engine/motion-composition.tsx").replaceAll("\\", "/"));
writeFileSync(entry, `import {Composition,registerRoot} from 'remotion';import Motion from ${motionImport};
registerRoot(()=> <Composition id="PaymentReview" component={Motion} width={1080} height={1920} fps={30} durationInFrames={${durationFrames}} defaultProps={${JSON.stringify({ plan: artifact.plan, board, narrationUrl: audioUrl })}}/>);`);

const serveUrl = await bundle({ entryPoint: entry });
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const composition = await selectComposition({ serveUrl, id: "PaymentReview", browserExecutable });
for (const frame of [0, 90, 173, 350, 662, 900, 1054, 1300, 1608, 1900, 2281]) {
  await renderStill({ serveUrl, composition, frame, browserExecutable, imageFormat: "png", output: join(output, `frame-${String(frame).padStart(4, "0")}.png`) });
}
const preview = join(output, "narrated-audition-review.mp4");
await renderMedia({ serveUrl, composition, browserExecutable, codec: "h264", crf: 20, pixelFormat: "yuv420p", scale: .5, concurrency: 2, outputLocation: preview });
rmSync(entry, { force: true });
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
writeFileSync(join(output, "receipt.json"), JSON.stringify({
  projectId, storyboardId: board.id, motionId, durationFrames, fps: 30,
  audio: audioPath, audioSha256: hash(audioPath), preview: "narrated-audition-review.mp4",
  previewSha256: hash(preview), humanMotionReview: false, humanVoiceReview: false,
  productionApproval: false,
  note: "Review export only. Narration is an assembled local Qwen audition, not an approved provider-complete take.",
}, null, 2) + "\n");
console.log(`MOTION_ID=${motionId}`);
console.log(`DURATION_FRAMES=${durationFrames}`);
console.log(`PREVIEW=${preview}`);
