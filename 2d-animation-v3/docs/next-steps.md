# Remaining work

## Current milestone

Phase 0 is complete for its approved scope. Script persistence and PLAN2's local
review workflow are implemented: saved-text selection, scoped streaming gateway
requests, immutable proposals, comparison, explicit accept/reject, exact script
acceptance, stale-state detection and persisted sessions/jobs. See
[script review evidence](script-review.md).

The real gateway at `http://100.98.184.97:8317/v1` was restored on 2026-10-21.
Authenticated model discovery and actual `gpt-6-luna` streaming passed, including
browser proposal/acceptance/reload. See [gateway evidence](gateway-verification.md).
No editorial quality or general model-capability conclusion follows from that check.

## Next steps in order

1. Implement PLAN.md's researched writing pipeline: evidence/payoff brief, distinct
   hook options, full draft, skill-backed refinement and separate editorial review.
   Run the prepared five-brief factual/read-aloud evaluation with blinded human
   preference. Scoped script revision is not that full pipeline.
2. Add three distinct visual concepts and concept selection, then shot-based
   storyboards with purpose, transition type and explicit dependency identities.
   Require a current accepted script and invalidate affected artifacts after edits.
3. Integrate selected Remotion 4.0.537 into a Next client Player and shot timeline.
   Verify saved identity, reload, seeking and failure behavior before render jobs.
4. Add voice adaptation, synchronized preview and independent moving/audio review,
   formal Gate 1/Gate 2 receipts, guarded rendering and exact export verification.
5. Adapt v3 verified artifacts to the separate publishing workflow. Publishing and
   account operations require their own authorization; analytics comes later.

No production video feature, voice tool, formal production approval or publishing
action follows from script acceptance. V1, V2 and publishing remain independent.

Server maintenance remains separate: the Tailscale-address startup race can recur
after a reboot until persistent startup ordering/readiness is implemented. No
systemd, Docker-daemon or Tailscale configuration was changed in this recovery.
