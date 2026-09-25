"""Assemble v2 source frames with local GSAP and canonical per-scene audio."""
from __future__ import annotations

import argparse
from html import escape
import json
import math
from pathlib import Path

from supertonic_tts import scene_sources


def assemble(project: Path) -> Path:
    project = project.resolve()
    channel = json.loads((project / "channel.json").read_text(encoding="utf-8"))
    if channel.get("design_version") != "2.0.0":
        raise ValueError("This assembler is for v2 portrait projects; retain the legacy workflow for v1")
    metadata = json.loads((project / "audio_meta.json").read_text(encoding="utf-8"))
    scenes = metadata.get("scenes", [])
    if not scenes or [s.get("src") for s in scenes] != [src for _, src in scene_sources(project, [])]:
        raise ValueError("Scene sources differ from frames; run supertonic_tts.py --metadata-only after naming frames")
    if not (project / "public/vendor/gsap.min.js").is_file():
        raise ValueError("Missing public/vendor/gsap.min.js; stage the local runtime before assembly")
    hosts, audio, seen = [], [], set()
    end = 0.0
    for audio_track, scene in enumerate(scenes, 10):
        start, duration = float(scene["start_s"]), float(scene["duration_s"])
        if not all(math.isfinite(n) for n in (start, duration)) or duration <= 0 or abs(start - end) > .001:
            raise ValueError("Scenes must have finite, positive, contiguous measured timing")
        for field in ("id", "audio_id"):
            identifier = scene[field]
            if not identifier or identifier in seen: raise ValueError("Scene and audio ids must be unique")
            seen.add(identifier)
        for field in ("src", "audio_path"):
            asset = (project / scene[field]).resolve()
            if not asset.is_relative_to(project) or not asset.is_file():
                raise ValueError(f"Missing or non-local {field}: {scene[field]}")
        sid, aid = escape(scene["id"], quote=True), escape(scene["audio_id"], quote=True)
        src, wav = escape(scene["src"], quote=True), escape(scene["audio_path"], quote=True)
        hosts.append(f'<div id="{sid}" class="scene clip" data-composition-id="{sid}" data-composition-src="{src}" data-start="{start:.6f}" data-duration="{duration:.6f}" data-track-index="1"></div>')
        audio.append(f'<audio id="{aid}" src="{wav}" data-start="{start:.6f}" data-duration="{duration:.6f}" data-track-index="{audio_track}" data-volume="1"></audio>')
        end = start + duration
    total = float(metadata["timeline_duration_s"])
    if not math.isfinite(total) or abs(total - end) > .001: raise ValueError("Total differs from measured scene timings")
    target = project / "index.html"
    source = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=1080,height=1920">
<title>{escape(project.name)}</title>
<script src="public/vendor/gsap.min.js"></script>
<style>*{{box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0B1020}}#root{{position:relative;width:1080px;height:1920px;background:#0B1020;overflow:hidden}}.scene{{position:absolute;inset:0;width:1080px;height:1920px}}</style>
</head><body>
<div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="{total:.6f}">
{chr(10).join(hosts)}
{chr(10).join(audio)}
</div>
<script>window.__timelines=window.__timelines||{{}};window.__timelines['main']=gsap.timeline({{paused:true}});</script>
</body></html>
'''
    # Validate all inputs before replacing the assembled file.
    temporary = target.with_suffix(".html.tmp")
    temporary.write_text(source, encoding="utf-8")
    temporary.replace(target)
    return target


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, required=True)
    args = parser.parse_args()
    print(assemble(args.project))
