import { visualArtifactSchema, type Frame, type VisualArtifact } from "../../workflow/visuals.ts";
import { textFontSize } from "../text-metrics.ts";
import { assetMetadata } from "../../workflow/graphic-assets.ts";

export type GraphicFinding = { id: string; shotIndex: number; state: "start" | "end"; rule: string; severity: "warning" | "review"; evidence: string; suggestion: string };
const luminance = (hex: string) => hex.slice(1).match(/../g)!.reduce((sum, value, index) => { const c = parseInt(value, 16) / 255; return sum + (c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][index]; }, 0);
export function inspectGraphics(input: unknown) {
  const parsed = visualArtifactSchema.safeParse(input), findings: GraphicFinding[] = [];
  if (!parsed.success) return { version: "graphic-quality@1", findings: parsed.error.issues.slice(0, 20).map((issue, index) => ({ id: `invalid-${index}`, shotIndex: -1, state: "end" as const, rule: "invalid-contract", severity: "warning" as const, evidence: `${issue.path.join(".")}: ${issue.message}`, suggestion: "Correct invalid geometry, assets or graph references before review." })), requiresHumanReview: true };
  const artifact = parsed.data;
  const frames = artifact.output.kind === "concepts" ? artifact.output.concepts.map((concept, index) => ({ index, start: concept.frame, end: concept.frame })) : artifact.output.shots.map((shot, index) => ({ index, start: shot.startFrame, end: shot.endFrame }));
  for (const item of frames) for (const state of ["start", "end"] as const) {
    const frame = item[state];
    const add = (rule: string, evidence: string, suggestion: string, severity: GraphicFinding["severity"] = "review") => findings.push({ id: `${item.index}-${state}-${rule}-${findings.length}`, shotIndex: item.index, state, rule, evidence, suggestion, severity });
    if (frame.shapes.length > 10) add("density", `${frame.shapes.length} root objects compete for a phone-sized frame.`, "Remove supporting detail or reveal information progressively.");
    const labels = frame.shapes.filter((shape) => ["text", "heading", "caption", "code", "centered-text"].includes(shape.type));
    if (labels.length > 2) add("copy-density", `${labels.length} text actors share one frame.`, "Keep at most two essential short labels; move explanation into narration or staged objects.", "warning");
    const numeric = frame.shapes.filter((shape) => shape.type === "numeric-display@1");
    for (const bank of frame.shapes.filter((shape) => shape.type === "banking-balance@1")) for (const amount of numeric) {
      const centerY = (amount.y + amount.height / 2 - bank.y) / bank.height * 1100;
      if (centerY < 237 || centerY > 894) continue;
      const x = (amount.x - bank.x) / bank.width * 800, right = (amount.x + amount.width - bank.x) / bank.width * 800;
      const top = (amount.y - bank.y) / bank.height * 1100, bottom = (amount.y + amount.height - bank.y) / bank.height * 1100;
      const slots = [[320, 430], [555, 665], [790, 880]];
      if (x < 135 || right > 665 || !slots.some(([start, end]) => top >= start && bottom <= end)) add("numeric-container", "A bank amount leaves its card's padded value area or overlaps its built-in label.", "Place each sourced amount below its card label and inside the card's padded bounds.", "warning");
    }
    for (const operator of labels.filter((shape) => shape.type === "centered-text" && /^[<>≤≥=]$/.test(shape.label.trim()))) {
      const left = numeric.find((shape) => shape.x + shape.width <= operator.x + .5);
      const right = numeric.find((shape) => shape.x >= operator.x + operator.width - .5);
      if (left && right && [left, right].some((shape) => Math.abs(shape.y + shape.height / 2 - (operator.y + operator.height / 2)) > .5))
        add("comparison-alignment", `Comparison symbol '${operator.label}' and numeric values have different vertical centers.`, "Align the operator box center with both value box centers.", "warning");
    }
    for (const label of labels) {
      const size = textFontSize(label.type, label.label, label.width * 10.8, label.height * 19.2);
      if (size < 56) add("text-size", `${label.label}: ${size.toFixed(1)}px at 1080px width.`, "Enlarge or shorten the label, then inspect at phone size.", "warning");
      const behind = frame.shapes.slice(0, frame.shapes.indexOf(label)).filter((shape) => shape.type === "rect" && shape.x <= label.x && shape.y <= label.y && shape.x + shape.width >= label.x + label.width && shape.y + shape.height >= label.y + label.height).at(-1);
      const a = luminance(label.color), b = luminance(behind?.color ?? frame.environment?.color ?? frame.background), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      if (ratio < 4.5) add("contrast", `${label.label}: solid-color contrast ${ratio.toFixed(2)}.`, "Use a clearer foreground/surface pair; imagery and transparency need frame review.", "warning");
    }
    for (const [index, label] of labels.entries()) for (const other of labels.slice(index + 1)) if (label.x < other.x + other.width && label.x + label.width > other.x && label.y < other.y + other.height && label.y + label.height > other.y) add("text-overlap", `Text boxes '${label.label}' and '${other.label}' intersect.`, "Separate the labels or show them sequentially.", "warning");
    const assets = frame.shapes.flatMap((shape) => shape.asset ? [assetMetadata(shape.asset.id)] : []).filter((asset) => !!asset);
    if (new Set(assets.map((asset) => "theme" in asset ? asset.theme : "editorial-workflow@1")).size > 1) add("icon-style", "Asset themes differ in one frame.", "Use one icon treatment unless a comparison requires a difference.");
    for (const shape of frame.shapes) {
      if (shape.diagram) {
        const degree = Math.max(...shape.diagram.nodes.map((node) => shape.diagram!.edges.filter((edge) => edge.from === node.id || edge.to === node.id).length));
        if (shape.diagram.nodes.length > 5 || degree > 3) add("diagram-density", `${shape.diagram.nodes.length} nodes; maximum degree ${degree}.`, "Use progressive disclosure and inspect routed connections at phone size.");
        if (shape.diagram.nodes.some((node) => node.label.length > 12) || Math.min(shape.width * 10.8, shape.height * 19.2) / 1000 * 60 < 56) add("diagram-labels", "Diagram labels may be crowded or below 56px.", "Enlarge the diagram or shorten node labels; keep exact relationships.");
      }
      for (const [part, value] of Object.entries(shape.parts ?? {})) if (value.opacity > .8 && (value.x !== 0 || value.y !== 0 || value.scale !== 1)) add("part-bounds", `Visible layer ${part} has offsets or scale; root bounds cannot prove layer containment.`, "Inspect the real rendered layer for clipping and overlap.");
    }
  }
  if (artifact.output.kind === "storyboard") for (let index = 2; index < artifact.output.shots.length; index++) {
    const shots = artifact.output.shots.slice(index - 2, index + 1), current = shots[2].design;
    if (current && !current.continuityReason && shots.every((shot) => shot.design?.family === current.family && shot.design?.layout === current.layout && shot.design?.metaphor === current.metaphor)) findings.push({ id: `repeat-${index}`, shotIndex: index, state: "end", rule: "layout-repetition", severity: "review", evidence: "Three neighboring shots repeat family, layout and metaphor without a continuity reason.", suggestion: "Vary the composition or explain intentional narrative continuity." });
  }
  return { version: "graphic-quality@1", findings, requiresHumanReview: true };
}

export function sceneDesignHistory(artifact: VisualArtifact | null) {
  return artifact?.output.kind === "storyboard" ? artifact.output.shots.map((shot, shotIndex) => ({ shotIndex, design: shot.design ?? null, background: shot.endFrame.environment?.family ?? "flat", assets: shot.endFrame.shapes.flatMap((shape) => shape.asset ? [shape.asset.id] : []), rootObjects: shot.endFrame.shapes.length })) : [];
}

export function frameAssets(frame: Frame) { return frame.shapes.flatMap((shape) => shape.asset ? [{ ...shape.asset, metadata: assetMetadata(shape.asset.id) }] : []); }
