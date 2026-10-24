import { motionPlanSchema, scheduleMotion, expandMotionShot, type MotionShot } from "../workflow/motion.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { isComponent } from "../workflow/components.ts";

type Actor = { id: string; object: MotionShot["objects"][number]; startFrame: number; endFrame: number };
type GroupShot = { shot: MotionShot; startFrame: number; endFrame: number; targets: Record<string, string>; background: { start: string; end: string } };
export type MotionGroup = { id: string; durationFrames: number; incoming: MotionShot["incoming"]; actors: Actor[]; shots: GroupShot[] };

// Integrity and full source correspondence are verified by the server store before these props reach the Player.
export function compileMotion(input: unknown, source: unknown) {
  const plan = motionPlanSchema.parse(input); const board = visualArtifactSchema.parse(source);
  if (board.output.kind !== "storyboard" || board.output.shots.length !== plan.shots.length) throw new Error("Motion preview requires its complete storyboard.");
  const schedule = scheduleMotion(plan); const groups: MotionGroup[] = [];
  for (const [index, original] of plan.shots.entries()) {
    const shot = expandMotionShot(original);
    // shortcut: velocity-matched handoffs need a velocity contract before motion-match is supported.
    if (shot.incoming.type === "motion-match") throw new Error("Velocity-matched handoffs are not supported yet. Revise the storyboard to a supported transition.");
    const shared = shot.incoming.type === "continuous";
    let group = shared ? groups.at(-1) : undefined;
    if (!group) { group = { id: shot.id, durationFrames: 0, incoming: shot.incoming, actors: [], shots: [] }; groups.push(group); }
    const startFrame = group.durationFrames; const endFrame = startFrame + shot.durationFrames; const targets: Record<string, string> = {};
    for (const object of shot.objects) {
      const anchor = shared && shot.incoming.anchor?.objectId === object.id ? group.shots.at(-1)?.targets[shot.incoming.anchor.previousObjectId] : null;
      if (shared && shot.incoming.anchor?.objectId === object.id && !anchor) throw new Error("Continuous target is unavailable.");
      if (anchor) { targets[object.id] = anchor; group.actors.find((actor) => actor.id === anchor)!.endFrame = endFrame; }
      else { const id = `actor-${group.actors.length}`; targets[object.id] = id; group.actors.push({ id, object, startFrame, endFrame }); }
      for (const part of Object.keys(object.initialParts ?? {})) targets[`${object.id}.${part}`] = `${targets[object.id]}.${part}`;
    }
    const drawing = board.output.shots[index];
    group.shots.push({ shot, startFrame, endFrame, targets, background: { start: drawing.startFrame.background, end: drawing.endFrame.background } }); group.durationFrames = endFrame;
    if (group.actors.length > 64 || group.shots.reduce((total, item) => total + item.shot.actions.reduce((count, action) => count + action.targetIds.length, 0), 0) > 128) throw new Error("Continuity group exceeds the initial animation budget. Simplify it or introduce a cut.");
    for (const action of shot.actions) for (const id of action.targetIds) {
      if (id !== "camera" && !targets[id]) throw new Error("Unknown preview target.");
      const object = shot.objects.find((object) => object.id === id);
      if (object && isComponent(object.type) && (action.to.width !== undefined || action.to.height !== undefined)) throw new Error("Compound component geometry is fixed. Use scale or explicit replacement actors.");
      // shortcut: text size changes use explicit replacement objects until coupled font/layout interpolation is supported.
      if (object && ["text", "centered-text", "heading", "caption", "code"].includes(object.type) && (action.to.width !== undefined || action.to.height !== undefined)) throw new Error("Text width/height motion is not supported. Use position, scale, opacity or explicit replacement text.");
    }
  }
  return { plan, groups, ...schedule };
}
