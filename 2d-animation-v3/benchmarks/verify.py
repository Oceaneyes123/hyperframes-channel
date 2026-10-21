"""Verify only this isolated benchmark's existing media and save its evidence."""
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
records = []
for engine in ["remotion", "motion-canvas"]:
    directory = root / "benchmarks" / engine / "output"
    for label in ["cold", "warm-1", "warm-2", "warm-3"]:
        video = directory / f"{label}.mp4"
        probe = json.loads(subprocess.check_output([
            "ffprobe", "-v", "error", "-count_frames", "-show_streams",
            "-show_format", "-of", "json", str(video)
        ], text=True))
        stream = next(s for s in probe["streams"] if s["codec_type"] == "video")
        assert (stream["width"], stream["height"]) == (1080, 1920), (engine, label)
        assert stream["avg_frame_rate"] == "30/1" and int(stream["nb_read_frames"]) == 360, (engine, label, stream)
        assert abs(float(probe["format"]["duration"]) - 12) < .001
        assert not any(s["codec_type"] == "audio" for s in probe["streams"])
        # Null muxer decodes every frame without creating an output media file.
        decoded = subprocess.run([
            "ffmpeg", "-v", "error", "-i", str(video), "-f", "null", "NUL" if os.name == "nt" else "/dev/null"
        ], capture_output=True, text=True)
        assert decoded.returncode == 0 and not decoded.stderr.strip(), decoded.stderr
        records.append({
            "engine": engine, "run": label, "bytes": video.stat().st_size,
            "sha256": hashlib.sha256(video.read_bytes()).hexdigest(), "frames": 360,
            "fps": "30/1", "width": 1080, "height": 1920, "durationSeconds": 12,
            "audioStreams": 0, "fullDecode": "PASS", "codec": stream["codec_name"],
        })
    comparisons = []
    for frame in [0, 59, 60, 89, 90, 179, 180, 269, 270, 359]:
        if engine == "remotion":
            original = directory / f"base-{frame}.png"
            variant = directory / f"variant-{frame}.png"
        else:
            original = directory / "still/base" / f"{frame:06d}.png"
            variant = directory / "still/variant" / f"{frame:06d}.png"
        same = hashlib.sha256(original.read_bytes()).digest() == hashlib.sha256(variant.read_bytes()).digest()
        assert same == (not 180 <= frame < 270), (engine, frame, same)
        comparisons.append({"frame": frame, "unchangedByShot3Edit": same})
    (directory / "targeted-edit-check.json").write_text(json.dumps({"status": "PASS", "frames": comparisons}, indent=2) + "\n")
    state = (directory / "seek-observation.txt").read_text()
    hashes = re.findall(r'"frame": (\d+),\s*"sha256": "([a-f0-9]{64})"', state)
    assert len(hashes) == 8 and hashes[1][1] == hashes[7][1], (engine, "seek evidence")
    (directory / "seek-check.json").write_text(json.dumps({
        "status": "PASS", "observedFrom": "authored preview UI accessibility state",
        "scope": "React SVG DOM" if engine == "remotion" else "Canvas PNG data",
        "frames": [{"frame": int(frame), "sha256": digest} for frame, digest in hashes],
    }, indent=2) + "\n")
    assert len({r["sha256"] for r in records if r["engine"] == engine}) == 1, (engine, "repeat export hash drift")
    print(f"{engine}: four full decodes, exact metadata, repeat hashes, targeted edit and seek PASS")

report = {
    "schemaVersion": 1, "verifiedOn": "2026-10-21",
    "environment": json.loads((root / "docs/phase0/renderer-environment.json").read_text(encoding="utf-8-sig")),
    "exports": records,
}
(root / "docs/phase0/renderer-export-verification.json").write_text(json.dumps(report, indent=2) + "\n")
