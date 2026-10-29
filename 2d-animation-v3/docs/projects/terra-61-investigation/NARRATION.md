# Ryan voice audition

Script accepted unchanged in this chat. The user approved Ryan's hook, evidence and payoff auditions and selected Ryan for a complete narration candidate. The user subsequently approved the complete take with the storyboard; moving synchronization review remains separate.

Provider: existing local Qwen3-TTS 1.7B CustomVoice, Ryan, CPU, model revision `0c0e3051f131929182e2c023b9537f8b1c68adfe`, seed `20261028`. Reused the installed model/runtime configuration from a preserved earlier audition request; no model downloaded and no previous audio replaced.

- Hook take: `b45d1a80-7d49-462e-965d-0642ab69846f`.
- Measured duration: 2.800s, PCM16 mono, 24kHz.
- Zero clipped samples; signal inspector has no findings. Audible delivery approval came from the user's reply, not signal metrics.
- [Hook review WAV](../../../output/terra-61-investigation/voice-review/qwen-ryan-hook.wav).
- Evidence take, accepted line 5: `66853225-db94-4acc-9d18-8364b9a60c1b`, 9.280s, zero clipped samples, no signal findings. [Evidence WAV](../../../output/terra-61-investigation/voice-review/qwen-ryan-evidence.wav).
- Payoff take, accepted line 13: `61615ad7-3f2a-4f7b-8fd4-70fa64b18602`, 4.640s, zero clipped samples, no signal findings. [Payoff WAV](../../../output/terra-61-investigation/voice-review/qwen-ryan-payoff.wav).
- User listening decision: “Yes — use Ryan for complete narration.”

## Complete candidate — October 29

Take `0aaf004d-8907-4dd6-acbb-3a4158e2e8fa`: **74.800 seconds**, 2,244 frames at 30fps, PCM16 mono 24kHz. All 13 accepted lines are present as source-bound measured segments. Signal inspection reports zero clipping and no findings; human complete-take listening was approved in this chat. [Complete narration](../../../output/terra-61-investigation/voice-review/qwen-ryan-complete.wav).

Rate 0, fixed Ryan model/seed, natural pronunciation expansion for GPT-6.1. No script cuts, audition splicing or time stretching. The original full generation attempt `b4a45a3c-433c-4f67-8bff-cc12eade2095` was interrupted after five complete lines. The completed candidate explicitly reuses those exact source segments after text/seed/delivery/model checks, then generates the remaining lines. Both attempts and reuse provenance remain preserved in complete-review.json. This is a resumed full-script candidate, not assembled audition audio.

Measured line spans are exported in SCRIPT.md; shot durations now total the same 74.8 seconds. These are measured segment boundaries, not independently verified word alignment. Reviewed planning narration/timing was imported after the user approved the exact full take. No production narration record or production gate is inferred.

Each is a partial audition, not a full narration take. Do not import partial audio as complete narration or reuse estimated script timings as measured alignment. Full synthesis follows successful pronunciation/delivery review. No voice stretching, silent splicing of accepted takes, music or SFX.
