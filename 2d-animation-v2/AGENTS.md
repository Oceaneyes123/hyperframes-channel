# Director-led production

Work inside V2. Preserve existing projects and unrelated edits. The sibling is a
read-only source of shared voice tooling/assets. Never commit, push, publish or
deploy unless requested. Use CodeGraph first only when `.codegraph/` exists.

## Authority and delegation

Main agent is Director: research, scope, dependencies, factual coverage, handoffs,
conflict resolution, approvals and acceptance. Delegate substantial specialist
work through native subagent tools. Reuse idle specialists; respect slot limits;
no recursive delegation or custom agent runtime. One writer per mutable artifact.
Independent tasks may overlap; dependent stages wait for accepted inputs.
Director alone owns BRIEF.md and production.json, the approved decision record.

Read [workflow/DIRECTOR.md](workflow/DIRECTOR.md), then only the active role in
[workflow/ROLES.md](workflow/ROLES.md). Resolve originals with
`python scripts/studio.py skills`. Specialists read and execute original skills
and relevant references; role cards are contracts, not replacement skills.
Never edit upstream skills or claim execution from reading alone.

| Role | Original skill | Writing responsibility |
| --- | --- | --- |
| Scriptwriter | yaxeen/storytelling-skills: storytelling-hooks | SCRIPT.md |
| Art Director | anthropics/skills: frontend-design | VISUAL.md, ICON_PLAN.json, sketches/ |
| Motion Director | LottieFiles/motion-design-skill: motion-design | STORYBOARD.md |
| Animator | feitangyuan/onetake: onetake | narration, runtime, comp, assets, timing, preview |
| Independent Reviewer | kylezantos/design-motion-principles | audit findings and evidence |

Original skills own specialist methods. SCRIPT_GUIDE.md contains channel checks.
Motion Director plans; OneTake alone implements and renders. Resolve conflicting
recommendations in the brief. No HyperFrames, Remotion, GSAP frame assembly or
competing renderer. Reviewer never edits Animator files or approves its own fixes.
Route revisions to the owner, then return to Reviewer.

## Sequence and gates

Research → Scriptwriting → Visual Direction → Motion Planning → **Gate 1** →
Narration → Animation → Quality Audit → Revisions → **Gate 2** → Rendering.

Show three distinct visual concepts; obtain user selection before storyboarding
(a supplied concept counts). Gate 1 requires complete revised script, visual
direction, actual-asset board and storyboard. Explicit user approval precedes
final TTS and animation. Gate 2 requires the complete, independently reviewed,
synchronized preview and resolved blocking findings. Explicit user approval
precedes **any MP4**, including drafts.

Record exact user approval/message reference against file hashes with
`studio.py approve`. Director verifies the real message; JSON cannot authenticate
a human. Checks, elapsed time, "continue" and "do remaining" never grant approval.
Changes invalidate affected receipts. Use guarded `tts` and `render` commands;
direct upstream calls bypass guards and are prohibited in this workflow.
Trial/setup approval never approves a film.

## Preserved production contract

- Native **1080 x 1920, 9:16, 30 fps**. Complete, natural coverage; target ≤180 s.
  If scope/measured duration exceeds that, ask for scope/format choice. Never
  silently truncate, accelerate or split.
- Existing Supertonic channel clone/pronunciation. No preset replacement.
  Captions, SFX, music off unless requested. Preserve original passage WAVs,
  measured durations, hashes, actual starts and phrase-cue provenance. Never
  present word-count timing as measured.
- Narration explains, motion demonstrates, text identifies. Sparse labels;
  essential artwork inside x=72..936, y=180..1600 at camera extrema. Prefer
  320–420 px primary artwork (240 minimum), labels ≥36 px, values ≥40 px.
  Actual phone-size review decides readability.
- Contiguous `## Line N` from 1; four-space-indented speech; unindented notes.
  Keep sourced claims, qualifications and metaphor boundaries.
- One comp: `__ready`, pure `__seek(t)`, `__meta={dur,fps:30,w:1080,h:1920,
  cuts:[],inFrame:{...}}`, screen-space `__track(t)`, camera-aware `__motion`.
  Pass `{W:1080,H:1920}` to OneTake camera/projection helpers; defaults landscape.
  Await fonts/assets; declare real cuts only. Preserve identity, visible cause,
  meaningful carry, varied action/holds and deterministic seeks.
- Browser/export share full narration mix/timeline. No audio inside `__seek`.
  Verify play/pause/restart/seeks and no overlapping VO. Keyboard/focus and
  reduced-motion preview controls must not change deterministic export.
- Capture portrait stills/phone views; upstream `stills.py` forces landscape.
  Inspect portrait probe errors, seeks, framing, curves and continuity. Exit
  code alone proves none. Carry <0.5 fails; 0.5–0.7 needs review. Promo oracle
  uses landscape/audio rules: report original failures and justified exceptions.
  Probe speed is normalized by `1920/width`; distinguish it from raw pixel travel.
- Render approved files with explicit dimensions/fps/scale; never `--final`.
  Mix covers ending (`-shortest` can truncate). Verify streams, complete decode,
  frames, narration and ending after render.
- Preserve asset licenses and OneTake LICENSE/Required Notice with copied runtime.
  PolyForm Noncommercial does not establish monetized-use permission.

Production lives in `videos/<slug>/`; tracked `examples/` contains workflow trials.
README owns commands, role cards own handoffs, original skills own methods.
