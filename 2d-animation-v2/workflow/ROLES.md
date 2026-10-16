# Specialist handoff cards

Load assigned section and original skill only. No recursive delegation. Write
assigned artifacts plus your report. Return paths/limits; never approve gates.

## Scriptwriter

Skill: yaxeen `storytelling-hooks`, not a skill named after its repository.
Inputs: BRIEF.md, FACTS.md, SCRIPT_GUIDE.md. Execute original intake, patterns.md,
5+ labeled hooks, selection, full script and checklist. Deliver SCRIPT.md with
three opening layers, speech, visual intentions, coverage and specific revisions.
Channel overrides: no mandatory CTA/captions; sparse identifying labels can supply
the text layer. No invented fear/money/outcomes. Full scope overrides its typical
20–45 s range. Acceptance: earned payoff, source traceability, beginner teaching,
valid parser. Report: review/scriptwriter.json.

## Art Director

Skill: original Anthropic `frontend-design`, installed as
`anthropic-frontend-design` to preserve an existing different skill. Inputs:
brief/facts/accepted script. Execute plan/review/build/critique; adapt to portrait
art, not a website. Deliver VISUAL.md, ICON_PLAN.json (paths/source/license), three
distinct static concepts, then selected-concept sketches/board.html with every
teaching beat. User selection precedes storyboard. Use actual assets, decisive
poses and native/phone screenshots. Acceptance: readable causal demonstration,
coherent look, no generic card sequence. Report: review/art-director.json.
Art owns planned art; Animator owns production copies after explicit handoff.

## Motion Director

Skill: LottieFiles `motion-design`. Inputs: accepted script, selected concept,
VISUAL.md and board. Execute original emotional-intent/personality/property/timing/
easing/hero/layers/choreography workflow with relevant director/reference files.
Deliver STORYBOARD.md: one table with estimated time, line/cue,
learning, persistent IDs, before/key poses, visible cause, action, result/hold,
easing intent, camera/framing and next carry. Include overlap and rests.
Acceptance: required facts visibly taught, stable identities, purposeful variation,
actionable OneTake moves. Freeze the approved board; store measured retiming in
motion_beats.json (template provided), without silently changing approved creative
decisions. Map intent to OneTake; no Lottie/GSAP/Framer runtime.
UI timings guide motion events, not narration length. OneTake rests/no-confetti
override ambient/particle suggestions. Report: review/motion-director.json.

## Animator

Skill: original `onetake`. Inputs: approved Gate 1 and accepted handoffs. Execute
reference/concept/storyboard checks, appropriate library/look tools, deterministic
composition, portrait probes, synchronized preview and (Gate 2 only) shutter
renderer. Report missing reference analysis rather than inventing it. Own comp,
runtime/look, production assets/licenses, audio_meta.json, motion_beats.json,
source WAVs and derived audio/narration.wav. Cues carry WAV hashes and listened/
aligned provenance. Browser/export share measured timeline. Report:
review/animator.json, actual commands, captures, probe/errors/seeks/audio and limits.
Pre-Gate1 library tests/runtime preparation are partial, not animation execution.

## Independent Reviewer

Skill: `design-motion-principles`, Audit mode. Inputs: full preview, approved plan,
measured audio/cues, Animator evidence and actual playback/captures. Execute original
reconnaissance, motion-gap analysis, confirmed weighting, full checklist, weighted
lenses, accessibility, anti-checklist and output procedure. HTML demos illustrate
fixes, not production footage. Explain UI-rule adaptations and unsupported checks;
never cap whole explanatory actions at UI durations. Review full film at phone
size with sound and muted; collect timestamps at boundaries/middles/camera extrema.
Evaluate story/attention, readability, weight, timing, rhythm, semantic carry,
camera, transitions, sync and repetition. Deliver original report plus
review/reviewer.json: animator/reviewer identities, preview input hashes, findings,
rechecks, full-playback evidence and limits. Acceptance: independent, all blocking
findings closed. No comp means blocked full-film audit, never pass. Do not edit
production files, approve your own fixes or grant Gate 2 consent.

Canonical reviewer report adds `preview_files` (the exact `studio.snapshot(project,
2)` map), `weighting_user_source`, `full_playback_evidence` (local evidence paths),
and `findings`. Each finding uses `id`, `severity` (`critical`, `important`, or
`opportunity`), `status` (`open` or `closed`), timestamp/pose, evidence, owner,
correction and `recheck_evidence` (local paths). Critical/important findings block
render until closed with independent recheck evidence, `fix_author_id` distinct
from Reviewer, and `rechecked_by` matching Reviewer's native identity. Store the full original
report as an evidence artifact; canonical JSON is the integration receipt, not
a replacement for its per-lens analysis.
