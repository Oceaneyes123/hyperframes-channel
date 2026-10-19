"""Regression checks for approval, ownership, stale evidence and narration guards."""
import json
import copy
import contextlib
import io
import hashlib
from pathlib import Path
import re
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

    def reference_study(self):
        production = studio.read(self.project / "production.json")
        production["reference_study"] = True
        self.write("production.json", production)
        self.write("reference-evidence/viewing.json", {"fixture": "synthetic viewing log, not inspected footage"})
        study = {"references": [{
            "id": "clip-a", "source_url": "https://example.org/channel",
            "video_url": "https://example.org/clip", "status": "inspected", "checked_on": "2026-10-17",
            "inspection": {"method": "playback", "viewed_ranges_s": [[1, 4], [8, 10]],
                           "evidence": ["reference-evidence/viewing.json"]},
            "observations": [{"id": "carry", "range_s": [2, 3],
                              "observation": "Synthetic object remains through a reframe.",
                              "technique": "Carry a meaningful object.",
                              "use_when": "Identity teaches retained state.",
                              "avoid_when": "A transformation would change meaning."}],
            "limitation": "Synthetic test fixture only."}]}
        self.write("REFERENCES.json", study)
        return study

    def test_reference_study_accepts_partial_ranges_and_future_sources(self):
        study = self.reference_study()
        extra = copy.deepcopy(study["references"][0])
        extra.update(id="supplied-clip", source_url="https://example.org/new-source")
        extra["inspection"]["method"] = "ordered-frames"
        study["references"].append(extra)
        self.write("REFERENCES.json", study)
        self.assertEqual(studio.check_references(self.project), study)

    def test_reference_study_rejects_unwatched_claims_and_bad_evidence(self):
        original = self.reference_study()
        mutations = [
            ("pending", lambda r: r.update(status="pending")),
            ("moving-frame method", lambda r: r["inspection"].update(method="thumbnail")),
            ("moving-frame evidence", lambda r: r["inspection"].update(evidence=[])),
            ("outside inspected", lambda r: r["observations"][0].update(range_s=[3, 9])),
            ("outside inspected", lambda r: r["observations"][0].update(range_s=[3, 3])),
            ("outside inspected", lambda r: r["observations"][0].update(range_s=[2, float("nan")])),
            ("Invalid viewed ranges", lambda r: r["inspection"].update(viewed_ranges_s=[[-1, 2]])),
            ("Invalid viewed ranges", lambda r: r["inspection"].update(viewed_ranges_s=[[1, float("inf")]])),
            ("Missing reference-evidence", lambda r: r["inspection"].update(evidence=["reference-evidence/missing.md"])),
            ("outside project", lambda r: r["inspection"].update(evidence=["../escape.md"])),
            ("missing avoid_when", lambda r: r["observations"][0].update(avoid_when="")),
            ("IDs must be unique", lambda r: r["observations"].append(copy.deepcopy(r["observations"][0]))),
        ]
        for message, mutate in mutations:
            with self.subTest(message=message):
                study = copy.deepcopy(original)
                mutate(study["references"][0])
                self.write("REFERENCES.json", study)
                with self.assertRaisesRegex(ValueError, message):
                    studio.check_references(self.project)

    def test_inaccessible_reference_reports_limits_without_invented_analysis(self):
        study = self.reference_study()
        reference = study["references"][0]
        reference.update(status="inaccessible", inspection=None, observations=[],
                         limitation="Player unavailable; no moving frames inspected.")
        self.write("REFERENCES.json", study)
        studio.check_references(self.project)
        for changes in ({"limitation": ""}, {"observations": [{"observation": "invented"}]},
                        {"inspection": {"method": "thumbnail"}}):
            with self.subTest(changes=changes):
                modified = copy.deepcopy(study)
                modified["references"][0].update(changes)
                self.write("REFERENCES.json", modified)
                with self.assertRaisesRegex(ValueError, "no animation claims"):
                    studio.check_references(self.project)

    def test_reference_template_cannot_pass_as_executed_research(self):
        template = studio.read(studio.ROOT / "templates/REFERENCES.json")
        self.assertEqual(len(template["references"]), 2)
        self.write("REFERENCES.json", template)
        with self.assertRaisesRegex(ValueError, "pending"):
            studio.check_references(self.project)

    def test_reference_plan_and_gate_bind_study_and_moving_frame_evidence(self):
        study = self.reference_study()
        with patch.object(studio, "handoff"):
            studio.check_plan(self.project)
            study["references"][0]["status"] = "pending"
            self.write("REFERENCES.json", study)
            with self.assertRaisesRegex(ValueError, "pending"):
                studio.check_plan(self.project)
        self.reference_study()
        self.gate()
        studio.receipt(self.project, 1)
        self.write("reference-evidence/viewing.json", {"fixture": "changed evidence"})
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)
        self.gate()
        self.write("REFERENCES.json", {"references": []})
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)
        self.reference_study()
        self.gate()
        production = studio.read(self.project / "production.json")
        production.pop("reference_study")
        self.write("production.json", production)
        with self.assertRaisesRegex(ValueError, "stale"):
            studio.receipt(self.project, 1)

    def test_real_channel_parser_rejects_gaps_and_unspoken_passages(self):
        self.assertEqual(studio.check_script(self.project), [("line-1", "A stored image.")])
        for text in ("## Line 2\n    Wrong numbering.\n", "## Line 1\nUnspoken only\n"):
            (self.project / "SCRIPT.md").write_text(text, encoding="utf-8")
            with self.assertRaises(ValueError):
                studio.check_script(self.project)

    def test_http_cache_planning_preserves_every_narration_passage(self):
        baseline = studio.check_script(studio.ROOT / "examples/http-cache")
        comparison = (studio.ROOT / "workflow/HTTP_CACHE_STORYTELLING.md").read_text(encoding="utf-8")
        planned_speech = [line[2:] for line in comparison.splitlines() if line.startswith("> ")]
        self.assertEqual(planned_speech, [speech for _, speech in baseline])

    def test_script_trial_preserves_actual_historical_baselines(self):
        trial = (studio.ROOT / "SCRIPT_TESTS.md").read_text(encoding="utf-8")
        samples = dict(re.findall(r"^### ([FTA][123])\n\n~~~markdown\n(.*?)^~~~",
                                  trial, re.M | re.S))
        # Lock the actual pre-revision drafts, not reconstructed comparisons.
        expected = {
            "F1": "d229f016ffc0ca55b00a9687c10de91ca6435e1f8e7fa4287622c9222e7cec7b",
            "F2": "7ad0cb228501928d4512cc8e521a0c87c421294f4a65e359dca10b52661a8793",
            "T1": "6f9d0d7f03eff7f0c3ed9d4639bbab8869e003417cba7fc518340bc9c2365d31",
            "T2": "7eb0e2addfac18434b02188dd48820ba5f7c61cf76c2d15ee37db93c2bf69b46",
            "A1": "12e58a480ffa249cf626cea21356b99ebcde8d0af6daa645e7815e8766bc146d",
            "A2": "d639aa5cdb3ed5ccfd3b5f9d5c9634895ec558e2b6ebf6c77f0fdec8772d87a5",
            "F3": "26909ddc184c22a4be550bdfb91ca3806ab08456a61e3a3abaec49131e2b7127",
            "T3": "0f26d0c9cd20c05685bd43f4ab495887c9508b283b78168b842af3d6bc30c849",
            "A3": "5f6cda58d92a3c244a545ccd0e5691668a94aaacfeb7c39764aa6325baed0bf2",
        }
        self.assertEqual({key: hashlib.sha256(value.encode()).hexdigest()
                          for key, value in samples.items()}, expected)

    def test_script_trial_parses_without_speaking_editorial_notes(self):
        trial = (studio.ROOT / "SCRIPT_TESTS.md").read_text(encoding="utf-8")
        samples = re.findall(r"^### ([FTA][1234])\n\n~~~markdown\n(.*?)^~~~",
                             trial, re.M | re.S)
        self.assertCountEqual([key for key, _ in samples],
                              [f"{topic}{version}" for topic in "FTA" for version in (1, 2, 3, 4)])
        for key, script in samples:
            with self.subTest(sample=key):
                (self.project / "SCRIPT.md").write_text(script, encoding="utf-8")
                lines = studio.check_script(self.project)
                self.assertTrue(lines)
                if key.endswith(("3", "4")):
                    self.assertIn("Narrative review:", script)
                    self.assertNotIn("Narrative review:", " ".join(text for _, text in lines))

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
        spec = {"directory": "test", "files": {"SKILL.md": studio.digest(skill_root / "SKILL.md")}}
        manifest.write_text(json.dumps({name: spec for name in ("scriptwriter", "humanizer")}), encoding="utf-8")
        with patch.object(studio, "MANIFEST", manifest), patch.dict("os.environ", {"CODEX_HOME": str(self.project)}):
            for name in ("scriptwriter", "humanizer"):
                self.assertEqual(studio.skill(name), skill_root)
            (skill_root / "SKILL.md").write_text("rewritten", encoding="utf-8")
            for name in ("scriptwriter", "humanizer"):
                with self.subTest(skill=name), self.assertRaisesRegex(ValueError, "differs from verified source"):
                    studio.skill(name)

    def refinement_handoff(self):
        sources = {}
        for name in ("storytelling-hooks", "humanizer"):
            folder = self.project / "skills" / name
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(f"Synthetic {name} source", encoding="utf-8")
            sources[name] = folder / "SKILL.md"
        self.write("skill-manifest.json", {
            role: {"directory": name, "files": {"SKILL.md": studio.digest(sources[name])}}
            for role, name in (("scriptwriter", "storytelling-hooks"), ("humanizer", "humanizer"))})
        before, audit = "review/scriptwriter-draft.md", "review/scriptwriter-humanizer.md"
        (self.project / "review").mkdir(exist_ok=True)
        (self.project / before).write_bytes((self.project / "SCRIPT.md").read_bytes())
        (self.project / audit).write_text("Synthetic zero-edit refinement audit; no actual execution.", encoding="utf-8")
        report = {
            "role": "scriptwriter", "agent_id": "writer", "status": "executed",
            "procedures": ["Synthetic storytelling procedure"],
            "skill": {"path": str(sources["storytelling-hooks"]),
                      "sha256": studio.digest(sources["storytelling-hooks"])},
            "refinement": {
                "skill": {"path": str(sources["humanizer"]), "sha256": studio.digest(sources["humanizer"])},
                "status": "executed", "before": before, "audit": audit,
                "procedures": ["Synthetic refinement procedure"]},
            "inputs": {"FACTS.md": studio.digest(self.project / "FACTS.md")},
            "outputs": {name: studio.digest(self.project / name) for name in (before, audit, "SCRIPT.md")},
            "evidence": [before, audit], "limitations": ["Synthetic fixture, not an executed skill."]}
        self.write("review/scriptwriter.json", report)
        return report, self.project / "skill-manifest.json"

    def test_refinement_required_for_new_or_revised_plan_but_preserves_historical_approval(self):
        report, manifest = self.refinement_handoff()
        refinement = report.pop("refinement")
        self.write("review/scriptwriter.json", report)
        with patch.object(studio, "MANIFEST", manifest), patch.dict("os.environ", {"CODEX_HOME": str(self.project)}):
            with self.assertRaisesRegex(ValueError, "Missing Scriptwriter humanizer"):
                studio.handoff(self.project, "scriptwriter")
            self.gate()
            studio.handoff(self.project, "scriptwriter")
            (self.project / "SCRIPT.md").write_text("## Line 1\n    A changed image.\n", encoding="utf-8")
            report["outputs"]["SCRIPT.md"] = studio.digest(self.project / "SCRIPT.md")
            self.write("review/scriptwriter.json", report)
            with self.assertRaisesRegex(ValueError, "Missing Scriptwriter humanizer"):
                studio.handoff(self.project, "scriptwriter")
            report["refinement"] = refinement
            self.write("review/scriptwriter.json", report)
            studio.handoff(self.project, "scriptwriter")

    def test_humanizer_needs_real_source_and_distinct_current_draft_audit_final_evidence(self):
        report, manifest = self.refinement_handoff()
        mutations = [
            ("Incomplete", lambda r: r.update(refinement=None)),
            ("Incomplete", lambda r: r["refinement"].update(status="partial")),
            ("Incomplete", lambda r: r["refinement"].update(procedures=[])),
            ("stale humanizer", lambda r: r["refinement"]["skill"].update(sha256="wrong")),
            ("stale humanizer", lambda r: r["refinement"]["skill"].update(path=r["skill"]["path"])),
            ("distinct hashed", lambda r: r["refinement"].update(before="SCRIPT.md")),
            ("distinct hashed", lambda r: r["refinement"].update(before="./SCRIPT.md")),
            ("outside project", lambda r: r["refinement"].update(before="../escape.md")),
            ("distinct hashed", lambda r: r["outputs"].pop(r["refinement"]["audit"])),
            ("distinct hashed", lambda r: r["evidence"].remove(r["refinement"]["audit"])),
        ]
        with patch.object(studio, "MANIFEST", manifest), patch.dict("os.environ", {"CODEX_HOME": str(self.project)}):
            # A justified zero-edit pass remains valid; hashes need not differ.
            studio.handoff(self.project, "scriptwriter")
            for message, mutate in mutations:
                with self.subTest(message=message):
                    changed = copy.deepcopy(report)
                    mutate(changed)
                    self.write("review/scriptwriter.json", changed)
                    with self.assertRaisesRegex(ValueError, message):
                        studio.handoff(self.project, "scriptwriter")
            self.write("review/scriptwriter.json", report)
            audit = self.project / report["refinement"]["audit"]
            audit.write_text("changed audit", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stale scriptwriter output"):
                studio.handoff(self.project, "scriptwriter")
            audit.write_text("", encoding="utf-8")
            report["outputs"][report["refinement"]["audit"]] = studio.digest(audit)
            self.write("review/scriptwriter.json", report)
            with self.assertRaisesRegex(ValueError, "must not be empty"):
                studio.handoff(self.project, "scriptwriter")

    def test_partial_and_stale_handoffs_are_rejected(self):
        self.gate()
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

    def test_specialists_must_consume_reference_study_when_enabled(self):
        self.reference_study()
        original = self.project / "original/SKILL.md"
        original.parent.mkdir()
        original.write_text("original", encoding="utf-8")
        for role in studio.ROLES[1:]:
            with self.subTest(role=role), patch.object(studio, "skill", return_value=original.parent):
                report = {"role": role, "agent_id": role, "status": "executed",
                          "procedures": ["original method"],
                          "skill": {"path": str(original), "sha256": studio.digest(original)},
                          "inputs": {"FACTS.md": studio.digest(self.project / "FACTS.md")},
                          "outputs": {"VISUAL.md": studio.digest(self.project / "VISUAL.md")},
                          "evidence": ["VISUAL.md"]}
                self.write(f"review/{role}.json", report)
                with self.assertRaisesRegex(ValueError, "reference-study input"):
                    studio.handoff(self.project, role)
                report["inputs"]["REFERENCES.json"] = studio.digest(self.project / "REFERENCES.json")
                self.write(f"review/{role}.json", report)
                with self.assertRaisesRegex(ValueError, "reference-study input: reference-evidence"):
                    studio.handoff(self.project, role)
                report["inputs"]["reference-evidence/viewing.json"] = studio.digest(
                    self.project / "reference-evidence/viewing.json")
                self.write(f"review/{role}.json", report)
                studio.handoff(self.project, role)
                self.write("reference-evidence/viewing.json", {"fixture": "changed viewing log"})
                with self.assertRaisesRegex(ValueError, "Stale .* input: reference-evidence"):
                    studio.handoff(self.project, role)
                self.reference_study()
                self.write("REFERENCES.json", {"references": []})
                with self.assertRaisesRegex(ValueError, "Stale .* input: REFERENCES"):
                    studio.handoff(self.project, role)
                self.reference_study()

    def test_reference_workflow_requires_timestamped_storytelling_review(self):
        self.reference_study()
        reviewer = {"agent_id": "reviewer", "preview_files": studio.snapshot(self.project, 2),
                    "weighting_user_source": "user:3", "full_playback_evidence": ["SCRIPT.md"],
                    "findings": []}
        with patch.object(studio, "check_animation", return_value={"agent_id": "animator", "duration_s": 2}), \
                patch.object(studio, "handoff", return_value=reviewer):
            with self.assertRaisesRegex(ValueError, "storytelling review: cause_effect"):
                studio.check_review(self.project)
            reviewer["storytelling"] = {key: {"assessment": "Synthetic coverage, no film quality claim.",
                                              "times_s": [0, 1.5], "evidence": ["SCRIPT.md"]}
                                         for key in studio.STORYTELLING}
            studio.check_review(self.project)
            for changes in ({"assessment": ""}, {"times_s": []}, {"times_s": [float("nan")]},
                            {"times_s": [-1]}, {"times_s": [2]}, {"times_s": [1000000000]},
                            {"evidence": []}):
                with self.subTest(changes=changes):
                    assessment = reviewer["storytelling"]["transitions"]
                    previous = assessment.copy()
                    assessment.update(changes)
                    with self.assertRaisesRegex(ValueError, "storytelling review: transitions"):
                        studio.check_review(self.project)
                    assessment.update(previous)
            reviewer["storytelling"]["transitions"]["evidence"] = ["missing-playback.md"]
            with self.assertRaisesRegex(ValueError, "Missing missing-playback"):
                studio.check_review(self.project)

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
            self.assertEqual(studio.check_animation(self.project)["duration_s"], 2)
            (self.project / "comp.html").write_text(html.replace("w:1080", "w:1920"), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "native 1080x1920"):
                studio.check_animation(self.project)
            (self.project / "comp.html").write_text(html.replace("t.toFixed(3)", "Math.random()"), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Nondeterministic"):
                studio.check_animation(self.project)


if __name__ == "__main__":
    unittest.main()
