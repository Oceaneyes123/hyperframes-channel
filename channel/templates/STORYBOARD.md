---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Timed storyboard

Use one `## Frame N` section per `SCRIPT.md` `## Line N`. See
`channel/EXPLAINER_REFERENCE.md` for the approved example and acceptance checks.

## Frame 1 — Hook
- duration: 6s
- src: compositions/frames/line-1.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: (copy this scene's narration exactly from SCRIPT.md)
- Planned window: 0.0–6.0s; replace with measured window after TTS.
- Narration reference: `SCRIPT.md#Line 1`
- Timing source: estimate for planning; after synthesis use `audio_meta.json` `start_s` and `duration_s`.
- Learning objective:
- Dominant visual:
- Icon assets:
- Required objects and counts: (e.g. 2 laptops, 1 switch, 1 packet; retain these in the built scene)
- Text shown: (≤6-word headline; labels 1–4 words; ~16 words total)
- Scene archetype: (from `MOTION.md`; do not repeat more than twice in a row)
- Primary motion verb: (the physical action the scene teaches)
- Accent geometry: (highlight boxes are sized from the measured text box — a 12-character mono-32
  value is 230.4px wide — and wrap the whole value they mark, never a slice of it)
- Animation:
- Beginning state: (the previous scene's ending state — anything already established, such as a table
  row, a revealed value or a translated address, is visible at local time 0; only the scene that
  creates a value may hide it)
- Ending state:
- Transition:
- Transition grammar: (hard cut, match cut, directional push, or major-reveal transition; state why)
- Continuity: (which objects keep their position/identity into the next scene)
- Geometry source: (`frame.md` object IDs, asset paths, bounds and route endpoints;
  inherit the prior scene's ending state instead of independently placing devices)
- Complexity: 1 idea · 1 action · 2–5 objects

| Local time (estimated) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0–1s | | Show the situation immediately; name the objects and initial states | pending | not inspected |
| 1–3s | | Name the moving/comparing object, source, route and destination | pending | not inspected |
| 3–5s | | Name the receiving object and the visible consequence there | pending | not inspected |
| 5–6s | | Hold the result briefly / name the state inherited by the next scene | pending | not inspected |

- Intentional hold over 3s: none (otherwise state why the viewer needs it).
- Sound-off check: (what should a viewer understand without narration?)
- Review samples: opening, main action, resolved state (replace with measured local times after TTS).
- Adjacent-cut review: (prior scene end → this opening; actual inspected times,
  object positions/state, evidence path and pass/fix; first scene: not applicable).

These are action beats inside one scene, not extra narration tracks. Retiming
after TTS updates this table; do not maintain a second beat plan. Entrances,
idle pulses, and decorative movement do not count as explanatory action.
Fill selectors during implementation and evidence only after viewing the output.
Use scene-local times above; record global capture times as scene start + local
time. Add rows for additional promised actions rather than hiding them in prose.
Cover the full measured duration, including the interval after the last animation.
Every row must pass before final-preview handoff; uninspected is not a pass.
