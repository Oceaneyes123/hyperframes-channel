# Director runbook

Resume BRIEF.md, production.json and existing receipts. Do not restart approved
work or retrofit old projects automatically. A missing receipt blocks production;
record genuine older approvals only after checking their messages and files.

1. Research primary sources into FACTS.md. Record type, outcome, complete coverage,
   factual limits and runtime in BRIEF.md. A task is tutorial; a mechanism is
   explainer. Reuse local licensed assets where useful.
   Include the audience, promised payoff and one measurable learning hypothesis.
   Read relevant prior publishing analytics lessons, if available; cite their
   evidence and record applicability or the reason for rejecting the proposal.
   Complete [reference deconstruction](REFERENCE_STUDY.md) alongside factual
   research: select actual clips from the initial channels and supplied videos,
   inspect moving frames, record REFERENCES.json and local timestamped evidence.
   Keep observation, inference and unverified dimensions separate. Disclose
   inaccessible references and record the fallback in decisions; never fabricate
   findings. No extra specialist or approval stage is needed.
2. Run `studio.py skills`; pass exact resolved SKILL.md to each native subagent
   (both storytelling-hooks and humanizer to the same Scriptwriter, in order).
   Load only its role card and required references. Spawn/follow-up/messages are
   orchestration; do not create user-owned chats or recursively delegate.
   For a new specialist, use native `fork_turns: "none"` with a bounded prompt:
   workspace/AGENTS path, assigned role/skill, accepted input paths, exclusive
   outputs, acceptance criteria and applicable user approval quote/source. This
   avoids copying the Director's entire audit context into every specialist.
   Follow up with an existing owner for revisions rather than spawning a copy.
   For a running owner, send a native message. For an idle/completed owner, call
   native `followup_task` to start its next turn; `send_message` alone does not
   restart it. Verify activation when returning a failed handoff or audit.
3. Scriptwriter completes the research-to-script handoff. Art Director may explore
   concepts concurrently on the same facts, then reconciles with accepted script.
   Accept the script against SCRIPT_GUIDE.md: payoff planned before hooks, a
   connected evidence chain, naturalness review with a specific repair, and a
   final answer that fulfills the selected hook. Required narrative functions
   may overlap; reject generic prose even when the parser/checklist passes.
   Inspect the saved storytelling draft, humanizer journal and final script;
   confirm both original methods were executed and no required claim or payoff
   was lost. A skill path, hash or completed status alone does not prove this.
   Require a teaching reason for added text; no overlay is the default when
   narration and visible action suffice.
   Require a visible mechanism, not a renamed node diagram.
4. Present three distinct concepts. Record user selection/source in production.json.
   Art Director completes actual-asset board; Motion Director consumes accepted
   script, selected concept and visual tokens. Return specific Art/Motion conflicts
   to the owner; never silently rewrite another output. OneTake's concept/reference
   procedures stay active; no unselected storyboard.
   Accept reference transfer only when Art explains its composition/material
   choices and Motion links adapted/rejected techniques to teaching beats.
   Ask what the learner sees change and why. Carry meaning through objects,
   spatial relations and transformations; a persistent border alone is not a
   connected story. Use [HTTP-cache planning](HTTP_CACHE_STORYTELLING.md) as a
   concrete same-content example, not a template or approved replacement.
5. Accept handoffs against role criteria and input hashes. Present complete script,
   visual specification, board and storyboard at Gate 1. Only the user approves.
6. Animator normalizes, measures channel narration and executes OneTake. Retiming
   may adjust estimated windows without changing approved meaning/choreography.
   Material changes renew Gate 1. Preserve exact starts/phrase evidence; build full
   mix, composition and synchronized preview.
7. Delegate Reviewer after Animator evidence exists. Original audit requires
   reconnaissance and confirmed perspective weighting; obtain confirmation once
   per film and pass its message reference. Education proposal: Jakub primary,
   Jhey secondary, Emil selective for controls. Never assume confirmation.
   Execute original full audit after confirmation. HTML report is default;
   terminal mode only when requested. Route HTML report into V2 review/ as a
   documented workspace-scope override; preserve its report methods and demos.
8. Route findings: facts/story to Scriptwriter; composition to Art Director;
   choreography to Motion Director; runtime/sync to Animator. Each finding names
   severity, time/pose, evidence, effect, owner, correction and recheck. Owners fix
   only assigned files. Reviewer rechecks new preview and affected neighboring
   beats. Close findings with evidence; no self-approved fixes.
   Require timestamped storytelling assessments in the existing review receipt
   for reference-enabled projects (ROLES.md). Missing causal action, repetitive
   presentation, confusing transitions or lost subject identity are findings,
   even when the probe passes. More camera travel/effects is not a quality score.
9. Present Gate 2 after blocking findings close and every beat has actual playback
   evidence. Record user approval, guarded render, export verification. Changed
   preview inputs require re-audit and renewed Gate 2.

## Publishing and learning handoff

Follow the sibling [video workflow](../../video-workflow/README.md) after a
verified export. OneTake retains all animation/render ownership, and both
production gates remain unchanged. Publishing records live in
`video-workflow/videos/<slug>/` at the workspace root, never inside the production
project: those additions can invalidate Gate 2. The adapter reads source hashes,
current gate receipts and `output/render-verification.json`; it references the
MP4 without copying or modifying the production project.

Reuse existing specialists for packaging. Scriptwriter owns three truthful title
angles and the description; Art Director owns two thumbnail concepts and the
selected image; Reviewer checks accuracy, the promised payoff and phone-size
readability against the actual export. Director owns package selection, channel,
audience/disclosure settings, rights confirmation and exact visibility/time.
Prepare and inspect the local package review before requesting release approval.

Verify the actual user message before recording separate release authorization
against the package hashes and release settings. Gate 1/Gate 2, tool checks and
implementation/setup approval do not authorize upload, scheduling or publication.
One explicit instruction may authorize the complete release; do not ask twice
when it already does. Keep the upload private until processing, thumbnail
application and actual Studio copyright/restriction review are complete. Confirm
remote state after release; elapsed schedule time is not publication evidence.
Account connection, Shorts thumbnails, scheduling and analytics remain unverified
until authorized live account tests establish their capabilities.

Collect available analytics, review comparable ages with coverage and limitations,
and record at most one proposed next experiment in `analytics/LESSON.md`. The next
brief can cite that lesson; workflow initialization can also bind its hash with
`--prior-lesson`. Do not infer causation, auto-edit published assets, rewrite
production rules or activate recurring collection from a review alone.

## Handoff record

Each role owns `review/<role>.json`; use templates/handoff.json. Include native
agent identity, exact skill path/hash, references read, procedures performed,
accepted input hashes, outputs, evidence paths and limits. Reading is partial,
not completed execution. Human approval and qualitative acceptance are separate
from structural validation.

Canonical maps contain hash strings directly: `"inputs": {"FACTS.md": "<sha256>"}`
and `"outputs": {"SCRIPT.md": "<sha256>"}`. Evidence is a list of project-relative
path strings. Rich `{path, sha256}` objects belong in the raw specialist report,
not these maps. Call `studio.handoff(project, role)` to check each canonical
receipt before returning it; the assembled plan check consumes all three.

Director owns production.json (templates/production.json): selected concept and
source, current owners, accepted decisions and revision routing. Findings stay
owned by Reviewer. Record approved creative choices in decisions and later owner
revision requests in revisions; follow up with the same native specialist.
Freeze decisions after Gate 1 unless renewed creative approval is required.
Rejected output never silently replaces accepted
inputs. Preserve review evidence before revision.

## Trust and measurement

The guard is a fail-closed local entrypoint, not a security boundary against
deliberate upstream invocation or forged receipts. Verify provenance in chat.
No fixture, source hash or passing check establishes film quality, retention or
token savings. Compare actual artifacts and report unmeasured outcomes honestly.

Gate 1 includes a semantic hash `production.json#creative` over concept, approved
decisions and any longer-format authorization. Revision routing/owner bookkeeping
may change without invalidating creative approval. Gate 2 binds the full current
project plus audit evidence. Freeze approved decisions before requesting consent.
