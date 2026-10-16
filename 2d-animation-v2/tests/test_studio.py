"""Regression checks for approval, ownership, stale evidence and narration guards."""
import json
import contextlib
import io
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import wave

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import studio


class StudioTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name)
        for name in studio.PLAN:
            path = self.project / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("plan", encoding="utf-8")
        (self.project / "SCRIPT.md").write_text("## Line 1\n    A stored image.\n", encoding="utf-8")
        self.write("production.json", {"concept": {"selected": "lightbox", "user_source": "user:1"}})

    def write(self, name, data):
        path = self.project / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data), encoding="utf-8")

    def gate(self, gate=1):
        self.write(f"review/gate-{gate}.json", {
            "gate": gate, "actor": "user", "quote": "I approve this plan.",
            "source": "user:2", "files": studio.snapshot(self.project, gate),
            "audit_files": studio.audit_snapshot(self.project)})

    def test_real_channel_parser_rejects_gaps_and_unspoken_passages(self):
        self.assertEqual(studio.check_script(self.project), [("line-1", "A stored image.")])
        for text in ("## Line 2\n    Wrong numbering.\n", "## Line 1\nUnspoken only\n"):
            (self.project / "SCRIPT.md").write_text(text, encoding="utf-8")
            with self.assertRaises(ValueError):
                studio.check_script(self.project)

    def test_path_escape_is_rejected(self):
        for name in ("../elsewhere", str(self.project.parent / "elsewhere")):
            with self.assertRaisesRegex(ValueError, "outside project"):
                studio.local(self.project, name)

    def test_plan_needs_user_concept_selection(self):
        self.write("production.json", {"concept": {"selected": "", "user_source": ""}})
        with self.assertRaisesRegex(ValueError, "concept selection"):
            studio.check_plan(self.project)

    def test_receipt_invalidates_changed_script_and_added_board_asset(self):
        self.gate()
        studio.receipt(self.project, 1)
        (self.project / "sketches/new.svg").write_text("new asset", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)
        self.gate()
        (self.project / "SCRIPT.md").write_text("changed speech", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)

    def test_agent_approval_is_not_user_approval(self):
        self.gate()
        data = studio.read(self.project / "review/gate-1.json")
        data["actor"] = "director"
        self.write("review/gate-1.json", data)
        with self.assertRaisesRegex(ValueError, "explicit user"):
            studio.receipt(self.project, 1)

    def test_gate1_binds_concept_but_allows_revision_routing_updates(self):
        self.gate()
        data = studio.read(self.project / "production.json")
        data["revisions"] = [{"id": "R1", "status": "open"}]
        self.write("production.json", data)
        studio.receipt(self.project, 1)
        data["concept"]["selected"] = "different concept"
        self.write("production.json", data)
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)

    def test_approval_requires_provenance_and_preserves_existing_receipt(self):
        with self.assertRaisesRegex(ValueError, "message source"):
            studio.approve(self.project, 1, "", "")
        with patch.object(studio, "check_plan"):
            studio.approve(self.project, 1, "I approve this plan.", "user:2")
            with self.assertRaisesRegex(ValueError, "Preserve old receipt"):
                studio.approve(self.project, 1, "I approve.", "user:3")

    def test_gate2_binds_preview_and_audit_evidence(self):
        self.write("review/reviewer.json", {"result": "first audit"})
        self.gate(2)
        studio.receipt(self.project, 2)
        self.write("review/reviewer.json", {"result": "different audit"})
        with self.assertRaisesRegex(ValueError, "audit evidence changed"):
            studio.receipt(self.project, 2)
        self.gate(2)
        (self.project / "new-runtime.js").write_text("different runtime", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 2)

    def test_skill_discovery_rejects_modified_original(self):
        skill_root = self.project / "skills/test"
        skill_root.mkdir(parents=True)
        (skill_root / "SKILL.md").write_text("original", encoding="utf-8")
        manifest = self.project / "manifest.json"
        manifest.write_text(json.dumps({"scriptwriter": {"directory": "test", "files": {
            "SKILL.md": studio.digest(skill_root / "SKILL.md")}}}), encoding="utf-8")
        with patch.object(studio, "MANIFEST", manifest), patch.dict("os.environ", {"CODEX_HOME": str(self.project)}):
            self.assertEqual(studio.skill("scriptwriter"), skill_root)
            (skill_root / "SKILL.md").write_text("rewritten", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "differs from verified source"):
                studio.skill("scriptwriter")

    def test_partial_and_stale_handoffs_are_rejected(self):
        original = self.project / "original/SKILL.md"
        original.parent.mkdir()
        original.write_text("original", encoding="utf-8")
        report = {"role": "scriptwriter", "agent_id": "writer", "status": "partial",
                  "procedures": ["variants"], "skill": {"path": str(original), "sha256": studio.digest(original)},
                  "inputs": {"FACTS.md": studio.digest(self.project / "FACTS.md")},
                  "outputs": {"SCRIPT.md": studio.digest(self.project / "SCRIPT.md")}, "evidence": ["SCRIPT.md"]}
        self.write("review/scriptwriter.json", report)
        with patch.object(studio, "skill", return_value=original.parent):
            with self.assertRaisesRegex(ValueError, "Incomplete"):
                studio.handoff(self.project, "scriptwriter")
            report["status"] = "executed"
            self.write("review/scriptwriter.json", report)
            studio.handoff(self.project, "scriptwriter")
            (self.project / "FACTS.md").write_text("changed facts", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stale scriptwriter input"):
                studio.handoff(self.project, "scriptwriter")
            (self.project / "FACTS.md").write_text("plan", encoding="utf-8")
            (self.project / "SCRIPT.md").write_text("changed output", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stale scriptwriter output"):
                studio.handoff(self.project, "scriptwriter")

    def test_review_rejects_self_review_open_findings_and_stale_preview(self):
        reviewer = {"agent_id": "animator", "preview_files": studio.snapshot(self.project, 2),
                    "weighting_user_source": "user:3", "full_playback_evidence": ["SCRIPT.md"], "findings": []}
        with patch.object(studio, "check_animation", return_value={"agent_id": "animator"}), \
                patch.object(studio, "handoff", return_value=reviewer):
            with self.assertRaisesRegex(ValueError, "independent"):
                studio.check_review(self.project)
            reviewer["agent_id"] = "reviewer"
            reviewer["findings"] = [{"id": "R1", "severity": "important", "status": "open"}]
            with self.assertRaisesRegex(ValueError, "Unresolved blocking"):
                studio.check_review(self.project)
            reviewer["findings"][0].update(status="closed", recheck_evidence=["SCRIPT.md"],
                                           fix_author_id="animator", rechecked_by="reviewer")
            studio.check_review(self.project)
            reviewer["findings"][0]["fix_author_id"] = "reviewer"
            with self.assertRaisesRegex(ValueError, "independent fix/recheck"):
                studio.check_review(self.project)
            reviewer["findings"][0]["fix_author_id"] = "animator"
            reviewer["preview_files"] = {}
            with self.assertRaisesRegex(ValueError, "current preview"):
                studio.check_review(self.project)

    def test_unapproved_tts_and_render_never_launch_external_tools(self):
        for command in ("tts", "render"):
            with patch.object(sys, "argv", ["studio.py", command, "--project", str(self.project)]), \
                    patch.object(studio, "ROOT", self.project), \
                    patch.object(studio, "check_script"), patch.object(studio, "check_plan"), \
                    patch.object(studio, "check_review"), patch.object(studio.subprocess, "run") as run:
                error = io.StringIO()
                with contextlib.redirect_stderr(error), self.assertRaises(SystemExit) as result:
                    studio.main()
                self.assertEqual(result.exception.code, 1)
                self.assertIn("gate-1.json" if command == "tts" else "gate-2.json", error.getvalue())
                run.assert_not_called()

    def test_dry_run_flag_cannot_accidentally_render(self):
        with patch.object(sys, "argv", ["studio.py", "render", "--dry-run", "--project", str(self.project)]), \
                patch.object(studio.subprocess, "run") as run, contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit):
                studio.main()
            run.assert_not_called()

    def test_measured_narration_rejects_overlap_estimates_and_changed_wav(self):
        source = self.project / "passage.wav"
        with wave.open(str(source), "wb") as wav:
            wav.setparams((1, 2, 8000, 0, "NONE", "not compressed"))
            wav.writeframes(b"\x00\x00" * 8000)
        channel = studio.ROOT.parent / "2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json"
        self.write("audio_meta.json", {"voices": [{"id": "line-1", "path": "passage.wav",
                   "duration_s": 1, "original_text": "A stored image.", "voice_style_sha256": studio.digest(channel)}]})
        cue = {"id": "line-1", "start_s": 0, "duration_s": 1, "sha256": studio.digest(source),
               "cues": [{"time_s": 0.2, "method": "listened", "evidence": "SCRIPT.md"}]}
        self.write("motion_beats.json", {"narration": [cue]})
        studio.check_narration(self.project, 2)
        for field, value, message in (("start_s", -1, "overlapping"), ("sha256", "wrong", "source WAV changed"),
                                     ("duration_s", float("nan"), "source WAV changed")):
            broken = dict(cue, **{field: value})
            self.write("motion_beats.json", {"narration": [broken]})
            with self.assertRaisesRegex(ValueError, message):
                studio.check_narration(self.project, 2)
        cue["cues"][0]["method"] = "word-count"
        self.write("motion_beats.json", {"narration": [cue]})
        with self.assertRaisesRegex(ValueError, "not estimated"):
            studio.check_narration(self.project, 2)

    def test_mix_must_contain_source_audio_at_measured_start(self):
        def wav_file(path, data):
            path.parent.mkdir(parents=True, exist_ok=True)
            with wave.open(str(path), "wb") as wav:
                wav.setparams((1, 2, 8000, 0, "NONE", "not compressed"))
                wav.writeframes(data)
        sound = b"\x01\x00" * 8000
        wav_file(self.project / "passage.wav", sound)
        self.write("audio_meta.json", {"voices": [{"path": "passage.wav"}]})
        self.write("motion_beats.json", {"narration": [{"start_s": 0.5}]})
        wav_file(self.project / "audio/narration.wav", b"\x00\x00" * 4000 + sound + b"\x00\x00" * 4000)
        studio.check_mix(self.project)
        wav_file(self.project / "audio/narration.wav", b"\x00\x00" * 16000)
        with self.assertRaisesRegex(ValueError, "does not match source"):
            studio.check_mix(self.project)

    def test_browser_contract_with_static_synthetic_fixture(self):
        # A software fixture exercises browser checks; it is not a production film.
        original = studio.skill("animator")
        (self.project / "motion.js").write_bytes((original / "lib/motion.js").read_bytes())
        (self.project / "ONETAKE_LICENSE").write_bytes((original / "LICENSE").read_bytes())
        self.write("audio_meta.json", {})
        self.write("motion_beats.json", {})
        (self.project / "audio").mkdir()
        with wave.open(str(self.project / "audio/narration.wav"), "wb") as wav:
            wav.setparams((1, 2, 8000, 0, "NONE", "not compressed"))
            wav.writeframes(b"\x00\x00" * 16000)
        html = '''<body style="margin:0"><div id="value"></div><script>
window.__ready=Promise.resolve();
window.__meta={dur:2,w:1080,h:1920,fps:30};
window.__track=()=>({}); window.__motion=()=>0;
window.__seek=t=>document.getElementById('value').textContent=t.toFixed(3);
</script>'''
        (self.project / "comp.html").write_text(html, encoding="utf-8")
        with patch.object(studio, "check_plan"), patch.object(studio, "receipt"), \
                patch.object(studio, "handoff", return_value={"agent_id": "fixture"}), \
                patch.object(studio, "check_narration"), patch.object(studio, "check_mix"):
            studio.check_animation(self.project)
            (self.project / "comp.html").write_text(html.replace("w:1080", "w:1920"), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "native 1080x1920"):
                studio.check_animation(self.project)
            (self.project / "comp.html").write_text(html.replace("t.toFixed(3)", "Math.random()"), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Nondeterministic"):
                studio.check_animation(self.project)


if __name__ == "__main__":
    unittest.main()
