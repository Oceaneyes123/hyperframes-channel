import { z } from "zod";

export const compositionFamilies = ["editorial-illustration", "technical-cutaway", "illustrated-workflow", "interface-demonstration", "visual-comparison", "data-storytelling", "visual-metaphor", "typographic-composition"] as const;
export const backgroundSchema = z.strictObject({
  family: z.enum(["soft-gradient", "geometric", "technical-grid", "atmospheric", "editorial", "environment"]),
  color: z.string().regex(/^#[a-fA-F0-9]{6}$/), accent: z.string().regex(/^#[a-fA-F0-9]{6}$/), depth: z.number().min(0).max(1),
});
export type Background = z.infer<typeof backgroundSchema>;
export const artDirectionSchema = z.strictObject({
  theme: z.literal("editorial-workflow@1"), family: z.enum(compositionFamilies), meaning: z.string().trim().min(1).max(500),
  metaphor: z.string().trim().min(1).max(200), focalPoint: z.string().trim().min(1).max(200), layout: z.string().trim().min(1).max(200),
  density: z.enum(["sparse", "balanced", "dense"]), continuityReason: z.string().trim().max(300),
});
export type ArtDirection = z.infer<typeof artDirectionSchema>;
export const creativeReviewSchema = z.strictObject({ findings: z.array(z.strictObject({
  shotIndex: z.number().int().min(0).max(39), dimension: z.enum(["clarity", "composition", "illustration", "background", "originality", "consistency", "relevance", "readability"]),
  evidence: z.string().trim().min(1).max(500), suggestion: z.string().trim().min(1).max(500),
})).max(40) });
