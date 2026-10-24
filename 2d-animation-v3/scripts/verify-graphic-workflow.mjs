import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderFrames, renderStill, renderMedia, selectComposition } from "@remotion/renderer";
import { graphicWorkflowFixture } from "../tests/fixtures/graphic-workflow.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";
import { graphicAssetRegistry } from "../workflow/graphic-assets.ts";

const output = resolve(process.argv[2] ?? `.data/graphic-workflow-proof-${Date.now()}`);
mkdirSync(output, { recursive: false });
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const engineHash = hashEngine();
const props = graphicWorkflowFixture(); validateMotion(props.plan, props.board, hashMotionSource);
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const entry = join(output, "register.tsx");
const engineImport = JSON.stringify(resolve("engine/motion-composition.tsx").replaceAll("\\", "/"));
const planningImport = JSON.stringify(resolve("app/projects/[id]/visuals/frame.tsx").replaceAll("\\", "/"));
writeFileSync(entry, `import {Composition,registerRoot} from 'remotion';import Motion from ${engineImport};import PlanningFrame from ${planningImport};
const Planning=({frame})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Synthetic planning proof"/></div>;
registerRoot(()=> <><Composition id="MotionProof" component={Motion} width={1080} height={1920} fps={30} durationInFrames={180} defaultProps={${JSON.stringify(props)}}/>
<Composition id="PlanningProof" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{frame:${JSON.stringify(props.board.output.shots[0].endFrame)}}}/></>);`);
const serveUrl = await bundle({ entryPoint: entry });
const composition = await selectComposition({ serveUrl, id: "MotionProof", browserExecutable });
const still = async (name, frame) => {
  const inputProps = { frame };
  const selected = await selectComposition({ serveUrl, id: "PlanningProof", inputProps, browserExecutable });
  await renderStill({ serveUrl, composition: selected, inputProps, frame: 0, browserExecutable, imageFormat: "png", output: join(output, `${name}.png`) });
};
// Freeze exact source JSON with hashes. Saved projects are read only, never promoted or accepted.
const references = [
  { name: "ai-clipping", path: "videos/483022fc-0641-4d52-ba05-8316f9d6b1c7/visuals/c269789a-060b-436b-8fe5-53d0704e2264.json", indices: [0, 5] },
  { name: "reddit-workflow", path: "videos/f5727810-b452-40b6-8464-b72c363007d4/visuals/c31e1d27-3f4a-428f-9618-55576f613c00.json", indices: [0, 3] },
];
const baseline = [];
for (const ref of references) {
  const bytes = readFileSync(ref.path), board = visualArtifactSchema.parse(JSON.parse(bytes));
  assert.equal(board.output.kind, "storyboard");
  writeFileSync(join(output, `${ref.name}-source.json`), bytes, { flag: "wx" });
  for (const index of ref.indices) {
    const shot = board.output.shots[index], name = `${ref.name}-${index + 1}`;
    await still(name, shot.endFrame);
    baseline.push({ name, source: ref.path, sourceHash: sha(bytes), shotIndex: index, purpose: shot.purpose,
      types: shot.endFrame.shapes.map((shape) => shape.type), frameHash: sha(readFileSync(join(output, `${name}.png`))) });
  }
  assert.equal(sha(readFileSync(ref.path)), sha(bytes));
}
await still("after-planning", props.board.output.shots[0].endFrame);
const before = { background: "#F7F3E9", shapes: [
  { type: "browser", x: 12, y: 20, width: 42, height: 24, color: "#203B3A", label: "" },
  { type: "line", x: 34, y: 47, width: 25, height: 8, color: "#607570", label: "" },
  { type: "document", x: 60, y: 45, width: 22, height: 17, color: "#D9633F", label: "" },
  { type: "browser", x: 20, y: 68, width: 46, height: 20, color: "#203B3A", label: "" },
] };
await still("before-synthetic", before);
writeFileSync(join(output, "synthetic-scene.json"), JSON.stringify({ syntheticOnly: true, narration: "Collect recurring work complaints, group the same pain, then design a candidate tool. Validate demand before building.", before, ...props }, null, 2));
console.log("Baseline and planning frames saved. Rendering 180 sequential frames.");
await renderFrames({ serveUrl, composition, browserExecutable, outputDir: join(output, "frames"), imageFormat: "png", concurrency: 1 });
const checks = [179, 0, 30, 76, 100, 121, 30, 179];
const seeks = [];
for (const [index, frame] of checks.entries()) {
  const path = join(output, `seek-${index}.png`);
  await renderStill({ serveUrl, composition, browserExecutable, frame, imageFormat: "png", output: path });
  const hash = sha(readFileSync(path));
  assert.equal(hash, sha(readFileSync(join(output, "frames", `element-${String(frame).padStart(3, "0")}.png`))), `Seek differs at ${frame}`);
  seeks.push({ frame, sha256: hash });
}
// Studio uses a 360-wide viewBox; subpixel rasterization can differ from the 1080-wide motion canvas.
const pixels = (path) => execFileSync("ffmpeg", ["-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 8_000_000 });
const planned = pixels(join(output, "after-planning.png")), settled = pixels(join(output, "frames/element-179.png"));
assert.equal(planned.length, settled.length);
let absoluteError = 0, changedPixels = 0;
for (let i = 0; i < planned.length; i += 3) {
  let changed = false;
  for (let channel = 0; channel < 3; channel++) { const error = Math.abs(planned[i + channel] - settled[i + channel]); absoluteError += error; changed ||= error > 0; }
  if (changed) changedPixels++;
}
const meanChannelError = absoluteError / planned.length, changedPixelFraction = changedPixels / (1080 * 1920);
assert.ok(meanChannelError < .01 && changedPixelFraction < .001, "Settled motion differs materially from Studio planning preview.");
const video = join(output, "synthetic-workflow.mp4");
await renderMedia({ serveUrl, composition, browserExecutable, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: video });
const metadata = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-of", "json", video], { encoding: "utf8" }));
const stream = metadata.streams[0];
assert.equal(metadata.streams.length, 1); assert.equal(stream.width, 1080); assert.equal(stream.height, 1920);
assert.equal(stream.r_frame_rate, "30/1"); assert.equal(Number(stream.nb_frames), 180);
execFileSync("ffmpeg", ["-v", "error", "-i", video, "-f", "null", "-"], { stdio: "pipe" });
// Phone-size comparison: same synthetic teaching objective, two distinct render capabilities.
execFileSync("ffmpeg", ["-v", "error", "-i", join(output, "before-synthetic.png"), "-i", join(output, "after-planning.png"),
  "-filter_complex", "[0:v]scale=360:640[a];[1:v]scale=360:640[b];[a][b]hstack=inputs=2", "-frames:v", "1", join(output, "before-after-phone.png")], { stdio: "pipe" });
const inputs = baseline.flatMap((item) => ["-i", join(output, `${item.name}.png`)]);
execFileSync("ffmpeg", ["-v", "error", ...inputs, "-filter_complex", "[0:v]scale=270:480[a];[1:v]scale=270:480[b];[2:v]scale=270:480[c];[3:v]scale=270:480[d];[a][b][c][d]hstack=inputs=4", "-frames:v", "1", join(output, "baseline-contact.png")], { stdio: "pipe" });
assert.equal(hashEngine(), engineHash, "Engine changed during proof; preserve diagnostic output and rerun.");
writeFileSync(join(output, "verification.json"), JSON.stringify({ version: 1, syntheticOnly: true, productionApproval: false, engineHash,
  asset: graphicAssetRegistry["complaint-workflow@1"], baseline, sequentialFrames: 180, freshSeeks: seeks,
  planningMotionComparison: { meanChannelError, changedPixelFraction, meanChannelErrorLimit: .01, changedPixelFractionLimit: .001 },
  width: 1080, height: 1920, fps: 30, fullDecode: "pass", silent: true }, null, 2) + "\n");
console.log(`Graphics proof passed: ${output}`);
