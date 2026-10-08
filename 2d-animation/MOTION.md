# Motion and attention grammar

This file owns attention beats, motion lifecycle, easing, momentum, rhythm,
continuity and camera direction. `DESIGN.md` owns visual identity; `BUILD.md`
owns the timeline contract; `channel/MOTION_API.md` documents the shared API.
Use `channel/MOTION_LIBRARY.md` for reusable recipes. For significant choreography,
timing, easing, animation or transition decisions, consult the installed
`.agents/skills/motion-design/SKILL.md` and its relevant references. Keep this
file's channel-specific creative rules as the final direction; trivial edits
do not need the full skill.

**On this page**

- [Apply the motion-design skill to narrated film](#apply-the-motion-design-skill-to-narrated-film)
- [Direct shots before choosing effects](#direct-shots-before-choosing-effects)
- [Craft principles from established animation](#craft-principles-from-established-animation)
- [Plan attention beats inside scenes](#plan-attention-beats-inside-scenes)
- [Sustained animation across the whole video](#sustained-animation-across-the-whole-video)
- [Animated backgrounds and supporting detail](#animated-backgrounds-and-supporting-detail)
- [Playful text performance](#playful-text-performance)
- [Direct important motion](#direct-important-motion)
- [Continuity and camera](#continuity-and-camera)
- [Visual rhythm](#visual-rhythm)
- [Engaging and playful direction for future videos](#engaging-and-playful-direction-for-future-videos)
- [Scene archetypes](#scene-archetypes)
- [Narration cues and implementation](#narration-cues-and-implementation)

## Apply the motion-design skill to narrated film

Read the skill's [choreography](.agents/skills/motion-design/director/choreography.md)
and [Disney principles](.agents/skills/motion-design/director/disney-principles.md)
for significant performances. Use its timing reference only to choose a starting
character, then adapt to the measured narration. Record the chosen principles
in the storyboard's recipe/adaptation field; naming the skill is not direction.

The skill primarily addresses interactive UI. These channel rules override its
generic rules when authoring narrated scenes:

| Generic skill advice | Channel interpretation |
| --- | --- |
| Short UI durations and a stagger budget below 500 ms | Time explanatory actions to speech and distance. A multi-step assembly may take several seconds; preserve each cause and arrival. Use short timings for accents. |
| Always animate primary, secondary and ambient layers | Design all layers, but only animate those serving the beat. Supporting motion yields during exact comparisons and comprehension pauses. |
| Only one third of elements may move; travel at most one third of the screen | Budget competing **attention**, not element counts. A coordinated group can move as one event; a long route can remain continuous. |
| Never linear spatial motion | Ease starts/stops for object performance. Constant-speed transport or a measured sweep may be linear when that behavior is the explanation. |
| One entrance pattern; elements enter from one direction | Keep a consistent material/easing language. Spatial origins, interactions and semantic transitions determine direction; do not repeat the same reveal for every idea. |
| UI percentage-based setup/action/resolution | Use phrase cues and causal dependencies, not percentages of a WAV. Comprehension time is authored, not the leftover interval. |

## Direct shots before choosing effects

Within a scene, choose **context → detail → changed context** when the mechanism
needs it. A shot is a framing/attention choice inside the existing scene, not
another audio track or timed host. A locked camera with interacting objects is
also a shot. Identify the decisive visual moment first, then stage the approach
and the state it leaves behind. Cinematic quality comes from staging, rhythm,
weight and continuity; blur, shake and constant zoom are not requirements.

- **Compose the action:** reserve its travel and reaction space, not just the
  initial pose. Use silhouette, scale, negative space and occlusion to make the
  hero readable under `DESIGN.md`. Show the decisive pose at phone size.
- **Pass attention:** finish or reduce one strong event as the next takes over.
  Secondary parts may lag the hero and settle across this handoff. Do not stop
  every layer at once, or start every action with all objects fading in.
- **Stage depth:** distinguish environment, action plane and an optional
  foreground occluder. Give each a role and consistent light/material. Parallax
  follows a motivated camera move; labels that need reading stay rigid and safe.
- **Connect ideas:** carry a shape, object, direction or focal position into the
  next view. Establish what is retained, what changes and why; a match in shape
  alone must not imply two different entities are the same object.

Across the storyboard, compare consecutive scenes' treatment, shot scale,
dominant action and transition. If they repeat, vary the explanatory operation
before adding effects: comparison becomes an aligned overlay; a list becomes
an assembly; an unseen process becomes a cutaway. Keep a repeated treatment
when it makes a deliberate comparison clearer. Design anticipation and payoffs
throughout, with quiet reading intervals between stronger performances.

At Gate 1, sketch the starting pose, decisive interaction and resulting pose
for important mechanisms, plus the middle of an occluding transition. Use the
same production assets. One attractive still cannot specify choreography.

## Craft principles from established animation

Use these decisions alongside the lifecycle below. The
[research notes](channel/MOTION_DESIGN_RESEARCH.md) distinguish source findings,
studio-specific style and our adaptations. These principles do not require a
particular model, extra effects or a photorealistic/3D look.

| Principle | Authoring decision | Failure to fix |
| --- | --- | --- |
| Timing is not spacing | Place the event in time, then design how displacement is distributed between poses. Protect the decisive pose; shorten uninformative travel when appropriate. Inspect at output fps. | Every move has the same speed profile, or a long ease spends most of its time almost stopped. |
| Design the breakdown | Between key poses, choose which part leads, the arc, clearance and silhouette. Add an authored intermediate pose when interpolation crosses evidence or loses the intended action. | Correct endpoints connected by an ugly, unreadable or mechanically implausible middle. |
| Material controls response | Specify whether the prop is rigid, hinged, elastic or fluid. A contact can redirect/compress the body; dependent parts settle later. Preserve apparent volume for elastic acting unless changing quantity is the lesson. | Every object bounces identically, a rigid device stretches, or all parts stop together. |
| Establish behavior, then vary it | Give recurring actions a consistent direction, weight and reaction. Use a deliberate exception to express a new condition; keep ordinary operations quieter than the payoff. | Random easing/direction changes, or a uniform level of excitement that makes the payoff indistinguishable. |
| Carry the viewer's gaze | Place the next important subject near the outgoing focal region or visibly lead attention to it. If a cut deliberately relocates focus, establish the new composition before its critical action. | The viewer must search the screen during a short decisive event. |
| Derive motifs from the subject | Reuse a meaningful shape, gesture or operation as ideas develop. Change its role when the explanation earns it; one motif can support different shot scales. | Unrelated visual tricks in every scene, or identical entrances used as the only form of consistency. |

Timing/pose development draws on Animation Mentor's
[timing account](https://www.animationmentor.com/blog/timing-the-12-basic-principles-of-animation/)
and [spacing workshop summary](https://www.animationmentor.com/blog/tutorial-animate-with-timing-and-spacing-in-mind/).
Material and overlap draw on [IBM's classic principles](https://www.ibm.com/design/language/animation/classic-principles/);
routine/payoff contrast adapts its [productive/expressive distinction](https://www.ibm.com/design/language/animation/overview/).
Focal handoffs adapt [Material choreography](https://m1.material.io/motion/choreography.html).
Subject-led motifs are informed by the
[Kuntzel + Deygas interview](https://www.artofthetitle.com/title/catch-me-if-you-can/).

After Gate 1, first block the approved poses against measured narration using
the existing timeline. Refine timing and spacing before adding delayed parts,
shadows, parallax or finish. Compare alternative poses or timings on the same
beat when it fails to read; keep the version that communicates better.

This is
an implementation pass inside the current workflow, not another approval gate. An intentional hold may retain subtle settling or environmental life, but its
main silhouette, exact values and point of attention must remain readable.

## Plan attention beats inside scenes

An **attention beat** is a moment when understanding or focus meaningfully
changes: an object becomes important, begins an action, transforms, reveals a
route, compares states, decides, receives an impact, reframes, shows a consequence
or settles into a short comprehension pause. A scene is the production
container, not the smallest creative unit. Use multiple meaningful beats when
its explanation needs them.

### Beat sequence and storyboard ownership

Plan **setup → anticipation → action → consequence → settle → next question**
when useful. Omit phases that do not help. Name the viewer question, scene payoff
and persistent object before planning movement. Record attention beats and
narration cues in the storyboard's single action table; do not maintain a
separate creative beat schedule.

### Choose the explanation

Choose the visual explanation in this order: **object behavior →
transformation → spatial relationship → motion / route → reaction / consequence
→ short label → longer text only as a last resort**. `DESIGN.md` owns text
restrictions. Demonstrate the mechanism rather than animating written narration.

### Comprehension holds

Avoid long periods without meaningful change unless the viewer needs time to
understand the screen. Judge a hold by content and comprehension purpose, not
a rule to change something every two or three seconds. Decoration does not
repair missing explanation. Stillness can be the strongest beat after a reveal.

## Sustained animation across the whole video

### Preserve narration and runtime

For new videos and explicitly requested redesigns, default to rich, playful
motion graphics throughout the explanation, not only in the hook, entrances
or transitions. A request for more animation or movement means more visual
storytelling within the existing narration and runtime. It does not authorize
shortening the script, accelerating speech, omitting facts or changing duration.

### Cover the full narration window

Choreograph the full narration window of every scene. While an idea develops,
show its objects comparing, unfolding, assembling, separating, transferring,
reacting or changing state; carry the result into the next beat. A scene with
one entrance followed by a long static illustration is not complete motion
direction. Start the demonstration when its explanation begins instead of
waiting for the final keyword to animate everything at once. Exact decisions
and consequences still follow their causes and measured narration cues.

### Dominant and supporting layers

Layer one dominant action with related secondary performance and a designed
background. Make weight, anticipation, follow-through and reactions visible
at phone size, rather than technically present but imperceptibly small. Vary
scale, staging, depth and transformations across the whole sequence; more
motion is not more unrelated objects moving simultaneously.

Keep short,
intentional comprehension pauses and quiet intervals around dense information. Judge activity by useful visual progression, not an effect quota or a fixed
change-every-few-seconds rule. Decorative movement cannot rescue a static
foreground explanation. Record these layers and any holds in the existing
storyboard action table, including the time after the last main action.

## Animated backgrounds and supporting detail

### Topic-specific background detail

Use the layered backdrop direction in `DESIGN.md`, with authored motion as
the default rather than an untouched solid-color canvas. Background detail
can establish setting, scale, material, depth or continuity: layered linework
reveals, restrained pattern travel, environmental shapes, purposeful parallax,
or localized light/shadow responses to a foreground event. Choose detail for
the topic and art direction, not the same drifting pattern for every video.

### Readability and quiet intervals

Keep background movement lower contrast, slower or smaller than the hero
action. It may continue gently through a simple hold, then reduce or settle
while exact values or a difficult comparison need reading. Background traces
must not look like an actual route, event or quantity unless that is what they
represent.

Avoid flashing, random particle showers, floating orbs and competing
focal points. A plain or static interval needs a clear readability or creative
reason in the storyboard, or an explicit user request; it is not the default.

### Deterministic implementation

All background and secondary motion is a deterministic function of composition
time on the same paused timeline as the foreground. Use seeded variation when
needed, composition-scoped layers and local assets; no wall-clock animation,
unseeded randomness or independent CSS loops. Preserve continuity at cuts and
inspect background extrema and backward seeks as well as the hero action.

## Playful text performance

### Cue-driven performance

Animate necessary text under `DESIGN.md`'s text contract. When narration names
a relevant label or value, it can pop with a small overshoot, snap into its
object, reveal through a mask, assemble as a short word or briefly react to
the corresponding event. Select the performance from the meaning, not a
uniform bounce on every word. Cue it to the spoken phrase or causal change,
then settle into a readable pose and leave when its purpose ends.

### Rigid glyphs and exact values

Rigid labels means undistorted glyphs and unchanged technical values, not
unanimated text groups. Whole groups may translate, scale or briefly rotate
without inheriting a prop's squash/stretch. Exact digits and identifiers must
not scramble, reorder or appear to change unless the explained value changes.
Keep text within the safe area and legible throughout its performance; do not
animate continuously while it must be read. This does not enable captions,
transcript duplication, extra titles or text added only to obtain an effect.

## Direct important motion

Evaluate **Anticipation → Action → Reaction → Follow-through → Settle** where
useful, without forcing all five phases onto every small change:

- **Anticipation:** prepare significant actions when that makes them readable.
  Illuminate the relevant route or highlight the condition before movement.
  Do not start every important action instantly or add empty suspense.
- **Action:** give movement weight and direction. Accelerate a traveling object
  rather than starting at full speed. Use faster transfer for packets and slower
  movement for large devices or camera reframing where appropriate. Choose
  easing for the object's role rather than assigning identical easing to all.
- **Reaction:** show the receiving object's response after the cause reaches
  it. A destination changes state on arrival; it must not announce success
  before the event that produces it.
- **Follow-through:** where useful, allow restrained continuation, overshoot,
  compression, trailing motion or a secondary response. Playful bounce, squash
  and stretch, wobble and expressive poses are welcome when they clarify weight,
  effort or reaction. Keep technical values and labels rigid; omit effects that
  obscure the mechanism.
- **Settle:** finish in a readable state. Let the viewer understand the result
  before the next major action; allow an intentional comprehension pause.

### Cause and result

Use one dominant motion event with supporting secondary motion. Several objects
may move together as one causal event, but unrelated movements must not compete.
Prefer **condition changes → system reacts → object moves → destination reacts
→ result becomes visible** over a sequence of fades and labels. Entrances,
checkmarks and glows alone do not demonstrate a mechanism. The main cause and result must
be understandable with sound off.

### Encryption and rejection examples

For encryption, close a lock or wrapper around the same request, change its
appearance and carry it along the protected route; the tunnel is a visual
metaphor, not a physical private cable. For rejection, show the request arrive,
the server check it, a barrier close and the packet recoil or stop, then settle
in a visibly rejected state. Labels may identify a state; they cannot replace
the action that produces it. Preserve technical conditions and scope.

## Continuity and camera

### Inherited states

Prefer moving, transforming, opening, splitting, highlighting or changing an
existing object's state over removing it and introducing a replacement. Carry
persistent object IDs, semantic colors, route attachments and endpoint identity
across related ideas. A reply retraces the established route. Inherit the prior
ending state at the next scene's local time zero. Keep placement stable unless
an explained movement or camera reframe changes it; record both endpoint poses.

### Persistent identity and factual boundaries

Keep important objects alive across multiple attention beats. Extend a route,
reveal contents, attach or detach a wrapper, or move supporting objects around
the persistent subject. Transform request → encrypted request, an unresolved
name's value → resolved IP, closed → established connection, or unknown device
→ assigned IP rather than resetting the layout.

Keep the entity distinct from
its changing value: resolving a name does not turn the name itself into an IP. Cache miss → cache hit is a later lookup after storage, not the same miss changing
retroactively. Continuity must not invent a technical process.

### Motivated camera movement

Move the camera to reveal hidden detail, follow an important object, change
scale for an explanation, compare related states or redirect attention to a
newly important detail. Do not move it just to animate a static scene. Keep
identity and labels legible throughout the move, and settle before reading.

Let composition evolve with the explanation: wide system view → follow packet
→ router close-up → internal transformation → destination → system overview.
Vary diagram scale, focal position and camera distance when they teach something;
do not freeze every scene into the same centered layout. Camera movement must
have a teaching purpose, with stable identity through reframing.

### Transitions between ideas

A hard cut starts a new concept or contradiction. A match cut preserves an
object or value. A directional push or route continuation follows a journey.
Reserve camera reveals, zooms and irises for moments that need them. Record
why a transition helps; remove transitions that add no meaning.

## Visual rhythm

Plan meaningful peaks across the explanation, not only in the hook: a decision,
transformation, comparison or consequence can be a peak. Mark scene energy low,
medium or high. Contrast fast with slow, motion with stillness, close-up with
wide view, dense with simple composition, and anticipation with payoff. Let
complex ideas breathe. Do not force alternation, constant movement or a quota
of effects. Vary energy according to the explanation and viewer attention.

## Engaging and playful direction for future videos

### Choose treatment from meaning

New videos should feel like illustrated motion graphics with a clear, playful
personality. Connected-node diagrams are one tool for actual relationships,
not the default presentation for every idea. Choose the scene's visual treatment
from its meaning: an object performance, physical metaphor, transformation,
cutaway demonstration, comparison, assembly or journey. Keep one coherent art
direction across these treatments; variety does not require changing brands.

### Object behavior and metaphor boundaries

Give important objects behavior: prepare, try, resist, collide, recover, open,
unfold, multiply or snap together. Use pose-to-pose acting, anticipation, curved
travel, selective exaggeration and delayed secondary reactions to make the
action readable and enjoyable. A device may tilt with effort or a packet recoil
after rejection; these are presentation metaphors, not claims of agency or
literal protocol physics. Preserve actual causality, counts, scope and values.

### Discoveries and payoffs

Plan playful moments throughout the explanation, especially discoveries,
obstacles and payoffs. A brief visual surprise or gag should express the idea
and leave a useful result: a queue visibly jams, a wrapper unfolds to expose
contents, or repeated items compact into a stack. Do not substitute a gag for
the technical explanation or add random dancing, perpetual bounce or particles.
No fixed effect quota; serious material can use quieter curiosity and reveals.

### Secondary motion and audio

Build secondary motion into the same event: lid follows body, shadow reacts to
a lift, trailing pieces settle after their parent. Let the hero land and the
result breathe. Camera reveals, object wipes, match transformations and layered
parallax can connect ideas; repeated zooms and flashy cuts alone are not variety.
Short kinetic words or numbers may act as objects only under `DESIGN.md`'s text
contract. Optional sound effects need an explicit audio plan; do not enable
music or effects automatically.

### Record direction and reuse examples

Record the visual treatment, expressive action and intended feeling in the
existing storyboard. `channel/MOTION_LIBRARY.md` supplies authoring recipes;
this direction uses the current paused GSAP/ChannelMotion runtime and introduces
no new animation engine. See `channel/OPUS_ANIMATION_RESEARCH.md` for source
examples and the distinction between creator demonstrations and model claims.

Use the [flow-motion examples](examples/flow-motion/README.md) and their
[source](examples/flow-motion/index.html) for concrete acting, handoffs and
depth. Choose a performance for the object's material and role: an elastic
packet, a restrained heavy hinge/drawer, or small chunk landing reactions.
Keep travel outside whole-body deformation and delayed articulated parts;
labels and exact values remain rigid. Shadows respond to lift and landing;
occlusion follows the layer order planned under `DESIGN.md`.

### Compose overlapping transitions

For a transition with visual overlap, author both outgoing and incoming states
inside one timed scene; a transition sampler does not schedule or supply them.
Match the carried object's endpoint pose or focal region, avoid duplicate
heroes, and settle before the next reading/action beat. Inspect both endpoints
and the actual middle. The examples' independent demonstrations and authored
timings are not a protocol sequence, effect quota or pacing rule.

## Scene archetypes

Use archetypes to organize ideas rather than as full-screen templates. Avoid
repeating a shape more than twice consecutively unless continuity needs it.

| Archetype | Use it to show |
| --- | --- |
| Hero hook | an oversized object and a concrete question |
| Journey | an object or camera following a route |
| Transformation | a state changing around a persistent object |
| Decision machine | evidence compared, rejected or accepted |
| Contrast | related states with a meaningful difference |
| Object performance | a prop trying, resisting, reacting or recovering |
| Cutaway demonstration | internal parts producing an observable result |
| Assembly / disassembly | parts gathering, unfolding or separating to reveal structure |
| Constellation recap | known concepts assembling around a takeaway |

Record the archetype and primary causal verb in `STORYBOARD.md`. Name the moving
object, source, connected route, destination and changed state in its action
rows. Use `frame.md` for geometry rather than independently replacing endpoints.

## Narration cues and implementation

### Phrase anchors

Align an important action with the spoken phrase that gives it meaning. In
“The server rejects it,” make rejection happen around **rejects**; in “The
address changes,” transform around **changes**. Anticipation may precede the
phrase and settling may follow it, but the semantic event must not happen
seconds before its narration. Name cues only for meaningful actions, reveals,
transformations, arrivals, camera moves and consequences, not every word.

### Measured timing and cue ownership

Estimate cue intent for Gate 1. After TTS, use actual-WAV alignment or listening
to measure scene-local cue seconds. `audio_meta.json` owns scene timing;
`motion_beats.json`, when used, owns measured named cues and WAV fingerprints.
Reference cue names in storyboard rows and scene packets; retime those same rows.
Use `motion_beats.json` for meaningful semantic events whose timing affects
comprehension, rather than substituting fractions of scene duration. Recheck
cues whenever audio changes. `channel/MOTION_API.md` owns schema, provenance
and validation details.

### Onset, contact and resolved pose

Distinguish **onset**, **contact/decision**, and **resolved pose** in each
important cue's intent. “Arrives” anchors the end of travel, not its beginning:
derive travel duration as `cues.arrives - cues.launch`. “Opens” may name the
start of opening; “is open” requires the readable open pose.

Prepare before
the anchor and schedule a receiver reaction at or after contact. Never delay
the main result merely to finish decorative follow-through. If measured cues
leave too little room, simplify the staging or revise the plan; do not use a
negative window, accelerate narration or invent a fractional fallback.

### Runtime and transform ownership

Future design-v2 videos should opt into `channel/motion.js` (motion v1). Keep travel, contents and camera on separate wrappers with one transform writer
each. Choose MORPH for geometry, FAST for packets/highlights, SLOW for devices,
SOFT for labels, CAMERA for critically damped framing and IMPACT for restrained
arrival compression.

Use SVG arc-length paths for routes and retrace replies. Leading and trailing edges may respond at different speeds. Content swaps blur
and fade old contents before revealing new contents; this is distinct from
rendered temporal motion blur.

### Sampling and review

Use pure drawing attached to a paused GSAP timeline, composition-scoped
selectors and local assets. Inspect anticipation, action midpoint, arrival,
reaction, settling, camera extrema and cuts; test backward and random seeks.
Do not migrate existing videos implicitly. `VERIFY.md` owns review evidence
and approval; these guidelines introduce no new runtime or production gate.
