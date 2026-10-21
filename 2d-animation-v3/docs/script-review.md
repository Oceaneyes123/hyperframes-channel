# Script review implementation and verification

## Implemented

The latest saved script is editable; earlier revisions are read-only. Select a
section using the keyboard or mouse, enter an instruction and request a revision.
The server validates offsets against the saved base, checks the configured model
through `/models`, and consumes streaming `/chat/completions`. It sends only
bounded progress and a saved proposal identity to the browser. Credentials stay
server-side. Script and instruction context goes to the configured gateway only
when the user submits a writing request.

Proposals preserve unselected text exactly and show highlighted original/proposed
sections in full-script context. Completion does not edit or accept the draft.
Acceptance makes a new immutable revision and an exact hash-bound script receipt;
rejection preserves the draft. Stale-base acceptance fails. Manual drafts also
support explicit acceptance. A later save makes the receipt stale. This is artifact
acceptance, not formal production approval or a factual/editorial quality score.

Writing sessions persist per project. Up to three successful requests among the
latest 20 jobs supply
instructions, editorial notes and accepted/rejected/pending status as follow-up
context; no autonomous agent loop, filesystem tools or full conversation replay.
Jobs persist status and submitted instructions. One active job per project,
90-second upstream timeout, 300,000 response bytes, no automatic retries. Requests
interrupted by a crash expire after two minutes on the next store access. A retry
is a new explicit request; inspect history first if a response was lost.

Schema 3 adds only tables/indexes and preserves existing project rows and immutable
script files. Back up database and videos together before upgrading; old app versions
reject the new schema. No destructive migration, downgrade, reset or cleanup runs.

## Evidence — 2026-10-21

- Required lint/typecheck and 26 focused tests pass; final results are recorded
  in progress.md.
- Production build passed with `/api/projects/[id]/revise` as the only new route.
- Native HTTP fixtures tested split SSE, missing model, HTTP rejection, invalid
  JSON, oversized output, tool calls, truncation, timeout and cancellation. Session
  follow-ups include previous proposal decisions. Concurrent draft changes fail
  without proposals or overwritten text. Injected completion/acceptance failures
  roll back indexes, state and newly created files; explicit retries work.
- Actual production UI used isolated `.data/review-browser` storage and a dummy
  HTTP gateway. Created a synthetic project, saved narration, selected exactly the
  eight-character opening, streamed a proposal and verified the ending unchanged.
  Rejected proposal 1, accepted proposal 2 as revision 2, and reloaded decisions,
  text and acceptance. Saving a manual revision 3 marked acceptance stale;
  explicit reacceptance restored script eligibility.
- Stopping the fixture gateway produced a persisted failed job while retaining
  the accepted script and the submitted instruction. Foreign Origin returned 403;
  malformed contract returned 400. Test acceptance is synthetic, not human approval.
- Viewport screenshots: `.data/review-browser/accepted.png` and `comparison.png`.
  Full-page screenshot capture was unavailable; visible comparison was inspected.

The configured gateway initially could not connect. The user then authorized
homeserver diagnosis: recovery restored the existing Compose port binding, and the
invalid configured model name was corrected to advertised `gpt-6-luna`. A live
server smoke check passed, followed by a separate real browser request, scoped
comparison, synthetic acceptance as revision 5 and reload. Screenshot:
`.data/review-browser/live-comparison.png`. See [gateway evidence](gateway-verification.md).
No media generation ran. Model-list availability does not verify every model;
cost, editorial quality and the full writing/video roadmap remain unassessed.

## Reproduce the isolated browser fixture

After `npm run check` and `npm run build`, run these in separate terminals from v3:

```powershell
node tests/fixtures/gateway.ts --serve
node tests/fixtures/studio.ts
```

Open `http://127.0.0.1:3003`. By default the dedicated launcher sets fixed test
storage paths and dummy gateway credentials in its process only; it never edits
`.env` or uses real gateway credentials. Stop both processes after testing. The fixture
returns fixed editorial text and is not an AI model or production service.

For an explicitly authorized real-model browser check, load the ignored env files
and use `node --env-file-if-exists=.env --env-file-if-exists=.env.local tests/fixtures/studio.ts --live-gateway`.
Storage remains isolated, but submitted text now goes to the actual configured
gateway. `scripts/verify-gateway.ts` is an explicit one-call live server smoke test
with synthetic text and fresh isolated storage; it is excluded from `npm test`.

Protocol references: [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI),
[Chat Completions](https://developers.openai.com/api/reference/resources/chat).
