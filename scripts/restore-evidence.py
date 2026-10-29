"""Verify or restore the checksummed housekeeping evidence bundle without overwriting files."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs/housekeeping/evidence-2026-10-29.json"


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def verify_or_restore(archive, manifest, destination, restore=False):
    if digest(archive) != manifest["archiveSha256"]:
        raise ValueError("Evidence archive SHA-256 mismatch")
    destination = destination.resolve()
    selected = [entry for entry in manifest["files"] if entry["untracked"]]
    with zipfile.ZipFile(archive) as bundle:
        # Validate every selected member and existing destination before writing any files.
        for entry in selected:
            relative = Path(entry["path"])
            target = (destination / relative).resolve()
            if relative.is_absolute() or ".." in relative.parts or not target.is_relative_to(destination):
                raise ValueError(f"Unsafe archive path: {entry['path']}")
            with bundle.open(entry["path"]) as stream:
                if hashlib.file_digest(stream, "sha256").hexdigest() != entry["sha256"]:
                    raise ValueError(f"Evidence member SHA-256 mismatch: {entry['path']}")
            if restore and target.exists() and (not target.is_file() or digest(target) != entry["sha256"]):
                raise ValueError(f"Preserve changed local file before restoring: {entry['path']}")
        restored = 0
        if restore:
            for entry in selected:
                target = (destination / entry["path"]).resolve()
                if target.exists():
                    continue
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.open(entry["path"]) as source, target.open("xb") as output:
                    while block := source.read(1024 * 1024):
                        output.write(block)
                restored += 1
    return len(selected), restored


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--restore", action="store_true", help="Restore missing untracked evidence; never overwrite changed files")
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text())
    verified, restored = verify_or_restore(args.archive, manifest, ROOT, args.restore)
    print(f"Verified {verified} archived evidence files; restored {restored} missing files.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, zipfile.BadZipFile) as error:
        print(f"Evidence restore failed: {error}", file=sys.stderr)
        sys.exit(1)
