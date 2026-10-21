"""Dated owner analytics, Studio CSV fallback, and evidence-linked planning lessons."""
from __future__ import annotations

import csv
from datetime import date, timedelta
import io
import json
import math
from pathlib import Path
import shutil
import statistics
from zoneinfo import ZoneInfo

from channel import ROOT, WORKSPACE, fingerprint, read, write, digest, local, moment, now, timestamp, reconcile

PACIFIC = ZoneInfo("America/Los_Angeles")
METRICS = "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained,subscribersLost"
CSV_COLUMNS = {
    "Views": "views", "Engaged views": "engagedViews", "Impressions": "thumbnailImpressions",
    "Impressions click-through rate (%)": "thumbnailCTRPercent", "Stayed to watch (%)": "stayedToWatchPercent",
    "Viewed (%)": "stayedToWatchPercent", "Average percentage viewed (%)": "averageViewPercentage",
    "Average view duration": "averageViewDuration", "Watch time (hours)": "watchHours",
    "Likes": "likes", "Comments": "comments", "Shares": "shares", "Subscribers": "subscriberChange",
}


def normalized(response):
    names = [header["name"] for header in response.get("columnHeaders", [])]
    if len(names) != len(set(names)):
        raise ValueError("Duplicate analytics column headers")
    rows = []
    for row in response.get("rows", []):
        if len(row) != len(names):
            raise ValueError("Analytics row does not match its column headers")
        item = dict(zip(names, row))
        if any(isinstance(value, float) and not math.isfinite(value) for value in item.values()):
            raise ValueError("Analytics contains nonfinite numeric values")
        rows.append(item)
    return rows


def purge(project, delete_all=False):
    target = (project / "analytics").resolve()
    if not target.is_relative_to(project.resolve()) or target == project.resolve():
        raise ValueError("Analytics cleanup target leaves its workflow project")
    if target.exists():
        if delete_all:
            shutil.rmtree(target)
        else:
            cutoff = now().timestamp() - timedelta(days=30).total_seconds()
            for path in target.rglob("*"):
                if path.is_file() and path.name != "LESSON.md" and path.stat().st_mtime < cutoff:
                    path.unlink()
    path = project / "release.json"
    if path.exists():
        release = read(path)
        remote = release.get("remote", {})
        if delete_all or (remote.get("checked_at") and moment(remote["checked_at"]) < now() - timedelta(days=30)):
            release.pop("remote", None)
        if delete_all:
            for field in ("published_at", "url", "studio_checks", "thumbnail"):
                release.pop(field, None)
        write(path, release)


def collect(project, api):
    purge(project)
    config = read(project / "video.json")
    release = read(project / "release.json")
    if not release.get("video_id"):
        return
    api.require_channel(config["channel_id"])
    remote = reconcile(project, api, release, config["channel_id"])
    if release["state"] != "published":
        return
    published = moment(release["published_at"])
    first = published.astimezone(PACIFIC).date()
    end = min(first + timedelta(days=27), now().astimezone(PACIFIC).date() - timedelta(days=1))
    result = {"fetched_at": timestamp(), "video_id": release["video_id"], "published_at": release["published_at"],
              "package_version": release.get("applied_version", release.get("upload_version")),
              "duration_s": release.get("duration_s"), "source_project": release.get("source_project"),
              "source_inputs": release.get("source_inputs", {}),
              "remote_copy_hash": fingerprint(remote["snippet"]),
              "report_timezone": "America/Los_Angeles", "start": str(first), "end": str(end),
              "current_counters": remote.get("statistics", {}), "reports": {},
              "unavailable": {"thumbnailCTR": "Use a single-video Studio CSV export", "viewedVersusSwiped": "Use a single-video Studio CSV export"}}
    prior_path = project / "analytics/latest.json"
    prior = read(prior_path) if prior_path.exists() else {}
    observations = prior.get("package_observations", [])
    current = {"observed_at": result["fetched_at"], "version": result["package_version"], "copy_hash": result["remote_copy_hash"]}
    if not observations or any(observations[-1].get(key) != current[key] for key in ("version", "copy_hash")):
        observations.append(current)
    result["package_observations"] = observations
    result["package_history"] = release.get("package_history", [])
    if end >= first:
        base = {"ids": "channel==MINE", "startDate": str(first), "endDate": str(end), "filters": "video==" + release["video_id"]}
        queries = {"daily": {"dimensions": "day", "metrics": METRICS, "sort": "day"},
                   "engaged": {"dimensions": "day", "metrics": "engagedViews", "sort": "day"},
                   "retention": {"dimensions": "elapsedVideoTimeRatio", "metrics": "audienceWatchRatio,relativeRetentionPerformance"},
                   "traffic": {"dimensions": "insightTrafficSourceType", "metrics": "views,estimatedMinutesWatched"}}
        for name, parameters in queries.items():
            query = {**base, **parameters}
            try:
                raw = api.report(**query)
                rows = normalized(raw)
                dates = sorted(row["day"] for row in rows if "day" in row)
                result["reports"][name] = {"status": "available" if rows else "pending_or_limited", "query": query,
                                            "covered_start": dates[0] if dates else None,
                                            "covered_end": dates[-1] if dates else None, "raw": raw, "rows": rows}
            except ValueError as error:
                if not str(error).startswith("YouTube API 400:"):
                    raise
                result["reports"][name] = {"status": "unsupported_query", "query": query, "reason": str(error), "rows": []}
    path = project / "analytics" / (now().date().isoformat() + ".json")
    write(path, result)
    write(project / "analytics/latest.json", result)
    rows = result["reports"].get("daily", {}).get("rows", [])
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=["day"] + METRICS.split(","))
    writer.writeheader()
    writer.writerows(rows)
    (project / "analytics/daily.csv").write_text(output.getvalue(), encoding="utf-8")
    for milestone in (1, 7, 28):
        if now() >= published + timedelta(days=milestone):
            review(project, milestone)
    return result


def numeric(value, duration=False):
    if value is None or not value.strip() or value.strip() in ("—", "-", "N/A"):
        return None
    if duration and ":" in value:
        parts = value.split(":")
        if len(parts) not in (2, 3):
            raise ValueError("Unsupported duration in Studio CSV")
        result = 0.0
        for part in parts:
            result = result * 60 + float(part)
    else:
        result = float(value.replace(",", "").strip().removesuffix("%"))
    if not math.isfinite(result):
        raise ValueError("CSV metric must be finite")
    return result


def import_csv(project, path, start, end):
    if not path or not start or not end:
        raise ValueError("import-analytics requires --csv, --start and --end for a single-video Studio export")
    first, last = date.fromisoformat(start), date.fromisoformat(end)
    if first > last or last > now().astimezone(PACIFIC).date():
        raise ValueError("Invalid Studio CSV reporting dates")
    release = read(project / "release.json")
    video_id = release["video_id"]
    raw = path.read_text(encoding="utf-8-sig")
    reader = csv.DictReader(io.StringIO(raw))
    if not reader.fieldnames or not any(name in CSV_COLUMNS for name in reader.fieldnames):
        raise ValueError("No supported Studio CSV columns; export English-language single-video analytics")
    rows = []
    for row in reader:
        identifier = row.get("Video ID", row.get("Content", row.get("Video", ""))).strip()
        if identifier == "Total" or row.get("Date", "").strip() == "Total":
            continue
        if identifier and identifier != video_id:
            raise ValueError("CSV contains totals or another video; use a single-video export without total rows")
        item = {CSV_COLUMNS[key]: numeric(value, key == "Average view duration")
                for key, value in row.items() if key in CSV_COLUMNS}
        if "Date" in row:
            day = date.fromisoformat(row["Date"])
            if not first <= day <= last:
                raise ValueError("CSV row is outside its declared reporting window")
            item["day"] = str(day)
        rows.append(item)
    if not rows:
        raise ValueError("CSV has no usable rows")
    result = {"fetched_at": timestamp(), "source": "Studio CSV (user-supplied single-video export)",
              "source_sha256": digest(path), "video_id": video_id, "start": start, "end": end,
              "package_version": release.get("applied_version", release.get("upload_version")),
              "raw_columns": reader.fieldnames, "rows": rows}
    purge(project)
    write(project / "analytics/imports" / (digest(path) + ".json"), result)
    return result


def window(project, milestone):
    latest = read(project / "analytics/latest.json")
    if moment(latest["fetched_at"]) < now() - timedelta(days=30):
        raise ValueError("Stored analytics is stale; collect fresh authorized data")
    published = moment(latest["published_at"])
    if now() < published + timedelta(days=milestone):
        raise ValueError(f"The {milestone}-day milestone is not due yet")
    first = published.astimezone(PACIFIC).date()
    last = first + timedelta(days=milestone - 1)
    rows = [row for row in latest["reports"].get("daily", {}).get("rows", []) if first <= date.fromisoformat(row["day"]) <= last]
    return latest, first, last, rows


def review(project, milestone):
    purge(project)
    latest, first, last, rows = window(project, milestone)
    config = read(project / "video.json")
    counters = latest.get("current_counters", {})
    total = sum(row["views"] for row in rows) if rows and all("views" in row for row in rows) else None
    complete = len({row["day"] for row in rows}) == milestone
    missing = [str(first + timedelta(days=i)) for i in range(milestone) if str(first + timedelta(days=i)) not in {r["day"] for r in rows}]
    cohort = []
    for path in (ROOT / "videos").glob("*/analytics/latest.json"):
        other = path.parent.parent
        if other == project:
            continue
        try:
            other_config = read(other / "video.json")
            if other_config["format"] != config["format"] or other_config["channel_id"] != config["channel_id"]:
                continue
            duration = latest["duration_s"]
            other_duration = read(path)["duration_s"]
            if abs(other_duration - duration) > duration * .25:
                continue
            _, _, _, other_rows = window(other, milestone)
            if len({row["day"] for row in other_rows}) == milestone:
                cohort.append(sum(row["views"] for row in other_rows))
        except (ValueError, OSError, KeyError):
            continue
    lines = [f"# {milestone}-day review: {project.name}", "", f"Generated: {timestamp()}",
             f"Publication: {latest['published_at']}", f"Calendar window: {first} through {last}, America/Los_Angeles.",
             "This is a calendar-day window, not an exact rolling elapsed-time window.",
             f"Fetched: {latest['fetched_at']}; package version: {latest.get('package_version')}", "",
             "Package version identifies settings at fetch time; historical metrics are not attributed to that package.",
             "Edits before the first observation are unknown; collection cannot reconstruct earlier exposure.",
             f"Observed package/copy changes: {max(len(latest.get('package_observations', [])) - 1, 0)}.",
             "Compare periods cautiously when package/copy changes were observed.",
             f"Daily report coverage: {'complete' if complete else 'partial or pending/limited'}.",
             f"Missing dates (never assumed zero): {', '.join(missing) or 'none'}.",
             f"Views across returned dates: {total if total is not None else 'unavailable'}.",
             f"Current counters at fetch time (not milestone totals): {counters}", "", "| Day | Views | Average view duration (s) | Average viewed (%) |", "| --- | --- | --- | --- |"]
    for row in rows:
        lines.append("| " + " | ".join(str(row.get(key, "unavailable")) for key in ("day", "views", "averageViewDuration", "averageViewPercentage")) + " |")
    engaged = {row["day"]: row.get("engagedViews") for row in latest["reports"].get("engaged", {}).get("rows", [])
               if "day" in row and first <= date.fromisoformat(row["day"]) <= last}
    lines += ["", "Engaged views by returned day (separate query): " + json.dumps(engaged, sort_keys=True),
              "", "Package observations: " + json.dumps(latest.get("package_observations", []), sort_keys=True),
              "", "Traffic-source rows (full requested API window, not necessarily this milestone):",
              "```json", json.dumps(latest["reports"].get("traffic", {}).get("rows", []), indent=2), "```"]
    source_project = local(WORKSPACE, latest["source_project"])
    duration = latest["duration_s"]
    beats_path = source_project / "motion_beats.json"
    interpretation = {}
    for name in ("SCRIPT.md", "motion_beats.json"):
        path = local(source_project, name)
        if path.exists() and latest["source_inputs"].get(name) == digest(path):
            interpretation[path.relative_to(WORKSPACE).as_posix()] = digest(path)
    beats_match = beats_path.relative_to(WORKSPACE).as_posix() in interpretation
    script_matches = (source_project / "SCRIPT.md").relative_to(WORKSPACE).as_posix() in interpretation
    beats = read(beats_path).get("narration", []) if beats_match and script_matches else []
    if not beats:
        lines += ["", "Measured passage mapping unavailable: matching original script/timing inputs are absent or changed."]
    retention = latest["reports"].get("retention", {}).get("rows", [])
    if retention:
        lines += ["", "## Retention positions", "", "Full requested API window; positions locate evidence, not the cause of exits.",
                  "", "| Video time (s) | Narration passage | Audience watch ratio |", "| --- | --- | --- |"]
        for row in retention:
            seconds = float(row["elapsedVideoTimeRatio"]) * duration
            passage = next((beat["id"] for beat in beats if beat["start_s"] <= seconds < beat["start_s"] + beat["duration_s"]), "gap or unavailable")
            lines.append(f"| {seconds:.2f} | {passage} | {row.get('audienceWatchRatio', 'unavailable')} |")
    lines += ["", "## Daily audience response", "", "| Day | Likes | Comments | Shares | Subscribers gained | Subscribers lost |",
              "| --- | --- | --- | --- | --- | --- |"]
    for row in rows:
        lines.append("| " + " | ".join(str(row.get(key, "unavailable")) for key in ("day", "likes", "comments", "shares", "subscribersGained", "subscribersLost")) + " |")
    lines += ["", "Report availability: " + "; ".join(f"{key}: {value['status']}" for key, value in latest["reports"].items()),
              "", f"Comparable channel videos: {len(cohort)} (same format, milestone, and duration within 25%).",
              f"Cohort median views over complete calendar windows: {statistics.median(cohort) if cohort else 'unavailable'}.",
              "Traffic-source mix and topic differences can still confound this descriptive comparison.",
              "No causal or statistical-significance claim is established.", "", "## One proposed next experiment", "", config["hypothesis"],
              "", "Proposal only. Record the observed evidence and limitations with the lesson command before carrying it into another brief."]
    imports = sorted((project / "analytics/imports").glob("*.json"))
    for path in imports:
        item = read(path)
        lines += ["", f"Studio supplement: {path.name}; window {item['start']} to {item['end']}; rows: {len(item['rows'])}.",
                  "Supplement is separate from API metrics; missing values remain missing.", "```json", json.dumps(item["rows"], ensure_ascii=False, indent=2), "```"]
    report = project / "analytics" / f"review-{milestone}.md"
    report.write_text("\n".join(lines) + "\n", encoding="utf-8")
    write(project / "analytics" / f"review-{milestone}.json", {"fetched_at": timestamp(), "report_sha256": digest(report),
          "latest_sha256": digest(project / "analytics/latest.json"), "milestone": milestone,
          "package_observations": latest.get("package_observations", []),
          "source_inputs": interpretation,
          "inputs": {path.relative_to(project).as_posix(): digest(path) for path in imports}})
    return report


def lesson(project, observation, experiment, limitation, milestone=7):
    if any(not value or not value.strip() for value in (observation, experiment, limitation)):
        raise ValueError("lesson requires --observation, --experiment and --limitation")
    review_path = project / "analytics" / f"review-{milestone}.md"
    record = read(project / "analytics" / f"review-{milestone}.json")
    if digest(review_path) != record["report_sha256"] or digest(project / "analytics/latest.json") != record["latest_sha256"]:
        raise ValueError("Review changed; regenerate it before recording a lesson")
    for name, sha in record.get("inputs", {}).items():
        if digest(local(project, name)) != sha:
            raise ValueError("Studio analytics evidence changed; regenerate the review")
    for name, sha in record.get("source_inputs", {}).items():
        if digest(local(WORKSPACE, name)) != sha:
            raise ValueError("Production interpretation inputs changed; regenerate the review")
    text = (f"# Planning lesson: {project.name}\n\nRecorded: {timestamp()}\n\n"
            f"Evidence: review-{milestone}.md; SHA256 {record['report_sha256']}\n\n"
            f"Observed: {observation}\n\nOne next experiment: {experiment}\n\nLimitation: {limitation}\n\n"
            "This is an editorial hypothesis, not proof of causation or a new production rule.\n")
    (project / "analytics/LESSON.md").write_text(text, encoding="utf-8")
