# HyperFrames v3 — Complete Overhaul Plan

Repository: [Oceaneyes123/hyperframes-channel](https://github.com/Oceaneyes123/hyperframes-channel?utm_source=chatgpt.com) · Reviewed October 21, 2026

## 1. Current repository status

I checked the latest `master` branch, including commit [`24cf2ad`](https://github.com/Oceaneyes123/hyperframes-channel/commit/24cf2ad1e00422b99ad60566a9c1960220f779bb?utm_source=chatgpt.com), pushed today.

An important finding is that v2 already contains some of the improvements we discussed, but the problems you're experiencing suggest the output quality still isn't where you want it.

| Component          | Current implementation             | V3 decision                                       |
| ------------------ | ---------------------------------- | ------------------------------------------------- |
| Scriptwriting      | `storytelling-hooks` + `humanizer` | Redesign the writing and editorial review process |
| Visual design      | Anthropic `frontend-design`        | Reuse skills, improve visual direction            |
| Motion planning    | LottieFiles `motion-design`        | Redesign shot planning and transitions            |
| Rendering          | OneTake                            | Evaluate whether it remains the right engine      |
| Voiceover          | Supertonic channel voice           | Reuse                                             |
| Storyboarding      | Markdown, HTML boards, screenshots | Build interactive review UI                       |
| Approval workflow  | Gate 1 and Gate 2                  | Keep, integrate into UI                           |
| Reference analysis | Already integrated                 | Strengthen video-based evaluation                 |
| Publishing         | Separate `video-workflow/`         | Reuse and connect to v3                           |
| Analytics feedback | Local implementation exists        | Integrate after core production works             |

The latest repository also contains a `video-workflow/` implementation for YouTube packaging, uploading, scheduling, and analytics. Its documentation records successful local tests, but live channel validation is still pending.

### Main conclusion

V3 should not be another collection of prompt improvements.

I recommend building it as a proper video production studio, with a production engine, creative review tools, and a user interface connected to the same project data.

The overhaul should address three problems together:

1. Scripts that sound artificial even after humanization.
2. Animation that feels mechanically assembled rather than professionally directed.
3. Lack of an easy way to inspect and correct creative decisions before expensive rendering.

## 2. Scriptwriting overhaul — highest priority

Your latest `SCRIPT_GUIDE.md` already includes payoff-first planning, five hook candidates, humanization, and narrative checks. The issue is that these rules are not sufficient to guarantee a good script.

For v3, I would change the Scriptwriter from a single draft-and-rewrite process into a research → writing → editorial selection process.

### GitHub skills worth using

I researched the following skills and how they would fit your AI + Finance Shorts.

| GitHub skill                                                                                                                | Strength                                                                        | V3 recommendation                   |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| [storytelling-hooks](https://github.com/yaxeen/storytelling-skills?utm_source=chatgpt.com)                                  | Connecting story, curiosity, and resolution                                     | Retain for initial storytelling     |
| [humanizer](https://github.com/blader/humanizer?utm_source=chatgpt.com)                                                     | Detecting generic AI language and rewriting unnatural prose                     | Retain for refinement               |
| [copy-editing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/copy-editing?utm_source=chatgpt.com)       | Separate editorial passes for clarity, voice, proof, specificity, and concision | Add as the editorial review method  |
| [video-hook-writer](https://github.com/SkillMedev/creator-studio/tree/main/skills/video-hook-writer?utm_source=chatgpt.com) | Short-form spoken and visual hooks                                              | Evaluate in a controlled comparison |

`copy-editing` uses focused editing passes rather than one broad rewrite. `video-hook-writer` specializes in the first few seconds of Shorts, but its hook formulas may become repetitive if applied mechanically.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

+2



I would not make every skill mandatory. Skills should earn their place by improving scripts in side-by-side tests.

### Proposed v3 script pipeline

1\. Research & payoff

Find the concrete example, factual evidence, viewer problem, and specific ending worth delivering.

2\. Hook development

Generate genuinely different hooks based on that payoff, not random curiosity templates.

3\. Full script

Write the hook, setup, useful development, and earned payoff as one connected story.

4\. Humanizer

Remove artificial language without removing facts, examples, or personality.

5\. Independent editorial review — new

Challenge the hook, reject generic writing, check that every sentence matters, and send weak scripts back for revision.

6\. User script review

Inspect the complete script in the UI, compare hook options, make edits, and approve the version.

### Features to implement

A. Payoff-first planning

Before writing, define the exact ending, evidence needed to earn it, and what viewers should understand or be able to do. The final video still starts with the hook.

B. Hook comparison

Display three to five meaningfully different hooks in the UI, with their opening visual, spoken line, and payoff connection. Reject misleading hooks before comparing style.

C. Anti-slop editorial review

Check generic statements, invented urgency, repetitive language, artificial reversals, weak examples, empty steps, and motivational filler. More importantly, reject entire script structures when the central idea is weak. A humanizer pass cannot repair an uninteresting premise by changing words.

D. Channel voice profile

Support a reusable editorial profile: conversational English, concrete examples, restrained humor, no unsupported financial claims, no forced CTA, and no generic motivational ending. Allow approved example scripts to guide style without copying them.

E. Script versioning and selective regeneration

Keep drafts and compare changes. Let the user regenerate just a weak hook, setup, paragraph, or ending without losing the good parts.

F. Independent quality gate

Separate the writer and editor responsibilities. A script should not be accepted merely because all skill checklists ran. The review must identify specific weak lines and explain why they fail.

Acceptance criteria: Compare v2 and v3 scripts on the same five or more briefs, including actual AI + Finance topics. Use blinded human preferences, factual checks, hook–payoff alignment, and natural read-aloud quality. Do not claim that an AI-generated score proves human-sounding writing.

## 3. Animation overhaul — hybrid cinematography

This is the biggest architectural change.

The current v2 renderer is built around OneTake, whose core creative philosophy is a continuous film with each beat growing from the previous one. That explains the strong emphasis on object carry, continuity measurements, and uninterrupted camera movement.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



For v3, I recommend a shot-based composition system that supports both continuous motion and intentional cuts.

### How the two should work together

EXAMPLE: VOICE NOTES → BUSINESS NEWSLETTERS

Voice note

Shot 1

Transcript

Shot 2

Newsletter

Shot 3

Continuous transformation

1 → 2

Intentional cut

2 → 3

The waveform becomes transcript text in a continuous transformation. Then the film cuts to a new newsletter composition when the story moves to a different visual idea.

### Transition types

| Type                      | When to use                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| Hard cut                  | A meaningful change in location, action, viewpoint, or idea       |
| Match cut                 | Similar shapes or objects link different shots                    |
| Continuous transformation | One visible object changes into its next meaningful state         |
| Camera transition         | The camera follows, pushes into, or reveals connected information |
| Wipe / reveal             | The reveal itself helps explain a comparison or changed state     |
| Split screen              | Simultaneous comparisons, such as manual versus AI-assisted work  |
| Motion-matched cut        | Movement continues across a shot boundary                         |

No forced percentage of cuts versus continuous scenes. The story determines the choice.

### Additional animation features

- A visual shot list with shot duration, camera framing, subject, action, and transition type.
- Reusable motion patterns for kinetic text, animated interfaces, financial charts, diagrams, object morphs, and data flows.
- Layered foreground, subject, and background compositions with consistent depth.
- Better rhythm through different shot sizes, movement speeds, holds, and pauses.
- Real-time preview and frame-by-frame checking of shot boundaries.
- Shot-level regeneration and correction without remaking the entire film.
- Quality review that checks the whole transition interval, not just screenshots before and after.

### Rendering engine decision

I would no longer require v3 to use OneTake.

[Remotion](https://www.remotion.dev?utm_source=chatgpt.com) — leading candidate

Supports multi-scene timelines, hard cuts, transitions, and React-based preview components. Its Player can embed directly into your planned UI.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.remotion.dev\&sz=32)

Remotion

+1



Recommended to prototype

[Motion Canvas](https://motioncanvas.io?utm_source=chatgpt.com) — strong alternative

Suitable for code-driven 2D motion graphics, with built-in and custom scene transitions. Worth testing for more detailed diagram choreography.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



[OneTake](https://github.com/feitangyuan/onetake?utm_source=chatgpt.com) — reference and possible retained component

Keep lessons from its motion design and validation approach, but don't make its continuous-film model a v3 requirement.

There's also a licensing reason to evaluate the engine now: OneTake's repository states that its PolyForm Noncommercial license does not allow commercial use. Remotion has a free tier that includes eligible individuals using it commercially, subject to its current terms.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

+1



My proposed direction: prototype v3 with Remotion, compare it against Motion Canvas on the same mixed-cut animation test, then commit to a renderer. This choice should be settled before building the full production UI.

## 4. V3 production studio — new UI

I recommend a local web application with a clean, dark interface inspired by professional video production tools.

The UI should give you visibility and control over what the agents are creating.

### Proposed interface

HyperFrames Studio

V3 concept

Project: AI Newsletter Service

Stage: Storyboard Review

Script editor

HOOK · 0:00–0:05

A business owner records a 30-second voice note. Could that become a newsletter someone pays you to write?

SETUP · 0:05–0:12

The owner has ideas for customers, but no time to turn them into regular emails.

CORE VALUE

Turn the recording into text, check the facts, then edit it into an email...

Storyboard viewer

Voice note recording

Shot 01 · Opening

Visual timeline

0:00–1:15

01 · Opening

Carry

02 · Transcribe

Cut

03 · Edit

Cut

04 · Deliver

Carry

Conceptual UI layout, not an implemented screen.

### UI modules

| Module          | Features                                                 | Priority |
| --------------- | -------------------------------------------------------- | -------- |
| Projects        | Create, resume, duplicate, and organize videos           | P0       |
| Research        | Sources, facts, references, intended payoff              | P0       |
| Script Editor   | View/edit narration, compare hooks, see changes, approve | P0       |
| Visual Concepts | Compare three design concepts with actual images         | P0       |
| Storyboard      | Shot cards, screenshots, visual sequences, notes         | P0       |
| Timeline        | Cuts, continuous transitions, durations, shot order      | P0       |
| Preview Player  | Scrubbing, playback, frame inspection, phone-size view   | P0       |
| Agent Activity  | Current task, progress, errors, reviewer findings        | P1       |
| Assets          | SVGs, icons, images, fonts, audio, licenses              | P1       |
| Render Queue    | Preview/final rendering, progress, errors, verification  | P1       |
| Publishing      | Titles, thumbnails, YouTube upload, analytics            | P2       |

### Essential interactions

The user should be able to click any script line and see the matching storyboard shot, select a shot to view its screenshots, and inspect the transition connecting it to the next shot.

A particularly useful feature would be "Revise selected shot", where the agent changes only that visual section while preserving approved narration and unrelated scenes.

Editing a script or visual plan should create a revision and invalidate only the approvals and downstream assets affected by that change. This is important for avoiding unnecessary regeneration.

## 5. Proposed v3 architecture

HyperFrames Studio — Next.js / React

Scripts · Concepts · Storyboards · Timeline · Preview · Review

V3 Workflow Orchestrator

Stage state · Agent delegation · Artifacts · Revisions · Approvals

Research + Writing

Facts, payoff, script, editorial review

Creative Direction

Art, storyboards, shots, motion

Production

Voice, preview, rendering

Quality Control

Visual, technical, and editorial audits

Shared Production Data

SQLite metadata + versioned JSON manifests + asset files

Existing YouTube Publishing Workflow

Packaging · Authorized upload · Scheduling · Analytics

### Recommended technical stack

| Layer                | Technology                                                   |
| -------------------- | ------------------------------------------------------------ |
| UI                   | Next.js, TypeScript, Tailwind CSS                            |
| Animation engine     | Remotion candidate, pending benchmark                        |
| Video preview        | Remotion Player if selected                                  |
| Orchestration        | Existing agent delegation approach with persistent job state |
| Database             | SQLite                                                       |
| Production metadata  | Validated, versioned JSON schemas                            |
| Media storage        | Local filesystem                                             |
| Voice                | Existing Supertonic implementation                           |
| Rendering / encoding | Renderer-native tooling + FFmpeg                             |
| Testing              | Unit, integration, browser E2E, and video-output checks      |

For the UI, SQLite can hold project states, notes, approvals, and job history, while the original scripts, images, storyboards, and media remain in organized project folders.

Avoid storing the same editable data independently in Markdown, JSON, and the database without a defined source of truth.

### New project organization

```
hyperframes-channel/
├── 2d-animation/          # Preserve v1
├── 2d-animation-v2/       # Preserve v2
├── 2d-animation-v3/
│   ├── app/               # Production studio UI
│   ├── workflow/          # Orchestration and agents
│   ├── engine/            # Shots, transitions, renderer
│   ├── skills/            # Integration manifests/adapters
│   ├── templates/
│   ├── tests/
│   └── videos/
│       └── <project>/
│           ├── research/
│           ├── scripts/
│           ├── concepts/
│           ├── storyboard/
│           ├── shots/
│           ├── audio/
│           ├── preview/
│           ├── review/
│           └── output/
├── video-workflow/        # Existing publishing layer
└── ...
```

Use this as a logical structure, not a requirement to create empty directories. Preserve v1 and v2 as reference implementations.

## 6. Proposed development roadmap

Implementation milestones

Estimated effort · one experienced developer with AI agents

0Phase 0 — Architecture and benchmark3–5 days

- Freeze and document the v2 baseline
- Create v3 architecture and artifact schemas
- Evaluate scripting skills and licenses
- Compare Remotion and Motion Canvas using one mixed-shot prototype

Exit criteria: Renderer selected, benchmark evidence recorded, architecture approved.

1Phase 1 — New scriptwriting system5–8 days

2Phase 2 — Creative studio UI7–12 days

3Phase 3 — Hybrid animation system8–14 days

4Phase 4 — Production quality5–8 days

5Phase 5 — Publishing integration3–5 days

Total rough estimate: 31–52 working days. This is a planning estimate, not a commitment; the renderer comparison and UI scope will influence the schedule.

## 7. What should be in the first usable V3 release?

I would avoid attempting everything at once. The first useful milestone should support this process:

1. Enter a topic and generate a researched, editable script with hook options.
2. Review the script in the UI and approve it.
3. Generate three distinct visual concepts and select one.
4. Generate a shot-based storyboard with screenshots and specified transitions.
5. Review the storyboard in the browser and request targeted revisions.
6. Generate a preview containing both continuous animation and intentional cuts.
7. Review the video, approve it, and render the final output.

The first release does not need a full nonlinear video editor, cloud collaboration, automatic publishing, or advanced analytics dashboards.

### Quality gates I would enforce

| Area       | Must pass before proceeding                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| Script     | Hook and payoff genuinely match; no unsupported claims; human editorial acceptance        |
| Storyboard | Every shot has a teaching purpose and a defined relationship to neighboring shots         |
| Animation  | Real movement and transitions reviewed at normal speed, including cuts and object carries |
| Audio      | Narration checked for intelligibility, pacing, and synchronization                        |
| UI         | Artifact previews match their saved versions; edits and approvals persist after reload    |
| Render     | Export matches the approved timeline and passes frame/audio verification                  |

The preliminary motion audit in your repository, `motion-audits/hyperframes-channel-2d-animation-v2-2026-10-19.html`, could not complete its playback review because the reviewer could not access the preview tab. This highlights another v3 requirement: previews should have stable, reproducible project URLs, and an inaccessible preview must be treated as a blocked review rather than a pass.

## 8. Final direction

Build V3 independently. Preserve working v2 projects, voice assets, research practices, and proven validation logic.

Fix storytelling at the source. Use better research, payoff-driven hook selection, real examples, and independent editorial rejection—not just another language cleanup pass.

Make cinematography shot-based. Support hard cuts, match cuts, and continuous transformations within the same film.

Make the UI the main creative control center. Agents produce versioned artifacts; you inspect and approve them before expensive downstream work.

The most important early decision is the renderer prototype. It affects the shot model, preview player, storyboard-to-animation pipeline, licensing, and the studio UI.

Once that is resolved, I would build the scriptwriting and storyboard review experience before tackling full production rendering. This directly addresses the two quality problems you've encountered, while making every later video easier to inspect and improve.