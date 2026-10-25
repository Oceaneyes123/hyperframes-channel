import { componentParts } from "../components.ts";
import { diagramSchema } from "../diagram.ts";
import { hydrateMotion } from "../motion.ts";
import { visualArtifactSchema } from "../visuals.ts";

// Synthetic gallery data only; no project, approval or external service request.
export function connectedProcessExample() {
  const diagram = diagramSchema.parse({ direction: "down", nodes: [
    { id: "inquiry", icon: "message", label: "Inquiry" },
    { id: "classify", icon: "processor", label: "Classify" },
    { id: "review", icon: "document", label: "Review" },
  ], edges: [
    { id: "request", from: "inquiry", to: "classify", label: "" },
    { id: "result", from: "classify", to: "review", label: "" },
  ] });
  const shape = { type: "semantic-diagram@1" as const, diagram, x: 5, y: 10, width: 90, height: 78, color: "#244E42", label: "" };
  const start = componentParts(shape.type, shape.color, undefined, shape);
  for (const [id, state] of Object.entries(start)) {
    state.opacity = 1;
    if (diagram.edges.some((edge) => edge.id === id)) state.strokeProgress = 0;
  }
  const end = structuredClone(start);
  for (const edge of diagram.edges) end[edge.id].strokeProgress = 1;
  const board = visualArtifactSchema.parse({ schemaVersion: 2, id: "11111111-1111-4111-8111-111111111111", projectId: "22222222-2222-4222-8222-222222222222",
    createdAt: "2026-10-25T00:00:00.000Z", scriptId: "33333333-3333-4333-8333-333333333333", scriptHash: "0".repeat(64), selectionId: null, baseId: null,
    instruction: "Synthetic connected-process gallery example.", output: { kind: "storyboard", shots: [{ lineNumbers: [1], seconds: 6,
      purpose: "Follow one inquiry through classification to human review.", framing: "Portrait diagram with fixed, connected nodes.", subject: "An inquiry and a reviewable result",
      action: "Draw each route, trace information to its destination, react, then hold.", transition: "start", continuity: "One information token follows the connected process.",
      startFrame: { background: "#F5F3ED", shapes: [{ ...shape, parts: start }] }, endFrame: { background: "#F5F3ED", shapes: [{ ...shape, parts: end }] },
    }] } });
  const beat = (id: string, presetId: string, targetId: string, startFrame: number, endFrame: number) => ({ id, purpose: "Show information moving through the approved connected process.",
    type: presetId === "hold@1" ? "hold" : "transformation", presetId, parameters: {}, targetIds: [targetId], startFrame, endFrame, importance: "primary", narrationAnchor: null, continuity: null });
  const plan = hydrateMotion({ shots: [{ durationFrames: 180, camera: { x: 0, y: 0, scale: 1, rotation: 0 }, incoming: { type: "start", overlapFrames: 0, presentation: "cut", anchor: null },
    objects: [{ id: "object-1", startIndex: 0, endIndex: 0 }], beats: [
      beat("draw-request", "edge-draw@1", "object-1.request", 3, 24), beat("trace-request", "edge-trace@1", "object-1.request", 27, 66),
      beat("draw-result", "edge-draw@1", "object-1.result", 70, 94), beat("trace-result", "edge-trace@1", "object-1.result", 97, 136),
      beat("read-result", "hold@1", "object-1", 142, 178),
    ] }] }, board, () => "e4240b064f4a61e5313707d716e027d9b96d67052e5429e3bb1013ba7fa8324a", undefined, "3", "balanced");
  return { board, plan };
}
