# Kinetic improvements: evidence and implementation plan

Status: increments implemented with synthetic technical verification; real-video
evaluation and human approval remain pending. Original analysis October 25, 2026 against local HEAD
`fd38914`. Input: [KINETIC-IDEA.md](KINETIC-IDEA.md), preserved unchanged.
This document supplements the existing roadmap; it does not replace PLAN.md,
PLAN2.md or the production approval workflow.

Implementation update: [increment 1](connected-process.md) and
[increments 2–6](kinetic-capabilities.md) have synthetic portrait examples and
technical verification. The ordered increments below preserve the original scope
and acceptance criteria. No production approval is implied.

## Original recommendation

Start with **one connected process scene: draw a route, trace information along
it, react at the destination, then hold**. This adds a missing explanatory ability.
It can reuse semantic diagrams, approved assets and the current motion engine.

Next, improve reliable typography and information-preserving layout changes.
Expand financial animation, layered depth and curated morphs only after those
slices pass technical and human review. Adding another set of entrances first
would overlap the ten presets already implemented.

The intended improvement is clearer visible causality. Better aesthetics,
comprehension or retention remain hypotheses until a controlled moving comparison.
No engagement, cost or revenue improvement is claimed by this plan.

## What the idea document gets right, and what needs correction

- Its remote audit predates this checkout. The text library and preview gallery
  exist locally; pushing a commit is unnecessary to inspect or plan around them.
- Its distinction between visual style, motion technique and transition technique
  is useful. V3 already has composition families; extend that vocabulary rather
  than introduce a competing taxonomy or preset database.
- More object relationships and continuous information transfer would expand the
  system. Masked entrances, staggered characters and a keyword pop are already
  covered and should not be rebuilt under different names.
- A rectangular mask is not a stroke following a routed connector. Moving an
  actor directly to another actor is not travel along a diagram edge.
- Separate fixed-text actors can already reposition and scale into a new layout.
  Automatic paragraph reflow, mutable labels, semantic UI state changes and glyph
  morphs require additional contracts; a new contract is not needed for every
  basic word movement.
- Installing a plugin does not establish export compatibility. DrawSVG,
  MotionPath, MorphSVG, Flip, SplitText and ScrambleText files are present in the
  installed GSAP package, but the corresponding techniques are not all exposed
  through V3's validated motion contract.
- The proposed seven-second example is an untested sketch. Keep it as a story
  reference, not a timing requirement. Let the actual narration and reading time
  determine duration, and remove the morph if it obscures information identity.

## Current capability and gap inventory

| Idea | Current evidence | Decision |
|---|---|---|
| Masked line reveal | `mask-rise@1` and `wipe-reveal@1` exist for single-line labels | Reuse; multiline composition remains a separate gap |
| Word slam | `pop-settle@1` and root snap/overshoot already cover short emphasis | Tune timing in a real composition before creating another preset |
| Split characters/words | `character-rise@1`, `word-stagger@1`, `typewriter@1` | Reuse; independently art-directed letter rotation/position is not implemented |
| Kinetic layout | Existing root text actors support position/scale; matched labels stay fixed | Prototype 2–3 word actors first; defer paragraph reflow |
| Fonts/variable type | Arial/monospace and character-count size heuristics | Add reliable opt-in font loading/measurement before variable axes |
| Rolling numbers/data | `cost-chart@1`: two fixed nonnegative integer values and supplied labels | Add a source-bound comparison first; defer decorative odometers |
| Scramble/decode | No exposed preset | Defer; limited teaching value and temporarily unreadable text |
| Text-as-mask/path text/glyph morph | No corresponding validated contract | Defer until a specific scene requires it |
| Progressive lines/flow tracing | Stable edge paths, part masks and direct `flow-handoff@1`; no edge-distance draw/trace | Highest-value new slice |
| Cinematic UI transformations | Inbox/API/approval/complaint components and fixed actor correspondence | Reuse components; prototype an explicit information handoff |
| 2.5D/parallax/exploded assembly | Layered vectors and moving decorative background; no depth-aware scene contract | Later opt-in layered scene; preserve diagram geometry |
| Shape morphs/shape-to-scene | No morph-pair contract | Later curated pairs, not arbitrary model SVG |
| Cutout characters/collage/impact accents | Vector layers exist; photographic/cutout media and rigs are not exposed | Defer the asset/media expansion; small vector accents only when justified |
| Library browsing | `/text-motion` already previews all ten text treatments | Extend existing browsing with examples; search is unnecessary at this size |

### Source anchors

- [Text registry](../workflow/text-motion.ts), [text renderer](../engine/text-motion.tsx),
  [gallery](../app/text-motion/text-motion-gallery.tsx), [usage guide](text-motion-library.md).
- [Diagram graph and layout](../workflow/diagram.ts),
  [SVG diagram/layer rendering](../engine/graphics/layered-graphic.tsx).
- [Components and part states](../workflow/components.ts),
  [component renderer](../engine/components/visual-component.tsx),
  [complaint artwork](../engine/graphics/complaint-workflow.tsx).
- [Strict motion contracts](../workflow/motion.ts),
  [preset expansion](../engine/motion-presets/index.ts),
  [compiler](../engine/compile-motion.ts), [frame interpreter](../engine/motion-composition.tsx).
- [Timing resolver](../workflow/timing.ts): measured anchors currently resolve
  beats; `textMotions` contains only shot-local frames.
- [Art direction](../workflow/art-direction.ts),
  [background renderer](../engine/graphics/background.tsx),
  [visual guidance](../server/visual-guidance.ts), [font sizing](../engine/text-metrics.ts).
- [Production binding and engine fingerprint](../server/production-store.ts).

## Ordered implementation increments

Each increment is independently reviewable. Deliver the first complete slice and
evaluate it before authorizing expansion. Effort below is relative integration
complexity, not a delivery-time estimate.

### 1. Connected SVG process: highest priority, medium integration

**Deliverable:** one synthetic message → processor → review diagram, with edge
drawing, a traveling signal and a brief destination emphasis. Preserve the same
information token; do not imply an external system was actually called.

**Reuse:** `semantic-diagram@1`, `layoutDiagram`, registered part IDs, beat timing,
existing palettes and reading holds. Keep nodes and edges fixed; root transforms
move the entire diagram together.

**Contract:** add versioned edge-draw and edge-trace presets referencing known
diagram edge IDs, with bounded normalized progress and frame intervals. Derive
endpoints and destination from the approved graph. Do not accept arbitrary path
strings, selectors, DOM references or executable model code. Draw only the edge
stroke, leaving its label and node visibility independently readable.

**Implementation direction:** use native SVG `pathLength`/stroke dash properties
for drawing. Prove the installed GSAP MotionPath plugin in the existing adapter
for trace travel on the renderer-owned path. Register it once; do not add a second
runtime. A small isolated seek test is the decision gate before full integration.
Do not depend on prior playback, wall-clock time or side-effect callbacks for the
signal position. If the adapter cannot satisfy the seek contract, stop this slice
at the spike result and revise its design before broad implementation.

Destination emphasis must use a bounded appearance change on a fixed node or a
dedicated overlay, restore the approved final state, and respect property ownership.
Do not scale or move diagram parts independently and detach their connectors.

**Reach:** diagram/part schemas, motion schemas, preset expansion, layered renderer,
GSAP interpreter, motion planner guidance, quality checks, engine fingerprint,
full/scoped proposal validation and a portrait gallery fixture.

**Acceptance:** forward, branching and back-edge routes; unknown/wrong-type edge
rejection; trace stays on the routed stroke under root translation/scale; readable
labels throughout; no signal before its start or after completion; arrival reaction
follows arrival; no overlap with a reading hold. Sequential, fresh and mounted
backward seeks agree at entry, corners, arrival and hold. Old masks render unchanged.

**Stop condition:** one complete connected scene and its proof, not a generic
path editor, arbitrary Bézier authoring language or graph-layout rewrite.

### 2. Reliable type and timed emphasis: high priority, medium integration

**Deliverable:** one opt-in heading profile using a local licensed font, measured
layout and optional measured narration anchoring for text treatments.

Use a single shared font loader and wait for the approved font before measuring
or rendering. Native FontFace and installed Remotion render-blocking APIs are the
first option; a new font package is not required merely to load one local font.
Record font source, license, attribution and content hash. Add font bytes/manifest
to production binding coverage. Missing or mismatched approved fonts must fail
clearly instead of silently exporting a fallback face.

Keep the legacy font path for old artifacts. New font choice and layout belong to
an explicit opt-in approved visual artifact, not a global CSS replacement.
Use measured width for mask bounds, underline/highlight length and safe margins.
Add at most two authored lines initially; do not build automatic paragraph layout.

Reuse the existing narration-anchor shape and fallback warnings in the timing
resolver for optional text timing. Resolve anchors before validating root-motion
conflicts and reading holds. Keep existing frame-only treatments valid.

**Reach:** visual/art-direction schema, planning frame renderer, shared font/metric
module, VisualText, text treatment schema, timing resolver, planner guidance,
quality checks, preview/export loading and engine hashing.

**Acceptance:** font load failure, hash mismatch, punctuation, combining characters,
long labels, alignment and two-line baselines; measured masks fit actual glyphs;
known word anchors align with the supplied timing; missing precise spans give the
same explicit line fallback as beats; resolved intervals outside a shot fail.
Re-render legacy fixtures without the opt-in profile and compare them unchanged.

### 3. Kinetic layout and UI information handoff: high priority, medium integration

**Deliverable:** a short phrase rearranges into an explanation, then the same
information token moves from a message into a structured review card.

Start with 2–3 individually approved word actors and the existing position/scale
actions. Reuse inbox, approval and complaint component parts. Use known source and
destination slots inside fixed approved layouts. An explicit replacement actor may
represent a changed label or object type; do not mutate a matched actor's identity.
Do not claim a crossfade is a geometric morph.

Avoid DOM-captured Flip state in production as the first implementation. Approved
start/end geometry already exists and is independent of whichever frame mounted
first. Introduce a small versioned component/slot contract only if the prototype
shows that existing actors cannot preserve readable content and identity.

Do not overlap the current inner entrance treatment with root motion: finish it
first, then reposition the words. For future simultaneous type/layout motion,
design a new versioned ownership rule rather than weakening the existing guard.

**Reach:** authored visual fixture, planner composition guidance and existing
presets first; schemas, component registry/rendering and compiler only if the
prototype demonstrates a concrete missing slot capability.

**Acceptance:** information remains identifiable through message → fields → review;
no new claims or rewritten narration; no extra approval implied; labels keep their
reading order and do not overlap; final geometry matches approved drawings; actor
budgets and continuous handoff checks still pass. Human review can identify what
moved and why without reading a transcript on screen.

### 4. Source-bound data comparison: conditional priority, medium integration

**Deliverable:** one comparison built from explicitly supplied values, with bars
revealing on a fixed common scale and static authoritative value labels.

Retain `cost-chart@1`. Add a separate version only when units, source identity,
rounding, common-axis scale or richer categories require it. Validate values
against supplied approved inputs; a model-generated number is not provenance.
Keep money in integer minor units with explicit currency and display precision.
Do not silently reinterpret the existing two-integer tuple as currency.

For income examples, distinguish gross revenue, fees, costs and profit in the
approved content. Negative results, zero, unequal digit widths, separators and
currency formatting must have defined behavior before adding a financial counter.
Do not animate an axis in a way that reverses the visual comparison.

**Defer:** odometers and count-ups. Rolling transitional digits can appear to be
new measurements. If later needed, define an explicit transitional display and
authoritative endpoints, with no fabricated transactions or intermediate claims.

**Reach:** source-bound visual data schema, dedicated chart renderer if necessary,
motion effects, formatting/validation, planner guidance and financial fixtures.

**Acceptance:** unsupplied values rejected; common scale preserved; exact final
labels and supplied arithmetic retained; no misleading intermediate value labels.

### 5. Layered scene depth: later, medium integration

**Deliverable:** one approved vector illustration with foreground, subject and
background moving at bounded relative speeds during a small camera move.

Existing background.depth is decorative movement, not this feature. Reuse asset
layers and root camera motion; add a versioned depth-aware scene contract only
after a static layout proves the illustration benefits. Keep text legible and
connectors attached. Exploded assembly applies to illustration parts with authored
endpoints, not semantic-diagram nodes whose geometry is fixed.

**Acceptance:** safe frame margins, no hidden label occlusion, exact final assembly,
no conflicting root/part ownership and deterministic reverse seeking. Defer
perspective cameras, 3D rigs, photographic cutouts and general collage import.

### 6. Curated morph pairs: experimental, high integration

**Deliverable:** one meaningful icon-to-icon transition using a reviewed, versioned
source/target path pair. A named pair ID references local, hashed geometry; model
output cannot supply new SVG, a glyph outline or arbitrary target path.

Prove installed MorphSVG against fresh and backward seeks in the existing adapter.
Review semantic meaning, topology, silhouette and intermediate frames before
adoption. Keep label changes as explicit replacement actors. Do not alter existing
vector assets or `@1` semantics in place. Defer arbitrary glyph morphing and
shape-to-scene automation until a curated pair demonstrates value.

**Acceptance:** exact endpoints, bounded geometry, no tearing or disappearing paths,
known pair/asset integrity and sequential-versus-seek equivalence. Reject unsupported
pairs rather than falling back silently to a fade.

## Library and workflow integration

Keep one runtime registry per capability. Static metadata can describe purpose,
compatible targets, constraints, duration guidance and a preview fixture. Derive
gallery cards and planner descriptions from that registry where practical; avoid
separately editable Markdown/JSON/SQLite catalogs of the same presets.

Retain the three distinct concepts:

| Concern | Existing owner | Planned extension |
|---|---|---|
| Visual appearance | Art Director/composition families | Font profile and later layered scene styling |
| Within-scene action | Motion Director/strict beats and text effects | Edge draw/trace and explicit information handoffs |
| Between-scene continuity | Incoming transition and actor anchors | Existing cuts/shared actors first; new transitions only with proof |

Extend the current gallery with a portrait 1080×1920 example for each newly added
capability, a static poster, allowed inputs and suitability notes. Preserve paused
preview, keyboard controls and accessible full text. Add search only if browsing
the actual number of items becomes difficult. Do not build a separate asset manager.

The visual planner currently defaults to no on-canvas text and permits essential
short labels. Kinetic type must not turn explanatory videos into animated scripts,
paragraph cards or gratuitous headings. Effects are selected by narrative purpose;
variety alone is not an acceptance condition.

## Verification and rollout

1. Author isolated synthetic start/end drawings and motion fixtures before adding
   new model output. Keep the accepted production projects untouched.
2. Add focused tests following [text motion](../tests/text-motion.test.ts),
   [components](../tests/components.test.ts), [timing](../tests/timing.test.ts) and
   [motion quality](../tests/motion-quality.test.ts) conventions. Cover both full
   and scoped proposals, source correspondence and rejection paths.
3. Extend existing frame-proof tooling rather than create another render system.
   Check sequential frames against fresh seeks, and seek backward in one mounted
   Player. Include full-resolution 1080×1920/30fps frames for readability, not only
   half-resolution proofs. Revalidate quality and production fingerprints.
4. Run `npm run check`, then `npm run build` sequentially. Keep old plans readable;
   new semantics get versioned IDs and explicit opt-in fields. Existing bindings
   become stale when relevant engine/assets/fonts change; never copy approval.
5. After separate production authorization, compare one current DeepSeek sequence
   against one candidate with identical narration bytes, framing and intended
   meaning. Do not regenerate voice to make the candidate seem better. Use the
   existing approved duration or obtain approval for a timing revision.
6. Human moving/audio review checks causality, readability, hierarchy, information
   identity and purposeful motion. Technical success does not replace either
   production gate. Keep the original artifact and allow rejection of the candidate.

For future code rollback, revert the new code/registry/asset additions together
without rewriting saved artifacts. Use the matching engine version to render
artifacts that require a new feature; older engines must reject unsupported
contracts. Revalidate bindings for whichever engine is selected. No database
migration is planned for the first slice; prove a storage need before adding one.

## Research references and confidence

Verified against current official documentation during this analysis:

- [GSAP DrawSVG](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/): stroke drawing.
- [SVG pathLength](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pathLength):
  native path-length calibration for stroke progress.
- [GSAP MotionPath](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/): path-based
  travel and alignment. The strict edge-ID wrapper is this plan's proposal.
- [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/): live-state capture and layout
  transitions; not evidence of automatic deterministic export in V3.
- [GSAP MorphSVG](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/): path morphing;
  curated-pair restrictions are this plan's design decision.
- [Remotion fonts](https://www.remotion.dev/docs/fonts): shared loading and font
  readiness before rendering/measurement.

The input's Behance/Dribbble image proxies, trend claims and showcase videos were
not independently motion-audited here. They are inspiration, not technical or
performance evidence. Plugin files were checked locally; no licensing conclusion,
installation, new rendering proof or model request was performed in this planning
task. Earlier text-library verification is historical evidence for its recorded
engine, not a fresh pass for this roadmap.

## Original first implementation request (completed)

Authorize increment 1 only: one registered diagram with progressive edges,
edge-bound signal travel, destination emphasis, a reading hold and deterministic
synthetic proof. Reuse current artwork and timing. Review that complete result
before adding fonts, more typography presets, counters, parallax or morphs.
