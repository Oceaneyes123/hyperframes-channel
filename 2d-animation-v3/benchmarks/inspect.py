"""Make diagnostic contact sheets from the two verified benchmark exports."""
import json
import re
import statistics
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
summary = {}
for engine in ["remotion", "motion-canvas"]:
    output = root / "benchmarks" / engine / "output"
    boundary = output / "boundary"
    boundary.mkdir(exist_ok=True)
    subprocess.run([
        "ffmpeg", "-v", "error", "-i", str(output / "cold.mp4"),
        "-vf", "select='between(n,84,96)+between(n,174,186)+between(n,264,276)'",
        "-fps_mode", "vfr", str(boundary / "%03d.png")
    ], check=True)
    frames = list(range(84, 97)) + list(range(174, 187)) + list(range(264, 277))
    assert len(list(boundary.glob("*.png"))) == 39
    sheet = Image.new("RGB", (13 * 108, 3 * 216), "#111820")
    draw = ImageDraw.Draw(sheet)
    for index, frame in enumerate(frames):
        tile = Image.open(boundary / f"{index + 1:03d}.png").convert("RGB").resize((108, 192))
        x, y = (index % 13) * 108, (index // 13) * 216
        sheet.paste(tile, (x, y)); draw.text((x + 4, y + 194), f"{engine} {frame}", fill="white")
    sheet.save(output / "boundary-contact.png")
    overview = Image.new("RGB", (5 * 216, 2 * 408), "#111820")
    draw = ImageDraw.Draw(overview)
    for index, frame in enumerate([0, 59, 60, 89, 90, 179, 180, 269, 270, 359]):
        path = output / f"base-{frame}.png" if engine == "remotion" else output / "still/base" / f"{frame:06d}.png"
        x, y = (index % 5) * 216, (index // 5) * 408
        overview.paste(Image.open(path).convert("RGB").resize((216, 384)), (x, y))
        draw.text((x + 6, y + 388), f"{engine} frame {frame}", fill="white")
    overview.save(output / "overview.png")
    if engine == "remotion":
        metrics = json.loads((output / "render-metrics.json").read_text())["runs"]
    else:
        state = (output / "export-observation.txt").read_text()
        metrics = [{"label": label, "elapsedMs": float(elapsed), "memoryScope": "unavailable; browser/encoder memory not attributed"}
                   for label, elapsed in re.findall(r'"label": "([a-z0-9-]+)",\s*"elapsedMs": ([0-9.]+)', state)]
        assert len(metrics) == 4
        (output / "render-metrics.json").write_text(json.dumps({"engine": engine, "runs": metrics}, indent=2) + "\n")
    audit = json.loads((output / "dependency-audit.json").read_text(encoding="utf-8-sig"))["metadata"]["vulnerabilities"]
    summary[engine] = {"runs": metrics, "warmMedianMs": statistics.median(row["elapsedMs"] for row in metrics if row["label"].startswith("warm")),
                       "dependencyAudit": audit, "nativePreviewUrl": "http://127.0.0.1:3103/" if engine == "remotion" else "http://127.0.0.1:3104/preview.html"}
(root / "docs/phase0/renderer-metrics.json").write_text(json.dumps({"schemaVersion": 1, "scope": "Different native pipelines; not a controlled cross-engine speed/memory ranking", "engines": summary}, indent=2) + "\n")
print("Both 39-frame boundary sheets, overviews and measured summaries saved.")
