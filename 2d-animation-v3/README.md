# HyperFrames Studio V3

[STATUS](docs/STATUS.md) owns capabilities/pending reviews/failures; [architecture](docs/architecture.md) owns storage/approval boundaries. This README owns setup. Use [reference map](docs/reference-map.md) for stage-specific reading; never preload archives.

## Development

Use Node >=24.6 and <25/npm from this directory; tested runtime is in `.node-version`. Node 24.6 SQLite is experimental; no ORM/addon required. Basic setup needs no Python, model or FFmpeg.

```powershell
npm ci
# Optional; defaults work without an environment file.
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run db:init
npm run dev
```

Open <http://127.0.0.1:3003>. Dev/start bind loopback; this unauthenticated workspace must not be exposed publicly. Setup changes no machine environment/telemetry. Optional shell opt-out: `NEXT_TELEMETRY_DISABLED=1`.

```powershell
npm run check
npm run build
npm start
```

`check` runs ESLint, TypeScript and Node tests; build is separate. STATUS distinguishes dated results from current missing-module/build limitations. `GET /api/health` validates configuration, not database/gateway reachability or creative quality.

## Configuration, persistence and recovery

| Setting/store | Contract |
| --- | --- |
| `.env`, `.env.local` | Optional/ignored, loaded server-side for app/CLI; process environment wins. Keep secrets out of `NEXT_PUBLIC_*`, clients and errors. Submitted model requests require reachable configured CLIProxyAPI. |
| `V3_DATA_DIR` | Default `.data`, relative to working directory; SQLite: `.data/studio.sqlite`. |
| `V3_VIDEOS_DIR` | Default ignored `videos/`. Both data roots stay inside V3, never sibling production/publishing data. |
| `db:init` | Initialize/upgrade schema 8, verify integrity; preserve rows/files, reject future versions. Opening storage may also initialize/upgrade. |
| SQLite | Indexes, decisions, identity, jobs, sessions. |
| Project files | Immutable hash-bound script/visual/motion/narration content; Markdown is review/export, not a second editable store. |

Stale saves fail instead of overwriting. Preserve unsaved text before reloading conflicts; unsaved drafts warn before navigation. Inspect failed/interrupted jobs before explicit retry; no automatic acceptance.

Back up database/matching project files together before migration/rollback. Preserve immutable revisions, failed evidence and orphans; no destructive reset/downgrade/automatic cleanup.

Media operations additionally require configured local voice tools, Chrome, FFmpeg/ffprobe as applicable. Preflight never implicitly downloads tools/models. See [workflow CLI](docs/workflow-efficiency.md).

## Current guides

- [Reference map](docs/reference-map.md): stage/capability lookup.
- [Prompt](PROMPT_TEMPLATE.md) and [quality bar](docs/quality-bar.md): new V3 direction.
- [Writing](docs/researched-writing.md), [animation/production](docs/animation-workflow.md), [creative quality](docs/creative-quality.md).
- [Generated rules](docs/AI-CREATIVE-MISTAKES.md): never hand-edit.

Script/storyboard acceptance, model advice and tests never replace actual human production gates. Production/publishing retain separate authorization. V2 keeps OneTake, V1 shared tooling; publishing currently consumes V2.

[Archive](docs/archive/README.md) preserves plans, validation and former setup/status. Frozen phase-0/writing-evaluation/benchmark packets stay at operational paths outside startup context. Historical media may need the external bundle in [housekeeping](../docs/housekeeping/README.md).
