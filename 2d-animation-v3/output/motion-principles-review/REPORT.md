# Motion principles: Phase 1 replacement and Phase 2

Date: October 29, 2026. Branch: `codex/motion-quality-principles`.

The user replaced unavailable reference clips with two motion-skill repositories.
[Source review and transfer decisions](../../docs/motion-principles.md) describe
what was inspected and adopted. No repository was installed or executed. This
work integrates compatible principles into V3; it does not establish equivalent
visual quality, measured reference targets or improved audience retention.

## Implemented

- A [skill-derived profile](../../docs/motion-principles-profile.json) keeps all
  empirical reference measurements null. The comparison command applies explicit
  experimental settings to existing plans.
- Five advisory detectors cover object inactivity, primary-preset concentration,
  adjacent illustration reuse, root text budgets and standalone disclaimer labels.
  They emit `review`, never block export as new aesthetic requirements, and retain
  comprehension/continuity exceptions for human review.
- [Beat sheets](../../docs/beat-sheet.md) are validated optional metadata on
  writing drafts and storyboard shots. Generation prompts request them; motion
  maps storyboard intent to existing supported actions. Import still uses only
  spoken line text. Estimates never become measured word timing or generated audio.
- Catalog `creative-quality@2` and generated AI-CREATIVE-MISTAKES documentation
  describe these principles. Historical snapshots remain unchanged. New rule
  dependencies are included in the engine binding; old gates cannot authorize a
  future export with modified engine inputs.

## Diagnostic comparison

Raw source-linked results: [comparison.json](comparison.json).

| New review finding | Existing 74.8 s Terra | Original 10 s intense example |
| --- | ---: | ---: |
| Inactive object span over 45 frames | 12 | 0 |
| Primary preset share over 40%, minimum three primary beats | 0 | 0 |
| Neighboring illustration reuse | 3 | 4 |
| More than two potentially visible root text actors in a shot | 2 | 1 |
| Standalone provenance label | 3 | 1 |

These clips have different durations/content. Counts are not a controlled quality
comparison. Inactive spans differ from Phase 0 onset-free windows: they measure
gaps between action intervals, ignoring declared holds and camera-only drift.
Illustration reuse can be desirable continuity. Text counts include sequential
root actors and omit embedded artwork text. Hidden part actions can affect the
activity heuristic. Actual frames, playback, audio and phone-size readability
remain human review tasks.

Primary-only preset concentration also differs from all-preset usage. Terra has
3/9 primary snap-overshoot beats (33.3%), while Phase 0 counted 14/34 uses overall
(41.2%). No primary preset exceeds the experimental limit in these two plans.

## Verification

- `npm run check`: lint/typecheck passed; all 190 tests passed. Two existing
  unused-variable lint warnings remain. [check.log](check.log).
- `npm run build`: failed in Turbopack CSS processing with `node process exited
  before we could connect to it with exit code: 0`, matching the previously
  documented host limitation. [build.log](build.log). No build workaround applied.
- `git diff --check`: passed. Existing interpreter compile fixtures, writing and
  visual persistence flows, generated-doc parity, new diagnostics, metadata
  boundaries and engine-hash invalidation tests passed.
- [preservation.json](preservation.json): exact MP4, narration, motion and
  storyboard hashes still match the Phase 0 manifest. V1/V2 and accepted artifacts
  were not edited. No production approval, feedback activation, commit, push or
  publishing action occurred.

## Stop point

Phase 2 complete. New scene components, expanded artwork, local alignment,
soundtrack integration and the controlled 15-second render pair remain later
phases. Their capabilities were evaluated for compatibility, not implemented or
tested in this increment. Wait for the user's approval before Phase 3.
