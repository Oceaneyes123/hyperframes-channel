# Graphic workflow â€” first implementation slice

The first slice connects one curated, layered illustration to existing V3 visual planning, immutable proposals, Studio previews, motion hydration, GSAP actors and Remotion rendering. It does not implement the full graphics roadmap.

## Review the result

- [Phone-size before/after](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/artifacts/before-after-phone.png)
- [Six-second silent animation](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/artifacts/synthetic-workflow.mp4)
- [Original project contact sheet](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/artifacts/baseline-contact.png)
- [Machine-readable proof and hashes](../.planning/2026-10-24-v3-graphic-design-quality-overhaul/artifacts/verification.json)
- [Baseline findings](graphics-quality-baseline.md) and [visual language](visual-design-system.md)

The control comparison is synthetic. Frozen baseline frames come from two existing projects. Neither the synthetic scene nor any model output represents human storyboard or production approval.

## Use in Studio

Use an accepted script about complaint research. In the existing visual direction field, request:

> Use complaint-workflow@1 to group repeated work complaints into a candidate tool. Keep complaints visible initially. Reveal the cluster, carry one packet into the candidate tool, then hold. Preserve the narration's requirement to validate demand. Use the registered hash and 3:4 illustration proportions.

The visual generator receives the exact asset metadata, hash and named layers. It still returns a proposal for human review; asset selection is not guaranteed by a prompt. Review the existing start/end frames, accept the storyboard explicitly, then use beat motion. Hydration copies the approved asset reference and part states; the model cannot replace artwork or submit executable SVG. Existing shot revision and acceptance behavior remains in place. No separate import or approval UI was added.

The source fixture `tests/fixtures/graphic-workflow.ts` shows a complete validated proposal and motion sequence. It uses one root shape and four internal layers, leaving the 16-shape planning limit unchanged. Visual artifacts with artwork use schema 2; older artifacts retain schema 1 without rewriting. No database migration is needed.

## Reproduce

From `2d-animation-v3`, with installed dependencies, Chrome, FFmpeg and ffprobe:

```powershell
npm run check
npm run build
node scripts/verify-graphic-workflow.mjs
```

Set `V3_CHROME_PATH` if Chrome is installed elsewhere. The proof writes to a new timestamped `.data/graphic-workflow-proof-*` directory and refuses an existing output directory. Optional first argument supplies a new output directory whose parent exists. The saved baseline paths are intentionally fixed; the proof fails if those source projects are absent. The frozen copies remain available for review.

The proof renders actual Studio frames, 180 sequential motion frames, eight independent fresh renders requested in nonsequential order, and a six-second H.264 export. Seek PNG hashes match sequential references exactly. Studio planning uses a 360-wide SVG viewBox, while motion uses 1080; their settled comparison permits only a small explicit raster tolerance. The frozen run differs in 112 of 2,073,600 pixels, with a mean channel error below 0.000075 on a 0â€“255 scale. Export dimensions, frame count and rate are verified and the complete MP4 is decoded.

This is a technical proof, not continuous playback review, measured narration alignment or approval of aesthetic quality. The fresh-seek check does not claim to exercise backward seeking in a mounted Studio player.

## Verification and boundaries

The full check passes with all 92 tests, including legacy compiled-output fixtures and persistence tests. Focused graphics tests cover the source hash, approved layers, malformed references, markup fields, aspect ratio, unknown targets, source/end correspondence, v1 preservation, v2 persistence and explicit storyboard acceptance. A separate test proves that artwork and registry changes alter production engine dependencies.

Production build passes with nine broad dynamic-file tracing warnings in existing render/storage code. Lint reports one existing unused-variable warning in an unrelated DeepSeek planning script. Existing `server/render.ts`, project artifacts and sibling V1/V2 projects were preserved.

No live model request, real project migration, narration generation, human gate action, publish, commit or push was performed. Adding the new engine dependency changes production bindings; stale gates must be reviewed again under existing rules. Existing exported files remain unchanged.

Deferred: general SVG import/sanitization, a larger curated library, seven additional composition families, the Visual Art Director skill, a separate graphic-quality inspector, diagram layout, expanded Studio inspection and a complete narrated benchmark with human review.
