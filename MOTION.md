# Motion and attention grammar

This file owns attention beats, motion lifecycle, easing, momentum, rhythm,
continuity and camera direction. `DESIGN.md` owns visual identity; `BUILD.md`
owns the timeline contract; `channel/MOTION_API.md` documents the shared API.

## Plan attention beats inside scenes

An **attention beat** is a moment when understanding or focus meaningfully
changes: an object becomes important, begins an action, transforms, reveals a
route, compares states, decides, receives an impact, reframes, shows a consequence
or settles into a short comprehension pause. A scene is the production
container, not the smallest creative unit. Use multiple meaningful beats when
its explanation needs them.

Plan **setup → anticipation → action → consequence → settle → next question**
when useful. Omit phases that do not help. Name the viewer question, scene payoff
and persistent object before planning movement. Record attention beats and
narration cues in the storyboard's single action table; do not maintain a
separate creative beat schedule.

Avoid long periods without meaningful change unless the viewer needs time to
understand the screen. Judge a hold by content and comprehension purpose, not
a rule to change something every two or three seconds. Decoration does not
repair missing explanation. Stillness can be the strongest beat after a reveal.

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
  compression, trailing motion or a secondary response. Keep it professional;
  omit cartoon bounce and effects that obscure the mechanism.
- **Settle:** finish in a readable state. Let the viewer understand the result
  before the next major action; allow an intentional comprehension pause.

Use one dominant motion event with supporting secondary motion. Several objects
may move together as one causal event, but unrelated movements must not compete.
Prefer **object A changes → action travels → object B reacts → consequence
becomes visible** over a sequence of fades and labels. Entrances, checkmarks
and glows alone do not demonstrate a mechanism. The main cause and result must
be understandable with sound off.

## Continuity and camera

Prefer moving, transforming, opening, splitting, highlighting or changing an
existing object's state over removing it and introducing a replacement. Carry
persistent object IDs, semantic colors, route attachments and endpoint identity
across related ideas. A reply retraces the established route. Inherit the prior
ending state at the next scene's local time zero. Keep placement stable unless
an explained movement or camera reframe changes it; record both endpoint poses.

Move the camera to reveal hidden detail, follow an important object, change
scale for an explanation, compare related states or redirect attention to a
newly important detail. Do not move it just to animate a static scene. Keep
identity and labels legible throughout the move, and settle before reading.

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

## Scene shapes

Use archetypes to organize ideas rather than as full-screen templates. Avoid
repeating a shape more than twice consecutively unless continuity needs it.

| Archetype | Use it to show |
| --- | --- |
| Hero hook | an oversized object and a concrete question |
| Journey | an object or camera following a route |
| Transformation | a state changing around a persistent object |
| Decision machine | evidence compared, rejected or accepted |
| Contrast | related states with a meaningful difference |
| Constellation recap | known concepts assembling around a takeaway |

Record the archetype and primary causal verb in `STORYBOARD.md`. Name the moving
object, source, connected route, destination and changed state in its action
rows. Use `frame.md` for geometry rather than independently replacing endpoints.

## Narration cues and implementation

Align an important action with the spoken phrase that gives it meaning. In
“The server rejects it,” make rejection happen around **rejects**; in “The
address changes,” transform around **changes**. Anticipation may precede the
phrase and settling may follow it, but the semantic event must not happen
seconds before its narration. Name cues only for meaningful actions, reveals,
transformations, arrivals, camera moves and consequences, not every word.

Estimate cue intent for Gate 1. After TTS, use actual-WAV alignment or listening
to measure scene-local cue seconds. `audio_meta.json` owns scene timing;
`motion_beats.json`, when used, owns measured named cues and WAV fingerprints.
Reference cue names in storyboard rows and scene packets; retime those same rows.
If important phrase synchronization is promised, record measured cues rather
than substituting fractions of scene duration. Recheck cues whenever audio
changes. `channel/MOTION_API.md` owns schema, provenance and validation details.

Future design-v2 videos should opt into `channel/motion.js` (motion v1).
Keep travel, contents and camera on separate wrappers with one transform writer
each. Choose MORPH for geometry, FAST for packets/highlights, SLOW for devices,
SOFT for labels, CAMERA for critically damped framing and IMPACT for restrained
arrival compression. Use SVG arc-length paths for routes and retrace replies.
Leading and trailing edges may respond at different speeds. Content swaps blur
and fade old contents before revealing new contents; this is distinct from
rendered temporal motion blur.

Use pure drawing attached to a paused GSAP timeline, composition-scoped
selectors and local assets. Inspect anticipation, action midpoint, arrival,
reaction, settling, camera extrema and cuts; test backward and random seeks.
Do not migrate existing videos implicitly. `VERIFY.md` owns review evidence
and approval; these guidelines introduce no new runtime or production gate.
