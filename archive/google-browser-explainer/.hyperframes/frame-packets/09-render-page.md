# Frame packet: 09-render-page

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer\frame.md
- RULES_DIR: D:\Project\Javascript\hyperframes-channel\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 9 — Render what you see

- scene: Resource cards pass into a browser canvas; a wireframe becomes layout, painted shapes, text, and finally a complete Google search page.
- duration: 8.7s
- transition_in: zoom-through
- status: built
- voiceover: "The browser reads those pieces, lays them out, paints the pixels, and runs the code. A moment after Enter, the webpage appears."
- src: compositions/frames/09-render-page.html
- type: benefit_highlight
- persuasion: Demonstration
- beat: Satisfaction
- blueprint: zoom-out-workspace-reveal

narrativeRole: Turns the invisible response into the familiar visual result.
keyMessage: Rendering converts returned resources into the page on screen.

blueprint: compose
focal: browser canvas turning into a search page
roles: render verbs = foreground rail; page canvas = foreground subject; dark field = background
sfx: none

Scene 1 (0.0–3.2s): `read` and `layout` reveal in a left rail via per-word staggered reveal (`dynamic-content-sequencing`); asymmetric 60/40.
Scene 2 (3.2–6.7s): `paint` gains accent and the page surface self-draws via SVG self-draw (`svg-path-draw`).
Scene 3 (6.7–8.7s): `run` lands and the finished search page resolves through scale-swap (`scale-swap-transition`); hold.

## Selected blueprint: zoom-out-workspace-reveal

# zoom-out-workspace-reveal — Zoom-Out Workspace Reveal

**intent**: Open TIGHT on one full-bleed detail — a graphic macro or a small UI region — let micro-action play in close-up, then ONE continuous decelerating zoom-out reveals that everything seen so far lives inside a containing whole (a design-tool workspace / a multi-pane agent workspace); the frame locks at the wide and element-level payoff carries on. The zoom-out IS the narrative engine and the reveal-of-nesting is the payoff — distinct from `grid-card-assemble`, where a zoom-OUT is an optional camera modifier garnishing an element-stagger assemble; here nothing assembles, the world was whole all along, and the single outward move is what re-scopes its meaning. The structural inverse of every existing push-in shape (`constellation-hub`'s push-in, `device-surface-showcase`'s continuous push, `dataviz-countup`'s push-through).

**roles served**

- Hook (from `continuous-zoomout-nesting-reveal`): when the open should be a full-bleed graphic mystery — a blob morphing, a macro blossom blooming — resolved by one unbroken exponentially-decelerating zoom-out that passes THROUGH an intermediate composition (oversized headline / card artwork / web page) before revealing the whole thing is an artboard inside a design tool (panels, layers, inspector, timeline); the frame locks and the canvas keeps animating, ending mid-action.
- Benefits (from `close-up-open-single-zoom-out-reveal`): when the payoff is scale/breadth — micro-actions play in extreme close-up on one small UI region (file rows popping in, a highlight stepping, a guided glide down a list), then ONE fast smoothly-decelerating zoom-out (~0.5–1s) reveals the region was a corner of a huge multi-pane agent workspace (chat + artifact preview + sidebar); the wide holds static to the end while element-level payoff completes the story ("look how much the agent did — and here's the deliverable").

**duration**: 6.8–11s (Hook continuous-pull both 6.8s; Benefits dwell-then-snap 10.7–11s — the dwell and the post-lock payoff stretch, the reveal itself does not)

**HARD RULE — no zoom-in anywhere; camera static outside the single reveal.** Carried verbatim from both Benefits goldens and structurally true of both Hook goldens: the camera's only scale motion is OUTWARD. One zoom-out per shot. Before the reveal the camera either holds, glides/pans along the close-up surface, or is already running the (only) pull-back; after the reveal decelerates to a full stop the frame is LOCKED — every later change (pane swap, pane expansion, cursor travel, playhead scrub, canvas animation) is element/layout motion, never camera. No push-in, no punch, no re-zoom, no second reveal. Violating this collapses the shape back into a generic camera tour.

**shot structure** (one oversized static world — the full `[whole: workspace]` authored at final layout from frame 0 — with the camera starting scaled far in on the `[detail]`; the reveal is one scale animation on the world; two folded sub-shapes — **(A) continuous nesting pull** (Hook) and **(B) close-up dwell → snap reveal** (Benefits))

- **Scene 1 (0.0–~2.5s) — full-bleed detail + micro-action.** Extreme close-up: the `[detail: graphic macro — blob / blossom stem / small UI region — file list / browser corner]` fills the frame edge-to-edge with NO containing chrome, canvas, or neighboring panes visible. The detail PERFORMS in close-up — this beat is never a static hold:
  - _Variant — Hook (A)_: the graphic itself moves/morphs/blooms — an organic `[accent]` blob flows across and morphs into an undulating wavy line, or blurred macro forms sharpen as circular petals pop and expand outward into a flat vector `[motif]` — while the pull-back is ALREADY running underneath (the camera never waits).
  - _Variant — Benefits (B)_: camera holds (or glides) while UI micro-action plays — `[rows: filenames / list items]` pop in top-to-bottom, a soft `[highlight]` steps down row-by-row, or the camera rides down a list while gently pulling back. Optional blur-to-sharp resolve on the opening frame.

- **Scene 2 (~2.5s–reveal start) — the middle beat.** Diverges by sub-shape:
  - _Variant — Hook (A) — intermediate nesting level_: the continuing zoom-out resolves a mid-level composition, still full-bleed, still no chrome — oversized `[headline]` glyphs descend into frame as partial letterforms and settle centered (the "descent" is pure world-scale: the letters are static in world space, the camera pull produces the motion), or the `[motif]` is revealed living inside a `[card]` in a row of cards on a `[web page]`. The viewer re-scopes once — and still doesn't know the real container.
  - _Variant — Benefits (B) — close-up beat advances_: the close-up story develops at the same tightness — the view shifts to an adjacent `[panel]`, a new `[row]` fades/slides in and grows its panel, a `[cursor]` enters and hovers it with a soft highlight. This is the pre-reveal dwell; tension is "we're deep inside something."

- **Scene 3 (the reveal) — ONE decelerating zoom-out completes; frame LOCKS.** The signature move. The camera pulls back to scale 1 and eases to a full stop, revealing the containing `[whole]`:
  - _Variant — Hook (A)_: the pull is the tail of the SAME continuous zoom running since frame 0 (total travel ~4.3–4.5s of a 6.8s shot), with strong exponential deceleration — the `[intermediate composition]` turns out to be `[an artboard / a phone-screen mock]` on a `[design-tool canvas]`: light chrome, left pages/layers panel, right properties inspector, blue selection box, bottom animation timeline with keyframe bars.
  - _Variant — Benefits (B)_: the pull is a discrete rapid burst (~0.5–1s) from the held close-up — smooth, heavily decelerating — landing the full `[multi-pane agent workspace]`: left `[chat pane]` with the prompt + status + response, center/right `[artifact pane: spreadsheet / deck preview]`, optional `[sidebar: progress checklist + artifacts + context]`.
  - Both: the zoom-out ends BEFORE the shot does — always leave a post-lock act. The deceleration-to-stop is what makes the lock legible.

- **Scene 4 (lock–end) — element-level payoff on the locked wide.** The reveal is not the ending; the close-up's world keeps living inside the wide. All motion is element/layout:
  - _Variant — Hook (A)_: a `[cursor]` enters from off-frame and glides to hover/click the selected element, or a `[playhead]` scrubs left-to-right across the bottom timeline while the canvas artwork animates in sync (petals rotate about their hub, a starburst spins in place, a motif sweeps/shifts). Ends MID-ACTION — the tool is alive.
  - _Variant — Benefits (B)_: a `[file-attachment card]` fades in → the cursor clicks `[Open]` → the artifact pane swaps content via a quick white-out → the viewer pane expands full-width over its neighbor (LAYOUT motion, not camera) landing on the `[deliverable: full slide / dashboard]`; or the frame simply holds long and static while the cursor drifts to rest near the `[payoff stat]`. Struck-through checklist items in the sidebar read as completed work. Long hold to the end.

**motion vocabulary**: one continuous scale-driven zoom-out with exponential/eased deceleration (no cuts) · single fast decelerating zoom-out burst (~0.5–1s) · workspace-lock at zoom end · full-bleed no-chrome opening · blur-to-sharp macro focus resolve · organic blob flow + morph into undulating wavy line · squiggle-underline settle with residual undulation · circular petals popping/expanding outward (bloom) · oversized letters descending into frame as partial glyphs (world-scale, not element motion) · text scaling down through the frame to a centered settle · rows pop in top-to-bottom · selection highlight steps down row-by-row · camera rides/pans down a list while pulling back · new row fades/slides in and grows its panel · cursor hover with soft row highlight · cursor entering from off-frame and gliding to hover/click · timeline playhead scrub left-to-right · in-canvas rotation about a hub / spin-in-place · motif shift/sweep-in · file-attachment card fade-in · cursor click · pane content swap via quick white-out · pane expands full-width over neighbor (layout motion) · checklist items shown struck-through · long static hold · cursor drift to rest · ends mid-action (Hook).

**rule mapping** (motion verb → `rule-id`)

- the single decelerating zoom-out on the whole world → `viewport-change` (one `.world` wrapper; `cam` object as single source of truth via `onUpdate`; start `cam.scale` at the reveal ratio with `T = -offset × S` centering the detail, tween scale → 1 and translate → 0 with ONE shared ease — the detail drifts from frame-center to its home slot as the wide takes over, exactly the golden read)
- off-center detail framed at open, zoom-out to wide → `coordinate-target-zoom` ("Zoom out (target → wide view)" variation — nested wrappers, reverse phases: start zoomed on the measured target, tween outer scale → 1 + inner translate → 0 with shared duration/ease; measure the detail's center after `fonts.ready`, never hand-derive)
- pre-reveal glide/ride down a list while gently pulling back (Benefits B) → `viewport-change` (pan + scale composed on the one `cam` object) — sequencing the slow-glide → hold → fast-pull profile → `multi-phase-camera` (phase machinery; this shape runs the same scale-agnostic math at 4–12× outward — see `viewport-change`'s scale-guide range note)
- exponential deceleration-to-stop → ease selection (`expo.out` / `power4.out` on the reveal tween) — parameter guidance, no rule needed; after the stop, NO camera tweens exist on the timeline (hard rule above)
- blur-to-sharp macro resolve chorded to the early pull → `depth-of-field-blur` (refocus/settle variation: `--dof` ramps to 0 as the zoom recedes, same timeline position as the pull)
- oversized partial glyphs descending / text scaling down through the frame → no element tween — authored static in world space; `viewport-change`'s pull produces the motion (author trap: animating the letters separately double-moves them)
- organic blob flow + morph into wavy line → SVG path morph — see `hyperframes-keyframes` (morph); flagged special, like `device-surface-showcase`'s WebGL specials — substitute a non-morph accent when the capability isn't loaded
- squiggle-underline residual undulation → `sine-wave-loop` (finite bounded undulation)
- circular petals pop/expand outward (bloom) → `spring-pop-entrance` (staggered pops) + `center-outward-expansion` (petals expand from the hub to final positions)
- rows pop in top-to-bottom → `spring-pop-entrance` (staggered group, ≤500ms stagger cap) or `gsap-effects` (low-drama fade + short slide stagger)
- selection highlight steps down row-by-row → `gsap-effects` (stepped `tl.set` repositions at time thresholds — instant steps, no glide; trivial, no dedicated rule needed)
- new row fades/slides in → `spring-pop-entrance` (soft variant); its panel growing to fit → `anchored-layout-expand` (one-axis layout expansion)
- cursor enters off-frame → glides → hovers → clicks → `cursor-click-ripple` (move-to-target, co-depress, ripple); soft hover row-highlight → `gsap-effects` (background-color/opacity tween)
- timeline playhead scrub left-to-right → `gsap-effects` (linear `ease:"none"` translateX); in-sync canvas animation = place the artwork tweens at the same timeline position as the scrub (sync is free on one paused timeline)
- in-canvas rotation about a hub / spin-in-place (petal flower, starburst) → `svg-icon-enrichment` (SVG `setAttribute('transform','rotate(deg cx cy)')` for explicit centers)
- motif shift/sweep-in on a card → `gsap-effects` (masked translate) or `techniques.md` clip-path reveal
- file-attachment card fade-in → `spring-pop-entrance` (soft) / `gsap-effects` fade
- pane content swap via quick white-out → `discrete-text-sequence` (whole-state swap at a threshold) + `gsap-effects` (white flash overlay with attack-decay opacity envelope)
- pane expands full-width over neighbor (layout motion) → `anchored-layout-expand` (one-axis layout hand-off; width/height tweens stay forbidden)
- checklist items struck-through / status states → static content, or `discrete-text-sequence` if they check off on screen
- long static hold + cursor drift to rest → hold needs no rule; the drift is a single slow `gsap-effects` translate that ARRIVES somewhere meaningful (rests near the payoff stat) — it performs, it is not idle wobble
- ends mid-action (Hook) → the playhead/canvas tweens simply run to the composition edge — no exit move, no rule

**camera law — staging the one move** (the camera is the engine here, not a modifier)

- Build the ENTIRE `[whole]` workspace at final layout inside one `.world` wrapper; there is no second set. The open is `cam.scale = S0` (typically 4–12× — whatever makes the `[detail]` full-bleed) with counter-translate centering the detail; the reveal tweens to `scale 1, translate 0`. `overflow: hidden` on the scene; background on the scene, never the world.
- Crispness constraint: everything visible at open must survive S0 magnification — author the detail as DOM/vector (text, SVG, CSS shapes); any raster inside the close-up needs `sourceResolution ≥ rendered × S0`.
- Sub-shape A: the reveal tween spans ~0–4.5s with `expo.out`-class deceleration — one tween, no phases, no cuts; element beats (morph, bloom, glyph settle) are positioned along it.
- Sub-shape B: optional gentle pre-reveal pan/pull (`viewport-change` pan, or a slow scale ease-out ≤ ~15% travel) during the dwell, then the reveal burst (~0.5–1s, heavy decel) as its own tween; camera fully static after.
- Never: a zoom-in, a second zoom-out, camera motion after the lock, or replacing the reveal with a cut. One outward move is the whole grammar.

**boundary vs `grid-card-assemble`**: it already carries an optional zoom-OUT reveal modifier (glass-card / logo-wall variants), so the two shapes border each other. The test: if elements ASSEMBLE and the pull-back merely shows the assembled array in context, it's `grid-card-assemble`; if the world is whole from frame 0 and the single decelerating pull-back is itself the story — close-up mystery → nesting reveal → locked-frame payoff — it's this blueprint. Related evidence: a mined profile-page golden runs the same single UI zoom-out/scroll-up reveal at small scale inside a kinetic-type shot, corroborating the move's currency without sharing the shape.

## Selected motion rule: dynamic-content-sequencing

---
name: dynamic-content-sequencing
description: Auto-calculate timeline start/end times from content length + per-item duration config — longer content gets more screen time without hardcoded numbers.
metadata:
  tags: timeline, sequencing, dynamic, duration, content-aware, utility
---

# Dynamic Content Sequencing

A utility pattern (not a motion rule in itself) for scenes that show a SEQUENCE of items (cards, phrases, stats): each item's duration is computed from its content length + per-item config, and the sequencer assigns absolute start/end times automatically — no hardcoded offsets per item. Distinct from [discrete-text-sequence](discrete-text-sequence.md) (one text element changing states) — this rule swaps between distinct content blocks.

## How It Works

A content array of `{ eyebrow, title, body, speedFactor, hold }` entries is reduced once at build time into a flat `TIMELINE` of `{ …entry, start, end }` — duration per entry is `BASE_DURATION + body.length × SEC_PER_CHAR + hold`, so longer text earns more reading time. A single linear driver's `onUpdate` reverse-searches the active entry and swaps the DOM **only on transitions** (a `lastTitle` guard — per-frame `textContent` writes flicker in render); an optional progress bar fills 0→100% across the whole run.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="display">
  <div class="eyebrow" id="eyebrow"></div>
  <div class="title" id="title"></div>
  <div class="body" id="body"></div>
  <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
</div>
```

```css
.body {
  min-height: 160px; /* reserve space — content height varies; without this, layout jumps */
}
.progress-fill {
  height: 100%;
  width: 0%;
}
```

```js
// N entries, each with its own pacing (optionally a speedFactor multiplier);
// the final entry uses a larger hold (closing beat).
const CONTENT = [
  { eyebrow: "{eyebrow1}", title: "{title1}", body: "{body1}", hold: HOLD_MID },
  // …
  { eyebrow: "{eyebrowN}", title: "{titleN}", body: "{bodyN}", hold: HOLD_FINAL },
];

// Pre-compute absolute start/end ONCE — never in onUpdate.
let cumulative = 0;
const TIMELINE = CONTENT.map((entry) => {
  const dur = BASE_DURATION + entry.body.length * SEC_PER_CHAR + entry.hold;
  const start = cumulative;
  cumulative += dur;
  return { ...entry, start, end: cumulative };
});

function entryAt(time) {
  for (let i = TIMELINE.length - 1; i >= 0; i--) {
    if (time >= TIMELINE[i].start) return TIMELINE[i];
  }
  return TIMELINE[0];
}

const eyebrowEl = document.getElementById("eyebrow");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const progressEl = document.getElementById("progress-fill");

const TOTAL_DURATION = cumulative + TAIL_PAD;
const driver = { t: 0 };
let lastTitle = "";

tl.to(
  driver,
  {
    t: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      const entry = entryAt(driver.t);
      // Swap content only on transitions — no per-frame DOM thrash
      if (entry.title !== lastTitle) {
        eyebrowEl.textContent = entry.eyebrow;
        titleEl.textContent = entry.title;
        bodyEl.textContent = entry.body;
        lastTitle = entry.title;
      }
      progressEl.style.width = `${(driver.t / TOTAL_DURATION) * 100}%`;
    },
  },
  0,
);
```

## Variations

- **Crossfade between items** — return BOTH adjacent entries during an overlap window (`time ≥ e.start − overlap && time ≤ e.end + overlap`, overlap ≈ 0.3s) and render them with opacities computed from distance to the boundary.
- **Per-item motion variation** — map an `entry.style` key to an existing rule per chapter (e.g. `3d-text-depth-layers` → `hacker-flip-3d` → `counting-dynamic-scale`); the sequencer only orchestrates timing.
- **Auto-extend composition duration** — you can set `data-duration` from the computed `TOTAL_DURATION` in script, but HF reads `data-duration` at composition load and setting it after init may not take effect — author the duration manually from a rough total.

### Accelerating cadence (geometric hold decay)

For rhetorical escalation — "everyone says…", a roll-call, a praise flurry — the beat grid itself accelerates: early entries hold ~1s (read speed), then windows shrink geometrically into a ~0.15–0.3s flurry, braking on an emphasis state before the resolve. The acceleration is pre-computed into the same flat `TIMELINE` — still content-driven, still deterministic, no speed-up tween anywhere:

```js
// Geometric decay on the hold, clamped at a flurry floor; the brake state holds longest.
const HOLDS = CONTENT.map((entry, i) => Math.max(FLURRY_FLOOR, HOLD_START * Math.pow(DECAY, i)));
HOLDS[CONTENT.length - 1] = HOLD_FINAL;

let cumulative = 0;
const TIMELINE = CONTENT.map((entry, i) => {
  // Past ~0.5s states are glanced as motion texture, not read —
  // drop the per-char term or you never reach flurry speed.
  const readable = HOLDS[i] >= READ_THRESHOLD;
  const dur = HOLDS[i] + (readable ? entry.body.length * SEC_PER_CHAR : 0);
  const start = cumulative;
  cumulative += dur;
  return { ...entry, start, end: cumulative };
});
```

Worked example — **praise-chip flurry**: ~16 short quotes hard-cut through a chip beside a pinned wordmark. First 3 states at `HOLD_START = 1.0` (each reads fully); `DECAY = 0.8` shrinks every following window until `FLURRY_FLOOR = 0.2` catches it (≈12 states over ~2.5s — a churn of acclaim, individually glanced); the longest phrase takes `HOLD_FINAL ≈ 1.6` as the brake before the closing lockup.

Values: `HOLD_START` 0.8–1.2s; `DECAY` 0.75–0.88 (higher = longer runway before the flurry bites); `FLURRY_FLOOR` 0.15–0.3s (below ~0.15s swaps strobe); `READ_THRESHOLD` ~0.5s; brake ≥ 4× the floor or the stop doesn't register as a beat. The 3–6 entry guidance relaxes here — 12–18 states are legal precisely because flurry states aren't individually read. The hard-cut discipline (`lastTitle` guard, instant swaps) is what lets 0.2s states render clean.

## Values

| token         | range                 | notes                                                                                                                 |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| BASE_DURATION | 0.6–1.5s              | minimum per entry regardless of length — even one-word entries get read time                                          |
| SEC_PER_CHAR  | 0.03–0.06 s/char      | ≈17–33 chars/sec; uniform across the sequence so the pace reads as one engine; lean high for wide-character languages |
| HOLD_MID      | 0.5–1.0s              | dwell on a non-final entry; `< HOLD_FINAL`                                                                            |
| HOLD_FINAL    | 1.0–2.0s              | climax dwell — must exceed HOLD_MID by a clear margin so the close reads as a beat                                    |
| SPEED_FACTOR  | 0.5–2.0 (default 1.0) | per-entry only; if every entry shares a factor, fold it into SEC_PER_CHAR                                             |
| TAIL_PAD      | 0.0–1.0s              | quiet beat after the last entry; prefer 0 when the next composition owns the breath                                   |
| CONTENT N     | 3–6 entries           | <3 isn't a sequence; >6 drags (accelerating cadence relaxes this — see above)                                         |

Reference: `../examples/messaging-multi-phrase.html`.

## Critical Constraints

- **Pre-compute the TIMELINE once at build** — never recompute in `onUpdate`; the reverse search over the flat array is the whole per-frame cost.
- **DOM swap only on entry transition** (`lastTitle`/key guard) — per-frame `textContent` assignment flickers in HF render.
- **`min-height` on the body element** — without reservation, downstream elements (progress bar, brand) jitter as content height varies.
- **Sequential only** — for parallel tracks use a different reduction.
- **Titles fit one line at the chosen size; bodies fit inside `min-height` after wrapping.**

## See also

`discrete-text-sequence` (per-entry typewriter on the body) · `context-sensitive-cursor` (cursor color per chapter) · `vertical-spring-ticker` (animated word swap instead of hard cut) · `scale-swap-transition` (visual morph between entries).

## Selected motion rule: scale-swap-transition

---
name: scale-swap-transition
description: Coordinated shrink-out + spring pop-in morph-like transition between two elements — no SVG path interpolation needed.
metadata:
  tags: transition, morph, scale, swap, spring, pop
---

# Scale-Swap Transition

Simulates a "morph" between two DOM elements by overlapping exit and entrance scale animations. Lighter weight than [card-morph-anchor.md](card-morph-anchor.md) (which morphs container dimensions — use that for SHAPE changes; this rule is for SAME-shape state swaps) and easier than SVG path interpolation.

At a single trigger, two coordinated tweens fire:

1. **Outgoing**: scale `1.0 → EXIT_SCALE` + opacity `1 → 0`, fast `power2.in` (rushing away).
2. **Incoming**: scale `EXIT_SCALE → 1.0` + opacity `0 → 1`, `back.out(BOUNCE_FACTOR)` (arriving with weight).

A small `OVERLAP` window during which both are mid-tween creates the morph illusion; the incoming sits on top via z-index so the outgoing's fade-tail doesn't bleed through.

## Recipe

```html
<!-- Both cards position: absolute; inset: 0 in one fixed-size wrapper — same
     footprint, same transform-origin: 50% 50%. Incoming starts opacity: 0,
     transform: scale(EXIT_SCALE), z-index above the outgoing. -->
<div class="swap-wrap">
  <div class="card outgoing" id="outgoing">{outgoingIcon} {outgoingLabel}</div>
  <div class="card incoming" id="incoming">
    {incomingIcon} {incomingLabel}
    <div class="sub" id="sub">{incomingSubline}</div>
  </div>
</div>
```

```js
// Outgoing: shrink + fade fast
tl.to(
  "#outgoing",
  { scale: EXIT_SCALE, opacity: 0, duration: EXIT_DUR, ease: "power2.in" },
  TRIGGER,
);

// Incoming: pops in with overshoot, starting OVERLAP before the exit finishes
tl.to(
  "#incoming",
  { scale: 1.0, opacity: 1, duration: ENTER_DUR, ease: `back.out(${BOUNCE_FACTOR})` },
  TRIGGER + EXIT_DUR - OVERLAP,
);

// Inner content reveals AFTER the incoming settles
tl.fromTo(
  "#sub",
  { opacity: 0, y: SUB_REVEAL_Y_PX },
  { opacity: 1, y: 0, duration: SUB_REVEAL_DUR, ease: "power3.out" },
  TRIGGER + EXIT_DUR + SUB_REVEAL_DELAY,
);
```

## Variations

- **Delayed inner content reveal** — the classic pattern above: morph the container, then reveal inner text once it settles; the 0.2–0.4 s gap lets the eye land on the new shape before reading.
- **Triple swap (3-state cycle)** — chain A→B→C with triggers `TRIGGER_AB` / `TRIGGER_BC`; each transition is its own tween pair, the previous incoming becoming the next outgoing. State-evolution narratives (early → mid → final labels).
- **Color-shift transition (no scale)** — for a flat morph between same-shape states, drop the scale and keep opacity + a brief background hue tween; less dramatic, more product-UI tone.

## Values

| token            | range                                 | notes                                                                                                  |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| TRIGGER          | ≥ outgoing settled + a presence-dwell | the outgoing must "land" before transforming                                                           |
| EXIT_DUR         | 0.3–0.5 s                             |                                                                                                        |
| ENTER_DUR        | 0.45–0.7 s                            | longer than `EXIT_DUR` so the overshoot can settle                                                     |
| OVERLAP          | 0.1–0.2 s                             | >0.3 s both are clearly visible together (no morph); <0.05 s leaves a visible empty gap                |
| EXIT_SCALE       | 0.6–0.8                               | smaller exits feel dramatic but risk reading as "vanish" instead of "morph"                            |
| BOUNCE_FACTOR    | 1.4 soft · 1.8 firm · 2.2 cartoony    |                                                                                                        |
| SUB_REVEAL_DELAY | 0.2–0.4 s                             | reveals during the morph compete with the swap for attention                                           |
| BRAND_REVEAL_AT  | < TRIGGER                             | context (brand, eyebrow) sets the stage early; revealed AT the swap it competes with the headline beat |

## Critical Constraints

- **Incoming z-index ABOVE outgoing** — otherwise the outgoing's fade-tail (opacity 0.3–0.5) bleeds through and double-exposes the frame.
- **Both elements share `transform-origin: 50% 50%`** — different origins make the morph read as one thing teleporting elsewhere.
- **Bouncy ease ONLY on the incoming** — outgoing `power2.in`, incoming `back.out`; reversed, the swap feels mechanical.
- **Both cards `position: absolute; inset: 0`** in the same fixed-size wrapper (sized to fit both states; the wrap never resizes).
- **Don't `display: none` the outgoing** after the fade — leave it at `opacity: 0` so layout doesn't reflow.
- **Inner content reveals after the container settles**; **climax dwell ≥ 1 s** after the final state + subline land.

## See also

`press-release-spring` (a button press TRIGGERS the swap — cause and effect) · `card-morph-anchor` (shape-changing alternative) · `reactive-displacement` (when the replacement should read as a causal collision) · `sine-wave-loop` (idle breathing on the final state).

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
