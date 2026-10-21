# V3 foundation and interactive script review

## Goal
Initialize isolated, runnable v3 foundation from PLAN.md and PLAN2.md, then complete the user-authorized interactive script-review increment. No video generation features, commits, pushes, subagents, or changes to v1/v2.

## Current Phase
Phase 0 and the authorized interactive script-review increment are complete. Real gpt-6-luna streaming, comparison, acceptance and reload passed after homeserver recovery. Production video generation remains disabled; the full roadmap is not complete.

## Next Step
Next product milestone: researched topic/payoff/hook writing and editorial evaluation, then visual concepts/storyboards. Integrate selected Remotion after those dependencies. Retain no-subagent/no-commit/no-push boundaries. Homeserver boot-readiness remediation remains a separate maintenance task.

## Phases
### Phase 1: Repository and plan review
**Status:** complete
- Read both source plans and current v2/publishing baseline; preserve all sibling projects.

### Phase 2: Architecture, ownership, and setup scope
**Status:** complete
- Define implemented versus planned responsibilities, metadata ownership, server boundaries and renderer decision requirements.

### Phase 3: Development shell, configuration, storage foundation
**Status:** complete
- Isolated Next.js/TypeScript/Tailwind setup, optional gateway configuration, project identity schema, explicit SQLite initialization, locked dependencies.

### Phase 4: Focused tests, build, local HTTP smoke check
**Status:** complete
- Clean lint/typecheck, 6/6 tests, SQLite init twice, production build, browser review, production/development HTTP health, npm ci.

### Phase 5: Record evidence, deferred work, and next steps
**Status:** complete
- README, architecture, next steps, findings, and progress record completed. Servers and temporary browser tab stopped/closed.

### Phase 6: Persistence contract and storage
**Status:** complete
- Extend schema compatibly, validate project/script inputs, preserve revision history and reject stale concurrent saves.

### Phase 7: Project and script workspace
**Status:** complete
- Create/list/open projects, edit manual script drafts, save and inspect previous revisions, reload persisted state.

### Phase 8: Verification and documentation
**Status:** complete
- Migration/data preservation, revision integrity/conflicts, browser create/save/reload, required project checks, updated handoff.

## Continuation decisions
### Phase 9: Freeze v2 baseline and evidence
**Status:** complete
- Record exact checkout, file hashes, existing quality evidence and known review gaps without modifying v2.

### Phase 10: Evaluate scripting skills and licenses
**Status:** complete
- Inspect actual installed sources and upstream licenses; document candidate fit and controlled comparison requirements.

### Phase 11: Renderer comparison and architecture decision packet
**Status:** complete
- Verify current renderer capabilities/licenses, define a matched mixed-shot benchmark, review architecture against both plans, and explicitly record any approval/benchmark work still pending.
- Decision packet, registry metadata, source/license pins and 360-frame experiment specification verified. Actual prototypes, measured playback/export results, renderer selection and human architecture approval are not complete.
- Human architecture approval and experiment-scope questions submitted; responses pending. Do not infer approval from elapsed time or this document.
- User explicitly answered "Approve architecture direction" and "Run isolated benchmark" on 2026-10-21. Supersedes pending status above; scope includes local matched prototypes, playback and silent exports, not studio generation integration.
- Both candidates built, four silent exports each verified, native seeks/targeted edits passed, and boundary samples reviewed. Decision and measured limitations recorded in docs/phase0/renderer-decision.md; Remotion selected without claiming speed or artistic superiority.

## Phase 0 boundaries (completed historical scope)
- No subagents, commits, pushes, edits to v1/v2, production model calls or video-generation features.
- Human architecture approval cannot be supplied by this agent. Distinguish completed evidence from required human decisions.
- Reuse installed planning-with-files to manage this continuation. Source PLAN.md and PLAN2.md remain unchanged.

## Continuation decisions
- User authorized continuation after the next incremental persistence slice was described. Original no-video-generation and no-subagent constraints remain.
- Existing v3 foundation is untracked local work from this chat; preserve it and source plans. Sibling tracked diff remains empty.
- A local ignored .env is now present with gateway settings. Preserve it; no credentials copied or logged. db:init now reads .env then .env.local, matching the app's local configuration.

## Decisions Made
- PLAN.md is primary; PLAN2.md adds the future agent revision architecture. Originals unchanged.
- Planning files live at v3 root via the installed skill's legacy fallback. No PLAN_ID or PWF_PLAN_ROOT was set; resolver returned no named plan.
- Sequential work in existing master checkout; no subagents, commits, pushes, or sibling changes.
- SQLite owns mutable project metadata and revision indexes/hashes. Immutable JSON now owns manual script revision content; project identity schema remains interchange only.
- Use native Node 24 SQLite; its experimental status is documented. No ORM/native addon.
- No production renderer, formal production approval engine, media generation or publishing integration. Script-only gateway requests/jobs and artifact acceptance were subsequently authorized and implemented; synthetic renderer packages remain isolated under benchmarks/.
- Compatible ESLint 9 retained: ESLint 10 violates bundled Next plugin peers. Full audit has five high development findings through unpatched braces; production audit has zero.
- Next dev appended its framework guidance block to v3/AGENTS.md while preserving local instructions. Retain the useful generated block.

## Errors Encountered
| Error | Resolution |
| --- | --- |
| v2/package.json does not exist | Inspected v2 README and Python requirements. |
| apply_patch rejected delete/add of the same template path | Replaced initialized planning templates directly; failed patch changed nothing. |
| ESLint anonymous PostCSS export warning | Assigned configuration before exporting. |
| ProcessEnv augmentation required NODE_ENV in test input | Config accepts its real Record<string, string or undefined> boundary. |
| ESLint 10 peer dependencies invalid (ELSPROBLEMS) | Restored compatible ESLint 9.39.5. |
| npm audit from repository root: ENOLOCK | Ran audit from v3; no root lock created. |
| README patch context did not match wrapped text | Appended audit note; failed patch changed nothing. |
| Browser save persisted CRLF while textarea state used LF, leaving a false dirty state | Normalize script line endings to LF in the shared contract; added a regression check. |
| Documentation patch failed on wrapped architecture text | Reapplied using exact contexts; failed patch changed nothing. |
| Motion Canvas Vite config failed: motionCanvas is not a function under an ESM package | Match the candidate's CJS Vite-plugin packaging by removing type=module only in its isolated package; rebuild to verify. |
| Combined verification command blocked as filesystem modification | Wrote a narrowly scoped benchmark verifier; direct invocation allowed read-only full-decode checks and explicit report writes. |
| Targeted-edit check: Remotion frame 180 unchanged by variant | Resolved composition metadata separately for each variant; recaptured stills, preserved export timings, strict check passed. |
| Motion Canvas seek-observation lacked hashes because a diff snapshot was saved | Recapture full visible accessibility state with disableDiffing; rerun verifier unchanged. |

## Remaining scope and limitations
- Full roadmap Phase 0 is complete within approved foundation scope: frozen baseline, source/license fit review, initial contracts, user-approved architecture and measured renderer selection. Scripting efficacy remains a later matched-output/human test.
- Runtime SQLite experimental; development dependency audit/deprecation outstanding upstream. Do not claim production readiness.
- Creation/list/load, immutable script history, scoped gateway revisions, jobs/sessions, comparison/acceptance and script-staleness detection are complete. Full researched writing, visual concepts/storyboards, downstream invalidation, production and publishing remain future tasks.

| Installed error guide 16-error-handling.md did not exist | Use existing guide filenames; required server/actions/page guides were available. |

## Authorized production-studio continuation — 2026-10-21
User requested work on remaining tasks. Begin PLAN2's script review vertical slice; complete and verify it before visual-concept or renderer integration. Existing local v3 edits are this task's work and will be extended. No subagents, commits, pushes, or sibling edits.

### Phase 12: Review contracts and compatible persistence
**Status:** complete
- Scoped proposals separate from drafts; explicit accept/reject; exact accepted revision identity and stale dependency state; failure/concurrency checks.
### Phase 13: Script selection and review UI
**Status:** complete
- Select saved text, request changes, compare original/proposed content, accept/reject and reload state.
### Phase 14: Gateway writing jobs
**Status:** complete
- Verify configured gateway capabilities without exposing secrets; implement bounded validated script-only requests with persistent job/session evidence if reachable.
- Authenticated real model discovery, gpt-6-luna server smoke check and actual browser request/acceptance/reload pass. Model typo corrected only; no secret edits.
### Phase 15: Verify and document continuation
**Status:** complete
- Required checks/build, browser review, failure recovery, unchanged sibling proof; record remaining production work honestly.
- Final lint/typecheck and 26/26 tests pass; production build passes. Fixture and real-gateway browser paths verified. All 731 v2 and 22 benchmark hashes matched; sibling tracked diff empty; temporary local test servers/tabs closed. Remote gateway remains running as intended.

Error: use-server.mdx is absent in this installed Next release. Located actual use-server.md and server-actions.md; use installed filenames.
| Optional authorization header inferred as undefined union | Give the helper its actual Record<string, string> return contract. |
| Next lint rejects location.assign for internal navigation | Use the documented client router after proposal persistence; refresh history on failure. |
| Node assert.rejects types reject explicit undefined predicate | Use Error as the expected error constructor, retaining the case label. |
| Shell command with inline fixture environment rejected by policy | Use a dedicated browser-test launcher with fixed isolated paths and dummy gateway credentials; no .env mutation. |
| Full-page browser screenshot capture unavailable | Use supported viewport capture and targeted scrolling; acceptance state already verified by visible UI. |

### Phase 16: User-authorized homeserver gateway diagnosis
**Status:** complete
- User explicitly requested SSH access to analyze CLIProxyAPI after local connection failure. Inspect service, network bindings and sanitized logs before any change. Never print credentials or raw secret-bearing configuration.
- Confirmed boot-time Tailscale bind failure; existing-container start did not publish ports. Validated both Compose files and bind mounts; recreated only CLIProxyAPI without pulling an image. Runtime binding and HTTP 200/model access restored. Persistent boot ordering unchanged.
| Combined remote formatted inspection rejected by automatic review as filesystem/disk modification | Narrow unformatted read-only docker ps succeeded; continue exact service inspection. |
| Live proposal exceeded the browser locator short wait | Observed current UI; original request completed successfully. No duplicate model request. |
