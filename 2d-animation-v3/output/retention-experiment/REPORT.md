# Terra retention experiment: review delivery

October 29, 2026. Branch: `codex/motion-quality-principles`.

**Watch the [review page](http://127.0.0.1:3029/index.html)**, or open the two local files:

- [Baseline, 15 seconds](project-v2/baseline-15s.mp4)
- [Candidate, 15 seconds](project-v2/candidate-15s.mp4)
- [Contact sheet: baseline left, candidate right](project-v2/comparison-exact-contact.png)
- [Full comparison JSON](project-v2/comparison.json)

Both videos are 1080 × 1920, 30 fps, 450 frames, with audio. The contact sheet
samples exact frames 0, 30, …, 420, reading left-to-right in three rows on each
side. The original full Terra export, narration, source motion and storyboard
remain byte-identical; [preservation evidence](project-v2/preservation.json).

## Side-by-side diagnostics

| Metric, same first 15 seconds | Baseline | Candidate |
| --- | ---: | ---: |
| Authored shots intersecting the span | 2 | 9 |
| Declared change-event onsets | 22 | 43 |
| Two-second windows with no onset | 2/8 | 1/8 |
| Peak concurrent root text actors | 4 | 1 |
| Overall non-hold snap-overshoot uses | 5/9 | 5/11 |
| Encoded integrated loudness | −18.90 LUFS | −16.48 LUFS |
| Encoded true peak | −0.60 dBTP | −4.47 dBTP |

The candidate's generic scene-play transport occurs six times and represents five
different authored scene identities. It still deserves review for repetition;
its transport preset share is not proof of limited or sufficient motion variety.
The final 14–15-second window contains ongoing scene motion and a short hold even
though no new event starts. Counts exclude internal SVG motion/text such as the
SEND label, and are not perceptual measurements. The candidate uses at most one
visible text element per shot, including its embedded opening button label.

| Window (s) | Baseline onsets | Candidate onsets |
| --- | ---: | ---: |
| 0–2 | 5 | 6 |
| 2–4 | 8 | 5 |
| 4–6 | 1 | 7 |
| 6–8 | 0 | 5 |
| 8–10 | 6 | 8 |
| 10–12 | 1 | 5 |
| 12–14 | 1 | 7 |
| 14–15 | 0 | 0 |

No retention or quality improvement is claimed. This is not a blinded comparison;
several visual/audio layers changed together, and the candidate is about 2.4 LUFS
louder. Loudness may bias preference. Phone viewing and later analytics remain
the real tests.

## What changed

The script's words and order are unchanged for the excerpt. Re-segmentation creates
nine review lines at existing ASR-derived phrase starts; the exact original PCM
samples are preserved before mixing. No speech speed or silence editing occurred.
The excerpt finishes after “API,” before the next sentence begins. The model and
launch claims are retained from the accepted source, not independently re-researched.

The opening uses a physical SEND control and cursor. Later states use a message
transformation, processor, parallax workspace, computer, price tag, launch cue and
three destination symbols. Light/dark surfaces and composition change with the
spoken idea. No audience-facing provenance labels appear. The release checkmark
marks the narrated launch, not human approval or an AI safety endorsement. The
ending component has a closed local motion path; the whole excerpt is not claimed
to loop seamlessly back into its opening shot.

**My hypothesis:** motion/staging closes the largest observable gap, because the
picture now develops with the narrated phrases instead of holding the same monitor
for most of the span. Sound may add tactile feedback, but taste and comprehension
have not been judged by a human. The simpler art may suit some viewers less well
than the original detailed illustration. This remains a candidate for viewing.

## Implemented capabilities

- A [style bible](../../docs/motion-style-bible.md), 20 new original SVG symbols
  and six trusted scene entries bring the registry to 46 assets. Existing artwork
  and the existing rigged character kit are reused. New artwork has recorded CC0
  provenance; no third-party media or executable code was imported.
  All 46 entries have individual local SVG exports and per-item provenance under
  public/media/vector-catalog/. Scene entries export their registry icon; their
  animated geometry is in trusted authored source.
- Six authored scenes provide object transformation, parallax push/pull, counting
  the drawn objects, particles, anticipation/squash/follow-through and a closed
  handoff loop. They enter through registered, hash-bound asset identities and
  a validated scene-play preset. Production export guards remain intact.
- [Local alignment](forced-alignment.json) uses the already-cached faster-whisper
  base.en model offline, forcing the supplied transcript within measured line
  segments. It matched 157/167 whitespace words; lexical splits/unmatched words
  keep no invented spans. Nine matched boundary words drive the excerpt's anchors.
  Exact audio/script/model hashes are recorded. Human timing and pronunciation
  approval remain false; no approved production timing was fabricated.
- Opt-in local synthesized music/SFX, ducking, duration preservation, two-pass
  normalization and level/hash reporting are implemented. Narration-only remains
  the default. Mixed narration records preserve the original WAV and bind separate
  mix bytes/settings to fresh gates. Serving and export use the same track. No real
  production imports or gates were created for this experiment.

## Verification

- `npm run check`: lint/typecheck and **196 tests passed**, with two pre-existing
  unused-variable warnings. [Final check log](final-check.log).
- `npm run build` was run after each phase. Default builds reproduce the known
  Turbopack CSS-worker connection failure. [Final build log](final-build.log).
  No unrelated dependency or build configuration change was made.
- Both videos passed full decode and exact metadata checks.
  Candidate: all 450 frame comparisons passed, minimum SSIM **0.999186**; 11 fresh
  seeks matched sequential PNG bytes. Audio correlation **0.9999807**, zero lag.
  [Candidate and pair verification](project-v2/verification.json).
- Baseline transcode: all 450 source-frame comparisons passed, minimum SSIM
  **0.997939**; narration correlation **0.9992562**, zero lag.
  [Baseline verification](project-v2/baseline-extra-verification.json).
- The candidate mix WAV measured −16.46 LUFS / −1.5 dBTP. Encoded audio levels
  are reported separately above and in [encoded levels](project-v2/encoded-audio-levels.json).
- Probe and encoded contact-sheet frames were inspected. Human listening,
  normal-speed phone viewing, comprehension and preference remain pending.
- No subagents, commits, pushes, publication, channel credential use, paid dependency
  additions, model downloads, v1/v2 edits or accepted-artifact replacements occurred.

The gateway was unavailable and Qwen unconfigured at current preflight; the exact
existing narration was reused. Remotion commercial eligibility remains undecided.
Old gates do not authorize future exports against changed engine/audio inputs.

## Stop here

The authorized local review pair is delivered. Watch it on a phone with sound and
muted, then give timestamped feedback. No additional video render or publication is
authorized by this report, its diagnostics or the tool tests.
