# 2d-animation-v2

Beginner technology explainers using OneTake for motion and rendering, native
1080 x 1920 YouTube Shorts, and the existing channel narration voice.

Start a chat in this directory with [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md).
[AGENTS.md](AGENTS.md) owns the channel adaptations and two approval gates.
The installed [OneTake skill](C:/Users/Dave/.codex/skills/onetake/SKILL.md) owns
motion. Its references are available on demand; the sibling's motion guides are
not prerequisites. No previous video is required.

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

## Commands for a video

Replace `my-topic` with the project's slug. Run TTS only after Gate 1:

```powershell
$projectRoot = (Resolve-Path 'videos/my-topic').Path
.\.venv\Scripts\python.exe ../2d-animation/scripts/supertonic_tts.py --project $projectRoot --dry-run
.\.venv\Scripts\python.exe ../2d-animation/scripts/supertonic_tts.py --project $projectRoot
```

Use `audio_meta.json` for timing. Keep original per-line WAVs; create
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
# Reuse the variables above. Create the output directory if it does not exist.
New-Item -ItemType Directory -Force "$projectRoot/output" | Out-Null
.\.venv\Scripts\python.exe "$oneTakeRoot/scripts/render.py" "$projectRoot/comp.html" --width 1080 --height 1920 --fps 30 --scale 1 --sfx "$projectRoot/audio/narration.wav" --out "$projectRoot/output/video.mp4"
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,r_frame_rate:format=duration -of json "$projectRoot/output/video.mp4"
ffmpeg -v error -i "$projectRoot/output/video.mp4" -f null -
```

Do not use OneTake's `--final` default: it doubles resolution and switches to
60 fps. Both browser and export use the same approved timeline and audio.

YouTube accepts vertical Shorts up to three minutes; recheck its
[current eligibility rules](https://support.google.com/youtube/answer/15424877)
when platform compatibility matters. Longer complete scripts need a scope or
format decision, not automatic truncation.

OneTake's bundled code carries
[PolyForm Noncommercial 1.0.0](https://github.com/feitangyuan/onetake/blob/main/LICENSE).
This setup does not establish permission for commercial or monetized use.
