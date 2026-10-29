# Motion principles for the retention experiment

The user supplied two skill repositories on October 29, 2026 instead of reference clips. This replaces the clip-dependent part of Phase 1. It does not establish measured reference rhythm or prove that any technique improves retention. The experiment remains in V3 at 1080 × 1920, 30 fps. Existing accepted artifacts remain unchanged.

## Sources and transfer

| Inspected source | Adopt in V3 | Implementation ownership |
| --- | --- | --- |
| [Whaley motion skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) and [lib.ts](https://github.com/whaleyxbt/claude-motion/blob/main/src/lib.ts) | Persistent objects change role; transitions follow the mechanism; one focal action; let text settle before reading. Use restrained physical motion where meaning supports it. | Current Remotion/GSAP presets, continuity anchors and reading holds. |
| [Whaley review skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/review-loop/SKILL.md) | Inspect frame zero, each important beat, transition strips and phone-size frames. A contact sheet supplements normal-speed review. | Existing creative review; controlled pair and contact sheet in Phase 6. |
| [Whaley sound skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/sound-design/SKILL.md), [synth.py](https://github.com/whaleyxbt/claude-motion/blob/main/sfx/synth.py), and [SFX CLI](https://github.com/whaleyxbt/claude-motion/blob/main/sfx/__main__.py) | Seeded local synthesis and a common visual/audio cue timeline are useful. Its executable Python cue import must not cross V3's model boundary. | Declarative, validated cues and opt-in local audio in Phase 5. |
| [Howseen motion skill](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/SKILL.md) | Describe timed visual states, layers and sound before implementation. Carry a shared object across scenes. Review the weakest moments by timestamp and preserve comprehension. | Beat-sheet metadata and six trusted authored scenes are implemented; human quality acceptance remains pending. |
| [Howseen render template](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/scripts/render_template.py) | Pure seek functions, transition-frame inspection, cut-aware sampling and loop seam checks are useful techniques. | Existing deterministic renderer owns export; no second renderer or blur implementation added. |
| [Howseen audio template](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/scripts/audio_template.py) | Place a sound's measured peak at the intended visual impact and measure loudness after mixing. | Phase 5; example music/times are not copied. |

These are inspected source-code capabilities, not executed or validated integrations. No repository was installed, no external scripts ran, and no third-party source code or media was copied. Both [Whaley](https://github.com/whaleyxbt/claude-motion/blob/main/LICENSE) and [Howseen](https://github.com/howseen-ai/claude-motion-design/blob/main/LICENSE) carry MIT code licenses. Preserve their notices if code is incorporated later. Media rights are separate. Remotion commercial eligibility remains undecided here.

## Project-specific decisions

- Keep meaningful holds. Constant drift, decorative texture and arbitrary cuts do not satisfy a teaching event.
- Keep narration and measured timing authoritative. Musical timing can support them; it cannot silently change speech speed or word timing.
- No audience-facing provenance labels. Introduce invented examples naturally in narration, preserve source notes and uncertainty, and never imply real evidence.
- No subagents, external credentials, unlicensed media, paid dependencies, new render pipeline or automatic approval. Prefer existing registered assets and components.
- A style can alternate light/dark surfaces when the mechanism benefits. Do not blindly impose either repository's palette, aspect ratio, spring constants, 60 fps, or mandatory decoration.

## Experimental profile and comparison

[motion-principles-profile.json](motion-principles-profile.json) separates null empirical measurements from explicit review hypotheses. The 45-frame inactivity limit, 40% primary-preset share and two root text elements per shot are test settings, not source-measured or validated thresholds. The 15-second candidate still has the user's stricter one-text-element objective. A longer reading hold or repeated visual may be justified; findings require review.

Run from V3:

```powershell
node scripts/rhythm-compare.ts docs/motion-principles-profile.json videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/motion/370b9586-071f-4c52-a1a2-298a59f671c1.json output/terra-intense-10s-example/motion.json
```

The comparison reports diagnostic evidence and limitations. It cannot measure retention, camera quality, loudness or human comprehension from a JSON plan. Keep Phase 0 reports as the immutable baseline; save new comparison output separately.

## Completed implementation and review state

The user authorized continuation after the Phase 2 stop point. Phases 3–6 are now
implemented and the authorized local review pair is delivered. Phase numbers in
the source-transfer table identify ownership, not outstanding approval requests.
The third-party repositories themselves were inspected, not installed or executed;
V3 implementations are independently authored adaptations of compatible principles.

- [Style bible](motion-style-bible.md): six authored scenes, the existing character
  kit, 46 registered assets and individual local SVGs with recorded provenance.
- [Beat sheets](beat-sheet.md): validated planning metadata connected to writing,
  visuals and motion. The spoken-line/TTS contract remains unchanged.
- [Alignment and audio](local-alignment-and-audio.md): offline exact-transcript
  alignment evidence, seeded synthesis, ducking, loudness measurement and opt-in
  mixed-audio bindings. Cue envelopes align to visual frames; individual waveform
  peaks are not independently aligned. No third-party music or hardcoded example
  timings were copied.
- [Delivery report](../output/retention-experiment/REPORT.md): both 15-second MP4s,
  exact-frame contact sheet, side-by-side diagnostics, verification and limitations.

Final software checks passed 196 tests plus lint/typecheck. The default build still
fails with the known Turbopack CSS-worker error. Human phone viewing, listening,
preference and retention remain unverified. Empirical reference-profile fields stay
null because no reference clips were measured. No production gates or publication
are inferred from implementation or automated checks.
