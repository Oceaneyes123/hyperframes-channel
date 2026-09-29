# HyperFrames narrated explainers

This repository's channel contract is split by owner. Read `DESIGN.md` for every
video. Then load only the phase guides that apply; do not load the generic
`faceless-explainer` or `general-video` workflow for a channel composition.

| Phase | Read | Skip by default |
| --- | --- | --- |
| Design critique | `DESIGN.md` and selected frames | workflow guides |
| Script writing | `SCRIPT_GUIDE.md`, `FACTS.md`, `channel/templates/SCRIPT.md` | build and verify guides |
| Planning | `channel/CHANNEL_RECIPE.md`, `SCRIPT_GUIDE.md`, `DESIGN.md`, `MOTION.md` | build and verify guides |
| Storyboard and sketches | `DESIGN.md`, `MOTION.md`, `channel/templates/STORYBOARD.md` | build and verify guides |
| Voice cloning | `VOICE_CLONE.md` | video workflow guides |
| TTS and timing | `BUILD.md` audio section, `SCRIPT.md` | full storyboard |
| One frame | `DESIGN.md`, `MOTION.md`, its scene packet | full project |
| Assembly | `BUILD.md` assembly section | visual example |
| Checks and preview | `VERIFY.md` and target project state | full recipe |
| Render | `VERIFY.md` render section and saved approval | planning docs |
| Failure | only the matching troubleshooting section | unrelated guides |

`SCRIPT_GUIDE.md` guides script writing; `SCRIPT.md` remains the source of
truth for the spoken lines. `DESIGN.md` owns visual identity and layout.
`MOTION.md` owns attention beats, motion direction, rhythm and continuity.
`channel/CHANNEL_RECIPE.md` owns phases, handoffs and approval gates.
`BUILD.md` owns audio, frame assembly
and commands. `VERIFY.md` owns checks, evidence and rendering.
`channel/EXPLAINER_REFERENCE.md` is an optional generic worked example. New
videos use permanent references, templates, workflow and topic-specific research
and assets; no previous video project or exported media is required.

Keep the source of truth singular: `FACTS.md` for sourced claims, `SCRIPT.md`
for spoken lines, `audio_meta.json` for measured timing, `STORYBOARD.md` for
scene intent and review evidence, `ICON_PLAN.json` for exact local assets, and
`frame.md` for persistent geometry. Give frame workers only one scene packet,
the needed design tokens and measured timings.

For new v2 motion, opt into the shared `channel/motion.js` layer via
`motion_version: 1.0.0`; see `channel/MOTION_API.md`. Optional motion_beats.json
owns audio-derived word cues and WAV fingerprints. Use pure drawing attached
to the paused GSAP timeline, explicit composition-scoped selectors and local
shared assets. Do not migrate old videos implicitly. Inspect mid-motion states
and backward seeks. A revised preview needs renewed Gate 2 approval; previous
render approval does not authorize a changed composition.

Preserve two approval gates: combined script and timed storyboard with actual-
icon sketches, then the complete preview before rendering. “Continue,” “next
step,” and “do remaining” advance to the next gate. A passing check is not
approval to render. Keep local edits uncommitted and preserve unrelated work.
Never commit or push unless the user explicitly asks. Do not shorten required
content to meet a runtime target; extend runtime as needed.

## Creative guidance routing

Use `SCRIPT_GUIDE.md` for narrative structure, curiosity, tone and sentence
quality. Use `MOTION.md` for attention beats, motion lifecycle and narration
cue intent; `channel/MOTION_API.md` owns measured cue schema and runtime API.
Use the storyboard template to record the plan and `VERIFY.md` for quality
review. Keep creative rules in their owners rather than duplicating them here.

## CodeGraph

When `.codegraph/` exists at the repo root, use CodeGraph before grep, find or
reading files to locate code. Prefer the `codegraph_explore` MCP tool; when it
is unavailable, use `codegraph explore "<question>"`. If the directory is
absent, skip CodeGraph.

Existing v1 videos remain on the frozen legacy design until explicitly
redesigned. Approval records apply only to the project and preview reviewed.
