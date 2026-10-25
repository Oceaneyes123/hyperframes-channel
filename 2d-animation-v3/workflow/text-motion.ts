import { z } from "zod";
import { narrationAnchorSchema } from "./narration-anchor.ts";

// Versioned visual semantics; timing is always shot-local at 30fps.
export const textMotionLibrary = [
  { id: "mask-rise@1", name: "Masked rise", use: "Introduce a short title from a baseline mask." },
  { id: "word-stagger@1", name: "Word stagger", use: "Build a short phrase in reading order." },
  { id: "character-rise@1", name: "Character rise", use: "Introduce a short name or acronym." },
  { id: "typewriter@1", name: "Typewriter", use: "Show a prompt, command or typed input." },
  { id: "wipe-reveal@1", name: "Wipe reveal", use: "Uncover a label as information becomes available." },
  { id: "tracking-settle@1", name: "Tracking settle", use: "Bring a short heading into focus through spacing." },
  { id: "blur-resolve@1", name: "Blur resolve", use: "Turn uncertainty into a clear answer." },
  { id: "pop-settle@1", name: "Pop settle", use: "Land one important keyword with a small overshoot." },
  { id: "highlight-sweep@1", name: "Highlight sweep", use: "Emphasize an already readable phrase." },
  { id: "underline-draw@1", name: "Underline draw", use: "Mark a takeaway without moving its letters." },
] as const;

export const textMotionIdSchema = z.enum(textMotionLibrary.map((preset) => preset.id));
export const textMotionSchema = z.strictObject({
  targetId: z.string().regex(/^[a-z][a-z0-9-]{0,39}$/),
  presetId: textMotionIdSchema,
  startFrame: z.number().int().min(0).max(1800),
  endFrame: z.number().int().min(0).max(1800),
  narrationAnchor: narrationAnchorSchema.nullable().optional(),
}).refine((motion) => motion.endFrame - motion.startFrame >= 6, "Text motion needs at least six frames.");
export type TextMotion = z.infer<typeof textMotionSchema>;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function textMotionProgress(motion: TextMotion, frame: number, index = 0, count = 1) {
  const progress = clamp((frame - motion.startFrame) / (motion.endFrame - motion.startFrame));
  const staggered = ["word-stagger@1", "character-rise@1"].includes(motion.presetId);
  const local = staggered ? clamp((progress - index / Math.max(1, count - 1) * .55) / .45) : progress;
  return { progress, eased: 1 - (1 - local) ** 3 };
}

export function textMotionSegments(label: string, presetId: TextMotion["presetId"]) {
  if (presetId === "word-stagger@1") return label.match(/\s+|\S+/gu) ?? [];
  if (["character-rise@1", "typewriter@1"].includes(presetId)) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(label), (part) => part.segment);
  }
  return [label];
}

export const textMotionGuidance = `Optional textMotions:[{targetId,presetId,startFrame,endFrame}] selects one treatment per root text actor (text,centered-text,heading,caption,code). Available treatments: ${textMotionLibrary.map((preset) => `${preset.id}: ${preset.use}`).join("; ")}. Use short labels; preserve supplied text. No arbitrary markup, plugins or claims. Frames are shot-local. Optional narrationAnchor uses the same measured line/phrase/word contract as beats; missing precise spans explicitly fall back to the measured line. Use 6+ frames and end at least 12 frames before the shot ends. Do not overlap a reading hold or reanimate a continuous anchor. Hidden root entrants must become visible before text motion starts. Do not animate every label: use one focal treatment, then hold. Character effects require simple left-to-right text; use whole-label effects for connected scripts. Never count up money or invent intermediate numbers.`;
