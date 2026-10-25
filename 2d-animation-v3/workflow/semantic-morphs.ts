import { z } from "zod";
import { outline, morphPairs as legacyPairs } from "./morphs.ts";

type Points = [number, number][];
const message: Points = [[40, 50], [260, 50], [260, 210], [150, 210], [80, 265], [80, 210], [40, 210]];
const document: Points = [[75, 30], [200, 30], [255, 85], [255, 270], [75, 270], [75, 180], [75, 100]];
const checklist: Points = [[55, 35], [245, 35], [245, 100], [245, 270], [55, 270], [55, 185], [55, 110]];
const problem: Points = [[85, 35], [215, 35], [270, 105], [245, 245], [55, 245], [30, 140], [50, 80]];
const product: Points = [[45, 55], [255, 55], [255, 100], [255, 245], [45, 245], [45, 175], [45, 105]];
const alert = ["M150 87V171M146 197H154V205H146Z"];
function pair(id: string, purpose: string, fromPoints: Points, toPoints: Points, fromMarks: string[], toMarks: string[]) {
  return { id, width: 300, height: 300, license: "CC0-1.0", source: "Original schematic artwork authored for HyperFrames V3", purpose, schematic: true,
    fromPoints, toPoints, from: outline(fromPoints), to: outline(toPoints), fromMarks, toMarks };
}
export const newSemanticPairs = [
  pair("question-answer@1", "A question becomes an answer card; schematic, not a real generated response.", message, document,
    ["M125 95Q125 70 150 70Q178 70 178 94Q178 109 151 122V138M147 155H155V163H147Z"], ["M107 127H220M107 160H220M107 193H190"]),
  pair("document-checklist@1", "A record becomes a checklist while preserving the document identity.", document, checklist, [],
    [90, 150, 210].map((y) => `M85 ${y}H108V${y + 23}H85ZM90 ${y + 11}L96 ${y + 17}L108 ${y + 3}M130 ${y + 11}H216`)),
  pair("complaints-problem@1", "Multiple complaint symbols form one identified problem; no observed customer data.", [[25, 45], [275, 45], [275, 210], [175, 210], [150, 265], [125, 210], [25, 210]], problem,
    [50, 121, 192].map((x) => `M${x} 93H${x + 58}V137H${x + 35}L${x + 22} 151V137H${x}ZM${x + 10} 106H${x + 46}M${x + 10} 119H${x + 38}`), alert),
  pair("problem-product@1", "The same identified problem becomes a proposed software concept; no proven demand or sales.", problem, product, alert,
    ["M45 96H255M73 72H78M90 72H95M107 72H112M75 120H145V195H75ZM165 126H229M165 152H229M165 178H208"]),
  pair("blocks-chart@1", "Data blocks become a schematic chart icon; use source-bound comparison for actual values.", [[45, 35], [255, 35], [255, 230], [255, 230], [255, 265], [45, 265], [45, 140]], [[55, 40], [75, 40], [75, 225], [265, 225], [265, 245], [55, 245], [55, 140]],
    [65, 125, 185].map((y) => `M90 ${y}H190V${y + 35}H90Z`), ["M105 225V165H140V225ZM157 225V120H192V225ZM209 225V80H244V225Z"]),
  pair("manual-automated@1", "Separate manual records become connected workflow steps; no real automation is executed.", document, product,
    [90, 140, 190].map((x) => `M${x} 125H${x + 32}V190H${x}ZM${x + 7} 143H${x + 25}M${x + 7} 158H${x + 25}`),
    ["M45 96H255M75 145H110V185H75ZM132 145H167V185H132ZM190 145H225V185H190ZM110 165H132M167 165H190M124 158L132 165L124 172M182 158L190 165L182 172"]),
];
const hashes: Record<string, string> = {
  "question-answer@1": "1a4696edf5ff79316b5532f9aa3b0b8b076fea4ffb03ddc509f7cf0346364651",
  "document-checklist@1": "e41af3470f5277c3eaf6e92bca8526f7ba22840f6164983201d11e5ae21dab95",
  "complaints-problem@1": "71bb724a159776f229eb9a104b2c3a6c50bb75bb822e2c97db110ec550c3f5fe",
  "problem-product@1": "05a7392cd502f6ccf6b8ff8f27b35739b80a027fee15974ce3ea586752631187",
  "blocks-chart@1": "429a0406b69ea011c31d7a52b9118b9e0e5f1aa1bfb6d9befa4666345b470eb3",
  "manual-automated@1": "4a193304677c491a032f0d52dad5ac2ef20fdf2ed288a71557146658e626f4fc",
};
export const semanticMorphPairs = [...legacyPairs, ...newSemanticPairs.map((pair) => ({ pair, contentHash: hashes[pair.id] }))];
export const semanticMorphReferenceSchema = z.strictObject({ pairId: z.string(), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).refine((reference) => semanticMorphPairs.some((entry) => entry.pair.id === reference.pairId && entry.contentHash === reference.contentHash), "Unknown or changed semantic morph pair.");
export type SemanticMorphReference = z.infer<typeof semanticMorphReferenceSchema>;
export function semanticPair(reference: SemanticMorphReference) {
  semanticMorphReferenceSchema.parse(reference);
  const pair = semanticMorphPairs.find((entry) => entry.pair.id === reference.pairId)!.pair;
  return { ...pair, fromMarks: "fromMarks" in pair ? pair.fromMarks : [], toMarks: "toMarks" in pair ? pair.toMarks : [] };
}
export const morphChainSchema = z.strictObject({ pairs: z.array(semanticMorphReferenceSchema).min(1).max(4) }).refine((chain) => chain.pairs.every((reference) => semanticMorphReferenceSchema.safeParse(reference).success) && chain.pairs.every((reference, i) => {
  if (!i) return true;
  const before = semanticPair(chain.pairs[i - 1]), after = semanticPair(reference);
  return before.width === after.width && before.height === after.height && before.to === after.from && JSON.stringify(before.toMarks) === JSON.stringify(after.fromMarks);
}), "Morph chain must preserve exact intermediate geometry and marks.");
export type MorphChain = z.infer<typeof morphChainSchema>;
export const semanticMorphGuidance = "morph-chain@1 uses morphChain:{pairs:[{pairId,contentHash}]} from the registered semantic catalog, max4 steps. Only exact matching intermediate paths/marks may chain. The outline part has explicit morphStage:0 initially and the completed step count finally; morph-chain-step@1 {} advances one step in 18..90 frames. Keep the root/outline visible and unmasked during the step; root transforms are allowed. No model-provided paths, glyphs, selectors or destination overrides. The six new pairs are schematic concepts, not observed customer records, actual chart values, proven demand or real automation. Use UI/source-bound data components for authoritative content. Preserve legacy morph-shape@1 behavior and hashes.";
