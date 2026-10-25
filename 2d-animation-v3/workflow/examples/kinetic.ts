import { connectedProcessExample } from "./connected-process.ts";
import { hydrateMotion, motionBeatSchema, type MotionBeat, type MotionShot } from "../motion.ts";
import { componentParts } from "../components.ts";
import { comparisonSources } from "../comparison.ts";
import { graphicReference } from "../graphic-assets.ts";
import { morphPairs } from "../morphs.ts";
import { visualArtifactSchema, type Frame } from "../visuals.ts";

export const kineticExamples = [
  { id: "typography", name: "Measured typography", purpose: "A pinned local font, two authored lines, measured masks and readable hold." },
  { id: "handoff", name: "Information handoff", purpose: "Fixed words become UI labels while the same message token moves into a review slot." },
  { id: "comparison", name: "Supplied data comparison", purpose: "Hypothetical supplied costs, exact labels and one common scale; no claimed real saving." },
  { id: "depth", name: "Layered depth and assembly", purpose: "An existing illustration uses bounded depth shifts, then its authored layers separate and return exactly." },
  { id: "morph", name: "Curated message-to-record morph", purpose: "One reviewed silhouette pair transforms an inquiry into a record; no model-provided paths." },
] as const;
export type KineticExampleId = typeof kineticExamples[number]["id"];

function example(shapes: Frame["shapes"], endShapes: Frame["shapes"], beats: MotionBeat[], textMotions?: MotionShot["textMotions"]) {
  const { board } = connectedProcessExample();
  if (board.output.kind !== "storyboard") throw new Error("Expected example board.");
  const shot = board.output.shots[0];
  shot.seconds = 4; shot.startFrame.shapes = shapes; shot.endFrame.shapes = endShapes;
  shot.purpose = "Synthetic kinetic capability demonstration.";
  const checked = visualArtifactSchema.parse(board);
  const plan = hydrateMotion({ shots: [{ durationFrames: 120, camera: { x: 0, y: 0, scale: 1, rotation: 0 }, incoming: { type: "start", overlapFrames: 0, presentation: "cut", anchor: null },
    objects: shapes.map((_, index) => ({ id: `object-${index + 1}`, startIndex: index, endIndex: index })), beats, ...(textMotions ? { textMotions } : {}),
  }] }, checked, () => "0".repeat(64), undefined, "3", "balanced");
  return { board: checked, plan };
}

export function exampleBeat(id: string, presetId: MotionBeat["presetId"], targetIds: string[], startFrame: number, endFrame: number, parameters: unknown): MotionBeat {
  return motionBeatSchema.parse({ id, type: presetId === "hold@1" ? "hold" : ["layer-depth@1", "explode-assemble@1", "punch-zoom@1"].includes(presetId) ? "emphasis" : "transformation", purpose: "Demonstrate the named visual capability, then settle.", presetId, targetIds, startFrame, endFrame, parameters, importance: "primary", narrationAnchor: null, continuity: null });
}

// Synthetic catalog only. Proof tools bind the actual storyboard hash before source validation.
export function kineticExample(id: KineticExampleId) {
  if (id === "typography") {
    const shapes: Frame["shapes"] = [{ type: "centered-text", label: "Review first\nPublish later", typography: "inter-heading@1", x: 10, y: 36, width: 80, height: 20, color: "#244E42" }];
    return example(shapes, structuredClone(shapes), [exampleBeat("read", "hold@1", ["object-1"], 44, 118, {})], [{ targetId: "object-1", presetId: "mask-rise@1", startFrame: 6, endFrame: 36 }]);
  }
  if (id === "handoff") {
    const parts = componentParts("inbox-panel@1", "#B8D3C8");
    parts.message.opacity = 1; parts.highlight.opacity = 1;
    Object.assign(parts.packet, { opacity: 1, x: -20.8, y: -13.64 });
    const shapes: Frame["shapes"] = [
      { type: "inbox-panel@1", x: 10, y: 32, width: 80, height: 44, color: "#B8D3C8", label: "", parts },
      ...["Request", "Category", "Review"].map((label, index) => ({ type: "heading" as const, label, typography: "inter-heading@1" as const, x: 10 + index * 30, y: 18, width: 20, height: 4, color: "#244E42" })),
    ];
    const end = structuredClone(shapes);
    end[0].parts!.extracted.opacity = 1;
    end[0].parts!.message.opacity = 0;
    Object.assign(end[0].parts!.packet, { x: 0, y: 0 });
    for (let index = 1; index < end.length; index++) Object.assign(end[index], { x: 18, y: 42 + (index - 1) * 9 });
    const beats = end.slice(1).map((shape, index) => exampleBeat(`layout-${index}`, "snap-overshoot@1", [`object-${index + 2}`], 24 + index * 5, 44 + index * 5, { to: { x: shape.x, y: shape.y }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("clear-placeholder", "snap-overshoot@1", ["object-1.message"], 18, 24, { to: { opacity: 0 }, anticipation: .95, overshoot: 1.04 }));
    // Slot visibility and the token path reuse the existing bounded part transform contract.
    beats.push(exampleBeat("show-slot", "snap-overshoot@1", ["object-1.extracted"], 54, 62, { to: { opacity: 1 }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("carry-request", "snap-overshoot@1", ["object-1.packet"], 64, 88, { to: { x: 0, y: 0 }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("read", "hold@1", ["object-1", "object-2", "object-3", "object-4"], 92, 118, {}));
    beats.sort((a, b) => a.startFrame - b.startFrame);
    return example(shapes, end, beats);
  }
  if (id === "comparison") {
    const entry = comparisonSources.find((entry) => entry.source.id === "synthetic-costs@1")!;
    const comparison = { sourceId: entry.source.id, contentHash: entry.contentHash, recordIds: ["baseline", "candidate"] as [string, string] };
    const parts = componentParts("data-comparison@1", "#244E42");
    for (const state of Object.values(parts)) Object.assign(state, { opacity: 1, reveal: 0 });
    const shapes: Frame["shapes"] = [{ type: "data-comparison@1", comparison, x: 10, y: 25, width: 80, height: 52, color: "#244E42", label: "", parts }];
    const end = structuredClone(shapes); for (const state of Object.values(end[0].parts!)) state.reveal = 1;
    return example(shapes, end, [exampleBeat("baseline", "mask-reveal@1", ["object-1.bar-one"], 6, 30, { reveal: 1 }), exampleBeat("candidate", "mask-reveal@1", ["object-1.bar-two"], 34, 58, { reveal: 1 }), exampleBeat("read", "hold@1", ["object-1"], 64, 118, {})]);
  }
  if (id === "depth") {
    const asset = graphicReference("service-handover-desk@1"), parts = componentParts("graphic-asset@2", "#D9633F", undefined, { asset });
    for (const state of Object.values(parts)) state.opacity = 1;
    const shapes: Frame["shapes"] = [{ type: "graphic-asset@2", asset, parts, x: 5, y: 24, width: 90, height: 50.625, color: "#D9633F", label: "" }];
    return example(shapes, structuredClone(shapes), [
      exampleBeat("parallax", "layer-depth@1", ["object-1"], 6, 44, { offsetX: 1.2, offsetY: -.6 }),
      exampleBeat("camera", "punch-zoom@1", ["camera"], 6, 44, { focusId: "object-1", zoom: 1.04 }),
      exampleBeat("assemble", "explode-assemble@1", ["object-1"], 48, 86, { offsets: { documentation: { x: -2, y: 0 }, "test-cards": { x: 2, y: -2 } } }),
      exampleBeat("read", "hold@1", ["object-1"], 92, 118, {}),
    ]);
  }
  if (id === "morph") {
    const entry = morphPairs[0], morph = { pairId: entry.pair.id, contentHash: entry.contentHash }, parts = componentParts("morph-shape@1", "#244E42");
    Object.assign(parts.outline, { opacity: 1, morphProgress: 0 });
    const shapes: Frame["shapes"] = [{ type: "morph-shape@1", morph, parts, x: 15, y: 30, width: 70, height: 39.375, color: "#244E42", label: "" }];
    const end = structuredClone(shapes); end[0].parts!.outline.morphProgress = 1;
    return example(shapes, end, [exampleBeat("message-record", "morph-shape@1", ["object-1.outline"], 12, 66, {}), exampleBeat("read", "hold@1", ["object-1"], 72, 118, {})]);
  }
  throw new Error("Unknown kinetic example.");
}
