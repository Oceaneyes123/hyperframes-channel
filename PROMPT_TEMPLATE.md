# Repeatable visual explainer prompt

Replace `[TOPIC]` below, optionally edit the other inputs, then paste the entire
prompt block into a new task in this repository. Defaults are ready to use.
This template works with any model; the review checks still determine quality.

## Copy this prompt

```text
Create a polished, highly visual narrated explainer for YouTube Shorts and
Facebook/Instagram Reels in this HyperFrames repository.

INPUTS
- Topic: [TOPIC]
- Audience: beginners with no prior knowledge
- Single takeaway: choose the most useful beginner takeaway from the topic
- Language: English
- Duration: approximately 45–60 seconds, normally 6–10 scenes
- Source material: research authoritative sources if none are supplied
- Must include: only what is necessary to explain the takeaway accurately
- Exclude: tangents, jargon without explanation, promotional intro/outro
- Captions: off
- Sound effects: off
- Background music: off
- Project folder: choose a descriptive new slug under videos/

REFERENCE AND PREPARATION
Read AGENTS.md, DESIGN.md, channel/CHANNEL_RECIPE.md and
channel/EXPLAINER_REFERENCE.md. Use the relevant HyperFrames skills.
Inspect videos/local-or-router-short/local-or-router-short.mp4 as the approved
quality reference, plus its frame.md, storyboard and the one or two source
frames most relevant to this topic. If video inspection is unavailable, inspect
representative frames and say what you actually verified.

Reuse the reference's visual clarity, scale, continuity and causal animation.
Adapt its structure to this topic rather than copying its networking story.
Do not copy approval records, narration audio, generated index or output video
into the new project. Preserve unrelated files. Do not commit, push or publish.

CREATIVE REQUIREMENTS
1. Teach one clear mental model. Fact-check once and retain concise sources and
   assumptions in FACTS.md. Defer secondary concepts rather than rushing speech.
2. Hook the viewer with a concrete question or visible problem within 1–2 seconds.
   Show the main objects immediately; no logo intro or empty-canvas fade-in.
3. Make the explanation understandable with sound off. Use real objects, routes,
   comparisons and state changes. Narration adds meaning; it does not compensate
   for missing visual explanation.
4. Use large local icons and sparse text: native 1080x1920 at 30 fps, important
   content inside x72..936/y180..1600, 2–5 meaningful objects per scene, primary
   icons around 240–300px or larger where appropriate, headline at most 6 words,
   labels 1–4 words and about 16 visible words. Follow DESIGN.md for colors and
   spacing. Keep technical values readable and connectors clear of labels.
5. Make motion explain cause and effect: move an object through a process,
   highlight a decision, change one condition, then show the resulting outcome.
   Entrances and decorative pulses are not explanatory action. Flag unexplained
   static holds over 3 seconds. Do not add constant motion just to look busy.
6. Preserve object identity, semantic colors and positions across adjacent scenes.
   End each scene in a state that the next scene can inherit. Finish by visually
   reinforcing the takeaway, without introducing another concept.

WORKFLOW — TWO APPROVAL GATES
Phase 1: Plan and sketch.
- Create BRIEF.md, FACTS.md, SCRIPT.md, STORYBOARD.md, ICON_PLAN.json and frame.md
  using the repository templates and reference guide.
- Keep spoken narration separate from display copy. Use one narration beat per
  scene, SCRIPT.md headings “## Line N” and STORYBOARD.md headings “## Frame N”.
- Define each scene's starting state, causal action, ending state, required
  objects, spoken cues, estimated local-time beats and continuity into the next.
- Resolve production assets locally with attribution before drawing the sketches.
- Build one inspectable board containing every scene with the actual icons.
  Verify one real icon first, then review the whole board at phone size.
- Present the script and sketches together and wait for my approval. Do not
  synthesize final narration or build animated frames before this gate.

Phase 2: Build the complete preview after approval.
- Dry-run narration normalization, inspect pronunciation, then generate one
  Supertonic 3 WAV per scene. Use audio_meta.json as the canonical timing source.
- Replace estimated timings and retime the existing storyboard action beats
  before building animation. Do not concatenate WAVs or estimate final durations.
- Build every scene against the approved visual contract and measured duration.
  Use seekable paused GSAP timelines, explicit root dimensions, local assets and
  stable scene-specific IDs. Keep audio and the shared local runtime in the parent.
- Assemble using scripts/assemble_project.py, following the reference guide.
  Fix source files or canonical metadata rather than patching generated HTML.
- Run repository preview validation and the actual HyperFrames check. Stop and
  fix failed checks before proceeding. Inspect opening/action/result samples
  and at least one visible midpoint per scene; compare with approved sketches.
- Play the complete preview with sound off and on where available. Check phone
  readability, causal motion, scene continuity and narration alignment. Do not
  claim to have listened when only audio metadata was checked.
- Open the working final-preview URL, summarize duration and verification, and
  wait for my explicit approval to render. Complete all scenes and checks before
  this gate; do not stop after each scene to ask permission to continue.

Phase 3: Render only after final-preview approval.
- Record my actual approval, pass render-stage validation, and render the MP4.
- Independently verify dimensions, frame rate, video/audio streams and duration
  with ffprobe; run a full decode check and inspect a frame from the actual MP4.
- Deliver the playable video using its absolute local path, plus a brief summary
  of verified properties and any unresolved limitation. Update project status.

WORKING STYLE
Ask only questions whose answers materially change the result. If the topic is
broad, propose a focused takeaway at the first approval gate. Choose routine
details yourself using the reference. Keep progress updates short. Investigate
warnings rather than silently ignoring them. Never claim a check passed without
evidence, and never infer render approval from passing tests.

Begin with the facts, script and actual-icon storyboard for approval.
```

## Optional input example

Replace the corresponding input lines with:

```text
- Topic: Why a second visit to a website can load faster
- Single takeaway: a cached copy can avoid repeating the same fetch
- Must include: first request, saved copy, repeat request, visible faster return
- Exclude: cache invalidation details, HTTP header syntax, CDN architecture
```

## Replies for the two gates

After reviewing the script and sketches:

> I approve the script and sketches. Build all scenes with measured narration,
> validate them, and open the final preview. Do not render yet.

After reviewing the complete final preview:

> I approve this final preview. Render the MP4 and verify the exported file.
