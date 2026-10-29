# Repository housekeeping — October 29, 2026

The user approved generated-artifact cleanup, local history rewriting and
replacement commits. No push or publication is authorized. No production engine,
writing workflow, source plan or frozen evaluation text is changed.

## Retention and recovery

Before cleanup the checkout contained 4,567 tracked files totaling 317,900,698
working-file bytes. The cleanup removes 3,681 generated files from tracking,
totaling 268,388,899 bytes. All remain on the original machine. Representative
Markdown-linked images, source files, licenses, manifests, runtime fonts/media
and v1 voice references remain tracked. V1/v2 stay at their original paths because
v2 imports v1 and publishing imports/enforces v2 paths.

The original machine holds these **ignored local backups**:

- `artifacts/housekeeping-2026-10-29/original-tracked-evidence.zip`: all 4,567
  original tracked working files, including removed evidence and original Terra
  example JSON. Size: 252,228,064 bytes. SHA-256:
  `908d5f6dbe9f7c3f3ab9519f63598b912eb46af374989626cdb38df67dadf634`.
- `artifacts/housekeeping-2026-10-29/original-history.bundle`: all original Git
  refs, including the branch, remote-tracking refs, stash and Codex checkpoint refs.
  Verified with `git bundle verify`. Original branch HEAD:
  `d3bf53dba32da6f4d6f07970f5d6ff6b2fbcd153`.
- The removal lists and verification records beside these backups document the
  operation. A final pre-rewrite bundle also preserves the cleanup commit.

The ZIP and bundle are not uploaded or included in a clone. Copy them to durable
external storage before removing the original machine's local files. Release
evidence bundles are the recommended sharing destination; publishing them is a
separate action. No LFS dependency was added.

[The evidence manifest](evidence-2026-10-29.json) records every original path,
working-file byte length and SHA-256, plus whether it was untracked. Restore missing
removed files from the repository root:

```powershell
python scripts/restore-evidence.py artifacts/housekeeping-2026-10-29/original-tracked-evidence.zip
python scripts/restore-evidence.py artifacts/housekeeping-2026-10-29/original-tracked-evidence.zip --restore
```

The first command verifies the archive and removed members without restoring.
The second prevalidates paths and bytes, restores missing removed files and
refuses to overwrite changed local files. Keep the original ZIP intact; its
other members retain pre-cleanup source and historical example artifacts for
manual recovery. To recover the complete original Git repository, clone the
history bundle into a **separate directory**, then restore required local data
from its separate backups. A Git bundle does not contain ignored local data.

## Historical checks and links

No existing expected hashes were edited. Locally, both frozen manifests still
verify after index removal:

- `2d-animation-v3/docs/phase0/v2-baseline.json`: 731 files, including generated
  v2 media and the external motion-audit report.
- `2d-animation-v3/docs/phase0/renderer-benchmark-sources.json`: 22 benchmark
  source/configuration files. These remain tracked.

A fresh checkout deliberately lacks the removed historical media. The 731-file
check fails on missing paths until restoration; keeping hashes unchanged makes
that limitation visible. The 22-file source check does not need the media bundle.
The original verification command remains in
[the frozen baseline instructions](../../2d-animation-v3/docs/phase0/v2-baseline.md).

Historical review links to removed MP4/WAV/PNG files require restoration. This
includes HTTP-cache playback/export verification, payment-failed narration and
motion reviews, Terra deliveries and the graphics benchmark before/after videos.
The DeepSeek advanced-comparison script also reads an archived review MP4.
Scripts, JSON receipts, frozen writing evaluations and failed diagnostic records
were retained; generated media/logs were externalized. Logs are preserved in the
archive, not discarded.

Current application tests retain their source fixtures and registered public
assets. V2's narration regression additionally needs the ignored v1 channel voice
clone; this was already a local prerequisite. Historical Studio project databases
and immutable production inputs were never all tracked, so the evidence ZIP does
not make every old production job runnable by itself.

## File policy

Root `.gitignore` excludes future generated audio/video, frame captures, seek
PNGs, logs, archives, local databases, environment files and Graphify detection
output. Exact exceptions retain linked representative images and required source
media. Source JSON, HTML, Python and JavaScript inside output/planning directories
remain eligible for tracking.

Local hooks are installed with `core.hooksPath=.githooks` in the original checkout.
New clones must run the README's installation command. The guard reads staged
Git blobs instead of working-file sizes and checks outgoing commit history, so
shrinking a working file or deleting it in a later commit does not hide a large
blob. CI independently runs the same policy and focused housekeeping tests.
The limit is 5 MiB; [exceptions](large-file-exceptions.json) bind exact legacy
blob IDs. New bytes need an explicit reviewed policy exception. Hooks are a local
guard, not a server security boundary; require the CI check through branch
protection if merge enforcement is wanted.

## Terra example correction

The original `output/terra-intense-10s-example` is preserved as historical review
evidence, including the labels that conflict with current guidance. The existing
example generator and renderer now target
`output/terra-intense-10s-example-corrected`. The corrected revision removes the
standalone `Illustrative` actor and suffixes, retains `Your decision` and
`Launch promise`, recalculates ordinary storyboard source hashes and keeps the
same six shot durations and 300-frame timeline. Original source hashes and
narration speed remain unchanged. No frozen writing evaluation was rewritten.

Both revisions remain review examples, not new production approvals. Corrected
media is ignored; its JSON inputs and verification record remain trackable.

## History rewrite

The authorized rewrite removes the same generated paths from local history plus
one older browser-console log. Existing source commits remain a sequence of
commits with rewritten IDs; this is not a squash. Original refs and source
history are recoverable from the bundle.

The GitHub repository is unchanged until an explicitly authorized push. Rewritten
history will require coordination and a force-with-lease update; do not perform
a normal pull/merge of the old history into this checkout. Re-clone collaborators
after any eventual remote rewrite. Historical SHA references inside frozen
documents intentionally remain original provenance IDs, resolvable in the backup.

## Sensitive data and machine paths

The tracked-text scan found no apparent real credentials; matches were synthetic
fixtures. Ignored v3 environment settings contain API keys and remain private.
Tracked historical receipts contain machine paths; they were preserved as
provenance rather than rewritten. Generated absolute-import registration files
and the machine-specific Graphify inventory were externalized. This housekeeping
does not certify all historical binaries or Git objects as secret-free.

## Validation

- New housekeeping tests: 7 passed.
- V2 unittest discovery: 28 passed.
- Publishing unittest discovery: 55 passed.
- V3 `npm ci`: passed; reported 8 high-severity dependency findings. Versions unchanged.
- V3 `npm run check`: passed, 176 tests; 2 existing unused-variable lint warnings.
- V3 `npm run build`: failed twice, including a solo retry, with Turbopack's
  `Failed to write app endpoint /page`: the CSS worker exited before connecting
  with exit code 0. Application/dependency code was not changed to bypass this.
- Corrected review render: 300 frames at 1080x1920/30 fps, complete decode,
  18 exact seeks, all 300 preview frames compared (minimum SSIM 0.999096),
  audio correlation 0.999979 and zero lag. Recursive labels, exact original
  sample-script bytes and unchanged shot durations pass. Contact sheet inspected.
- Both source plans and original 731/22 expected hashes remain unchanged.
