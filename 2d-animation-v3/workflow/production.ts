import { z } from "zod";
import { scheduleMotion, type MotionPlan } from "./motion.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";
import type { VisualArtifact } from "./visuals.ts";

export const lineTimingSchema = z.array(z.strictObject({ number: z.number().int().positive(), startFrame: z.number().int().nonnegative(), endFrame: z.number().int().positive() })).min(1).max(200);
export type LineTiming = z.infer<typeof lineTimingSchema>;
export type ProductionView = {
  ready: boolean; reason: string; binding: string | null; gate1: string | null; gate2: string | null;
  narration: { id: string; motionId: string; timing: LineTiming; measured: { durationSeconds: number; waveform: number[] } } | null;
  quality: { warnings: string[]; durationFrames: number } | null;
  history: { id: string; kind: string; payload: { jobId?: string; error?: string } }[];
};
export function validateTiming(input: unknown, plan: MotionPlan, lines: { number: number }[]) {
  const timing = lineTimingSchema.parse(input), schedule = scheduleMotion(plan);
  if (timing.length !== lines.length) throw new Error("Provide measured timing for every narration line.");
  for (const [i, line] of timing.entries()) {
    const shot = plan.shots.findIndex((shot) => shot.lineNumbers.includes(line.number));
    if (line.number !== lines[i].number || line.endFrame <= line.startFrame || line.startFrame < (timing[i - 1]?.endFrame ?? 0) || shot < 0 || line.startFrame < schedule.shots[shot].startFrame || line.endFrame > schedule.shots[shot].endFrame) throw new Error("Narration timing must be ordered and lie inside its assigned motion shot. Revise motion before importing mismatched audio.");
  }
  return timing;
}

// Separate deterministic diagnostics never replace an independent human moving/audio review.
export function inspectMotion(plan: MotionPlan, board?: VisualArtifact | null) {
  return inspectCreativeMotion(plan, board);
}
