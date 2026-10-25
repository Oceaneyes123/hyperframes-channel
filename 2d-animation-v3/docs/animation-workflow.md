# Connected animation workflow

Open a project's **Visual concepts and storyboards** workspace. Accept the current
script, select a concept and accept its exact storyboard. Motion requests then run
through the configured server-only CLIProxyAPI gateway. Generated JSON is validated
against the source drawings, object correspondence and supported interpreter.

Concepts, storyboards and storyboard-shot revisions use
`CLIPROXYAPI_VISUAL_MODEL` when set, falling back to `CLIPROXYAPI_MODEL`.
This workspace selects `gpt-6.1-sol` for visual planning and keeps the default
`gpt-6-luna` for writing, editorial work and motion. Each visual job records the
model actually requested. Existing proposals retain their original model history.

## General visual direction

V3 defaults to large animated diagrams and recognizable icons with visible cause
and effect. Narration carries the explanation; the canvas defaults to no text.
Use at most two short labels of one to three words when teaching needs them,
with exceptions for exact commands, numbers and required factual qualifications.
Do not add spoken or on-canvas provenance labels such as **Hypothetical**,
**Demo** or **Illustrative**. Introduce invented examples naturally in narration
(for example, "Imagine three freelancers") and keep provenance in reviewer notes.
Preserve meaningful conditions and uncertainty; invented customers, payments or
results must never appear to be verified evidence. This applies to future writing
and visual requests; existing immutable artifacts keep their original text.
Avoid paragraphs, bullet lists and narration-filled cards. Concept explanations
remain available under **Concept details**, outside the planning drawing.

Plan persistent objects that move, connect, group, compare or transform. Short
GIF-like sequences use native seek-safe actions and purposeful cycles followed
by readable holds. Imported GIFs/images are not currently supported. Concept and
storyboard drawings remain static key states; actual animation appears in motion
review after storyboard acceptance. Shared generation guidance lives in
`server/visual-guidance.ts` and applies to concepts, storyboards, shot revisions
and motion proposals. Existing artifacts and human approvals are not rewritten.

## Review motion

The `centered-text` primitive centers a fitted single-line label inside its box
in both planning drawings and motion. Its text width/height stays fixed during
motion, like other text primitives. Existing `text` labels retain left alignment.

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

Channel narration now defaults to **audio version 2: Fish Audio via OpenRouter**.
The [versioned narration reference](../../2d-animation/channel/AUDIO_VERSIONS.md)
records the approved audition/settings and preserves version 1 Supertonic rollback.
This is a production preference, not a built-in synthesis adapter. Existing project
audio stays unchanged until a separate complete revision is generated and imported.

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

## Motion graphics extension (October 24, 2026)

Interpreter 3 adds validated, versioned beats and six semantic choreography presets while retaining legacy interpreter output. Safe authored components share static/animated rendering, named parts and bounded masks. Optional script/audio-bound planning narration precedes motion generation; final narration and exact production gates remain separate. Timing corrections invalidate dependent motion. Motion Quality findings are diagnostic review evidence, not human approval. See [motion graphics workflow](motion-graphics/README.md) for contracts, compatibility, verification and limits.
