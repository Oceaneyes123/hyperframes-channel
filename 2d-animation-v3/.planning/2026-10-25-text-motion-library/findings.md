# Findings
- V3 is active studio; Remotion owns frame time, GSAP interprets declarative actions.
- VisualText renders a single SVG text element. Existing text actors support geometry/opacity but no text-specific treatment.
- Existing kinetic-phrase@1 is a compound component; preserve its behavior.
- No .codegraph directory in root or V3. CodeGraph skipped.
- Preserve existing graphic-pack and project changes. New text-motion module avoids those edits.

## Primary research (2026-10-25)
- GSAP SplitText: https://gsap.com/docs/v3/Plugins/SplitText/ documents character/word/line splitting, staggers, masks and accessible labels.
- Adobe text animators: https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html documents selectors, tracking, opacity and scale. Original older Adobe URL timed out; resolved current page through search.
- Remotion frame determinism: https://www.remotion.dev/docs/flickering requires frame-derived visuals independent of render order.
- Chosen implementation: additive strict shot.textMotions, reusable SVG inner treatment, frame math beneath existing GSAP actor motion. No DOM mutation, plugin installation or dependency.
- The first interrupted integration patch did not apply; new library files survived. Resumed from actual git diff.
