import { creativeSnapshotSchema } from "./creative-rules.ts";
import { z } from "zod";
import { scriptContentSchema } from "./project.ts";

export const revisionRequestSchema = z.strictObject({
  baseId: z.uuid(),
  start: z.number().int().nonnegative(),
  end: z.number().int().positive(),
  instruction: z.string().trim().min(1).max(2_000),
}).refine((value) => value.end > value.start, "Select script text to revise.");

export const proposalSchema = z.strictObject({ creativeRules: creativeSnapshotSchema.optional(),
  schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(),
  request: revisionRequestSchema,
  replacement: scriptContentSchema,
  notes: z.string().max(4_000),
});
export type ScriptProposal = z.infer<typeof proposalSchema>;

export function applyReplacement(content: string, start: number, end: number, replacement: string) {
  // Textarea selections use UTF-16 offsets; reject split surrogate pairs at both boundaries.
  const split = (offset: number) => offset > 0 && /[\uD800-\uDBFF]/.test(content[offset - 1]) && /[\uDC00-\uDFFF]/.test(content[offset] ?? "");
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > content.length || split(start) || split(end)) {
    throw new Error("Selection does not match the saved script.");
  }
  return scriptContentSchema.parse(content.slice(0, start) + scriptContentSchema.parse(replacement) + content.slice(end));
}
