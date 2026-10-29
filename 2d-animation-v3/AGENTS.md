# V3 development boundaries

## Read first

1. Read `docs/STATUS.md` for current verified work, pending decisions and limitations.
2. Read `docs/architecture.md` for ownership, immutable storage and approval boundaries.
3. Load only the guide for the current task: `docs/animation-workflow.md`,
   `docs/workflow-efficiency.md`, `docs/researched-writing.md`,
   `docs/creative-quality.md` or generated `docs/AI-CREATIVE-MISTAKES.md`.

Do not load `docs/archive/`, historical `.planning/`, `docs/phase0/`,
`docs/writing-evaluation/`, or old `task_plan.md`, `findings.md` and `progress.md`
by default. Read a specific historical artifact only when the user explicitly
requests that evidence; do not recursively follow archive links.

The source plans remain byte-preserved at `docs/archive/docs/PLAN.md` and
`docs/archive/docs/PLAN2.md`. They are historical reference, not current instructions.
This section replaces every earlier instruction to read those plans first or to
resume the v3-root planning trio. For new authorized multi-step work, initialize or
explicitly select a task-specific plan; never resume an unrelated historical plan.

## Work and preservation boundaries

Follow the current user task. Work in the existing workspace; do not create a
worktree. No subagents for this task. Never commit, push, publish or deploy unless
requested. Historical task authorizations do not authorize a new production job.

Preserve sibling projects, original source plans and frozen/failed evaluation
evidence. V2 Markdown and benchmark sources are hash-pinned; do not move/edit
them or change expected hashes to hide drift. Keep generated
`docs/AI-CREATIVE-MISTAKES.md` at its tested path; never hand-edit it.

No real media generation, voice tooling, actual human approval, production gates
or publishing without explicit current authorization. Model review, synthetic
fixtures, artifact acceptance and automated checks do not grant production gates.
Preserve exact user approvals, source dependencies, original audio and measured
timing. Changed inputs invalidate the affected decisions; never infer consent.

## Runtime and verification

Use Node 24 and npm from this directory. Run `npm run check` and `npm run build`
for relevant changes; database changes also need persistence/schema compatibility
tests. Report failures without relaxing fixtures, thresholds or expected hashes.

Keep environment values and `server/` imports out of client components. Do not
return credentials or raw configuration errors from routes. Keep local runtime
storage inside v3, never in sibling production or publishing data.

Remotion 4.0.537 and its official GSAP adapter own the frame-driven production
engine. V2's OneTake-only rule does not apply to v3. SQLite owns mutable indexes
and decisions; immutable JSON/media own hash-bound content. Markdown is guidance
or a review/export view, not a second independently editable source of truth.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
