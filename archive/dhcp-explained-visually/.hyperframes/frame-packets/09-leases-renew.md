# Frame packet: 09-leases-renew

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\dhcp-explained-visually
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\dhcp-explained-visually\frame.md
- RULES_DIR: C:\Users\Dave\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 9 — Leases renew

- scene: A `Lease: 24h` timer counts down toward a renewal point; the client sends a small renewal packet and the timer resets while the IP stays visible.
- duration: 11.691149711608887s
- poster: 7s
- transition_in: crossfade
- status: built
- src: compositions/frames/09-leases-renew.html
- voiceover: "That address is leased, not owned forever. Before the timer expires, the client contacts DHCP to renew. If renewal succeeds, it can usually keep using the same address."
- type: feature_showcase
- persuasion: Causal chain + time progression
- beat: Foresight
- blueprint: spatial-pan-stations

narrativeRole: Explain the lease as a living arrangement with a renewal loop rather than a permanent assignment.
keyMessage: A DHCP lease expires on a timer, and successful renewal can extend continued use.
focal: lease timer and renewal loop
roles: laptop = left foreground client; clock/timer = centered supporting time cue; renewal packet = foreground motion; server = right foreground station; IP badge = persistent anchor
sfx: none

Scene 1 (0.0–3.0s): laptop, clock, and server settle into a spaced triangle via spring-pop entrance (`spring-pop-entrance`); triangle framing.
Scene 2 (3.0–7.3s): `24h` counts down in the clock while the IP badge stays visible (`count-up`); centered timer stays smaller than the device icons.
Scene 3 (7.3–11.69s): a small renewal packet loops from client to server and the timer resets via packet flight (`nudge-curve`); hold the renewal relationship.

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

## Selected motion rule: nudge-curve

---
name: nudge-curve
description: Slow-fast-slow three-phase group slide — reposition a composed group (word rows, card stacks, lists) to reveal content or make room. No single built-in ease produces it; chain power3.in ramp → linear burst → power4.out tail (10/65/25 distance, tail ≥3× ramp-in in time).
metadata:
  tags: slide, reposition, group-motion, easing, nudge, slow-fast-slow, reveal, layout
---

# Nudge Curve

Slow-fast-slow repositioning of a composed group (word rows, card stacks, lists) to
reveal content or make room. **In-scene group slide — not a seam.** No single built-in
ease produces it — `power4.inOut` smacks to a stop. Chain three tweens on one property:

| Phase     | Ease            | Distance | Time | Feel                                     |
| --------- | --------------- | -------- | ---- | ---------------------------------------- |
| 1 ramp-in | `power3.in`     | ~10%     | ~20% | barely moves — motion registers, no jolt |
| 2 burst   | `none` (linear) | ~65%     | ~18% | ~2× average px/frame — purposeful        |
| 3 tail    | `power4.out`    | ~25%     | ~62% | decaying creep to rest — kills the smack |

## Rules

- The tail is ≥3× the ramp-in in TIME. If it still smacks: extend the tail's time (not
  distance) or use `power5.out`.
- Phase 2 stays linear — easing it loses the burst contrast.
- Reveal new content DURING phase 2 — the burst masks its appearance.
- Same ratios vertical; scale distances proportionally, keep the time ratios.
- A cascade arrival usually precedes this slide — see [waterfall-entry.md](waterfall-entry.md).

## JS

Reference values for a 270px leftward slide (0.57s total). Scale distances
proportionally for other travels; preserve the TIME ratios; tail ≥3× ramp-in.

```js
var t = /* start after content settles */;
tl.to(".text-row", { x: -30,  duration: 0.12, ease: "power3.in"  }, t);          // ramp-in: 11% dist / 21% time
tl.to(".text-row", { x: -210, duration: 0.10, ease: "none"       }, t + 0.12);   // burst:   67% dist / 18% time
tl.to(".text-row", { x: -270, duration: 0.35, ease: "power4.out" }, t + 0.22);   // tail:    22% dist / 61% time
// vertical: same ratios on y. 150px variant: -15 / -115 / -150 at the same times.
```

## Anti-patterns

| Don't                                                    | Instead                                  |
| -------------------------------------------------------- | ---------------------------------------- |
| Single ease for a group slide (`power4.inOut`, `slow()`) | The three-phase chain above              |
| Nudge tail shorter than 3× the ramp-in                   | Extend the tail's TIME, not its distance |

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
