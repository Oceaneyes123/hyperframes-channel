import { z } from "zod";

// Matching authored vertices preserve correspondence; models never provide geometry.
function outline(points: [number, number][]) {
  return `M${points[0].join(" ")}` + points.map((from, index) => { const to = points[(index + 1) % points.length]; return `C${from.join(" ")} ${to.join(" ")} ${to.join(" ")}`; }).join("") + "Z";
}
export const messageRecordPair = {
  id: "message-record@1", width: 300, height: 300, license: "CC0-1.0", source: "Original authored message and document outlines for HyperFrames V3",
  from: outline([[40, 50], [260, 50], [260, 210], [150, 210], [80, 265], [80, 210], [40, 210]]),
  to: outline([[75, 30], [200, 30], [255, 85], [255, 270], [75, 270], [75, 180], [75, 100]]),
} as const;
export const morphPairs = [{ pair: messageRecordPair, contentHash: "08b8f54e274abd91d4fc84d956d818bc7530ce39f60fdbf81a79d5c7fc4f8395" }];
export const morphReferenceSchema = z.strictObject({ pairId: z.string(), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).refine((reference) => morphPairs.some((entry) => entry.pair.id === reference.pairId && entry.contentHash === reference.contentHash), "Unknown or changed curated morph pair.");
export type MorphReference = z.infer<typeof morphReferenceSchema>;
export function morphPair(reference: MorphReference) { morphReferenceSchema.parse(reference); return morphPairs.find((entry) => entry.pair.id === reference.pairId)!.pair; }
