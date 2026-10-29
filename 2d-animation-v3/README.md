# HyperFrames Studio V3

Start with [STATUS](docs/STATUS.md) for implemented capabilities, pending human
reviews and known failures, then [architecture](docs/architecture.md) for ownership
and immutable storage. This README owns setup. Load the appropriate current guide
for production, writing, workflow or quality; do not load the archive by default.

## Development

Use Node >=24.6 and <25 with npm from this directory. `.node-version` records the
tested runtime. Native SQLite is experimental in Node 24.6; no ORM or SQLite addon
is required. Basic setup does not require Python, a model or FFmpeg.

```powershell
npm ci
# Optional; defaults work without an environment file.
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run db:init
npm run dev
```

Open <http://127.0.0.1:3003>. Development and production start commands bind to
loopback. This local workspace is unauthenticated; do not expose it publicly.
No machine-level environment or telemetry setting is changed by setup. To opt out
of Next.js telemetry for a shell, set `NEXT_TELEMETRY_DISABLED=1` yourself.

```powershell
npm run check
npm run build
npm start
```

`check` runs ESLint, TypeScript and Node tests. Build is a separate check; current
results and the known Turbopack failure are in STATUS. `GET /api/health` validates
server configuration, not the database, gateway reachability or creative quality.

## Configuration, persistence and recovery

- `.env` and `.env.local` are optional and ignored. App/CLI configuration loads
  them server-side; process environment takes precedence. Keep secrets out of
  `NEXT_PUBLIC_*` variables, client components and error responses. A configured,
  reachable CLIProxyAPI gateway is needed for submitted model requests.
- `V3_DATA_DIR` defaults to `.data`, resolved from the working directory.
  SQLite lives at `.data/studio.sqlite`. `V3_VIDEOS_DIR` defaults to ignored
  `videos/`. Keep both inside v3, never in sibling production or publishing data.
- `db:init` initializes/upgrades schema 8 and checks database integrity. Schema
  expansions preserve existing rows and immutable files; future versions fail
  closed. Opening the workspace can also initialize/upgrade storage.
- SQLite owns indexes, decisions, project identity, jobs and sessions. Script,
  visual, motion and narration artifacts are immutable hash-bound files under
  their project. Markdown exports are review material, not a second editable store.
- Stale saves fail instead of overwriting newer work. Keep unsaved text before
  reload after a conflict. Unsaved drafts warn before navigation. Inspect failed
  or interrupted jobs before explicitly retrying; no automatic acceptance follows.
- Back up database and matching project files together before migrations or
  rollback. Preserve old immutable revisions, failed evidence and orphaned files;
  no destructive reset, downgrade or automatic cleanup is provided.
- Guarded media operations additionally need configured local voice tools,
  Chrome, FFmpeg and ffprobe as applicable. Preflight never downloads models or
  tools implicitly. Use the [workflow CLI guide](docs/workflow-efficiency.md).

## Current guides

- [Writing and saved-script review](docs/researched-writing.md).
- [Storyboards, graphics, motion and production](docs/animation-workflow.md).
- [Creative quality and human comparisons](docs/creative-quality.md).
- [Generated creative rules](docs/AI-CREATIVE-MISTAKES.md); never hand-edit this file.

Script acceptance, storyboard acceptance, model advice and technical tests never
substitute for the project's actual human production gates. Production and
publishing require their existing separate authorization. V2 keeps its OneTake
workflow and v1 shared tooling; the publishing adapter currently consumes v2.

Historical plans, validation runs and the former setup/status text are preserved
in the [archive index](docs/archive/README.md). Frozen phase-0, writing-evaluation
and benchmark packets remain at their operational paths, outside the startup read
set. Some historical media requires the separate bundle described in the
[root housekeeping record](../docs/housekeeping/README.md).
