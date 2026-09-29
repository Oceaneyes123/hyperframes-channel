---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Timed storyboard

Use one `## Frame N` section per `SCRIPT.md` `## Line N`. A scene may contain
multiple attention beats; it remains one narration track. `MOTION.md` owns beat
and motion direction; `VERIFY.md` owns acceptance checks. Repeat this section
for each scene; use only the phases and beats its explanation needs.

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
- Viewer question: (what the viewer currently wants to understand)
- Scene payoff: (what this scene answers)
- Persistent object: (`frame.md` ID and state carried into or through this scene)
- Primary causal action: (what causes the result, not an entrance effect)
- Visible consequence: (which object reacts and what changes)
- Comprehension pause: (where and why the result needs reading time, or none)
- Next question: (what naturally leads into the next scene, or final payoff)
- Energy level: (low, medium or high; explain its place in the sequence)
- Dominant visual:
- Icon assets:
- Required objects and counts: (e.g. 2 laptops, 1 switch, 1 packet; retain these in the built scene)
- Text shown: (≤6-word headline; labels 1–4 words; ~16 words total)
- Scene archetype: (from `MOTION.md`; justify repetition when continuity needs it)
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
- Complexity: 1 idea · 1 dominant causal sequence · 2–5 objects; multiple attention beats as needed

### Attention beats and narration cues

Plan setup → anticipation → action → consequence → settle → next question
where useful. Add, combine or omit rows based on meaning, never a fixed interval.
Important motion uses the lifecycle in `MOTION.md`; describe reaction and
follow-through only where they help. This table is the single action beat plan.

| Local window (estimated; measured after TTS) | Attention beat / phase | Narration cue (phrase; named cue if needed) | Named objects and causal state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- | --- |
| start–… | Setup | | Show the situation immediately; identify objects and initial states | pending | not inspected |
| …–… | Anticipation / action | | Identify preparation, moving/comparing object, source, route and destination | pending | not inspected |
| …–… | Consequence / follow-through | | Identify arrival, receiving object's reaction and visible result | pending | not inspected |
| …–end | Settle / next question | | Hold the readable result and name the state inherited by the next scene | pending | not inspected |

- Timing and cue source: (estimate before TTS; after TTS, `audio_meta.json` plus
  measured named cues in `motion_beats.json` when used; see `channel/MOTION_API.md`)
- Intentional holds: (purpose and local window, or none; no long unexplained inactivity)
- Sound-off check: (what should a viewer understand without narration?)
- Review samples: opening, main action, resolved state (replace with measured local times after TTS).
- Adjacent-cut review: (prior scene end → this opening; actual inspected times,
  object positions/state, evidence path and pass/fix; first scene: not applicable).

These are attention beats inside one scene, not extra narration tracks. Retiming
after TTS updates this table; do not maintain a second beat plan. Entrances,
idle pulses, and decorative movement do not count as explanatory action.
Fill selectors during implementation and evidence only after viewing the output.
Use scene-local times above; record global capture times as scene start + local
time. Add rows for additional promised actions rather than hiding them in prose.
Cover the full measured duration, including the interval after the last animation.
Every row must pass before final-preview handoff; uninspected is not a pass.
