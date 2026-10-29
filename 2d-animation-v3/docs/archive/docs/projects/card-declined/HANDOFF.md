# Card Declined production handoff

Updated: 2026-10-26

## Approved production continuation

The user approved the revised storyboard, Supertonic voice, and narrated phone-resolution draft on 2026-10-26. The Studio storyboard `cc1f057e-7379-4d8f-96a6-fccd9285a237` was already accepted in the UI. Its nine shot hashes match the local review copy exactly. Motion `bb0c252f-d95c-4361-8eba-64dee83e2ce6` was imported and accepted; narration `fcd5d5d6-1704-4195-8cd8-4ee08f714b8b` was imported with measured line boundaries. Binding `db10b647586319ec6120b9e667e304b23332888e93c0f3a0a10a2185bb244943` has Gate 1 `d50f5769-9c5c-41bc-aba4-4084b7117455` and Gate 2 `b77056db-21c6-42cf-a2ce-8e99672867d3` records. Guarded render job `5204d22b-acee-47b4-9cd0-4b662bb44eb1` completed and exported `videos/74c7a9f3-f2c9-47df-8285-29615658348a/production/5204d22b-acee-47b4-9cd0-4b662bb44eb1/export.mp4`. Its 2,447 frames, full decode, fresh seeks, minimum SSIM 0.995494, and narration zero-lag audio check passed. Do not publish, commit, or push.

## Earlier continuation: Supertonic review draft

The user requested a Supertonic fallback after OpenRouter alignment returned HTTP 402 (the account requires at least $0.50 in audio credit). This supersedes the earlier no-local-model instruction for this specific voice generation. The previously approved Fish Audio WAV and receipt remain untouched.

- The existing `2d-animation/.tools/supertonic3-model/voice_styles/channel-voice.json` clone generated nine separate takes from accepted script revision `7547d96e-1924-4dc6-b2c3-7774911015f7`. Pronunciation overrides speak codes 51 and 05 as “fifty one” and “zero five.” The unsped, exact-sample assembled WAV is `.data/card-declined-production-2026-10-26/supertonic/narration-supertonic.wav` (81.5667 seconds, 48 kHz mono PCM16). Its receipt includes source hashes and measured line positions. Human listening and pronunciation review remain pending.
- A revised nine-shot storyboard with larger text, a readable vertical route, and progressive reveals is saved in Studio as **pending** proposal `cc1f057e-7379-4d8f-96a6-fccd9285a237`: `http://127.0.0.1:3003/projects/74c7a9f3-f2c9-47df-8285-29615658348a/visuals?run=cc1f057e-7379-4d8f-96a6-fccd9285a237`. The earlier storyboard acceptance is now stale because this is the latest proposal. Do not infer acceptance from the user's earlier approval of the previous drawing.
- Offline review motion `697eb875-dcfa-4230-bec2-076e521454bf` matches the revised drawing and exact voice duration: 2,447 frames. Validation and nine measured line spans pass. Motion Quality has two heuristic repeated-reveal findings and no small-text or long-stillness findings. It is **not** a Studio motion run or an accepted motion.
- Narrated, phone-resolution review export: `.data/card-declined-production-2026-10-26/card-declined-supertonic-review.mp4` (360×640, 30 fps, 2,447 frames). Full decode passes; audio correlation is 0.9999635 with zero measured lag. The encoded opening, route and close were visually inspected. See `card-declined-supertonic-review-verification.json` in the same folder. This is a draft review export, not the guarded 1080×1920 production render.

Next: the user reviews the new voice, storyboard and moving draft. If approved, accept the exact Studio storyboard, import the validated motion against that accepted artifact, and explicitly accept the motion. Then import the measured Supertonic narration, complete Gate 1 for the bound inputs, perform independent moving/audio Gate 2 review, and run the guarded full-resolution render. Publication is separate. Do not commit or push.

## User decisions

- The user approved the current script, creative direction, storyboard, motion proposal, production render, and the generated narration.
- Earlier the user said **do not use a local model**. The later explicit Supertonic fallback request authorized local inference for the replacement narration only. No Ollama inference was run.
- The user has not reviewed the actual moving preview. Keep Gate 1, Gate 2, and publication decisions separate. Do not commit or push.

## Current Studio artifacts

- Project: `74c7a9f3-f2c9-47df-8285-29615658348a` — “Card Declined But I Have Money — What Happened?”
- Accepted script revision: `7547d96e-1924-4dc6-b2c3-7774911015f7`.
- Selected concept: “Two balances, one purchase — a connected account cutaway.”
- Previously accepted storyboard: `ceded441-7f1d-48d1-948d-79a7441ca0a4`, nine shots, 76.36 seconds estimated; stale after the new review proposal above.
- Previous motion candidate: `62a95494-b4cb-4094-b12a-782dffc75aa3`, 2,291 frames (76.367 seconds), **pending review; not accepted**. Its historical preview is at `http://127.0.0.1:3003/projects/74c7a9f3-f2c9-47df-8285-29615658348a/visuals?motion=62a95494-b4cb-4094-b12a-782dffc75aa3#motion-review`.
- Production status is not ready: measured timing exists for the replacement Supertonic WAV but is not imported; no bound production source, Gate 1, Gate 2, or final video exists.

## Previous Fish Audio narration

- Approved WAV: `.data/card-declined-production-2026-10-26/narration.wav` — 76.36 seconds, 48 kHz mono PCM16.
- Raw TTS: `.data/card-declined-production-2026-10-26/narration-raw.mp3`; generation receipt: `.data/card-declined-production-2026-10-26/narration-request-receipt.json`.
- The user approved the narration performance. That does **not** provide line-by-line timing. The V3 timing form requires every line to be measured against the audio; its estimated storyboard durations are not valid timing evidence.
- At the previous handoff, local inference and external alignment were not authorized. The user subsequently authorized external alignment, then requested the Supertonic fallback when OpenRouter returned HTTP 402. Fish Audio line boundaries remain unmeasured; do not attest to them.

## Changes made to the accepted storyboard

The last accepted revision preserves the same visual endpoints and fixes V3 motion-contract problems:

- Shot 6 changes its transition from `continuous` to `camera`, because the route diagram and issuer balance drawing have no shared actor for a continuous handoff.
- Hidden amount and hold states use component reveal masks, allowing V3's registered `mask-reveal@1` motion while keeping the approved endpoint appearance.
- Reply-edge colors stay fixed while their stroke progress changes, allowing the registered `edge-draw@1` motion.

The Studio motion generator failed twice through the configured remote gateway. A schema-conversion candidate was then created from the accepted drawings and the user's approved motion direction. It has not been accepted. Its quality report has 18 warnings, including small text in shots 4, 6–9 and long stretches without visual development in most shots. Review and improve these before accepting the motion or binding production.

## Previous handoff steps (superseded by the continuation above)

1. Inspect the pending motion candidate in Studio. Fix phone-size readability and add meaningful visual development where the current plan stays static; preserve source-bound amounts, labels, and the user's approved causal limits.
2. Measure every narration line against the approved WAV and import the timing. The final audio duration is within one frame of the candidate motion schedule, but that does not establish line boundaries.
3. Recheck motion quality and the exact bound source. Complete Gate 1 only after reviewing those exact inputs.
4. Render a review export, watch it with audio, and check timing, seams, and phone-size readability. Complete Gate 2 for that exact export before final render.
5. Do not publish without a separate publication decision.

## Existing worktree changes

The workspace already has uncommitted changes. Preserve them; this handoff does not commit, push, or reset anything. `git status --short` at handoff creation showed:

```text
 M docs/projects/card-declined/REVIEW.md
 M engine/components/finance-surface.tsx
 M engine/components/visual-component.tsx
 M tests/finance.test.ts
 M tests/fixtures/motion-presets.ts
?? .planning/2026-10-26-card-declined-audit-completion/
?? docs/projects/card-declined/COMPONENTS.md
?? docs/projects/card-declined/CREATIVE-REVIEW.md
?? docs/projects/card-declined/MOTION.md
?? docs/projects/card-declined/RESEARCH.md
?? docs/projects/card-declined/SCRIPT.md
?? docs/projects/card-declined/STATUS.md
?? docs/projects/card-declined/STORYBOARD.md
?? docs/projects/card-declined/TECHNICAL-REVIEW.md
?? public/media/card-declined/
?? scripts/verify-card-declined.mjs
?? tests/fixtures/finance.ts
```

The planning notes record one earlier unrelated test failure involving an ignored `videos/card-declined/technical-fixture.ts`. Check `.planning/2026-10-26-card-declined-audit-completion/progress.md` for the prior audit evidence; do not treat that failure as a pass.
