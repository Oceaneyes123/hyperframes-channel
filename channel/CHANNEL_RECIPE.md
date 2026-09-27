# Channel production recipe

This file owns the production phases, handoffs and approval gates. Load the
phase guide from `AGENTS.md`; do not read every guide for every task.

## Source of truth

`FACTS.md` holds sourced claims and assumptions. `SCRIPT.md` owns spoken lines
and display copy. `STORYBOARD.md` maps each narration beat to one scene and
contains measured action beats. `audio_meta.json` owns scene starts and WAV
durations. `ICON_PLAN.json` names the exact local assets. `frame.md` owns
persistent object IDs, bounds and route attachments.

## Phases and gates

1. **Plan:** capture facts once; map every required point to the script and
   scenes. Read `DESIGN.md` and `MOTION.md` for visual decisions.
2. **Gate 1:** review the combined script and timed storyboard with sketches
   that use the planned production icons. Approve them together.
3. **Measure:** after approval, normalize and synthesize one final WAV per
   scene, then use its measured timing as the canonical storyboard timeline.
4. **Build:** implement against the approved scene packet and persistent
   geometry. See `BUILD.md` for audio and assembly contracts.
5. **Gate 2:** inspect the complete preview against `VERIFY.md`; ask for explicit
   approval before rendering.

No fixed runtime or scene count: extend the video to cover required information
at a natural pace. “Continue,” “next step,” and “do remaining” advance to the
next defined gate. Progress updates are not gates. Ask only when a choice would
materially change the result.

## Script style

For short explainers, start with a curiosity hook or familiar situation and
move directly into the question or problem. Keep narration conversational,
active, concise and easy to say. Build one idea at a time with concrete
examples, visible cause and effect, and progressive reveals. Introduce a
technical term after its meaning is clear on screen. Use a transition or small
information gap only when the next action answers it. Remove setup and filler;
make every spoken line describe or clarify visible action. Keep one narration
beat per scene, with multiple short sentences allowed when they accompany one
continuous visual action. Resolve the hook in a clear payoff, without a generic
outro unless it adds something useful.

Design the words and icons together. Rewrite any line that cannot be clearly
shown with the existing icon-first language: primarily colored Icons8 assets,
with Font Awesome for supporting symbols. Keep explanations understandable to
people without an IT background and technically accurate. Use concise wording
for pace; preserve required information and extend runtime rather than rush or
omit it. Aim for these broad storytelling qualities without imitating any
creator's recognizable voice, wording or expressions.

When it fits, shape the short as Hook → Setup → Problem / Question → Flow →
Twist / Important Detail → Payoff. Follow the object, request or data through
the system and let each reveal set up the next visual.

## Scene packet

Give a frame worker only: objective and narration line; measured duration and
local beat times; archetype and motion verb; named objects, local asset paths
and counts; opening and resolved states; route endpoints and visible
consequence; relevant design tokens and transition. Extract only that
`## Frame N` section from the storyboard.

Read `channel/EXPLAINER_REFERENCE.md` when planning a new narrated short. Apply
its style guidance without copying worked-example narration, approval records
or generated output into a new project.
