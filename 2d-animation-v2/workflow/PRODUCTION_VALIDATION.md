# Approved-plan production trial

2026-10-16. Continuation of [the overhaul evidence](VALIDATION.md), which records
the earlier preproduction trial. This file records actual production execution;
it does not grant either approval gate.

## Approval and current artifact

The user explicitly approved Gate 1: “Approve Gate 1; build and review preview,
do not render.” Source: async reply call_eb4b848ff7824f39a43dffc9c751f3d9, item 0.
`examples/http-cache/review/gate-1.json` binds that approval to the script,
storyboard, visual direction, board and creative decisions. Those files remain
unchanged. Operational status lives separately in production.json.

The complete native preview is
`examples/http-cache/comp.html?preview`, served as the
[local working preview](http://127.0.0.1:8082/examples/http-cache/comp.html?preview).
OneTake is the sole animation/rendering engine; no MP4 has been rendered.

## Actual execution

| Contract | Measured evidence |
| --- | --- |
| Voice | Existing Supertonic channel clone; ten preserved source WAVs; independent voice-style/source-hash check |
| Speech duration | 91.7420408163 s, measured from WAV frame counts |
| Complete timeline | 99.9666666667 s, native 1080 x 1920 at 30 fps |
| Phrase cues | 27 anchors from original OneTake vo_tools.py using cached faster-whisper-base; raw alignment retained |
| Audio placement | Independent exact PCM comparison at recorded starts passed; no accelerated/cut speech |
| Ending | Last source ends 3.0246 s before the complete timeline ends |
| Composition | One persistent main image/world, separate changed-response alternative, pure seek/track/motion APIs, original runtime and license |
| Native probe | 3,000 sampled points; zero page errors; persistent main subjects in frame |
| Timeline checks | 2,999 native frame times; zero tracked safe-area violations or external requests |
| Determinism | Five repeated/out-of-order seek targets produced byte-identical captures |
| Player | Play, pause, seek, restart, keyboard and reduced-motion/export isolation checks passed |
| Guarded stage | Actual studio.py check --stage animation passed on the complete composition |

The Animator inspected ten complete beat contact sheets, with 30 native teaching
states and phone captures. Author inspection found and repaired tab-text overflow,
validator/local-view overlap and a 200-label collision before final handoff.
Independent film review is a separate stage, not implied by those author checks.

## Review limits

The native continuity score is 1.00 over **zero detected boundaries**. It does
not establish semantic continuity. After returned revisions, tracked motion is
70.1% still, with a longest
rest of 9.77 s; these are observations, not engagement scores. Independent review
must judge the actual teaching actions and attention at phone size.

The corrected probe's peak speed is 237 normalized pixels/frame. Portrait normalization
uses 1920/1080; it is not raw CSS travel. Future approved rendering must use
OneTake's real shutter blur. No encoded motion/audio or export/decode verification
has occurred because rendering remains prohibited without Gate 2.

Raw ASR renders the spoken 304 phrase as “3/home/4.” This is recognition
uncertainty, not proof of incorrect pronunciation. Original audio was retained.
The available tools explicitly do not support audio input: media-API clock and
transcript checks are not an auditory judgment. Human preview listening must
check ETag, 304, 200, pacing and the ending before render approval.

The required original audit output-format.md read was rejected again on this
turn by automatic review: “Blocked filesystem or disk modification.” The
single retry is recorded in quality/required-reference-retry-2026-10-16.json.
No access bypass or original-skill modification occurred. Available original
checklists and lenses can support an actual film audit; complete original-skill
format compliance cannot be claimed while that required reference is unavailable.

## Comparison boundaries

Before the overhaul, V2 had workflow prose/direct production commands and no
executable regression suite. The new path has exercised native specialist
delegation, owner-return revisions, exact handoff validation, explicit Gate 1,
measured cloned narration and a complete deterministic preview. The engine and
voice tooling are reused rather than replaced.

There is no complete old V2 animation in this checkout for a controlled visual
comparison. Static fixes and the actual new preview are evidence of this run;
they do not prove that the architecture causes higher retention or better films.
Entry-document size was measured in VALIDATION.md. Runtime token savings remain
unmeasured, and the added reports/tests/source hashes have a maintenance cost.
New specialist dispatch now explicitly uses bounded native context rather than
copying the whole Director audit history.
The production run also exposed a reproducibility gap: requirements.txt omitted
the already installed faster-whisper package used by native phrase alignment.
It is now declared, with model-cache behavior documented; no dependency or model
was installed during this correction.
An actual revision dispatch also exposed an orchestration distinction: messaging
a completed native agent does not restart it. The owner was reactivated with
followup_task, and DIRECTOR.md now requires that operation for idle owners.

## Returned film revisions

Independent review found four transition intervals where the freshness tab or
server proof covered the retained image/caption (15.162, 24.389, 77.734 and
88.076 s), plus a barely perceptible line-2 separation gesture (7.627 s).
Those findings were returned to the existing Animator rather than fixed by the
Reviewer. Original evidence remains in quality/film-initial/.

The Animator staged the source shrink, tab route and proof entrance in one
shared layout. The line-2 tab now moves 96 native pixels, about 31.8 pixels in
the captured phone preview, while the retained-body bounds remain identical.
All 2,999 frame times pass ten explicit semantic separation checks. Containment
and the intentional local copy transfer are documented overlap exceptions.
Source WAVs, mix, narration metadata and measured cues remain byte-identical.
The corrected composition SHA-256 is
`203375b8c979b297c6d2627c1886965a30cb40eb6f900983b701c5dc9365ceb6`.
Independent recheck closed both findings: 312 sampled times across affected
intervals showed zero collisions for ten semantic pairs, and the line-2 body
remained stationary. Current evidence is quality/film-recheck.json and
quality/film-capture-check.json; the latter also covers all 30 teaching poses,
634 independent bounds samples and eight deterministic seek targets.

## Final independent acceptance

The independent Reviewer completed the supported film audit and returned both
visual findings as closed. It inspected 100 real-time phone frames through ten
contact sheets, 30 targeted teaching poses and complex native captures. Complete
normal-speed audio-API playback took 100.29 s wall time with maximum sampled
visual/audio clock difference 0.0197 s; muted playback took 100.26 s with maximum
0.0224 s. Neither pass reported overlapping media, page errors or remote inputs.
These are playback/visual observations, not audible listening approval.

The current report is quality/film-audit-2026-10-16.html. Its report check found
20 embedded images, current source hashes and no phone-width report overflow.
The required upstream report-format reference remains unavailable as described
above; original-skill execution is explicitly partial. Human listening, Gate 2,
MP4 rendering and export/decode verification remain pending. No MP4 was rendered.

Final regression verification passed all 16 tests and all five original-skill
integrity checks. After Director status finalization, the Reviewer wrote its
canonical handoff last and froze the 630-file preview snapshot. The actual
`python 2d-animation-v2/scripts/studio.py check --project
2d-animation-v2/examples/http-cache --stage review` returned `OK: check`.
That guard verifies the current independent handoff and preview contracts; it
does not turn the documented upstream-reference or human-listening limits into
completed procedures. Preview and report HTTP checks returned 200, and
`git diff --check` passed. No commit or push occurred.

## User-approved render, 2026-10-16

The subsequent user message, “Now please render,” explicitly approved Gate 2.
The guarded approval command validated the current reviewed preview and wrote
review/gate-2.json. The earlier pending-render statements above describe the
pre-approval state, not the final result. The approved project/audit files were
frozen throughout rendering; new artifacts live only under output/. Both gate
receipts were independently revalidated after rendering and remain current.

Original OneTake rendered output/video.mp4 at 1080 x 1920, 30 fps, scale 1:
2,999 frames, 99.966667 s, 4,680,067 bytes. Its 180-degree adaptive shutter used
4–12 permitted samples with a 24 px gap, eight workers and 7,717 actual captures.
Capture took 197.9 s with no page errors. MP4 SHA-256:
`658a5459ae7bad0872f4e2ca3927060ae05a0618a74358507675b9604fb05e01`.

Full audio/video decode and stream/frame checks passed. Decoded AAC correlates
0.9999499 with the original mix, and each of ten passages correlates at least
0.999919 at its measured start. No decoded samples clip; the last two seconds
are silent and the held visual ending is intact. See output/RENDER_REPORT.md and
output/render-verification.json for exact commands and measurements.

The independent Reviewer inspected 17 encoded/reference phone pairs and five
native encoded frames: no new blocking regression, with corrected transitions
and ending preserved. Moving freshness labels show transient shutter ghosting
at 15.167/24.400 s, lighter at 88.067 s; held teaching labels remain legible.
Human listening and audience testing were not performed or inferred from consent.

The unchanged original promo oracle passes its audio/rest/curves checks but
fails its framing leg because its embedded probe forces a 1920 x 1080 viewport
without a portrait override. That result is retained in output/original-oracle.log;
it is not described as a passing original oracle. Native portrait probes and
actual encoded portrait captures supply the applicable framing evidence. No
upstream changes or altered approved audio were used to change that result.
