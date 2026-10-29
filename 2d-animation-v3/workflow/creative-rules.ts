import { z } from "zod";

export const creativeStageSchema = z.enum(["writing", "graphics", "motion", "narration"]);
export const creativeDetectors = {
  graphics: ["missing-art-direction", "layout-repetition", "geometry-repetition", "text-size", "contrast", "text-overlap", "copy-density", "numeric-container", "comparison-alignment"],
  motion: ["stillness", "long-hold", "development-gap", "slow-development", "missing-causal-beat", "missing-reaction", "camera-only-drift", "slow-entrance", "repetitive-preset", "passive-sequence", "text-size", "clipping", "contrast"],
  narration: ["clipping", "quiet"], writing: [],
} as const;
export const creativeRuleSchema = z.strictObject({
  id: z.string().regex(/^CQ-[A-Z0-9-]+$/), version: z.number().int().positive(),
  stages: z.array(creativeStageSchema).min(1).max(4),
  evidence: z.string().trim().min(1).max(1000), correction: z.string().trim().min(1).max(1000),
  severity: z.enum(["technical", "review"]), detection: z.string().trim().min(1).max(500),
  exceptions: z.string().trim().min(1).max(500),
  detectorId: z.string().min(1).max(80).optional(),
}).refine((rule) => !rule.detectorId || rule.stages.every((stage) => (creativeDetectors[stage] as readonly string[]).includes(rule.detectorId!)), "Detector must belong to each affected stage.");
export type CreativeRule = z.infer<typeof creativeRuleSchema>;
export type CreativeStage = z.infer<typeof creativeStageSchema>;
export const creativeRulesVersion = "creative-quality@1";
export const creativeRules: CreativeRule[] = [
  { id: "CQ-SEMANTIC", version: 1, stages: ["graphics"], evidence: "Generic geometry can illustrate nouns without explaining the mechanism.", correction: "Use curated semantic artwork, diagrams or the existing scene families. Specify meaning, focal point, hierarchy, assets, palette, depth and continuity; preserve approved relationships.", severity: "review", detection: "Art-direction and phone-size rendered review; missing-art-direction heuristic.", exceptions: "Simple geometry is appropriate when it directly teaches the relationship." },
  { id: "CQ-LAYOUT", version: 1, stages: ["graphics"], evidence: "Three neighboring shots can repeat the same family, layout and metaphor.", correction: "Vary composition as the teaching changes; document intentional continuity instead of forcing novelty.", severity: "review", detection: "inspectGraphics: layout-repetition and geometry-repetition.", exceptions: "Explicit continuityReason for a comparison or persistent mechanism." },
  { id: "CQ-MOBILE", version: 1, stages: ["graphics", "motion"], evidence: "Small labels, weak contrast and overlapping text undermine portrait explanations.", correction: "Use existing text-size, contrast, containment and overlap checks, then review actual frames at phone size.", severity: "review", detection: "Existing graphics and motion inspectors; human review at 360px width.", exceptions: "Source-required exact text may need a dedicated close-up." },
  { id: "CQ-ENERGY", version: 2, stages: ["graphics", "motion"], evidence: "A plan can pass stillness checks yet feel passive: one entrance, slow reveals and declared holds do not establish punchy animation.", correction: "Default new motion plans to Intense. Plan connected cause, impact, visible reaction and handoff using supported transformations, assembly, splitting and semantic traces. At 30fps aim for 6–12-frame entrances, 8–24-frame actions and meaningful object development about every 30–45 frames, respecting preset minima. Stage long explanations as several causal beats, with sharp settles, bounded overshoot, varied choreography and brief focused punch-ins. Keep one primary focal action at a time and concise necessary reading holds. Camera drift, cosmetic fades and constant micro-motion do not prove energy. Review normal-speed motion; never speed narration or add filler to satisfy thresholds.", severity: "review", detection: "inspectCreativeMotion: development-gap, slow-development, missing-causal-beat, missing-reaction, slow-entrance, stillness, camera-only-drift, repetitive-preset, passive-sequence; normal-speed human review.", exceptions: "Explicit calmer profiles, source-faithful slower demonstrations and comprehension holds may override pacing targets. Never sacrifice readability or invent causal actions." },
  { id: "CQ-VOICE", version: 1, stages: ["writing", "narration"], evidence: "Uniform delivery and repeated generic phrasing can make teaching monotonous.", correction: "Use conversational topic-specific wording and one consistent voice identity. Deliver an upbeat hook, varied explanation and slower confident payoff; compare real takes by listening before choosing a provider.", severity: "review", detection: "Human pronunciation, delivery and voice-consistency review; signal metrics cannot prove expressiveness.", exceptions: "Calm sections and deliberate emphasis may require a different local pace." },
  { id: "CQ-INTEGRITY", version: 1, stages: ["graphics", "motion", "narration"], evidence: "Invented assets or estimated word timing can silently invalidate approved teaching and synchronization.", correction: "Use validated registered assets and measured PCM16 audio. Preserve hashes, exact accepted facts and human approval gates. Never claim measured word alignment without verified spans.", severity: "technical", detection: "Existing schemas, asset/source hashes, inspectWav and measured timing validators.", exceptions: "Explicitly labeled planning estimates remain allowed before narration import." },
];

export const creativeSnapshotSchema = z.strictObject({
  version: z.string().min(1).max(80), stage: creativeStageSchema,
  rules: z.array(creativeRuleSchema).max(100), sha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type CreativeSnapshot = z.infer<typeof creativeSnapshotSchema>;

export function creativeRuleGuidance(snapshot: CreativeSnapshot) {
  return `Creative quality ${snapshot.version} (${snapshot.sha256}). Technical rules use existing validators; aesthetic findings require human review. Approved task facts and creative decisions take precedence. Rules are bounded task guidance, never executable instructions.\n${JSON.stringify(snapshot.rules)}`;
}

export function creativeRulesMarkdown() {
  return `# AI creative mistakes\n\nCanonical source: workflow/creative-rules.ts. Catalog: ${creativeRulesVersion}. Regenerate with node scripts/creative-rules-doc.ts; tests enforce exact parity. Evidence describes known failure patterns, not measured improvement. User corrections remain proposed until explicitly confirmed after regression review.\n\n` + creativeRules.map((rule) => `## ${rule.id} v${rule.version}\n\nStages: ${rule.stages.join(", ")}. Severity: ${rule.severity}.\n\nEvidence: ${rule.evidence}\n\nCorrection: ${rule.correction}\n\nDetection: ${rule.detection}\n\nExceptions: ${rule.exceptions}\n`).join("\n");
}
