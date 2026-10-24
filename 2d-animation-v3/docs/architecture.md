# Foundation architecture and decisions

## Authority and scope

The [GSAP implementation roadmap](GSAP-IMPLEMENTATION-PLAN.md), based on the
supplied [GSAP reference](GSAP-INTEGRATION.md), is implemented through the connected
motion workspace and production foundations. Remotion owns frame time and overlaps;
the official GSAP adapter interprets validated declarative instructions. Models never
provide executable animation code. Schema 7 adds motion and production records
without rewriting existing scripts, boards or benchmark artifacts. See
[animation workflow](animation-workflow.md) for current limits and verification.

PLAN.md is the primary roadmap. PLAN2.md extends it with interactive agent
revisions. Foundation, project/script persistence and scoped script review are implemented.
The user approved architecture direction and a separately isolated renderer
experiment on 2026-10-21. Its evidence selects Remotion 4.0.537 for the first
studio implementation. Architecture approval is not human production approval.

## Current implementation

```text
Browser -> Next.js app/page.tsx (saved projects and creation form)
Browser -> /projects/<uuid> (latest editor or read-only revision)
Server Actions -> local host/origin validation -> project/revision store
Browser -> POST /api/projects/<uuid>/revise -> bounded server gateway -> immutable proposal
Script review -> explicit accept/reject -> revision + accepted identity
Browser -> GET /api/health -> server/config.ts (validation only)
npm run db:init -> config -> server/database.ts -> .data/studio.sqlite
Revision store -> immutable videos/<project-id>/scripts/<revision-id>.json + SQLite hash/index
tests -> temporary isolated databases and revision directories
```

Use App Router server components by default. Server code owns secrets and Node
filesystem/SQLite access. Route handlers use the Node runtime; client components
must never import `server/`. The health route imports `server-only` and never
returns environment values, paths, credentials, or validation error details.
Mutations use Server Actions with input validation, exact loopback Host/Origin
checks, and Next's origin protection. Launch commands bind loopback only;
authenticated remote access is not implemented.

Dependencies follow current official [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
and [Tailwind integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
guidance. SQLite uses the installed runtime's [Node API](https://nodejs.org/docs/latest-v24.x/api/sqlite.html).
Exact package versions and integrity records live in package-lock.json.

### SQLite ownership

Schema 7 preserves projects, script/proposal indexes and decisions, accepted script
identity/hash and scoped-writing sessions/jobs. It adds evidence-grounded writing
runs and their dependency/index/import references, plus visual jobs, concept selection
events and storyboard acceptance, motion proposals/decisions and append-only narration,
gate and render records. Source content remains immutable JSON; audio is hash-bound WAV.
Initialization uses an
immediate transaction, enables foreign keys and a bounded busy timeout, and
records `PRAGMA user_version`. Schemas 1–6 expand transactionally without rewriting
projects or revision files; version 0 initializes all tables. Future versions fail closed. Tests
cover migration retries, failed expansion rollback, and data preservation.
Native SQLite avoids adding an ORM or compiled addon. Its experimental status
on Node 24.6 must be revisited before distributing or deploying the studio.

SQLite owns editable project metadata. The Zod project schema is for validated
interchange and future import boundaries, not a separately edited JSON mirror.
Project creation/list/load are implemented. Import/export, rename, and deletion
remain outside scope.

### Revision files and concurrency

JSON schema v1 revisions contain UUIDs, project ID, parent ID, sequential revision
number, timestamp, and narration. Canonical text uses LF; other whitespace is
preserved. SQLite owns the index and hashes, not another copy of narration.

Saving takes an immediate transaction, checks the expected latest parent and its
file integrity, writes and flushes an exclusive temporary file, renames it to a
new UUID path, inserts its index, and commits. Ordinary failures roll back and
remove only this attempt's new files. Prior revisions are untouched. Stale saves
return conflicts while preserving the user's typed draft.

Reads expose committed indexes only and verify SHA-256, schema and identity.
Missing or corrupt indexed manifests block loading/saving. A process crash between
rename and commit may leave an unindexed file; it stays invisible and is never
auto-imported or deleted. Interrupted temporary files also remain unindexed.
Preserve these for manual recovery. Atomic visibility does not guarantee power-loss
durability; back up both stores together.

### Upgrade and rollback

Stop the old app and back up database and videos before upgrading. Schema 5 is
additive/idempotent, with no destructive contraction or downgrade. Old foundation
code rejects newer schemas, so mixed versions must not share storage. Rollback requires
a coordinated pre-upgrade snapshot restored to separate paths. Preserve current
DB and files first so later drafts remain available for deliberate recovery.

### Scoped script review and acceptance

Selections use saved-text UTF-16 offsets, matching browser textareas; bounds and
split-surrogate boundaries are validated server-side. Request context includes
the exact full script, selected range and instruction, plus up to three successful
requests among the latest 20 jobs (instructions/notes/decision status) in the
persistent project session.
The gateway cannot invoke tools or write files. Its only accepted result is strict
JSON containing replacement text and editorial notes. The server constructs the
full proposed text itself, preserving every unselected character.

Immutable proposal JSON contains base revision, selection, instruction, replacement
and notes. File integrity is verified on read and acceptance. SQLite owns decisions.
Acceptance checks the latest base again, writes a new immutable revision, marks the
proposal accepted and stores an exact revision/hash receipt in one transaction.
Rejecting a pending proposal changes only its decision. Repeated/stale decisions
fail closed. Manual acceptance also checks the exact latest revision and hash.

An accepted script is eligible for visual planning only while its revision is
still latest and its file/hash verifies. Later edits make it stale. This is the
first dependency boundary. [Concept and storyboard planning](visual-planning.md)
now enforces it for generation, selection and artifact acceptance. Formal production
gate foundations additionally bind the exact reviewed motion, voice and engine inputs.
Synthetic test acceptance is never evidence of human production approval.

Writing jobs have one active request per project. Successful job/proposal visibility
is atomic. Streaming chat requests require the configured model to appear in the
gateway's model list; compatibility is tested per real request, never assumed from
listing alone. The server accepts bounded SSE output, rejects tools/refusals,
truncation, oversized responses and invalid JSON, and sends only progress counts
and a validated proposal ID to the browser. Raw upstream errors and credentials
are never returned. No response text is treated as factual verification.

The request is its worker: 90-second upstream timeout, disconnect cancellation,
no automatic retry. Running jobs become failed after their two-minute deadline on
next store access. A crash can leave unindexed proposal/temp files, which remain
invisible under the same manual-recovery rules as scripts. Request rows and submitted
instructions persist; unsent prompt drafts do not. There is no autonomous agent loop.

## Production boundaries

The [evidence-grounded writing workflow](researched-writing.md) adds immutable
research briefs, hook options, original/refined draft lines and editorial findings.
Parent hashes, selected hook, claim coverage and line references are validated.
Reviewed-draft import creates an ordinary new script revision transactionally,
with a unique source reference for idempotence. It never supplies acceptance.
Acceptance follows the nearest imported research dependency through subsequent
manual/scoped edits; changing the brief makes those receipts stale as well.
No new topic or altered source can silently reuse an old acceptance.

| Area | Responsibility | Constraint |
| --- | --- | --- |
| Studio UI | Select artifacts, prompt, compare, accept/reject | Display the exact saved revision |
| Workflow (script slice implemented) | Persistent script jobs, sessions, scoped proposals | Model completion never means acceptance |
| Server gateway adapter | CLIProxyAPI access and streaming | Credentials stay server-side; validate actual account capabilities |
| Revision store (scripts/proposals implemented) | Immutable JSON under videos; SQLite identity/hash index | Never overwrite prior revisions |
| Acceptance and production gates | Exact script/board/motion acceptance; explicit Gate 1/Gate 2 attestations | Bind gates to exact dependencies, narration bytes/timings, assets and engine configuration |
| Engine | Remotion time/transitions, official GSAP adapter, Player and guarded export | Structured instructions only; synthetic checks never supply real human approval |
| Skills | Reference original installed skills through verified manifests | No copied or silently installed skills |
| Voice adapter | Invoke existing Supertonic via a defined contract | No writes to sibling source or shared voice assets |
| Publishing adapter | Hand verified exports to video-workflow | Existing workflow assumes v2 receipts; v3 support requires explicit adaptation |

Scoped script edits create proposals. Acceptance commits a revision; it is
distinct from complete creative-plan approval. Track dependencies between script
lines, shots, narration and previews so changed inputs make affected outputs and
approvals stale. Exact production bindings invalidate gates when accepted inputs,
narration timing/bytes, bundled assets or renderer configuration change.

JSON manifests own immutable revision/proposal content; dependency manifests will follow
the same boundary. SQLite owns script acceptance, decisions, jobs and sessions; later stages will add their own state. Write files to
temporary paths, validate, rename atomically, then transactionally record their
hashes. Current script recovery boundaries are described above; automated
reconciliation is deferred. Markdown is review/export material, not another editable source.

## Deliberate exclusions

No cloud rendering, automatic voice synthesis/alignment, external asset downloading,
authentication, publishing activation or automatic human approval. Local rendering
uses installed Chrome/FFmpeg/ffprobe and requires both current gates plus explicit
authorization. Jobs are local and request-bound; interrupted jobs require an explicit
retry after expiry. Benchmark packages remain isolated. V2's OneTake-only policy does
not apply to v3.

## Motion graphics and narration planning (schema 8)

The motion graphics extension retains the existing renderer and immutable decisions. Interpreter 3 expands versioned beats through the official GSAP adapter; interpreters 1/2 retain their rendering behavior. Authored components expose only validated named parts, and production engine hashing includes the new render/quality dependencies. Schema 8 adds planning_timing and immutable script/audio-bound JSON/WAV inputs; existing production records remain intact. Planning timing is independent of motion acceptance, while final narration binds to accepted motion and its exact planned audio/timing when present. Corrections invalidate dependencies rather than rewriting approved artifacts. See [motion graphics workflow](motion-graphics/README.md) for review and rollback details. Independent creative evaluation remains a release gate.
