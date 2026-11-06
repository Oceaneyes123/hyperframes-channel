# Graphics authoring reference

Load only relevant planning/import/illustration sections. Follow [quality bar](quality-bar.md) and [stage workflow](animation-workflow.md). Exact IDs/hashes, source fidelity and supported contracts are mandatory; technical/model review never grants human artifact or production approval.

## Visual planning

Accept current script; generate three concepts, inspect images/teaching approaches and explicitly select one. Generate storyboard; use narration links to inspect shot purpose, framing, subject/action, arrival, continuity and endpoints. **Revise shot N only** creates a scoped proposal; separately accept exact board. Static drawings supplement, never approve, moving playback.

### Implemented boundary

- Drawings are real SVG rendered from strict declarative shapes, never model markup/code/URLs/assets. Concept titles/metaphors must be distinct; pedagogical distinction needs human judgment.
- Every nonblank accepted narration line appears once, ordered. Scoped revisions preserve narration references, other parsed shots byte-for-byte in value, and script. Without reviewed audio, durations are estimates; current planning timing binds measured spans/pauses and rejects changed timing/invalid groups. Stills cannot establish sync.
- Immutable proposals: `<videos-dir>/<project-id>/visuals/<run-id>.json`, SHA-256-indexed in SQLite. Schema 5 adds jobs, immutable concept choices and exact storyboard acceptance while preserving scripts/writing.
- Verify script identity/hash/inherited research currentness at start/completion, choice and acceptance. New proposal/choice/board supersedes its predecessor. Switching choice away/back never revives an old board. History stays readable with stale decisions labeled.
- Reuse loopback matching-Origin JSON/NDJSON and configured gateway. One visual job/project; 300,000 decoded response bytes, separate 4,000,000-byte framed-stream limit, 150-second generation. Interrupted jobs expire after three minutes on next store open. No automatic retry/raw credential/error exposure. Persist submitted instructions in artifacts, not unsent notes.

## Graphic assets, diagrams and review

### What is connected

| Capability | Contract |
| --- | --- |
| Versioned assets | Nine original editorial icons and layered research interface extend immutable `complaint-workflow@1`. Metadata: purpose, source, licence/attribution, dimensions, composition compatibility, named layers, hash. |
| Vector build/import | Bounded groups, palette fills/strokes, local gradients/patterns, clips, opacity, multiply blend. No executable SVG/React/scripts, external URLs or arbitrary attributes. CLI validates/hashes/installs new versions under exclusive lock; never overwrites versions. |
| Semantic diagrams | Directed branches/networks/feedback and acyclic parent groups validated separately from appearance. Stable breadth-first ranks/orthogonal routes preserve supplied edges. Original icons cover people/devices/documents/messages/processors/databases/cloud/payment/products. Explicit emphasis, side labels on vertical layouts, opposite-side feedback routes. |
| Backgrounds | Deterministic SVG: soft-gradient, geometric, technical-grid, atmospheric, editorial, environment. Frame-derived restrained depth, no random animation/remote media. |
| Art direction | Eight families and per-shot design: meaning, metaphor, focal point, layout, density, intentional continuity. Generator loads [Visual Art Director](../skills/visual-art-director/SKILL.md), registry and scene history. |
| `graphic-quality@1` | Schema/asset/graph defects, small/overlapping text, solid-color contrast, density, displaced layers, graph crowding, unintended repetition. Technical checks/heuristics, not aesthetic grades. |
| Image review | Gateway receives actual 360×640 endpoints, source context/findings. Strict suggestions target requested shot; reports bind source/engine/image hashes. Stale/cancelled reviews promote nothing. |
| Studio | Inspect design, licences/hashes/layers, connections, contact sheets, prior/proposed artwork and suggestions. Use suggestions to prefill scoped direction or dismiss locally; every revision remains immutable and needs storyboard acceptance. |

Diagrams keep internal geometry fixed so connectors stay attached. Use `mask-reveal@1` for progressive node/edge disclosure; move/scale the root. Reject geometric presets such as snap-overshoot on diagram parts; graph changes require replacement actors. Other vector parts retain independent geometry/color/opacity/masks.

### Eight reference compositions

`tests/fixtures/graphics-gallery.ts`: editorial illustration, technical cutaway, illustrated workflow, interface demonstration, visual comparison, data storytelling, visual metaphor and typography. Shared versioned ink/paper/mint/coral palette; varied placement, density, recognizable objects and mechanisms.

Complaint research examples are synthetic illustrations, not captured Reddit, customers or demand evidence. Three complaints lead to one hypothesis, never three customers.

### Use the implementation

New directed boards may include `shot.design`, `frame.environment`, `graphic-asset@2`, `semantic-diagram@1`; legacy frames need no new fields.

In **Graphic design review**, inspect direction/assets/findings/prior artwork. **Review rendered shot** creates phone-size frames/advisory feedback. **Use for shot revision** only prefills direction; inspect it, submit **Revise shot**, then review/accept the proposal. Neither model review nor board acceptance replaces motion/Gate 1/2.

PNGs/reports: configured `graphic-reviews/<uuid>/`. Browser suggestions are session-local; dismissing never deletes reports. One review/project/server process, 180-second deadline, cancellation. Multi-process coordination is outside this loopback-only deployment.

### Import reviewed vector artwork

Use `workflow/graphic-pack.json` structure; supply one asset document, not a registry entry:

```powershell
node scripts/import-graphic-asset.ts --check artwork.json
node scripts/import-graphic-asset.ts --install artwork.json
```

`--check` does not install. `--install` updates curated source; rebuild/check before production. Limit: 200KB, bounded nodes/groups, supported licences/palette roles, paths containing SVG commands/numbers only. Source/attribution strings are metadata, never fetched URLs.

Crash locks need manual recovery: verify no importer runs before removing a lock. Rendered human review remains required. Never edit artwork under existing IDs; issue new versions/hashes. Raw SVG/XML import is unsupported; convert externally into validated vector JSON. Licence metadata declares rights, does not verify them.

### Graphics compatibility

Visual schema 1 remains unchanged; schema 2 adds artwork/diagrams/environments/design without DB migration. Motion hydration derives identity/part states from storyboard; validate exact endpoint/graph correspondence. Engine binding covers pack, registry, schemas, renderers and inspectors, staling changed dependencies without altering prior exports.

### Graphic review boundaries

Blind preference, continuous moving/audio review and gates remain human. Live image review suggested larger system-diagram optics/labels; these were enlarged, without inferred final aesthetic approval. Preset repetition stays advisory. Passing scores/tests cannot prove professional quality.

## Editorial visual language

First illustrated-workflow direction, not a universal design system. Executable tokens/metadata: `workflow/graphic-assets.ts`.

### Meaning and composition

Repeated coral work complaints appear in a browser, group under a magnifier, then become a candidate tool on a laptop. It is a validation hypothesis, not evidence of demand, earnings or completed product.

Use the 900×1200 illustration as one root on a 1080×1920 canvas. Diagonal: upper-left browser, middle-right grouping, lower-left laptop. Wash/path/ground add depth without extra storyboard shapes.

Reference x=8%, y=14%, width=84%, height=63%. Preserve 3:4 artwork pixels: percentage-grid `height = width * 0.75`. Keep repeated marks readable at 360×640. This illustration is complaint-specific, not reusable for unrelated speech.

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

Only accent can change through shape/layer colors; other roles stay fixed in this version. Gradients/vector grid/soft silhouettes/small ground shadow provide depth; no random texture, filters, fonts or remote dependencies.

No baked text. Essential labels remain separate editable V3 actors; avoid paragraphs/transcripts. Reference needs no on-canvas copy, font download or decorative motion.

### Named layers and motion

| Layer | Content |
| --- | --- |
| `complaints` | Browser, repeated marked excerpts, cursor |
| `cluster` | Grouped excerpts, magnifier |
| `packet` | Shared pain transferred into candidate tool |
| `opportunity` | Laptop candidate, idea bulb |

Static background. Reveal grouping, carry packet, reveal candidate, hold. Offsets use canvas percentages, including 360-wide preview. Layers support opacity, position, scale, color and reveal masks. Root dimensions stay fixed; scale/replace instead of animating width/height.

### Version and safety

`complaint-workflow@1` is original local CC0 reviewed TSX, selected by exact ID/hash/bounded states. Models never supply SVG/JS/URLs/handlers/markup. Static reference binds normalized source SHA-256; production also binds source/theme/registry/renderer/schemas.

Artwork uses visual schema 2; existing primitives/components keep schema 1. Original artwork stays unchanged. New assets/revisions need new versions/hashes, focused tests and rendered review, never replacement under approved IDs.

### Composition catalog and extended graphics

Theme remains `editorial-workflow@1`. Nine matching icons, layered interface, semantic graphs and six background families extend the original asset without making approved history editable. See [graphics capabilities](#graphic-assets-diagrams-and-review).

## Layered workflow example

### Use in Studio

For an accepted complaint-research script, request:

> Use complaint-workflow@1 to group repeated work complaints into a candidate tool. Keep complaints visible initially. Reveal the cluster, carry one packet into the candidate tool, then hold. Preserve the narration's requirement to validate demand. Use the registered hash and 3:4 illustration proportions.

Generator receives asset metadata/hash/layers; selection is not guaranteed. Review endpoints/accept board, then use beat motion. Hydration copies approved refs/parts; no model artwork replacement/executable SVG or new import/approval UI.

`tests/fixtures/graphic-workflow.ts` provides the complete validated proposal/sequence: one root/four layers, preserving the 16-shape planning limit. Artwork uses schema 2, legacy schema 1, no rewrite/migration.

### Reproduce

From V3 with dependencies, Chrome, FFmpeg and ffprobe:

```powershell
npm run check
npm run build
node scripts/verify-graphic-workflow.mjs
```

Set `V3_CHROME_PATH` if needed. Proof creates new timestamped `.data/graphic-workflow-proof-*`, refusing existing output. Optional first argument is a new output directory with existing parent. Fixed baseline sources must exist or proof fails; frozen copies remain reviewable.

Historical planning/synthetic comparisons cannot establish continuous playback/listening/production approval. Inspect meaning, repeated signals, depth and readable part motion for the actual teaching goal.
