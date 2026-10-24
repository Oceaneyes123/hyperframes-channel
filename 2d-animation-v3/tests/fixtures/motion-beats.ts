import { motionPlanSchema, motionBeatSchema } from "../../workflow/motion.ts";
import { motionWorkflowFixture } from "./motion-workflow.ts";

export function motionBeatFixture() {
  const { board, plan } = motionWorkflowFixture();
  plan.interpreterVersion = "3";
  for (const shot of plan.shots) {
    shot.beats = shot.actions.map((action, index) => motionBeatSchema.parse({
      id: `beat-${index + 1}`, purpose: action.behavior === "hold" ? "Read the settled result." : "Emphasize the changing document before settling at its approved drawing.",
      type: action.behavior === "hold" ? "hold" : "transformation", targetIds: action.targetIds,
      startFrame: action.startFrame, endFrame: action.endFrame, importance: "primary",
      narrationAnchor: { lineNumber: shot.lineNumbers[0], kind: "line" }, continuity: null,
      ...(action.behavior === "hold" ? { presetId: "hold@1", parameters: {} }
        : { presetId: "snap-overshoot@1", parameters: { to: action.to, anticipation: .9, overshoot: 1.12 } }),
    }));
    shot.actions = [];
  }
  return { board, plan: motionPlanSchema.parse(plan) };
}
