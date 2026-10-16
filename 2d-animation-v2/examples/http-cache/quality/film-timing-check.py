"""Independently check source WAV, alignment and lossless mix provenance."""
from pathlib import Path
import hashlib
import json
import math
import wave

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pcm(path):
    with wave.open(str(path), "rb") as wav:
        return (wav.getnchannels(), wav.getsampwidth(), wav.getframerate()), wav.readframes(wav.getnframes())


def main():
    meta = json.loads((PROJECT / "audio_meta.json").read_text(encoding="utf-8"))
    beats = json.loads((PROJECT / "motion_beats.json").read_text(encoding="utf-8"))
    raw = (PROJECT / "audio/alignment/words.json").read_bytes()
    try:
        words = json.loads(raw.decode("utf-8"))
    except UnicodeDecodeError:
        words = json.loads(raw.decode("cp1252"))
    clone = PROJECT.parents[2] / "2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json"
    style_hash = sha(clone)
    params, actual = pcm(PROJECT / "audio/narration.wav")
    expected = bytearray(len(actual))
    assert len(meta["voices"]) == len(beats["narration"]) == 10
    report = {"status": "passed", "scope": "WAV and cue provenance only; no human listening or film review",
              "pcm": params, "clone_sha256": style_hash, "passages": [], "aligned_cues": 0}
    end = 0
    for i, (voice, passage) in enumerate(zip(meta["voices"], beats["narration"]), 1):
        source = PROJECT / voice["path"]
        current, data = pcm(source)
        duration = len(data) / (current[0] * current[1] * current[2])
        assert current == params
        assert voice["id"] == passage["id"] == f"line-{i}"
        assert voice["voice_style_sha256"] == style_hash
        assert math.isfinite(duration) and abs(duration - voice["duration_s"]) < 1 / params[2]
        assert abs(duration - passage["duration_s"]) < 1 / params[2]
        assert sha(source) == passage["sha256"] == sha(PROJECT / f"audio/alignment/t{i}.wav")
        start = passage["start_s"]
        assert math.isfinite(start) and start >= end
        at = round(start * params[2]) * params[0] * params[1]
        expected[at:at + len(data)] = data
        for cue in passage["cues"]:
            word = words[str(i)][cue["word_index"]]
            assert cue["method"] == "aligned"
            assert cue["source_sha256"] == passage["sha256"]
            assert abs(cue["time_s"] - start - word[1]) < 1 / params[2]
            assert cue["phrase"] == word[0]
            assert start <= cue["time_s"] <= start + duration
            report["aligned_cues"] += 1
        report["passages"].append({"id": voice["id"], "source": voice["path"], "sha256": sha(source),
                                   "start_s": start, "duration_s": duration, "gap_before_s": start - end})
        end = start + duration
    assert bytes(expected) == actual, "Derived mix differs from source PCM placement"
    mix_duration = len(actual) / (params[0] * params[1] * params[2])
    assert abs(mix_duration - beats["duration_s"]) <= 1 / params[2]
    assert sha(PROJECT / "STORYBOARD.md") == beats["approved_storyboard_sha256"]
    report.update({"speech_s": sum(v["duration_s"] for v in meta["voices"]),
                   "timeline_duration_s": mix_duration, "ending_after_last_source_s": mix_duration - end,
                   "mix_sha256": sha(PROJECT / "audio/narration.wav"), "alignment_words_sha256": sha(PROJECT / "audio/alignment/words.json"),
                   "alignment_log_sha256": sha(PROJECT / "tool-evidence/phrase-alignment.txt"),
                   "pronunciation_human_check": {"time_s": beats["events"]["l7_status304"], "raw_tokens": words["7"][9:12],
                                                  "reason": "ASR hears 3/home/4; cannot establish audible pronunciation without supported audio input or a human."}})
    (HERE / "film-timing-check.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("status", "speech_s", "timeline_duration_s", "ending_after_last_source_s", "aligned_cues")}))


if __name__ == "__main__":
    main()
