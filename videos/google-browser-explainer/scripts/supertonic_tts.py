"""Generate the locked narration locally with Supertonic 3."""

from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from supertonic import TTS


PROJECT = Path(__file__).resolve().parents[1]
SCRIPT = PROJECT / "SCRIPT.md"
OUT = PROJECT / ".media" / "audio" / "voice"
SAMPLE_RATE = 44_100


def lines() -> list[tuple[str, str]]:
    text = SCRIPT.read_text(encoding="utf-8")
    chunks = re.split(r"^## Line (\d+).*?$", text, flags=re.M)
    return [
        (f"line-{number}", re.search(r"^    (.+)$", body, re.M).group(1))
        for number, body in zip(chunks[1::2], chunks[2::2])
    ]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    tts = TTS(auto_download=True)
    style = tts.get_voice_style(voice_name="M1")
    clips: list[np.ndarray] = []
    manifest: list[dict[str, object]] = []

    for line_id, text in lines():
        wav, duration = tts.synthesize(text, voice_style=style, lang="en")
        path = OUT / f"{line_id}.wav"
        tts.save_audio(wav, str(path))
        clips.append(np.asarray(wav, dtype=np.float32).reshape(-1))
        manifest.append({"id": line_id, "path": str(path.relative_to(PROJECT)).replace("\\", "/"), "duration_s": float(np.asarray(duration).reshape(-1)[0])})

    silence = np.zeros(int(SAMPLE_RATE * 0.22), dtype=np.float32)
    narration = np.concatenate([item for pair in zip(clips, [silence] * len(clips)) for item in pair])
    narration_path = OUT / "narration.wav"
    sf.write(narration_path, narration, SAMPLE_RATE)
    (PROJECT / "audio_meta.json").write_text(
        json.dumps(
            {
                "provider": "supertonic-3",
                "voice": "M1",
                "narration": str(narration_path.relative_to(PROJECT)).replace("\\", "/"),
                "total_duration_s": len(narration) / SAMPLE_RATE,
                "voices": manifest,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
