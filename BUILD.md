# Audio and frame build

This file owns narration, measured timing, project assembly and frame mechanics.
The production phases and approval gates live in `channel/CHANNEL_RECIPE.md`.

## Narration and timing

After Gate 1, dry-run normalization and review the spoken text:

```powershell
py -3 scripts\supertonic_tts.py --project videos\<project> --dry-run
py -3 scripts\supertonic_tts.py --project videos\<project>
```

Supertonic 3 is the default. Use `pronunciation.json` for specific terms or IP
address style. Keep one WAV and one metadata record per scene; never concatenate
them. `audio_meta.json` is canonical: it records WAV paths, normalized speech,
measured duration, scene start and provenance. Do not present legacy metadata
without a normalization fingerprint as normalized. Do not estimate timings
after WAVs exist.

Write storyboard beats as fractions of the measured scene duration (`t = f * D`).
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
