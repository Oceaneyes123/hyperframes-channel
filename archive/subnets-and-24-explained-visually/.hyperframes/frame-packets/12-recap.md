# Frame packet: 12-recap

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\subnets-and-24-explained-visually
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\subnets-and-24-explained-visually\frame.md
- RULES_DIR: D:\Project\Javascript\hyperframes-channel\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 12 — Recap · measured 97.384–111.665s
- Narration reference: `SCRIPT.md#Line 12`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: one composition that restates the whole model
- Dominant visual: `192.168.1.20/24` at the top, then its four derived rows — network `192.168.1`, host `20`, mask `255.255.255.0`, network address `192.168.1.0`, usable `192.168.1.1–192.168.1.254` — then a two-lane footer: mint `same subnet → local`, amber `different subnet → router`
- Icon assets: `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons/check.svg`, `public/icons/arrow-right.svg`, `public/icons/triangle-exclamation.svg`
- Text shown: values only, one column, no sentences
- duration: 14.280s
- status: outline
- transition_in: cut
- src: compositions/frames/12-recap.html
- voiceover: "So /24 means the first 24 bits name the network, and the last 8 address the devices inside it. Same subnet, local. Different subnet, the router. Next: a switch, or a router?"
- type: recap
- persuasion: summary
- beat: close
- blueprint: compose
- focal: `/24` recap stack
- roles: address and derived rows = foreground subject · same/different lanes = supporting · field = background
- Scene 1 (0.0–2.8s): `/24` and `192.168.1.20` settle at the top; spring-pop entrance.
- Scene 2 (2.8–8.8s): network, host, mask, and network-address rows reveal top-to-bottom on their spoken cues; waterfall-entry.
- Scene 3 (8.8–11.8s): usable range row lands and holds; stat-bars-and-fills.
- Scene 4 (11.8–14.280s): mint `same subnet → local` and amber `different subnet → router` footer lanes draw last and hold; svg-path-draw.
- Beginning state: address at the top, empty rows
- Ending state: full recap held still for the closing line
- Transition: cut to black
- Complexity: 1 idea · 2 actions · 5 rows

---

## Gate 1 checklist

- [x] `FACTS.md` fact-checked with RFC sources
- [x] `SCRIPT.md` — 12 lines, display copy separate from narration, values kept on screen
- [x] Timed table agreed with the script (one narration beat per scene)
- [x] `ICON_PLAN.json` — every asset resolved locally (`public/icons8/*.png`, `public/icons/*.svg`), Icons8 attribution recorded
- [x] Icon-first sketches in `sketches/board.html` using the production assets (no placeholder rectangles)
- [ ] Explicit user approval of this board and the sketches (recorded in `review/storyboard-approval.json`)
- [ ] Measured TTS timings replace the estimate column

## Selected motion rule: stat-bars-and-fills

---
name: stat-bars-and-fills
description: Data-viz primitives that pair a number with a graphic — growth bars (CSS scaleY stagger), a progress fill (bar or ring), and a partial star-rating wipe. Seek-safe, deterministic.
metadata:
  tags: data, stats, chart, bars, progress, ring, stars, rating, infographic, number
---

# Stat Bars & Fills

The graphics that give a stat **visual weight** beside its number: a small bar chart, a progress bar/ring filling to a percentage, or a star row filling to a fractional rating. Pair these with [counting-dynamic-scale.md](counting-dynamic-scale.md) (the number) for a complete stat scene.

**Layout blueprint — pick ONE and hold it across all stats:**

- **Single-focus** — one centered frame, the number is the hero, a ring or bar sits under/around it. Cleanest for a sequential reveal (stat 1 → stat 2 → stat 3 in the same frame).
- **Split-frame** — big number on the left, paired graphic on the right. Better when stats are shown together or each needs a distinct visual.

Don't mix blueprints between stats in one piece — that reads as inconsistent.

## Recipe

### 1 — Growth Bars (CSS `scaleY` stagger)

Bars grow from the baseline with a stagger; the last bar is the accent. Heights are authored in CSS (inline height per bar); GSAP only reveals `scaleY: 0 → 1` — never animate `height`.

```css
.bars {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 280px;
}
.bar {
  width: 48px;
  background: #3a4a64;
  transform: scaleY(0);
  transform-origin: bottom center; /* grow UP from the baseline, not from center */
}
.bar:last-child {
  background: #ffc300; /* accent the final/current bar */
}
```

```js
tl.to(".bar", { scaleY: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.3);
```

### 2 — Progress Fill

**Bar form** — `scaleX` from a left origin:

```css
.track {
  width: 520px;
  height: 16px;
  background: #1b263b;
  border-radius: 8px;
  overflow: hidden;
}
/* width:100% is REQUIRED — an absolutely-positioned fill with no width is 0px, and scaleX of 0 is
   still 0 → the bar renders invisible (automated gates may miss a zero-width scaled element). */
.fill {
  width: 100%;
  height: 100%;
  background: #ffc300;
  transform: scaleX(0);
  transform-origin: left center;
}
```

```js
const PCT = 0.92; // 92%
tl.to(".fill", { scaleX: PCT, duration: 1.0, ease: "power2.out" }, 0.3);
```

**Ring form** — measured stroke draw (mechanics in [svg-path-draw.md](svg-path-draw.md)):

```js
const ring = document.querySelector("#ring");
const LEN = ring.getTotalLength(); // measure, don't hard-code the circumference
ring.style.strokeDasharray = LEN;
ring.style.strokeDashoffset = LEN; // empty
// rotate the <circle> -90deg in CSS so the fill starts at 12 o'clock
tl.to(ring, { strokeDashoffset: LEN * (1 - 0.92), duration: 1.1, ease: "power2.out" }, 0.3);
```

### 3 — Star-Rating Fill (fractional)

A gold star row revealed left-to-right to a fractional value (e.g. 4.6 / 5) via a clip wipe over a gold layer sitting on a gray layer.

```html
<div class="stars">
  <div class="stars-gray">★★★★★</div>
  <div class="stars-gold" id="goldStars">★★★★★</div>
</div>
```

```css
.stars {
  position: relative;
  font-size: 64px;
  letter-spacing: 8px;
}
.stars-gray {
  color: #2b3548;
}
.stars-gold {
  position: absolute;
  inset: 0;
  color: #ffc300;
  width: 100%;
  clip-path: inset(0 100% 0 0);
}
```

```js
const RATING = 4.6,
  MAX = 5;
tl.to(
  "#goldStars",
  { clipPath: `inset(0 ${100 - (RATING / MAX) * 100}% 0 0)`, duration: 1.0, ease: "power2.out" },
  0.3,
);
```

## Values

| token         | range       | notes                                                                               |
| ------------- | ----------- | ----------------------------------------------------------------------------------- |
| bar count     | 4–6         | reads as "a trend" without clutter; the last bar is the current/accent value        |
| fill duration | 0.8–1.2s    | matched to the paired count-up so number and graphic land together (share the ease) |
| stagger       | 0.06–0.1s   | larger feels sluggish, 0 loses the build                                            |
| accent hue    | exactly one | bars/fill/stars all use the same accent, the rest is muted                          |

## Critical Constraints

- **`scaleY` / `scaleX` / `clipPath`, never `height`/`width` tweens** — author each bar's final height in CSS and scale from 0.
- **`transform-origin`** must be `bottom` (bars grow up) / `left` (fills grow right) — the default center origin scales from the middle and looks wrong.
- **`.fill` needs `width: 100%`** — a zero-width fill scaled by any factor is still invisible, and automated gates may miss it.
- **Measure, don't hard-code** — ring length via `getTotalLength()`; a hard-coded circumference breaks if the radius changes.
- **Match the number's timing** — the fill and the count-up peak together (same start + ease) so the stat resolves as one beat, not two; a paired counter's `onUpdate` must be O(1) (see [counting-dynamic-scale.md](counting-dynamic-scale.md)).
- **One accent hue, consistent blueprint** — see `hyperframes-creative/references/data-in-motion.md`.

## See also

`counting-dynamic-scale` (the number beside the graphic — same ease/duration) · `svg-path-draw` (progress-ring draw mechanics) · `hyperframes-creative/references/data-in-motion.md` (stat layout + visual weight).

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

## Selected motion rule: waterfall-entry

---
name: waterfall-entry
description: Staggered ARRIVAL cascade — words/elements whip in from below (one consistent direction), each starting before the previous settles, an accelerating wave that resolves into a composed layout. Title cards, segment openers, list/feature intros. Opacity is BINARY 0→1 via tl.set — never fade an arrival.
metadata:
  tags: entrance, cascade, stagger, kinetic-text, title-card, segment-opener, arrival, waterfall, whip
---

# Waterfall Entry

Staggered ARRIVAL cascade: words/elements whip in from below (one consistent direction),
each starting before the previous settles — an accelerating wave that resolves into a
composed layout. Title cards, segment openers, list/feature intros.

**This is an in-scene arrival, not a seam.** Its seam sibling is the waterfall CUT
(`cut-the-curve` doctrine skill, `seams/waterfall-cut.md`); do not mix their rules:

|               | Entry (this rule — arrival)                   | Waterfall Cut (seam)                                      |
| ------------- | --------------------------------------------- | --------------------------------------------------------- |
| Opacity       | BINARY 0→1 via `tl.set` at entry — never fade | ignites at 0.35 mid-path — the fade IS the velocity trick |
| Axis default  | Y, from below                                 | X, riding the current                                     |
| Outgoing side | none                                          | words ramp out on mirrored power4.in                      |

## Choreography

- **Overlap, don't queue** — next element starts within ±2 frames of the previous
  settling; gaps SHRINK across the cascade; the last element snaps.
- **Velocity varies by weight** — heavy/anchor elements travel further and longer;
  light words/punctuation snap in tight:

| Parameter | Anchor/heavy | Normal word | Light/punctuation |
| --------- | ------------ | ----------- | ----------------- |
| Y offset  | 60–80px      | 40–50px     | 30–48px           |
| Duration  | 0.16–0.20s   | 0.13–0.16s  | 0.10–0.13s        |
| Overlap   | 0–2f gap     | 1f overlap  | 1–2f overlap      |

- Ease `power4.out` (`expo.out` for extra snap); never `.inOut` on an entry.
- One direction per cascade.
- Split the FINAL word into fragments to extend the climax; fragments travel further.
- Post-settle, the group usually slides to make room for the next beat — that's
  [nudge-curve.md](nudge-curve.md).

## JS

Each element: `tl.set` (instant reveal + offset) then `tl.to` (whip to rest).
`nextStart = prevStart + prevDuration − (overlapFrames × F)`; +overlap = cascade,
−overlap = deliberate gap. CSS: elements start `opacity: 0; display: inline-block`.

```js
var F = 1 / 60;
var t0 = 0.1;
// anchor (heaviest): biggest travel, longest settle
tl.set("#el-1", { opacity: 1, y: 80 }, t0);
tl.to("#el-1", { y: 0, duration: 0.18, ease: "power4.out" }, t0);
// normal word: 2 frames after the anchor finishes
var t1 = t0 + 0.18 + 2 * F;
tl.set("#el-2", { opacity: 1, y: 45 }, t1);
tl.to("#el-2", { y: 0, duration: 0.15, ease: "power4.out" }, t1);
// light word: 1 frame BEFORE the previous finishes (overlap)
var t2 = t1 + 0.15 - F;
tl.set("#el-3", { opacity: 1, y: 40 }, t2);
tl.to("#el-3", { y: 0, duration: 0.14, ease: "power4.out" }, t2);
// split final-word fragments: tightest overlap, extra travel (lighter)
var t3 = t2 + 0.14 - F;
tl.set("#frag-a", { opacity: 1, y: 70 }, t3);
tl.to("#frag-a", { y: 0, duration: 0.16, ease: "power4.out" }, t3);
var t4 = t3 + 0.14 - F;
tl.set("#frag-b", { opacity: 1, y: 70 }, t4);
tl.to("#frag-b", { y: 0, duration: 0.15, ease: "power4.out" }, t4);
// punctuation: lightest, fastest
var t5 = t4 + 0.13 - 2 * F;
tl.set("#dot", { opacity: 1, y: 48 }, t5);
tl.to("#dot", { y: 0, duration: 0.12, ease: "power4.out" }, t5);
```

## Anti-patterns

| Don't                                                  | Instead                                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Queued entries (each waits for the previous to settle) | Overlap ±1–2 frames — the cascade is a wave, not a queue                          |
| Same offset/duration for every cascade element         | Vary by weight: anchors travel further, punctuation snaps                         |
| Gradual opacity fade on an arrival                     | Binary 0→1 via `tl.set` — fading fights the snap (seam cuts fade; arrivals don't) |
