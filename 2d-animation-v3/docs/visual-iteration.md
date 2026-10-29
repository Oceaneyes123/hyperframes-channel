# Visual iteration and creative direction

The motion workspace's **Review and improve shot** action runs a bounded advisory
loop on the selected current motion shot. It preserves the accepted storyboard,
narration, actors, shot duration, incoming transition and every other shot. It
does not accept motion, approve normal-speed review, grant production gates or
export a video.

The loop renders five exact global frames spanning the selected shot, plus the
previous shot's final frame and the next shot's first frame when available.
Frames use the production Remotion composition at 360 × 640. The critic receives
ordered images, neighboring shot plans, narration, available measured timing,
motion diagnostics, style guidance and selected examples. Sparse stills cannot
establish smoothness or audible synchronization; normal-speed human review remains
necessary. Rhythm targets are experimental, not measurements of reference clips.

At most two scoped revisions and three critiques run in one session, with a
ten-minute total abort signal, 90-second critique calls and existing 150-second
generation limits. There are no automatic transport retries. A clean sampled
review, repeated suggestions, unchanged motion, an exhausted budget or a finding
requiring storyboard/neighbor changes stops the loop. Cancellation, invalid
responses, changed dependencies or protected timing changes fail closed. Earlier
saved candidates remain available; they are never silently accepted or deleted.

The latest candidate is offered for review; it is not asserted to be the best.
Partial failures can leave pending candidates, so inspect history before retrying.
The lock prevents duplicate loops within one server process. Separate CLI/server
processes may both start critiques; existing proposal transactions and latest-ID
checks prevent either from applying a revision against a changed base.

## CLI

Run commands from `2d-animation-v3`:

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

Shot indices are zero-based. `maxRounds: 0` performs critique only. Direction is
limited to 500 characters for this action. Session configuration, per-round frame
hashes and critiques, candidate links and the result/failure receipt are saved under
`.data/motion-iterations/<session-id>/` (or the configured data directory).
Each motion revision remains an immutable ordinary proposal in the existing store.
Reports include the actual critic model, motion model, engine hash and guidance
fingerprints. Studio displays remaining findings from a completed loop.

## Model settings

Configure optional server environment variables and restart Studio:

| Role | Variable | Fallback |
| --- | --- | --- |
| Concepts/storyboards | `CLIPROXYAPI_DIRECTOR_MODEL` | Visual model, then base model |
| Writing/refinement/selected-text revision | `CLIPROXYAPI_WRITER_MODEL` | Base model |
| Motion generation/revision | `CLIPROXYAPI_MOTION_MODEL` | Base model |
| Editorial/graphic/motion critique | `CLIPROXYAPI_CRITIC_MODEL` | Visual model, then base model |

Visual and base variables remain `CLIPROXYAPI_VISUAL_MODEL` and
`CLIPROXYAPI_MODEL`. No model capability or relative quality is inferred from its
name. Image-based calls require an image-capable model supported by the gateway;
model discovery alone cannot establish that capability. Gateway preflight checks
every distinct resolved model. Existing artifact model histories remain unchanged.
New writing artifacts record each writer/refiner/editor call's actual role/model;
visual and motion jobs retain their existing model records.

## Style and accepted examples

Concept/storyboard generation, motion generation and image critique now load
`docs/motion-style-bible.md` and the validated
`docs/motion-principles-profile.json`. Prompt fingerprints identify the exact
guidance; review reports preserve those fingerprints. Missing or invalid guidance
stops generation rather than silently dropping it.

No existing scene is automatically designated a quality reference. Explicitly
select an accepted current motion artifact and describe the craft choice to learn:

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

Registration renders start/middle/end production frames and saves a manifest under
`.data/creative-examples/<id>/`. Set `V3_CREATIVE_EXAMPLE_IDS` to up to three returned
UUIDs, separated by commas. Selected images and reasons enter generation and critique
requests. The loader verifies the original artifact and acceptance receipt plus
frame hashes. Historical accepted source may remain a reference after project
inputs change; replacing its acceptance receipt invalidates the selection. Example
content is a craft reference, never evidence for a new video's factual claims.
Registration does not grant any new acceptance or production approval.

No examples or role overrides are enabled merely by installing this change.

## Verification, October 29, 2026

`npm run check` passed lint/typecheck and 206 tests, including real production-frame
renders, role routing, preserved acceptance/scope, timing guards, cancellation,
stale inputs, repeated findings and revision limits. Two existing planning-script
lint warnings remain. `npm run build -- --webpack` passed. Default `npm run build`
still fails at the documented Turbopack CSS-worker connection error. No live model
calls or human quality comparisons were run for this implementation.
