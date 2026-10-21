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

## Researched writing continuation
- User requested remaining work after script-review completion. Start research/payoff, hook choice and editorial writing before storyboard/media production. No root CodeGraph index. Existing untracked v3 files are prior work in this task and must be extended, not replaced.
- CLIProxyAPI provides model access, not verified web research. Use explicit user-supplied source notes and claim references; never label a generated citation as independently verified. No arbitrary URL fetching or model filesystem tools.
- Keep writer/refiner/editor calls separate; an isolated editorial model response is not blinded human preference or formal approval. The prepared five-brief human evaluation remains a real acceptance boundary.
- Chosen implementation: schema 4 adds persistent research/hook/draft runs with immutable hash-bound JSON and parent hashes. Hook choice is explicit; writing, installed humanizer and editor are separate bounded calls. Reviewed-draft import uses the existing revision transaction and is idempotent; edits or a changed research brief invalidate dependent acceptance.
- Use installed skill files directly from the user skill directory, including storytelling-hooks/patterns.md, and record every file hash in generated artifacts. Channel constraints override mandatory overlays/CTA advice. No new dependencies or model tools.
- Tests cover distinct hook contracts, source/claim linkage, preserved claim coverage, role-isolated editor inputs, reject-with-findings behavior, stale briefs/manual edits, idempotent draft import, source-dependent acceptance staleness, corrupt artifact/rollback safety, timeout expiry, installed skill hash loading and shared HTTP trust boundaries.
- The existing schema-2 test fixture needed correction: it had fabricated old state by stripping known tables from the newest schema. It now creates a genuine legacy schema and migrates exact existing revision bytes/hashes without destructive fixture manipulation.
- Consulted MDN HTTP caching guide for the live technical writing check (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching): stored responses can be reused under freshness policy, stale content may require revalidation, and no-cache differs from no-store. The application will use supplied paraphrased source notes, not claim automatic retrieval.
- Snapshot the existing synthetic schema-3 browser database rows and revision/proposal file hashes before the new app opens it; this will independently verify preservation through schema-4 migration.
- Browser fixture preserves installed-skill hashes, dependency IDs and source references. The imported script is a new revision and remains awaiting human acceptance; previous acceptance is stale. Real hooks requested against the configured gateway using only the public-source cache brief.
- Live artifact records original storytelling-hooks SKILL.md hash 5a2fae7641373f485a92e69638846aeb1c567dd83f14af9f17a5deb45829a264, patterns.md c62489b929e7382cccdf464b62e7889b55a4e6a064b1d926a519005e18f4c86f, and humanizer SKILL.md 0612f1dfb1672b0ea9b97e139bf1f06cabe98d8b27424fe8ff01e1fb4cc99cad. Both versions and model editorial advice were visibly inspected; no human quality preference is inferred.
- Repository HEAD changed externally during this run from 24cf2ad to 6261616 (Add v3). No commit was created by this agent. Preserve that history; the current dirty/untracked changes are confined to v3. All 731 frozen v2 and 22 benchmark hashes still match.
- Final runtime HTTP checks: health 200 reports scriptwriting implemented and video generation not implemented; both writing and scoped-revise endpoints reject foreign Origin (403) and invalid request contracts (400). Persisted live results/import link survive the final server restart.

## Matched writing evaluation — 2026-10-22
- User authorized continuation after the remaining-work report. Active scope is the five-brief writing evaluation, with human decisions left real and pending. Existing dirty/untracked v3 files overlap this ongoing task; preserve them. No root .codegraph exists, so skip CodeGraph.
- Resolver returned no named plan; retain the documented v3-root legacy plan. Read current plan/findings/progress and both source plans. No relevant memory entry found for this increment.
- Prepared comparison requires fresh outputs for all five briefs under the same inputs/model alias, rather than treating unmatched historical writing as a controlled baseline. Shared author-selected hooks isolate downstream writing differences; this does not compare hook-selection quality or prove causal skill efficacy.
- RFC 9111 opened successfully; RFC 9110 main page exceeded the web tool limit. Use targeted section content. Financial and invoice figures are explicit synthetic arithmetic, not financial advice or verified business income.
- Source checks: RFC 9111 permits conditional reuse/freshness behavior; HTTPWG RFC 9110 §15.4.5 confirms a 304 has no response content. University of Arizona Libraries FAQ 387173 explicitly distinguishes citation existence from claim support. Source notes are paraphrased, limited to the prepared factual scope. Synthetic calculations are checked locally, with example.invalid clearly labeled as a non-source.
- Added a small offline evaluation runner and focused packet tests. It reuses real v3 generation/store/gateway and original installed skills; baseline uses the frozen v2 guide via the same transport. Fixed isolated .data paths prevent touching user projects. Source hashes freeze both prompts and implementation before model calls.
- Cornell's guessed generative-AI guide URL was inaccessible. Replaced it with the verified University of Arizona library FAQ; no unsupported source was retained.
- Concrete diagnosis from the isolated response observer: actual gpt-6-luna returned a complete stop-finished JSON response, but hook id 304-no-image starts with a digit and violates the existing key schema. The prompt previously allowed lowercase letters/numbers/hyphens without specifying first character/40-character maximum. No gateway outage or timeout is inferred.
- A diagnostic-only source copy exposing the original exception confirmed another Zod ID-format failure after prompt clarification. A separately observed valid response passed protocol and storage replay; this does not establish every failed response was valid.
- Final fix assigns hook-1 through hook-5 on the server and validates all creative fields and distinct angles. Stored historical IDs are unchanged. Tests cover numeric/duplicate generated labels, exact creative-text preservation, unexpected-field rejection and the actual generation/store path. Focused 11/11 checks pass.
- Aborted runs 690d2770-0a3a-4d29-b8ae-6e8f664fbb39 and 5c148c83-bb67-4206-9c04-8b94b98d4761 remain intact, including failed requests and explicitly marked offline/diagnostic replays. They are excluded from the final comparison. A fresh frozen run follows the verified fix.
- Fixed only the hook-generation instruction to match the existing schema, retaining strict validation. Added regression coverage for digit-leading/overlength IDs and the prompt's explicit constraints. Preserve all failed attempts in run 690d2770-0a3a-4d29-b8ae-6e8f664fbb39; start a new frozen run after this justified prompt change.
- Finance pair complete. Both final narrations preserve 100 → 50 → 75, 50 → 100 requiring 100%, and the hypothetical/fees/deposits boundaries. The v3 model editor returned revise because ten visual counters were not explicitly mapped to 100. Preserve that rejection; do not regenerate into a ready verdict. Future visual treatment must label each counter as 10 or the group as 100.
- Author-only annotation concern: v3 finance line 2 explains the changing base but has empty claimIds, although the supplied arithmetic supports it. Structural coverage is not semantic fact-to-line verification. Record in diagnostics; human read-aloud/preference still pending.
- Cache pair complete. Both narrations preserve storage versus freshness, conditional fresh reuse, body-free matching 304 and changed-content response-body possibility, with reload/freshness caveats. V3 editor returned revise with concrete teaching/closing findings. Retain this result, including its dense final line and empty claimIds on validation explanation line 4; no automatic rewrite or ready verdict.
- Citation pair complete. Both teach citation existence plus actual passage support, with an unavailable-evidence/unverified stop condition. V3's added policy/cost sentence is explicitly hypothetical, not a claimed experiment. Model editor returned ready; that is advisory only. Baseline repeats the verification instruction, while v3's example remains abstract; actual read-aloud/preference remains pending.
- Invoice pair revealed an evaluation-input problem: the prepared packet's operational rule to record model/settings/hashes was included with narration boundaries. V3 spoke that rule in line 8; its editor correctly rejected it. This is not a fact about invoice checking and must not enter the viewer script. Preserve this diagnostic round, then keep operational recording rules in the runner rather than the supplied narration brief before the final comparison.
- Final round finance pair complete. Arithmetic and fees/deposits/hypothetical conditions survive both refinements; v3 model review says ready. Its line 2 still lacks claimIds for a factual mechanism supported by the supplied arithmetic. Preserve that annotation limitation rather than equate structural coverage or model review with independent fact verification.
- Final cache pair: baseline retains applicable-rule qualifications on 304 reuse. V3 line 5 says the stored copy can then be used; its later caveat limits the claim, but the model editor correctly requests an explicit reuse-permission qualification on that same step. Author factual/clarity disposition is revise that ambiguity, not an unconditional pass. Preserve the exact draft and verdict for comparison.
- Final citation pair: no real tool-performance result or failure-rate claim is asserted; the tool/time sentence is explicitly hypothetical. V3 model editor asks for a concrete claim/passage support example and less repetition. Author follow-up should use clearly fictional source wording (for example one sample versus all samples), not invent a real study. Actual user preference and audible delivery remain pending.

## Final five-pair evidence
- Final feedback receipts bind all five author-edited proposals to the unchanged comparison and saved full-pipeline outputs. The invoice model recheck caught an unrelated opening claim reference; a proposed new annotation now uses claim-2 only, with original spoken text and frozen hook preserved. Separate model-only recheck has no remaining findings.
- Latest exact script hashes associate to ready model advice for all five, including the corrected invoice annotation. This does not establish independent human preference, read-aloud quality, factual certification or production acceptance. Pending instructions were correctly recorded as unknown rather than inferred.
- Required check/build, immutable dependency checks, original comparison hashes and sibling snapshots pass. Feedback verification records the generation-before-handoff-fix boundary and the focused propagation tests rather than implying a fresh full live run after that fix.
- Feedback run f267786c produced five new full-pipeline drafts with actual installed-skill passes. Finance still repeated its ending/disclaimer and citation omitted the user's requested final takeaway. The refiner/editor did not receive request.instruction, so later stages could not check the full change request. Pass user requirements to both; retain role isolation from current writer notes/original and prior verdicts. Update focused handoff assertions.
- Preserve the raw feedback model outputs; create separately identified author-edited proposals to implement the direct revision requests without rerolling for a favorable model verdict. These are not human acceptance or a new blinded comparison.
- Shared runtime narration guidance now applies to full hooks/writer/refiner/editor and scoped replacement calls. It retains conditions/hypothetical labels, places the payoff at a complete script's ending, suppresses repetitive disclaimers and bookkeeping, and explicitly limits scoped advice to the selected section.
- Keep claimIds-specific instructions in the full annotated-script contract, not the shared scoped guidance: scoped replacements return only replacement/notes and have no supplied claim-ID interface. Full drafting now explicitly treats mechanism explanations and derived numbers as factual for annotations.
- Focused 14/14 scriptwriting/gateway checks pass, including all four full-stage prompt handoffs, scoped guidance propagation, exact selection context and existing persistence/scope protections. No source plans, database schemas or installed skills changed.
- User supplied text preferences and concrete revision instructions for all five pairs on 2026-10-22. Exact A/A/B/B/B labels are bound to frozen packet/provenance and preferred narration hashes in human-review.json. Mapping is mixed: finance/invoice/newsletter trial, cache/citation baseline. This is not evidence of a general winner.
- Read-aloud and blinding attestations were not supplied. Keep spoken naturalness and fully blinded preference unassessed; do not infer exact-revision or production approval from preference.
- Continuation reuses existing full writing/refinement/editorial and immutable storage; shared concise narration guidance must reach full writing and scoped requests. No root CodeGraph index; existing local v3 changes are prior work in this task and will be preserved.
- Invoice arithmetic/source comparison is sound, but v3 line 5 handles only a field missing from the source; the extraction-missing case needs explicit stop/review wording. Its model ready verdict missed this completeness issue.
- Newsletter figures remain conditional/hypothetical and do not establish net profit. Both permission passages need qualification to applicable requirements; this is a wording diagnosis, not a legal determination.
- Model verdicts are two ready/three revise; exact outputs/findings are retained. Structural coverage is not semantic support verification. Author diagnosis is not blinded human preference or audible assessment.
- Independent final check matches all ten A/B narrations to outputs and the separate key; package hashes, frozen sources and immutable dependencies pass. Human results remain pending and prior chat exposure must be disclosed.
# Visual planning increment — 2026-10-22

- Live model board now loads in the browser. Shot 2 visibly preserves equal-width quantities and changes the removed half to gray, with 50-remaining/50-removed labels; start/end drawings and narration navigation were inspected. This is planning-image proof, not motion/audio evaluation. The live storyboard remains unaccepted.

- The explicit live diagnostic confirmed `Gateway response exceeded the size limit.` at roughly 3 KB of decoded JSON. Raw SSE envelope bytes, not model JSON alone, consumed the shared 300 KB cap. The adapter now keeps the 300 KB decoded-content cap, a 300 KB incomplete-frame cap and a separate 4 MB total transport cap. A 4,000-character multibyte/one-character-delta regression passes; all 45 tests pass. This shared transport fix also benefits existing script callers without changing their result contracts.

- Live synthetic diagnostic run produced three valid concepts but its storyboard request failed before persistence. The first failure had no diagnostic detail, so its cause is not established as schema rejection. Added fixed, safe transport/timeout categories alongside sanitized Zod paths; do not expose arbitrary upstream error text. Failed jobs remain visible and are not replayed automatically.
- Frozen sibling verification: all 731 v2 files and 22 renderer benchmark source files match their recorded SHA-256 hashes; v1/v2/publishing and both source-plan tracked diffs are empty.

- Seven focused visual tests cover contracts, the full gateway flow, exact acceptance, scoped replacement, research/script/concept staleness, concurrency, cancellation, corruption, orphan preservation, rollback and migration. First run: 6 pass; the migration fixture needs all referenced tables created before restoring rows.

- Implemented additive schema 5 with bounded jobs, immutable hashed JSON visual artifacts, immutable concept selection events and exact storyboard acceptance. The SVG contract allows only four shape types, validated colors and bounded coordinates, and React renders text as text.
- Narration references cover every nonblank accepted line once in order. Selected-shot replacement validates unchanged line references and reconstructs the board from the original other shots. No model-supplied full replacement is trusted for scoped revisions.
- Initial lint/typecheck and all 37 existing tests pass. New visual-specific verification is next. A guessed database.test.ts filename did not exist; use the actual test inventory.

- PLAN.md requires three pictured concepts, shot teaching purposes, narration references and relationships between neighboring shots. Static declarative SVG boards can show intended layouts safely; they are planning images, not screenshots from an animation renderer.
- Current script acceptance verifies exact immutable revision bytes and inherited research currentness. Reuse that boundary for all creative mutations and completion checks; real revised evaluation scripts remain unaccepted.
- Existing loopback-only NDJSON request transport and gateway are reusable. Schema 4 needs an additive migration. Existing changes belong to prior v3 work and will be preserved. No root CodeGraph index is present.
