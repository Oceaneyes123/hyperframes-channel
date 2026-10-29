import { z } from "zod";
import { speechAlignmentEvidenceSchema } from "./narration-anchor.ts";
import { lineTimingSchema } from "./production.ts";
import { scheduleMotion, type MotionPlan } from "./motion.ts";

const frame = z.number().int().nonnegative().max(5400);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const timingAnchorSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]{0,39}$/), lineNumber: z.number().int().positive(),
  kind: z.enum(["phrase", "word"]), text: z.string().trim().min(1).max(120), startFrame: frame, endFrame: frame,
  provenance: z.enum(["manual", "verified-aligner"]),
});
export const planningTimingInputSchema = z.strictObject({
  alignmentEvidence: speechAlignmentEvidenceSchema.optional(),
  scriptId: z.uuid(), baseId: z.uuid().nullable(), timing: lineTimingSchema,
  anchors: z.array(timingAnchorSchema).max(1000), provenance: z.enum(["manual", "verified-aligner"]),
});
export const planningTimingSchema = z.strictObject({
  alignmentEvidence: speechAlignmentEvidenceSchema.optional(),
  schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), parentId: z.uuid().nullable(), scriptId: z.uuid(), scriptHash: hash,
  createdAt: z.iso.datetime(), audioHash: hash, timing: lineTimingSchema, anchors: z.array(timingAnchorSchema).max(1000),
  provenance: z.enum(["manual", "verified-aligner"]),
  measured: z.strictObject({ durationSeconds: z.number().positive().max(180), durationFrames: z.number().int().positive().max(5400),
    sampleRate: z.number().int().min(8000).max(96000), channels: z.number().int().min(1).max(2), waveform: z.array(z.number().min(0).max(1)).length(100) }),
});
export type PlanningTiming = z.infer<typeof planningTimingSchema>;

export function timeStoryboard<T extends { shots: { lineNumbers: number[]; seconds: number }[] }>(board: T, timing: PlanningTiming): T {
  const numbers = board.shots.flatMap((shot) => shot.lineNumbers);
  if (JSON.stringify(numbers) !== JSON.stringify(timing.timing.map((line) => line.number))) throw new Error("Storyboard must cover the measured narration lines exactly once and in order.");
  const starts = board.shots.map((shot, index) => index === 0 ? 0 : timing.timing.find((line) => line.number === shot.lineNumbers[0])!.startFrame);
  return { ...board, shots: board.shots.map((shot, index) => {
    const end = starts[index + 1] ?? timing.measured.durationFrames, duration = end - starts[index];
    if (duration < 15 || duration > 1800 || shot.lineNumbers.some((number) => timing.timing.find((line) => line.number === number)!.endFrame > end)) throw new Error("Measured shot duration must fit 0.5–60 seconds. Regroup storyboard lines without changing the voice rate.");
    return { ...shot, seconds: duration / 30 };
  }) };
}

export function validatePlanningTiming(input: z.infer<typeof planningTimingInputSchema>, durationFrames: number, lines: { number: number; text: string }[]) {
  if (input.timing.length !== lines.length) throw new Error("Provide measured timing for every script line.");
  for (const [index, span] of input.timing.entries()) {
    if (span.number !== lines[index].number || span.endFrame <= span.startFrame || span.endFrame > durationFrames || span.startFrame < (input.timing[index - 1]?.endFrame ?? 0)) throw new Error("Measured script timing must be ordered, complete and inside the audio.");
  }
  const ids = new Set<string>(), previous = new Map<string, number>();
  for (const anchor of input.anchors) {
    const line = input.timing.find((span) => span.number === anchor.lineNumber), text = lines.find((line) => line.number === anchor.lineNumber)?.text;
    const group = `${anchor.lineNumber}:${anchor.kind}`;
    if (ids.has(anchor.id) || !line || !text?.includes(anchor.text) || anchor.kind === "word" && /\s/.test(anchor.text) || anchor.startFrame < line.startFrame || anchor.endFrame > line.endFrame || anchor.endFrame <= anchor.startFrame || anchor.startFrame < (previous.get(group) ?? 0)) throw new Error("Anchor text, identity or measured interval is invalid.");
    ids.add(anchor.id); previous.set(group, anchor.endFrame);
  }
}

export function resolveBeatTiming(input: MotionPlan, timing: PlanningTiming) {
  const plan = structuredClone(input), schedule = scheduleMotion(plan), warnings: string[] = [];
  for (const [index, shot] of plan.shots.entries()) {
    for (const beat of [...shot.beats ?? [], ...shot.textMotions ?? []]) {
      const reference = beat.narrationAnchor; if (!reference) continue;
      const line = timing.timing.find((line) => line.number === reference.lineNumber);
      if (!line || !shot.lineNumbers.includes(reference.lineNumber)) throw new Error("Narration anchor is outside its assigned shot.");
      const precise = reference.kind === "line" ? null : timing.anchors.find((anchor) => anchor.id === reference.anchorId && anchor.lineNumber === reference.lineNumber && anchor.kind === reference.kind);
      if (reference.kind !== "line" && !precise) warnings.push(`${shot.id}/${"id" in beat ? beat.id : beat.targetId}: ${reference.kind} span unavailable; using measured line ${line.number}.`);
      const start = (precise ?? line).startFrame - schedule.shots[index].startFrame + (reference.offsetFrames ?? 0), duration = beat.endFrame - beat.startFrame;
      if (start < 0 || start + duration >= shot.durationFrames) throw new Error("Anchored action does not fit its shot. Revise the motion schedule.");
      beat.startFrame = start; beat.endFrame = start + duration;
    }
    shot.beats?.sort((a, b) => a.startFrame - b.startFrame);
  }
  return { plan, warnings };
}
