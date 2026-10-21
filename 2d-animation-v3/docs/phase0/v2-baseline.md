# Frozen v2 baseline

Captured 2026-10-21 at repository HEAD
`24cf2ad1e00422b99ad60566a9c1960220f779bb`.

[v2-baseline.json](v2-baseline.json) records byte lengths and SHA-256 for 730
tracked v2 files plus the existing external motion-audit report: 731 files,
88,508,559 bytes. The manifest includes the existing HTTP-cache export and its
reports. Hashes describe the current checkout's actual bytes, not an assumption
that every generated file still matches an earlier approval.

This freezes provenance by reference; it does not copy or modify v2 or its media.
The original files must remain available for later comparisons. No Git commit,
tag, branch or push was created. V1 remains untouched.

## Current checks

- `python 2d-animation-v2/scripts/studio.py skills`: all six installed specialist
  skill entries resolved and passed the existing integrity checks.
- `PYTHONDONTWRITEBYTECODE=1 python -B -m unittest discover -s 2d-animation-v2/tests -q`:
  **28 tests passed**. This is environment-variable notation; in PowerShell set
  `$env:PYTHONDONTWRITEBYTECODE='1'` before running `python -B ...`.
- Every recorded file hash verified immediately after writing the snapshot.
- Existing HTTP-cache `output/video.mp4` hash matches the saved report:
  `658a5459ae7bad0872f4e2ca3927060ae05a0618a74358507675b9604fb05e01`.

The saved render report states 2,999 frames, 1080 × 1920, 30/1 fps,
99.96666666666667 seconds, and full decode PASS. The current check confirms the
file identity, **not a fresh decode, listen, playback review, or renewed Gate 2**.

## What already exists

V2 combines original installed storytelling-hooks and humanizer with channel
editorial rules, OneTake motion, Supertonic narration, and two production gates.
It already supports continuity planning and purposeful variation. V3 must not
claim those concepts are absent merely to justify a new architecture.

`SCRIPT_TESTS.md` retains finance, HTTP-cache and AI-citation writing trials.
Its author explicitly knew provenance; those reviews are not independent blinded
experiments or evidence that a single skill caused an improvement.
`workflow/HTTP_CACHE_STORYTELLING.md` also labels its revisions as planning-only,
with no newly measured improvement over the existing film.

The 2026-10-19 report under `motion-audits/` is explicitly preliminary/blocked:
the reviewer could not access playback. Zero confirmed motion findings means
unassessed, not defect-free. Keep this distinct from the separate HTTP-cache
export verification and earlier audit artifacts.

## Recheck the freeze

Run from the repository root; this reads files only and fails on drift:

```powershell
@'
import hashlib, json
from pathlib import Path
root = Path.cwd()
manifest = json.loads((root / '2d-animation-v3/docs/phase0/v2-baseline.json').read_text())
for entry in manifest['files']:
    data = (root / entry['path']).read_bytes()
    assert len(data) == entry['bytes'], entry['path']
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], entry['path']
print(f"Verified {len(manifest['files'])} frozen files")
'@ | python -
```

Later baseline updates must create a new dated snapshot rather than silently
rewriting this one. Neither existing media nor automated checks establish v3
creative superiority; that still needs matched outputs and actual human review.
