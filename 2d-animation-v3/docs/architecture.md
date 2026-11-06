# Foundation architecture and decisions

## Authority and scope

[Quality bar](quality-bar.md) owns creative defaults; [STATUS](STATUS.md) owns implemented/pending state; [reference map](reference-map.md) routes stage-specific detail. Guidance neither changes schemas nor activates CQ rules/approvals. Preserve immutable inputs, audio, decisions and exports.

Remotion 4.0.537 owns frame time/overlaps; its official GSAP adapter interprets validated declarative instructions. Models never supply executable animation. Architecture/isolated-renderer approval on 2026-10-21 selected the engine, not human production gates. V2's OneTake-only policy does not apply to V3.

## Current implementation

| Owner | Responsibility and boundary |
| --- | --- |
| Browser/App Router | Saved projects, creation, latest editor/read-only revisions; show exact saved content. Default to server components. |
| Server Actions/routes | Validate input and exact loopback Host/Origin, plus Next origin protection. Node runtime owns secrets/filesystem/SQLite; clients never import `server/`. |
| Gateway/workflow | Server-only CLIProxyAPI, bounded request-bound streaming, persistent jobs/sessions. Verify actual capabilities; completion is not acceptance. No model tools/filesystem access. |
| SQLite | Mutable project metadata, indexes/hashes, decisions, jobs and sessions. |
| Immutable files | Hash-bound script/proposal/research/visual/motion JSON and WAV audio under project directories. Never overwrite prior content. Markdown is guidance/review/export, not another editable store. |
| Acceptance/gates | Exact script/board/motion decisions, Gate 1/2 and separate render authorization; bind dependencies, audio/timing, assets and engine configuration. |
| Engine | Remotion time/transitions, official GSAP, Player/guarded export. Structured instructions only; synthetic tests never grant human approval. |
| Skills | Original installed files through verified manifests; no copied/silently installed skills. |
| Voice | Explicit provider/import contract; no writes to sibling source/shared voice assets. Defaults follow quality/audio references. |
| Publishing | `video-workflow` currently expects V2 receipts; V3 handoff needs explicit adaptation/authorization. |

Entry points: `app/page.tsx`, `/projects/<uuid>`, `POST /api/projects/<uuid>/revise`, `GET /api/health`, `npm run db:init`. Storage: `.data/studio.sqlite` via `server/database.ts`; revisions at `videos/<project-id>/scripts/<revision-id>.json`. Tests isolate temporary databases/directories.

Launch commands bind loopback; remote authentication is unimplemented. Health validates `server/config.ts` only, imports `server-only`, and exposes no environment values, paths, credentials or raw validation errors.

Dependencies: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Tailwind](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [Node 24 SQLite](https://nodejs.org/docs/latest-v24.x/api/sqlite.html); exact versions/integrity in `package-lock.json`.

### SQLite ownership

[Persistence contract](persistence-reference.md#sqlite-ownership) owns schema history, initialization and interchange boundaries. Native SQLite is experimental in Node 24.6; reassess before distribution/deployment.

### Revision files and concurrency

[Revision contract](persistence-reference.md#revision-files-and-concurrency) owns exact fields, LF normalization, transactions, stale saves, integrity and orphans. Never overwrite prior revisions or auto-import/delete crash files.

### Upgrade and rollback

[Recovery contract](persistence-reference.md#upgrade-and-rollback): stop old app, back up matching database/files, never mix schema versions or destructively downgrade.

### Scoped script review and acceptance

[Implementation contract](persistence-reference.md#scoped-script-review-and-acceptance) owns UTF-16 selections, gateway bounds, proposal decisions and request expiry. [Writing guide](researched-writing.md) owns authoring/review/import. Only latest valid accepted scripts are eligible for planning; later edits stale acceptance.

## Production boundaries

Research imports are transactional/idempotent new script revisions, never automatic acceptance. Validate parent hashes, selected hook, claim coverage and editorial line references. Research dependencies follow manual/scoped descendants; changed briefs stale their receipts. Changed topics/sources cannot reuse approvals.

Track script/shot/narration/preview dependencies. Changed accepted artifacts, narration bytes/timing, assets or renderer configuration stale affected bindings/decisions without rewriting history. Automated orphan reconciliation remains deferred.

## Deliberate exclusions

No cloud rendering, automatic downloads, remote authentication, publishing activation or automatic human approval. Synthesis/alignment require explicitly selected authorized tools. Rendering requires installed Chrome/FFmpeg/ffprobe, current gates and explicit authorization. Local jobs retry explicitly after expiry. Benchmarks remain isolated.

## Motion graphics and narration planning (schema 8)

Interpreter 3 expands versioned beats through official GSAP; interpreters 1/2 preserve behavior. Components expose validated named parts; engine hashing covers render/quality dependencies. Schema 8 adds `planning_timing` and immutable script/audio-bound JSON/WAVs without rewriting production records.

Planning timing is independent of motion acceptance; final narration binds accepted motion/exact planned audio and timing when present. Corrections stale dependencies, never rewrite approval. [Motion workflow](animation-workflow.md#interpreter-3-choreography-and-components) owns review/rollback; independent creative evaluation remains required.

Historical only: [GSAP roadmap](archive/docs/GSAP-IMPLEMENTATION-PLAN.md), [GSAP reference](archive/docs/GSAP-INTEGRATION.md), `archive/docs/PLAN.md`, `PLAN2.md`. Load on explicit request, never at startup.
