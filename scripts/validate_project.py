"""Validate channel projects while keeping v1 projects explicitly legacy."""
from __future__ import annotations
import argparse, json, math, re, wave
from html.parser import HTMLParser
from pathlib import Path
from narration_text import prepare_narration
from supertonic_tts import narration_lines, scene_sources

ROOT = Path(__file__).resolve().parents[1]
DESIGN = (ROOT / "DESIGN.md").read_text(encoding="utf-8")
_match = re.search(r"^version:\s*[\"']?([^\"'\n]+)", DESIGN, re.M)
DESIGN_VERSION = _match.group(1) if _match else "1.0.0"
PROVIDERS = {"fontawesome", "icons8", "custom", "approved-local"}

class AssetReferences(HTMLParser):
    """Resource URLs only: ordinary attribution links are not fetched assets."""
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "poster", "data-composition-src", "data-scene-src"):
            if attrs.get(key): self.urls.append(attrs[key])
        if tag in {"link", "image", "use", "feimage"}:
            self.urls.extend(attrs[key] for key in ("href", "xlink:href") if attrs.get(key))
        if attrs.get("srcset"):
            self.urls.extend(part.strip().split()[0] for part in attrs["srcset"].split(",") if part.strip())

def remote_assets(text: str) -> bool:
    parser = AssetReferences()
    parser.feed(text)
    urls = parser.urls + re.findall(r'''(?:url\(\s*|@import\s+)["']?((?:https?:)?//[^\s"')]+)''', text, re.I)
    return any(re.match(r"^(?:https?:)?//", url.strip(), re.I) for url in urls)

def attr(tag: str, name: str) -> str | None:
    m = re.search(rf"\s{re.escape(name)}\s*=\s*[\"']([^\"']+)", tag)
    return m.group(1) if m else None

def _json(path: Path, errors: list[str], label: str):
    try: return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{label}: invalid JSON ({exc})"); return {}

def _number(value, label: str, errors: list[str], positive=True):
    try: number = float(value)
    except (TypeError, ValueError): errors.append(f"{label} must be numeric"); return None
    if not math.isfinite(number) or (positive and number <= 0): errors.append(f"{label} must be finite and positive"); return None
    return number

def _approval(project: Path, errors: list[str], stage: str, v2: bool = False):
    path = project / "review" / "storyboard-approval.json"
    if stage == "plan": return
    if not path.exists(): errors.append("missing persisted storyboard approval"); return
    data = _json(path, errors, "storyboard approval")
    if not isinstance(data, dict): errors.append("storyboard approval must be an object"); return
    if data.get("status") not in {"approved", "legacy-recorded"} or (v2 and data.get("status") != "approved"): errors.append("storyboard approval must be explicitly approved")
    if data.get("status") != "legacy-recorded":
        if data.get("icon_plan") != "ICON_PLAN.json" or not data.get("sketches"): errors.append("approval must record the icon plan and production-icon sketches")
        sketches = data.get("sketches", [])
        if not isinstance(sketches, list): errors.append("approval sketches must be a list"); sketches = []
        for sketch in sketches:
            if not (project / sketch).exists(): errors.append(f"approval references a missing sketch: {sketch}")
    if stage == "render":
        final = project / "review" / "final-preview-approval.json"
        if not final.exists(): errors.append("render requires persisted final-preview approval")
        else:
            final_data = _json(final, errors, "final-preview approval")
            if not isinstance(final_data, dict) or final_data.get("status") != "approved": errors.append("final-preview approval must be explicitly approved")

def _icons(project: Path, errors: list[str], v2: bool, stage: str):
    path = project / "ICON_PLAN.json"
    if not path.exists():
        if stage != "plan": errors.append("missing ICON_PLAN.json")
        return
    data = _json(path, errors, "ICON_PLAN.json")
    if not isinstance(data, dict): errors.append("ICON_PLAN.json must be an object"); return
    icons = data.get("icons", [])
    if not isinstance(icons, list): errors.append("ICON_PLAN.json icons must be a list"); return
    if not icons and stage != "plan": errors.append("ICON_PLAN.json needs at least one production icon")
    for icon in icons:
        if not isinstance(icon, dict): errors.append("icon plan entries must be objects"); continue
        provider = icon.get("provider")
        if v2 and (provider not in PROVIDERS or not icon.get("meaning") or not icon.get("style")): errors.append(f"icon {icon.get('id', '?')} needs provider, meaning, and style")
        elif not v2 and (provider not in {"fontawesome", "icons8"} or icon.get("role") not in {"system", "hero"}): errors.append("icon plan entries need a supported provider and role")
        rel = icon.get("path")
        if not isinstance(rel, str) or not (project / rel).is_file(): errors.append(f"icon plan asset is missing: {rel}"); continue
        if v2 and (Path(rel).is_absolute() or ".." in Path(rel).parts): errors.append(f"icon path must stay inside the project: {rel}")
        if provider == "icons8":
            if not re.match(r"^https://(?:[^/]+\.)?icons8\.com/", str(icon.get("source", ""))): errors.append(f"Icons8 icon needs an Icons8 attribution URL: {rel}")
            record = (project / rel).with_suffix(".source.txt")
            if v2 and not record.exists(): errors.append(f"Icons8 icon is missing attribution record: {record.relative_to(project)}")
        if v2 and stage != "plan" and isinstance(icon.get("scenes"), list):
            for scene_id in icon["scenes"]:
                frame = project / "compositions" / "frames" / f"{scene_id}.html"
                if not frame.is_file() or rel.replace("\\", "/") not in frame.read_text(encoding="utf-8", errors="replace"):
                    errors.append(f"planned icon {rel} is missing from scene {scene_id}")
def _local_assets(project: Path, errors: list[str]):
    for asset in list(project.rglob("*.html")) + list(project.rglob("*.css")) + list(project.rglob("*.svg")):
        if any(part in {"capture", "node_modules", ".media"} for part in asset.parts): continue
        if remote_assets(asset.read_text(encoding="utf-8", errors="replace")): errors.append(f"{asset.relative_to(project)}: remote asset reference")

def _audio(project: Path, errors: list[str], v2: bool, stage: str):
    path = project / "audio_meta.json"
    if not path.exists():
        if stage != "plan": errors.append("missing audio_meta.json")
        return
    data = _json(path, errors, "audio_meta.json")
    if not isinstance(data, dict): errors.append("audio_meta.json must be an object"); return
    scenes, voices = data.get("scenes", []), data.get("voices", [])
    # v2 design changes do not fork the stable per-scene narration schema.
    schema = "hyperframes-channel/narration@1"
    if data.get("schema") != schema: errors.append(f"audio_meta.json must use {schema}")
    if not isinstance(scenes, list) or not isinstance(voices, list) or not scenes or len(scenes) != len(voices):
        errors.append("audio metadata needs one voice and scene per narration line")
        scenes, voices = [], []
    elif any(not isinstance(scene, dict) for scene in scenes):
        errors.append("audio metadata scenes must be objects")
        scenes, voices = [], []
    previous_end = 0.0
    first_start = None
    for i, scene in enumerate(scenes, 1):
        if not isinstance(scene, dict): errors.append(f"scene {i} must be an object"); continue
        start = _number(scene.get("start_s"), f"scene {i} start_s", errors, False); duration = _number(scene.get("duration_s"), f"scene {i} duration_s", errors)
        if start is not None and start < previous_end - .001: errors.append(f"scene {i} audio overlaps the previous scene")
        if start is not None and duration is not None: previous_end = start + duration
        if i == 1: first_start = start
        voice = voices[i - 1] if isinstance(voices[i - 1], dict) else {}
        if scene.get("index") != i or scene.get("audio_id") != f"voice-{voice.get('id', '')}": errors.append(f"scene {i} has unstable id/frame mapping")
        if voice.get("frame") not in {None, i}: errors.append(f"scene {i}: voice frame mapping is incorrect")
        audio = project / str(scene.get("audio_path", ""))
        if voice.get("path") != scene.get("audio_path") or voice.get("duration_s") != scene.get("duration_s"): errors.append(f"scene {i}: voice path/duration differs from scene")
        if v2 and stage != "plan" and not audio.is_file(): errors.append(f"scene {i}: missing WAV {scene.get('audio_path')}")
        if v2 and audio.is_file():
            try:
                with wave.open(str(audio)) as wav: actual = wav.getnframes() / wav.getframerate()
                if duration is not None and abs(actual - duration) > .001: errors.append(f"scene {i}: WAV duration differs from metadata")
            except (wave.Error, ZeroDivisionError): errors.append(f"scene {i}: unreadable WAV")
    if v2:
        norm = data.get("normalization")
        try:
            expected = prepare_narration(project, narration_lines(project / "SCRIPT.md"))
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            errors.append(f"narration normalization cannot be recomputed: {exc}"); expected = {"normalization": {}}
        norm = data.get("normalization")
        if not isinstance(norm, dict) or norm != expected.get("normalization"): errors.append("audio_meta.json normalization provenance does not match SCRIPT.md and pronunciation config")
        expected_lines = expected.get("lines", [])
        if any(not isinstance(v, dict) or not v.get("original_text") or not v.get("spoken_text") or v.get("normalization_fingerprint") != expected.get("normalization", {}).get("fingerprint") or v.get("id") != expected_lines[i].get("id") or v.get("original_text") != expected_lines[i].get("original_text") or v.get("spoken_text") != expected_lines[i].get("spoken_text") for i, v in enumerate(voices) if i < len(expected_lines)) or len(voices) != len(expected_lines): errors.append("each voice needs matching normalized original/spoken text and id")
        if first_start is not None and abs(first_start) > .001: errors.append("first scene must start at zero")
        try:
            if abs(float(data.get("timeline_duration_s")) - previous_end) > .12: errors.append("timeline duration does not match the final scene end")
        except (TypeError, ValueError): errors.append("timeline_duration_s must be numeric")
    if stage == "plan": return
    index_path = project / "index.html"
    if not index_path.exists(): errors.append("missing index.html"); return
    index = index_path.read_text(encoding="utf-8", errors="replace"); all_tags = re.findall(r"<audio\b[^>]*>", index, re.I)
    all_ids = [attr(tag, "id") for tag in all_tags]
    if any(not aid for aid in all_ids) or len(set(all_ids)) != len(all_ids): errors.append("audio element ids must be unique and nonempty")
    narration_ids = {scene.get("audio_id") for scene in scenes}
    narration_paths = {scene.get("audio_path") for scene in scenes}
    tags = [tag for tag in all_tags if attr(tag, "id") in narration_ids or attr(tag, "src") in narration_paths]
    if len(tags) != len(scenes): errors.append("index.html audio elements do not match narration scenes")
    ids = set()
    for scene, tag in zip(scenes, tags):
        aid = attr(tag, "id")
        if not aid or aid in ids: errors.append("audio element ids must be unique")
        if aid != scene.get("audio_id"): errors.append("narration audio id differs from audio metadata")
        ids.add(aid)
        for key in ("src", "data-start", "data-duration"):
            if attr(tag, key) is None: errors.append(f"{scene.get('id', '?')}: missing {key}")
        if attr(tag, "src") != scene.get("audio_path"): errors.append(f"{scene.get('id', '?')}: audio path differs from audio_meta.json")
        for key, sk in (("data-start", "start_s"), ("data-duration", "duration_s")):
            try:
                tag_value = float(attr(tag, key))
                if not math.isfinite(tag_value) or abs(tag_value - float(scene[sk])) > .001: errors.append(f"{scene.get('id', '?')}: {key} differs from audio_meta.json")
            except (TypeError, ValueError): errors.append(f"{scene.get('id', '?')}: invalid numeric {key}")
    frames = [src for _, src in scene_sources(project, [])]
    if frames and [s.get("src") for s in scenes] != frames: errors.append("audio metadata scene sources do not match compositions/frames")
    timeline = project / "audio_timeline.html"
    if not timeline.exists(): errors.append("missing audio_timeline.html")
    elif timeline.read_text(encoding="utf-8") != "\n".join(f'<audio id="{s["audio_id"]}" src="{s["audio_path"]}" data-start="{s["start_s"]:.6f}" data-duration="{s["duration_s"]:.6f}" data-track-index="10" data-volume="1"></audio>' for s in scenes) + "\n": errors.append("audio_timeline.html is out of sync with audio_meta.json")

def validate_diagnostics(project: Path, stage="preview") -> tuple[list[str], list[str]]:
    errors, warnings = [], []
    for name in ("BRIEF.md", "SCRIPT.md", "STORYBOARD.md", "channel.json"):
        if not (project / name).exists(): errors.append(f"missing {name}")
    if errors: return errors, warnings
    channel = _json(project / "channel.json", errors, "channel.json")
    if not isinstance(channel, dict): errors.append("channel.json must be an object"); return errors, warnings
    version = str(channel.get("design_version", "")); legacy = version != DESIGN_VERSION
    if version not in {"1.0.0", DESIGN_VERSION}: errors.append(f"unsupported channel design version {version}")
    if legacy and version != "1.0.0":
        return errors, warnings
    if legacy:
        warnings.append("legacy project: v1 rules retained; migrate to the current portrait design when revising")
        frozen, local = ROOT / "channel" / "legacy" / "v1" / "styles.css", project / "channel" / "styles.css"
        if not frozen.exists() or not local.exists(): errors.append("legacy project requires frozen and project channel/v1 stylesheets")
        elif frozen.read_bytes() != local.read_bytes(): errors.append("legacy project channel stylesheet differs from channel/legacy/v1/styles.css")
    elif channel.get("design") != "hyperframes-channel": errors.append("channel.json must declare hyperframes-channel")
    is_v2 = not legacy and DESIGN_VERSION.startswith("2")
    _approval(project, errors, stage, is_v2); _icons(project, errors, is_v2, stage); _audio(project, errors, is_v2, stage)
    if is_v2: _local_assets(project, errors)
    metadata = project / "audio_meta.json"
    if metadata.exists():
        data = _json(metadata, errors, "audio_meta.json")
        lines = re.findall(r"^## Line \d+(?:\s|$)", (project / "SCRIPT.md").read_text(encoding="utf-8"), re.M)
        if isinstance(data, dict) and isinstance(data.get("scenes"), list) and len(lines) != len(data["scenes"]): errors.append("SCRIPT.md line count does not match audio metadata scenes")
    if not legacy and DESIGN_VERSION.startswith("2"):
        index = project / "index.html"; text = index.read_text(encoding="utf-8", errors="replace") if index.exists() else ""
        root = re.search(r"<[^>]+data-composition-id=[\"'][^\"']+[\"'][^>]*>", text, re.I)
        if not root and (stage != "plan" or index.exists()): errors.append("missing index root composition")
        elif not root: pass
        elif (attr(root.group(0), "data-width") != "1080" or attr(root.group(0), "data-height") != "1920"): errors.append("index root must be 1080x1920 portrait")
        elif attr(root.group(0), "data-duration") is None: errors.append("index root must declare data-duration")
        frames = sorted((project / "compositions" / "frames").glob("*.html"))
        for frame in frames:
            frame_text = frame.read_text(encoding="utf-8", errors="replace")
            fr = re.search(r"<[^>]+data-composition-id=[\"'][^\"']+[\"'][^>]*>", frame_text, re.I)
            if fr and (attr(fr.group(0), "data-width") != "1080" or attr(fr.group(0), "data-height") != "1920"): errors.append(f"{frame.relative_to(project)} must be 1080x1920")
            if stage != "plan" and '@import url("channel/styles.css")' not in frame.read_text(encoding="utf-8", errors="replace"): errors.append(f"{frame.relative_to(project)}: missing channel stylesheet import")
            if fr and stage != "plan":
                try:
                    frame_duration = float(attr(fr.group(0), "data-duration")); audio_data = _json(project / "audio_meta.json", errors, "audio_meta.json"); audio_scenes = audio_data.get("scenes", []) if isinstance(audio_data.get("scenes"), list) else []; scene = next((s for s in audio_scenes if isinstance(s, dict) and s.get("src") == str(frame.relative_to(project)).replace("\\", "/")), None)
                    if scene and (not math.isfinite(frame_duration) or abs(frame_duration - float(scene.get("duration_s"))) > .12): errors.append(f"{frame.relative_to(project)} duration differs from audio metadata")
                except (TypeError, ValueError): errors.append(f"{frame.relative_to(project)} has invalid data-duration")
        stylesheet = project / "channel" / "styles.css"
        current_styles = ROOT / "channel" / "styles.css"
        if stage != "plan" and (not stylesheet.exists() or not current_styles.exists() or stylesheet.read_bytes() != current_styles.read_bytes()): errors.append("project channel stylesheet is missing or out of sync")
        try:
            spoken = prepare_narration(project, narration_lines(project / "SCRIPT.md"))["lines"]
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            errors.append(f"cannot estimate narration: {exc}"); spoken = []
        total = None
        if (project / "audio_meta.json").exists():
            total = _json(project / "audio_meta.json", errors, "audio_meta.json").get("timeline_duration_s")
        if root and (attr(root.group(0), "data-duration") is not None) and total is not None:
            try:
                if abs(float(attr(root.group(0), "data-duration")) - float(total)) > .12: errors.append("index root duration differs from audio metadata")
            except (TypeError, ValueError): errors.append("index root has invalid data-duration")
        hosts = re.findall(r"<[^>]+data-(?:composition|scene)-src=[\"'][^\"']+[\"'][^>]*>", text, re.I)
        audio_data = _json(metadata, errors, "audio_meta.json") if metadata.exists() else {}
        scenes = audio_data.get("scenes", []) if isinstance(audio_data, dict) else []
        scenes = [s for s in scenes if isinstance(s, dict)] if isinstance(scenes, list) else []
        if stage != "plan" and len(hosts) != len(scenes): errors.append("index scene hosts do not match narration scenes")
        host_sources = [attr(host, "data-composition-src") or attr(host, "data-scene-src") for host in hosts]
        if stage != "plan" and host_sources != [s.get("src") for s in scenes]: errors.append("index scene host sources/order differ from audio metadata")
        for host in hosts:
            src = attr(host, "data-composition-src") or attr(host, "data-scene-src")
            scene = next((s for s in scenes if isinstance(s, dict) and s.get("src") == src), None)
            if scene:
                for key, field in (("data-start", "start_s"), ("data-duration", "duration_s")):
                    try:
                        value = float(attr(host, key))
                        if not math.isfinite(value) or abs(value - float(scene[field])) > .001: errors.append(f"scene host {src}: {key} differs from audio metadata")
                    except (TypeError, ValueError): errors.append(f"scene host {src}: invalid {key}")
    return errors, warnings

def validate(project: Path) -> list[str]: return validate_diagnostics(project)[0]

def main():
    parser = argparse.ArgumentParser(); parser.add_argument("--project", type=Path); parser.add_argument("--all", action="store_true"); parser.add_argument("--stage", choices=("plan", "preview", "render"), default="preview"); args = parser.parse_args()
    projects = sorted((ROOT / "videos").iterdir()) if args.all else [args.project]
    if any(project is None for project in projects): parser.error("pass --project or --all")
    failed = False
    for project in projects:
        if not project.is_dir(): continue
        errors, warnings = validate_diagnostics(project.resolve(), args.stage)
        for warning in warnings: print(f"{project}: warning: {warning}")
        if errors:
            failed = True; print(project); [print(f"  - {error}") for error in errors]
    if failed: raise SystemExit(1)
    print("validated projects")

if __name__ == "__main__": main()
