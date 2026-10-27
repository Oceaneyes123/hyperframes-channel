"""Exercise adapter dispatch with fake model modules; no model download or speech claim."""
import json
import runpy
import sys
import tempfile
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import patch


def check(size):
    calls = []
    model = SimpleNamespace(model=SimpleNamespace(tts_model_type="custom_voice", tts_model_size=size))
    model.generate_custom_voice = lambda **kwargs: (calls.append(kwargs) or [[0.1]], 24000)
    qwen = ModuleType("qwen_tts")
    qwen.Qwen3TTSModel = SimpleNamespace(from_pretrained=lambda *args, **kwargs: model)
    torch = ModuleType("torch")
    torch.float32, torch.float16, torch.__version__ = "float32", "float16", "fixture"
    torch.manual_seed = lambda seed: None
    soundfile = ModuleType("soundfile")
    soundfile.write = lambda path, samples, rate, subtype: Path(path).write_bytes(b"fixture")
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        request = {"provider": "qwen3-custom", "modelPath": temp, "text": "Hello", "device": "cpu", "seed": 3, "voice": "Ryan", "version": "fixture", "delivery": "Speak with energy"}
        (root / "request.json").write_text(json.dumps(request), encoding="utf-8")
        args = ["scripts/local-narration.py", str(root / "request.json"), str(root / "audio.wav")]
        with patch.dict(sys.modules, {"qwen_tts": qwen, "torch": torch, "soundfile": soundfile}), patch.object(sys, "argv", args), patch("importlib.metadata.version", return_value="fixture"):
            if size == "1b7":
                runpy.run_path(args[0], run_name="__main__")
                assert calls[0]["speaker"] == "Ryan" and calls[0]["instruct"] == "Speak with energy"
                assert (root / "runtime.json").is_file()
            else:
                try:
                    runpy.run_path(args[0], run_name="__main__")
                except ValueError as error:
                    assert "1.7B" in str(error) and not calls
                else:
                    raise AssertionError("0.6B model must not claim instruction support")


check("1b7")
check("0b6")
