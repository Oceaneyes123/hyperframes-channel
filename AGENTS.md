# HyperFrames Narrated Explainers

New channel compositions follow `DESIGN.md` v2: native 1080×1920 portrait,
safe rectangle x=72..936/y=180..1600, headline ≤6 words, labels 1–4 words,
about 16 visible words, and 2–5 important objects per scene. Use the semantic
client/infrastructure/success/warning/external/storage/security colors and local
colored SVGs throughout the story. Build vertical source → process →
destination zones with grid/flex and keep 24px label spacing and 48px group
spacing. Review the story with sound off: packet travel, decisions, and answer
return must remain legible.

Use the relevant HyperFrames skill before changing a composition.

For narrated multi-scene explainers, lock narration and timing before building frames:

1. Approve storyboard and script.
2. Generate the final per-scene narration WAVs immediately after approval.
3. Derive one canonical scene timing table; each scene maps to its narration WAV.
4. Build frames against those timings and mount each narration WAV at its scene start.
5. Run runtime checks and midpoint snapshots early; mark only visually confirmed intentional overlaps with the narrowest `data-layout-allow-*` attribute.

Keep one audio metadata record per scene; do not concatenate narration WAVs into a continuous track. Inspect only the failing selector or relevant file section; read only command-specific skill references, never dump whole skills into context.

## Token-Efficient Creation Pipeline

Use one source of truth through this flow:

`facts → script → timed storyboard → icon plan → resolve local icons → icon-first sketches → approval → measured TTS → frames + animation → review → render`

Repository v2 portrait defaults override generic skill landscape examples; legacy videos retain v1 until explicitly redesigned.

- Fact-check once at the start and retain a concise source-backed fact sheet; do not re-research during frame work.
- Write the script and scene timing table together: one narration beat per scene.
- Replace estimated durations with measured TTS timings before any frame work starts.
- Derive the storyboard from that table, not from a second prose interpretation.
- Build icon-first sketches with the exact production assets named in `ICON_PLAN.json`; do not approve from text-only or placeholder-icon scene descriptions.
- Give frame workers only their scene packet, design tokens, and timings—not whole skill documents or project files.
- For offline Supertonic runs, `scripts/supertonic_tts.py` writes each `voices[]` entry with `id`, `frame`, `path`, measured WAV `duration_s`, `original_text`, `spoken_text`, and a normalization fingerprint. Treat `audio_meta.json` as the canonical timing source; legacy metadata without provenance must not be presented as normalized.
- Preflight one real local icon `<img src="public/icons/<name>.svg">` in the first sketch before scaling to the full board; this catches broken mask/path assumptions cheaply.
- Close completed frame workers before dispatching the next batch; if the worker pool is full, keep edits isolated by frame and continue locally rather than retrying duplicate dispatches.
- Batch one full check with midpoint snapshots; fix errors and visually confirmed defects only.
- Keep just two review gates: storyboard/sketch approval and final-preview approval.
- Iterate with snapshots or draft previews, then render once after approval.
- Use one screenshot per review milestone; routine UI checks use targeted context without screenshots.
- Poll renders with small output limits and report only progress, errors, and the final summary.
- Keep source frames stable. Before a mechanical repair, stop Studio and regenerate the assembled index once; never regex-edit assembled HTML as a first fix.

## User–Agent Conversation Protocol

Use two decision gates for a narrated explainer:

1. Approve the combined script and timed storyboard; if sketches are requested, review them all in one pass.
2. Approve the final preview before rendering.

Ask follow-up questions only when a choice materially changes the output. Treat “continue,” “next step,” and “do remaining” as authorization to advance to the next defined gate. Batch feedback into one revision pass.

Progress updates are not approval gates. After storyboard/sketch approval, build every scene, integrate audio, validate, and open the final preview autonomously. Pause only at the storyboard/sketch and final-preview gates. “Continue offline” and “do remaining” mean keep working until the next real approval gate, not after a small batch of scenes.

### Default Production Choices

- TTS: Supertonic 3, not HeyGen.
- Narration: native per-scene tracks.
- After assembly, verify every narration WAV has a unique audio id and its scene-local start and duration.
- Use a short time/progression cue (for example, “then,” “next,” or “over time”) when it helps anchor a process, return path, cache, or expiry behavior.
- Captions: off unless requested.
- BGM: off unless requested.
- Final render: requires explicit user approval.
- Revisions: batch into one pass.

Run repository-wide TTS with:

```powershell
py -3 scripts\supertonic_tts.py --project videos\<project>
```

Use `--voice` or `--out` only when the video requires a different default. `--dry-run` prints every original and normalized line without importing the TTS runtime. Optional `pronunciation.json` supports `terms`, per-line `lines`, and `ipv4_style` (`digits` or `grouped`).

### Iconography

For technical/system objects (server, router, database, device, network, lock,
globe, arrow, clock, terminal, firewall), use local SVGs. Prefer approved
colored SVGs whenever they clarify an object; use Font Awesome for compact
support symbols. Record provider, role, meaning, color, path, and attribution
in `ICON_PLAN.json`. Never load a provider remotely at render time.

When an icon is not already local, resolve it before authoring the frame:

```powershell
npm run fontawesome-icon -- --name <icon-name> --project videos\<project>
```

The resolver reuses `public/icons/<icon-name>.svg` when present; otherwise it exports the named Font Awesome Free icon there. If it reports that the icon is unavailable, use a concept-specific local SVG rather than a CDN.

For any approved Icons8 or other colored local SVG, add it to `ICON_PLAN.json`
first, then download or author it locally and preserve the source/attribution URL:

```powershell
npm run icons8-icon -- --name <name> --url <svg-url> --attribution <icons8-page-url> --project videos\<project>
```

For a long icon-led render, avoid CSS `filter` recoloring and repeated identical `<img>` nodes: prefer a pre-colored local SVG or CSS background/mask. This preserves fast capture and avoids duplicate-media lint warnings.

## Continuous Improvement

After each video workflow, review for a concrete way to improve quality, reliability, token use, or elapsed time. When a lesson is durable and supported by the completed work, update this repository-level `AGENTS.md` in the same task so future videos use it.

Record an improvement only when it is specific, reusable, and actionable. Include the preferred default, trigger, or command when useful. Do not add one-off troubleshooting, user-specific details, secrets, or rules that weaken required approval gates. Keep the guidance short; replace an obsolete rule instead of accumulating duplicates.
