import { creativeSnapshotSchema } from "./creative-rules.ts";
import { z } from "zod";
import { variableTypeReferenceSchema, variableExpression } from "./variable-type.ts";
import { typographySchema } from "./typography.ts";
import { comparisonReferenceSchema } from "./comparison.ts";
import { morphReferenceSchema } from "./morphs.ts";
import { numericReferenceSchema } from "./numeric.ts";
import { perspectiveReferenceSchema } from "./perspective.ts";
import { collageReferenceSchema, editorialCollage } from "./raster.ts";
import { morphChainSchema } from "./semantic-morphs.ts";
import { rigReferenceSchema, characterRig } from "./character-rig.ts";
import { uiWorkflowSchema } from "./ui-workflow.ts";
import { componentPartsSchema, componentLayerIds, isComponent, chartValuesSchema } from "./components.ts";

import { graphicReferenceSchema, validGraphicReference, isGraphicAsset, assetMetadata } from "./graphic-assets.ts";

import { diagramSchema } from "./diagram.ts";
import { artDirectionSchema, backgroundSchema } from "./art-direction.ts";
import { beatSheetSchema } from "./beat-sheet.ts";

const text = z.string().trim().min(1).max(1200);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const position = z.number().min(0).max(100);
export const primitiveSchema = z.enum(["payment-terminal@1", "banking-balance@1", "variable-type@1", "perspective-scene@1", "editorial-collage@1", "morph-chain@1", "character-rig@1", "ui-workflow@1", "numeric-display@1", "morph-shape@1", "data-comparison@1", "rect", "ellipse", "text", "centered-text", "heading", "caption", "code", "line", "document", "browser", "database", "server", "cloud", "person", "chip", "coin", "inbox-panel@1", "approval-flow@1", "api-flow@1", "cost-chart@1", "kinetic-phrase@1", "funnel@1", "complaint-workflow@1", "graphic-asset@2", "semantic-diagram@1"]);
// Only declarative shapes cross the model boundary; markup, URLs and code never do.
export const frameSchema = z.strictObject({
  background: color,
  environment: backgroundSchema.optional(),
  shapes: z.array(z.strictObject({
    type: primitiveSchema,
    x: position, y: position, width: z.number().positive().max(100), height: z.number().positive().max(100),
    color, label: z.string().max(60),
    typography: typographySchema.optional(),
    comparison: comparisonReferenceSchema.optional(),
    morph: morphReferenceSchema.optional(),
    numeric: numericReferenceSchema.optional(),
    ui: uiWorkflowSchema.optional(),
    rig: rigReferenceSchema.optional(),
    morphChain: morphChainSchema.optional(),
    collage: collageReferenceSchema.optional(),
    variableType: variableTypeReferenceSchema.optional(),
    perspective: perspectiveReferenceSchema.optional(),
    asset: graphicReferenceSchema.optional(),
    diagram: diagramSchema.optional(),
    parts: componentPartsSchema.optional(),
    values: chartValuesSchema.optional(),
  }).superRefine((shape, context) => {
    if (["payment-terminal@1", "banking-balance@1"].includes(shape.type) && Object.values(shape.parts ?? {}).some(state => state.x !== 0 || state.y !== 0 || state.scale !== 1)) context.addIssue({code:"custom",message:"Finance surfaces have fixed part geometry; transform the root."});
    if (shape.type === "payment-terminal@1" && Object.values(shape.parts ?? {}).filter(state => state.opacity > 0 && (state.reveal ?? 1) > 0).length > 1) context.addIssue({code:"custom",message:"Terminal endpoint must show at most one status."});
    if ((shape.type === "variable-type@1") !== !!shape.variableType || shape.variableType && (shape.label !== variableExpression(shape.variableType).label || shape.typography || shape.parts?.glyphs?.axisProgress === undefined || shape.parts.glyphs.x !== 0 || shape.parts.glyphs.y !== 0 || shape.parts.glyphs.scale !== 1 || shape.parts.glyphs.opacity !== 1)) context.addIssue({code:"custom",message:"Variable typography requires its exact authored label and fixed visible glyphs with explicit progress."});
    if (Object.entries(shape.parts ?? {}).some(([id,state]) => state.axisProgress !== undefined && (shape.type !== "variable-type@1" || id !== "glyphs"))) context.addIssue({code:"custom",message:"Axis progress belongs to variable-font glyphs."});
    if ((shape.type === "perspective-scene@1") !== !!shape.perspective || shape.perspective && (shape.label !== "" || Math.abs(shape.width * 1080 / (shape.height * 1920) - 1) > .001 || !shape.parts?.camera || ["cameraX", "cameraY", "cameraZ", "depthProgress"].some((field) => shape.parts!.camera[field as keyof typeof shape.parts.camera] === undefined) || shape.parts.camera.opacity !== 1 || (shape.parts.camera.reveal ?? 1) !== 1 || shape.parts.camera.x !== 0 || shape.parts.camera.y !== 0 || shape.parts.camera.scale !== 1)) context.addIssue({code:"custom",message:"Perspective needs its registered square scene and visible fixed camera part with explicit depth pose."});
    if (Object.entries(shape.parts ?? {}).some(([id,state]) => ["cameraX", "cameraY", "cameraZ", "depthProgress"].some((field) => state[field as keyof typeof state] !== undefined) && (shape.type !== "perspective-scene@1" || id !== "camera"))) context.addIssue({code:"custom",message:"Depth pose belongs to the perspective camera part."});
    if ((shape.type === "editorial-collage@1") !== !!shape.collage || shape.collage && (shape.label !== editorialCollage.label || Math.abs(shape.height - shape.width * .75) > .001)) context.addIssue({ code: "custom", message: "Collage needs its reviewed identity, fixed heading and 3:4 aspect." });
    if ((shape.type === "morph-chain@1") !== !!shape.morphChain) context.addIssue({ code: "custom", message: "Semantic morph requires its exact curated chain." });
    if (shape.morphChain && (shape.parts?.outline?.morphStage === undefined || shape.parts.outline.morphStage > shape.morphChain.pairs.length || Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1) || Math.abs(shape.width * 1080 / (shape.height * 1920) - 1) > .001)) context.addIssue({ code: "custom", message: "Morph chain requires a valid explicit stage and fixed square geometry." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.morphStage !== undefined && (shape.type !== "morph-chain@1" || id !== "outline"))) context.addIssue({ code: "custom", message: "Morph stage requires the curated chain outline." });
    if ((shape.type === "character-rig@1") !== !!shape.rig) context.addIssue({ code: "custom", message: "Character requires its exact reviewed rig." });
    if (shape.rig && (["body", "document", "laptop"].some((id) => !shape.parts?.[id] || shape.parts[id].opacity !== 1 || (shape.parts[id].reveal ?? 1) !== 1 || shape.parts[id].x !== 0 || shape.parts[id].y !== 0 || shape.parts[id].scale !== 1) || shape.parts?.body.rigProgress !== 0 || shape.parts?.document.handoffProgress === undefined)) context.addIssue({ code: "custom", message: "Rig parts must be visible, unmasked and fixed, with neutral body and explicit document state." });
    if (shape.rig && Math.abs(shape.width * 1080 / (shape.height * 1920) - characterRig.width / characterRig.height) > .001) context.addIssue({ code: "custom", message: "Character requires its registered aspect ratio." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.rigProgress !== undefined && (shape.type !== "character-rig@1" || id !== "body") || state.handoffProgress !== undefined && (shape.type !== "character-rig@1" || id !== "document"))) context.addIssue({ code: "custom", message: "Rig progress requires the reviewed body or document part." });
    if ((shape.type === "ui-workflow@1") !== !!shape.ui) context.addIssue({ code: "custom", message: "UI workflow requires an exact field contract." });
    if (shape.ui && (shape.parts?.surface?.uiStage === undefined || Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1))) context.addIssue({ code: "custom", message: "UI state is explicit and internal field geometry is fixed." });
    if (shape.ui && shape.parts?.surface?.uiStage === 4 && ["category", "draft"].some((id) => shape.parts?.[id]?.opacity !== 1 || (shape.parts?.[id]?.reveal ?? 1) !== 1)) context.addIssue({ code: "custom", message: "Review state must preserve all supplied result fields." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.uiStage !== undefined && (shape.type !== "ui-workflow@1" || id !== "surface"))) context.addIssue({ code: "custom", message: "UI stage requires the workflow surface." });
    if ((shape.type === "numeric-display@1") !== !!shape.numeric) context.addIssue({ code: "custom", message: "Numeric display requires an exact source reference." });
    if (shape.numeric && Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1)) context.addIssue({ code: "custom", message: "Numeric cells have fixed geometry; transform the root." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.numericProgress !== undefined && (shape.type !== "numeric-display@1" || id !== "digits"))) context.addIssue({ code: "custom", message: "Numeric progress requires the numeric digits part." });
    if ((shape.type === "morph-shape@1") !== !!shape.morph) context.addIssue({ code: "custom", message: "Morph shape requires a curated pair reference." });
    if (shape.type === "morph-shape@1" && Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1)) context.addIssue({ code: "custom", message: "Morph outline geometry is fixed; transform its root." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.morphProgress !== undefined && (shape.type !== "morph-shape@1" || id !== "outline"))) context.addIssue({ code: "custom", message: "Morph progress requires a curated outline." });
    if ((shape.type === "data-comparison@1") !== !!shape.comparison) context.addIssue({ code: "custom", message: "Data comparison requires a supplied source reference." });
    if (shape.type === "data-comparison@1" && Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1)) context.addIssue({ code: "custom", message: "Comparison bar geometry is fixed to its common scale." });
    if (shape.typography && (!["text", "heading", "caption", "centered-text"].includes(shape.type) || shape.label.split(/\r?\n/).length > 2 || shape.label.split(/\r?\n/).some((line) => !line.trim()))) context.addIssue({ code: "custom", message: "Typography requires one or two authored text lines." });
    if (!validGraphicReference(shape.type, shape.asset)) context.addIssue({ code: "custom", message: "Graphic asset identity or hash is invalid." });
    const metadata = shape.asset && assetMetadata(shape.asset.id);
    if (metadata && Math.abs(shape.width * 1080 / (shape.height * 1920) - metadata.width / metadata.height) > .001) context.addIssue({ code: "custom", message: "Graphic artwork requires its registered aspect ratio." });
    if ((shape.type === "semantic-diagram@1") !== (shape.diagram !== undefined)) context.addIssue({ code: "custom", message: "Only semantic diagrams require graph data." });
    if (shape.diagram && Object.values(shape.parts ?? {}).some((state) => state.x !== 0 || state.y !== 0 || state.scale !== 1)) context.addIssue({ code: "custom", message: "Diagram layer geometry is fixed to preserve semantic connections." });
    if (Object.entries(shape.parts ?? {}).some(([id, state]) => state.strokeProgress !== undefined && !shape.diagram?.edges.some((edge) => edge.id === id))) context.addIssue({ code: "custom", message: "Stroke progress requires a diagram edge." });
    if (shape.x + shape.width > 100 || shape.y + shape.height > 100) context.addIssue({ code: "custom", message: "Shape exceeds the frame." });
    if (shape.parts && (!isComponent(shape.type) || Object.keys(shape.parts).some((part) => !componentLayerIds(shape.type as import("./components.ts").ComponentType, shape).includes(part)))) context.addIssue({ code: "custom", message: "Only registered component parts are allowed." });
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
  beatSheet: beatSheetSchema.optional(),
  design: artDirectionSchema.optional(),
  lineNumbers: z.array(z.number().int().positive()).min(1).max(200),
  seconds: z.number().min(0.5).max(60), purpose: text, framing: text, subject: text, action: text,
  transition: z.enum(["start", "hard-cut", "match-cut", "continuous", "camera", "reveal", "split-screen", "motion-match"]),
  continuity: text, startFrame: frameSchema, endFrame: frameSchema,
}).refine((shot) => !shot.beatSheet || JSON.stringify(shot.beatSheet.lines.map((line) => line.lineNumber)) === JSON.stringify(shot.lineNumbers), "Beat sheet must cover the shot's narration lines once in order.");
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
export const visualArtifactSchema = z.strictObject({ creativeRules: creativeSnapshotSchema.optional(),
  schemaVersion: z.union([z.literal(1), z.literal(2)]), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(),
  scriptId: z.uuid(), scriptHash: z.string().regex(/^[a-f0-9]{64}$/), selectionId: z.uuid().nullable(),
  baseId: z.uuid().nullable(), instruction: z.string().max(2000), output: visualOutputSchema,
}).superRefine((artifact, context) => {
  if (artifact.schemaVersion === 1 && visualSchemaVersion(artifact.output) === 2) context.addIssue({ code: "custom", message: "Graphic assets require visual artifact version 2." });
});
export function visualSchemaVersion(output: z.infer<typeof visualOutputSchema>) {
  const frames = output.kind === "concepts" ? output.concepts.map((concept) => concept.frame) : output.shots.flatMap((shot) => [shot.startFrame, shot.endFrame]);
  return frames.some((frame) => frame.environment || frame.shapes.some((shape) => isGraphicAsset(shape.type) || shape.diagram)) || output.kind === "storyboard" && output.shots.some((shot) => shot.design) ? 2 : 1;
}
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
    if (JSON.stringify(shot.startFrame.environment) !== JSON.stringify(shot.endFrame.environment)) throw new Error("Background environments must remain fixed within a shot; use a scene boundary for changes.");
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
