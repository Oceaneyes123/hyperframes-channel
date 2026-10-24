import pack from "./graphic-pack.json" with { type: "json" };
import { parseVectorAsset, type VectorAsset } from "./vector-assets.ts";

export const vectorLibrary: Record<string, { contentHash: string; asset: VectorAsset }> = {};
for (const entry of pack) {
  const asset = parseVectorAsset(entry.asset);
  if (vectorLibrary[asset.id] || !/^[a-f0-9]{64}$/.test(entry.contentHash)) throw new Error("Invalid curated asset registry.");
  vectorLibrary[asset.id] = { asset, contentHash: entry.contentHash };
}
