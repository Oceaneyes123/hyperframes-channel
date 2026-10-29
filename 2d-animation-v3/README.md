# HyperFrames Studio V3

Start with [STATUS](docs/STATUS.md) for current verified capabilities and pending
decisions, then [architecture](docs/architecture.md). This README owns setup;
production, writing and review guides are linked from STATUS and loaded for the
current task only. V1 is a shared dependency of V2; publishing remains separate.

## Development

Use Node 24.6 or a newer Node 24 release and npm. `.node-version` records the
tested runtime. Node's built-in SQLite is experimental in Node 24.6; no SQLite
addon, ORM, Python environment, FFmpeg, model, or renderer is required for setup.

Run from `2d-animation-v3`:

```powershell
npm ci
# Optional; defaults work without an environment file.
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run db:init
npm run dev
```

Open http://127.0.0.1:3003. Create a project, write a script, and save a revision.
Reload to resume it. Older revisions open read-only; continue editing the latest
draft. Select saved text and request a scoped revision, compare the proposal,
then explicitly accept or reject it. A configured, reachable CLIProxyAPI gateway
is required for AI requests. Saving or completing a job does not accept a script.
You can also explicitly accept a manually written saved script. Later saves mark
that acceptance stale. The visual workspace now connects storyboard, motion and production review; see [the animation workflow](docs/animation-workflow.md).
Open **Research, hooks and full scriptwriting** to supply an evidence/payoff brief,
choose hook options, generate a draft, and inspect separate installed-skill
refinement and editorial findings. Importing a draft still requires script review
and explicit acceptance. See [the writing workflow](docs/researched-writing.md).
Development and production start commands bind only
to loopback. Do not expose this unauthenticated development shell publicly.
No telemetry preference or machine-level environment setting is changed by setup.
To opt out of Next.js telemetry for a shell session, set `NEXT_TELEMETRY_DISABLED=1`.

```powershell
npm run check
npm run build
npm start
```

`check` runs ESLint, TypeScript, and Node tests. `build` verifies the production
application separately. `GET /api/health` validates server configuration; it does
not check the database, connect to a gateway, or claim production readiness.
`db:init` initializes schema version 7 and runs SQLite's quick integrity check;
rerunning it preserves rows. Schemas 1 through 3 expand additively, preserving projects
and immutable revision files.
Opening the workspace also initializes/upgrades storage. Future versions fail closed.

## Configuration and storage

- `.env` and `.env.local` are optional and ignored. App and `db:init` load `.env`
  then `.env.local`; process environment takes precedence. Never put credentials in `NEXT_PUBLIC_*`
  variables or client components. CLIProxyAPI settings are optional for manual
  writing, required for AI revisions. The server checks `/models`, then requests
  streaming `/chat/completions`. Only the selected section can be replaced.
  The gateway receives the full current script plus up to three successful requests
  among the latest 20 jobs (instructions, editorial notes and decision status).
- `V3_DATA_DIR` defaults to `.data`, resolved from the working directory. Keep it
  inside v3; do not point it at v1/v2 or publishing storage. SQLite lives at
  `.data/studio.sqlite`. Opening the workspace or running `db:init` creates/upgrades
  it. Building and checking health do not create projects or script content.
- SQLite owns mutable project identity metadata. `workflow/project.ts` validates
  the version 1 JSON interchange shape; it is not a second editable database.
- `V3_VIDEOS_DIR` defaults to ignored `videos/`. Revision manifests live at
  `<videos-dir>/<project-id>/scripts/<revision-id>.json`. Narration uses LF line
  endings; other whitespace is preserved. Files are written once and verified
  against their SQLite SHA-256 index when loaded. No media is generated.
- Stale saves fail rather than replacing newer work. Failed saves retain the
  editor's draft; copy it before reloading after a conflict. Unsaved text warns
  before a full page navigation/unload.
- Proposals live in immutable `<videos-dir>/<project-id>/proposals/<id>.json`;
  SQLite owns their hashes and decisions, accepted-script identity, and writing
  sessions/jobs. Acceptance creates a new revision transactionally. A proposal
  based on an older draft cannot be accepted.
- Source/payoff briefs, hooks and reviewed drafts live in immutable
  `<videos-dir>/<project-id>/writing/<run-id>.json`. Original installed skill files
  are loaded directly and their hashes recorded. A changed brief makes dependent
  accepted scripts stale, including subsequent manual/scoped edits to those scripts.
- Scoped script AI requests run one per project, bounded to 90 seconds and 300,000 response
  bytes. No model tool execution or automatic retry. Interrupted jobs expire
  after two minutes when the store next opens; inspect history before retrying.
  Text instructions typed but not submitted are not persisted.
- Visual planning has a separate one-active-job boundary, 150-second generation
  timeout and three-minute interrupted-job expiry. Immutable visual JSON and
  exact storyboard receipts follow the same storage boundary; see
  [visual planning](docs/visual-planning.md) for dependency and approval details.
- Back up the database and project files together before future migrations.
  No reset, deletion, or automatic downgrade command is provided.

## Structure

```text
app/                 Script review UI, Server Actions, bounded streaming route
server/              Configuration, SQLite, revisions, proposals, jobs and gateway
workflow/            Versioned project, script and scoped review contracts
scripts/init-db.ts   Explicit, repeatable local database setup
tests/               Validation, migration, integrity, conflict and persistence checks
docs/                Architecture decisions and sequenced follow-up work
```

Engine, skill adapters, templates, and media directories will be introduced when
they have implemented responsibilities, rather than creating empty placeholders.
See [architecture](docs/architecture.md) and [next steps](docs/next-steps.md).
The [Phase 0 evidence packet](docs/phase0/README.md) freezes the v2 baseline,
records pinned skill/license research, user-approved architecture direction, and
the completed isolated renderer comparison. Remotion 4.0.537 is selected; Phase 0
is complete for this scope. Production integration remains future work.
Task execution evidence lives in [task_plan.md](task_plan.md),
[findings.md](findings.md), and [progress.md](progress.md).

## Current limits

This is a local writing/review workspace, not a production studio release.
Scoped gateway revisions, comparison, accept/reject and manual script acceptance
are implemented. The homeserver gateway was restored and the model setting corrected
to `gpt-6-luna`. Real streaming passed through both the server smoke check and
browser proposal/acceptance/reload. This verifies that model's scoped revision path,
not editorial quality or every advertised model. Evidence/payoff briefs, explicit
hook selection, full drafts, installed-humanizer refinement and role-isolated
editorial findings are implemented. Source notes are supplied, not automatically
retrieved or verified. [Visual concept and storyboard planning](docs/visual-planning.md)
is implemented with static SVG planning images, explicit concept choice, scoped
shot revisions and exact storyboard acceptance. Motion preview, scoped AI revisions,
measured WAV import, explicit production gates and guarded local export foundations
are implemented. Voice synthesis, publishing and analytics remain separate work.
Five real matched-input script pairs and author factual diagnostics are now
available in the [writing evaluation packet](docs/writing-evaluation/README.md).
The user's text preferences are applied to [revised proposals](docs/writing-evaluation/2026-10-22/proposed-drafts.md)
and shared generation guidance. Exact revised-text acceptance, fully blinded
evaluation and human read-aloud observations remain pending.
Remotion and its official GSAP adapter now power the Studio Player and guarded local
renderer. Original benchmark packages remain unchanged. Export requires installed
Chrome, FFmpeg and ffprobe; tools are never downloaded automatically.

Dependency audit at setup: production packages have zero reported vulnerabilities.
The full audit reports five high-severity development-tool findings through
`eslint-config-next -> fast-glob -> micromatch -> braces` (GHSA-vfj7-8cjw-p6xm).
The registry currently offers no patched braces version. ESLint 9.39.5 is deprecated
but remains compatible with Next's bundled plugins; ESLint 10 fails their peer
requirements. Revisit this toolchain before enabling untrusted agent code or
distributing the studio. Do not apply npm's suggested forced Next-config downgrade.

## Text motion

Browse the ten reusable presets at `/text-motion` (linked from Projects).
See [Text motion library](docs/text-motion-library.md) for research, usage,
recommended timing and verification commands. Existing projects are not rewritten.

Creative quality rules, Studio correction review, local TTS evaluation and release gates: [Creative Quality System v1](docs/creative-quality.md).
