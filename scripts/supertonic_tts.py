"""Generate per-scene Supertonic 3 narration for a HyperFrames project."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import numpy as np
from supertonic import TTS


def narration_lines(script: Path) -> list[tuple[str, str]]:
    chunks = re.split(r"^## Line (\d+).*?$", script.read_text(encoding="utf-8"), flags=re.M)
    lines = []
    for number, body in zip(chunks[1::2], chunks[2::2]):
        text = " ".join(line.strip() for line in body.splitlines() if line.startswith(("    ", "\t")))
        if text:
            lines.append((f"line-{number}", text))
    if not lines:
        raise ValueError(f"No '## Line N' sections found in {script}")
    return lines


def scene_sources(project: Path) -> list[tuple[str, str]]:
    """Return ordered scene ids and project-relative frame sources."""
    frames = sorted((project / "compositions" / "frames").glob("*.html"))
    return [(path.stem, str(path.relative_to(project)).replace("\\", "/")) for path in frames]


def existing_audio_starts(index: Path) -> dict[str, float]:
    if not index.exists():
        return {}
    starts = {}
    for tag in re.findall(r"<audio\b[^>]*>", index.read_text(encoding="utf-8"), flags=re.I):
        src = re.search(r'\bsrc=["\']([^"\']+)["\']', tag)
        start = re.search(r'\bdata-start=["\']([^"\']+)["\']', tag)
        if src and start:
            starts[src.group(1)] = float(start.group(1))
    return starts


def native_metadata(project: Path, voice: str, voices: list[dict[str, Any]], starts: dict[str, float] | None = None) -> dict[str, Any]:
    sources = scene_sources(project)
    if len(sources) != len(voices):
        raise ValueError(f"{project}: {len(voices)} narration lines but {len(sources)} frame files")
    cursor = 0.0
    scenes = []
    for index, ((scene_id, src), voice_data) in enumerate(zip(sources, voices), start=1):
        path = voice_data["path"]
        start_s = starts.get(path, cursor) if starts else cursor
        duration_s = voice_data["duration_s"]
        scenes.append({
            "index": index,
            "id": scene_id,
            "src": src,
            "audio_id": f"voice-{voice_data['id']}",
            "audio_path": path,
            "start_s": start_s,
            "duration_s": duration_s,
        })
        cursor = start_s + duration_s
    return {
        "schema": "hyperframes-channel/narration@1",
        "provider": "supertonic-3",
        "voice": voice,
        "timeline_duration_s": cursor,
        "voices": voices,
        "scenes": scenes,
    }


def timeline_html(scenes: list[dict[str, Any]]) -> str:
    return "\n".join(
        f'<audio id="{scene["audio_id"]}" src="{scene["audio_path"]}" data-start="{scene["start_s"]:.6f}" data-duration="{scene["duration_s"]:.6f}" data-track-index="10" data-volume="1"></audio>'
        for scene in scenes
    ) + "\n"


def sync_index_audio(index: Path, scenes: list[dict[str, Any]]) -> None:
    """Replace only audio timing attributes; scene markup and transitions stay owned by the project."""
    source = index.read_text(encoding="utf-8")
    tags = list(re.finditer(r"<audio\b[^>]*>", source, flags=re.I))
    if len(tags) != len(scenes):
        raise ValueError(f"{index}: expected {len(scenes)} audio elements, found {len(tags)}")
    for match, scene in reversed(list(zip(tags, scenes))):
        source = source[:match.start()] + timeline_html([scene]).rstrip() + source[match.end():]
    index.write_text(source, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", type=Path, default=Path.cwd())
    parser.add_argument("--script", type=Path, default=None)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--voice", default="M1")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--metadata-only", action="store_true", help="Upgrade an existing audio_meta.json without synthesizing audio")
    parser.add_argument("--sync-index", action="store_true", help="Update existing audio tags from the canonical metadata")
    args = parser.parse_args()

    project = args.project.resolve()
    script = (args.script or project / "SCRIPT.md").resolve()
    out = (args.out or project / ".media" / "audio" / "voice").resolve()
    lines = narration_lines(script)
    if args.dry_run:
        print(json.dumps({"project": str(project), "voice": args.voice, "lines": len(lines), "out": str(out)}, indent=2))
        return

    if args.metadata_only:
        existing = json.loads((project / "audio_meta.json").read_text(encoding="utf-8"))
        manifest = existing["voices"]
        if len(manifest) != len(lines):
            raise ValueError("Existing metadata does not match SCRIPT.md")
    else:
        out.mkdir(parents=True, exist_ok=True)
        tts = TTS(auto_download=True)
        style = tts.get_voice_style(voice_name=args.voice)
        manifest = []
        for line_id, text in lines:
            wav, duration = tts.synthesize(text, voice_style=style, lang="en")
            path = out / f"{line_id}.wav"
            tts.save_audio(wav, str(path))
            manifest.append({"id": line_id, "path": str(path.relative_to(project)).replace("\\", "/"), "duration_s": float(np.asarray(duration).reshape(-1)[0])})

    metadata = native_metadata(project, args.voice, manifest, existing_audio_starts(project / "index.html") if args.metadata_only else None)
    (project / "audio_meta.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    (project / "audio_timeline.html").write_text(timeline_html(metadata["scenes"]), encoding="utf-8")
    if args.sync_index:
        sync_index_audio(project / "index.html", metadata["scenes"])


if __name__ == "__main__":
    main()
