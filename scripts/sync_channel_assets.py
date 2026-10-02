"""Copy versioned channel assets into projects so HyperFrames can serve them locally."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def sync(project: Path) -> None:
    channel_file = project / "channel.json"
    if not channel_file.exists():
        raise ValueError(f"{project}: missing channel.json; refusing to choose a design version")
    channel = json.loads(channel_file.read_text(encoding="utf-8"))
    version = str(channel.get("design_version", ""))
    root = ROOT / "channel" / "styles.css"
    if version == "1.0.0":
        root = ROOT / "channel" / "legacy" / "v1" / "styles.css"
    elif version != _design_version():
        raise ValueError(f"{project}: unsupported channel design version {version}")
    if not root.exists():
        raise FileNotFoundError(f"missing channel stylesheet for {version}: {root}")
    if channel.get("motion_version") is not None and (version != "2.0.0" or channel["motion_version"] != "1.0.0"):
        raise ValueError("Motion v1 requires design v2 and motion_version 1.0.0")
    destination = project / "channel"
    destination.mkdir(exist_ok=True)
    shutil.copy2(root, destination / "styles.css")
    if channel.get("motion_version") is not None:
        for name in ("motion.js", "motion-presets.js", "motion.css"):
            shutil.copy2(ROOT / "channel" / name, destination / name)
        shutil.copytree(ROOT / "channel" / "fonts", destination / "fonts", dirs_exist_ok=True)
        shutil.copytree(ROOT / "channel" / "artwork", destination / "artwork", dirs_exist_ok=True)


def _design_version() -> str:
    import re
    match = re.search(r"^version:\s*[\"']?([^\"'\n]+)", (ROOT / "DESIGN.md").read_text(encoding="utf-8"), re.M)
    return match.group(1) if match else ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", type=Path)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    projects = sorted((ROOT / "videos").iterdir()) if args.all else [args.project]
    if not all(projects) or any(project is None for project in projects):
        parser.error("pass --project or --all")
    for project in projects:
        if project.is_dir():
            sync(project.resolve())


if __name__ == "__main__":
    main()
