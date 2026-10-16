# Approved OneTake export

Final file: `video.mp4` (4,680,067 bytes).
SHA256: `658a5459ae7bad0872f4e2ca3927060ae05a0618a74358507675b9604fb05e01`.

User approval: “Now please render”, recorded by the Director in
`../review/gate-2.json`. Executed the guarded production command:

```powershell
.venv/Scripts/python.exe scripts/studio.py render --project examples/http-cache
```

No existing export was overwritten. All render/verification artifacts are inside
this output directory. Both current approval receipts still validate the frozen
production source and independent audit. No script, artwork, narration, timeline,
production record, skill or review evidence was changed during rendering.

## Actual settings and result

- Native 1080 × 1920, 9:16, 30 fps, scale 1; 2,999 frames, 99.9667 s.
- Original OneTake renderer; 180° real shutter; adaptive 4–12 captures per moving
  frame, 24 px gap, 8 workers. Actual moving-frame sample counts: 850 at 4,
  one at 5, two at 10. Total 7,717 captures; 2,146 held frames skipped the shutter.
- Capture time 197.9 s; no page errors. Its heuristic preserved 113 discontinuous
  frames without averaging across them; this is not a count of authored scene cuts.
- H.264, CRF 16, medium preset, yuv420p; AAC narration from the unchanged approved
  full PCM mix. Captions, SFX and music remain off. The upstream `--final` flag
  was not used because it would change the approved frame rate and scale.

## Verification

`verification.log`, `render-verification.json`, `ffprobe.json` and
`full-decode.txt` record the checks. `verify_render.py` contains the actual commands.

- FFprobe confirms dimensions, 30/1 fps, all 2,999 decoded video frames and
  complete audio/video duration. Full decoding of both streams with FFmpeg
  `-xerror` succeeds without errors.
- The decoded AAC mix correlates 0.9999499 with the approved PCM source; each
  of all ten source passages correlates at least 0.999919 at its recorded start.
  AAC is lossy: this is content/placement evidence, not byte identity.
- Zero decoded samples clip. The final two seconds are silent; the narration
  and complete held visual ending are preserved. AAC decoding adds 814 silent
  padding samples beyond the source PCM length, not missing speech.
- Extracted actual encoded portrait frames at 7.633, 15.167, 24.400, 77.733,
  88.067 and 99.933 s. See `encoded-contact.png` and `encoded-frames/` for encoded
  frames and matching approved instant seeks. Inspected all six encoded states.
  Moving frames contain the intended shutter blur. The final held frame's mean
  absolute RGB difference from the approved seek is 1.013 on a 0–255 scale.

## Original oracle limitation

Executed the unchanged original tool from V2:

```powershell
.venv/Scripts/python.exe C:/Users/Dave/.codex/skills/onetake/scripts/verify_promo.py examples/http-cache/output/video.mp4 --comp examples/http-cache/comp.html
```

See `original-oracle.log`.
It returns **FAIL solely for framing**. Its embedded `probe.collect` defaults to
1920 × 1080 and has no portrait CLI override, so it tests this native portrait
composition against a landscape viewport. Those source-coordinate failures do
not establish clipping in the encoded 1080 × 1920 frames. The approved portrait
probe and extracted encoded frames are the applicable framing evidence.

The original oracle passes rest (0.809, longest low-energy interval 22.67 s),
burst, advisory variation, audio and shutter/curves. Its audio test converts mono
to stereo and reports −3.5 dBFS; direct mono decoding measures −0.475 dBFS, with
zero clipping. Its continuity score 1.00 covers zero detected boundaries and is
not evidence of semantic carry. Cadence was skipped because this continuous film
has no authored shot list. No reference film was supplied.

No upstream code, approved source or audio gain was altered to change an oracle
result. Independent encoded review is handled separately by the Reviewer.

Skipped: audible listening and audience testing. Media decoding, correlation and
image checks do not establish pronunciation or subjective voice quality.
