"""Decode approved output and compare sampled frames with the frozen preview."""
from pathlib import Path
import hashlib
import json
import subprocess
from PIL import Image, ImageChops, ImageDraw, ImageStat
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent
PROJECT = OUT.parent
VIDEO = OUT / "video.mp4"
WORK = OUT / "independent-encoded-review"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, check=True)
    return result.stdout, result.stderr


def main():
    assert OUT.name == "output" and WORK.parent == OUT
    WORK.mkdir(exist_ok=True)
    data, _ = run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", str(VIDEO)])
    streams = json.loads(data)["streams"]
    video = next(x for x in streams if x["codec_type"] == "video")
    audio = next(x for x in streams if x["codec_type"] == "audio")
    assert (video["width"], video["height"], video["avg_frame_rate"]) == (1080, 1920, "30/1")
    assert int(video["nb_frames"]) == 2999
    assert abs(float(video["duration"]) - float(audio["duration"])) < 1/30
    approved = json.loads((PROJECT / "review/reviewer.json").read_text())
    assert sha(PROJECT / "comp.html") == approved["inputs"]["comp.html"]
    movie_hash = sha(VIDEO)
    captures = json.loads((PROJECT / "quality/film-capture-check.json").read_text())
    requests = [("opening", 0.0)] + [(f"line-{x['line']:02d}-result", x["time_s"]) for x in captures["captures"] if x["phase"] == "result"]
    requests += [("corrected-separation", 7.627), ("corrected-outward-route", 15.162), ("corrected-inward-route", 24.389),
                 ("corrected-alternative-return", 77.734), ("corrected-ending-route", 88.076), ("last-frame", 2998/30)]
    selected = {min(2998, round(t*30)): {"label": label, "requested_s": t} for label, t in requests}
    indices = sorted(selected)
    select = "+".join(f"eq(n\\,{n})" for n in indices)
    command = ["ffmpeg", "-v", "error", "-nostdin", "-y", "-i", str(VIDEO), "-map", "0:v:0", "-vf", "select=" + select,
               "-fps_mode", "vfr", str(WORK / "encoded-%02d.png")]
    _, extraction_errors = run(command)
    assert not extraction_errors.strip()
    assert len(list(WORK.glob("encoded-*.png"))) == len(indices)
    _, decode_errors = run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(VIDEO), "-f", "null", "-"])
    assert not decode_errors.strip()
    report = {"reviewer_agent_id": "/root/quality_reviewer", "animator_agent_id": "/root/animator", "date": "2026-10-16",
              "scope": "Independent encoded-frame and stream review; no new video render, source changes or audible listening",
              "video_path": str(VIDEO), "video_sha256": movie_hash, "size_bytes": VIDEO.stat().st_size,
              "approved_comp_sha256": approved["inputs"]["comp.html"], "streams": streams,
              "video_frame_count": int(video["nb_frames"]), "full_video_audio_decode": "passed_no_decoder_errors",
              "visual_review": "pending_image_inspection", "samples": [], "findings": [],
              "limitations": ["Available tools do not support audible listening; encoded audio pronunciation and voice quality are not judged.",
                              "Reference frames are sharp __seek states; intentional 180-degree shutter averaging and H.264 compression prevent pixel-identical comparison."]}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width":1080,"height":1920})
            page.goto((PROJECT / "comp.html").as_uri())
            page.evaluate("async()=>await __ready")
            for position, index in enumerate(indices, 1):
                at = index/30
                page.evaluate("t=>__seek(t)", at)
                reference = WORK / f"approved-{position:02d}.png"
                page.locator("#film").screenshot(path=str(reference))
                encoded = WORK / f"encoded-{position:02d}.png"
                first, second = Image.open(reference).convert("RGB"), Image.open(encoded).convert("RGB")
                assert first.size == second.size == (1080,1920)
                difference = sum(ImageStat.Stat(ImageChops.difference(first,second)).mean)/3
                sheet = Image.new("RGB", (720, 675), "#e9eaf0")
                draw = ImageDraw.Draw(sheet)
                draw.text((8,8),f"{selected[index]['label']} | frame {index} | {at:.4f}s",fill="#16334a")
                draw.text((8,29),"Approved sharp preview",fill="#16334a")
                draw.text((378,29),"Encoded MP4 (real shutter)",fill="#16334a")
                sheet.paste(first.resize((350,622)),(0,50))
                sheet.paste(second.resize((350,622)),(370,50))
                pair = WORK / f"pair-{position:02d}.png"
                sheet.save(pair)
                report["samples"].append({"frame":index,"time_s":at,**selected[index],"approved":str(reference.relative_to(OUT)),
                    "encoded":str(encoded.relative_to(OUT)),"pair":str(pair.relative_to(OUT)),"mean_absolute_rgb_error":difference})
        finally:
            browser.close()
    assert sha(VIDEO) == movie_hash
    assert sha(PROJECT / "comp.html") == approved["inputs"]["comp.html"]
    (OUT / "independent-encoded-review.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"video_sha256":movie_hash,"frames":len(indices),"streams":[video["codec_name"],audio["codec_name"]],"portrait":[video["width"],video["height"]],"full_decode":"passed","visual_review":"pending_image_inspection"}))


if __name__ == "__main__":
    main()
