"""Local video packaging, authorized YouTube releases, and analytics handoffs."""
from __future__ import annotations

import argparse
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
import hashlib
import html
import importlib.util
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
UTC = timezone.utc


def now():
    return datetime.now(UTC)


def timestamp():
    return now().isoformat()


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as stream:
        temporary = Path(stream.name)
        json.dump(data, stream, indent=2, ensure_ascii=False, allow_nan=False)
        stream.write("\n")
    try:
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def digest(path):
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def local(root, name):
    if not isinstance(name, str) or not name or Path(name).is_absolute():
        raise ValueError("A relative file path is required")
    path = (root / name).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError("File path leaves its allowed directory")
    return path


def moment(value):
    try:
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, AttributeError, TypeError):
        raise ValueError("Time must be ISO 8601 with an explicit timezone") from None
    if result.tzinfo is None:
        raise ValueError("Time must include a timezone, for example +08:00")
    return result.astimezone(UTC)


def provenance(quote, source):
    if not quote or not quote.strip() or not source or not source.strip():
        raise ValueError("Exact user quote and message source are required")
    return {"quote": quote, "source": source, "recorded_at": timestamp()}


@contextmanager
def lock(project):
    path = project / ".operation.lock"
    try:
        descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise ValueError("Another operation holds the project lock; see README for crash recovery") from None
    try:
        with os.fdopen(descriptor, "w") as stream:
            stream.write(str(os.getpid()))
        yield
    finally:
        path.unlink(missing_ok=True)


def studio():
    spec = importlib.util.spec_from_file_location("channel_production", WORKSPACE / "2d-animation-v2/scripts/studio.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def source_files(config):
    project = local(WORKSPACE, config["source_project"])
    if not project.is_relative_to((WORKSPACE / "2d-animation-v2").resolve()):
        raise ValueError("Only V2 production projects are supported")
    guard = studio()
    guard.receipt(project, 1)
    guard.receipt(project, 2)
    video = local(project, "output/video.mp4")
    verification = local(project, "output/render-verification.json")
    evidence = read(verification)
    if Path(evidence.get("video", "")).resolve() != video.resolve():
        raise ValueError("Verification report refers to a different export")
    if evidence.get("full_decode") != "PASS" or evidence.get("sha256") != digest(video):
        raise ValueError("Export verification is missing, failed, or stale")
    if evidence.get("dimensions") != [1080, 1920] or str(evidence.get("fps")) not in ("30", "30/1"):
        raise ValueError("Export must be native 1080 x 1920 at 30 fps")
    if not 0 < float(evidence.get("duration_s", 0)) <= 180:
        raise ValueError("This publishing adapter supports Shorts up to 180 seconds")
    files = {"export": digest(video), "verification": digest(verification)}
    for name in ("BRIEF.md", "FACTS.md", "SCRIPT.md", "review/gate-1.json", "review/gate-2.json"):
        files[name] = digest(local(project, name))
    if (project / "motion_beats.json").exists():
        files["motion_beats.json"] = digest(local(project, "motion_beats.json"))
    return video, files, evidence


def init_project(slug, production, channel_id="", lesson=None):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise ValueError("Slug must contain lowercase words separated by hyphens")
    production = production.resolve()
    if not production.is_dir() or not production.is_relative_to((WORKSPACE / "2d-animation-v2").resolve()):
        raise ValueError("Choose an existing V2 production project")
    target = ROOT / "videos" / slug
    config = read(ROOT / "templates/video.json")
    config.update(source_project=production.relative_to(WORKSPACE).as_posix(), channel_id=channel_id)
    if lesson:
        lesson = lesson.resolve()
        if not lesson.is_relative_to(ROOT / "videos") or lesson.name != "LESSON.md" or not lesson.is_file():
            raise ValueError("Prior lesson must be an existing workflow analytics/LESSON.md")
        config["prior_lessons"] = [{"path": lesson.relative_to(ROOT).as_posix(), "sha256": digest(lesson)}]
    target.mkdir(parents=True, exist_ok=False)
    (target / "packaging").mkdir()
    write(target / "video.json", config)
    (target / "PLANNING.md").write_text(
        "# Planning handoff\n\nProduction project: " + config["source_project"] +
        "\n\nDefine the audience, promised payoff and one learning hypothesis in video.json.\n"
        "Carry those decisions into the production BRIEF.md through its Director. Existing production gates still apply.\n" +
        ("\n## Prior editorial lesson\n\n" + lesson.read_text(encoding="utf-8") if lesson else "\nNo prior lesson selected.\n"), encoding="utf-8")
    (target / "packaging/description.txt").write_text("", encoding="utf-8")
    (target / "packaging/PACKAGING.md").write_text(
        "# Packaging handoff\n\nScriptwriter: fill audience, promise, hypothesis, three title angles and description.\n"
        "Art Director: propose two thumbnail concepts and save the selected image.\n"
        "Reviewer: inspect the actual export and phone-size thumbnail for accuracy and readability.\n"
        "Director: select packaging, set channel/release settings, run package, then request explicit release approval.\n",
        encoding="utf-8")
    return target


def validate(project, release=False):
    from PIL import Image
    config = read(project / "video.json")
    if config.get("schema") != 1 or config.get("format") != "shorts":
        raise ValueError("Unsupported workflow schema or format")
    for field in ("audience", "promise", "hypothesis", "language"):
        if not isinstance(config.get(field), str) or not config[field].strip():
            raise ValueError(f"Missing {field}")
    titles = config["titles"]
    if len(titles) != 3 or len({t["text"] for t in titles}) != 3:
        raise ValueError("Three distinct title options are required")
    for title in titles:
        if not isinstance(title["text"], str) or not 0 < len(title["text"].strip()) <= 100 or any(c in title["text"] for c in "<>\r\n") or not title["angle"].strip():
            raise ValueError("Title needs an angle, 1-100 characters, and no angle brackets/newlines")
    if type(config["selected_title"]) is not int or config["selected_title"] not in range(3):
        raise ValueError("selected_title must be 0, 1 or 2")
    if len(config["thumbnail_concepts"]) != 2 or any(not c.strip() for c in config["thumbnail_concepts"]):
        raise ValueError("Two thumbnail concepts are required")
    if config["thumbnail_method"] not in ("api", "studio"):
        raise ValueError("thumbnail_method must be api or studio")
    description_path = local(project, config["description"])
    description = description_path.read_text(encoding="utf-8-sig")
    if not description.strip() or len(description.encode("utf-8")) > 5000 or "<" in description or ">" in description:
        raise ValueError("Description needs 1-5000 UTF-8 bytes and no angle brackets")
    thumbnail = local(project, config["thumbnail"])
    if thumbnail.stat().st_size > 50_000_000:
        raise ValueError("Thumbnail exceeds the current 50 MB API limit")
    with Image.open(thumbnail) as image:
        width, height = image.size
        if image.format not in ("PNG", "JPEG") or height < 640 or width * 16 != height * 9:
            raise ValueError("Shorts thumbnail must be PNG/JPEG, 9:16, with height at least 640 pixels")
        image.verify()
    if not str(config["category_id"]).isdigit():
        raise ValueError("A numeric YouTube category ID is required")
    tags = config.get("tags", [])
    if not isinstance(tags, list) or any(not isinstance(t, str) or not t.strip() or any(c in t for c in "<>\r\n") for t in tags):
        raise ValueError("Tags must be nonempty strings without angle brackets/newlines")
    if sum(len(t) + (2 if " " in t else 0) for t in tags) + max(len(tags) - 1, 0) > 500:
        raise ValueError("Tags exceed YouTube's 500-character budget")
    for field in ("made_for_kids", "contains_synthetic_media", "notify_subscribers"):
        if not release and field != "notify_subscribers" and config.get(field) is None:
            continue
        if type(config.get(field)) is not bool:
            raise ValueError(f"Set {field} explicitly to true or false")
    if release and config.get("rights_confirmed") is not True:
        raise ValueError("Confirm content, asset and tooling rights for the intended use")
    if config["visibility"] not in ("private", "unlisted", "public"):
        raise ValueError("Visibility must be private, unlisted or public")
    if config.get("publish_at"):
        scheduled = moment(config["publish_at"])
        if config["visibility"] != "public":
            raise ValueError("A scheduled release must select public visibility")
        if release and scheduled <= now():
            raise ValueError("Scheduled time is in the past; a new future time and approval are required")
    if release and not re.fullmatch(r"UC[\w-]{22}", config["channel_id"], re.ASCII):
        raise ValueError("Set the actual YouTube channel ID before release approval")
    video, sources, evidence = source_files(config)
    inputs = {"video.json": digest(project / "video.json"), config["description"]: digest(description_path),
              config["thumbnail"]: digest(thumbnail), "source": sources}
    for lesson in config.get("prior_lessons", []):
        if digest(local(ROOT, lesson["path"])) != lesson["sha256"]:
            raise ValueError("Prior lesson changed; review it and update its recorded hash")
    return {"config": config, "video": video, "description": description, "thumbnail": thumbnail,
            "source": evidence, "inputs": inputs, "version": fingerprint(inputs)}


def package(project):
    data = validate(project)
    config = data["config"]
    selected = config["titles"][config["selected_title"]]["text"]
    scheduled = moment(config["publish_at"]) if config.get("publish_at") else None
    schedule = (f"{scheduled.astimezone(ZoneInfo('Asia/Manila')).isoformat()} (Asia/Manila); {scheduled.isoformat()} (UTC)"
                if scheduled else "No scheduled time; selected visibility: " + config["visibility"])
    escape = html.escape
    blockers = []
    if not config["channel_id"]:
        blockers.append("target channel unset")
    if config.get("rights_confirmed") is not True:
        blockers.append("intended-use rights unconfirmed")
    if any(type(config.get(k)) is not bool for k in ("made_for_kids", "contains_synthetic_media")):
        blockers.append("audience/synthetic-media declarations unset")
    readiness = "Draft package — release blocked: " + "; ".join(blockers) if blockers else "Local package complete; explicit release approval and live account checks remain required."
    image = os.path.relpath(data["thumbnail"], project).replace(os.sep, "/")
    media = os.path.relpath(data["video"], project).replace(os.sep, "/")
    report = f"""<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>Release review</title>
<style>body{{font:18px/1.5 system-ui;max-width:1000px;margin:auto;padding:24px;background:#faf8f4;color:#202020}}
img{{max-height:600px;max-width:100%}}video{{max-height:600px;max-width:100%}}pre{{white-space:pre-wrap}}code{{overflow-wrap:anywhere}}</style>
<h1>{escape(selected)}</h1><p><strong>{escape(readiness)}</strong></p><p>Channel: {escape(config['channel_id'] or 'UNSET — release blocked')}</p>
<p>{escape(schedule)}</p><p>Audience: {escape(config['audience'])}</p><p>Promise: {escape(config['promise'])}</p>
<img src="{escape(image, quote=True)}" alt="Selected Shorts thumbnail">
<video controls preload="metadata" aria-label="Approved video preview" src="{escape(media, quote=True)}"></video>
<h2>Description</h2><pre>{escape(data['description'])}</pre>
<h2>Release settings</h2><pre>{escape(json.dumps({k: config[k] for k in ('visibility', 'publish_at', 'category_id', 'language', 'made_for_kids', 'contains_synthetic_media', 'notify_subscribers', 'thumbnail_method', 'rights_confirmed')}, indent=2))}</pre>
<h2>Title options</h2><ul>{''.join('<li>'+escape(t['text'])+' — '+escape(t['angle'])+'</li>' for t in config['titles'])}</ul>
<h2>Thumbnail concepts</h2><ul>{''.join('<li>'+escape(c)+'</li>' for c in config['thumbnail_concepts'])}</ul>
<p>Package version: <code>{data['version']}</code></p>
<p>Check the lesson, factual accuracy, thumbnail readability, rights, declarations and exact release settings before approval.</p>
<p>Passing local checks does not establish human approval or YouTube account capability.</p></html>"""
    (project / "review.html").write_text(report, encoding="utf-8")
    write(project / "package.json", {"version": data["version"], "inputs": data["inputs"],
                                    "review_sha256": digest(project / "review.html"), "prepared_at": timestamp()})
    return data


def approve(project, quote, source):
    data = validate(project, release=True)
    saved = read(project / "package.json")
    if saved["version"] != data["version"] or saved["review_sha256"] != digest(project / "review.html"):
        raise ValueError("Package review is stale; regenerate and review before approval")
    release = read(project / "release.json") if (project / "release.json").exists() else {}
    if release.get("upload_version") and release.get("upload_notify_subscribers") != data["config"]["notify_subscribers"]:
        raise ValueError("notify_subscribers was fixed at upload; preserve that setting for this video")
    if release.get("approval"):
        release.setdefault("approval_history", []).append(release["approval"])
    release["approval"] = {**provenance(quote, source), "version": data["version"]}
    release.setdefault("state", "release-approved")
    write(project / "release.json", release)


def authorized(project):
    data = validate(project, release=True)
    release = read(project / "release.json")
    if release.get("approval", {}).get("version") != data["version"]:
        raise ValueError("Release approval is missing or stale")
    return data, release


def reconcile(project, api, release, channel_id):
    remote = api.video(release["video_id"])
    if remote.get("snippet", {}).get("channelId") != channel_id:
        raise ValueError("Remote video belongs to a different channel")
    status = remote["status"]
    processing = remote.get("processingDetails", {}).get("processingStatus")
    if status.get("uploadStatus") in ("failed", "rejected", "deleted") or processing in ("failed", "terminated"):
        release["state"] = "blocked"
    elif status["privacyStatus"] == "public":
        release["state"] = "published"
        release.setdefault("published_at", remote["snippet"]["publishedAt"])
    elif status.get("publishAt"):
        release["state"] = "scheduled"
    elif processing == "succeeded" or (processing is None and status.get("uploadStatus") == "processed"):
        release["state"] = "ready"
    else:
        release["state"] = "processing"
    # Store only fields used by this workflow; never persist unrelated API metadata.
    release["remote"] = {"privacy": status["privacyStatus"], "publish_at": status.get("publishAt"),
                         "processing": processing, "upload_status": status.get("uploadStatus"),
                         "checked_at": timestamp()}
    release["url"] = "https://www.youtube.com/watch?v=" + release["video_id"]
    write(project / "release.json", release)
    return remote


def upload(project, api):
    data, release = authorized(project)
    api.require_channel(data["config"]["channel_id"])
    if release.get("video_id"):
        reconcile(project, api, release, data["config"]["channel_id"])
        return
    if release.get("upload_version") not in (None, data["version"]):
        raise ValueError("An upload already started for another package; reconcile it before changing inputs")
    release.update(state="uploading", upload_version=data["version"], export_sha256=data["inputs"]["source"]["export"],
                   upload_notify_subscribers=data["config"]["notify_subscribers"], duration_s=data["source"]["duration_s"],
                   source_project=data["config"]["source_project"], source_inputs=data["inputs"]["source"])
    write(project / "release.json", release)
    video_id = api.upload(project, data)
    release.update(video_id=video_id, state="processing")
    write(project / "release.json", release)
    reconcile(project, api, release, data["config"]["channel_id"])


def attest(project, kind, evidence, quote, source):
    data, release = authorized(project)
    if not release.get("video_id"):
        raise ValueError("Upload must complete before recording Studio evidence")
    path = local(project, evidence)
    if not path.is_file():
        raise ValueError("Save the actual Studio evidence inside this workflow project")
    release[kind] = {**provenance(quote, source), "version": data["version"],
                     "video_id": release["video_id"], "evidence": evidence, "sha256": digest(path)}
    write(project / "release.json", release)


def valid_attestation(project, release, kind, version):
    item = release.get(kind, {})
    return (item.get("version") == version and item.get("video_id") == release["video_id"]
            and item.get("evidence") and digest(local(project, item["evidence"])) == item.get("sha256"))


def recover_upload(project, api, video_id, evidence, quote, source):
    data, release = authorized(project)
    if release.get("video_id") and release["video_id"] != video_id:
        raise ValueError("A different video is already attached; replacement is prohibited")
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id or ""):
        raise ValueError("A valid YouTube --video-id is required")
    path = local(project, evidence)
    record = {**provenance(quote, source), "evidence": evidence, "sha256": digest(path)}
    api.require_channel(data["config"]["channel_id"])
    remote = api.video(video_id)
    if remote["snippet"]["channelId"] != data["config"]["channel_id"] or remote["status"]["privacyStatus"] != "private" or remote["status"].get("publishAt"):
        raise ValueError("Recovery requires the matching channel's unscheduled private video")
    if not metadata_matches(remote, data):
        raise ValueError("Remote package does not match the approved package")
    release.update(video_id=video_id, recovery=record, upload_version=data["version"],
                   export_sha256=data["inputs"]["source"]["export"], upload_notify_subscribers=data["config"]["notify_subscribers"],
                   duration_s=data["source"]["duration_s"], source_project=data["config"]["source_project"], source_inputs=data["inputs"]["source"])
    write(project / "release.json", release)
    reconcile(project, api, release, data["config"]["channel_id"])


def metadata_matches(remote, data):
    config, snippet, status = data["config"], remote["snippet"], remote["status"]
    return (snippet.get("title") == config["titles"][config["selected_title"]]["text"]
            and snippet.get("description") == data["description"]
            and snippet.get("categoryId") == str(config["category_id"])
            and snippet.get("defaultLanguage") == config["language"]
            and snippet.get("tags", []) == config.get("tags", [])
            and status.get("selfDeclaredMadeForKids") == config["made_for_kids"]
            and status.get("containsSyntheticMedia", False) == config["contains_synthetic_media"])


def release_matches(remote, config):
    status = remote["status"]
    if config.get("publish_at"):
        return (status["privacyStatus"] == "private" and status.get("publishAt")
                and moment(status["publishAt"]) == moment(config["publish_at"]))
    return status["privacyStatus"] == config["visibility"] and not status.get("publishAt")


def schedule(project, api):
    data, release = authorized(project)
    config = data["config"]
    api.require_channel(config["channel_id"])
    remote = reconcile(project, api, release, config["channel_id"])
    if release.get("release_intent") == data["version"] and release_matches(remote, config) and metadata_matches(remote, data):
        if release.get("applied_version") != data["version"]:
            release.setdefault("package_history", []).append({"confirmed_at": timestamp(), "version": data["version"]})
        release["applied_version"] = data["version"]
        write(project / "release.json", release)
        return
    if release.get("applied_version") == data["version"]:
        if release_matches(remote, config) and metadata_matches(remote, data):
            return
        raise ValueError("Remote release settings changed after confirmation; review the change and renew approval")
    if remote["status"]["privacyStatus"] != "private":
        raise ValueError("Only a private video can be released; public/unlisted edits require separate Studio review")
    processing = remote.get("processingDetails", {}).get("processingStatus")
    processed = processing == "succeeded" or (processing is None and remote["status"].get("uploadStatus") == "processed")
    if not processed or release["state"] not in ("ready", "scheduled"):
        raise ValueError("Wait for successful processing before release")
    if release.get("export_sha256") != data["inputs"]["source"]["export"]:
        raise ValueError("The approved export differs from the uploaded video; replacement is prohibited")
    if release.get("upload_notify_subscribers") != config["notify_subscribers"]:
        raise ValueError("notify_subscribers was fixed at upload; preserve the original setting")
    if not valid_attestation(project, release, "studio_checks", data["version"]):
        raise ValueError("Record actual Studio copyright/restriction review with attest --kind studio_checks")
    if valid_attestation(project, release, "thumbnail", data["version"]):
        pass
    elif config["thumbnail_method"] == "studio":
        raise ValueError("Apply the thumbnail in Studio and record attest --kind thumbnail")
    elif release.get("thumbnail_version") != data["version"]:
        receipt = api.thumbnail(release["video_id"], data["thumbnail"])
        if not receipt.get("items"):
            raise ValueError("YouTube did not acknowledge the thumbnail; keep the video private")
        release.update(thumbnail_version=data["version"])
        write(project / "release.json", release)
    if not metadata_matches(remote, data):
        if release.get("upload_version") == data["version"]:
            raise ValueError("Remote copy/declarations differ from the approved package; review the Studio changes")
        api.metadata(release["video_id"], data, remote)
        remote = api.video(release["video_id"])
        if not metadata_matches(remote, data):
            raise ValueError("YouTube has not confirmed the revised private-video metadata")
    release["release_intent"] = data["version"]
    write(project / "release.json", release)
    api.release(release["video_id"], config)
    remote = reconcile(project, api, release, config["channel_id"])
    if not release_matches(remote, config):
        raise ValueError("YouTube has not confirmed the approved release settings; check status before retrying")
    release["applied_version"] = data["version"]
    release.setdefault("package_history", []).append({"confirmed_at": timestamp(), "version": data["version"]})
    write(project / "release.json", release)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("init", "check", "package", "approve", "auth", "disconnect", "upload", "recover-upload", "schedule", "status", "attest", "collect", "import-analytics", "review", "lesson", "purge"))
    parser.add_argument("--project", type=Path)
    parser.add_argument("--production", type=Path)
    parser.add_argument("--slug")
    parser.add_argument("--channel", default="")
    parser.add_argument("--client-secrets", type=Path)
    parser.add_argument("--quote")
    parser.add_argument("--source")
    parser.add_argument("--kind", choices=("thumbnail", "studio_checks"))
    parser.add_argument("--evidence")
    parser.add_argument("--video-id")
    parser.add_argument("--csv", type=Path)
    parser.add_argument("--start")
    parser.add_argument("--end")
    parser.add_argument("--milestone", type=int, choices=(1, 7, 28), default=7)
    parser.add_argument("--observation")
    parser.add_argument("--experiment")
    parser.add_argument("--limitation")
    parser.add_argument("--prior-lesson", type=Path)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args(argv)
    try:
        if args.command == "init":
            if not args.slug or not args.production:
                raise ValueError("init requires --slug and --production")
            print(init_project(args.slug, args.production, args.channel, args.prior_lesson))
            return
        import youtube_api
        import analytics
        if args.command == "auth":
            if not args.client_secrets or not re.fullmatch(r"UC[\w-]{22}", args.channel, re.ASCII):
                raise ValueError("auth requires --client-secrets and the actual --channel ID")
            youtube_api.connect(args.client_secrets, args.channel)
            print("OK: connected to the selected channel")
            return
        if args.command == "disconnect":
            youtube_api.disconnect()
            print("OK: OAuth revoked, local credentials and collected data removed")
            return
        targets = sorted((ROOT / "videos").glob("*/video.json")) if args.all else []
        if args.all and args.command not in ("collect", "status", "purge"):
            raise ValueError("--all supports collect, status and purge only")
        projects = [p.parent for p in targets] if args.all else [args.project.resolve() if args.project else None]
        if any(not p or not p.is_relative_to(ROOT / "videos") or not (p / "video.json").is_file() for p in projects):
            raise ValueError("Choose an initialized --project inside video-workflow/videos")
        failed = False
        for project in projects:
            try:
                with lock(project):
                    if args.command == "check":
                        validate(project)
                    elif args.command == "package":
                        package(project)
                        print(project / "review.html")
                    elif args.command == "approve":
                        approve(project, args.quote, args.source)
                    elif args.command == "attest":
                        if not args.kind or not args.evidence:
                            raise ValueError("attest requires --kind and --evidence")
                        attest(project, args.kind, args.evidence, args.quote, args.source)
                    elif args.command == "upload":
                        upload(project, youtube_api.client())
                    elif args.command == "schedule":
                        schedule(project, youtube_api.client())
                    elif args.command == "recover-upload":
                        recover_upload(project, youtube_api.client(), args.video_id, args.evidence, args.quote, args.source)
                    elif args.command == "status":
                        release = read(project / "release.json")
                        config = read(project / "video.json")
                        api = youtube_api.client()
                        api.require_channel(config["channel_id"])
                        reconcile(project, api, release, config["channel_id"])
                        print(release["state"] + ": " + release["url"])
                    elif args.command == "collect":
                        if not (project / "release.json").exists():
                            if args.all:
                                continue
                            raise ValueError("Upload a video before collecting analytics")
                        analytics.collect(project, youtube_api.client())
                    elif args.command == "import-analytics":
                        analytics.import_csv(project, args.csv, args.start, args.end)
                    elif args.command == "review":
                        print(analytics.review(project, args.milestone))
                    elif args.command == "lesson":
                        analytics.lesson(project, args.observation, args.experiment, args.limitation, args.milestone)
                    elif args.command == "purge":
                        analytics.purge(project, delete_all=True)
                print(f"OK: {args.command} {project.name}")
            except (ValueError, OSError, KeyError, TypeError) as error:
                failed = True
                print(f"BLOCKED: {project.name}: {error}", file=sys.stderr)
        if failed:
            raise SystemExit(1)
    except (ValueError, OSError, KeyError, TypeError, ImportError) as error:
        parser.exit(1, f"BLOCKED: {error}\n")
    except Exception as error:
        parser.exit(1, f"BLOCKED: unexpected {type(error).__name__}; no further operations were attempted\n")


if __name__ == "__main__":
    main()
