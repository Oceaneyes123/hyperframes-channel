# Findings and decisions

## Repository baseline
- Existing branch: master. Initial tracked diff empty; only untracked v3 PLAN.md and PLAN2.md exist.
- No root AGENTS.md or .codegraph directory. User AGENTS instructions apply; skip CodeGraph.
- Node v24.6.0 and npm 11.5.1 available. v2 has no package.json.
- Root ignores node_modules, videos, artifacts, review, models, Python caches.

## Requirements
- Independent Next.js / React / TypeScript / Tailwind studio; SQLite metadata, versioned validated JSON artifacts, local media.
- PLAN2 adds server-only CLIProxyAPI, persistent sessions/jobs, proposed revisions, diff review, explicit human approval.
- Model completion never advances workflow. Artifact acceptance and formal production gates are distinct.
- Hybrid shots support cuts and continuous transitions; renderer undecided pending benchmark.
- No speculative empty directory tree. Reuse Supertonic and video-workflow later through explicit boundaries.

## Setup scope
- Runnable local shell, architecture/ownership rules, validated configuration, database initialization/schema version, focused checks, dependency lock.
- Defer scripts, agents, model calls, approval engine, media generation, renderer benchmark, publishing, analytics.
- Memory used only for sibling layout/separation; current filesystem verifies layout.

## Architecture decisions after review
- Use Next.js App Router, React, TypeScript, Tailwind with a small status page; no editor or pretend production controls.
- Use Node 24 built-in SQLite to avoid an ORM/native-addon dependency. Its experimental status on installed Node 24.6.0 is a known foundation limitation.
- Zod validates environment input and the initial versioned project manifest. SQLite begins with project metadata only; jobs/revisions/approvals remain documented, not implemented.
- Store runtime SQLite under v3/.data and future immutable content under v3/videos. No sibling imports or writes.
- Server configuration includes optional CLIProxyAPI fields, but setup never connects to it.
- Sources consulted: https://nextjs.org/docs/app/getting-started/installation ; https://tailwindcss.com/docs/installation/framework-guides/nextjs ; https://nodejs.org/api/sqlite.html . Dependency versions will come from npm and be locked.

## Storage ownership
- SQLite owns mutable project metadata. The initial JSON project schema is an interchange contract, not a second editable store.
- Future immutable revision manifests/content live under videos; SQLite will reference their paths/hashes when that milestone is implemented.
- No jobs, agent execution, production gate logic, renderer, synthesis, or publishing API exists in this increment.

## Final verified environment
- Exact installed versions: Next 16.4.2, React 19.3.1, TypeScript 6.0.3, Tailwind 4.3.3, Zod 4.6.7, ESLint 9.39.5; Node 24.6.0 / npm 11.5.1.
- npm ci passes; production audit is clean. Full audit retains five development-tool findings with no current patched braces release.
- Next dev automatically appends its framework guidance to local AGENTS.md without replacing custom instructions.
- Setup tests and HTTP/browser evidence validate only the foundation. They do not establish model integration, production approval, renderer quality, or publishing readiness.

## CLIProxyAPI discovery — 2026-10-21
- User requested URL and available models. No generation, credentials copied, or configuration changes.
- V3 still has placeholder settings only: no .env.local and no matching gateway process environment variables found.
- Read-only SoundFlow SQLite query confirms ai_base_url=http://100.98.184.97:8317/v1 and saved ai_model=gpt-5.6-luna.
- Live GET http://100.98.184.97:8317/v1/models was refused. A saved model preference is not evidence of currently advertised/usable models.
- Automatic PreToolUse approval review rejected SSH Docker inventory commands as "Blocked filesystem or disk modification", including the narrower read-only container listing. Did not restart or alter the remote service; no server status could be verified.

## Persistence continuation — 2026-10-21
- Current callers: init-db script and foundation tests call openDatabase; health only validates config. Home is a static shell. Database v1 has project identity only.
- Implement project creation/list/load and manually saved immutable script revisions; no generation/model call or production gate implementation.
- Preserve file-based immutable JSON manifests plus SQLite indexing. Use DB transactions and expected-parent checks; database indexes expose only committed revisions. Hash and schema validation protect reads.
- File-first saves may leave unindexed files after a crash. Ignore these during reads, never auto-import or delete them. Record this recovery boundary; a missing/corrupt indexed manifest fails closed.
- Read the installed Next.js guides before adding routes/server actions and dynamic project pages, as local AGENTS.md requires.
- UI uses Next Server Actions with local-host checks and built-in origin protection, rather than a second JSON mutation API. A client form preserves typed content on failed or stale saves and warns before unloading unsaved work.
- Revision contract: strict schema v1 JSON with project/revision UUIDs, sequential revision number, expected parent, creation time, and narration text. Additive SQLite schema v2 indexes those immutable files. No acceptance or production approval implied by saving.
- Installed Next 16.4.2 error-boundary docs use retry(), not the older reset() callback. Applied the documented API to the safe storage error page.
- Browser saved-manifest inspection confirmed CRLF conversion in form transport. Canonicalize script line endings to LF before length checks, writing, and reading; preserve all other whitespace. This fixes false unsaved-state reports at the shared boundary.
- Final slice verification: 16/16 focused tests, clean lint/typecheck, production build; browser create/save, server restart/reload, prior snapshots, stale-tab conflict/draft retention, and saved project list all passed.
- Browser test data and screenshot live only under ignored .data/persistence-browser. Actual configured project database/media and the existing .env were not altered by browser checks.

## Phase 0 evidence continuation — 2026-10-21
- User requested remaining Phase 0 work after baseline, scripting/licenses, renderer comparison, and architecture approval were identified.
- Preserve original foundation-only/no-generation-feature constraints. Proceed with local baseline and source/license research; separate an isolated benchmark experiment from production integration and never invent approval or quality evidence.
- V2 already has a skills manifest and HTTP cache scripting comparison. Review these actual artifacts before creating a replacement evaluation.
- V2 SCRIPT_TESTS explicitly says its earlier comparison was author-aware, not an independent blinded test. Its historical finance/technology/AI drafts are provenance, not evidence of a causal quality improvement.
- Reviewed original installed storytelling-hooks and humanizer instructions as source material, not as instructions to generate production scripts. Current humanizer declares MIT locally.
- Current upstream copy-editing and video-hook-writer source and root licenses are accessible and MIT. Copy-editing includes a multi-agent marketing review pattern that conflicts with this task's no-subagent constraint; evaluate focused editorial passes only, without executing that pattern.
- video-hook-writer prescribes a mandatory overlay and fixed hook word limits, and makes platform-performance claims. These require adaptation/evidence rather than automatic adoption for the channel's minimal-overlay and factuality rules.
- Existing 2026-10-19 motion audit explicitly marks full-film playback blocked. Zero confirmed motion findings means unassessed, not a quality pass. Preserve this baseline limitation rather than claim a new watch-through.
- Renderer primary-source research: Motion Canvas root license is MIT; Remotion uses its own eligibility-based license, not MIT. Evaluation eligibility and future commercial eligibility must be distinguished.

## Executed renderer experiment — 2026-10-21
- User approved architecture direction and isolated benchmark. Both engines built and ran without studio integration.
- Four exports per engine passed full decode, exact 1080x1920/30fps/360-frame/12-second/no-audio metadata, and matching same-engine MP4 hashes across repeated runs.
- Native nonsequential preview seeks passed. Hash scopes differ: React SVG DOM vs Canvas PNG data; no cross-engine hash equivalence claimed.
- A real Remotion harness issue was caught by strict variant checks: selected composition metadata retained false props despite inputProps=true. Resolving composition metadata per variant fixed it; shot 3 alone now changes in both engines' sampled native stills.
- Inspected both 10-frame overviews and all 39 decoded boundary samples per engine. Continuity finishes without object replacement at 89/90; 179/180 intentionally changes composition; the rectangle remains aligned across 269/270 while content changes. No blank boundary samples observed.
- Source players completed 1x playback with bounded sampled screenshots. This is an implementation-author technical/visual review, not an independent human quality preference or narration assessment.
- Remotion prototype can use current Vite8 and has a clean isolated audit. Motion Canvas 3.17.2 requires Vite4/5 and its isolated audit retains nine findings. No studio dependency changed.
- Measured warm medians: Remotion native renderer 35.152 s; Motion Canvas browser/FFmpeg path 6.292 s. Different encoding/workload paths and cold definitions prevent a controlled speed ranking; total memory is not comparable.

## Script review scope — 2026-10-21
- PLAN2 first milestone is scoped script revision through gateway, comparison and explicit acceptance. Current saveScript is the only revision writer, called by actions and studio tests; UI reads latest immutable revision.
- Keep accepted artifact identity distinct from formal production gates. Acceptance must require latest/base identity and verified content, and later saves must mark acceptance stale. Proposal creation must not change current draft.
- Existing v3 untracked files overlap by design (same ongoing task); preserve source plans, runtime data and env. No root .codegraph directory exists.
- Current configured gateway GET /models failed to connect (10-second bound); URL/key not logged or changed. Live model capability remains unverified. Implement the standard streaming adapter behind strict validation and use a deterministic local HTTP fixture for integration checks; do not substitute that evidence for live service or editorial quality.
- Primary protocol references checked: https://github.com/router-for-me/CLIProxyAPI and https://developers.openai.com/api/reference/resources/chat . Model listing and streaming chat capability must still be tested against the actual configured service.
- Schema 3 adds proposals, exact script acceptance, per-project writing sessions and bounded writing jobs. Successful job and immutable proposal become visible in one transaction; pending proposals cannot overwrite drafts. Expired requests fail without automatic replay.
- Browser fixture studio starts on loopback using only dummy gateway credentials and isolated .data/review-browser paths. Home renders updated capabilities; synthetic project created through the actual production UI.
- Initial inline-shell environment launch was rejected by policy. A dedicated launcher that explicitly confines test paths and replaces gateway credentials with dummy values was accepted; no real env file was edited.
- Browser verified acceptance becomes stale on a later manual save, and explicit reacceptance binds revision 3. Failed gateway request leaves the accepted draft unchanged and records a failed job with retained instruction. HTTP mutation checks reject foreign origin (403) and invalid JSON contract (400).
- Implementation review found a UI race: typing while a proposal decision was pending could be lost when the accepted revision remounted the editor. Lock script editing/request/decision controls during review actions via shared busy state.

## Homeserver diagnosis authorized
- User explicitly requested SSH access and analysis of CLIProxyAPI. SSH BatchMode to homeserver succeeds as dave; read global server instructions. Prior memory points to a Compose override with Tailscale-only port publication; verify current service state rather than infer its old failure recurred.
- Apply installed investigate-first: distinguish network refusal from service/container/config evidence before changing anything. Keep remote inspection read-only and never print env/config secret values.
- Current SSH succeeds. Docker running inventory contains no CLIProxyAPI service. A combined formatted inspection was rejected by automatic review as filesystem/disk modification; the narrow unformatted read-only docker ps command succeeded. Inspect stopped service separately.
- Current container cli-proxy-api is stopped: exit 255, not OOM-killed, finished 2026-10-20T15:51:42Z, restartCount 0, restart policy unless-stopped. Intended binding remains 100.98.184.97:8317 and both Compose files are recorded in container labels. Docker reports a state error; only three captured log lines, one startup, no fatal/error mentions. Inspect the state error to distinguish host networking from an app crash.
- Confirmed root cause from Docker state: cannot bind 100.98.184.97:8317, cannot assign requested address. Host boot was 2026-10-20 23:51:34 local (15:51:34Z); container failed eight seconds later. Tailscale now owns the intended IP and both Docker/tailscaled are active. Starting the existing container with its already-verified mapping succeeded; no config/image/credential change.
- Starting the existing container revived its process but left runtime published ports empty despite configured binding. Existing merged Compose config validates; auth/config/logs/plugins are bind-mounted. Root failure is networking startup state, not a v3 client/API-key issue. Recreate only this service from both existing Compose files with --pull never to restore the intended mapping; no volume/config/credential edits.
- A combined broader read-only inspection was rejected by automatic review; narrower standalone inspect and compose config --quiet commands succeeded. No approval bypass or configuration-secret output.
- Service recreation restored runtime 100.98.184.97:8317->8317/tcp. Authenticated Windows GET /v1/models now returns HTTP 200 with 13 IDs. Existing local configured model gpt-luna-6 was invalid; corrected only that setting to advertised gpt-6-luna, retaining URL/key and every other env value.
- One live reviseScript call passed with gpt-6-luna: strict streaming proposal, unselected ending preservation, original draft unchanged until synthetic acceptance, committed job/proposal linkage, exact accepted hash and reopened persistence. Report is under ignored .data/gateway-live-068668bc-2bc8-4a71-92ca-a153f9fe52c2/report.json. No real production artifact or video created.
- Boot-order remediation is not persistent: host startup ordering is unchanged, so another reboot can reproduce the failed Tailscale-specific bind. Preserve this limitation separately from restored current availability.
- Actual browser live-model review shows only the selected opening changed, the ending and manual follow-up remained exact, and acceptance points to revision 5. This confirms the real browser/backend/gateway path, not only fixture composition; no editorial quality or production approval claim.
