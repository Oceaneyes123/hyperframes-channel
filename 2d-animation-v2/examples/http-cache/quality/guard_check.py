"""Exercise narration validation with a synthetic WAV, never TTS or render."""
from pathlib import Path
import importlib.util
import json
import math
import wave
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
V2 = HERE.parents[2]
spec = importlib.util.spec_from_file_location("studio_review", V2 / "scripts/studio.py")
studio = importlib.util.module_from_spec(spec)
spec.loader.exec_module(studio)


def main():
    project = HERE / "guard-fixture"
    project.mkdir(exist_ok=True)
    with wave.open(str(project / "source.wav"), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(8000)
        wav.writeframes(b"\x01\x01" * 8000)
    (project / "cue-evidence.txt").write_text("Synthetic fixture only, not real listened timing.\n")
    channel = V2.parent / "2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json"
    voice = {"id": "01", "path": "source.wav", "original_text": "Fixture.",
             "voice_style_sha256": studio.digest(channel), "duration_s": math.nan}
    cue = {"id": "01", "start_s": 0, "duration_s": math.nan,
           "sha256": studio.digest(project / "source.wav"),
           "cues": [{"time_s": .5, "method": "listened", "evidence": "cue-evidence.txt"}]}
    (project / "audio_meta.json").write_text(json.dumps({"voices": [voice]}))
    (project / "motion_beats.json").write_text(json.dumps({"narration": [cue]}))
    with patch.object(studio, "check_script", return_value=[("01", "Fixture.")]):
        try:
            studio.check_narration(project, 1)
            result = {"finding": "nonfinite_metadata_duration", "result": "accepted_NaN", "expected": "reject"}
        except ValueError as error:
            result = {"finding": "nonfinite_metadata_duration", "result": "rejected", "message": str(error)}
    voice["duration_s"] = cue["duration_s"] = 1
    cue["start_s"] = .25
    (project / "audio_meta.json").write_text(json.dumps({"voices": [voice]}))
    (project / "motion_beats.json").write_text(json.dumps({"narration": [cue]}))
    (project / "audio").mkdir(exist_ok=True)
    mix_path = project / "audio/narration.wav"
    def mix(data):
        with wave.open(str(mix_path), "wb") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(8000)
            wav.writeframes(data)
    mix(b"\0\0" * 2000 + b"\x01\x01" * 8000 + b"\0\0" * 6000)
    studio.check_mix(project)
    result["pcm_at_measured_start"] = "accepted_correct_placement"
    mix(b"\0\0" * 16000)
    try:
        studio.check_mix(project)
    except ValueError as error:
        result["silenced_mix"] = "rejected"
        result["silenced_mix_message"] = str(error)
    else:
        raise AssertionError("Silenced mix was accepted")
    (HERE / "guard-check.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result))


if __name__ == "__main__":
    main()
