import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, stitchFramesToVideo, renderFrames, renderStill, makeCancelSignal } from "@remotion/renderer";
import { readConfig } from "./config.ts";
import { openProduction } from "./production-store.ts";
import { preflight, PreflightError } from "./preflight.ts";

const run = promisify(execFile);
export async function verifyExport(path: string, durationFrames: number) {
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_streams", "-of", "json", path]);
  const streams = JSON.parse(stdout).streams, video = streams.find((stream: { codec_type: string }) => stream.codec_type === "video"), audio = streams.find((stream: { codec_type: string }) => stream.codec_type === "audio");
  if (streams.length !== 2 || !video || !audio || video.width !== 1080 || video.height !== 1920 || video.r_frame_rate !== "30/1" || Number(video.nb_frames) !== durationFrames || Math.abs(Number(video.duration) - durationFrames / 30) > 1 / 30 || Math.abs(Number(audio.duration) - durationFrames / 30) > .1) throw new Error("Export metadata does not match approved composition.");
  await run("ffmpeg", ["-v", "error", "-i", path, "-f", "null", "-"], { maxBuffer: 1_000_000 });
  return { sha256: createHash("sha256").update(readFileSync(path)).digest("hex"), durationFrames, audio: true, fullDecode: true, width: 1080, height: 1920, fps: 30 };
}

export async function verifyPreviewFrames(output: string, durationFrames: number) {
  const files = readdirSync(join(output, "frames")).filter((name) => /^element-\d+\.png$/.test(name));
  if (files.length !== durationFrames) throw new Error("Preview reference frame count mismatch.");
  const digits = files[0].match(/\d+/)![0].length;
  const { stdout } = await run("ffmpeg", ["-v", "error", "-reinit_filter", "0", "-i", "export.mp4", "-reinit_filter", "0", "-framerate", "30", "-i", `frames/element-%0${digits}d.png`, "-filter_complex", "[0:v]settb=1/30,setpts=N,format=yuv420p[v];[1:v]settb=1/30,setpts=N,format=yuv420p[s];[v][s]ssim=stats_file=-", "-an", "-f", "framemd5", "pipe:2"], { cwd: output, maxBuffer: 1_000_000 });
  const values = [...stdout.matchAll(/All:([0-9.]+)/g)].map((match) => Number(match[1]));
  if (values.length !== durationFrames || Math.min(...values) < .98) throw new Error(`Preview comparison failed: ${values.length}/${durationFrames} frames, minimum SSIM ${Math.min(...values)}.`);
  return { comparedFrames: values.length, minimumSsim: Math.min(...values), threshold: .98 };
}

export async function verifyAudioSync(source: string, video: string) {
  const decode = async (path: string) => (await run("ffmpeg", ["-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], { encoding: "buffer", maxBuffer: 4_000_000 })).stdout;
  const original = await decode(source), encoded = await decode(video); let best = -1, lag = 0;
  const samples = original.length / 2, stride = Math.max(1, Math.floor(samples / 6000));
  for (let offset = -400; offset <= 400; offset++) {
    let cross = 0, first = 0, second = 0;
    for (let i = 400; i < samples - 400 && i + offset < encoded.length / 2; i += stride) {
      const a = original.readInt16LE(i * 2), b = encoded.readInt16LE((i + offset) * 2); cross += a * b; first += a * a; second += b * b;
    }
    const correlation = cross / Math.sqrt(first * second);
    if (correlation > best) { best = correlation; lag = offset; }
  }
  if (best < .9 || Math.abs(lag) / 8000 > 1 / 30) throw new Error("Export narration differs or is misaligned by more than one frame.");
  return { correlation: best, lagSeconds: lag / 8000, toleranceSeconds: 1 / 30 };
}

export async function renderProduction(projectId: string, binding: string, authorize: boolean, signal: AbortSignal, config = readConfig(), progress: (message: string) => void = () => {}) {
  const store = openProduction(config.dataDirectory, config.videosDirectory); let jobId: string | undefined;
  try {
    signal.throwIfAborted(); const job = store.beginRender(projectId, binding, authorize); jobId = job.id;
    progress("Checking render dependencies and output storage…"); await preflight("render", signal, config);
    const output = join(config.videosDirectory, projectId, "production", job.id); mkdirSync(output, { recursive: false });
    const serveUrl = await bundle({ entryPoint: resolve("engine/register.tsx"), publicDir: resolve("public") }); signal.throwIfAborted();
    const inputProps = { plan: job.artifact.plan, board: job.board, narrationUrl: `data:audio/wav;base64,${(job.voice.mixedBytes ?? job.voice.bytes).toString("base64")}` };
    const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
    const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable });
    const { cancelSignal, cancel } = makeCancelSignal(); signal.addEventListener("abort", cancel, { once: true });
    try {
      if (signal.aborted) cancel();
      let lastPercent = -1;
      progress("Rendering full-resolution frames once for encoding and comparison…");
      const frames = await renderFrames({ serveUrl, composition, inputProps, browserExecutable, outputDir: join(output, "frames"), imageFormat: "png", concurrency: 1, cancelSignal, onStart: () => {}, onFrameUpdate: (count) => {
        const percent = Math.floor(count / composition.durationInFrames * 20) * 5;
        if (percent > lastPercent) { progress(`Rendering frames: ${count}/${composition.durationInFrames}.`); lastPercent = percent; }
      } });
      if (frames.frameCount !== composition.durationInFrames) throw new Error("Rendered frame count mismatch.");
      progress("Encoding the rendered frames and narration…");
      await stitchFramesToVideo({ assetsInfo: frames.assetsInfo, fps: composition.fps, width: composition.width, height: composition.height, outputLocation: join(output, "export.mp4"), codec: "h264", pixelFormat: "yuv420p", crf: 18, cancelSignal });
      progress("Checking fresh seeks against sequential frames…");
      const files = readdirSync(join(output, "frames")).sort();
      for (const frame of new Set([0, composition.durationInFrames - 1, ...boundariesFor(job.artifact.plan)])) {
        signal.throwIfAborted(); const path = join(output, `seek-${frame}.png`);
        await renderStill({ serveUrl, composition, inputProps, browserExecutable, frame, output: path, imageFormat: "png" });
        if (!readFileSync(path).equals(readFileSync(join(output, "frames", files[frame])))) throw new Error("Fresh seek differs from sequential preview.");
      }
    } finally { signal.removeEventListener("abort", cancel); }
    signal.throwIfAborted(); progress("Verifying full decode, every encoded frame and narration synchronization…"); const verification = await verifyExport(join(output, "export.mp4"), composition.durationInFrames);
    const preview = await verifyPreviewFrames(output, composition.durationInFrames);
    const audio = await verifyAudioSync(join(config.videosDirectory, projectId, "production", `${job.voice.id}${job.voice.soundtrack ? ".mix" : ""}.wav`), join(output, "export.mp4"));
    signal.throwIfAborted();
    store.finishRender(projectId, job.id, binding, { ...verification, engineHash: job.engineHash, preview, audioSync: audio, renderPasses: 1, referenceFramesReusedForEncoding: composition.durationInFrames, checkedSeekFrames: [...new Set([0, composition.durationInFrames - 1, ...boundariesFor(job.artifact.plan)])] }); return job.id;
  } catch (error) { if (jobId) store.failRender(projectId, jobId); if (error instanceof PreflightError) throw error; throw new Error("Render failed or inputs changed. Prior artifacts preserved; inspect job history."); }
  finally { store.close(); }
}

function boundariesFor(plan: { shots: { durationFrames: number; incoming: { overlapFrames: number } }[] }) {
  let end = 0; return plan.shots.map((shot) => { const start = end - shot.incoming.overlapFrames; end = start + shot.durationFrames; return start; });
}
