# Implementation evidence

20 October 2026. Local implementation complete; real-channel acceptance pending.
The user deferred supplying channel/OAuth details. No account connection, upload,
publication, live analytics query or recurring-task activation was performed.

## Delivered

- Python CLI and template covering planning intake, packaging review, release
  authorization, protected OAuth, resumable private upload, thumbnail application
  or Studio evidence, scheduling/publication and remote status reconciliation.
- Analytics collection with separate compatible reports, daily catch-up, dated raw
  and normalized results, CSV import, due 1-/7-/28-day reviews, retention positions,
  package-change observations, evidence-linked lessons and next-planning handoff.
- Operation locks, atomic records, bounded Google retries, ambiguous-upload recovery,
  data cleanup/disconnect and fail-closed source/export/approval validation.
- V2 README/Director handoff updates. Existing production code, projects, media,
  approval receipts, OneTake and the two production gates are preserved.

## Automated checks

Commands executed from the repository root:

```powershell
python -m unittest discover -s video-workflow/tests -q
# Ran 55 tests. OK.
python -m unittest discover -s 2d-animation-v2/tests -q
# Ran 28 tests. OK.
git diff --check
# Passed; Git emitted only LF/CRLF conversion notices.
```

All five new Python source/test files parsed successfully. New source,
documentation and JSON templates have no trailing whitespace. Runtime video
records remain ignored by the existing `videos/` rule.

The Google upload tests exercise the actual installed `HttpRequest` serializer
against a mocked transport: interruption after session creation, server progress
query on restart, one upload initiation, and reuse of a saved completion ID.
Windows DPAPI was exercised with a synthetic secret: encrypted bytes contained
no plaintext test value, and decryption restored the original test data.

Tests also cover source/gate/export changes, duplicate invocations, project locks,
wrong-channel rejection, past/timezone-free schedules, pending/failed processing,
remote schedule/declaration drift, Studio evidence, failed thumbnails, uncertain
release success, immutable upload notification settings, private metadata revisions,
manual recovery, reordered analytics headers, unsupported metrics, quota/auth
failures, missing versus zero values, CSV validation, package-change observations,
retention mapping, postpublication source changes, cleanup and lesson provenance.

The independent handoff reviewer reproduced release/analytics edge cases; the
corresponding fixes and regression tests passed. The reviewer then rechecked those
fixes and V2 documentation links without further findings. This is local review,
not evidence of YouTube account capabilities.

Tested installed dependencies: google-api-python-client 2.182.0,
google-auth-oauthlib 1.2.2, Pillow 10.4.0 and tzdata 2025.2. Existing compatible
packages were reused; no global dependency installation was needed.

## Existing-video packaging demonstration

Created the ignored local draft:
`video-workflow/videos/http-cache-package/review.html`.

It references the existing `2d-animation-v2/examples/http-cache/output/video.mp4`.
Both source production receipts were verified against their current inputs/audit,
and the existing export verification report's path/hash, successful decode record,
1080 x 1920 dimensions, 30 fps and 99.9667-second duration were accepted.
The existing export was not re-rendered or independently decoded again here.

The draft contains three title angles, a source-faithful description, two thumbnail
concepts and an unchanged encoded frame as its demonstration thumbnail. Channel,
audience declaration, synthetic-media declaration and intended-use rights remain
unset, and the review visibly states that release is blocked. No release receipt
was fabricated. The image is a reuse demonstration, not a performance-tested design.

Playwright opened the report through a temporary localhost server. At 390 x 844:

- The actual video loaded with duration 99.966667 seconds and readyState 4.
- The selected thumbnail loaded; the page had no horizontal overflow.
- The draft release blockers, description, settings and candidate choices were
  present. The complete mobile screenshot was visually inspected.

Screenshot: `video-workflow/videos/http-cache-package/output/playwright/review-mobile.png`.
Browser file URLs were blocked by the automation environment, so the report uses
relative media paths and also supports serving the repository root locally.

## Remaining live acceptance

After channel details are supplied, validate OAuth consent, refresh-token lifetime,
target-channel identity and quota. With concrete release authorization, exercise
one private upload, actual Shorts thumbnail capability or Studio fallback, processing
and Studio review, future scheduling, public-state confirmation, real metrics,
and a subsequent evidence-based planning decision. Enable daily collection only
when that setup is ready. Synthetic tests do not count as those live results.

No commits, pushes, new video renders or source-project migrations were performed.
