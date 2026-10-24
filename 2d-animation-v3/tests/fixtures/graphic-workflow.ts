import { motionComponentFixture } from "./motion-components.ts";
import { componentParts } from "../../workflow/components.ts";
import { graphicReference, graphicTheme } from "../../workflow/graphic-assets.ts";
import { hydrateMotion, motionBeatSchema } from "../../workflow/motion.ts";
import { hashMotionSource } from "../../server/motion-store.ts";

// Synthetic graphics proof only. Not a saved project or human acceptance receipt.
export function graphicWorkflowFixture() {
  const { board, plan } = motionComponentFixture("complaint-workflow@1");
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  board.schemaVersion = 2;
  const drawing = board.output.shots[0];
  const start = componentParts("complaint-workflow@1", graphicTheme.accent);
  start.complaints.opacity = 1;
  const end = structuredClone(start); end.cluster.opacity = 1; end.opportunity.opacity = 1;
  end.packet.x = -29; end.packet.y = 8;
  const shape = { type: "complaint-workflow@1" as const, x: 8, y: 14, width: 84, height: 63,
    color: graphicTheme.accent, label: "", asset: graphicReference("complaint-workflow@1") };
  Object.assign(drawing, { seconds: 6, purpose: "Group repeated work complaints into a candidate tool that still needs demand validation.",
    framing: "Editorial diagonal: browser above left, repeated pain center right, candidate tool below.", subject: "Repeated complaints and a candidate tool", action: "Group matching complaint marks, then carry the shared pain into a candidate tool.",
    startFrame: { background: graphicTheme.paper, shapes: [{ ...shape, parts: start }] },
    endFrame: { background: graphicTheme.paper, shapes: [{ ...shape, parts: end }] } });
  const beat = (id: string, part: string, startFrame: number, endFrame: number, to: Record<string, number>) => motionBeatSchema.parse({
    id, purpose: id === "group-pain" ? "Reveal the same pain across several complaints." : "Carry the identified pain into a candidate tool, not a validated business.",
    type: "transformation", presetId: "snap-overshoot@1", parameters: { to, anticipation: .9, overshoot: 1.06 },
    targetIds: [`object-1.${part}`], startFrame, endFrame, importance: "primary", narrationAnchor: null, continuity: null,
  });
  const shot = plan.shots[0]; shot.durationFrames = 180;
  shot.beats = [beat("group-pain", "cluster", 18, 38, { opacity: 1 }),
    beat("extract-pain", "packet", 48, 58, { opacity: 1 }),
    beat("carry-pain", "packet", 60, 88, { x: -29, y: 8 }),
    beat("candidate-tool", "opportunity", 88, 108, { opacity: 1 }),
    beat("deliver-pain", "packet", 110, 120, { opacity: 0 }),
    motionBeatSchema.parse({ id: "read-result", purpose: "Inspect the candidate tool; no payment or demand is claimed.", type: "hold", presetId: "hold@1", parameters: {}, targetIds: ["object-1"], startFrame: 122, endFrame: 178, importance: "primary", narrationAnchor: null, continuity: null })];
  const generated = { shots: [{ durationFrames: shot.durationFrames, incoming: shot.incoming, camera: shot.camera,
    beats: shot.beats, objects: [{ id: "object-1", startIndex: 0, endIndex: 0 }] }] };
  return { board, plan: hydrateMotion(generated, board, hashMotionSource, undefined, "3") };
}
