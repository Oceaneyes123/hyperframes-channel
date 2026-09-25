# HyperFrames Channel Improvement Plan

Status: the local three-scene pilot is ready for review. Target scenes and adjacent cuts have captured evidence. Broader rollout remains pending approval; rendering, commit, push, and deployment are out of scope.

## Goals

- Make explainers feel modern, cinematic, and visually authored rather than generated from one diagram template.
- Increase meaningful motion while preserving sound-off causal clarity.
- Reduce instruction and project-context tokens per video.
- Keep the existing technical strengths: local assets, semantic colors, persistent object identity, measured narration, and two approval gates.

## Current problems

- NAT and NPS scenes reuse nearly the same topology, title position, device placement, and bordered-panel treatment.
- Scene changes rely heavily on opacity reveals, glows, straight token travel, and hard cuts.
- Static frames have limited depth: background, diagram, labels, and packets share one plane.
- Mixed stock-style icons and small technical labels weaken hierarchy at phone size.
- `AGENTS.md`, `DESIGN.md`, `CHANNEL_RECIPE.md`, and `EXPLAINER_REFERENCE.md` repeat workflow, portrait, icon, timing, and review guidance. Loading all four costs roughly 12k–13k tokens before project files or skills.

## Design direction

Use a cinematic technical-editorial language:

- Keep the dark navy foundation and semantic colors, but add localized radial light, restrained grain, coordinate marks, and route traces for depth.
- Use asymmetric, edge-anchored compositions. Let a primary device become large enough to own the frame; do not reserve a title panel in every scene.
- Use one coherent colored technical icon family with shared perspective, lighting, and state variants. Primary devices should normally be 320–420px when the scene allows.
- Use a display grotesk such as Geist or Space Grotesk with IBM Plex Mono for addresses, ports, and protocol values. Keep display copy short and let narration carry detail.
- Use enclosure boundaries only when they teach a subnet, trust zone, table, or policy. Do not wrap every scene in a decorative card.

## Motion direction

Every scene gets one primary motion verb derived from its lesson:

- discovery: radiates
- routing: pushes or follows
- translation: snaps and rewrites
- lookup: scans and locks
- rejection: hits resistance and recoils
- return path: retraces
- recap: assembles

Structure each scene as:

1. Build — establish the situation.
2. Breathe — hold comprehension with one restrained ambient motion.
3. Resolve — show a physical consequence, not only a new label.

Vary entrances, timing, easing, camera scale, and direction. Use transforms and opacity for motion-safe animation. Keep all motion on the seekable HyperFrames timeline.

## Scene archetypes

Reuse primitives, not complete layouts. Do not use the same archetype more than twice consecutively.

1. Hero hook — oversized object and kinetic question.
2. Journey — camera or packet follows a spatial route.
3. Transformation — before/after values morph around one persistent object.
4. Decision machine — scan, compare, reject, or lock onto a row.
5. Contrast — asymmetric local/remote or allowed/blocked split.
6. Constellation recap — concepts assemble around one takeaway.

## Transition grammar

- Hard cut: new concept, contradiction, or intentional interruption.
- Match cut: the same device, packet, or value persists across scenes.
- Directional push or whip: the process continues in the same spatial direction.
- One iris, zoom, or shader transition: reserve for a major conceptual reveal.

Transitions should support meaning, not decorate every cut.

## Context and token architecture

`AGENTS.md` should become a router and contain only cross-cutting constraints plus a phase table. It should target roughly 600–800 tokens.

| Task phase | Load | Do not load by default |
|---|---|---|
| Design critique | `DESIGN.md` plus selected frames | workflow and render guides |
| Planning | `CHANNEL_RECIPE.md` and `DESIGN.md` | worked reference |
| Storyboard/sketch | `DESIGN.md` and `MOTION.md` | build and troubleshooting guides |
| TTS/timing | `BUILD.md` audio section and `SCRIPT.md` | full storyboard |
| One frame | `DESIGN.md`, `MOTION.md`, and one scene packet | full project and full skills |
| Assembly | `BUILD.md` assembly section | visual reference |
| Validation/preview | `VERIFY.md` and target project state | full recipe |
| Render | `VERIFY.md` render section and recorded approval | all planning documents |
| Failure diagnosis | only the matching troubleshooting section | unrelated guides |

Give each rule one owner:

- `DESIGN.md`: palette, typography, iconography, layout identity, safe zone.
- `CHANNEL_RECIPE.md`: phases, gates, handoffs, and source-of-truth files.
- `MOTION.md`: archetypes, rhythm, motion verbs, transitions, and animation constraints.
- `BUILD.md`: TTS, measured audio, frame assembly, and project commands.
- `VERIFY.md`: checks, snapshots, sound-off review, approval, and rendering.
- `EXPLAINER_REFERENCE.md`: optional worked example only; never default context.

Do not duplicate these rules in `AGENTS.md`.

## Scene packets

Frame workers should receive only a compact packet containing:

- scene objective and narration line
- measured duration and local beat times
- selected archetype and motion verb
- required objects, local asset paths, and object counts
- opening state and resolved state
- connection endpoints and expected consequence
- relevant design tokens and transition

Keep `SCRIPT.md` as the narration source, `audio_meta.json` as the timing source, `STORYBOARD.md` as the scene-intent source, `ICON_PLAN.json` as the asset source, and the design guide as the visual source. Extract one `## Frame N` section when a worker needs a storyboard scene; do not pass the entire board.

## Efficient production loop

1. Capture facts once in `FACTS.md`.
2. Write script and display copy once.
3. Create the timed storyboard and approve it with icon-first sketches.
4. Generate and measure per-scene narration immediately after approval.
5. Build one difficult causal scene with real assets and measured timing.
6. Reuse the validated implementation primitives through scene archetypes.
7. Batch visual inspection at opening, action, result, and adjacent cuts.
8. Fix all confirmed defects in one pass, then run checks and a final preview.
9. Render only after explicit final-preview approval.

Avoid re-researching facts, concatenating narration, hand-estimating durations, or rereading full guides after the relevant phase is complete.

## Review criteria

- At phone size, the opening, action, and consequence are legible without sound.
- Every promised verb has a named object, visible state change, and inspected time.
- Persistent devices keep their identity and coordinates across adjacent scenes.
- Moving tokens touch real endpoints and do not teleport between cuts.
- Each scene has a dominant focal point, a secondary focal point, and intentional depth.
- Motion varies enough that the sequence does not feel like repeated fades on one board.
- Technical labels remain readable without competing with the main action.
- Structural checks, visual review, audio review, and render evidence remain separate claims.

## First implementation experiment

Before changing a whole video, prototype three scenes:

1. NAT opening — hero hook.
2. NAT source rewrite — transformation.
3. NPS verdict — decision machine.

Use those scenes to approve the new visual language and motion grammar before propagating it.
