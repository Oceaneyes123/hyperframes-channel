# HyperFrames Narrated Explainers

Use the relevant HyperFrames skill before changing a composition.

For narrated multi-scene explainers, lock narration and timing before building frames:

1. Approve storyboard and script.
2. Generate the final continuous narration track.
3. Derive one canonical scene timing table; each scene maps to its narration beat.
4. Build frames against those timings and mount narration as one audio track from `0`.
5. Run runtime checks and midpoint snapshots early; mark only visually confirmed intentional overlaps with the narrowest `data-layout-allow-*` attribute.

Do not create per-line audio metadata incompatible with the assembler's expected contract. Inspect only the failing selector or relevant file section; avoid broad HTML or skill dumps.
