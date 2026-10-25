# Connected process animation

Implemented increment 1 of [the kinetic improvement plan](KINETIC-IMPROVEMENT-PLAN.md).
Preview at `/connected-process`, linked from `/text-motion`. The portrait Player
starts paused and supports playback and keyboard-accessible frame inspection.
The example is synthetic and does not create a saved production project or call
an external service.

## Author a connected scene

Use `semantic-diagram@1` with approved nodes and edges. All involved parts must be
visible (`opacity:1`) and unmasked (`reveal:1`). To draw an edge, set its part's
`strokeProgress:0` in the start drawing and `strokeProgress:1` in the end drawing.
This field is accepted only on diagram edges and is bounded to 0..1.

Interpreter 3 adds these versioned beats:

| Preset | Target | Parameters | Behavior |
|---|---|---|---|
| `edge-draw@1` | One `object-id.edge-id` | `{}` | Draw the stroke from explicit 0 to 1; preserve labels and disclose the arrow at completion |
| `edge-trace@1` | One fully drawn `object-id.edge-id` | `{}` | Travel along its graph-owned path, then pulse its fixed destination |

Keep the normal beat fields: unique ID, purpose, type, importance, start/end frames,
narration anchor and continuity. Draw takes at least six frames. Trace takes at
least twelve: the signal travels for the first 70% (rounded down to whole frames),
disappears at arrival, and the destination halo appears then settles during the
remaining frames. Use an explicit reading hold after the complete reaction.
Existing measured beat anchors work without a new timing format.

The server supplies these rules to full/scoped motion proposals and tells visual
planning how to author stroke endpoints. Schemas reject paths, selectors, arbitrary
SVG, alternate destinations and unknown parameters. The graph determines the
source/destination. Concurrent edge drawing, hidden endpoints/root, conflicting
traces and reading-hold overlaps fail validation. Root translation/scale remains
supported; diagram part geometry stays fixed so connectors cannot detach.

`strokeProgress` is persistent drawing state. `traceProgress` and `arrivalPulse`
are generated transient action fields restricted to edge and node parts; they are
not accepted as initial drawing fields. Transient effects are hidden before their
interval and after completion. Multiple traces into one destination must not
overlap its reaction ownership.

## Rendering and compatibility

Native normalized SVG stroke dashes draw the connector. The installed GSAP
MotionPath plugin moves a signal in the same local SVG coordinate system as its
path through the existing official Remotion adapter. Cross-container alignment is
deliberately omitted: an isolated spike demonstrated drift inside nested viewBoxes.
No timer, random value, plain-object tween or callback supplies frame state.

Historical parts without `strokeProgress` retain their original path/marker and
horizontal-mask rendering. No asset, accepted project or saved approval is rewritten.
Changed renderer/schema files are already covered by the production engine hash;
existing production bindings require normal revalidation. No dependency or database
migration was added.

## Verification

```powershell
node --test tests/connected-process.test.ts tests/components.test.ts tests/graphics-overhaul.test.ts
npm run check
npm run build
node scripts/verify-motion-engine.mjs --connected
```

The existing engine proof now accepts `--connected`. It checks forward, branching
and feedback routes, including a moving/scaling diagram root. It renders 540
1080×1920 frames at 30fps, compares 28 fresh stills against sequential references,
exports a silent synthetic H.264 sample and fully decodes it with FFmpeg. Every
run has a new `.data/connected-process-proof-*` directory and engine-hash-bound
verification record. The saved gallery example also has a fixed storyboard hash;
its source-correspondence test catches accidental edits without rebinding.

The mounted browser check in `.planning/2026-10-25-connected-process/` seeks
45, 60, 179, 0, 45 and 115 in one Player; verifies identical SVG state on return,
signal distance from the path under one CSS pixel, destination reaction, and no
transient effects before start or during the final hold. Desktop/mobile screenshots
and representative full-resolution route frames were inspected.

These are technical checks, not independent human aesthetic or audible approval.
No real narration was generated. Fonts, automatic type reflow, financial counters,
parallax and morph pairs remain later increments.
