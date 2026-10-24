import { z } from "zod";
import { componentPartsSchema, componentRegistry, isComponent, chartValuesSchema } from "./components.ts";

const text = z.string().trim().min(1).max(1200);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const position = z.number().min(0).max(100);
export const primitiveSchema = z.enum(["rect", "ellipse", "text", "centered-text", "heading", "caption", "code", "line", "document", "browser", "database", "server", "cloud", "person", "chip", "coin", "inbox-panel@1", "approval-flow@1", "api-flow@1", "cost-chart@1", "kinetic-phrase@1", "funnel@1"]);
// Only declarative shapes cross the model boundary; markup, URLs and code never do.
export const frameSchema = z.strictObject({
  background: color,
  shapes: z.array(z.strictObject({
    type: primitiveSchema,
    x: position, y: position, width: z.number().positive().max(100), height: z.number().positive().max(100),
    color, label: z.string().max(60),
    parts: componentPartsSchema.optional(),
    values: chartValuesSchema.optional(),
  }).superRefine((shape, context) => {
    if (shape.x + shape.width > 100 || shape.y + shape.height > 100) context.addIssue({ code: "custom", message: "Shape exceeds the frame." });
    if (shape.parts && (!isComponent(shape.type) || Object.keys(shape.parts).some((part) => !(componentRegistry[shape.type as keyof typeof componentRegistry] as readonly string[]).includes(part)))) context.addIssue({ code: "custom", message: "Only registered component parts are allowed." });
    if ((shape.type === "cost-chart@1") !== (shape.values !== undefined)) context.addIssue({ code: "custom", message: "Only charts require supplied integer values." });
    if (shape.type === "kinetic-phrase@1" && (!shape.label.trim() || shape.label.trim().split(/\s+/).length > 5)) context.addIssue({ code: "custom", message: "Kinetic phrases require one to five words." });
  })).min(1).max(16),
});
export const conceptsSchema = z.strictObject({ concepts: z.array(z.strictObject({
  title: z.string().trim().min(1).max(100), metaphor: text, teachingApproach: text, visualLanguage: text, frame: frameSchema,
})).length(3) }).superRefine(({ concepts }, context) => {
  if (new Set(concepts.map((item) => item.title.toLowerCase())).size !== 3 || new Set(concepts.map((item) => item.metaphor.toLowerCase())).size !== 3) {
    context.addIssue({ code: "custom", message: "Provide three distinct concepts." });
  }
});
export const shotSchema = z.strictObject({
  lineNumbers: z.array(z.number().int().positive()).min(1).max(200),
  seconds: z.number().min(0.5).max(60), purpose: text, framing: text, subject: text, action: text,
  transition: z.enum(["start", "hard-cut", "match-cut", "continuous", "camera", "reveal", "split-screen", "motion-match"]),
  continuity: text, startFrame: frameSchema, endFrame: frameSchema,
});
export const storyboardSchema = z.strictObject({ shots: z.array(shotSchema).min(1).max(40) });
export const visualOutputSchema = z.discriminatedUnion("kind", [
  conceptsSchema.safeExtend({ kind: z.literal("concepts") }),
  storyboardSchema.extend({ kind: z.literal("storyboard") }),
]);
export const visualRequestSchema = z.strictObject({
  kind: z.enum(["concepts", "storyboard", "shot"]), scriptId: z.uuid(),
  selectionId: z.uuid().nullable(), baseId: z.uuid().nullable(), shotIndex: z.number().int().min(0).max(39).nullable(),
  instruction: z.string().trim().max(2000),
}).superRefine((request, context) => {
  if (request.kind === "concepts" ? request.selectionId !== null || request.shotIndex !== null : !request.selectionId ||
    (request.kind === "shot" ? !request.baseId || request.shotIndex === null : request.shotIndex !== null)) {
    context.addIssue({ code: "custom", message: "Invalid visual request context." });
  }
});
export const visualArtifactSchema = z.strictObject({
  schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(),
  scriptId: z.uuid(), scriptHash: z.string().regex(/^[a-f0-9]{64}$/), selectionId: z.uuid().nullable(),
  baseId: z.uuid().nullable(), instruction: z.string().max(2000), output: visualOutputSchema,
});
export type VisualArtifact = z.infer<typeof visualArtifactSchema>;
export type VisualRequest = z.infer<typeof visualRequestSchema>;
export type VisualOutput = z.infer<typeof visualOutputSchema>;
export type Frame = z.infer<typeof frameSchema>;

export function scriptLines(content: string) {
  return content.split("\n").map((text, index) => ({ number: index + 1, text })).filter((line) => line.text.trim());
}

export function validateStoryboard(input: unknown, content: string) {
  const parsed = storyboardSchema.extend({ kind: z.literal("storyboard").optional() }).parse(input);
  const board = { shots: parsed.shots }; const lines = scriptLines(content); const covered: number[] = [];
  board.shots.forEach((shot, index) => {
    if ((index === 0) !== (shot.transition === "start")) throw new Error("Only the first shot starts without a preceding transition.");
    for (const line of shot.lineNumbers) {
      if (!lines.some((item) => item.number === line)) throw new Error("Shot references a missing narration line.");
      covered.push(line);
    }
  });
  if (covered.length !== lines.length || covered.some((line, index) => line !== lines[index].number)) throw new Error("Shots must cover each narration line once, in order.");
  return board;
}

export function replaceShot(base: unknown, index: number, replacement: unknown, content: string) {
  const board = validateStoryboard(base, content); const shot = shotSchema.parse(replacement);
  if (!board.shots[index] || JSON.stringify(shot.lineNumbers) !== JSON.stringify(board.shots[index].lineNumbers)) throw new Error("Shot revision must preserve narration references.");
  return validateStoryboard({ shots: board.shots.map((item, i) => i === index ? shot : item) }, content);
}
