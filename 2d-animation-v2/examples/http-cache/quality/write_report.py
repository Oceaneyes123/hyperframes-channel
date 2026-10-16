"""Write an explicitly partial audit with actual evidence and per-lens analysis."""
from pathlib import Path
import base64
import hashlib
import html
import json

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
V2 = HERE.parents[2]
SKILL = Path("C:/Users/Dave/.codex/skills/design-motion-principles")
REFS = ["SKILL.md", "workflows/audit.md", "references/audit-checklist.md",
        "references/jakub-krehel.md", "references/jhey-tompkins.md", "references/emil-kowalski.md",
        "references/accessibility.md", "references/anti-checklist.md", "references/demo-shell.html"]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    static = json.loads((HERE / "static-check.json").read_text())
    board = json.loads((HERE / "board-check.json").read_text())
    guard = json.loads((HERE / "guard-check.json").read_text())
    violations = [{"concept": view["concept"], **t} for view in static["views"] for t in view["texts"]
                  if t["native"]["x"] < 72 or t["native"]["right"] > 936
                  or t["native"]["y"] < 180 or t["native"]["bottom"] > 1600]
    visual_closed = not violations
    guard_closed = guard["result"] == "rejected"
    findings = [
        {"id": "QR-01", "severity": "important", "owner": "Art Director", "status": "closed" if visual_closed else "open",
         "title": "Teaching text falls outside the production safe area",
         "evidence": ["quality/initial/static-check.json", "quality/initial/a-phone.png", "quality/initial/b-phone.png", "quality/initial/c-phone.png"],
         "effect": "Platform overlays or camera reframing can obscure the hook and retention explanation.",
         "correction": "Recompose essential text inside x72..936/y180..1600 while preserving readable labels and large proof objects.",
         "initial_measurements": "A retention caveat y1769..1834; B cache label y1595..1675 and headline right992; C reuse label y1669..1746; top headings y129..153.",
         "recheck_evidence": ["quality/static-check.json", "quality/a-phone.png", "quality/b-phone.png", "quality/c-phone.png"] if visual_closed else [],
         "remaining_violations": violations},
        {"id": "QR-02", "severity": "important", "owner": "Director / workflow guard", "status": "closed" if guard_closed else "open",
         "title": "Narration validation accepts nonfinite metadata durations",
         "evidence": ["quality/initial/guard-check.json", "quality/guard_check.py"],
         "effect": "Invalid timing metadata can pass the check despite a finite source WAV.",
         "correction": "Require finite numeric durations before tolerance comparisons.",
         "recheck_evidence": ["quality/guard-check.json"] if guard_closed else []}]
    evidence = {
        "role": "independent-quality-reviewer", "agent_id": "/root/quality_reviewer", "date": "2026-10-15",
        "status": "partial", "full_film_audit": "blocked", "animator_identity": None,
        "independence": "Reviewer wrote only quality/ and reviewer-evidence.json; no Animator or guard files edited, no gates granted.",
        "skill": {"path": str(SKILL / "SKILL.md"), "name": "design-motion-principles", "sha256": sha(SKILL / "SKILL.md"),
                  "upstream": "kylezantos/design-motion-principles", "identity_source": "Director-verified installed original; this reviewer did not independently fetch GitHub."},
        "references_read": [{"path": str(SKILL / p), "sha256": sha(SKILL / p)} for p in REFS],
        "unavailable_reference": {"path": str(SKILL / "references/output-format.md"),
             "action": "Read-only Get-Content, followed by read-only Python read_text alternative",
             "reason": "Command blocked by PreToolUse hook: Blocked filesystem or disk modification. Use a narrowly scoped, non-destructive alternative.",
             "resolution": "Stopped after rejection; did not read or reproduce unavailable format. Original skill completion remains partial."},
        "weighting": {"primary": "Jakub Krehel: readability and polish", "secondary": "Jhey Tompkins: creative teaching", "selective": "Emil Kowalski: preview controls"},
        "weighting_user_source": "User reply questionItemId [request_user_input_async, call_bfe7e30e99284198b77911397c9806fc, 0]: Confirm weighting",
        "inputs": {p: sha(PROJECT / p) for p in ("BRIEF.md", "FACTS.md", "SCRIPT.md", "VISUAL.md", "MOTION_OPTIONS.md", "STORYBOARD.md", "sketches/concepts.html", "sketches/board.html")},
        "guard_source": {"path": str(V2 / "scripts/studio.py"), "sha256": sha(V2 / "scripts/studio.py")},
        "procedures": ["Read original Audit workflow and available required references", "Reconnaissance of purpose, structure and source patterns",
            "Motion-gap search: no conditional UI or animation in static SVG concepts; no missing-animation finding for intentional static proposals",
            "Native Chromium captures at 1080x1920 and 350px CSS width; inspected all six images",
            "Asserted no page error, horizontal page overflow or animations; reduced-motion emulation leaves static board unchanged",
            "Measured SVG text bounds against production safe area", "Applied anti-checklist: no pulse, blur entrance, hover scale, stagger, spring utility or uniform fade present in static source",
            "Independently captured all 30 selected-board poses at 350px phone and 1080x1920 native; inspected every phone pose via 10 contact sheets and complex native L03/L07/L08 states",
            "Rechecked final board: 0 text/essential-object safe violations, 14.26px smallest phone label, no local-display/freshness occlusion, L05 to L06 remains server-side, alternate 200 changes only its own body",
            "Reviewed explicit scenario-qualified board-to-production ID mapping and sparse runtime-label adaptation in STORYBOARD.md",
            "Final guard code review: Gate1 snapshots creative decisions, ready must be promise-like, external inputs recorded, CLI project scope remains V2, unsupported dry-run fails closed",
            "Text-only narrative and motion-feasibility handoff review; not executed animation", "Synthetic source-WAV reproduction of timing validation defect",
            "Sent findings to Director for owner revisions; reviewer never fixes production artifacts", "Wrote explicit partial HTML with distinct per-lens findings, working-well observations and summaries"],
        "findings": findings,
        "evidence": ["quality/static-check.json", "quality/board-check.json", "quality/guard-check.json", "quality/report-check.json", "quality/motion-audit-2026-10-15.html"],
        "commands_executed": ["python quality/static_check.py", "python quality/board_check.py", "python quality/guard_check.py", "python quality/write_report.py", "python quality/report_check.py"],
        "selected_board": {"concept": "A", "user_source": "Director-reported explicit user selection, recorded in BRIEF.md/production.json; not Gate1 approval", "poses_reviewed_phone": 30, "native_captures": 30,
            "native_poses_visually_inspected": ["L03-action", "L07-result", "L08-result"], "safe_area_violations": board["safe_area_violations"],
            "smallest_phone_label_px": min(t["phone_font_px"] for p in board["poses"] for t in p["texts"]),
            "image_capture_fix": "Native evidence capture isolates each figure and captures a verified 0,0/1080x1920 viewport to avoid long-page locator screenshot offsets; this changes no source art."},
        "limitations": ["No approved Gate1 or production comp, measured narration, synchronized preview, full playback, animation-quality result or Gate2.",
            "Original output-format reference blocked by automatic review; original audit cannot be reported complete.",
            "No production timing, weight, smoothing, transitions, camera extrema, continuity, synchronization, performance, preview keyboard controls or motion-sensitivity behavior tested.",
            "No production motion findings or looping fix demos invented. Static-layout and Python validation fixes have no applicable motion demo.",
            "Static image text and handoff quality are not beginner-comprehension, audience-retention, token-cost or old/new finished-video evidence.",
            "Independent synthetic PCM check accepts correct placement at start_s=.25 and rejects a same-length silenced mix; no real preview/export narration was available to test."],
        "full_playback_evidence": [], "approvals_granted": []}
    (PROJECT / "reviewer-evidence.json").write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    images = "".join(f'<figure><img alt="Independent concept {n.upper()} phone capture" src="data:image/png;base64,{base64.b64encode((HERE / (n+"-phone.png")).read_bytes()).decode()}"><figcaption>Concept {n.upper()} · 350px phone capture</figcaption></figure>' for n in ("a", "b", "c"))
    board_images = "".join(f'<figure><img alt="Independent phone before action result poses for script line {i}" src="data:image/png;base64,{base64.b64encode((HERE / f"line-{i:02d}-phone-contact.png").read_bytes()).decode()}"><figcaption>Script line {i} · three actual static key poses; not animation footage</figcaption></figure>' for i in range(1,11))
    rows = "".join(f'<tr><td>{f["id"]}</td><td>Important · {f["status"]}</td><td>{html.escape(f["title"])}</td><td>{html.escape(f["owner"])}</td></tr>' for f in findings)
    report = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HTTP cache · independent partial motion audit</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#101c2b;color:#f4f1e9;font:17px/1.6 system-ui,sans-serif}}main{{max-width:1180px;margin:auto;padding:36px 24px}}h1{{font-size:clamp(29px,5vw,52px);line-height:1.12}}h2{{margin-top:48px;font-size:27px}}h3{{font-size:20px}}p,li{{max-width:85ch}}a{{color:#a9e2ee}}.status{{border-left:5px solid #f0bd68;padding:14px 20px;background:#233044}}.captures{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}}figure{{margin:0}}img{{width:100%;height:auto}}figcaption{{font-size:14px;color:#c8d2e0}}table{{border-collapse:collapse;width:100%;font-size:15px}}td,th{{text-align:left;border-bottom:1px solid #546174;padding:12px 8px}}code{{overflow-wrap:anywhere}}@media(max-width:700px){{.captures{{grid-template-columns:1fr}}main{{padding:24px 18px}}table{{display:block;overflow:auto}}}}@media(prefers-reduced-motion:reduce){{*{{scroll-behavior:auto}}}}
</style><main><p>DESIGN MOTION PRINCIPLES · ORIGINAL AUDIT PROCEDURE, PARTIAL EXECUTION</p>
<h1>One retained image.<br>Independent review before production.</h1>
<p>HTTP cache representative educational explainer · 2026-10-15 · Reviewer /root/quality_reviewer</p>
<div class="status"><strong>Full-film audit blocked. No pass or approval.</strong><p>These are actual static-concept and workflow checks. No complete animation, measured voiceover or synchronized preview exists. Original required output-format.md reading was rejected by automatic approval review; this report does not claim its unseen format or full upstream compliance.</p></div>
<h2>Reconnaissance and scope</h2><p>Beginner educational portrait video with OneTake as sole animation engine. User confirmed Jakub primary for readability/polish, Jhey secondary for creative teaching, Emil selective for preview controls. Inspected SCRIPT.md, VISUAL.md, MOTION_OPTIONS.md, the actual SVG concepts and studio.py. No CLAUDE.md or package.json exists at this repository root. The three candidate compositions use static authored SVG and system fonts; they contain zero animations or conditional UI swaps.</p>
<p>Motion-gap analysis found no current conditional controls to animate. Static proposals do not need enter/exit animation. The missing production preview blocks production-motion and preview-control evaluation; it is not an invented motion defect.</p>
<h2>Actual phone captures</h2><div class="captures">{images}</div>
<p>Independent Chromium captured and reviewer inspected each concept at 350px CSS width and native 1080×1920. No page error, horizontal overflow or unintended animation was observed. Reduced-motion emulation leaves this static board unchanged. This does not establish future animation accessibility.</p>
<h2>Selected A · every static teaching pose</h2><p>All 30 before/action/result poses were independently captured at phone and native dimensions. Every phone pose was inspected; complex L03/L07/L08 states were also visually inspected at native size. All measured text and marked essential geometry fit the production safe area; the smallest phone label is 14.26px. Rechecked local-display/freshness separation, retained-body identity, request arrival across lines 5–6, 304 without a replacement body, and the separate 200 branch. Main v7 remains an unchanged witness while the alternate body becomes v8.</p><p>These are 30 instructional key states to interpolate in one world, not 30 new shots. STORYBOARD.md now maps scenario-qualified board objects to persistent production IDs and limits runtime text to sparse identifying labels. The full static board is reviewable for Gate 1; only the user can approve it.</p><div class="board-captures">{board_images}</div>
<h2>Prioritized findings and revision status</h2><table><thead><tr><th>ID</th><th>Priority/status</th><th>Finding</th><th>Owner</th></tr></thead><tbody>{rows}</tbody></table>
<h2>Jakub Krehel · primary</h2><h3>Findings</h3><p>QR-01: essential teaching text initially crossed the specified safe area. A's retention caveat occupied y1769–1834; B's cache label y1595–1675 and second headline reached x992; C's reuse label occupied y1669–1746. First headline glyphs began above y180 in all proposals. These positions were measured from the actual browser rendering and matched visual captures. The correction belongs to Art: recompose rather than shrink technical labels. Current independent recheck: <strong>{"all measured text within safe area" if visual_closed else str(len(violations))+" text bounds still outside safe area"}</strong>.</p>
<h3>Working well</h3><p>The retained image dominates A, B makes the small validator materially distinct from the body, and C separates version tags from the image plate. The palettes are coherent and the important labels remain readable in these phone stills. A's separate freshness tab directly supports the script's first contradiction. No generic blur, repeated fade entrance, pulse indicator or stagger pattern exists in the static source.</p>
<p><strong>Through Jakub's lens:</strong> the proposed hierarchy is useful; safe placement needs actual evidence, and smoothness, camera framing and production polish remain untested until animation exists.</p>
<h2>Jhey Tompkins · secondary</h2><h3>Findings and opportunities</h3><p>No creative-motion failure can be established from stills. Keep three distinct teaching mechanisms instead of skinning the same diagram. B and C depict later mechanisms, so their original static hooks cannot substitute for the accepted expiry opening; the Art/Motion handoff now states that ordering constraint. Concept choice remains the Director's user-sourced decision, not a reviewer selection.</p>
<h3>Working well</h3><p>Physical lightbox, paper dispatch and precision comparison are meaningfully different proposals. Motion planning separates stored body, freshness and validator identities; places comparison at the server after request arrival; and treats changed 200 as an alternative to 304. Intended follow-through ends in genuine rests instead of ambient drift. These are actionable planning decisions, not executed motion evidence.</p>
<p><strong>Through Jhey's lens:</strong> creative potential is tied to the mechanism. Preserve the large proof object, then demonstrate the causal journey; no audience engagement or animation-quality claim is established yet.</p>
<h2>Emil Kowalski · selective</h2><h3>Findings</h3><p>No preview controls exist to inspect. Keyboard response, interruptibility, play/pause/restart/seek behavior, audio overlap and reduced-motion playback alternatives are blocked. The static board needs no entrance animation. UI durations under 300ms do not cap spoken explanations or educational object journeys.</p>
<h3>Working well</h3><p>The current proposals add no pulsing indicators, hover scaling, automatic motion or timing friction to static concept selection. The workflow explicitly separates deterministic export from accessible preview controls and reserves MP4 rendering for Gate2.</p>
<p><strong>Through Emil's lens:</strong> retain immediate utility controls when implemented; do not manufacture decorative motion to satisfy a static-board checklist.</p>
<h2>Workflow guard evidence</h2><p>QR-02 reproduced a real validation defect using a synthetic one-second PCM WAV: NaN duration metadata passed tolerance comparisons. The fixture is never presented as channel narration or listened film timing. Current recheck result: <strong>{html.escape(guard["result"])}</strong>. The owner added finite duration checks before arithmetic. No guard source was edited by Reviewer.</p>
<p>The corrected guard rejects nonfinite timing metadata. Independent nonzero PCM fixture: correct source placement at start_s 0.25 is accepted; a same-length silenced mix is rejected. Final code inspection also confirms promise-like readiness checks, Gate 1 creative-decision hashing, external-input recording, V2 project scoping and unsupported dry-run rejection. No real film playback or export has been tested.</p>
<h2>Checklist coverage and blocked work</h2><p>Performed: context reconnaissance; actual-source motion-gap search; user-confirmed weighting; original checklist and available lens references; anti-checklist; static phone/native visual review; reduced-motion static test; safe-area measurement; independent findings routing and recheck. The original demo shell was read. No production motion defect or applicable looping motion-fix demo exists at this stage, so none was invented.</p>
<p>Blocked: original output-format reference; full animation; narration listening and measured synchronization; complete muted/sound playback; transition continuity and semantic carry; camera extrema; motion weight/easing/rhythm; low-end performance; preview keyboard/focus/reduced-motion interaction; Gate1 and Gate2. A passing source check or source hash establishes none of those.</p>
<p>The Director's workspace override places this partial report in examples/http-cache/quality/. Original upstream skills were left unchanged. No output-format fallback is represented as a completed original audit. No narration, animation or MP4 was produced by Reviewer.</p>
<p>Detailed provenance, hashes, commands, findings and limits: reviewer-evidence.json. Reproducible evidence: static_check.py, static-check.json, board_check.py, board-check.json, guard_check.py, guard-check.json and preserved initial/ captures. No controlled old/new finished-video, retention or token-cost comparison has been performed.</p></main></html>'''
    (HERE / "motion-audit-2026-10-15.html").write_text(report, encoding="utf-8")
    print(f"Partial report written; full-film audit blocked. Findings: {sum(f['status']=='open' for f in findings)} open, {sum(f['status']=='closed' for f in findings)} closed.")


if __name__ == "__main__":
    main()
