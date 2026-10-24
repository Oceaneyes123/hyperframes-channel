# V3 Graphic Design Quality Overhaul

## Goal
Deliver the user-selected first end-to-end illustrated workflow slice from the supplied graphics roadmap. Preserve legacy artifacts, approvals, source integrity and unrelated changes.

## Next Step
Implementation and technical proof are complete. Human visual review of the frozen comparison and silent animation is available. No gate approval is inferred.

## Completed Slice
- [x] Freeze four existing scene frames from two projects, with exact source JSON and hashes.
- [x] Document a focused visual language and original layered workflow composition.
- [x] Add a reviewed local asset with ID, version, source hash, CC0 metadata, dimensions, layer names and bounded customization.
- [x] Validate new asset references and preserve strict legacy schema 1; persist graphics as schema 2.
- [x] Connect existing Studio planning renderer, motion hydration, part targets, GSAP masks and production engine dependencies.
- [x] Render one synthetic workflow, compare Studio/motion frames, verify fresh out-of-order seeks and export decoding.
- [x] Run project checks and production build; document usage, evidence and remaining limits.

## Deferred Roadmap
The user chose the first slice, not the complete eight-phase overhaul. Full composition catalog, general asset import, diagram engine, broader illustration/icon packs, Visual Art Director skill, graphic-quality inspector, expanded Studio review and a complete narrated benchmark remain future scope.

## Decisions
- No CodeGraph index exists at the root or V3; use targeted source reads.
- Work in the existing workspace. No subagents, commits or pushes.
- Existing server/render.ts change is preserved. Only its production dependency owner was changed.
- Historical board schema 1 and all existing component versions keep their appearance.
- Synthetic proof media is allowed; never infer human production approval.

## Errors Encountered
- Initial plan was initialized at the outer repository before reading the V3 instruction. Reinitialized under V3; remove only the newly created outer planning files.
- First shell invocation returned exit 1 because optional environment variables were absent; no command data was lost.


- Focused tests caught a mechanical replacement inserting an import inside the validation loop. Removed the duplicate import; rerun focused tests.
- Zod rejects pick() on refined motion object schema. Generated mappings now reuse its three field schemas in a strict object.
- First renderer proof failed an overly strict Studio/motion PNG equality check: 112 of 2,073,600 pixels differ from 360 versus 1080 viewBox rasterization. Mean channel error is below 0.000084/255. Use bounded raster tolerance only for Studio comparison; keep fresh motion seek hashes exact.
- Baseline proof passed inputProps only to renderStill while reusing resolved composition props, so baseline images repeated defaults. Resolve each planning composition with its actual inputProps and preserve failed run as diagnostic evidence.
