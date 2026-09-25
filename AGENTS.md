# HyperFrames narrated explainers

This repository's channel contract is split by owner. Read `DESIGN.md` for every
video. Then load only the phase guides that apply; do not load the generic
`faceless-explainer` or `general-video` workflow for a channel composition.

| Phase | Read | Skip by default |
| --- | --- | --- |
| Design critique | `DESIGN.md` and selected frames | workflow guides |
| Planning | `channel/CHANNEL_RECIPE.md`, `DESIGN.md` | worked example |
| Storyboard and sketches | `DESIGN.md`, `MOTION.md` | build and verify guides |
| TTS and timing | `BUILD.md` audio section, `SCRIPT.md` | full storyboard |
| One frame | `DESIGN.md`, `MOTION.md`, its scene packet | full project |
| Assembly | `BUILD.md` assembly section | visual example |
| Checks and preview | `VERIFY.md` and target project state | full recipe |
| Render | `VERIFY.md` render section and saved approval | planning docs |
| Failure | only the matching troubleshooting section | unrelated guides |

`DESIGN.md` owns visual identity and layout. `MOTION.md` owns scene rhythm
and transitions. `channel/CHANNEL_RECIPE.md` owns phases, handoffs and approval
gates. `BUILD.md` owns audio, frame assembly and commands. `VERIFY.md` owns
checks, evidence and rendering. `channel/EXPLAINER_REFERENCE.md` is an optional
worked example; do not load it by default.

Keep the source of truth singular: `FACTS.md` for sourced claims, `SCRIPT.md`
for spoken lines, `audio_meta.json` for measured timing, `STORYBOARD.md` for
scene intent and review evidence, `ICON_PLAN.json` for exact local assets, and
`frame.md` for persistent geometry. Give frame workers only one scene packet,
the needed design tokens and measured timings.

Preserve two approval gates: combined script and timed storyboard with actual-
icon sketches, then the complete preview before rendering. “Continue,” “next
step,” and “do remaining” advance to the next gate. A passing check is not
approval to render. Keep local edits uncommitted and preserve unrelated work.
Never commit or push unless the user explicitly asks. Do not shorten required
content to match the duration of a reference video; extend runtime as needed.

## CodeGraph

When `.codegraph/` exists at the repo root, use CodeGraph before grep, find or
reading files to locate code. Prefer the `codegraph_explore` MCP tool; when it
is unavailable, use `codegraph explore "<question>"`. If the directory is
absent, skip CodeGraph.

Read `channel/EXPLAINER_REFERENCE.md` before planning a new narrated short.
Adapt its causal teaching pattern; never copy its narration, approval records,
or generated output into a new project. Existing v1 videos remain on the frozen
legacy design until explicitly redesigned.
