import { z } from "zod";
import entries from "./comparison-sources.json" with { type: "json" };

const key = z.string().regex(/^[a-z][a-z0-9-]{0,39}$/);
export const comparisonSourceSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]{0,39}@\d+$/),
  provenance: z.enum(["supplied", "synthetic"]), note: z.string().trim().min(1).max(500),
  unit: z.discriminatedUnion("kind", [z.strictObject({ kind: z.literal("count"), label: z.string().trim().min(1).max(24) }), z.strictObject({ kind: z.literal("currency"), currency: z.enum(["USD", "PHP", "EUR", "GBP"]), minorDigits: z.literal(2) })]),
  minimum: z.number().int().min(-1_000_000_000).max(0), maximum: z.number().int().positive().max(1_000_000_000),
  records: z.array(z.strictObject({ id: key, label: z.string().trim().min(1).max(24), value: z.number().int().min(-1_000_000_000).max(1_000_000_000) })).min(2).max(12),
}).refine((source) => new Set(source.records.map((record) => record.id)).size === source.records.length && source.records.every((record) => record.value >= source.minimum && record.value <= source.maximum), "Source values must fit one fixed common scale and have unique IDs.");

export const comparisonSources = entries.map((entry) => ({ source: comparisonSourceSchema.parse(entry.source), contentHash: entry.contentHash }));
export const comparisonReferenceSchema = z.strictObject({ sourceId: z.string(), contentHash: z.string().regex(/^[a-f0-9]{64}$/), recordIds: z.tuple([key, key]) }).refine((reference) => {
  const entry = comparisonSources.find((entry) => entry.source.id === reference.sourceId && entry.contentHash === reference.contentHash);
  return reference.recordIds[0] !== reference.recordIds[1] && !!entry && reference.recordIds.every((id) => entry.source.records.some((record) => record.id === id));
}, "Comparison must reference two supplied records and the exact source hash.");
export type ComparisonReference = z.infer<typeof comparisonReferenceSchema>;
export function comparisonData(input: ComparisonReference) {
  const reference = comparisonReferenceSchema.parse(input), { source } = comparisonSources.find((entry) => entry.source.id === reference.sourceId)!;
  return { source, records: reference.recordIds.map((id) => source.records.find((record) => record.id === id)!) };
}
export function formatComparisonValue(value: number, unit: z.infer<typeof comparisonSourceSchema>["unit"]) {
  return unit.kind === "currency" ? new Intl.NumberFormat("en-US", { style: "currency", currency: unit.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100) : new Intl.NumberFormat("en-US").format(value);
}
