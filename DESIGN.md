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
  display: "Barlow, Arial, sans-serif"
  mono: "IBM Plex Mono, ui-monospace, monospace"
  headline_px: "72–96"
  label_px: 36
  value_px: 40
  headline_line_height: ">=1.05"
iconography: {primary_min_px: 240}
spacing: {unit: 24, label_gap: 24, group_gap: 48}
---

# HyperFrames Channel Design System v2

For an approved worked example, see `channel/EXPLAINER_REFERENCE.md` and
`videos/local-or-router-short/frame.md`. Use the former's review checklist to
verify these rules in actual frames, not just in planning text.

New channel videos are native 1080×1920 (9:16). Keep important content inside
the safe rectangle `x=72..936`, `y=180..1600`; the right 144px and bottom 320px
leave room for platform controls and captions. Never design landscape and crop.

Each scene teaches one idea: one dominant visual, 2–5 meaningful objects, one
main action, and a few labels. Headlines are optional, at most six words.
Labels are 1–4 words and visible copy should stay near 16 words. Narration does
the explaining; values such as IP addresses, ports, and protocol names may
remain on screen when they are the lesson. Reveal information progressively.
Use 72–96px headlines, 36px labels, and 40px technical values with headline
line-height at least 1.05. Primary icons should be at least 240px where space
allows. The safe zone is a conservative default; platform overlays vary, so
inspect the target platform before publishing.

Use vertical source → process → destination layouts with CSS grid or flexbox.
Absolute positioning is for moving packets or connectors inside those zones,
not for the entire scene. Keep at least 24px between labels and objects and
48px between groups. Avoid collisions and unsafe edges; only document an
intentional overlap after inspecting it.

Semantic color is part of the explanation: blue client, indigo infrastructure,
green success/answer, amber warning or miss, cyan external network, violet
storage, red-orange security. Use local colored SVGs throughout a scene when they clarify the object;
use local Font Awesome SVGs for compact support symbols. Every non-FA asset has
an attribution/source record in `ICON_PLAN.json`.

Target 45–60 seconds across 6–10 scenes. Hook the question or familiar behavior
within 1–2 seconds, then make a meaningful visual change every few seconds.
Longer lessons become a series. Animation must show causality: a packet travels,
a decision highlights, an answer retraces the route, or a cache returns quickly.
All motion is seekable and lives in one paused timeline.

The diagram owns the frame: use most of the safe area for the objects and
their relationships, not a large title above a small illustration. Start with
the situation visible in the first second. For a 6–8s scene, plan roughly
three causal beats: situation → action → consequence. A fade or slide-in is
an entrance, not the explanation. Flag static holds over 3s for human review;
a deliberate reading pause is valid, continuous decorative movement is not
a fix. Use a camera move only when it directs attention to a teaching detail.

Carry object identity, colors, and positions across adjacent scenes. Preserve
the approved sketch's required object counts and connections; never replace
a two-device exchange with one icon and a sentence. Review at phone size,
with sound off, at the opening, main action, and resolved state, then play the
whole sequence to check continuity and narration cues.

Optional captions occupy a reserved band inside the safe area; reflow the
diagram rather than covering values or shrinking labels. Keep captions short
and readable, with no simultaneous duplicate headline. Optional sound cues
mark a real send, receive, or decision event and remain quieter than speech.
Captions, sound cues, and BGM stay off unless selected in the brief.

Each lesson answers what it is, why it exists, what happens, and what to remember;
the sound-off review must still show the causal change. Decorative layers are
optional and never substitute for the dominant visual.

The workflow remains: facts → script/display copy → timed storyboard → icon plan
→ actual-icon sketches (gate 1) → measured per-scene TTS → frames → checks and
preview (gate 2) → explicit render approval. Keep display text and spoken text
separate; narration normalization produces inspectable TTS-ready text.
