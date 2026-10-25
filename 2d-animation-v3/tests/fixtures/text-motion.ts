import { presetScene } from "./motion-presets.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { motionPlanSchema } from "../../workflow/motion.ts";
import { textMotionLibrary } from "../../workflow/text-motion.ts";

export function textMotionFixture() {
  const shape = { type: "heading" as const, x: 8, y: 44, width: 84, height: 10, color: "#F5F3ED", label: "Make the idea clear" };
  const { board, plan } = presetScene([shape], [shape], [[0, 0]], { presetId: "snap-overshoot@1", targetIds: ["object-1"], parameters: { to: {}, anticipation: .9, overshoot: 1.1 } });
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard");
  const drawing = board.output.shots[0], shot = plan.shots[0];
  board.output.shots = textMotionLibrary.map((_, index) => ({ ...structuredClone(drawing), lineNumbers: [index + 1], transition: index === 0 ? "start" : "hard-cut" }));
  plan.shots = textMotionLibrary.map((preset, index) => ({ ...structuredClone(shot), id: `shot-${index + 1}`, sourceIndex: index,
    lineNumbers: [index + 1], sourceHash: hashMotionSource(board.output.kind === "storyboard" ? board.output.shots[index] : null), durationFrames: 90,
    incoming: { type: index === 0 ? "start" : "hard-cut", overlapFrames: 0, presentation: "cut", anchor: null },
    textMotions: [{ targetId: "object-1", presetId: preset.id, startFrame: 6, endFrame: 36 }],
    beats: [{ ...structuredClone(shot.beats![0]), type: "hold", presetId: "hold@1", parameters: {}, startFrame: 40, endFrame: 88 }],
  }));
  return { board, plan: motionPlanSchema.parse(plan) };
}
