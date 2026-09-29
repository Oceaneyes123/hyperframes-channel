# Checks, review and render

This file owns project validation, evidence capture, preview and render. The
production sequence and gates live in `channel/CHANNEL_RECIPE.md`.

## Structural checks

Run the project validator for its current stage, then HyperFrames check:

```powershell
py -3 scripts\validate_project.py --project videos\<project> --stage preview
npx hyperframes check
```

Use plan stage before measured audio exists. Validation checks artifacts and
contracts; HyperFrames check covers runtime, layout, motion and contrast. A
static pass does not prove the scene is readable or its promised action occurs.
Zero motion assertions or samples are not proof of good movement.

## Visual and audio review

Review the complete sequence at phone size. For every scene inspect the opening,
each action and the resolved state, then inspect every adjacent cut. Compare the
frame to its approved sketch and storyboard: named objects, route endpoints,
packet arrival, visible consequence, persistent identity and safe-area text.
Record actual scene-local times, evidence paths and pass/fix notes in each
storyboard action row. Leave unseen rows uninspected. Fix all failures, then
repeat the complete review pass.

Play the preview once sound-off for causal clarity and once with narration for
timing and intelligibility. Check each unique WAV mount against `audio_meta.json`.
Do not claim to have listened if only metadata was inspected.

For motion-v1 scenes, inspect onset, the midpoint of each important morph,
arrival, camera extrema and both sides of every changed cut. Use
`index.motion.json` beside the assembled index for appearance and in-frame
assertions, with globally scoped selectors and global seconds. The installed
CLI discovers sidecars only in the project root, not recursively. Flag unexplained
stillness over three seconds, teleportation, velocity jumps, repeated entrances,
unexplained disappearances and mismatched handoff positions; distinguish
deliberate reading pauses. Check label safety throughout zooms and settle actions
before narration ends. Record limitations instead of marking unseen beats passed.

Run `node scripts/test_motion.mjs` and `python -m unittest discover -s scripts`.
The HTTPS integration check is `node scripts/test_motion_browser.mjs --url
http://localhost:3028/api/projects/https-actually-works/preview`; it compares
pixel hashes after backward/random seeks, samples label bounds and target
displacement at 30 fps, and checks distinct, repeatable temporal samples.
Pass `--browser <Chrome executable>` or `--modules <existing node_modules>`
when automatic discovery is unavailable. These checks do not replace listening.

HyperFrames snapshot overwrites the project's `snapshots/` directory. Use
`-o <temporary-directory>` for interim captures; retain the full project
evidence set and finish with one full pass. Share one contact sheet per review
milestone.

## Final preview and render

After all scene and cut reviews pass, open the actual HyperFrames preview.
Gate 2 is explicit user approval of that complete preview. Do not render before
approval. Persist the approval and run render-stage validation:

Render-stage validation requires `audio_meta.json` to name the shared cloned
channel voice. For an older project, regenerate narration, review the complete
updated preview, and record Gate 2 approval before rendering.

```powershell
py -3 scripts\validate_project.py --project videos\<project> --stage render
npx hyperframes render --quality high --output <name>.mp4
ffprobe -v error -show_format -show_streams <name>.mp4
ffmpeg -v error -i <name>.mp4 -f null NUL
```

Inspect a frame from the exported MP4. Report dimensions, frame rate, codecs,
duration and decode evidence separately from local checks. Do not commit, push,
publish or deploy unless requested.

## Optional temporal motion blur

Keep ordinary HyperFrames preview for fast development. After renewed Gate 2
approval, `scripts/motion_capture.mjs` captures the actual compiled local
HyperFrames preview (not raw source HTML), seeks four temporal samples per
frame across a centered 180-degree shutter and blends equal exposures in
linear light. Output defaults to 30 fps; pass `--fps` for a different video.
Studio's seek rounds to frame boundaries, so the capture driver pauses Studio
and seeks its compiled scene timelines and host visibility at exact subframe
times. This path supports the channel assembler's simple scene/audio host.
Hard-cut sample windows clamp to their own scene, avoiding cross-scene ghosts.
`--mode preview` uses one sample; `--mode production` defaults to four with
`--samples` and `--shutter` configurable. This is pixel integration, not CSS blur.

```powershell
npx hyperframes preview videos/https-actually-works --background --no-open --port 3028
node scripts/motion_capture.mjs --project videos/https-actually-works --url http://localhost:3028/api/projects/https-actually-works/preview --mode production --output videos/https-actually-works/renders/https-motion-v1.mp4
```

The script reuses installed HyperFrames dependencies (puppeteer-core and sharp),
requires Chrome and FFmpeg, checks render-stage approval, keeps per-scene WAVs
in their canonical sequence, refuses to overwrite an output and records capture
settings/browser version. Keep that browser version for reproducibility.
The current capture path targets HTML/SVG with narration; ordinary HyperFrames
render remains the general media/HDR/export path. MP4 mux/decode and listening
still need verification after approval; successful still captures do not prove them.

Before approval, capture representative production-blurred stills only:

```powershell
node scripts/motion_capture.mjs --project videos/https-actually-works --url http://localhost:3028/api/projects/https-actually-works/preview --mode production --stills 8.4,22.2,51.4 --output videos/https-actually-works/review/motion-blur
```

Use matching times in preview mode to compare sharp and integrated samples.
The renderer writes incrementally and uses constant memory per frame; four
browser captures per output frame cost more time than a normal render.
