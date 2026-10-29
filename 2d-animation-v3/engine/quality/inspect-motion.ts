import { variableTypeLayout, variableFonts, variableExpression } from "../../workflow/variable-type.ts";
import { perspectivePose, perspectiveScene, projectPoint, tokenPoint } from "../../workflow/perspective.ts";
import { highEnergyPacing, expandMotionShot, scheduleMotion, type MotionPlan, type MotionState } from "../../workflow/motion.ts";
import type { VisualArtifact } from "../../workflow/visuals.ts";
import { isTextType, textFontSize } from "../text-metrics.ts";
import { rhythmReviewOptionsSchema, type RhythmReviewOptions } from "../../workflow/rhythm-profile.ts";

export const qualityThresholds = { version: "motion-quality@3", stillFrames: 90, entranceFrames: 24, repeatedShots: 3, competingPrimary: 4, minimumFontPixels: 56, minimumSymbolPixels: 48, minimumContrast: 4.5, minimumSymbolContrast: 3 } as const;
export type MotionFinding = { id: string; ruleId: string; shotId: string; targetId: string | null; startFrame: number; endFrame: number; severity: "review" | "warning"; message: string; evidence: string; suggestion: string; heuristic: boolean };
type Camera = { x: number; y: number; scale: number; rotation: number };
function bounds(state: MotionState, camera: Camera) {
  const rotate = (x: number, y: number, degrees: number) => { const angle = degrees * Math.PI / 180; return { x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) }; };
  const points = [[0, 0], [state.width * 10.8, 0], [0, state.height * 19.2], [state.width * 10.8, state.height * 19.2]].map(([x, y]) => {
    const local = rotate(x * state.scale, y * state.scale, state.rotation), world = rotate((local.x + state.x * 10.8) * camera.scale, (local.y + state.y * 19.2) * camera.scale, camera.rotation);
    return { x: world.x + camera.x * 10.8, y: world.y + camera.y * 19.2 };
  });
  return { left: Math.min(...points.map((point) => point.x)), right: Math.max(...points.map((point) => point.x)), top: Math.min(...points.map((point) => point.y)), bottom: Math.max(...points.map((point) => point.y)) };
}
const luminance = (color: string) => color.slice(1).match(/../g)!.map((part) => { const c = parseInt(part, 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
const contrast = (a: string, b: string) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

export function inspectCreativeMotion(plan: MotionPlan, board?: VisualArtifact | null, options: RhythmReviewOptions = {}) {
  const reviewTargets = rhythmReviewOptionsSchema.parse(options);
  const schedule = scheduleMotion(plan), findings: MotionFinding[] = [], usage: Record<string, number> = {};
  const rhythmShots: { shotId: string; startFrame: number; endFrame: number; causalBeats: number; developmentGaps: number; missingReactions: number }[] = [];
  const pacing = plan.energyProfile === "intense" || plan.energyProfile === "energetic" ? highEnergyPacing[plan.energyProfile] : null;
  let previousPreset = "", repeated = 0, passiveShots = 0;
  let previousStates: Map<string, Partial<MotionState>> | null = null, previousCamera: Camera | null = null;
  let previousIllustrations = new Set<string>();
  for (const [index, original] of plan.shots.entries()) {
    const shot = expandMotionShot(original), offset = schedule.shots[index].startFrame;
    const add = (ruleId: string, start: number, end: number, message: string, evidence: string, suggestion: string, targetId: string | null = null, heuristic = true, severity: MotionFinding["severity"] = "review") => {
      findings.push({ id: `${ruleId}:${shot.id}:${targetId ?? start}`, ruleId, shotId: shot.id, targetId, startFrame: offset + start, endFrame: offset + end, severity, message: `Shot ${index + 1}: ${message}`, evidence, suggestion, heuristic });
    };
    for (const object of shot.objects.filter(object=>object.perspective)) {
      const actions=shot.actions.filter(action=>action.targetIds.includes(`${object.id}.camera`)&&action.behavior!=="hold");
      for(let frame=0;frame<shot.durationFrames;frame++) {
        const pose=perspectivePose(object.initialParts!.camera,actions,frame),token=tokenPoint(pose.progress),p=projectPoint(token,pose.camera);
        for(const plane of perspectiveScene.planes)projectPoint({x:0,y:0,z:plane.z},pose.camera);
        if(p.x-35*p.scale<0||p.y-25*p.scale<0||p.x+35*p.scale>1000||p.y+25*p.scale>1000) {
          add("perspective-projected-bounds",frame,frame,"projected inquiry leaves the scene viewport.",`Projected token center ${p.x.toFixed(2)},${p.y.toFixed(2)}; scale ${p.scale.toFixed(4)}.` ,"Use the reviewed camera route and keep the projected token inside its fixed viewport.",object.id,false,"warning");break;
        }
      }
    }
    const holds = shot.actions.filter((action) => action.behavior === "hold");
    if (!holds.some((hold) => hold.endFrame - hold.startFrame >= 15)) add("reading-hold", 0, shot.durationFrames - 1, "no explicit half-second reading hold.", "No declared hold spans at least 15 frames.", "Add a reading hold after the meaningful result.");
    const states = new Map<string, Partial<MotionState>>(shot.objects.map((object) => [object.id, { ...object.initial }]));
    for (const object of shot.objects) for (const [part, state] of Object.entries(object.initialParts ?? {})) states.set(`${object.id}.${part}`, { ...state });
    const camera = { ...shot.camera }; states.set("camera", camera);
    const intervals = holds.map((hold) => ({ start: hold.startFrame, end: hold.endFrame }));
    const objectActivity: { start: number; end: number }[] = (shot.textMotions ?? []).map((motion) => ({ start: motion.startFrame, end: motion.endFrame }));
    const changedActions: { start: number; end: number; targetId: string }[] = [];
    intervals.push(...objectActivity);
    for (const motion of shot.textMotions ?? []) usage[motion.presetId] = (usage[motion.presetId] ?? 0) + 1;
    for (const action of shot.actions) {
      if (action.behavior === "hold") continue;
      for (const [order, id] of action.targetIds.entries()) {
        const state = states.get(id); if (!state) continue;
        if (Object.entries(action.to).some(([key, value]) => state[key as keyof MotionState] !== value)) {
          const interval = { start: action.startFrame + order * action.staggerFrames, end: action.endFrame + order * action.staggerFrames };
          intervals.push(interval); if (id !== "camera") { objectActivity.push(interval); changedActions.push({ ...interval, targetId: id }); }
        }
        Object.assign(state, action.to);
      }
    }
    // Holds remain valid exceptions for human review; they do not erase inactivity evidence.
    let activeUntil = 0;
    for (const interval of [...objectActivity].sort((a, b) => a.start - b.start).concat({ start: shot.durationFrames, end: shot.durationFrames })) {
      if (interval.start - activeUntil > reviewTargets.maxInactiveFrames) add("rhythm-inactivity", activeUntil, Math.min(interval.start, shot.durationFrames - 1), "review an interval without object development.", `${interval.start - activeUntil} frames exceed the experimental ${reviewTargets.maxInactiveFrames}-frame limit. Camera-only motion and declared holds do not remove this diagnostic.`, "Keep a justified comprehension hold or stage a meaningful state change; never add cosmetic motion to clear a finding.");
      activeUntil = Math.max(activeUntil, interval.end);
    }
    const exposed = shot.objects.filter((object) => object.initial.opacity > 0 || shot.actions.some((action) => action.targetIds.includes(object.id) && (action.to.opacity ?? 0) > 0));
    const rootText = exposed.filter((object) => isTextType(object.type) || ["variable-type@1", "kinetic-phrase@1", "numeric-display@1"].includes(object.type));
    if (rootText.length > reviewTargets.maxTextElementsPerShot) add("text-element-budget", 0, shot.durationFrames - 1, "review the shot's text budget.", `${rootText.length} potentially visible root text elements; experimental limit ${reviewTargets.maxTextElementsPerShot}. Sequential labels also count; embedded illustration text is not counted.`, "Prefer objects over text; retain essential source text and inspect simultaneous readability at phone size.");
    const illustrations = new Set(exposed.filter((object) => !rootText.includes(object) && !["rect", "ellipse", "line"].includes(object.type)).map((object) => JSON.stringify({ type: object.type, asset: object.asset, diagram: object.diagram, comparison: object.comparison, morph: object.morph, numeric: object.numeric, ui: object.ui, rig: object.rig, morphChain: object.morphChain, collage: object.collage, perspective: object.perspective })));
    const reused = [...illustrations].filter((identity) => previousIllustrations.has(identity));
    if (reused.length) add("neighbor-illustration-reuse", 0, shot.durationFrames - 1, "review an illustration repeated in neighboring shots.", `${reused.length} shared illustration identities. Intentional continuity: ${board?.output.kind === "storyboard" ? board.output.shots[index]?.design?.continuityReason || "not recorded" : "unknown without storyboard"}.`, "Retain a persistent object when its state advances the explanation; otherwise vary staging or the meaningful illustration.");
    previousIllustrations = illustrations;
    for (const object of exposed) {
      const labels = [object.label, ...(object.diagram?.nodes.map((node) => node.label) ?? []), ...(object.diagram?.edges.map((edge) => edge.label) ?? [])];
      if (labels.some((label) => /^(?:illustrative(?: example)?|demo|test illustration)$/iu.test(label.trim().replace(/[.!:]+$/u, "")))) add("audience-disclaimer-label", 0, shot.durationFrames - 1, "remove an audience-facing provenance label.", `A potentially visible label on ${object.id} is Illustrative, Demo or Test illustration.`, "Frame invented examples naturally in narration and keep provenance in reviewer notes; never present invented events as real evidence.", object.id);
    }
    for (const hold of holds) if (hold.endFrame - hold.startFrame > 120 && !objectActivity.some((interval) => interval.start < hold.endFrame && interval.end > hold.startFrame))
      add("long-hold", hold.startFrame, hold.endFrame, "a static reading hold lasts over four seconds.", `${hold.endFrame - hold.startFrame} frames without object development.`, "Shorten the hold or add a source-faithful state change before the next reading hold.", null, false, "warning");
    if (pacing) {
      // Declared holds do not prove energy; necessary reading remains a human-reviewed exception.
      let developedUntil = 0;
      for (const interval of [...objectActivity].sort((a, b) => a.start - b.start).concat({ start: shot.durationFrames - 1, end: shot.durationFrames - 1 })) {
        if (interval.start - developedUntil > pacing.developmentGapFrames) add("development-gap", developedUntil, interval.start, "high-energy scene leaves a long gap between object developments.", `${interval.start - developedUntil} frames; ${plan.energyProfile} review target ${pacing.developmentGapFrames}. Holds and camera motion do not count as object development.`, "Stage a source-faithful reaction, transformation or handoff. Preserve a longer hold when comprehension needs it; do not add filler motion.");
        developedUntil = Math.max(developedUntil, interval.end);
      }
      const actions = shot.beats?.filter((beat) => beat.type !== "hold") ?? shot.actions.filter((action) => action.behavior !== "hold");
      for (const action of actions) {
        const stagger = "presetId" in action && action.presetId === "cascade@1" ? action.parameters.staggerFrames * (action.targetIds.length - 1) : 0;
        if (action.endFrame - action.startFrame - stagger > pacing.actionFrames && action.targetIds.some((id) => id !== "camera")) add("slow-development", action.startFrame, action.endFrame, "high-energy action develops as a drawn-out tween.", `${action.endFrame - action.startFrame - stagger} frames per action; ${plan.energyProfile} review target ${pacing.actionFrames}.`, "Break the explanation into short cause, impact, reaction and handoff beats. Keep a slower action only when its teaching purpose requires it.", "id" in action ? action.id : null);
      }
      if (shot.beats && shot.durationFrames >= 90 && !shot.beats.some((beat) => ["transformation", "impact"].includes(beat.type) && beat.targetIds.some((id) => id !== "camera") && objectActivity.some((interval) => interval.start < beat.endFrame && interval.end > beat.startFrame))) add("missing-causal-beat", 0, shot.durationFrames - 1, "high-energy scene declares no visible object transformation or impact.", "Entrances, emphasis and holds alone do not demonstrate a causal beat.", "Show an actual source-faithful change and its reaction. Review the moving result; beat labels alone cannot establish causality.");
      for (const beat of (shot.beats ?? []).filter((beat) => beat.importance === "primary" && ["transformation", "impact"].includes(beat.type) && beat.targetIds.some((id) => id !== "camera"))) {
        const reactionEnd = Math.min(shot.durationFrames - 1, beat.endFrame + 12);
        if (!changedActions.some((action) => !beat.targetIds.includes(action.targetId) && action.start >= beat.startFrame && action.start <= reactionEnd && action.end > beat.startFrame)) add("missing-reaction", beat.startFrame, reactionEnd, "a major action has no detected receiving-object reaction.", `No different actor/part changes during ${beat.id} or within 12 frames after it. This timing heuristic cannot prove causality.`, "Show the receiving state react, settle or hand off when the mechanism supports it. A self-contained transformation can be an intentional exception; never invent a reaction.", beat.id);
      }
    }
    const drift = shot.actions.find((action) => action.targetIds.includes("camera") && action.endFrame - action.startFrame >= qualityThresholds.stillFrames && !objectActivity.some((interval) => interval.start < action.endFrame && interval.end > action.startFrame) && !holds.some((hold) => hold.startFrame <= action.startFrame && hold.endFrame >= action.endFrame));
    if (drift) add("camera-only-drift", drift.startFrame, drift.endFrame, "long camera drift over otherwise static actors.", "No object state develops during this camera move.", "Replace the drift with a visible interaction or an intentional reading hold.");
    let cursor = 0;
    for (const interval of [...intervals.sort((a, b) => a.start - b.start), { start: shot.durationFrames - 1, end: shot.durationFrames - 1 }]) {
      if (interval.start - cursor >= qualityThresholds.stillFrames) add("stillness", cursor, interval.start, "long interval without visual development or an intentional hold.", `${interval.start - cursor} frames without an action changing state.`, "Show a new relationship or declare the reading hold that this content needs.");
      cursor = Math.max(cursor, interval.end);
    }
    for (const beat of shot.beats ?? []) {
      if (beat.presetId !== "hold@1") usage[beat.presetId] = (usage[beat.presetId] ?? 0) + 1;
      const entrance = beat.endFrame - beat.startFrame - (beat.presetId === "cascade@1" ? beat.parameters.staggerFrames * (beat.targetIds.length - 1) : 0);
      if ((beat.type === "entry" || beat.presetId === "cascade@1") && entrance > (pacing?.entranceFrames ?? qualityThresholds.entranceFrames)) add("slow-entrance", beat.startFrame, beat.endFrame, "inspect a slow important entrance.", `${entrance} frames per entrance before settling; review target ${pacing?.entranceFrames ?? qualityThresholds.entranceFrames}.`, "Shorten the entrance while preserving a separate reading hold.", beat.id);
    }
    const primary = (shot.beats ?? []).filter((beat) => beat.type !== "hold" && beat.importance === "primary"), firstPreset = primary[0]?.presetId ?? "";
    passiveShots = shot.beats && shot.durationFrames >= 150 && !shot.beats.some((beat) => ["transformation", "impact"].includes(beat.type)) ? passiveShots + 1 : 0;
    if (passiveShots >= 3) add("passive-sequence", 0, shot.durationFrames - 1, "three or more explanatory shots use only entrances, emphasis and holds.", `${passiveShots} consecutive shots lack a transformation or causal interaction.`, "Use a source-faithful interaction from the motion library to show how the mechanism changes state.", null, true, "warning");
    repeated = firstPreset && firstPreset === previousPreset ? repeated + 1 : 1; previousPreset = firstPreset;
    if (firstPreset && repeated >= qualityThresholds.repeatedShots) add("repetitive-preset", 0, shot.durationFrames - 1, "the same primary preset repeats across consecutive shots.", `${firstPreset} leads ${repeated} consecutive shots.`, "Use a different meaningful interaction where the explanation changes.");
    const crowded = primary.find((beat) => primary.filter((other) => other.startFrame <= beat.startFrame && other.endFrame > beat.startFrame).length >= qualityThresholds.competingPrimary);
    if (crowded) add("competing-effects", crowded.startFrame, crowded.endFrame, "several primary effects compete at once.", `At least ${qualityThresholds.competingPrimary} primary beats overlap.`, "Choose one primary action and make the others supporting or sequential.");
    if (shot.actions.some((action) => action.targetIds.includes("camera") && (Math.abs(action.to.rotation ?? 0) > 15 || (action.to.scale ?? 1) > 1.5))) add("camera-strength", 0, shot.durationFrames - 1, "inspect strong camera motion for readability.", "Camera rotation exceeds 15 degrees or scale exceeds 1.5.", "Use a smaller focused reframe and review it at phone size.");
    for (const object of shot.objects.filter(object => object.variableType)) {
      const ref = object.variableType!, final = states.get(object.id) as MotionState;
      const layout = variableTypeLayout(ref, final.width * 10.8, final.height * 19.2);
      const pixels = layout.unit * variableFonts[variableExpression(ref).font].unitsPerEm * final.scale * camera.scale;
      if (pixels < qualityThresholds.minimumFontPixels) add("variable-type-size", 0, shot.durationFrames - 1, "variable typography falls below the phone readability threshold.", `Measured motion envelope reserves ${pixels.toFixed(1)}px type across every axis state.`, "Increase the approved box and review the motion at phone size.", object.id, false, "warning");
    }
    const texts = shot.objects.filter((object) => isTextType(object.type) || ["kinetic-phrase@1", "cost-chart@1"].includes(object.type));
    for (const object of texts) {
      if (object.typography) add("measured-type-review", 0, shot.durationFrames - 1, "inspect the measured font layout at phone size.", "This opt-in font is loaded and measured by the render browser; legacy character-count sizing is not an exact glyph measurement.", "Review glyph bounds, decoration length and the authored line breaks in the preview/export.", object.id);
      const final = states.get(object.id) as MotionState, size = textFontSize(object.type, object.label, final.width * 10.8, final.height * 19.2) * final.scale * camera.scale;
      if (object.label.length > 45) add("text-length", 0, shot.durationFrames - 1, "inspect long text at phone size.", `${object.label.length} characters in one text object.`, "Keep the necessary label shorter or give it more space.", object.id);
      const componentTextVisible = object.type === "cost-chart@1" ? (states.get(`${object.id}.total`)?.opacity ?? 0) > .8 : object.type === "kinetic-phrase@1" ? ["lead", "keyword"].some((part) => (states.get(`${object.id}.${part}`)?.opacity ?? 0) > .8) : true;
      if (!object.typography && final.opacity > .8 && componentTextVisible && size < qualityThresholds.minimumFontPixels) add("text-size", shot.durationFrames - 2, shot.durationFrames - 1, "text settles below the phone readability threshold.", `Renderer font size ${size.toFixed(1)}px; ${qualityThresholds.minimumFontPixels}px threshold at 1080px width.`, "Increase the text box or shorten the label, then inspect the rendered frame.", object.id, false, "warning");
    }
    const drawing = board?.output.kind === "storyboard" ? board.output.shots[index] : null;
    const visible = shot.objects.filter((object) => (states.get(object.id)?.opacity ?? 0) > .8);
    for (const object of visible) {
      const state = states.get(object.id) as MotionState, rectangle = bounds(state, camera);
      const symbol = ["document", "browser", "database", "server", "cloud", "person", "chip", "coin"].includes(object.type);
      if (symbol && Math.min(rectangle.right - rectangle.left, rectangle.bottom - rectangle.top) < qualityThresholds.minimumSymbolPixels) add("small-symbol", shot.durationFrames - 2, shot.durationFrames - 1, "a meaningful symbol may be too small at phone size.", "Its settled world bounds are below the declared minimum symbol size.", "Enlarge the focal symbol or remove unnecessary detail.", object.id);
      if (rectangle.left < -.5 || rectangle.top < -.5 || rectangle.right > 1080.5 || rectangle.bottom > 1920.5) add("clipping", shot.durationFrames - 2, shot.durationFrames - 1, "a settled actor extends beyond the frame.", `World bounds ${[rectangle.left, rectangle.top, rectangle.right, rectangle.bottom].map((value) => value.toFixed(1)).join(", ")}px.`, "Reframe the settled result or reduce its size.", object.id, true, "warning");
      if (drawing && (isTextType(object.type) || symbol) && object.endIndex !== null) {
        const shape = drawing.endFrame.shapes[object.endIndex];
        const behind = drawing.endFrame.shapes.slice(0, object.endIndex).filter((background) => background.type === "rect" && background.x <= shape.x && background.y <= shape.y && background.x + background.width >= shape.x + shape.width && background.y + background.height >= shape.y + shape.height).at(-1);
        const ratio = contrast(state.color, behind?.color ?? drawing.endFrame.background);
        if (ratio < (symbol ? qualityThresholds.minimumSymbolContrast : qualityThresholds.minimumContrast)) add("contrast", shot.durationFrames - 2, shot.durationFrames - 1, "content has low contrast against its drawn surface.", `Calculated solid-color contrast ${ratio.toFixed(2)}. Transparency and imagery need frame review.`, "Choose a clearer foreground/surface pair and inspect the actual rendered frame.", object.id, true, "warning");
      }
    }
    const visibleText = visible.filter((object) => isTextType(object.type));
    for (const [textIndex, object] of visibleText.entries()) for (const other of visibleText.slice(textIndex + 1)) {
      const a = bounds(states.get(object.id) as MotionState, camera), b = bounds(states.get(other.id) as MotionState, camera);
      if (Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)) add("text-crowding", shot.durationFrames - 2, shot.durationFrames - 1, "settled text boxes overlap.", `${object.id} and ${other.id} have intersecting world bounds.`, "Separate the labels or reveal them sequentially.", `${object.id}/${other.id}`);
    }
    if (shot.incoming.anchor || ["continuous", "match-cut"].includes(shot.incoming.type)) {
      const previous = plan.shots[index - 1], anchor = shot.incoming.anchor;
      const from = previous?.objects.find((object) => object.id === anchor?.previousObjectId), to = shot.objects.find((object) => object.id === anchor?.objectId);
      if (!from || !to) add("weak-transition", 0, Math.max(1, shot.incoming.overlapFrames), "matched handoff has no usable anchor.", "A declared matched/shared boundary lacks its actor reference.", "Choose an explicit matching actor or revise the transition type.", null, false, "warning");
      else if (previousStates && previousCamera) {
        const before = bounds(previousStates.get(from.id) as MotionState, previousCamera), after = bounds(to.initial, shot.camera);
        if (Object.keys(before).some((key) => Math.abs(before[key as keyof typeof before] - after[key as keyof typeof after]) > .5)) add("weak-transition", 0, Math.max(1, shot.incoming.overlapFrames), "the matched actor jumps at its handoff.", "World bounds differ across the declared matched/shared boundary.", "Match actor geometry and camera ownership across the seam.", to.id, false, "warning");
      }
    }
    const changed = shot.objects.some((object) => { const end = states.get(object.id)!; return Object.keys(object.initial).some((key) => object.initial[key as keyof MotionState] !== end[key as keyof MotionState]); }) || shot.objects.some((object) => Object.keys(object.initialParts ?? {}).some((part) => Object.entries(object.initialParts![part]).some(([key, value]) => states.get(`${object.id}.${part}`)?.[key as keyof MotionState] !== value)));
    if (!changed && (shot.beats?.some((beat) => beat.type === "transformation") || !shot.beats && shot.actions.some((action) => action.behavior === "transform" && !action.targetIds.includes("camera")))) add("unclear-progression", 0, shot.durationFrames - 1, "the settled state may not advance the explanation.", "The declared transformation returns every visible actor/part to its initial state.", "Review whether the action reveals a relationship or only adds motion.");
    previousStates = states; previousCamera = camera;
    const shotFindings = findings.filter((finding) => finding.shotId === shot.id);
    rhythmShots.push({ shotId: shot.id, startFrame: offset, endFrame: offset + shot.durationFrames - 1, causalBeats: (shot.beats ?? []).filter((beat) => ["transformation", "impact"].includes(beat.type)).length, developmentGaps: shotFindings.filter((finding) => finding.ruleId === "development-gap").length, missingReactions: shotFindings.filter((finding) => finding.ruleId === "missing-reaction").length });
  }
  const primary = plan.shots.flatMap((shot, index) => (shot.beats ?? []).filter((beat) => beat.type !== "hold" && beat.importance === "primary").map((beat) => ({ beat, shot, index })));
  const primaryUsage: Record<string, number> = {};
  for (const { beat } of primary) primaryUsage[beat.presetId] = (primaryUsage[beat.presetId] ?? 0) + 1;
  if (primary.length >= reviewTargets.minimumPrimaryBeats) for (const [preset, count] of Object.entries(primaryUsage)) {
    if (count / primary.length <= reviewTargets.maxPrimaryPresetShare) continue;
    const { shot, index, beat } = primary.find((entry) => entry.beat.presetId === preset)!;
    findings.push({ id: `primary-preset-share:${preset}`, ruleId: "primary-preset-share", shotId: shot.id, targetId: beat.id, startFrame: schedule.shots[index].startFrame + beat.startFrame, endFrame: schedule.shots[index].startFrame + beat.endFrame, severity: "review", heuristic: true,
      message: "Review a dominant primary preset across the plan.", evidence: `${preset}: ${count}/${primary.length} primary non-hold beats (${(count / primary.length * 100).toFixed(1)}%); experimental limit ${(reviewTargets.maxPrimaryPresetShare * 100).toFixed(1)}%. Supporting beats and text treatments are excluded.`, suggestion: "Vary the causal motion when meaning changes; coherent repeated actions may justify the concentration." });
  }
  findings.sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id));
  return { version: 4, thresholds: qualityThresholds, reviewTargets, energyPacing: pacing, rhythm: { requiresHumanReview: true as const, shots: rhythmShots }, durationFrames: schedule.durationFrames, findings, presetUsage: usage, primaryPresetUsage: primaryUsage, warnings: findings.map((finding) => finding.message), requiresHumanReview: true as const };
}
