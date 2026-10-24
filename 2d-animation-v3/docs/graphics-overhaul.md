# Graphics overhaul implementation

The continuation extends the original layered workflow into reusable vector artwork, semantic diagrams, scene backgrounds, art direction and Studio graphic review. It preserves existing saved projects, component versions, scoped revisions and human production gates.

## What is connected

- **Versioned assets:** nine original editorial object icons plus a layered research interface, alongside the original immutable `complaint-workflow@1`. Metadata records purpose, source, license, attribution, dimensions, composition compatibility, named layers and content hashes.
- **Safe import/build:** strict vector JSON supports bounded groups, multiple palette fills/strokes, local gradients/patterns, clipping, opacity and multiply blending. The renderer never accepts executable SVG, React, scripts, external URLs or arbitrary attributes. The CLI validates, hashes and installs new versions under an exclusive lock without overwriting existing versions.
- **Semantic diagrams:** directed branches, networks, feedback edges and acyclic parent groups are validated separately from presentation. Stable breadth-first ranks and orthogonal routing preserve supplied edges. Original editorial icons represent people, devices, documents, messages, processors, databases, cloud services, payment objects and products. Node emphasis is explicit. Vertical labels sit beside nodes; feedback routes use the opposite side.
- **Backgrounds:** soft-gradient, geometric, technical-grid, atmospheric, editorial and environment families use deterministic SVG. Subtle depth is derived from frame time; there is no random animation or remote media.
- **Art direction:** eight composition families and a validated per-shot design record cover meaning, metaphor, focal point, layout, density and intentional continuity. The actual visual generator loads the [Visual Art Director skill](../skills/visual-art-director/SKILL.md), current registry and previous scene history.
- **Graphic review:** `graphic-quality@1` reports schema/asset/graph defects, small or overlapping text, solid-color contrast, density, potentially displaced layers, diagram crowding and unintended repetition. These are technical checks and heuristics, not an aesthetic grade.
- **Image review:** the existing gateway receives actual 360×640 start/end renders, source-bound context and deterministic findings. Strict suggestions reference only the requested shot. Reports record source, engine and image hashes; stale/cancelled reviews do not promote anything.
- **Studio:** inspect art direction, asset licenses/hashes/layers, semantic connections, contact sheets, prior/proposed artwork and image-review suggestions. Use a suggestion to fill the existing scoped-revision instruction or dismiss it locally. Revised artwork remains a new immutable proposal requiring existing storyboard acceptance.

The diagram renderer keeps internal geometry fixed during motion so nodes cannot detach from their connectors. Use `mask-reveal@1` for progressive node/edge disclosure and move/scale the whole diagram root when needed. Geometric presets such as snap-overshoot are rejected on diagram parts. Graph changes require replacement actors. Other vector assets retain independently animated part geometry, color, opacity and masks.

## Review artifacts

- [Upgraded narrated benchmark](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/after.mp4)
- [Primitive control with identical narration](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/before.mp4)
- [Final renderer verification](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/verification.json) and [decoded audio equality](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/audio-verification.json)

- [Eight composition references](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/composition-contact.png)
- [Studio review screenshot](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/studio-review-full.png)
- [Mounted backward-seek evidence](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/mounted-seek.json)
- [Live image review](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/live-image-review.json)
- [Live scoped-revision evidence](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/continuation/live-revision-verification.json)

## Eight reference compositions

The benchmark fixture `tests/fixtures/graphics-gallery.ts` covers editorial illustration, technical cutaway, illustrated workflow, interface demonstration, visual comparison, data storytelling, visual metaphor and typography. It shares the versioned ink, paper, mint and coral palette while varying placement, density, recognizable objects and visual mechanisms.

The examples explain complaint research for a candidate software tool. They are synthetic illustrations, not captured Reddit UI, actual customers or evidence of demand. The three-complaint example explicitly leads to one hypothesis, not three customers.

## Use the implementation

Start V3 normally. Accept a script, generate concepts and choose a direction. Newly directed storyboards may include `shot.design`, `frame.environment`, a `graphic-asset@2` reference or a `semantic-diagram@1` graph. Legacy frames do not require new fields.

Open **Graphic design review** on a shot to inspect its design, assets, findings and previous artwork. **Review rendered shot** creates real phone-size frames and requests advisory visual feedback. **Use for shot revision** fills the direction; it does not immediately call a model or accept changes. Review that direction and use the existing **Revise shot** button. Review the resulting proposal before accepting the storyboard. Model review and storyboard acceptance do not substitute for motion acceptance or Gate 1/Gate 2.

The image-review report and PNGs are saved under the configured data directory's `graphic-reviews/<uuid>/`. Suggestions displayed in the browser are session-local; dismissing one does not delete the immutable report. A single review per project can run in one server process, with a 180-second deadline and cancellation. Multi-process coordination is outside this local, loopback-only deployment.

## Import reviewed vector artwork

Use the structure in `workflow/graphic-pack.json` as a reference. Supply an individual asset document, not a full registry entry:

```powershell
node scripts/import-graphic-asset.ts --check artwork.json
node scripts/import-graphic-asset.ts --install artwork.json
```

`--check` performs no installation. `--install` updates the curated source pack; rebuild and run checks before using it in production. Imports are limited to 200KB, bounded nodes/groups, supported licenses and palette roles. Paths are limited to SVG path commands and numbers. Source and attribution strings are metadata only and are never loaded as URLs. A crash can leave an import lock for manual recovery; verify that no importer is running before removing it. Imported assets still need rendered human review.

Do not edit registered artwork under an existing ID. Publish a new version and hash. Raw SVG/XML import is intentionally unsupported; convert it into the validated vector document outside the runtime. Licensing metadata is a required declaration, not automated verification of third-party rights.

## Compatibility and verification

Visual schema 1 remains unchanged for legacy content. Schema 2 admits registered artwork, diagrams, environments and design metadata without a database migration. Motion hydration derives asset/graph identity and part states from the storyboard. Validation checks exact endpoint and graph correspondence. The production engine binding includes the vector pack, registry, schemas, shared renderers and inspectors, so changed dependencies stale existing production bindings rather than silently reusing approval. Existing exported media is unchanged.

```powershell
npm run build
npm run check
node scripts/verify-graphics-overhaul.mjs
node --env-file-if-exists=.env scripts/verify-graphics-studio.ts .data/new-isolated-proof --live
```

Run build and check sequentially because Next rebuilds generated route types. The main check passes all 97 tests, including frozen legacy compiled-output fixtures. The build passes with existing broad dynamic-file tracing warnings; lint retains one unrelated existing warning.

The final benchmark contains 1,466 frames (48.87 seconds) and seven exact fresh-seek comparisons. Both exports fully decode; decoded PCM narration hashes match exactly. The full benchmark uses offline Microsoft Zira narration, exact measured per-line durations and the same script/WAV for the primitive control and upgraded graphics. It renders every frame, compares independent fresh seeks against those frames, exports both H.264 versions at 1080×1920/30 fps and decodes each complete output. This benchmark is separate from production project/gate state. Voice choice is for the benchmark, not a change to the channel's production voice.

The live probe used an isolated database, real configured model calls and actual rendered images. A real finding exposed connector/label collisions and drove the shared renderer correction. A later oversized design field was safely rejected; explicit prompt limits and retry produced an unaccepted scoped revision while preserving the other seven shots and original acceptance identity. A mounted Studio player also repeated actor states correctly after backward seeking.

## Review boundaries

Human blind preference, continuous video/audio review and production approval remain human decisions. Live image review suggested enlarging the sample system diagram; optical strokes and labels were subsequently enlarged. No final human aesthetic approval is inferred. Preset repetition warnings are retained as creative review suggestions. No numerical score or passing test is presented as proof of professional design quality.

No real saved project was rewritten, published or automatically approved. No commits or pushes were made during this continuation. Synthetic test acceptance is explicitly labeled and confined to isolated storage.
