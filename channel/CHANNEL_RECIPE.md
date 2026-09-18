# HyperFrames Channel Recipe v2

Worked example and model-independent execution guide:
[`EXPLAINER_REFERENCE.md`](EXPLAINER_REFERENCE.md). Start there for a short like
the approved `videos/local-or-router-short/`; this file remains the pipeline policy.

Use one source of truth: `SCRIPT.md` owns spoken lines and display copy,
`STORYBOARD.md` maps each line to one visual beat, and `ICON_PLAN.json` names
the exact local assets. `channel.json` must declare `{ "design":
"hyperframes-channel", "design_version": "2.0.0" }`.

1. Capture facts in `FACTS.md`; choose one beginner mental model.
2. Write `SCRIPT.md` with as many `## Line N` scenes as the required information
   needs; there is no fixed runtime or scene-count limit. Map required points to
   scenes and check complete coverage before approval. Keep
   display copy separate from indented narration and normalize the latter before
   TTS. Start with a concrete problem, not an intro or a spoken list of long
   addresses. Extend the video to explain required details clearly; do not speed
   up TTS, omit required information, or force a series to meet a duration target.
3. Write a timed `STORYBOARD.md` with `## Frame N` headings and `src`, `duration`,
   `status`, and `voiceover` fields for Studio. Include `narration_ref: SCRIPT.md#Line N`, objective, dominant visual,
   `icon_assets`, visible text, animation, beginning/ending state, transition,
   and complexity. Include required object counts and a local-time beat table
   mapping spoken cues to situation → action → consequence. Flag scenes over
   one idea, 2–5 objects, ~16 visible words, or unexplained static holds over 3s.
4. Resolve every icon locally, then build actual-icon sketches. Gate 1 requires
   inspectable sketches and explicit approval; text-only wireframes do not count.
5. After gate 1, run `npm run tts -- --project videos/<project> --dry-run`, review
   normalized speech, then synthesize one WAV per scene. The generator measures
   saved WAV frames and records canonical `audio_meta.json` plus
   `audio_timeline.html`; do not hand-estimate timings or concatenate tracks.
6. Build frames using the portrait safe zone and `channel/styles.css`; use
   vertical source/process/destination primitives and seekable causal motion.
   Preserve the approved objects and connections, carry persistent objects
   across cuts, and use the safe area for large diagrams. Retiming the existing
   storyboard beats after TTS avoids a second timing document.
   Assemble v2 projects with `npm run assemble -- --project videos/<project>`;
   stage `public/vendor/gsap.min.js` locally first. This reads the canonical
   audio metadata, so renaming frame files requires `npm run tts -- --project
   videos/<project> --metadata-only` before assembly. Stop Studio before a
   mechanical rebuild. The repository assembler avoids the generic skill
   assembler's remote runtime URL. It creates the base narration-only index;
   add optional captions or sound clips afterward and revalidate them.
7. Run `npm run validate -- --project videos/<project>` and `npx hyperframes check`,
   inspect opening/action/result samples and play the preview with sound off
   and on. Compare built scenes with their approved sketches, not just their
   narration. Gate 2 is explicit final-preview
   approval. Render only after that approval.

`ICON_PLAN.json` entries use `{id, provider, path, role, meaning, color, style}`;
`provider` is `fontawesome`, `icons8`, or `custom`. Icons8 entries also include
`source`; colored local icons are valid in any scene, not only hero scenes.

Reusable starter templates live in `channel/templates/`: `SCRIPT.md`,
`STORYBOARD.md`, `ICON_PLAN.json`, `channel.json`, and a minimal frame. Copy
them for a project and keep only files the project uses.

Useful commands: `python scripts/sync_channel_assets.py --project videos/<project>`,
`npm run tts -- --project videos/<project> --dry-run`, and
`npm run validate -- --project videos/<project> --stage plan`. Use `--stage
preview` after measured audio exists; `npm run validate:all` is plan-only. The
render stage is entered only after explicit final-preview approval.

Plan validation accepts a storyboard before frames/audio exist; it still checks
any artifacts already present. Preview validation requires real scene hosts,
measured WAVs, local assets, and persisted storyboard approval. A passing
static validator does not prove visual quality or motion: run HyperFrames
`check --snapshots` and inspect the sequence. Use its existing `*.motion.json`
sidecars for meaningful moving regions instead of building another motion
engine; intentional holds must remain possible. The starter's sidecar provides
a bounded packet-motion example. No extra approval gate is needed.

Offer captions and quiet event sounds as brief choices (both off by default).
For a captioned version, reserve a safe caption band, use the existing media-use
caption workflow, and compare at phone size in the same final preview review.
For event sounds, resolve local assets via media-use, place uniquely identified
audio clips at the action beats, and audition them beneath narration. Do not
add idle sounds or background music automatically.

An optional `pronunciation.json` can override terms or lines, for example:
`{"ipv4_style":"grouped","terms":{"SQL":"sequel"},"lines":{"line-1":"A A, A A"}}`.
`ipv4_style` is `grouped` (default, "one hundred ninety two"), `digits`
("one nine two"), or `short` ("one ninety two"). Use `short` for videos whose
lesson is IP addresses: `grouped` nearly doubles the spoken word count and
breaks the short-form duration budget.
