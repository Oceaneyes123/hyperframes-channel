import { componentParts, componentRegistry, type ComponentType } from "../../workflow/components.ts";
import { motionBeatSchema } from "../../workflow/motion.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { presetScene } from "./motion-presets.ts";

export function motionComponentFixture(type: ComponentType = "inbox-panel@1") {
  const shape = { type, x: 15, y: 30, width: 70, height: 40, color: "#9BA7FF", label: type === "kinetic-phrase@1" ? "Repeated problems" : "", ...(type === "cost-chart@1" ? { values: [20, 40] as [number, number] } : {}) };
  const initial = componentParts(shape.type, shape.color);
  if (type === "kinetic-phrase@1") initial.keyword.reveal = 0;
  const final = Object.fromEntries(Object.entries(initial).map(([part, state]) => [part, { ...state, opacity: 1, reveal: 1 }]));
  const fixture = presetScene([{ ...shape, parts: initial }], [{ ...shape, parts: final }], [[0, 0]], { presetId: "snap-overshoot@1", parameters: { to: {}, anticipation: .9, overshoot: 1.08 }, targetIds: ["object-1"] });
  const shot = fixture.plan.shots[0]; shot.objects[0].initialParts = initial;
  if (shape.values) shot.objects[0].values = shape.values;
  shot.beats = Object.keys(initial).map((part, index) => motionBeatSchema.parse({
    id: `part-${index + 1}`, purpose: `Reveal the ${part} state of the ${type} mechanism.`,
    type: "transformation", presetId: "snap-overshoot@1", parameters: { to: { opacity: 1 }, anticipation: .9, overshoot: 1.08 },
    targetIds: [`object-1.${part}`], startFrame: 5 + index * 22, endFrame: 19 + index * 22,
    importance: "primary", narrationAnchor: null, continuity: null,
  }));
  shot.beats.push(motionBeatSchema.parse({ id: "reading-hold", purpose: "Read the extracted result.", type: "hold", presetId: "hold@1", parameters: {}, targetIds: ["object-1"], startFrame: 90, endFrame: 118, importance: "primary", narrationAnchor: null, continuity: null }));
  if (type === "kinetic-phrase@1") {
    shot.beats.push(motionBeatSchema.parse({ ...shot.beats[1], id: "keyword-mask", presetId: "mask-reveal@1", parameters: { reveal: 1 } }));
    shot.beats.sort((a, b) => a.startFrame - b.startFrame);
  }
  if (fixture.board.output.kind !== "storyboard") throw new Error("Expected storyboard fixture.");
  shot.sourceHash = hashMotionSource(fixture.board.output.shots[0]);
  return fixture;
}

export function motionComponentSequence() {
  const scenes = (Object.keys(componentRegistry) as ComponentType[]).map(motionComponentFixture);
  const board = structuredClone(scenes[0].board), plan = structuredClone(scenes[0].plan);
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  board.output.shots = scenes.map((scene, index) => {
    if (scene.board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
    const drawing = structuredClone(scene.board.output.shots[0]); drawing.lineNumbers = [index + 1]; drawing.seconds = 100 / 30; drawing.transition = index ? "hard-cut" : "start"; return drawing;
  });
  const drawings = board.output.shots;
  plan.shots = scenes.map((scene, index) => {
    const shot = structuredClone(scene.plan.shots[0]); Object.assign(shot, { id: `shot-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(drawings[index]), lineNumbers: [index + 1], durationFrames: 100 });
    shot.incoming.type = index ? "hard-cut" : "start"; shot.beats!.at(-1)!.endFrame = 98; return shot;
  });
  return { board, plan };
}
