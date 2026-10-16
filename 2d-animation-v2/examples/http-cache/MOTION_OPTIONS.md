# Motion feasibility before concept selection

Motion Director: `/root/motion_director`. These are the preserved preselection
alternatives. The user subsequently selected A; STORYBOARD.md is now the selected
plan. Inputs below describe the original accepted ten-line SCRIPT.md, FACTS.md,
BRIEF.md and Art Director's VISUAL.md. No concept had been chosen at that stage.
Event durations below are proposed craft ranges, never measured narration or an
approved timeline. STORYBOARD.md must wait for concept selection and the selected
actual-asset board.

I executed the original LottieFiles `motion-design` eight-step checklist for
each proposal. Read its core philosophy, choreography, narrative structure,
context adaptation and timing/easing references. OneTake's original skill,
motion-library reference and hop/morphRect/camera contact sheets supply the
implementation feasibility check. These procedures produced the decisions below;
reading the skill alone is not claimed as animation execution.

## Shared teaching and implementation constraints

- Preserve the same locally stored image through freshness expiry and 304 reuse.
  The freshness tab changes; the image does not vanish, fade, crumble or go gray.
  Fresh reuse visibly draws from that local image without an outbound request.
- Only the saved validator travels in the conditional request. Server-side
  matching causes a 304 status/metadata response with no image body. A successful
  changed-representation alternative returns 200 with a visibly different body.
  These are alternatives, not consecutive responses to one request.
- Stable semantic identities: `cache-body-v7`, `cache-freshness`,
  `saved-validator-v7`, `conditional-request`, `server-current-version`,
  `response-304`, `response-200`, `incoming-body-v8`, `local-display`.
  Concept-specific housings below persist around those identities. Never rename
  the old body into the new one to make a continuity score pass. `local-display`
  is a view of the retained body, not a second transfer from the server.
- Keep policies as conditions in narration. A separate retained-copy bracket can
  identify the example's assumption; do not stage eviction as an extra plot or
  imply a countdown always deletes content. ETag values are illustrative.
- Native 1080 x 1920 at 30 fps. Camera proposals must keep essential artwork in
  x=72..936, y=180..1600; target 320–420 px hero art, 240 px minimum, labels at
  least 36 px. Check actual phone captures after the selected board is built.
- OneTake alone implements absolute-time pure motion. Use its library curves
  and moves; no new easing engine, CSS animation clock, Lottie, GSAP or Framer
  runtime. Keep screen-space tracking and camera-aware motion bounds.

The skill's primary/secondary/ambient analysis is retained, but continuous
ambient motion is explicitly overridden by OneTake's required true rests.
Background housing and light may react during an action, then become completely
still. No idle breathing, float or drift during rests. No particles/confetti.
The skill's UI timing tables guide individual gestures; they cannot cap a whole
educational explanation or replace measured Supertonic narration. Its mobile
interaction-duration multiplier is not applied to spoken-video comprehension.

## A. The image lightbox

Central behavior: the image stays materially intact while permission to reuse
changes beside it. This aligns directly with the accepted expiry opening.

| Original checklist step | Executed decision |
| --- | --- |
| 1. Emotional target | Resolve mild confusion into confidence: expiry changes permission, not existence. The surprise is the intact picture after the tab changes, not a dramatic deletion rescue. |
| 2. Motion personality | Corporate: direct, reliable mechanical workshop. One signature decelerating library curve for arrivals; quick/standard/slow gesture palette 200/300/450 ms. No elastic picture wobble. |
| 3. Primary property | Position for tab and validator travel; restrained scale only for local reuse emphasis. The image body stays still through the freshness change. Never opacity-only for that change: physically flip or slide the separate labeled tab. |
| 4. Duration | Tab change 200–300 ms; framing relocation 450–800 ms; multi-waypoint request travel 700–1200 ms if the final geography needs it. Duration expands with distance. These are proposed event ranges, not speech windows. |
| 5. Easing family | Decelerating arrival, accelerating departure, smooth on-screen repositioning. Map to verified `OM.ease.expoOut`, `OM.ease.expoIn` and `OM.ease.sineInOut` exports. Zero overshoot for rigid housing; no hand-rolled bezier. |
| 6. Hero element | `cache-body-v7` in `lightbox-housing`, with the recognizable corner notch. During checking, attention temporarily follows `conditional-request`, but the body remains visible at a readable size. |
| 7. Secondary and ambient | A tab rail follows the tab 50–100 ms later; its contact shadow shifts only during the action. Ground/housing responds at lower amplitude, then all layers stop. The sun inside the image is image content, never ambient animation. |
| 8. One-third rules | Split a long path at an explicit midway bend/pose before any >360 px horizontal or >640 px vertical segment. One foreground mechanism moves at a time; the comparison reply waits for request arrival. Supporting reactions do not compete with technical labels. |

Persistent physical identities: `lightbox-housing`, `image-notch`, `tab-rail`,
`server-shelf`. The notch belongs to the saved body, not the freshness tab.

Key poses available to the eventual storyboard:

- Intact image, independent freshness tab visibly marked expired/stale; a fresh
  tab is a contrasting explanatory state, not a reversal that repairs pixels.
- Fresh reuse: the retained image supplies `local-display`; source and display
  remain tied by matching notch/art. No server travel in this pose.
- Stale check: body anchored in the lightbox, a validator-only request at the
  midpoint, then the validator at the labeled server shelf.
- Match: 304 status at the server; bodyless reply at local storage; unchanged
  image supplies the display. Hold intact body and 304 together for the explanation.
- Changed alternative: explicitly identified alternate branch, server v8 art
  visibly different; 200 and incoming body travel together, replace saved body
  only after arrival. Keep the housing as the boundary carry.

Carry/camera feasibility: `OM.camera` over one workshop is the preferred carrier;
use a small `OM.morphRect` housing reframe if storage must become a close view.
Never morph the picture into a request or response label. A modest camera move
can follow the tag toward the server while retaining the lightbox; settle before
the status is read. A full-frame zoom-through would lose the opening's proof
object and is unnecessary here. `OM.hop` can route the tag around a bend; suppress
playful impact on the image. Camera and shadow stop completely at the result.

Rhythm: short state-tab punctuation, slower request travel, then a genuine held
match/result. Later narration measurement must allow event/hold lengths differing
by at least 4x without forcing every spoken line into a new shot. Anticipation is
a small tab lift; action changes its label; reaction is the rail/shadow; resolution
is the untouched image plus a long enough still read. No SFX or music.

## B. The dispatch desk

Central behavior: the light paper validator moves; the much larger saved body
stays at home. Its proposed static send-tag hook must become a later hero action
under the accepted spoken opening; see the explicit Art handoff below.

| Original checklist step | Executed decision |
| --- | --- |
| 1. Emotional target | Friendly discovery through the small-request/large-body contrast, then confidence that the browser keeps what is useful. No postage-price, speed or byte-count claim. |
| 2. Motion personality | Playful paper engineering. Signature library spring/decelerating arrival with the paper material's restrained 3–5% settle; quick/standard/slow palette 150/250/400 ms. This is an alternative project personality, never mixed with A or C. |
| 3. Primary property | Position on shallow arcs for the slip; a small fold/rotation secondary when it leaves. The image folder remains mechanically stable. Avoid spinning labels or moving type while it must be read. |
| 4. Duration | Slip lift 150–250 ms; local fold/landing 250–400 ms; long dispatch 700–1200 ms split by waypoints. The full question/response explanation lasts as long as natural narration needs. |
| 5. Easing family | `OM.hop` for the paper's causal path, `OM.impact` with restrained settings only on slip contact; `OM.ease.expoOut` for arrivals and `OM.ease.sineInOut` for desk reframing. No constant-speed spatial glide or bespoke springs. |
| 6. Hero element | `cache-body-v7` in `image-folder` establishes the retained subject; `saved-validator-v7` becomes the moving hero only when the conditional request is explained. The size contrast does not permit illegible ETag text. |
| 7. Secondary and ambient | The fold settles after the slip arrives; a small slot lip/shadow reacts. Desk and ground respond during dispatch, then rest. No animated dust, scattered paper or ambient mail traffic. |
| 8. One-third rules | Route slip via a midflight key pose before long travel; one slip moves while folder and server hatch stay still. A status reply and a new body never race simultaneously from the same request. Group envelope parts as one mechanism, not an excuse for many independently moving elements. |

Persistent physical identities: `image-folder`, `desk-cubby`, `server-hatch`,
`validator-slip`. The illustrative v7 string belongs to the slip and saved
validator; the folder's hill image stays visible in its open cubby.

Key poses available to the eventual storyboard:

- Accepted hook: visibly stale freshness marker on an intact saved folder/image.
  The slip is still parked beside the folder, not already in flight.
- Fresh reuse: folder remains filed, its image supplies the local display;
  server hatch remains idle. Freshness and storage are separate physical pieces.
- Conditional request: slip lifts from the stored-validator position; folder
  stays open; slip has a readable midpoint and a server-side comparison pose.
- Match: server hatch issues a status-only 304 receipt. That receipt reaches
  the browser, which reuses its own folder's image. Server never sends or releases
  the folder. A slot opening is a local reuse action, not a body arriving.
- Changed alternative: show the branch change before 200 carries a different
  image sheet to the desk; only the arriving new body replaces the filed image.
  The cubby stays as physical carry while old/new body identities remain distinct.

Carry/camera feasibility: `OM.hop` gives the slip its material path. A shared
`OM.camera` pan can move from cubby to hatch, with the cubby still in frame.
`OM.morphRect` may unfold the paper surface into a readable validator close view,
but never expand the slip into the cached body. Avoid `gather`/`seal`: bundling
all objects into a final logo would change the explanatory goal. On longer
diagonal travel, use two arcs rather than one >one-third-screen hop.

Rhythm: tiny fold anticipation, decisive launch, slower arrival, then a held
empty-body/retained-image result. The playful gesture belongs to the slip,
not every object. Delay its fold settle 50–100 ms rather than bouncing the whole
desk. Give 304 and the intact source a true still reading interval. A short
gesture beside a materially longer result hold supplies contrast after measured
narration is available; no fixed metronome, audio sting or perpetual desk drift.

## C. The version comparison bench

Central behavior: a validator match explains reuse without confusing the label
with the image. Its static comparison hook is a later outcome under the accepted
expiry opening; comparison happens at the server after the conditional request.

| Original checklist step | Executed decision |
| --- | --- |
| 1. Emotional target | Satisfaction of an understandable comparison: same selected version, retained image reused. No suggestion that a tag validates an entire page or acts as a security key. |
| 2. Motion personality | Corporate: precision without a fake diagnostic dashboard. Quick/standard/slow palette 200/300/450 ms; crisp decelerating arrival and zero overshoot on the bench/bracket. |
| 3. Primary property | Position aligns the requested validator with the server-current version; bracket scale/position makes the relation explicit. Values stay stable and readable during comparison. Never count v7 up into v8. |
| 4. Duration | Tab alignment 200–400 ms; bracket closure 300–450 ms; camera relocation 450–800 ms; long request travel uses separate waypoints. Result comprehension is a longer held pose governed by narration, not the UI table. |
| 5. Easing family | `OM.ease.expoOut` for the final tab alignment, `OM.ease.sineInOut` for bench/camera repositioning, `OM.ease.expoIn` for reply departure. These exist in the installed OneTake library; no new timeline/easing library. |
| 6. Hero element | The punched `cache-body-v7` plate remains proof of retention; the server comparison bracket briefly becomes the focal mechanism. Cyan corner identifies the saved plate across every framing change. |
| 7. Secondary and ambient | Bracket contact triggers a small shelf/shadow response 50–100 ms later. A bench backing plane can shift with the action, then is static. No pulse train, scan lines or idle counters. |
| 8. One-third rules | Move the request to a midpoint, then the server bench; align one tab at a time before closing the bracket. At least two other key objects are still whenever a mechanism acts. Camera must retain the saved plate at a readable size, avoiding a large vestibular zoom. |

Persistent physical identities: `punched-plate`, `cyan-corner`, `comparison-bench`,
`comparison-bracket`, `server-version-tab`. Server-current version belongs in the
labeled server comparison area; it does not magically travel to the browser.

Key poses available to the eventual storyboard:

- Accepted hook: intact local plate, expired freshness marker, no active equal
  sign. The server area can be present but has not checked this request.
- Fresh reuse: plate supplies local display; comparison bracket stays inactive.
- Validation: the request's saved ETag reaches the server comparison area and
  aligns beside its current v7. The original saved validator stays associated
  with the cache; the request carries its value, not the local image.
- Match: bracket closes around equal version values; server emits 304, then
  local stored body supplies the display. Hold saved plate and 304 visibly.
- Changed alternative: current tab is v8 and server image visibly differs;
  bracket shows mismatch without implying HTTP failure. A successful 200 carries
  new body v8 to storage. No error shake, red alarm or instantaneous image swap.

Carry/camera feasibility: `OM.camera` repositions within the shared bench world;
`OM.morphRect` can resize the bracket while retaining its corners. The bracket
closes only after requested/current validators are legible. `OM.hop` is optional
for request travel, without playful bounce on rigid metal parts. Avoid an iris
or zoom-through that hides the retained image precisely when reuse is explained.
The cyan plate corner and bench housing carry the comparison/result boundary.

Rhythm: patient setup of two different roles, quick decisive bracket closure,
then a still result. A second, visibly alternative mismatch must have different
body art before any replacement arrives. Hold the completed comparison rather
than filling narration with continuous scanning. The original four-act pattern
becomes bracket preparation, alignment, support reaction and complete rest;
these phases do not create extra spoken beats or a timed storyboard.

## Explicit Art/Motion handoff and open decisions

Sent to `/root/art_director` through the native agent message channel:

1. B's send-tag hook depicts SCRIPT lines 5–6; C's matching-tag hook depicts line
   7, while the accepted spoken hook is expiry with retained body (lines 1–2).
   Requested Art to record these as central mechanisms requiring an intact stale
   image in the actual opening. Do not silently rewrite speech or select A.
2. B's phrase “304 releases the existing folder” must mean browser-local reuse
   after a status-only reply; it cannot mean the server sends/releases the image.
3. C's saved/server tags cannot meet locally before the outgoing conditional
   request exists. Requested the selected board to locate comparison server-side.

Art acknowledged all three constraints and revised VISUAL.md explicitly. Director
resolves any remaining composition/choreography conflict after user
selection. Motion does not edit VISUAL.md or sketches. Art's reply and final
input hash belong in motion-evidence.json; unresolved issues remain explicit.

After selection: Art supplies every required teaching pose with actual local
assets and phone captures. Motion then writes the selected complete STORYBOARD.md
with estimated cue windows, stable IDs, before/action/result poses, visible
causes, overlap, true rests, OneTake move choices and boundary carry. Director
presents complete script/visuals/board/storyboard for Gate 1. Only after approval
may Animator synthesize final narration and animate, replacing estimates with
measured phrase cues. Independent full-film audit and Gate 2 precede any MP4.

Checks completed here: all six research claims and ten script lines have a
feasible representation in each alternative; old body/new body and freshness
identities remain separate; request/response directions remain causal. These
are planning checks, not proof of smooth motion, phone readability, complete
coverage in a finished film, runtime, retention, synchronization or quality.
