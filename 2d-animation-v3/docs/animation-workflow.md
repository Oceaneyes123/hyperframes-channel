# Connected animation workflow

Apply the [quality bar](quality-bar.md); start new briefs with [V3 prompt](../PROMPT_TEMPLATE.md). This guide owns stage order and production limits. Load [CLI commands](workflow-efficiency.md) for execution, [visual iteration](visual-iteration.md) for bounded critique, and only the capability reference needed below.

## Plan and accept artwork

1. Accept the exact current script. In **Visual concepts and storyboards**, generate three concepts, inspect their planning images and teaching approaches, and explicitly select one.
2. Generate the storyboard. Inspect each shot's narration, purpose, framing, subject, action, incoming transition, continuity and start/end drawings. Narration links locate shots. Use **Revise shot N only** for a scoped proposal, then accept the exact storyboard separately.
3. Apply the [quality bar's background and typography direction](quality-bar.md#backgrounds-visibly-tactile-composed-and-quiet-behind-copy): recognizable causal objects, sparse editable labels and canonical decorations. Put concept prose in **Concept details**, provenance in reviewer notes; invented customers, payments and results must never appear verified.
4. New/revised endpoints require nonzero environment depth and `texture:"rough-paper@1"`; preserve legacy `paper-grain@1`. Review exact relationships and scene-specific composition at phone size.

Drawings are static key states; motion appears after storyboard acceptance. Use registered local assets, fonts, components and supported actions. Arbitrary GIF/image uploads, generated code, SVG markup, selectors, URLs and plugins are unsupported; reviewed local rasters use the collage contract. Shared guidance lives in `server/visual-guidance.ts`. New requests do not rewrite immutable artifacts or approvals.

Graphic acceptance blocks overflowing bank amounts, comparison operators off the values' vertical centers and more than two non-code text actors per frame unless the applicable canvas-copy review acknowledges the concern. Numeric containment/alignment remain structural blockers; clipping cannot repair overflowing drawings. Inspect affected start/end frames at phone size.

## Review motion

New proposals default to Intense. Apply the [causal motion targets/exceptions](quality-bar.md#motion-a-decisive-mechanism-not-a-wobbling-object) and [text-treatment direction](quality-bar.md#typography-compose-each-label-for-its-scene), including all ten eligible styles/reuse without added copy. Use shot `textMotions`; settle root entrances first and preserve stable continuity/interface labels when justified.

`centered-text` fits a fixed single-line box; legacy `text` remains left-aligned. Width/height cannot animate: use movement, scale, opacity or replacement actors.

The client-only Remotion Player and local export share a composition. Play, pause, step, scrub, select shots and loop incoming boundaries. Scoped revisions may change one shot's actions, camera and duration while preserving every other shot and the script; changed durations shift downstream offsets. Compare accepted/proposed plans at the same global frame; the shorter holds its final frame. Only the main preview supplies audio/time. Explicitly accept or reject; stale/rejected/history remains readable without fresh approval.

Intense/new CQ-ENERGY-v2 candidates require exact narrated representative-scene approval before complete moving review. Apply the [review ladder](quality-bar.md#review-ladder-stop-before-repeating-a-rejected-style-at-scale) and [confirmation contract](workflow-efficiency.md#representative-scene-and-whole-video-review), including normal-speed/phone-size playback, full sound-on/off review and actual seam/layer/occlusion checks. Sample approval never covers unseen shots.

### Arrival transitions

| Type | Contract |
| --- | --- |
| `hard-cut` | Immediate cut; zero overlap. |
| `match-cut` | Immediate cut at an explicit geometry/camera-matched anchor. |
| `continuous` | One persistent SVG actor across a geometry/appearance/camera-matched seam. |
| `camera` | Lateral scene slide with overlap via the official Remotion presentation. |
| `reveal` | Incoming scene wipes over outgoing scene. |
| `split-screen` | Both complete compositions shrink into adjacent panels, hold, then incoming expands; at least 15 overlap frames. |
| `motion-match` | Rejected: velocity matching is unimplemented. |

Interpreter 2+ rejects incompatible presentation/type pairs and invalid/triple overlaps. Interpreter 1 retains its legacy interpretation, including old fades. Scoped revisions retain their legacy or beat contract and reject incompatible boundaries; use a full plan to upgrade effects. Local symbols include document, browser, database, server, cloud, person, chip and coin. Planning/motion share renderers; fonts, assets and lockfile participate in production bindings.

### Diagnostic and gate boundary

Motion Quality flags holds over four seconds, three or more passive explanatory shots, repeated presets, missing reading holds, strong camera movement and long text. Apply current [CQ policy](creative-quality.md#rules-and-correction-ownership): distinguish structural blockers from advisory aesthetic findings and explicit human exceptions. Do not treat an old claim that all warnings block Gate 1 as current policy. New checks never rewrite accepted frames/exports; clean diagnostics do not prove quality.

## Narration and production safeguards

Narration follows [quality bar](quality-bar.md#narration-choose-clarity-by-listening), [exact audio record](../../2d-animation/channel/AUDIO_VERSIONS.md) and [CLI generation/import](workflow-efficiency.md#2-audition-once-then-generate-measured-narration): local VoiceStudio with listening-approved voice, no Fish fallback, preserved existing audio and exact rights scope. VoiceStudio uses external-WAV/planning timing import, not `workflow narrate`.

Import complete mono/stereo PCM16 WAV, at most 16 MB, with measured line timing:

```json
[{"number":1,"startFrame":0,"endFrame":110}]
```

Each narration line appears once, ordered and inside its assigned shot; end frames are exclusive. Audio must match accepted motion within one frame at 30fps; accept a timing revision first if needed. The app measures duration/sample rate/channels and derives waveform peaks, not spoken-word alignment. Listen to the complete take and every boundary before import. Main playback uses Remotion audio synchronization; comparisons stay silent. See [alignment/audio](local-alignment-and-audio.md).

Gate 1 records explicit exact-plan/source review. Gate 2 requires Gate 1 plus separate moving/audio review with findings. Bindings include accepted script/storyboard/motion, exact voice/timing, bundled assets, engine source/configuration and lockfile. Changed accepted inputs, narration or engine dependencies stale gates. Models cannot grant them. Rendering additionally requires explicit local authorization; publishing is separate.

Chrome (`V3_CHROME_PATH` if needed), FFmpeg and ffprobe must be installed. Export is limited to 180 seconds and one active job per project. Jobs are request-bound; failure/disconnection preserves diagnostics. Interrupted jobs expire after 30 minutes before explicit retry; no durable background worker or cloud service.

Render full-resolution PNGs once and encode those frames with discovered audio. Verification requires 1080×1920, 30fps, exact duration/frame count, audio, full decode, every encoded frame at SSIM ≥0.98 against sequential PNGs, fresh boundary seeks with exact PNG bytes, audio correlation ≥0.9 and lag within one frame. Normalize time bases and retain the same filter graph across RGB/RGBA PNG changes. Downloads verify export hashes; stale inputs prevent successful completion. These lossy H.264/AAC tolerances establish integrity, not creative acceptance.

## Interpreter 3 choreography and components

New full proposals use versioned beats in interpreter 3; saved interpreters 1/2 retain their path and legacy scoped revisions retain their contract. Optionally import script-bound PCM16 WAV and measured timing before visual planning. Phrase/word spans require manual verification or verified alignment, never constant-speed estimates. Timing corrections are immutable and stale dependent motion; script changes stale timing. Final narration must match planned audio/timing when present.

Six semantic presets: `snap-overshoot@1`, `cascade@1`, `converge-assemble@1`, `punch-zoom@1`, `flow-handoff@1`, `split-disperse@1`. `hold@1` protects reading; `mask-reveal@1` animates bounded masks. Expansion uses the existing frame-driven GSAP timeline: 64 actions per shot, 128 expanded targets per continuity group. Unknown targets/versions, competing property ownership and invalid endpoints fail closed.

| Component | Named parts |
| --- | --- |
| `inbox-panel@1` | message, highlight, extracted, packet |
| `approval-flow@1` | request, approved, handoff |
| `api-flow@1` | request, response, cache |
| `cost-chart@1` | bar-one, bar-two, total |
| `kinetic-phrase@1` | lead, keyword, underline |
| `funnel@1` | inputs, bottleneck, output |

Use `object-id.part-id` targets with bounded canvas-relative offsets, scale, opacity, color and reveal. Static/moving views share SVG and instance-specific clip IDs. Actor dimensions, labels and values stay fixed; change them with replacement actors. Charts need supplied integer units; never invent currency/earnings. Kinetic phrases contain 1–5 words. Root actors support staged geometric handoffs; part-to-part world geometry and velocity-matched `motion-match` remain unsupported.

Inspect Player/timeline/findings. **Review moment and use suggestion** selects, seeks and prefills direction; submission and acceptance stay explicit. `motion-quality@1` reports thresholds, shot/frame evidence and suggestions for stillness excluding intentional holds, repetition, slow entrances, competing effects, camera drift, text size/contrast, clipping/crowding, weak seams and unclear progression. Renderer font-fit formulas are shared; boxes, transparency, complex surfaces and internal clipping need actual frame review. No universal score replaces playback/listening.

Schema 8 adds only `planning_timing`, preserving existing tables and immutable hash-bound JSON/WAVs. SQLite owns indexes; failure cleanup removes only this attempt's files and preserves crash orphans. Pre-upgrade schema-7 backup: `.data/motion-graphics-pre-schema8-1792761425224/studio.sqlite` (integrity passed). Before rollback stop the app, preserve current data and restore matching prior source/database/media to separate paths; old code rejects schema 8. Never mix versions or destructively downgrade.

## Verification

Run `npm run check` and `npm run build`. `node scripts/verify-production.mjs` exercises the guarded renderer with a fresh isolated synthetic project covering transitions, typography, symbols and test-tone audio. Preserve every `.data/production-proof-*` round; fixture gates are not human approvals. Keep benchmark/v1/v2 data separate. Browser checks use an isolated fixture or explicitly authorized live gateway. Dated receipts and screenshots remain in [recorded verification](reference-verification.md#verification); they do not establish this checkout's status.

## Authoring reference

Load only the section required by selected artwork/actions; these files preserve detailed contracts, examples and limitations.

## Visual planning

See [contract and examples](graphics-reference.md#visual-planning).

## Graphic assets, diagrams and review

See [contract and examples](graphics-reference.md#graphic-assets-diagrams-and-review).

## Editorial visual language

See [contract and examples](graphics-reference.md#editorial-visual-language).

## Layered workflow example

See [contract and examples](graphics-reference.md#layered-workflow-example).

## Text treatments and authored timing

See [contract and examples](text-motion-reference.md#text-treatments-and-authored-timing).

## Kinetic capability contracts

See [contract and examples](text-motion-reference.md#kinetic-capability-contracts).

## Connected process contract

See [contract and examples](component-reference.md#connected-process-contract).

## Advanced motion contracts

See [contract and examples](component-reference.md#advanced-motion-contracts).
