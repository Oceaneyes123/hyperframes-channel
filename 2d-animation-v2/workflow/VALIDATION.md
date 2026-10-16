# Overhaul evidence and limits

Local implementation and representative trial, 2026-10-15. No commit, push,
publication, deployment, final narration or MP4. Existing ignored video preserved.

## What changed

Director orchestration now routes five bounded native specialists through original
skills. AGENTS.md is the short authority/production contract; DIRECTOR.md owns
stage dependencies and revisions; ROLES.md owns input/output/acceptance boundaries.
PROMPT_TEMPLATE.md uses this routing. SCRIPT_GUIDE.md retains channel teaching,
accuracy and ending constraints, but no longer replaces the upstream Scriptwriter
method. README contains commands. Production/handoff/phrase-cue templates are
executable contracts for scripts/studio.py; there is no agent runtime or renderer.

Skill provenance is pinned in skills.json. Jetpack's registry did not contain
these GitHub skills; the supported Codex skill-installer installed missing
storytelling-hooks, motion-design and design-motion-principles. The installed
frontend-design was a different skill, so the original Anthropic package was
installed as anthropic-frontend-design without overwriting it. Existing OneTake
was retained. All five original SKILL.md byte hashes matched pinned raw GitHub
sources; discovery also checks relevant installed references/tools. No upstream
file was rewritten. New skills can be automatically discovered next turn; trial
agents received exact paths and read originals directly.

Original sources: [storytelling suite](https://github.com/yaxeen/storytelling-skills),
[Anthropic design](https://github.com/anthropics/skills/tree/main/skills/frontend-design),
[motion planning](https://github.com/LottieFiles/motion-design-skill),
[OneTake](https://github.com/feitangyuan/onetake),
[independent audit](https://github.com/kylezantos/design-motion-principles).

## Representative educational trial

See ../examples/http-cache/. Its facts use RFC 9111 and MDN, not invented traffic.
User explicitly confirmed the Reviewer weighting and selected A, the image
lightbox. Those confirmations do not approve Gate 1 or Gate 2.

| Specialist | Actual execution | Limit |
| --- | --- | --- |
| Scriptwriter /root/scriptwriter | Original skill + required patterns; five labeled three-layer hooks, checklist selection, ten complete passages, concrete revisions and coverage | No measured speech, retention or audience test |
| Art Director /root/art_director | Original Anthropic plan/review/build/critique; three distinct static concepts, selected actual-art board, phone captures and owner revisions | Static compositions, not animation |
| Motion Director /root/motion_director | Original eight-step checklist and relevant references; three feasibility options, selected choreography, persistent IDs, OneTake mappings, explicit Art feedback | Windows estimated until narration |
| Animator /root/animator | Original OneTake reference/library inspection, shipped motion tests, portrait math, CLI help, actual channel normalization dry run and Chromium/runtime checks | Preparation only; no production comp/probe/TTS/render |
| Reviewer /root/quality_reviewer | Original reconnaissance/confirmed lenses/checklists/accessibility; independent actual static captures, defect reproduction, owner return paths and rechecks | Full animation unavailable; one required reference read blocked |

Raw specialist evidence and native identities live in *-evidence.json. Owner
reports preserve what ran, what was read and what did not run; no documentation
read is called a completed animation. Canonical accepted stage handoffs live in
the trial's generated review/ directory. production.json records current decisions
and revision routing; specialists do not edit each other's outputs.

Coordination exposed specific problems: B/C concept openings did not yet support
the expiry hook; a 304 must trigger reuse locally; comparison must occur at the
server after the request arrives. Independent static review found important
labels outside the safe area and returned them to Art. Motion review identified
freshness-label occlusion and constrained dual-object camera framing. These are
observed preproduction corrections, not proof of better finished engagement.

Independent code review reproduced NaN durations passing the guard. Director
fixed finite checks and added exact source-PCM placement validation. The same
independent fixture then rejected NaN and a silent same-length mix, while accepting
correct placement. Initial evidence is preserved in quality/initial/.

## Runnable verification

From V2:

```powershell
python -m unittest discover -s tests -v
python scripts/studio.py skills
python scripts/studio.py tts --project examples/http-cache --dry-run
python scripts/studio.py check --project examples/http-cache --stage plan
```

Tests cover actual channel parsing, path escape, concept selection, skill tamper,
stale input/output and approval hashes, approval provenance, no self-review,
blocking-finding revision/recheck, rejected unapproved external calls, nonfinite/
estimated/overlapping cue metadata and wrong PCM placement. A temporary static
software fixture exercises real Chromium portrait and deterministic-seek checks;
its mocked approvals/narration are explicitly not film evidence.

Guarded synthesis/render cannot launch without required current handoffs and
explicit approval receipts. Render uses original OneTake with explicit
1080 x 1920 / 30 fps / scale 1; no --final. The narration-only mix must preserve
source format and PCM at measured starts. Requested additional sound/processing
needs an explicit contract extension; it currently fails closed.

Source/library/normalizer/tool-help/runtime checks passed. A tool-help call is not
a successful composition probe or render. The browser fixture is not the trial
video. No Gate 1 or Gate 2 receipt is fabricated. Changing plan/creative inputs
invalidates Gate 1; changing preview or audit inputs invalidates Gate 2.

Final software verification: **16 unittest cases passed**, including actual
Chromium fixture execution. All five source-integrity discovery checks passed.
`git diff --check` passed. Additional testing is warranted after implementing a
real approved animation; these results do not substitute for that check.

## Comparison and remaining limits

| Dimension | Before | Evidence after |
| --- | --- | --- |
| Routing | One agent reads local story rules and OneTake for everything | Five native owners executed bounded work and exchanged concrete corrections |
| Quality review | Author review and production prose | Independent static findings/reproduction/recheck; full-film quality still unmeasured |
| Production checks | Written gate requirements and direct commands | Fail-closed wrapper plus runnable regression suite; original engines retained |
| Entry context | AGENTS.md 159 lines / 1,441 words; prompt 85 / 727 | AGENTS.md 90 / 701; prompt 52 / 398, measured against HEAD |
| Total complexity | Six tracked V2 files | More role/evidence/tool files; source hashes, schema and tests now require maintenance |
| Token use | No comparable runtime accounting | Entry text is smaller; actual session token savings are not measured or claimed |

No previous full V2 comp.html existed to audit. The existing ignored project's
board/narration was inspected read-only; it was not migrated or changed. No old
versus new finished-video or controlled script-quality comparison is claimed.

The original Reviewer audit requires output-format.md. Automatic approval review
rejected a read of that installed file with **"Blocked filesystem or disk
modification"**. The Reviewer preserved the rejection and stopped alternate
access attempts. Its clearly labeled partial HTML report does not claim compliance
with that unread format or completion of the full original audit.

OneTake portrait adaptations remain necessary: explicit camera dimensions;
stills.py accepts portrait viewport but forces 640 x 360 tiles; probe speed is
normalized by 1920/width; promo oracle assumes landscape/audio conventions;
renderer -shortest requires a complete mix. Licensing remains PolyForm
Noncommercial with Required Notice; no monetized-use clearance is established.

The guard cannot authenticate a user or prevent deliberate direct upstream calls.
Director verifies consent in chat; Reviewer verifies full playback/listening,
semantic carry, readability and timing. Finish those production checks only after
Gate 1, then request Gate 2 before any MP4. The overhaul does not grant either.
