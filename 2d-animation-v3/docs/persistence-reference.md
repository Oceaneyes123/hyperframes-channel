# Persistence and script-review contracts

Load for database, revision storage, concurrency, recovery or script-review implementation. [Architecture](architecture.md) owns the system boundaries; [writing](researched-writing.md) owns the user workflow. These contracts do not grant artifact or production approval.

## SQLite ownership

SQLite owns mutable project metadata, indexes/hashes, decisions, jobs and sessions. Immutable JSON owns scripts/proposals, research briefs/hooks/drafts, visuals and motion; WAVs own hash-bound audio. Zod project schemas validate interchange, not a separately editable JSON mirror. Creation/list/load exist; project import/export, rename and deletion remain outside scope.

Schema history is additive: writing sessions/jobs (3), researched writing/dependencies/import references (4), visual jobs/choice events/storyboard acceptance (5), motion/production records (7), `planning_timing` (8). Initialization uses an immediate transaction, foreign keys, bounded busy timeout and `PRAGMA user_version`; version 0 initializes tables, older supported schemas expand transactionally, future versions fail closed. Tests cover retries, rollback and preservation. Native SQLite avoids ORM/addons; revisit its experimental Node 24.6 status before distribution/deployment.

## Revision files and concurrency

Revision JSON schema 1 contains UUID, project/parent IDs, sequential revision number, timestamp and narration. Canonicalize LF only; preserve other whitespace. SQLite indexes hashes without duplicating narration.

Saving takes an immediate transaction, validates expected latest parent/integrity, writes/flushes an exclusive temporary file, renames to a new UUID path, inserts its index and commits. Ordinary failure rolls back and removes only this attempt's files. Prior revisions stay intact; stale saves return conflicts while preserving the typed draft.

Reads expose committed indexes only and verify SHA-256/schema/identity. Missing/corrupt indexed files block loading/saving. Crashes between rename/commit can leave unindexed files; temporary/orphan files stay invisible, never auto-imported/deleted. Preserve them for recovery. Atomic visibility does not guarantee power-loss durability; back up database and matching files together.

## Upgrade and rollback

Stop old app; back up database/videos before additive, idempotent upgrades. Old code rejects newer schemas; never share storage across mixed app versions. No destructive downgrade/reset/cleanup. Rollback requires matching pre-upgrade source/database/media restored to separate paths; preserve current data first for deliberate recovery of later drafts.

## Scoped script review and acceptance

Selections use saved-text UTF-16 offsets, matching textareas; validate bounds and split-surrogate boundaries server-side. Context contains exact full script, selection/instruction and up to three successful requests among the latest 20 jobs (instructions, editorial notes, decision status) from the persistent project session.

Gateway models cannot use tools/write files. Accept only strict JSON replacement text/editorial notes; server constructs the proposal, preserving every unselected character. Immutable proposal JSON stores base revision, selection, instruction, replacement and notes; verify integrity on read/acceptance. SQLite owns decisions.

Acceptance rechecks latest base and transactionally writes a new revision, decision and exact revision/hash receipt. Reject changes only the pending decision. Repeated/stale decisions fail closed. Manual acceptance checks latest revision/hash too. Planning eligibility requires latest accepted revision and valid hash; later saves stale acceptance. Synthetic acceptance is never human production approval.

One writing request runs per project; successful proposal/job visibility is atomic. Discover configured model before streaming `/chat/completions`; listing does not establish actual compatibility. Bound SSE and reject tools, refusals, truncation, oversized output and invalid JSON. Browser receives progress counts/validated proposal ID, never raw upstream errors/credentials. Response text is not factual verification.

Jobs are request-bound: 90-second upstream timeout, disconnect cancellation, no automatic retry/agent loop. Interrupted script jobs fail after two minutes on next store access. Persist submitted instructions/status, not unsent drafts. Preserve unindexed proposal/temp files under the same recovery rules.
