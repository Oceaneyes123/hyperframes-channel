# Frame packet: 03-ask-dns

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer\frame.md
- RULES_DIR: D:\Project\Javascript\hyperframes-channel\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 3 — Ask DNS

- scene: A DNS resolver sits at the center of a sparse network map; a small packet leaves the browser and follows a short path through labeled lookup nodes.
- duration: 11.3s
- transition_in: push-slide RIGHT
- status: built
- voiceover: "First, the browser checks what it already knows. If needed, it asks a DNS resolver, which follows the internet's directory—from root, to .com, to Google's records."
- src: compositions/frames/03-ask-dns.html
- type: feature_showcase
- persuasion: Progressive disclosure + signposting
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Shows the simplified lookup rather than treating DNS as magic.
keyMessage: A DNS resolver can follow a hierarchy of directories to locate the right record.

blueprint: compose
focal: resolver-to-record network path
roles: resolver = foreground hub; root/.com/Google nodes = supporting; route line = supporting; dark grid = background
sfx: none

Scene 1 (0.0–3.0s): browser and resolver appear first via spring-pop entrance with smooth settle (`spring-pop-entrance`); full-width strip.
Scene 2 (3.0–8.8s): root, `.com`, and Google nodes reveal one by one as named via cluster→outward expansion (`center-outward-expansion`); horizontal stations.
Scene 3 (8.8–11.3s): a single orange packet completes the path; hold on the full route.

## Selected blueprint: spatial-pan-stations

# spatial-pan-stations — Spatial Pan / Stations

**intent**: Pre-place a sequence of labeled stations on one oversized canvas, then traverse it with a single virtual camera — repeated lateral/diagonal pans that center each station in turn and reveal a callout at every stop, landing held on a final station.

**roles served**

- Hook (from hook-pan-timeline): a horizontal timeline of evenly-spaced milestones, left-panned beat by beat, each marker getting a spring-popped callout, landing on the present moment ("evolution / milestone walk leading up to us").
- Problem (from problem-camera-pan-stations): a connected web of pain "stations" linked by hand-drawn leading lines, diagonally panned station to station, ending on a tangled scribble knot ("too many disconnected steps — it's a mess").
- Product_Intro (from concept-demo-decode-pan): a two-shot strip bridged by ONE lateral pan — shot 1 holds a static phrase whose accent word 3D-flap-DECODES (the concept lands), then the camera pans across the strip (with background parallax) into shot 2, where a cursor drives a live typing demo. Pairs this pan with `cursor-ui-demo`'s focal-locked tracked typing.

**duration**: 7–10s (union of Hook 8–10s, Problem ~7s, concept-demo ~7s)

**shot structure**
One oversized flat canvas on a solid `[bg color]`; all stations/markers pre-placed in world space; `[accent color]` text + simple line-icons; one virtual `.world` camera pans ease-in-out between stops. Each station holds ~1.0s.

- Scene 1 (0.0–~1.0s): Camera opens on station 1 — `[label 1 / first step]` centered. A reveal lands on it (see variants). Camera then begins to PAN toward station 2, sliding station 1 out of frame.
- Scene 2 → Scene N-1 (~1.0s each): Camera PANS (ease-in-out) to center the next station; on arrival its `[label k]` (+ optional `[secondary label]`) is REVEALED with the role reveal. Repeat per station.
- Scene N (final, ~last beat): One last pan lands on the terminal station; the final `[callout / landing element]` reveals and HOLDS to the end. Camera goes static on the punchline.

- Variant — Hook: stations sit as evenly-spaced `[markers]` on a thin horizontal `[timeline]` (lower third); pans are LEFT-only along the single axis (timeline scrolls left). Each callout is a bordered `[callout box]` + downward triangle (offset drop-shadow) that SPRING-POPS up (scale 0→100%, bouncy overshoot, transform-origin at triangle tip) reading `[label k]`; a `[secondary label, e.g. year]` fades in and RISES above it. Some mid markers arrive as plain static text revealed by the pan alone (no box). Final scene lands on the `[present-day label]`, springs, holds.
- Variant — Problem: stations are scattered across a 2D web; pans are DIAGONAL, STEERED by `[accent color]` hand-drawn lines — each station has a rough write-on line/arrow that draws toward the next and the camera follows it (Scene 1 also draws a loop/circle around the headline's key word). Each station = a white `[line-icon]` above its `[label]`, revealed plainly by the pan (no spring box). Final scene: the accent line spirals into a dense chaotic SCRIBBLE KNOT centered on the field; camera holds static on the tangle (visual punchline).

**motion vocabulary**
repeated ease-in-out camera pans (horizontal-left for Hook, diagonal-steered for Problem) across one large static canvas; pre-placed stations sliding through frame via the pan; spring-overshoot callout pop with triangle-tip origin (Hook); rise-and-fade secondary label (Hook); plain labels/icons arriving via the pan alone; rough hand-drawn "write-on" leading lines/arrows + loop/circle key-word mark (Problem); terminal chaotic-scribble knot draw (Problem); static hold on the final station/punchline.

**rule mapping**

- camera pan / traverse across the canvas (primary) → `viewport-change` (single `.world` wrapper transform; PAN mode)
- sequencing the repeated pan beats into stops → `multi-phase-camera`
- centering each station as the pan target → `coordinate-target-zoom` (used as pan-to-target, no zoom)
- spring-overshoot callout pop, triangle-tip origin (Hook) → `spring-pop-entrance`
- rise-and-fade secondary label + plain per-station label/icon reveals via the pan → `discrete-text-sequence`
- hand-drawn leading lines / arrows / loop-circle key-word mark / terminal scribble knot (Problem) → `svg-path-draw`
- station line-icons (Problem) → `svg-icon-enrichment`
- static hold on the final station / punchline → (no motion; sustained held frame, no rule needed)

**camera modifier**: The pan IS the camera. One `.world` virtual-camera transform in PAN mode — `viewport-change` — sequenced across stops by `multi-phase-camera`, each stop targeted via `coordinate-target-zoom` (pan-to-target). No depth push-in (that distinguishes this from the cluster-push-in / dataviz-pushthrough blueprints).

## Selected motion rule: center-outward-expansion

---
name: center-outward-expansion
description: Elements start clustered at screen center and expand outward to their final positions, driven by a shared progress value.
metadata:
  tags: expansion, scatter, center, reveal, layout, sync, burst
---

# Center-Outward Expansion

Elements begin at one shared center point and radiate outward to their final positions — the entry beat itself, or motion driven by another animation's progress (a counting number, a beat). Flat 2D cousin of [depth-scatter-assemble.md](depth-scatter-assemble.md) (per-element 3D cloud): here every element shares the SAME origin.

## How It Works

Each element carries its final offset as `data-target-x/y`. Its position lerps between center and target: `x = targetX × progress`. Self-centering is baked as `xPercent/yPercent: -50` so the tweened `x`/`y` are pure offsets from the stage center. Standalone burst = per-item staggered `fromTo`; driven burst = one shared proxy (see Variations).

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="burst-wrap">
  <div class="burst-item" data-target-x="-360" data-target-y="-180">{itemA}</div>
  <div class="burst-item" data-target-x="360" data-target-y="-180">{itemB}</div>
  <div class="burst-item" data-target-x="0" data-target-y="360">{itemC}</div>
</div>
```

```css
.burst-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.burst-item {
  position: absolute;
  top: 50%;
  left: 50%; /* GSAP xPercent/yPercent -50 bakes the centering; x/y tween the offset */
  will-change: transform;
}
```

```js
document.querySelectorAll(".burst-item").forEach((el, i) => {
  tl.fromTo(
    el,
    { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.6, opacity: 0 },
    {
      x: Number(el.dataset.targetX),
      y: Number(el.dataset.targetY),
      scale: 1,
      opacity: 1,
      duration: EXPAND_DUR,
      ease: EXPAND_EASE,
    },
    ENTRY_AT + i * STAGGER,
  );
});
```

## Variations

- **Synced to a driver (chord)**: when the burst shadows a counter / beat, drop the stagger and drive all items from ONE 0→1 proxy tween with the driver's exact duration AND ease; `onUpdate` writes `translate(-50%,-50%) translate(targetX*p, targetY*p)` per item — the two read as one beat.
- **Partially-spread start**: with 6+ items the full cluster piles up — start from `{ x: targetX * START_PROGRESS, ... }`.
- **Idle micro-float**: hand off to [sine-wave-loop.md](sine-wave-loop.md) after landing instead of freezing.

## Values

| token          | range                | notes                                                            |
| -------------- | -------------------- | ---------------------------------------------------------------- |
| ITEM_COUNT     | 3–8                  | > 8 = visual chaos mid-expansion; low counts want wider spread   |
| EXPAND_DUR     | 1.0–1.8s             | must equal the driver's duration in the synced variant           |
| EXPAND_EASE    | `power3.out` default | `power2.out` gentler, `expo.out` dramatic stop; NEVER `in` eases |
| STAGGER        | 0.04–0.08s           | tighter = chord; looser = lazy arpeggio                          |
| ENTRY_AT       | 0–0.5s               | a beat of compositional quiet before the burst                   |
| START_PROGRESS | 0–0.5                | 0 = dramatic full cluster; ~0.3 avoids the pile-up               |

## Critical Constraints

- **Tween `x`/`y` over the baked `xPercent/yPercent: -50`** — mutating `left`/`top` fights the centering and causes pixel jitter.
- **Out-easing only** — `in` easings read as items being sucked back mid-air.
- **No other absolute-positioned siblings inside `.burst-wrap`** — they'd steal the centered baseline.
- **❗ The burst IS the beat** — don't park a "real headline" label below it (the eye snaps to the label and ignores the burst). If a label is needed, reveal it post-burst in the same stack.
- Synced variant: identical duration + ease as the driver, or the chord falls apart.

## See also

`counting-dynamic-scale` (the classic chord driver) · `depth-scatter-assemble` (3D per-element cloud) · `card-morph-anchor` (burst out of a morphed card) · `sine-wave-loop` (post-landing life).

## Selected motion rule: spring-pop-entrance

---
name: spring-pop-entrance
description: The canonical entrance pop — an element (or staggered group) arrives by scaling 0 → 1 on a smooth long-tail settle (power3 default); bouncy overshoot is a rare, explicitly-playful exception. fromTo so it's correct at t=0 under seek.
metadata:
  tags: spring, entrance, pop, scale, power3, settle, stagger, reveal, arrival
---

# Spring-Pop Entrance

> **Smooth beats bouncy.** This entrance defaults to a smooth long-tail settle — `power3.out` (or `expo.out` for a faster front) — that decelerates cleanly into the resting size with **no overshoot**. Bouncy `back.out` is the **#1 instant turn-off** in agent-made videos and is almost never executed well; it is a rare, explicitly-playful exception (consumer / fun brand), never the default. When unsure, settle smoothly.

THE entrance primitive: an element (or staggered group) arrives by springing from nothing — `scale: 0 → 1`, optional small `y` rise — and settles without bouncing. This is **arrival**, not reaction: distinct from [press-release-spring.md](press-release-spring.md) (a click/press → release feedback chain on an element that already rests on screen). Many blueprints used to borrow that rule to fake an entrance; reach for this instead.

## How It Works

One `fromTo` carries the whole arrival: from `{ scale: 0, opacity: 0 }` (explicit, so t=0 is correct under seek) to `{ scale: 1, opacity: 1, ease: "power3.out" }`. For a **group**, the same `fromTo` runs per element at `i * STAGGER`, capped so the group reads as one arriving beat. The `scale` grow is load-bearing; the `y` rise is garnish — drop everything else and it must still read as a clean entrance. Let the ease produce the settle: never hand-key a `scale: 1.1` mid-state (it double-bounces against the curve).

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="pop-hero" id="hero">{heroLabel}</div>

<div class="pop-grid">
  <div class="pop-item">{itemA}</div>
  <div class="pop-item">{itemB}</div>
  <div class="pop-item">{itemC}</div>
</div>
```

```css
.pop-hero,
.pop-item {
  transform-origin: 50% 50%; /* in-place pop; move to the source point for the anchored variation */
  will-change: transform;
}
.pop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: GRID_GAP;
  place-items: center;
}
```

```js
// Single hero pop — smooth long-tail settle, no overshoot.
tl.fromTo(
  "#hero",
  { scale: 0, opacity: 0 },
  { scale: 1, opacity: 1, duration: POP_DUR, ease: "power3.out" },
  ENTRY_AT,
);

// Staggered group pop — one arriving beat.
gsap.utils.toArray(".pop-item").forEach((el, i) => {
  tl.fromTo(
    el,
    { scale: 0, opacity: 0, y: Y_RISE },
    { scale: 1, opacity: 1, y: 0, duration: POP_DUR, ease: "power3.out" },
    GROUP_ENTRY_AT + i * STAGGER,
  );
});
```

## Variations

- **Calm settle** (premium / enterprise): `power3.out`, no rotation, `Y_RISE` 0–12px — a weighted, confident landing for a hero wordmark or product shot.
- **Firm settle** (everyday default): `power3.out` or `expo.out` for a punchier front, `Y_RISE` ~24px — cards, icons, callouts.
- **Exact-physics settle**: when the settle IS the shot, swap the ease for `springEase({ response: 0.4 })` (critically damped) from `../adapters/gsap-easing-and-stagger.md` → Spring Eases; take `duration` from the helper.
- **Origin-anchored pop**: a callout growing out of a specific point (marker, pointer tip) sets `transform-origin` to that point (e.g. `0% 100%`) so `scale: 0 → 1` reads as "emerging from the source", not "inflating in place".
- **Pop into a held slot**: land the pop and hold still — no idle loop baked into the entrance. If the held frame genuinely needs life, hand off to [sine-wave-loop.md](sine-wave-loop.md) for subtle jitter on a separate later tween; prefer revealing the next element on its VO cue.
- **Bouncy pop (RARE — explicitly-playful only)**: swap the ease for `back.out(OVERSHOOT)` and optionally settle a small `rotation: ROT_FROM → 0` so elements look hand-placed. Only for a deliberately playful register — never product / enterprise / serious tone:

```js
tl.fromTo(
  el,
  { scale: 0, opacity: 0, rotation: ROT_FROM },
  { scale: 1, opacity: 1, rotation: 0, duration: POP_DUR, ease: `back.out(${OVERSHOOT})` },
  GROUP_ENTRY_AT + i * STAGGER,
);
```

Even here keep `OVERSHOOT ≤ ~2` — past that it reads as cartoon wobble. Better still: the baked spring at `dampingFraction: 0.6–0.7` (same adapters doc) gives ~5–10% overshoot that reads physical where `back.out` reads cartoon.

## Values

| token      | range                                     | notes                                                            |
| ---------- | ----------------------------------------- | ---------------------------------------------------------------- |
| EASE       | `power3.out` default; `expo.out` punchier | `back.out(OVERSHOOT)` only in the playful variant                |
| POP_DUR    | 0.4–0.7s                                  | shorter = tight snap; hero must be visible by **t ≤ 0.5s**       |
| STAGGER    | 0.04–0.08s                                | `min(0.06, 0.5 / ITEM_COUNT)` — self-caps the window             |
| ITEM_COUNT | 3–9                                       | >9 makes the stagger vanish — switch to a wipe/sweep reveal      |
| Y_RISE     | 0–32px                                    | small; never large enough to read as a slide-up                  |
| ROT_FROM   | −10°–+10°                                 | playful variant only; alternate sign by index (`i % 2 ? 6 : -6`) |
| ENTRY_AT   | 0–0.4s                                    | a beat of quiet, but keep the subject landing by t ≤ 0.5s        |

## Critical Constraints

- Default ease `power3.out` (no overshoot); `back.out` only in the explicitly-playful variant, and there `OVERSHOOT ≤ ~2`.
- `ITEM_COUNT × STAGGER ≤ ~0.5s` — the group must land inside one beat.
- Entrances state the collapsed from-state in `fromTo` — never rely on a CSS-hidden start (it renders visible before the tween claims it under seek).
- `transform-origin: 50% 50%` for an in-place pop; the source point only for the anchored variation.
- This is a finite arrival — idle motion on a held element is a separate, later `sine-wave-loop` tween.

## See also

`center-outward-expansion` (pop while radiating to slots) · `press-release-spring` (the click-feedback counterpart) · `sine-wave-loop` (post-arrival jitter, sparingly).
