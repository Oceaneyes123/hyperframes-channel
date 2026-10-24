import { z } from "zod";
import { vectorLibrary } from "./graphic-library.ts";
import { assetKey } from "./vector-assets.ts";

export const graphicTheme = {
  id: "editorial-workflow@1", paper: "#F7F3E9", ink: "#203B3A", muted: "#607570",
  accent: "#D9633F", mint: "#C6DED3", light: "#FFFDF8", line: "#D7DFD4",
  stroke: 4, radius: 22,
} as const;

// Only reviewed local artwork is registered. New artwork requires a new version and source hash.
export const graphicAssetRegistry = {
  ...Object.fromEntries(Object.entries(vectorLibrary).map(([id, { asset, contentHash }]) => [id, { ...asset, contentHash, theme: graphicTheme.id, viewBox: `0 0 ${asset.width} ${asset.height}`, version: Number(id.split("@")[1]), layers: asset.layers.map((layer) => layer.id), customization: { accent: "Accent role only; fixed editorial palette." } }])),
  "complaint-workflow@1": {
    id: "complaint-workflow@1", version: 1, theme: graphicTheme.id,
    source: "engine/graphics/complaint-workflow.tsx", license: "CC0-1.0",
    attribution: "Original artwork authored for HyperFrames V3; dedicated to CC0.",
    contentHash: "2f95ca0637e8a2daf788bb293978edbf9ee86c83240cf6341d9d8389e3c95e78",
    width: 900, height: 1200, viewBox: "0 0 900 1200",
    purpose: "Collect recurring work complaints, group the same pain, form a candidate tool to validate.",
    tags: ["complaints", "research", "workflow", "software-idea"],
    layers: ["complaints", "cluster", "packet", "opportunity"],
    compositions: ["illustrated-workflow", "editorial-illustration"],
    customization: { accent: "The shape color controls only the accent role; all other colors use the versioned theme." },
  },
} as const;

export type GraphicAssetId = string;
export function isGraphicAsset(type: string): type is GraphicAssetId { return type === "graphic-asset@2" || Object.hasOwn(graphicAssetRegistry, type); }
export const graphicReferenceSchema = z.strictObject({ id: assetKey, contentHash: z.string().regex(/^[a-f0-9]{64}$/) });
export type GraphicReference = z.infer<typeof graphicReferenceSchema>;
export function graphicReference(id: GraphicAssetId): GraphicReference { return { id, contentHash: (id === "complaint-workflow@1" ? graphicAssetRegistry[id].contentHash : vectorLibrary[id]?.contentHash) ?? "" }; }
export function assetMetadata(id: string) {
  return id === "complaint-workflow@1" ? graphicAssetRegistry[id] : vectorLibrary[id] ? { ...vectorLibrary[id].asset, contentHash: vectorLibrary[id].contentHash, layers: vectorLibrary[id].asset.layers.map((layer) => layer.id) } : undefined;
}
export function validGraphicReference(type: string, reference?: GraphicReference) {
  if (type === "graphic-asset@2") return !!reference && !!vectorLibrary[reference.id] && vectorLibrary[reference.id].contentHash === reference.contentHash;
  return type === "complaint-workflow@1" ? reference?.id === type && reference.contentHash === graphicAssetRegistry[type].contentHash : reference === undefined;
}
