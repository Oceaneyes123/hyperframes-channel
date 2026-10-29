import { z } from "zod";
import { isTrustedScene } from "./trusted-scenes.ts";
import type { VariableTypeReference } from "./variable-type.ts";
import { type GraphicReference, assetMetadata, graphicAssetRegistry } from "./graphic-assets.ts";

import { type Diagram } from "./diagram.ts";
import type { ComparisonReference } from "./comparison.ts";
import type { MorphReference } from "./morphs.ts";
import type { NumericReference } from "./numeric.ts";
import type { PerspectiveReference } from "./perspective.ts";
import type { CollageReference } from "./raster.ts";
import type { MorphChain } from "./semantic-morphs.ts";
import type { RigReference } from "./character-rig.ts";
import type { UIWorkflow } from "./ui-workflow.ts";

export const componentRegistry = {
  "payment-terminal@1": ["tap", "processing", "approved", "declined"],
  "banking-balance@1": ["current", "available", "hold"],
  "variable-type@1": ["glyphs"],
  "perspective-scene@1": ["camera"],
  "editorial-collage@1": ["photo", "paper", "texture", "vector", "type"],
  "morph-chain@1": ["outline"],
  "character-rig@1": ["body", "document", "laptop"],
  "ui-workflow@1": ["surface", "inquiry", "category", "draft", "focus"],
  "numeric-display@1": ["digits"],
  "morph-shape@1": ["outline"],
  "data-comparison@1": ["bar-one", "bar-two"],
  "complaint-workflow@1": graphicAssetRegistry["complaint-workflow@1"].layers,
  "inbox-panel@1": ["message", "highlight", "extracted", "packet"],
  "approval-flow@1": ["request", "approved", "handoff"],
  "api-flow@1": ["request", "response", "cache"],
  "cost-chart@1": ["bar-one", "bar-two", "total"],
  "kinetic-phrase@1": ["lead", "keyword", "underline"],
  "funnel@1": ["inputs", "bottleneck", "output"],
} as const;
export type ComponentType = keyof typeof componentRegistry | "graphic-asset@2" | "semantic-diagram@1";
export function isComponent(type: string): type is ComponentType { return type === "graphic-asset@2" || type === "semantic-diagram@1" || Object.hasOwn(componentRegistry, type); }
export const partStateSchema = z.strictObject({
  x: z.number().min(-100).max(100), y: z.number().min(-100).max(100),
  scale: z.number().min(.1).max(2), opacity: z.number().min(0).max(1), color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  reveal: z.number().min(0).max(1).optional(),
  strokeProgress: z.number().min(0).max(1).optional(),
  morphProgress: z.union([z.literal(0), z.literal(1)]).optional(),
  axisProgress: z.union([z.literal(0), z.literal(1)]).optional(),
  numericProgress: z.union([z.literal(0), z.literal(1)]).optional(),
  uiStage: z.number().int().min(0).max(4).optional(),
  rigProgress: z.literal(0).optional(),
  cameraX: z.number().min(-180).max(220).optional(), cameraY: z.number().min(-60).max(60).optional(), cameraZ: z.number().min(0).max(120).optional(), depthProgress: z.number().min(0).max(1).optional(),
  morphStage: z.number().int().min(0).max(4).optional(),
  handoffProgress: z.union([z.literal(0), z.literal(1)]).optional(),
});
export type PartState = z.infer<typeof partStateSchema>;
export const componentPartsSchema = z.record(z.string().regex(/^[a-z][a-z0-9-]{0,19}$/), partStateSchema);
// Supplied integer units only; the renderer never invents financial values or currency.
export const chartValuesSchema = z.tuple([z.number().int().min(0).max(1_000_000_000), z.number().int().min(0).max(1_000_000_000)]);
export type ComponentDetails = { variableType?: VariableTypeReference; asset?: GraphicReference; diagram?: Diagram; comparison?: ComparisonReference; morph?: MorphReference; numeric?: NumericReference; ui?: UIWorkflow; rig?: RigReference; morphChain?: MorphChain; collage?: CollageReference; perspective?: PerspectiveReference };
export function componentLayerIds(type: ComponentType, details?: ComponentDetails): readonly string[] {
  if (type === "graphic-asset@2") { const asset = details?.asset && assetMetadata(details.asset.id); return asset?.layers ?? []; }
  if (type === "semantic-diagram@1") { const graph = details?.diagram; return graph ? [...graph.nodes.map((node) => node.id), ...graph.edges.map((edge) => edge.id)] : []; }
  return componentRegistry[type];
}
export function componentParts(type: ComponentType, color: string, overrides?: Record<string, PartState>, details?: ComponentDetails) {
  const parts: Record<string, PartState> = Object.fromEntries(componentLayerIds(type, details).map((part) => [part, { x: 0, y: 0, scale: 1, opacity: 0, color, reveal: 1 }]));
  for (const [part, state] of Object.entries(overrides ?? {})) {
    if (isTrustedScene(details?.asset?.id) && (state.x !== 0 || state.y !== 0 || state.scale !== 1)) throw new Error("Trusted scene layer geometry is fixed; transform its root.");
    if (["payment-terminal@1", "banking-balance@1", "data-comparison@1", "morph-shape@1"].includes(type) && (state.x !== 0 || state.y !== 0 || state.scale !== 1)) throw new Error("This component has fixed part geometry; transform its root.");
    if (!Object.hasOwn(parts, part)) throw new Error("Unknown component part.");
    if (state.strokeProgress !== undefined && (type !== "semantic-diagram@1" || !details?.diagram?.edges.some((edge) => edge.id === part))) throw new Error("Stroke progress requires a diagram edge.");
    if (state.morphProgress !== undefined && (type !== "morph-shape@1" || part !== "outline")) throw new Error("Morph progress requires a curated outline.");
    parts[part] = { ...parts[part], ...partStateSchema.parse(state) };
  }
  return parts;
}
