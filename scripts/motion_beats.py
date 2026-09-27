"""Validate measured, scene-local motion cues; never infer word timing."""
import hashlib
import json
import math
from pathlib import Path


def load_beats(project: Path) -> dict:
    source = project / 'motion_beats.json'
    if not source.exists():
        return {}
    data = json.loads(source.read_text(encoding='utf-8'))
    if data.get('schema') != 'hyperframes-channel/motion-beats@1':
        raise ValueError('Unsupported motion beat schema')
    meta = json.loads((project / 'audio_meta.json').read_text(encoding='utf-8'))
    scenes = {s['id']: s for s in meta['scenes']}
    result = {}
    for sid, record in data['scenes'].items():
        if sid not in scenes:
            raise ValueError(f'Unknown beat scene: {sid}')
        scene = scenes[sid]
        wav = (project / scene['audio_path']).resolve()
        if not wav.is_relative_to(project.resolve()):
            raise ValueError('Audio must remain inside the project')
        if hashlib.sha256(wav.read_bytes()).hexdigest() != record['audio_sha256']:
            raise ValueError(f'{sid}: audio changed; realign cues')
        if record.get('source') not in ('word-alignment', 'manual-audio-review'):
            raise ValueError(f'{sid}: cues need audio-derived provenance')
        cues = record['cues']
        if not cues or any(not isinstance(t, (float, int)) or isinstance(t, bool) or not math.isfinite(t) or not 0 <= t < scene['duration_s'] for t in cues.values()):
            raise ValueError(f'{sid}: cues must be finite scene-local seconds inside the WAV')
        result[sid] = cues
    return result
