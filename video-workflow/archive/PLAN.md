# Video workflow: planning to publishing and feedback

Status: local implementation delivered. See [README.md](../README.md) for commands and
[VALIDATION.md](../VALIDATION.md) for evidence. Live channel validation and recurring
collection activation remain pending; no video release is authorized by implementation.
Prepared: 20 October 2026.

## Direction

Extend the existing production workflow with three integrated stages: YouTube
packaging, publishing, and analytics feedback. Start with one YouTube channel and
the current V2 Shorts workflow. Keep OneTake, specialist ownership, and existing
production approvals. Do not rebuild the production system or migrate older videos.

Use `video-workflow/` for the publishing layer. It consumes a verified export and
its source documents without modifying the production project. Add another production
adapter only when another workflow needs publishing support.

## Baseline at planning

| Capability | Evidence in the checkout | Gap |
| --- | --- | --- |
| Research and planning | V2 brief, facts, reference study, script and visual/motion handoffs | Connect the audience promise to packaging |
| Production and review | `2d-animation-v2/scripts/studio.py` guards narration, preview review and rendering | Preserve this existing flow |
| YouTube title and description | Previously supplied as individual deliverables; no packaging command or contract | A repeatable packaging stage with saved, reviewed outputs |
| Thumbnail | No integrated thumbnail stage in the inspected V2 workflow | Artwork, validation and verified application on YouTube |
| Upload and scheduling | No publishing command in `studio.py`; `video-workflow/` is empty | Account connection, upload, scheduling and status reconciliation |
| Analytics feedback | No collection stage in the inspected V2 workflow | Collection, comparable reports and a handoff into planning |

Important integration detail: V2's `snapshot(project, gate)` includes project files
outside its excluded directories in Gate 2. Putting publishing records inside the
production project would invalidate its render receipt. Store publishing data in
the separate `video-workflow/videos/<slug>/` folder and bind it to source hashes.

## End-to-end workflow

| Stage | Work and output | Completion condition |
| --- | --- | --- |
| 1. Plan | Define audience, tutorial/explainer type, question, promised payoff and one measurable learning hypothesis. Read relevant prior results. | Brief covers the complete intended lesson |
| 2. Develop | Research, script, three distinct concepts, selected concept, visual direction and storyboard. Draft title options and thumbnail direction alongside the story. | Existing Gate 1 approved |
| 3. Produce | Measured narration, OneTake animation, independent review and revisions. | Existing Gate 2 approved |
| 4. Export | Guarded render and verification of the actual encoded file. | Export passes current checks; source and export hashes recorded |
| 5. Package | Final title, description, thumbnail, upload settings and desired publication time. Review against the finished lesson. | Complete package validated and presented for approval |
| 6. Publish | Upload privately, check processing, apply/verify packaging, then schedule or publish under explicit authorization. | Remote video ID and confirmed remote state saved |
| 7. Observe | Reconcile actual publication and collect available metrics. | Collection records coverage, freshness and missing data |
| 8. Learn | Compare similar videos at similar ages. Record evidence, uncertainty and one next experiment. | Next brief consumes the lesson or explains why it does not apply |

Packaging is part of the pipeline. Its promise starts during planning; its final
assets must match the completed export.

## Feature 1: YouTube packaging

Reuse the Scriptwriter for copy, Art Director for thumbnail design, Reviewer for
accuracy/readability, and Director for final selection and release settings.
Do not add another permanent agent role.

Deliver for each video:

- Three truthful title options, their distinct angles, and one selected title.
- A description with an accurate opening summary, relevant sources/credits and
  disclosures where applicable. Include chapters only when useful and supported.
- Two thumbnail concepts and one finished image. Preview it at phone size and
  check its promise against the script. Avoid unsupported outcomes or fake UI.
- Channel, format, category, language, audience setting, required disclosures,
  intended visibility, and an explicit publication time when scheduling.
- A single review view showing the export, selected title, thumbnail, description,
  channel and schedule in both Asia/Manila and UTC.

Validate required fields, current API text/image limits, file type, dimensions,
selected assets and all input hashes. Record optional tags only when useful.
Do not infer audience or synthetic-media declarations from the topic alone.

**Shorts thumbnail support:** current YouTube Help documents custom Shorts images
through desktop Studio for verified accounts, with a recommended 9:16 ratio.
Design for that surface. Test `thumbnails.set` with the actual channel before
promising API automation for Shorts; its generic endpoint documentation does not
establish account-specific Shorts behavior. If unsupported, provide the image and
an explicit Studio task, then record evidence that it was applied. Do not mark the
package complete merely because the image exists locally.
[YouTube thumbnail guidance](https://support.google.com/youtube/answer/72431),
[thumbnail API](https://developers.google.com/youtube/v3/docs/thumbnails/set).

## Feature 2: YouTube upload and scheduling

Use the official YouTube Data API with desktop OAuth. Identify the authorized
channel and require it to match the selected channel ID. Keep OAuth tokens outside
Git in restricted local storage; never include tokens or upload-session URLs in
normal reports. Request scopes needed by the implemented operations, including
read access for reconciliation and analytics; upload scope alone is insufficient
for every metadata operation. Document disconnect and token revocation.
[OAuth guidance](https://developers.google.com/youtube/v3/guides/auth/installed-apps),
[video update authorization](https://developers.google.com/youtube/v3/docs/videos/update).

Publishing sequence:

1. Validate the verified export and exact selected package. Present the concrete
   release request: channel, file, title, thumbnail, description, visibility and time.
2. Record explicit authorization against those hashes and release settings.
   Existing Gate 1/Gate 2 approval does not authorize upload or publication.
   One explicit approval may authorize both upload and scheduling; do not ask twice
   when the user's instruction already covers the complete release.
3. Upload with resumable transfer and **explicit private visibility**. Save upload
   progress securely and the returned video ID immediately. Use an operation lock
   and reconcile an uncertain upload outcome before creating another video.
4. Check upload/processing status and apply the selected thumbnail. If manual
   thumbnail work is needed, keep the video private while that task is pending.
5. Confirm remote metadata, processing and package application. Require a Studio
   review for copyright/restriction checks that the available API does not expose.
   Record material blockers rather than treating processing success as clearance.
6. Apply the approved future `publishAt` or an explicitly approved publish-now action.
   Scheduling requires a private, never-published video. Reject a past time locally:
   YouTube treats past scheduling times as immediate publication.
7. Read back the remote state. Save the ID, URL, privacy, scheduled time, processing
   result, applied package version and later observed publication time. A scheduled
   time passing is not proof that the video became public.

YouTube hosts the release schedule, so publication should not depend on this PC
remaining awake. A local runner only handles monitoring and analytics. Validate
project quota and account capabilities during setup rather than hardcoding old
quota assumptions or assuming the channel is ready.
[Upload API](https://developers.google.com/youtube/v3/docs/videos/insert),
[resumable uploads](https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol),
[publication-time rules](https://developers.google.com/youtube/v3/docs/videos#status.publishAt).

Changes after approval invalidate the affected release authorization. Use the same
video ID for retries and metadata corrections. Never automatically delete/reupload
a video or change a public title, thumbnail, description or schedule.

## Feature 3: analytics collection and feedback

Start with the YouTube Analytics API for channel-owner reports and Data API for
video state/current counters. Do not scrape Studio. Use a manual Studio CSV import
for useful metrics that the authorized APIs do not expose.

| Measurement | Intended use | Collection rule |
| --- | --- | --- |
| Views and engaged views | Reach and qualified viewing for Shorts | Keep both where supported; preserve metric definitions |
| Watch time, average view duration, average percentage viewed | Depth of viewing | Use supported report combinations; keep seconds and percentages distinct |
| Likes, comments, shares, subscribers gained/lost | Audience response | Preserve counts and denominators; do not confuse channel totals with video attribution |
| Audience retention | Where viewers leave or replay | Separate supported retention query; map time positions to script/scene evidence |
| Traffic sources | Discovery context | Separate report; respect suppressed/limited data |
| Thumbnail impressions/CTR and Shorts viewed-versus-swiped | Packaging and feed behavior | Capability-test; use Studio CSV when unavailable, otherwise mark unavailable |

These are intended measures, not a promise that every metric is available through
one query. Discover compatible dimensions, filters and metrics from the supported
channel reports and map returned columns by their headers.
[Metric definitions](https://developers.google.com/youtube/analytics/metrics),
[supported channel reports](https://developers.google.com/youtube/analytics/channel_reports).

Collection and interpretation:

- Run a daily catch-up command for published videos. Allow manual runs first;
  enable Windows Task Scheduler only during implementation/setup authorization.
  Missed runs must catch up without duplicated rows.
- Produce reviews around 24 hours, 7 days and 28 days after actual publication.
  The 24-hour review can use current counters and must label richer analytics
  as pending. The Analytics API is delayed; record the actual covered dates and
  re-fetch recent periods as data becomes available.
- Keep requested windows, covered windows, fetch time, API/source, query parameters,
  package version and errors with each result. Respect API reporting-day boundaries;
  do not label daily reports as exact rolling 24-hour windows.
- Missing, suppressed, pending and unsupported values stay distinct from zero.
  Keep raw responses alongside normalized data under the applicable retention and
  deletion rules. Refresh/delete stored Data API resource metadata within 30 days;
  implement the applicable authorized-data retention rules before enabling collection.
- Compare Shorts with Shorts at comparable ages, lengths and traffic contexts.
  Start with the channel's own comparable history. Show sample size; do not invent
  universal success thresholds or infer causation from one video.
- Separate observed results from hypotheses. A CTR change does not by itself prove
  a thumbnail caused it; feed viewing is a different surface. For each review,
  propose at most one useful next experiment, with its evidence and uncertainty.
- Record accepted lessons in the publishing layer. Feed them into the next brief
  as proposals; never automatically rewrite production rules or published assets.

The API returns only available dates, can suppress small breakdowns and is not
real-time. Reports must expose those limits.
[Data availability and handling](https://developers.google.com/youtube/analytics/data_model),
[developer policies](https://developers.google.com/youtube/terms/developer-policies).

## Minimal implementation shape

Use one small Python CLI beside the existing Python production tooling. Add the
official Google authentication/client libraries when implementing the integration.
Use JSON records and CSV initially; introduce a database or dashboard only when
actual usage requires it.

Original planned layout (the implementation also separates Google API and analytics
code into focused modules):

```text
video-workflow/
  PLAN.md
  README.md
  scripts/channel.py
  templates/video.json
  tests/test_channel.py
  videos/<slug>/
    video.json                 # source pointers/hashes, settings, state, hypothesis
    packaging/
      PACKAGING.md             # candidates, selections and review evidence
      description.txt
      thumbnail.png
    release.json               # authorization, operation state and remote receipt
    analytics/                 # raw/normalized results and dated reviews
```

The existing `videos/` ignore rule covers runtime video folders. Keep templates,
code and documentation tracked; credentials remain outside the repository.
Resolve source pointers within approved workspace roots and verify hashes before
using them. Reference the existing export instead of copying large MP4 files.

Planned commands: `init`, `check`, `upload`, `schedule`, `status`, `collect`,
`review`, and `import-analytics`. Copy/design remain tasks for existing specialists;
the CLI validates, records and executes authorized operations. Implemented commands,
including package review and release approval, are documented in README.md.

State is evidence-based: planned, producing, export-verified, packaged,
release-approved, uploading, processing, ready, scheduled, published. Analytics
milestones are separate records because a video remains published after review.
Failures preserve the last confirmed state and a resumable next action.

## Delivery order and acceptance

| Phase | Deliver | Smallest meaningful proof |
| --- | --- | --- |
| 1. Packaging | Contract/template, validation, review view and documented V2 handoff | Complete one package from an existing verified export; missing/stale assets fail; V2 approval receipts remain unchanged |
| 2. Publishing | OAuth, resumable private upload, thumbnail application/handoff, schedule and status | Mock failure tests plus one explicitly authorized private upload; verify the channel, resume behavior and saved video ID; live scheduling/publication only when explicitly authorized |
| 3. Analytics | Daily catch-up collector, CSV fallback and dated review | Fixture tests for missing/delayed data and repeat collection; one authorized real-channel report with documented coverage |
| 4. Closed loop | Next-brief handoff and optional scheduled collection | One brief cites an actual prior review; missed collection runs catch up; failures are visible |

Publishing tests must cover wrong channel, stale approval, expired OAuth, interrupted
upload, ambiguous completion, quota/backoff, duplicate invocation, failed processing,
thumbnail failure and past schedule times. Analytics tests cover reordered headers,
incompatible/unsupported metrics, pending days, zero versus missing, and package
changes during a measurement window. Reuse existing test conventions.

Initial stop condition: one verified video can be packaged, explicitly authorized,
uploaded, scheduled, confirmed published, measured and used in the next planning
decision. Each phase can be used before later phases are complete.

## Setup decisions and dependencies

- Confirm the target channel ID, Google Cloud project/OAuth consent configuration,
  available quota, thumbnail capability and analytics authorization before live tests.
- Default schedule display to Asia/Manila; choose actual times per release. Suggest
  a cadence only after observing the channel's production capacity and audience data.
- Confirm the existing OneTake/content/asset permissions cover the intended channel
  use, including monetization where relevant; production tooling does not establish
  those permissions.
- Preserve old projects. No bulk import, new rendering engine, multi-platform
  publishing, automatic title/thumbnail optimization, or custom dashboard in the MVP.

Planning evidence: inspected current V2 instructions, runbook, CLI, production
template, dependencies and root ignore rules; checked official YouTube documents.
No account connection, live upload, thumbnail application, scheduling, analytics
query, scheduler activation or production change was performed.
