import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zipfile


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).resolve().parents[1] / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


guard = load("file_guard", "check-repo-files.py")
evidence = load("evidence_restore", "restore-evidence.py")


class FileGuardTests(unittest.TestCase):
    def test_index_bytes_are_checked_even_when_working_file_is_small(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            subprocess.run(["git", "init", "-q", str(root)], check=True)
            asset = root / "large.bin"
            asset.write_bytes(b"x" * (guard.LIMIT + 1))
            subprocess.run(["git", "-C", str(root), "add", "large.bin"], check=True)
            asset.write_bytes(b"small unstaged replacement")
            with patch.object(guard, "ROOT", root):
                oid = guard.git("rev-parse", ":large.bin").decode().strip()
                self.assertEqual(len(guard.oversized({oid: "large.bin"}, set())), 1)
                self.assertEqual(guard.oversized({oid: "large.bin"}, {oid}), [])

    def test_boundary_is_allowed_and_one_byte_over_is_blocked(self):
        rows = b"allowed blob 5242880\nblocked blob 5242881\ncommit commit 5242881\n"
        with patch.object(guard, "git", return_value=rows):
            failures = guard.oversized({"allowed": "a", "blocked": "b", "commit": "c"}, set())
        self.assertEqual(failures, ["b: 5,242,881 bytes (limit 5,242,880)"])

    def test_push_checks_commit_ranges_and_skips_deleted_refs(self):
        zero = "0" * 40
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "docs/housekeeping").mkdir(parents=True)
            (root / "docs/housekeeping/large-file-exceptions.json").write_text(json.dumps({"legacyBlobs": {}}))
            refs = f"refs/heads/main new refs/heads/main old\nrefs/heads/other next refs/heads/other {zero}\nrefs/heads/deleted {zero} refs/heads/deleted old\n"
            with patch.object(guard, "ROOT", root), patch.object(guard.sys, "argv", ["check", "--pre-push"]), \
                    patch.object(guard.sys, "stdin", io.StringIO(refs)), \
                    patch.object(guard, "history_objects", return_value={}) as scan, contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(guard.main(), 0)
            self.assertEqual(scan.call_args_list[0].args[0], ["old..new"])
            self.assertEqual(scan.call_args_list[1].args[0], ["next", "--not", "--remotes"])
            self.assertEqual(scan.call_count, 2)


class EvidenceTests(unittest.TestCase):
    def fixture(self, root, paths=("example/audio.wav",)):
        archive = root / "evidence.zip"
        data = b"original evidence"
        with zipfile.ZipFile(archive, "w") as bundle:
            for path in paths:
                bundle.writestr(path, data)
        manifest = {"archiveSha256": evidence.digest(archive), "files": [
            {"path": path, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(), "untracked": True}
            for path in paths]}
        return archive, manifest, data

    def test_restore_is_verified_and_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            archive, manifest, data = self.fixture(root)
            destination = root / "checkout"
            self.assertEqual(evidence.verify_or_restore(archive, manifest, destination, True), (1, 1))
            self.assertEqual((destination / "example/audio.wav").read_bytes(), data)
            self.assertEqual(evidence.verify_or_restore(archive, manifest, destination, True), (1, 0))

    def test_changed_file_blocks_all_restore_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            archive, manifest, _ = self.fixture(root, ("missing.wav", "changed.wav"))
            destination = root / "checkout"
            destination.mkdir()
            (destination / "changed.wav").write_bytes(b"local work")
            with self.assertRaisesRegex(ValueError, "Preserve changed local file"):
                evidence.verify_or_restore(archive, manifest, destination, True)
            self.assertFalse((destination / "missing.wav").exists())
            self.assertEqual((destination / "changed.wav").read_bytes(), b"local work")

    def test_corrupt_archive_and_wrong_member_hash_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            archive, manifest, _ = self.fixture(root)
            manifest["files"][0]["sha256"] = "0" * 64
            with self.assertRaisesRegex(ValueError, "member SHA-256"):
                evidence.verify_or_restore(archive, manifest, root / "checkout", True)
            manifest["archiveSha256"] = "0" * 64
            with self.assertRaisesRegex(ValueError, "archive SHA-256"):
                evidence.verify_or_restore(archive, manifest, root / "checkout", True)
            self.assertFalse((root / "checkout").exists())

    def test_archive_path_cannot_escape_checkout(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            archive, manifest, _ = self.fixture(root, ("../outside.wav",))
            with self.assertRaisesRegex(ValueError, "Unsafe archive path"):
                evidence.verify_or_restore(archive, manifest, root / "checkout", True)
            self.assertFalse((root / "outside.wav").exists())


if __name__ == "__main__":
    unittest.main()
