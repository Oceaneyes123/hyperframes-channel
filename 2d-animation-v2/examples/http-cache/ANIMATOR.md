# Complete native portrait preview — Animator handoff

Animator: `/root/animator`. Implemented the user-approved A lightbox plan after
Gate 1, using original OneTake. The independent Reviewer has not yet accepted
this preview. Gate 2 and every MP4 render remain pending.

## Preview and measured audio

Open `comp.html?preview`. A single full PCM narration mix drives the complete
99.9667 s timeline. The 10 original cloned Supertonic passages contain 91.7420 s
of speech; no speech was accelerated, removed or replaced. There are measured
passage starts, 27 phrase anchors from original OneTake `vo_tools.py words`
using the cached faster-whisper-base model, passage hashes and a 3 s silent
ending tail. `motion_beats.json` freezes the approved storyboard hash and records
actual retiming. `audio_meta.json` and `audio_timeline.html` share these starts.
The latter is auxiliary source-passage metadata, not another playback engine.

`prepare_preview.py` builds the source-identical PCM placement and extracts v7/v8
SVG art from the approved board. Source WAVs remain in `.media/audio/voice/`;
native alignment input copies remain in `audio/alignment/`. The original native
word output used Windows cp1252; its exact bytes are preserved beside a UTF-8
JSON conversion. Raw recognition and source audio are not silently corrected.

## Animation implementation

OneTake's unchanged `motion.js` supplies the absolute-time motion, housing
morphs, camera and physical request/reply paths. `ONETAKE_LICENSE` preserves its
Required Notice. The native 1080 x 1920, 30 fps composition has pure `__seek`,
awaited `__ready`, semantic screen-space `__track`, camera-aware `__motion`,
explicit portrait dimensions and no cuts. All media is local. Captions, SFX
and music are off. No other animation/rendering engine was introduced.

The same main v7 image persists through expiry, fresh local reuse, stale
validation, bodyless 304 and the final matching-check result. The changed branch
uses a separate labeled alternate cache and visibly different incoming v8;
the main v7 remains the unchanged-path witness. The response body arrives before
alternate storage is replaced. Only a validator travels outward. Cameras stay
neutral during simultaneous cache/server/request/display proof states.

Player controls: `play`, `restart`, range `seek`, checkbox `reduced`, audio
`voice`, canvas `film`. Audio currentTime is the playback clock. Pause, restart,
seeks and keyboard controls synchronize that clock; reduced-motion preview
preferences do not alter deterministic export seeks. Browser playback uses the
same full mix as the future approved OneTake export.

## Actual verification

- Guarded dry run and cloned-voice synthesis succeeded. Source WAV durations,
  speech/voice hashes, all 27 aligned cues and lossless mix placement pass
  `studio.check_narration` and `studio.check_mix`.
- Original portrait `probe.py` executed over 3000 samples at 30 fps. No page
  errors; main housing/body/notch wholly in frame at every tested sample.
  Continuity reports 1.00 over **zero detected boundaries**. This is an empty
  continuity score, not proof of semantic carry. Native probe reports peak
  237 normalized px/frame, 93% travel on soft curves, median t80 0.78 and 60 moves.
  At portrait width its metric normalizes by 1920/1080; raw CSS travel differs.
  Future authorized rendering must preserve OneTake's real shutter blur.
- `verify_preview.py` checks all 2999 native frame times: zero channel safe-area
  violations among painted tracked content, no page errors or external requests.
  Five out-of-order seek targets are byte-identical. Pure seeks leave audio
  paused. Play/pause/restart/seek, keyboard navigation and reduced-motion export
  isolation pass. Recorded visual/audio clock disagreement is below 0.08 s.
- Captured 30 native teaching states, 10 three-state contact sheets and 8 actual
  phone-preview canvas captures. Inspected all 10 contact sheets and selected
  native/phone states. Corrected observed tab text overflow, validator/local-view
  occlusion and alternate 200/caption overlap before final evidence capture.
  Original stills.py would distort portrait into 640 x 360 tiles, so these PNGs
  use the browser directly; this does not introduce another animation engine.

Tracked positions are 70.1% unchanged with a longest 9.77 s tracked rest. This is
a tracking diagnostic, not an image-energy analysis or an engagement result.
The Independent Reviewer must judge whether the complete narration/holds teach
well, including transitions between inspected poses, and challenge every claim.

## Honest limits

No supplied reference film was analyzed; the original knockon case and move
sheets guided feasibility. No native promo oracle was run on an MP4 because none
exists or is authorized. Playback checks establish media state/clock behavior,
not audible listening or a full real-time playback audit. Native recognition of
304 is `3 home 4 not modified`; this may reflect ASR spelling of "three oh four".
ETag/304/200 pronunciation and voice quality remain human listening checks for
the complete preview. No audio was regenerated on an ASR guess.

The selected system fonts are Bahnschrift/Segoe UI; font readiness is awaited,
but another machine's fallback appearance is not verified. Original OneTake
licensing remains noncommercial; this work establishes no monetized-use rights.
No retention, cinematic-quality or audience-understanding result is claimed.

Skipped: MP4 rendering, Gate 2 and independent acceptance. Complete playback and
human listening remain for independent review and the user approval milestone.

## Returned independent revisions: FILM-1 and FILM-2

Director authorized ordinary corrective placement/stagger inside the approved
plan. Pre-fix Animator implementation/evidence is preserved in
`animator-before-film-fixes/`; Reviewer evidence remains untouched in quality/.
The independent Reviewer alone decides whether these corrections close findings.

FILM-1: Replaced direct marker/body interpolation with one shared staged layout.
The source shrinks before the marker descends through an empty right corridor;
returning to the hero, the marker clears the corridor before the source expands.
Server and 304 proof enter after those paths clear. The alternative fades before
the retained witness expands; its caption waits until it cannot cross the source.
There are no source-body swaps, script changes, smaller labels or altered WAVs.

FILM-2: The line2 freshness tab translates 96 native px (31.8 px at the captured
358 px phone canvas) while the retained-body bounds remain exactly unchanged.
This is the approved separation gesture; no generic recurring motion was added.

The focused interval check now tests 10 explicit semantic separation pairs over
all 2999 native frame times, including every reported transition interval.
Zero collisions were observed. Housing/body containment, server/request
containment and the intentional local source-to-view transfer are documented
exceptions rather than a blind global no-overlap rule. All 5 reported phone
states (7.627, 15.162, 24.389, 77.734, 88.076 s) were captured and inspected.
Full bounds, native probe, deterministic seeks and player tests passed again.
All source WAVs, full PCM mix, narration metadata, measured cues and timeline.js
remain byte-identical to the preserved pre-fix version. This is Animator
verification, not an independent recheck or approval.
