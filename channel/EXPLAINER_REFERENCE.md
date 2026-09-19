# Build an explainer like the approved reference

Use this guide for a new visual narrated short, including with GPT-5.6-luna.
It reduces decisions; it cannot guarantee identical quality across models.
Follow the same visual review gates regardless of model capability.

The reference demonstrates causal motion and continuity, not a mandatory box
layout. New videos must maximize the portrait stage under the current `DESIGN.md`:
no enclosing bordered card by default, larger colored artwork, and essential
content within the safe rectangle. Copy the teaching behavior, not the enclosure.

## Start here

Read `AGENTS.md`, `DESIGN.md`, this guide, then the relevant HyperFrames skill.
`CHANNEL_RECIPE.md` owns the pipeline; this guide supplies the worked example.
Repository portrait defaults override generic landscape skill examples.
Do not load every skill or every existing video into context.

The approved reference is `videos/local-or-router-short/`:

| Read or inspect | What to learn |
| --- | --- |
| `local-or-router-short.mp4` | Approved causality/continuity example: 45.93s, 1080x1920, 30fps, narration; improve screen use under current DESIGN.md |
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
> quality reference. Cover all required information with no fixed duration or
> scene-count limit, using focused scenes and natural pacing. Use large local
> icons, sparse text, persistent objects, and motion that explains the process.
> Maximize the portrait stage: no enclosing bordered card, large colored devices,
> connected routes and visible outcomes. Keep essential content in the safe area.
> Use Supertonic per scene; captions, SFX and music off. First present the script
> and actual-icon sketches together for approval. After approval, build all
> scenes, validate and open the final preview. Wait for approval before rendering.

If topic or intended lesson is missing, ask for it. Otherwise choose routine
production details from this guide and proceed. Do not ask the user to design
every scene. Never invent approval records for a new video.

## 1. Choose the lesson before drawing

Write a single sentence: “After watching, the viewer can explain ___.”
For the reference: local destinations use local delivery; remote destinations
use the configured gateway in this simple setup. That reference excluded binary,
ARP and routing exceptions because they were outside its scope, not to satisfy
a time limit. For a new video, list every required point and map it to scenes;
include prerequisites and qualifications needed for accuracy. Extend runtime
as needed. Retain assumptions in `FACTS.md` so simplification stays accurate.

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

Seven beats and the reference duration are examples, not limits. Add focused
scenes until all required information is covered; do not force a series.
This is a teaching pattern, not mandatory networking content. For another topic,
replace devices/packets with the actual objects and observable state changes.
Each narration line gets one scene. Use `## Line N` and indent only spoken text
as in `channel/templates/SCRIPT.md`. Avoid reading lengthy values unless the
pronunciation itself teaches the lesson. Do not shorten a long script by racing TTS.

## 2. Lock the visual contract

Write a project `frame.md` before authoring scenes. Fix persistent object names,
asset paths, sizes, positions, label bands and start/end states. The reference uses:

Before adopting those coordinates, allocate the entire safe rectangle to the
teaching diagram. Use 280–360px visible primary artwork where space permits and
an optional short title. Backgrounds may reach the canvas edges. Do not wrap
the scene in a bordered panel or add white tiles around black device glyphs.
A real network/trust boundary may be drawn when it teaches the grouping, without
shrinking the diagram. The coordinates below explain the old example; they do
not require its outer box or prevent a larger layout.

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

Translate each action literally into observable behavior. For an exchange, a
packet leaves the source, follows a connector that touches both endpoints,
arrives at the destination and changes its state. Return data follows that same
route in reverse while devices remain fixed. For verification, show the evidence
being compared before acceptance. For execution, show command arrival, execution
and output at the client. Do not replace these beats with a label sliding in.

### Worked action contract: a remote command

Use this level of specificity in the existing storyboard table. These are
illustrative local times for a 9s scene, not timings to copy over measured speech.
One main action can require several steps to make its cause and result visible.

| Local time | Named objects and state change | Visible proof |
| --- | --- | --- |
| 0–1s | `client`, `server`, connected `route` already visible; `command` at client | Viewer identifies both endpoints before movement |
| 1–3s | `command` travels from client along route to server | Token reaches the server; no acceptance/result shown early |
| 3–4.5s | Server receives command; its terminal changes to actual example output | Execution changes the receiving device, not a detached label |
| 4.5–7s | `response` leaves server and retraces route to client | Same endpoints and route; only travel direction reverses |
| 7–9s | Response arrives; client terminal displays the returned output | Result belongs to the client; final state carries into next scene |

For other verbs, require equally literal evidence:

- **Exchange:** outbound arrival, then a reply from the receiving endpoint.
- **Verify:** presented evidence and trusted reference are both visible; compare
  their relevant parts before showing acceptance or rejection.
- **Protect:** show readable content becoming an opaque token on the network,
  then readable content at the receiving endpoint; a lock reveal alone is insufficient.
- **Keep:** the retained object stays anchored while a different object travels.

In `frame.md`, assign each persistent object an ID, exact asset, visible bounds
and route attachment point. Scenes reuse those values. A return path reverses
the token's travel, never the device layout. If a deliberate reframe is needed,
show how the old positions become the new ones instead of silently swapping them.

After gate 1 and measured TTS, choose the scene with the hardest exchange,
comparison or return. Build and inspect its opening, every causal step and result
before replicating the pattern. Check visible artwork size, safe edges and route
attachments at phone size. Repair failures now; then finish all scenes without
another user gate. This self-check does not replace the complete final review.

Keep each storyboard promise until it is implemented. Do not rewrite an approved
action as a simpler decorative reveal to make the review pass. A recap must
preserve the main story's dependency order, even when its wording is shorter.

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
better causal beat or a justified reading pause; never cut required information
to remove a hold. Decorative pulses do not fix it.

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

Run the runtime check inside `videos/TOPIC`:

```powershell
npx hyperframes check --samples 21 --json
```

Derive capture times from the measured storyboard, not an evenly spaced global
sample or a copied command. For each scene, select an opening time, each action's
visible moment and a resolved time before its end. Add the scene's canonical
start to each local time, then pass the resulting comma-separated list to
`npx hyperframes snapshot --at <global-times>`. Inspect both sides of each cut.
Batch captures
and share one contact sheet for review; do not add approval gates. Record actual
inspected times, evidence paths and pass/fix notes in each existing storyboard
action row; leave unseen rows marked `not inspected`. Fix failed rows and inspect
them again. Source code or a screenshot of a different state is not evidence that
a promised action occurred. Inspect the returned sample times and
files: `--samples 21` does not mean every check saved 21 images. Motion results
with zero assertions/samples are not proof of good movement. Use the existing
motion sidecar format when adding assertions, then inspect playback regardless.

Reject the preview until these concrete tests pass:

| Test | Pass evidence | Typical repair |
| --- | --- | --- |
| First second | Main objects visible | Remove whole-scene fade-in |
| Screen use | Large visible artwork uses the safe width/height; no generic enclosing card | Remove enclosure/padding and enlarge/reflow the diagram |
| Icon treatment | Colored primary devices; legible semantic support glyphs | Replace black glyph tiles/emoji with exact local assets |
| Sketch fidelity | Same required objects/connections | Restore missing device or route |
| Causality | Every planned action visible; connected travel reaches endpoint before result | Implement missing causal beats rather than a decorative reveal |
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

### Failure patterns to reject

The current `ssh-explained-visually` implementation illustrates failures to
avoid, not an alternate quality reference:

- Frame 10 promises typing, a locked packet and arrival, but only moves an
  already-visible command label horizontally. Implement the whole causal chain.
- Frame 11 swaps client/server vertical positions. Reverse packet direction,
  not endpoint identity or coordinates.
- Frame 12 promises route replay, observer ciphertext and a final check, but
  only animates recap text. Every promised action needs visible implementation.
- White padded glyph tiles reduce visible device size; disconnected connectors
  and labels beyond the safe edge weaken readability. Inspect actual pixels.
- A 10.38s scene with motion ending at 5.7s leaves an unexplained hold over 3s.
  Retime meaningful beats to measured narration; do not shorten required content.

These examples describe the inspected version, not permanent defects. Apply
the acceptance table to current output and remove failures before final preview.
Smaller models follow the same checks; model capability does not waive a beat.

After every action row and adjacent-cut review passes, run
`npx hyperframes preview --background`.
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
