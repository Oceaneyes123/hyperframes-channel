# HyperFrames Channel Recipe v2

Use one source of truth: `SCRIPT.md` owns spoken lines and display copy,
`STORYBOARD.md` maps each line to one visual beat, and `ICON_PLAN.json` names
the exact local assets. `channel.json` must declare `{ "design":
"hyperframes-channel", "design_version": "2.0.0" }`.

1. Capture facts in `FACTS.md`; choose one beginner mental model.
2. Write `SCRIPT.md` as 6–10 `## Line N` scenes targeting 45–60 seconds. Keep
   display copy separate from indented narration and normalize the latter before
   TTS.
3. Write a timed `STORYBOARD.md`: `narration_ref: SCRIPT.md#Line N`, objective, dominant visual,
   `icon_assets`, visible text, animation, beginning/ending state, transition,
   and complexity. Flag scenes over one idea, 2–5 objects, or ~16 visible words.
4. Resolve every icon locally, then build actual-icon sketches. Gate 1 requires
   inspectable sketches and explicit approval; text-only wireframes do not count.
5. After gate 1, run `npm run tts -- --project videos/<project> --dry-run`, review
   normalized speech, then synthesize one WAV per scene. The generator measures
   saved WAV frames and records canonical `audio_meta.json` plus
   `audio_timeline.html`; do not hand-estimate timings or concatenate tracks.
6. Build frames using the portrait safe zone and `channel/styles.css`; use
   vertical source/process/destination primitives and seekable causal motion.
7. Run `npm run validate -- --project videos/<project>` and `npx hyperframes check`,
   inspect midpoint snapshots and preview. Gate 2 is explicit final-preview
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

An optional `pronunciation.json` can override terms or lines, for example:
`{"ipv4_style":"grouped","terms":{"SQL":"sequel"},"lines":{"line-1":"A A, A A"}}`.
