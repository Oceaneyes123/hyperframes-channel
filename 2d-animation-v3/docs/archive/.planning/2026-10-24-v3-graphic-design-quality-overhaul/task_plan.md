# V3 Graphic Design Quality Overhaul

## Goal
Continue the remaining graphics overhaul after the user approved the first slice and explicitly authorized the remaining implementation. Preserve legacy artifacts, approvals, source integrity and unrelated changes.

## Next Step
Implementation and technical verification are complete. Review the frozen upgraded/control videos and eight-frame gallery. Human blind preference, continuous audio/video review and production gates remain human decisions.

## Continuation Milestones
- [x] Versioned design language, eight composition references, safe vector import and curated object pack.
- [x] Semantic diagram layout, illustrated objects, layered backgrounds and motion correspondence.
- [x] Visual Art Director skill and validated per-scene design history.
- [x] Graphic-quality inspector, rendered review suggestions, contact sheets and targeted revision.
- [x] Studio asset/design review, before/after comparison and existing explicit acceptance.
- [x] Complete representative benchmark and legacy/fresh/backward-seek proof; required checks/build.

## Completed Slice
- [x] Freeze four existing scene frames from two projects, with exact source JSON and hashes.
- [x] Document a focused visual language and original layered workflow composition.
- [x] Add a reviewed local asset with ID, version, source hash, CC0 metadata, dimensions, layer names and bounded customization.
- [x] Validate new asset references and preserve strict legacy schema 1; persist graphics as schema 2.
- [x] Connect existing Studio planning renderer, motion hydration, part targets, GSAP masks and production engine dependencies.
- [x] Render one synthetic workflow, compare Studio/motion frames, verify fresh out-of-order seeks and export decoding.
- [x] Run project checks and production build; document usage, evidence and remaining limits.

## Earlier Scope Decision
The user chose the first slice, not the complete eight-phase overhaul. Full composition catalog, general asset import, diagram engine, broader illustration/icon packs, Visual Art Director skill, graphic-quality inspector, expanded Studio review and a complete narrated benchmark are now authorized implementation scope. Human production gates and final aesthetic review remain human decisions.

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

- Live image review found connector/label collisions. Moved vertical graph labels beside nodes, routed feedback edges on the opposite side, and added bounded focal-node emphasis. Interrupted the owned benchmark process and preserved its diagnostic output before rerendering.
- Build caught a TypeScript-only fixture transition union error in the new Studio probe. Replaced mutation with a mapped output object.
- Detected Windows locale decoding damaged punctuation in edited source files; restored those lines from reversible UTF-8 decoding and now explicitly read UTF-8.
- Second live revision was safely rejected because design.continuityReason exceeded 300 characters; original board and acceptance remained intact. Added the actual design field limits to generation context before an explicit retry.
- Final checks exposed isolated engine-hash tests missing the newly bound planning renderer under app/. Updated both copy fixtures to include app source; no runtime behavior changed.
- Motion audit found per-node geometry edits could detach static diagram connectors. Added explicit fixed-layer geometry validation and a regression test; full-root movement and part reveals remain supported. Interrupted the owned proof for a fresh final-engine run. Shortened the comparison label to meet the existing text-size threshold.
- Regression test caught snap-overshoot implicitly scaling diagram parts. Diagram gallery now uses the existing mask-reveal preset; model context explicitly disallows geometric part presets. A concurrent build briefly removed generated Next route types during checks; run build and check sequentially.
- Real image review also identified fine diagram strokes and small labels. Increased diagram optical stroke weight and label size. New environment-based planning frames now use the same Arial font as motion; legacy frames retain their prior font. Updated graphic text checks to the existing 56px motion threshold. Preserved interrupted proof output and started final renderer verification on this source.
- Concurrent proof/image-review bundles exposed a shared Webpack cache deserialization warning. New graphic-review/proof bundles disable persistent Webpack cache; no source or saved project data is deleted.
