import { z } from "zod";

export const rhythmReviewOptionsSchema = z.strictObject({
  maxInactiveFrames: z.number().int().min(1).max(5400).default(45),
  maxPrimaryPresetShare: z.number().min(0).max(1).default(.4),
  minimumPrimaryBeats: z.number().int().min(2).max(1280).default(3),
  maxTextElementsPerShot: z.number().int().min(0).max(16).default(2),
});
export type RhythmReviewOptions = z.input<typeof rhythmReviewOptionsSchema>;
export const rhythmProfileSchema = z.strictObject({
  schemaVersion: z.literal(1), basis: z.literal("skill-derived experiment; no reference clips measured"),
  sources: z.array(z.url()).min(1),
  measuredReference: z.strictObject({ changeEventsPer5Seconds: z.null(), textPerShot: z.null(), shotLengthDistribution: z.null(), cameraMovesPerMinute: z.null(), loudnessRangeLUFS: z.null() }),
  reviewTargets: rhythmReviewOptionsSchema,
});
