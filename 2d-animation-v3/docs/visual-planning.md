# Visual concepts and shot boards

Open a project, accept its exact current script in script review, then follow
**Visual concepts and storyboard**. Generate three concepts, inspect each planning
image and teaching approach, and explicitly select one. Generate a storyboard,
click narration lines to find their shots, and inspect each shot's purpose,
framing, subject, action, arrival transition, continuity and start/end drawings.
Add revision notes and choose **Revise shot N only** for a scoped proposal.
Accept the exact storyboard separately after reviewing it.

Continue in the [connected motion and narration workflow](animation-workflow.md).
Static planning drawings remain available alongside the Remotion/GSAP Player;
accepting a storyboard alone never supplies production approval.

## Implemented boundary

- Images are real SVG planning drawings rendered from a strict declarative shape
  contract. The model cannot supply executable markup, scripts, URLs or assets.
  Three concepts must have distinct titles and metaphors; whether they are
  pedagogically distinct remains a human judgment.
- Each nonblank accepted narration line appears exactly once, in order. A shot
  revision preserves its narration references and every other shot byte-for-byte
  at the parsed value level. It never edits the script. Duration is estimated;
  it is not validated against a spoken recording.
- Completed proposals are immutable JSON under
  `<videos-dir>/<project-id>/visuals/<run-id>.json`, verified against SQLite SHA-256
  indexes. Schema 5 adds visual jobs, immutable concept choice events and exact
  storyboard acceptance. Existing script and writing data is preserved.
- Script identity, hash and inherited research currentness are checked before
  starting and completing work, choosing concepts and accepting boards. A new
  concept proposal, selection event or storyboard supersedes the corresponding
  prior artifact. Changing a choice away and back does not revive an old board.
  Historical artifacts remain readable, and stale acceptance is labeled.
- Requests reuse the loopback-only, matching-Origin JSON/NDJSON transport and
  configured gateway. One visual job runs per project; response size is capped
  at 300,000 decoded bytes, with a separate 4,000,000-byte framed-stream limit,
  and generation at 150 seconds. Interrupted jobs expire after
  three minutes on the next store open. There is no automatic retry. Raw gateway
  errors and credentials are not returned. Request instruction text is retained
  in the immutable artifact; unsubmitted notes are not persisted.

## Remaining production work

These are static concept/shot boards, not moving previews or screenshots from a
rendered scene. Remotion Player integration, editable timeline, actual transition
interval inspection, voice timing/synchronization, formal Gate 1/Gate 2 approval,
render jobs and verified export remain future work. The limited geometric drawing
vocabulary is adequate for initial diagrams; asset-rich concepts need a separately
scoped asset pipeline. No production approval follows from artifact acceptance.

## Verification

Focused tests cover script/concept gating, scoped replacement, currentness,
concurrent changes, cancellation, corruption, filesystem/index rollback, orphan
preservation, restart persistence and schema 4-to-5 compatibility. All 45 tests,
lint, TypeScript and the production build pass. Browser checks cover the synthetic
accept/select/generate/revise/accept/reload/stale flow, keyboard access and layout
at 320/768/1024/1440 pixels, with no console errors. No automated accessibility
audit or screen-reader session was run.

The live `gpt-6-luna` check saved three concepts and a three-shot board. It exposed
a shared SSE framing limit bug: the 300 KB raw cap rejected about 3 KB of JSON
when split into small deltas. Separate bounded transport/content limits and a
fragmentation regression resolved it. Three earlier failed requests are preserved;
there was no automatic retry. Live storyboard quality and approval are unassessed.
The [verification receipt](visual-planning/verification.json) identifies exact
artifacts. [Screenshot](visual-planning/shot-review.png) shows shot 2's static
start/end planning states. Detailed observations are recorded in progress.md.
