"""Local ASR-derived word timing. Never downloads models or grants pronunciation approval."""
import argparse
import difflib
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import re


def normalize(word):
    return re.sub(r"[^a-z0-9]", "", word.casefold())


def map_words(lines, recognized):
    script = [{"lineNumber": i + 1, "scriptWord": j, "text": word}
              for i, line in enumerate(lines) for j, word in enumerate(line.split())]
    matcher = difflib.SequenceMatcher(None, [normalize(x["text"]) for x in script],
                                      [normalize(x["word"]) for x in recognized], autojunk=False)
    result = []
    for block in matcher.get_matching_blocks():
        for offset in range(block.size):
            source, heard = script[block.a + offset], recognized[block.b + offset]
            start, end = float(heard["start"]), float(heard["end"])
            if not 0 <= start < end:
                continue
            result.append({**source, "startSeconds": start, "endSeconds": end,
                           "startFrame": int(start * 30), "endFrame": max(int(start * 30) + 1, int(end * 30 + .999999)),
                           "probability": heard.get("probability"), "evidence": "ASR-derived"})
    matched = {(x["lineNumber"], x["scriptWord"]) for x in result}
    return result, [x for x in script if (x["lineNumber"], x["scriptWord"]) not in matched]


def self_test():
    words, missing = map_words(["A message arrives.", "Review it."], [
        {"word": "A", "start": 0, "end": .1}, {"word": "message", "start": .2, "end": .6},
        {"word": "arrives", "start": .7, "end": 1}, {"word": "it", "start": 1.3, "end": 1.5}])
    assert len(words) == 4 and missing == [{"lineNumber": 2, "scriptWord": 0, "text": "Review"}]
    assert words[2]["endFrame"] == 30 and words[0]["startFrame"] == 0
    assert not map_words(["Different"], [{"word": "wrong", "start": 0, "end": 1}])[0]
    print("Local alignment mapping self-test passed.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audio", type=Path)
    parser.add_argument("--script", type=Path)
    parser.add_argument("--model", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--line-timing", type=Path, help="Optional existing measured line segments; forces the exact transcript within each segment")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    if not all([args.audio, args.script, args.model, args.output]):
        parser.error("--audio, --script, --model and --output are required")
    if not args.model.is_dir() or not (args.model / "model.bin").is_file():
        parser.error("Supply an existing faster-whisper model directory; automatic downloads are disabled")
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    from faster_whisper import WhisperModel
    audio_bytes, script_bytes = args.audio.read_bytes(), args.script.read_bytes()
    content = script_bytes.decode("utf-8-sig")
    if args.script.suffix == ".json":
        content = json.loads(content)["content"]
    lines = content.splitlines()
    model = WhisperModel(str(args.model), device="cpu", compute_type="int8", cpu_threads=4, local_files_only=True)
    method = "ASR transcription with word timestamps"
    timing_hash = None
    if args.line_timing:
        from faster_whisper.audio import decode_audio, pad_or_trim
        from faster_whisper.tokenizer import Tokenizer
        audio = decode_audio(str(args.audio), sampling_rate=16000)
        spans = json.loads(args.line_timing.read_text(encoding="utf-8-sig"))["segments"]
        if len(spans) != len(lines) or any(span["sourceText"] != lines[i] for i, span in enumerate(spans)):
            raise ValueError("Measured line segment text must exactly match the supplied script")
        tokenizer = Tokenizer(model.hf_tokenizer, model.model.is_multilingual, task="transcribe", language="en")
        recognized = []
        for span in spans:
            offset, end = span["startFrame"] / 30, span["endFrame"] / 30
            if not 0 <= offset < end <= len(audio) / 16000 + .001 or end - offset > 30:
                raise ValueError("Line timing must stay inside the audio and each segment must be at most 30 seconds")
            chunk = audio[round(offset * 16000):round(end * 16000)]
            features = model.feature_extractor(chunk)
            encoded = model.encode(pad_or_trim(features))
            aligned = model.find_alignment(tokenizer, [tokenizer.encode(" " + span["sourceText"])], encoded, len(chunk) // 160)[0]
            recognized.extend({"word": w["word"].strip(), "start": offset + w["start"], "end": offset + w["end"], "probability": w["probability"]} for w in aligned)
        duration = len(audio) / 16000
        method = "Exact-transcript forced cross-attention alignment inside supplied measured line segments"
        timing_hash = hashlib.sha256(args.line_timing.read_bytes()).hexdigest()
    else:
        segments, info = model.transcribe(str(args.audio), language="en", word_timestamps=True,
                                          beam_size=5, vad_filter=False, condition_on_previous_text=False)
        recognized = [{"word": w.word.strip(), "start": w.start, "end": w.end, "probability": w.probability}
                      for segment in segments for w in (segment.words or [])]
        duration = info.duration
    words, missing = map_words(lines, recognized)
    report = {"schemaVersion": 1, "kind": "ASR-derived timing evidence", "engine": "faster-whisper",
              "version": importlib.metadata.version("faster-whisper"), "modelDirectory": str(args.model.resolve()),
              "modelHash": hashlib.sha256((args.model / "model.bin").read_bytes()).hexdigest(),
              "audioHash": hashlib.sha256(audio_bytes).hexdigest(), "scriptHash": hashlib.sha256(script_bytes).hexdigest(),
              "durationSeconds": duration, "method": method, "lineTimingHash": timing_hash, "words": words, "unmatchedScriptWords": missing,
              "recognizedWords": recognized, "reviewedByHuman": False, "pronunciationApproved": False,
              "limitation": "ASR-derived evidence requires human timing review. Forced mode aligns supplied transcript tokens within measured line segments; lexical splits can remain unmatched. Unmatched words have no invented times. This does not satisfy production alignment or pronunciation approval."}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("x", encoding="utf-8") as output:
        json.dump(report, output, indent=2, ensure_ascii=False)
    print(json.dumps({"output": str(args.output), "matchedWords": len(words), "unmatchedWords": len(missing)}))


if __name__ == "__main__":
    main()
