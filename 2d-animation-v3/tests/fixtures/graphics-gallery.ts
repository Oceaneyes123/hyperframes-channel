import { graphicWorkflowFixture } from "./graphic-workflow.ts";
import { graphicReference, graphicTheme } from "../../workflow/graphic-assets.ts";
import { componentParts, type ComponentType } from "../../workflow/components.ts";
import { compositionFamilies, type Background } from "../../workflow/art-direction.ts";
import { hydrateMotion, motionBeatSchema } from "../../workflow/motion.ts";
import { visualArtifactSchema, type Frame } from "../../workflow/visuals.ts";
import { hashMotionSource } from "../../server/motion-store.ts";

export const galleryNarration = [
  "Imagine finding a useful software idea in complaints about everyday work.",
  "Trace who sends the request, what processes it, and where the information is stored.",
  "Collect repeated complaints, then group the same pain before imagining a tool.",
  "Inspect the original excerpts. Keep the shared problem connected to its source.",
  "Compare the manual task with a smaller tool that might remove one repeated step.",
  "In this example, three matching complaints suggest one candidate problem, not three customers.",
  "Narrow the idea to that problem. More features do not establish demand.",
  "Talk to the people doing the work. Test demand before building the product.",
];

const label = (value: string, x: number, y: number, width: number): Frame["shapes"][number] => ({ type: "heading", x, y, width, height: 6, label: value, color: graphicTheme.ink });
function asset(id: string, x: number, y: number, width: number, ratio = 1): Frame["shapes"][number] {
  const shape = { type: "graphic-asset@2" as const, x, y, width, height: width * 1080 / 1920 / ratio, color: graphicTheme.accent, label: "", asset: graphicReference(id) };
  return { ...shape, parts: Object.fromEntries(Object.entries(componentParts(shape.type, shape.color, undefined, shape)).map(([part, state]) => [part, { ...state, opacity: 1 }])) };
}
export function graphicsGallery(durations = Array<number>(8).fill(180)) {
  const base = graphicWorkflowFixture(), board = structuredClone(base.board);
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  const graph = { direction: "down" as const, nodes: [{ id: "sender", icon: "person" as const, label: "Sender" }, { id: "service", icon: "processor" as const, label: "Service", emphasis: true }, { id: "storage", icon: "database" as const, label: "Storage" }], edges: [{ id: "request", from: "sender", to: "service", label: "" }, { id: "save", from: "service", to: "storage", label: "" }] };
  const graphShape: Frame["shapes"][number] = { type: "semantic-diagram@1", x: 6, y: 19, width: 88, height: 65, label: "", color: graphicTheme.ink, diagram: graph };
  graphShape.parts = Object.fromEntries(Object.entries(componentParts(graphShape.type as ComponentType, graphShape.color, undefined, graphShape)).map(([part, state]) => [part, { ...state, opacity: 1 }]));
  const complaint = structuredClone(board.output.shots[0].endFrame.shapes[0]);
  const funnel: Frame["shapes"][number] = { type: "funnel@1", x: 15, y: 25, width: 70, height: 48, label: "", color: graphicTheme.ink };
  funnel.parts = Object.fromEntries(Object.entries(componentParts("funnel@1", funnel.color)).map(([part, state]) => [part, { ...state, opacity: 1 }]));
  const phrase: Frame["shapes"][number] = { type: "kinetic-phrase@1", x: 9, y: 24, width: 82, height: 22, label: "Test demand", color: graphicTheme.ink };
  phrase.parts = Object.fromEntries(Object.entries(componentParts("kinetic-phrase@1", phrase.color)).map(([part, state]) => [part, { ...state, opacity: 1 }]));
  const layouts: Frame["shapes"][] = [
    [asset("research-interface@1", 8, 23, 84, 900 / 700), asset("person-editorial@1", 53, 65, 28)],
    [graphShape], [complaint], [asset("research-interface@1", 5, 21, 90, 900 / 700)],
    [label("Manual", 8, 24, 38), label("Candidate", 51, 24, 42), asset("document-editorial@1", 10, 38, 36), asset("computer-editorial@1", 54, 44, 36)],
    [asset("message-editorial@1", 7, 22, 24), asset("message-editorial@1", 38, 22, 24), asset("message-editorial@1", 69, 22, 24), asset("document-editorial@1", 32, 57, 36), label("3 complaints", 14, 42, 72), label("1 candidate", 17, 81, 66)],
    [funnel], [phrase, asset("person-editorial@1", 16, 56, 30), asset("product-editorial@1", 57, 60, 27)],
  ];
  const environments: Background["family"][] = ["soft-gradient", "technical-grid", "environment", "editorial", "geometric", "technical-grid", "atmospheric", "soft-gradient"];
  const shots = layouts.map((shapes, index) => {
    const initial = structuredClone(shapes);
    // Each composition demonstrates one internal reveal while retaining the focal object/context.
    const target = shapes.findIndex((shape) => shape.parts && Object.keys(shape.parts).length > 1);
    const part = target >= 0 ? Object.keys(initial[target].parts!).at(-1)! : null;
    if (part) { if (initial[target].diagram) initial[target].parts![part].reveal = 0; else { initial[target].parts![part].opacity = 0; initial[target].parts![part].y -= 2; } }
    const environment = { family: environments[index], color: graphicTheme.paper, accent: graphicTheme.mint, depth: .45 };
    const source = board.output.kind === "storyboard" ? board.output.shots[0] : null;
    return { ...source!, lineNumbers: [index + 1], seconds: durations[index] / 30, transition: index ? "hard-cut" as const : "start" as const,
      purpose: galleryNarration[index], design: { theme: "editorial-workflow@1" as const, family: compositionFamilies[index], meaning: galleryNarration[index], metaphor: ["Evidence on a workbench", "Request through a system", "Repeated pain becomes a candidate", "Inspect source evidence", "Compare the same task", "Many observations, one hypothesis", "Narrow the feature scope", "Demand as the deciding question"][index],
        focalPoint: index === 1 ? "The service between sender and storage" : "The largest meaningful object", layout: ["Offset interface with foreground person", "Vertical directed system", "Diagonal illustrated workflow", "Large interface close view", "Two equal comparison columns", "Three observations above one candidate", "Centered narrowing funnel", "Large type with supporting objects"][index], density: "balanced" as const, continuityReason: "" },
      startFrame: { background: graphicTheme.paper, environment, shapes: initial }, endFrame: { background: graphicTheme.paper, environment, shapes }, target, part };
  });
  board.output = { kind: "storyboard", shots: shots.map((item) => { const shot = { ...item }; Reflect.deleteProperty(shot, "target"); Reflect.deleteProperty(shot, "part"); return shot; }) };
  if (board.output.kind === "storyboard" && base.board.output.kind === "storyboard") {
    board.output.shots[2].startFrame.shapes = structuredClone(base.board.output.shots[0].startFrame.shapes);
    board.output.shots[2].endFrame.shapes = structuredClone(base.board.output.shots[0].endFrame.shapes);
  }
  const parsed = visualArtifactSchema.parse(board);
  const generated = { shots: shots.map((shot, index) => ({ durationFrames: durations[index], camera: { x: 0, y: 0, scale: 1, rotation: 0 }, incoming: { type: shot.transition, presentation: "cut", overlapFrames: 0, anchor: null },
    objects: shot.endFrame.shapes.map((_, i) => ({ id: `object-${i + 1}`, startIndex: i, endIndex: i })),
    beats: [
      ...(shot.part ? [motionBeatSchema.parse({ id: "explain-detail", purpose: shot.purpose, type: "transformation", ...(shot.endFrame.shapes[shot.target].diagram ? { presetId: "mask-reveal@1", parameters: { reveal: 1 } } : { presetId: "snap-overshoot@1", parameters: { to: { opacity: 1, y: shot.endFrame.shapes[shot.target].parts![shot.part!].y }, anticipation: .9, overshoot: 1.06 } }), targetIds: [`object-${shot.target + 1}.${shot.part}`], startFrame: 12, endFrame: Math.min(48, durations[index] - 35), importance: "primary", narrationAnchor: null, continuity: null })] : []),
      motionBeatSchema.parse({ id: "inspect-result", purpose: "Inspect the relationship and source qualifications.", type: "hold", presetId: "hold@1", parameters: {}, targetIds: shot.endFrame.shapes.map((_, i) => `object-${i + 1}`), startFrame: Math.min(52, durations[index] - 30), endFrame: durations[index] - 2, importance: "primary", narrationAnchor: null, continuity: null }),
    ] })) };
  generated.shots[2].beats = structuredClone(base.plan.shots[0].beats!);
  generated.shots[2].beats.at(-1)!.endFrame = durations[2] - 2;
  return { board: parsed, plan: hydrateMotion(generated, parsed, hashMotionSource, undefined, "3") };
}
