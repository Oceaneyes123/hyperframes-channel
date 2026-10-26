"""Offline adapters. Install model dependencies separately; never download implicitly."""
import json
import sys
from importlib.metadata import version
from pathlib import Path


def main():
    request = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    output = Path(sys.argv[2])
    if output.exists() or not 0 < len(request["text"]) <= 4000:
        raise ValueError("New output and bounded narration text required")
    if not Path(request["referenceWav"]).is_file() or not Path(request["modelPath"]).is_dir():
        raise ValueError("Local model and reference WAV are required")
    import torch
    import soundfile as sf
    torch.manual_seed(request["seed"])
    if request["provider"] == "qwen3-tts":
        from qwen_tts import Qwen3TTSModel
        model = Qwen3TTSModel.from_pretrained(
            request["modelPath"], device_map=request["device"],
            dtype=torch.float32 if request["device"] == "cpu" else torch.float16,
            attn_implementation="eager", local_files_only=True,
        )
        audio, rate = model.generate_voice_clone(
            text=request["text"], language="English",
            ref_audio=request["referenceWav"], ref_text=request["referenceText"],
        )
        samples = audio[0]
    elif request["provider"] == "chatterbox-turbo":
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        model = ChatterboxTurboTTS.from_local(request["modelPath"], device=request["device"])
        samples = model.generate(request["text"], audio_prompt_path=request["referenceWav"]).detach().cpu().numpy().reshape(-1)
        rate = model.sr
    else:
        raise ValueError("Unsupported local provider")
    sf.write(str(output), samples, rate, subtype="PCM_16")
    output.with_name("runtime.json").write_text(json.dumps({
        "engineVersion": version("qwen-tts" if request["provider"] == "qwen3-tts" else "chatterbox-tts"),
        "torchVersion": torch.__version__, "voice": request["voice"],
        "device": request["device"], "modelRevisionSuppliedByOperator": request["version"],
    }), encoding="utf-8")


if __name__ == "__main__":
    main()
