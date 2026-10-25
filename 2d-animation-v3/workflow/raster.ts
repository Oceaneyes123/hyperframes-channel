import { z } from "zod";
import assets from "./raster-assets.json" with { type: "json" };

export const rasterAssets = assets;
export const rasterReferenceSchema = z.strictObject({ id: z.string(), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).refine((r) => rasterAssets.some((a) => a.id === r.id && a.contentHash === r.contentHash), "Unknown or changed local raster.");
export type RasterReference = z.infer<typeof rasterReferenceSchema>;
export function rasterAsset(reference: RasterReference) { rasterReferenceSchema.parse(reference); return rasterAssets.find((a) => a.id === reference.id)!; }
export async function verifyRaster(reference: RasterReference, bytes: ArrayBuffer, mime: string) {
  const asset = rasterAsset(reference), b = new Uint8Array(bytes), view = new DataView(bytes);
  if (mime.split(";")[0] !== asset.mime || b.length !== asset.byteLength || b.length > 8_000_000 || b.length < 33 || [137,80,78,71,13,10,26,10].some((v,i) => b[i] !== v)) throw new Error("Raster must be the registered bounded PNG.");
  if (view.getUint32(8) !== 13 || String.fromCharCode(...b.slice(12,16)) !== "IHDR" || view.getUint32(16) !== asset.width || view.getUint32(20) !== asset.height || asset.width * asset.height > 16_000_000 || b[24] !== 8 || b[25] !== (asset.hasAlpha ? 6 : 2) || b[26] !== 0 || b[27] !== 0 || b[28] !== 0) throw new Error("Raster dimensions or decoded format differ from the manifest.");
  let ended = false;
  for (let offset = 8; offset + 12 <= b.length;) {
    const length = view.getUint32(offset), type = String.fromCharCode(...b.slice(offset+4,offset+8));
    if (length > b.length - offset - 12 || type === "acTL") throw new Error("Truncated or animated raster is unsupported.");
    offset += length + 12;
    if (type === "IEND") { ended = length === 0 && offset === b.length; break; }
  }
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (v) => v.toString(16).padStart(2,"0")).join("");
  if (!ended || hash !== asset.contentHash) throw new Error("Raster is corrupt or has changed.");
  return asset;
}

export const editorialCollage = {
  id: "desk-editorial@1", width: 600, height: 800,
  source: "Original editable editorial assembly; fictional generated photo and CC0 authored vector/grain",
  layers: ["photo", "paper", "texture", "vector", "type"],
  photo: { id: assets[0].id, contentHash: assets[0].contentHash },
  texture: { id: assets[1].id, contentHash: assets[1].contentHash },
  crop: { x: 80, y: 80, width: 920, height: 1200 },
  photoBox: { x: 24, y: 24, width: 552, height: 720, radius: 12 },
  paperPath: "M30 520L570 484L580 752L48 786Z",
  vector: "document", label: "Review", typography: "inter-heading@1",
  blend: "normal", textureOpacity: .45,
} as const;
export const collageHash = "8648bc584e159636aa4a2439f4c1485d58469fa69ec1c952081bcf443f9bc64a";
export const collageReferenceSchema = z.strictObject({ id: z.literal(editorialCollage.id), contentHash: z.literal(collageHash) });
export type CollageReference = z.infer<typeof collageReferenceSchema>;
export const collageGuidance = "editorial-collage@1 requires collage:{id:desk-editorial@1,contentHash:<registered hash>}, label:Review and 3:4 artwork aspect (portrait height=width*.75). Local original fictional desk photo, paper, alpha grain, vector and measured type are separate named parts; use existing masks and part transforms. Crop, order, blend and asset bytes are curated and immutable. No remote URLs, SVG markup or unregistered image paths. Generated desk is illustrative, not an actual business. Photo provenance is AI-generated output, not a claimed third-party stock license. Keep reviewer provenance outside the canvas.";
