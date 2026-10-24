import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, renderFrames, renderMedia, selectComposition } from "@remotion/renderer";
import { graphicsGallery, galleryNarration } from "../tests/fixtures/graphics-gallery.ts";
import { validateMotion, hydrateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";

const output = resolve(process.argv[2] ?? `.data/graphics-overhaul-proof-${Date.now()}`); mkdirSync(output, { recursive: false });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex"), engineHash = hashEngine();
writeFileSync(join(output, "narration.json"), JSON.stringify(galleryNarration));
execFileSync("powershell.exe", ["-NoProfile", "-File", resolve("scripts/benchmark-narration.ps1"), "-OutputDirectory", output, "-NarrationJson", join(output, "narration.json")], { stdio: "pipe" });
const metadata = (path) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", path], { encoding: "utf8" }));
const durations = [];
for (let i = 0; i < 8; i++) {
  const frames = Math.max(180, Math.ceil(Number(metadata(join(output, `voice-${i}.wav`)).format.duration) * 30)); durations.push(frames);
  execFileSync("ffmpeg", ["-v", "error", "-i", join(output, `voice-${i}.wav`), "-af", `apad=whole_dur=${frames / 30}`, "-t", String(frames / 30), "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", join(output, `line-${i}.wav`)], { stdio: "pipe" });
}
const narration = join(output, "narration.wav");
execFileSync("ffmpeg", ["-v", "error", ...durations.flatMap((_, i) => ["-i", join(output, `line-${i}.wav`)]), "-filter_complex", `${durations.map((_, i) => `[${i}:a]`).join("")}concat=n=8:v=0:a=1[a]`, "-map", "[a]", "-c:a", "pcm_s16le", narration], { stdio: "pipe" });
const props = graphicsGallery(durations), total = durations.reduce((sum, value) => sum + value, 0); validateMotion(props.plan, props.board, hashMotionSource);
// The comparison uses only legacy symbols/primitive layouts, with identical lines, timing and audio.
const before = structuredClone(props.board); before.schemaVersion = 1;
before.output.shots = before.output.shots.map((shot, index) => ({ ...shot, design: undefined,
  startFrame: { background: "#F7F3E9", shapes: [{ type: index % 2 ? "document" : "browser", x: 15, y: 30, width: 30, height: 20, color: "#203B3A", label: "" }, { type: "line", x: 47, y: 40, width: 12, height: 1, color: "#607570", label: "" }, { type: index % 2 ? "person" : "chip", x: 61, y: 30, width: 24, height: 20, color: "#D9633F", label: "" }] },
  endFrame: { background: "#F7F3E9", shapes: [{ type: index % 2 ? "document" : "browser", x: 15, y: 30, width: 30, height: 20, color: "#203B3A", label: "" }, { type: "line", x: 47, y: 40, width: 12, height: 1, color: "#607570", label: "" }, { type: index % 2 ? "person" : "chip", x: 61, y: 30, width: 24, height: 20, color: "#D9633F", label: "" }] } }));
const baselineBoard = visualArtifactSchema.parse(before);
const legacyGenerated = { shots: props.plan.shots.map((shot) => ({ durationFrames: shot.durationFrames, camera: shot.camera, incoming: shot.incoming,
  objects: [0, 1, 2].map((index) => ({ id: `object-${index + 1}`, startIndex: index, endIndex: index })),
  actions: [{ behavior: "hold", targetIds: ["object-1", "object-2", "object-3"], startFrame: 0, endFrame: shot.durationFrames - 2, staggerFrames: 0, ease: "linear", to: {} }] })) };
const baselinePlan = hydrateMotion(legacyGenerated, baselineBoard, hashMotionSource, undefined, "2"); validateMotion(baselinePlan, baselineBoard, hashMotionSource);
const narrationUrl = `data:audio/wav;base64,${readFileSync(narration).toString("base64")}`;
const entry = join(output, "register.tsx"), engine = JSON.stringify(resolve("engine/motion-composition.tsx").replaceAll("\\", "/")), planning = JSON.stringify(resolve("app/projects/[id]/visuals/frame.tsx").replaceAll("\\", "/"));
writeFileSync(entry, `import{Composition,registerRoot,getInputProps}from'remotion';import Motion from ${engine};import PlanningFrame from ${planning};const Planning=({frame})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Composition reference"/></div>;registerRoot(()=> <><Composition id="Benchmark" component={Motion} width={1080} height={1920} fps={30} durationInFrames={${total}} defaultProps={getInputProps()}/><Composition id="Reference" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={getInputProps()}/></>);`);
const serveUrl = await bundle({ entryPoint: entry, webpackOverride: (config) => ({ ...config, cache: false }) }), browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
for (const [index, shot] of props.board.output.shots.entries()) {
  const inputProps = { frame: shot.endFrame }, composition = await selectComposition({ serveUrl, id: "Reference", browserExecutable, inputProps });
  await renderStill({ serveUrl, composition, inputProps, browserExecutable, imageFormat: "png", output: join(output, `reference-${index + 1}.png`) });
}
execFileSync("ffmpeg", ["-v", "error", ...durations.flatMap((_, i) => ["-i", join(output, `reference-${i + 1}.png`)]), "-filter_complex", `${durations.map((_, i) => `[${i}:v]scale=270:480[s${i}]`).join(";")};${durations.map((_, i) => `[s${i}]`).join("")}xstack=inputs=8:layout=0_0|270_0|540_0|810_0|0_480|270_480|540_480|810_480`, "-frames:v", "1", join(output, "composition-contact.png")], { stdio: "pipe" });
console.log(`Eight reference compositions saved. Rendering ${total} frames with measured offline benchmark narration.`);
const inputProps = { ...props, narrationUrl }, composition = await selectComposition({ serveUrl, id: "Benchmark", browserExecutable, inputProps });
await renderFrames({ serveUrl, composition, inputProps, browserExecutable, imageFormat: "png", outputDir: join(output, "frames"), concurrency: 2 });
const checks = [total - 1, 0, 35, durations[0] + 30, durations.slice(0, 3).reduce((a, b) => a + b, 0) + 30, 76, total - 1], seeks = [];
for (const [index, frame] of checks.entries()) {
  const path = join(output, `seek-${index}.png`); await renderStill({ serveUrl, composition, inputProps, browserExecutable, frame, imageFormat: "png", output: path });
  const digest = hash(readFileSync(path)); assert.equal(digest, hash(readFileSync(join(output, "frames", `element-${String(frame).padStart(String(total - 1).length, "0")}.png`)))); seeks.push({ frame, hash: digest });
}
for (const [name, value] of [["after", inputProps], ["before", { board: baselineBoard, plan: baselinePlan, narrationUrl }]]) {
  const selected = await selectComposition({ serveUrl, id: "Benchmark", browserExecutable, inputProps: value }), path = join(output, `${name}.mp4`);
  await renderMedia({ serveUrl, composition: selected, inputProps: value, browserExecutable, outputLocation: path, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 2 });
  const streams = metadata(path).streams, video = streams.find((stream) => stream.codec_type === "video");
  assert.equal(video.width, 1080); assert.equal(video.height, 1920); assert.equal(video.r_frame_rate, "30/1"); assert.equal(Number(video.nb_frames), total); assert.ok(streams.some((stream) => stream.codec_type === "audio"));
  execFileSync("ffmpeg", ["-v", "error", "-i", path, "-f", "null", "-"], { stdio: "pipe" });
}
assert.equal(hashEngine(), engineHash, "Engine changed during proof. Preserve this run and retry.");
writeFileSync(join(output, "benchmark.json"), JSON.stringify({ syntheticOnly: true, humanApproval: false, voice: "Microsoft Zira Desktop offline benchmark voice", narration: galleryNarration, durations, ...props, baselineBoard, baselinePlan }, null, 2));
writeFileSync(join(output, "verification.json"), JSON.stringify({ syntheticOnly: true, humanApproval: false, engineHash, narrationHash: hash(readFileSync(narration)), totalFrames: total, width: 1080, height: 1920, fps: 30, exactFreshSeeks: seeks, fullDecode: "pass", sameScriptAndNarration: true, quality: inspectGraphics(props.board) }, null, 2));
console.log(`Graphics overhaul proof passed: ${output}`);
