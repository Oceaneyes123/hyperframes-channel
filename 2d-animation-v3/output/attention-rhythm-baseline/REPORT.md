# Phase 0: rhythm baseline

Measured October 29, 2026 on branch `codex/attention-rhythm-baseline`. This report describes authored motion plans, not measured attention or video perception. No improvement claim is made.

| Metric | Terra final | Original intense example |
| --- | ---: | ---: |
| Duration (s) | 74.8 | 10 |
| Shots | 8 | 6 |
| 2-second windows (last may be partial) | 38 | 5 |
| Change-event onsets | 101 | 77 |
| Windows with zero event onsets | 12 | 0 |
| Non-hold presets including text treatments | 34 | 17 |
| Snap-overshoot uses | 14 | 5 |
| Distinct illustration signatures | 4 | 4 |
| Peak concurrent root text elements | 4 | 3 |
| Peak concurrent authored words | 11 | 7 |

Terra snap-overshoot share is 14/34 (41.2%); the intense example is 5/17 (29.4%). Primary-only histograms differ: Terra snap-overshoot 3/9 (33.3%), intense 1/6 (16.7%). The owner-review-console illustration appears in 4/8 Terra shots and 2/6 intense shots. These clips differ in duration, script coverage and composition; raw totals are not a controlled comparison.

Each target/category action interval is one event; touching phases merge. Enter/exit, transformation, camera movement, text treatment and optional background-change onsets count separately. Shot boundaries can cluster several events. An onset-free window can contain ongoing motion; consult activeEvents and event intervals. No score or threshold is applied.

Visibility is estimated from root opacity/reveal, with linear interpolation. Counts include full authored words during partial reveals. Internal illustration/diagram text, clipping, occlusion and transition masks are excluded. Numeric transitions are counted once; individual decorative digit ticks are not measured. No numeric displays occur in these baselines. Asset IDs/hashes identify bundled illustrations; structured references identify compounds, while primitive symbols use their type.

## Commands

Run from `2d-animation-v3` with Node 24. Commands read inputs and print JSON; they do not create projects or gates.

```powershell
node scripts/rhythm-report.ts videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/motion/370b9586-071f-4c52-a1a2-298a59f671c1.json videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/visuals/f85221d8-88c8-48ff-95b5-de06fe408079.json
node scripts/rhythm-report.ts output/terra-intense-10s-example/motion.json output/terra-intense-10s-example/board.json
```

MP4-only input is rejected: supply its corresponding motion plan. Storyboards are optional; omitted backgrounds are unknown. Provided storyboard shot hashes must match. JSON reports include input SHA-256 values. Existing MP4, narration, motion and storyboard hashes matched the pre-existing intense-example source manifest; see preservation.json.

## Verification and boundaries

- Gateway/render preflights passed; Qwen preflight failed because local environment/model/version/speaker/device configuration is absent. No download or synthesis attempted.
- npm run check: 182 tests passed, lint/typecheck passed, two existing unused-variable lint warnings. See check.log.
- npm run build failed in Turbopack while processing app/globals.css: node process exited before the CSS worker connected. This matches the existing STATUS.md limitation. See build.log. No unrelated build fix attempted.
- No engine/client edits, gates, renders, accepted-artifact changes, paid dependencies, commits, pushes or publishing. Remotion commercial eligibility remains undecided.

## Per-window baseline

### terra-final

| Seconds | Event onsets | Active events | Text union | Word union | Peak text | Peak words | Illustration signatures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0–2 | 5 | 5 | 2 | 4 | 2 | 4 | 1 |
| 2–4 | 8 | 8 | 4 | 11 | 4 | 11 | 1 |
| 4–6 | 1 | 2 | 2 | 7 | 2 | 7 | 1 |
| 6–8 | 0 | 1 | 2 | 7 | 2 | 7 | 1 |
| 8–10 | 6 | 6 | 3 | 12 | 2 | 7 | 1 |
| 10–12 | 1 | 4 | 2 | 7 | 2 | 7 | 1 |
| 12–14 | 1 | 2 | 2 | 7 | 2 | 7 | 1 |
| 14–16 | 0 | 0 | 2 | 7 | 2 | 7 | 1 |
| 16–18 | 0 | 0 | 2 | 7 | 2 | 7 | 1 |
| 18–20 | 10 | 10 | 4 | 13 | 2 | 7 | 2 |
| 20–22 | 1 | 2 | 2 | 6 | 2 | 6 | 1 |
| 22–24 | 5 | 5 | 2 | 6 | 2 | 6 | 1 |
| 24–26 | 1 | 5 | 2 | 6 | 2 | 6 | 1 |
| 26–28 | 1 | 2 | 2 | 6 | 2 | 6 | 1 |
| 28–30 | 0 | 0 | 2 | 6 | 2 | 6 | 1 |
| 30–32 | 8 | 8 | 4 | 11 | 4 | 11 | 1 |
| 32–34 | 4 | 5 | 2 | 5 | 2 | 5 | 1 |
| 34–36 | 4 | 4 | 3 | 10 | 2 | 7 | 1 |
| 36–38 | 0 | 0 | 2 | 7 | 2 | 7 | 1 |
| 38–40 | 9 | 9 | 4 | 12 | 2 | 7 | 2 |
| 40–42 | 1 | 2 | 2 | 5 | 2 | 5 | 1 |
| 42–44 | 1 | 2 | 2 | 5 | 2 | 5 | 1 |
| 44–46 | 9 | 9 | 4 | 10 | 4 | 10 | 2 |
| 46–48 | 0 | 1 | 2 | 5 | 2 | 5 | 1 |
| 48–50 | 2 | 2 | 2 | 5 | 2 | 5 | 1 |
| 50–52 | 1 | 1 | 2 | 5 | 2 | 5 | 1 |
| 52–54 | 1 | 1 | 2 | 5 | 2 | 5 | 1 |
| 54–56 | 0 | 1 | 2 | 5 | 2 | 5 | 1 |
| 56–58 | 8 | 8 | 4 | 9 | 2 | 5 | 2 |
| 58–60 | 0 | 0 | 2 | 4 | 2 | 4 | 1 |
| 60–62 | 2 | 2 | 2 | 4 | 2 | 4 | 1 |
| 62–64 | 0 | 0 | 2 | 4 | 2 | 4 | 1 |
| 64–66 | 6 | 6 | 4 | 8 | 4 | 8 | 1 |
| 66–68 | 4 | 4 | 2 | 4 | 2 | 4 | 1 |
| 68–70 | 0 | 0 | 2 | 4 | 2 | 4 | 1 |
| 70–72 | 1 | 1 | 2 | 4 | 2 | 4 | 1 |
| 72–74 | 0 | 0 | 2 | 4 | 2 | 4 | 1 |
| 74–74.8 | 0 | 0 | 2 | 4 | 2 | 4 | 1 |

Preset histogram: {"snap-overshoot@1":14,"mask-reveal@1":7,"cascade@1":4,"word-stagger@1":1,"edge-trace@1":2,"pop-settle@1":1,"mask-rise@1":1,"punch-zoom@1":1,"wipe-reveal@1":1,"underline-draw@1":1,"highlight-sweep@1":1}.

### terra-intense-10s

| Seconds | Event onsets | Active events | Text union | Word union | Peak text | Peak words | Illustration signatures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0–2 | 17 | 17 | 4 | 9 | 2 | 5 | 1 |
| 2–4 | 15 | 16 | 4 | 11 | 2 | 6 | 4 |
| 4–6 | 13 | 14 | 4 | 12 | 2 | 6 | 3 |
| 6–8 | 16 | 16 | 4 | 11 | 2 | 6 | 3 |
| 8–10 | 16 | 16 | 5 | 12 | 3 | 7 | 2 |

Preset histogram: {"cascade@1":7,"snap-overshoot@1":5,"mask-reveal@1":1,"converge-assemble@1":1,"flow-handoff@1":2,"split-disperse@1":1}.

## Stop point

Phase 0 complete. Wait for the user’s approval before Phase 1. Reference clips have not been inspected yet; no rhythm targets have been invented.
