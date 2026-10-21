# Architecture review and human decision packet

Status: implementation-author review complete; **human architecture direction
approved 2026-10-21**. User answer: "Approve architecture direction". This is not
an independent-agent review, approval of missing features, or a production gate receipt.

Review scope: original PLAN.md and PLAN2.md, the implemented v3 configuration,
database, revision store, Server Actions and editor, the 16-test persistence
evidence, and the documented renderer/skill sources. No source plan is rewritten.

## Proposed decisions

| Decision | Current implementation or proposal | Assessment |
| --- | --- | --- |
| Independent studio | Next.js/React/TypeScript/Tailwind; no sibling imports/writes | Implemented; preserves v1/v2 |
| Editable metadata | SQLite project identities; canonical metadata is not duplicated in JSON/Markdown | Implemented |
| Immutable scripts | JSON schema v1 content with UUID/parent/revision, canonical LF and validated hashes; SQLite indexes only | Implemented; format supports future provenance without requiring renderer choice |
| Revision safety | Expected-parent check under immediate transaction, atomic file visibility, failure cleanup, corruption rejection | Implemented/tested; process-crash orphans remain an explicit manual-recovery limit |
| Script save meaning | A manual save creates a draft snapshot, not acceptance/approval | Implemented; no stage advancement |
| Artifact acceptance | Persist reviewed revision/hash and reviewer identity separately; never overwrite accepted content | Proposed, not implemented |
| Production gates | Creative-plan and final-preview approvals bind exact revisions and dependencies; changed inputs stale only affected downstream work | Proposed, not implemented; v2 receipt formats cannot be assumed compatible |
| Gateway | Server-only CLIProxyAPI adapter with validated structured revisions and no raw filesystem authority | Proposed; local settings exist but integration/capabilities are not verified by this packet |
| Persistent jobs | SQLite job/session metadata; separate worker with bounded leases and explicit retry/idempotency | Proposed; no in-request long-running rendering |
| Renderer | Engine-native adapter consumes versioned shot data and immutable revision references | Deferred until matched experiment; no OneTake-only restriction in v3 |
| Voice/publishing | Explicit adapters to existing implementations, with permissions and source hashes | Future; never infer release approval from production approval |

## Requirements review

PLAN.md's separation of studio, workflow, engine and production data is preserved.
Initial project/script contracts and stable project URLs exist. Shot/timeline,
asset/license, job/session, proposed-edit, dependency and gate contracts are not
implemented. These are future product contracts; freezing them as complete now
would conceal unresolved renderer and worker requirements.

PLAN2's revision assistant needs scoped selection, source-context references,
persistent request/job state, streamed progress, validated proposed results,
original/proposed comparison, explicit rejection/acceptance, and recovery after
reload. The current manual editor is a prerequisite, not that full vertical slice.

Job proposals should record input revision IDs and hashes plus a request ID.
Workers claim jobs transactionally with a lease/owner, write proposed outputs
under new IDs, and checkpoint their results before acknowledging completion.
Retries first check the recorded operation/result so they do not duplicate edits.
Only human acceptance chooses the current accepted revision. A model completing
successfully must not advance a gate. These are design requirements, not tested
runtime claims.

## Risks and implementation conditions

- Local mutation Host/Origin checks and loopback launch commands fit the current
  single-user tool. They are not user authentication. Do not expose the service
  remotely until read access, mutations and worker permissions have an explicit
  authenticated deployment design.
- Node 24 SQLite is experimental on the tested runtime. Keep version pinning,
  integrity checks, coordinated metadata/content backups and migration preservation
  tests. Long-running worker work must not hold SQLite transactions.
- Current cross-store consistency guarantees atomic visibility in ordinary saves,
  not perfect recovery after power failure. Unindexed/orphan files stay invisible
  and must not be silently deleted, imported or treated as approved.
- Keep existing development-tool dependency findings visible; their audit was not
  refreshed in this documentation-only pass. No new dependency was installed.
- Gateway credentials, voice models, client material and approved artifacts must
  not become arbitrary agent context or model-generated command authority.
- Targeted invalidation still needs a concrete dependency graph. Do not claim
  shot-level regeneration or approval persistence until implemented and tested.

## Human decision requested

Approve or revise this architecture direction and its explicit open boundaries.
Approval would accept the storage/workflow direction for later implementation;
it would not assert missing features are complete, choose an unbenchmarked
renderer, approve a script/video, or authorize publishing.

The separate renderer experiment scope is in
[renderer-decision.md](renderer-decision.md). Its results and a recorded renderer
decision are still required before the full Phase 0 exit criteria can pass.
