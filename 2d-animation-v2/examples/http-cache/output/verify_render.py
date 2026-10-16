"""Verify this immutable approved OneTake export; write only beside the MP4."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent
PROJECT = OUT.parent
VIDEO = OUT / "video.mp4"


def run(argv):
    result = subprocess.run(argv, capture_output=True, text=True, encoding="utf-8")
    if result.returncode:
        raise RuntimeError(f"{argv!r}: {result.stderr}")
    return result


def pcm(path):
    with wave.open(str(path), "rb") as wav:
        assert wav.getsampwidth() == 2 and wav.getnchannels() == 1
        rate = wav.getframerate()
        samples = np.frombuffer(wav.readframes(wav.getnframes()), np.int16).astype(np.float64) / 32768
    return rate, samples


def main():
    probe = json.loads(run(["ffprobe", "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", str(VIDEO)]).stdout)
    (OUT / "ffprobe.json").write_text(json.dumps(probe, indent=2) + "\n", encoding="utf-8")
    video = next(s for s in probe["streams"] if s["codec_type"] == "video")
    audio = next(s for s in probe["streams"] if s["codec_type"] == "audio")
    duration = json.loads((PROJECT / "motion_beats.json").read_text())["duration_s"]
    frames = round(duration * 30)
    assert (video["width"], video["height"], video["avg_frame_rate"], video["pix_fmt"]) == (1080, 1920, "30/1", "yuv420p")
    assert int(video["nb_read_frames"]) == frames == int(video["nb_frames"])
    assert abs(float(video["duration"]) - duration) <= 1 / 30
    assert abs(float(audio["duration"]) - duration) <= 1 / 30
    decode = run(["ffmpeg", "-v", "error", "-xerror", "-i", str(VIDEO), "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"])
    (OUT / "full-decode.txt").write_text("PASS: complete video and audio decode; ffmpeg -xerror exit 0\n" + decode.stderr, encoding="utf-8")
    decoded = OUT / "decoded-narration.wav"
    assert not decoded.exists(), "Preserve existing decoded evidence before rerunning"
    run(["ffmpeg", "-v", "error", "-i", str(VIDEO), "-vn", "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", str(decoded)])
    rate, source = pcm(PROJECT / "audio/narration.wav")
    decoded_rate, actual = pcm(decoded)
    assert rate == decoded_rate == 44100
    n = min(len(source), len(actual))
    correlation = float(np.corrcoef(source[:n], actual[:n])[0, 1])
    assert correlation > .98, correlation
    passages = []
    for cue in json.loads((PROJECT / "motion_beats.json").read_text())["narration"]:
        start = round(cue["start_s"] * rate)
        end = round((cue["start_s"] + cue["duration_s"]) * rate)
        value = float(np.corrcoef(source[start:end], actual[start:end])[0, 1])
        assert value > .98, (cue["id"], value)
        passages.append({"id": cue["id"], "correlation": value, "start_s": cue["start_s"], "end_s": end / rate})
    tail_rms = float(np.sqrt(np.mean(actual[-2 * rate:] ** 2)))
    assert tail_rms < .001, tail_rms
    captures = OUT / "encoded-frames"
    captures.mkdir(exist_ok=True)
    times = [7.627, 15.162, 24.389, 77.734, 88.076, (frames - 1) / 30]
    indexes = [round(t * 30) for t in times]
    expression = "+".join(f"eq(n\\,{i})" for i in indexes)
    run(["ffmpeg", "-v", "error", "-i", str(VIDEO), "-vf", "select=" + expression,
         "-fps_mode", "vfr", "-frames:v", str(len(indexes)), str(captures / "encoded-%02d.png")])
    comparisons = []
    contact = Image.new("RGB", (390 * 6, 723), "#16334a")
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1920})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto((PROJECT / "comp.html").as_uri())
        page.evaluate("window.__ready")
        for ordinal, (requested, index) in enumerate(zip(times, indexes), 1):
            at = index / 30
            page.evaluate("t => __seek(t)", at)
            expected_path = captures / f"approved-{ordinal:02d}.png"
            page.locator("#film").screenshot(path=str(expected_path))
            encoded_path = captures / f"encoded-{ordinal:02d}.png"
            expected = np.asarray(Image.open(expected_path).convert("RGB"), dtype=np.float32)
            encoded = np.asarray(Image.open(encoded_path).convert("RGB"), dtype=np.float32)
            difference = float(np.abs(expected - encoded).mean())
            comparisons.append({"requested_s": requested, "frame_index": index, "frame_time_s": at,
                                "encoded": str(encoded_path.relative_to(OUT)), "approved": str(expected_path.relative_to(OUT)),
                                "mean_absolute_rgb_error": difference,
                                "note": "Moving frames legitimately differ from an instant seek because of real shutter blur."})
            contact.paste(Image.fromarray(encoded.astype(np.uint8)).resize((390, 693)), ((ordinal - 1) * 390, 30))
            ImageDraw.Draw(contact).text(((ordinal - 1) * 390 + 8, 9), f"Encoded frame {index}: {at:.3f}s", fill="white")
        browser.close()
        assert not errors, errors
    assert comparisons[-1]["mean_absolute_rgb_error"] < 3, comparisons[-1]
    contact.save(OUT / "encoded-contact.png")
    sys.path.insert(0, str(PROJECT.parents[1] / "scripts"))
    import studio
    studio.receipt(PROJECT, 1)
    studio.receipt(PROJECT, 2)
    result = {"video": str(VIDEO), "sha256": hashlib.sha256(VIDEO.read_bytes()).hexdigest(),
              "duration_s": duration, "frames": frames, "dimensions": [1080, 1920], "fps": "30/1",
              "full_decode": "PASS", "source_audio_correlation": correlation, "passage_correlations": passages,
              "source_samples": len(source), "decoded_samples": len(actual), "tail_2s_rms": tail_rms,
              "decoded_peak_dbfs": float(20*np.log10(np.max(np.abs(actual)) + 1e-12)),
              "decoded_clipped_samples": int(np.sum(np.abs(actual) >= 32767/32768)),
              "ending_frame": comparisons[-1], "frame_comparisons": comparisons,
              "approved_source_and_audit_receipts": "UNCHANGED: both current receipts pass",
              "render_settings": json.loads((OUT / "video.render.json").read_text()),
              "limits": ["AAC is lossy; correlations establish source placement/content, not audible listening.",
                         "Shutter frames differ legitimately from unblurred instant preview seeks.",
                         "No additional creative/source/audit files were changed."]}
    (OUT / "render-verification.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
