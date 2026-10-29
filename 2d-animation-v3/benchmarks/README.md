# Isolated renderer benchmark

These packages implement only the user-authorized Phase 0 experiment. They do not
load the studio's .env, database or videos and are excluded from its build/lint.
The original 12-second, 360-frame plan is in ../docs/phase0/renderer-benchmark.json.
Both implementations use native engine primitives and match timing, geometry,
transformation, intentional cut, card match cut and holds. Shot 3's color variant
is a deliberate targeted edit; it is not an alternative whole-film design.

## Remotion

Run from benchmarks/remotion:

```powershell
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:3103. Use the explicit frame/seek and nonsequential-test
controls. The package pins React 19.3.1, Remotion/player/renderer/bundler 4.0.537
and Vite 8.3.5. Render exports with an existing local Chrome executable:

```powershell
$env:BENCHMARK_CHROME='C:\path\to\chrome.exe'
npm run render
```

The script records one initial and three warm native exports, followed by ten
base and ten targeted-variant stills. Exports refuse to overwrite existing files.
Preserve the old output before another full run; do not remove evidence silently.
`node render.mjs --stills-only` recaptures benchmark stills deliberately while
preserving the original export metrics; it overwrites only those still paths.

## Motion Canvas

Run from benchmarks/motion-canvas:

```powershell
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:3104/preview.html. The public Player/Stage APIs drive the
preview; Renderer and the native FFmpeg exporter perform export. Its package
uses CJS Vite config treatment, compatible Vite 5.4.21 and Motion Canvas 3.17.2.
Click Test nonsequential seek, Export four runs, then Capture base and variant
frames, waiting for each to finish before the next. Preserve output before
repeating because the native exporter reuses the benchmark run names.

`output/export-observation.txt` and `output/seek-observation.txt` in the recorded
run were captured from full visible browser accessibility state, not hidden app
state. If reproducing manually, retain the visible JSON results with those names
(or update the verifier inputs deliberately). A diff-only accessibility snapshot
is insufficient evidence. The metric parser rejects missing/incomplete records.

## Verification

From the v3 root, with ffmpeg/ffprobe on PATH and Pillow installed:

```powershell
python benchmarks/verify.py
python benchmarks/inspect.py
```

The verifier reads existing media, fully decodes through the null muxer, asserts
metadata, repeated hashes, native still edit isolation and seek records, and
writes scoped reports. It never deletes source or media. The inspection script
extracts all 39 transition-window frames and creates diagnostic contact sheets.
It expects a fresh boundary/ directory when generating those sheets again.
Update renderer-environment.json from actual observed hardware/runtime metadata
when recording a new run; do not attribute this machine's snapshot to another host.

Outputs, generated previews and node_modules are ignored. Package locks and source
remain reviewable. Source hashes and results are recorded under docs/phase0.
Native export paths, encoder settings and browser versions differ; timings are
observations, not a normalized cross-engine performance or memory ranking.

## Known limits

The selected Remotion package has a clean isolated audit; Motion Canvas retains
nine upstream/tooling findings. Both servers bind loopback and this test uses
synthetic content only. Remotion's custom license permits the inspected evaluation
scope; commercial eligibility is a separate requirement. Preserve all installed
notices. No studio rendering integration, audio, model calls or publication exists.
