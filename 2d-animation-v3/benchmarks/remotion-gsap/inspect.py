"""Compare all matched lossless frames and retain diagnostic differences."""
import json
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
output = root / "output" / (sys.argv[1] if len(sys.argv) > 1 else "measured")
differences = []
for frame in range(360):
    name = f"element-{frame:03d}.png"
    a = np.array(Image.open(output / "native" / "frames" / name).convert("RGB"), dtype=np.int16)
    b = np.array(Image.open(output / "gsap" / "frames" / name).convert("RGB"), dtype=np.int16)
    delta = np.abs(a - b)
    changed = int(np.any(delta > 0, axis=2).sum())
    if changed:
        differences.append({"frame": frame, "changedPixels": changed, "maxChannelDelta": int(delta.max()), "meanAbsoluteChannelDelta": float(delta.mean())})
report = {"framesCompared": 360, "identicalFrames": 360 - len(differences), "differences": differences}
(output / "pixel-comparison.json").write_text(json.dumps(report, indent=2) + "\n")
for row in differences:
    assert 60 <= row["frame"] < 89 or 180 < row["frame"] < 209, f"Settled pose differs: {row}"
    # GSAP rounds intermediate SVG attributes/matrices; tolerate only measured subpixel edges.
    assert row["changedPixels"] < 15000 and row["meanAbsoluteChannelDelta"] < 0.05 and row["maxChannelDelta"] <= 32, f"Unexplained visual difference: {row}"
windows = sorted(set(range(59, 92)) | set(range(174, 214)) | set(range(264, 277)))
sheet = Image.new("RGB", (13 * 108, ((len(windows) + 12) // 13) * 212), "#111820")
draw = ImageDraw.Draw(sheet)
for index, frame in enumerate(windows):
    x, y = index % 13 * 108, index // 13 * 212
    image = Image.open(output / "gsap" / "frames" / f"element-{frame:03d}.png").convert("RGB").resize((108, 192))
    sheet.paste(image, (x, y)); draw.text((x + 4, y + 194), str(frame), fill="white")
sheet.save(output / "transition-windows.png")
print(json.dumps({"framesCompared": 360, "identicalFrames": report["identicalFrames"], "differentFrames": len(differences), "worstChangedPixels": max((row["changedPixels"] for row in differences), default=0), "worstMeanAbsoluteChannelDelta": max((row["meanAbsoluteChannelDelta"] for row in differences), default=0)}))
