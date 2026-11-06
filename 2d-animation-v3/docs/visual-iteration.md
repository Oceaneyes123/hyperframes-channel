# Visual iteration and creative direction

Apply the [quality bar](quality-bar.md): tactile environments, scene-specific decorated text, decisive object-led change and receiving response. Color changes, repeated header bands or small nudges alone do not resolve quality feedback. Follow sampled frames with normal-speed moving review.

**Review and improve shot** runs a bounded advisory loop on the selected current motion shot. Preserve accepted storyboard, narration, actors, duration, incoming transition and every other shot. The loop cannot accept motion/review, grant gates or export.

## Loop scope and limits

- Render five exact global frames spanning the shot plus previous-final/next-first frames when available, using the production composition at 360×640.
- Critic receives ordered images, neighboring plans, narration, available measured timing, diagnostics, style and selected examples. Stills cannot prove smoothness/audible sync. Rhythm targets are experimental, not measured reference clips.
- At most two scoped revisions/three critiques; ten-minute total abort, 90-second critique calls, existing 150-second generation limit; no transport retries.
- Stop on clean sampled review, repeated suggestions, unchanged motion, exhausted budget or findings requiring storyboard/neighbor changes. Cancellation, invalid output, changed dependencies or protected-timing changes fail closed. Preserve earlier candidates without silent acceptance/deletion.
- Offer the latest candidate without claiming it is best. Inspect history after partial failures before retrying. Loop lock covers one server process; other CLI/server processes may critique concurrently, but proposal transactions/latest-ID checks prevent applying against changed bases.

## CLI

Run from V3:

```powershell
npm run workflow -- improve-motion <project-id> request.json
```

```json
{
  "artifactId": "<current-motion-uuid>",
  "shotIndex": 0,
  "maxRounds": 2,
  "instruction": "Keep the mechanism clear and the result readable."
}
```

Indices are zero-based; `maxRounds: 0` critiques only. Direction limit: 500 characters. Config, round frame hashes/critiques, candidate links and outcome/failure receipts live in configured `.data/motion-iterations/<session-id>/`. Revisions remain ordinary immutable proposals. Reports bind actual critic/motion models, engine hash and guidance fingerprints. Studio shows remaining findings after completion.

## Model settings

Set optional server variables and restart Studio:

| Role | Variable | Fallback |
| --- | --- | --- |
| Concepts/storyboards | `CLIPROXYAPI_DIRECTOR_MODEL` | Visual, then base |
| Writing/refinement/selected text | `CLIPROXYAPI_WRITER_MODEL` | Base |
| Motion generation/revision | `CLIPROXYAPI_MOTION_MODEL` | Base |
| Editorial/graphic/motion critique | `CLIPROXYAPI_CRITIC_MODEL` | Visual, then base |

Visual/base remain `CLIPROXYAPI_VISUAL_MODEL`/`CLIPROXYAPI_MODEL`. Names imply neither capability nor quality. Image calls need gateway-supported image capability; discovery alone cannot prove it. Gateway preflight checks every distinct resolved model. Preserve historical model records; new writing records each writer/refiner/editor role/model, while visual/motion jobs retain existing model records.

## Style and accepted examples

Concepts/storyboards, motion and image critique load `docs/motion-style-bible.md` plus validated `docs/motion-principles-profile.json`. Requests/reviews fingerprint exact guidance; missing/invalid files stop generation rather than dropping guidance.

No scene becomes a quality example automatically. Explicitly select accepted current motion and identify the craft choice:

```powershell
npm run workflow -- register-example <project-id> example-request.json
```

```json
{
  "artifactId": "<accepted-motion-uuid>",
  "shotIndex": 0,
  "reason": "The information token remains visible through the handoff."
}
```

Registration renders production start/middle/end frames and a `.data/creative-examples/<id>/` manifest. Set `V3_CREATIVE_EXAMPLE_IDS` to at most three returned comma-separated UUIDs. Selected images/reasons enter generation/critique; loader checks original artifact, acceptance receipt and frame hashes.

Historical accepted source may remain a reference after project inputs change; replacing its acceptance receipt invalidates selection. Examples teach craft, never substantiate another video's facts. Registration grants no acceptance/gates. Installation alone enables no examples/role overrides.

## Verification, October 29, 2026

Dated evidence: check passed lint/typecheck and 206 tests, including real production-frame renders, routing, acceptance/scope preservation, timing guards, cancellation, staleness, repeated findings and limits. Two planning-script lint warnings remained. Webpack build passed; default build failed with documented Turbopack CSS-worker connection error. No live model/human quality comparison ran.
