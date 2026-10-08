# Checks, review and render

This file owns project validation, evidence capture, preview and render. The
production sequence and gates live in `channel/CHANNEL_RECIPE.md`.

**On this page**

- [Structural checks](#structural-checks)
- [Visual and audio review](#visual-and-audio-review)
- [Final quality review](#final-quality-review)
- [Motion craft evidence at both gates](#motion-craft-evidence-at-both-gates)
- [Text-minimization review at both gates](#text-minimization-review-at-both-gates)
- [Final preview and render](#final-preview-and-render)
- [Optional temporal motion blur](#optional-temporal-motion-blur)

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

### Scene and cut evidence

Review the complete sequence at phone size. For every scene inspect the opening,
each action and the resolved state, then inspect every adjacent cut. Compare the
frame to its approved sketch and storyboard: named objects, route endpoints,
packet arrival, visible consequence, persistent identity and safe-area text.
Record actual scene-local times, evidence paths and pass/fix notes in each
storyboard action row. Leave unseen rows uninspected. Fix all failures, then
repeat the complete review pass.

### Sound-off and narration review

Play the preview once sound-off for causal clarity and once with narration for
timing and intelligibility. Check each unique WAV mount against `audio_meta.json`.
Do not claim to have listened if only metadata was inspected.

### Motion-v1 sample points

For motion-v1 scenes, inspect onset, the midpoint of each important morph,
arrival, camera extrema and both sides of every changed cut. Use
`index.motion.json` beside the assembled index for appearance and in-frame
assertions, with globally scoped selectors and global seconds. The installed
CLI discovers sidecars only in the project root, not recursively.

Flag long
holds without explanatory or comprehension purpose, teleportation, velocity
jumps, repeated entrances, unexplained disappearances and mismatched handoff positions; distinguish
deliberate reading pauses. Check label safety throughout zooms and settle actions
before narration ends. Record limitations instead of marking unseen beats passed.

### Required checks and target preview

Run `node scripts/test_motion.mjs`, `node scripts/test_motion_presets.mjs`,
and `python -m unittest discover -s scripts`.
For a new video, inspect its own compiled preview at the storyboard's measured
sample times. Check backward/random seeks, label bounds throughout movement,
arrival reactions and settled results. No previous project is needed.

### Optional historical regression check

`scripts/test_motion_browser.mjs` is an optional regression check for the
historical HTTPS pilot when changing shared runtime code. It hardcodes that
pilot's selectors and sample times; it is not a general new-video acceptance
check, even with `--project`. Do not require the pilot to create or review a
new video. These checks do not replace listening.

### Snapshot evidence

HyperFrames snapshot overwrites the project's `snapshots/` directory. Use
`-o <temporary-directory>` for interim captures; retain the full project
evidence set and finish with one full pass. Share one contact sheet per review
milestone.

## Final quality review

Apply these questions to the script and timed sketches at Gate 1, then verify
them against the complete preview at Gate 2. Record fixes and evidence in the
existing storyboard rows and review notes; no additional artifact or gate is
required. Evaluate the creative rules in `SCRIPT_GUIDE.md` and `MOTION.md`:

### Story and causal clarity

- Does the script naturally give the viewer reasons to continue watching?
- Does every major section deliver a payoff, and does that answer lead into a
  natural next question where appropriate? Does the final payoff answer the hook?
- Are technical ideas shown before being named where possible? Does every
  sentence advance explanation, create useful curiosity or pay off a question?
- Can the main causal explanation be understood with sound off through objects,
  relationships, state changes and consequences, without written narration?

### Timing, continuity and sustained motion

- Do important actions happen around the spoken phrases that give them meaning?
  Inspect the actual event with narration, not merely the cue file's timestamps.
- Does motion show cause before effect, including the receiving object's response?
- Do persistent objects carry related ideas and retain identity across cuts?
- Do significant actions use anticipation, momentum, reaction, follow-through
  and settling where useful, without mechanically requiring every phase?
- Is visual energy varied, with meaningful peaks throughout and readable pauses,
  rather than constant movement or an opening peak followed by repetitive slides?
- Does every scene sustain useful visual progression across its full narration,
  including the ending interval, rather than one entrance and a static hold?
  Record actual inactive windows and their comprehension purpose; more movement
  must not silently shorten narration or runtime.

### Background and text performance

- Is the backdrop designed and animated under `DESIGN.md` and `MOTION.md`, rather
  than an untouched solid color? Inspect supporting detail, motion extrema and
  cuts at phone size: it must add depth/context without competing with the hero,
  implying false events, or hiding values. Record reasons for static intervals.
- Do necessary labels/values perform around meaningful narration cues, then
  settle for reading? Check safe bounds, intact glyphs/values and sparse copy
  during movement; playful text must not become animated captions.

### Treatment, performance and factual boundaries

- Which effects, transitions or camera moves can be removed without losing meaning?
- Does the sequence feel like directed motion graphics, with visible mechanisms,
  rather than an animated slide presentation dominated by entrances and labels?
- Does the sequence use the visual treatments in `MOTION.md` according to the
  ideas, rather than defaulting every scene to connected nodes and moving dots?
- Do expressive poses, playful reactions, transformations or visual surprises
  make discoveries and payoffs engaging throughout? Check actual anticipation,
  action and settling at phone size; a named recipe is not evidence of execution.
- Do playful metaphors preserve technical causality, counts, scope and exact
  values? Can the viewer distinguish a presentation gag from a literal mechanism?

### Depth and composited handoffs

- For performances and depth, do travel, whole-body deformation and delayed
  parts behave coherently while labels stay rigid? Do lift/landing shadows and
  layer occlusion preserve the intended material and retained/copy relationship?
- For composited handoffs, inspect both endpoints and the middle: do the carried
  identity and geometry match, does a wipe cover the scene change, and does the
  incoming mask cover the outgoing state before it disappears? Are there
  duplicate heroes, exposed cuts or labels moving before they can be read?

The [flow-motion example checks](examples/flow-motion/README.md#verification)
demonstrate these inspections. Reuse the check intent and appropriate sample
times on the target project's compiled preview; passing the silent example's
browser test does not validate that project's narration, storyboard or gates.

### Review priorities and constraints

Prioritize viewer retention, clarity and comprehension, story progression,
motion quality, visual continuity, narration-to-motion synchronization, then
production consistency. Technical accuracy, required coverage and approval gates
remain constraints. Every line, animation, transition, camera move and visual
change must serve the explanation or viewer attention; impressive effects alone
do not pass review. Structural checks do not establish these creative qualities.

## Motion craft evidence at both gates

### Evidence status

Use the storyboard's existing action rows and motion craft review field. Mark
each applicable dimension **pass**, **fix** or **uninspected**, with a concrete
reason; use **not applicable** only for a technique the scene does not use.
Do not average failures into an overall score. This is part of the two existing
gates, not a new approval or a claim about any model's creative performance.

| Dimension | Gate 1: planned evidence | Gate 2: actual evidence / fix trigger |
| --- | --- | --- |
| Visual progression | Starting, decisive and resulting key poses show a mechanism; action rows cover the whole narration | Watch each full scene, including its tail. Record unexplained inactive windows. A drifting background behind an unchanged diagram does not pass. |
| Composition and attention | The decisive pose has one readable hero; travel/reaction space and shot changes are planned | View at 360×640. Record any instant when the target is ambiguous, cropped, occluded or overwhelmed by supporting motion. |
| Weight and overlap | Chosen material, anticipation and dependent reaction are visible in the pose plan | Watch onset through settle at normal speed; sample contact and follow-through. Fix robotic same-speed motion, unrelated simultaneous peaks and parts that react before contact. |
| Narration synchronization | Each significant cue says onset, contact/decision or resolved pose; estimated timing is identified | Play the actual WAV with the preview. Compare the visible event to its phrase and record any offset that changes meaning. Cue validity alone cannot pass this row. |
| Depth and transformation | Layer order, rigid values and a useful intermediate pose are sketched | Inspect morph/reveal midpoints, occlusion and camera extrema. Fix doubled shapes, unreadable values, flat layers moving as one slab, or scale changes that imply false quantities. |
| Continuity and rhythm | Neighboring scenes vary meaningfully; handoff poses and its covered middle are shown where needed | Watch across the boundary. Fix duplicate heroes, exposed switches, position/velocity jumps, repeated resets and successive identical reveal patterns unless comparison requires them. |

### Planned versus actual evidence

At Gate 1 a pass means the plan visibly specifies the action, not that motion
has been verified. No animated implementation is required before Gate 1.
At Gate 2 retain measured sample times and evidence paths, but also record the
playback interval inspected: stills establish poses, not natural timing or
continuous motion. If playback or listening is unavailable, keep the relevant
dimension uninspected and report it before the handoff.

### Craft inspection

For the research-backed craft principles in `MOTION.md`, use those same rows:
check whether the decisive pose reads at normal speed, whether equal time steps
show the intended acceleration/spacing, and whether leading and trailing parts
express the planned material. Inspect the designed breakdown for silhouette and
clearance.

Across a cut, follow the outgoing focal point into the next action;
flag a transition that makes different entities look identical or alternatives
look sequential. Record observed reference intervals separately from source-text
claims; studying a reference is not evidence that the new scene succeeds.

### Inactive windows and changed previews

Review gaps between meaningful events against the narration. If another idea
is being explained while the foreground merely idles, add a causal step,
comparison or motivated reveal. If the same result needs reading, keep the
hold and record its purpose.

Do not impose a change-every-N-seconds quota. Resolve fixes before the complete-preview approval request. Recheck changed
beats and neighboring cuts, then review the complete sequence; a revised preview
requires renewed Gate 2 approval. Existing approved projects are not migrated
or reapproved merely because this authoring guide changed.

## Text-minimization review at both gates

At Gate 1 inspect every proposed visible text element in the script and actual-
icon sketches. At Gate 2 inspect every actual visible text element across the
complete preview, including temporary words and mid-motion states. Apply
`DESIGN.md`'s text contract. For each element ask:

- Could the viewer understand this through objects and animation instead?
  If yes, remove it.
- Is it repeating the narrator? If yes, remove it unless the exact word or value
  is necessary to identify the object, state or technical detail.
- If needed, can it be a 1–3 word label? Does an exact technical value need
  reading time? Has a temporary word finished its purpose and left the stage?

### Flag and resolve text issues

Flag transcript duplication, sentence-length explanations, unnecessary headings,
static scene or chapter numbers, explanatory cards, redundant labels and
permanently visible titles. Reject fixed header areas, repeated top bars and
decorative navigation UI. Record each removal or justified retained element in
the storyboard's text-necessity cells and text-review notes, with preview times
and evidence at Gate 2. Resolve all flags before handing off for approval.
Reviewing copy alone does not establish that the animation teaches the mechanism.

## Final preview and render

### Gate 2 approval

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

### Export verification

Inspect a frame from the exported MP4. Report dimensions, frame rate, codecs,
duration and decode evidence separately from local checks. Do not commit, push,
publish or deploy unless requested.

## Optional temporal motion blur

### Capture behavior and timing

Keep ordinary HyperFrames preview for fast development. After renewed Gate 2
approval, `scripts/motion_capture.mjs` captures the actual compiled local
HyperFrames preview (not raw source HTML), seeks four temporal samples per
frame across a centered 180-degree shutter and blends equal exposures in
linear light.

Output defaults to 30 fps; pass `--fps` for a different video. Studio's seek rounds to frame boundaries, so the capture driver pauses Studio
and seeks its compiled scene timelines and host visibility at exact subframe
times. This path supports the channel assembler's simple scene/audio host.

Hard-cut sample windows clamp to their own scene, avoiding cross-scene ghosts. `--mode preview` uses one sample; `--mode production` defaults to four with
`--samples` and `--shutter` configurable. This is pixel integration, not CSS blur.

```powershell
npx hyperframes preview videos/<project> --background --no-open --port 3028
node scripts/motion_capture.mjs --project videos/<project> --url http://localhost:3028/api/projects/<project>/preview --mode production --output videos/<project>/renders/<project>-motion-v1.mp4
```

### Dependencies and export limits

The script reuses installed HyperFrames dependencies (puppeteer-core and sharp),
requires Chrome and FFmpeg, checks render-stage approval, keeps per-scene WAVs
in their canonical sequence, refuses to overwrite an output and records capture
settings/browser version. Keep that browser version for reproducibility.
The current capture path targets HTML/SVG with narration; ordinary HyperFrames
render remains the general media/HDR/export path. MP4 mux/decode and listening
still need verification after approval; successful still captures do not prove them.

### Before-approval stills

Before approval, capture representative production-blurred stills only:

```powershell
node scripts/motion_capture.mjs --project videos/<project> --url http://localhost:3028/api/projects/<project>/preview --mode production --stills <comma-separated-global-seconds> --output videos/<project>/review/motion-blur
```

Replace placeholders with the target project and its own measured storyboard
sample times; do not reuse another video's timings.

### Comparison and capture cost

Use matching times in preview mode to compare sharp and integrated samples.
The renderer writes incrementally and uses constant memory per frame; four
browser captures per output frame cost more time than a normal render.
