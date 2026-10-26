# Findings
- No .codegraph directory at workspace or v3 root; use targeted source searches.
- Existing art-direction, scene templates, layout repetition, phone-size graphics review, motion pacing/repetition/holds/camera checks already exist. Extend rather than duplicate.
- Existing edits in inspect-graphics, graphics/visual tests, visual-text, animation-workflow must be preserved.
- Historical memory confirms strict JSON, asset hashes, immutable artifacts and human gates; current source is authoritative.

- Canonical CQ rules and user-approved corrections are frozen into new writing, selected-section, visual and motion artifacts. Activating rules does not rewrite or stale accepted source artifacts.
- Existing storyboardHash is the SHA-256 of the saved pretty-printed file, not compact reserialization. Comparison loader now supplies the exact byte hash; regression tests cover this distinction.
- Aesthetic concerns need explicit review, while numeric containment/alignment and source/audio contracts remain structural blockers.
- Local GPU read with nvidia-smi: GTX 1650 class, 4096 MiB. Windows Python has soundfile but no Torch/chatterbox/qwen_tts.
- Windows fallback succeeded outside sandbox; exact runtime metadata and raw/normalized signal diagnostics retained. Capabilities disclose unsupported expressive controls; no default changed.
