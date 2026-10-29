# Text motion library

Ten reusable treatments for V3, researched and implemented October 25, 2026.
Open **Text motion library** from the Projects page, or visit
`http://127.0.0.1:3003/text-motion` after `npm run dev` from `2d-animation-v3`.
The interactive gallery uses the same `VisualText` renderer as production.
It starts paused; select a treatment, edit the sample and play or scrub.

## Research and selection

[GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) demonstrates word,
character and line splitting, masks and staggered entrances. Its accessible
label pattern informed our unsplit accessible label around decorative segments.
[Adobe text animators](https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation/animating-text.html)
document selection ranges and animated position, opacity, spacing and scale.
[Remotion's rendering guidance](https://www.remotion.dev/docs/flickering)
requires visuals to depend on frame time and remain independent of render order.

These sources establish the available techniques. The selection, timing ranges,
motion curves and implementations below are our design choices, not measured
engagement improvements or copied commercial templates. They need no new package,
font download, paid template or plugin. No third-party animation code was copied.

## The ten treatments

Recommended ranges assume 30fps. The same `startFrame`/`endFrame` interval includes
the entire stagger; later letters never extend beyond the declared end.

| Preset ID | Visible behavior | Use it for | Suggested duration | Avoid |
|---|---|---|---|---|
| `mask-rise@1` | Phrase rises through a fixed baseline mask and settles | Opening titles, new concepts | 18–30 frames | Multiple simultaneous headings |
| `word-stagger@1` | Words rise and fade in reading order, preserving spaces | Short explanations, ordered phrases | 24–42 frames | Paragraphs or claimed word-level audio sync |
| `character-rise@1` | Graphemes rise with a bounded stagger | Names, acronyms, short labels | 24–36 frames | Long text or connected scripts |
| `typewriter@1` | Successive complete graphemes appear; layout stays fixed | Commands, prompts, input | 24–60 frames | Revealing a number digit by digit as if it were a live measurement |
| `wipe-reveal@1` | A left-to-right mask uncovers stationary text | Discovery, disclosure, a revealed answer | 18–30 frames | Right-to-left reading or long copy |
| `tracking-settle@1` | Tight spacing opens to normal while opacity resolves | A short editorial heading | 18–30 frames | Connected scripts; wide outward expansion |
| `blur-resolve@1` | Brief soft blur resolves to crisp, stationary text | Uncertainty becoming clarity | 18–30 frames | Small captions, repeated focus effects |
| `pop-settle@1` | Scale rises from 0.82 to 1.04, then settles at 1 | One important keyword or reveal | 12–24 frames | Every word, body copy, large camera movement |
| `highlight-sweep@1` | Translucent highlight grows behind readable text | A phrase already on screen | 18–30 frames | Long decorative sweeps or low contrast |
| `underline-draw@1` | A single underline extends beneath stationary text | A takeaway, rule or key term | 15–24 frames | Every caption or implied hyperlink |

Use one focal treatment per beat. Use movement to introduce, disclose or emphasize
information, then let the viewer read it. Keep secondary labels still. Do not add
copy solely to justify an effect. A fully static label is still appropriate when
the visual explanation elsewhere is already moving.

## Apply to upcoming videos

The motion planner receives the library automatically in `server/motion.ts`.
It may return an optional `textMotions` array for each full or scoped shot proposal:

```json
{
  "textMotions": [
    {
      "targetId": "object-1",
      "presetId": "word-stagger@1",
      "startFrame": 6,
      "endFrame": 36
    }
  ]
}
```

This is a field within an otherwise complete motion shot, not a standalone plan.
`object-1` must already map to an approved nonempty root text, centered-text,
heading, caption or code actor. It does not rewrite the storyboard or its text.
For a scoped revision, omit `textMotions` to retain prior treatments or return `[]`
to remove them. Example direction: “Use a masked rise for the heading, underline
the takeaway, and keep supporting labels still.” Proposals still need acceptance.

Intervals use shot-local 30fps frames. They are estimated visual timing, not
measured narration anchors. When precise audio alignment matters, set the interval
from actual measured timing and review the moving preview with narration.
Hidden entrants must complete their root entrance before a treatment starts.
The validator rejects unknown presets, extra fields, missing/nontext or duplicate
targets, intervals under six frames, competing root motion, reading-hold overlaps
and continuous anchor restarts. Finish at least 12 frames before the last visible
frame; use an explicit reading hold of at least 15 frames where appropriate.

Continuous actors keep their first treatment and its settled appearance across
the boundary; they do not replay on the next shot. Historical plans without this
field keep their existing rendering path. The engine fingerprint includes both
new modules, so existing production bindings require the normal revalidation.
No saved production project is migrated or rewritten.

## Runtime and limits

`workflow/text-motion.ts` owns the versioned registry and strict JSON contract.
`engine/text-motion.tsx` implements the SVG treatments. Remotion owns frame time;
the outer actor/camera still uses the existing GSAP adapter. Inner text uses pure
frame calculations without timers, random values, DOM splitting or stateful
tweens, so fresh and backward seeks can produce the same image.

This version supports short, single-line labels. Existing V3 font-size heuristics
remain in use; this is not a paragraph layout engine. Centered text retains its
alignment. Grapheme splitting preserves emoji and combining marks, but individual
segments may change kerning or connected-script shaping. Prefer whole-label
treatments for those scripts; tracking and left-to-right wipes need manual review.
Highlight and underline span the authored text box. Masks, blur and a 4% scale
overshoot need safe margins. Review actual fonts, contrast and readability at phone
size. The gallery starts paused and never autoplays; exported videos have fixed
motion and do not respond to operating-system reduced-motion preferences.

## Verification

Run from `2d-animation-v3`:

```powershell
node --test tests/text-motion.test.ts
npm run check
npm run build
node scripts/verify-text-motion.mjs
```

The proof script uses isolated synthetic text, renders all 900 frames at half
resolution, then compares 40 fresh stills against those frames. It writes frames,
a contact sheet and an engine-hash-bound `verification.json` under a new
`.data/text-motion-proof-*` directory. It does not synthesize narration, render a
production video or record human aesthetic/audio approval.
