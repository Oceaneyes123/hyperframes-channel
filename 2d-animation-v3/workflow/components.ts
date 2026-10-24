import { z } from "zod";
import { type GraphicReference, assetMetadata, graphicAssetRegistry } from "./graphic-assets.ts";

import { type Diagram } from "./diagram.ts";

export const componentRegistry = {
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
});
export type PartState = z.infer<typeof partStateSchema>;
export const componentPartsSchema = z.record(z.string().regex(/^[a-z][a-z0-9-]{0,19}$/), partStateSchema);
// Supplied integer units only; the renderer never invents financial values or currency.
export const chartValuesSchema = z.tuple([z.number().int().min(0).max(1_000_000_000), z.number().int().min(0).max(1_000_000_000)]);
export type ComponentDetails = { asset?: GraphicReference; diagram?: Diagram };
export function componentLayerIds(type: ComponentType, details?: ComponentDetails): readonly string[] {
  if (type === "graphic-asset@2") { const asset = details?.asset && assetMetadata(details.asset.id); return asset?.layers ?? []; }
  if (type === "semantic-diagram@1") { const graph = details?.diagram; return graph ? [...graph.nodes.map((node) => node.id), ...graph.edges.map((edge) => edge.id)] : []; }
  return componentRegistry[type];
}
export function componentParts(type: ComponentType, color: string, overrides?: Record<string, PartState>, details?: ComponentDetails) {
  const parts = Object.fromEntries(componentLayerIds(type, details).map((part) => [part, { x: 0, y: 0, scale: 1, opacity: 0, color, reveal: 1 }]));
  for (const [part, state] of Object.entries(overrides ?? {})) {
    if (!Object.hasOwn(parts, part)) throw new Error("Unknown component part.");
    parts[part] = { ...parts[part], ...partStateSchema.parse(state) };
  }
  return parts;
}
