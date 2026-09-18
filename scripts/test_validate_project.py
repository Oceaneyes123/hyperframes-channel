import json
import shutil
import tempfile
import unittest
import wave
from pathlib import Path

from narration_text import prepare_narration
from supertonic_tts import native_metadata, timeline_html
from validate_project import DESIGN_VERSION, attr, remote_assets, validate_diagnostics
from assemble_project import assemble


class ValidatorTests(unittest.TestCase):
    def test_attribute_does_not_match_studio_id_suffix(self):
        self.assertEqual(attr('<audio data-hf-id="studio" id="voice-line-1">', 'id'), 'voice-line-1')

    def fixture(self):
        root = Path(tempfile.mkdtemp())
        (root / "compositions" / "frames").mkdir(parents=True)
        (root / "channel").mkdir()
        (root / "public" / "icons").mkdir(parents=True)
        (root / "review" / "sketches").mkdir(parents=True)
        (root / "BRIEF.md").write_text("# Test\n", encoding="utf-8")
        (root / "STORYBOARD.md").write_text("# Test\n", encoding="utf-8")
        (root / "SCRIPT.md").write_text("## Line 1\n    Test packet.\n", encoding="utf-8")
        (root / "channel.json").write_text(json.dumps({"design": "hyperframes-channel", "design_version": DESIGN_VERSION}), encoding="utf-8")
        shutil.copy2(Path(__file__).parents[1] / "channel" / "styles.css", root / "channel/styles.css")
        (root / "public/icons/packet.svg").write_text("<svg xmlns='http://www.w3.org/2000/svg'/>\n", encoding="utf-8")
        (root / "compositions/frames/line-1.html").write_text("<style>@import url(\"channel/styles.css\");</style>\n<div data-composition-id='line-1' data-width='1080' data-height='1920' data-duration='1'></div>\n<img src='public/icons/packet.svg'>", encoding="utf-8")
        wav = root / "line-1.wav"
        with wave.open(str(wav), "wb") as out:
            out.setnchannels(1); out.setsampwidth(2); out.setframerate(8000); out.writeframes(b"\0" * 16000)
        prepared = prepare_narration(root, [("line-1", "Test packet.")])
        voice = {"id": "line-1", "frame": 1, "path": "line-1.wav", "duration_s": 1.0, **prepared["lines"][0], "normalization_fingerprint": prepared["normalization"]["fingerprint"]}
        metadata = native_metadata(root, "en", [voice], lines=[("line-1", "Test packet.")], normalization=prepared["normalization"])
        (root / "audio_meta.json").write_text(json.dumps(metadata), encoding="utf-8")
        (root / "ICON_PLAN.json").write_text(json.dumps({"icons": [{"id": "packet", "provider": "custom", "role": "system", "meaning": "packet", "style": "outline", "path": "public/icons/packet.svg", "scenes": ["line-1"]}]}), encoding="utf-8")
        (root / "review/sketches/line-1.html").write_text("sketch", encoding="utf-8")
        (root / "review/storyboard-approval.json").write_text(json.dumps({"status": "approved", "icon_plan": "ICON_PLAN.json", "sketches": ["review/sketches/line-1.html"]}), encoding="utf-8")
        (root / "review/final-preview-approval.json").write_text(json.dumps({"status": "approved"}), encoding="utf-8")
        scene = metadata["scenes"][0]
        (root / "index.html").write_text(f"<div data-composition-id='test-video' data-width='1080' data-height='1920' data-duration='1'></div><div data-scene-src='{scene['src']}' data-start='0' data-duration='1'><audio id='{scene['audio_id']}' src='line-1.wav' data-start='0' data-duration='1'></audio></div>", encoding="utf-8")
        (root / "audio_timeline.html").write_text(timeline_html(metadata["scenes"]), encoding="utf-8")
        return root

    def test_design_version_is_semver(self):
        self.assertRegex(DESIGN_VERSION, r"^\d+\.\d+\.\d+$")

    def test_valid_v2_fixture_passes_preview(self):
        root = self.fixture()
        try:
            self.assertEqual(validate_diagnostics(root, "preview")[0], [])
        finally:
            shutil.rmtree(root)

    def test_valid_fixture_passes_plan_and_render(self):
        root = self.fixture()
        try:
            self.assertEqual(validate_diagnostics(root, "plan")[0], [])
            self.assertEqual(validate_diagnostics(root, "render")[0], [])
        finally:
            shutil.rmtree(root)

    def test_negative_cases_report_errors_without_crashing(self):
        cases = {
            "wrongindexwidth": lambda p: self.replace(p / "index.html", "data-width='1080'", "data-width='1'"),
            "wrongframewidth": lambda p: self.replace(p / "compositions/frames/line-1.html", "data-width='1080'", "data-width='1'"),
            "missingroot": lambda p: self.replace(p / "index.html", "data-composition-id='test-video'", "data-no-root='test-video'"),
            "missing WAV": lambda p: (p / "line-1.wav").unlink(),
            "wrong actualduration": lambda p: self.replace_wav(p / "line-1.wav", .5),
            "altered script": lambda p: self.replace(p / "SCRIPT.md", "Test packet.", "Changed packet."),
            "altered voice spoken text": lambda p: self.replace(p / "audio_meta.json", '"spoken_text": "Test packet."', '"spoken_text": "Other text."'),
            "NaN audio attr": lambda p: self.replace(p / "index.html", "data-duration='1'", "data-duration='NaN'"),
            "missing timeline": lambda p: (p / "audio_timeline.html").unlink(),
            "host start mismatch": lambda p: self.replace(p / "index.html", "data-start='0'", "data-start='0.5'"),
            "missing scene host": lambda p: self.replace(p / "index.html", "data-scene-src", "data-not-a-host"),
            "unknown scene host": lambda p: self.replace(p / "index.html", "compositions/frames/line-1.html", "compositions/frames/unknown.html"),
            "unknown version": lambda p: self.replace(p / "channel.json", DESIGN_VERSION, "9.9.9"),
            "missing storyboard approval": lambda p: (p / "review/storyboard-approval.json").unlink(),
            "render missing final approval": lambda p: (p / "review/final-preview-approval.json").unlink(),
            "missing styles": lambda p: (p / "channel/styles.css").unlink(),
            "missing planned icon": lambda p: self.replace(p / "compositions/frames/line-1.html", "public/icons/packet.svg", "public/icons/missing.svg"),
            "remote resource": lambda p: self.replace(p / "index.html", "</div>", "</div><script src='https://cdn.example/gsap.js'></script>"),
        }
        for name, mutate in cases.items():
            with self.subTest(name=name):
                root = self.fixture()
                try:
                    mutate(root)
                    stage = "render" if name == "render missing final approval" else "preview"
                    self.assertTrue(validate_diagnostics(root, stage)[0], name)
                finally:
                    shutil.rmtree(root)

    def test_malformed_json_shapes_report_errors(self):
        for field, value in (("channel.json", []), ("audio_meta.json", {"scenes": [None], "voices": [None]})):
            with self.subTest(field=field):
                root = self.fixture()
                try:
                    (root / field).write_text(json.dumps(value), encoding="utf-8")
                    self.assertTrue(validate_diagnostics(root)[0])
                finally:
                    shutil.rmtree(root)

    def test_remote_resources_but_not_attribution_links(self):
        for markup in (
            '<script src="https://cdn.example/gsap.js"></script>',
            "<img src = '//cdn.example/icon.png'>",
            '<link href="https://cdn.example/style.css">',
            '<image xlink:href="https://cdn.example/icon.svg"/>',
            '<img srcset="local.png 1x, https://cdn.example/icon.png 2x">',
            '<style>@import "https://cdn.example/font.css";</style>',
            'background: url(//cdn.example/icon.svg)',
        ):
            with self.subTest(markup=markup): self.assertTrue(remote_assets(markup))
        self.assertFalse(remote_assets('<a href="https://icons8.com">Credit</a><svg xmlns="http://www.w3.org/2000/svg"/><img src="public/icon.svg">'))

    def test_plan_before_production_and_spoken_only_estimate(self):
        root = self.fixture()
        try:
            for name in ("index.html", "audio_meta.json", "audio_timeline.html", "line-1.wav", "compositions/frames/line-1.html"):
                (root / name).unlink()
            (root / "SCRIPT.md").write_text("## Line 1\n**Display:** " + "label " * 200 + "\n    Test packet.\n", encoding="utf-8")
            errors, warnings = validate_diagnostics(root, "plan")
            self.assertEqual(errors, [])
            self.assertFalse(any("estimated narration" in warning for warning in warnings))
            (root / "SCRIPT.md").write_text("## Line 1\n    " + "192.168.1.10 " * 20 + "\n", encoding="utf-8")
            self.assertTrue(any("estimated narration" in warning for warning in validate_diagnostics(root, "plan")[1]))
            self.assertTrue(validate_diagnostics(root, "preview")[0])
            (root / "ICON_PLAN.json").unlink()
            (root / "sketch.html").write_text('<img src="https://cdn.example/image.png">', encoding="utf-8")
            self.assertIn("sketch.html: remote asset reference", validate_diagnostics(root, "plan")[0])
        finally:
            shutil.rmtree(root)

    def test_actual_composition_host_contract(self):
        for replacement in ("data-start='0.5'", "data-start='NaN'", "data-start='Infinity'"):
            root = self.fixture()
            try:
                self.replace(root / "index.html", "data-scene-src", "data-composition-src")
                self.assertEqual(validate_diagnostics(root)[0], [])
                # Change only the host, leaving narration correct.
                text = (root / "index.html").read_text(encoding="utf-8")
                (root / "index.html").write_text(text.replace("data-start='0'", replacement, 1), encoding="utf-8")
                self.assertTrue(any("scene host" in error for error in validate_diagnostics(root)[0]))
            finally:
                shutil.rmtree(root)

    def test_optional_sound_does_not_replace_narration(self):
        root = self.fixture()
        try:
            shutil.copyfile(root / "line-1.wav", root / "receive.wav")
            with (root / "index.html").open("a", encoding="utf-8") as out:
                out.write("<audio id='sfx-receive' src='receive.wav' data-start='0' data-duration='1' data-track-index='20'></audio>")
            self.assertEqual(validate_diagnostics(root)[0], [])
            self.replace(root / "index.html", "id='voice-line-1'", "id='wrong-voice'")
            self.assertIn("narration audio id differs from audio metadata", validate_diagnostics(root)[0])
        finally:
            shutil.rmtree(root)

    def test_local_assembly_and_invalid_timing_preserve_existing_index(self):
        root = self.fixture()
        try:
            (root / "public/vendor").mkdir()
            (root / "public/vendor/gsap.min.js").write_text("// local runtime", encoding="utf-8")
            assemble(root)
            self.assertEqual(validate_diagnostics(root)[0], [])
            before = (root / "index.html").read_bytes()
            self.replace(root / "audio_meta.json", '"start_s": 0.0', '"start_s": 0.5')
            with self.assertRaises(ValueError): assemble(root)
            self.assertEqual((root / "index.html").read_bytes(), before)
        finally:
            shutil.rmtree(root)

    @staticmethod
    def replace(path, old, new):
        path.write_text(path.read_text(encoding="utf-8").replace(old, new), encoding="utf-8")

    @staticmethod
    def replace_wav(path, seconds):
        with wave.open(str(path), "wb") as out:
            out.setnchannels(1); out.setsampwidth(2); out.setframerate(8000); out.writeframes(b"\0" * int(16000 * seconds))


if __name__ == "__main__":
    unittest.main()
