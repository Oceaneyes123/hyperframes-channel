# Isolated GSAP adapter proof

Adapted from the frozen sibling Remotion Film. This separate package adds a
matched camera interval and GSAP implementation; it never modifies the original
benchmark. Dependencies are exact and independently locked. No audio or production
workflow is enabled. See ../../docs/gsap/README.md for results and limitations.

From this directory: `npm ci --ignore-scripts`, then `npm run build` and
`npm run dev` (127.0.0.1:3106). The preview offers native/GSAP selection, seeking,
shot-specific color edits, remount/unmount and resource inspection. Seek timing
includes a two-paint readiness wait. Do not use clipped browser screenshots for
pixel proof: the current backend reflows the document when clipping.

`npm run render -- --run <new-name>` creates a new output directory, rendering
all lossless frames, 40 fresh still checks and eight silent H.264 exports. Set
BENCHMARK_CHROME for a different installed Chrome; default is the normal Windows
Chrome path. ffmpeg/ffprobe must be on PATH. Prior output is never overwritten.
`python inspect.py <name>` needs Pillow/NumPy and compares all 360 frames against
the baseline, enforces bounded intermediate edge differences, and writes a full
transition contact sheet. `node verify-variants.mjs` checks the scoped edit using
lossless native renderer PNGs; its output must not already exist.

The two origins must be explicit: native CSS uses the SVG viewBox origin, and
GSAP needs `svgOrigin: "0 0"`. GSAP rounds intermediate SVG attributes/matrices;
cross-engine settled poses match exactly but some moving edges do not. No
external GSAP plugins are imported. Preserve the Remotion Player license warning;
this experiment does not determine organizational license eligibility.
