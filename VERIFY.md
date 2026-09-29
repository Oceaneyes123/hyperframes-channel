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
CLI discovers sidecars only in the project root, not recursively. Flag long
holds without explanatory or comprehension purpose, teleportation, velocity
jumps, repeated entrances, unexplained disappearances and mismatched handoff positions; distinguish
deliberate reading pauses. Check label safety throughout zooms and settle actions
before narration ends. Record limitations instead of marking unseen beats passed.

Run `node scripts/test_motion.mjs` and `python -m unittest discover -s scripts`.
For a new video, inspect its own compiled preview at the storyboard's measured
sample times. Check backward/random seeks, label bounds throughout movement,
arrival reactions and settled results. No previous project is needed.

`scripts/test_motion_browser.mjs` is an optional regression check for the
historical HTTPS pilot when changing shared runtime code. It hardcodes that
pilot's selectors and sample times; it is not a general new-video acceptance
check, even with `--project`. Do not require the pilot to create or review a
new video. These checks do not replace listening.

HyperFrames snapshot overwrites the project's `snapshots/` directory. Use
`-o <temporary-directory>` for interim captures; retain the full project
evidence set and finish with one full pass. Share one contact sheet per review
milestone.

## Final quality review

Apply these questions to the script and timed sketches at Gate 1, then verify
them against the complete preview at Gate 2. Record fixes and evidence in the
existing storyboard rows and review notes; no additional artifact or gate is
required. Evaluate the creative rules in `SCRIPT_GUIDE.md` and `MOTION.md`:

- Does the script naturally give the viewer reasons to continue watching?
- Does every major section deliver a payoff, and does that answer lead into a
  natural next question where appropriate? Does the final payoff answer the hook?
- Are technical ideas shown before being named where possible? Does every
  sentence advance explanation, create useful curiosity or pay off a question?
- Can the main causal explanation be understood with sound off?
- Do important actions happen around the spoken phrases that give them meaning?
  Inspect the actual event with narration, not merely the cue file's timestamps.
- Does motion show cause before effect, including the receiving object's response?
- Do persistent objects carry related ideas and retain identity across cuts?
- Do significant actions use anticipation, momentum, reaction, follow-through
  and settling where useful, without mechanically requiring every phase?
- Is visual energy varied, with meaningful peaks throughout and readable pauses,
  rather than constant movement or an opening peak followed by repetitive slides?
- Which effects, transitions or camera moves can be removed without losing meaning?
- Does the sequence feel like directed motion graphics, with visible mechanisms,
  rather than an animated slide presentation dominated by entrances and labels?

Prioritize viewer retention, clarity and comprehension, story progression,
motion quality, visual continuity, narration-to-motion synchronization, then
production consistency. Technical accuracy, required coverage and approval gates
remain constraints. Every line, animation, transition, camera move and visual
change must serve the explanation or viewer attention; impressive effects alone
do not pass review. Structural checks do not establish these creative qualities.

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
npx hyperframes preview videos/<project> --background --no-open --port 3028
node scripts/motion_capture.mjs --project videos/<project> --url http://localhost:3028/api/projects/<project>/preview --mode production --output videos/<project>/renders/<project>-motion-v1.mp4
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
node scripts/motion_capture.mjs --project videos/<project> --url http://localhost:3028/api/projects/<project>/preview --mode production --stills <comma-separated-global-seconds> --output videos/<project>/review/motion-blur
```

Replace placeholders with the target project and its own measured storyboard
sample times; do not reuse another video's timings.

Use matching times in preview mode to compare sharp and integrated samples.
The renderer writes incrementally and uses constant memory per frame; four
browser captures per output frame cost more time than a normal render.
