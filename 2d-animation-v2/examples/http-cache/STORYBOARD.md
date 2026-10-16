# A — The image lightbox

Selected by the user in the explicit concept-selection reply recorded by the
Director in BRIEF.md/production.json. This selection is not Gate 1 approval.
Motion Director: `/root/motion_director`. SCRIPT.md speech is accepted for
planning; its initial proposal-status notes are historical. VISUAL.md and the
selected actual-asset board own appearance; this document owns choreography.

## Emotional intent and motion identity

Make the opening's mild confusion resolve into confidence: freshness can end
while the image remains; a matching check permits reuse of that retained body.
Corporate motion personality: precise workshop mechanics, zero rubbery image
distortion. Position carries meaning; restrained scale selects a subject. Rigid
parts land cleanly. Freshness is a separate labeled tab, never damaged pixels.

Use OneTake `OM.ease.expoOut` for arrivals, `OM.ease.expoIn` for departures and
`OM.ease.sineInOut` for on-screen reframing; these names exist in the installed
library. Gesture palette: 0.20/0.30/0.45 s. Longer requests/camera moves may use
0.70–1.20 s with intermediate poses. These are craft proposals, not narration
measurements. `OM.camera`, `OM.morphRect` and, only when a bend helps geography,
`OM.hop` provide the implementation moves. No new renderer or easing library.

Primary: the mechanism being explained. Secondary: a tab rail or contact shadow
responds 0.05–0.10 s later at smaller amplitude. Ambient: housing/ground may
respond only during action, then completely stop. OneTake true rests override
the original motion skill's continuous ambient recommendation. No particles,
confetti, perpetual drift, camera float during holds, SFX, music or captions.

## Identities and geometry

`housing-main`, `body-v7-main`, `notch-main`, `freshness-main`,
`validator-v7-main`, `request-main`, `server-current-main`, `reply-304-main`,
`display-main` persist in the unchanged scenario. `display-main` is a view supplied
by the retained body, not an image arriving from the server. The request carries
the validator's value; the saved validator remains associated with local storage.

The changed branch is an explicitly labeled alternative, with distinct
`housing-alt`, `body-v7-alt`, `server-v8-alt`, `request-alt`, `reply-200-alt`,
`incoming-v8-alt`, `body-v8-alt`, `display-alt`. Replacement is a new body, never
a renamed v7. Keep the main unchanged-path housing visible as a still witness
while demonstrating the alternative; this earns the final return to that path.
Both branches illustrate permitted alternatives, never two replies to one request.

The authoritative art is `sketches/board.html`: each line uses its
`L01-before`/`L01-action`/`L01-result` pose group through `L10-*`. These are
key states to interpolate, not thirty shots or thirty scene replacements.
Static figures repeat artwork; production retains one persistent instance per
semantic identity. Explicit board-to-production mapping:

- Main scenario `main-lightbox-housing` → `housing-main`; `cache-body-v7` →
  `body-v7-main`; its `image-notch` → `notch-main`; `cache-freshness` →
  `freshness-main`; `saved-validator-v7` → `validator-v7-main`;
  `conditional-request` → `request-main`; `server-shelf` and its current-version
  label → `server-current-main`; `response-304` → `reply-304-main`;
  `local-display`/`local-display-view-v7` → container/content of `display-main`.
- Inside `scenario-alt`, `alt-lightbox-housing` → `housing-alt`, never
  `housing-main`. `alt-cache-body-v7` → `body-v7-alt`;
  `alt-cache-body-v8` → `body-v8-alt`; `server-body-v8` → `server-v8-alt`;
  `incoming-body-v8` → `incoming-v8-alt`. The accompanying 200 label belongs
  to `reply-200-alt`; it is not a second `reply-304-main` or a body itself.
  `request-alt`/`display-alt` are semantic implementation roles only where needed,
  not extra invented story beats. The server-current label and 200 text have no
  separate static `data-object`; Animator adds the declared production identity.
- The static board's `image-notch` is repeated inside views/alternate copies.
  Qualify by scenario and owning body; a repeated attribute is not a license to
  count all copies as the same tracked object. `incoming-v8-alt` may transition
  into stored `body-v8-alt` only on arrival, with explicit transfer provenance.

Portrait 1080 x 1920 at 30 fps. Essential artwork must remain inside
x=72..936, y=180..1600 at every camera extremum. Follow the selected board's object
sizes and labels; hero artwork target 320–420 px, minimum 240 px, labels ≥36 px.
Do not shrink the entire board into a thumbnail. Reframe the actual mechanism.
Track all essential objects in screen space, including camera travel in motion
bounds. Use no cuts (`cuts: []`) unless a genuinely new approved cut is introduced.
The selected multi-role poses nearly fill the safe width: cache starts near x88,
server ends near x932. Keep the camera at the board's neutral wide transform while
request/response/source/display are simultaneous proof objects. Do not pan toward
the request and push the source or server beyond the safe area. Operated camera
reframes belong between single-subject and wide layouts, with essential boxes
checked continuously; the same housing also moves/scales as the boundary carry.
Treat top-of-board prose headlines as critique labels for static poses, not thirty
runtime overlays. Runtime text identifies only necessary roles/states: Browser
cache, Server, Local display, Freshness/Prior expiry, illustrative ETag value,
304 Not Modified, 200 OK and explicit alternative/unchanged-path markers. Keep
only relevant labels present. Narration teaches the sentence; motion demonstrates
it. A brief “Expired. Still here.” hook is optional identifying emphasis, not
permission for recurring transcribed captions. Screen-fixed identifying text
must not inherit an artwork-camera transform that takes it outside safe bounds.

## Single production beat table

All windows below are **estimated, unmeasured planning allocations**. The 132 s
end is a placeholder, not a runtime prediction or fit claim. Cues are literal
phrases to align against the original cloned-voice WAVs after Gate 1; do not
derive timing from word count. Event times are relative to the future measured
cue, not instructions to speak faster or insert silence to match this estimate.

Before Gate 1, revise this plan through its owner as needed. Once approved, freeze
this document and its hash. Animator writes measured starts, durations, WAV
hashes, cue provenance and retiming into `motion_beats.json`; ordinary cue retiming
does not rewrite the approved storyboard. Meaning/choreography changes return
to the Director and renew affected approval.

| Estimated window; measured | Line / exact phrase cue | Learning | Persistent identities / before → key pose | Visible cause → action → result | Hold / overlap | Easing / OneTake intent | Camera / framing | Carry into next beat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0–7 s; TBD | 1: “image copy expired”; “still here?” | Expired freshness can coexist with intact image. | `housing-main`, `body-v7-main`, `notch-main`, `freshness-main`; intact body with separate expired tab from first frame → notch and stale marker remain simultaneously legible. | “expired” selects the freshness tab with one short rail displacement; the body never fades, disintegrates or leaves. “still here?” selects the intact body by a restrained framing change. | Initial contradiction is immediately visible. A 0.25 s tab gesture contrasts with a ≥2.5 s proposed still read; all motion fully resolves before that hold. | `expoOut` tab arrival; `sineInOut` reframe; no bounce on body. | Start on the actual selected hook composition. Modest push/recenter follows the body and settles; do not crop the freshness marker. | Same housing/body move with the camera into the storage explanation; no new scene replaces them. |
| 7–18 s; TBD | 2: “freshness, not its existence”; “stored response” | Storage/body and freshness are separate roles. | Same IDs; stale tab alongside intact body → lightbox housing becomes visibly identified as browser cache, with tab physically distinct. | The phrase contrast causes a short tab-away/body-in-place separation; then the housing reframes to show the stored-response relationship. No simulated expiry countdown. | Rail/contact response follows primary by 0.05–0.10 s; long complete rest after both roles are readable. | `morphRect` housing reframe; `expoOut` short tab move. Essential state uses position plus identifying text, not opacity alone. | Retain body and separate freshness tab; no zoom into an unreadable edge detail. | Housing and saved body survive the fresh-reuse explanation. |
| 18–32 s; TBD | 3: “If the rules allow it”; “fresh copy”; “without checking” | Permitted fresh reuse draws from the local stored body without a server round trip. | Main body remains; freshness marker begins in stale explanatory pose → clearly labeled fresh-state example, same body; `display-main` shown as local use. | An explicit “Fresh case” identifying label/marker introduces the illustrative state, rather than silently repairing the stale example. At “reused,” local display is supplied by matching saved artwork. Server is present and idle; no request exists yet. | Hold fresh permission before reuse; hold local display/result with server still. Reuse accent 0.30–0.45 s; no repeated pulse through the sentence. | `expoOut` local-view reveal with restrained scale; no network hop. | Show local source/display relationship at readable size, within one workshop. Server remains identifiable as idle. | Same body/housing carry onward; fresh marker remains available to change at “stale.” |
| 32–43 s; TBD | 4: “once this copy becomes stale”; “doesn't mean deleted” | Freshness changes without automatic deletion. | `freshness-main` fresh → labeled stale tab; `body-v7-main` identical before/after, local display paused pending this example's check. | At “stale” the permission tab slides/flips to its new labeled face. At “doesn't mean deleted” attention returns to the unchanged body/notch. Do not let the display reuse before validation in this illustrated path. | Tab action 0.20–0.30 s; housing/shadow settles; ≥2.5 s proposed true stillness on intact body and stale tab. | `expoOut` state-tab landing; body receives no destruction/opacity animation. | Camera settles on the same main lightbox; no dramatic shake or red alarm. | Stale main body and its saved validator persist as the checking mechanism opens. |
| 43–59 s; TBD | 5: “server gave the image an ETag”; “saved label”; “conditional request” | Validator identifies the saved representation; request carries that saved label. | `validator-v7-main` attached beside saved image; `server-current-main` in labeled server area → value appears in `request-main`, original validator/body remain local → request reaches server. | First identify the existing illustrative `ETag "v7"` association, without showing a new image download. At “sends” request begins from the validator position, passes the board's midpoint key pose and reaches the server; body is visibly parked. | Read validator before launch. Departure/arrival are separated by a visible midpoint; no server reply yet. Saved body stays still. | `expoIn` departure into `hop`/keyed position path; `expoOut` landing; paper label may settle softly, rigid body does not. | Neutral wide camera preserves cache/server proof. Reframe into wide pose before dispatch, never chase the slip outside safe width. | Arrived request stays at server into its question/comparison explanation; do not reset it to the cache. |
| 59–72 s; TBD | 6: “still match this version?”; “doesn't send the saved image back” | Server checks validator; local image is not uploaded. | `request-main` already at server → requested v7 and `server-current-main` v7 align/read there; body remains in lightbox. | Retain line 5's actual arrival. One small local alignment/selecting gesture emphasizes server-side comparison, not another outbound trip. At the negation, hold both small request and retained large body; no body travels outward. | Label read before comparison; response waits. One comparison mechanism moves while other proof objects are still. | `expoOut` short alignment; no ticking counter, invented checksum scan or repeated dispatch. | Neutral wide camera keeps main body and server comparison legible together; no full-frame zoom-through that hides retention. | Arrived request/current-version comparison supplies visible cause for 304. |
| 72–91 s; TBD | 7: “version still matches”; “304 Not Modified”; “No new image body”; “reuses” | Matching validation returns status/metadata, then local body is reused. | Requested/current v7 aligned at server → `reply-304-main` status-only → same `body-v7-main` supplies `display-main`. | Matching labels cause 304 to leave server. It passes an intermediate return pose, reaches browser, then local reuse occurs. Response contains no picture silhouette/body; image never emerges from 304. Identify freshness as prior expiry after validation; do not assert every 304 universally resets it. | 304 settles before reuse; retain status and intact source together for ≥2.5 s proposed true stillness. Support reaction follows status arrival, never races ahead. | `expoIn` departure, keyed/hop return, `expoOut` arrival; restrained local display reveal. No celebration/confetti. | Neutral wide camera during reply/source/display proof; no display overlapping the separate freshness marker. 304 remains readable. | Main housing moves/reframes slightly to make space for alternative while its v7 body stays visible as an unchanged-path witness. |
| 91–109 s; TBD | 8: “changed instead”; “200 OK”; “new image”; “store ... replacement” | Successful changed representation brings a new body; this is an alternative response. | Main witness remains unchanged. Distinct labeled `housing-alt` with `body-v7-alt`; `server-v8-alt` → `reply-200-alt` travels with `incoming-v8-alt` → stored `body-v8-alt`, `display-alt`. | “instead” physically opens the labeled alternate demonstration from shared workshop space. Show alternate saved v7/current v8, then 200/new body travel together. Only arrival allows replacing alternate cached v7. The new hill/sun composition differs visibly; no value-only v7→v8 count-up. | Reveal branch label before its first request/response action. Hold old/new distinction before transfer, then new stored result. Main witness still throughout action. | `morphRect` alternate housing opening, `expoIn` dispatch, intermediate pose, `expoOut` landing; no hard cut or instant body swap. | Two readable scenario housings may share the frame; use selected board geometry. If needed reframe within safe area, keeping main witness ≥240 px. | Shared workshop and main v7 witness carry into the policy qualification; alternative is visibly separate, not retroactively erased. |
| 109–121 s; TBD | 9: “permitted cache paths”; “whether the copy is still stored” | Rules and retained body condition limit the demonstration. | Main case refocused with original v7/notch and prior-expiry history; alternate remains a separate off-focus scenario. | The qualification points once to permission and retained-storage relationship. No new list, policy dashboard, eviction drama or unconditional green success mark. Alt v8 may recede with the camera/world, never change into main v7. | A short 0.30–0.45 s condition selection then a long still read. Neither scenario repeats request travel. | `expoOut` selection; `sineInOut` camera return. Background fully stops. | Return attention to main unchanged path with its original notch. Policy/retained-copy labels and prior-expiry marker remain unobstructed; alternate may leave active framing after its explicit branch is complete. | Main housing visibly re-centers, carrying its retained v7 into the closing answer. |
| 121–132 s; TBD | 10: “expired copy can still be useful”; “matching server check”; “already has” | Earn the opening's answer: matching check permits retained-body reuse in this example. | Main v7 housing/body/notch/stale-history marker and 304 result → retained body supplies local view; alternative remains subordinate and distinct. | Focus returns explicitly to the unchanged-path result, not an unexplained v8→v7 reversal. One restrained local-reuse action recalls the established source relationship; do not send another request. | Resolve completely, then proposed ≥3 s still ending including the final spoken tail. Do not crop audio or fill the ending with a logo/CTA. | `sineInOut` final reframe; `expoOut` local reuse accent. All functions constant during ending hold. | Closing composition recalls hook's intact image plus separate freshness marker, now with matching-check evidence. No seamless loop claim. | Retained subject remains through film end; hold complete narration tail. |

## Overlap, rhythm and motion limits

The table's windows are narration containers, not ten equally paced shots. Build
one continuous lightbox workshop. Short tab/label punctuation contrasts with
longer causal request/reply travel and genuine held comparisons. No recurring
line-start entrance. At least one event/hold pair has ≥4x duration contrast;
target at least 25% truly still frames, including ≥1 s uninterrupted rest, then
measure actual timeline energy. A passing numeric rhythm leg cannot prove the
explanation engaging. No reference film was supplied; do not manufacture bursts
to satisfy a promo pattern.

Anticipation prepares only the active mechanism; action shows its cause;
secondary reaction follows by 0.05–0.10 s; resolution becomes a true rest. Overlap
the small shadow/rail response with its parent landing, never overlap outgoing
request, comparison and response in causal contradiction. With 3+ active objects,
keep at most one third moving independently. Split displacement with a visible
waypoint/key-pose change before any >360 px horizontal or >640 px vertical
segment. No camera travel during required stillness. Do not add meaningless
movement just to improve the continuity score.

## Animator and review acceptance

Only after Gate 1: synthesize the unchanged speech with channel Supertonic clone,
preserve original passage WAVs, measure and listen/align exact cues, then build
`motion_beats.json` and one deterministic composition. Browser/export share the
complete measured narration timeline. If natural timing exceeds 180 s, Director
asks for a scope/format decision; never speed up, truncate or omit coverage.

Animator must probe each semantic boundary, inspect actual bare/anchored/carried
results against the table, and track camera extrema plus essential labels in
screen space. One continuous world may report few probe boundaries; this is not
proof of semantic carry. Check deterministic repeated and out-of-order seeks,
full playback/sync, pause/restart/seeking and ending. Preview has accessible
keyboard/focus and reduced-motion controls without changing deterministic export.
Critical meaning is present in labels/object states as well as motion.

Independent Reviewer checks every complete narration beat at phone size with
sound and muted, especially (1) expiry without deletion, (3) no request during
fresh reuse, (6) validator-only outbound travel, (7) bodyless 304 before local
reuse, (8) alternate scenario and new-body arrival, and (10) explicit return to
unchanged path. Revisions return to the artifact owner and require independent
recheck. Neither this plan, user concept selection nor structural tests grants
Gate 1/Gate 2 approval. Any MP4 waits for explicit Gate 2.
