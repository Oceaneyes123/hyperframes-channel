# Local alignment and opt-in audio

These tools produce evidence/artifacts, never approve timing, pronunciation, motion, gates or publication. Follow [quality bar](quality-bar.md): VoiceStudio default, no Fish fallback, natural speed, preserved raw audio/hashes and full listening/boundary review before timing import. ASR matches, valid WAVs and audition approval cannot approve full takes. Flag uncertain words for listening, never silently rewrite. Audio-only `gpt-6-luna` generates/validates; voice choice, alignment and approval stay outside its scope.

Check PCM joins against hash-bound original sample boundaries. Narrowed parsed manifests may omit `startSample`/`endSample`; never slice missing fields. WAV duration rounds up to cover the last partial frame; never truncate audio to a rounded-down estimate.

## Local word alignment

`scripts/align-local.py` uses installed faster-whisper weights offline, never downloads.

| Mode | Behavior |
| --- | --- |
| Without `--line-timing` | Transcribe locally, match recognized words to exact script |
| With measured `segments:[{sourceText,startFrame,endFrame}]` | Force exact transcript tokens through per-line cross-attention alignment |

Supplied text must exactly match every line. Segments fit audio and are at most 30 seconds. Lexical splits/zero-duration results may remain unmatched; never invent times.

```powershell
python scripts/align-local.py --audio narration.wav --script script.json --model C:/path/to/cached/model --line-timing measured-lines.json --output alignment.json
```

Output binds audio/script bytes, weights, tool version and optional line-timing bytes. Word times remain ASR-derived, human/pronunciation approval false. Production import needs actual human timing review. Evidence-bound word anchors may drive isolated experiments without fabricated reviewed receipts.

## Local soundtrack

Narration-only is default; disabled `mixAudioLayer` returns original bytes unchanged. Opt-in settings:

```json
{
  "enabled": true,
  "music": true,
  "seed": 17,
  "targetLufs": -16,
  "cues": [{ "frame": 60, "sound": "click" }]
}
```

Original CC0 tones/noise provide quiet chord bed and click/pop/whoosh/impact/chime. Noise is seeded/repeatable. Envelopes center near visual frames; individual waveform peaks are not independently aligned. No downloaded samples, remote URLs, executable cues, credentials or paid dependencies. Frame-zero cues may truncate attack; place after frame zero where practical.

FFmpeg sidechain-ducks music from narration, mixes effects, then performs measured two-pass normalization. Experiment settings: −16 LUFS ±1 LU, true peak ≤−1 dBTP; mastering aims at −1.5 dBTP. These are chosen tests, not platform mandates. Reports retain measured levels/hashes. Preserve original frame count/duration; never speed/edit speech.

For imported project narration:

```powershell
node --env-file-if-exists=.env scripts/audio-layer.ts PROJECT_UUID NARRATION_UUID settings.json
```

Use intended `V3_DATA_DIR`/`V3_VIDEOS_DIR`; isolate experiments. A mix appends immutable narration with original WAV/timing plus separate mixed WAV/hash/settings. Never replace original voice bytes or create gates. Mixed hash/settings enter binding and stale old gates; serving/renderer select the same mix. Fresh exact-input human gates and export authorization remain required; none were created for this experiment.

## Review renderer

`prepare-retention-review.ts`/`render-retention-review.ts` are specific to the authorized Terra excerpt. Preparation verifies wording, preserves first 15 seconds of PCM and hash-bound word evidence. Renderer uses existing composition without production records: render once, encode/compare those PNGs, fresh seeks, full decode, metadata/audio sync and explicit review-only provenance. It is not a production export replacement.

Remotion commercial-use eligibility remains unresolved; local reviews do not grant rights/publishing.
