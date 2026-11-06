# Faster V3 production workflow

Run from V3 with Node 24, using existing Studio stores/decisions. Apply [quality bar](quality-bar.md); new briefs use [V3 prompt](../PROMPT_TEMPLATE.md). Audition, storyboard and representative-scene reviews catch failures before scaling; API success/stills/scores never replace them. Commands neither infer approval, select channel voices nor publish.

## Model assignments

| Work | Model |
| --- | --- |
| Coordination, research, hooks/writing, editorial/creative review, workflow development | Sol 6.1 (`gpt-6.1-sol`) |
| Narration coordination, word alignment, audio planning, concepts/storyboards/assets/motion/revisions | Sol 6.1 |
| Auditions/full takes, checkpoint recovery, generated-audio validation | Dedicated `gpt-6-luna` subagent, audio creation only |
| Preflight, preview/review/final video renders, encoding, technical verification/export | Luna, separate render/export assignment |

Audio worker handoff: accepted script ID, selected voice/reference, exact settings, output paths, authorization and active job/checkpoint state. Execute prepared VoiceStudio/explicit-provider requests; preserve raw audio/receipts and measure duration/segments. Monitor matching jobs, never duplicate them.

Audio worker exclusions: writing, provider/voice selection, editorial review, word alignment, visuals, video rendering/export, publishing and human approval. Sol owns creative decisions/source changes; user owns acceptance/authorization. If `gpt-6-luna` is unavailable, report it; never silently substitute/claim delegation. Assignments change no gateway/provider settings or historical records.

## Cost controls for audio and rendering

- Handoff only current-stage IDs/hashes/settings/paths/authorization/checkpoints; reference files rather than copying chat/research/history. Other subagents follow repository authorization rules.
- Run one matching job. Prefer completion/blocker notifications, otherwise bounded waits reporting changed milestones/failures/input needs. No empty status turns, short polling or restarts for status.
- Return job ID/outcome, paths/hashes, duration/frame count, verification/blockers; keep full logs on disk.
- Reuse reviewed voice/settings within scope. Audition changed voice/reference/delivery or new pronunciation, not unchanged settings on resume. Generate full take after audition acceptance, then measure/review.
- Recover supported matching checkpoints/segments; otherwise create a new take. Preserve originals and review complete audio/timing before import. Reuse grants neither changed-input approval nor commercial rights.
- Revise at 360×640 before final 1080×1920. Single-pass PNG/encode retains independent seeks, every-frame comparison, full decode/duration/audio checks. Diagnose before retrying only supported failed steps with unchanged bindings; never reuse frames/approvals across bindings.
- Measure coordinator/worker cached input, uncached input, output, elapsed time/retries separately. Cached tokens alone are not monetary savings; compare actual runs/billing before claims.

## 1. Check dependencies before starting

```powershell
npm run workflow -- preflight gateway
npm run workflow -- preflight render
npm run workflow -- status PROJECT_ID
```

Default VoiceStudio: `GET /health` at `http://127.0.0.1:3900`; inspect running `/openapi.json`, `/engines`, `/models`. Verify selected engine/exact weights, audition voice/settings and effective `D:/VoiceStudio/models` from `GET /api/settings/storage/models-dir`. [Audio reference](../../2d-animation/channel/AUDIO_VERSIONS.md) owns exact settings/review status.

Only when Qwen is explicitly selected:

```powershell
npm run workflow -- preflight qwen3-custom
```

| Preflight | Checks | Limits |
| --- | --- | --- |
| Gateway | Model discovery/availability/authorization, no generation | Does not establish credit/image capability |
| Render | Installed Chrome/FFmpeg/ffprobe, ≥512 MB output space | Not a full frame-storage estimate; reserve more for long videos |
| Local voice | Installed voice or Python/model path, selected CUDA capability | No downloads/synthesis |

Check browser automation/playback separately; unavailable playback cannot establish approval. Qwen config: `V3_QWEN_PYTHON`, `V3_QWEN_MODEL_DIR`, `V3_QWEN_MODEL_VERSION`, `V3_QWEN_SPEAKER`, `V3_QWEN_DEVICE`. Record exact weight version; no provider/default fallback.

## 2. Audition once, then generate measured narration

After script acceptance, audition hook/demanding explanation/payoff; approve voice/delivery for clear pronunciation/endings/natural connection with exact settings and `speed:1`. Jasper/Bella remain unaccepted Kitten candidates; private gift-card OmniVoice acceptance does not clear a channel default.

Generate complete take before locking shot lengths. Full listening/every-boundary review precedes original-WAV/measured planning-timing import. VoiceStudio is not a `workflow narrate` adapter; `import-take` requires a validated Studio take, never arbitrary external WAV.

Explicit Windows Speech/Qwen path:

```powershell
npm run workflow -- narrate PROJECT_ID narration-request.json
```

```json
{
  "scriptId": "ACCEPTED_SCRIPT_UUID",
  "provider": "qwen3-custom",
  "pronunciation": [],
  "rate": 0,
  "seed": 42
}
```

Optional `lineNumber` auditions one line. Recover with `resumeTakeId` from `status`/Studio, every other field unchanged. Completed lines have flushed WAVs/checkpoints. Verify request/script/provider identity/runtime, pronunciation/delivery, rate/seed and WAV hash; create a new immutable take reusing matching segments. Changed requests need new takes; checkpoint-free history stays playable but cannot recover this way. Never import partial audio as complete.

After full listening/boundary review:

```powershell
npm run workflow -- import-take PROJECT_ID reviewed-import.json
```

Request: `{ "id": "TAKE_UUID", "baseId": null, "reviewed": true }`. Corrections require current planning-timing UUID as `baseId`. Segment boundaries are measured, not word alignment.

## 3. Review inexpensive visuals before full animation

```powershell
npm run workflow -- visuals PROJECT_ID visual-request.json
npm run workflow -- review-board PROJECT_ID BOARD_ID
npm run workflow -- motion PROJECT_ID motion-request.json
npm run workflow -- review-motion PROJECT_ID MOTION_ID 0
```

Use existing concepts/storyboard/shot/motion request schemas. Select concept before storyboard. Reviewed narration spans/pauses govern generated durations; changed timing/invalid groups reject. Otherwise durations stay explicit estimates; never silently retime accepted legacy boards.

`review-board` creates endpoint PNGs, HTML gallery and graphic findings in new `.data/workflow-reviews/`. Review phone-size readability, containment, composition/teaching before board acceptance. Reports approve nothing.

Review commands accept optional zero-based shot index. Samples use actual full composition/global range, including incoming transition; scoped revisions use `shotId`/`baseId`.

```powershell
npm run workflow -- review-motion PROJECT_ID MOTION_ID
```

Omit index for full 360×640 moving review. Use exact motion-bound planning audio or disclose silence. Watch/listen fully before motion acceptance. Manifests bind source/engine/audio/output hashes. Samples prove neither whole-video sync/quality nor production approval.

## 4. Record production review together

### Representative scene and whole-video review

Intense/new CQ-ENERGY-v2: approve the main teaching mechanism/demanding choreography before full moving review, not merely an easy title shot.

```powershell
npm run workflow -- review-motion PROJECT_ID MOTION_ID SHOT_INDEX
npm run workflow -- approve-review PROJECT_ID scene-review-confirmation.json
npm run workflow -- review-motion PROJECT_ID MOTION_ID
npm run workflow -- approve-review PROJECT_ID full-review-confirmation.json
```

Use rendered review-directory UUID as `reviewId`:

```json
{
  "reviewId": "EXACT_RENDERED_REVIEW_UUID",
  "watchedNormalSpeed": true,
  "causeReactionReviewed": true,
  "rhythmReviewed": true,
  "notes": "Actual human findings and intentional reading holds."
}
```

Record only actual user confirmations. Sample review checks cause/impact/receiving response/handoff; full narrated review checks rhythm/readability/repetition/continuity. Full rhythm approval requires narration; silence cannot prove sync. Record justified holds/exceptions, never invented activity. Counts cannot prove causal impact.

Changed source/engine/media or scoped revision requires new sample approval. Preserve history; review confirmation accepts neither motion nor production gates.

Studio groups two production confirmations/render authorization, preserves current gates, atomically records missing gates against exact binding and streams progress. Failed renders preserve approvals; changed inputs stale them. Separate APIs remain.

CLI: import final narration via production workspace, take `binding` from `status`, save:

```json
{
  "binding": "EXACT_CURRENT_BINDING_SHA256",
  "planReviewed": true,
  "movingAudioReviewed": true,
  "notes": "Actual human findings and accepted limitations."
}
```

```powershell
npm run workflow -- approve-production PROJECT_ID production-review.json
npm run workflow -- export PROJECT_ID render-authorization.json
```

Authorization: `{ "binding": "EXACT_CURRENT_BINDING_SHA256", "authorize": true }`. Never fabricate confirmations. Script/board/motion decisions remain separate; publishing needs separate authorization.

## 5. Render once and retain independent verification

Render full-resolution PNGs once; encode those exact frames with Remotion-discovered audio. Keep fresh independent seeks, every-frame SSIM, full decode, exact duration and narration correlation/lag; never rerender just for reference frames or reuse across bindings. [Production safeguards](animation-workflow.md#narration-and-production-safeguards) owns exact export limits/tolerances and prerequisites.

Studio/CLI report stages/frame milestones without polling. Changed engine bindings require new review/authorization; preserve history. Generated `output/`, `.data/`, `videos/` stay outside typechecking, generated media outside lint. Use typed shared renderer entry points, never untyped per-project components.

Synthetic software verification cannot establish quality/savings; compare real elapsed time, usage and revisions.
