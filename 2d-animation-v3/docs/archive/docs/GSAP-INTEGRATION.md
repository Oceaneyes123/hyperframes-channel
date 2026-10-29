# GSAP integration plan for HyperFrames v3

Repository: [hyperframes-channel](https://github.com/Oceaneyes123/hyperframes-channel?utm_source=chatgpt.com) · Latest checked commit: [3b2c71d](https://github.com/Oceaneyes123/hyperframes-channel/commit/3b2c71d08bce5764c7766a9d55c93cbd86ed64a7?utm_source=chatgpt.com) · October 22, 2026

## 1. Current repository status

V3 is already substantially beyond the initial setup stage. The latest repository includes:

- A Next.js studio with project pages, script editing/review, and a visual-planning workspace.
- Backend code for AI gateway requests, writing jobs, persistent project data, and revision storage.
- Remotion and Motion Canvas renderer benchmarks.
- Architecture, renderer-decision, and validation documents.
- Automated tests for the studio, scriptwriting, revisions, and visual planning.

This changes my recommendation: GSAP should be integrated into the existing v3 architecture, not introduced through another overhaul or a separate animation system.

### What is implemented versus missing

| Area                  | Current state                                                                              | GSAP integration impact                     |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Renderer              | Remotion 4.0.537 selected, tested in isolation                                             | Use as the foundation                       |
| GSAP                  | Not installed in v3                                                                        | Add as an optional shot-animation engine    |
| Storyboard            | Generates shot descriptions, estimated durations, start/end drawings, and transition types | Extend with motion instructions             |
| Visual review UI      | Can view concepts, select shots, request AI revisions, and accept boards                   | Add motion previews and revision controls   |
| Live video preview    | Not yet integrated with the Studio                                                         | Build using Remotion Player                 |
| Rendering             | Tested only in isolated benchmarks                                                         | Production integration still required       |
| Voice synchronization | Not implemented in v3                                                                      | Integrate after reliable frame-based motion |

Your current [`workflow/visuals.ts`](https://github.com/Oceaneyes123/hyperframes-channel/blob/master/2d-animation-v3/workflow/visuals.ts?utm_source=chatgpt.com) already supports `hard-cut`, `match-cut`, `continuous`, `camera`, `reveal`, `split-screen`, and `motion-match`.

Keep that model. The missing piece is translating these descriptions into reliable, editable animations.

## 2. Recommended architecture

HyperFrames v3 Studio

Script → Storyboard → Shot review → Motion preview

Motion Planning Layer

Accepted shot specifications, animation instructions, timing and transitions

Remotion

Shots, timeline, cuts, transitions, frame clock

GSAP

Object motion, choreography, staggered reveals, easing

Official @remotion/gsap integration

GSAP timelines synchronized to Remotion frames

Unified Player / Renderer

Seekable preview → user approval → verified export

### Important finding: Remotion has an official GSAP integration

The new [`@remotion/gsap`](https://www.remotion.dev/docs/gsap?utm_source=chatgpt.com) package provides `useGsapTimeline()`.

This is preferable to creating our own synchronization adapter. It constructs a paused GSAP timeline and makes Remotion's current frame control its position, supporting predictable preview, scrubbing, and rendering.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.remotion.dev\&sz=32)

Remotion

+1



One current limitation: the official adapter does not yet support GSAP plugins. Therefore, don't build the first version around MorphSVG, MotionPath, or ScrollTrigger. Start with GSAP's core timelines and DOM/SVG property animations.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.remotion.dev\&sz=32)

Remotion



## 3. Implementation roadmap

Five implementation phases

Phase 1 — Isolated GSAP integration

First

Extend `benchmarks/remotion/`, not the production application.

- Install `gsap` and `@remotion/gsap@4.0.537`, maintaining exact Remotion package version alignment.
- Reuse the existing 12-second benchmark with a continuous transformation, hard cut, and match cut.
- Replace selected in-shot animations with GSAP timelines.
- Verify nonsequential seeking, repeated rendering, motion smoothness, and performance.

Exit criterion: Deterministic Remotion + GSAP preview and export with no unexplained visual differences.

Phase 2 — Animation specification

Extend the existing storyboard system with a separately versioned motion specification.

Each shot should describe the moving subjects, starting and ending states, animation type, easing, timing, camera behavior, and transition to the next shot.

Crucially, keep the current model-output boundary safe: AI should generate validated animation instructions, not arbitrary executable JavaScript.

Use a small library of supported movements initially, such as entrances, staggers, transformations, camera moves, and holds.

Exit criterion: Accepted storyboard shots can be converted into deterministic motion specifications without changing the script or other shots.

Phase 3 — Animation engine and mixed transitions

Implement shot components that use GSAP when complex choreography is required and native Remotion animation for simpler cases.

Use Remotion's `Sequence` and `TransitionSeries` for shot organization, intentional cuts, and transitions. Keep continuous transformations within connected scenes or across explicitly shared visual anchors.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.remotion.dev\&sz=32)

Remotion



Avoid creating a new animation for every spoken line. Let a single scene support multiple narration beats when the visual idea remains connected.

Exit criterion: One composition demonstrates a natural mixture of hard cuts, match cuts, continuous movement, camera motion, and deliberate pauses.

Phase 4 — Studio UI and agent integration

Embed Remotion Player in the existing visual-planning workspace.

Support shot selection, timeline scrubbing, boundary inspection, and original-versus-revised preview comparison.

Connect the existing CLIProxyAPI request flow to motion revisions:

Select shot → prompt AI → generate proposed motion specification → preview → accept/reject.

Approved changes should invalidate affected downstream previews without unnecessarily regenerating unrelated shots.

Exit criterion: A motion change requested through the UI returns an inspectable, versioned proposal that requires explicit acceptance.

Phase 5 — Production validation

Add actual narration timing, transition-window checks, independent motion review, guarded render jobs, and export verification.

Verify synchronization, mobile readability, frame determinism, no flashing or blank frames at cuts, stable camera framing, and complete audio.

Formal Gate 1 and Gate 2 approval must be implemented separately; storyboard acceptance alone must not authorize rendering.

Exit criterion: An approved motion plan produces a matching, synchronized, independently reviewed output.

## 4. How this affects your AI workflow

The biggest improvement would be giving the animation agent a motion vocabulary rather than asking it to invent arbitrary GSAP code every time.

For example, the agent could select between these behaviors:

| Motion behavior                                    | Engine responsibility                                           |
| -------------------------------------------------- | --------------------------------------------------------------- |
| Text enters with staggered timing                  | GSAP                                                            |
| Voice waveform transforms into transcript elements | GSAP choreography                                               |
| Cut to a completely different location             | Remotion                                                        |
| Camera reveals a related object                    | GSAP or Remotion, depending on implementation                   |
| Two shots overlap with a wipe or crossfade         | Remotion transitions                                            |
| Animated financial chart                           | Frame-derived React drawing, optionally GSAP for DOM/SVG motion |
| Static reading hold                                | Remotion timeline, no unnecessary animation                     |

This also allows the UI to provide controls such as animation speed, easing, and shot timing without directly editing source code.

### Two engineering rules I would enforce

1\. Remotion owns time. GSAP must not independently play, restart, use wall-clock timers, or trigger event callbacks during rendering. The official adapter enforces these restrictions. Its docs also warn that very large timelines can increase per-frame work.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.remotion.dev\&sz=32)

Remotion



2\. Agent output remains controlled. Your current backend safely accepts structured JSON rather than model-generated executable code. Keep that separation for motion editing. A trusted renderer should interpret allow-listed motion specifications; arbitrary code generation, if eventually needed, should run through a separately secured development workflow.

## 5. Files I would update

| Existing or new location                     | Change                                                               |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `docs/architecture.md`                       | Document Remotion + GSAP responsibilities                            |
| `docs/next-steps.md`                         | Add the GSAP benchmark and integration phases                        |
| `task_plan.md`, `findings.md`, `progress.md` | Track implementation using `planning-with-files`                     |
| `benchmarks/remotion/`                       | Implement the isolated integration test                              |
| `workflow/visuals.ts`                        | Preserve storyboard contracts; introduce versioned motion data       |
| `engine/` (new, when needed)                 | Shot renderer, GSAP components, transition orchestration             |
| `app/projects/[id]/visuals/`                 | Add Player, timeline, and motion review                              |
| `tests/`                                     | Determinism, schema, scoped revisions, stale approvals, player tests |