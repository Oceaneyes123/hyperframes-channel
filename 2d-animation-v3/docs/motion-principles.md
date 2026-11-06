# Motion principles for the retention experiment

Historical experiment, loaded only for source/technique evidence. New V3 work follows the [quality bar](quality-bar.md): decisive causal action, varied typography and tactile environments, not mandatory experimental palettes/layouts/activity targets.

On October 29, 2026 the user supplied two skill repositories instead of clips, replacing clip-dependent Phase 1. No reference rhythm was measured or retention improvement proven. Experiment format: 1080×1920, 30fps; accepted artifacts remain unchanged.

## Sources and transfer

| Inspected source | Adopt in V3 | Implementation ownership |
| --- | --- | --- |
| [Whaley motion skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) and [lib.ts](https://github.com/whaleyxbt/claude-motion/blob/main/src/lib.ts) | Persistent objects change role; transitions follow the mechanism; one focal action; let text settle before reading. Use restrained physical motion where meaning supports it. | Current Remotion/GSAP presets, continuity anchors and reading holds. |
| [Whaley review skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/review-loop/SKILL.md) | Inspect frame zero, each important beat, transition strips and phone-size frames. A contact sheet supplements normal-speed review. | Existing creative review; controlled pair and contact sheet in Phase 6. |
| [Whaley sound skill](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/sound-design/SKILL.md), [synth.py](https://github.com/whaleyxbt/claude-motion/blob/main/sfx/synth.py), and [SFX CLI](https://github.com/whaleyxbt/claude-motion/blob/main/sfx/__main__.py) | Seeded local synthesis and a common visual/audio cue timeline are useful. Its executable Python cue import must not cross V3's model boundary. | Declarative, validated cues and opt-in local audio in Phase 5. |
| [Howseen motion skill](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/SKILL.md) | Describe timed visual states, layers and sound before implementation. Carry a shared object across scenes. Review the weakest moments by timestamp and preserve comprehension. | Beat-sheet metadata and six trusted authored scenes are implemented; human quality acceptance remains pending. |
| [Howseen render template](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/scripts/render_template.py) | Pure seek functions, transition-frame inspection, cut-aware sampling and loop seam checks are useful techniques. | Existing deterministic renderer owns export; no second renderer or blur implementation added. |
| [Howseen audio template](https://github.com/howseen-ai/claude-motion-design/blob/main/skill/motion-design/scripts/audio_template.py) | Place a sound's measured peak at the intended visual impact and measure loudness after mixing. | Phase 5; example music/times are not copied. |

Sources were inspected, not installed/executed/validated integrations. No external scripts ran or third-party code/media was copied. [Whaley](https://github.com/whaleyxbt/claude-motion/blob/main/LICENSE)/[Howseen](https://github.com/howseen-ai/claude-motion-design/blob/main/LICENSE) code licences are MIT; preserve notices if incorporating code later. Media rights are separate; Remotion commercial eligibility remains undecided.

## Project-specific decisions

- Keep meaningful holds; drift, decorative texture and arbitrary cuts cannot substitute for teaching.
- Narration/measured timing govern. Music may support, never silently alter speech speed/word timing.
- Introduce invented examples naturally without audience-facing provenance labels. Retain source notes/uncertainty; never imply verified events/results.
- This experiment allowed no subagents, external credentials, unlicensed media, paid dependencies, new pipeline or automatic approval. Reuse registered assets/components. Current stage assignments follow [workflow guidance](workflow-efficiency.md#model-assignments).
- Alternate light/dark only to explain. Never blindly impose source palettes, aspect ratios, springs, 60fps or mandatory decoration.

## Experimental profile and comparison

[motion-principles-profile.json](motion-principles-profile.json) keeps empirical measurements null and separates review hypotheses. Inactivity 45 frames, primary-preset share 40% and two root text elements/shot are test settings, not source-measured/validated thresholds. The 15-second candidate retains its stricter one-text-element goal. Justified reading holds/repetition require review.

Run from V3:

```powershell
node scripts/rhythm-compare.ts docs/motion-principles-profile.json videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/motion/370b9586-071f-4c52-a1a2-298a59f671c1.json output/terra-intense-10s-example/motion.json
```

Reports contain diagnostics/limits, never retention, camera-quality, loudness or comprehension measurements from JSON alone. Preserve Phase 0 baseline; write new output separately.

## Completed implementation and review state

The user authorized continuation beyond Phase 2; Phases 3–6 and local review pair were delivered. Table phase numbers identify ownership, not outstanding approvals. V3 adaptations are independently authored; external repositories were only inspected.

- [Style](motion-style-bible.md): six authored scenes, original character kit, 46 assets and local SVG/provenance.
- [Beat sheets](beat-sheet.md): validated writing/visual/motion intent; spoken-line/TTS contract unchanged.
- [Alignment/audio](local-alignment-and-audio.md): offline exact-transcript evidence, seeded synthesis, ducking, measured loudness and opt-in mixed bindings. Cue envelopes align to visual frames, not independently to waveform peaks. No third-party music/hardcoded example timing copied.
- [Delivery report](../output/retention-experiment/REPORT.md): two 15-second MP4s, exact-frame contact sheet, side-by-side diagnostics, verification/limits.

Dated checks passed 196 tests/lint/typecheck; default build failed with known CSS-worker error. Phone viewing, listening, preference/retention remain unverified. Empirical fields stay null without measured clips. Implementation/tests grant neither human gates nor publication.
