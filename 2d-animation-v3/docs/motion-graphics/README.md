# Motion graphics workflow

New full Studio motion proposals use interpreter 3 with versioned beats. Saved interpreter-1/2 artifacts retain their rendering path. Legacy scoped revisions continue the existing action contract.

## Review flow

1. Accept the script. Optionally import its PCM16 WAV and measured line timing under **Narration timing**. Phrase/word spans require manual verification or a verified aligner; no constant-speed word estimates are generated.
2. Review and accept visual concepts/storyboards. Models choose installed components and parameters, never executable SVG, JavaScript, selectors or external assets.
3. Generate motion with Calm, Balanced, Energetic (default) or Intense guidance. Energy shapes actions rather than multiplying all durations. Audio duration and reading holds remain authoritative.
4. Inspect the Player, shot timeline and Motion Quality findings. **Review moment and use suggestion** selects, seeks and prefills an instruction; submitting a revision and accepting it remain explicit actions.
5. Final narration must match the planning audio/timing when present. Exact current inputs still require Gate 1, independent Gate 2 and explicit render authorization.

Timing corrections are immutable and invalidate dependent motion. Script edits make timing stale. Source/engine changes invalidate applicable production bindings; approvals never transfer automatically.

## Choreography and components

The six semantic presets are `snap-overshoot@1`, `cascade@1`, `converge-assemble@1`, `punch-zoom@1`, `flow-handoff@1` and `split-disperse@1`. `hold@1` protects reading intervals; `mask-reveal@1` animates bounded component masks. All expand into the existing frame-driven GSAP timeline, retaining 64 actions per shot and 128 expanded targets per continuity group. Unknown targets/versions, conflicting property ownership and invalid endpoints fail closed.

| Component | Named parts |
| --- | --- |
| `inbox-panel@1` | message, highlight, extracted, packet |
| `approval-flow@1` | request, approved, handoff |
| `api-flow@1` | request, response, cache |
| `cost-chart@1` | bar-one, bar-two, total |
| `kinetic-phrase@1` | lead, keyword, underline |
| `funnel@1` | inputs, bottleneck, output |

Parts use `object-id.part-id` targets with bounded canvas-relative offsets, scale, opacity, color and reveal. Static and animated views share authored SVG and instance-specific clip IDs. Dimensions, labels and values stay fixed within an actor; changes use explicit replacement actors. Charts require supplied integer units, never invented currency or earnings. Kinetic phrases contain one to five words.

Geometric handoffs use root actors with staged geometry. Part-to-part world geometry and velocity-matched `motion-match` transitions remain unsupported.

## Diagnostic limits

`motion-quality@1` reports versioned thresholds, shot/frame ranges, evidence and suggestions for stillness excluding intentional holds, repetition, slow entrances, competing effects, camera drift, text size, contrast, clipping, crowding, weak matched seams and potentially unclear progression. It provides no universal quality score.

Font checks share actual renderer fit formulas. Geometry/contrast findings are labeled heuristics: boxes do not prove painted-pixel overlap; transparency, complex surfaces and intentional internal clipping need frame review. Independent moving playback, listening and creative preference remain required.

## Storage and rollback

Schema 8 only adds `planning_timing`; existing tables are preserved. Timing JSON/WAV files are immutable and hash-bound, with SQLite owning their index. Failure cleanup removes only this attempt's files. Crash-orphaned files remain available for recovery.

The local pre-upgrade backup is `.data/motion-graphics-pre-schema8-1792761425224/studio.sqlite` (schema 7; integrity check passed). Existing immutable video files were not rewritten. Before rollback, stop the app, preserve current data, and restore matching prior source/database/media to separate paths. Old code rejects schema 8; do not mix schema versions on one database or destructively downgrade it.

## Checks and release evidence

Run `npm run check` and `npm run build`. `scripts/verify-motion-engine.mjs` accepts `--beats`, `--presets` or `--components` for isolated sequential/fresh-frame and decode checks. Receipts belong to their recorded engine hash. `scripts/compare-motion-presets.ts` creates review-only A/B media from frozen Reddit inputs and existing narration; it never grants acceptance or production gates.

See the [implementation backlog](../MOTION-GRAPHICS-IMPLEMENTATION-PLAN.md) for actual status. Blind A/B/C preference and an independently reviewed full 50–75-second output remain release gates.

`scripts/prepare-motion-evaluation.mjs` prepares a randomized review folder from the frozen A/B comparison and a Codex-authored component reference C. C is not a live backend-model sample. Share only its `review/` folder; the implementation key stays outside it. Reviewers record prior exposure and playback/listening observations before the implementation identities are revealed. An empty review form grants no approval.
