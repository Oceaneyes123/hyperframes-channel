import { z } from "zod";

export const graphicTheme = {
  id: "editorial-workflow@1", paper: "#F7F3E9", ink: "#203B3A", muted: "#607570",
  accent: "#D9633F", mint: "#C6DED3", light: "#FFFDF8", line: "#D7DFD4",
  stroke: 4, radius: 22,
} as const;

// Only reviewed local artwork is registered. New artwork requires a new version and source hash.
export const graphicAssetRegistry = {
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

export type GraphicAssetId = keyof typeof graphicAssetRegistry;
export function isGraphicAsset(type: string): type is GraphicAssetId { return Object.hasOwn(graphicAssetRegistry, type); }
export const graphicReferenceSchema = z.strictObject({ id: z.enum(["complaint-workflow@1"]), contentHash: z.string().regex(/^[a-f0-9]{64}$/) });
export type GraphicReference = z.infer<typeof graphicReferenceSchema>;
export function graphicReference(id: GraphicAssetId): GraphicReference { return { id, contentHash: graphicAssetRegistry[id].contentHash }; }
export function validGraphicReference(type: string, reference?: GraphicReference) {
  return isGraphicAsset(type) ? reference?.id === type && reference.contentHash === graphicAssetRegistry[type].contentHash : reference === undefined;
}
