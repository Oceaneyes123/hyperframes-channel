# Renderer decision — Remotion selected

Decision date: 2026-10-21. Select **Remotion 4.0.537** for the first v3 studio
implementation. Motion Canvas 3.17.2 remains an alternative for diagram-heavy work.
This selects an implementation direction; it does not integrate generation into
the studio, approve a production video, or establish creative superiority.

## Evidence and rationale

Both isolated packages built and ran on Node 24.6.0. Both completed four silent
12-second exports and passed full decode, exact 1080x1920 / 30fps / 360-frame
metadata, same-engine repeated MP4 hashes, native nonsequential seeks, and a
shot-3-only edit check across ten sample frames.

Remotion's React Player ran with React 19.3.1 and preserved seek behavior after
upgrading its preview tooling to Vite 8.3.5. Its final isolated npm audit reports
zero vulnerabilities. This is a direct React integration path for the existing
Next.js studio. The future Next client-component integration still needs its own
acceptance check; the isolated Player test is not a claim that it already exists.

Motion Canvas also passed technical checks and produced the observed exports
faster. Its 3.17.2 Vite plugin peers to Vite 4/5, required CJS package treatment,
and the isolated audit retains nine findings (three moderate, six high), including
upstream paths without a supported fix. Its Player/Stage/Renderer harness worked,
but is more integration code than the React Player. These constraints favor
Remotion for this studio, without disqualifying Motion Canvas for every project.

No runtime, asset, voice model or source was copied from v2. Existing OneTake
remains untouched. Neither benchmark is a new studio generation feature.

## Measured results

| Check | Remotion | Motion Canvas |
| --- | --- | --- |
| Typecheck/build | Pass | Pass after isolated CJS config correction |
| Four native silent exports | Pass | Pass |
| Exact frames/dimensions/fps/duration/no audio | 360 / 1080x1920 / 30 / 12s / none | Same |
| Full decode, four runs | Pass | Pass |
| Same-engine repeated MP4 hashes | Identical across all four runs | Identical across all four runs |
| Nonsequential Player seeks | Pass; repeated React SVG DOM hash | Pass; repeated Canvas PNG-data hash |
| Shot-3-only edit | Two in-shot samples changed; eight outside samples unchanged | Same |
| Native boundary samples | All 39 inspected; no blank sample | Same |
| First export (labelled cold) | 37.127 s | 6.773 s |
| Median of three warm exports | 35.152 s | 6.292 s |
| Final isolated dependency audit | 0 | 9 |

These timings measure different native pipelines, not a controlled speed ranking.
Remotion used one Chromium render worker and explicit H.264 CRF18; Motion Canvas
used a browser Canvas renderer and its native FFmpeg plugin defaults. Remotion's
21.558-second initial bundle is recorded separately. The first exports exclude
installation/setup and follow initialization/scene discovery; they are not fresh
machine cold-start benchmarks. No codec-normalized or equal-browser comparison
was performed. No time or memory number was invented for missing coverage.

Remotion's recorded RSS samples cover the Node parent only, excluding browser and
encoder children; Motion Canvas browser/encoder memory attribution was unavailable.
There is no total-memory winner. Actual hardware, local Chrome version and the
unavailable IAB browser version are explicit in the environment record.

## Visual observation boundaries

Both native previews advanced at 1x from the waveform to the final review state,
with sampled browser screenshots. Dense decoded-frame sheets cover every frame
of 84–96, 174–186 and 264–276. At 89/90 the transformed transcript persists;
179/180 is an intentional composition cut; 269/270 preserves the aligned card
while its content changes. Ten native stills also cover the waveform start,
transformation start/end, holds and final state.

This is an implementation-author technical and bounded visual review, not an
independent human preference study or a claim that every moving frame was watched
continuously. No audio, narration synchronization, real project scale, income
claims, retention, publishing, or production approval was tested.

## Provenance and reproducibility

- [Export verification](renderer-export-verification.json): eight files, hashes,
  frame metadata and full-decode results.
- [Measured timings/audits](renderer-metrics.json) and
  [actual environment](renderer-environment.json).
- [Installed release/license records](installed-renderer-provenance.json): actual
  installed packages, preserved license hashes and package versions.
- [Frozen benchmark source](renderer-benchmark-sources.json): executable inputs,
  lockfiles and exact source hashes for this run.
- [Runnable benchmark instructions](../../benchmarks/README.md).
- [Original source/license research](source-provenance.json) and
  [matched experiment specification](renderer-benchmark.json).

The installed Remotion LICENSE.md includes evaluation eligibility. Future
commercial/entity use still needs its own eligibility decision under the actual
release terms; it is not presumed MIT. Motion Canvas's inspected core release is
MIT. Distributed font/media and encoder rights remain separate from engine source
licensing. No license purchase or public deployment is authorized by this decision.

Architecture direction and isolated experiment were explicitly approved by the
user on 2026-10-21; [approval scope](approvals.json) records the exact answers.
Phase 0 exit criteria are now met for the agreed foundation scope. The later
scripting efficacy trial and all production features remain future work.
