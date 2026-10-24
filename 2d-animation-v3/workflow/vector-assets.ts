import { z } from "zod";

export const assetKey = z.string().regex(/^[a-z][a-z0-9-]{0,39}@\d+$/);
export const layerKey = z.string().regex(/^[a-z][a-z0-9-]{0,19}$/);
const coordinate = z.number().min(-2000).max(2000);
const paint = z.enum(["ink", "muted", "accent", "mint", "paper", "surface", "line", "wash", "grid", "none"]);
const common = { fill: paint, stroke: paint, strokeWidth: z.number().min(0).max(20), opacity: z.number().min(0).max(1) };
type Paint = z.infer<typeof paint>;
type Painted = { fill: Paint; stroke: Paint; strokeWidth: number; opacity: number };
export type VectorNode = Painted & (
  { kind: "rect"; x: number; y: number; width: number; height: number; radius: number } |
  { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number } |
  { kind: "path"; d: string } |
  { kind: "group"; x: number; y: number; scale: number; rotation: number; blend: "normal" | "multiply"; clip?: { x: number; y: number; width: number; height: number }; children: VectorNode[] }
);
export const vectorNodeSchema: z.ZodType<VectorNode> = z.lazy(() => z.discriminatedUnion("kind", [
  z.strictObject({ ...common, kind: z.literal("rect"), x: coordinate, y: coordinate, width: z.number().positive().max(2000), height: z.number().positive().max(2000), radius: z.number().min(0).max(200) }),
  z.strictObject({ ...common, kind: z.literal("ellipse"), cx: coordinate, cy: coordinate, rx: z.number().positive().max(2000), ry: z.number().positive().max(2000) }),
  z.strictObject({ ...common, kind: z.literal("path"), d: z.string().min(1).max(6000).regex(/^[MmLlHhVvCcSsQqTtAaZz0-9.,+\-\sEe]+$/) }),
  z.strictObject({ ...common, kind: z.literal("group"), x: coordinate, y: coordinate, scale: z.number().min(.1).max(4), rotation: z.number().min(-360).max(360), blend: z.enum(["normal", "multiply"]),
    clip: z.strictObject({ x: coordinate, y: coordinate, width: z.number().positive().max(2000), height: z.number().positive().max(2000) }).optional(), children: z.array(vectorNodeSchema).min(1).max(60) }),
]));
export const vectorAssetSchema = z.strictObject({
  schemaVersion: z.literal(1), id: assetKey, source: z.string().trim().min(1).max(300), license: z.enum(["CC0-1.0", "MIT", "Apache-2.0", "CC-BY-4.0"]), attribution: z.string().trim().min(1).max(500),
  width: z.number().int().min(64).max(2000), height: z.number().int().min(64).max(2000),
  purpose: z.string().trim().min(1).max(500), tags: z.array(z.string().trim().min(1).max(40)).min(1).max(12),
  compositions: z.array(z.string().trim().min(1).max(40)).min(1).max(8),
  layers: z.array(z.strictObject({ id: layerKey, role: z.enum(["background", "subject", "detail", "packet"]), nodes: z.array(vectorNodeSchema).min(1).max(60) })).min(1).max(8),
}).superRefine((asset, context) => {
  if (new Set(asset.layers.map((layer) => layer.id)).size !== asset.layers.length) context.addIssue({ code: "custom", message: "Layer IDs must be unique." });
  if (!asset.id.endsWith("@1") && Number(asset.id.split("@")[1]) < 1) context.addIssue({ code: "custom", message: "Asset versions must be positive." });
});
export type VectorAsset = z.infer<typeof vectorAssetSchema>;

// Bound traversal before recursive Zod validation, including malformed group payloads.
export function parseVectorAsset(input: unknown): VectorAsset {
  let count = 0;
  const walk = (value: unknown, depth: number) => {
    if (++count > 8000 || depth > 14) throw new Error("Vector asset exceeds the structural budget.");
    if (Array.isArray(value)) value.forEach((item) => walk(item, depth + 1));
    else if (value && typeof value === "object") Object.values(value).forEach((item) => walk(item, depth + 1));
    else if (typeof value === "string" && value.length > 6000) throw new Error("Vector asset string exceeds the budget.");
  };
  walk(input, 0);
  return vectorAssetSchema.parse(input);
}
