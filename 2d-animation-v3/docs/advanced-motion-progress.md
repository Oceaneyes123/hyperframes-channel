# Advanced motion implementation record

This supplements [the implementation plan](ADVANCED-MOTION-IMPLEMENTATION-PLAN.md).
All previews use isolated synthetic content. No production approval is implied.

## M0 baseline

`.data/advanced-motion-baseline/manifest.json` records 118 exact source/artifact
copies, current engine hash, runtime/lockfile and the benchmark's original bytes.
Read-only database queries preserved historical acceptance/production records.
Three measured comparison ranges are inquiry overload 240–401, processing 750–1079
and human review 1080–1379 (30fps). Original script, narration and export remain
untouched. The original MP4 matches its recorded SHA-256.

The historical renderer hash was not recovered from available commit candidates.
The current renderer snapshot and encoded historical benchmark are preserved
separately; exact historical source reproduction is not claimed.

Fresh baseline checks passed 119 tests/typecheck, production build, 600 full-size
frames, 40 exact fresh seeks, five mounted backward returns, corrupt-font failure,
20 legacy sampled frame comparisons and a fully decoded 600-frame silent H.264.
Minimum preview/export SSIM was 0.997212 (required 0.98).

## M2 coordinated typography (complete)

`text-layout-morph@1` accepts `{route, destinations}` for 2–8 existing visible
`inter-heading@1` word actors. Destinations give exact `{x,y}` per root actor;
the same content, typography and box dimensions remain source-bound. At least
two actors move. Duration is 18–90 frames, with one axis separating before the
other recomposes the layout. Routes are `vertical-first` or `horizontal-first`.

Every rendered frame checks portrait bounds and authored text-box intersections,
including stationary text. This conservative test uses the approved boxes, not
automatic paragraph reflow. A settled identity camera and unit-scale/unrotated
text are required. Complete inner entrances first. Other root transforms or camera
movement cannot interfere during the interval; camera emphasis can follow it.

Headline recomposition, word-to-UI and keyword focus are recipes over this one
contract, not duplicated preset implementations. The original handoff example and
all ten text entrance presets remain unchanged. The four new gallery examples
include suitable narration and start/end inspection.

For a shared-word cut, `incoming.textMatch:"typographic-match-cut@1"` opts an
interpreter3 `match-cut` into exact content, measured font, color, box and camera
identity checks on its named anchor. Untagged historical match cuts keep their
original semantics. This does not mutate or automatically replace text.

## M1 source-bound numeric display (complete)

`numeric-display@1` references `{sourceId, contentHash, recordId}`. It never accepts
inline values. Optional `{previousRecordId, relationshipId}` must match an authored
relationship between records in the same immutable source. Relationships carry
supplied meaning; shared source membership alone does not justify a transition.

The sole part is `digits`, with fixed geometry. Start with `numericProgress:0`
and finish at 1. `odometer-roll@1 {}` and `value-transition@1 {}` target that
visible, unmasked part for 18–90 frames. The latter requires the two related
records. Reserve signs, punctuation and digit-cell positions across both endpoints.
Rolling characters are decorative; the accessible label states the supplied target.

Digits and punctuation render from `inter-numeric-outlines@1`, an 18-character
local outline atlas derived from the existing licensed Inter font at weight700 and
optical size14. It records the exact font hash and OFL license and participates in
engine hashing. `python scripts/build-numeric-glyphs.py` regenerates it with
fontTools; runtime rendering needs no Python, network or extra dependency.
This avoids the tiny nondeterministic browser-text raster differences reproduced
across loaded fonts and screenshot modes. Byte-exact seek checks remain intact.

Supported formats are integer counts, USD/PHP/EUR/GBP currency in integer minor
units with two decimal places, and percentages explicitly stored in basis points
(3250 means 32.50%). Existing comparison values and fixed scales stay authoritative.
The new percentage unit and optional source relationships are additive; previous
source hashes and formatting do not change.

Use existing primitives for these recipes rather than duplicate presets:

- **Numeric reveal:** an already-final numeric part (`numericProgress:1`) revealed
  with `mask-reveal@1`; start/end masks are 0 and 1.
- **Currency display:** roll a source whose unit is currency, then hold.
- **Percent emphasis:** reveal/roll a percentage source, then apply existing
  root/camera emphasis and a reading hold. Do not invent accuracy or earnings.

The gallery provides source examples, authored endpoint buttons and a roll-duration
control. Its four-second fixture limits the control to 18–54 frames so the reading
hold remains intact; the runtime contract supports 18–90 frames in longer shots.
The visual/motion planners receive the source records and strict numeric guidance.
Unknown references, altered hashes, unsupported properties, stale correspondence,
unrelated endpoints, hidden parts and conflicting holds fail validation.

The reference suite covers carry/borrow, zero, negative values, currency and
percent precision, source/relationship rejection and beat constraints. Final proof passed 360 sequential frames, 24 byte-exact fresh seeks, three exact
mounted SVG/PNG returns and full H.264 decode with minimum SSIM 0.999094.
All 124 tests/typecheck and production build pass; nine existing build tracing
warnings remain. Twenty legacy text samples still match prior PNG bytes.

M2 passed 127 tests/typecheck, production build, 480 sequential frames and 34
byte-exact fresh seeks. H.264 fully decoded; minimum SSIM0.998647. Four mounted
SVG/PNG returns and the shared word across the matched cut are pixel-exact.
Phone review corrected the keyword hierarchy before the final proof.

## M3 semantic UI (complete)

`ui-workflow@1` is one reusable explanatory interface with five authored states:
customer form, Sheets record, n8n trigger, DeepSeek draft and human review pending.
It never invokes an external service or records an approval. The inquiry token is
one persistent object; its exact ID/value survives state changes and a continuous
shot boundary. Source-bound category/draft fields declare that inquiry as their
origin. Authored lines must join to the exact supplied field value.

The fixed parts are `surface`, `inquiry`, `category`, `draft` and `focus`.
`surface.uiStage` is an explicit integer0–4 in planning drawings.
`ui-state-transition@1 {trigger}` advances one stage in 18–60 frames, using only
`submit-form`, `row-added`, `model-returned` and `request-review` in that order.
The surface and inquiry stay visible/unmasked during transfer; their internal
geometry cannot be independently moved. Root motion remains available.

Existing primitives implement focus masks, field transfer during state transition,
bounded panel emphasis and category/draft assembly. Review poses preserve all result
fields; there is no “approve response” trigger. This profile deliberately covers
one inquiry, one category and one draft in five fixed reconstructions, rather than
arbitrary UI markup or a second application-state engine.

The eight-second gallery fixture crosses two continuous shots while retaining one
render actor. Semantic actions are resolved across the continuity group, so later
shot transitions (and later-shot numeric effects) stay on the same frame clock.
Accessible descriptions include the inquiry, results and pending human review.

M3 passed 131 tests/typecheck, production build, 240 sequential frames and 19
byte-exact fresh seeks. H.264 fully decoded; minimum SSIM0.996188. Mounted review
verified the exact single inquiry across all five states, derived identities,
accessible descriptions, exact backward SVG/PNG returns and exact UI pixels across
the continuous boundary. Desktop and phone layouts were inspected.

## M4 original character rig (complete)

`character-rig@1` references the exact hash-bound `owner-cutout@1`. It reuses the
project's original salon-owner face/body artwork and palette, with original cutout
limbs and a registered laptop, phone, document and review tray. Metadata records
pivots, parent relationships, fixed limb lengths, artwork and prop/contact anchors.
Internal joints remain attached through bounded two-link arm solving; desk props
stay stationary while the torso leans. No new runtime/dependency was introduced.

Five distinct actions target `body` for 48–120 frames:

- `character-look@1 {direction:"left"|"right"}` turns attention with head/gaze.
- `character-react@1 {trigger:"new-inquiry"}` coordinates concern and the phone cue.
- `character-point@1 {prop:"laptop"}` points at a registered screen location.
- `character-type@1 {prop:"laptop"}` brings both hands to the keyboard and types.
- `character-hand-off@1 {from:"desk",to:"review-tray"}` grips and carries one document,
  releases it in the tray and returns the hand to rest. Delivery does not approve it.

Parts `body`, `document` and `laptop` stay visible/unmasked with fixed geometry.
Start/end body `rigProgress` is 0; the document has explicit `handoffProgress`0 or1.
All actions settle to neutral; only the handoff persists document state1. The same
document can be delivered once, through its reviewed route. Transform the whole
root for composition; arbitrary joints, other anatomy and other prop targets need
a new reviewed rig version. This is a modest 2D cutout, not facial/3D capture.

Tests sample every frame of all actions, checking finite angles, fixed bone lengths,
neutral endpoints, keyboard bounds and hand/document contact. The 14-second gallery
fixture demonstrates all five actions with reading holds and one consistent identity.

M4 passed 134 tests/typecheck, production build, 420 sequential frames and21
byte-exact fresh seeks. H.264 fully decoded; minimum SSIM0.997211. Mounted
review verified all five actions, neutral/delivered endpoints, hand/document
contact (maximum0.000012 CSS pixels), and exact backward SVG/PNG returns.
Desktop/phone layouts were inspected.

## M5 — Curated semantic morphs (complete)

Six original CC0 schematic pairs use hash-bound references: question-answer, document-checklist, complaints-problem, problem-product, blocks-chart and manual-automated, all version1. The existing message-record@1 pair and morph-shape@1 semantics stay unchanged. New morph-chain@1 supports up to four registered pairs only when intermediate outline and marks match exactly. Its outline part has explicit morphStage0..N; morph-chain-step@1 advances one consecutive step in18..90 frames. Independent path targets prevent competing MorphSVG state during backward seeking. Marks fade before the silhouette changes and return at the target. These are schematic concepts, not real records or measured results.

Validation, gallery, fixture and Director guidance are integrated. Tests sample181 intermediate polygons per pair, reject crossings/invalid hashes/incompatible chains and unsafe choreography, and preserve legacy identity. M5 passes137 tests/typecheck and production build. The900-frame synthetic export passes59 byte-exact fresh seeks, full H.264 decode and minimumSSIM0.999031. Seven mounted backward SVG/PNG checks and second-step returns pass. Separate180-frame moving-root chain proof passes10 exact seeks. Engine c1116f6e1a8a9811813709a7b47834aa58ec656665195419ed8e69d319939f57; input f83c12d536f0fb80778e61dddd6c79f5ed467e5d82d05c1212b706fae9a0fbe3.

## M6 — Editable local collage (complete)

editorial-collage@1 binds desk-editorial@1 and five separate photo/paper/texture/vector/type parts. Crop, normal blend, assets and source identity are immutable; part transforms and masks remain editable. Raster manifests bind exact bytes, dimensions, alpha, MIME, provenance and rights fields. Fictional photo is generated output; no third-party stock license is asserted. Vector and grain are original CC0. No arbitrary URLs, imports or animation. Verified PNG structure and actual decode precede readiness; missing/corrupt media fails closed.

140 tests/typecheck and production build pass. Final proof:120 frames,14 exact fresh seeks, full decode, minimumSSIM0.980027. Mounted SVG/PNG backward return exact offline after decode. Five separate layers, intended crop, unique IDs, corruption failure and zero external HTTP requests verified. Phone/desktop inspected. Engine f627d07057b722cdad213477081eb75f5e026513db55089fe7d1ba156a20ed55; input c4edc83ba79161ca7e4003a980b722b69cc00869ec5acf086ed117ce2e99a815.

## M7 — Constrained perspective camera (complete)

perspective-scene@1 binds original support-depth@1 artwork and projection metadata. Three planes(z300,0,-450), focalLength900, center500/500 and nearPlane300 use bounded cameraX/Y/Z on a visible fixed camera part. Five18..90-frame presets: depth-push, parallax-pan, depth-reveal, perspective-reframe and depth-handoff, all version1. One token lifts clear, crosses depth and enters processing. Far-to-near occlusion, directly projected geometry and an alpha viewport preserve exact seeking under root scaling. Technical connectors and small labels are excluded. Existing2D camera/depth effects stay unchanged.

Shared poses drive rendering and projected-token quality bounds. Invalid identities, near-plane escapes, unsafe focal clipping/occlusion and duplicate handoffs reject.142 tests/typecheck/build pass.420 frames/23 exact fresh seeks, full decode, minimumSSIM0.998488. Mounted review confirms distinct plane rates, one token at13 poses, three exact backward SVG/PNG returns and delivery. Root motion composes. Engine58af85c44a1ebb02395eac14ead69abd70d0c0beb96e6165549da44a8ef7e4dd; inputc16f6fe4e121ef9a3f10965c2f5c796463ad60fac596d60716769281d62e2ee5.
