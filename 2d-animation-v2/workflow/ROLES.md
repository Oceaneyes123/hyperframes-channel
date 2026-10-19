# Specialist handoff cards

Load assigned section and its original skills only. No recursive delegation. Write
assigned artifacts plus your report. Return paths/limits; never approve gates.

## Scriptwriter

Skills, in order: yaxeen `storytelling-hooks`, then original `blader/humanizer`.
Resolve both with `studio.py skills`; one Scriptwriter executes both.
Inputs: BRIEF.md, FACTS.md, SCRIPT_GUIDE.md. Execute original intake, patterns.md,
5+ labeled hooks, selection, full script and checklist. Before hook generation,
define the specific viewer payoff and evidence chain in SCRIPT.md's unspoken
notes. Apply SCRIPT_GUIDE.md's narrative functions as a connected explanation;
merge setup and omit CTA where useful. Deliver the opening visual, speech,
text-layer decision, visual intentions, coverage and specific revisions. Record
the promise/payoff comparison, naturalness review method and a quoted repair.
After the full storytelling draft, execute humanizer's original refinement
process in embedded mode on the narration. Keep markup, notes, source links,
facts, necessary qualifications and the earned promise/payoff intact. Save the
before draft and refinement journal as unspoken review evidence; return the
final narration in SCRIPT.md. Report both source hashes and actual procedures
using SCRIPT_GUIDE.md's existing-handoff extension. No new specialist or gate.
Channel overrides: no mandatory CTA/captions or overlay; use text: none unless a
label/value has a teaching job. No invented fear/money/outcomes. Full scope overrides its typical
20–45 s range. Acceptance: specific earned payoff, substantive progression,
natural topic-specific speech, source traceability, beginner teaching and valid
parser. Checklist completion alone is insufficient. Report: review/scriptwriter.json.

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
Consume Director's REFERENCES.json and viewing evidence. In VISUAL.md distinguish
borrowed composition principles from original project choices. Keep one material,
palette and type system while varying scale, depth, grouping and negative space.
Board decisive **before/action/result** poses, not just finished illustrations.
Show the subject that carries across neighboring poses; compose room for its next
action. Use layered foreground/mechanism/context only where hierarchy stays clear.
Do not copy channel branding, scene order or combine unrelated reference looks.

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
Use REFERENCES.json as accepted input. Annotate the existing beat table, rather
than creating a second plan: cue; visible trigger; changed state; hold; boundary
carry; selected technique/reference ID or original choice; why it teaches better
than a simpler action. Choose mechanism first, motion property second. Examples:
separate parts to distinguish concepts, assemble to show dependency, transform
only when identity/meaning survives, compare in shared geography, reveal a hidden
layer, or follow a consequential journey. A diagram or still hold remains valid
when clearest. Do not force every line into a shot or every beat into a new effect.
Name what stays still. Secondary action follows the cause; ambient stops in rests.
Choose camera framing to reveal a relationship, then settle before key labels;
avoid ornamental pushes, unmotivated whip pans and motion that hides proof.
Transitions should complete the previous action and prepare the next. Evaluate
adjacent beats for repeated layouts/entrances, attention conflict and rhythm,
then vary the action or composition without changing the selected identity.

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
Consume the hashed reference study and approved beat choices; do not invent a
new channel imitation or silently substitute a generic fade/slide. Build the
action's setup, trigger, reaction and rest with existing OneTake library moves.
Preserve object identities and semantic distinctions through morphs/reframes;
record any feasibility mismatch for Motion/Director before changing the plan.
After Gate 1, test the authored **intervals** around transitions and camera extrema
at normal speed and phone size. Endpoint screenshots and continuity scores do
not establish perceptible, smooth, meaningful motion.

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

For reference-enabled projects, add `storytelling` to this same receipt with six
keys: `cause_effect`, `continuity`, `variation`, `transitions`, `rhythm`,
`camera_hierarchy`. Each contains `assessment` (reasoned prose), `times_s`
(preview timestamps) and `evidence` (local paths into actual playback/captures).
Timestamps must fall inside the current composition duration, checked from its
actual browser runtime. Include REFERENCES.json and its inspection-evidence
hashes in `inputs` for each consuming specialist.
These fields ensure coverage; they cannot prove a qualitative pass. Cite failures
as normal findings and use the existing independent revision/recheck loop.

| Review dimension | Evaluate during full sound-on and muted playback |
| --- | --- |
| Cause/effect | Does the visible trigger cause the correct result, in order? Can the learner explain the mechanism without reading a paragraph? Flag decoration that substitutes for teaching. |
| Continuity | Follow meaningful object identity/state across boundaries. A surviving decorative frame is insufficient. Reject misleading morphs, unexplained resets and lost proof objects. |
| Variation | Inspect adjacent and distant beats for repeated card/diagram layout, entrance and cadence. Different effects on identical layouts do not establish variety. Ask whether each change serves the concept. |
| Transitions | Inspect the whole handoff interval, not only endpoints: shared anchor, direction, action completion, incoming cue, occlusion and comprehension. Flag hidden cause/effect even if carry score is high. |
| Rhythm | Check event/hold contrast, anticipation, reveal and settling against actual narration. Reject ceaseless movement, metronomic shots and gestures too small/fast to perceive at phone size. |
| Camera/hierarchy | Does camera movement reveal a needed relationship and settle for reading? Check depth, primary/support attention, label collisions, extrema and reduced-motion controls; flag disorienting or gratuitous travel. |

Read the study's limits; do not attribute unsupported techniques to a channel or
reward imitation. A successful reference adaptation teaches this topic clearly.
No comp means these full-film assessments remain blocked; static planning review
must be labeled as such and cannot satisfy Gate 2.
