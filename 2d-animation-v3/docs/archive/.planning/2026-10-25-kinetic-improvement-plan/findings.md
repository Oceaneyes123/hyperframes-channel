# Findings
- docs/KINETIC-IDEA.md is the only untracked input at task start; tracked working tree is clean.
- Root and V3 have no .codegraph directory; use direct source inspection.
- The document audits an older published master and says the text library is absent. The current local checkout includes the library from the preceding task; no push is needed for this analysis.
- Treat proposed style/trend benefits as design hypotheses, not measured quality or engagement gains.

## Baseline verified
- Current HEAD fd38914 includes the 10 text presets and /text-motion gallery; Stage 1 of the idea document is already implemented.
- Text treatments remain single-line with heuristic font fitting and shot-local timing, not measured narration anchors.
- layoutDiagram generates stable routed SVG edge paths; this is a reusable path source, not a need for model-authored arbitrary SVG.
- GSAP DrawSVG/MotionPath/MorphSVG/Flip/SplitText/ScrambleText files are installed locally. File presence does not mean registration, runtime support or license review is complete.
- Production engine hashing already covers typography, diagrams and rendering modules. Preserve old semantics by versioning additions.

## Research decisions
- Official DrawSVG and MotionPath docs support stroke disclosure and movement along SVG paths. Prefer normalized stroke progress and an edge-ID route over a freeform path language for the first slice.
- Flip documents capturing live DOM state, changing layout, then animating from that state. This is not automatically suitable for frame-independent export; use fixed approved snapshots first.
- Remotion font guidance recommends a shared loading module and waiting for fonts before measurement/render. Font reliability precedes complex type reflow.
- Native/library technique availability does not bypass strict model JSON or prove human aesthetic improvement.

## Additional verified gaps and reuse
- Compound components already include inbox-panel@1, approval-flow@1, api-flow@1, cost-chart@1, kinetic-phrase@1 and complaint-workflow@1; do not replace them with a parallel UI component framework.
- Existing diagram masks clip in the X direction, not by distance along a routed edge. True stroke drawing and edge-bound signal motion are missing.
- Fonts currently use Arial/monospace with character-count fitting. No approved font profile or measured text layout contract is present in the text renderer.
- Art direction already separates eight composition families; background.depth currently shifts decorative background geometry, not true foreground/midground/background parallax.
- cost-chart@1 has two bounded nonnegative integer values; values/labels are fixed for matched actors. Rolling values and financial semantics need a dedicated source-bound contract.
- Basic kinetic layout can start with separately approved word actors using existing position/scale motion; paragraph reflow and dynamic label mutation are a different capability.
- resolveBeatTiming resolves anchored beats, but textMotions has no narrationAnchor field.

## Errors
- One targeted search named nonexistent tests/motion-components.test.ts. Actual component coverage is tests/components.test.ts and fixtures/motion-components.ts; located via rg --files.
