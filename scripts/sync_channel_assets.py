"""Copy versioned channel assets into projects so HyperFrames can serve them locally."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def sync(project: Path) -> None:
    destination = project / "channel"
    destination.mkdir(exist_ok=True)
    shutil.copy2(ROOT / "channel" / "styles.css", destination / "styles.css")


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
