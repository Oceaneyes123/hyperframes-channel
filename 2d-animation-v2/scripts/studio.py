"""Local skill discovery, handoff checks and guarded OneTake production commands."""
from __future__ import annotations

import argparse
from datetime import date
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import wave
from urllib.parse import urlparse
from urllib.request import url2pathname

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "workflow" / "skills.json"
PLAN = ("BRIEF.md", "FACTS.md", "SCRIPT.md", "VISUAL.md", "STORYBOARD.md",
        "ICON_PLAN.json", "sketches/board.html")
ROLES = ("scriptwriter", "art-director", "motion-director", "animator", "reviewer")
STORYTELLING = ("cause_effect", "continuity", "variation", "transitions", "rhythm", "camera_hierarchy")


def read(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def local(project, name):
    path = (project / name).resolve()
    if Path(name).is_absolute() or not path.is_relative_to(project.resolve()):
        raise ValueError(f"Path outside project: {name}")
    return path


def skill(role):
    spec = read(MANIFEST)[role]
    roots = [Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")) / "skills",
             Path.home() / ".agents" / "skills"]
    for root in roots:
        folder = root / spec["directory"]
        if not (folder / "SKILL.md").is_file():
            continue
        for name, expected in spec["files"].items():
            path = local(folder, name)
            if not path.is_file() or digest(path) != expected:
                raise ValueError(f"Skill differs from verified source: {path}")
        return folder
    raise ValueError(f"Missing skill: {spec['directory']}; see workflow/skills.json")


def reference_files(project):
    study = read(local(project, "REFERENCES.json"))
    return ["REFERENCES.json"] + [
        name for reference in study["references"] if reference.get("inspection")
        for name in reference["inspection"]["evidence"]]


def snapshot(project, gate):
    if gate == 1:
        paths = [local(project, name) for name in PLAN]
        paths += list((project / "sketches").rglob("*"))
        production = read(project / "production.json")
        if production.get("reference_study"):
            paths += [local(project, name) for name in reference_files(project)]
    else:
        paths = [p for p in project.rglob("*")
                 if not {"review", "output", "__pycache__", ".git"}.intersection(
                     p.relative_to(project).parts)]
    result = {}
    for path in paths:
        if path.is_file():
            name = path.relative_to(project).as_posix()
            result[name] = digest(local(project, name))
    if gate == 1:
        production = read(project / "production.json")
        creative = {key: production.get(key) for key in ("concept", "decisions", "long_format_user_source")}
        if "reference_study" in production:
            creative["reference_study"] = production["reference_study"]
        result["production.json#creative"] = hashlib.sha256(
            json.dumps(creative, sort_keys=True).encode("utf-8")).hexdigest()
    return dict(sorted(result.items()))


def require_files(project, names):
    for name in names:
        if not local(project, name).is_file():
            raise ValueError(f"Missing {name}")


def check_script(project):
    # Reuse the channel's real parser, including its contiguous-line validation.
    sys.path.insert(0, str(ROOT.parent / "2d-animation" / "scripts"))
    from supertonic_tts import narration_lines
    return narration_lines(project / "SCRIPT.md")


def check_references(project):
    study = read(local(project, "REFERENCES.json"))
    references = study.get("references")
    if not isinstance(references, list) or not references:
        raise ValueError("Reference study needs requested references")
    ids = set()
    for reference in references:
        ref_id = reference["id"]
        if not isinstance(ref_id, str) or not ref_id.strip() or ref_id in ids:
            raise ValueError("Reference IDs must be unique and nonempty")
        ids.add(ref_id)
        if not isinstance(reference["source_url"], str) or not reference["source_url"].strip():
            raise ValueError(f"Reference source missing: {ref_id}")
        status = reference["status"]
        if status not in ("inaccessible", "inspected"):
            raise ValueError(f"Reference inspection pending: {ref_id}")
        date.fromisoformat(reference["checked_on"])
        observations = reference["observations"]
        if not isinstance(observations, list):
            raise ValueError(f"Reference observations must be a list: {ref_id}")
        if status == "inaccessible":
            limitation = reference.get("limitation")
            if (observations or reference.get("inspection") is not None
                    or not isinstance(limitation, str) or not limitation.strip()):
                raise ValueError(f"Inaccessible reference needs a limitation and no animation claims: {ref_id}")
            continue
        inspection = reference["inspection"]
        video = reference["video_url"]
        if (not isinstance(video, str) or not video.strip() or not isinstance(inspection, dict)
                or inspection["method"] not in ("playback", "ordered-frames")):
            raise ValueError(f"Reference needs an exact video and moving-frame method: {ref_id}")
        ranges = inspection["viewed_ranges_s"]
        def valid_range(value):
            return (isinstance(value, list) and len(value) == 2 and all(finite(t) for t in value)
                    and 0 <= value[0] < value[1])
        if not isinstance(ranges, list) or not ranges or not all(valid_range(r) for r in ranges):
            raise ValueError(f"Invalid viewed ranges: {ref_id}")
        if not isinstance(inspection["evidence"], list) or not inspection["evidence"] or not observations:
            raise ValueError(f"Reference needs moving-frame evidence and observations: {ref_id}")
        require_files(project, inspection["evidence"])
        observation_ids = set()
        for observation in observations:
            oid = observation["id"]
            if not isinstance(oid, str) or not oid.strip() or oid in observation_ids:
                raise ValueError(f"Observation IDs must be unique and nonempty: {ref_id}")
            observation_ids.add(oid)
            window = observation["range_s"]
            if not valid_range(window) or not any(a <= window[0] < window[1] <= b for a, b in ranges):
                raise ValueError(f"Observation outside inspected moving frames: {ref_id}/{oid}")
            for field in ("observation", "technique", "use_when", "avoid_when"):
                if not isinstance(observation[field], str) or not observation[field].strip():
                    raise ValueError(f"Reference observation missing {field}: {ref_id}/{oid}")
    return study


def check_refinement(project, report):
    if "refinement" not in report:
        # Preserve unchanged historical approvals; a revised plan needs both skills.
        try:
            receipt(project, 1)
        except (ValueError, KeyError, OSError, TypeError):
            raise ValueError("Missing Scriptwriter humanizer execution evidence") from None
        return
    refinement = report["refinement"]
    if (not isinstance(refinement, dict) or refinement.get("status") != "executed"
            or not isinstance(refinement.get("procedures"), list)
            or not refinement["procedures"]
            or not all(isinstance(step, str) and step.strip() for step in refinement["procedures"])):
        raise ValueError("Incomplete Scriptwriter humanizer execution")
    original = skill("humanizer") / "SKILL.md"
    source = refinement.get("skill", {})
    if (not isinstance(source, dict) or not isinstance(source.get("path"), str)
            or Path(source["path"]).resolve() != original.resolve()
            or source.get("sha256") != digest(original)):
        raise ValueError("Wrong or stale humanizer skill evidence")
    before, audit = refinement.get("before"), refinement.get("audit")
    if (not isinstance(before, str) or not before.strip()
            or not isinstance(audit, str) or not audit.strip()
            or len({local(project, before), local(project, audit), local(project, "SCRIPT.md")}) != 3
            or not {before, audit, "SCRIPT.md"}.issubset(report["outputs"])
            or not {before, audit}.issubset(report["evidence"])):
        raise ValueError("Humanizer needs distinct hashed draft, audit and final SCRIPT.md evidence")
    if not local(project, before).stat().st_size or not local(project, audit).stat().st_size:
        raise ValueError("Humanizer draft and audit must not be empty")


def handoff(project, role):
    report = read(local(project, f"review/{role}.json"))
    if report["role"] != role or report["status"] != "executed":
        raise ValueError(f"Incomplete {role} handoff")
    if not report["agent_id"] or not report["procedures"]:
        raise ValueError(f"Missing {role} execution evidence")
    original = skill(role) / "SKILL.md"
    if Path(report["skill"]["path"]).resolve() != original.resolve():
        raise ValueError(f"Wrong original skill for {role}")
    if report["skill"]["sha256"] != digest(original):
        raise ValueError(f"Stale skill evidence for {role}")
    if not report["inputs"] or not report["outputs"] or not report["evidence"]:
        raise ValueError(f"Missing {role} artifact evidence")
    if role != "scriptwriter" and read(project / "production.json").get("reference_study"):
        for name in reference_files(project):
            if name not in report["inputs"]:
                raise ValueError(f"Missing {role} reference-study input: {name}")
    for name, expected in report["inputs"].items():
        if digest(local(project, name)) != expected:
            raise ValueError(f"Stale {role} input: {name}")
    for name, expected in report["outputs"].items():
        if digest(local(project, name)) != expected:
            raise ValueError(f"Stale {role} output: {name}")
    require_files(project, report["evidence"])
    if role == "scriptwriter":
        check_refinement(project, report)
    return report


def check_plan(project):
    require_files(project, PLAN + ("production.json",))
    check_script(project)
    concept = read(project / "production.json")["concept"]
    if not concept["selected"] or not concept["user_source"]:
        raise ValueError("User concept selection is missing")
    if read(project / "production.json").get("reference_study"):
        check_references(project)
    for role in ROLES[:3]:
        handoff(project, role)


def receipt(project, gate):
    data = read(local(project, f"review/gate-{gate}.json"))
    if data["gate"] != gate or data["actor"] != "user":
        raise ValueError(f"Gate {gate} requires explicit user approval")
    if not data["quote"].strip() or not data["source"].strip():
        raise ValueError(f"Gate {gate} approval provenance missing")
    if data["files"] != snapshot(project, gate):
        raise ValueError(f"Gate {gate} is stale; obtain renewed approval")
    if gate == 2 and data.get("audit_files") != audit_snapshot(project):
        raise ValueError("Gate 2 audit evidence changed; obtain renewed approval")
    return data


def audit_snapshot(project):
    return {p.relative_to(project).as_posix(): digest(local(project, p.relative_to(project)))
            for p in sorted((project / "review").rglob("*"))
            if p.is_file() and not p.name.startswith("gate-")}


def check_narration(project, duration):
    meta = read(project / "audio_meta.json")
    beats = read(project / "motion_beats.json")
    lines = dict(check_script(project))
    voices = meta["voices"]
    if [voice["id"] for voice in voices] != list(lines):
        raise ValueError("Narration must cover every script passage in order")
    channel = ROOT.parent / "2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json"
    voice_hash = digest(channel)
    cues = beats["narration"]
    if [cue["id"] for cue in cues] != list(lines):
        raise ValueError("Motion cues must cover every narration passage")
    previous_end = 0
    for voice, cue in zip(voices, cues):
        wav_path = local(project, voice["path"])
        with wave.open(str(wav_path), "rb") as wav:
            measured = wav.getnframes() / wav.getframerate()
        if voice["original_text"] != lines[voice["id"]] or voice["voice_style_sha256"] != voice_hash:
            raise ValueError("Narration differs from approved speech or channel clone")
        if measured <= 0 or not finite(voice["duration_s"]) or abs(voice["duration_s"] - measured) > 1 / 30:
            raise ValueError("Narration duration differs from source WAV")
        start = cue["start_s"]
        if not finite(start) or start < previous_end:
            raise ValueError("Invalid or overlapping narration starts")
        if cue["sha256"] != digest(wav_path) or not finite(cue["duration_s"]) or abs(cue["duration_s"] - measured) > 1 / 30:
            raise ValueError("Motion cue source WAV changed")
        if not cue["cues"]:
            raise ValueError("Missing measured/listened phrase cues")
        for phrase in cue["cues"]:
            if phrase["method"] not in ("listened", "aligned"):
                raise ValueError("Phrase timing must be listened or aligned, not estimated")
            if not finite(phrase["time_s"]) or not start <= phrase["time_s"] <= start + measured:
                raise ValueError("Phrase cue falls outside its passage")
            require_files(project, [phrase["evidence"]])
        previous_end = start + measured
    if previous_end > duration + 1 / 30:
        raise ValueError("Narration extends beyond composition ending")


def check_mix(project):
    # Default narration-only export is a lossless placement of the original WAVs.
    with wave.open(str(project / "audio/narration.wav"), "rb") as mix:
        params = (mix.getnchannels(), mix.getsampwidth(), mix.getframerate())
        actual = mix.readframes(mix.getnframes())
    expected = bytearray(len(actual))
    voices = read(project / "audio_meta.json")["voices"]
    cues = read(project / "motion_beats.json")["narration"]
    for voice, cue in zip(voices, cues):
        with wave.open(str(local(project, voice["path"])), "rb") as source:
            if (source.getnchannels(), source.getsampwidth(), source.getframerate()) != params:
                raise ValueError("Mix/source PCM formats differ; use a lossless narration timeline")
            data = source.readframes(source.getnframes())
        start = round(cue["start_s"] * params[2]) * params[0] * params[1]
        if start + len(data) > len(expected):
            raise ValueError("Source passage extends beyond narration mix")
        expected[start:start + len(data)] = data
    if actual != expected:
        raise ValueError("Mix does not match source narration at measured starts")


def check_animation(project):
    check_plan(project)
    receipt(project, 1)
    require_files(project, ("comp.html", "motion.js", "ONETAKE_LICENSE",
                            "audio_meta.json", "motion_beats.json", "audio/narration.wav"))
    animator = handoff(project, "animator")
    if digest(project / "motion.js") != digest(skill("animator") / "lib/motion.js"):
        raise ValueError("Use the original OneTake motion library")
    if digest(project / "ONETAKE_LICENSE") != digest(skill("animator") / "LICENSE"):
        raise ValueError("OneTake license/Required Notice missing or changed")
    # Runtime checks below verify behavior; static strings cannot prove seek safety.
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width": 1080, "height": 1920})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            def check_request(request):
                url = urlparse(request.url)
                if url.scheme in ("data", "blob"):
                    return
                if url.scheme != "file" or not Path(url2pathname(url.path)).resolve().is_relative_to(project):
                    errors.append(f"Unfrozen external input: {request.url}")
            page.on("request", check_request)
            page.goto((project / "comp.html").as_uri())
            page.evaluate("""async () => {
                if (!window.__ready || typeof window.__ready.then !== 'function')
                    throw new Error('Missing __ready promise');
                await Promise.race([window.__ready, new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('__ready timed out')), 15000))]);
            }""")
            meta = page.evaluate("() => window.__meta")
            if (meta["w"], meta["h"], meta["fps"]) != (1080, 1920, 30):
                raise ValueError("Composition must be native 1080x1920 at 30 fps")
            duration = meta["dur"]
            if not finite(duration) or duration <= 0:
                raise ValueError("Invalid composition duration")
            if duration > 180 and not read(project / "production.json").get("long_format_user_source"):
                raise ValueError("Duration exceeds 180 s; user scope/format decision required")
            for api in ("__seek", "__track", "__motion"):
                if not page.evaluate("name => typeof window[name] === 'function'", api):
                    raise ValueError(f"Missing {api}")
            # Same target after intervening forward/backward seeks must draw identically.
            target = duration * 0.41
            page.evaluate("t => window.__seek(t)", target)
            first = page.screenshot()
            for moment in (duration * 0.9, 0, duration * 0.16, target):
                page.evaluate("t => window.__seek(t)", moment)
            if page.screenshot() != first or errors:
                raise ValueError(f"Nondeterministic seek or page errors: {errors}")
            if page.evaluate("() => [...document.querySelectorAll('audio,video')].some(x => !x.paused)"):
                raise ValueError("Muted seeks started media playback")
        finally:
            browser.close()
    with wave.open(str(project / "audio/narration.wav"), "rb") as wav:
        if wav.getnframes() / wav.getframerate() + 1 / 30 < duration:
            raise ValueError("Narration mix is shorter than the composition")
    check_narration(project, duration)
    check_mix(project)
    return dict(animator, duration_s=duration)


def check_review(project):
    animator = check_animation(project)
    reviewer = handoff(project, "reviewer")
    if reviewer["agent_id"] == animator["agent_id"]:
        raise ValueError("Reviewer must be independent of Animator")
    if reviewer.get("preview_files") != snapshot(project, 2):
        raise ValueError("Audit does not cover current preview inputs")
    if not reviewer.get("weighting_user_source") or not reviewer.get("full_playback_evidence"):
        raise ValueError("Audit lacks weighting approval or full playback evidence")
    require_files(project, reviewer["full_playback_evidence"])
    if read(project / "production.json").get("reference_study"):
        for criterion in STORYTELLING:
            assessment = reviewer.get("storytelling", {}).get(criterion, {})
            times = assessment.get("times_s")
            if (not assessment.get("assessment", "").strip() or not isinstance(times, list)
                    or not times or not all(finite(t) and 0 <= t < animator["duration_s"] for t in times)
                    or not assessment.get("evidence")):
                raise ValueError(f"Missing timestamped storytelling review: {criterion}")
            require_files(project, assessment["evidence"])
    for finding in reviewer["findings"]:
        if finding["severity"] in ("critical", "important") and (
            finding["status"] != "closed" or not finding.get("recheck_evidence")
        ):
            raise ValueError(f"Unresolved blocking finding: {finding['id']}")
        if finding["severity"] in ("critical", "important") and (
            not finding.get("fix_author_id") or finding["fix_author_id"] == reviewer["agent_id"]
            or finding.get("rechecked_by") != reviewer["agent_id"]
        ):
            raise ValueError(f"Finding requires independent fix/recheck identities: {finding['id']}")
        if finding.get("recheck_evidence"):
            require_files(project, finding["recheck_evidence"])


def approve(project, gate, quote, source):
    if not quote.strip() or not source.strip():
        raise ValueError("Exact user approval and message source are required")
    (check_plan if gate == 1 else check_review)(project)
    if gate == 2:
        receipt(project, 1)
    path = project / "review" / f"gate-{gate}.json"
    if path.exists():
        raise ValueError(f"Preserve old receipt before renewal: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    data = {"gate": gate, "actor": "user", "quote": quote,
            "source": source, "files": snapshot(project, gate)}
    if gate == 2:
        data["audit_files"] = audit_snapshot(project)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("skills", "check", "approve", "tts", "render"))
    parser.add_argument("--project", type=Path)
    parser.add_argument("--stage", choices=("references", "plan", "animation", "review"), default="plan")
    parser.add_argument("--gate", type=int, choices=(1, 2))
    parser.add_argument("--quote")
    parser.add_argument("--source")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    try:
        if args.dry_run and args.command != "tts":
            raise ValueError("--dry-run is supported only for narration normalization (tts)")
        if args.command == "skills":
            for role in ("scriptwriter", "humanizer", *ROLES[1:]):
                print(f"{role}: {skill(role) / 'SKILL.md'}")
            return
        if not args.project or not args.project.is_dir():
            raise ValueError("Existing --project directory required")
        project = args.project.resolve()
        if not project.is_relative_to(ROOT):
            raise ValueError("Production project must stay inside V2")
        if args.command == "check":
            {"references": check_references, "plan": check_plan,
             "animation": check_animation, "review": check_review}[args.stage](project)
        elif args.command == "approve":
            if not args.gate or not args.quote or not args.source:
                raise ValueError("approve requires --gate, --quote and --source from the user")
            approve(project, args.gate, args.quote, args.source)
        elif args.command == "tts":
            check_script(project)
            if not args.dry_run:
                check_plan(project)
                receipt(project, 1)
            command = [sys.executable, str(ROOT.parent / "2d-animation/scripts/supertonic_tts.py"),
                       "--project", str(project)]
            if args.dry_run:
                command.append("--dry-run")
            subprocess.run(command, check=True)
        elif args.command == "render":
            check_review(project)
            receipt(project, 2)
            output = project / "output/video.mp4"
            if output.exists():
                raise ValueError(f"Preserve existing export before rerender: {output}")
            output.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run([sys.executable, str(skill("animator") / "scripts/render.py"),
                            str(project / "comp.html"), "--width", "1080", "--height", "1920",
                            "--fps", "30", "--scale", "1", "--sfx", str(project / "audio/narration.wav"),
                            "--out", str(output)], check=True)
        print(f"OK: {args.command}")
    except (ValueError, KeyError, OSError, TypeError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"BLOCKED: {error}\n")


if __name__ == "__main__":
    main()
