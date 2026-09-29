# Audio and frame build

This file owns narration, measured timing, project assembly and frame mechanics.
The production phases and approval gates live in `channel/CHANNEL_RECIPE.md`.

## Narration and timing

After Gate 1, dry-run normalization and review the spoken text:

```powershell
py -3 scripts\supertonic_tts.py --project videos\<project> --dry-run
py -3 scripts\supertonic_tts.py --project videos\<project>
```

All new HyperFrames narration uses the shared cloned voice at
`.tools/supertonic3-model/voice_styles/channel-voice.json`, already generated
from `reference/voice.wav`. Reuse it for new videos; normal narration needs
neither WSL nor retraining. Follow `VOICE_CLONE.md` only when creating or
correcting the clone. It owns setup, reference caches and checkpoint validation.
Narration uses the local ONNX files and records `voice_style_sha256` in each
scene's metadata. Narration generation stops if the shared clone is
missing; it never falls back to a preset voice. Use `pronunciation.json`
for specific terms or IP address style. Keep one WAV and one metadata record per
scene; never concatenate them.
`audio_meta.json` is canonical: it records WAV paths, normalized speech,
measured duration, scene start and provenance. Do not present legacy metadata
without a normalization fingerprint as normalized. Do not estimate timings
after WAVs exist.

Use optional `motion_beats.json` for important spoken-word actions. Import
timestamps from actual-WAV alignment or manual listening and record the WAV
SHA-256 and provenance. Do not estimate word timing when measured cues exist.
Fractions of measured D remain suitable for broad build/hold windows in legacy
scenes; named cue seconds are canonical for word-synchronized motion.
Keep each scene's narration on its own uniquely identified audio element at the
matching start and duration. Inspect the assembled audio timeline after sync.

## Assets and frames

Resolve local assets before sketching and record them in `ICON_PLAN.json`.
Use repository helpers:

```powershell
npm run fontawesome-icon -- --name <icon> --project videos\<project>
npm run icons8-icon -- --name <name> --url <svg-url> --attribution <page-url> --project videos\<project>
```

Never load a render-time CDN asset. In frames, reference files from the project
root (`public/icons/...`), not with `../`. Inline Font Awesome path data when a
glyph needs semantic color; a file `<img>` cannot inherit it. Prefer a
pre-colored SVG or CSS background over filters, repeated identical image nodes
or unverified CSS masks.

Each frame is sized 1080×1920 and has one paused, seekable timeline registered
under its composition ID. Keep selectors local and confirm every timeline
target exists in its frame. A later scene renders inherited state at local time
zero; only hide the value in the scene that creates it. Do not tween `display`
or `visibility`. Never scale an SVG group whose baked transform already
contains a scale. Keep packet markers clear of device labels.

For more than eight scenes, prefer one generator driven by `audio_meta.json` over
hand-editing each frame. Edit the source, then regenerate assembled output;
never patch assembled HTML first. Stop Studio before a mechanical rebuild.

## Assembly

Stage the local GSAP runtime, then assemble from the repository root:

```powershell
npm run assemble -- --project videos\<project>
```

The assembler reads measured metadata. If frame files are renamed, refresh the
metadata first. See `VERIFY.md` for structural checks and preview review.

## Opt-in shared motion

Set `motion_version` to `1.0.0` in a design-v2 `channel.json`, then run
`python scripts/sync_channel_assets.py --project videos/<project>` before
assembly. This stages motion.js, motion.css and local fonts. Do not use `--all`
to migrate unrelated videos. The assembler loads the runtime once; frames
import motion.css after styles.css. See `channel/MOTION_API.md` for the API.
Attach pure drawing to one paused GSAP timeline with `ChannelMotion.mount`;
the property setter works under callback-suppressed seeking.

The HTTPS generator's `--motion-pilot` rebuilds only scenes 2, 4 and 7. Normal
regeneration respects the opt-in too. Edit motion_pilot.py and regenerate;
do not patch assembled HTML. Keep narration audio unchanged.
