import { z } from "zod";
import atlas from "./variable-type-atlas.json" with { type: "json" };

export const variableFonts = atlas.fonts;
type Glyph = {path: string; bounds: number[]; advance: number};
type AxisState = {axes: Record<string, number>; glyphs: Record<string, Glyph>};
type Expression = {id: string; label: string; font: keyof typeof variableFonts; from: Record<string, number>; to: Record<string, number>; characters: boolean; steps: number; contentHash: string; states: AxisState[]; envelope: {width: number; ascent: number; descent: number; cells: Record<string, number>}};
export const variableExpressions = atlas.expressions as unknown as Expression[];
export const variableTypeReferenceSchema = z.strictObject({ id: z.enum(["weight@1", "optical@1", "width@1", "hierarchy@1", "character@1"]), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).refine(ref => variableExpressions.some(entry => entry.id === ref.id && entry.contentHash === ref.contentHash), "Unknown variable-font expression or changed outlines.");
export type VariableTypeReference = z.infer<typeof variableTypeReferenceSchema>;
export function variableExpression(reference: VariableTypeReference) {
  variableTypeReferenceSchema.parse(reference);
  return variableExpressions.find(entry => entry.id === reference.id)!;
}
export function variableAxisState(reference: VariableTypeReference, progress: number, index = 0, count = 1) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error("Variable font progress exceeds its envelope.");
  const entry = variableExpression(reference);
  const local = entry.characters ? Math.max(0, Math.min(1, (progress - index / Math.max(1, count - 1) * .45) / .55)) : progress;
  return entry.states[Math.round(local * entry.steps)];
}
export function variableTypeLayout(reference: VariableTypeReference, width: number, height: number, coordinateScale = 1) {
  if (![width, height].every(value => Number.isFinite(value) && value > 0)) throw new Error("Invalid variable font box.");
  const entry = variableExpression(reference), font = variableFonts[entry.font as keyof typeof variableFonts];
  const lines = entry.label.split("\n"), e = entry.envelope;
  const unit = Math.min(width / (e.width + font.unitsPerEm * .04), height / ((e.ascent + e.descent) * lines.length * 1.3), 110 * coordinateScale / font.unitsPerEm);
  return { unit, baseline: e.ascent * unit, lineHeight: (e.ascent + e.descent) * unit * 1.3, width: e.width * unit, height: (e.ascent + e.descent) * unit * lines.length * 1.3 };
}
export async function verifyVariableFont(bytes: ArrayBuffer, fontId: keyof typeof variableFonts) {
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), byte => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== variableFonts[fontId].sha256) throw new Error("Variable font bytes changed or are missing.");
}
export const variableTypeGuidance = "variable-type@1 is curated real variable typography. Bind variableType:{id,contentHash} from the current expression catalog, exact registered label in both drawings, and one visible fixed glyphs part with axisProgress:0 initially and 1 finally. font-expression@1 {} targets objectId.glyphs for 18..90 frames; finish before a reading hold. It owns weight/optical-size/width together. Registered weight and optical expressions use Inter; genuine width/hierarchy/character combinations use OFL Roboto Flex. Actual font instances are measured at all 121 evaluated axis states, including independently staggered characters; measured envelopes reserve all states; staggered glyphs use fixed cells, no paragraph reflow or horizontal scaling. Automatic optical sizing is disabled by outline rendering. Unsupported labels, axes, endpoints and concurrent text effects reject. Root movement and part mask reveal are available separately. Do not rewrite narration to fit a gallery phrase. New authored copy needs a reviewed atlas entry first.";
