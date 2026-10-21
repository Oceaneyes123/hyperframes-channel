# Video workflow

Planning, YouTube packaging, authorized upload/scheduling, and analytics feedback
for the existing V2 Shorts production workflow. OneTake and the two production
gates remain owned by [V2](../2d-animation-v2/AGENTS.md).

The local implementation is ready for use. OAuth connection, account capabilities,
live thumbnails, upload, publication and analytics still require real-channel
validation. No account is connected or scheduled task activated by installation.

## Setup

Run these commands from the repository root. Existing compatible Python packages
can be reused; otherwise create a local environment:

```powershell
python -m venv --system-site-packages video-workflow/.venv
video-workflow/.venv/Scripts/python.exe -m pip install -r video-workflow/requirements.txt
```

Examples below use `python`; substitute the environment's interpreter if needed.
No new rendering engine, database or web service is required.

## Plan and package a video

```powershell
python video-workflow/scripts/channel.py init --slug my-topic --production 2d-animation-v2/videos/my-topic
```

The production folder must already exist; it does not need an export at this stage.
This creates an ignored `video-workflow/videos/my-topic/` folder containing
`video.json`, `PLANNING.md` and a packaging handoff. It never modifies production
inputs, approvals, or media. Export and source files are referenced, not copied.

Fill the audience, promise and learning hypothesis in `video.json`; the Director
carries those decisions into the production brief. The existing Scriptwriter
supplies three distinct title options, their angles and the description. The Art
Director supplies two thumbnail concepts and the selected PNG/JPEG. The Reviewer
checks accuracy, the complete exported lesson, and thumbnail readability at phone
size. The Director selects the title and exact release settings.

Production still follows Gate 1, narration, animation, independent review, Gate 2,
rendering and export verification. Packaging consumes
`output/video.mp4` and `output/render-verification.json`, using the existing HTTP-cache
verification format: matching `video` path and `sha256`, `full_decode: "PASS"`,
`dimensions: [1080,1920]`, `fps: "30/1"` and a positive `duration_s` up to 180.
Both saved production gates must still match current source/audit files.
Another project's report format must be deliberately adapted; an unchecked MP4
does not pass by default. These checks verify records, not the human review itself.

```powershell
python video-workflow/scripts/channel.py check --project video-workflow/videos/my-topic
python video-workflow/scripts/channel.py package --project video-workflow/videos/my-topic
```

Open the resulting `review.html` directly from disk. It shows the actual export,
selected thumbnail, all title options, description, settings, and publication time
in Asia/Manila and UTC. `package.json` binds the review and selected source/assets.
The source MP4 stays in its production folder. Open the local file directly, or
serve the repository root with `python -m http.server 8769 --bind 127.0.0.1` and
open `/video-workflow/videos/my-topic/review.html` on that local server.

The channel and declarations can remain unset while preparing a draft. Release
approval requires the actual `UC...` channel ID, explicit booleans for the audience
and synthetic-media declarations, and confirmation that intended-use rights are
covered. The tool does not infer these decisions. `notify_subscribers` must be
selected before upload; YouTube applies it at insertion and it cannot be revised
through this workflow for the same uploaded video.

For a future public release, use `visibility: "public"` and an ISO timestamp such
as `2030-01-01T18:00:00+08:00`. For immediate public/unlisted release, choose the
visibility and leave `publish_at: null`. `visibility: "private"` keeps it private.
Past or timezone-free schedule values are rejected. Three-minute Shorts are the
only supported format in this adapter.

## Connect YouTube when ready

Enable YouTube Data API v3 and YouTube Analytics API in your Google Cloud project.
Configure OAuth consent and a desktop OAuth client; add your account as a test
user where the project's consent setup requires it. Keep its downloaded JSON
outside this repository.

```powershell
python video-workflow/scripts/channel.py auth --channel ACTUAL_CHANNEL_ID --client-secrets C:/private/youtube-desktop-client.json
```

Complete Google's sign-in/consent in the browser. The tool checks the authorized
channel ID before saving credentials. Switching channels requires disconnecting
first. Scopes are `youtube.force-ssl` for upload, metadata and private-video
reconciliation, plus `yt-analytics.readonly`. It requests no monetary-report scope.
Check actual project quota, consent/token lifetime and channel features during
setup; offline tests do not establish these capabilities.

On Windows, tokens and resumable sessions are encrypted with the current user's
DPAPI under `%LOCALAPPDATA%/HyperframesChannel/`. On other platforms, the store uses
owner-only directory/file permissions. Storage inside the repository is rejected.
Reports and logs exclude OAuth tokens and upload-session URLs.

## Approve and release

Present `review.html` and obtain explicit authorization identifying the exact
channel, export, title, thumbnail, description, visibility and schedule. Record
the user's actual words and message reference:

```powershell
python video-workflow/scripts/channel.py approve --project video-workflow/videos/my-topic --quote "EXACT USER RELEASE AUTHORIZATION" --source "ACTUAL USER MESSAGE REFERENCE"
python video-workflow/scripts/channel.py upload --project video-workflow/videos/my-topic
python video-workflow/scripts/channel.py status --project video-workflow/videos/my-topic
```

One explicit instruction can authorize the complete upload and release; do not
ask again for actions it already covers. Gate 1/Gate 2, passing checks, and the
request to implement this tool do not authorize a video release. Receipt JSON
records provenance but cannot authenticate a human; the Director verifies consent.

Upload always sends explicit private visibility. Successful processing must be
confirmed before release. Save actual Studio review evidence for the uploaded
video inside the workflow folder, covering copyright/restrictions and any required
checks not exposed by the API:

```powershell
python video-workflow/scripts/channel.py attest --project video-workflow/videos/my-topic --kind studio_checks --evidence evidence/studio-check.png --quote "ACTUAL CONFIRMATION OF STUDIO REVIEW" --source "ACTUAL MESSAGE REFERENCE"
python video-workflow/scripts/channel.py schedule --project video-workflow/videos/my-topic
python video-workflow/scripts/channel.py status --project video-workflow/videos/my-topic
```

`schedule` applies the approved thumbnail and release settings, including an
immediate public/unlisted action if that was explicitly approved. A successful
update is followed by remote readback. YouTube owns the future schedule; the PC
does not need to remain awake. `status` later confirms whether publication actually
occurred. Scheduling alone never establishes public availability.

Shorts custom thumbnails are documented for verified accounts through desktop
Studio. The API path remains capability-dependent. If `thumbnails.set` is rejected,
leave the video private, apply the exact selected image in Studio, and save evidence:

```powershell
python video-workflow/scripts/channel.py attest --project video-workflow/videos/my-topic --kind thumbnail --evidence evidence/applied-thumbnail.png --quote "ACTUAL CONFIRMATION OF APPLIED THUMBNAIL" --source "ACTUAL MESSAGE REFERENCE"
python video-workflow/scripts/channel.py schedule --project video-workflow/videos/my-topic
```

This fallback works without changing the approved package. Alternatively select
`thumbnail_method: "studio"` before approval. API acknowledgement proves that
YouTube accepted the request; inspect actual thumbnail appearance in Studio.

Changing selected inputs invalidates release approval. Regenerate the review and
obtain renewed approval for material changes. Revised private-video copy and
future scheduling use the same video ID after current Studio evidence is recorded.
Replacing uploaded media or changing its original notification setting is blocked.
Confirmed public/unlisted videos are not edited automatically. An existing YouTube
schedule remains active while local files are edited; local edits do not cancel it.

## Recover interrupted work

Rerun `upload` with the same project to resume. Protected session state is saved
before media transfer, and recovery queries the server's acknowledged progress.
A completed upload ID is saved before writing the local release receipt.
Expired/ambiguous sessions block automatic replacement; inspect Studio first.

If the session cannot be recovered, locate the matching private upload, verify
its media manually, save that evidence locally, and explicitly attach its ID:

```powershell
python video-workflow/scripts/channel.py recover-upload --project video-workflow/videos/my-topic --video-id ACTUAL_VIDEO_ID --evidence evidence/recovered-upload.png --quote "ACTUAL CONFIRMATION THIS IS THE MATCHING UPLOAD" --source "ACTUAL MESSAGE REFERENCE"
```

Recovery checks channel, private visibility and approved metadata. The Director's
manual verification establishes media identity; the Data API does not provide an
MP4 checksum for comparison. It never silently deletes/reuploads.

Commands use a project operation lock and atomic JSON writes. After a process
crash, inspect `.operation.lock` and verify its recorded process has stopped before
removing that exact lock file. Do not remove locks from running jobs. Quota,
authentication, transport, processing and thumbnail errors keep operation records
for recovery. Google request retries are bounded; later runs resume catch-up.

## Collect, review and learn

```powershell
python video-workflow/scripts/channel.py collect --project video-workflow/videos/my-topic
python video-workflow/scripts/channel.py collect --all
```

Collection first checks channel/video state. Published videos receive dated raw
and normalized results plus `analytics/daily.csv`. The collector re-fetches the
first 28 publication calendar days so delayed data catches up without duplicate
rows. Successful runs generate every due 1-day, 7-day and 28-day review.
These are Pacific reporting-calendar windows, not exact rolling 24-hour windows.
Current counters are always labeled with fetch time, not used as milestone totals.

Reports include views, engaged views when supported, watch time, daily duration
and percentage metrics, audience response, traffic sources and retention availability.
Retention positions map to video seconds and measured narration passages when
`motion_beats.json` is available. Empty, unavailable, unsupported and zero remain
distinct. Separate queries preserve compatible metric combinations; query/auth
or quota failures are not silently converted to zeros.

Every snapshot records query parameters, requested/returned dates and the current
package version. Observed package/copy changes remain visible in later reviews;
historical exposure is not attributed to the latest title/thumbnail. Changes before
the first collection are unknown. Same-channel comparisons use matching format,
milestone and duration within 25%; traffic/topic differences still confound them.
No automatic causal claim or public optimization is made.

If a metric is only available in Studio, export English-language single-video
analytics and import it with its actual date coverage:

```powershell
python video-workflow/scripts/channel.py import-analytics --project video-workflow/videos/my-topic --csv C:/private/studio.csv --start 2026-10-01 --end 2026-10-07
python video-workflow/scripts/channel.py review --project video-workflow/videos/my-topic --milestone 7
python video-workflow/scripts/channel.py lesson --project video-workflow/videos/my-topic --milestone 7 --observation "ACTUAL OBSERVATION" --experiment "ONE PROPOSED EXPERIMENT" --limitation "MATERIAL LIMITATION"
```

Supported CSV fields include Date, Video ID/Content/Video, Views, Engaged views,
Average view duration, Average percentage viewed (%), Impressions, Impressions
click-through rate (%), Stayed to watch (%), Watch time (hours), Likes, Comments,
Shares and Subscribers. Other-video rows are rejected, total rows skipped, and
supplements stay separate from API metrics. For exports without an ID column,
the user must establish that it is the selected video's report.

`LESSON.md` records the observation, one experiment, limitations and reviewed
evidence hashes. Select it during the next planning initialization:

```powershell
python video-workflow/scripts/channel.py init --slug next-topic --production 2d-animation-v2/videos/next-topic --prior-lesson video-workflow/videos/my-topic/analytics/LESSON.md
```

`PLANNING.md` includes that lesson, and `video.json` binds its hash. The Director
decides how it affects the next brief; no production rules are rewritten.

For unattended collection later, configure a daily Windows Task Scheduler action
using the absolute Python executable, the absolute `channel.py` path followed by
`collect --all`, and the repository as its working directory. Enable running missed
tasks when the PC next wakes, and use the same Windows user as the DPAPI credentials.
No task has been installed by this implementation.

## Retention and disconnect

Collection/review prunes generated analytics older than 30 days and refreshes
current video state during authorized collection. Lessons remain editorial records
until explicit purge. Schedule regular collection/purge if data is retained;
offline files are not a background service and cannot clean themselves while the
PC is off. Data availability and authorization must be re-established on later use.

```powershell
python video-workflow/scripts/channel.py purge --project video-workflow/videos/my-topic
python video-workflow/scripts/channel.py disconnect
```

`purge` explicitly removes generated analytics for the selected project; `--all`
selects every workflow project. `disconnect` revokes OAuth, removes credentials and
protected sessions, and purges collected channel data. Source projects and MP4s are
preserved. If remote revocation fails, the error directs you to Google account
permissions; local credentials are still removed.

## Verification

```powershell
python -m unittest discover -s video-workflow/tests -v
```

Tests use synthetic data and mocked Google transports, including the real Google
resumable request serializer. They cover source/approval hashes, path boundaries,
protected storage, duplicate prevention, interruption recovery, processing, Studio
evidence, remote drift, past schedules, metric compatibility, missing data, CSV
imports, change history and evidence-linked lessons. They perform no live upload,
account query, publication or video render.

See [PLAN.md](PLAN.md) for the original delivery sequence and
[VALIDATION.md](VALIDATION.md) for actual implementation evidence and remaining
live validation. The original plan's live end-to-end acceptance remains pending
until the channel/OAuth details and concrete release authorization are supplied.

References: [YouTube uploads](https://developers.google.com/youtube/v3/docs/videos/insert),
[scheduling](https://developers.google.com/youtube/v3/docs/videos#status.publishAt),
[Shorts thumbnail guidance](https://support.google.com/youtube/answer/72431),
[analytics reports](https://developers.google.com/youtube/analytics/channel_reports),
[data handling](https://developers.google.com/youtube/terms/developer-policies).
