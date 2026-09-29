---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Timed storyboard — measured preview plan

Measured total: 114.381 seconds (1:54.381). `audio_meta.json` is canonical for
scene start and duration. Attention windows below preserve the approved beat
proportions scaled to each measured WAV. Exact spoken-action anchors in
`motion_beats.json` are aligned from the actual audio. The combined visual board is
[`review/gate-1-board.html`](review/gate-1-board.html); each board frame uses the
planned local SVG icons from `ICON_PLAN.json`.

Persistent question: how close can a lower-priced model get to flagship work
before the expensive option is worth it?

Persistent visual: one conceptual capability/cost map, with one unchanged
Sonnet 5.5 token carried through speed, price, coding and knowledge-work
evidence. The map is explicitly qualitative; the separate benchmark results
stay labeled and are never collapsed into a composite score.

## Frame 1 — Hook
- Measured window: 0.000–7.105s; WAV duration 7.105s.
- Voiceover: `SCRIPT.md#Line 1`
- Viewer question: How close can the model below the flagship get?
- Scene payoff: Sonnet 5.5 visibly closes most of the gap without erasing it.
- Persistent object: `sonnet55`, introduced small and left of `opus55` on the map.
- Primary causal action: Sonnet 5.5 travels toward the higher-capability region.
- Visible consequence: Opus stays ahead; the price marker shows more spend.
- Comprehension pause: 0.8s on the remaining gap.
- Next question: What makes a model choice costly in daily use?
- Energy: high; immediate question and physical move.
- Dominant visual: `sonnet55` moving toward `opus55` on the shared map.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`.
- Text: “NEAR THE FLAGSHIP?” and two compact model labels.
- Archetype / motion verb: hero hook / approach.
- Transition: match cut on the Sonnet token into the map explanation.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–0.79s | Situation | “A flagship” | Both model tokens and the cost/capability map are already visible. | planned sketch |
| 0.79–4.74s | Anticipation → action | “how much … need?” | `sonnet55` moves diagonally toward `opus55`; the remaining gap stays visible. | planned sketch |
| 4.74–7.11s | Settle → next question | end of line | Cost tick remains higher under Opus; brief hold. | planned sketch |

## Frame 2 — Setup / problem
- Measured window: 7.105–15.882s; WAV duration 8.777s.
- Voiceover: `SCRIPT.md#Line 2`
- Viewer question: Why not always choose the smartest model?
- Scene payoff: time, tokens and retries act as real constraints around each task.
- Persistent object: `sonnet55` and the same conceptual map.
- Primary causal action: time, token and retry constraints compress the available budget.
- Visible consequence: the highest-capability choice can push task cost and waiting time up.
- Comprehension pause: hold after three constraint marks land.
- Next question: Can Sonnet improve the speed side of the trade-off?
- Energy: medium; make the decision legible.
- Dominant visual: three pressure marks close around one task path.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`; original inline timing/token/retry marks.
- Text: “CAPABILITY / TIME / COST”.
- Archetype / motion verb: decision machine / constrain.
- Transition: route trace follows the Sonnet token into the speed test.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–1.95s | Setup | “Choosing isn't just” | Preserve map and model positions from frame 1. | planned sketch |
| 1.95–5.85s | Action | “time … tokens … retries” | Constraint marks move inward and narrow the task's budget lane. | planned sketch |
| 5.85–8.78s | Settle → next question | “real task” | Hold the constrained lane; Sonnet remains centered for the next test. | planned sketch |

## Frame 3 — Speed
- Measured window: 15.882–29.396s; WAV duration 13.514s.
- Voiceover: `SCRIPT.md#Line 3`
- Viewer question: Does the newer Sonnet actually make the loop faster?
- Scene payoff: Anthropic reports 30%+ faster output generation versus Sonnet 5.
- Persistent object: `sonnet55` remains the hero; `sonnet5` is the same-task control.
- Primary causal action: paired output traces advance at different rates.
- Visible consequence: Sonnet 5.5 reaches the same response-length marker earlier.
- Comprehension pause: 1s with both arrivals aligned to the same task endpoint.
- Next question: Does speed also change what each task costs?
- Energy: medium-high; measured reveal, then hold.
- Dominant visual: two output traces race toward one shared endpoint.
- Assets: `sonnet-5-5.svg`, `sonnet-5.svg`.
- Text: “30%+ FASTER OUTPUT*”; note that this is generation speed.
- Archetype / motion verb: contrast / advance.
- Transition: the endpoint marker reshapes into a price comparison.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–2.70s | Setup | “Sonnet 5.5 … Sonnet 5” | Keep both model tokens and one equal task marker visible. | planned sketch |
| 2.70–6.76s | Anticipation | “more than thirty” | Their traces begin together; 5.5's trace accelerates. | planned sketch |
| 6.76–10.81s | Action → consequence | “percent faster” | 5.5 reaches the endpoint first; 5's trace completes the same task afterward. | planned sketch |
| 10.81–13.51s | Settle / qualification | “generation speed” | Label the metric; hold before transitioning. | planned sketch |

## Frame 4 — Price and per-task efficiency
- Measured window: 29.396–51.966s; WAV duration 22.570s.
- Voiceover: `SCRIPT.md#Line 4`
- Viewer question: Is the faster model more expensive to call or run?
- Scene payoff: 5.5 keeps Sonnet 5 list rates, is half of Opus's base token rates,
  and a task-specific independent run reports lower model-call cost.
- Persistent object: `sonnet55` remains the object on the map.
- Primary causal action: price bars split into input/output, then contract to the
  measured review-call comparison.
- Visible consequence: cost depends on both published token price and tokens
  consumed; the independent amount is scoped to one pipeline.
- Comprehension pause: 1s on the “44 PRs · model calls only · score pending” note.
- Next question: What capability arrives for that spend?
- Energy: medium; dense facts need a calm hold.
- Dominant visual: two price bars and the Sonnet token linking them.
- Assets: `sonnet-5-5.svg`, `sonnet-5.svg`, `opus-5-5.svg`.
- Text: “$2 IN / $10 OUT”; “OPUS $4 / $20”; “$0.46 vs $1.16 / review”.
- Archetype / motion verb: transformation / compare.
- Transition: the shortened cost bar becomes the base of a coding task.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–5.64s | Setup | “Those list rates” | Show Sonnet 5 and 5.5 rates equal; Opus bars are twice as long. | planned sketch |
| 5.64–11.28s | Action | “half of Opus” | One brace joins Sonnet's rates; Opus bars remain at 2×. | planned sketch |
| 11.28–18.81s | Evidence reveal | “forty-six cents … dollar sixteen” | Show model-call costs from the 44-PR CodeRabbit run; keep scope note adjacent. | planned sketch |
| 18.81–22.57s | Settle | “scoring was still pending” | Amber qualification marker lands; hold. | planned sketch |

## Frame 5 — Coding capability
- Measured window: 51.966–65.620s; WAV duration 13.653s.
- Voiceover: `SCRIPT.md#Line 5`
- Viewer question: Does its coding capability approach Opus on a relevant task?
- Scene payoff: CursorBench 4.0 puts Sonnet 5.5 Max at 55.5%, near Opus 5.5 Max at 57.8%.
- Persistent object: `sonnet55` advances on the same map; paired `task` remains fixed.
- Primary causal action: two score columns rise from the same task baseline.
- Visible consequence: their endpoints sit close together; no “tie” label.
- Comprehension pause: 1s on benchmark name and effort setting.
- Next question: Does closeness carry over to knowledge work?
- Energy: high; first clear capability payoff after price.
- Dominant visual: Sonnet and Opus columns, with the cursor task icon below.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`, `task-terminal.svg`.
- Text: “55.5% / 57.8%”; “CursorBench 4.0 · Max”.
- Archetype / motion verb: comparison / rise.
- Transition: matched column tops connect into a work-product comparison.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–1.82s | Setup | “multi-file coding tasks” | `task` connects both model tokens to the shared benchmark lane. | planned sketch |
| 1.82–5.46s | Anticipation → action | “fifty-five point five” | 5.5 score column rises to 55.5%. | planned sketch |
| 5.46–8.19s | Comparison | “close to Opus” | Opus column reaches 57.8%; the small gap remains visible. | planned sketch |
| 8.19–13.65s | Settle / next question | end of line | Keep exact benchmark and Max effort labels readable. | planned sketch |

## Frame 6 — Knowledge-work result
- Measured window: 65.620–76.347s; WAV duration 10.728s.
- Voiceover: `SCRIPT.md#Line 6`
- Viewer question: Is this closeness limited to coding?
- Scene payoff: GDPval-AA reports 1844 for Sonnet 5.5 and 1846 for Opus 5.5.
- Persistent object: `sonnet55`; `briefcase` is shared between both model lanes.
- Primary causal action: both result markers settle almost together on one named test.
- Visible consequence: close scores appear; an “on this test” boundary encloses them.
- Comprehension pause: 1s to read the boundary and footnote marker.
- Next question: Where does the flagship gap become practical?
- Energy: low-medium; let the result breathe.
- Dominant visual: paired knowledge-work result markers.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`, `work-briefcase.svg`.
- Text: “1844 / 1846”; “GDPval-AA · one evaluation”.
- Archetype / motion verb: contrast / converge.
- Transition: pull back from the near-match into a difficult review diff.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–2.15s | Setup | “one knowledge-work test” | Briefcase connects to both model tokens. | planned sketch |
| 2.15–5.36s | Action | “eighteen forty-four” | Sonnet marker travels to 1844. | planned sketch |
| 5.36–7.51s | Reaction | “two points behind Opus” | Opus arrives at 1846; near gap is highlighted. | planned sketch |
| 7.51–10.73s | Settle / next question | “not interchangeable” | Frame boundary labels it one evaluation; hold. | planned sketch |

## Frame 7 — Twist / limitation
- Measured window: 76.347–92.299s; WAV duration 15.952s.
- Voiceover: `SCRIPT.md#Line 7`
- Viewer question: Does a near benchmark score make Sonnet a flagship replacement?
- Scene payoff: no; CodeRabbit's small hard-review set favors Opus.
- Persistent object: same model tokens; the context changes to 13 difficult pull requests.
- Primary causal action: counted bug findings accumulate in separate model lanes.
- Visible consequence: Opus Standard 8/13 and Max 10/13 exceed Sonnet 5.5's 6/13.
- Comprehension pause: 1s on “13 hard cases · CodeRabbit”.
- Next question: Which model belongs in the everyday sweet spot?
- Energy: high; the strongest reversal, followed by a clear hold.
- Dominant visual: Opus lane gains two additional issue markers.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`, `code-review.svg`.
- Text: “6 / 13 · 8 / 13 · 10 / 13”; visible labels “Sonnet”, “Opus Std”, “Opus Max”.
- Archetype / motion verb: contrast / out-detect.
- Transition: keep both model identities as the camera pulls back to the final map.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–2.13s | Setup | “CodeRabbit's … review cases” | Diff icon opens; label the sample and evaluator. | planned sketch |
| 2.13–6.38s | Action | “Sonnet's six” | Six issue markers appear in Sonnet's lane. | planned sketch |
| 6.38–10.63s | Counter-result | “Opus caught eight … ten” | Opus Standard adds two markers; Max adds two more. | planned sketch |
| 10.63–15.95s | Qualification / settle | “small, specific test” | Hold with scope note; Opus stays visibly ahead. | planned sketch |

## Frame 8 — Payoff
- Measured window: 92.299–114.381s; WAV duration 22.082s.
- Voiceover: `SCRIPT.md#Line 8`
- Viewer question: When is Sonnet enough, and when is Opus worth the premium?
- Scene payoff: Sonnet 5.5 is a strong mid-range value for many well-scoped tasks;
  Opus remains the choice when unusually difficult judgment is worth extra cost.
- Persistent object: `sonnet55` and `opus55` return to the original map.
- Primary causal action: evidence markers from speed, price and results settle around Sonnet;
  Opus remains at the high-capability/high-cost edge.
- Visible consequence: “strong value” appears beside Sonnet; “hardest judgment” beside Opus.
- Comprehension pause: 1.5s final hold, then end cleanly.
- Next question: none; no outro.
- Energy: high → settle; resolve the hook without declaring a universal winner.
- Dominant visual: full trade-off map, Sonnet close to Opus but at a lower base rate.
- Assets: `sonnet-5-5.svg`, `opus-5-5.svg`, `sonnet-5.svg`.
- Text: “STRONG MID-RANGE VALUE”; “NOT EVERY JOB”.
- Archetype / motion verb: constellation recap / settle.
- Transition: camera pullback explains the complete relationship; end on the map.

| Local window | Attention beat | Narration cue | Objects and causal state change | Evidence |
| --- | --- | --- | --- | --- |
| 0.00–4.91s | Setup | “So the case” | Hold the capability/cost map; Sonnet glides into its chart position at `the_combination`. | revised motion preview |
| 4.91–12.27s | Evidence resolves | “strong results … faster … lower operating cost” | Speed, price and selected benchmark marks join the Sonnet token. | planned sketch |
| 12.27–19.63s | Role split | “well-scoped … open-ended” | Pulse Sonnet's halo at `mid_range_value`; glide Opus into its higher-capability, higher-cost region at `open_ended_work`. | revised motion preview |
| 19.63–22.08s | Settle / end | “choose Opus” | Bloom and fade Opus's halo at `choose_opus`; hold the final map, no outro. | revised motion preview |

## Measured word cues

Each cue is a scene-local second aligned from the actual WAV and fingerprinted
in `motion_beats.json`. Raw alignment output is in
[`review/word-alignment.json`](review/word-alignment.json). Alignment is not a
listening review; intelligibility and cue placement remain part of Gate 2.

- `line-1`: `flagship` 0.68s; `everyday_tasks` 4.40s.
- `line-2`: `response_time` 3.02s; `repeated_tokens` 4.34s; `retries` 5.72s.
- `line-3`: `thirty_percent` 4.50s; `faster_output` 5.32s; `generation_speed` 7.98s.
- `line-4`: `half_of_opus` 3.06s; `lower_task_cost` 7.66s; `forty_six_cents` 15.60s; `dollar_sixteen` 17.86s; `score_pending` 21.48s.
- `line-5`: `sonnet_fifty_five_point_five` 5.14s; `sonnet_five_baseline` 8.80s; `opus_fifty_seven_point_eight` 11.44s.
- `line-6`: `sonnet_eighteen_forty_four` 2.98s; `two_points_behind` 5.04s; `not_interchangeable` 9.00s.
- `line-7`: `opus_eight_bugs` 5.00s; `sonnet_six_bugs` 8.04s; `opus_max_ten_bugs` 9.38s; `difficult_judgment` 13.16s.
- `line-8`: `the_combination` 2.92s; `mid_range_value` 15.90s; `open_ended_work` 17.08s; `choose_opus` 20.40s.

## Gate 1 approval record

The original static planning board remains at
[`review/gate-1-board.html`](review/gate-1-board.html). The approved spoken
script is unchanged. `audio_meta.json` and this storyboard now hold measured
audio timing. The complete composed preview is ready for Gate 2; final listening
and user approval are pending.

## Preview evidence

- Initial per-scene samples: [`review/preview-samples/contact-sheet.jpg`](review/preview-samples/contact-sheet.jpg), captured before the Frame 4, 6 and 8 revisions at 6.3s, 14.7s, 27.9s, 50.9s, 65.4s, 76.0s, 91.5s and 114.0s. These show one late scene state each, not every action boundary.
- Latest revision samples: [`review/latest-revisions/contact-sheet.jpg`](review/latest-revisions/contact-sheet.jpg), Frame 4 at 50.9s, Frame 6 at 75.9s, and Frame 8 at 95.8s, 108.6s, 109.9s, 113.0s and 114.1s to review its marker entrances and highlights.
- Frame 2 slider-head revision: [`review/frame2-revision-samples/contact-sheet.jpg`](review/frame2-revision-samples/contact-sheet.jpg), captured at 10.5s, 11.8s and 13.4s as the pressure cues arrive.
- `py -3 scripts/validate_project.py --project videos/claude-sonnet-5-5-price-performance --stage preview`: passed.
- HyperFrames 0.8.91 `check --snapshots`: lint 0 errors/0 warnings; runtime 0 findings; layout 0 findings; contrast 63/63 passed. No motion sidecar assertions are configured.
- Narration has not been manually auditioned. Listen through the Studio preview, especially numeric phrases and their cue timing, before Gate 2 approval.
