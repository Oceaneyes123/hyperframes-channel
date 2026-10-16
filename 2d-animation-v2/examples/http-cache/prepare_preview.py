"""Build this approved trial's measured PCM timeline and frozen board artwork."""
import hashlib
import json
from pathlib import Path
import re
import shutil
import wave

ROOT = Path(__file__).resolve().parent
SKILL = Path.home() / ".codex/skills/onetake"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    meta = json.loads((ROOT / "audio_meta.json").read_text())
    raw = (ROOT / "audio/alignment/words.json").read_bytes()
    # Native vo_tools uses the Windows locale for its output file.
    try:
        words = json.loads(raw.decode("utf-8"))
    except UnicodeDecodeError:
        words = json.loads(raw.decode("cp1252"))
    targets = {
        1: {"expired": "expired", "here": "still"},
        2: {"freshness": "freshness", "stored": "stored"},
        3: {"fresh": "fresh", "reuse": "reused", "without": "without"},
        4: {"stale": "stale", "retained": "deleted"},
        5: {"etag": "etag", "send": "sends", "conditional": "conditional"},
        6: {"compare": "match", "no_upload": "doesnt"},
        7: {"match": "matches", "status304": "3", "bodyless": "no", "reuse304": "reuses"},
        8: {"changed": "instead", "status200": "200", "new_body": "new", "store": "store"},
        9: {"rules": "instructions", "retained": "stored"},
        10: {"useful": "useful", "match": "matching", "reuse": "reuse"},
    }
    records, events, cursor, params, chunks = [], {}, 0.35, None, []
    for index, voice in enumerate(meta["voices"], 1):
        path = ROOT / voice["path"]
        with wave.open(str(path), "rb") as source:
            current = (source.getnchannels(), source.getsampwidth(), source.getframerate())
            assert params is None or params == current, "Source PCM formats differ"
            params = current
            duration = source.getnframes() / source.getframerate()
            pcm = source.readframes(source.getnframes())
        start = round(cursor * params[2]) / params[2]
        cues = []
        normalized = [re.sub(r"[^a-z0-9]", "", w[0].lower()) for w in words[str(index)]]
        for name, token in targets[index].items():
            # OneTake's uncorrected ASR spells line 7's three digits as 3/home/4.
            candidates = [i for i, value in enumerate(normalized) if value == token]
            if index == 7 and name == "status304" and not candidates:
                candidates = [i for i, value in enumerate(normalized) if value == "304"]
            assert candidates, (index, name, token, normalized)
            position = candidates[0]
            absolute = start + words[str(index)][position][1]
            key = f"l{index}_{name}"
            events[key] = absolute
            cues.append({"name": key, "phrase": words[str(index)][position][0],
                         "time_s": absolute, "method": "aligned",
                         "evidence": "audio/alignment/words.json",
                         "word_index": position, "source_sha256": sha(path)})
        records.append({"id": voice["id"], "start_s": start, "duration_s": duration,
                        "sha256": sha(path), "cues": cues})
        chunks.append((start, pcm))
        cursor = start + duration + (0.85 if index in (6, 7) else 0.45)
    ending = 3.0
    duration = round((records[-1]["start_s"] + records[-1]["duration_s"] + ending) * 30 + 0.5) / 30
    assert duration < 180
    mix = bytearray(round(duration * params[2]) * params[0] * params[1])
    previous_end = 0
    for (start, pcm), record in zip(chunks, records):
        at = round(start * params[2]) * params[0] * params[1]
        assert at >= previous_end and at + len(pcm) <= len(mix)
        mix[at:at + len(pcm)] = pcm
        previous_end = at + len(pcm)
    with wave.open(str(ROOT / "audio/narration.wav"), "wb") as output:
        output.setnchannels(params[0]); output.setsampwidth(params[1]); output.setframerate(params[2])
        output.writeframes(mix)
    beats = {"approved_storyboard_sha256": sha(ROOT / "STORYBOARD.md"),
             "timing_method": "Source WAV frame counts plus native OneTake faster-whisper-base word alignment",
             "alignment_note": "Line 7 raw status recognition is 3/home/4; pronunciation needs independent listening, not silent correction.",
             "narration": records, "events": events, "duration_s": duration,
             "ending_hold_s": ending, "captions": False, "sfx": False, "music": False}
    (ROOT / "motion_beats.json").write_text(json.dumps(beats, indent=2) + "\n", encoding="utf-8")
    (ROOT / "timeline.js").write_text("window.TIMELINE = " + json.dumps(beats) + ";\n", encoding="utf-8")
    meta["timeline_duration_s"] = duration
    meta["actual_starts_s"] = {r["id"]: r["start_s"] for r in records}
    for scene, record in zip(meta["scenes"], records):
        scene["start_s"] = record["start_s"]
    (ROOT / "audio_timeline.html").write_text("\n".join(
        f'<audio src="{v["path"]}" data-start="{r["start_s"]:.9f}" data-duration="{r["duration_s"]:.9f}" preload="none"></audio>'
        for v, r in zip(meta["voices"], records)) + "\n", encoding="utf-8")
    (ROOT / "audio_meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    assets = ROOT / "assets"
    assets.mkdir(exist_ok=True)
    board = (ROOT / "sketches/board.html").read_text(encoding="utf-8")
    for version, object_name in (("v7", "cache-body-v7"), ("v8", "alt-cache-body-v8")):
        match = re.search(r'<svg\b[^>]*data-object="' + object_name + r'"[^>]*>(.*?)</svg>', board, re.S)
        assert match, object_name
        svg = '<svg xmlns="http://www.w3.org/2000/svg" width="796" height="650" viewBox="142 723 796 650">' + match[1] + '</svg>\n'
        (assets / f"body-{version}.svg").write_text(svg, encoding="utf-8")
    shutil.copyfile(SKILL / "lib/motion.js", ROOT / "motion.js")
    shutil.copyfile(SKILL / "LICENSE", ROOT / "ONETAKE_LICENSE")
    (assets / "LICENSE.txt").write_text("Original geometric artwork extracted unchanged from the user-approved local board.\nBoard SHA256: " + sha(ROOT / "sketches/board.html") + "\n", encoding="utf-8")
    print(json.dumps({"duration_s": duration, "speech_s": sum(r["duration_s"] for r in records),
                      "passages": len(records), "aligned_cues": len(events), "pcm": params}, indent=2))


if __name__ == "__main__":
    main()
