"""Record actual-WAV word timestamps for the project's decision cues."""
import json
import sys
from pathlib import Path
from faster_whisper import WhisperModel

project = Path(__file__).resolve().parent
meta = json.loads((project / 'audio_meta.json').read_text())
model = WhisperModel('base', device='cpu', compute_type='int8', local_files_only=True)
results = {}
for scene in meta['scenes']:
    if sys.argv[1:] and str(scene['index']) not in sys.argv[1:]:
        continue
    segments, info = model.transcribe(str(project / scene['audio_path']), language='en',
                                      beam_size=5, word_timestamps=True,
                                      condition_on_previous_text=False)
    words = [{'word': w.word.strip(), 'start': w.start, 'end': w.end, 'probability': w.probability}
             for segment in segments for w in segment.words]
    results[scene['id']] = words
    print(scene['id'], ' '.join(f"{w['start']:.2f}:{w['word']}" for w in words), flush=True)
(project / 'review' / ('word-alignment-retry.json' if sys.argv[1:] else 'word-alignment.json')).write_text(json.dumps(results, indent=2) + '\n')
