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
- Animation:
- Beginning state:
- Ending state:
- Transition:
- Continuity: (which objects keep their position/identity into the next scene)
- Complexity: 1 idea · 1 action · 2–5 objects

| Local time (estimated) | Spoken cue | Visible action / changed state |
| --- | --- | --- |
| 0–1s | | Show the situation immediately; no empty-canvas intro |
| 1–3s | | Move, compare, divide, or route the main object |
| 3–5s | | Show the consequence at the destination |
| 5–6s | | Hold the result briefly / carry it into the next scene |

- Intentional hold over 3s: none (otherwise state why the viewer needs it).
- Sound-off check: (what should a viewer understand without narration?)
- Review samples: opening, main action, resolved state (replace with measured local times after TTS).

These are action beats inside one scene, not extra narration tracks. Retiming
after TTS updates this table; do not maintain a second beat plan. Entrances,
idle pulses, and decorative movement do not count as explanatory action.
