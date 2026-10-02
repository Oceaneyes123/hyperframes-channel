# Motion v1 API

Opt in with `"motion_version":"1.0.0"` in a design-v2 `channel.json`.
Sync assets, then assemble. The parent loads `channel/motion.js` once; frames
import `channel/styles.css` and `channel/motion.css`. Existing projects do not
change. Frozen v1 projects cannot opt in without migration.

`motion.js` is the low-level runtime. Optional `motion-presets.js` composes its
primitives; see `MOTION_LIBRARY.md` for intent and recipe selection. Syncing a
new motion-v1 project stages both scripts. The assembler loads the preset file
only when present, so existing project copies retain their current behavior.

```js
const root = document.querySelector('[data-composition-id="line-2"]');
const q = selector => root.querySelector(selector);
const M = ChannelMotion;
const pose = M.state({x:0, y:0, scale:1}, [
  [cues.checked, {x:120, scale:1.04}, 'SLOW', 1.1]
]);
const tl = gsap.timeline({paused:true});
M.mount(tl, measuredDuration, t => M.apply(q('.certificate'), pose(t)));
window.__timelines['line-2'] = tl;
```

`mount` uses a GSAP property setter, so `seek(t, true)` still paints. Do not
replace it with `onUpdate`, start another clock, or depend on previous frames.
The returned timeline also exposes `channelSeek(t)` for exact sampling while
Studio stays paused, avoiding its frame-quantized seek and queued redraws.
The compiler hoists scripts: `document.currentScript.parentElement` is not a
reliable scene root. Resolve the composition ID explicitly and scope selectors
inside it. Style the root with `#root` and use plain descendant selectors.

## Pure primitives

All times are scene-local seconds. Keys are ordered arrays of
`[at, target, personality?, duration?]`. Defaults: MORPH, one second.
Overlapping changes superpose their step responses; sample in any order.
Springs blend to their exact endpoint over the last 30% of the declared window.
Allow enough duration to settle, normally 0.7–1.6 seconds.

| API | Contract |
| --- | --- |
| `spring(seconds, personality)` | Closed-form damped response; no integration loop |
| `track(initial, keys, personality)` | Numeric channel; returns `t => number` |
| `color('#rrggbb', keys)` | Six-digit color channel; returns CSS RGB |
| `state(initial, keys)` | Numeric geometry and colors; partial target states |
| `geometry(fromPoints, toPoints, progress)` | Equal-topology point arrays; no arbitrary SVG topology conversion |
| `travel(start, end, from=0, to=1)` | Smooth progress with zero endpoint velocity; swap endpoints to retrace |
| `path(svgPath, progress, {rotate, stretch})` | Arc-length position; optional tangent rotation and stretch capped at 4.5% |
| `camera(focusTrack, center={x:540,y:960})` | World-to-screen transform; focus supplies x, y, scale |
| `visibility(t, enter, exit, duration=.24, blur=0)` | Null enter/exit means already visible/no exit |
| `swap(t, at, duration=.36)` | Old contents exit before new contents enter; blur only on contents |
| `impact(t, at, amount=.025)` | Restrained compression and recovery |
| `edges(initial, [[at, position], ...])` | FAST leading edge, SLOW trailing edge; supports reversal |
| `routeReveal(path, start, end)` | Visible SVG arc-length segment, normalized 0–1 |
| `stagger(count, at, gap=.08)` | Deterministic onset times |
| `apply(element, state)` | Transform, opacity, blur, dimensions, radius, colors and clip path |

One writer owns each transform. Use nested wrappers for camera, travel, impact
and content replacement. `apply` writes a complete transform: combine channels
in one call. Keep the same SVG viewBox/world coordinates for route and packet
wrappers. Share progress for objects traveling together; use separate progress
for deliberate broadcast branches. A cursor can follow a path and use impact
at authored click cues; live mouse input never drives rendering.

## Semantic transitions

`transition(kind, t, at, duration, options)` returns state for `apply`:

| Kind | Options / use |
| --- | --- |
| `hard-cut` | Incoming opacity at the boundary; ordinary clip placement remains sufficient |
| `match-morph` | `from` / `to` numeric states on a persistent object or matched wrappers |
| `directional-push` | `direction` ±1, `distance`; outgoing wrapper uses the same displacement minus distance |
| `route-continuation` | `route: t => pose`; share path, coordinates and progress across the handoff |
| `camera-reveal` | `focus: t => {x,y,scale}`, optional `center`; share the camera across the handoff |
| `zoom-reveal` | Restrained scale-to-one reveal |
| `iris` | Optional CSS `origin`, default 50% 50%; reserve for major moments |

These are visual states, not clip scheduling. The channel assembler keeps
scene/audio windows contiguous: animate an outgoing inner wrapper and inherit
its endpoint in the next scene. For a true visual overlap, keep both visual
states inside one scene and drive their inner wrappers from one transition
time. Do not change timed-host visibility or extend host/audio windows.

See the [complete local handoffs](../examples/flow-motion/README.md#object-performances-transitions-and-depth)
and [source](../examples/flow-motion/index.html) for a foreground carrier,
covered content wipe and camera/iris composition. The source uses one 32s host;
when adapting a handoff into an assembled frame, convert its global times to
that frame's measured local cues and compose both states within that host.
The samples use existing primitives; no arbitrary SVG morphing or additional
transition scheduler is provided.

## Cue file

`motion_beats.json` uses schema `hyperframes-channel/motion-beats@1`, with
`scenes.<composition-id>` records:

```json
{
  "source": "word-alignment",
  "method": "tool/model and settings, or manual audio review",
  "review_status": "machine-aligned; listening review pending",
  "audio_sha256": "SHA-256 of the actual scene WAV",
  "cues": {"rejects": 1.2, "changes": 2.96}
}
```

The other source value is `manual-audio-review`. `scripts/motion_beats.py`
validates scene IDs, finite in-range cues and audio hashes. Import `load_beats`
in the generator and embed the scene cue map as static JSON; do not fetch it
at render time. Changed audio requires realignment, never fractional fallback.
Store raw alignment evidence in the target project's review directory and name
it in the method/provenance. `SCRIPT.md` remains canonical; use only anchor
phrases that match the actual WAV. Alignment is not proof of listening review.

`MOTION.md` owns cue intent. Cue keys name semantic events such as `rejects`,
`address_changes`, `arrives` or `detail_reveal`, not every spoken word. Reference
the same keys in storyboard rows and embed them in the scene generator. Cue
seconds mark the meaningful event: schedule anticipation before it and reaction
or settling after it as needed. All windows must fit the measured scene.
Validation proves ranges and WAV freshness, not semantic synchronization;
review the event against its spoken phrase with narration playing.

## Reference study

Studied [motion.js](https://github.com/Barty-Bart/motion-graphics/blob/main/skills/motion-broll/engine/motion.js),
[render.js](https://github.com/Barty-Bart/motion-graphics/blob/main/skills/motion-broll/engine/render.js),
[beats.js](https://github.com/Barty-Bart/motion-graphics/blob/main/skills/motion-broll/engine/beats.js),
the [API](https://github.com/Barty-Bart/motion-graphics/blob/main/skills/motion-broll/reference/engine-api.md)
and Opus examples, especially the slider and document drag.
Adapted analytic responses, persistent shapes, camera focus, staggered edges,
content replacement and temporal sampling. Kept the channel palette, Icons8,
HyperFrames compilation, per-scene WAVs and approval gates. Did not adopt the
reference's free-running preview loop, estimated word timing or branding.
Fonts in `channel/fonts` come from Google Fonts' Barlow and IBM Plex Mono
directories; their bundled OFL files govern redistribution.
