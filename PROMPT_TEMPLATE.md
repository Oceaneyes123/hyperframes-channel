# Repeatable visual explainer prompt

Replace `[TOPIC]`, then optionally fill the other bracketed inputs. Each optional
placeholder includes a default; leaving it unchanged asks the agent to choose
that default. Paste only the prompt block into a new task in this repository.
Authoritative references control quality; no previous video project is required.

## Copy this prompt

```text
Create a polished narrated explainer for YouTube Shorts and Facebook/Instagram
Reels in this HyperFrames repository. Completeness takes priority over runtime.
Do not truncate, split into a series or omit required information for a platform
limit; report compatibility separately for my decision.

### Inputs

- Topic: [TOPIC]
- Audience: beginners with no prior knowledge
- Single takeaway: [TAKEAWAY, or choose the most useful beginner takeaway]
- Process scope: [STARTING EVENT, ENDING RESULT AND IMPORTANT CONDITIONS, or derive from the topic]
- Language: English
- Duration: no fixed limit; cover all required information at a natural pace
- Source material: research authoritative sources if none are supplied
- Required information: [LIST REQUIRED POINTS, or derive a complete coverage checklist from the topic and source material]
- Motion personality: [DESIRED FEEL, or playful illustrated motion graphics with readable causal actions]
- Visual reference: [OPTIONAL FILE/URL AND SPECIFIC TRAITS TO ADAPT, or use the local flow-motion examples]
- Exclude: tangents, unexplained jargon, promotional intro/outro
- Captions: off
- Sound effects: off
- Background music: off
- Project folder: videos/[PROJECT_SLUG, or choose a descriptive new slug]

### References and creative direction

Read AGENTS.md for phase routing. SCRIPT_GUIDE.md owns narrative structure,
curiosity, tone and sentence quality. DESIGN.md owns visual identity. MOTION.md
owns attention beats, lifecycle, continuity, camera and rhythm. Use
channel/CHANNEL_RECIPE.md and channel/templates/ for production and artifacts;
BUILD.md and VERIFY.md own build and checks. Consult channel/MOTION_API.md for
shared motion and measured cue contracts. channel/EXPLAINER_REFERENCE.md is an
optional narrative example. For motion planning and implementation, read
channel/MOTION_LIBRARY.md and the relevant sections of
examples/flow-motion/README.md; inspect examples/flow-motion/index.html for
the chosen choreography. The examples demonstrate object performance,
cutaways, assembly, a cache hit, complete handoffs and layered depth. They are
silent authoring references with illustrative timing and metaphor boundaries,
not a finished process to copy. If a visual reference is supplied, inspect it
and state which traits fit the channel's owners. No particular model or prior
published video is required.

Apply the narrative progression in SCRIPT_GUIDE.md flexibly. Plan words and
visuals together; give each scene meaningful attention beats using the storyboard
template. Apply motion direction from MOTION.md and review against VERIFY.md.
Follow DESIGN.md's text-necessity contract: narration explains, motion
demonstrates, and text identifies only what the visual cannot clarify quickly.
Plan a visual mechanism unfolding through persistent objects and consequences.
Use the permanent references and topic-specific research/assets as the quality
source. Do not require a previously published video's MP4, composition or
project as a prerequisite; the permanent local authoring examples are separate.
Follow MOTION.md's playful direction and DESIGN.md's artwork contract; choose
behaviors and handoffs that explain this process. Do not copy the examples'
eight-second slots, four-scene sequence or effect count as a video formula.
Preserve the pipeline, design system and source ownership. Preserve unrelated
files and existing videos. Do not commit, push or publish.

### Workflow: two approval gates

#### Phase 1: Plan and sketch

- Record the selected inputs and scope in BRIEF.md. Create FACTS.md and frame.md
  under their owner contracts; use the existing templates for SCRIPT.md,
  STORYBOARD.md and ICON_PLAN.json, plus channel/templates/channel.json for
  new design-v2 motion opt-in. Fact-check claims and assumptions; map every
  required point to script and scenes. Extend runtime instead of rushing or omitting.
- Keep narration separate from display copy. Retain SCRIPT.md headings “## Line N”
  and STORYBOARD.md headings “## Frame N”, with one narration passage per scene.
  A scene may contain multiple meaningful attention beats.
- Use the storyboard table to connect each beat's narration, visual meaning,
  primary action, text necessity, semantic cue and resolved understanding.
- Fill viewer question, payoff, persistent object, causal action, attention beats,
  narration cues, consequence, comprehension pause, next question and energy.
  Record estimated local windows in the single storyboard action table.
- Fill the storyboard's example reference, object performance, depth/layer plan
  and transition handoff fields where relevant. Identify what the example
  contributes, what must change for factual accuracy, and the inherited poses.
- Resolve exact local assets and attribution before sketching. Use frame.md for
  persistent geometry. Build one inspectable board with every scene and actual
  production icons, then review it at phone size against DESIGN.md.
- Complete VERIFY.md's text-minimization review before the Gate 1 handoff.
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
- Adapt selected example sequences to measured cues and the approved assets;
  use BUILD.md's shared-artwork staging and channel/MOTION_API.md's runtime
  contract. channel/templates/frame.html is a legacy diagram example, not
  the default choreography for new motion-v1 scenes.
- Run the required preview checks in VERIFY.md. Inspect each attention beat,
  important motion lifecycle, camera extrema and adjacent cut; test backward
  and random-order seeks, including the middle of composited handoffs. Use
  VERIFY.md's performance, occlusion and shadow review. Record evidence in
  storyboard rows. Fix failures.
- Review the complete preview at phone size, sound off and with narration where
  available. Apply VERIFY.md's final quality questions. Report unavailable
  listening or visual evidence honestly; metadata does not prove listening.
  Complete the Gate 2 text-minimization review against actual visible copy.
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
- Process scope: one cacheable resource from first miss to a later fresh-cache hit
- Motion personality: playful packet acting and a heavier cache drawer; calm holds after results
- Visual reference: local flow-motion cache-hit and packet-cutaway examples; adapt the acting and layer order, not the demo's four-scene story
- Exclude: HTTP header syntax and CDN architecture
```

## Replies for the two gates

After reviewing the script and sketches:

> I approve the script and sketches. Build all scenes with measured narration,
> validate them, and open the final preview. Do not render yet.

After reviewing the complete final preview:

> I approve this final preview. Render the MP4 and verify the exported file.
