# Remaining work

## Current milestone

Phase 0 is complete for its approved scope. Script persistence and PLAN2's local
review workflow are implemented: saved-text selection, scoped streaming gateway
requests, immutable proposals, comparison, explicit accept/reject, exact script
acceptance, stale-state detection and persisted sessions/jobs. See
[script review evidence](script-review.md).

The [evidence-grounded writing workflow](researched-writing.md) is now implemented:
source/payoff briefs, linked claims, distinct hook proposals, explicit hook choice,
full writing, installed humanizer refinement, separate model editorial findings,
and safe draft import. A real gpt-6-luna browser run passed. This is a technical
milestone; it does not establish writing quality or independently verify sources.

The real gateway at `http://100.98.184.97:8317/v1` was restored on 2026-10-21.
Authenticated model discovery and actual `gpt-6-luna` streaming passed, including
browser proposal/acceptance/reload. See [gateway evidence](gateway-verification.md).
No editorial quality or general model-capability conclusion follows from that check.

## Next steps in order

1. Review the [five revised proposals](writing-evaluation/2026-10-22/proposed-drafts.md).
   The user's text preferences and requested corrections are recorded and applied;
   exact revised-text acceptance and actual read-aloud observations remain pending.
   A separate fully blinded review is not established by this chat response.
   Original comparison outputs and all model/editorial receipts are preserved;
   no general v3 superiority is established.
   The baseline is a v2-guide reconstruction, not complete v2 workflow execution.
   Automated research retrieval
   and reuse of approved example scripts remain separate future enhancements;
   current research notes are supplied explicitly.
2. Review three pictured visual concepts and select one, then review the shot
   sequence, narration links and transitions. This planning workflow is now
   implemented; see [visual planning](visual-planning.md). Images are static
   drawings, not screenshots from a renderer. Current script acceptance is
   required, edits invalidate dependencies, and storyboard acceptance is explicit.
3. Use the connected [motion review workspace](animation-workflow.md): generate,
   scrub, compare, revise one shot and explicitly accept motion. Interpreter 2 adds
   explicit camera/reveal/split-screen semantics and richer bundled visuals.
4. Import measured narration and line timings, listen/watch the synchronized preview,
   and supply actual Gate 1/Gate 2 review findings. Foundations for both gates and
   guarded verified export are implemented; synthetic evidence never approves real
   content. Voice synthesis/automatic alignment and a durable background render
   worker remain future increments. Authorize any real local render explicitly.
5. Adapt v3 verified artifacts to the separate publishing workflow. Publishing and
   account operations require their own authorization; analytics comes later.

No production video feature, voice tool, formal production approval or publishing
action follows from script acceptance. V1, V2 and publishing remain independent.

Server maintenance remains separate: the Tailscale-address startup race can recur
after a reboot until persistent startup ordering/readiness is implemented. No
systemd, Docker-daemon or Tailscale configuration was changed in this recovery.
