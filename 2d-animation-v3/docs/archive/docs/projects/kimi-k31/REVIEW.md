# Take Advantage of the New Kimi 3.1 Model — production record

Project `1c65e530-9583-4a92-ab5c-2c67d0b89063` in the v3 studio. 1080×1920,
30 fps, interpreter 3, energy `energetic`, 2158 frames = 71.93 s.

## Where it stands

| Step | State |
| --- | --- |
| Research | `FACTS.md` in this folder, primary sources read in full 2026-10-24 |
| Script | revision 2 `a1117170`, accepted; 13 lines, 166 words |
| Concepts | gpt-6.1-sol run `0381fb7e`; user chose concept 2, selection `2664b8e7` |
| Storyboard | director board `8e57e32d`, user-approved 2026-10-24 |
| Motion | `399ef1a8`, accepted; 2158 frames, 11 shots |
| Narration | `6600fcae`; channel voice, PCM16 mono 48 kHz, 2158 frames exactly |
| **Gate 1** | **approved** — `e6abf1d5`, 2026-10-24, user's exact words recorded |
| **Gate 2** | **approved** — `da1d5336`, same message, same binding |
| Render | authorized by the user; job `95bbe282` completed and verified |

**Export:** `videos/1c65e530-9583-4a92-ab5c-2c67d0b89063/production/95bbe282-0ce2-448b-8416-7229740e95ef/export.mp4`
(also `output/kimi-k31-pro-take-advantage.mp4`). h264 1080×1920 at 30 fps,
2158 frames, 71.933 s, 4,442,292 bytes, sha256 `4f4c5d09…`. Verified inside the
guarded job and independently: full decode, 2158/2158 preview frames compared at
minimum SSIM 0.997552 (threshold 0.98), 11 fresh boundary seeks byte-matched,
audio correlation 0.999972 at zero lag, engine hash `321dd455…`. Not published;
nothing committed.

## Provenance that is not model output

- **Board.** gpt-6.1-sol did return a valid 11-shot board (`abf5c051`) after its
  job deadline; it covers the same narration and transitions. It was superseded
  because its final shot requires an actor that disappears with no visible
  destination, and the beat presets can express an exit only through
  `flow-handoff`/`split-disperse` into a visible actor. The accepted board is
  director-authored: one actor table per shot, so every motion endpoint is
  derived from the same geometry the drawing uses.
- **Motion.** Director-authored too, for the same reason: `hydrateMotion` needs
  a full 11-shot proposal, and the gateway caps responses at 8192 tokens with a
  180 s job deadline — the 11-shot storyboard alone exceeded that. Endpoints are
  deterministic, not improvised: each mover gets its own `snap-overshoot` whose
  `to` is the end-drawing box; entrants use `cascade`; consumed packets use
  `flow-handoff`; four shots add a `punch-zoom` for camera emphasis.
- **Narration** is the channel Supertonic 3 clone (`custom:channel-voice.json`,
  style sha256 `c537c5f8…`), paced per shot with `atempo` in 1.05–1.44 and placed
  at exact sample offsets. Timing is measured PCM length, never estimated word
  spans. Peak −2.3 dBFS, no clipping. Human listening is Gate 2's job.

## Review findings (deterministic diagnostics, not approval)

`motion-quality@1` reports 4:
- Shot 7 `page-b` and Shot 11 `page`: contrast 1.00 — the source page overlaps
  the sheet's white border rect, so the heuristic measures paper-on-paper. Frame
  review shows the page reads as a page; geometry was left as approved.
- Shots 9 and 10: `cascade@1` leads 3–4 consecutive shots. Entrances are the
  correct lead for those beats, and the shots carry punch-zooms and a
  split-screen to vary the rhythm; recorded rather than papered over.

Weaker moments the reviewer should look at directly: the lower third of shots
5–6 is empty, and the lime review marker in shot 11 is a chip symbol, which
reads as a node rather than a tick.

## Rules this film holds itself to

- No measured accuracy, time saved or revenue is claimed; the reconciliation is
  presented as a workflow to replicate, not a recorded result.
- 64.4 is scoped to OfficeQA Pro v2; 8.3%/23.4% to Kimi's own stress test, and
  the frame carrying them says so.
- The two limits (thinking-mode only, Pro plan for 1M context) and the Nov 4
  weight date stay in the narration; nothing implies the weights are open now.
