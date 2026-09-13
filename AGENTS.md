# HyperFrames Narrated Explainers

Use the relevant HyperFrames skill before changing a composition.

For narrated multi-scene explainers, lock narration and timing before building frames:

1. Approve storyboard and script.
2. Generate the final continuous narration track.
3. Derive one canonical scene timing table; each scene maps to its narration beat.
4. Build frames against those timings and mount narration as one audio track from `0`.
5. Run runtime checks and midpoint snapshots early; mark only visually confirmed intentional overlaps with the narrowest `data-layout-allow-*` attribute.

Do not create per-line audio metadata incompatible with the assembler's expected contract. Inspect only the failing selector or relevant file section; avoid broad HTML or skill dumps.

## Token-Efficient Creation Pipeline

Use one source of truth through this flow:

`facts → script → timing table → storyboard → frames → review → render`

- Fact-check once at the start and retain a concise source-backed fact sheet; do not re-research during frame work.
- Write the script and scene timing table together: one narration beat per scene.
- Derive the storyboard from that table, not from a second prose interpretation.
- For icon-led briefs, include representative icon-first sketches in the storyboard review; do not approve from text-only scene descriptions.
- Give frame workers only their scene packet, design tokens, and timings—not whole skill documents or project files.
- Batch one full check with midpoint snapshots; fix errors and visually confirmed defects only.
- Keep just two review gates: storyboard/sketch approval and final-preview approval.
- Iterate with snapshots or draft previews, then render once after approval.

## User–Agent Conversation Protocol

Use three decision gates for a narrated explainer:

1. Confirm one compact locked brief and fact sheet.
2. Approve the combined script and timed storyboard; if sketches are requested, review them all in one pass.
3. Approve the final preview before rendering.

Ask follow-up questions only when a choice materially changes the output. Treat “continue,” “next step,” and “do remaining” as authorization to advance to the next defined gate. Batch feedback into one revision pass.

Progress updates are not approval gates. After storyboard/sketch approval, build every scene, integrate audio, validate, and open the final preview autonomously. Pause only at the brief, storyboard/sketch, and final-preview gates. “Continue offline” and “do remaining” mean keep working until the next real approval gate, not after a small batch of scenes.

### Default Production Choices

- TTS: Supertonic 3, not HeyGen.
- Narration: one continuous track.
- After assembly, verify the narration is mounted once from 0; do not let per-scene WAV metadata become multiple render audio tracks.
- Use a short time/progression cue (for example, “then,” “next,” or “over time”) when it helps anchor a process, return path, cache, or expiry behavior.
- Captions: off unless requested.
- BGM: off unless requested.
- Final render: requires explicit user approval.
- Revisions: batch into one pass.

Run repository-wide TTS with:

```powershell
py -3 scripts\supertonic_tts.py --project videos\<project>
```

Use `--voice`, `--pause`, or `--out` only when the video requires a different default. `--dry-run` verifies script parsing without generating audio.

### Iconography

For upcoming videos, prefer Font Awesome icons when an icon clarifies the concept (for example browser, server, lock, DNS, request, and resource states). Use a locally installed or vendored Font Awesome asset; never load icons from a remote CDN at render time.

When an icon is not already local, resolve it before authoring the frame:

```powershell
npm run fontawesome-icon -- --name <icon-name> --project videos\<project>
```

The resolver reuses `public/icons/<icon-name>.svg` when present; otherwise it exports the named Font Awesome Free icon there. If it reports that the icon is unavailable, use a concept-specific local SVG rather than a CDN.

For a long icon-led render, avoid CSS `filter` recoloring and repeated identical `<img>` nodes: prefer a pre-colored local SVG or CSS background/mask. This preserves fast capture and avoids duplicate-media lint warnings.

## Continuous Improvement

After each video workflow, review for a concrete way to improve quality, reliability, token use, or elapsed time. When a lesson is durable and supported by the completed work, update this repository-level `AGENTS.md` in the same task so future videos use it.

Record an improvement only when it is specific, reusable, and actionable. Include the preferred default, trigger, or command when useful. Do not add one-off troubleshooting, user-specific details, secrets, or rules that weaken required approval gates. Keep the guidance short; replace an obsolete rule instead of accumulating duplicates.
