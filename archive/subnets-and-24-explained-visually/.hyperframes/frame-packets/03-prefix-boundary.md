# Frame packet: 03-prefix-boundary

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\subnets-and-24-explained-visually
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\subnets-and-24-explained-visually\frame.md
- RULES_DIR: D:\Project\Javascript\hyperframes-channel\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 3 — What /24 marks · measured 21.385–31.904s
- Narration reference: `SCRIPT.md#Line 3`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: the first 24 bits are the network, the rest are hosts
- Dominant visual: the 32-bit run cut by a vertical divider after bit 24; left side blue "NETWORK 192.168.1", right side mint-outlined "HOST 20"
- Icon assets: none (custom divider, brackets, labels)
- Text shown: `NETWORK` · `HOST` · `192.168.1` · `20` · `/24`
- duration: 10.519s
- status: outline
- transition_in: cut
- src: compositions/frames/03-prefix-boundary.html
- voiceover: "/24 says the first 24 bits describe the network. So the first three octets name the network, and the last octet is left for hosts."
- type: concept
- persuasion: progressive disclosure
- beat: comprehension
- blueprint: compose
- focal: network/host divider
- roles: divided bit strip = foreground subject · field = background · labels and `/24` marker = supporting
- Scene 1 (0.0–2.4s): undivided 32-bit strip fills the upper half; muted bits hold.
- Scene 2 (2.4–5.8s): divider draws after bit 24 and `/24` lands at the seam; svg-path-draw.
- Scene 3 (5.8–8.4s): first 24 bits fill blue while the final eight remain muted; layer-reveal.
- Scene 4 (8.4–10.519s): `NETWORK 192.168.1` and `HOST 20` separate into stacked groups and hold; control-target-sync.
- Beginning state: undivided 32-bit run from scene 2
- Ending state: NETWORK | HOST split with `/24` marker at the divider
- Transition: cut
- Complexity: 1 idea · 1 action · 2 groups + divider

## Selected motion rule: control-target-sync

---
name: control-target-sync
description: The live-sync couple — a scrubbed/typed/picked control drives a second element's property in the SAME beat. Readout tween + target transform tween share one timeline label (continuous scrub), or one threshold state array carries both sides (discrete steps). Makes "change this, watch it change" read as causality.
metadata:
  tags: control, scrub, live-sync, mirror, panel, editor, couple, readout, ui
---

# Control-Target Sync

THE live-editing move: an inspector/editor control is manipulated — a value scrubbed, a field retyped, a dropdown picked — and a **bound second element answers in the same frame**. The button rotates WHILE the rotation value scrubs; icons resize PER KEYSTROKE. The persuasion is causality — one gesture, two surfaces changing together — and this rule is the coupling contract that produces it.

Nearest precedent is [reactive-displacement.md](reactive-displacement.md): that rule also derives two elements' motion from one source, but it is **collision physics** — an entering intruder displaces an exiting victim, once, as a transition, and the victim leaves. This rule is a **live editing mirror**: the control is manipulated repeatedly across several beats, the target answers every time, and both sides hold the stage throughout. The numeric readout rides [counting-dynamic-scale.md](counting-dynamic-scale.md)'s proxy pattern; discrete steps ride [discrete-text-sequence.md](discrete-text-sequence.md)'s threshold pattern — what this rule adds is the law that binds either of them to the target.

## How It Works

An **edit beat** is a set of concurrent tweens at ONE timeline label: `tl.addLabel("edit1", …)`, then the **readout tween** (numeric proxy + `onUpdate` writing `textContent` only) and the **target transform tween** (`rotation` / `x` / `y` / `scale` to the same endpoint), both placed at the label with the same **duration** and **ease**. The two motions are two projections of one gesture — value at 40% ⇒ target at 40%, on every frame, under any seek. That mathematical lockstep reads as "the panel is editing the page," not "two animations happen to overlap."

For **discrete edits** (per-keystroke retypes, dropdown picks, unit snaps) the couple steps instead of glides: a single threshold state array carries BOTH sides — each state holds the readout text AND the target's property value — and one driver applies whichever state is active. Both sides read from the same state object, so they cannot desync.

Chain 2–4 edit beats with short holds between, and end on a **landed** edit — the last value applied and holding, never a tooltip with the dropdown unopened.

## Recipe

```html
<!-- Bipartite by construction: target surface + inspector panel share the frame.
     Every scrubbed readout gets `font-variant-numeric: tabular-nums` and a fixed
     min-width (≥ the longest value) or the panel edge jitters as digits change. -->
<div class="target-surface">
  <div class="target-button" id="target-button">{buttonLabel}</div>
  <div class="preview-row">
    <div class="preview-icon">{iconA}</div>
    …
  </div>
</div>
<div class="panel">
  <div class="field-row">
    <span>Rotation</span><span class="field-value" id="rotation-readout">0°</span>
  </div>
  <div class="field-row">
    <span>Class</span><span class="field-value mono" id="class-readout">text-1xl</span>
  </div>
</div>
```

```js
// ---- Continuous couple: ONE label; both tweens share duration AND ease ----
tl.addLabel("edit1", EDIT1_AT);
const rotState = { v: 0 };
const rotReadout = document.getElementById("rotation-readout");
tl.to(
  rotState,
  {
    v: ROT_TARGET,
    duration: SCRUB_DUR,
    ease: SCRUB_EASE,
    onUpdate: () => {
      rotReadout.textContent = `${Math.round(rotState.v)}°`;
    },
  },
  "edit1",
);
tl.to(
  "#target-button",
  { rotation: ROT_TARGET, duration: SCRUB_DUR, ease: SCRUB_EASE },
  "edit1", // same label — the mirror answers in the same frame
);

// ---- Discrete couple: ONE state array carries BOTH sides ----
const STEPS = [
  { t: 0.0, text: "text-1xl", scale: 1.0 }, // must equal the initial state
  { t: 0.4, text: "text-4xl", scale: 1.9 },
  { t: 1.0, text: "text-xl", scale: 0.85 }, // backspace
  { t: 1.35, text: "text-2xl", scale: 1.3 }, // lands
];
const stepAt = (time) => [...STEPS].reverse().find((s) => time >= s.t) ?? STEPS[0];

tl.addLabel("edit3", EDIT3_AT);
const classReadout = document.getElementById("class-readout");
const stepDriver = { t: 0 };
let lastStep = null;
tl.to(
  stepDriver,
  {
    t: STEPS_TOTAL,
    duration: STEPS_TOTAL,
    ease: "none",
    onUpdate: () => {
      const s = stepAt(stepDriver.t);
      if (s !== lastStep) {
        classReadout.textContent = s.text; // control steps
        gsap.set(".preview-icon", { scale: s.scale }); // target steps — same state object
        lastStep = s;
      }
    },
  },
  "edit3",
);
```

## Variations

- **Dropdown pick → instant conversion (self-conversion)** — the pick converts the panel's own readout in place (`tl.set("#padding-readout", { textContent: "6 px" }, "pick")`); control and target collapse into one element. Compose the dropdown from neighbors: menu pops via [spring-pop-entrance.md](spring-pop-entrance.md), row hover-stepping via [dynamic-content-sequencing.md](dynamic-content-sequencing.md). The conversion must be an INSTANT snap — tweening between unit strings reads as broken, and instantness is the feature being sold.
- **Easing-handle drag → target re-animates (deferred mirror)** — the edit authors a _behavior_, so the mirror is a **replay**, not a concurrent transform: beat 1 drags the handle (handle tween + coords readout), then at a later label the target performs its motion with the newly-authored curve (`tl.fromTo("#toggle-knob", { x: 0 }, { x: KNOB_TRAVEL, duration: REPLAY_DUR, ease: AUTHORED_EASE }, "replay")`), often under a zoom-out ([viewport-change.md](viewport-change.md)). The one sanctioned case where the response is not in the gesture's beat; the replay must still be unmistakably the edited parameter.
- **Read-sync mirror (reverse direction)** — the gesture happens ON the target (hovering swatches, selecting an element) and the PANEL readout is the bound side. Same discrete contract — one state array of `{ t, hoverTarget, readout }` drives both the highlight and the text.
- **Color couple** — the readout counts (`0 → 80`) while the target's `backgroundColor` tweens between two palette stops at the same label. Keep it two fixed stops (GSAP interpolates); never derive per-frame hex strings by hand.

## Values

| token                | range                           | notes                                                                                                                                 |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| SCRUB_DUR            | 0.8–1.6 s                       | the viewer must see BOTH sides move — under ~0.6 s the mirror registers subconsciously at best                                        |
| SCRUB_EASE           | `power1.inOut` / `power2.inOut` | shared verbatim by both tweens. Never `back.out` / `elastic.out` — an overshooting value reads as a broken hinge; the readout is data |
| edit endpoints       | visible but plausible           | −10° tilt, 38 px shift, 1xl → 4xl → 2xl; a 2° rotation doesn't demo anything                                                          |
| HOLD_BETWEEN         | 0.3–0.8 s                       | each landed value gets a breath; below 0.3 s the beats smear into one gesture                                                         |
| BEAT_COUNT           | 2–4                             | one edit is a moment, not a demo; past 4 the shot reads as a settings tour                                                            |
| STEP gaps (discrete) | 0.15–0.5 s                      | keystroke pacing per discrete-text-sequence; first state must equal the on-load state                                                 |
| VALUE_MIN_WIDTH      | ≥ longest value's width         | without it the panel edge jitters as digit counts change                                                                              |

## Critical Constraints

- **One label, one gesture** — readout tween and target tween share position, duration, AND ease; never sequence readout-then-target, and never stagger the target behind the readout even by 0.1 s — a delayed response reads as an animation following an edit, not a bound surface. A mismatched ease desyncs the mirror mid-tween even when endpoints agree.
- **Discrete steps share one state object** — both sides read the same array entry, so desync is impossible by construction; first entry mirrors the initial DOM state.
- **The readout is data** — no overshoot, no bounce on the settle; the target may carry the gesture's ease but lands exactly on the edited value.
- **Co-visibility is load-bearing** — control and target share the frame for every edit beat; a camera move must never crop the mirror out (punch-and-return around the beats, not through them).
- **`tabular-nums` + fixed `min-width`** on every scrubbed readout; `onUpdate` is O(1) — text writes only, discrete drivers guard writes with a last-state check.
- **End on a landed edit** — the final beat resolves with the value applied and holding (or the deferred-mirror replay); never mid-gesture or on an unopened menu.
- **The gesture's actor is a separate rule** — cursor glide, grab-cursor flip, and click feedback come from the cursor rules; this rule owns only the couple.

## See also

`cursor-click-ripple` / `context-sensitive-cursor` (the hand performing the gesture) · `counting-dynamic-scale` (the readout half alone, when there is no bound target) · `discrete-text-sequence` (retypes inside the control field) · `spring-pop-entrance` (dropdowns/chrome around the couple) · `multi-phase-camera` (punch-and-return framing) · `chart-scrub-readout` (the sibling READ direction — a scrub interrogates a chart instead of editing a target).

## Selected motion rule: svg-path-draw

---
name: svg-path-draw
description: Animate SVG paths drawing progressively using stroke-dasharray and stroke-dashoffset.
metadata:
  tags: svg, stroke, draw, path, reveal, icon, vector
---

# SVG Path Draw

Reveals an SVG shape by animating its stroke as if a pen were tracing it. Two stroke properties together: **`stroke-dasharray = <pathLength>`** makes the entire path one dash; **`stroke-dashoffset`** starts at the path length (dash shifted fully out of view → invisible) and tweens to `0` (fully drawn). The length comes from the DOM API `path.getTotalLength()` — measured, never guessed.

Works on anything with a stroke: `<path>`, `<circle>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>`, `<ellipse>`.

## Recipe

```html
<!-- inside a standard scene clip -->
<svg class="logo-mark" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path id="bar-left" d="M 60 40 L 60 160" />
  <path id="bar-right" d="M 140 40 L 140 160" />
  <path id="bar-mid" d="M 60 100 L 140 100" />
</svg>
```

```css
.logo-mark path {
  fill: none; /* outline-only draw — a fill would appear immediately and ruin the reveal */
  stroke: {accentColor};
  stroke-width: 12;
  stroke-linecap: round; /* softer endpoints */
  stroke-linejoin: round;
}
```

```js
// Setup: measure each path and set its dash pattern. Real measured geometry, not a magic number.
document.querySelectorAll(".logo-mark path").forEach((p) => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`;
  p.style.strokeDashoffset = `${len}`;
});

// Stagger draws so the eye reads continuous motion — each segment starts at
// ~70-80% of the previous segment's duration, before it finishes.
tl.to(
  "#bar-left",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#bar-right",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_2_START,
);
tl.to(
  "#bar-mid",
  { strokeDashoffset: 0, duration: FINAL_SEGMENT_DUR, ease: "power2.out" },
  SEG_3_START,
);

// Companion wordmark fades in only after the last stroke settles.
tl.to(
  ".brand-line",
  { opacity: 1, duration: BRAND_FADE_DUR, ease: "power1.out" },
  BRAND_FADE_START,
);
```

## Variations

- **Ring starting at 12 o'clock** — `<circle>` / `<rect>` strokes start at 3 o'clock by default; rotate the element `-90deg` so a progress ring draws from the top:

```html
<circle
  cx="100"
  cy="100"
  r="60"
  id="ring"
  style="transform-origin: 100px 100px; transform: rotate(-90deg)"
/>
```

- **Linear (constant-speed) draw** — `ease: "none"` for a steady-rate "real pen" trace.
- **Draw then fill** — for filled shapes, tween `fillOpacity: 0 → 1` AFTER the stroke completes (requires `fill-opacity: 0` initially and a real `fill` in CSS):

```js
tl.to(
  "#path",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#path",
  { fillOpacity: 1, duration: FILL_FADE_DUR, ease: "power1.out" },
  SEG_1_START + SEGMENT_DRAW_DUR,
);
```

## Values

| token             | range                                   | notes                                                                                              |
| ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SEGMENT_DRAW_DUR  | 0.3–0.8s                                | fast snap vs deliberate pen trace; >~1s feels sluggish for a logo reveal                           |
| FINAL_SEGMENT_DUR | 60–80% of SEGMENT_DRAW_DUR              | proportional to segment length — a short connector at full duration reads slower than its siblings |
| SEG_N_START       | previous start + 70–80% of its duration | reads as continuous motion, not N isolated animations                                              |
| SEG_1_START       | 0–0.4s                                  | a small ~0.2s lead-in lets the viewer settle before motion                                         |
| BRAND_FADE_START  | ≥ last stroke end (+ ~0.2s beat)        | earlier and the wordmark competes with the draw                                                    |
| BRAND_FADE_DUR    | 0.3–0.8s                                | snap (urgent) vs glide (premium)                                                                   |

Ease families are discrete choices: **stroke draws** use `power2.out` (a hand lifting at end of stroke) or `none` for constant speed — never `back.out` / `elastic.out` (pens don't bounce). **Fades** use `power1.out`.

## Critical Constraints

- **`fill: none`** for outline-only draws — otherwise the fill appears immediately.
- **Dasharray/dashoffset = the measured `getTotalLength()`**, set at setup; requires the SVG in the DOM (inline SVG is fine; a loaded `<image>` SVG is not).
- **Complex paths**: if `getTotalLength()` looks wrong, overestimate slightly (`len * 1.05`) — too large is invisible at animation start; too small clips the end.
- **Stagger multi-path draws at ~70–80%** of the previous segment's duration.
- **A drawn line must land on something.** When the path is a connector (rail, beam, underline, callout) rather than a shape, both endpoints must sit on real elements and the draw must do a job — reveal, route, validate, or emphasize. A stroke that only decorates empty space reads as filler; attach it or cut it.

## See also

`svg-icon-enrichment` (internal parts animate after the outline draws) · `counting-dynamic-scale` (stroke draws an icon while a number counts up) · `hacker-flip-3d` (logo draws, wordmark decodes beneath).
