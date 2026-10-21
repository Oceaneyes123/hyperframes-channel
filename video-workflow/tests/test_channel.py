"""Offline checks for package integrity, release boundaries, and collection recovery."""
import copy
from datetime import datetime, timedelta, timezone
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import channel
import analytics
import youtube_api
from PIL import Image

CHANNEL_ID = "UC" + "a" * 22
VIDEO_ID = "testvideo01"


class FakeAPI:
    def __init__(self, config, description):
        self.channel_id = CHANNEL_ID
        self.uploads = self.releases = self.thumbnails = 0
        self.result = {"id": VIDEO_ID, "snippet": {
            "channelId": CHANNEL_ID, "publishedAt": "2026-10-01T00:00:00Z",
            "title": config["titles"][config["selected_title"]]["text"], "description": description,
            "categoryId": str(config["category_id"]), "defaultLanguage": config["language"], "tags": config["tags"]},
            "status": {"privacyStatus": "private", "uploadStatus": "processed", "selfDeclaredMadeForKids": config["made_for_kids"],
                       "containsSyntheticMedia": config["contains_synthetic_media"]},
            "processingDetails": {"processingStatus": "succeeded"}, "statistics": {"viewCount": "100"}}

    def require_channel(self, channel_id):
        if channel_id != self.channel_id:
            raise ValueError("Wrong channel")

    def upload(self, project, data):
        self.uploads += 1
        return VIDEO_ID

    def video(self, video_id):
        return copy.deepcopy(self.result)

    def thumbnail(self, video_id, path):
        self.thumbnails += 1
        return {"items": [{"default": {"url": "https://example.org/thumbnail.png"}}]}

    def release(self, video_id, config):
        self.releases += 1
        status = self.result["status"]
        status.update(privacyStatus=config["visibility"])
        if config.get("publish_at"):
            status.update(privacyStatus="private", publishAt=config["publish_at"])
        else:
            status.pop("publishAt", None)

    def metadata(self, video_id, data, remote):
        config = data["config"]
        self.result["snippet"].update(title=config["titles"][config["selected_title"]]["text"], description=data["description"],
                                      defaultLanguage=config["language"], tags=config["tags"], categoryId=str(config["category_id"]))
        self.result["status"].update(selfDeclaredMadeForKids=config["made_for_kids"], containsSyntheticMedia=config["contains_synthetic_media"])

    def report(self, **parameters):
        if parameters["dimensions"] == "day":
            metrics = parameters["metrics"].split(",")
            return {"columnHeaders": [{"name": "day"}] + [{"name": m} for m in metrics],
                    "rows": [["2026-09-30"] + [0 for m in metrics], ["2026-10-01"] + [10 for m in metrics]]}
        return {"columnHeaders": [], "rows": []}


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.workspace = Path(self.temp.name)
        self.root = self.workspace / "video-workflow"
        self.project = self.root / "videos/example"
        self.production = self.workspace / "2d-animation-v2/videos/example"
        self.project.mkdir(parents=True)
        self.production.mkdir(parents=True)
        self.real_studio = channel.studio()
        for name in self.real_studio.PLAN:
            path = self.production / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("synthetic test input", encoding="utf-8")
        channel.write(self.production / "production.json", {"concept": {"selected": "fixture", "user_source": "test:user"}})
        (self.production / "review").mkdir()
        for gate in (1, 2):
            channel.write(self.production / f"review/gate-{gate}.json", {
                "gate": gate, "actor": "user", "quote": "Synthetic approval for offline fixture only", "source": "test:user",
                "files": self.real_studio.snapshot(self.production, gate), "audit_files": self.real_studio.audit_snapshot(self.production)})
        (self.production / "output").mkdir()
        (self.production / "output/video.mp4").write_bytes(b"Synthetic bytes; never a real rendered video")
        self.export = self.production / "output/video.mp4"
        channel.write(self.production / "output/render-verification.json", {
            "video": str(self.export), "sha256": channel.digest(self.export), "full_decode": "PASS", "dimensions": [1080, 1920],
            "fps": "30/1", "duration_s": 60})
        self.config = channel.read(channel.ROOT / "templates/video.json")
        self.config.update(source_project=self.production.relative_to(self.workspace).as_posix(), channel_id=CHANNEL_ID,
                           audience="Beginners", promise="Explain an offline fixture", hypothesis="Test an earlier explanation of the result",
                           titles=[{"text": f"Fixture title {i}", "angle": f"Angle {i}"} for i in range(3)],
                           thumbnail_concepts=["Show the initial state", "Show the result"], made_for_kids=False,
                           contains_synthetic_media=False, rights_confirmed=True, visibility="public")
        (self.project / "packaging").mkdir()
        self.description = "An explicitly synthetic test description."
        (self.project / "packaging/description.txt").write_text(self.description, encoding="utf-8")
        Image.new("RGB", (360, 640), "white").save(self.project / "packaging/thumbnail.png")
        channel.write(self.project / "video.json", self.config)
        for module, name, value in ((channel, "WORKSPACE", self.workspace), (channel, "ROOT", self.root),
                                    (analytics, "WORKSPACE", self.workspace), (analytics, "ROOT", self.root)):
            patcher = patch.object(module, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)
        patcher = patch.object(channel, "studio", return_value=self.real_studio)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.api = FakeAPI(self.config, self.description)

    def save_config(self):
        channel.write(self.project / "video.json", self.config)

    def approve(self):
        channel.package(self.project)
        channel.approve(self.project, "Synthetic release approval for fixture only", "test:user")

    def upload(self):
        self.approve()
        channel.upload(self.project, self.api)

    def studio_checks(self):
        (self.project / "studio-check.txt").write_text("Synthetic Studio evidence, not a real account check", encoding="utf-8")
        channel.attest(self.project, "studio_checks", "studio-check.txt", "Synthetic check", "test:user")

    def test_package_preserves_production_gates(self):
        before = self.real_studio.snapshot(self.production, 2)
        receipt = (self.production / "review/gate-2.json").read_bytes()
        data = channel.package(self.project)
        self.assertTrue((self.project / "review.html").is_file())
        self.assertNotIn("file://", (self.project / "review.html").read_text(encoding="utf-8"))
        self.assertEqual(before, self.real_studio.snapshot(self.production, 2))
        self.assertEqual(receipt, (self.production / "review/gate-2.json").read_bytes())
        self.assertEqual(data["version"], channel.read(self.project / "package.json")["version"])

    def test_source_change_blocks_package(self):
        (self.production / "SCRIPT.md").write_text("Changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "stale"):
            channel.package(self.project)

    def test_export_change_blocks_package(self):
        self.export.write_bytes(b"Changed export")
        with self.assertRaisesRegex(ValueError, "verification"):
            channel.package(self.project)

    def test_verification_cannot_point_to_another_export(self):
        path = self.production / "output/render-verification.json"
        item = channel.read(path)
        item["video"] = str(self.workspace / "elsewhere.mp4")
        channel.write(path, item)
        with self.assertRaisesRegex(ValueError, "different export"):
            channel.package(self.project)

    def test_package_requires_complete_copy_and_selections(self):
        for field, value in (("titles", []),
                             ("selected_title", True), ("thumbnail_concepts", ["one", ""]), ("promise", "")):
            with self.subTest(field=field):
                original = self.config[field]
                self.config[field] = value
                self.save_config()
                with self.assertRaises(ValueError):
                    channel.validate(self.project)
                self.config[field] = original

    def test_declarations_must_be_explicit_before_release(self):
        for field in ("made_for_kids", "contains_synthetic_media"):
            self.config[field] = None
            self.save_config()
            channel.package(self.project)
            with self.assertRaisesRegex(ValueError, "explicitly"):
                channel.validate(self.project, release=True)
            self.config[field] = False

    def test_unknown_channel_and_rights_allow_local_package_but_block_release(self):
        self.config.update(channel_id="", rights_confirmed=False)
        self.save_config()
        channel.package(self.project)
        with self.assertRaisesRegex(ValueError, "rights"):
            channel.approve(self.project, "fixture", "test:user")
        self.config["rights_confirmed"] = True
        self.save_config()
        channel.package(self.project)
        with self.assertRaisesRegex(ValueError, "channel ID"):
            channel.approve(self.project, "fixture", "test:user")

    def test_path_traversal_is_rejected(self):
        self.config["description"] = "../../escape.txt"
        self.save_config()
        with self.assertRaisesRegex(ValueError, "leaves"):
            channel.validate(self.project)

    def test_thumbnail_ratio_and_type(self):
        Image.new("RGB", (640, 360)).save(self.project / "packaging/thumbnail.png")
        with self.assertRaisesRegex(ValueError, "9:16"):
            channel.validate(self.project)

    def test_description_byte_limit_and_title_limit(self):
        (self.project / "packaging/description.txt").write_text("🙂" * 1251, encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "UTF-8"):
            channel.validate(self.project)
        (self.project / "packaging/description.txt").write_text(self.description, encoding="utf-8")
        self.config["titles"][0]["text"] = "x" * 101
        self.save_config()
        with self.assertRaisesRegex(ValueError, "1-100"):
            channel.validate(self.project)

    def test_review_escapes_copy(self):
        self.config["promise"] = '<script>alert("x")</script>'
        self.save_config()
        channel.package(self.project)
        report = (self.project / "review.html").read_text(encoding="utf-8")
        self.assertNotIn("<script>", report)
        self.assertIn("&lt;script&gt;", report)

    def test_release_requires_current_review_and_provenance(self):
        channel.package(self.project)
        with self.assertRaisesRegex(ValueError, "quote"):
            channel.approve(self.project, "", "test:user")
        (self.project / "review.html").write_text("Replaced review", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "stale"):
            channel.approve(self.project, "approve", "test:user")

    def test_changed_inputs_invalidate_release(self):
        self.approve()
        self.config["titles"][0]["text"] = "Changed title"
        self.save_config()
        with self.assertRaisesRegex(ValueError, "stale"):
            channel.upload(self.project, self.api)
        self.assertEqual(self.api.uploads, 0)

    def test_wrong_channel_prevents_upload(self):
        self.approve()
        self.api.channel_id = "another-channel"
        with self.assertRaisesRegex(ValueError, "Wrong channel"):
            channel.upload(self.project, self.api)
        self.assertEqual(self.api.uploads, 0)

    def test_upload_retry_reuses_existing_id(self):
        self.upload()
        channel.upload(self.project, self.api)
        self.assertEqual(self.api.uploads, 1)
        self.assertEqual(channel.read(self.project / "release.json")["video_id"], VIDEO_ID)

    def test_stale_uploaded_source_cannot_be_replaced(self):
        self.upload()
        release = channel.read(self.project / "release.json")
        release["export_sha256"] = "a-different-export"
        channel.write(self.project / "release.json", release)
        with self.assertRaisesRegex(ValueError, "replacement"):
            channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 0)

    def test_operation_lock_blocks_parallel_mutations(self):
        with channel.lock(self.project):
            with self.assertRaisesRegex(ValueError, "lock"):
                with channel.lock(self.project):
                    self.fail("Second lock must not succeed")
        self.assertFalse((self.project / ".operation.lock").exists())

    def test_upload_failure_preserves_operation_state(self):
        self.approve()
        with patch.object(self.api, "upload", side_effect=ValueError("Quota exhausted")):
            with self.assertRaisesRegex(ValueError, "Quota"):
                channel.upload(self.project, self.api)
        self.assertEqual(channel.read(self.project / "release.json")["state"], "uploading")

    def test_past_or_naive_schedule_is_rejected(self):
        for scheduled in ("2020-01-01T00:00:00Z", "2030-01-01T00:00:00"):
            self.config["publish_at"] = scheduled
            self.save_config()
            with self.assertRaises(ValueError):
                channel.validate(self.project, release=True)

    def test_release_needs_actual_studio_checks(self):
        self.upload()
        with self.assertRaisesRegex(ValueError, "Studio"):
            channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 0)

    def test_processing_and_failed_upload_block_release(self):
        self.upload()
        for state in ("processing", "failed"):
            self.api.result["processingDetails"]["processingStatus"] = state
            with self.assertRaisesRegex(ValueError, "processing"):
                channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 0)

    def test_existing_remote_schedule_does_not_bypass_processing(self):
        self.upload()
        self.studio_checks()
        self.api.result["status"]["publishAt"] = "2030-01-01T00:00:00Z"
        self.api.result["processingDetails"]["processingStatus"] = "processing"
        with self.assertRaisesRegex(ValueError, "processing"):
            channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 0)
        self.assertEqual(self.api.result["status"]["privacyStatus"], "private")

    def test_thumbnail_failure_keeps_video_private(self):
        self.upload()
        self.studio_checks()
        with patch.object(self.api, "thumbnail", side_effect=ValueError("Unsupported thumbnail")):
            with self.assertRaisesRegex(ValueError, "thumbnail"):
                channel.schedule(self.project, self.api)
        self.assertEqual(self.api.result["status"]["privacyStatus"], "private")
        self.assertEqual(self.api.releases, 0)

    def test_manual_thumbnail_fallback_does_not_require_changing_approved_package(self):
        self.upload()
        self.studio_checks()
        (self.project / "thumbnail-check.txt").write_text("Synthetic thumbnail evidence", encoding="utf-8")
        channel.attest(self.project, "thumbnail", "thumbnail-check.txt", "Synthetic thumbnail applied", "test:user")
        channel.schedule(self.project, self.api)
        self.assertEqual(self.api.thumbnails, 0)
        self.assertEqual(self.api.result["status"]["privacyStatus"], "public")

    def test_schedule_is_confirmed_and_idempotent(self):
        self.config["publish_at"] = "2030-10-21T08:00:00+08:00"
        self.save_config()
        self.upload()
        self.studio_checks()
        channel.schedule(self.project, self.api)
        channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 1)
        self.assertEqual(channel.read(self.project / "release.json")["state"], "scheduled")

    def test_remote_schedule_drift_is_not_reported_as_success(self):
        self.config["publish_at"] = "2030-10-21T08:00:00+08:00"
        self.save_config()
        self.upload()
        self.studio_checks()
        channel.schedule(self.project, self.api)
        self.api.result["status"]["publishAt"] = "2030-10-22T08:00:00+08:00"
        with self.assertRaisesRegex(ValueError, "changed"):
            channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 1)

    def test_remote_declaration_drift_blocks_release(self):
        self.upload()
        self.studio_checks()
        self.api.result["status"]["selfDeclaredMadeForKids"] = True
        with self.assertRaisesRegex(ValueError, "declarations"):
            channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 0)

    def test_reapproved_private_metadata_updates_same_video(self):
        self.upload()
        self.config["titles"][0]["text"] = "Reapproved test title"
        self.save_config()
        self.approve()
        self.studio_checks()
        channel.schedule(self.project, self.api)
        self.assertEqual(self.api.uploads, 1)
        self.assertEqual(self.api.result["snippet"]["title"], "Reapproved test title")

    def test_ambiguous_release_not_marked_applied(self):
        self.upload()
        self.studio_checks()
        with patch.object(self.api, "release", side_effect=ValueError("Connection dropped")):
            with self.assertRaisesRegex(ValueError, "Connection"):
                channel.schedule(self.project, self.api)
        self.assertNotIn("applied_version", channel.read(self.project / "release.json"))

    def test_ambiguous_successful_release_is_reconciled_without_repeating_update(self):
        self.upload()
        self.studio_checks()
        release = self.api.release
        def uncertain(video_id, config):
            release(video_id, config)
            raise ValueError("Network dropped after successful publication")
        with patch.object(self.api, "release", side_effect=uncertain):
            with self.assertRaisesRegex(ValueError, "Network"):
                channel.schedule(self.project, self.api)
        channel.schedule(self.project, self.api)
        self.assertEqual(self.api.releases, 1)
        self.assertEqual(channel.read(self.project / "release.json")["applied_version"], channel.validate(self.project)["version"])

    def test_upload_notification_setting_is_immutable_after_upload(self):
        self.upload()
        self.config["notify_subscribers"] = not self.config["notify_subscribers"]
        self.save_config()
        channel.package(self.project)
        with self.assertRaisesRegex(ValueError, "fixed at upload"):
            channel.approve(self.project, "Synthetic revised approval", "test:user")
        self.assertEqual(self.api.uploads, 1)

    def test_manual_upload_recovery_requires_matching_channel_package_and_evidence(self):
        self.approve()
        (self.project / "recovery.txt").write_text("Synthetic manual matching of source to remote upload", encoding="utf-8")
        channel.recover_upload(self.project, self.api, VIDEO_ID, "recovery.txt", "Synthetic recovery approval", "test:user")
        channel.upload(self.project, self.api)
        self.assertEqual(self.api.uploads, 0)
        self.assertEqual(channel.read(self.project / "release.json")["video_id"], VIDEO_ID)

    def test_csv_missing_stays_missing_and_duration_is_seconds(self):
        self.upload()
        path = self.workspace / "studio.csv"
        path.write_text("Date,Views,Average view duration,Impressions click-through rate (%)\n2026-10-01,0,1:02,\n", encoding="utf-8")
        data = analytics.import_csv(self.project, path, "2026-10-01", "2026-10-01")
        self.assertEqual(data["rows"][0]["views"], 0)
        self.assertEqual(data["rows"][0]["averageViewDuration"], 62)
        self.assertIsNone(data["rows"][0]["thumbnailCTRPercent"])

    def test_csv_rejects_other_video_and_nonfinite_metrics(self):
        self.upload()
        path = self.workspace / "studio.csv"
        for content in ("Video ID,Views\nwrong-id,100\n", "Views\nNaN\n"):
            path.write_text(content, encoding="utf-8")
            with self.assertRaises(ValueError):
                analytics.import_csv(self.project, path, "2026-10-01", "2026-10-01")

    def test_analytics_maps_reordered_headers_and_rejects_malformed_rows(self):
        result = analytics.normalized({"columnHeaders": [{"name": "views"}, {"name": "day"}], "rows": [[0, "2026-10-01"]]})
        self.assertEqual(result, [{"views": 0, "day": "2026-10-01"}])
        with self.assertRaises(ValueError):
            analytics.normalized({"columnHeaders": [{"name": "views"}], "rows": [[1, 2]]})

    def published(self):
        self.upload()
        self.api.result["status"]["privacyStatus"] = "public"

    def test_collect_is_idempotent_and_tracks_missing_reports(self):
        self.published()
        data = analytics.collect(self.project, self.api)
        analytics.collect(self.project, self.api)
        self.assertEqual(data["reports"]["retention"]["status"], "pending_or_limited")
        self.assertEqual(len(list((self.project / "analytics").glob("20*.json"))), 1)
        self.assertEqual(len(channel.read(self.project / "analytics/latest.json")["reports"]["daily"]["rows"]), 2)
        self.assertTrue((self.project / "analytics/review-1.md").is_file())
        self.assertTrue((self.project / "analytics/review-7.md").is_file())

    def test_package_changes_remain_visible_in_historical_analytics(self):
        self.published()
        analytics.collect(self.project, self.api)
        self.api.result["snippet"]["title"] = "Changed on YouTube"
        result = analytics.collect(self.project, self.api)
        self.assertEqual(len(result["package_observations"]), 2)
        report = (self.project / "analytics/review-7.md").read_text(encoding="utf-8")
        self.assertIn("historical metrics are not attributed", report)
        self.assertIn("Observed package/copy changes: 1", report)

    def test_retention_review_maps_positions_to_measured_passages(self):
        channel.write(self.production / "motion_beats.json", {"narration": [{"id": "line-1", "start_s": 0, "duration_s": 30}]})
        # The new file is a fixture input, so renew its synthetic source receipts.
        channel.write(self.production / "review/gate-2.json", {
            "gate": 2, "actor": "user", "quote": "Synthetic fixture approval", "source": "test:user",
            "files": self.real_studio.snapshot(self.production, 2), "audit_files": self.real_studio.audit_snapshot(self.production)})
        self.published()
        report = self.api.report
        def query(**parameters):
            if parameters["dimensions"] == "elapsedVideoTimeRatio":
                return {"columnHeaders": [{"name": "elapsedVideoTimeRatio"}, {"name": "audienceWatchRatio"}], "rows": [[.25, .8]]}
            return report(**parameters)
        with patch.object(self.api, "report", side_effect=query):
            analytics.collect(self.project, self.api)
        text = (self.project / "analytics/review-7.md").read_text(encoding="utf-8")
        self.assertIn("15.00 | line-1 | 0.8", text)

    def test_postpublication_source_changes_do_not_retime_old_analytics(self):
        self.published()
        channel.write(self.production / "output/render-verification.json", {"duration_s": 120})
        (self.production / "SCRIPT.md").write_text("New unrelated production source", encoding="utf-8")
        result = analytics.collect(self.project, self.api)
        self.assertEqual(result["duration_s"], 60)
        text = (self.project / "analytics/review-7.md").read_text(encoding="utf-8")
        self.assertIn("Measured passage mapping unavailable", text)

    def test_unsupported_metric_does_not_destroy_other_reports(self):
        self.published()
        report = self.api.report
        def query(**parameters):
            if parameters["metrics"] == "engagedViews":
                raise ValueError("YouTube API 400: invalidMetrics")
            return report(**parameters)
        with patch.object(self.api, "report", side_effect=query):
            data = analytics.collect(self.project, self.api)
        self.assertEqual(data["reports"]["engaged"]["status"], "unsupported_query")
        self.assertEqual(data["reports"]["daily"]["status"], "available")

    def test_quota_and_auth_failures_are_not_mislabeled_unsupported(self):
        self.published()
        for code in (401, 403, 429):
            with patch.object(self.api, "report", side_effect=ValueError(f"YouTube API {code}: failure")):
                with self.assertRaises(ValueError):
                    analytics.collect(self.project, self.api)

    def test_review_marks_pending_days_and_lesson_binds_evidence(self):
        self.published()
        analytics.collect(self.project, self.api)
        path = analytics.review(self.project, 7)
        self.assertIn("partial or pending", path.read_text(encoding="utf-8"))
        analytics.lesson(self.project, "Fixture shows incomplete coverage", "Test a revised introduction", "No audience evidence", 7)
        self.assertTrue((self.project / "analytics/LESSON.md").is_file())
        path.write_text("Changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "changed"):
            analytics.lesson(self.project, "observation", "experiment", "limit", 7)

    def test_future_milestone_is_not_generated(self):
        self.published()
        self.api.result["snippet"]["publishedAt"] = channel.timestamp()
        analytics.collect(self.project, self.api)
        with self.assertRaisesRegex(ValueError, "not due"):
            analytics.review(self.project, 1)

    def test_retention_cleanup_and_user_requested_purge(self):
        self.published()
        analytics.collect(self.project, self.api)
        expired = self.project / "analytics/old.json"
        channel.write(expired, {"fetched_at": "2020-01-01T00:00:00Z"})
        old_time = (channel.now() - timedelta(days=31)).timestamp()
        os.utime(expired, (old_time, old_time))
        analytics.purge(self.project)
        self.assertFalse(expired.exists())
        self.assertTrue((self.project / "analytics/latest.json").exists())
        analytics.purge(self.project, delete_all=True)
        self.assertFalse((self.project / "analytics").exists())
        self.assertTrue(self.export.exists())

    def test_prior_lesson_is_carried_into_new_planning_handoff(self):
        template = self.root / "templates/video.json"
        channel.write(template, self.config)
        lesson = self.project / "analytics/LESSON.md"
        lesson.parent.mkdir()
        lesson.write_text("Observed fixture limitation. Test one earlier payoff.", encoding="utf-8")
        target = channel.init_project("next-fixture", self.production, lesson=lesson)
        config = channel.read(target / "video.json")
        self.assertEqual(config["prior_lessons"][0]["sha256"], channel.digest(lesson))
        self.assertIn("Test one earlier payoff", (target / "PLANNING.md").read_text(encoding="utf-8"))
        self.assertFalse((self.production / "PLANNING.md").exists())

    def test_changed_source_blocks_interpretation_lesson(self):
        self.published()
        analytics.collect(self.project, self.api)
        (self.production / "SCRIPT.md").write_text("Changed interpretive source", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "interpretation inputs changed"):
            analytics.lesson(self.project, "observed", "test", "limited", 7)

    def test_cli_forwards_lesson_milestone(self):
        with patch.object(analytics, "lesson") as record:
            channel.main(["lesson", "--project", str(self.project), "--milestone", "28", "--observation", "observed",
                          "--experiment", "experiment", "--limitation", "limit"])
        self.assertEqual(record.call_args.args[-1], 28)


if __name__ == "__main__":
    unittest.main()
