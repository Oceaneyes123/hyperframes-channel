# Text and kinetic authoring reference

Load only the selected contract. Follow [quality bar](quality-bar.md) and [stage workflow](animation-workflow.md). Use approved IDs/hashes/endpoints, not generated code, SVG, selectors, paths or URLs. Changes require ordinary artifact acceptance and exact production revalidation; historical artifacts retain their rendering path.

## Text treatments and authored timing

Ten treatments implemented October 25, 2026. Open **Text motion library** from Projects or `http://127.0.0.1:3003/text-motion` after `npm run dev`. Gallery shares production `VisualText`, starts paused, and supports editing, play and scrub.

### Research and selection

[GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) informed word/character/line splitting, masks/staggers and an unsplit accessible label around decorative segments. [Adobe text animators](https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html) describe range selection, position, opacity, spacing and scale. [Remotion](https://www.remotion.dev/docs/flickering) requires frame-dependent/render-order-independent visuals.

Technique selection, timing and curves below are authored choices, not measured engagement gains or copied templates/code. No new package, downloaded font, paid template or plugin.

### The ten treatments

Suggested ranges assume 30fps. Declared `startFrame`/`endFrame` includes the entire stagger; later letters never exceed the end.

| Preset ID | Visible behavior | Use it for | Suggested duration | Avoid |
|---|---|---|---|---|
| `mask-rise@1` | Phrase rises through a fixed baseline mask and settles | Opening titles, new concepts | 18–30 frames | Multiple simultaneous headings |
| `word-stagger@1` | Words rise and fade in reading order, preserving spaces | Short explanations, ordered phrases | 24–42 frames | Paragraphs or claimed word-level audio sync |
| `character-rise@1` | Graphemes rise with a bounded stagger | Names, acronyms, short labels | 24–36 frames | Long text or connected scripts |
| `typewriter@1` | Successive complete graphemes appear; layout stays fixed | Commands, prompts, input | 24–60 frames | Revealing a number digit by digit as if it were a live measurement |
| `wipe-reveal@1` | A left-to-right mask uncovers stationary text | Discovery, disclosure, a revealed answer | 18–30 frames | Right-to-left reading or long copy |
| `tracking-settle@1` | Tight spacing opens to normal while opacity resolves | A short editorial heading | 18–30 frames | Connected scripts; wide outward expansion |
| `blur-resolve@1` | Brief soft blur resolves to crisp, stationary text | Uncertainty becoming clarity | 18–30 frames | Small captions, repeated focus effects |
| `pop-settle@1` | Scale rises from 0.82 to 1.04, then settles at 1 | One important keyword or reveal | 12–24 frames | Every word, body copy, large camera movement |
| `highlight-sweep@1` | Translucent highlight grows behind readable text | A phrase already on screen | 18–30 frames | Long decorative sweeps or low contrast |
| `underline-draw@1` | A single underline extends beneath stationary text | A takeaway, rule or key term | 15–24 frames | Every caption or implied hyperlink |

One focal treatment per beat: introduce/disclose/emphasize, then let viewers read. Keep supporting labels still where appropriate. Never add copy for effects; stable text can accompany motion elsewhere.

### Apply to upcoming videos

`server/motion.ts` supplies the library to full/scoped proposals. Each complete shot may include:

```json
{
  "textMotions": [{
    "targetId": "object-1",
    "presetId": "word-stagger@1",
    "startFrame": 6,
    "endFrame": 36
  }]
}
```

This is a shot field, not a standalone plan. Target an approved nonempty root text, centered-text, heading, caption or code actor; never rewrite storyboard copy. Scoped omission preserves treatments; `[]` removes them. Example: “Use a masked rise for the heading, underline the takeaway, and keep supporting labels still.” Proposals need acceptance.

Intervals are shot-local 30fps frames; frame-only timing is estimated. For precision use measured `narrationAnchor` below and moving/audio review. Complete hidden root entrances first. Reject unknown presets/extra fields, missing/nontext/duplicate targets, intervals under six frames, competing root motion, reading-hold overlaps and continuous-anchor restarts. Finish at least 12 frames before last visibility; use explicit reading holds of at least 15 frames where appropriate.

Continuous actors retain their first treatment/settled appearance across seams, without replay. Historical plans lacking `textMotions` retain rendering; engine fingerprints include both new modules, requiring normal binding revalidation without project migration.

### Runtime and limits

`workflow/text-motion.ts` owns versioned strict JSON/registry; `engine/text-motion.tsx` implements SVG. Remotion owns frame time, official GSAP owns outer actor/camera; inner text uses pure frame calculations, no timers/random/DOM splitting/stateful tweens, preserving fresh/backward seeks.

Legacy unmeasured shapes retain short-label font heuristics; measured typography/variable expression use their contracts, never paragraph reflow. Centered text stays centered. Graphemes preserve emoji/combining marks but may alter kerning/connected scripts; prefer whole-label effects there. Review tracking/left-to-right wipes manually. Highlights/underlines span authored boxes. Reserve margins for masks, blur and 4% overshoot. Inspect actual fonts/contrast/readability at phone size. Gallery never autoplays; fixed exported motion does not respond to OS reduced-motion settings.

## Kinetic capability contracts

Open `/motion-library` from Projects: paused synthetic demonstrations with keyboard-accessible frame sliders. They neither edit projects nor grant gates.

### 2. Reliable typography and timed emphasis

Text/heading/caption/centered-text may set `typography:"inter-heading@1"`: one or two authored nonempty lines, same profile at both endpoints, no automatic reflow. Legacy shapes keep their renderer.

Inter variable font is pinned to upstream commit `353b61b9f4430d5f420d56605a6e7993e0941470`, OFL-1.1. `workflow/typography.ts` records source, attribution, SHA-256/profile; bytes/full licence live in `public/fonts/inter-heading/`. Native FontFace verifies bytes; missing/corrupt/substituted fonts fail. Wait for loading and Canvas glyph measurement before rendering, never export fallback. Fit lines to boxes; measured widths drive masks/highlights/underlines. Font/licence/profile/renderer enter production fingerprint; bundles explicitly include public directory.

Optional `textMotions.narrationAnchor` uses beat line/phrase/word schema. Resolver uses supplied measured anchors, retains explicit measured-line fallback warnings, then validates boundaries/conflicts/holds. Frame-only effects remain valid. Require phone-size review; legacy character counts do not measure glyph layout.

### 3. Kinetic layout and information handoff

Reuse fixed-label word actors, inbox parts, `snap-overshoot@1`, approved endpoints and compound IDs. Words move into authored slots; the same packet travels message-to-review. Remove placeholder marks before labels arrive to avoid intersection. Finish inner text entrances before root movement. Labels/types stay fixed per actor; replace explicitly to change them. Review-slot delivery never implies human approval. No new identity system/live DOM Flip capture is needed.

### 4. Source-bound data comparison

`data-comparison@1` uses `comparison:{sourceId,contentHash,recordIds:[id,id]}`, never inline values/model-created axes. Resolve values/labels/units/common scale from exact supplied `workflow/comparison-sources.json` records. Reject duplicate/missing records, wrong hashes/scales and extra value fields.

Money: bounded integer minor units, USD/PHP/EUR/GBP, two decimals. Counts: integers/explicit unit labels. Signed/zero formatting is defined; negative bars extend left of zero. Labels stay static while bar masks reveal; fixed common-scale geometry prevents bar movement/scale exaggeration. Existing `cost-chart@1` behavior stays unchanged.

```powershell
node scripts/import-comparison-source.mjs path/to/supplied-source.json
```

Input follows registry `source`: versioned `id`, `provenance`, `note`, `unit`, `minimum`, `maximum`, records with `id`/`label`/`value`. Import validates/hashes, writes via temporary file and refuses version overwrite. Run imports serially; this authoring tool is not multi-user storage. Independently review supplied provenance/source and accept storyboard normally.

Bundled costs are hypothetical, never quotes, actual savings, revenue or earnings. No fabricated intermediate measurements. [Numeric display/odometer](component-reference.md#m1-source-bound-numeric-display) is a separate contract.

### 5. Reviewed scene depth and assembly

| Preset | Contract |
| --- | --- |
| `layer-depth@1 {offsetX,offsetY}` | One depth-approved `graphic-asset@2` root; ±2 canvas-point offsets, fixed background/subject/detail/packet role weights; at least three visible/unmasked roles and 12 frames; restore exact authored positions. Small existing punch zoom may accompany it. |
| `explode-assemble@1 {offsets:{layerId:{x,y}}}` | At least two known visible layers, authored ±3-point offsets; restore original assembly. Reject competing ownership/reading-hold overlaps. |

Only exact hash-bound `service-handover-desk@1` is approved in `depthSceneRegistry`. A connecting-mark candidate was rejected visually. Static asset approval does not qualify independent layer motion. Exclude semantic diagrams/arbitrary wired UI. This is bounded 2D depth, not perspective 3D.

### 6. Curated morph pair

`morph-shape@1` binds `morph:{pairId,contentHash}`; original `message-record@1` supplies original CC0 message/document silhouettes with authored vertex correspondence. No model paths/glyphs/selectors/URLs/alternate geometry.

Start outline `morphProgress:0`, end 1. `morph-shape@1 {}` targets visible/unmasked `object-id.outline` for at least 12 frames, using installed MorphSVG via official frame-driven GSAP. Forward only; compose by transforming the root, never outline geometry.

Set exact initial path at time zero and target at completion to preserve mounted backward seeks (fresh still tests alone missed that failure). Unknown/changed pairs or unsupported endpoints fail instead of fading. Broader glyph morphing remains unsupported.
