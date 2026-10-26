# AI creative mistakes

Canonical source: workflow/creative-rules.ts. Catalog: creative-quality@1. Regenerate with node scripts/creative-rules-doc.ts; tests enforce exact parity. Evidence describes known failure patterns, not measured improvement. User corrections remain proposed until explicitly confirmed after regression review.

## CQ-SEMANTIC v1

Stages: graphics. Severity: review.

Evidence: Generic geometry can illustrate nouns without explaining the mechanism.

Correction: Use curated semantic artwork, diagrams or the existing scene families. Specify meaning, focal point, hierarchy, assets, palette, depth and continuity; preserve approved relationships.

Detection: Art-direction and phone-size rendered review; missing-art-direction heuristic.

Exceptions: Simple geometry is appropriate when it directly teaches the relationship.

## CQ-LAYOUT v1

Stages: graphics. Severity: review.

Evidence: Three neighboring shots can repeat the same family, layout and metaphor.

Correction: Vary composition as the teaching changes; document intentional continuity instead of forcing novelty.

Detection: inspectGraphics: layout-repetition and geometry-repetition.

Exceptions: Explicit continuityReason for a comparison or persistent mechanism.

## CQ-MOBILE v1

Stages: graphics, motion. Severity: review.

Evidence: Small labels, weak contrast and overlapping text undermine portrait explanations.

Correction: Use existing text-size, contrast, containment and overlap checks, then review actual frames at phone size.

Detection: Existing graphics and motion inspectors; human review at 360px width.

Exceptions: Source-required exact text may need a dedicated close-up.

## CQ-ENERGY v1

Stages: motion. Severity: review.

Evidence: Slow entrances, camera-only drift and repeated presets create passive sequences.

Correction: Use an energetic hook, clear developing explanation and concise payoff. Tie meaningful actions to measured narration, vary choreography and preserve comprehension holds. Never add motion solely to satisfy activity thresholds.

Detection: inspectCreativeMotion: stillness, slow-entrance, camera-only-drift, repetitive-preset, passive-sequence.

Exceptions: Purposeful reading holds and coherent repeated causal actions.

## CQ-VOICE v1

Stages: writing, narration. Severity: review.

Evidence: Uniform delivery and repeated generic phrasing can make teaching monotonous.

Correction: Use conversational topic-specific wording and one consistent voice identity. Deliver an upbeat hook, varied explanation and slower confident payoff; compare real takes by listening before choosing a provider.

Detection: Human pronunciation, delivery and voice-consistency review; signal metrics cannot prove expressiveness.

Exceptions: Calm sections and deliberate emphasis may require a different local pace.

## CQ-INTEGRITY v1

Stages: graphics, motion, narration. Severity: technical.

Evidence: Invented assets or estimated word timing can silently invalidate approved teaching and synchronization.

Correction: Use validated registered assets and measured PCM16 audio. Preserve hashes, exact accepted facts and human approval gates. Never claim measured word alignment without verified spans.

Detection: Existing schemas, asset/source hashes, inspectWav and measured timing validators.

Exceptions: Explicitly labeled planning estimates remain allowed before narration import.
