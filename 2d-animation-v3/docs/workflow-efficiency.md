# Faster V3 production workflow

Use existing Studio decisions and stores. The commands below replace project-specific
orchestration scripts; they never infer approval, change the channel voice default,
or publish anything. Run from `2d-animation-v3` with Node 24.

## Model assignments

Use Sol 6.1 (`gpt-6.1-sol`) for every part of the workflow except rendering and
export. Use Luna (`gpt-6-luna`) only for rendering and export operations.

| Work | Assigned model |
| --- | --- |
| Research, scripts, hooks and editorial review | Sol 6.1 |
| Narration coordination, alignment and audio planning | Sol 6.1 |
| Concepts, storyboards, assets, motion authoring and revisions | Sol 6.1 |
| Creative review, feedback and workflow development | Sol 6.1 |
| Render preflight, preview/review renders, final rendering, encoding, technical output verification and export | Luna |

Luna executes the prepared render/export workflow using the existing tools.
Creative decisions and any resulting source changes remain with Sol 6.1; human
acceptance and production authorization remain explicit user decisions. These
assignments do not change gateway settings, narration providers or historical
model records.

## 1. Check dependencies before starting

```powershell
npm run workflow -- preflight gateway
npm run workflow -- preflight qwen3-custom
npm run workflow -- preflight render
npm run workflow -- status PROJECT_ID
```

Gateway preflight uses model discovery, not a generation request. It checks
availability and authorization, not provider credit. Render preflight checks Chrome,
FFmpeg, FFprobe and at least 512 MB of free output storage. That minimum is not a
full frame-storage estimate; leave substantially more space for long videos.
Local voice preflight checks the installed voice or Python package/model path and
selected CUDA capability without downloading models or synthesizing speech.
Browser automation/playback permissions still require a separate playback check.
An unavailable author playback route does not establish creative approval.

Qwen uses existing server-owned `V3_QWEN_PYTHON`, `V3_QWEN_MODEL_DIR`,
`V3_QWEN_MODEL_VERSION`, `V3_QWEN_SPEAKER` and `V3_QWEN_DEVICE` settings.
Keep model versions accurate when changing local weights. No provider fallback or
new default is selected automatically.

## 2. Audition once, then generate measured narration

After accepting the script, audition representative hook, explanation and payoff
lines in Studio. Approve the voice and delivery together when practical. Generate
the complete take before locking storyboard durations.

```powershell
npm run workflow -- narrate PROJECT_ID narration-request.json
```

Example request:

```json
{
  "scriptId": "ACCEPTED_SCRIPT_UUID",
  "provider": "qwen3-custom",
  "pronunciation": [],
  "rate": 0,
  "seed": 42
}
```

Use optional `lineNumber` for an audition. For an interrupted take, add
`resumeTakeId` from `status` or select the take in Studio. Keep every other request
field identical. Each completed line has a flushed WAV and checkpoint. Recovery
verifies the request, source script, provider identity/runtime, pronunciation,
delivery rules, rate, seed and WAV hash, then creates a new immutable take reusing
only matching completed segments. A changed request requires a new take. Historical
takes without checkpoints remain playable but cannot use this recovery path.
Interrupted partial audio is never imported as a complete take.

After listening to the complete result and checking every boundary:

```powershell
npm run workflow -- import-take PROJECT_ID reviewed-import.json
```

The request is `{ "id": "TAKE_UUID", "baseId": null, "reviewed": true }`.
For a timing correction, `baseId` must be the current planning-timing UUID.
Generated segment boundaries are measured; they are not word alignment.

## 3. Review inexpensive visuals before full animation

```powershell
npm run workflow -- visuals PROJECT_ID visual-request.json
npm run workflow -- review-board PROJECT_ID BOARD_ID
```

`visuals` accepts the existing concepts/storyboard/shot request schema. Generate
concepts, select a direction in Studio, then generate the storyboard. When current
reviewed narration timing exists, storyboard generation receives those spans and
derives shot durations from them, including pauses. It rejects changed timing or
invalid line groups. Without timing, durations remain explicit estimates.
Legacy boards remain readable; no accepted board is silently retimed.

`review-board` renders 360×640 start/end PNGs, an HTML gallery and the existing
graphic inspector report under a new `.data/workflow-reviews/` directory. Inspect
readability, number containment, composition and visual teaching before accepting
the board. Reports do not approve anything.

```powershell
npm run workflow -- motion PROJECT_ID motion-request.json
npm run workflow -- review-motion PROJECT_ID MOTION_ID 0
```

`motion` accepts the existing motion request schema. The optional final argument to
either review command is a zero-based shot index. Review one representative scene
first; fix its motion language before rendering the whole video. For scoped motion
changes, reuse the existing `shotId`/`baseId` request. The selected scene uses the
actual full composition and global frame range, preserving its incoming transition.

```powershell
npm run workflow -- review-motion PROJECT_ID MOTION_ID
```

Omit the shot index for the complete 360×640 moving review. Reviews use the exact
motion-bound planning audio when present and otherwise explicitly disclose silence.
Listen and watch the complete moving candidate before accepting motion in Studio.
A representative scene cannot establish full-video quality or synchronization.
Review manifests record source, engine, audio and output hashes. They never bypass
the production gates.

## 4. Record production review together

### Representative scene and whole-video review

For Intense/new CQ-ENERGY-v2 candidates, approve one representative scene before
rendering the complete moving review. Select a scene with the main teaching
mechanism and demanding choreography, not simply the easiest title shot.

```powershell
npm run workflow -- review-motion PROJECT_ID MOTION_ID SHOT_INDEX
npm run workflow -- approve-review PROJECT_ID scene-review-confirmation.json
npm run workflow -- review-motion PROJECT_ID MOTION_ID
npm run workflow -- approve-review PROJECT_ID full-review-confirmation.json
```

Each renderer returns a unique workflow-reviews directory. Its directory UUID is
the `reviewId` in this confirmation format:

```json
{
  "reviewId": "EXACT_RENDERED_REVIEW_UUID",
  "watchedNormalSpeed": true,
  "causeReactionReviewed": true,
  "rhythmReviewed": true,
  "notes": "Actual human review findings and intentional reading holds."
}
```

Only record these confirmations after the user actually provides them. Review
cause, impact, receiving-object reaction and handoff in the sample. After the full
render, watch the whole video with its motion-bound narration and check changing
rhythm, readability, repetition and continuity across scenes. Full rhythm approval
requires narration; a silent sample cannot establish synchronization. Record accepted
exceptions rather than inventing extra movement. Inspector rhythm counts and
reaction findings support this review but cannot prove causality or visual impact.
Changed source, engine or review media invalidates sample approval. A scoped
revision creates a new candidate and needs new representative approval. Historical
reviews remain preserved. Review approval does not accept motion or production gates;
continue with the existing explicit artifact and production decisions below.

Studio's final form groups the two required review confirmations and explicit local
render authorization. It preserves already approved current gates, records missing
gates atomically against the exact binding, and streams render progress. A failed
render preserves recorded approvals; inputs changing makes them stale as before.
The separate approval APIs remain available.

For CLI work, import final narration through the existing production workspace,
then obtain the binding from `status` and save a review request:

```json
{
  "binding": "EXACT_CURRENT_BINDING_SHA256",
  "planReviewed": true,
  "movingAudioReviewed": true,
  "notes": "Actual human review findings and accepted limitations."
}
```

```powershell
npm run workflow -- approve-production PROJECT_ID production-review.json
npm run workflow -- export PROJECT_ID render-authorization.json
```

Authorization is `{ "binding": "EXACT_CURRENT_BINDING_SHA256", "authorize": true }`.
Never put review confirmations in a request until the human has actually provided
them. Script, storyboard and motion acceptance are still separate artifact decisions.
Publishing remains separately authorized.

## 5. Render once and retain independent verification

Production renders a full-resolution PNG sequence once and encodes those exact
frames with Remotion's discovered audio assets. It no longer renders the whole
composition again to obtain reference images. It still checks fresh independent
seeks, every encoded frame's SSIM, full decode, exact duration and narration
correlation/lag. No frames or approvals are reused across production bindings.
Studio and CLI report stages and frame milestones without process polling.

Changes to engine-bound files invalidate old production bindings. Historical media
and receipts remain untouched; review and authorize the new binding before a new
export. Generated `output/`, `.data/` and `videos/` files are excluded from application
typechecking; generated media is also excluded from lint. Rendering uses typed
shared entry points instead of creating untyped per-project components.

No percentage or monetary saving is claimed. Compare real project elapsed time,
provider usage and revision counts after adoption. Synthetic verification establishes
the software path, not human creative quality.
