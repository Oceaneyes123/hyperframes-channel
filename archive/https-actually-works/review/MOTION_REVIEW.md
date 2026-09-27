# Motion-v1 pilot review

Local implementation complete; revised preview awaits Gate 2 approval.
Preview: http://localhost:3028/#project/https-actually-works

## Scope and comparison

Only source scenes 2, 4 and 7 were regenerated. SCRIPT.md, audio_meta.json,
all narration WAVs and the other five source frames remain unchanged. The
original 4,978,165-byte MP4 still has its September 25 modification time.
Original render approval is preserved under motion-before; it does not approve
this changed preview. Nothing was committed or pushed.

| Scene | Before | Pilot |
| --- | --- | --- |
| Hello / key share | Independent Y tweens and separate labels | One persistent shell, SVG route/retrace, changing state, traveling public share, staggered route edges |
| Certificate | Independent entrances for each check | Certificate remains present, becomes larger, one status field changes, camera directs attention, connector follows geometry, proof key stays at server |
| HTTP through TLS | Separate request/protected-request/response elements | Persistent shell with sequential contents, encrypted route travel and retrace, restrained stretch/arrival compression |

[Before/after sheet](motion-comparison.jpg) ·
[25-frame action/cut sheet](motion-after/contact-sheet.jpg) ·
[Normal versus four-sample exposures](motion-blur/comparison.jpg)

Inspected motion onset, midpoint, arrival, status swaps, camera framing and
changed boundaries at the times recorded in STORYBOARD.md. The short blank
interval inside a content swap is intentional: old/new text never overlap.
Fixed endpoint labels remain readable while the central diagram reframes.
Reading holds at the resolved states are intentional. Scene 4 reframes before
its narration ends; scene 7 settles after naming symmetric encryption.

Frames 5 and 8 keep their original concept cuts/entrances and diagram positions.
The pilot does not claim continuous object travel across those frozen boundaries.
No full-video listening review was performed. Word cues come from local
faster-whisper base alignment of the existing WAVs, with hashes and raw evidence;
they are machine-aligned, not human-audited word boundaries.

## Verification

- 24 Python checks pass, including stale audio/cue rejection and opt-in asset sync.
- Numeric spring/path/state/swap checks and actual GSAP suppressed/backward seek checks pass.
- HyperFrames 0.8.80 check: zero errors or warnings across lint, runtime, layout,
  motion and contrast; 19 explicit layout times and 300 motion samples.
- Browser checks: every 30 fps pilot sample stays within label safe bounds;
  all target positions match when visited in reverse. Four fixed screenshot
  hashes match after random/backward seeks. See motion-browser-check.json.
- Four temporal samples at 8.4s produce four distinct images and an identical
  repeated linear-light blend. Capture browser: Chrome 124.0.6367.91.
- Preview-stage project validator and git diff whitespace checks pass.

Studio's native seek quantizes to output FPS. The optional capture driver keeps
Studio paused and drives its compiled scene timelines at exact sample times.
This avoids both quantization and queued Studio redraws. Production mode is
four samples across a centered 180-degree shutter at 30 fps; preview mode is
one sample. The saved blur examples are still images, not an approved MP4.

The MP4 encoder/audio mux path is implemented but has not been exercised on
this video: render-stage validation requires renewed approval. After approval,
render to a new filename, then verify ffprobe metadata, full decode, exported
frames and narration playback. This capture path supports the channel
assembler's HTML/SVG scenes with narration; general source-video/HDR work stays
on the normal HyperFrames renderer.

## Reuse

See ../../../channel/MOTION_API.md, BUILD.md and VERIFY.md. The shared runtime
and local fonts are opt-in through motion_version 1.0.0; legacy projects remain
unchanged. The reference study used Barty-Bart/motion-graphics commit
e8d610adcf946367430c8b43a97aad8059befaad, especially the analytic tracks,
document/slider examples and temporal sampling. No reference branding was adopted.
