import { z } from "zod";
import type { VisualArtifact } from "./visuals.ts";

const key = z.string().regex(/^[a-z][a-z0-9-]{0,39}$/);
const frame = z.number().int().min(0).max(5400);
const stateFields = {
  x: z.number().min(-100).max(200), y: z.number().min(-100).max(200), width: z.number().positive().max(100), height: z.number().positive().max(100),
  opacity: z.number().min(0).max(1), rotation: z.number().min(-360).max(360), scale: z.number().min(.1).max(4),
  color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
};
export const motionStateSchema = z.strictObject(stateFields);
const cameraSchema = motionStateSchema.pick({ x: true, y: true, rotation: true, scale: true });
export const motionObjectSchema = z.strictObject({
  id: key.refine((id) => id !== "camera", "camera is a reserved target"),
  startIndex: z.number().int().min(0).max(15).nullable(), endIndex: z.number().int().min(0).max(15).nullable(),
  type: z.enum(["rect", "ellipse", "text", "line"]), label: z.string().max(60), initial: motionStateSchema,
});
export const motionActionSchema = z.strictObject({
  behavior: z.enum(["transform", "fade", "hold"]), targetIds: z.array(key).min(1).max(16),
  startFrame: frame, endFrame: frame, staggerFrames: z.number().int().min(0).max(1800),
  ease: z.enum(["linear", "smooth", "power2.inOut", "power3.out"]), to: z.strictObject(stateFields).partial(),
});
export const motionShotSchema = z.strictObject({
  id: key, sourceIndex: z.number().int().min(0).max(39), sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
  lineNumbers: z.array(z.number().int().positive()).min(1).max(200), durationFrames: z.number().int().min(2).max(1800),
  objects: z.array(motionObjectSchema).min(1).max(16), actions: z.array(motionActionSchema).max(64),
  camera: cameraSchema,
  incoming: z.strictObject({
    type: z.enum(["start", "hard-cut", "match-cut", "continuous", "camera", "reveal", "split-screen", "motion-match"]),
    overlapFrames: z.number().int().min(0).max(1799), presentation: z.enum(["cut", "fade", "wipe", "shared"]),
    anchor: z.strictObject({ previousObjectId: key, objectId: key }).nullable(),
  }),
});
export const motionPlanSchema = z.strictObject({
  schemaVersion: z.literal(1), width: z.literal(1080), height: z.literal(1920), fps: z.literal(30),
  interpreterVersion: z.literal("1"), shots: z.array(motionShotSchema).min(1).max(40),
});
export type MotionPlan = z.infer<typeof motionPlanSchema>;
export type MotionShot = z.infer<typeof motionShotSchema>;
export type MotionState = z.infer<typeof motionStateSchema>;
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const motionSourceSchema = z.strictObject({ storyboardId: z.uuid(), storyboardHash: hashSchema, scriptId: z.uuid(), scriptHash: hashSchema, selectionId: z.uuid() });
export const motionRequestSchema = z.strictObject({ storyboardId: z.uuid(), baseId: z.uuid().nullable(), shotId: key.nullable(), instruction: z.string().trim().max(2000) });
export const motionArtifactSchema = z.strictObject({ schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(), parentId: z.uuid().nullable(), source: motionSourceSchema, plan: motionPlanSchema });
export type MotionArtifact = z.infer<typeof motionArtifactSchema>;
export const generatedMotionShotSchema = motionShotSchema.omit({ id: true, sourceIndex: true, sourceHash: true, lineNumbers: true, objects: true }).extend({
  objects: z.array(motionObjectSchema.pick({ id: true, startIndex: true, endIndex: true })).min(1).max(16),
});
export const generatedMotionSchema = z.strictObject({ shots: z.array(generatedMotionShotSchema).min(1).max(40) });
export const scopedMotionSchema = motionShotSchema.pick({ actions: true, camera: true, durationFrames: true, incoming: true });

export function hydrateMotion(input: unknown, board: VisualArtifact, hashShot: (shot: unknown) => string, base?: MotionPlan) {
  const proposal = generatedMotionSchema.parse(input);
  if (board.output.kind !== "storyboard" || proposal.shots.length !== board.output.shots.length) throw new Error("Motion proposal must cover the complete storyboard.");
  const source = board.output.shots;
  return motionPlanSchema.parse({ schemaVersion: 1, width: 1080, height: 1920, fps: 30, interpreterVersion: "1", shots: proposal.shots.map((shot, index) => ({
    ...shot, id: base?.shots[index]?.sourceHash === hashShot(source[index]) ? base.shots[index].id : `shot-${index + 1}`,
    sourceIndex: index, sourceHash: hashShot(source[index]), lineNumbers: source[index].lineNumbers,
    objects: shot.objects.map((object) => {
      const shape = object.startIndex === null ? object.endIndex === null ? null : source[index].endFrame.shapes[object.endIndex] : source[index].startFrame.shapes[object.startIndex];
      if (!shape) throw new Error("Object correspondence references a missing shape.");
      return { ...object, type: shape.type, label: shape.label, initial: { x: shape.x, y: shape.y, width: shape.width, height: shape.height, color: shape.color, opacity: object.startIndex === null ? 0 : 1, scale: 1, rotation: 0 } };
    }),
  })) });
}

export function scheduleMotion(input: unknown) {
  const plan = motionPlanSchema.parse(input); let end = 0;
  const shots = plan.shots.map((shot, index) => {
    const previous = plan.shots[index - 1]; const overlap = shot.incoming.overlapFrames;
    if ((index === 0) !== (shot.incoming.type === "start") || !previous && overlap) throw new Error("Invalid first-shot boundary.");
    if (previous && (overlap >= previous.durationFrames || overlap >= shot.durationFrames || previous.incoming.overlapFrames + overlap > previous.durationFrames)) throw new Error("Invalid transition overlap.");
    if (["start", "hard-cut", "match-cut", "continuous", "motion-match"].includes(shot.incoming.type) && overlap) throw new Error("This boundary requires zero overlap.");
    if (overlap ? !["fade", "wipe"].includes(shot.incoming.presentation) : ["fade", "wipe"].includes(shot.incoming.presentation)) throw new Error("Transition presentation does not match its interval.");
    if (["continuous", "motion-match"].includes(shot.incoming.type) !== (shot.incoming.presentation === "shared")) throw new Error("Continuous handoffs require a shared presentation.");
    const start = end - overlap; end = start + shot.durationFrames;
    return { shotId: shot.id, startFrame: start, endFrame: end, durationFrames: shot.durationFrames };
  });
  return { shots, durationFrames: end };
}

export function validateMotion(input: unknown, board: VisualArtifact, hashShot: (shot: unknown) => string) {
  const plan = motionPlanSchema.parse(input);
  if (board.output.kind !== "storyboard" || board.output.shots.length !== plan.shots.length) throw new Error("Motion must cover the accepted storyboard exactly.");
  const sourceShots = board.output.shots; scheduleMotion(plan);
  if (new Set(plan.shots.map((shot) => shot.id)).size !== plan.shots.length) throw new Error("Duplicate motion shot ID.");
  for (const [index, shot] of plan.shots.entries()) {
    const source = sourceShots[index];
    if (shot.sourceIndex !== index || shot.sourceHash !== hashShot(source) || JSON.stringify(shot.lineNumbers) !== JSON.stringify(source.lineNumbers) || shot.incoming.type !== source.transition) throw new Error("Motion storyboard identity mismatch.");
    const ids = new Set(shot.objects.map((object) => object.id));
    if (ids.size !== shot.objects.length) throw new Error("Duplicate object ID.");
    const starts = shot.objects.flatMap((object) => object.startIndex === null ? [] : [object.startIndex]);
    const ends = shot.objects.flatMap((object) => object.endIndex === null ? [] : [object.endIndex]);
    for (const [references, shapes] of [[starts, source.startFrame.shapes], [ends, source.endFrame.shapes]] as const) {
      if (references.length !== shapes.length || new Set(references).size !== shapes.length || references.some((ref) => !shapes[ref])) throw new Error("Explicit object correspondence must cover both drawings exactly.");
    }
    const finalStates = new Map<string, MotionState>();
    for (const object of shot.objects) {
      const from = object.startIndex === null ? null : source.startFrame.shapes[object.startIndex];
      const to = object.endIndex === null ? null : source.endFrame.shapes[object.endIndex]; const initial = from ?? to;
      if (!initial || [from, to].some((shape) => shape && (shape.type !== object.type || shape.label !== object.label))) throw new Error("Unsupported primitive or label correspondence.");
      if (["x", "y", "width", "height", "color"].some((field) => object.initial[field as keyof MotionState] !== initial[field as keyof typeof initial]) || object.initial.opacity !== (from ? 1 : 0) || object.initial.scale !== 1 || object.initial.rotation !== 0) throw new Error("Initial object state must match its drawing.");
      finalStates.set(object.id, { ...object.initial });
    }
    const intervals = new Map<string, { start: number; end: number }[]>();
    let previousStart = -1;
    for (const action of shot.actions) {
      if (action.startFrame < previousStart || action.endFrame <= action.startFrame || action.endFrame + action.staggerFrames * (action.targetIds.length - 1) >= shot.durationFrames || new Set(action.targetIds).size !== action.targetIds.length) throw new Error("Invalid or unordered action interval.");
      previousStart = action.startFrame;
      const properties = Object.keys(action.to);
      if (action.behavior === "hold" ? properties.length !== 0 : properties.length === 0 || action.behavior === "fade" && properties.some((name) => name !== "opacity")) throw new Error("Invalid motion behavior properties.");
      for (const [offset, id] of action.targetIds.entries()) {
        if (!ids.has(id) && id !== "camera") throw new Error("Unknown motion target.");
        if (id === "camera" && properties.some((name) => !["x", "y", "scale", "rotation"].includes(name))) throw new Error("Unsupported camera property.");
        const start = action.startFrame + offset * action.staggerFrames, end = action.endFrame + offset * action.staggerFrames;
        const held = intervals.get(`${id}:*`) ?? [];
        if (held.some((span) => start < span.end && end > span.start)) throw new Error("Motion overlaps a reading hold.");
        for (const property of action.behavior === "hold" ? ["*"] : properties) {
          const key = `${id}:${property}`; const spans = intervals.get(key) ?? [];
          if (spans.some((span) => start < span.end && end > span.start)) throw new Error("Two actions own the same property interval.");
          if (spans.some((span) => start < span.start)) throw new Error("Expanded target actions must remain chronological.");
          if (property === "*" && [...intervals].some(([name, values]) => name.startsWith(`${id}:`) && values.some((span) => start < span.end && end > span.start))) throw new Error("Reading hold overlaps motion.");
          spans.push({ start, end }); intervals.set(key, spans);
        }
        if (id !== "camera") Object.assign(finalStates.get(id)!, action.to);
      }
    }
    for (const object of shot.objects) {
      const state = finalStates.get(object.id)!; const end = object.endIndex === null ? null : source.endFrame.shapes[object.endIndex];
      if (end ? ["x", "y", "width", "height", "color"].some((field) => state[field as keyof MotionState] !== end[field as keyof typeof end]) || state.opacity !== 1 || state.scale !== 1 || state.rotation !== 0 : state.opacity !== 0) throw new Error("Final visible state must match the end drawing.");
    }
    const anchored = ["match-cut", "continuous", "motion-match"].includes(shot.incoming.type);
    if (anchored !== !!shot.incoming.anchor) throw new Error("Boundary anchor is required only for a matched/shared handoff.");
    if (shot.incoming.anchor) {
      const previous = plan.shots[index - 1]; const from = previous?.objects.find((object) => object.id === shot.incoming.anchor!.previousObjectId);
      const to = shot.objects.find((object) => object.id === shot.incoming.anchor!.objectId);
      if (!from || !to || from.type !== to.type || from.endIndex === null || to.startIndex === null) throw new Error("Invalid shared anchor.");
      const before = sourceShots[index - 1].endFrame.shapes[from.endIndex]; const after = source.startFrame.shapes[to.startIndex];
      if (["x", "y", "width", "height"].some((field) => before[field as keyof typeof before] !== after[field as keyof typeof after])) throw new Error("Shared anchor geometry is discontinuous.");
      if (["continuous", "motion-match"].includes(shot.incoming.type) && (before.color !== after.color || from.label !== to.label)) throw new Error("Continuous anchor appearance must remain unchanged.");
      const camera = { ...previous.camera };
      for (const action of previous.actions) if (action.targetIds.includes("camera")) Object.assign(camera, action.to);
      if (Object.keys(camera).some((field) => camera[field as keyof typeof camera] !== shot.camera[field as keyof typeof camera])) throw new Error("Shared anchor camera is discontinuous.");
    }
  }
  return plan;
}
