import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from motion_beats import load_beats
from sync_channel_assets import sync


class MotionBeatChecks(unittest.TestCase):
    def test_motion_sync_is_opt_in_and_rejects_unknown_version_before_writing(self):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder)
            config = p / 'channel.json'
            config.write_text(json.dumps({'design_version': '2.0.0', 'motion_version': '9.0.0'}))
            with self.assertRaises(ValueError): sync(p)
            self.assertFalse((p / 'channel').exists())
            config.write_text(json.dumps({'design_version': '2.0.0'}))
            sync(p)
            self.assertFalse((p / 'channel/motion.js').exists())
            config.write_text(json.dumps({'design_version': '2.0.0', 'motion_version': '1.0.0'}))
            sync(p)
            self.assertTrue((p / 'channel/motion.js').is_file())
            self.assertTrue((p / 'channel/fonts/Barlow-Bold.ttf').is_file())

    def test_audio_fingerprint_and_cue_bounds(self):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder)
            (p / 'voice.wav').write_bytes(b'audio')
            (p / 'audio_meta.json').write_text(json.dumps({'scenes': [{'id': 's', 'duration_s': 2, 'audio_path': 'voice.wav'}]}))
            record = {'source': 'word-alignment', 'audio_sha256': hashlib.sha256(b'audio').hexdigest(), 'cues': {'word': 1.2}}
            def save():
                (p / 'motion_beats.json').write_text(json.dumps({'schema': 'hyperframes-channel/motion-beats@1', 'scenes': {'s': record}}))
            save()
            self.assertEqual(load_beats(p), {'s': {'word': 1.2}})
            for invalid in (-1, 2, float('nan'), True):
                record['cues']['word'] = invalid
                save()
                with self.assertRaises(ValueError): load_beats(p)
            record['cues']['word'] = 1.2
            save()
            (p / 'voice.wav').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'realign'): load_beats(p)
