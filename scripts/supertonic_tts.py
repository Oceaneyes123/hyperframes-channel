"""Generate per-scene Supertonic 3 narration for a HyperFrames project."""

from __future__ import annotations
import argparse, json, re, wave
from pathlib import Path
from typing import Any
from narration_text import prepare_narration


def narration_lines(script: Path) -> list[tuple[str, str]]:
    text = script.read_text(encoding="utf-8")
    headers = list(re.finditer(r"^## Line (\d+)(?:[ \t].*)?$", text, flags=re.M))
    if not headers:
        raise ValueError(f"No '## Line N' sections found in {script}")
    numbers = [int(m.group(1)) for m in headers]
    if numbers != list(range(1, len(numbers) + 1)) or len(set(numbers)) != len(numbers):
        raise ValueError(
            f"{script}: Line sections must be unique and contiguous starting at 1"
        )
    lines = []
    for index, header in enumerate(headers):
        body = text[
            header.end() : (
                headers[index + 1].start() if index + 1 < len(headers) else len(text)
            )
        ]
        spoken = " ".join(
            line.strip()
            for line in body.splitlines()
            if line.startswith(("    ", "\t"))
        )
        if not spoken:
            raise ValueError(
                f"{script}: Line {numbers[index]} has no indented narration"
            )
        lines.append((f"line-{numbers[index]}", spoken))
    return lines


def scene_sources(
    project: Path, lines: list[tuple[str, str]] | None = None
) -> list[tuple[str, str]]:
    frames = sorted(
        (project / "compositions" / "frames").glob("*.html"),
        key=lambda p: (
            (
                int(re.search(r"\d+", p.stem).group())
                if re.search(r"\d+", p.stem)
                else 10**9
            ),
            p.name,
        ),
    )
    if frames:
        return [
            (p.stem, str(p.relative_to(project)).replace("\\", "/")) for p in frames
        ]
    if lines is None:
        raise ValueError("lines are required when no frame files exist")
    return [(line_id, f"compositions/frames/{line_id}.html") for line_id, _ in lines]


def existing_audio_starts(index: Path) -> dict[str, float]:
    if not index.exists():
        return {}
    starts = {}
    for tag in re.findall(
        r"<audio\b[^>]*>", index.read_text(encoding="utf-8"), flags=re.I
    ):
        src = re.search(r'\bsrc=["\']([^"\']+)', tag)
        start = re.search(r'\bdata-start=["\']([^"\']+)', tag)
        if src and start:
            starts[src.group(1)] = float(start.group(1))
    return starts


def native_metadata(
    project: Path,
    voice: str,
    voices: list[dict[str, Any]],
    starts: dict[str, float] | None = None,
    lines: list[tuple[str, str]] | None = None,
    normalization: dict[str, Any] | None = None,
) -> dict[str, Any]:
    sources = scene_sources(project, lines)
    if len(sources) != len(voices):
        raise ValueError(
            f"{project}: {len(voices)} narration lines but {len(sources)} frame files"
        )
    cursor = 0.0
    scenes = []
    normalized_voices = []
    for index, ((scene_id, src), voice_data) in enumerate(
        zip(sources, voices), start=1
    ):
        voice_data = {**voice_data, "frame": voice_data.get("frame", index)}
        normalized_voices.append(voice_data)
        path = voice_data["path"]
        start_s = starts.get(path, cursor) if starts else cursor
        scenes.append(
            {
                "index": index,
                "id": scene_id,
                "src": src,
                "audio_id": f"voice-{voice_data['id']}",
                "audio_path": path,
                "start_s": start_s,
                "duration_s": voice_data["duration_s"],
            }
        )
        cursor = start_s + voice_data["duration_s"]
    return {
        "schema": "hyperframes-channel/narration@1",
        "provider": "supertonic-3",
        "voice": voice,
        "timeline_duration_s": cursor,
        "voices": normalized_voices,
        "scenes": scenes,
        "normalization": normalization or {},
    }


def timeline_html(scenes: list[dict[str, Any]]) -> str:
    return (
        "\n".join(
            f'<audio id="{s["audio_id"]}" src="{s["audio_path"]}" data-start="{s["start_s"]:.6f}" data-duration="{s["duration_s"]:.6f}" data-track-index="10" data-volume="1"></audio>'
            for s in scenes
        )
        + "\n"
    )


def sync_index_audio(index: Path, scenes: list[dict[str, Any]]) -> None:
    source = index.read_text(encoding="utf-8")
    tags = list(
        re.finditer(r"<audio\b[^>]*>\s*</audio>|<audio\b[^>]*/?>", source, flags=re.I)
    )
    by_key = {s["audio_path"]: s for s in scenes} | {s["audio_id"]: s for s in scenes}
    replacements = []
    matched = set()
    for match in tags:
        tag = match.group()
        key = None
        for attr in ("src", "id"):
            found = re.search(rf'\b{attr}=["\']([^"\']+)', tag, flags=re.I)
            if found and found.group(1) in by_key:
                key = found.group(1)
                break
        if key:
            audio_id = by_key[key]["audio_id"]
            if audio_id in matched:
                raise ValueError(
                    f"{index}: duplicate narration audio tag for {audio_id}"
                )
            matched.add(audio_id)
            replacements.append((match, timeline_html([by_key[key]]).rstrip()))
    if len(replacements) != len(scenes):
        raise ValueError(
            f"{index}: could not match every narration audio path/id exactly once"
        )
    for match, replacement in reversed(replacements):
        source = source[: match.start()] + replacement + source[match.end() :]
    index.write_text(source, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", type=Path, default=Path.cwd())
    parser.add_argument("--script", type=Path)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--voice", default="M1")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--metadata-only", action="store_true")
    parser.add_argument("--sync-index", action="store_true")
    args = parser.parse_args()
    project = args.project.resolve()
    script = (args.script or project / "SCRIPT.md").resolve()
    out = (args.out or project / ".media" / "audio" / "voice").resolve()
    lines = narration_lines(script)
    prepared = prepare_narration(project, lines)
    if args.dry_run:
        print(
            json.dumps(
                {
                    "project": str(project),
                    "voice": args.voice,
                    "out": str(out),
                    **prepared,
                },
                indent=2,
            )
        )
        return
    if args.metadata_only:
        existing = json.loads((project / "audio_meta.json").read_text(encoding="utf-8"))
        manifest = existing.get("voices", [])
        if len(manifest) != len(lines):
            raise ValueError("Existing metadata does not match SCRIPT.md")
        expected = prepared["normalization"]["fingerprint"]
        old_fingerprint = existing.get("normalization", {}).get("fingerprint")
        if old_fingerprint and old_fingerprint != expected:
            raise ValueError(
                "Existing audio metadata has stale normalization provenance; synthesize audio again"
            )
        if any(
            v.get("normalization_fingerprint")
            and v["normalization_fingerprint"] != expected
            for v in manifest
        ):
            raise ValueError(
                "Existing voice provenance is stale; synthesize audio again"
            )
    else:
        try:
            out.relative_to(project)
        except ValueError:
            raise ValueError("--out must be inside the project")
        out.mkdir(parents=True, exist_ok=True)
        from supertonic import TTS

        tts = TTS(auto_download=True)
        style = tts.get_voice_style(voice_name=args.voice)
        manifest = []
        for record in prepared["lines"]:
            wav, _duration = tts.synthesize(
                record["spoken_text"], voice_style=style, lang="en"
            )
            path = out / f"{record['id']}.wav"
            tts.save_audio(wav, str(path))
            with wave.open(str(path), "rb") as audio:
                measured_duration = audio.getnframes() / audio.getframerate()
            manifest.append(
                {
                    "id": record["id"],
                    "path": str(path.relative_to(project)).replace("\\", "/"),
                    "duration_s": measured_duration,
                    **{k: record[k] for k in ("original_text", "spoken_text")},
                    "normalization_fingerprint": prepared["normalization"][
                        "fingerprint"
                    ],
                }
            )
    normalization = (
        existing.get("normalization", {})
        if args.metadata_only
        else prepared["normalization"]
    )
    metadata_voice = (
        existing.get("voice", args.voice) if args.metadata_only else args.voice
    )
    metadata = native_metadata(
        project,
        metadata_voice,
        manifest,
        existing_audio_starts(project / "index.html") if args.metadata_only else None,
        lines,
        normalization,
    )
    (project / "audio_meta.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
    )
    (project / "audio_timeline.html").write_text(
        timeline_html(metadata["scenes"]), encoding="utf-8"
    )
    if args.sync_index:
        sync_index_audio(project / "index.html", metadata["scenes"])


if __name__ == "__main__":
    main()
