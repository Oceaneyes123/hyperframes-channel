# Creative Quality System v1

The system extends the existing Studio, curated artwork, GSAP/Remotion interpreter,
graphics/motion inspectors, measured narration import and exact production gates.
Technical validity does not establish visual or audible quality. Release evaluation
remains pending until an actual candidate and independent human reviews exist.

## Rules and correction ownership

`workflow/creative-rules.ts` owns the built-in IDs, versions, stages, evidence,
corrections, detection methods, severity and exceptions. Generate
`docs/AI-CREATIVE-MISTAKES.md` with `node scripts/creative-rules-doc.ts` after a
reviewed rule change. Tests require exact documentation parity. Bump a rule's
version when its meaning changes; bump the catalog version for a new catalog.

Writing, selected-text revision, visual planning, motion planning and local
narration capture the exact applicable rule definitions and SHA-256 snapshot.
Writing/visual/motion proposals store this snapshot inside their existing immutable,
hash-indexed artifacts. Historical artifacts have no snapshot and remain readable;
they are not retroactively attributed to current rules. Editing or activating a
rule affects future requests only. A request already running retains its snapshot.

Studio's **Creative quality review** groups findings by graphics, motion and voice,
links shots and motion time ranges, and shows full-video provenance. Existing
Graphic design review owns before/after artwork and rendered phone-size review;
Motion owns moving comparisons and synchronized playback. Model-rendered review
suggestions and manually observed problems can also be saved as proposed rules.

Corrections live under the configured data directory's `creative-feedback/`.
Each immutable proposal records a UUID-derived rule ID, source artifact/hash,
project, shot, evidence, correction and exception. It remains inactive until the
user runs the existing stage inspector on its source and selected artifacts from
the same project, records regression evidence, checks the human confirmation box,
and activates it. The report records inspector findings, not proof that an arbitrary
natural-language correction is automatically detected. Activation applies across
future projects. Rejection never activates a rule.
An exclusive hash-bound decision prevents double decisions and detects changed
proposals. Pending or rejected model suggestions are never generation policy.
An active rule can be withdrawn with explicit human confirmation and a reason;
historical snapshots remain unchanged. A replacement can be proposed as a new
rule. Do not edit decision JSON manually. Back up this
directory with the database, videos and narration takes. Interrupted or corrupt
records fail closed and require recovery from a known backup.

Asset references, geometry, source identities, audio and timing contracts retain
their structural validators. Mobile readability, diversity and pacing are review
findings. Canvas-copy concerns can be acknowledged in explicit storyboard review;
numeric containment/alignment remain structural blockers. Production gates retain
explicit exact-input review and render authorization; aesthetic motion heuristics
do not automatically reject an otherwise valid human-reviewed plan. Code/engine
updates can stale a production binding through the existing engine hash, while
the historical approval records remain intact. Rule activation alone does not
change bindings or accepted creative decisions.

## Graphics and motion

Reuse `shot.design`, frame environments, curated asset registries, semantic diagrams
and the eight existing composition families. New scenes describe meaning,
composition/hierarchy, assets, palette, depth and continuity. New generated shots
must include this specification; saved legacy shots remain readable. Generic geometry is
appropriate when it teaches the mechanism, rather than filling space. Do not
generate arbitrary executable SVG or fabricate assets.

Graphics review now also detects missing art direction and three approximately
identical neighboring endpoint layouts, even when their design prose differs.
The geometry heuristic rounds object boxes to five percentage points and includes
shape type. It cannot prove perceptual similarity. `continuityReason` exempts an
intentional sequence. Always inspect actual frames at 360px width.

Existing motion inspectors cover the whole scheduled timeline: inactive windows,
long holds, slow entrances, repeated presets, passive sequences, competing effects,
camera-only drift, bounds and seams. Guidance specifies an energetic hook, clear
development and concise payoff. Reading holds and accurate teaching override
activity thresholds. No automatic speed multiplier or decorative-motion filler is
introduced. Existing full-frame/seek/seam proof scripts remain the runtime checks.
The comparison tool also samples the actual export at two frames per second and
reports low-change intervals for review. Pixel change cannot distinguish meaningful
action from camera motion and quiet intervals may be deliberate reading holds.

## Local narration evaluation

`server/narration/generation.ts` accepts a provider interface, ordered segments,
voice settings, pronunciation replacements and a seed. Every attempt has a new
directory under `narration-takes/`; failed requests and earlier takes are preserved.
Regenerate a stable segment by submitting only that original line number. This
creates a separate audition take; it never silently splices approved audio.

Adapters:

| Adapter | Runtime | State |
| --- | --- | --- |
| Windows Speech | Installed System.Speech voice, PCM16 24 kHz | Actual local smoke evaluation generated successfully |
| Chatterbox Turbo | Operator-selected Python, cached model and reference WAV | Offline adapter implemented; model/runtime comparison pending |
| Qwen3-TTS Base | Operator-selected Python, cached model and reference WAV/transcript | Offline adapter implemented; model/runtime comparison pending |
| Qwen3-TTS 1.7B CustomVoice | Operator-selected Python, cached model and preset speaker | Delivery instructions supported; real listening comparison pending |

Model APIs/license references were checked against the primary
[Chatterbox source](https://github.com/resemble-ai/chatterbox),
[Turbo loader](https://github.com/resemble-ai/chatterbox/blob/master/src/chatterbox/tts_turbo.py)
and [Qwen3-TTS documentation](https://github.com/QwenLM/Qwen3-TTS).
Chatterbox lists MIT; Qwen3-TTS lists Apache-2.0. Verify the license of the exact
downloaded weights and reference voice before choosing a production model.
Windows voice rights follow the installed Windows license. Adapters never install
packages, fetch weights, switch providers or choose a default implicitly.

Run from v3:

```powershell
node scripts/evaluate-narration.ts .planning/2026-10-26-creative-quality-v1/narration-evaluation.json
```

The JSON supplies `outputDirectory`, one shared `request` and `providers`. Python
provider entries require `python`, `provider` (`chatterbox-turbo`, `qwen3-tts` or `qwen3-custom`),
`modelPath`, `version`, `voice`, `referenceWav`, `referenceText` and `device`
(`cpu` or `cuda`); `qwen3-custom` uses a preset speaker and needs no reference WAV
or transcript. Record the exact downloaded model revision in `version`.
Inference runs offline. A provider failure is recorded without substitution.
The actual host exposes a Ryzen 7 3700X, about 48 GiB RAM and a GTX 1650-class
GPU with 4096 MiB VRAM. A separate project-local Qwen environment was installed
with CPU Torch; model download and actual neural benchmarks remain in progress.

Takes record provider/model/voice/license, reference hash where applicable,
actual runtime metadata when supplied, source/spoken text, pronunciation settings,
seed, raw-signal diagnostics, normalized PCM16 audio, SHA-256, measured sample
boundaries, frame boundaries and latency. Peak normalization targets 0.89 full
scale; it is not loudness mastering. Signal checks reject malformed/silent WAV,
report clipping and quiet audio, and leave pronunciation/expressiveness to listening.
Current clone adapters do not support delivery instructions or a speech-rate
control; Windows supports rate only. The 1.7B CustomVoice adapter forwards delivery
instructions, while the 0.6B model is rejected because it ignores them. Capability flags and delivery intent are
recorded, rather than claiming those controls were applied. Seed reuse does not
guarantee bit-identical neural synthesis across hardware or runtime versions.

No default is selected before listening. Existing provider preferences, imported
narration and gates are unchanged. Studio's **Narration timing** can generate,
compare and explicitly import full auditions bound to the accepted script. Configure
CustomVoice on the host with `V3_QWEN_PYTHON`, `V3_QWEN_MODEL_DIR`,
`V3_QWEN_MODEL_VERSION`, `V3_QWEN_SPEAKER` and `V3_QWEN_DEVICE`. Single-line
auditions cannot be imported as a complete take. Segment boundaries do not establish
word alignment. New verified-aligner
imports require tool/version, exact audio/script hashes and human review notes;
legacy saved timing artifacts remain readable.

## Controlled release comparison

Use an existing complete 50–75-second output, freezing the script/facts/core goals,
board, motion, audio and export hashes. A 71.933-second project was identified:
`videos/1c65e530-9583-4a92-ab5c-2c67d0b89063/production/95bbe282-0ce2-448b-8416-7229740e95ef/export.mp4`.
Its selection is a baseline candidate, not approval of its content or quality.

`node scripts/evaluate-creative-quality.ts <comparison.json>` accepts `baseline`
and `candidate`, each with `storyboard`, `motion`, `narration`, `narrationId` and
`video` paths, plus a new `output` report path. It validates complete duration,
matching script facts/source identities, motion contracts, measured audio duration,
actual export metadata/full decode and source-audio synchronization. It writes
both quality reports and comparable finding counts, with release still pending.
Reports are written exclusively; previous comparisons cannot be overwritten.
To record a completed human review, run `node scripts/review-creative-quality.ts
<review.json>`. The JSON supplies `report`, `output`, and `review` with
`reviewedByHuman`, `reviewer`, pass/fail values for `desktop`, `mobile`, `listening`
and `comprehension`, `comparison` (`improved`, `not-improved`, or `inconclusive`),
`blinded`, `criticalIssuesOpen` and `notes`. It rechecks source hashes and records
the result without granting production approval.

Watch both full videos on desktop and at phone size, sound-off and with narration.
Compare visual meaning, composition, purposeful motion, pacing, voice consistency,
pronunciation and comprehension. Blind the A/B labels where practical and keep
the label key separately. Record reviewer identity, source hashes, observed issues,
preference and reasons. Human corrections can become reproducible fixtures before
activation. Fewer findings do not establish a better video. Do not release until
critical regressions are fixed and actual human review plus existing production
gates pass. The neural-provider listening comparison and new full-video candidate
remain outstanding; this increment does not claim a quality improvement.

## Verification from this increment

See the plan progress log for the current verification results. Prior verification
passed with the webpack build; the default Turbopack build had a CSS worker failure
on this host. No permanent build configuration was changed.

The existing synthetic motion proof passed 350 sequential frames, 11 fresh seek comparisons, a continuous seam and full silent decode. The isolated Studio saved a proposed correction and retained disabled activation until human confirmation/evidence; desktop and 390px mobile layout were inspected. Two actual 18.2735-second Windows Speech takes of the identical request produced the same audio hash. These are software/signal results, not human quality approval. The frozen 71.933-second baseline is in `.planning/2026-10-26-creative-quality-v1/baseline.json`; no new release candidate or neural-provider listening comparison has been completed.
