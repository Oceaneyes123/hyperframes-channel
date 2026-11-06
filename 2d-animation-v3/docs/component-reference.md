# Specialized motion contracts

Load only selected components. Follow [quality bar](quality-bar.md), [stage workflow](animation-workflow.md) and [text/kinetic contracts](text-motion-reference.md) as needed. Use exact registered IDs/hashes/endpoints; no generated geometry/code/selectors/URLs or new runtime dependencies. Preserve legacy rendering and immutable artifacts. Source/engine changes require normal binding revalidation, never transferred approval.

## Connected process contract

Preview `/connected-process` from `/text-motion`; paused portrait Player, synthetic only, no service calls/project creation.

### Author a connected scene

Use `semantic-diagram@1` with approved nodes/edges, involved parts `opacity:1`/`reveal:1`. Edge drawing requires start `strokeProgress:0`, end `strokeProgress:1`; this persistent field is edge-only, bounded 0..1.

| Interpreter-3 preset | Target/parameters | Behavior |
| --- | --- | --- |
| `edge-draw@1` | One `object-id.edge-id`, `{}` | At least six frames; stroke 0 to 1, labels preserved, arrow disclosed at completion |
| `edge-trace@1` | One fully drawn `object-id.edge-id`, `{}` | At least 12 frames; first 70% (floor to frames) travels graph path, disappears at arrival; fixed destination halo appears/settles for remainder |

Keep unique beat ID, purpose, type, importance, frame interval, narration anchor and continuity. Follow reaction with explicit reading hold; existing measured anchors need no new format. Server supplies endpoint/action rules to visual/full/scoped motion planning.

Graph owns path/source/destination. Reject arbitrary SVG/paths/selectors/destinations/parameters, concurrent edge drawing, hidden roots/endpoints, conflicting traces and hold overlaps. Root translation/scale works; part geometry stays fixed so connectors remain attached. `traceProgress`/`arrivalPulse` are generated transient edge/node fields, never initial drawing state; hide outside intervals. Traces into one destination cannot overlap reaction ownership.

### Rendering and compatibility

Normalized native SVG dashes draw strokes. Installed GSAP MotionPath runs in the path's local SVG coordinates via official Remotion adapter. No cross-container alignment: an isolated spike drifted under nested viewBoxes. No timer, random value, plain-object tween or callback drives frame state.

Historical parts without `strokeProgress` retain old path/marker/horizontal-mask behavior. No accepted assets/projects/approvals are rewritten. Renderer/schema changes participate in existing engine hashing; no database migration/dependency added.

## Advanced motion contracts

### M1 source-bound numeric display

`numeric-display@1` references `{sourceId, contentHash, recordId}`, never inline values. Optional `{previousRecordId, relationshipId}` must name an authored same-source relationship. Shared membership alone does not justify transitioning values.

Fixed `digits` part: start `numericProgress:0`, end 1. `odometer-roll@1 {}`/`value-transition@1 {}` target visible/unmasked digits for 18–90 frames; value-transition requires the two related records. Reserve signs, punctuation and digit cells across endpoints. Rolling characters are decorative; accessible labels state supplied targets.

Render through `inter-numeric-outlines@1`: 18-character local atlas from licensed Inter, weight 700/optical size 14, exact font hash/OFL licence included in engine hashing. Regenerate via `python scripts/build-numeric-glyphs.py` with fontTools; runtime needs no Python/network/dependency. This avoids reproduced browser-font raster variation while retaining byte-exact seeks.

Formats: integer counts; USD/PHP/EUR/GBP integer minor units with two decimals; percentages in basis points (3250 = 32.50%). Existing fixed scales/values remain authoritative; added percentages/relationships do not change old source hashes/formatting.

Reuse recipes rather than duplicate presets:

- Numeric reveal: final `numericProgress:1` plus `mask-reveal@1`, masks 0 to 1.
- Currency: roll currency source, then hold.
- Percent emphasis: reveal/roll source, existing root/camera emphasis, reading hold. Never invent accuracy/earnings.

Gallery has source examples, endpoint buttons and duration control: four-second fixture restricts 18–54 frames to retain reading hold; runtime supports 18–90. Planners receive source records/strict guidance. Reject unknown refs, changed hashes, unsupported fields, stale correspondence, unrelated endpoints, hidden parts and conflicting holds.

### M2 coordinated typography

`text-layout-morph@1` takes `{route, destinations}` for 2–8 existing visible `inter-heading@1` word actors. Destinations give exact root `{x,y}`; content/profile/box dimensions stay source-bound. At least two actors move over 18–90 frames: separate one axis, recompose the other. Routes: `vertical-first`/`horizontal-first`.

Validate portrait bounds/authored text-box intersections on every frame, including stationary text. This conservative box test is not automatic paragraph reflow. Require settled identity camera, unit scale/unrotated text and completed inner entrances. No competing root/camera motion; camera emphasis may follow.

Headline recomposition, word-to-UI and keyword focus reuse this contract. Original handoff/ten entrances remain unchanged; four new narrated gallery examples include endpoint inspection.

`incoming.textMatch:"typographic-match-cut@1"` opts interpreter-3 `match-cut` into exact content, measured font, color, box and camera identity checks on its anchor. Untagged historical cuts retain semantics; no automatic text replacement.

### M3 semantic UI

`ui-workflow@1`: customer form, Sheets record, n8n trigger, DeepSeek draft, human review pending. It invokes no service/approval. One inquiry token retains ID/value across states/continuous seams; category/draft declare that inquiry as origin. Authored lines join exact supplied field values.

Fixed parts: `surface`, `inquiry`, `category`, `draft`, `focus`. Planning `surface.uiStage`: integer 0–4. `ui-state-transition@1 {trigger}` advances one stage in 18–60 frames; ordered triggers: `submit-form`, `row-added`, `model-returned`, `request-review`. Surface/inquiry stay visible/unmasked; fixed internals cannot move independently, roots can.

Existing primitives provide focus masks, field transfer, panel emphasis and category/draft assembly. Preserve result fields in review poses; no “approve response” trigger. Scope is one inquiry/category/draft in five authored reconstructions, not arbitrary markup/new app state engine.

Eight-second gallery crosses two continuous shots with one actor. Actions resolve across continuity groups, keeping later UI/numeric effects on the same frame clock. Accessible descriptions include inquiry, results and pending human review.

### M4 original character rig

`character-rig@1` binds hash-bound `owner-cutout@1`: original salon-owner face/body/palette, cutout limbs, registered laptop/phone/document/review tray. Metadata owns pivots, parents, fixed limb lengths, artwork, prop/contact anchors. Bounded two-link arm solving keeps joints attached; desk props stay fixed while torso leans.

All actions target `body`, 48–120 frames:

| Preset/parameters | Action |
| --- | --- |
| `character-look@1 {direction:"left"\|"right"}` | Turn head/gaze |
| `character-react@1 {trigger:"new-inquiry"}` | Concern plus phone cue |
| `character-point@1 {prop:"laptop"}` | Point at registered screen location |
| `character-type@1 {prop:"laptop"}` | Bring both hands to keyboard/type |
| `character-hand-off@1 {from:"desk",to:"review-tray"}` | Grip/carry document, release in tray, return to rest; delivery never approves |

Keep `body`, `document`, `laptop` visible/unmasked, geometry fixed. Start/end body `rigProgress` is 0; document explicitly sets `handoffProgress` 0/1. Actions settle neutral; only handoff persists document state 1. Deliver that document once through its reviewed route. Transform root for composition; new joints/anatomy/prop targets need a reviewed rig version. Modest 2D cutout, not facial/3D capture.

### M5 — Curated semantic morphs

Six original CC0 schematic pairs, version 1: question-answer, document-checklist, complaints-problem, problem-product, blocks-chart, manual-automated. Hash-bound; existing `message-record@1`/`morph-shape@1` remain unchanged.

`morph-chain@1` accepts at most four registered pairs only when intermediate outline/marks match exactly. Outline has explicit `morphStage` 0..N; `morph-chain-step@1` advances one consecutive step in 18–90 frames. Independent path targets avoid competing MorphSVG state on backward seeks. Marks fade before silhouette change and return at target. Schematics are concepts, not real records/measured results.

### M6 — Editable local collage

`editorial-collage@1` binds `desk-editorial@1`: five photo/paper/texture/vector/type parts. Crop, normal blend, assets/source stay immutable; part transforms/masks editable. Raster manifests bind bytes, dimensions, alpha, MIME, provenance and rights. Fictional photo is generated, not third-party licensed stock; vectors/grain are original CC0. No arbitrary URLs/imports/animation. PNG structure and actual decode precede readiness; missing/corrupt media fails closed.

### M7 — Constrained perspective camera

`perspective-scene@1` binds original `support-depth@1` artwork/projection metadata: planes z=300/0/−450, focalLength=900, center=500/500, nearPlane=300. Visible fixed camera part supports bounded `cameraX`/`cameraY`/`cameraZ`.

Five version-1 presets, 18–90 frames: depth-push, parallax-pan, depth-reveal, perspective-reframe, depth-handoff. One token lifts clear, crosses depth, enters processing. Far-to-near occlusion, direct projection and alpha viewport retain exact seeks under root scaling. Exclude technical connectors/small labels; existing 2D camera/depth stays unchanged.

Reject changed identities, near-plane escapes, unsafe focal clipping/occlusion and duplicate handoffs. Root motion composes with projection.

### M8 — Real variable-font expression

`variable-type@1` binds an immutable expression with actual font hashes/axes, glyph outlines and measured advances/ink bounds at 121 evaluated states. Five entries demonstrate Inter weight/optical size and OFL Roboto Flex genuine width compression, hierarchy and staggered character combinations.

Single `glyphs` part sets `axisProgress` 0/1; `font-expression@1` owns its 18–90-frame trajectory. Reject unsupported labels/axes/parameters, changed references, conflicting text effects, masks during expression and stale endpoints. Reserve complete envelopes; two authored lines remain stable. New copy needs reviewed atlas entries; legacy fixed-weight headings remain unchanged.

Offline `scripts/build-variable-type.py` uses fontTools/brotli for authoring only. Runtime verifies font bytes/FontFace decode and renders deterministic measured paths without automatic optical sizing. Stable compiler actor IDs preserve mask identity across hard-cut returns.
