# HyperFrames narrated explainers

This repository's channel contract is split by owner. Read `DESIGN.md` for every
video. Then load only the phase guides that apply; do not load the generic
`faceless-explainer` or `general-video` workflow for a channel composition.

| Phase | Read | Skip by default |
| --- | --- | --- |
| Design critique | `DESIGN.md` and selected frames | workflow guides |
| Planning | `channel/CHANNEL_RECIPE.md`, `DESIGN.md`, `channel/EXPLAINER_REFERENCE.md` | — |
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
checks, evidence and rendering. `channel/EXPLAINER_REFERENCE.md` is the short-
form script and worked-example reference; use it when planning a new narrated
short, and skip it in unrelated phases.

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

## Narration style

Write original, fast-paced, curiosity-driven educational narration. Keep any
influence at the level of broad storytelling qualities; do not imitate ZAC D
films or any other creator's recognizable voice, wording, catchphrases, jokes
or scripts.
Start immediately with a strong hook, question, surprising fact or familiar
situation. Skip greetings, branding, slow setup and filler. Keep sentences
short, natural, conversational and easy to say. Explain one idea at a time,
prefer active voice and use contractions naturally. Use concrete examples;
show the idea visually before naming a technical term.

Build a cause-and-effect chain and reveal it progressively. Leave small,
answerable information gaps when the next visual can resolve them; use a natural
transition when it helps. Every spoken line must match something visible
happening. Keep one narration beat per scene, while allowing several short
sentences in that beat when one continuous visual action supports them. Design
words and visuals together: if a line cannot be shown with the existing
icon-first language (primarily colored Icons8 assets, with Font Awesome for
supporting symbols), rewrite it. End by paying off the opening hook; skip a
generic conclusion unless it adds a useful final idea. Stay technically correct
and cover all required information; achieve pace with concise wording, not
rushed delivery or omissions. Use the hook-to-payoff pattern in
`channel/EXPLAINER_REFERENCE.md` when it fits.

## CodeGraph

When `.codegraph/` exists at the repo root, use CodeGraph before grep, find or
reading files to locate code. Prefer the `codegraph_explore` MCP tool; when it
is unavailable, use `codegraph explore "<question>"`. If the directory is
absent, skip CodeGraph.

Adapt the reference's causal teaching pattern; never copy its narration,
approval records, or generated output into a new project. Existing v1 videos
remain on the frozen legacy design until explicitly redesigned.
