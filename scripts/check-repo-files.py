"""Reject new oversized Git blobs, including files deleted before a push."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
LIMIT = 5 * 1024 * 1024


def git(*args, data=None):
    return subprocess.check_output(["git", "-C", str(ROOT), *args], input=data)


def oversized(objects, allowed):
    if not objects:
        return []
    rows = git("cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)",
               data=("\n".join(objects) + "\n").encode()).decode().splitlines()
    failures = []
    for row in rows:
        oid, kind, size = row.split()
        if kind == "blob" and int(size) > LIMIT and oid not in allowed:
            failures.append(f"{objects[oid]}: {int(size):,} bytes (limit {LIMIT:,})")
    return failures


def history_objects(revisions):
    objects = {}
    for row in git("rev-list", "--objects", *revisions).decode().splitlines():
        oid, _, path = row.partition(" ")
        objects[oid] = path or oid
    return objects


def known_commit(oid):
    return subprocess.run(["git", "-C", str(ROOT), "cat-file", "-e", f"{oid}^{{commit}}"],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--staged", action="store_true", help="Check the entire index (default)")
    group.add_argument("--history", nargs="+", metavar="REV", help="Check objects reachable in revisions/ranges")
    group.add_argument("--pre-push", action="store_true", help="Read Git's ref updates from stdin")
    args = parser.parse_args()
    allowed = set(json.loads((ROOT / "docs/housekeeping/large-file-exceptions.json").read_text())["legacyBlobs"])
    if args.history:
        objects = history_objects(args.history)
    elif args.pre_push:
        objects = {}
        for row in sys.stdin:
            _, local, _, remote = row.split()
            if set(local) == {"0"}:
                continue
            if set(remote) == {"0"}:
                revisions = [local, "--not", "--remotes"]
            elif known_commit(remote):
                revisions = [f"{remote}..{local}"]
            else:
                # A rewritten remote base may have been pruned locally. Check all outgoing history.
                revisions = [local]
            objects.update(history_objects(revisions))
    else:
        objects = {}
        for row in git("ls-files", "--stage", "-z").split(b"\0"):
            if not row:
                continue
            metadata, path = row.split(b"\t", 1)
            mode, oid, stage = metadata.decode().split()
            if mode != "160000":
                objects[oid] = path.decode("utf-8", errors="replace")
    failures = oversized(objects, allowed)
    if failures:
        print("Blocked oversized Git files:\n" + "\n".join(failures), file=sys.stderr)
        print("Store generated media in ignored output or an evidence bundle. Required source assets need a reviewed exact-blob exception.", file=sys.stderr)
        return 1
    print("Repository file-size policy passed (5 MiB; exact legacy blob exceptions).")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Repository file check failed: {error}", file=sys.stderr)
        sys.exit(1)
