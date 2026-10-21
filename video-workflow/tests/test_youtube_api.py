"""Exercise official resumable-request serialization without contacting Google."""
import copy
import json
from pathlib import Path
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import channel
import youtube_api
from googleapiclient.http import HttpRequest
from googleapiclient.errors import HttpError
from google.auth.exceptions import RefreshError
import httplib2


class Transport:
    def __init__(self):
        self.posts = 0
        self.fail_chunk = True
        self.queries = 0
        self.private_bodies = []

    def request(self, uri, method="GET", body=None, headers=None, **kwargs):
        if method == "POST":
            self.posts += 1
            self.private_bodies.append(json.loads(body))
            return httplib2.Response({"status": "200", "location": "https://upload.example/PRIVATE_SESSION"}), b""
        if headers.get("Content-Range", "").startswith("bytes */"):
            self.queries += 1
            return httplib2.Response({"status": "308"}), b""
        if self.fail_chunk:
            self.fail_chunk = False
            raise OSError("Network lost after session initiation")
        return httplib2.Response({"status": "200"}), b'{"id":"testvideo01"}'


class APIUploadTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name) / "example"
        self.project.mkdir()
        self.video = self.project / "video.mp4"
        self.video.write_bytes(b"Synthetic upload fixture")
        self.data = {"version": "fixture-version", "video": self.video, "description": "fixture",
                     "config": {"channel_id": "UC" + "a" * 22, "titles": [{"text": "Fixture"}], "selected_title": 0,
                                "category_id": "27", "language": "en", "tags": [], "notify_subscribers": False,
                                "made_for_kids": False, "contains_synthetic_media": False}}
        self.records = {}
        self.transport = Transport()
        def response(resp, content):
            return json.loads(content)
        def insert(**parameters):
            return HttpRequest(self.transport, response, "https://youtube.example/upload", method="POST",
                               body=json.dumps(parameters["body"]), resumable=parameters["media_body"], methodId="youtube.videos.insert")
        self.api = youtube_api.YouTube.__new__(youtube_api.YouTube)
        self.api.data = SimpleNamespace(_http=self.transport, _model=SimpleNamespace(response=response),
                                        videos=lambda: SimpleNamespace(insert=insert))
        def save(name, data):
            self.records[name] = copy.deepcopy(data)
        for target, replacement in (("save_secret", save), ("load_secret", lambda name: copy.deepcopy(self.records.get(name)))):
            patcher = patch.object(youtube_api, target, replacement)
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_interrupted_upload_queries_same_session_after_restart(self):
        with self.assertRaisesRegex(ValueError, "transport"):
            self.api.upload(self.project, self.data)
        saved = self.records["upload-example"]
        self.assertIn("PRIVATE_SESSION", saved["request"])
        result = self.api.upload(self.project, self.data)
        self.assertEqual(result, "testvideo01")
        self.assertEqual(self.transport.posts, 1)
        self.assertEqual(self.transport.queries, 1)
        self.assertEqual(self.transport.private_bodies[0]["status"]["privacyStatus"], "private")

    def test_completed_upload_is_not_repeated_when_receipt_write_was_interrupted(self):
        self.transport.fail_chunk = False
        self.assertEqual(self.api.upload(self.project, self.data), "testvideo01")
        self.assertEqual(self.api.upload(self.project, self.data), "testvideo01")
        self.assertEqual(self.transport.posts, 1)

    def test_stored_session_cannot_upload_different_package(self):
        self.records["upload-example"] = {"version": "another-version", "channel_id": self.data["config"]["channel_id"]}
        with self.assertRaisesRegex(ValueError, "another package"):
            self.api.upload(self.project, self.data)
        self.assertEqual(self.transport.posts, 0)

    def test_ambiguous_session_blocks_new_upload(self):
        self.records["upload-example"] = {"version": self.data["version"], "channel_id": self.data["config"]["channel_id"],
                                          "request": json.dumps({"uri": "https://youtube.example/upload", "method": "POST", "body": "{}",
                                                                 "headers": {}, "methodId": "upload", "resumable": None})}
        with self.assertRaisesRegex(ValueError, "ambiguous"):
            self.api.upload(self.project, self.data)
        self.assertEqual(self.transport.posts, 0)

    def test_api_errors_do_not_leak_urls_or_server_messages(self):
        response = httplib2.Response({"status": "403"})
        error = HttpError(response, b'{"error":{"message":"SECRET_VALUE","errors":[{"reason":"quotaExceeded"}]}}', uri="https://PRIVATE_SESSION")
        safe = str(youtube_api.api_error(error))
        self.assertIn("403: quotaExceeded", safe)
        self.assertNotIn("SECRET", safe)
        self.assertNotIn("PRIVATE_SESSION", safe)

    def test_expired_oauth_has_actionable_message(self):
        self.assertIn("reconnect", str(youtube_api.api_error(RefreshError("secret refresh error"))))


class ProtectedStoreTests(unittest.TestCase):
    def test_secret_roundtrip_is_local_and_protected(self):
        with tempfile.TemporaryDirectory() as temporary, patch.object(youtube_api, "STATE", Path(temporary)):
            payload = {"refresh_token": "synthetic-test-secret"}
            youtube_api.save_secret("test", payload)
            raw = youtube_api.secret_path("test").read_bytes()
            self.assertEqual(youtube_api.load_secret("test"), payload)
            if youtube_api.os.name == "nt":
                self.assertNotIn(b"synthetic-test-secret", raw)
            else:
                self.assertEqual(youtube_api.secret_path("test").stat().st_mode & 0o777, 0o600)

    def test_store_rejects_repository_and_traversal(self):
        with patch.object(youtube_api, "STATE", channel.WORKSPACE / "unsafe-test-state"):
            with self.assertRaisesRegex(ValueError, "outside"):
                youtube_api.secret_path("test")
        with tempfile.TemporaryDirectory() as temporary, patch.object(youtube_api, "STATE", Path(temporary)):
            with self.assertRaisesRegex(ValueError, "Invalid"):
                youtube_api.secret_path("../token")


if __name__ == "__main__":
    unittest.main()
