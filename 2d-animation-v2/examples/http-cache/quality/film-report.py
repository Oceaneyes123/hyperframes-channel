"""Freeze supported film-audit evidence and a self-contained per-lens report."""
from pathlib import Path
import base64
import hashlib
import html
import json

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent


def read(name):
    return json.loads((PROJECT / name).read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def picture(name, caption):
    data = base64.b64encode((HERE / name).read_bytes()).decode()
    return f'<figure><img alt="{html.escape(caption)}" src="data:image/png;base64,{data}"><figcaption>{html.escape(caption)}</figcaption></figure>'


def main():
    evidence = read("reviewer-film-evidence.json")
    captures = read("quality/film-capture-check.json")
    audio = read("quality/film-playback-audio-state.json")
    muted = read("quality/film-playback-muted.json")
    source_hash = sha(PROJECT / "comp.html")
    assert source_hash == captures["comp_sha256"] == audio["comp_sha256"] == muted["comp_sha256"]
    assert all(f["status"] == "closed" for f in evidence["findings"])
    prior = read("reviewer-evidence.json")
    evidence["original_skill"]["sha256"] = sha(Path(evidence["original_skill"]["path"]))
    evidence["references_read"] = prior["references_read"] + [{
        "path": "C:/Users/Dave/.codex/skills/design-motion-principles/references/performance.md",
        "sha256": sha(Path("C:/Users/Dave/.codex/skills/design-motion-principles/references/performance.md"))}]
    evidence["procedures_completed"] += [
        "Independent corrected-source capture: all 30 phone poses inspected, native captures produced and complex native poses inspected; 634 bounds samples and eight deterministic seeks passed",
        "Independent focused recheck: 312 transition times across 10 semantic collision pairs, no collisions; 96px line2 tab displacement with body bounds unchanged",
        "Full normal-speed sound-enabled audio API-state playback completed in 100.29 seconds; full muted playback completed in 100.26 seconds; no overlapping media, browser errors or remote inputs",
        "Inspected all 100 normal-playback phone screenshots via ten contact sheets, supplemented by targeted before/action/result, camera and boundary captures",
        "Checked the long line6 hold against aligned narration: retained body remains local while the validator is at the server; did not approve or reject pacing from stillness percentage alone",
        "Original anti-checklist, motion-gap, weighted-lens, accessibility and performance procedures applied with Canvas/video adaptations and disclosed unsupported original-format step"]
    evidence["commands_executed"] = ["python quality/film-timing-check.py", "python quality/film-audit.py capture (initial and corrected sources)",
        "python quality/film-recheck.py", "python quality/film-audit.py playback", "python quality/film-report.py"]
    evidence["harness_calibration"] = "The body-invariance baseline moved from 7.45 to 7.49 seconds to sample after the already-approved camera settle ending at 7.4672 and before the separation cue at 7.5072. This corrected the reviewer check, not production code."
    evidence.update({"status": "executed-supported-audit", "full_film_audit": "completed-supported-procedures",
        "current_inputs": {p: sha(PROJECT / p) for p in ("comp.html", "motion.js", "timeline.js", "audio/narration.wav", "audio_meta.json", "motion_beats.json", "SCRIPT.md", "STORYBOARD.md", "VISUAL.md", "assets/body-v7.svg", "assets/body-v8.svg")},
        "full_playback_evidence": ["quality/film-playback-audio-state.json", "quality/film-playback-muted.json"],
        "actual_captures": "quality/film-capture-check.json",
        "report": "quality/film-audit-2026-10-16.html",
        "human_confirmation_required": {"time_s": 56.67612244897959,
            "item": "Listen to 304 Not Modified and confirm pronunciation. Native ASR heard 3/home/4; this is ambiguity, not proof of a pronunciation defect.",
            "other": "Human listening to narration quality remains unverified; browser audio API state and PCM identity are verified separately."},
        "limitations": ["Audio input/listening is unsupported by available tools. No audible quality, pronunciation or listening approval is claimed.",
            "Original required report-format reference remained unavailable after rejected reads; original skill execution remains partial despite completion of available film checks.",
            "No low-end physical device, audience comprehension or retention study; headless browser timing is not a hardware performance guarantee.",
            "No MP4 or other video encoding was performed. Gate 2 is not granted by this review."]})
    (PROJECT / "reviewer-film-evidence.json").write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    findings = "".join(f'<tr><td>{f["id"]}</td><td>{f["severity"]} · {f["status"]}</td><td>{html.escape(f["title"])}</td><td>{", ".join(str(t) for t in f["time_s"])} s</td></tr>' for f in evidence["findings"])
    contacts = "".join(picture(f"film-line-{i:02d}-phone-contact.png", f"Line {i}: actual before, action and result poses") for i in range(1,11))
    realtime = "".join(picture(f"film-realtime-{i:02d}-contact.png", f"Actual realtime playback, approximately {i*10}–{i*10+10} seconds") for i in range(10))
    report = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HTTP cache · independent film review</title>
<style>*{{box-sizing:border-box}}body{{margin:0;background:#101c2b;color:#f4f1e9;font:17px/1.6 system-ui,sans-serif}}main{{max-width:1180px;margin:auto;padding:36px 24px}}h1{{font-size:clamp(30px,5vw,54px);line-height:1.13}}h2{{margin-top:42px}}p,li{{max-width:88ch}}a{{color:#a9e2ee}}.status{{background:#233044;border-left:5px solid #f0bd68;padding:16px 22px}}figure{{margin:30px 0}}img{{display:block;width:100%;height:auto}}figcaption{{font-size:14px;color:#c8d2e0}}table{{width:100%;border-collapse:collapse;font-size:15px}}td,th{{padding:12px 8px;text-align:left;border-bottom:1px solid #546174}}code{{overflow-wrap:anywhere}}@media(max-width:700px){{main{{padding:24px 18px}}table{{display:block;overflow:auto}}}}@media(prefers-reduced-motion:reduce){{*{{scroll-behavior:auto}}}}</style>
<main><p>INDEPENDENT QUALITY REVIEW · 2026-10-16 · /root/quality_reviewer</p><h1>The image stays.<br>The mechanism becomes visible.</h1>
<div class="status"><strong>Supported film checks completed; human audio confirmation remains.</strong><p>Two actual visual findings returned to Animator and independently rechecked. No Gate 2 or render approval is granted. Original skill execution remains partial because its required report-format reference could not be read after automatic approval-review rejection. This HTML records the available original audit procedures; it does not claim the unseen original format or complete upstream compliance.</p></div>
<p>Inputs: user-approved concept A and Gate 1 plan; original channel clone; 10 source WAVs; 27 aligned cues; one deterministic OneTake composition. Current composition SHA256: <code>{source_hash}</code>. Captions, SFX and music remain off. Runtime is 99.9667 seconds at native 1080×1920, 30 fps.</p>
<h2>Findings and owner revisions</h2><table><thead><tr><th>ID</th><th>Status</th><th>Actual finding</th><th>Initial times</th></tr></thead><tbody>{findings}</tbody></table>
<p>Initial evidence is preserved under quality/film-initial/. New captures and the recheck record show the corrected preview. The Reviewer did not alter Animator files or grant either approval gate.</p>
<h2>Jakub Krehel · primary: readability and polish</h2><h3>Findings</h3><p>FILM-01 concerned transition occlusion, not safe-area overflow. At 15.162 and 24.389 seconds the freshness tab crossed the retained image/caption. At 77.734 and 88.076 seconds newly entering metadata/server/status elements competed with the retained body before its reframe settled. The owner corrected shared staging; Reviewer checked the affected transitions and neighboring teaching poses. FILM-02's corrected separation is also a readability improvement: the freshness role can be followed as an independent physical object.</p><h3>Working well</h3><p>Large retained artwork, sparse stable identifying labels and consistent navy/sky contrast make the mechanism readable at phone width. The same notched image remains recognizable through the main path. Technical 304/200 states become readable held results. Native and phone captures, boundary/camera samples and deterministic seeks support the framing assessment; a successful exit code alone was not treated as evidence.</p><p><strong>Through Jakub's lens:</strong> corrected staging preserves hierarchy during the journey as well as at the result. The review concerns visible proof and readability, not a promise of audience comprehension.</p>
<h2>Jhey Tompkins · secondary: creative teaching motion</h2><h3>Findings</h3><p>FILM-02 initially repeated the expiry cue's 16px native nudge, about 5.3px at phone width, instead of clearly separating freshness from body existence. The owner revised that approved gesture; the recheck verifies a perceptible separate role while the image stays intact. This is a causal teaching correction, not extra ambient movement.</p><h3>Working well</h3><p>Fresh local reuse, validator-only dispatch, server comparison, bodyless 304 and a visibly different 200 body use different meaningful actions. Main v7 survives as a witness while the alternate cache receives v8, earning the final return to the unchanged path. The long held request/comparison pose around line 6 supports the narration that no saved image is uploaded; the stillness percentage and longest-rest number were not used alone to approve or reject pacing. The ending holds the retained image after the answer rather than introducing unrelated motion.</p><p><strong>Through Jhey's lens:</strong> movement demonstrates the mechanism and stillness gives the viewer time to read its consequence. No measured retention, engagement or finished-video comparison is claimed.</p>
<h2>Emil Kowalski · selective: preview controls</h2><h3>Findings</h3><p>No remaining blocking control finding was observed in keyboard play/pause, arrow seeking, Home restart, range seeking or reduced-motion preference/toggle checks. Reduced-motion preview preserves semantic states while the deterministic export API remains unaffected. UI timing guidance was not imposed on the duration of educational explanations.</p><h3>Working well</h3><p>The preview has native focusable controls and visible focus treatment, no decorative utility animation, one narration mix and immediate transport response. Forward/backward deterministic seeks did not start media. Full playback used one audio element with playbackRate 1 and no overlapping media.</p><p><strong>Through Emil's lens:</strong> transport stays predictable and accessible; educational content can move purposefully without forcing flourish into the controls.</p>
<h2>Real-time playback and audio provenance</h2><p>Sound-enabled browser audio API state: {audio['samples'][-1]['wall_s']:.2f} seconds wall time, maximum sampled visual/audio clock difference {audio['max_sync_error_s']:.4f} seconds. Muted pass: {muted['samples'][-1]['wall_s']:.2f} seconds wall time, maximum sampled difference {muted['max_sync_error_s']:.4f} seconds. Both reached the complete ending at playbackRate 1. These are machine playback observations, not audible listening.</p><p>Source PCM and cloned-voice hashes, alignment copies, phrase indexes and the complete derived mix were independently checked. Speech totals 91.7420 seconds; approximately 3.0246 seconds remain after the final source passage. At 56.6761 seconds raw ASR hears “3 / home / 4”; a human must listen to “304 Not Modified” before any final approval. ASR ambiguity alone is not proof of a pronunciation error.</p>
<h2>Actual phone teaching poses</h2>{contacts}<h2>Actual real-time visual sequence</h2><p>These screenshots were captured during normal-speed playback, approximately once per second. Targeted action/boundary captures supplement them for shorter gestures. They are browser preview evidence; no MP4 or other video was encoded.</p>{realtime}
<h2>Method and remaining limits</h2><p>Applied the available original reconnaissance, motion-gap, user-confirmed weighting, checklist, anti-checklist, designer lenses, accessibility and performance procedures. Canvas geometry changes do not trigger DOM layout, so UI rules against animating CSS width/height were not applied blindly. Conditional canvas state drawings do not require React AnimatePresence. The original required output-format reference remains unavailable; no further access attempt was made during this film audit.</p><p>No pulsing indicators, repeated text blur, staggered lists, utility bounce or uniform entrance sequence was observed. Browser checks cover this environment; no low-end physical device or audience study was run. Human audio listening remains outstanding. JSON evidence, source hashes, actual commands and limitations are in reviewer-film-evidence.json and quality/film-*.json.</p></main></html>'''
    (HERE / "film-audit-2026-10-16.html").write_text(report, encoding="utf-8")
    print("Film evidence and per-lens HTML written; original skill partial, human audio check outstanding, no gate approval.")


if __name__ == "__main__":
    main()
