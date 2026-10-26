import { z } from "zod";

const offsetFrames = z.number().int().min(-30).max(30).optional();
const lineNumber = z.number().int().positive();
export const speechAlignmentEvidenceSchema = z.strictObject({
  engine: z.string().trim().min(1).max(100), version: z.string().trim().min(1).max(100),
  audioHash: z.string().regex(/^[a-f0-9]{64}$/), transcriptHash: z.string().regex(/^[a-f0-9]{64}$/),
  reviewedByHuman: z.literal(true), reviewNotes: z.string().trim().min(1).max(2000),
});
export const narrationAnchorSchema = z.discriminatedUnion("kind", [
  z.strictObject({ lineNumber, kind: z.literal("line"), offsetFrames }),
  z.strictObject({ lineNumber, kind: z.enum(["phrase", "word"]), anchorId: z.string().regex(/^[a-z][a-z0-9-]{0,39}$/), offsetFrames }),
]);
