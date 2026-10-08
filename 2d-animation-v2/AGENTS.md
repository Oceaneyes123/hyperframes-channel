# OneTake narrated explainers

This workspace creates beginner technology explainers for YouTube Shorts, in
the same subject area as `../2d-animation`: networking, browsers, protocols,
privacy, security and everyday computing. Work only inside this workspace.
The sibling workspace is a read-only source of shared voice tooling and assets.
Never commit, push, publish or migrate existing videos unless explicitly asked.

## Owners and routing

Read this file and the installed `onetake/SKILL.md`. OneTake is the sole motion
authority: concept, choreography, object performance, rhythm, carry, camera,
curves, deterministic composition, shutter blur and motion review. Consult its
bundled references or source only when that skill calls for them or an API needs
clarification. Do not load the sibling's DESIGN.md, MOTION.md, motion library,
research documents or HyperFrames workflows as additional motion authorities.
README.md contains executable setup and production commands, not creative rules.

The user explicitly selected OneTake. Use its standalone HTML pipeline and
`lib/motion.js`, not HyperFrames, GSAP frame assembly or Remotion. The local
adaptations below take precedence over the skill's product-promo defaults.

## Channel adaptations

- Author natively at **1080 x 1920, 9:16, 30 fps**. Preview, probe and render at
  those dimensions. Do not crop or stretch a landscape composition into portrait.
  Final export is 1080 x 1920 at 30 fps unless another quality is requested.
- Aim for a complete, naturally paced Short within **180 seconds**. Do not
  silently omit, rush, truncate or split required content. If the complete scope
  exceeds 180 seconds, flag Shorts incompatibility at planning and ask the user
  to choose a narrower scope or a longer video. Recheck measured duration after TTS.
  Platform reference: https://support.google.com/youtube/answer/15424877
- OneTake's 10–30-second promo and approximately 60-second demo ranges are not
  explainer cutoffs. Build a mechanism and payoff rather than a product pitch.
- Keep essential objects, labels and causal actions within `x=72..936` and
  `y=180..1600`; these are channel layout margins, not official YouTube guarantees.
  Inspect camera extrema and phone-size playback. Prefer visible primary artwork
  around 320–420 px, with 240 px as a practical minimum; necessary labels normally
  start at 36 px and exact values at 40 px. Readability overrides small-element
  promo styling and the skill's white-space percentage. Choose the look through
  OneTake's concept round; do not inherit a fixed palette or the template's story.
- Narration explains, motion demonstrates, text identifies. Default to sparse
  1–3-word labels and exact technical values, no chapter banners or decorative
  cards. Use locally available fonts with real fallbacks and licensed local art.
- English narration uses the existing channel voice and pronunciation tooling.
  Captions, sound effects and background music are **off** unless requested.
  OneTake's synthetic score and Kokoro narration do not replace the channel voice.
  Preserve visual rests without inserting unnatural silences into speech.

## Narrative and accuracy

Research authoritative sources for the actual topic; record links, conditions,
limits and metaphor boundaries. Map every required point to spoken lines and
visible evidence. Show a concrete hook, establish necessary context, unfold
cause and effect, explain the important qualification and visibly answer the
hook. These are narrative functions, not a required six-scene formula.

Use short, conversational sentences and explain jargon when it becomes useful.
Every sentence advances the mechanism, opens a useful question or resolves one.
Avoid greetings, promotional endings, invented danger and unsupported absolutes.
For each beat ask: what did the viewer learn, what visibly established it, and
why does the next beat follow? If the only visual is the spoken sentence rendered
as text, redesign the action. A quiet comprehension hold is valid.

Make transformations factually meaningful: a request may become a response only
after the responding action; an encrypted payload does not become a key. Carry
the subject, container, state or camera destination into the next beat. Use
OneTake moves rather than reimplementing springs or easing. Vary action and hold
lengths; do not force its fast promo word cadence onto explanatory narration.

## Production and approvals

1. Record inputs, complete coverage and estimated runtime. Follow OneTake's
   concept round: show three genuinely different visual ideas and let the user
   select one before storyboarding. A supplied concept can count as that selection.
   Inspect a supplied reference; otherwise choose a relevant shipped OneTake case
   and state the transferable traits. No previous channel video is required.
2. Create the facts, script, timed storyboard and one board of actual production
   assets. Include decisive before/action/result poses and carry across every
   section boundary. Review every beat at phone size. **Gate 1:** present the
   script and board together; wait for approval before final TTS or animation.
3. After Gate 1, dry-run the sibling's TTS normalizer, inspect pronunciation and
   generate one WAV per narration passage. Preserve these source WAVs and their
   metadata. Use actual durations and aligned/listened phrase cues to retime the
   same storyboard; store WAV hashes and cue provenance. Do not infer word timing
   from word count. The sibling generator's frame paths and audio_timeline.html
   are legacy metadata; they do not require HyperFrames scenes in this workspace.
4. Build one complete OneTake composition against the approved plan. Derive one
   render audio mix from the original WAVs at their measured starts, including
   planned pauses; keep the per-passage sources. Play the same mix against the
   same timeline in the browser. Muted seeks must be deterministic; playback must
   synchronize audio, pause, restart and seeking without overlapping narration.
   Keep `__seek(t)` free of audio playback side effects.
5. Inspect the complete browser preview with and without narration. Capture native
   portrait stills, boundary poses, mid-motion states and camera extrema; test
   repeated, backward and random-order seeks. Run OneTake's portrait probe and
   inspect continuity, curves, framing, page errors and failed seeks. **Gate 2:**
   present the working complete-preview URL, measured duration and review evidence;
   wait for explicit approval before any MP4 render, including a draft.
6. Render only the approved preview, using OneTake's shutter renderer and explicit
   portrait dimensions. Verify the exported MP4's streams, dimensions, frame rate,
   duration, complete decode, actual frames and narration through the ending.
   Deliver the absolute local path and record unresolved limitations honestly.

Passing checks is neither listening approval nor render approval. "Continue",
"next step" and "do remaining" advance to the next gate. A changed script,
composition or audio needs the relevant gate renewed. Complete all beats before
Gate 2; do not ask permission after each beat.

## Project files

Create each video under `videos/<descriptive-slug>/`. Use only needed artifacts:

| File | Owns |
| --- | --- |
| BRIEF.md | Topic, takeaway, required coverage, concept/look, runtime and status |
| FACTS.md | Sourced claims, conditions and metaphor boundaries |
| SCRIPT.md | Spoken lines and separate display copy |
| STORYBOARD.md | Estimated then measured beat windows, cues, carry and review evidence |
| ICON_PLAN.json | Exact local assets, source and license |
| sketches/board.html | Complete actual-asset board for Gate 1 |
| audio_meta.json | Measured narration passages, starts and voice provenance |
| motion_beats.json | Important phrase times, WAV hashes and measurement provenance |
| comp.html | One seekable film and synchronized preview player |
| motion.js, look.js, assets/ | Local runtime, selected look and licensed assets |
| audio/ | Derived full-length mix; original WAVs stay at their generated paths |
| review/ | Portrait captures, probe reports and approvals tied to reviewed files |
| output/ | Approved export and OneTake render metadata |

SCRIPT.md keeps contiguous `## Line N` headings starting at 1; indent spoken
paragraphs by four spaces for the existing TTS parser. Keep labels and production
notes unindented. STORYBOARD.md uses a single beat table with columns for time,
line/cue, learning, before state, action, result/hold and carry to the next beat.

The composition defines `window.__ready`, `window.__seek(t)` and
`window.__meta = {dur, fps: 30, w: 1080, h: 1920, cuts: [], inFrame: {...}}`.
Await local fonts and decoded assets. Track persistent subject IDs with screen
boxes through `__track(t)` and supply camera-aware `__motion(t0, t1)` for shutter
sampling. Declare actual intentional cuts only; do not exempt every boundary to
inflate carry scores. Provide `?play`, `?t=<seconds>` and working playback controls.

## Review boundaries

OneTake's current stills helper resizes every image to 640 x 360, even when a
portrait viewport is supplied. Capture with Playwright at 1080 x 1920 instead,
and preserve 9:16 in contact sheets and phone-size reviews.

Its MP4 oracle probes `--comp` at 1920 x 1080 and uses a promo audio-silence
threshold. Use the explicit portrait probe for composition evidence. MP4 rhythm
checks may be run separately after approved rendering, but report original
failures and explain narration-specific exceptions; never invent a passing verdict.
The probe's exit code alone does not certify continuity, framing or successful seeks.

The installed OneTake package is PolyForm Noncommercial 1.0.0. Preserve its
LICENSE and Required Notice when copying its runtime. Do not describe the setup
as cleared for commercial or monetized use; record any separately granted license.

Use CodeGraph before locating code only when a `.codegraph/` directory exists.
Choose the smallest complete solution, preserve unrelated edits and verify the
actual changed surface. Setup or documentation checks do not validate a future film.
