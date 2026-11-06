# V3 development boundaries

## Read first

1. `docs/STATUS.md`: implemented work, pending decisions, limitations.
2. `docs/architecture.md`: ownership, immutable storage, approvals.
3. `docs/reference-map.md`: load only current stage/selected capability sections, never every linked guide.

Do not preload `docs/archive/`, historical `.planning/`, `docs/phase0/`, `docs/writing-evaluation/`, or old `task_plan.md`/`findings.md`/`progress.md`. Read specific historical evidence only on explicit user request; never recursively follow archive links.

Byte-preserved `docs/archive/docs/PLAN.md` and `PLAN2.md` are historical. This replaces earlier instructions to read them first/resume the V3-root planning trio. For authorized multi-step work, initialize/select a task-specific plan; never resume unrelated history.

## Work and preservation boundaries

Apply `docs/quality-bar.md` before new/revised explainers: clear VoiceStudio narration, rough composed backgrounds, scene-specific decorated typography, decisive causal motion and approved representative scenes before full animation. New briefs use `PROMPT_TEMPLATE.md`. Valid contracts/clean diagnostics do not establish quality acceptance.

Work in this workspace, never a worktree. Audio creation alone requires a dedicated explicit `gpt-6-luna` subagent, scoped by `docs/workflow-efficiency.md#model-assignments`; other subagents need explicit user request. Never commit, push, publish or deploy unless requested. Historical authorization cannot start a new production job.

Preserve sibling projects, original plans and frozen/failed evidence. V2 Markdown/benchmarks are hash-pinned: never move/edit them or change expected hashes to hide drift. Keep generated `docs/AI-CREATIVE-MISTAKES.md` at its tested path; never hand-edit it.

Real media generation, voice tooling, human approval, production gates and publishing require explicit current authorization. Model review, synthetic fixtures, artifact acceptance and tests cannot grant gates. Preserve exact user approvals/dependencies, original audio and measured timing; changed inputs invalidate affected decisions. Never infer consent.

## Runtime and verification

Use Node 24/npm from V3. Run `npm run check` and `npm run build` for relevant changes; DB changes also require persistence/schema-compatibility tests. Report failures without relaxing fixtures, thresholds or hashes.

Keep environment values/`server/` imports out of clients. Routes must not expose credentials/raw configuration errors. Runtime storage stays inside V3, never sibling production/publishing data.

Remotion 4.0.537/official GSAP own frame-driven production; V2's OneTake-only rule does not apply. SQLite owns mutable indexes/decisions; immutable JSON/media own hash-bound content. Markdown is guidance/review/export, never a second editable source of truth.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
