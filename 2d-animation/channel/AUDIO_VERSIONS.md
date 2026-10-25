# Channel narration versions

## Current default: audio version 2 — Fish Audio via OpenRouter

On October 25, 2026, the user preferred the Fish Audio audition and requested
that it become the default for future narration. Preserve version 1 below for
switching back. This changes the production reference, not the application's
runtime configuration or any existing project's accepted audio.

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

Keep version 1 and version 2 source audio and metadata separately. Never overwrite
an accepted narration or its provenance. Version 2 audition approval establishes
the preferred provider/delivery only. Full narration, synchronization and production
approval still apply to each exact project revision. In V3, changed audio/timing
invalidates dependent production gates; follow the
[narration safeguards](../../2d-animation-v3/docs/animation-workflow.md#narration-and-production-safeguards).
