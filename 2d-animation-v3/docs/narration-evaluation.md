# Local narration evaluation reference

Load for adapter setup, take diagnostics or controlled provider evaluation. [Quality bar](quality-bar.md) owns voice acceptance; [alignment/audio](local-alignment-and-audio.md) owns alignment/mixing; [workflow CLI](workflow-efficiency.md#2-audition-once-then-generate-measured-narration) owns generation/import commands.

## Local narration evaluation

Current default/voice acceptance follows the [quality bar](quality-bar.md) and [audio reference](../../2d-animation/channel/AUDIO_VERSIONS.md). The adapters below describe evaluation capabilities, not automatic provider selection.

`server/narration/generation.ts` accepts provider, ordered segments, voice settings, pronunciation replacements and seed. Each attempt gets a new `narration-takes/` directory, preserving failures/earlier takes. Request an original line number for a separate audition; never silently splice it into approved audio.

| Adapter | Runtime | Recorded state |
| --- | --- | --- |
| Windows Speech | Installed System.Speech voice, PCM16 24 kHz | Actual local generation smoke passed |
| Chatterbox Turbo | Selected Python, cached model, reference WAV | Offline adapter; runtime/model comparison pending |
| Qwen3-TTS Base | Selected Python, cached model, reference WAV/transcript | Offline adapter; runtime/model comparison pending |
| Qwen3-TTS 1.7B CustomVoice | Selected Python, cached model, preset speaker | Delivery instructions supported; listening comparison pending |

Primary references: [Chatterbox](https://github.com/resemble-ai/chatterbox), [Turbo loader](https://github.com/resemble-ai/chatterbox/blob/master/src/chatterbox/tts_turbo.py), [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS). Listed code licences: MIT/Apache-2.0 respectively. Verify exact downloaded weights/reference-voice rights; Windows rights follow its licence. Adapters never install packages, fetch weights, switch providers or choose defaults implicitly.

```powershell
node scripts/evaluate-narration.ts .planning/2026-10-26-creative-quality-v1/narration-evaluation.json
```

Evaluation JSON supplies `outputDirectory`, shared `request` and `providers`. Python entries: `python`, `provider` (`chatterbox-turbo`, `qwen3-tts`, `qwen3-custom`), `modelPath`, exact revision `version`, `voice`, `referenceWav`, `referenceText`, `device` (`cpu`/`cuda`). CustomVoice uses a preset, omitting reference WAV/transcript. Inference is offline; failures record without substitution.

Recorded host: Ryzen 7 3700X, about 48 GiB RAM, GTX 1650-class 4096 MiB VRAM. A separate project-local Qwen environment used CPU Torch; the increment's model download/neural benchmarks remained in progress. These are historical observations, not current host verification.

Takes record provider/model/voice/licence, reference hash, supplied runtime metadata, source/spoken text, pronunciation, seed, raw diagnostics, normalized PCM16/SHA-256, measured sample/frame boundaries and latency. Peak normalization targets 0.89 full scale, not loudness mastering. Reject malformed/silent WAV; report clipping/quiet audio, leaving pronunciation/expression to listening.

Clone adapters lack delivery/rate control; Windows supports rate only. 1.7B CustomVoice forwards delivery instructions; reject 0.6B because it ignores them. Record capability flags/intent without claiming unsupported controls. Seeds cannot guarantee identical neural bytes across hardware/runtime.

Studio **Narration timing** generates/compares and explicitly imports accepted-script-bound complete takes; single-line auditions cannot import as full narration. CustomVoice settings: `V3_QWEN_PYTHON`, `V3_QWEN_MODEL_DIR`, `V3_QWEN_MODEL_VERSION`, `V3_QWEN_SPEAKER`, `V3_QWEN_DEVICE`. Segment boundaries are not word alignment. Verified-aligner imports require tool/version, exact audio/script hashes and human notes; legacy timing remains readable. Preserve existing provider preferences, imported audio and gates; listening selects voices.
