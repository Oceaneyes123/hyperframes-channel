import { z } from "zod";
import { comparisonSources, formatComparisonValue } from "./comparison.ts";

export const numericReferenceSchema = z.strictObject({
  sourceId: z.string(), contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  recordId: z.string(), previousRecordId: z.string().optional(), relationshipId: z.string().optional(),
}).refine((reference) => {
  const entry = comparisonSources.find((entry) => entry.source.id === reference.sourceId && entry.contentHash === reference.contentHash);
  if (!entry?.source.records.some((record) => record.id === reference.recordId)) return false;
  if (!reference.previousRecordId) return !reference.relationshipId;
  return entry.source.relationships?.some((relationship) => relationship.id === reference.relationshipId && relationship.from === reference.previousRecordId && relationship.to === reference.recordId) ?? false;
}, "Numeric display requires an exact source record and an explicit relationship for two supplied endpoints.");
export type NumericReference = z.infer<typeof numericReferenceSchema>;

export function numericData(input: NumericReference) {
  const reference = numericReferenceSchema.parse(input);
  const source = comparisonSources.find((entry) => entry.source.id === reference.sourceId)!.source;
  const target = source.records.find((record) => record.id === reference.recordId)!;
  const previous = source.records.find((record) => record.id === reference.previousRecordId);
  return { source, target, previous, final: formatComparisonValue(target.value, source.unit), initial: previous ? formatComparisonValue(previous.value, source.unit) : "" };
}

// Fixed cells reserve both endpoint widths; intermediate digits are decorative.
export function numericColumns(initial: string, final: string) {
  const width = Math.max(initial.length, final.length), from = initial.padStart(width), to = final.padStart(width);
  return [...to].map((last, index) => {
    const first = from[index], digit = /\d/.test(last) && (/\d/.test(first) || first === " ");
    if (!digit) return { first, last, digits: "", distance: 0 };
    const a = first === " " ? 0 : Number(first), distance = 10 + (Number(last) - a + 10) % 10;
    return { first, last, digits: Array.from({ length: distance + 1 }, (_, i) => (a + i) % 10).join(""), distance };
  });
}

export const numericMotionGuidance = "numeric-display@1 requires numeric:{sourceId,contentHash,recordId} from supplied registered sources; no inline values. A previousRecordId requires the matching relationshipId from that source. digits is its sole fixed-geometry part, initial numericProgress:0 and final 1. odometer-roll@1 {} or value-transition@1 {} target that visible unmasked part for 18..90 frames; value-transition needs both sourced endpoints. numeric-reveal is a mask-reveal recipe, currency-display uses a currency source, percent-emphasis uses a percent source and a settled reading hold. Never imply rolling intermediate digits are measured observations. Preserve exact source formatting and provenance.";
