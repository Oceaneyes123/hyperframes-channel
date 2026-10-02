# HyperFrames motion library

Use this catalog after `MOTION.md`. The installed `.agents/skills/motion-design/`
skill supplies deeper choreography, Disney principles, timing, and quality
guidance. `MOTION_API.md` owns primitives and the paused GSAP contract.
`motion-presets.js` supplies optional pure samplers under `ChannelMotionPresets`
(`P` below). Every time is a **scene-local second**. Call samplers only from
`ChannelMotion.mount(timeline, duration, draw)`; apply each pose to a dedicated,
composition-scoped wrapper. Do not let two samplers write one transform.

## Direct the beat first

Choose one hero action, its cause, receiving object's reaction, readable end
state, and continuity into the next scene. Use anticipation, action, reaction,
follow-through, and settle only when each phase helps. For new videos, use the
clear, playful direction in `MOTION.md`: decisive easing, expressive object
behavior, selective overshoot and readable depth. Use one dominant motion event per attention beat. Related
actions may overlap; let the result settle before another strong event.

Starting ranges: primary action 100–350 ms, accent 100–180 ms, hero transition
300–500 ms, stagger gap 30–60 ms, reaction delay 50–150 ms, readable settle
100–200 ms. Scale for distance, weight, narration, and comprehension. Exits
normally take about 65–75% of comparable entrances. An important object should
move or transform; opacity alone does not explain it. Ambient motion is optional.

## Preset contract

| Preset | Purpose and use | Avoid when / continuity | Parameters and character |
| --- | --- | --- | --- |
| `P.entrance` | Slide/reveal, scale/pop, directional, arc, mask, impact, foreground pass-in. Introduce an object after its context. | Avoid reintroducing a persistent object or using an entrance as the causal event. Start at an established position. | `{at,duration,from:{x,y},scale,kind,arc}`; `kind`: `slide`, `scale`, `mask`, `arc`, `impact`, `foreground`. Ease out; `arc` adds a restrained perpendicular bow. |
| `P.exit` | Directional departure, collapse, destination transfer, mask, accelerated exit, foreground pass-out. | Avoid unexplained disappearance; match destination and next scene's inherited start. | `{at,duration,to:{x,y},scale,kind}`; `kind`: `directional`, `collapse`, `transfer`, `mask`, `accelerated`, `foreground`. Ease in; default 190 ms. |
| `P.stagger` | Order a related group: sequential, reverse, center-out, wave, or seeded organic. Feed returned onsets into entrance or state samplers. | Avoid making every object equally strong or stretching a group beyond its narration window. | `{count,at,gap,order,seed}` returns frozen times by source index; default gap 45 ms. Same easing family for siblings. |
| `P.emphasis` | Pulse, restrained impact/compression, success, warning, receiver, ripple, shake, glow, highlight. Direct attention after a cause. | Avoid decoration before its cause. `glow`/`highlight` return a normalized `glow` value for an authored light layer; do not apply it as a CSS property. | `{at,duration,kind,amount}`; amount ≤10%; impact uses `M.impact`. Other accents settle to neutral. |
| `P.stateChange` | Object state transformation, value/label change, comparison result, acceptance/rejection color. | Avoid turning the entity into its value. Preserve object identity and equal property sets. | `{at,duration,from,to,profile}` uses `M.state`; numeric channels and six-digit colors. Default FAST. |
| `P.route` | Packet travel, route drawing, continuation, retrace, branching leg. | Path and packet must share SVG world coordinates. Reuse endpoint pose at cuts. | `{path,at,duration,from,to,rotate}`; returns `{packet,route,progress}`. Draw route with `M.routeReveal(el, route.start, route.end)`. Reverse `from/to` for response. |
| `P.transfer` | Request to receiver, device transfer, connection establishment, arrival reaction. | Set `receiverAt` to actual arrival; never show success early. | Route parameters plus `receiverAt`, `receiverAmount`; returns route pose and receiver compression. Default reaction at arrival. |
| `P.requestResponse` | Outbound request and reply retracing the same route. | Response begins after arrival; preserve packet/endpoint identity. | `{path,requestAt,requestDuration,responseAt,responseDuration}` returns `{request,response}`; each leg has a separate wrapper. |
| `P.broadcast` | Branching travel from one source to several receivers. | Receivers react separately on arrival; avoid a competing burst on every branch. | `{paths,at,duration,gap,order}` returns an array of route poses, one per path. |
| `P.camera` | Follow object, push-in, pull-out, focus shift, camera reveal. | Move only to teach or guide attention. Preserve legibility and endpoint framing. | `{at,duration,from:{x,y,scale},to:{x,y,scale},center}` returns world transform via `M.camera`; smooth travel. |
| `P.counter` | Subtle background counter-motion, parallax and depth. | Do not counter an unrelated motion or attach to the same transform wrapper as hero. | `{hero,ratio}`; negative ratio counters hero, default −0.2. Midground ~0.5, background ~0.2 relative displacement. |
| `P.ambient` | Low-energy breathing after setup. | Omit if the explanation works better still. Never put vital information only in ambient motion. | `{at,period,amount,phaseOffset}`; scene-time sine, maximum ±3% scale. |
| `P.transition` | Existing low-level transition state with a checked time window. | Do not substitute an effect for continuity. Match geometry and direction across the cut. | `{kind,at,duration,...options}` delegates to `M.transition`; see `MOTION_API.md`. |
| `P.compose` | Combine named samplers into one scene-local result, including nested recipes. | Each returned pose needs its own wrapper or an explicit state merge. | `{name: sampler}` returns `t => {name: pose}`. |

The entrance and exit `kind` names describe intent. `impact` and `foreground`
entrances use the same restrained transform shape as scale or slide; place a
separate foreground wrapper or receiver reaction when that meaning matters.
`mask` writes `clipPath` and should be reserved for a reveal boundary.

## Technical explanation recipes

These are compositions of the preset contract, not extra engine methods:

| Story event | Recipe and continuity |
| --- | --- |
| Packet, route, response | `P.requestResponse` retraces the same path. Keep the packet and endpoint IDs. |
| Request, receiver reaction | `P.transfer`; begin destination state change at `receiverAt`, then hold the resulting state. |
| Branching or broadcast | `P.broadcast` staggers route legs. A shared source reacts once; destinations react on their own arrivals. |
| Encapsulation | `P.stateChange` the wrapper or lock around the same persistent request, then `P.route` that request. Show removal only at the correct endpoint. |
| Connection establishment | Directional request, receiver reaction, return route, then `P.stateChange` both endpoints to established. |
| Transformation, split, merge | Keep a parent ID; `P.stateChange` parent state and `P.entrance`/`P.exit` child wrappers toward measured endpoints. Split follows cause; merge resolves into one visible object. |
| Comparison and decision | `P.stagger` options, move evidence toward the deciding point, `P.emphasis` the selected or rejected path, `P.stateChange` the consequence. |
| Data/value change | `M.swap` for old/new contents with `P.stateChange` on the persistent container. Keep exact values readable. |
| Focus on detail | `P.camera` to the named detail, `P.emphasis` after arrival, then a readable hold. |

## Playful explanation recipes

These are authoring plans using existing primitives, not new preset methods.
Keep the channel's visual identity and exact technical conditions. Timing comes
from the narration cues, not a fixed gag duration.

| Treatment | Hero action, reaction and useful result | Existing implementation |
| --- | --- | --- |
| Effort and release | Object draws back, pushes or hops, lands, then settles; use to reveal an obstacle or breakthrough. | Key authored poses through the existing mounted draw function; separate travel, artwork and shadow wrappers. `P.entrance` with `arc` can support travel; `P.emphasis` supports a restrained landing. |
| Rejection gag | Object approaches a barrier, is checked, stops or recoils; barrier and object settle in the rejected state. | `P.route`/`P.transfer`, then a cue-driven reverse leg and `P.stateChange`; reaction follows the check, never precedes it. |
| Unfold / cutaway | Persistent container opens; contents spread to reveal the relationship; reassemble around the same identity. | `P.stateChange`, `P.stagger`, measured child transforms and `P.camera`; use same-topology `M.geometry` where appropriate. |
| Stack / compact / expand | Repeated items gather into a stack or fan apart; preserve counts and show what changed. | `P.stagger` plus authored target poses and `P.stateChange`; an encryption metaphor must not imply size compression. |
| Demonstrate, adjust, retry | Show an actual failure condition, change one visible parameter, repeat the action, reveal the changed result. | Reuse the same objects and separate cue windows. Compute claimed results from the real model; use a staged metaphor when no simulation is needed. |
| Prop acting | A device or illustrated prop turns toward evidence, hesitates, tries and reacts to the outcome. | Pose local parts on pivot wrappers inside `ChannelMotion.mount`; keep labels on rigid wrappers and avoid implying autonomous decisions. |
| Object wipe / visual rhyme | A meaningful foreground object carries the movement into a new view; the same shape or entity anchors the next opening. | Dedicated foreground wrapper, `P.transition` and matched endpoint poses; no unexplained disappearance. |
| Value as object | An exact number grows, splits or changes as the quantity changes, then holds for reading. | `M.swap`/authored numeric state and `P.stateChange`; rigid readable digits, no transcript or decorative title sequence. |

For cut-paper or illustrated staging, use layered local assets, pivoted parts
and `P.counter` for depth. Do not add a physics library, 3D engine or character
framework merely to obtain bounce or parallax. Custom artwork deformation can
be authored in the existing draw callback; current presets do not provide a
complete rig or arbitrary SVG morph. Keep it a pure function of scene time.

## Camera, depth, and transitions

Use separate nested wrappers for world camera, object travel, contents, and
impact. For parallax or foreground/background counter-motion, use `P.counter`
on distinct layers. Focus shift uses `P.camera` between two world points; depth
transition combines camera scale and small counter-motion on separate layers.

| Continuity transition | Implementation |
| --- | --- |
| Hard cut | `P.transition({kind:'hard-cut',...})` or ordinary contiguous clip placement. New concept or contradiction. |
| Match cut / shared element / match morph | Persist the object ID and endpoint pose; use `match-morph` for equal numeric properties. |
| Directional push / foreground pass-by / object wipe | `directional-push` on a separate inner wrapper; an authored foreground object can carry the same direction across the cut. |
| Mask reveal / scale-to-fill / zoom through object | Use `P.entrance({kind:'mask'})`, `zoom-reveal`, or a camera scale on an object-aligned wrapper. Start next scene at the reached focal point. |
| Camera follow / camera reveal | Preserve world coordinates and focus; `camera-reveal` or `P.camera` continues the same move. |
| Route continuation / line-follow | `route-continuation` with the same SVG path and progress, or two `P.route` legs sharing an exact endpoint. |
| Transformation / morph | `match-morph` or `P.stateChange` on the persistent object's state. Same-topology SVG geometry uses `M.geometry`. |
| Iris | `iris` only for a major reveal with a meaningful focal origin. |

Scene hosts remain contiguous. For motion that visually overlaps two ideas,
compose both inner visual states inside one scene. At a cut, the next scene's
local time zero inherits the prior endpoint: same object, route, direction,
scale, semantic color, or focal point. Never rely on a free-running clock.

## Choreography templates

- **Transfer:** anticipation near source; launch route and packet together;
  destination reacts at arrival; show consequence; settle 100–200 ms.
- **Transformation:** focus existing object; change its state; supporting
  objects respond; hold the new state. Keep the object ID.
- **Reveal:** reduce context; hero emerges; supporting elements react 50–150 ms
  later; hold long enough to read.
- **Decision:** stage options, move evidence, react at one path, show rejection
  or acceptance, then consequence.
- **Journey:** launch object, follow with camera or route, expose intermediate
  change, arrive, show receiver response.
- **Impact:** quick action, receiver compression, smaller ripple or counter
  motion, then fast settle.

For larger movement, change speed, path, state, or camera within roughly a
third of the canvas. Do not enforce that heuristic mechanically on technical
routes. Use fast action against stillness, wide against close, dense against
simple. A hold after a reveal can be the clearest part of the sequence.

## Example

For complete playful technical-flow implementations and articulated local art,
see the [flow-motion guide](../examples/flow-motion/README.md) and
[source](../examples/flow-motion/index.html): rejection, packet cutaway, file assembly
and a cache hit. These silent seekable examples use this runtime; their authored
timings must be replaced by actual narration cues in production. Artwork layers
and pivot points are documented there and staged by `sync_channel_assets.py`.
The same example demonstrates material-specific body acting, foreground packet
handoffs, full-frame content wipes, composited zoom reveals, planted/contact
shadows, drawer occlusion and selective parallax. Reuse the relevant authored
sequence and layer structure when those actions explain the subject. Transition
samplers alone do not supply the outgoing scene: compose both states, preserve
matched endpoints and inspect the actual middle of the handoff.
The example is one timed 32s composition: its global windows are authored
demonstration times. In production frames use measured scene-local cues and
the storyboard's adaptation fields; the example's effect count, four-action
sequence and eight-second slots are not additional channel rules.

```js
const root = document.querySelector('[data-composition-id="line-2"]');
const q = selector => root.querySelector(selector);
const M = ChannelMotion, P = ChannelMotionPresets;
const send = P.transfer({path: q('.route'), at: cues.launch,
  duration: .42, receiverAt: cues.arrives});
const world = P.camera({at: cues.launch, duration: .42,
  from: {x: 280, y: 940, scale: 1}, to: {x: 800, y: 940, scale: 1.12}});
const timeline = gsap.timeline({paused: true});
M.mount(timeline, measuredDuration, t => {
  const pose = send(t);
  M.apply(q('.world'), world(t));
  M.apply(q('.packet'), pose.packet);
  M.routeReveal(q('.route'), pose.route.start, pose.route.end);
  M.apply(q('.receiver-impact'), pose.receiver);
});
window.__timelines['line-2'] = timeline;
```

Review onset, midpoint, arrival, reaction, settle, camera extrema, and both
sides of cuts. Sample backward and random scene times. Remove simultaneous
strong movements, repeated generic entrances, excessive bounce, fade-heavy
handoffs, purposeless camera moves, effects before causes, absent receiver
reactions, and transitions that break object identity. `VERIFY.md` owns evidence
and approval; a passing numeric test does not approve rendering.
