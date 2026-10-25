import { connectedProcessExample } from "../../workflow/examples/connected-process.ts";
import { componentParts } from "../../workflow/components.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { motionBeatSchema, motionPlanSchema } from "../../workflow/motion.ts";

export function connectedProcessSequence() {
  const { plan, board } = connectedProcessExample();
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard");
  const source = board.output.shots[0], original = plan.shots[0];
  board.output.shots = ["forward", "branch", "feedback"].map((variant, index) => {
    const drawing = structuredClone(source), shape = drawing.startFrame.shapes[0];
    drawing.transition = index ? "hard-cut" : "start"; drawing.lineNumbers = [index + 1];
    if (variant === "branch") {
      shape.diagram!.direction = "right";
      shape.diagram!.nodes.push({ id: "log", icon: "database", label: "Log" });
      shape.diagram!.edges.push({ id: "audit", from: "classify", to: "log", label: "" });
    }
    if (variant === "feedback") shape.diagram!.edges.push({ id: "retry", from: "review", to: "inquiry", label: "" });
    const parts = componentParts(shape.type as "semantic-diagram@1", shape.color, undefined, shape);
    for (const [id, state] of Object.entries(parts)) {
      state.opacity = 1;
      if (shape.diagram!.edges.some((edge) => edge.id === id)) state.strokeProgress = variant === "feedback" ? id === "result" || id === "retry" ? 0 : 1 : id === "audit" ? 1 : 0;
    }
    shape.parts = parts;
    const end = structuredClone(shape);
    for (const edge of end.diagram!.edges) end.parts![edge.id].strokeProgress = 1;
    drawing.endFrame.shapes[0] = end;
    if (index === 1) drawing.endFrame.shapes[0].y += 2;
    return drawing;
  });
  plan.shots = board.output.shots.map((drawing, index) => {
    const shot = structuredClone(original), shape = drawing.startFrame.shapes[0];
    Object.assign(shot, { id: `shot-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(drawing), lineNumbers: drawing.lineNumbers, incoming: { ...shot.incoming, type: drawing.transition } });
    shot.objects[0].diagram = shape.diagram; shot.objects[0].initialParts = shape.parts;
    if (index === 2) for (const beat of shot.beats!) beat.targetIds = beat.targetIds.map((id) => id === "object-1.request" ? "object-1.result" : id === "object-1.result" ? "object-1.retry" : id);
    if (index === 1) {
      shot.beats!.push(motionBeatSchema.parse({ ...shot.beats![0], id: "root-move", presetId: "snap-overshoot@1", targetIds: ["object-1"], startFrame: 31, endFrame: 115, parameters: { to: { y: shape.y + 2 }, anticipation: .95, overshoot: 1.02 } }));
      shot.beats!.sort((a, b) => a.startFrame - b.startFrame);
    }
    return shot;
  });
  return { board, plan: motionPlanSchema.parse(plan) };
}
