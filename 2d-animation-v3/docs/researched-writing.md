# Evidence-grounded scriptwriting

Apply the [quality bar](quality-bar.md). Write a hook that can be shown immediately and sentences with visible causal relationships. Never rewrite accepted narration to compensate for a poor voice, add copy for presets or accelerate speech to fit artwork.

`/projects/<id>/writing` extends script review; it neither creates video nor independently browses/verifies sources.

## Workflow

1. Supply topic, viewer, teaching problem, concrete payoff, format, duration target, limits and source URLs/notes. Every claim references supplied notes. The server never fetches URLs; reject embedded credentials/out-of-range input.
2. Save an immutable brief. Generate distinct hook angles with spoken opening, first visual, optional teaching overlay, claim references and payoff connection. The user selects the hook.
3. Three separate calls write, refine with the actual installed humanizer, and review evidence/voice/teaching. Editor sees final text, brief, chosen hook and user instructions, never the current writer's original draft/private notes/prior verdict. Refiner also receives instructions so requested endings survive.
4. Compare original/refined lines and editorial findings. Revision-needed drafts stay inspectable but unimportable; address findings and explicitly request another draft.
5. Import ready-for-review text as a new script revision, preserving history. Verify facts/editorial quality and explicitly accept; neither model verdict nor import grants production gates.

Channel profile: conversational English for one beginner, concrete examples, no unsupported financial claims, invented personal experience, forced CTA or generic motivational ending. Tutorials complete one narrow task; explainers teach a mechanism. Duration is a writing target, not measured speech.

## Audience-facing example labels — user preference

Do not routinely label constructed examples "fictional", "demo", "illustrative", "illustration only", "for illustration purposes" or similar in speech/overlays. Introduce everyday examples naturally; reserve overlays for teaching. Apply across scripts, boards, motion and final output.

Keep provenance/verification limits in internal briefs/review notes. Never imply real customers, transactions, testimonials, actual AI-tool results or established earnings. Retain spoken conditions that materially change the explanation; avoid repeated generic disclaimers. Preserve frozen evaluation labels/history.

## Installed skills

Use original `storytelling-hooks/SKILL.md` plus `patterns.md` and `humanizer/SKILL.md` from installed `.codex/skills` directly in prompts. Outputs record actual paths/SHA-256. Missing files fail rather than substituting rewritten guidance. No copied package/new dependency. Source/caveat rules, sparse teaching overlays and no forced CTA override conflicting skill advice. The reviewed copy-editing candidate is not installed/executed.

## Storage and concurrency

Schema 4 adds `scriptwriting_runs`, parent/hash dependencies and optional writing-source references on revision indexes. Immutable brief/hook/draft JSON: `<videos-dir>/<project-id>/writing/<run-id>.json`. SQLite owns job status, instruction/model metadata, hashes/import references, not duplicate narration/source notes.

Validate hashes/identities, dependency kinds, chosen hook, claim IDs/coverage and editorial line references. Valid claim IDs cannot establish factual truth; reject false statements through editorial/human review. Server assigns new hook IDs, never trusts model identifiers; preserve historical IDs/scripts.

Import is transactional/idempotent, binding captured base revision and exact reviewed text. Concurrent edits/new briefs prevent stale imports. New briefs also stale accepted imported scripts and their manual/scoped descendants; regenerate or deliberately revise before reacceptance. Corrupt dependencies fail closed.

One writing request runs per project across both workflows. Researched-writing calls: 90 seconds/300,000 response bytes each, five-minute draft workflow, interrupted runs expire after six minutes on next access. No automatic retry, agent loop or model tool access. Preserve failed runs/unindexed files for recovery; never auto-import/overwrite/delete them.

Upgrades are additive/transactional. Stop old app and back up database/project files together. Mixed schema versions cannot share storage; no destructive downgrade.

## Verification and quality boundary

[Dated technical and writing evaluation evidence](reference-verification.md#writing-implementation-and-evaluation-history) preserves test counts, migration snapshots, real run IDs and five-brief results. Those records do not establish the current build or a superior writing method. Model-ready verdicts cannot prove opening timing, natural read-aloud quality or human preference. Fully blinded preference, exact revised-text acceptance and spoken delivery remain unestablished; do not invent missing V2 baselines.

Runtime guidance applies clarity, concision, natural progression, restrained examples and earned endings to full/scoped writing. It is fixed guidance, not an editable voice-profile UI or automatically approved example library.

## Saved-script review and scoped revisions

### Implemented

Only the latest saved script is editable; earlier revisions are read-only. Select text by keyboard/mouse and submit direction. Script/instructions reach the configured gateway only on submission; credentials stay server-side.

Inspect highlighted original/proposed sections in full-script context. Unselected text stays exact. Completion neither edits nor accepts: accept explicitly to create an immutable revision/hash receipt, or reject while preserving the draft. Manual drafts also require acceptance; later saves stale receipts. None of these decisions grants factual certification or production approval.

The [script-review implementation contract](persistence-reference.md#scoped-script-review-and-acceptance) owns selection validation, streaming, atomic decisions and concurrency. Preserve its limits: one active project job, up to three successful follow-ups among the latest 20 jobs, 90-second/300,000-byte upstream cap and two-minute crash expiry on next access. These scoped-job limits differ from researched-writing's five-minute workflow/six-minute expiry above. Persist submitted status/instructions, not unsent drafts; inspect history before explicit retry. No automatic retry, filesystem/model tools or full-chat replay.

Schema-3 sessions/indexes preserve rows/files; follow [backup/rollback rules](persistence-reference.md#upgrade-and-rollback), never destructive reset/downgrade/cleanup.

### Reproduce the isolated browser fixture

After `npm run check` and `npm run build`, run from V3 in separate terminals:

```powershell
node tests/fixtures/gateway.ts --serve
node tests/fixtures/studio.ts
```

Open `http://127.0.0.1:3003`. Launcher sets isolated test storage/dummy credentials in its process only; never edits `.env` or uses real credentials. Fixed editorial output is neither an AI model nor production service. Stop both processes after testing.

For an explicitly authorized live-model check:

```powershell
node --env-file-if-exists=.env --env-file-if-exists=.env.local tests/fixtures/studio.ts --live-gateway
```

Storage stays isolated; submitted text now reaches the real gateway. `scripts/verify-gateway.ts` is an explicit one-call live smoke test using synthetic text/fresh isolated storage, excluded from `npm test`.

Protocol: [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI), [Chat Completions](https://developers.openai.com/api/reference/resources/chat).
