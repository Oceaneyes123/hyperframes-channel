# Advanced motion graphics: sequential implementation plan

Status: M0–M8 implemented; M9 offline technical gates pass but live audit remains pending.
M10 comparison preparation is recorded; strict revalidation and human/production gates remain pending.
Original plan inspected against HEAD
`c98ce8f` on 2026-10-25. Input: user-supplied **HyperFrames v3 — Advanced Motion
Graphics Implementation Plan**, retained in the task's planning directory.

This is an expansion of the completed kinetic roadmap, not unfinished work from
that roadmap. All eight requested categories remain in scope. Each milestone
ships through the existing schema, renderer, planner, Studio and proof paths.

## Corrections and reuse

| Requested category | Current foundation | Work still needed |
| --- | --- | --- |
| Rolling numbers | Hash-bound comparison records, integer currency units, exact static labels | Numeric actor, formatting contract, deterministic digit tracks, related endpoint validation |
| Kinetic layout | Ten text effects, measured two-line Inter, fixed word actors, word-to-inbox example | Coordinated authored layouts, selection rules, cross-shot shared-word validation |
| Cinematic UI | Inbox/approval/API components, parts, masks and packet handoff | Semantic state/data identities, trigger contracts and reusable interface sequence |
| Character rig | Layered original artwork and bounded actor motion | Joint hierarchy, pivots, approved poses, prop attachment and five meaningful actions |
| Morph expansion | One hash-bound message-record pair, MorphSVG, exact endpoint/reset behavior | Six additional reviewed pairs and deterministic chained transitions |
| Mixed-media collage | Curated local vectors, provenance and engine hashing | Local raster contract, import validation, masks/crops, raster readiness and composition |
| Perspective camera | Root 2D camera, punch zoom and one approved layer-offset scene | Explicit depth/projection, bounded camera controls, occlusion and projected bounds |
| Variable typography | Pinned Inter file and font readiness/measurement | Axis metadata, frame-specific measurement, axis ownership and bounds validation |

The actual bundled font's `fvar` table reports `wght` 100–900 and `opsz` 14–32.
It has no `wdth`. Weight and optical-size animation can use this font. A genuine
width-axis feature needs a separately reviewed licensed font with that axis;
horizontal scaling must not be presented as font-width animation.

Keep the existing `data-comparison@1` static authoritative labels and
`morph-shape@1` single-forward-pair semantics intact. New numeric actors and chained
morph semantics need separate additive contracts. Do not register five aliases
when existing movement, masks or emphasis already provide the same behavior.
Gallery names may describe recipes using those primitives.

## Shared implementation surface

Every slice must reach its actual callers before it is complete:

| Responsibility | Existing location to extend |
| --- | --- |
| Shape identity, initial/final drawing, references | `workflow/visuals.ts`, `workflow/components.ts` |
| Beat validation, generated/scoped schemas, ownership, hydration/correspondence | `workflow/motion.ts`, `engine/motion-presets/index.ts` |
| Text/data/asset-specific rules | `workflow/text-motion.ts`, `workflow/typography.ts`, `workflow/comparison.ts`, `workflow/morphs.ts`, `workflow/graphic-assets.ts` |
| Planned and moving rendering | `app/projects/[id]/visuals/frame.tsx`, `engine/components/visual-component.tsx`, `engine/motion-composition.tsx`, relevant graphics/text renderers |
| Teaching purpose and valid generated output | `server/visual-guidance.ts`, `server/visuals.ts`, `server/motion.ts` |
| Measured narration and reading holds | `workflow/timing.ts`, existing narration-anchor contract |
| Proposal creation, selected-shot revision, acceptance | Existing `server/motion-store.ts`, visual store and Studio actions/workspaces |
| Technical findings | `engine/quality/inspect-motion.ts` and existing graphic review |
| Fingerprint and export | `server/production-store.ts`, `server/render.ts` |
| Examples and regressions | `workflow/examples/`, `/motion-library`, `/text-motion`, existing tests and proof scripts |

Add files only for concepts that need independent ownership, such as a rig or
numeric renderer. No second animation engine, acceptance workflow, preset database,
generic asset manager or speculative schema rewrite. New contracts must declare
units, range limits, required endpoints, timing bounds, target types and property
ownership; conflicting beats must fail before rendering. Changed semantics require
a new version. Include every new runtime input and local asset in engine hashing.

## M0 — Freeze the comparison and compatibility baseline

Use the latest recorded approved redesign export for project
`eec7f710-650b-43f5-a93d-9757ee3000c2`, job
`32a4ec9c-9d34-4164-b74b-60ae6097e516`. The file exists; its recorded receipt is
`.planning/deepseek-v41-flash-short/redesign-v1/final-export-32a4ec9c-9d34-4164-b74b-60ae6097e516.json`.
The older `96ac9df4` export remains historical comparison material.

1. Read current store dependencies and receipts without accepting anything.
   Pin exact script, storyboard, motion, narration, timing, engine, lockfile and
   export hashes in a read-only baseline manifest. Retain the original bytes.
2. Map the inquiry overload, processing/category and human review sections to
   exact measured frame ranges. Do not guess timestamps from the narrative.
3. Preserve an engine/source/asset snapshot sufficient to reproduce the baseline.
   Saved JSON alone does not reproduce an old renderer. An old receipt is not a
   new render authorization; accepted history stays historical after engine changes.
4. Bind synthetic legacy fixtures to current engine/source hashes and capture
   reference frames, including mounted backward seeks and an export.

Exit: immutable baseline manifest, three exact benchmark ranges, current synthetic
compatibility proof and documented existing warnings. Earlier 119-test and
600-frame results are historical evidence, not a fresh pass for the expanded work.

## M1 — Source-bound rolling values

First slice: one versioned numeric-display component and `odometer-roll@1` using
an existing supplied or explicitly hypothetical count/currency record. Resolve
the source before formatting. Keep separators, signs, currency symbols and decimal
positions stable; roll only digit columns. Final text must equal the shared
formatter exactly, including zero and negative values. Reserve the final width
throughout; provide an accessible authoritative value separate from moving digits.

Expand with `numeric-reveal@1`, verified percentage emphasis, currency recipes
and a value transition after the basic component passes. Percentage representation
must explicitly define units/precision, rather than interpreting a count as a
percentage. A two-value transition needs compatible units and an explicit sourced
relationship/time order; membership in one source file alone is insufficient.
Intermediate roll characters are decoration, not observed measurements.

Proof: zero, negatives, repeated digits, carry/borrow, supported currencies,
large values, invalid source/hash/units, exact endpoints, clipping and backward
seeks. Never invent an API cost or an earnings statistic for the DeepSeek example.

## M2 — Authored typography recomposition

First slice: two stable text actors with immutable content and two measured
portrait layouts. Reuse existing transforms and masks; add a layout contract only
for coordinated endpoint identity/validation. Demonstrate headline-to-inbox labels
without replacing words halfway through. Validate both layout boxes and intermediate
collisions and preserve a reading hold.

Then deliver headline recomposition, keyword-focus and shared-word match-cut
recipes. Cross-shot continuity must validate word identity, font/profile, measured
geometry and camera transform. It must not dissolve unrelated words under a
match-cut name. Existing ten text effects must retain their output when the new
profile is absent.

## M3 — Semantic interface state transitions

First slice: one inquiry with a stable field/value ID, from customer form to
structured row to a review panel. Give each authored UI state named semantic
elements, allowed transitions and an explicit trigger. Display changes must
preserve exact data; a relocated label is not a semantic application state.

Expand the demonstration to form → Sheets record → n8n trigger → DeepSeek draft
→ human review using existing routing/edge travel where applicable. Validate
field references, single ownership or intentional copies, and changed/removed
values. Add focus, field-transfer, panel expansion and result assembly as recipes
or separate presets only where their validation/behavior differs. The simulated
review state does not approve a real action or record production acceptance.

Deliver reusable form/browser, spreadsheet, automation, AI draft and review
compositions with selected-shot proposal support. Reject missing fields, invalid
state edges and unplanned rewrites. No external services are invoked by playback.

## M4 — One expressive cutout character

Author one original business-owner character with licensed/provenance metadata,
named pivots, parent relationships, occlusion order and bounded pose states.
Start with look/react, then complete point/type/hand-off before declaring this
category done. Five labels on equivalent root transforms do not meet acceptance.

Use hierarchical SVG groups, local joint coordinates and explicit prop anchors.
Document the planned hand/prop contact and release frame. Ensure initial/final
pose correspondence, camera compatibility and no concurrent joint ownership.
Proof all five actions, repeated poses, arm attachment, face/prop clipping and
phone-size expressive readability. Human review judges the acting quality.

## M5 — Curated morph collection

Keep message-record unchanged. Add six original reviewed pairs: question-answer,
document-checklist, complaints-problem, problem-product, blocks-chart and
manual-automated workflow. Define recognizable source/target artwork and narrative
meaning before matching path geometry; abstract blobs are insufficient.

Each entry records dimensions, license/source/hash, compatible path topology,
fill/stroke, clipping and duration. Complex examples may combine several curated
paths with layer reveals/handoffs; retain the requested semantics instead of
forcing a complex diagram into a single outline. Add an explicit versioned chain
contract for consecutive transformations, with a validated shared intermediate
geometry. Keep connectors, labels and source values intact where applicable.

Proof every new pair and a multi-transition chain at endpoints and dense
intermediate samples. Repeat end → zero → middle seeking in one mounted Player;
fresh stills alone previously missed an initial-path reset defect.

## M6 — Licensed editable collage

First slice: one local raster image, one vector, typography and a texture assembled
as independently editable layers. Extend the curated asset pipeline with stable
ID/hash, provenance/license, verified dimensions, MIME/decoded format and intended
use. Accept trusted imports, not arbitrary generated paths or remote URLs.

Bound file size/pixel count, fail on missing/corrupt/mismatched assets and exclude
animated or unsupported formats until explicitly handled. Preload decoded assets
before rendering. Record deterministic crop, mask, blend/opacity and layer order.
Use existing transforms/masks for paper reveal, cutout slide and editorial focus;
add choreography only where needed. Hash the asset manifest and bytes and test
offline preview/export, alpha edges, cropping and preserved editing control.

## M7 — Constrained perspective camera

First slice: one authored three-layer scene with explicit depth, focal subject,
bounded camera push and deterministic projection inside the current renderer.
Keep GSAP choreography and Remotion frame authority. Do not reinterpret existing
2D camera fields or present the existing offset-return effect as perspective.

Define coordinate units, near-plane/safe movement limits, projection center,
occlusion and clipping rules before adding pan, reveal, reframe and depth-handoff.
Extend quality bounds to projected geometry; 2D box checks are insufficient.
Keep technical diagrams outside perspective until connector and label correctness
is demonstrated. Test foreground rate differences, focal readability, seams,
occlusion, moving-root composition and exact mounted backward returns.

## M8 — Real variable-font expression

Record axes from the bundled font bytes, not a family-name assumption. First add
weight emphasis on short authored text with bounded endpoints. Measure the actual
font at each evaluated axis state and keep declared line breaks stable; existing
700-weight measurements cannot validate changing glyph widths. Either reserve a
verified motion envelope or reject an axis animation that exceeds its box.

Then support optical sizing, hierarchy shifts and character-level combinations
with explicit property ownership. Keep automatic optical sizing disabled when an
explicit axis owns it. Complete width compression with a reviewed width-capable
font and corresponding measurement tests. Preserve the legacy fixed-weight path.
Proof unsupported axes/ranges, axis/text-effect conflicts, loaded-font integrity,
highlight/mask alignment, two-line bounds and arbitrary mounted seeks.

## Director and Studio integration: continuous, then M9 audit

Do this with every milestone, not after all eight:

- Supply only registered targets/parameters plus teaching purpose, compatible
  actors, timing/complexity and use/avoid guidance to both Directors. Reuse the
  existing registries and strict full/scoped generated schemas.
- Add a selectable portrait example, narration example, supported parameter
  explanation and authored endpoint comparison to the existing gallery. Group
  Typography/Data/UI/Illustration/Transformation/Camera; add parameter controls
  only for validated supported fields.
- Gallery-to-shot application creates an immutable proposal through existing
  store/actions, then uses ordinary review/acceptance. New actor identity/layout
  needs a visual proposal first; do not force it into a motion-only revision.
- Extend existing timestamped quality findings for numeric overflow, text bounds,
  UI identity, rig contact/continuity and projected clipping. Treat density,
  focal competition and perceived distortion as heuristics/manual review unless
  an objective rule has evidence. No new vague quality score.

M9 exit: offline valid/invalid generated fixtures and scoped revision regressions
for all eight categories, unchanged neighbor shots, stale-source rejection and
Studio proposal application. Separately exercise configured live model generation
and record provider, output, validation and retries; hand-authored fixtures do not
prove the AI selected the capabilities. Paid generation follows session authorization.

## Evidence gate for every milestone

Run focused tests first; then `npm run check` and `npm run build` sequentially.
Use synthetic isolated boards for technical proof. Record engine/input/asset hashes,
1080×1920/30fps sequential frames, exact fresh PNG seeks, exact mounted backward
state/frame returns, full MP4 decode and preview/export SSIM ≥0.98. Include boundary,
start/end, peak motion and repeated-seek frames. Asset/font failures must fail closed.
Run scoped-revision tests that preserve unselected shots and source bindings.

Inspect moving results and phone-size text/contacts. A technical pass does not
establish aesthetic success, listening approval or production authorization.
Preserve old saved artifacts and approvals as history; new hashes require normal
revalidation. Roll back code/assets/registries together while retaining immutable
artifacts and the renderer snapshot needed to reproduce old output.

## M10 — Real-video comparison and completion

After synthetic gates, prepare a separate candidate proposal using the frozen
script, voice track and factual content. Review the three pinned sections first,
then the complete video with narration. Do not force every category into one clip;
all eight need working demos, while the benchmark uses techniques that teach it.

Use paired same-content playback with a fixed human rubric: readability, information
traceability, continuity, appropriate energy and visual sophistication, each 1–5
with timestamped reasons. Record actual editing time/revision counts if comparing
effort; do not invent savings, comprehension, engagement or revenue improvement.
Set comparison criteria before candidate review: no factual/audio changes, no
critical readability/continuity regression, and recorded preference with reasons.
Subjective preference is not a measured audience-retention result.

Exact candidate motion/audio review and the normal production gates precede its
production render. Prior baseline approval does not authorize the candidate.
Final done means all eight categories and Studio paths pass their proofs, the
live-Director audit is recorded, and the complete narrated comparison receives
human acceptance. If improvement is not demonstrated, record that outcome and
revise the candidate; do not redefine the evidence as a success.

## Next implementation action

Configure an authorized project gateway and complete the live M9 Director audit.
Restore the original project store/media and resolve the recorded candidate exact-seek
revalidation before completing M10 human review and production gates. See
[the current evidence record](advanced-motion-progress.md). Original exit criteria above remain unchanged.
