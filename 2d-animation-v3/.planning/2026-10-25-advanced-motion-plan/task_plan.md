# Advanced motion implementation
## Goal
Implement the supplied M0-M10 roadmap sequentially, preserving existing artifacts and the current Remotion/GSAP pipeline.
## Status
- [complete with recorded historical-renderer limitation] M0: freeze baseline, reproducible current-engine source and synthetic compatibility proof.
- [complete] M1: rolling numeric values.
- [complete] M2: kinetic layout.
- [complete] M3: semantic UI states.
- [complete] M4: character rig.
- [complete] M5: six new morph pairs and chains.
- [complete] M6: local raster collage.
- [complete] M7: perspective camera.
- [in_progress] M8: variable typography.
- [pending] M9: full Director/Studio audit.
- [pending] M10: narrated candidate comparison and exact human review.
## Boundaries
User authorized sequential implementation on 2026-10-25. Local synthetic proofs allowed. No commits/pushes/worktrees/subagents; no production artifact/approval mutations. Real candidate uses ordinary gates. Use docs/ADVANCED-MOTION-IMPLEMENTATION-PLAN.md for acceptance criteria.
## Next step
Implement M8 real variable typography. M1–M7 complete; exact checks unchanged.
- User confirmed byte-exact checks must stay. Investigation isolated identical DOM with differing fresh raster output; curated Inter numeric outlines now pass the rolling-cost case's 120 frames/eight exact fresh seeks. Complete remaining numeric proofs and export before advancing.
## Errors and limits
- Historical render engine hash cannot be matched to four available commits using LF/CRLF candidates. Preserve original encoded benchmark and exact current source separately; do not claim its historical engine has been recovered.
- Initial large source read truncated. Subsequent reads bounded by file and purpose.
- Windows rg did not expand tests/*.test.ts; use rg with -g on the tests directory instead.
- M1 rendering failed fresh-vs-sequential seek119 for all three numeric fixtures. Investigating numeric strip SVG transforms; do not accept M1 or proceed to M2 until fixed.
- M1 seek mismatch diagnosed as fractional SVG rounding (15 pixels differed by one RGB level), not missing runtime output. Whole-pixel numeric rows replace fractional geometry; pending proof.
- M1 integer-row change did not resolve fresh seek mismatch. Alternative: use explicit SVG transform attributes instead of the CSSPlugin SVG matrix path for digit strips. Mounted endpoints and backward SVG state already pass.
- Explicit SVG attributes still did not satisfy byte-identical PNG checks. Third approach removes long offscreen glyph strips: evaluate the registered action at the Remotion frame (as existing text effects do), use GSAP easing, and render only the two visible rows. No alternate clock or live timeline state.
- Third M1 approach (two visible rows evaluated from the Remotion frame with GSAP easing) still differs in 19 pixels at final fresh seek, maximum one RGB level. Exact displayed values and mounted backward state pass. Per skill three-strike protocol, user acceptance-rule question is pending. Do not advance M2 or silently relax proof.
