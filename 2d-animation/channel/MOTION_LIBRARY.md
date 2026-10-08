# HyperFrames motion library

Use this catalog after `MOTION.md`. The installed `.agents/skills/motion-design/`
skill supplies deeper choreography, Disney principles, timing, and quality
guidance. `MOTION_API.md` owns primitives and the paused GSAP contract.
`motion-presets.js` supplies optional pure samplers under `ChannelMotionPresets`
(`P` below). Every time is a **scene-local second**. Call samplers only from
`ChannelMotion.mount(timeline, duration, draw)`; apply each pose to a dedicated,
composition-scoped wrapper. Do not let two samplers write one transform.

**On this page**

- [Direct the beat first](#direct-the-beat-first)
- [Preset contract](#preset-contract)
- [Technical explanation recipes](#technical-explanation-recipes)
- [Playful explanation recipes](#playful-explanation-recipes)
- [Camera, depth, and transitions](#camera-depth-and-transitions)
- [Reusable choreography scores](#reusable-choreography-scores)
- [Example](#example)

## Direct the beat first

Choose one hero action, its cause, receiving object's reaction, readable end
state, and continuity into the next scene. Use anticipation, action, reaction,
follow-through, and settle only when each phase helps. For new videos, use the
clear, playful direction in `MOTION.md`: decisive easing, expressive object
behavior, selective overshoot and readable depth. Use one dominant motion event per attention beat. Related
actions may overlap; let the result settle before another strong event.

### Timing starting points

Choose timing by role, then replace estimates with narration cues:

| Role | Starting range | Adaptation |
| --- | --- | --- |
| Accent or delayed part | 100–250 ms; lag 50–150 ms | Secondary punctuation, not the whole explanation. Keep it visible at output fps. |
| Transfer or simple state change | 350–900 ms | Derive arrival from the cue. Increase travel time for distance or a heavy prop. |
| Cutaway, assembly or major transformation | 0.8–1.6 s per action | Link several actions across the narration; do not compress the mechanism into a UI transition. |
| Motivated camera reframe or composited handoff | 0.6–1.2 s | Settle before exact reading; preserve the focal object throughout. |
| Comprehension hold | As long as the actual content requires | 100–200 ms can separate gestures, but is not a reading-time allowance. |

These are authoring starting points, not validator limits or preset defaults.
`M.state` springs use physical seconds: increasing their settle window alone
does not proportionally slow their initial motion. Use `P.camera`, `M.travel`
or a smooth progress track for duration-scaled travel; inspect the actual middle.
Ambient follows `MOTION.md`'s backdrop and quiet-window direction.

## Preset contract

### `P.entrance`

- **Purpose and use:** Slide/reveal, scale/pop, directional, arc, mask, impact, foreground pass-in. Introduce an object after its context.

- **Avoid when / continuity:** Avoid reintroducing a persistent object or using an entrance as the causal event. Start at an established position.

- **Parameters and character:** `{at,duration,from:{x,y},scale,kind,arc}`; `kind`: `slide`, `scale`, `mask`, `arc`, `impact`, `foreground`. Ease out; `arc` adds a restrained perpendicular bow.

### `P.exit`

- **Purpose and use:** Directional departure, collapse, destination transfer, mask, accelerated exit, foreground pass-out.

- **Avoid when / continuity:** Avoid unexplained disappearance; match destination and next scene's inherited start.

- **Parameters and character:** `{at,duration,to:{x,y},scale,kind}`; `kind`: `directional`, `collapse`, `transfer`, `mask`, `accelerated`, `foreground`. Ease in; default 190 ms.

### `P.stagger`

- **Purpose and use:** Order a related group: sequential, reverse, center-out, wave, or seeded organic. Feed returned onsets into entrance or state samplers.

- **Avoid when / continuity:** Avoid making every object equally strong or stretching a group beyond its narration window.

- **Parameters and character:** `{count,at,gap,order,seed}` returns frozen times by source index; default gap 45 ms. Same easing family for siblings.

### `P.emphasis`

- **Purpose and use:** Pulse, restrained impact/compression, success, warning, receiver, ripple, shake, glow, highlight. Direct attention after a cause.

- **Avoid when / continuity:** Avoid decoration before its cause. `glow`/`highlight` return a normalized `glow` value for an authored light layer; do not apply it as a CSS property.

- **Parameters and character:** `{at,duration,kind,amount}`; amount ≤10%; impact uses `M.impact`. Other accents settle to neutral.

### `P.stateChange`

- **Purpose and use:** Object state transformation, value/label change, comparison result, acceptance/rejection color.

- **Avoid when / continuity:** Avoid turning the entity into its value. Preserve object identity and equal property sets.

- **Parameters and character:** `{at,duration,from,to,profile}` uses `M.state`; numeric channels and six-digit colors. Default FAST.

### `P.route`

- **Purpose and use:** Packet travel, route drawing, continuation, retrace, branching leg.

- **Avoid when / continuity:** Path and packet must share SVG world coordinates. Reuse endpoint pose at cuts.

- **Parameters and character:** `{path,at,duration,from,to,rotate}`; returns `{packet,route,progress}`. Draw route with `M.routeReveal(el, route.start, route.end)`. Reverse `from/to` for response.

### `P.transfer`

- **Purpose and use:** Request to receiver, device transfer, connection establishment, arrival reaction.

- **Avoid when / continuity:** Set `receiverAt` to arrival or a later processing cue; earlier reactions are rejected.

- **Parameters and character:** Route parameters plus `receiverAt`, `receiverAmount`; returns route pose and receiver compression. Default reaction at arrival.

### `P.requestResponse`

- **Purpose and use:** Outbound request and reply retracing the same route.

- **Avoid when / continuity:** Response begins after arrival; preserve packet/endpoint identity.

- **Parameters and character:** `{path,requestAt,requestDuration,responseAt,responseDuration}` returns `{request,response}`; each leg has a separate wrapper.

### `P.broadcast`

- **Purpose and use:** Branching travel from one source to several receivers.

- **Avoid when / continuity:** Receivers react separately on arrival; avoid a competing burst on every branch.

- **Parameters and character:** `{paths,at,duration,gap,order}` returns an array of route poses, one per path.

### `P.camera`

- **Purpose and use:** Follow object, push-in, pull-out, focus shift, camera reveal.

- **Avoid when / continuity:** Move only to teach or guide attention. Preserve legibility and endpoint framing.

- **Parameters and character:** `{at,duration,from:{x,y,scale},to:{x,y,scale},center}` returns world transform via `M.camera`; smooth travel.

### `P.counter`

- **Purpose and use:** Subtle background counter-motion, parallax and depth.

- **Avoid when / continuity:** Do not counter an unrelated motion or attach to the same transform wrapper as hero.

- **Parameters and character:** `{hero,ratio}`; negative ratio counters hero, default −0.2. Midground ~0.5, background ~0.2 relative displacement.

### `P.ambient`

- **Purpose and use:** Low-energy breathing after setup.

- **Avoid when / continuity:** Omit if the explanation works better still. Never put vital information only in ambient motion.

- **Parameters and character:** `{at,period,amount,phaseOffset}`; scene-time sine, maximum ±3% scale.

### `P.transition`

- **Purpose and use:** Existing low-level transition state with a checked time window.

- **Avoid when / continuity:** Do not substitute an effect for continuity. Match geometry and direction across the cut.

- **Parameters and character:** `{kind,at,duration,...options}` delegates to `M.transition`; see `MOTION_API.md`.

### `P.compose`

- **Purpose and use:** Combine named samplers into one scene-local result, including nested recipes.

- **Avoid when / continuity:** Each returned pose needs its own wrapper or an explicit state merge.

- **Parameters and character:** `{name: sampler}` returns `t => {name: pose}`.

### Scope and limitations

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

### Effort and release

- **Hero action, reaction and useful result:** Object draws back, pushes or hops, lands, then settles; use to reveal an obstacle or breakthrough.

- **Existing implementation:** Key authored poses through the existing mounted draw function; separate travel, artwork and shadow wrappers. `P.entrance` with `arc` can support travel; `P.emphasis` supports a restrained landing.

### Rejection gag

- **Hero action, reaction and useful result:** Object approaches a barrier, is checked, stops or recoils; barrier and object settle in the rejected state.

- **Existing implementation:** `P.route`/`P.transfer`, then a cue-driven reverse leg and `P.stateChange`; reaction follows the check, never precedes it.

### Unfold / cutaway

- **Hero action, reaction and useful result:** Persistent container opens; contents spread to reveal the relationship; reassemble around the same identity.

- **Existing implementation:** `P.stateChange`, `P.stagger`, measured child transforms and `P.camera`; use same-topology `M.geometry` where appropriate.

### Stack / compact / expand

- **Hero action, reaction and useful result:** Repeated items gather into a stack or fan apart; preserve counts and show what changed.

- **Existing implementation:** `P.stagger` plus authored target poses and `P.stateChange`; an encryption metaphor must not imply size compression.

### Demonstrate, adjust, retry

- **Hero action, reaction and useful result:** Show an actual failure condition, change one visible parameter, repeat the action, reveal the changed result.

- **Existing implementation:** Reuse the same objects and separate cue windows. Compute claimed results from the real model; use a staged metaphor when no simulation is needed.

### Prop acting

- **Hero action, reaction and useful result:** A device or illustrated prop turns toward evidence, hesitates, tries and reacts to the outcome.

- **Existing implementation:** Pose local parts on pivot wrappers inside `ChannelMotion.mount`; keep labels on rigid wrappers and avoid implying autonomous decisions.

### Object wipe / visual rhyme

- **Hero action, reaction and useful result:** A meaningful foreground object carries the movement into a new view; the same shape or entity anchors the next opening.

- **Existing implementation:** Dedicated foreground wrapper, `P.transition` and matched endpoint poses; no unexplained disappearance.

### Value as object

- **Hero action, reaction and useful result:** An exact number grows, splits or changes as the quantity changes, then holds for reading.

- **Existing implementation:** `M.swap`/authored numeric state and `P.stateChange`; rigid readable digits, no transcript or decorative title sequence.

For cut-paper or illustrated staging, use layered local assets, pivoted parts
and `P.counter` for depth. Do not add a physics library, 3D engine or character
framework merely to obtain bounce or parallax. Custom artwork deformation can
be authored in the existing draw callback; current presets do not provide a
complete rig or arbitrary SVG morph. Keep it a pure function of scene time.

## Camera, depth, and transitions

Choose the **relationship** before choosing the transition. These are channel
adaptations of the [research](MOTION_DESIGN_RESEARCH.md), not extra presets:

| Relationship between ideas | Transition choice | Meaning to preserve |
| --- | --- | --- |
| Same entity, changed state | Continuous transformation or matched pose | Retain identity and a readable intermediate form |
| Outside to inside | Open/cutaway, mask or motivated push-in | Retain a boundary/landmark so the interior belongs to the same object |
| One event continues elsewhere | Route-follow or directional handoff | Retain direction and an understood destination |
| Two alternatives | Aligned reveal, split view or matched framing | Keep shared baselines/scale; do not imply one alternative becomes the other |
| Detail to larger context | Pull-back with the detail retained | Explain where it fits before another action takes attention |
| New topic or deliberate contrast | Clear cut with established new focal point | Do not invent continuity with an ornamental morph |

### Container transformations

For a container transformation, stagger dimensions or edges only when the form
benefits. Keep contents on a separate rigid wrapper. Make a real split begin
from the parent and a merge finish at the joining boundary; a dissolve does
not demonstrate either. Use equal-topology geometry only where it applies.
This adapts [Material's transformation examples](https://m1.material.io/motion/transforming-material.html).

### Wrappers and parallax

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

### Scene boundaries and overlapping states

Scene hosts remain contiguous. For motion that visually overlaps two ideas,
compose both inner visual states inside one scene. At a cut, the next scene's
local time zero inherits the prior endpoint: same object, route, direction,
scale, semantic color, or focal point. Never rely on a free-running clock.

## Reusable choreography scores

Each score composes existing samplers; these names are **not new API methods**.
Choose a score from the explanatory problem, then put its actions, supporting
layers and cue anchors in the storyboard's one action table. Keep only useful
phases. Paths, poses and counts come from `frame.md`, not this catalog.

### Follow, inspect, return — a journey contains a hidden operation

Establish source and destination; launch the persistent object; follow it into
a detail view; stop to expose the operation; resume travel; reveal the changed
destination and widen to show the original context with its new state.

Use `P.route` for each continuous leg, `P.camera` for framing and `M.state` for
the internal change. Keep camera, travel, body and labels on separate wrappers.
Attach the environment to a slower depth plane; delay a local part/shadow
response behind the dominant action. A route reveal and its traveler share
progress. Do not move the camera during exact reading or reset the world when
returning wide. Review launch, detail arrival, operation, destination and return.

### Open, separate, explain, reassemble — reveal hidden structure

An existing container prepares and opens; parts emerge through its opening,
fan to readable positions, and reveal their relationships. Shift emphasis as
each part is explained; return parts before closing the container. Retain a
useful changed state if the narration changes its contents.

Use `M.track` for a hinge, `M.state` for part poses and `P.stagger` only when
the order is not already dictated by individual phrase cues. Keep the front
occluder above contained parts until they emerge. Hide exact labels during
travel only if the labels are not yet needed; settle them beside readable
parts. See the flow example's `flap`, `headerPose`, `dataPose` and `unfolding`.
Review the half-open pose and the return path, not just the exploded layout.

### Evidence, test, branch — an animated decision diagram

Bring one visible piece of evidence to a criterion; align matching fields;
show the actual match or mismatch; activate the chosen branch; move the same
subject along that branch; let the receiver react. Preserve the unchosen
branch quietly enough that the comparison remains understandable.

Use `P.stateChange` for alignment/condition, `M.routeReveal` for the selected
edge and `P.transfer` for the consequence. Keep exact values rigid; matched
fields may share a short accent after the test. A badge alone is not a test.
For a retry, visibly change the relevant condition and replay the same staging.
Never imply that green/red identifies intrinsically safe/unsafe content.

### Assemble, load, release — make accumulation visible

Establish the destination silhouette; bring parts from their meaningful origins;
let each land with a small reaction; show accumulated progress; allow the last
required arrival to trigger completion; carry the completed object forward.

Use one `M.state`/`P.route` per part and `P.emphasis` on an inner body at its
arrival. Tighten its contact shadow as it lands. Compute completion from the
last required arrival, not the first launch or a generic percentage of duration.
For a queue, show waiting and release without inventing extra items. See the
flow example's `pieces`, `landings` and `assembly`; its four parts and .32s gap
are illustrative. Check intermediate counts and that completion is not early.

### Align, transform, compare — explain a difference without two slides

Keep a shared landmark; align the two states at the same scale; change only the
property being compared; expose the difference through a sliding mask, overlay
or separation; hold the result, then promote the relevant state to the hero.

Use `P.stateChange` for numeric geometry/colors, `M.geometry` for equal-topology
points and an authored `clipPath` for reveals. Use `M.swap` for different text
or artwork topology. A crossfade is a replacement, not a shape morph. Preserve
semantic identity, baselines, units and quantities; camera scale must not fake
a measured difference. Review the actual midpoint for doubled labels or shapes.

### Carry, cover, reveal — connect ideas through a visible object

Move the outgoing hero to a shared focal pose, or bring a meaningful foreground
object across the view. Compose the incoming state underneath; switch scenes
only while covered; reveal the new relationship; settle before its explanation.

Use `P.transition` on inner wrappers and one foreground carrier. A match uses
identical outgoing/carrier/incoming bounds and exactly one visible hero. A wipe
must cover all viewport corners at the switch. A zoom-through uses a named
focal origin, a mask and two composed states. Inspect both sides of the cut and
its middle; review velocity as well as pose. A shared pose can still conceal a
hard stop. See `match`, `sweep`, `pushIn`, `pullOut` and `reveal` in the flow example.

### Layer a shot without adding competing events

| Layer | Ownership and behavior | Quiet/reading state |
| --- | --- | --- |
| Environment | Topic-specific silhouettes/light; shared scene clock; slower camera-related displacement | Stop or reduce contrast/amplitude before dense evidence |
| Action plane | One dominant causal operation, including coordinated groups | Retain the result instead of re-entering |
| Secondary parts | Hinge, trailing seal, shadow or receiving surface follows its cause | Settle slightly after the hero |
| Foreground | Optional occluder or carrier with explicit coverage | Leave the evidence unobstructed |
| Labels/values | Rigid wrapper; fixed screen placement when a camera would break readability | Fully readable and stable |

`P.counter` supplies displacement, not a depth renderer. On sibling planes,
positive ratios follow the same direction at reduced displacement; a negative
ratio counters it. Inside a transformed world, that local offset is transformed
again: inspect zoom extrema rather than assuming a ratio produces physical
parallax. Do not apply two camera transforms to the same layer.

## Example

### Adapt the local example

For complete playful technical-flow implementations and articulated local art,
see the [flow-motion guide](../examples/flow-motion/README.md) and
[source](../examples/flow-motion/index.html): rejection, packet cutaway, file assembly
and a cache hit. These silent seekable examples use this runtime; their authored
timings must be replaced by actual narration cues in production.

Artwork layers
and pivot points are documented there and staged by `sync_channel_assets.py`. The same example demonstrates material-specific body acting, foreground packet
handoffs, full-frame content wipes, composited zoom reveals, planted/contact
shadows, drawer occlusion and selective parallax. Reuse the relevant authored
sequence and layer structure when those actions explain the subject.

Transition
samplers alone do not supply the outgoing scene: compose both states, preserve
matched endpoints and inspect the actual middle of the handoff. The example is one timed 32s composition: its global windows are authored
demonstration times. In production frames use measured scene-local cues and
the storyboard's adaptation fields; the example's effect count, four-action
sequence and eight-second slots are not additional channel rules.

```js
const root = document.querySelector('[data-composition-id="line-2"]');
const q = selector => root.querySelector(selector);
const M = ChannelMotion, P = ChannelMotionPresets;
const send = P.transfer({path: q('.route'), at: cues.launch,
  duration: cues.arrives - cues.launch});
const world = P.camera({at: cues.launch, duration: cues.arrives - cues.launch,
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

### Sample and review

Review onset, midpoint, arrival, reaction, settle, camera extrema, and both
sides of cuts. Sample backward and random scene times. Remove simultaneous
strong movements, repeated generic entrances, excessive bounce, fade-heavy
handoffs, purposeless camera moves, effects before causes, absent receiver
reactions, and transitions that break object identity. `VERIFY.md` owns evidence
and approval; a passing numeric test does not approve rendering.
