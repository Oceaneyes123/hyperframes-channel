import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { makeCancelSignal, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { z } from "zod";
import { readConfig } from "./config.ts";
import { openVisuals } from "./visual-store.ts";
import { openMotion } from "./motion-store.ts";
import { openTiming } from "./timing-store.ts";
import { hashEngine } from "./production-store.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";
import { inspectMotion } from "../workflow/production.ts";
import { scheduleMotion } from "../workflow/motion.ts";
import { preflight } from "./preflight.ts";
import { motionReviewStore, MotionReviewError } from "./motion-review.ts";

const requestSchema = z.strictObject({ kind: z.enum(["board", "motion"]), artifactId: z.uuid(), shotIndex: z.number().int().min(0).max(39).optional() });
const hash = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");

export function approveWorkflowReview(projectId: string, input: unknown, config = readConfig()) {
  const request = z.object({ reviewId: z.uuid() }).parse(input), reviews = motionReviewStore(config.dataDirectory);
  const review = reviews.read(request.reviewId), store = openMotion(config.dataDirectory, config.videosDirectory);
  try {
    const artifact = store.read(projectId, review.report.artifactId);
    if (!artifact || !store.current(projectId, artifact.id)) throw new Error("Current motion candidate required for review approval.");
    return reviews.approve(projectId, input, { artifactId: artifact.id, sourceHash: hash(JSON.stringify(artifact)), engineHash: hashEngine() });
  } finally { store.close(); }
}

export async function renderWorkflowReview(projectId: string, input: unknown, signal: AbortSignal, progress: (message: string) => void, config = readConfig()) {
  z.uuid().parse(projectId); const request = requestSchema.parse(input);
  await preflight("render", signal, config);
  const visuals = openVisuals(config.dataDirectory, config.videosDirectory), motion = openMotion(config.dataDirectory, config.videosDirectory), timing = openTiming(config.dataDirectory, config.videosDirectory);
  const { cancelSignal, cancel } = makeCancelSignal(); signal.addEventListener("abort", cancel, { once: true });
  try {
    signal.throwIfAborted();
    const candidate = request.kind === "motion" ? motion.read(projectId, request.artifactId) : null;
    const board = visuals.read(projectId, candidate?.source.storyboardId ?? request.artifactId);
    if (!board || board.output.kind !== "storyboard" || !visuals.current(projectId, board.id) || request.kind === "motion" && (!candidate || !motion.current(projectId, candidate.id))) throw new Error("A current storyboard or motion candidate is required.");
    const count = candidate?.plan.shots.length ?? board.output.shots.length;
    if (request.shotIndex !== undefined && request.shotIndex >= count) throw new Error("Review shot does not exist.");
    const engineHash = hashEngine(), sourceHash = hash(JSON.stringify(candidate ?? board));
    if (candidate && request.shotIndex === undefined && (candidate.plan.energyProfile === "intense" || candidate.creativeRules?.rules.some((rule) => rule.id === "CQ-ENERGY" && rule.version >= 2)) && !motionReviewStore(config.dataDirectory).hasSceneApproval(projectId, candidate.id, sourceHash, engineHash)) throw new MotionReviewError("Approve a representative scene at normal speed before rendering the full high-energy review. Use review-motion with a shot index, then approve-review.");
    const output = join(config.dataDirectory, "workflow-reviews", randomUUID()); mkdirSync(output, { recursive: true });
    const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
    const files: string[] = []; let audioHash: string | null = null;
    const serveUrl = await bundle({ entryPoint: resolve(candidate ? "engine/register.tsx" : "engine/register-planning.tsx"), publicDir: resolve("public") });
    signal.throwIfAborted();
    if (candidate) {
      const voice = candidate.source.timingId ? timing.audio(projectId, candidate.source.timingId) : null;
      audioHash = voice ? hash(voice) : null;
      const inputProps = { plan: candidate.plan, board, ...(voice ? { narrationUrl: `data:audio/wav;base64,${voice.toString("base64")}` } : {}) };
      const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable });
      const scheduled = scheduleMotion(candidate.plan), selected = request.shotIndex === undefined ? null : scheduled.shots[request.shotIndex];
      const frameRange: [number, number] = selected ? [selected.startFrame, selected.endFrame - 1] : [0, scheduled.durationFrames - 1];
      progress(selected ? "Rendering the selected scene for early motion review…" : "Rendering the phone-size narrated review…");
      await renderMedia({ serveUrl, composition, inputProps, browserExecutable, codec: "h264", outputLocation: join(output, "review.mp4"), scale: 1 / 3, frameRange, concurrency: 1, cancelSignal });
      files.push("review.mp4");
    } else {
      for (const [index, shot] of board.output.shots.entries()) {
        if (request.shotIndex !== undefined && request.shotIndex !== index) continue;
        for (const [name, frame] of [["start", shot.startFrame], ["end", shot.endFrame]] as const) {
          signal.throwIfAborted(); const inputProps = { frame }, file = `shot-${index + 1}-${name}.png`;
          const composition = await selectComposition({ serveUrl, id: "Planning", inputProps, browserExecutable });
          await renderStill({ serveUrl, composition, inputProps, browserExecutable, output: join(output, file), imageFormat: "png", scale: 1 / 3, cancelSignal });
          files.push(file);
        }
        progress(`Phone-size endpoints ready for shot ${index + 1}/${count}.`);
      }
    }
    signal.throwIfAborted();
    if (hashEngine() !== engineHash || !visuals.current(projectId, board.id) || candidate && !motion.current(projectId, candidate.id)) throw new Error("Review inputs changed. Earlier outputs preserved; review the new inputs.");
    const report = { version: 1, projectId, ...request, sourceHash, engineHash, audioHash, width: 360, height: 640, reviewOnly: true, humanApproval: false, scope: request.shotIndex === undefined ? "all-shots" : "selected-shot", quality: candidate ? inspectMotion(candidate.plan, board) : inspectGraphics(board), files: files.map((file) => ({ file, sha256: hash(readFileSync(join(output, file))) })) };
    writeFileSync(join(output, "review.json"), JSON.stringify(report, null, 2), { flag: "wx", flush: true });
    const content = files.map((file) => file.endsWith(".mp4") ? `<video controls playsinline preload="metadata" src="${file}"></video>` : `<figure><img src="${file}" alt="${file}"><figcaption>${file}</figcaption></figure>`).join("");
    writeFileSync(join(output, "index.html"), `<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Creative review</title><style>body{font:16px system-ui;margin:24px}main{display:flex;flex-wrap:wrap;gap:16px}img,video{width:360px;max-width:100%;height:auto}figure{margin:0}</style><h1>Creative review</h1><p>${candidate && !audioHash ? "Silent motion review. Narration synchronization is not reviewed." : "Review at normal speed and phone size."} Selected scenes do not approve the full video.</p><main>${content}</main></html>`, { flag: "wx" });
    return { output, report };
  } finally { signal.removeEventListener("abort", cancel); timing.close(); motion.close(); visuals.close(); }
}
