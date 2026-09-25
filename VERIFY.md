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

HyperFrames snapshot overwrites the project's `snapshots/` directory. Use
`-o <temporary-directory>` for interim captures; retain the full project
evidence set and finish with one full pass. Share one contact sheet per review
milestone.

## Final preview and render

After all scene and cut reviews pass, open the actual HyperFrames preview.
Gate 2 is explicit user approval of that complete preview. Do not render before
approval. Persist the approval and run render-stage validation:

```powershell
py -3 scripts\validate_project.py --project videos\<project> --stage render
npx hyperframes render --quality high --output <name>.mp4
ffprobe -v error -show_format -show_streams <name>.mp4
ffmpeg -v error -i <name>.mp4 -f null NUL
```

Inspect a frame from the exported MP4. Report dimensions, frame rate, codecs,
duration and decode evidence separately from local checks. Do not commit, push,
publish or deploy unless requested.
