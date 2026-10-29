import { creativeSnapshotSchema } from "./creative-rules.ts";
import { z } from "zod";
import { scriptContentSchema } from "./project.ts";
import { beatSheetSchema } from "./beat-sheet.ts";

const text = (max: number) => z.string().trim().min(1).max(max);
const key = z.string().regex(/^[a-z][a-z0-9-]{0,39}$/);
const references = z.array(key).max(20).refine((ids) => new Set(ids).size === ids.length, "Duplicate claim references.");
const sourceSchema = z.strictObject({
  id: key, title: text(200), url: z.url().max(2_000).refine((value) => {
    const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  }), notes: text(4_000),
});
export const briefSchema = z.strictObject({
  topic: text(300), audience: text(300), viewerProblem: text(1_000), payoff: text(1_000),
  format: z.enum(["explainer", "tutorial"]), targetSeconds: z.number().int().min(15).max(180),
  boundaries: text(2_000), sources: z.array(sourceSchema).min(1).max(12),
  claims: z.array(z.strictObject({ id: key, statement: text(1_000), sourceIds: references.min(1), caveat: z.string().max(1_000) })).min(1).max(20),
}).superRefine((brief, context) => {
  for (const list of [brief.sources, brief.claims]) {
    if (new Set(list.map((item) => item.id)).size !== list.length) context.addIssue({ code: "custom", message: "Source and claim IDs must be unique within their lists." });
  }
  for (const claim of brief.claims) if (claim.sourceIds.some((id) => !brief.sources.some((source) => source.id === id))) {
    context.addIssue({ code: "custom", message: "Every claim must reference supplied source notes." });
  }
});
export type WritingBrief = z.infer<typeof briefSchema>;

export const hooksSchema = z.strictObject({
  hooks: z.array(z.strictObject({ id: key, angle: text(300), spoken: text(500), openingVisual: text(1_000),
    overlay: z.string().max(120), payoffConnection: text(1_000), claimIds: references.min(1) })).min(3).max(5),
}).superRefine(({ hooks }, context) => {
  for (const field of ["id", "spoken", "angle"] as const) {
    if (new Set(hooks.map((hook) => hook[field].trim().toLowerCase())).size !== hooks.length) context.addIssue({ code: "custom", message: "Hooks need distinct IDs, spoken lines and angles." });
  }
});
export type HookOptions = z.infer<typeof hooksSchema>;
export function parseGeneratedHooks(input: unknown): HookOptions {
  const proposed = z.strictObject({ hooks: z.array(hooksSchema.shape.hooks.element.extend({ id: z.string().max(500).optional() })).min(3).max(5) }).parse(input);
  // IDs identify saved options; the model only owns their creative content.
  return hooksSchema.parse({ hooks: proposed.hooks.map((hook, index) => ({ ...hook, id: `hook-${index + 1}` })) });
}
export const scriptLinesSchema = z.strictObject({ lines: z.array(z.strictObject({ text: text(800).refine((line) => !/[\r\n]/.test(line), "Use one spoken line per entry."), claimIds: references })).min(3).max(60), beatSheet: beatSheetSchema.optional() }).refine((script) => !script.beatSheet || script.beatSheet.lines.length === script.lines.length && script.beatSheet.lines.every((line, index) => line.lineNumber === index + 1), "Beat sheet must cover every script line once in order.");
export type ScriptLines = z.infer<typeof scriptLinesSchema>;
export const editorialSchema = z.strictObject({
  verdict: z.enum(["ready", "revise"]), summary: text(2_000),
  findings: z.array(z.strictObject({ line: z.number().int().positive().nullable(), reason: text(1_000), change: text(1_000) })).max(30),
}).refine((review) => (review.verdict === "ready") === (review.findings.length === 0), "A rejected draft requires concrete findings; ready drafts cannot have unresolved findings.");

const skillSchema = z.strictObject({ name: text(80), path: text(1_000), sha256: z.string().regex(/^[a-f0-9]{64}$/) });
export const writingOutputSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("brief"), brief: briefSchema }),
  z.strictObject({ kind: z.literal("hooks"), ...hooksSchema.shape, skills: z.array(skillSchema).min(1) }),
  z.strictObject({ kind: z.literal("draft"), hookId: key, original: scriptLinesSchema, refined: scriptLinesSchema,
    review: editorialSchema, skills: z.array(skillSchema).min(1) }),
]);
export type WritingOutput = z.infer<typeof writingOutputSchema>;
export const writingArtifactSchema = z.strictObject({ creativeRules: creativeSnapshotSchema.optional(),
  modelCalls: z.array(z.strictObject({ role: z.enum(["writer", "critic"]), stage: text(200), model: text(200) })).max(3).optional(),
  schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(),
  parentId: z.uuid().nullable(), parentHash: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  baseRevisionId: z.uuid().nullable(), output: writingOutputSchema,
});
export type WritingArtifact = z.infer<typeof writingArtifactSchema>;
export const writingRequestSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("hooks"), parentId: z.uuid(), instruction: z.string().trim().max(2_000) }),
  z.strictObject({ kind: z.literal("draft"), parentId: z.uuid(), hookId: key, instruction: z.string().trim().max(2_000) }),
]);

export function validateClaims(lines: ScriptLines, brief: WritingBrief) {
  for (const line of lines.lines) if (line.claimIds.some((id) => !brief.claims.some((claim) => claim.id === id))) throw new Error("Unknown claim reference.");
  scriptContentSchema.parse(lines.lines.map((line) => line.text).join("\n"));
}

export function validateDraft(original: ScriptLines, refined: ScriptLines, brief: WritingBrief, hook: HookOptions["hooks"][number]) {
  validateClaims(original, brief); validateClaims(refined, brief);
  if (original.lines[0].text !== hook.spoken || refined.lines[0].text !== hook.spoken) throw new Error("The selected hook must be preserved.");
  const claims = (script: ScriptLines) => [...new Set(script.lines.flatMap((line) => line.claimIds))].sort().join(",");
  if (claims(original) !== brief.claims.map((claim) => claim.id).sort().join(",")) throw new Error("The draft must cover every brief claim.");
  if ([...original.lines[0].claimIds].sort().join(",") !== [...hook.claimIds].sort().join(",")) throw new Error("Opening claim references must match the selected hook.");
  if (claims(original) !== claims(refined)) throw new Error("Refinement added or dropped claim coverage.");
}
