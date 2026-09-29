#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.tools/supertonic-voice-cloning"
export PATH="$PWD/data/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/wsl/lib"
export HF_HOME="$PWD/data/huggingface"
export TORCH_HOME="$PWD/data/torch"
export TORCHINDUCTOR_CACHE_DIR="$PWD/data/inductor"
export TRITON_CACHE_DIR="$PWD/data/triton"
export TMPDIR="$PWD/data/tmp"
mkdir -p "$TMPDIR"
exec .venv-wsl/bin/python -u src/invert.py \
  --reference ../../reference/voice.wav \
  --onnx-dir ../supertonic3-model/onnx \
  --init-voice ../supertonic3-model/onnx/voice_styles/M1.json \
  --output ../supertonic3-model/clone-work/channel-voice.json \
  --batch-size 2 --save-at 500 --z-ref-iters 500 "$@"
