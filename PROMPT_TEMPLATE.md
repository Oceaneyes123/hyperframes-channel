# Repeatable visual explainer prompt

Replace `[TOPIC]`, optionally edit the inputs, then paste the prompt block into
a new task in this repository. Authoritative references control quality; no
previous video project is required.

## Copy this prompt

```text
Create a polished narrated explainer for YouTube Shorts and Facebook/Instagram
Reels in this HyperFrames repository. Completeness takes priority over runtime.
Do not truncate, split into a series or omit required information for a platform
limit; report compatibility separately for my decision.

### Inputs

- Topic: [TOPIC]
- Audience: beginners with no prior knowledge
- Single takeaway: choose the most useful beginner takeaway from the topic
- Language: English
- Duration: no fixed limit; cover all required information at a natural pace
- Source material: research authoritative sources if none are supplied
- Required information: [LIST REQUIRED POINTS, or derive a complete coverage checklist from the topic and source material]
- Exclude: tangents, unexplained jargon, promotional intro/outro
- Captions: off
- Sound effects: off
- Background music: off
- Project folder: choose a descriptive new slug under videos/

### References and creative direction

Read AGENTS.md for phase routing. SCRIPT_GUIDE.md owns narrative structure,
curiosity, tone and sentence quality. DESIGN.md owns visual identity. MOTION.md
owns attention beats, lifecycle, continuity, camera and rhythm. Use
channel/CHANNEL_RECIPE.md and channel/templates/ for production and artifacts;
BUILD.md and VERIFY.md own build and checks. Consult channel/MOTION_API.md for
shared motion and measured cue contracts. channel/EXPLAINER_REFERENCE.md is an
optional generic example, not a required prior project.

Apply the narrative progression in SCRIPT_GUIDE.md flexibly. Plan words and
visuals together; give each scene meaningful attention beats using the storyboard
template. Apply motion direction from MOTION.md and review against VERIFY.md.
Use the permanent references and topic-specific research/assets as the quality
source. Do not require inspection of a previous MP4, composition or project.
Preserve the pipeline, design system and source ownership. Preserve unrelated
files and existing videos. Do not commit, push or publish.

### Workflow: two approval gates

#### Phase 1: Plan and sketch

- Create BRIEF.md, FACTS.md, SCRIPT.md, STORYBOARD.md, ICON_PLAN.json and frame.md
  using the repository templates. Fact-check claims and assumptions; map every
  required point to script and scenes. Extend runtime instead of rushing or omitting.
- Keep narration separate from display copy. Retain SCRIPT.md headings “## Line N”
  and STORYBOARD.md headings “## Frame N”, with one narration passage per scene.
  A scene may contain multiple meaningful attention beats.
- Fill viewer question, payoff, persistent object, causal action, attention beats,
  narration cues, consequence, comprehension pause, next question and energy.
  Record estimated local windows in the single storyboard action table.
- Resolve exact local assets and attribution before sketching. Use frame.md for
  persistent geometry. Build one inspectable board with every scene and actual
  production icons, then review it at phone size against DESIGN.md.
- Present the script and sketches together. Wait for my Gate 1 approval before
  final narration synthesis or animated frame implementation.

#### Phase 2: Build the complete preview after approval

- Follow BUILD.md for narration: dry-run normalization, inspect pronunciation,
  generate one WAV per scene, and use audio_meta.json for measured timing.
- Retime the same storyboard rows. Measure important phrase cues from actual-WAV
  alignment or listening; record named events, hashes and provenance in
  motion_beats.json when used. Follow MOTION.md and channel/MOTION_API.md;
  check cue freshness and semantic synchronization, not every word.
- Build all scenes against the approved plan using the shared motion layer for
  new v2 scenes, seekable paused GSAP timelines and local assets. Inherit states
  at scene openings. Follow BUILD.md for assembly; fix sources or canonical
  metadata rather than patching generated HTML.
- Run the required preview checks in VERIFY.md. Inspect each attention beat,
  important motion lifecycle, camera extrema and adjacent cut; test backward
  and random-order seeks. Record evidence in storyboard rows. Fix failures.
- Review the complete preview at phone size, sound off and with narration where
  available. Apply VERIFY.md's final quality questions. Report unavailable
  listening or visual evidence honestly; metadata does not prove listening.
- Open the working complete-preview URL with duration, evidence and limitations.
  Wait for my explicit Gate 2 approval to render. Complete all scenes and checks
  before this gate; do not ask permission after each scene.

#### Phase 3: Render only after final-preview approval

- Record my actual approval and follow VERIFY.md's render-stage checks and export
  procedure. A revised preview needs renewed approval; passing checks is not approval.
- Verify the exported MP4's dimensions, frame rate, streams, duration, full decode
  and an actual exported frame as required by VERIFY.md.
- Deliver the playable video at its absolute local path, verified properties and
  any unresolved limitation. Update project status.

### Working style

Ask only questions whose answers materially change the result. Choose routine
details using the authoritative references. If the topic is broad, propose a
focused takeaway at Gate 1. Keep progress updates short. Investigate warnings
and never claim a check passed without evidence.

Begin with facts, script and actual-icon storyboard for approval.
```

## Optional input example

```text
- Topic: Why a second visit to a website can load faster
- Single takeaway: a fresh cached copy can avoid repeating a server fetch
- Required information: first request, saved copy, freshness condition, repeat request, local return
- Exclude: HTTP header syntax and CDN architecture
```

## Replies for the two gates

After reviewing the script and sketches:

> I approve the script and sketches. Build all scenes with measured narration,
> validate them, and open the final preview. Do not render yet.

After reviewing the complete final preview:

> I approve this final preview. Render the MP4 and verify the exported file.
