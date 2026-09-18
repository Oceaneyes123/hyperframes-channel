# HyperFrames Narrated Explainers

New channel compositions follow `DESIGN.md` v2: native 1080×1920 portrait,
safe rectangle x=72..936/y=180..1600, headline ≤6 words, labels 1–4 words,
about 16 visible words, and 2–5 important objects per scene. Use the semantic
client/infrastructure/success/warning/external/storage/security colors and local
colored SVGs throughout the story. Build vertical source → process →
destination zones with grid/flex and keep 24px label spacing and 48px group
spacing. Review the story with sound off: packet travel, decisions, and answer
return must remain legible.

### Visual quality and screen use

- Use the full portrait canvas as the stage. Backgrounds and nonessential art
  may bleed to the edges; keep essential objects, values and actions inside the
  safe rectangle. Maximize the diagram within that rectangle before adding a title.
- No enclosing bordered card by default. A boundary is allowed only when it
  teaches a real subnet, trust zone or other grouping; it must not become a smaller
  stage with another layer of padding. The reference video's outer box is not a
  layout template to copy.
- Primary devices use large local colored assets, normally 280–360px where the
  scene allows. Judge the visible artwork, not a padded wrapper. Do not replace
  colored devices with small black Font Awesome glyphs in white tiles. Inline
  support glyphs with semantic color; never use emoji for a teaching object.
- Every storyboard action must exist in the frame: connected route, movement
  to the actual destination, and visible consequence. A moving label, entrance,
  checkmark or decorative tunnel alone does not prove the process.
- Keep persistent device coordinates and identity across cuts. A response retraces
  the established route; do not swap endpoints to reverse direction.
- Review opening/action/result states for EVERY scene and each adjacent cut in
  one batch. Record actual inspected times and pass/fix notes in the existing
  storyboard. A sparse global sample, passing lint or motion report with zero
  assertions cannot substitute for this review. Fix missing planned actions before
  opening the final preview; retain the same two approval gates.

Use the relevant HyperFrames skill before changing a composition.

Video length and scene count have no fixed limit. Cover all required information
at a clear, natural pace; map required points to storyboard scenes before approval.
Extend runtime instead of omitting details, rushing narration, or forcing a series.
The reference video's duration is an example, not a cap. Flag platform duration
compatibility separately without silently shortening the requested content.

For a new narrated short, read `channel/EXPLAINER_REFERENCE.md` before planning.
It maps the approved `videos/local-or-router-short/` output to concrete scene
examples, commands and acceptance checks. Use it with any model, including
GPT-5.6-luna. Adapt its causal structure and visual contract; never copy prior
approval records, narration or generated outputs into a new project.

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
- Batch one full check with opening/action/result samples; compare required objects and connections against the approved sketch, then play sound-off and narrated previews. Fix errors and visually confirmed defects only.
- Plan local-time causal beats in the existing storyboard and retime them after TTS. Flag unexplained static holds over 3s; decorative pulses do not satisfy the motion requirement. Preserve object identity across adjacent scenes.
- Keep just two review gates: storyboard/sketch approval and final-preview approval.
- Iterate with snapshots or draft previews, then render once after approval.
- Share one contact sheet per review milestone; capture enough internal samples
  to inspect every scene's opening/action/result. Routine UI checks use targeted context.
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

Icons8 serves SVG only on paid plans: the `format=svg` endpoint answers
`PAID_FORMAT` and icons8.com is Cloudflare-protected for scraping. On the free
tier fetch the colored PNG render instead — `curl -o public/icons8/<name>.png
https://img.icons8.com/color/480/<slug>.png` — keep the `provider: "icons8"` and
`source` record plus a `<name>.source.txt` attribution file, and record the real
file path in `ICON_PLAN.json`. When Icons8 has no device-style slug for the
object (for example a network switch — `switch` is a light switch and `router`
is a routing-arrows glyph; `wifi-router` is the actual router device), author
that one icon as a custom SVG in the Icons8 flat palette (greys `#78909C`
`#455A64` `#37474F`, accents `#2196F3` `#64DD17`).

Font Awesome glyphs stay `public/icons/<name>.svg` on disk, but inside a frame
inline their path data (`<svg viewBox="…" fill="currentColor"><path d="…"/></svg>`,
or an in-document `<symbol>` sprite) rather than `<img>` or a CSS `mask`: an
`<img>` glyph cannot inherit the semantic color, and a `mask-image` that points
at a local file renders blank in the sketch/preview environment.

For a long icon-led render, avoid CSS `filter` recoloring and repeated identical `<img>` nodes: prefer a pre-colored local SVG, SVG `<image>`, or CSS background. Avoid file-based CSS masks unless the exact path has been visually verified in both sketch and preview.

## Continuous Improvement

After each video workflow, review for a concrete way to improve quality, reliability, token use, or elapsed time. When a lesson is durable and supported by the completed work, update this repository-level `AGENTS.md` in the same task so future videos use it.

Record an improvement only when it is specific, reusable, and actionable. Include the preferred default, trigger, or command when useful. Do not add one-off troubleshooting, user-specific details, secrets, or rules that weaken required approval gates. Keep the guidance short; replace an obsolete rule instead of accumulating duplicates.
