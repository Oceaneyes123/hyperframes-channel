import tempfile
import unittest
from pathlib import Path
import sys
import json
import subprocess

sys.path.insert(0, str(Path(__file__).parent))

from supertonic_tts import (
    narration_lines,
    timeline_html,
    native_metadata,
    sync_index_audio,
)
from narration_text import normalize_text, prepare_narration, load_config


class NarrationLinesTests(unittest.TestCase):
    def test_uses_only_indented_narration(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "SCRIPT.md"
            script.write_text(
                "## Line 1 — Test\n\n**Time:** 0–1s\n\n    Spoken words.\n",
                encoding="utf-8",
            )
            self.assertEqual(narration_lines(script), [("line-1", "Spoken words.")])

    def test_header_without_blank_line_keeps_narration_body(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "SCRIPT.md"
            script.write_text("## Line 1\n    Test packet.\n", encoding="utf-8")
            self.assertEqual(narration_lines(script), [("line-1", "Test packet.")])

    def test_rejects_non_contiguous_lines(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "SCRIPT.md"
            script.write_text(
                "## Line 1\n    one\n## Line 3\n    three\n", encoding="utf-8"
            )
            with self.assertRaises(ValueError):
                narration_lines(script)

    def test_normalizes_network_tokens_without_mutating_display_text(self):
        self.assertEqual(normalize_text("MAC AA:AA"), "M A C A A, A A")
        self.assertIn("slash twenty four", normalize_text("192.168.1.0/24"))
        self.assertIn("H T T P S", normalize_text("https://example.com/api"))
        self.assertIn("underscore", normalize_text("GET /_health"))
        self.assertEqual(
            normalize_text("Remember: it is local."), "Remember: it is local."
        )
        self.assertIn("double colon", normalize_text("2001:db8::1"))

    def test_prepare_includes_fingerprint_and_original(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            script = project / "SCRIPT.md"
            script.write_text(
                "## Line 1\n\n    DNS resolves names.\n", encoding="utf-8"
            )
            result = prepare_narration(project, script)
            self.assertEqual(result["lines"][0]["original_text"], "DNS resolves names.")
            self.assertTrue(result["normalization"]["fingerprint"])

    def test_ipv4_styles_and_override(self):
        self.assertEqual(
            normalize_text(
                "192.168.1.10", {"terms": {}, "lines": {}, "ipv4_style": "digits"}
            ),
            "one nine two dot one six eight dot one dot one zero",
        )
        self.assertEqual(
            normalize_text(
                "192.168.1.10", {"terms": {}, "lines": {}, "ipv4_style": "grouped"}
            ),
            "one hundred ninety two dot one hundred sixty eight dot one dot ten",
        )
        self.assertEqual(
            normalize_text(
                "192.168.1.10", {"terms": {}, "lines": {}, "ipv4_style": "short"}
            ),
            "one ninety two dot one sixty eight dot one dot ten",
        )
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            (project / "pronunciation.json").write_text(
                '{"ipv4_style":"digits","terms":{}}', encoding="utf-8"
            )
            self.assertEqual(load_config(project)["ipv4_style"], "digits")
            (project / "pronunciation.json").write_text(
                '{"ipv4_style":"bad"}', encoding="utf-8"
            )
            with self.assertRaises(ValueError):
                load_config(project)

    def test_metadata_uses_numbered_sources_without_frames(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            metadata = native_metadata(
                project,
                "M1",
                [{"id": "line-1", "path": "voice/line-1.wav", "duration_s": 1}],
                lines=[("line-1", "hello")],
            )
            self.assertEqual(
                metadata["scenes"][0]["src"], "compositions/frames/line-1.html"
            )
            self.assertEqual(metadata["voices"][0]["frame"], 1)

    def test_sync_matches_voice_and_preserves_bgm(self):
        with tempfile.TemporaryDirectory() as directory:
            index = Path(directory) / "index.html"
            index.write_text(
                '<audio src="bgm.wav"></audio><audio id="voice-line-1" src="voice/line-1.wav"></audio>',
                encoding="utf-8",
            )
            sync_index_audio(
                index,
                [
                    {
                        "audio_id": "voice-line-1",
                        "audio_path": "voice/line-1.wav",
                        "start_s": 2,
                        "duration_s": 1,
                    }
                ],
            )
            output = index.read_text(encoding="utf-8")
            self.assertIn('src="bgm.wav"', output)
            self.assertEqual(output.count("voice-line-1"), 1)
            self.assertIn('data-start="2.000000"', output)
            index.write_text(
                output + '<audio id="voice-line-1" src="voice/line-1.wav"></audio>',
                encoding="utf-8",
            )
            with self.assertRaises(ValueError):
                sync_index_audio(
                    index,
                    [
                        {
                            "audio_id": "voice-line-1",
                            "audio_path": "voice/line-1.wav",
                            "start_s": 2,
                            "duration_s": 1,
                        }
                    ],
                )

    def test_legacy_metadata_only_preserves_provenance_and_voice(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            (project / "SCRIPT.md").write_text(
                "## Line 1\n\n    Existing narration.\n", encoding="utf-8"
            )
            metadata = {
                "schema": "hyperframes-channel/narration@1",
                "provider": "supertonic-3",
                "voice": "F2",
                "voices": [
                    {"id": "line-1", "path": "voice/line-1.wav", "duration_s": 1}
                ],
            }
            path = project / "audio_meta.json"
            path.write_text(json.dumps(metadata), encoding="utf-8")
            command = [
                sys.executable,
                str(Path(__file__).with_name("supertonic_tts.py")),
                "--project",
                str(project),
                "--metadata-only",
            ]
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            output = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(output["voice"], "F2")
            self.assertNotIn("fingerprint", output.get("normalization", {}))
            self.assertNotIn("spoken_text", output["voices"][0])
            path.write_text(
                json.dumps({**output, "normalization": {"fingerprint": "stale"}}),
                encoding="utf-8",
            )
            before = path.read_bytes()
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(path.read_bytes(), before)

    def test_pronunciation_overrides_are_exact_and_validated(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            script = project / "SCRIPT.md"
            script.write_text("## Line 1\n\n    SQL is used.\n", encoding="utf-8")
            (project / "pronunciation.json").write_text(
                json.dumps(
                    {"terms": {"SQL": "S/Q L"}, "lines": {"line-1": "Custom / raw"}}
                ),
                encoding="utf-8",
            )
            prepared = prepare_narration(project, script)
            self.assertEqual(prepared["lines"][0]["spoken_text"], "Custom / raw")
            self.assertEqual(
                normalize_text(
                    "SQL",
                    {"terms": {"SQL": "S/Q L"}, "lines": {}, "ipv4_style": "grouped"},
                ),
                "S/Q L",
            )
            (project / "pronunciation.json").write_text(
                json.dumps({"lines": {"line-2": "x"}}), encoding="utf-8"
            )
            with self.assertRaises(ValueError):
                prepare_narration(project, script)
            (project / "pronunciation.json").write_text(
                json.dumps({"terms": {"SQL": None}}), encoding="utf-8"
            )
            with self.assertRaises(ValueError):
                prepare_narration(project, script)

    def test_timeline_uses_metadata_timing(self):
        html = timeline_html(
            [
                {
                    "audio_id": "voice-line-1",
                    "audio_path": "voice.wav",
                    "start_s": 1,
                    "duration_s": 2,
                }
            ]
        )
        self.assertIn('data-start="1.000000"', html)


if __name__ == "__main__":
    unittest.main()
