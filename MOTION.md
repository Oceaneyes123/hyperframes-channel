# Motion and scene grammar

This file owns archetypes, rhythm, action verbs and transitions. `BUILD.md`
owns the HyperFrames timeline contract.

## Shared motion layer

Future design-v2 videos should opt into `channel/motion.js` (motion v1).
See `channel/MOTION_API.md` for the API. Prefer one persistent object changing
state over replacing it at every beat. Keep travel, contents and camera on
separate wrappers. Choose MORPH for geometry, FAST for packets/highlights,
SLOW for devices, SOFT for labels, CAMERA for critically damped framing and
IMPACT for small arrival compression. No cartoon bounce.

Use SVG arc-length paths for routes and retrace them for replies. Leading and
trailing edges may respond at different speeds. Content swaps blur and fade
old content before revealing new content; this differs from temporal motion
blur in the renderer. Align key actions with audio-derived named cues, leaving
time to anticipate and settle inside narration. Frame packets include cue names.

Reframe around a teaching detail: promote a certificate, follow a request or
pull back for comparison. Keep endpoint identity legible and inherit explicit
poses at cuts. A fixed headline/device stack is not required. The layer supplies
hard-cut, match-morph, directional-push, route-continuation, camera-reveal,
zoom-reveal and iris states; use only the transition the lesson needs.

## Pick a scene shape

Use a scene archetype to organize the idea, not as a full-screen template. Do
not repeat one more than twice consecutively.

| Archetype | Use it to show |
| --- | --- |
| Hero hook | an oversized object and a kinetic question |
| Journey | a camera or packet following a spatial route |
| Transformation | a value changing around one persistent object |
| Decision machine | evidence scanned, compared, rejected or accepted |
| Contrast | two asymmetric states, such as allowed and blocked |
| Constellation recap | known concepts assembling around one takeaway |

Choose one primary verb from the lesson: discovery radiates; routing pushes or
follows; translation snaps and rewrites; lookup scans and locks; rejection hits
resistance; a reply retraces; a recap assembles. Record the archetype and verb
in `STORYBOARD.md`.

## Build, breathe, resolve

1. **Build:** show the situation, real endpoints and current state.
2. **Breathe:** use one restrained ambient cue while the viewer reads.
3. **Resolve:** show the object reaching its destination and the consequence
   there.

Name each moving object, source, connected route, destination and changed state
in the storyboard's action table. Entrances, glows, checkmarks and moving labels
are not proof of the action. The viewer must understand the cause and result
with sound off.

Use different entrances, easing, scale and direction when they clarify the
scene. A hard cut starts a new concept or contradiction. A match cut preserves
an object or value. A directional push continues a route. Save an iris, zoom or
shader transition for a major reveal. Transitions support meaning; they do not
decorate every cut.

Keep devices and their identities fixed across adjacent scenes. A reply
retraces the established route. Flag unexplained stillness over three seconds
for review; a deliberate reading pause is fine, and continuous decoration does
not fix a missing action. Use a camera move only to direct attention to a
teaching detail.
