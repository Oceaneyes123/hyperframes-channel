# Channel narration versions

## Current default: audio version 3 — VoiceStudio (local)

On November 5, 2026, the user requested VoiceStudio and asked that the reference
files use it. Use VoiceStudio for new narration. Preserve older providers and
accepted audio as historical references; never fall back to Fish automatically.
The gift-card project's Fish audition was explicitly rejected.

VoiceStudio is the application default, not an automatic engine/voice choice.
Apply the [V3 quality bar](../../2d-animation-v3/docs/quality-bar.md): select clear
pronunciation and natural delivery by listening, then approve the complete take
and measured boundaries before locking scene lengths. Do not attribute an existing
take to a subagent unless its generation records show that delegation occurred.

Delegate audio creation only to a dedicated **GPT-6 Luna subagent** with the
explicit model `gpt-6-luna`. The subagent operates VoiceStudio or the selected
provider for auditions, full takes, recovery and audio validation. The main agent
retains script/voice decisions, alignment, creative review and approval handling.
Do not delegate video rendering or unrelated work to this audio-only subagent.
See [workflow assignments](../../2d-animation-v3/docs/workflow-efficiency.md#model-assignments)
for the complete scope and existing-job safeguards.

| Setting | Version 3 |
| --- | --- |
| Application | [VoiceStudio](https://github.com/debpalash/VoiceStudio), verified locally at version `0.5.7` |
| Engine | Explicitly selected after audition; Kitten is a candidate setup, not an accepted channel voice |
| Model | Record exact selected weights and licence scope; the installed Kitten candidate is `KittenML/kitten-tts-mini-0.8` (Apache-2.0, approximately 80 MB) |
| Compute | Match the selected engine; the recorded Kitten candidate uses ONNX Runtime on CPU |
| Model directory | `D:\VoiceStudio\models`, verified as the backend's configured and effective directory |
| Endpoint | `POST http://127.0.0.1:3900/v1/audio/speech` |
| Format | `wav`; verified auditions are PCM16, mono, 24 kHz |
| Voice | Select an explicit preset after listening; no channel preset is accepted yet |
| Speed | `1`; no narration acceleration or post-generation time compression |

### Voice selection and delivery

Prefer clear pronunciation, complete word endings and connected conversational
teaching. Audition the hook, a demanding explanation and the payoff before full
narration. Jasper (`expr-voice-2-m`) and Bella (`expr-voice-2-f`) are candidates,
not approved voices. Keep the selected preset identical across a project's takes.

KittenTTS supports preset voices and speed, not emotion or voice-design controls.
Do not claim that an `instructions` field gives it expressive delivery. Judge
clarity, rhythm, pronunciation and reading completeness by listening. If neither
preset is suitable, review another VoiceStudio engine and its requirements before
changing engines or downloading another model.

### Generation and measured timing

Check `GET /health`, discover the running contracts at `GET /openapi.json`, and
verify the selected engine and its installed weights through `GET /engines` and
`GET /models`. Do not assume an earlier installation still selects the intended
engine. Discover preset IDs from the engine; OpenAI names such as `alloy`
are compatibility aliases for its default, not distinct selected voices.

This is a Bella audition example, not a voice acceptance:

```json
{
  "model": "kittentts",
  "voice": "expr-voice-2-f",
  "input": "That forgotten gift card? It could become their revenue.",
  "response_format": "wav",
  "language": "en",
  "speed": 1
}
```

Preserve the exact script revision/hash, selected lines, request, VoiceStudio
version, engine/model/preset identity, original WAV and audio hash. Verify the
response status, audio format and duration. A successful request does not establish
clarity or human listening approval.

After script and voice/delivery acceptance, generate the full take at natural
speed. Measure and review every line boundary before importing planning timing;
derive scene lengths and total duration from that recording. Segment timings are
not word alignment. Tighten an over-limit script and obtain renewed acceptance
instead of accelerating speech. V3's existing narration and production gates apply.

VoiceStudio is an external local narration source. V3's `workflow narrate` command
currently supports Windows Speech and Qwen, not VoiceStudio. Use the existing
reviewed WAV/planning-timing import for VoiceStudio audio; do not pass a VoiceStudio
recording to `import-take` as though it were a built-in Studio narration take.

### Storage and verified auditions

The durable VoiceStudio setting is `OMNIVOICE_CACHE_DIR=D:/VoiceStudio/models`,
stored in `%USERPROFILE%\.config\omnivoice\env`. It takes effect after a backend
restart. The backend has been restarted and generated both auditions using the
D-drive model. Application and Python runtime files remain on C. A verified old
model copy also remains on C because automatic approval policy blocked deletion;
do not describe that duplicate as removed. The local Windows
`OMNIVOICE_TORCH_VARIANT=cpu` preference keeps setup on the CPU runtime.

Gift-card project: `f04c77e3-d718-4946-b69c-27a089ed1aae`; accepted script:
`68943219-3d47-4764-89a3-54d176a1cdcd`. Auditions cover lines 1, 3, 11 and 15.
Local, ignored evidence is under
`2d-animation-v3/videos/f04c77e3-d718-4946-b69c-27a089ed1aae/narration-source/0f0fffe2-3c2f-49f7-856c-b1a548fecdcb/`:

| Candidate | Original file | Measured duration | SHA-256 |
| --- | --- | --- | --- |
| Jasper | `audition-jasper.wav` | 31.6040416667 s | `485b3c43967faae7a812ec3e705505c19004a2a995787563d46c0fb6e2ba2a90` |
| Bella | `audition-bella.wav` | 45.7145833333 s | `7f61f910c1661d40e6eeaacf30fc56bbe9c10adf1b131f060fe1bc121c9a9339` |

The same directory preserves each request and `receipt.json`. Both Kitten WAVs
passed format/duration inspection; neither has human listening acceptance. The
later OmniVoice approval below does not approve these presets. Local evidence is
not included in a fresh clone.

### Accepted gift-card recording: OmniVoice, private evaluation only

The user selected the clearer VoiceStudio `k2-fsa/OmniVoice` audition and later
approved the complete narration, measured timing, full moving review and local
final render. The exact take is `1e497899-0cef-4257-b93b-d68804502a0c`, using
voice profile `1980e0f0`, natural speed and the approved synthetic reference.
The 104.7047916667-second WAV has SHA-256
`c27531fb5b3f420ace26d3b98a684f1f8211d1ee78d4a11b108073db3d256191`.
Timing import is `ee1cae4a-c81a-4637-9b44-0bcac38898b8`; the final accepted
motion is `b047b752-024a-4365-9848-f921383a562d`. The local 1080×1920 render
contains 3,142 frames, covering the final partial audio frame without speeding or
truncating speech. The original Kitten auditions remain preserved and unaccepted.

This is project-specific listening evidence, not permission to use OmniVoice for
every project or a commercially cleared channel voice. The recorded acceptance of
the OmniVoice weights and associated listed terms was for private non-commercial
evaluation. Keep that restriction with packaging and exports; a render or thumbnail
approval does not authorize publishing or broaden the model's rights. New work
must select an appropriate licensed engine/voice and obtain its own listening
approval. Do not silently fall back to Fish or presume that installed weights
resolve clarity, delivery or release rights.

## Preserved reference: audio version 2 — Fish Audio via OpenRouter

On October 25, 2026, the user preferred the Fish Audio audition and requested
that it become the default for future narration. Version 3 supersedes that
provider preference. The settings and earlier approval below are historical;
they do not authorize new Fish generation or accept its rejected gift-card take.

| Setting | Version 2 |
| --- | --- |
| Provider | OpenRouter, Fish Audio |
| Model | `fish-audio/s2.1-pro-free:free` |
| Endpoint | `POST https://openrouter.ai/api/v1/audio/speech` |
| Authentication | Read `OPENROUTER_API_KEY` from the repository `.env` server-side; never copy credentials into artifacts or logs |
| Format | `mp3` for audition and source preservation; convert to the project's required PCM16 WAV for production import |
| Voice | Provider default; the approved request omitted `voice` and returned no stable voice identifier |
| Playback | Natural speed; the audition used no speed parameter or post-generation processing |

The approved audition used these baseline delivery instructions:

> Warm, confident technology teacher. Brisk conversational delivery, crisp consonants, complete word endings. Brief pauses around technical names. Energetic but easy to follow. No shouting.

Keep energy in emphasis and delivery. Do not compress speech to fit an estimated
shot duration. Measure the generated audio, then revise the script or visual
timing as needed. Check technical names, abbreviations and word endings by listening.
Preserve raw takes, exact request settings, generation IDs, audio hashes and
measured timing for each production revision. Do not silently switch providers
or paid models if the free endpoint becomes unavailable.

### Dynamic delivery for future narration

On October 25, 2026, the user requested more dynamic delivery to avoid a monotone
voice. Keep the baseline warmth and clear pronunciation, then direct each passage
according to its purpose:

| Passage | Delivery direction |
| --- | --- |
| Hook | Curious and upbeat; emphasize the opportunity and leave a brief pause before the explanation |
| Explanation | Warm, connected teaching; vary sentence melody, stress the important action, and pause around technical terms |
| Payoff | Confident and slightly slower; give the main takeaway a clear emphasis and a settled ending |

Use this overall direction for new takes:

> Speak as a warm, engaged technology teacher talking to one beginner. Vary pitch, emphasis and rhythm naturally with the meaning. Open with curiosity and upbeat energy, explain with clear conversational phrasing, and land the takeaway confidently at a slightly slower pace. Use brief pauses between ideas and around technical names. Keep consonants crisp and word endings complete. Avoid repetitive sentence melody, a flat cadence, shouting or exaggerated announcer delivery. Keep natural playback speed.

Combine the overall direction with the relevant passage direction in the request's
`instructions`, or use per-turn `instructions` when generating multi-speaker-style
turn arrays with the same explicitly selected voice. Do not put direction in the
spoken script or invent unsupported audio tags. Keep adjacent passages connected;
avoid treating every sentence as a new hook or adding emphasis to every word.

Until a stable voice identifier is selected, prefer one continuous take with the
overall direction; separate default-voice requests may change speaker identity.
Record the exact directions with each take. Listen for audible variation, smooth
transitions, correct technical pronunciation and whether any directions were read
aloud. This is the requested direction for future auditions, not an approved new
recording or evidence that the model follows every instruction. Preserve the
original audition and its exact request unchanged for comparison.

### Approved audition and evidence

- [Fish Audio audition](../../outputs/tts-audition-2026-10-25/fish-audio.mp3)
- [Exact request and spoken excerpt](../../outputs/tts-audition-2026-10-25/fish-audio-request.json)
- [Generation receipt](../../outputs/tts-audition-2026-10-25/results.json)

The successful request returned HTTP 200, `audio/mpeg`, 392,462 bytes and generation
ID `gen-tts-1792885321-P4wgmo2riNCJDDHoeSIm`. The user approved this excerpt's
delivery. It covers selected passages from DeepSeek script revision
`8fcf2dcc-7523-4e69-b02b-946f05ea0d5e`, not the full narration. No full-length
version 2, measured line timing, production import or replacement video exists yet.
Read-only ffprobe/FFmpeg validation was blocked by a local command hook; no full
decode, pronunciation score or independent listening verdict is claimed.

The default voice has no recorded stable identifier, so matching its exact
identity in future generations is unverified. Audition new takes before accepting
them. Deepgram `deepgram/flux-tts:free` returned HTTP 404, `No endpoints found for
deepgram/flux-tts:free.`; it is not a working fallback in this reference.

OpenRouter lists the model as free and rate limited, with no production latency
or availability guarantees. Fish Audio's own free offer currently runs through
November 30, 2026; recheck OpenRouter availability and pricing before generation.
Sources: [OpenRouter model](https://openrouter.ai/fish-audio/s2.1-pro-free:free),
[speech API](https://openrouter.ai/docs/guides/overview/multimodal/tts),
[Fish Audio free offer](https://fish.audio/blog/s2-1-pro-free-api/).

## Preserved reference: audio version 1 — Supertonic channel clone

The original instructions remain in [BUILD.md](../BUILD.md#version-1-supertonic-reference)
and [VOICE_CLONE.md](../VOICE_CLONE.md). Keep the shared clone, reference recordings,
local ONNX models, pronunciation settings, raw takes and existing metadata intact.

The existing DeepSeek narration is `de9a1322-afd4-4911-93a0-03e942d264e3`,
PCM16 mono 48 kHz, 70 seconds, ten measured line spans. Its recorded per-shot
pitch-preserving tempo factors were 1.10–1.4875. Those are historical settings,
not a recommendation: the user reported reduced pronunciation quality.

To switch back, explicitly select version 1 and follow its preserved generation
instructions. Reusing existing audio requires its matching measured timing.
Regeneration requires new measurement and listening review; do not reuse old
timing or quality approvals for new bytes.

## Project revisions and acceptance

Keep versions 1, 2 and 3 source audio and metadata separately. Never overwrite
an accepted narration or its provenance. Historical audition approvals apply only
to their exact recordings; the VoiceStudio reference update does not approve a
preset or take. Full narration, synchronization and production approval still
apply to each exact project revision. In V3, changed audio/timing
invalidates dependent production gates; follow the
[narration safeguards](../../2d-animation-v3/docs/animation-workflow.md#narration-and-production-safeguards).
