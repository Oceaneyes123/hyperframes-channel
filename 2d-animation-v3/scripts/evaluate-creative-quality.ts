import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { motionArtifactSchema, scheduleMotion } from "../workflow/motion.ts";
import { evaluateCreativePair } from "../server/creative-evaluation.ts";
import { verifyExport, verifyAudioSync } from "../server/render.ts";
import { inspectFrameActivity } from "../server/creative-frame-activity.ts";

const paths = z.strictObject({ storyboard: z.string().min(1), motion: z.string().min(1), narration: z.string().min(1), narrationId: z.uuid(), video: z.string().min(1) });
const config = z.strictObject({ baseline: paths, candidate: paths, output: z.string().min(1) }).parse(JSON.parse(readFileSync(process.argv[2], "utf8")));
function load(input: z.infer<typeof paths>) {
  const boardBytes = readFileSync(input.storyboard);
  return { storyboardHash: createHash("sha256").update(boardBytes).digest("hex"), board: visualArtifactSchema.parse(JSON.parse(boardBytes.toString("utf8"))), motion: motionArtifactSchema.parse(JSON.parse(readFileSync(input.motion, "utf8"))), narration: { id: input.narrationId, bytes: readFileSync(input.narration) } };
}
const baseline = load(config.baseline), candidate = load(config.candidate), report = evaluateCreativePair(baseline, candidate);
const verification = [];
for (const [input, loaded] of [[config.baseline, baseline], [config.candidate, candidate]] as const) {
  verification.push({ export: await verifyExport(input.video, scheduleMotion(loaded.motion.plan).durationFrames), audio: await verifyAudioSync(input.narration, input.video), activity: await inspectFrameActivity(input.video) });
}
const inputHashes = [config.baseline, config.candidate].map((input) => Object.fromEntries(["storyboard", "motion", "narration", "video"].map((key) => [key, createHash("sha256").update(readFileSync(input[key as keyof typeof input])).digest("hex")])));
writeFileSync(config.output, JSON.stringify({ ...report, sources: { baseline: config.baseline, candidate: config.candidate }, inputHashes, verification }, null, 2), { flag: "wx", flush: true });
console.log(`Verified comparison saved to ${config.output}. Human review and release remain pending.`);
