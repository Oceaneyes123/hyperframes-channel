# Local alignment and opt-in audio

These tools produce review evidence and audio artifacts. They never approve timing,
pronunciation, motion, production gates or publication.

## Local word alignment

`scripts/align-local.py` uses an already-installed faster-whisper model directory.
It sets offline mode and never downloads weights. Without `--line-timing`, it
transcribes locally and matches recognized words to the exact script. With a
measured segment file containing `segments:[{sourceText,startFrame,endFrame}]`, it
forces exact transcript tokens through cross-attention alignment within each line.
The supplied text must match every script line exactly. Segments must fit the
audio and be at most 30 seconds. Lexical splits or zero-duration results can remain
unmatched; no times are invented for them.

```powershell
python scripts/align-local.py --audio narration.wav --script script.json --model C:/path/to/cached/model --line-timing measured-lines.json --output alignment.json
```

Output binds exact audio/script bytes, model weights, tool version and optional
line-timing bytes. It labels word times ASR-derived and human/pronunciation approval
false. Existing production imports still require actual human timing review. Word
anchors may drive an isolated review experiment, with their evidence retained;
this does not fabricate a reviewed timing receipt.

## Local soundtrack

Narration-only remains the default. `mixAudioLayer` returns the original buffer
unchanged when disabled. Opt-in settings are strict data:

```json
{
  "enabled": true,
  "music": true,
  "seed": 17,
  "targetLufs": -16,
  "cues": [{ "frame": 60, "sound": "click" }]
}
```

The local generators create original CC0 tones/noise for a quiet chord bed and
click/pop/whoosh/impact/chime cues. Seeded noise is repeatable. Cue envelopes are
centered near the requested frame; no downloaded samples, remote URLs, executable
cue code, credentials or paid dependencies are used. Frame-zero cues may truncate
their attack, so place them after the first frame where practical.

FFmpeg ducks the music from narration using sidechain compression, mixes effects,
then performs measured two-pass loudness normalization. The experiment targets
−16 LUFS with a ±1 LU tolerance and true peak at or below −1 dBTP; the mastering
filter aims for −1.5 dBTP. These are chosen test settings, not a platform mandate.
Reports record actual levels and hashes. Audio duration must preserve the original
frame count; speech is never sped up or edited.

For an existing project with imported narration:

```powershell
node --env-file-if-exists=.env scripts/audio-layer.ts PROJECT_UUID NARRATION_UUID settings.json
```

Use the intended V3_DATA_DIR and V3_VIDEOS_DIR; experiments must use separate
directories. Enabling a mix appends a new immutable narration record containing
the original WAV/timing and a separate mixed WAV/hash/settings. It does not replace
the original voice bytes or create gates. The binding includes the mixed audio
hash and settings, invalidating older gate eligibility. Studio audio serving and
the guarded renderer select the same mixed track. Fresh exact-input human gates
and explicit export authorization remain required. No such real gates were
created for this retention experiment.

## Review renderer

`prepare-retention-review.ts` and `render-retention-review.ts` are deliberately
specific to the authorized Terra excerpt. Preparation checks exact source wording,
preserves the first 15 seconds of PCM samples and retains the hash-bound word
evidence. The review renderer uses the existing Remotion composition and produces
no production records. It renders once, reuses those PNGs for encoding/comparison,
checks fresh seeks, full decode, metadata and audio sync, and writes explicit
review-only provenance. It is not a replacement production export command.

The existing Remotion commercial-use question remains unresolved. Rendering a
local review does not decide licensing or grant publishing approval.
