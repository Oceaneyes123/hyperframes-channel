import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { makeCancelSignal, renderStill, selectComposition } from "@remotion/renderer";
import { scheduleMotion, type MotionArtifact } from "../workflow/motion.ts";
import type { VisualArtifact } from "../workflow/visuals.ts";

export const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
export type FrameSample = { shotIndex: number; frame: number };
export type RenderedFrame = FrameSample & { file: string; sha256: string; dataUrl: string };

export function motionSamples(artifact: MotionArtifact, shotIndex: number, neighbors = true): FrameSample[] {
  const { shots } = scheduleMotion(artifact.plan), shot = shots[shotIndex];
  if (!Number.isInteger(shotIndex) || !shot) throw new Error("Review shot does not exist.");
  const samples = [0, .25, .5, .75, 1].map((p) => ({ shotIndex, frame: shot.startFrame + Math.round((shot.durationFrames - 1) * p) }));
  if (neighbors && shots[shotIndex - 1]) samples.unshift({ shotIndex: shotIndex - 1, frame: shots[shotIndex - 1].endFrame - 1 });
  if (neighbors && shots[shotIndex + 1]) samples.push({ shotIndex: shotIndex + 1, frame: shots[shotIndex + 1].startFrame });
  return samples.filter((sample, index) => samples.findIndex((other) => other.frame === sample.frame) === index);
}

/** One bundle per session; all frames use the production composition at exact global time. */
export function motionFrameRenderer() {
  let serveUrl: string | undefined;
  return async (artifact: MotionArtifact, board: VisualArtifact, samples: FrameSample[], output: string, signal: AbortSignal): Promise<RenderedFrame[]> => {
    signal.throwIfAborted();
    if (!samples.length || samples.length > 7) throw new Error("Frame review budget exceeded.");
    const duration = scheduleMotion(artifact.plan).durationFrames;
    if (samples.some(({ frame }) => !Number.isInteger(frame) || frame < 0 || frame >= duration)) throw new Error("Invalid review frame.");
    serveUrl ??= await bundle({ entryPoint: resolve("engine/register.tsx"), publicDir: resolve("public"), webpackOverride: (config) => ({ ...config, cache: false }) });
    signal.throwIfAborted(); mkdirSync(output, { recursive: true });
    const { cancelSignal, cancel } = makeCancelSignal(); signal.addEventListener("abort", cancel, { once: true });
    try {
      const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
      const inputProps = { plan: artifact.plan, board };
      const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable });
      const frames: RenderedFrame[] = [];
      for (const sample of samples) {
        signal.throwIfAborted(); const file = `frame-${sample.frame}.png`;
        await renderStill({ serveUrl, composition, inputProps, browserExecutable, frame: sample.frame, output: join(output, file), imageFormat: "png", scale: 1 / 3, cancelSignal });
        signal.throwIfAborted(); const bytes = readFileSync(join(output, file));
        if (bytes.length > 750_000) throw new Error("Review image exceeds the size budget.");
        frames.push({ ...sample, file, sha256: sha256(bytes), dataUrl: `data:image/png;base64,${bytes.toString("base64")}` });
      }
      return frames;
    } finally { signal.removeEventListener("abort", cancel); }
  };
}
