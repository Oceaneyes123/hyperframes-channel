# 2d-animation-v2

Beginner Finance, Technology and AI explainers using OneTake for motion and
rendering, native 1080 x 1920 YouTube Shorts, and the existing channel narration
voice.

Start a chat here with [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md). Main agent is
Director; five native specialists execute their original installed skills.
[AGENTS.md](AGENTS.md) owns production rules and approvals;
[Director runbook](workflow/DIRECTOR.md) and [role cards](workflow/ROLES.md) own
handoffs. [SCRIPT_GUIDE.md](SCRIPT_GUIDE.md) supplies channel editorial checks.
OneTake alone implements animation and rendering. No previous video is required.

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
not be overwritten. OneTake uses `--path . --name onetake`. Keep originals unchanged.

Copy [production.json](templates/production.json) into a new project. Each
specialist fills [handoff.json](templates/handoff.json) under review/ using its
role slug. `inputs` and `outputs` map project-relative paths to SHA256; evidence
paths are project-relative. Set `executed` only for completed applicable work.
Director accepts each handoff; consumers must use those exact inputs.

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
