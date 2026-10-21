# 2d-animation-v2

Beginner Finance, Technology and AI explainers using OneTake for motion and
rendering, native 1080 x 1920 YouTube Shorts, and the existing channel narration
voice.

Start a chat here with [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md). Main agent is
Director; five native specialists execute their original installed skills.
[AGENTS.md](AGENTS.md) owns production rules and approvals;
[Director runbook](workflow/DIRECTOR.md) and [role cards](workflow/ROLES.md) own
handoffs. [SCRIPT_GUIDE.md](SCRIPT_GUIDE.md) supplies channel editorial checks.
The same Scriptwriter develops with storytelling-hooks, then refines the
completed narration with humanizer and preserves before/audit/final evidence.
OneTake alone implements animation and rendering. No previous video is required.

## Planning, publishing and feedback

The sibling [video workflow](../video-workflow/README.md) connects V2 planning
to YouTube packaging, authorized release and analytics. During Research, Director
records the audience, promised payoff and one measurable learning hypothesis in
BRIEF.md. Read relevant prior analytics lessons when available; record their
evidence and whether they apply to this lesson.

After the guarded render and export verification, hand off the existing MP4 and
source documents. The publishing adapter expects current Gate 1/Gate 2 receipts
and `output/render-verification.json` matching the export. Keep packaging,
release receipts and analytics in `../video-workflow/videos/<slug>/`, outside the
production folder: adding them inside it can invalidate Gate 2 hashes.

Reuse existing owners: Scriptwriter drafts three truthful title angles and the
description; Art Director proposes two thumbnail concepts and makes the selected
image; Reviewer checks the finished export, packaging promise and phone-size
readability; Director selects the package and exact release settings.

The publishing CLI prepares a local review and records separate, explicit user
authorization before upload or release. Gate 1, Gate 2 and implementation/setup
requests never authorize a release. Uploads start private; processing, thumbnail
application and actual Studio restriction checks precede scheduling/publication.
Live OAuth, upload, Shorts thumbnail support, scheduling and analytics still need
authorized tests with the actual account; local validation does not prove them.

Analytics reviews cover 1-, 7- and 28-day milestones, with delayed/missing data
identified. Director can record an evidence-linked `analytics/LESSON.md` for the
next brief. Treat it as a proposed experiment, not a causal finding or permission
to change production rules or published assets. See the sibling README for
commands, account setup, release checks and current limitations.

## Skills and validation

```powershell
python scripts/studio.py skills
python -m unittest discover -s tests -v
```

[workflow/skills.json](workflow/skills.json) records verified upstream repositories,
commit refs, actual names, collision-safe installation folders and source hashes.
Discovery checks original installed files; missing or modified skills stop the
stage. It never installs or updates silently. The new skills become available
for automatic discovery next turn; this trial passes their actual paths directly.

To install on another machine, use the supported Codex skill-installer helper:
`install-skill-from-github.py --repo REPOSITORY --ref REF --path PATH`, taking
values from the manifest. For the Anthropic skill add
`--name anthropic-frontend-design`; an unrelated existing `frontend-design` must
not be overwritten. OneTake uses `--path . --name onetake`; humanizer uses
`--path . --name humanizer`. Keep originals unchanged. An existing installation
that matches the pinned source can be reused without overwriting it.

Copy [production.json](templates/production.json) into a new project. Each
specialist fills [handoff.json](templates/handoff.json) under review/ using its
role slug. `inputs` and `outputs` map project-relative paths to SHA256; evidence
paths are project-relative. Set `executed` only for completed applicable work.
Director accepts each handoff; consumers must use those exact inputs.

For new projects also copy [REFERENCES.json](templates/REFERENCES.json). Director
uses [the reference handoff](workflow/REFERENCE_STUDY.md) to study actual clips
from the initial channels and any supplied videos, retaining moving-frame
evidence and timestamped techniques/limits. New templates enable this contract;
old approved projects are not retrofitted. Check the study during Research with
`python scripts/studio.py check --project videos/my-topic --stage references`.
Art/Motion/Animator/Reviewer consume its exact hash. Plan checks and Gate 1 bind
the study/evidence; review checks require timestamped storytelling assessments.
This validates records, not whether the animation is good.

[HTTP-cache storytelling comparison](workflow/HTTP_CACHE_STORYTELLING.md) gives
concrete cue-relative storyboard/OneTake decisions for the same ten passages.
It is a planning exercise outside the approved example, not a new film.

The tracked [HTTP-cache trial](examples/http-cache/BRIEF.md) and
[validation report](workflow/VALIDATION.md) distinguish actual specialist outputs,
regression evidence and production stages still awaiting approval. Historical
[SCRIPT_TESTS.md](SCRIPT_TESTS.md) remains a text-only baseline, not motion proof.
The [approved-plan production trial](workflow/PRODUCTION_VALIDATION.md) records
the subsequent measured narration, full OneTake preview and independent review.

## Local runtime

Run from `2d-animation-v2`. The local environment reuses this machine's existing
Python packages without changing the sibling workspace or global packages:

```powershell
python -m venv --system-site-packages .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

FFmpeg, FFprobe and Node must be on PATH. The default narration additionally
reuses `../2d-animation/scripts/supertonic_tts.py`, its installed `supertonic`
package, and `../2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json`.
Do not replace a missing channel clone with a preset voice.

Measured phrase alignment uses OneTake's native `vo_tools.py words` and the
already used `faster-whisper` dependency, now included in requirements.txt.
It accepts an alignment folder containing source-identical `t1.wav`, `t2.wav`,
etc. Use `--lang en --model base`, or supply a cached compatible model path.
A model name downloads weights if they are not cached. Keep raw words.json and
source hashes; ASR recognition is evidence for timing, not pronunciation approval.

## Commands for a video

Replace `my-topic` with the project's slug. Normalize without synthesis at any
time; final synthesis is guarded by Gate 1:

```powershell
$projectRoot = (Resolve-Path 'videos/my-topic').Path
.\.venv\Scripts\python.exe scripts/studio.py tts --project $projectRoot --dry-run
.\.venv\Scripts\python.exe scripts/studio.py check --project $projectRoot --stage plan
# ONLY after receiving real user approval; quote and source must identify it.
.\.venv\Scripts\python.exe scripts/studio.py approve --project $projectRoot --gate 1 --quote 'EXACT USER APPROVAL' --source 'USER MESSAGE REFERENCE'
.\.venv\Scripts\python.exe scripts/studio.py tts --project $projectRoot
```

Use `audio_meta.json` for measured source timing. Freeze approved STORYBOARD.md;
record actual placement/phrase cues using [motion_beats.json](templates/motion_beats.json).
Do not copy metadata starts blindly when the plan includes lead-in/pauses.
Keep original per-line WAVs; create
`audio/narration.wav` as a derived timeline mix with the same starts and pauses
as browser playback. Check that the mix covers the complete composition before
rendering: OneTake's `--sfx` accepts this full audio mix but uses `-shortest`,
which would truncate the video if given a shorter WAV.

Resolve the installed skill once, then use its existing tools:

```powershell
$oneTakeRoot = Join-Path $env:USERPROFILE '.codex/skills/onetake'
if ($env:CODEX_HOME) { $oneTakeRoot = Join-Path $env:CODEX_HOME 'skills/onetake' }

# After Gate 1: copy the library with its license, not the landscape promo story.
Copy-Item "$oneTakeRoot/lib/motion.js" "$projectRoot/motion.js"
Copy-Item "$oneTakeRoot/LICENSE" "$projectRoot/ONETAKE_LICENSE"

# Check the complete composition without rendering an MP4.
.\.venv\Scripts\python.exe "$oneTakeRoot/scripts/probe.py" "$projectRoot/comp.html" --width 1080 --height 1920 --fps 30 --out "$projectRoot/review/probe"

# Serve from this workspace; open /videos/my-topic/comp.html?play for Gate 2.
.\.venv\Scripts\python.exe -m http.server 8080 --bind 127.0.0.1
```

Inspect the probe report: page errors/failed seeks must be absent, declared
subjects must remain in frame, and a carry score below 0.5 fails continuity
(0.5–0.7 needs review). Check the authored boundaries too: the probe can miss
semantic mistakes. Capture native portrait frames with Playwright; OneTake's
current `stills.py` forces landscape tiles. See AGENTS.md for oracle limitations.

Only after explicit Gate 2 approval, in another terminal:

```powershell
# The independent Reviewer must cover current files and close blocking findings.
.\.venv\Scripts\python.exe scripts/studio.py check --project $projectRoot --stage review
.\.venv\Scripts\python.exe scripts/studio.py approve --project $projectRoot --gate 2 --quote 'EXACT USER APPROVAL' --source 'USER MESSAGE REFERENCE'
.\.venv\Scripts\python.exe scripts/studio.py render --project $projectRoot
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,r_frame_rate:format=duration -of json "$projectRoot/output/video.mp4"
ffmpeg -v error -i "$projectRoot/output/video.mp4" -f null -
```

Do not use OneTake's `--final` default: it doubles resolution and switches to
60 fps. Both browser and export use the same approved timeline and audio.
Use the guarded entrypoints, not direct upstream synthesis/render calls.
Guards bind approvals to file hashes, check current handoffs, independent audit,
portrait APIs, deterministic sample seeks, source WAVs/clone/cues and full mix
length and lossless PCM placement. For the default narration-only mix, preserve
source channels/sample format/rate and place each passage at its measured start
(rounded to the nearest sample), with silence between passages. Requested music,
SFX or gain processing needs an explicit reviewed contract extension; the current
guard rejects an altered mix. Full playback, listening, semantic continuity and visual quality still
need actual Reviewer evidence; a successful guard does not prove them.
Before renewing approval, preserve the prior receipt in a separate history
location, obtain renewed user approval, then record the replacement. Existing
exports are never silently overwritten. Receipts record consent provenance;
Director must verify that provenance in chat.

YouTube accepts vertical Shorts up to three minutes; recheck its
[current eligibility rules](https://support.google.com/youtube/answer/15424877)
when platform compatibility matters. Longer complete scripts need a scope or
format decision, not automatic truncation.

OneTake's bundled code carries
[PolyForm Noncommercial 1.0.0](https://github.com/feitangyuan/onetake/blob/main/LICENSE).
This setup does not establish permission for commercial or monetized use.
