---
brand: "HyperFrames Channel"
version: "2.0.0"
format: "1080x1920"
safe_zone: {left: 72, right: 144, top: 180, bottom: 320}
colors:
  canvas: "#0B1020"
  surface: "#141D35"
  ink: "#F5F7FF"
  muted: "#AAB5CC"
  rule: "#33415F"
  client: "#4DA3FF"
  infrastructure: "#7067E8"
  success: "#63D69A"
  warning: "#F5B94D"
  external: "#4DD9E8"
  storage: "#B07CFF"
  security: "#F06A5F"
typography:
  display: "Geist, Space Grotesk, system-ui, sans-serif"
  mono: "IBM Plex Mono, ui-monospace, monospace"
  headline_px: "72–96"
  label_px: 36
  value_px: 40
  headline_line_height: ">=1.05"
iconography: {primary_min_px: 240, primary_target_px: "320–420"}
spacing: {unit: 24, label_gap: 24, group_gap: 48}
---

# HyperFrames Channel Design System v2

This file owns palette, typography, iconography, layout and visual hierarchy.
For motion and scene rhythm see `MOTION.md`; for production stages see
`channel/CHANNEL_RECIPE.md`.

For future videos: **The narration explains. The animation demonstrates. Text
only labels what cannot be understood quickly enough visually.** If narration
can say it and animation can show it, do not also write it on screen. Apply this
direction to new videos; existing projects retain their approved design.

## Canvas and composition

Use native 1080×1920 portrait. Keep essential objects, values and actions
inside `x=72..936`, `y=180..1600`; let light and nonessential art bleed to the
edges. Use the entire safe canvas as the visual stage. Do not reserve a fixed
header area or put each scene in a decorative card. No persistent scene or
chapter numbers, `01 / ROUTING` headers, top titles, repeated top bars, static
section labels or decorative navigation UI. Script and storyboard headings are
production metadata, not visible titles. Boundaries are for real subnets, trust
zones, tables or policy groups.

Compose asymmetrically and anchor objects to meaningful edges. Let one primary
device own the frame; size its visible artwork to 320–420px when space allows
(240px minimum). Maximize the teaching objects inside the safe rectangle before adding
text. Use grid or flex for stable groups; position only moving objects
and route details freely. Leave 24px between labels and objects and 48px between
groups. Measure highlight boxes around the entire value or label.

Use a dark navy base with localized radial light, restrained grain, coordinate
marks and route traces to give the scene depth. Keep these low contrast and
behind the teaching objects. Separate the backdrop, teaching objects and active packet
by scale, light and layering; decoration never substitutes for an object,
connection or visible result.

## Type and color

Use Geist or Space Grotesk for display copy and IBM Plex Mono for addresses,
ports and protocol values. Bundle custom faces with local `@font-face` assets;
when they are unavailable, inherit the shared channel font token (currently
Barlow) instead of declaring unresolved names. Provide system sans/monospace
fallbacks. A necessary temporary word or title uses 72–96px with line-height
at least 1.05. Labels are normally 1–3 words, usually 36px; technical values
are usually 40px. Avoid labels competing with the action.

Color carries meaning: blue client, indigo infrastructure, green success,
amber warning, cyan external network, violet storage, and red-orange security.
Use these tokens consistently, including route and state changes. Maintain
contrast against the actual background at phone size.

## Text necessity

Default to no text. Add short labels only to identify an object or state that
the visual cannot make clear quickly enough: DEVICE, ROUTER, DNS, SERVER, VPN,
BLOCKED, ALLOWED, CACHE, REQUEST, RESPONSE or PUBLIC IP. Exact IP addresses,
ports, percentages, prices, benchmark values and protocol names may appear when
the exact value matters. A label must not become a sentence.

Do not add narration summaries, transcript fragments, subtitles, explanatory
cards, bullet lists, paragraphs or narration rewritten as display copy. Longer
text is a last resort for essential exact content, not a way to explain a weak
visual. Record why it cannot be conveyed by motion or a short label.

A title or large word may temporarily participate in the mechanism when it
teaches something. Transform, move or remove it when its purpose ends; never
keep it visible merely because the scene has a name in `SCRIPT.md`. There is
no word allowance to fill. Remove any text whose absence would not reduce
comprehension. `VERIFY.md` owns the text-minimization review at both gates.

## Assets

For new videos, the teaching stage may be an illustrated object performance,
physical metaphor, cutaway, assembly or layered collage as well as a network
diagram. Use coherent local props and articulated artwork when the idea needs
them. Choose one coherent device/prop family before sketch approval; the local
technical artwork or the articulated [flow props](channel/artwork/flow-props.svg)
can supply it. Do not mix incompatible flat and illustrated devices. Preserve
the channel palette, scale, semantic colors and sparse text across treatments.
Show metaphor boundaries where needed so playful staging does not imply a false
technical process. `MOTION.md` owns behavior and personality.

For illustrated depth, use consistent material gradients/light direction,
contact shadows and explicit back-to-front layers. Keep stored content behind
its container's occluding front and a traveling copy on a separate layer.
See the [flow-motion layering example](examples/flow-motion/README.md#object-performances-transitions-and-depth).
`MOTION.md` owns shadow response and parallax timing; depth must preserve
phone-size readability and semantic colors.

Motion-v1 projects bundle Barlow Bold and IBM Plex Mono Bold locally through
`channel/motion.css`. Use `var(--hf-display)` and `var(--hf-mono)`; do not
override them with generic Arial in generated scenes. Keep labels in the safe
rectangle throughout camera movement, not only at the settled pose. Fixed
endpoint labels can live outside the camera wrapper while a detail reframes.

Use one coherent family of colored local technical art for primary devices.
Use compact inline Font Awesome glyphs only for supporting marks. Never use
emoji or small black glyphs in white tiles as teaching objects. Record provider,
source/attribution, role, meaning, color and path for each non-FA asset in
`ICON_PLAN.json`. Resolve assets before sketch approval and never fetch them at
render time.

## Readability

Each frame has one dominant focal point, one secondary focal point and one
idea. Use 2–5 important objects where the subject permits. Start with the
situation already visible. Review at phone size and sound off; the viewer must
be able to identify the objects, their relationship and the visible outcome.
Keep device identity and placement stable across adjacent scenes. The detailed
action, motion and review contracts live in `MOTION.md` and `VERIFY.md`.
