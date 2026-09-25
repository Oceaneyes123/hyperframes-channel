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

## Canvas and composition

Use native 1080×1920 portrait. Keep essential objects, values and actions
inside `x=72..936`, `y=180..1600`; let light and nonessential art bleed to the
edges. Use the whole canvas as the stage. Do not reserve a permanent title band
or put each scene in a decorative card. Boundaries are for real subnets, trust
zones, tables or policy groups.

Compose asymmetrically and anchor objects to meaningful edges. Let one primary
device own the frame; size its visible artwork to 320–420px when space allows
(240px minimum). Maximize the diagram inside the safe rectangle before adding
a headline. Use grid or flex for stable groups; position only moving objects
and route details freely. Leave 24px between labels and objects and 48px between
groups. Measure highlight boxes around the entire value or label.

Use a dark navy base with localized radial light, restrained grain, coordinate
marks and route traces to give the scene depth. Keep these low contrast and
behind the teaching objects. Separate the backdrop, diagram and active packet
by scale, light and layering; decoration never substitutes for an object,
connection or visible result.

## Type and color

Use Geist or Space Grotesk for display copy and IBM Plex Mono for addresses,
ports and protocol values. Bundle custom faces with local `@font-face` assets;
when they are unavailable, inherit the shared channel font token (currently
Barlow) instead of declaring unresolved names. Provide system sans/monospace
fallbacks. Headlines are optional, at most six words, 72–96px with line-height
at least 1.05. Labels are 1–4 words, usually 36px; technical values are usually
40px. Keep visible copy near 16 words and avoid labels competing with the action.

Color carries meaning: blue client, indigo infrastructure, green success,
amber warning, cyan external network, violet storage, and red-orange security.
Use these tokens consistently, including route and state changes. Maintain
contrast against the actual background at phone size.

## Assets

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
