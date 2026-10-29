# Kinetic capabilities: increments 2–6

Open `/motion-library` from Projects. Each example starts paused and offers a
keyboard-accessible frame slider. These are synthetic capability demonstrations;
they do not edit saved projects or grant production approval.

## 2. Reliable typography and timed emphasis

Text, heading, caption and centered-text shapes may opt into
`typography:"inter-heading@1"`. Author one or two nonempty lines; no paragraph
reflow is inferred. Both corresponding drawings must retain the same profile.
Old shapes without the field retain their original renderer.

The local Inter variable font comes from pinned upstream commit
`353b61b9f4430d5f420d56605a6e7993e0941470`, under OFL-1.1. Its source, attribution,
SHA-256 and profile ID live in `workflow/typography.ts`; the font and full license
are in `public/fonts/inter-heading/`. Native FontFace loading verifies the actual
bytes before rendering. Missing, corrupt or substituted bytes fail clearly.

After readiness, Canvas glyph measurements fit the authored lines to their box.
Each line's measured width controls masks, underlines and highlights. Rendering
waits for measurement instead of exporting a fallback face. Font bytes, license,
profile code and renderer participate in the production fingerprint. Production
bundles explicitly include the public directory.

`textMotions` can optionally specify `narrationAnchor` with the same line/phrase/word
schema as beats. The timing resolver uses supplied measured anchors, preserves the
existing explicit measured-line fallback warning, and then the usual motion
validator checks boundaries, root-motion conflicts and reading holds. Frame-only
effects remain valid. The quality report requires phone-size review instead of
claiming that legacy character-count estimates measured the new glyph layout.

## 3. Kinetic layout and information handoff

The handoff example uses existing fixed-label word actors and inbox parts. Words
move into authored field slots; the same packet moves from the message to the
review area. Placeholder marks disappear before the new labels arrive so they do
not intersect the text. No new identity system or live DOM Flip capture was needed.

Reuse `snap-overshoot@1`, approved start/end drawings and compound part IDs. Finish
an inner text entrance before moving its root. Keep labels fixed on corresponding
actors; use explicit replacement actors for a changed label/type. A transfer into
a review slot does not imply that a person approved the result.

## 4. Source-bound data comparison

`data-comparison@1` uses `comparison:{sourceId,contentHash,recordIds:[id,id]}`.
It never accepts inline values or a model-created axis. Values, labels, units and
one common scale are resolved from the exact supplied source record in
`workflow/comparison-sources.json`. Duplicate record IDs, missing records, wrong
hashes, invalid scales and extra value fields fail validation.

Money uses bounded integer minor units with explicit USD, PHP, EUR or GBP and
two decimal places. Counts use integers with an explicit unit label. Signed and
zero values have defined formatting; negative bars extend left of zero. Labels
remain static while bar masks reveal. Part geometry is fixed to the common scale;
moving/scaling individual bars cannot exaggerate the values. `cost-chart@1` keeps
its old meaning and behavior.

Import an actual supplied source with:

```powershell
node scripts/import-comparison-source.mjs path/to/supplied-source.json
```

The input shape is illustrated by the `source` object in the existing registry:
versioned `id`, `provenance`, `note`, `unit`, `minimum`, `maximum`, and records with
`id`, `label`, `value`. The importer validates and hashes the source, writes through
a temporary file, and refuses to overwrite an existing version. Run local imports
serially; this is a source-file authoring tool, not a multi-user data service.
Supplied provenance is not independent factual verification. Review the original
source and accept the storyboard through the normal workflow.

The bundled cost source is explicitly hypothetical, not a quote, actual saving,
revenue or earnings result. No odometer/count-up or fabricated intermediate
financial measurement is implemented.

## 5. Reviewed scene depth and assembly

`layer-depth@1 {offsetX,offsetY}` targets one depth-approved `graphic-asset@2`
root. Offsets are bounded to ±2 canvas percentage points and use fixed role weights
for background, subject, detail and packet layers. At least three visible,
unmasked depth roles and twelve frames are required. Layers return to their exact
authored positions. A small existing punch zoom can accompany the scene.

`explode-assemble@1 {offsets:{layerId:{x,y}}}` uses authored ±3-point offsets for at
least two known visible layers, then restores the original assembly. Concurrent
ownership of the same part properties and reading-hold overlaps are rejected.

Only the hash-bound `service-handover-desk@1` scene is currently approved for these
effects in `depthSceneRegistry`. A first candidate with connecting marks was
rejected during visual inspection. Static asset approval alone does not qualify
new artwork for independent layer motion. Semantic diagrams and arbitrary wired UI
assets are excluded. This is bounded 2D layer depth, not perspective 3D.

## 6. Curated morph pair

`morph-shape@1` shapes require `morph:{pairId,contentHash}`. The sole initial pair is
`message-record@1`, containing original CC0 message/document silhouettes with
authored vertex correspondence. Models cannot provide paths, glyphs, selectors,
URLs or alternate target geometry.

The outline part has explicit `morphProgress:0` in the start drawing and `1` in
the end drawing. A `morph-shape@1 {}` beat targets `object-id.outline`, requires a
visible unmasked outline and twelve frames, and uses the installed MorphSVG
plugin inside the official frame-driven GSAP adapter. Only the forward transition
is supported. Transform the root instead of altering outline geometry.

The interpreter sets the exact initial path at time zero and exact target at
completion. This fixes a mounted backward-seek issue that fresh still comparisons
alone did not expose. Unknown/changed pairs and unsupported endpoints fail instead
of silently fading. Broader glyph morphing remains outside this implementation.

## Integration and verification

The visual/motion planners receive the allowed profiles, source references,
reviewed scene restrictions and curated pair IDs. Full and scoped proposal schemas
use the same strict contracts. All new runtime inputs and renderer dependencies
participate in production engine hashing. No database migration, package dependency
or production project rewrite is required. Existing bindings become stale and
need normal revalidation; prior approval is never copied.

```powershell
npm run check
npm run build
node scripts/verify-kinetic-increments.mjs
```

The proof script binds synthetic source hashes, renders all five examples at
1080×1920/30fps, and compares sequential frames with fresh seeks. Verification
records, mounted-browser checks, screenshots, legacy frame comparisons and export
evidence are recorded under `.planning/2026-10-25-kinetic-remaining-increments/`.

Final verification passed 119 tests, typecheck and production build; the build
retains nine filesystem tracing warnings. The five examples passed 600 full-size
frames, 40 exact fresh seeks and five exact mounted backward SVG/PNG returns.
Twenty sampled frames across all ten older text presets matched prior output.
A synthetic silent 20-second H.264 export decoded fully and matched all 600
preview frames with minimum SSIM 0.997212 (required 0.98). This proves technical
playback/export consistency, not a human assessment of video quality.

Independent human moving/audio review and a separately authorized real-video
comparison remain pending. No real narration, publishing, production approval,
commit or push was performed for these increments.
