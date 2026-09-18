# Build an explainer like the approved reference

Use this guide for a new visual narrated short, including with GPT-5.6-luna.
It reduces decisions; it cannot guarantee identical quality across models.
Follow the same visual review gates regardless of model capability.

## Start here

Read `AGENTS.md`, `DESIGN.md`, this guide, then the relevant HyperFrames skill.
`CHANNEL_RECIPE.md` owns the pipeline; this guide supplies the worked example.
Repository portrait defaults override generic landscape skill examples.
Do not load every skill or every existing video into context.

The approved reference is `videos/local-or-router-short/`:

| Read or inspect | What to learn |
| --- | --- |
| `local-or-router-short.mp4` | Final approved visual target: 45.93s, 1080x1920, 30fps, narration |
| `FACTS.md`, `SCRIPT.md` | One takeaway, concise spoken lines, secondary concepts deferred |
| `sketches/board.html` | All seven scenes with actual production icons before frame work |
| `frame.md` | Shared coordinates, typography, colors, object continuity |
| `STORYBOARD.md`, `audio_meta.json` | Planned actions retimed to measured narration |
| `compositions/frames/line-2.html` | Compare meaningful parts of two values |
| `compositions/frames/line-3.html` | Packet travel followed by visible receipt |
| `compositions/frames/line-5.html` | Keep context while routing through an intermediary |
| `compositions/frames/line-7.html` | Replay the two outcomes as the closing takeaway |
| `index.html` | Generated scene hosts and unique per-scene narration tracks |

Inspect the final video and one or two relevant source frames first. Read other
frames only when you need their action. Some reference frames use SVG coordinates
for the whole diagram; these are acceptable for this fixed portrait diagram,
not a requirement to abandon grid/flex for other layouts.

## Reusable starting prompt

> Create a visual narrated short about [TOPIC] for [AUDIENCE], using
> channel/EXPLAINER_REFERENCE.md and the approved local-or-router-short as the
> quality reference. Teach one takeaway in roughly 45–60 seconds. Use large local
> icons, sparse text, persistent objects, and motion that explains the process.
> Use Supertonic per scene; captions, SFX and music off. First present the script
> and actual-icon sketches together for approval. After approval, build all
> scenes, validate and open the final preview. Wait for approval before rendering.

If topic or intended lesson is missing, ask for it. Otherwise choose routine
production details from this guide and proceed. Do not ask the user to design
every scene. Never invent approval records for a new video.

## 1. Choose the lesson before drawing

Write a single sentence: “After watching, the viewer can explain ___.”
For the reference: local destinations use local delivery; remote destinations
use the configured gateway in this simple setup. Defer binary, ARP and routing
exceptions. Retain assumptions in `FACTS.md` so simplification stays accurate.

Use the following seven-beat structure when it fits; adapt it to the subject:

| Beat | Reference | Visual job |
| --- | --- | --- |
| Question | Need a router? | Show the real objects immediately |
| Decision input | Compare network portions | Highlight only the relevant difference |
| First outcome | Local delivery | Move the packet and show receipt |
| Change one condition | Different destination network | Keep devices; change the deciding value |
| Changed route | Default gateway | Show the packet reaching the intermediary |
| Consequence | Delivered | Continue the route and show success |
| Recall | Local / Router | Replay the contrast without adding a new concept |

This is a teaching pattern, not mandatory networking content. For another topic,
replace devices/packets with the actual objects and observable state changes.
Each narration line gets one scene. Use `## Line N` and indent only spoken text
as in `channel/templates/SCRIPT.md`. Avoid reading lengthy values unless the
pronunciation itself teaches the lesson. Do not shorten a long script by racing TTS.

## 2. Lock the visual contract

Write a project `frame.md` before authoring scenes. Fix persistent object names,
asset paths, sizes, positions, label bands and start/end states. The reference uses:

| Element | Reference geometry in 1080x1920 pixels |
| --- | --- |
| Safe content | x72..936, y180..1600 |
| Title | x72, y180, 76px Arial bold |
| Source device | x354, y360, 300x300 |
| Process / switch | x354, y720, 300x240 |
| Intermediary / router | x384, y950, 240x240 |
| Destination | x354, y1255, 300x300 |
| Technical values | centered x504, baselines y705/y1220, 44px monospace |
| Moving packet | radius22; blue with a light outline |

Use these coordinates for a similar vertical process; redesign intentionally
when the topic needs a comparison, cycle or branching layout. Keep 2–5 important
objects, labels 1–4 words, headline at most 6 words, about 16 visible words.
Count the moving token as an object. Do not shrink the diagram to accommodate prose.

Resolve assets into `public/` and record actual paths and attribution in
`ICON_PLAN.json`. Reuse the reference's local assets only when their meaning fits;
copy attribution alongside them. Font Awesome uses inline paths for semantic color;
colored PNGs or precolored SVGs can use SVG image or CSS backgrounds. Do not use
file-based masks as a default: they have rendered blank in sketches. Never replace
a specific device with a vaguely related glyph just to finish quickly.

Make `sketches/board.html` with these exact assets and all scene states. Inspect
one real icon first, then the whole board. Show script and sketches together.
Gate 1: obtain approval before generating final narration and building frames.

## 3. Measure, then animate

Commands below run from the repository root; replace `TOPIC` with the new folder.
Create only project documents, config, asset folders and sketches initially.
Copy `channel/templates/channel.json`, use the reference `hyperframes.json`,
and run `py -3 scripts/sync_channel_assets.py --project videos/TOPIC`.
Stage the reference's `public/vendor/gsap.min.js` in the same relative path.
Do not clone approval records, WAVs, generated index, Studio caches or render output.

```powershell
py -3 scripts/validate_project.py --project videos/TOPIC --stage plan
py -3 scripts/supertonic_tts.py --project videos/TOPIC --dry-run
# After gate 1 and reviewing normalized speech:
py -3 scripts/supertonic_tts.py --project videos/TOPIC
```

Stop if any command fails. Read `audio_meta.json`: it owns starts, WAV durations,
paths and narration provenance. Update the existing storyboard with these values.
Use `## Frame N` headings, `src`, measured `duration`, `voiceover`, and `status`
so Studio and frame-packet tools can read it. Script headings remain `## Line N`.
Keep one local-time action table per scene. Translate to global time by adding
that scene's `start_s`; do not confuse the two clocks.

For each scene, answer in writing before coding:

1. What is visible at local time 0?
2. Which object changes, where does it move, and what spoken cue motivates it?
3. What visible consequence proves the action completed?
4. What state must the next scene inherit?

Start from `channel/templates/frame.html` or the closest reference scene. Replace
all content-specific IDs, copy, assets and timings. Use one paused GSAP timeline
registered under the exact composition ID, an explicit 1080x1920 root and measured
duration. Give timeline-visible nodes stable IDs. Parent index owns audio and GSAP;
frames must not load a second runtime or play narration themselves.

Initial hidden accents belong in CSS/attributes or an immediate `gsap.set`.
For future/repeated `fromTo` calls, set `immediateRender:false` when needed to
avoid later from-values changing an earlier seek. No random motion, timers,
infinite loops or whole-scene entrance hiding the situation. Test direct seeks,
not only playback from zero. Every unexplained static interval over 3s needs a
better causal beat or a shorter script; decorative pulses do not fix it.

For sequential work, finish scenes in order using `frame.md`. If a skill calls
for frame workers, give each worker only its scene packet, shared visual contract,
asset paths, measured duration and boundary states. Integration and visual review
remain the lead agent's responsibility. Delegation is not required for quality.

Once frame filenames are final:

```powershell
py -3 scripts/supertonic_tts.py --project videos/TOPIC --metadata-only
py -3 scripts/assemble_project.py --project videos/TOPIC
py -3 scripts/validate_project.py --project videos/TOPIC --stage preview
```

Persist real storyboard approval in `review/storyboard-approval.json` using the
reference schema, with the new project's evidence. The assembler requires local
GSAP and matching scene metadata. Stop Studio before mechanical reassembly;
repair source frames or metadata, then regenerate once. Never patch generated HTML
with broad replacements. Studio may add `data-hf-id`; it is not the audio `id`.

## 4. Quality gate: evidence, not confidence

Run inside `videos/TOPIC`:

```powershell
npx hyperframes check --samples 21 --json
npx hyperframes snapshot --at 1,8,17
npx hyperframes preview --background
```

Replace snapshot times with actual measured opening/action/result times; include
at least one visible midpoint per scene. Inspect the returned sample times and
files: `--samples 21` does not mean every check saved 21 images. Motion results
with zero assertions/samples are not proof of good movement. Use the existing
motion sidecar format when adding assertions, then inspect playback regardless.

Reject the preview until these concrete tests pass:

| Test | Pass evidence | Typical repair |
| --- | --- | --- |
| First second | Main objects visible | Remove whole-scene fade-in |
| Sketch fidelity | Same required objects/connections | Restore missing device or route |
| Causality | Travel/decision followed by result | Replace decorative reveal with the actual action |
| Continuity | Persistent objects do not jump or swap identity | Reuse shared coordinates and boundary state |
| Phone readability | Values legible, labels clear of connectors | Increase size, reduce copy, break line around label |
| Timing | Every WAV mounted once at its canonical start | Rebuild from metadata; do not estimate |
| Sound off | Viewer can follow the process | Improve visible decision and outcome |
| Sound on | Speech clear and aligned with action | Retime beats; regenerate only changed narration |
| Runtime | No failed assets, runtime errors or blocking layout findings | Fix the identified source selector |

Do not claim to have listened if tools only verified audio metadata. Make the
playable preview available for user listening. Investigate warnings, rather than
hiding them with blanket overlap exemptions. In the reference, an audio overlap
warning remained despite contiguous canonical starts/durations; that is a known
example to investigate, not permission to ignore future audio warnings.

Gate 2: open the actual timeline URL from CLI output, report measured duration
and checks, then ask for final-preview approval. Never render merely because
tests pass. Subsequent content changes require review of the changed preview.

## 5. Approved render and handoff

Persist the user's actual approval in `review/final-preview-approval.json`
(`status: approved`, authorization text, scope). From the repository root run
`py -3 scripts/validate_project.py --project videos/TOPIC --stage render`.
Only after it passes, run from the project directory:

```powershell
npx hyperframes render --quality high --output TOPIC.mp4
ffprobe -v error -show_format -show_streams TOPIC.mp4
ffmpeg -v error -i TOPIC.mp4 -f null NUL
```

`NUL` is Windows; use `/dev/null` on Unix. Inspect a frame extracted from the
actual MP4 as well. Confirm portrait dimensions, fps, video/audio codecs,
duration and a full successful decode. Frame rounding may slightly extend the
container duration: reference narration 45.905850s, export 45.933333s at 30fps.
Update brief status, retain approval/check evidence, and embed the absolute MP4
path in delivery. Do not commit, push or publish unless requested.

## Resume without guessing

Read BRIEF, SCRIPT, STORYBOARD, audio metadata and review records. Find the first
incomplete step above. Existing WAVs do not imply approval; existing frames do not
prove visual review; an MP4 does not prove successful decoding. Preserve unrelated
work and resume at the next uncompleted step. A smaller model should report a
concrete failed check or missing input instead of claiming a quality gate passed.
