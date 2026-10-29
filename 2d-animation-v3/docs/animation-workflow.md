# Connected animation workflow

Open a project's **Visual concepts and storyboards** workspace. Accept the current
script, select a concept and accept its exact storyboard. Motion requests then run
through the configured server-only CLIProxyAPI gateway. Generated JSON is validated
against the source drawings, object correspondence and supported interpreter.

Concepts, storyboards and storyboard-shot revisions use
`CLIPROXYAPI_VISUAL_MODEL` when set, falling back to `CLIPROXYAPI_MODEL`.
Use Sol 6.1 (`gpt-6.1-sol`) for all workflow work except rendering and export:
research, writing, editorial review, narration coordination, visual planning,
storyboards, motion authoring and creative review. Use Luna (`gpt-6-luna`) only
to operate the rendering and export workflow, including render preflight,
preview/review renders, encoding and technical output verification. Remotion,
GSAP and FFmpeg remain the rendering tools; Luna coordinates their execution.
See [workflow model assignments](workflow-efficiency.md#model-assignments).

These are workflow agent assignments, not a runtime configuration change. Each
visual job records the model actually requested. Existing proposals retain their
original model history.

## General visual direction

V3 defaults to large animated diagrams and recognizable icons with visible cause
and effect. Narration carries the explanation; the canvas defaults to no text.
Use at most two short labels of one to three words when teaching needs them,
with exceptions for exact commands, numbers and required factual qualifications.
Do not add spoken or on-canvas provenance labels such as **Hypothetical**,
**Demo** or **Illustrative**. Introduce invented examples naturally in narration
(for example, "Imagine three freelancers") and keep provenance in reviewer notes.
Preserve meaningful conditions and uncertainty; invented customers, payments or
results must never appear to be verified evidence. This applies to future writing
and visual requests; existing immutable artifacts keep their original text.
Avoid paragraphs, bullet lists and narration-filled cards. Concept explanations
remain available under **Concept details**, outside the planning drawing.

Plan persistent objects that move, connect, group, compare or transform. Short
GIF-like sequences use native seek-safe actions and purposeful cycles followed
by readable holds. Arbitrary GIF/image uploads are unsupported; approved local raster assets use the registered collage contract below. Concept and
storyboard drawings remain static key states; actual animation appears in motion
review after storyboard acceptance. Shared generation guidance lives in
`server/visual-guidance.ts` and applies to concepts, storyboards, shot revisions
and motion proposals. Existing artifacts and human approvals are not rewritten.

## Review motion

The `centered-text` primitive centers a fitted single-line label inside its box
in both planning drawings and motion. Its text width/height stays fixed during
motion, like other text primitives. Existing `text` labels retain left alignment.

The client-only Remotion Player uses the same composition as local export. Play,
pause, step, scrub, select shots and loop their incoming boundary. Narration links
locate shots. A scoped revision can change that shot's actions, camera and duration;
the server reconstructs the plan while preserving every other shot and the script.
Duration changes visibly shift downstream offsets. Compare a proposal with the
accepted version at the same global frame; a shorter version holds its final frame.
Only the main preview supplies time and audio. Accept or reject explicitly.
Historical/rejected/stale artifacts remain readable; they cannot acquire fresh approval.

Interpreter 2 has explicit arrival semantics:

| Type | Meaning |
| --- | --- |
| hard-cut | Immediate cut, zero overlap |
| match-cut | Immediate cut at an explicit geometry/camera-matched anchor |
| continuous | One persistent SVG actor across a geometry/appearance/camera-matched seam |
| camera | Lateral scene slide with overlap, using the official Remotion presentation |
| reveal | Incoming scene wipes over the outgoing scene |
| split-screen | Both complete compositions shrink into neighboring panels, hold side by side, then the incoming panel expands; at least 15 overlap frames |
| motion-match | Rejected: velocity matching is not implemented |

New plans reject incompatible presentation/type pairs and invalid/triple overlaps.
Legacy interpreter-1 artifacts retain their original interpretation, including old
fade presentations. Scoped revisions retain the applicable legacy or beat contract and reject
incompatible boundaries; request a full plan when upgrading those effects.
Text width/height animation rejects explicitly; use movement, scale, opacity or
separate replacement objects. No arbitrary plugins, SVG markup, URLs or generated code.

Bundled reusable symbols include document, browser, database, server, cloud, person,
chip and coin. Heading, caption and code treatments provide typography hierarchy.
All symbols and fonts are local; the fixed source and lockfile are part of gate bindings.
Planning and moving views share these renderers. Camera motion and reading holds
are explicit instructions, not automatic decoration.

## Quality gates for new work

Storyboard acceptance now stops when a bank amount falls outside the padded value
area of its card, a comparison operator is off the values' vertical centers, or
more than two non-code text actors share a frame. The graphic review lists the affected
shot and start/end drawing. Revise those drawings before accepting the board.
Sourced amounts remain separate actors; clipping a number in the renderer does
not make an overflowing layout acceptable.

Motion Quality now flags static holds over four seconds and runs of three or
more explanatory shots made only of entrances, emphasis, and holds. These and
repeated primary presets stop Gate 1 until motion is revised. Use the existing
motion preset library to show a source-faithful change of state, then allow a
short reading hold. A human still reviews the moving export with narration for
Gate 2. Old accepted artifacts remain readable; new quality checks do not
rewrite their saved frames or exports.

## Narration and production safeguards

Channel narration now defaults to **audio version 2: Fish Audio via OpenRouter**.
The [versioned narration reference](../../2d-animation/channel/AUDIO_VERSIONS.md)
records the approved audition/settings and preserves version 1 Supertonic rollback.
This is a production preference, not a built-in synthesis adapter. Existing project
audio stays unchanged until a separate complete revision is generated and imported.

Import a complete mono/stereo PCM16 WAV, at most 16 MB, plus measured line timing:

```json
[{"number":1,"startFrame":0,"endFrame":110}]
```

Supply every narration line once, ordered, inside its assigned shot. End frames
are exclusive. Audio duration must match accepted motion within one frame at 30 fps;
revise motion timing and accept that revision first if needed. The app measures
duration/sample rate/channels and derives a peak waveform; it does not establish
spoken-word alignment or synthesize/transcribe speech. Timing accuracy needs listening.
The main Player uses Remotion audio synchronization; comparisons stay silent.

Separate deterministic diagnostics flag missing reading holds, strong camera movement
and long text. These checks are independent of generation and never claim human quality.
Gate 1 records explicit review of the exact creative plan and sources. Gate 2 requires
Gate 1 and a separate moving/audio review attestation with findings. Binding includes
the accepted script/storyboard/motion, exact voice/timing, bundled assets, engine
source/configuration and package lock. Replacing narration or changing accepted
inputs/configuration invalidates gates. Models cannot issue these approvals.

The render button separately requires **explicit local production render authorization**.
Rendering never publishes. Chrome (or `V3_CHROME_PATH`), FFmpeg and ffprobe must already
be installed. Initial local export is limited to 180 seconds and one active job per
project. Rendering is request-bound; failure/disconnection retains diagnostics, and
an interrupted job expires after 30 minutes before explicit retry. There is no durable
background worker or cloud render service.

Export verification requires 1080×1920, 30 fps, exact frame count/duration, audio,
full decode, every encoded frame matching sequential PNG preview references at
SSIM ≥0.98, fresh boundary seeks matching exact PNG bytes, and audio correlation
≥0.9 with lag within one frame. Comparisons normalize time bases and retain the same
filter graph across RGB/RGBA PNG changes. These are technical tolerances for lossy
H.264/AAC, not proof of aesthetic or narration quality. Verified downloads check the
export hash; stale inputs during rendering prevent successful completion.

## Verification

`npm run check` and `npm run build` are required. `node scripts/verify-production.mjs`
creates a fresh isolated synthetic project with all supported transitions, typography,
symbols and test-tone audio, and exercises the actual guarded renderer. Its fixture
gate records expressly do not represent human approval of real media. It preserves
every round under `.data/production-proof-*`; original benchmark and v1/v2 data stay
separate. Browser verification uses an isolated fixture or explicitly live gateway.

Current [synthetic export receipt](gsap/workflow-verification.json) verifies 350
frames, exact fresh seeks and settled opening, minimum SSIM 0.998518, full decode,
audio correlation 0.999999584 and zero lag. The
[live Studio receipt](gsap/live-motion-verification.json) records successful real
gpt-6-luna full/scoped requests and unchanged unselected shots. Both are technical
integration evidence, never actual human production approval. The
[transition contact sheet](gsap/workflow-transition-windows.png) includes shared
seams, hard/match cuts, slides, wipes and the split-screen comparison hold.
The [extra seek receipt](gsap/workflow-seek-verification.json) verifies nine fresh
out-of-order PNG seeks inside the slide, wipe and split-screen, including a repeated
frame. [Studio screenshot](gsap/studio-motion-review.jpg) shows connected comparison.
An isolated [45-frame UI export receipt](gsap/ui-render-verification.json) also
exercises actual browser audio upload, test-only gate forms, authorized synthetic
HTTP rendering, verified download and range requests. Its gate notes explicitly
identify automated synthetic software verification, not real human approval.
[Synthetic export screenshot](gsap/studio-synthetic-export.jpg) records that test.

Presentation integration follows the official
[Remotion custom presentation contract](https://www.remotion.dev/docs/transitions/presentations/custom)
and installed version 4.0.537. Production quality acceptance still needs the user's
actual moving/audio review of a real project. No real production video is authorized
or generated by this implementation task.

## Motion graphics extension (October 24, 2026)

Reusable production commands, interrupted narration recovery, measured storyboard
timing, early scene review, grouped human production confirmations and single-pass
frame rendering are documented in [workflow efficiency](workflow-efficiency.md).

Interpreter 3 adds validated, versioned beats and six semantic choreography presets while retaining legacy interpreter output. Safe authored components share static/animated rendering, named parts and bounded masks. Optional script/audio-bound planning narration precedes motion generation; final narration and exact production gates remain separate. Timing corrections invalidate dependent motion. Motion Quality findings are diagnostic review evidence, not human approval. See [motion graphics workflow](animation-workflow.md#interpreter-3-choreography-and-components) for contracts, compatibility, verification and limits.


## Authoring reference

Current contracts from the specialized guides are consolidated below. Historical
benchmark results and failed rounds remain in the archive; they are not current
quality guarantees. Use the existing registered IDs and source hashes, and review
any new proposal through its ordinary acceptance and production gates.

- [Concepts and storyboards](#visual-planning)
- [Graphics and review](#graphic-assets-diagrams-and-review)
- [Editorial visual language](#editorial-visual-language)
- [Layered workflow example](#layered-workflow-example)
- [Text treatments](#text-treatments-and-authored-timing)
- [Kinetic foundations](#kinetic-capability-contracts)
- [Connected processes](#connected-process-contract)
- [Interpreter 3](#interpreter-3-choreography-and-components)
- [Advanced contracts](#advanced-motion-contracts)

## Visual planning

Open a project, accept its exact current script in script review, then follow
**Visual concepts and storyboard**. Generate three concepts, inspect each planning
image and teaching approach, and explicitly select one. Generate a storyboard,
click narration lines to find their shots, and inspect each shot's purpose,
framing, subject, action, arrival transition, continuity and start/end drawings.
Add revision notes and choose **Revise shot N only** for a scoped proposal.
Accept the exact storyboard separately after reviewing it.

Continue in the [connected motion and narration workflow](animation-workflow.md).
Static planning drawings remain available alongside the Remotion/GSAP Player;
accepting a storyboard alone never supplies production approval.


### Implemented boundary

- Images are real SVG planning drawings rendered from a strict declarative shape
  contract. The model cannot supply executable markup, scripts, URLs or assets.
  Three concepts must have distinct titles and metaphors; whether they are
  pedagogically distinct remains a human judgment.
- Each nonblank accepted narration line appears exactly once, in order. A shot
  revision preserves its narration references and every other shot byte-for-byte
  at the parsed value level. It never edits the script. Without reviewed narration timing, duration is estimated. With current
  reviewed planning timing, generation binds measured line spans and pauses. A
  static drawing alone is not narration-synchronization evidence.
- Completed proposals are immutable JSON under
  `<videos-dir>/<project-id>/visuals/<run-id>.json`, verified against SQLite SHA-256
  indexes. Schema 5 adds visual jobs, immutable concept choice events and exact
  storyboard acceptance. Existing script and writing data is preserved.
- Script identity, hash and inherited research currentness are checked before
  starting and completing work, choosing concepts and accepting boards. A new
  concept proposal, selection event or storyboard supersedes the corresponding
  prior artifact. Changing a choice away and back does not revive an old board.
  Historical artifacts remain readable, and stale acceptance is labeled.
- Requests reuse the loopback-only, matching-Origin JSON/NDJSON transport and
  configured gateway. One visual job runs per project; response size is capped
  at 300,000 decoded bytes, with a separate 4,000,000-byte framed-stream limit,
  and generation at 150 seconds. Interrupted jobs expire after
  three minutes on the next store open. There is no automatic retry. Raw gateway
  errors and credentials are not returned. Request instruction text is retained
  in the immutable artifact; unsubmitted notes are not persisted.

## Graphic assets, diagrams and review

### What is connected

- **Versioned assets:** nine original editorial object icons plus a layered research interface, alongside the original immutable `complaint-workflow@1`. Metadata records purpose, source, license, attribution, dimensions, composition compatibility, named layers and content hashes.
- **Safe import/build:** strict vector JSON supports bounded groups, multiple palette fills/strokes, local gradients/patterns, clipping, opacity and multiply blending. The renderer never accepts executable SVG, React, scripts, external URLs or arbitrary attributes. The CLI validates, hashes and installs new versions under an exclusive lock without overwriting existing versions.
- **Semantic diagrams:** directed branches, networks, feedback edges and acyclic parent groups are validated separately from presentation. Stable breadth-first ranks and orthogonal routing preserve supplied edges. Original editorial icons represent people, devices, documents, messages, processors, databases, cloud services, payment objects and products. Node emphasis is explicit. Vertical labels sit beside nodes; feedback routes use the opposite side.
- **Backgrounds:** soft-gradient, geometric, technical-grid, atmospheric, editorial and environment families use deterministic SVG. Subtle depth is derived from frame time; there is no random animation or remote media.
- **Art direction:** eight composition families and a validated per-shot design record cover meaning, metaphor, focal point, layout, density and intentional continuity. The actual visual generator loads the [Visual Art Director skill](../skills/visual-art-director/SKILL.md), current registry and previous scene history.
- **Graphic review:** `graphic-quality@1` reports schema/asset/graph defects, small or overlapping text, solid-color contrast, density, potentially displaced layers, diagram crowding and unintended repetition. These are technical checks and heuristics, not an aesthetic grade.
- **Image review:** the existing gateway receives actual 360×640 start/end renders, source-bound context and deterministic findings. Strict suggestions reference only the requested shot. Reports record source, engine and image hashes; stale/cancelled reviews do not promote anything.
- **Studio:** inspect art direction, asset licenses/hashes/layers, semantic connections, contact sheets, prior/proposed artwork and image-review suggestions. Use a suggestion to fill the existing scoped-revision instruction or dismiss it locally. Revised artwork remains a new immutable proposal requiring existing storyboard acceptance.

The diagram renderer keeps internal geometry fixed during motion so nodes cannot detach from their connectors. Use `mask-reveal@1` for progressive node/edge disclosure and move/scale the whole diagram root when needed. Geometric presets such as snap-overshoot are rejected on diagram parts. Graph changes require replacement actors. Other vector assets retain independently animated part geometry, color, opacity and masks.


### Eight reference compositions

The benchmark fixture `tests/fixtures/graphics-gallery.ts` covers editorial illustration, technical cutaway, illustrated workflow, interface demonstration, visual comparison, data storytelling, visual metaphor and typography. It shares the versioned ink, paper, mint and coral palette while varying placement, density, recognizable objects and visual mechanisms.

The examples explain complaint research for a candidate software tool. They are synthetic illustrations, not captured Reddit UI, actual customers or evidence of demand. The three-complaint example explicitly leads to one hypothesis, not three customers.


### Use the implementation

Start V3 normally. Accept a script, generate concepts and choose a direction. Newly directed storyboards may include `shot.design`, `frame.environment`, a `graphic-asset@2` reference or a `semantic-diagram@1` graph. Legacy frames do not require new fields.

Open **Graphic design review** on a shot to inspect its design, assets, findings and previous artwork. **Review rendered shot** creates real phone-size frames and requests advisory visual feedback. **Use for shot revision** fills the direction; it does not immediately call a model or accept changes. Review that direction and use the existing **Revise shot** button. Review the resulting proposal before accepting the storyboard. Model review and storyboard acceptance do not substitute for motion acceptance or Gate 1/Gate 2.

The image-review report and PNGs are saved under the configured data directory's `graphic-reviews/<uuid>/`. Suggestions displayed in the browser are session-local; dismissing one does not delete the immutable report. A single review per project can run in one server process, with a 180-second deadline and cancellation. Multi-process coordination is outside this local, loopback-only deployment.


### Import reviewed vector artwork

Use the structure in `workflow/graphic-pack.json` as a reference. Supply an individual asset document, not a full registry entry:

```powershell
node scripts/import-graphic-asset.ts --check artwork.json
node scripts/import-graphic-asset.ts --install artwork.json
```

`--check` performs no installation. `--install` updates the curated source pack; rebuild and run checks before using it in production. Imports are limited to 200KB, bounded nodes/groups, supported licenses and palette roles. Paths are limited to SVG path commands and numbers. Source and attribution strings are metadata only and are never loaded as URLs. A crash can leave an import lock for manual recovery; verify that no importer is running before removing it. Imported assets still need rendered human review.

Do not edit registered artwork under an existing ID. Publish a new version and hash. Raw SVG/XML import is intentionally unsupported; convert it into the validated vector document outside the runtime. Licensing metadata is a required declaration, not automated verification of third-party rights.

### Graphics compatibility

Visual schema 1 remains unchanged for legacy content. Schema 2 admits registered artwork, diagrams, environments and design metadata without a database migration. Motion hydration derives asset/graph identity and part states from the storyboard. Validation checks exact endpoint and graph correspondence. The production engine binding includes the vector pack, registry, schemas, shared renderers and inspectors, so changed dependencies stale existing production bindings rather than silently reusing approval. Existing exported media is unchanged.

### Graphic review boundaries

Human blind preference, continuous video/audio review and production approval remain human decisions. Live image review suggested enlarging the sample system diagram; optical strokes and labels were subsequently enlarged. No final human aesthetic approval is inferred. Preset repetition warnings are retained as creative review suggestions. No numerical score or passing test is presented as proof of professional design quality.

## Editorial visual language

This is the first illustrated-workflow direction, not a complete design system for every video. Its executable tokens and asset metadata live in `workflow/graphic-assets.ts`.


### Meaning and composition

The browser shows recurring work complaints. The same coral marks reappear in grouped excerpts under a magnifier, then in a candidate tool on a laptop. The tool is an idea to validate, not evidence of demand, earnings or a completed product.

Use the 900×1200 illustration as one root actor on a 1080×1920 portrait canvas. Its diagonal composition connects an upper-left browser, middle-right grouping and lower-left laptop. Background wash, path and ground establish depth without becoming separate storyboard shapes.

The reference placement is x=8%, y=14%, width=84%, height=63%. Width and height must preserve 3:4 artwork proportions in canvas pixels. On the portrait percentage grid, `height = width * 0.75`. Keep this illustration large enough for its repeated marks to read at 360×640. It is specialized for complaint research; do not reuse it for unrelated narration.


### Tokens and typography

| Role | Value |
|---|---|
| Paper | #F7F3E9 |
| Ink | #203B3A |
| Supporting ink | #607570 |
| Accent | #D9633F |
| Mint | #C6DED3 |
| Light surface | #FFFDF8 |
| Background line | #D7DFD4 |
| Main stroke / radius | 4 / 22 artwork units |

Only the accent role is customizable through the shape color and layer colors. Other roles stay fixed for this version. Gradients, a vector grid, soft silhouettes and a small ground shadow provide depth; there are no random textures, filters, fonts or remote dependencies.

No text is baked into the illustration. Keep any essential narration labels as separate editable V3 text actors using the existing text renderer. Avoid paragraphs and transcripts. The reference needs no on-canvas text, font download or decorative motion.


### Named layers and motion

- `complaints`: browser, repeated marked excerpts and cursor.
- `cluster`: grouped excerpts and magnifier.
- `packet`: extracted shared pain, moved into the candidate tool.
- `opportunity`: laptop candidate and idea bulb.

The background remains static. The example reveals grouping, carries one packet, reveals the candidate and holds the result. Layer offsets use the existing canvas-percentage contract, including in the 360-wide Studio preview. Each layer supports the existing opacity, position, scale, color and reveal-mask fields. Root geometry remains fixed; use scale or replacement actors instead of width/height animation.


### Version and safety

`complaint-workflow@1` is original local CC0 artwork compiled from reviewed TSX. Models can select its exact registered ID/hash and bounded part states; they cannot submit SVG, JavaScript, URLs, event handlers or arbitrary markup. The static reference binds the normalized source SHA-256. The production engine hash additionally includes the asset source, theme/registry, renderer and schemas.

Visual artifacts containing this artwork use schema 2. Existing primitive/component artifacts continue to use schema 1. No existing component's authored artwork was changed. New assets or artwork revisions require a new version, hash, focused tests and rendered review. Never replace approved artwork under an existing asset ID.

The original workflow illustration is one immutable asset; the extended catalog below adds composition directions and reviewed vector imports without replacing its version.


### Composition catalog and extended graphics

The executable theme remains `editorial-workflow@1`. The continuation adds nine matching original vector object icons, a layered interface, semantic graph rendering and six supporting background families. The eight composition families and complete gallery fixture are documented in [graphics-overhaul.md](animation-workflow.md#graphic-assets-diagrams-and-review). These extend the language; they do not replace the original asset version or make historical approved frames editable.

## Layered workflow example

### Use in Studio

Use an accepted script about complaint research. In the existing visual direction field, request:

> Use complaint-workflow@1 to group repeated work complaints into a candidate tool. Keep complaints visible initially. Reveal the cluster, carry one packet into the candidate tool, then hold. Preserve the narration's requirement to validate demand. Use the registered hash and 3:4 illustration proportions.

The visual generator receives the exact asset metadata, hash and named layers. It still returns a proposal for human review; asset selection is not guaranteed by a prompt. Review the existing start/end frames, accept the storyboard explicitly, then use beat motion. Hydration copies the approved asset reference and part states; the model cannot replace artwork or submit executable SVG. Existing shot revision and acceptance behavior remains in place. No separate import or approval UI was added.

The source fixture `tests/fixtures/graphic-workflow.ts` shows a complete validated proposal and motion sequence. It uses one root shape and four internal layers, leaving the 16-shape planning limit unchanged. Visual artifacts with artwork use schema 2; older artifacts retain schema 1 without rewriting. No database migration is needed.


### Reproduce

From `2d-animation-v3`, with installed dependencies, Chrome, FFmpeg and ffprobe:

```powershell
npm run check
npm run build
node scripts/verify-graphic-workflow.mjs
```

Set `V3_CHROME_PATH` if Chrome is installed elsewhere. The proof writes to a new timestamped `.data/graphic-workflow-proof-*` directory and refuses an existing output directory. Optional first argument supplies a new output directory whose parent exists. The saved baseline paths are intentionally fixed; the proof fails if those source projects are absent. The frozen copies remain available for review.

Historical before/after images are planning and synthetic comparison evidence, not
continuous playback, audible review or human production approval. Inspect meaningful
objects, repeated signals, depth and readable part motion for the actual teaching goal.

## Text treatments and authored timing

Ten reusable treatments for V3, researched and implemented October 25, 2026.
Open **Text motion library** from the Projects page, or visit
`http://127.0.0.1:3003/text-motion` after `npm run dev` from `2d-animation-v3`.
The interactive gallery uses the same `VisualText` renderer as production.
It starts paused; select a treatment, edit the sample and play or scrub.


### Research and selection

[GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) demonstrates word,
character and line splitting, masks and staggered entrances. Its accessible
label pattern informed our unsplit accessible label around decorative segments.
[Adobe text animators](https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html)
document selection ranges and animated position, opacity, spacing and scale.
[Remotion's rendering guidance](https://www.remotion.dev/docs/flickering)
requires visuals to depend on frame time and remain independent of render order.

These sources establish the available techniques. The selection, timing ranges,
motion curves and implementations below are our design choices, not measured
engagement improvements or copied commercial templates. They need no new package,
font download, paid template or plugin. No third-party animation code was copied.


### The ten treatments

Recommended ranges assume 30fps. The same `startFrame`/`endFrame` interval includes
the entire stagger; later letters never extend beyond the declared end.

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

Use one focal treatment per beat. Use movement to introduce, disclose or emphasize
information, then let the viewer read it. Keep secondary labels still. Do not add
copy solely to justify an effect. A fully static label is still appropriate when
the visual explanation elsewhere is already moving.


### Apply to upcoming videos

The motion planner receives the library automatically in `server/motion.ts`.
It may return an optional `textMotions` array for each full or scoped shot proposal:

```json
{
  "textMotions": [
    {
      "targetId": "object-1",
      "presetId": "word-stagger@1",
      "startFrame": 6,
      "endFrame": 36
    }
  ]
}
```

This is a field within an otherwise complete motion shot, not a standalone plan.
`object-1` must already map to an approved nonempty root text, centered-text,
heading, caption or code actor. It does not rewrite the storyboard or its text.
For a scoped revision, omit `textMotions` to retain prior treatments or return `[]`
to remove them. Example direction: “Use a masked rise for the heading, underline
the takeaway, and keep supporting labels still.” Proposals still need acceptance.

Intervals use shot-local 30fps frames. Frame-only intervals are estimated visual
timing. The measured narrationAnchor extension is documented below. When precise audio alignment matters, set the interval
from actual measured timing and review the moving preview with narration.
Hidden entrants must complete their root entrance before a treatment starts.
The validator rejects unknown presets, extra fields, missing/nontext or duplicate
targets, intervals under six frames, competing root motion, reading-hold overlaps
and continuous anchor restarts. Finish at least 12 frames before the last visible
frame; use an explicit reading hold of at least 15 frames where appropriate.

Continuous actors keep their first treatment and its settled appearance across
the boundary; they do not replay on the next shot. Historical plans without this
field keep their existing rendering path. The engine fingerprint includes both
new modules, so existing production bindings require the normal revalidation.
No saved production project is migrated or rewritten.


### Runtime and limits

`workflow/text-motion.ts` owns the versioned registry and strict JSON contract.
`engine/text-motion.tsx` implements the SVG treatments. Remotion owns frame time;
the outer actor/camera still uses the existing GSAP adapter. Inner text uses pure
frame calculations without timers, random values, DOM splitting or stateful
tweens, so fresh and backward seeks can produce the same image.

For legacy shapes without a measured typography profile, retain the short-label
font-size heuristics. Registered typography and variable-expression profiles below
have their own measured layout contracts; none is automatic paragraph reflow.
Centered text retains its alignment. Grapheme splitting preserves emoji and combining marks, but individual
segments may change kerning or connected-script shaping. Prefer whole-label
treatments for those scripts; tracking and left-to-right wipes need manual review.
Highlight and underline span the authored text box. Masks, blur and a 4% scale
overshoot need safe margins. Review actual fonts, contrast and readability at phone
size. The gallery starts paused and never autoplays; exported videos have fixed
motion and do not respond to operating-system reduced-motion preferences.

## Kinetic capability contracts

Open `/motion-library` from Projects. Each example starts paused and offers a
keyboard-accessible frame slider. These are synthetic capability demonstrations;
they do not edit saved projects or grant production approval.


### 2. Reliable typography and timed emphasis

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


### 3. Kinetic layout and information handoff

The handoff example uses existing fixed-label word actors and inbox parts. Words
move into authored field slots; the same packet moves from the message to the
review area. Placeholder marks disappear before the new labels arrive so they do
not intersect the text. No new identity system or live DOM Flip capture was needed.

Reuse `snap-overshoot@1`, approved start/end drawings and compound part IDs. Finish
an inner text entrance before moving its root. Keep labels fixed on corresponding
actors; use explicit replacement actors for a changed label/type. A transfer into
a review slot does not imply that a person approved the result.


### 4. Source-bound data comparison

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
revenue or earnings result. This comparison contract does not fabricate intermediate measurements.
Source-bound numeric-display and odometer contracts are separate extensions below.


### 5. Reviewed scene depth and assembly

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


### 6. Curated morph pair

`morph-shape@1` shapes require `morph:{pairId,contentHash}`. The original pair is
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

## Connected process contract

Preview `/connected-process` from `/text-motion`; the portrait Player starts paused.
The synthetic example does not call a service or create a production project.

### Author a connected scene

Use `semantic-diagram@1` with approved nodes and edges. All involved parts must be
visible (`opacity:1`) and unmasked (`reveal:1`). To draw an edge, set its part's
`strokeProgress:0` in the start drawing and `strokeProgress:1` in the end drawing.
This field is accepted only on diagram edges and is bounded to 0..1.

Interpreter 3 adds these versioned beats:

| Preset | Target | Parameters | Behavior |
|---|---|---|---|
| `edge-draw@1` | One `object-id.edge-id` | `{}` | Draw the stroke from explicit 0 to 1; preserve labels and disclose the arrow at completion |
| `edge-trace@1` | One fully drawn `object-id.edge-id` | `{}` | Travel along its graph-owned path, then pulse its fixed destination |

Keep the normal beat fields: unique ID, purpose, type, importance, start/end frames,
narration anchor and continuity. Draw takes at least six frames. Trace takes at
least twelve: the signal travels for the first 70% (rounded down to whole frames),
disappears at arrival, and the destination halo appears then settles during the
remaining frames. Use an explicit reading hold after the complete reaction.
Existing measured beat anchors work without a new timing format.

The server supplies these rules to full/scoped motion proposals and tells visual
planning how to author stroke endpoints. Schemas reject paths, selectors, arbitrary
SVG, alternate destinations and unknown parameters. The graph determines the
source/destination. Concurrent edge drawing, hidden endpoints/root, conflicting
traces and reading-hold overlaps fail validation. Root translation/scale remains
supported; diagram part geometry stays fixed so connectors cannot detach.

`strokeProgress` is persistent drawing state. `traceProgress` and `arrivalPulse`
are generated transient action fields restricted to edge and node parts; they are
not accepted as initial drawing fields. Transient effects are hidden before their
interval and after completion. Multiple traces into one destination must not
overlap its reaction ownership.


### Rendering and compatibility

Native normalized SVG stroke dashes draw the connector. The installed GSAP
MotionPath plugin moves a signal in the same local SVG coordinate system as its
path through the existing official Remotion adapter. Cross-container alignment is
deliberately omitted: an isolated spike demonstrated drift inside nested viewBoxes.
No timer, random value, plain-object tween or callback supplies frame state.

Historical parts without `strokeProgress` retain their original path/marker and
horizontal-mask rendering. No asset, accepted project or saved approval is rewritten.
Changed renderer/schema files are already covered by the production engine hash;
existing production bindings require normal revalidation. No dependency or database
migration was added.

## Interpreter 3 choreography and components

New full Studio motion proposals use interpreter 3 with versioned beats. Saved interpreter-1/2 artifacts retain their rendering path. Legacy scoped revisions continue the existing action contract.


### Review flow

1. Accept the script. Optionally import its PCM16 WAV and measured line timing under **Narration timing**. Phrase/word spans require manual verification or a verified aligner; no constant-speed word estimates are generated.
2. Review and accept visual concepts/storyboards. Models choose installed components and parameters, never executable SVG, JavaScript, selectors or external assets.
3. Generate motion with Intense guidance by default for new plans; Calm, Balanced and Energetic remain explicit alternatives. Energy shapes actions rather than multiplying all durations. Audio duration and reading holds remain authoritative.
4. Inspect the Player, shot timeline and Motion Quality findings. **Review moment and use suggestion** selects, seeks and prefills an instruction; submitting a revision and accepting it remain explicit actions.
5. Final narration must match the planning audio/timing when present. Exact current inputs still require Gate 1, independent Gate 2 and explicit render authorization.

Timing corrections are immutable and invalidate dependent motion. Script edits make timing stale. Source/engine changes invalidate applicable production bindings; approvals never transfer automatically.


### Choreography and components

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


### Diagnostic limits

`motion-quality@1` reports versioned thresholds, shot/frame ranges, evidence and suggestions for stillness excluding intentional holds, repetition, slow entrances, competing effects, camera drift, text size, contrast, clipping, crowding, weak matched seams and potentially unclear progression. It provides no universal quality score.

Font checks share actual renderer fit formulas. Geometry/contrast findings are labeled heuristics: boxes do not prove painted-pixel overlap; transparency, complex surfaces and intentional internal clipping need frame review. Independent moving playback, listening and creative preference remain required.


### Storage and rollback

Schema 8 only adds `planning_timing`; existing tables are preserved. Timing JSON/WAV files are immutable and hash-bound, with SQLite owning their index. Failure cleanup removes only this attempt's files. Crash-orphaned files remain available for recovery.

The local pre-upgrade backup is `.data/motion-graphics-pre-schema8-1792761425224/studio.sqlite` (schema 7; integrity check passed). Existing immutable video files were not rewritten. Before rollback, stop the app, preserve current data, and restore matching prior source/database/media to separate paths. Old code rejects schema 8; do not mix schema versions on one database or destructively downgrade it.

## Advanced motion contracts

### M1 source-bound numeric display

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

### M2 coordinated typography

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

### M3 semantic UI

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

### M4 original character rig

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

### M5 — Curated semantic morphs

Six original CC0 schematic pairs use hash-bound references: question-answer, document-checklist, complaints-problem, problem-product, blocks-chart and manual-automated, all version1. The existing message-record@1 pair and morph-shape@1 semantics stay unchanged. New morph-chain@1 supports up to four registered pairs only when intermediate outline and marks match exactly. Its outline part has explicit morphStage0..N; morph-chain-step@1 advances one consecutive step in18..90 frames. Independent path targets prevent competing MorphSVG state during backward seeking. Marks fade before the silhouette changes and return at the target. These are schematic concepts, not real records or measured results.

### M6 — Editable local collage

editorial-collage@1 binds desk-editorial@1 and five separate photo/paper/texture/vector/type parts. Crop, normal blend, assets and source identity are immutable; part transforms and masks remain editable. Raster manifests bind exact bytes, dimensions, alpha, MIME, provenance and rights fields. Fictional photo is generated output; no third-party stock license is asserted. Vector and grain are original CC0. No arbitrary URLs, imports or animation. Verified PNG structure and actual decode precede readiness; missing/corrupt media fails closed.

### M7 — Constrained perspective camera

perspective-scene@1 binds original support-depth@1 artwork and projection metadata. Three planes(z300,0,-450), focalLength900, center500/500 and nearPlane300 use bounded cameraX/Y/Z on a visible fixed camera part. Five18..90-frame presets: depth-push, parallax-pan, depth-reveal, perspective-reframe and depth-handoff, all version1. One token lifts clear, crosses depth and enters processing. Far-to-near occlusion, directly projected geometry and an alpha viewport preserve exact seeking under root scaling. Technical connectors and small labels are excluded. Existing2D camera/depth effects stay unchanged.

Validation rejects changed identities, near-plane escapes, unsafe focal clipping/occlusion and duplicate handoffs. Root motion composes with the projection.

### M8 — Real variable-font expression

`variable-type@1` binds one immutable authored expression with actual font hashes, axes, glyph outlines and measured advances/ink bounds at121 evaluated axis states. Five entries demonstrate Inter weight/optical size and OFL Roboto Flex genuine width compression, hierarchy and staggered character combinations. The single glyphs part has explicit axisProgress0/1; font-expression@1 owns the trajectory for18..90 frames. Unsupported labels/axes/parameters, changed references, conflicting text effects, masks during expression and stale endpoint identities reject. Each complete envelope is reserved; two authored lines remain stable. New copy requires a reviewed atlas entry. Legacy fixed-weight headings remain unchanged.

The offline generator is scripts/build-variable-type.py (fontTools/brotli authoring only); runtime verifies actual font bytes and FontFace decode, then renders deterministic measured paths with no automatic optical sizing. Stable compiler actor IDs preserve mask identity across hard-cut returns.
