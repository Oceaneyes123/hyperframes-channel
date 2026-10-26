import { motionPlanSchema, motionBeatSchema, type MotionBeat } from "../../workflow/motion.ts";
import type { Frame } from "../../workflow/visuals.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { motionBeatFixture } from "./motion-beats.ts";

export const presetShape = (x: number, y = 40): Frame["shapes"][number] => ({ type: "document", x, y, width: 16, height: 12, color: "#F5F3ED", label: "" });

export function presetScene(start: Frame["shapes"], end: Frame["shapes"], mappings: [number | null, number | null][], preset: { presetId: string; parameters: unknown; targetIds: string[] }) {
  const { board, plan } = motionBeatFixture();
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard fixture.");
  board.output.shots = board.output.shots.slice(0, 1);
  const drawing = board.output.shots[0]; drawing.startFrame.shapes = start; drawing.endFrame.shapes = end;
  const shot = plan.shots[0]; plan.shots = [shot]; shot.durationFrames = 120; shot.sourceHash = hashMotionSource(drawing);
  shot.objects = mappings.map(([startIndex, endIndex], index) => {
    const shape = (startIndex === null ? end[endIndex!] : start[startIndex]);
    return { id: `object-${index + 1}`, startIndex, endIndex, type: shape.type, label: shape.label, ...(shape.asset ? { asset: shape.asset } : {}), ...(shape.numeric ? { numeric: shape.numeric } : {}),
      initial: { x: shape.x, y: shape.y, width: shape.width, height: shape.height, color: shape.color, opacity: startIndex === null ? 0 : 1, scale: 1, rotation: 0 } };
  });
  shot.beats = [motionBeatSchema.parse({ id: "beat-1", purpose: "Synthetic semantic preset verification.", type: "transformation", startFrame: 5, endFrame: 35, importance: "primary", narrationAnchor: null, continuity: null, ...preset })];
  return { board, plan: motionPlanSchema.parse(plan) };
}

export function holdAfter(beat: MotionBeat, targetIds: string[]): MotionBeat {
  return { id: "reading-hold", purpose: "Read the settled result.", type: "hold", presetId: "hold@1", parameters: {}, targetIds, startFrame: beat.endFrame + 1, endFrame: 118, importance: "primary", narrationAnchor: null, continuity: null };
}

export function motionPresetSequence() {
  const shape = presetShape, anchor = shape(42, 15);
  const scenes = [
    presetScene([shape(42)], [{ ...shape(42), width: 22 }], [[0, 0]], { presetId: "snap-overshoot@1", parameters: { to: { width: 22 }, anticipation: .9, overshoot: 1.12 }, targetIds: ["object-1"] }),
    presetScene([anchor], [anchor, shape(20), shape(65)], [[0, 0], [null, 1], [null, 2]], { presetId: "cascade@1", parameters: { staggerFrames: 3, offsetY: 8, overshoot: 1.1 }, targetIds: ["object-2", "object-3"] }),
    presetScene([shape(20), shape(65)], [shape(42)], [[0, null], [1, null], [null, 0]], { presetId: "converge-assemble@1", parameters: { resultId: "object-3", overshoot: 1.1 }, targetIds: ["object-1", "object-2"] }),
    presetScene([shape(42)], [shape(42)], [[0, 0]], { presetId: "punch-zoom@1", parameters: { focusId: "object-1", zoom: 1.2 }, targetIds: ["camera"] }),
    presetScene([shape(15), { ...shape(65), type: "server" }], [{ ...shape(65), type: "server" }], [[0, null], [1, 0]], { presetId: "flow-handoff@1", parameters: { destinationId: "object-2", reactionScale: 1.1 }, targetIds: ["object-1"] }),
    presetScene([shape(42)], [shape(20, 55), shape(65, 55)], [[0, null], [null, 0], [null, 1]], { presetId: "split-disperse@1", parameters: { childIds: ["object-2", "object-3"] }, targetIds: ["object-1"] }),
  ];
  const board = structuredClone(scenes[0].board), plan = structuredClone(scenes[0].plan);
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard fixture.");
  board.output.shots = scenes.map((scene, index) => {
    if (scene.board.output.kind !== "storyboard") throw new Error("Expected storyboard fixture.");
    const drawing = structuredClone(scene.board.output.shots[0]);
    drawing.lineNumbers = [index + 1]; drawing.seconds = 2.5; drawing.transition = index === 0 ? "start" : "hard-cut";
    return drawing;
  });
  const drawings = board.output.shots;
  plan.shots = scenes.map((scene, index) => {
    const shot = structuredClone(scene.plan.shots[0]);
    Object.assign(shot, { id: `shot-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(drawings[index]), lineNumbers: [index + 1], durationFrames: 75 });
    shot.incoming.type = index === 0 ? "start" : "hard-cut";
    const hold = holdAfter(shot.beats![0], shot.objects.map((object) => object.id)); hold.endFrame = 73;
    shot.beats!.push(hold); return shot;
  });
  return { board, plan: motionPlanSchema.parse(plan) };
}
