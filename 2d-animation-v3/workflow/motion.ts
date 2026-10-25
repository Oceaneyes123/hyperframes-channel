import { z } from "zod";
import { primitiveSchema, type VisualArtifact } from "./visuals.ts";
import { expandBeats } from "../engine/motion-presets/index.ts";
import { componentPartsSchema, componentParts, isComponent, partStateSchema, chartValuesSchema } from "./components.ts";

import { graphicReferenceSchema, validGraphicReference } from "./graphic-assets.ts";

import { diagramSchema } from "./diagram.ts";
import { textMotionSchema } from "./text-motion.ts";
import { isTextType } from "../engine/text-metrics.ts";

const key = z.string().regex(/^[a-z][a-z0-9-]{0,39}$/);
const target = z.string().regex(/^[a-z][a-z0-9-]{0,39}(?:\.[a-z][a-z0-9-]{0,19})?$/);
export function splitPanel(progress: number, entering: boolean) {
  const departing = progress < .4 ? 1 - progress / .8 : progress <= .8 ? .5 : (1 - progress) * 2.5;
  return { width: entering ? 1 - departing : departing, left: entering ? departing : 0 };
}
const frame = z.number().int().min(0).max(5400);
const stateFields = {
  x: z.number().min(-100).max(200), y: z.number().min(-100).max(200), width: z.number().positive().max(100), height: z.number().positive().max(100),
  opacity: z.number().min(0).max(1), rotation: z.number().min(-360).max(360), scale: z.number().min(.1).max(4),
  color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  reveal: z.number().min(0).max(1).optional(),
};
export const motionStateSchema = z.strictObject(stateFields);
const cameraSchema = motionStateSchema.pick({ x: true, y: true, rotation: true, scale: true });
export const motionObjectSchema = z.strictObject({
  id: key.refine((id) => id !== "camera", "camera is a reserved target"),
  startIndex: z.number().int().min(0).max(15).nullable(), endIndex: z.number().int().min(0).max(15).nullable(),
  type: primitiveSchema, label: z.string().max(60), initial: motionStateSchema,
  asset: graphicReferenceSchema.optional(),
  diagram: diagramSchema.optional(),
  initialParts: componentPartsSchema.optional(),
  values: chartValuesSchema.optional(),
}).refine((object) => validGraphicReference(object.type, object.asset) && ((object.type === "semantic-diagram@1") === (object.diagram !== undefined)), "Graphic asset identity or hash is invalid.");
export const motionActionSchema = z.strictObject({
  behavior: z.enum(["transform", "fade", "hold"]), targetIds: z.array(target).min(1).max(16),
  startFrame: frame, endFrame: frame, staggerFrames: z.number().int().min(0).max(1800),
  ease: z.enum(["linear", "smooth", "power2.inOut", "power3.out"]), to: z.strictObject(stateFields).partial(),
});
export type MotionAction = z.infer<typeof motionActionSchema>;
const beatFields = {
  id: key, purpose: z.string().trim().min(1).max(300),
  type: z.enum(["entry", "anticipation", "transformation", "impact", "emphasis", "hold", "exit"]),
  targetIds: z.array(target).min(1).max(16), startFrame: frame, endFrame: frame,
  importance: z.enum(["primary", "supporting"]),
  narrationAnchor: z.discriminatedUnion("kind", [
    z.strictObject({ lineNumber: z.number().int().positive(), kind: z.literal("line"), offsetFrames: z.number().int().min(-30).max(30).optional() }),
    z.strictObject({ lineNumber: z.number().int().positive(), kind: z.enum(["phrase", "word"]), anchorId: key, offsetFrames: z.number().int().min(-30).max(30).optional() }),
  ]).nullable(),
  continuity: z.strictObject({ targetId: key, nextShotId: key }).nullable(),
};
export const motionBeatSchema = z.discriminatedUnion("presetId", [
  z.strictObject({ ...beatFields, presetId: z.literal("snap-overshoot@1"), parameters: z.strictObject({
    to: z.strictObject(stateFields).partial(), anticipation: z.number().min(.7).max(.95), overshoot: z.number().min(1.02).max(1.3),
  }) }),
  z.strictObject({ ...beatFields, type: z.literal("hold"), presetId: z.literal("hold@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("cascade@1"), parameters: z.strictObject({
    staggerFrames: z.number().int().min(2).max(6), offsetY: z.number().min(-20).max(20), overshoot: z.number().min(1.02).max(1.3),
  }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("converge-assemble@1"), parameters: z.strictObject({
    resultId: key, overshoot: z.number().min(1.02).max(1.3),
  }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("punch-zoom@1"), parameters: z.strictObject({
    focusId: key, zoom: z.number().min(1.02).max(1.4),
  }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("flow-handoff@1"), parameters: z.strictObject({
    destinationId: key, reactionScale: z.number().min(1.02).max(1.2),
  }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("split-disperse@1"), parameters: z.strictObject({
    childIds: z.array(key).min(2).max(6),
  }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("mask-reveal@1"), parameters: z.strictObject({ reveal: z.number().min(0).max(1) }) }),
]);
export type MotionBeat = z.infer<typeof motionBeatSchema>;
export const motionShotSchema = z.strictObject({
  id: key, sourceIndex: z.number().int().min(0).max(39), sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
  lineNumbers: z.array(z.number().int().positive()).min(1).max(200), durationFrames: z.number().int().min(2).max(1800),
  objects: z.array(motionObjectSchema).min(1).max(16), actions: z.array(motionActionSchema).max(64),
  beats: z.array(motionBeatSchema).min(1).max(32).optional(),
  textMotions: z.array(textMotionSchema).max(16).optional(),
  camera: cameraSchema,
  incoming: z.strictObject({
    type: z.enum(["start", "hard-cut", "match-cut", "continuous", "camera", "reveal", "split-screen", "motion-match"]),
    overlapFrames: z.number().int().min(0).max(1799), presentation: z.enum(["cut", "fade", "wipe", "shared", "slide", "split"]),
    anchor: z.strictObject({ previousObjectId: key, objectId: key }).nullable(),
  }),
});
export const energyProfileSchema = z.enum(["calm", "balanced", "energetic", "intense"]);
export type EnergyProfile = z.infer<typeof energyProfileSchema>;
export const motionPlanSchema = z.strictObject({
  schemaVersion: z.literal(1), width: z.literal(1080), height: z.literal(1920), fps: z.literal(30),
  interpreterVersion: z.enum(["1", "2", "3"]), shots: z.array(motionShotSchema).min(1).max(40),
  energyProfile: energyProfileSchema.optional(),
}).superRefine((plan, context) => {
  for (const [index, shot] of plan.shots.entries()) {
    const targets = new Set<string>();
    for (const motion of shot.textMotions ?? []) {
      const object = shot.objects.find((object) => object.id === motion.targetId);
      const holds = [...shot.actions.filter((action) => action.behavior === "hold"), ...(shot.beats ?? []).filter((beat) => beat.type === "hold")];
      if (!object || !isTextType(object.type) || !object.label.trim() || targets.has(motion.targetId) || motion.endFrame > shot.durationFrames - 13 ||
        shot.incoming.type === "continuous" && shot.incoming.anchor?.objectId === motion.targetId ||
        holds.some((hold) => hold.targetIds.includes(motion.targetId) && motion.startFrame < hold.endFrame && motion.endFrame > hold.startFrame)) {
        context.addIssue({ code: "custom", path: ["shots", index, "textMotions"], message: "Text motion requires a unique nonempty text target, 12 settled frames, no reading-hold overlap and no continuous anchor restart." });
      }
      targets.add(motion.targetId);
    }
    if (plan.interpreterVersion === "3" ? !shot.beats || shot.actions.length !== 0 : shot.beats !== undefined) {
      context.addIssue({ code: "custom", path: ["shots", index], message: "Interpreter 3 requires beats and empty actions; legacy interpreters require actions only." });
    }
  }
});
export type MotionPlan = z.infer<typeof motionPlanSchema>;
export type MotionShot = z.infer<typeof motionShotSchema>;
export type MotionState = z.infer<typeof motionStateSchema>;
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const motionSourceSchema = z.strictObject({ storyboardId: z.uuid(), storyboardHash: hashSchema, scriptId: z.uuid(), scriptHash: hashSchema, selectionId: z.uuid(), timingId: z.uuid().optional(), timingHash: hashSchema.optional() }).refine((source) => (source.timingId === undefined) === (source.timingHash === undefined), "Timing identity and hash must be supplied together.");
export const motionRequestSchema = z.strictObject({ storyboardId: z.uuid(), baseId: z.uuid().nullable(), shotId: key.nullable(), instruction: z.string().trim().max(2000), interpreterVersion: z.enum(["2", "3"]).optional(), energyProfile: energyProfileSchema.optional() });
export const motionArtifactSchema = z.strictObject({ schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(), parentId: z.uuid().nullable(), source: motionSourceSchema, plan: motionPlanSchema });
export type MotionArtifact = z.infer<typeof motionArtifactSchema>;
export const generatedMotionShotSchema = motionShotSchema.omit({ id: true, sourceIndex: true, sourceHash: true, lineNumbers: true, objects: true, beats: true }).extend({
  objects: z.array(z.strictObject({ id: motionObjectSchema.shape.id, startIndex: motionObjectSchema.shape.startIndex, endIndex: motionObjectSchema.shape.endIndex })).min(1).max(16),
});
export const generatedMotionSchema = z.strictObject({ shots: z.array(generatedMotionShotSchema).min(1).max(40) });
export const scopedMotionSchema = motionShotSchema.pick({ actions: true, camera: true, durationFrames: true, incoming: true, textMotions: true });
export const generatedBeatMotionSchema = z.strictObject({ shots: z.array(generatedMotionShotSchema.omit({ actions: true }).extend({ beats: z.array(motionBeatSchema).min(1).max(32) })).min(1).max(40) });
export const scopedBeatMotionSchema = motionShotSchema.pick({ camera: true, durationFrames: true, incoming: true, textMotions: true }).extend({ beats: z.array(motionBeatSchema).min(1).max(32) });

export function expandMotionShot(shot: MotionShot): MotionShot {
  const actions = shot.beats ? expandBeats(shot).map((action) => motionActionSchema.parse(action)) : shot.actions;
  if (actions.length > 64) throw new Error("Expanded beats exceed the shot action budget.");
  for (const motion of shot.textMotions ?? []) {
    const object = shot.objects.find((object) => object.id === motion.targetId)!;
    let opacity = object.initial.opacity;
    for (const action of actions) for (const [index, id] of action.targetIds.entries()) {
      if (id !== motion.targetId) continue;
      const start = action.startFrame + index * action.staggerFrames, end = action.endFrame + index * action.staggerFrames;
      if (end <= motion.startFrame && action.to.opacity !== undefined) opacity = action.to.opacity;
      if (action.behavior !== "hold" && start < motion.endFrame && end > motion.startFrame) throw new Error("Text treatment cannot overlap root actor motion; settle its entrance first.");
    }
    if (opacity !== 1 || /[\r\n]/u.test(object.label)) throw new Error("Text treatment requires a visible single-line actor.");
  }
  return { ...shot, actions };
}

export function hydrateMotion(input: unknown, board: VisualArtifact, hashShot: (shot: unknown) => string, base?: MotionPlan, version: "2" | "3" = "2", energyProfile: z.infer<typeof energyProfileSchema> = "energetic") {
  const proposal = version === "3" ? generatedBeatMotionSchema.parse(input) : generatedMotionSchema.parse(input);
  if (board.output.kind !== "storyboard" || proposal.shots.length !== board.output.shots.length) throw new Error("Motion proposal must cover the complete storyboard.");
  const source = board.output.shots;
  return motionPlanSchema.parse({ schemaVersion: 1, width: 1080, height: 1920, fps: 30, interpreterVersion: version, ...(version === "3" ? { energyProfile } : {}), shots: proposal.shots.map((shot, index) => ({
    ...shot, ...(version === "3" ? { actions: [] } : {}), id: base?.shots[index]?.sourceHash === hashShot(source[index]) ? base.shots[index].id : `shot-${index + 1}`,
    sourceIndex: index, sourceHash: hashShot(source[index]), lineNumbers: source[index].lineNumbers,
    objects: shot.objects.map((object) => {
      const shape = object.startIndex === null ? object.endIndex === null ? null : source[index].endFrame.shapes[object.endIndex] : source[index].startFrame.shapes[object.startIndex];
      if (!shape) throw new Error("Object correspondence references a missing shape.");
      return { ...object, type: shape.type, label: shape.label, ...(shape.asset ? { asset: shape.asset } : {}), ...(shape.diagram ? { diagram: shape.diagram } : {}), initial: { x: shape.x, y: shape.y, width: shape.width, height: shape.height, color: shape.color, opacity: object.startIndex === null ? 0 : 1, scale: 1, rotation: 0 }, ...(isComponent(shape.type) ? { initialParts: componentParts(shape.type, shape.color, shape.parts, shape) } : {}), ...(shape.values ? { values: shape.values } : {}) };
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
    if (overlap ? !["fade", "wipe", "slide", "split"].includes(shot.incoming.presentation) : ["fade", "wipe", "slide", "split"].includes(shot.incoming.presentation)) throw new Error("Transition presentation does not match its interval.");
    if (plan.interpreterVersion !== "1") {
      const presentations: Record<string, string[]> = { start: ["cut"], "hard-cut": ["cut"], "match-cut": ["cut"], continuous: ["shared"], camera: ["slide"], reveal: ["wipe"], "split-screen": ["split"] };
      if (!presentations[shot.incoming.type]?.includes(shot.incoming.presentation)) throw new Error(`Unsupported ${shot.incoming.type} presentation. No fallback is permitted.`);
      if (shot.incoming.type === "split-screen" && overlap < 15) throw new Error("Split-screen needs at least 15 comparison frames.");
    }
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
  const expandedShots = plan.shots.map(expandMotionShot);
  for (const [index, shot] of expandedShots.entries()) {
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
      if (JSON.stringify(object.asset) !== JSON.stringify(initial.asset) || to && JSON.stringify(to.asset) !== JSON.stringify(initial.asset)) throw new Error("Graphic asset references must match both approved drawings.");
      if (JSON.stringify(object.diagram) !== JSON.stringify(initial.diagram) || to && JSON.stringify(to.diagram) !== JSON.stringify(initial.diagram)) throw new Error("Semantic diagrams must match both approved drawings; use replacement actors for graph changes.");
      if (object.initial.reveal !== undefined) throw new Error("Reveal masks belong to component parts only.");
      if (JSON.stringify(object.values) !== JSON.stringify(initial.values) || to && JSON.stringify(to.values) !== JSON.stringify(initial.values)) throw new Error("Chart values must match both source drawings; use replacement actors to change supplied values.");
      if (isComponent(object.type)) {
        if (plan.interpreterVersion !== "3") throw new Error("Compound components require interpreter 3.");
        const parts = componentParts(object.type, initial.color, initial.parts, initial);
        if (!object.initialParts || Object.keys(object.initialParts).length !== Object.keys(parts).length || JSON.stringify(componentParts(object.type, initial.color, object.initialParts, object)) !== JSON.stringify(parts)) throw new Error("Initial component parts must match the source drawing.");
        for (const [part, state] of Object.entries(parts)) { ids.add(`${object.id}.${part}`); finalStates.set(`${object.id}.${part}`, { ...object.initial, ...state }); }
      } else if (object.initialParts) throw new Error("Primitive actors cannot declare component parts.");
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
        if (id.includes(".") && shot.objects.find((object) => object.id === id.split(".")[0])?.diagram && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("Diagram layer geometry is fixed to preserve semantic connections.");
        if (id.includes(".") && properties.some((name) => !Object.hasOwn(partStateSchema.shape, name))) throw new Error("Component parts support only position, scale, opacity and color.");
        if (!id.includes(".") && properties.includes("reveal")) throw new Error("Reveal masks belong to component parts only.");
        if (id === "camera" && properties.some((name) => !["x", "y", "scale", "rotation"].includes(name))) throw new Error("Unsupported camera property.");
        const start = action.startFrame + offset * action.staggerFrames, end = action.endFrame + offset * action.staggerFrames;
        const held = [...(intervals.get(`${id}:*`) ?? []), ...(id.includes(".") ? intervals.get(`${id.split(".")[0]}:*`) ?? [] : [])];
        if (held.some((span) => start < span.end && end > span.start)) throw new Error("Motion overlaps a reading hold.");
        for (const property of action.behavior === "hold" ? ["*"] : properties) {
          const key = `${id}:${property}`; const spans = intervals.get(key) ?? [];
          if (spans.some((span) => start < span.end && end > span.start)) throw new Error("Two actions own the same property interval.");
          if (spans.some((span) => start < span.start)) throw new Error("Expanded target actions must remain chronological.");
          if (property === "*" && [...intervals].some(([name, values]) => (name.startsWith(`${id}:`) || name.startsWith(`${id}.`)) && values.some((span) => start < span.end && end > span.start))) throw new Error("Reading hold overlaps motion.");
          spans.push({ start, end }); intervals.set(key, spans);
        }
        if (id !== "camera") Object.assign(finalStates.get(id)!, action.to);
      }
    }
    for (const object of shot.objects) {
      const state = finalStates.get(object.id)!; const end = object.endIndex === null ? null : source.endFrame.shapes[object.endIndex];
      if (end ? ["x", "y", "width", "height", "color"].some((field) => state[field as keyof MotionState] !== end[field as keyof typeof end]) || state.opacity !== 1 || state.scale !== 1 || state.rotation !== 0 : state.opacity !== 0) throw new Error("Final visible state must match the end drawing.");
      if (end && isComponent(object.type)) {
        for (const [part, expected] of Object.entries(componentParts(object.type, end.color, end.parts, end))) {
          const actual = finalStates.get(`${object.id}.${part}`)!;
          if (Object.entries(expected).some(([field, value]) => actual[field as keyof MotionState] !== value)) throw new Error("Final component parts must match the end drawing.");
        }
      }
    }
    const anchored = ["match-cut", "continuous", "motion-match"].includes(shot.incoming.type);
    if (anchored !== !!shot.incoming.anchor) throw new Error("Boundary anchor is required only for a matched/shared handoff.");
    if (shot.incoming.anchor) {
      const previous = expandedShots[index - 1]; const from = previous?.objects.find((object) => object.id === shot.incoming.anchor!.previousObjectId);
      const to = shot.objects.find((object) => object.id === shot.incoming.anchor!.objectId);
      if (!from || !to || from.type !== to.type || from.endIndex === null || to.startIndex === null) throw new Error("Invalid shared anchor.");
      const before = sourceShots[index - 1].endFrame.shapes[from.endIndex]; const after = source.startFrame.shapes[to.startIndex];
      if (["x", "y", "width", "height"].some((field) => before[field as keyof typeof before] !== after[field as keyof typeof after])) throw new Error("Shared anchor geometry is discontinuous.");
      if (["continuous", "motion-match"].includes(shot.incoming.type) && (before.color !== after.color || from.label !== to.label || JSON.stringify(before.asset) !== JSON.stringify(after.asset) || JSON.stringify(before.diagram) !== JSON.stringify(after.diagram))) throw new Error("Continuous anchor appearance must remain unchanged.");
      if (["continuous", "motion-match"].includes(shot.incoming.type) && isComponent(from.type) && JSON.stringify(componentParts(from.type, before.color, before.parts, before)) !== JSON.stringify(componentParts(from.type, after.color, after.parts, after))) throw new Error("Continuous component parts must remain unchanged at the boundary.");
      const camera = { ...previous.camera };
      for (const action of previous.actions) if (action.targetIds.includes("camera")) Object.assign(camera, action.to);
      if (Object.keys(camera).some((field) => camera[field as keyof typeof camera] !== shot.camera[field as keyof typeof camera])) throw new Error("Shared anchor camera is discontinuous.");
    }
    for (const beat of shot.beats ?? []) {
      if (beat.narrationAnchor && !shot.lineNumbers.includes(beat.narrationAnchor.lineNumber)) throw new Error("Beat narration anchor is outside its shot.");
      if (beat.continuity) {
        const next = plan.shots[index + 1];
        if (!beat.targetIds.includes(beat.continuity.targetId) || next?.id !== beat.continuity.nextShotId || next.incoming.type !== "continuous" || next.incoming.anchor?.previousObjectId !== beat.continuity.targetId) throw new Error("Beat continuity must reference the next continuous actor handoff.");
      }
    }
  }
  return plan;
}
