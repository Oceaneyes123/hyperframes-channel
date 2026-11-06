# Creative Quality System v1

Apply the [quality bar](quality-bar.md) alongside this system. Its user corrections are human authoring/review guidance, not activated CQ entries or automatic detection of bland backgrounds, uniform headers, unclear speech or false causality. Never hand-edit generated mistakes documentation.

## Skill-derived rhythm experiment

[Motion principles](motion-principles.md) records inspected sources, adaptations and conflicts. [Profile](motion-principles-profile.json) settings are experimental; reference-video measurements remain unknown. Catalog `creative-quality@2` adds beat-sheet guidance and five advisory `review` detectors: object inactivity, primary-preset concentration, neighboring illustration reuse, potentially visible root-text budget and standalone audience-facing provenance labels. Holds, continuity and necessary source text may justify exceptions. Comparison uses supplied profile settings; Studio uses defaults. Detectors cannot measure attention, embedded artwork text or semantic quality.

[Beat sheets](beat-sheet.md) are optional validated writing/storyboard metadata. Generation requests them; motion consumes the storyboard sheet as intent using supported schemas/measured anchors. Older artifacts remain readable. No audio/executable cue is generated; imported speech remains only draft spoken lines. Beat-sheet/rhythm-rule dependencies participate in engine hashing; changed inputs prevent old gates authorizing future exports.

The system extends existing Studio, curated artwork, GSAP/Remotion, inspectors, measured timing and exact gates. Technical validity does not establish visual/audible quality; release evaluation needs actual candidates and independent human review.

## Rules and correction ownership

`workflow/creative-rules.ts` owns built-in IDs/versions, stages, evidence, corrections, detection, severity and exceptions. After reviewed changes generate `docs/AI-CREATIVE-MISTAKES.md` with `node scripts/creative-rules-doc.ts`; tests require exact parity. Bump rule version when meaning changes and catalog version for a new catalog.

Writing, selected-text revision, visuals, motion and local narration capture applicable definitions plus SHA-256 snapshot. Proposals retain snapshots in immutable hash-indexed artifacts. Historical artifacts without snapshots remain readable, never retroactively attributed. Edits/activation affect future requests; running requests keep their captured snapshot.

Studio **Creative quality review** groups graphics/motion/voice findings, linking shots/time ranges and full-video provenance. Graphic review owns before/after artwork and phone-size frames; Motion owns synchronized moving comparisons. Model suggestions/manual observations may become proposed corrections.

Corrections live in configured `creative-feedback/`. Each immutable proposal has UUID-derived rule ID, source artifact/hash, project/shot, evidence, correction and exception. Activation requires the user to run the stage inspector against source and selected same-project artifacts, record regression evidence, confirm human review and activate. Reports record inspector findings, not automatic understanding of arbitrary correction prose. Activation applies across future projects; rejection/pending suggestions never become policy.

Exclusive hash-bound decisions reject duplicate/changed proposals. Withdraw active rules only with explicit human confirmation/reason; replacements are new proposals. Preserve snapshots; never edit decision JSON manually. Back up corrections with database, videos and takes. Interrupted/corrupt records fail closed; recover known backups.

Structural validators retain asset/geometry/source/audio/timing constraints. Readability, diversity and pacing are review findings. Explicit storyboard review may acknowledge canvas-copy concerns; numeric containment/alignment remain blockers. Aesthetic heuristics do not automatically reject valid human-reviewed plans. Engine/code changes may stale bindings, preserving historical decisions. Rule activation alone changes neither bindings nor accepted decisions. Gates/render authorization remain explicit and exact-input.

## Graphics and motion

Default Intense; select other profiles explicitly. CQ-ENERGY v2 reaches storyboards: plan cause, impact, visible response and handoff before presets. At 30fps target 6–12-frame entrances, 8–18-frame actions and meaningful development about every 30 frames where teaching permits. Energetic allows more generous limits. The experimental 45-frame inactivity threshold is separate/advisory. Source-faithful slower demonstrations, reading holds and measured narration override cadence; never add jitter/filler or speed speech.

The inspector flags development gaps (including declared holds), drawn-out actions, missing declared causal beats and receiving responses. A response means a different actor/part changes during a major beat or within 12 frames after it; this cannot prove semantic causality. Self-contained transformations may be intentional. Whole-video rhythm shows shot duration, declared beats, gaps and response findings. Counts cannot prove success. Motion acceptance requires explicit normal-speed rhythm/cause-response review; rejection remains available without confirmations.

Intense/new CQ-ENERGY-v2 workflows require approved representative-scene review before the full moving render. [Commands/confirmations](workflow-efficiency.md#representative-scene-and-whole-video-review) bind exact motion, engine, review manifest/media. Changed inputs require new review; scene approval covers neither whole video nor production gates. Existing videos/decisions remain unchanged; new rules/snapshots apply prospectively.

Reuse `shot.design`, environments, curated assets, diagrams and eight composition families. New shots specify meaning, hierarchy/composition, assets, palette, depth and continuity; legacy shots remain readable. Geometry is appropriate when it teaches, not as filler. Never generate executable SVG/fabricate assets.

Graphics review flags missing direction and three approximately identical neighboring endpoint layouts regardless of differing prose. Geometry rounds boxes to five percentage points and includes shape type; it cannot establish perceptual similarity. `continuityReason` exempts intentional sequences. Inspect actual 360px-wide frames.

Motion review covers whole-timeline inactivity, long holds, slow entrances, repeated presets/passive runs, competing effects, camera-only drift, bounds and seams. Guidance calls for energetic hook, development and concise payoff without automatic speed multipliers/filler. Keep full-frame/seek/seam proof scripts. Export comparison samples two frames/second for low-change intervals; pixels cannot distinguish purposeful action from camera movement, and quiet intervals may be reading holds.

## Local narration evaluation

Use the [narration evaluation reference](narration-evaluation.md) for adapter capabilities, exact configuration, request fields, diagnostics, normalization and recorded host limitations. Evaluation never selects a default or replaces listening approval; current narration follows the [quality bar](quality-bar.md). Segment boundaries are not word alignment. Preserve takes, hashes and approval scope.

## Controlled release comparison

Freeze script/facts/goals, board, motion, audio and export hashes from a complete 50–75-second baseline. Identified candidate: 71.933-second `videos/1c65e530-9583-4a92-ab5c-2c67d0b89063/production/95bbe282-0ce2-448b-8416-7229740e95ef/export.mp4`; selection is not quality/content approval.

`node scripts/evaluate-creative-quality.ts <comparison.json>` takes `baseline`/`candidate`, each with `storyboard`, `motion`, `narration`, `narrationId`, `video`, plus new `output`. Validate complete duration, matching facts/source identities, motion contracts, measured audio, metadata/decode and source-audio sync. Write exclusive reports/finding counts; never overwrite comparisons or infer release.

After actual review, `node scripts/review-creative-quality.ts <review.json>` takes `report`, `output`, and `review`: `reviewedByHuman`, `reviewer`, pass/fail `desktop`/`mobile`/`listening`/`comprehension`, `comparison` (`improved`/`not-improved`/`inconclusive`), `blinded`, `criticalIssuesOpen`, `notes`. Recheck source hashes; record review without granting production gates.

Watch both complete videos on desktop/phone, sound-off/with narration. Compare meaning, composition, purposeful motion, pacing, voice consistency, pronunciation and comprehension. Blind A/B labels when practical; keep key separate. Record reviewer, hashes, issues, preference/reasons. Human corrections may become reproducible fixtures before activation. Fewer findings do not establish improvement. Release requires fixed critical regressions, actual review and existing gates. Neural listening comparison/new full candidate remain outstanding.

## Verification from this increment

Dated software evidence, not current checkout/quality approval: webpack passed; default Turbopack had a CSS-worker failure, without permanent build-config changes. See the plan progress log for that increment's results.

Synthetic motion proof: 350 sequential frames, 11 fresh seeks, continuous seam, full silent decode. Isolated Studio retained disabled correction activation until human confirmation/evidence; desktop/390px mobile inspected. Two identical 18.2735-second Windows Speech requests produced matching hashes. Frozen baseline: `.planning/2026-10-26-creative-quality-v1/baseline.json`. No new release candidate or neural listening comparison was completed.
