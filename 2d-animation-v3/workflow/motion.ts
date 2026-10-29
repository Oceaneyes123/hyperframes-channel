import { creativeSnapshotSchema } from "./creative-rules.ts";
import { z } from "zod";
import { variableTypeReferenceSchema, variableExpression } from "./variable-type.ts";
import { primitiveSchema, type VisualArtifact } from "./visuals.ts";
import { expandBeats } from "../engine/motion-presets/index.ts";
import { componentPartsSchema, componentParts, isComponent, partStateSchema, chartValuesSchema } from "./components.ts";

import { graphicReferenceSchema, validGraphicReference } from "./graphic-assets.ts";

import { diagramSchema } from "./diagram.ts";
import { textMotionSchema } from "./text-motion.ts";
import { isTextType } from "../engine/text-metrics.ts";
import { narrationAnchorSchema } from "./narration-anchor.ts";
import { typographySchema } from "./typography.ts";
import { comparisonReferenceSchema } from "./comparison.ts";
import { morphReferenceSchema } from "./morphs.ts";
import { numericReferenceSchema } from "./numeric.ts";
import { perspectiveReferenceSchema } from "./perspective.ts";
import { collageReferenceSchema } from "./raster.ts";
import { morphChainSchema } from "./semantic-morphs.ts";
import { rigReferenceSchema } from "./character-rig.ts";
import { uiWorkflowSchema, uiTriggerSchema } from "./ui-workflow.ts";

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
  strokeProgress: z.number().min(0).max(1).optional(),
  traceProgress: z.number().min(0).max(1).optional(),
  arrivalPulse: z.number().min(0).max(1).optional(),
  morphProgress: z.number().min(0).max(1).optional(),
  axisProgress: z.number().min(0).max(1).optional(),
  numericProgress: z.number().min(0).max(1).optional(),
  uiStage: z.number().int().min(0).max(4).optional(),
  rigProgress: z.number().min(0).max(1).optional(),
  cameraX: z.number().min(-180).max(220).optional(), cameraY: z.number().min(-60).max(60).optional(), cameraZ: z.number().min(0).max(120).optional(), depthProgress: z.number().min(0).max(1).optional(),
  morphStage: z.number().int().min(0).max(4).optional(),
  handoffProgress: z.number().min(0).max(1).optional(),
};
export const motionStateSchema = z.strictObject(stateFields);
const cameraSchema = motionStateSchema.pick({ x: true, y: true, rotation: true, scale: true });
export const motionObjectSchema = z.strictObject({
  id: key.refine((id) => id !== "camera", "camera is a reserved target"),
  startIndex: z.number().int().min(0).max(15).nullable(), endIndex: z.number().int().min(0).max(15).nullable(),
  type: primitiveSchema, label: z.string().max(60), initial: motionStateSchema,
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
  initialParts: componentPartsSchema.optional(),
  values: chartValuesSchema.optional(),
}).refine((object) => validGraphicReference(object.type, object.asset) && ((object.type === "variable-type@1") === !!object.variableType) && ((object.type === "semantic-diagram@1") === (object.diagram !== undefined)) && ((object.type === "data-comparison@1") === !!object.comparison) && ((object.type === "morph-shape@1") === !!object.morph) && ((object.type === "numeric-display@1") === !!object.numeric) && ((object.type === "ui-workflow@1") === !!object.ui) && ((object.type === "character-rig@1") === !!object.rig) && ((object.type === "morph-chain@1") === !!object.morphChain) && ((object.type === "editorial-collage@1") === !!object.collage) && ((object.type === "perspective-scene@1") === !!object.perspective), "Graphic asset identity or hash is invalid.");
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
  narrationAnchor: narrationAnchorSchema.nullable(),
  continuity: z.strictObject({ targetId: key, nextShotId: key }).nullable(),
};
export const motionBeatSchema = z.discriminatedUnion("presetId", [
  z.strictObject({ ...beatFields, presetId: z.literal("scene-play@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("font-expression@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("text-layout-morph@1"), parameters: z.strictObject({
    route: z.enum(["vertical-first", "horizontal-first"]),
    destinations: z.record(key, z.strictObject({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })),
  }) }),
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
  z.strictObject({ ...beatFields, presetId: z.literal("edge-draw@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("edge-trace@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("character-look@1"), parameters: z.strictObject({ direction: z.enum(["left", "right"]) }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("character-react@1"), parameters: z.strictObject({ trigger: z.literal("new-inquiry") }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("character-point@1"), parameters: z.strictObject({ prop: z.literal("laptop") }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("character-type@1"), parameters: z.strictObject({ prop: z.literal("laptop") }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("character-hand-off@1"), parameters: z.strictObject({ from: z.literal("desk"), to: z.literal("review-tray") }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("depth-push@1"), parameters: z.strictObject({focus:z.literal("processing"),toZ:z.number().min(0).max(120)}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("parallax-pan@1"), parameters: z.strictObject({toX:z.number().min(-180).max(220),toY:z.number().min(-60).max(60)}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("depth-reveal@1"), parameters: z.strictObject({subject:z.literal("inquiry")}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("perspective-reframe@1"), parameters: z.strictObject({focus:z.enum(["inquiry","processing"])}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("depth-handoff@1"), parameters: z.strictObject({from:z.literal("inquiry"),to:z.literal("processing")}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("morph-chain-step@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("ui-state-transition@1"), parameters: z.strictObject({ trigger: uiTriggerSchema }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("odometer-roll@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("value-transition@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("morph-shape@1"), parameters: z.strictObject({}) }),
  z.strictObject({ ...beatFields, presetId: z.literal("layer-depth@1"), parameters: z.strictObject({ offsetX: z.number().min(-2).max(2), offsetY: z.number().min(-2).max(2) }) }),
  z.strictObject({ ...beatFields, presetId: z.literal("explode-assemble@1"), parameters: z.strictObject({ offsets: z.record(z.string().regex(/^[a-z][a-z0-9-]{0,19}$/), z.strictObject({ x: z.number().min(-3).max(3), y: z.number().min(-3).max(3) })) }) }),
]);
export type MotionBeat = z.infer<typeof motionBeatSchema>;
export const kineticMotionGuidance = "text-layout-morph@1 {route:vertical-first|horizontal-first,destinations:{objectId:{x,y}}} coordinates 2..8 visible inter-heading@1 roots for 18..90 frames. At least two words move; completed inner entrances, unit scale/rotation and an identity camera are required. Each word keeps its content/profile/dimensions. Routes separate one axis then the other and reject portrait escapes or authored text-box collisions at every rendered frame. Do not combine with other root/camera motion during that interval. Recompose headlines, focus keywords and move words into UI slots using this recipe. For a shared-word cut use incoming type:match-cut with textMatch:typographic-match-cut@1 and an exact anchor; both words need identical content/profile/color/geometry/camera. Generic legacy match cuts are unchanged. For approved typography profiles, preserve profile identity and authored lines; text effects may have measured narrationAnchor references. layer-depth@1 {offsetX:-2..2,offsetY:-2..2} and explode-assemble@1 {offsets:{layerId:{x:-3..3,y:-3..3}}} target one depth-approved graphic-asset@2 root, require 12+ frames and three visible/unmasked authored depth roles, and restore exact layer positions. Only the registered service-handover-desk@1 scene is depth-approved; never apply these to diagrams or arbitrary UI wiring. morph-shape@1 {} targets one curated morph-shape@1 outline part with explicit morphProgress:0 initially and 1 finally; needs 12+ frames, stays visible and unmasked, and only supports its fixed forward pair. No arbitrary paths, glyphs, URLs, selectors or target overrides. For data-comparison@1 keep static authoritative values and a fixed common source scale; use mask-reveal on bars, never geometric bar scale/position changes. Fixed component-part geometry must not be moved; move the root instead.";
export const edgeMotionGuidance = "Interpreter 3 edge-draw@1 {} targets exactly one semantic-diagram edge part with explicit strokeProgress:0 in its approved start drawing and strokeProgress:1 in its end drawing. It draws the stroke only; keep that edge opacity/reveal at 1. edge-trace@1 {} targets one fully drawn edge, needs at least 12 frames, travels from the graph's from node to its to node, then pulses the fixed destination. All endpoints and the edge must remain visible/unmasked while the signal travels. Do not move/scale node or edge parts. Root motion is allowed; do not hide the root during travel. End the trace/reaction before a reading hold. Never provide paths, selectors, arbitrary SVG or alternate destination IDs. Trace/pulse are transient effects, not initial drawing fields.";
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
    textMatch: z.literal("typographic-match-cut@1").optional(),
  }),
});
export const energyProfileSchema = z.enum(["calm", "balanced", "energetic", "intense"]);
export type EnergyProfile = z.infer<typeof energyProfileSchema>;
export const defaultEnergyProfile: EnergyProfile = "intense";
export const highEnergyPacing = {
  energetic: { entranceFrames: 18, actionFrames: 30, developmentGapFrames: 60 },
  intense: { entranceFrames: 12, actionFrames: 24, developmentGapFrames: 45 },
} as const;
export function motionPacingGuidance(profile: EnergyProfile) {
  const pacing = profile === "energetic" || profile === "intense" ? highEnergyPacing[profile] : null;
  return pacing
    ? `Profile ${profile}: punchy, dynamic choreography. Aim for entrances of 6–${pacing.entranceFrames} frames and focused actions of 8–${pacing.actionFrames} frames at 30fps, respecting each preset's minimum and stagger requirements. Develop the explanation with a meaningful object change about every ${pacing.developmentGapFrames} frames (${pacing.developmentGapFrames / 30}s). Sequence anticipation, impact, a visible reaction and a handoff: collide/assemble, split, transform, trace a cause and reveal its result using supported presets. Use sharp settles, bounded overshoot and brief focused punch-ins. Stage long shots as several causal beats, not one entrance followed by a long hold or one slow tween. Camera drift, continuous micro-motion and cosmetic fades do not establish energetic teaching. Keep one primary focal action at a time; vary choreography with the meaning. Necessary reading holds and accurate relationships override these review targets; keep holds concise or stage the information. Do not time-stretch narration, add unsupported effects, shake/flash the frame, invent actions or add filler just to meet a threshold. No-warning reports do not establish visual energy; require normal-speed human review.`
    : `Profile ${profile}: ${profile === "calm" ? "generous comprehension holds and fewer emphases" : "moderate stagger and restrained emphasis"}. Show meaningful cause and effect. Preserve accurate narration timing and necessary reading time. These are planning targets, never blanket speed multipliers or forced cuts.`;
}
export const motionPlanSchema = z.strictObject({
  schemaVersion: z.literal(1), width: z.literal(1080), height: z.literal(1920), fps: z.literal(30),
  interpreterVersion: z.enum(["1", "2", "3"]), shots: z.array(motionShotSchema).min(1).max(40),
  energyProfile: energyProfileSchema.optional(),
}).superRefine((plan, context) => {
  for (const [index, shot] of plan.shots.entries()) {
    const targets = new Set<string>();
    for (const motion of shot.textMotions ?? []) {
      const object = shot.objects.find((object) => object.id === motion.targetId);
      if (motion.narrationAnchor && !shot.lineNumbers.includes(motion.narrationAnchor.lineNumber)) context.addIssue({ code: "custom", path: ["shots", index, "textMotions"], message: "Text narration anchor is outside its shot." });
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
export const motionArtifactSchema = z.strictObject({ creativeRules: creativeSnapshotSchema.optional(), schemaVersion: z.literal(1), id: z.uuid(), projectId: z.uuid(), createdAt: z.iso.datetime(), parentId: z.uuid().nullable(), source: motionSourceSchema, plan: motionPlanSchema });
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
    if (opacity !== 1 || !object.typography && /[\r\n]/u.test(object.label)) throw new Error("Text treatment requires a visible single-line actor or an approved typography profile.");
  }
  return { ...shot, actions };
}

export function hydrateMotion(input: unknown, board: VisualArtifact, hashShot: (shot: unknown) => string, base?: MotionPlan, version: "2" | "3" = "2", energyProfile: z.infer<typeof energyProfileSchema> = defaultEnergyProfile) {
  const proposal = version === "3" ? generatedBeatMotionSchema.parse(input) : generatedMotionSchema.parse(input);
  if (board.output.kind !== "storyboard" || proposal.shots.length !== board.output.shots.length) throw new Error("Motion proposal must cover the complete storyboard.");
  const source = board.output.shots;
  return motionPlanSchema.parse({ schemaVersion: 1, width: 1080, height: 1920, fps: 30, interpreterVersion: version, energyProfile, shots: proposal.shots.map((shot, index) => ({
    ...shot, ...(version === "3" ? { actions: [] } : {}), id: base?.shots[index]?.sourceHash === hashShot(source[index]) ? base.shots[index].id : `shot-${index + 1}`,
    sourceIndex: index, sourceHash: hashShot(source[index]), lineNumbers: source[index].lineNumbers,
    objects: shot.objects.map((object) => {
      const shape = object.startIndex === null ? object.endIndex === null ? null : source[index].endFrame.shapes[object.endIndex] : source[index].startFrame.shapes[object.startIndex];
      if (!shape) throw new Error("Object correspondence references a missing shape.");
      return { ...object, type: shape.type, label: shape.label, ...(shape.variableType ? { variableType: shape.variableType } : {}), ...(shape.perspective ? { perspective: shape.perspective } : {}), ...(shape.collage ? { collage: shape.collage } : {}), ...(shape.morphChain ? { morphChain: shape.morphChain } : {}), ...(shape.rig ? { rig: shape.rig } : {}), ...(shape.ui ? { ui: shape.ui } : {}), ...(shape.numeric ? { numeric: shape.numeric } : {}), ...(shape.morph ? { morph: shape.morph } : {}), ...(shape.comparison ? { comparison: shape.comparison } : {}), ...(shape.typography ? { typography: shape.typography } : {}), ...(shape.asset ? { asset: shape.asset } : {}), ...(shape.diagram ? { diagram: shape.diagram } : {}), initial: { x: shape.x, y: shape.y, width: shape.width, height: shape.height, color: shape.color, opacity: object.startIndex === null ? 0 : 1, scale: 1, rotation: 0 }, ...(isComponent(shape.type) ? { initialParts: componentParts(shape.type, shape.color, shape.parts, shape) } : {}), ...(shape.values ? { values: shape.values } : {}) };
    }),
  })) });
}

export function scheduleMotion(input: unknown) {
  const plan = motionPlanSchema.parse(input); let end = 0;
  const shots = plan.shots.map((shot, index) => {
    if (shot.incoming.textMatch && (shot.incoming.type !== "match-cut" || plan.interpreterVersion !== "3")) throw new Error("Typographic match-cut requires an interpreter 3 matched cut.");
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
      if (object.typography !== initial.typography || to && to.typography !== initial.typography) throw new Error("Typography profile must match both approved drawings.");
      if (JSON.stringify(object.comparison) !== JSON.stringify(initial.comparison) || to && JSON.stringify(to.comparison) !== JSON.stringify(initial.comparison)) throw new Error("Comparison source must match both approved drawings.");
      if (["payment-terminal@1", "banking-balance@1"].includes(object.type) && Object.values(object.initialParts ?? {}).some(state => state.x !== 0 || state.y !== 0 || state.scale !== 1)) throw new Error("Finance surfaces require fixed part geometry.");
      if (JSON.stringify(object.variableType) !== JSON.stringify(initial.variableType) || to && JSON.stringify(to.variableType) !== JSON.stringify(initial.variableType)) throw new Error("Variable font expression must match both drawings.");
      if (object.variableType && (object.label !== variableExpression(object.variableType).label || object.typography)) throw new Error("Variable expression label/profile conflict.");
      if (JSON.stringify(object.perspective) !== JSON.stringify(initial.perspective) || to && JSON.stringify(to.perspective) !== JSON.stringify(initial.perspective)) throw new Error("Perspective scene must match both drawings.");
      if (JSON.stringify(object.collage) !== JSON.stringify(initial.collage) || to && JSON.stringify(to.collage) !== JSON.stringify(initial.collage)) throw new Error("Collage identity must match both approved drawings.");
      if (JSON.stringify(object.morphChain) !== JSON.stringify(initial.morphChain) || to && JSON.stringify(to.morphChain) !== JSON.stringify(initial.morphChain)) throw new Error("Morph chain must match both approved drawings.");
      if (JSON.stringify(object.rig) !== JSON.stringify(initial.rig) || to && JSON.stringify(to.rig) !== JSON.stringify(initial.rig)) throw new Error("Character rig identity must match both approved drawings.");
      if (JSON.stringify(object.ui) !== JSON.stringify(initial.ui) || to && JSON.stringify(to.ui) !== JSON.stringify(initial.ui)) throw new Error("UI field identity must match both approved drawings.");
      if (JSON.stringify(object.numeric) !== JSON.stringify(initial.numeric) || to && JSON.stringify(to.numeric) !== JSON.stringify(initial.numeric)) throw new Error("Numeric source must match both approved drawings.");
      if (JSON.stringify(object.morph) !== JSON.stringify(initial.morph) || to && JSON.stringify(to.morph) !== JSON.stringify(initial.morph)) throw new Error("Morph pair must match both approved drawings.");
      if (["x", "y", "width", "height", "color"].some((field) => object.initial[field as keyof MotionState] !== initial[field as keyof typeof initial]) || object.initial.opacity !== (from ? 1 : 0) || object.initial.scale !== 1 || object.initial.rotation !== 0) throw new Error("Initial object state must match its drawing.");
      finalStates.set(object.id, { ...object.initial });
      if (JSON.stringify(object.asset) !== JSON.stringify(initial.asset) || to && JSON.stringify(to.asset) !== JSON.stringify(initial.asset)) throw new Error("Graphic asset references must match both approved drawings.");
      if (JSON.stringify(object.diagram) !== JSON.stringify(initial.diagram) || to && JSON.stringify(to.diagram) !== JSON.stringify(initial.diagram)) throw new Error("Semantic diagrams must match both approved drawings; use replacement actors for graph changes.");
      if (["axisProgress", "reveal", "strokeProgress", "traceProgress", "arrivalPulse", "morphProgress", "numericProgress", "uiStage", "rigProgress", "handoffProgress", "morphStage", "cameraX", "cameraY", "cameraZ", "depthProgress"].some((field) => object.initial[field as keyof MotionState] !== undefined)) throw new Error("Reveal masks and edge effects belong to component parts only.");
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
        const [rootId, partId] = id.split("."), diagram = shot.objects.find((object) => object.id === rootId)?.diagram;
        if (partId && ["payment-terminal@1", "banking-balance@1"].includes(shot.objects.find(object => object.id === rootId)?.type ?? "") && properties.some(name => !["opacity", "reveal", "color"].includes(name))) throw new Error("Finance part geometry is fixed; transform its root.");
        if (properties.some((name) => ["cameraX", "cameraY", "cameraZ", "depthProgress"].includes(name)) && (plan.interpreterVersion !== "3" || !shot.objects.find((object) => object.id === rootId)?.perspective || partId !== "camera")) throw new Error("Depth motion requires its registered camera part.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.perspective && properties.some((name) => !["cameraX", "cameraY", "cameraZ", "depthProgress"].includes(name))) throw new Error("Depth scene anatomy is fixed; transform its root.");
        if (properties.includes("depthProgress") && (finalStates.get(id)?.depthProgress !== 0 || action.to.depthProgress !== 1)) throw new Error("Depth handoff follows its reviewed forward route once.");
        if (properties.includes("morphStage") && (plan.interpreterVersion !== "3" || shot.objects.find((object) => object.id === rootId)?.type !== "morph-chain@1" || partId !== "outline" || action.to.morphStage !== (finalStates.get(id)?.morphStage ?? -1) + 1)) throw new Error("Semantic morph must advance the curated outline by one step.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.morphChain && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("Curated chain outline geometry is fixed; transform its root.");
        if (properties.includes("rigProgress") && (plan.interpreterVersion !== "3" || shot.objects.find((object) => object.id === rootId)?.type !== "character-rig@1" || partId !== "body")) throw new Error("Character action requires its reviewed body.");
        if (properties.includes("handoffProgress") && (plan.interpreterVersion !== "3" || shot.objects.find((object) => object.id === rootId)?.type !== "character-rig@1" || partId !== "document" || finalStates.get(id)?.handoffProgress !== 0 || action.to.handoffProgress !== 1)) throw new Error("Document handoff requires its reviewed forward prop route.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.rig && properties.some((name) => !["rigProgress", "handoffProgress"].includes(name))) throw new Error("Rig anatomy and prop geometry are fixed; use a registered action or transform the root.");
        if (properties.includes("uiStage") && (plan.interpreterVersion !== "3" || shot.objects.find((object) => object.id === rootId)?.type !== "ui-workflow@1" || partId !== "surface" || action.to.uiStage !== (finalStates.get(id)?.uiStage ?? -1) + 1)) throw new Error("UI transition requires a consecutive workflow surface state.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.ui && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("UI field geometry is fixed; transform its root.");
        if (properties.includes("axisProgress") && (plan.interpreterVersion !== "3" || !shot.objects.find(object => object.id === rootId)?.variableType || partId !== "glyphs" || finalStates.get(id)?.axisProgress !== 0 || action.to.axisProgress !== 1)) throw new Error("Font expression requires its reviewed forward glyphs part.");
        if (id.includes(".") && shot.objects.find(object => object.id === rootId)?.variableType && properties.some(name => !["axisProgress", "reveal", "opacity", "color"].includes(name))) throw new Error("Variable glyph geometry is fixed; transform the root.");
        if (properties.includes("numericProgress") && (plan.interpreterVersion !== "3" || shot.objects.find((object) => object.id === rootId)?.type !== "numeric-display@1" || partId !== "digits" || action.to.numericProgress !== 1)) throw new Error("Numeric roll requires interpreter 3, its digits part and forward endpoint.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.numeric && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("Numeric cell geometry is fixed; transform the root.");
        if (properties.includes("morphProgress") && (shot.objects.find((object) => object.id === rootId)?.type !== "morph-shape@1" || partId !== "outline")) throw new Error("Morph progress requires a curated outline.");
        if (action.to.morphProgress !== undefined && action.to.morphProgress !== 1) throw new Error("This morph version supports only its approved forward endpoint.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.morph && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("Morph outline geometry is fixed; transform its root.");
        if (id.includes(".") && shot.objects.find((object) => object.id === rootId)?.comparison && properties.some((name) => ["x", "y", "scale"].includes(name))) throw new Error("Comparison bar geometry is fixed to its common scale.");
        if (properties.some((name) => ["strokeProgress", "traceProgress"].includes(name)) && !diagram?.edges.some((edge) => edge.id === partId)) throw new Error("Stroke and trace progress require a diagram edge.");
        if (properties.includes("arrivalPulse") && !diagram?.nodes.some((node) => node.id === partId)) throw new Error("Arrival pulses require a diagram node.");
        if (properties.some((name) => ["strokeProgress", "traceProgress", "arrivalPulse"].includes(name)) && plan.interpreterVersion !== "3") throw new Error("Edge effects require interpreter 3.");
        if (id.includes(".") && properties.some((name) => !Object.hasOwn(partStateSchema.shape, name) && !["traceProgress", "arrivalPulse"].includes(name))) throw new Error("Component parts support registered properties only.");
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
      if (shot.incoming.textMatch && (!["text", "heading", "caption", "centered-text"].includes(from.type) || from.label !== to.label || from.typography !== "inter-heading@1" || to.typography !== from.typography || before.color !== after.color)) throw new Error("Typographic match-cut must preserve the exact word, measured font, color and geometry.");
      if (["continuous", "motion-match"].includes(shot.incoming.type) && (before.color !== after.color || from.label !== to.label || from.typography !== to.typography || JSON.stringify(before.variableType) !== JSON.stringify(after.variableType) || JSON.stringify(before.perspective) !== JSON.stringify(after.perspective) || JSON.stringify(before.collage) !== JSON.stringify(after.collage) || JSON.stringify(before.morphChain) !== JSON.stringify(after.morphChain) || JSON.stringify(before.rig) !== JSON.stringify(after.rig) || JSON.stringify(before.ui) !== JSON.stringify(after.ui) || JSON.stringify(before.numeric) !== JSON.stringify(after.numeric) || JSON.stringify(before.comparison) !== JSON.stringify(after.comparison) || JSON.stringify(before.morph) !== JSON.stringify(after.morph) || JSON.stringify(before.asset) !== JSON.stringify(after.asset) || JSON.stringify(before.diagram) !== JSON.stringify(after.diagram))) throw new Error("Continuous anchor appearance must remain unchanged.");
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
