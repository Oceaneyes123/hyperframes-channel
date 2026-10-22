# Connected animation workflow

Open a project's **Visual concepts and storyboards** workspace. Accept the current
script, select a concept and accept its exact storyboard. Motion requests then run
through the configured server-only CLIProxyAPI gateway. Generated JSON is validated
against the source drawings, object correspondence and supported interpreter.

## Review motion

The client-only Remotion Player uses the same composition as local export. Play,
pause, step, scrub, select shots and loop their incoming boundary. Narration links
locate shots. A scoped revision can change that shot's actions, camera and duration;
the server reconstructs the plan while preserving every other shot and the script.
Duration changes visibly shift downstream offsets. Compare a proposal with the
accepted version at the same global frame; a shorter version holds its final frame.
Only the main preview supplies time and audio. Accept or reject explicitly.
Historical/rejected/stale artifacts remain readable; they cannot acquire fresh approval.

Interpreter 2 has explicit arrival semantics:

| Type | Meaning |
| --- | --- |
| hard-cut | Immediate cut, zero overlap |
| match-cut | Immediate cut at an explicit geometry/camera-matched anchor |
| continuous | One persistent SVG actor across a geometry/appearance/camera-matched seam |
| camera | Lateral scene slide with overlap, using the official Remotion presentation |
| reveal | Incoming scene wipes over the outgoing scene |
| split-screen | Both complete compositions shrink into neighboring panels, hold side by side, then the incoming panel expands; at least 15 overlap frames |
| motion-match | Rejected: velocity matching is not implemented |

New plans reject incompatible presentation/type pairs and invalid/triple overlaps.
Legacy interpreter-1 artifacts retain their original interpretation, including old
fade presentations. New scoped revisions also validate under interpreter 2 and
reject incompatible legacy boundaries; request a full plan to upgrade those effects.
Text width/height animation rejects explicitly; use movement, scale, opacity or
separate replacement objects. No arbitrary plugins, SVG markup, URLs or generated code.

Bundled reusable symbols include document, browser, database, server, cloud, person,
chip and coin. Heading, caption and code treatments provide typography hierarchy.
All symbols and fonts are local; the fixed source and lockfile are part of gate bindings.
Planning and moving views share these renderers. Camera motion and reading holds
are explicit instructions, not automatic decoration.

## Narration and production safeguards

Import a complete mono/stereo PCM16 WAV, at most 16 MB, plus measured line timing:

```json
[{"number":1,"startFrame":0,"endFrame":110}]
```

Supply every narration line once, ordered, inside its assigned shot. End frames
are exclusive. Audio duration must match accepted motion within one frame at 30 fps;
revise motion timing and accept that revision first if needed. The app measures
duration/sample rate/channels and derives a peak waveform; it does not establish
spoken-word alignment or synthesize/transcribe speech. Timing accuracy needs listening.
The main Player uses Remotion audio synchronization; comparisons stay silent.

Separate deterministic diagnostics flag missing reading holds, strong camera movement
and long text. These checks are independent of generation and never claim human quality.
Gate 1 records explicit review of the exact creative plan and sources. Gate 2 requires
Gate 1 and a separate moving/audio review attestation with findings. Binding includes
the accepted script/storyboard/motion, exact voice/timing, bundled assets, engine
source/configuration and package lock. Replacing narration or changing accepted
inputs/configuration invalidates gates. Models cannot issue these approvals.

The render button separately requires **explicit local production render authorization**.
Rendering never publishes. Chrome (or `V3_CHROME_PATH`), FFmpeg and ffprobe must already
be installed. Initial local export is limited to 180 seconds and one active job per
project. Rendering is request-bound; failure/disconnection retains diagnostics, and
an interrupted job expires after 30 minutes before explicit retry. There is no durable
background worker or cloud render service.

Export verification requires 1080×1920, 30 fps, exact frame count/duration, audio,
full decode, every encoded frame matching sequential PNG preview references at
SSIM ≥0.98, fresh boundary seeks matching exact PNG bytes, and audio correlation
≥0.9 with lag within one frame. Comparisons normalize time bases and retain the same
filter graph across RGB/RGBA PNG changes. These are technical tolerances for lossy
H.264/AAC, not proof of aesthetic or narration quality. Verified downloads check the
export hash; stale inputs during rendering prevent successful completion.

## Verification

`npm run check` and `npm run build` are required. `node scripts/verify-production.mjs`
creates a fresh isolated synthetic project with all supported transitions, typography,
symbols and test-tone audio, and exercises the actual guarded renderer. Its fixture
gate records expressly do not represent human approval of real media. It preserves
every round under `.data/production-proof-*`; original benchmark and v1/v2 data stay
separate. Browser verification uses an isolated fixture or explicitly live gateway.

Current [synthetic export receipt](gsap/workflow-verification.json) verifies 350
frames, exact fresh seeks and settled opening, minimum SSIM 0.998518, full decode,
audio correlation 0.999999584 and zero lag. The
[live Studio receipt](gsap/live-motion-verification.json) records successful real
gpt-6-luna full/scoped requests and unchanged unselected shots. Both are technical
integration evidence, never actual human production approval. The
[transition contact sheet](gsap/workflow-transition-windows.png) includes shared
seams, hard/match cuts, slides, wipes and the split-screen comparison hold.
The [extra seek receipt](gsap/workflow-seek-verification.json) verifies nine fresh
out-of-order PNG seeks inside the slide, wipe and split-screen, including a repeated
frame. [Studio screenshot](gsap/studio-motion-review.jpg) shows connected comparison.
An isolated [45-frame UI export receipt](gsap/ui-render-verification.json) also
exercises actual browser audio upload, test-only gate forms, authorized synthetic
HTTP rendering, verified download and range requests. Its gate notes explicitly
identify automated synthetic software verification, not real human approval.
[Synthetic export screenshot](gsap/studio-synthetic-export.jpg) records that test.

Presentation integration follows the official
[Remotion custom presentation contract](https://www.remotion.dev/docs/transitions/presentations/custom)
and installed version 4.0.537. Production quality acceptance still needs the user's
actual moving/audio review of a real project. No real production video is authorized
or generated by this implementation task.
