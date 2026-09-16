"""Fail fast when a channel project drifts from narration, design, or approval contracts."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DESIGN_VERSION = re.search(r'^version:\s*["\']?([^"\'\n]+)', (ROOT / "DESIGN.md").read_text(encoding="utf-8"), re.M).group(1)


def attr(tag: str, name: str) -> str | None:
    match = re.search(rf'\b{re.escape(name)}=["\']([^"\']+)["\']', tag)
    return match.group(1) if match else None


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate(project: Path) -> list[str]:
    errors: list[str] = []
    for name in ("BRIEF.md", "SCRIPT.md", "STORYBOARD.md", "ICON_PLAN.json", "index.html", "audio_meta.json", "audio_timeline.html", "channel.json"):
        if not (project / name).exists():
            fail(errors, f"missing {name}")
    if errors:
        return errors

    channel = json.loads((project / "channel.json").read_text(encoding="utf-8"))
    if channel.get("design") != "hyperframes-channel" or channel.get("design_version") != DESIGN_VERSION:
        fail(errors, f"channel.json must declare hyperframes-channel design version {DESIGN_VERSION}")
    approval = project / "review" / "storyboard-approval.json"
    if not approval.exists():
        fail(errors, "missing persisted storyboard approval")
    else:
        approval_data = json.loads(approval.read_text(encoding="utf-8"))
        if approval_data.get("status") != "legacy-recorded":
            if approval_data.get("icon_plan") != "ICON_PLAN.json" or not approval_data.get("sketches"):
                fail(errors, "approval must record the icon plan and production-icon sketches")
            elif any(not (project / sketch).exists() for sketch in approval_data["sketches"]):
                fail(errors, "approval references a missing sketch")

    icon_plan = json.loads((project / "ICON_PLAN.json").read_text(encoding="utf-8"))
    icons = icon_plan.get("icons", [])
    if not icons:
        fail(errors, "ICON_PLAN.json needs at least one production icon")
    for icon in icons:
        if icon.get("provider") not in {"fontawesome", "icons8"} or icon.get("role") not in {"system", "hero"}:
            fail(errors, "icon plan entries need a supported provider and role")
        if not isinstance(icon.get("path"), str) or not (project / icon["path"]).exists():
            fail(errors, f"icon plan asset is missing: {icon.get('path')}")
        if icon.get("provider") == "icons8" and not icon.get("source"):
            fail(errors, "Icons8 icon plan entries need a source/attribution URL")

    metadata = json.loads((project / "audio_meta.json").read_text(encoding="utf-8"))
    scenes = metadata.get("scenes", [])
    voices = metadata.get("voices", [])
    if metadata.get("schema") != "hyperframes-channel/narration@1":
        fail(errors, "audio_meta.json is not native channel narration metadata")
    if len(scenes) != len(voices) or not scenes:
        fail(errors, "audio metadata needs one voice and scene per narration line")

    frame_paths = sorted(str(path.relative_to(project)).replace("\\", "/") for path in (project / "compositions" / "frames").glob("*.html"))
    if [scene.get("src") for scene in scenes] != frame_paths:
        fail(errors, "audio metadata scene sources do not match compositions/frames")
    expected_start = 0.0
    for position, scene in enumerate(scenes, start=1):
        if scene.get("index") != position or scene.get("audio_id") != f"voice-line-{position}":
            fail(errors, f"scene {position} has unstable ids")
        if abs(float(scene.get("start_s", -1)) - expected_start) > 0.001 and position == 1:
            fail(errors, "first scene must start at zero")
        expected_start = float(scene.get("start_s", 0)) + float(scene.get("duration_s", 0))

    index = (project / "index.html").read_text(encoding="utf-8")
    audio = re.findall(r"<audio\b[^>]*>", index, re.I)
    if len(audio) != len(scenes):
        fail(errors, "index.html audio elements do not match narration scenes")
    seen_ids: set[str] = set()
    for scene, tag in zip(scenes, audio):
        audio_id = attr(tag, "id")
        if audio_id in seen_ids or not audio_id:
            fail(errors, "audio element ids must be unique")
        seen_ids.add(audio_id)
        if attr(tag, "src") != scene["audio_path"]:
            fail(errors, f"{scene['id']}: audio path differs from audio_meta.json")
        for key, metadata_key in (("data-start", "start_s"), ("data-duration", "duration_s")):
            try:
                if abs(float(attr(tag, key) or "nan") - float(scene[metadata_key])) > 0.001:
                    fail(errors, f"{scene['id']}: {key} differs from audio_meta.json")
            except ValueError:
                fail(errors, f"{scene['id']}: missing numeric {key}")
    expected_timeline = "\n".join(
        f'<audio id="{scene["audio_id"]}" src="{scene["audio_path"]}" data-start="{scene["start_s"]:.6f}" data-duration="{scene["duration_s"]:.6f}" data-track-index="10" data-volume="1"></audio>'
        for scene in scenes
    ) + "\n"
    if (project / "audio_timeline.html").read_text(encoding="utf-8") != expected_timeline:
        fail(errors, "audio_timeline.html is out of sync with audio_meta.json")

    for source in frame_paths:
        frame = (project / source).read_text(encoding="utf-8")
        if '@import url("channel/styles.css")' not in frame or "var(--hf-ink)" not in frame:
            fail(errors, f"{source}: missing enforced channel stylesheet baseline")
    if not (project / "channel" / "styles.css").exists() or (project / "channel" / "styles.css").read_bytes() != (ROOT / "channel" / "styles.css").read_bytes():
        fail(errors, "project channel stylesheet is missing or out of sync")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", type=Path)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    projects = sorted((ROOT / "videos").iterdir()) if args.all else [args.project]
    if not all(projects) or any(project is None for project in projects):
        parser.error("pass --project or --all")
    errors = {str(project): validate(project.resolve()) for project in projects if project.is_dir()}
    failures = {project: messages for project, messages in errors.items() if messages}
    if failures:
        for project, messages in failures.items():
            print(project)
            for message in messages:
                print(f"  - {message}")
        raise SystemExit(1)
    print(f"validated {len(errors)} project(s)")


if __name__ == "__main__":
    main()
