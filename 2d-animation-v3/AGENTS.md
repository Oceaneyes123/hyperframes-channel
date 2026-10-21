# V3 development boundaries

Read PLAN.md first, then PLAN2.md and docs/architecture.md. Use installed
planning-with-files with task_plan.md, findings.md, and progress.md in this
directory. Preserve the source plans and all sibling projects.

V3 currently supports foundation and project/script persistence. The user
also approved isolated renderer experiments; see benchmarks/ and docs/phase0/.
Do not integrate media generation, invoke voice tooling, run agents, or activate
publishing as part of setup. Future feature work needs its own explicit scope.

On 2026-10-21 the user authorized work on remaining tasks. The active increment
is PLAN2's interactive script-review slice: selection, scoped gateway requests,
immutable proposals, explicit acceptance/rejection, and persisted job/session
state. This authorizes script model requests, but does not authorize production
video creation, voice tooling, formal human gate approval, or publishing.

Work in the current workspace. No subagents for this task. Never commit
or push unless requested. Run npm run check and npm run build for relevant changes;
database changes require persistence and schema compatibility tests.

Use Node 24 and npm from this directory. Keep environment values and server/
imports out of client components. Do not return credentials or raw configuration
errors from routes. Never point runtime storage at sibling project data.

Remotion 4.0.537 is selected from the completed isolated benchmark; production
integration remains future work. V2's OneTake-only policy does not apply to v3.
Keep source-of-truth and production approval rules in architecture docs; avoid
duplicated editable Markdown, JSON and SQLite versions of the same content.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
