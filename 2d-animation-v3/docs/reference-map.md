# V3 reference map

Start with `AGENTS.md`, [status](STATUS.md), [architecture](architecture.md) and [quality bar](quality-bar.md); new briefs use [prompt](../PROMPT_TEMPLATE.md). Then load only the current stage and required contract sections.

## Stage owners

| Task | Guide | Required detail when applicable |
| --- | --- | --- |
| Research/script/revision | [Writing](researched-writing.md) | Actual installed skills; [beat sheets](beat-sheet.md) for planning metadata |
| Narration/recovery/import | [CLI §2](workflow-efficiency.md#2-audition-once-then-generate-measured-narration) | Exact [audio record](../../2d-animation/channel/AUDIO_VERSIONS.md), [alignment/mixing](local-alignment-and-audio.md); [adapter evaluation](narration-evaluation.md) only for setup/comparison |
| Concepts/storyboards/imports | [Animation planning](animation-workflow.md#plan-and-accept-artwork) | Selected [graphics contract](graphics-reference.md) |
| Motion authoring/revision | [Motion workflow](animation-workflow.md#review-motion) | Selected [text/kinetic](text-motion-reference.md) or [component contract](component-reference.md) |
| Critique/accepted examples | [Visual iteration](visual-iteration.md) | Selected source/review evidence |
| CQ/detectors/corrections | [Creative quality](creative-quality.md) | Applicable [generated rules](AI-CREATIVE-MISTAKES.md), never hand-edited |
| Review/export | [CLI §4–5](workflow-efficiency.md#4-record-production-review-together) | [Production limits](animation-workflow.md#narration-and-production-safeguards), exact binding/verification |
| Setup/storage/recovery | [README](../README.md) | [Persistence contract](persistence-reference.md) only for database/revision/concurrency/recovery work |

## Capability lookup

- [Graphics](graphics-reference.md): schema, vector imports, graphs, gallery, complaint-workflow.
- [Text/kinetic](text-motion-reference.md): ten treatments, measured fonts/anchors, handoffs, comparisons, 2D depth, single morph.
- [Components](component-reference.md): edge draw/trace, numeric display, layout morph, UI, character rig, morph chains, collage, perspective, variable type.

## Context boundaries

- Quality bar owns creative defaults; stage guides own procedure; capability references own fields/limits; schemas/registries own validation. Load linked constraints needed to execute the stage, never every capability.
- Injected style bible/art-director guidance deliberately remains self-contained: runtime cannot follow Markdown links.
- Preserve exact IDs, hashes, examples, numeric limits, exceptions and approval scope. Guidance cannot activate CQ rules or approve work; resolve historical conflicts against current policy/source without weakening checks.
- Do not preload verification history, `docs/archive/`, phase-0, writing evaluations, planning logs or project evidence. Read [verification](reference-verification.md)/[motion experiment](motion-principles.md) only for requested evidence; never recursively follow history.
- Reference organization changes neither media, gates, registry hashes, providers nor production authorization.
