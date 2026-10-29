# Narration audition

Status: pending human listening. Not accepted narration and not production approval.

Provider: Qwen3-TTS 1.7B CustomVoice

Model revision: `0c0e3051f131929182e2c023b9537f8b1c68adfe`

Voice: `ryan`

Device: CPU

Seed: `20261027`

Delivery: warm, connected technology teacher with passage-specific hook, explanation and payoff direction.

Measured duration: 76.080 seconds, PCM16, 24 kHz, mono.

Signal review found zero clipping and no narration-quality findings. Pronunciation, voice consistency, expression and comprehension still require human listening.

## Build provenance

The first full local generation completed the hook and explanation passages, then exceeded the script wrapper's overall timeout while generating the payoff. The failed attempt and all completed segments were preserved.

The payoff was then generated separately as an audition take. This review WAV is assembled from those preserved segments and is explicitly not a provider-complete take.

- Incomplete full-take ID: `af23719a-5fd8-468d-bfee-8780cc5a9050`
- Separate payoff-take ID: `10974f6b-222b-4ba0-a904-3216f57a7520`
- Review WAV: [qwen-ryan-composite-trimmed.wav](../../../output/playwright/payment-failed-narration-review/qwen-ryan-composite-trimmed.wav)
- Review manifest: [manifest.json](../../../output/playwright/payment-failed-narration-review/manifest.json)

## Measured line boundaries

| Script line | Start frame | End frame |
| --- | ---: | ---: |
| 1 | 0 | 173 |
| 3 | 173 | 662 |
| 5 | 662 | 1054 |
| 7 | 1054 | 1608 |
| 9 | 1608 | 2282 |

The 76.080-second result is 1.080 seconds over the original 75-second planning ceiling. Do not speed the voice silently to force a fit. Review the audition first; shorten the accepted script or revise the target only if needed.
