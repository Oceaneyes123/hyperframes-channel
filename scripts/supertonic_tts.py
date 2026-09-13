"""Generate continuous Supertonic 3 narration for a HyperFrames project."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from supertonic import TTS


def narration_lines(script: Path) -> list[tuple[str, str]]:
    chunks = re.split(r"^## Line (\d+).*?$", script.read_text(encoding="utf-8"), flags=re.M)
    lines = []
    for number, body in zip(chunks[1::2], chunks[2::2]):
        text = " ".join(line.strip() for line in body.splitlines() if line.strip())
        if text:
            lines.append((f"line-{number}", text))
    if not lines:
        raise ValueError(f"No '## Line N' sections found in {script}")
    return lines


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", type=Path, default=Path.cwd())
    parser.add_argument("--script", type=Path, default=None)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--voice", default="M1")
    parser.add_argument("--pause", type=float, default=0.22)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    project = args.project.resolve()
    script = (args.script or project / "SCRIPT.md").resolve()
    out = (args.out or project / ".media" / "audio" / "voice").resolve()
    lines = narration_lines(script)
    if args.dry_run:
        print(json.dumps({"project": str(project), "voice": args.voice, "lines": len(lines), "out": str(out)}, indent=2))
        return

    out.mkdir(parents=True, exist_ok=True)
    tts = TTS(auto_download=True)
    style = tts.get_voice_style(voice_name=args.voice)
    clips, manifest = [], []
    for line_id, text in lines:
        wav, duration = tts.synthesize(text, voice_style=style, lang="en")
        path = out / f"{line_id}.wav"
        tts.save_audio(wav, str(path))
        clips.append(np.asarray(wav, dtype=np.float32).reshape(-1))
        manifest.append({"id": line_id, "path": str(path.relative_to(project)).replace("\\", "/"), "duration_s": float(np.asarray(duration).reshape(-1)[0])})

    pause = np.zeros(int(44_100 * args.pause), dtype=np.float32)
    narration = np.concatenate([clip for pair in zip(clips, [pause] * (len(clips) - 1) + [np.array([], dtype=np.float32)]) for clip in pair])
    narration_path = out / "narration.wav"
    sf.write(narration_path, narration, 44_100)
    (project / "audio_meta.json").write_text(json.dumps({"provider": "supertonic-3", "voice": args.voice, "narration": str(narration_path.relative_to(project)).replace("\\", "/"), "total_duration_s": len(narration) / 44_100, "segments": manifest}, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
