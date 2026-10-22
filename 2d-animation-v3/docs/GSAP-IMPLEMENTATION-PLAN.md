# GSAP implementation roadmap

Status: **G1–G4, transition improvements and G5 software foundations verified**.
Actual human production approval and real export acceptance remain pending.
Original planning baseline: `3b2c71d`; current implementation continues from `16b205f`.
Primary integration reference:
[GSAP-INTEGRATION.md](GSAP-INTEGRATION.md). Product requirements remain
[PLAN.md](PLAN.md) and [PLAN2.md](PLAN2.md); persistence and approval authority
remain in [architecture.md](architecture.md).

## Outcome and scope

Extend the existing accepted-script → selected-concept → accepted-storyboard
workflow with versioned motion proposals, deterministic preview and explicit
motion acceptance. Remotion owns composition time, shots and transitions. GSAP
provides selected DOM/SVG choreography through the official adapter. Both preview
and future export use the same composition and immutable inputs.

The original document authorized no execution. The user subsequently authorized
implementation, including measured narration, production safeguards and synthetic
export tests. Actual human gates and real production render authorization remain
separate. See [current animation workflow](animation-workflow.md).

The user subsequently requested step-by-step implementation. Execution evidence
is tracked in task_plan.md, findings.md and progress.md; the
[G1 receipt](gsap/README.md) records the completed adapter proof. Later phases
remain conditional on their stated exits and actual human production approval.

## Verified starting point

| Area | Current evidence | Integration consequence |
| --- | --- | --- |
| Runtime | Next/React studio; no application Remotion or GSAP dependencies | Add client Player only after isolated proof |
| Benchmark | Remotion 4.0.537, 12s, 1080×1920, 30fps; frozen source hashes | Preserve original benchmark and its evidence |
| Storyboard | Schema v1, static SVG shapes, estimated seconds, narration references, incoming transition labels | Motion needs explicit IDs, object correspondence and frame timing |
| Persistence | Schema 5; immutable visual JSON/hash indexes, concept choices and exact storyboard receipts | Extend the established transaction and currentness rules |
| Review | Scoped shot changes, history and explicit artifact acceptance | Add proposed motion comparison; never auto-accept model output |

Read-only npm metadata confirms `@remotion/gsap@4.0.537` depends on
`remotion@4.0.537`, with GSAP peer range `>=3.12.0 <4`. Candidate GSAP pin:
`3.15.0`. Recheck compatibility and lock integrity when implementing; availability
is not a successful runtime test. Keep every installed Remotion package on exactly
`4.0.537`, including Player, transitions, bundler and renderer where used.
The [official adapter documentation](https://www.remotion.dev/docs/gsap)
requires version alignment and describes a paused timeline driven by frames.

## Architecture decisions

| Responsibility | Owner | Rule |
| --- | --- | --- |
| Global frames, shot placement, cuts, overlap intervals | Remotion composition | One canonical integer-frame schedule |
| DOM/SVG transforms, opacity, bounded stagger and easing | Official GSAP hook | Remotion supplies time; no independent ticker-driven animation |
| Numeric values, chart paths and React-rendered data | Frame-derived React functions | Do not tween plain objects and expect React to re-render |
| Camera | One trusted parent transform per shot or continuity group | Do not have GSAP and React write the same property |
| Motion instructions | Strict versioned JSON | No model JS, markup, selectors, imports or arbitrary GSAP options |
| Currentness and decisions | Server store | Exact upstream IDs/hashes; explicit acceptance separate from gates |

Use `useGsapTimeline()` with a scoped element ref and immutable revision
dependencies. Builders are synchronous, target elements only and rebuild/revert
when inputs change. Disallow callbacks, autonomous playback, unseeded randomness,
plugins and detached animations. Keep timelines small per shot/continuity group.
The hook recomputes from its beginning for each frame, so large timelines need
measurement. These constraints come from the
[official hook API](https://www.remotion.dev/docs/gsap/use-gsap-timeline).
No custom synchronization adapter is planned.

## Motion contract and time model

Introduce `workflow/motion.ts` with an independent `schemaVersion: 1`; do not
retrofit motion properties into existing immutable storyboard files.

- **Manifest:** project/motion revision IDs, parent revision, exact script and
  accepted storyboard IDs/hashes, concept-selection identity, frame dimensions,
  fps, engine/interpreter version and referenced asset hashes (when assets exist).
- **Shot:** stable ID mapped explicitly to source storyboard ID and shot index,
  source-shot content hash, narration line numbers, integer durationFrames,
  object definitions, action list, camera and incoming boundary definition.
- **Object:** server-assigned stable ID, allow-listed primitive, explicit initial
  state and reviewed correspondence with the storyboard's start/end shapes.
  Existing arrays have no identities: never infer cross-shot object identity
  solely from array positions or similar appearance. Missing correspondence is
  an inspectable authoring problem, not permission to invent a morph.
- **Action:** behavior enum, known target IDs, startFrame/durationFrames, bounded
  from/to values, easing enum and optional bounded stagger. Initial vocabulary:
  move/resize, fade/reveal, scale/rotate, stagger, camera transform and hold.
  Type conversion, path morphing and arbitrary plugins are outside the first slice.
- **Validation:** finite bounded numbers, unique IDs, known references, in-shot
  intervals, camera bounds and exclusive property ownership. Reject conflicting
  overlapping writes to the same target/property, unsupported behaviors, arbitrary
  expressions/functions and excessive objects/actions. Start with at most 16
  objects and 64 actions per shot, at most 40 shots; tune only from measurements.

Default synthetic composition matches the benchmark: 1080×1920 at 30fps. Convert
estimated seconds once to integer frames (`max(1, round(seconds * fps))`) and store
them. The integer schedule is authoritative; convert frames to seconds only at
the GSAP boundary. Define visible shot frames as `[0, durationFrames)` and specify
the last visible end state at `durationFrames - 1`. Reject actions whose intended
end state cannot be displayed. Future voice alignment creates a new timing
revision rather than silently changing this schedule.

Preserve the storyboard's **incoming** transition convention: shot N describes
arrival from shot N−1. First shot uses `start`. Hard/match cuts have zero overlap;
a match cut additionally records the reviewed anchor alignment. A continuous
handoff needs a shared-anchor/state contract or a persistent continuity group.
Camera/reveal/split-screen/motion-match labels require an explicit supported
implementation; never silently turn every label into a fade.

For overlap boundaries, store an integer overlap duration and presentation enum.
Composition frames equal the sum of shot durations minus overlaps. Bound each
overlap below both neighboring durations and require a shot's incoming plus
outgoing overlaps not to exceed its duration. Recompute shot offsets and narration
positions together. This makes timing changes visible before voice exists.
Remotion's [TransitionSeries documentation](https://www.remotion.dev/docs/transitions/transitionseries)
confirms that transitions shorten total duration through overlap.

## Five implementation phases

### G1 — Isolated adapter proof

Dependency: none. First implementation increment when execution is requested.

Create `benchmarks/remotion-gsap/` only when starting this phase. Reuse the original
benchmark's teaching sequence in an explicitly attributed, separately locked
package; do not edit `benchmarks/remotion/` or its frozen metrics. Pin GSAP and
aligned Remotion packages. Record installed APIs, license files, lock integrity,
Node/browser versions and dependency audit results. GSAP has its own license;
the adapter's MIT label does not establish licensing for every dependency.

Build two matched synthetic variants in this new package: frame-derived baseline
and GSAP candidate. Include a continuous state change, hard cut, match cut,
stagger, camera movement and deliberate reading hold. No audio or production UI.

Exit evidence:

- Sequential versus backward/random/duplicate seeks produce identical lossless
  pixels for the same frame and inputs; include 0, last frame and boundary±1.
- Remount, dependency replacement and cleanup produce no leftover transforms or
  leaked timelines. Test actual SVG properties and transforms, not DOM hashes alone.
- Inspect full moving transition windows and repeat silent test exports in the
  same pinned environment. Compare decoded frame hashes, not container hashes
  alone. Differences between baseline and candidate must be recorded and explained.
- Record preview/render timings, tween count and comparable memory scope. As an
  initial investigation threshold, flag >20% median slowdown over three matched
  warm runs; investigate before promotion, do not claim a speed benefit from noise.
- Keep the baseline usable if GSAP fails. Do not build a replacement adapter until
  a concrete official-adapter limitation is demonstrated.

### G2 — Validated motion proposals and persistence

Dependency: G1 passes. Use hand-authored synthetic motion fixtures before AI.

Implement the contract above and a minimal deterministic fixture compiler.
Add immutable `videos/<project-id>/motion/<revision-id>.json` artifacts with
SHA-256 verification. Add the next additive SQLite migration from schema 5
(expected 6 if no intervening migration), with jobs, explicit accepted/rejected
proposal decisions and exact motion acceptance. Preserve all prior tables/files.

Generation requires current accepted script/research and exact current accepted
storyboard, not merely a complete board. Capture source identities at request
start; recheck on completion and every decision. Preserve failed jobs and prior
artifacts. Reuse bounded requests, explicit retries, loopback protection and
exclusive temporary-write/rename/transaction cleanup conventions.

Shot revisions capture exact base motion revision, shot ID and storyboard hash.
The server constructs the full revision by replacing only that shot; models cannot
return a trusted replacement of unselected shots or narration. Timing or shared
anchor changes surface neighboring seam checks. Rejection preserves the accepted
motion; changing away and back cannot revive old receipts.

Exit: schema/foreign-reference/security tests, real schema-5 preservation,
reopen/integrity/orphan/rollback tests, stale script/research/board/selection races,
exact acceptance and unselected-shot preservation pass. Old static boards remain
readable and are not automatically converted or accepted as motion.

### G3 — Trusted composition and transition interpreter

Dependency: G2 fixtures and G1 proof.

Create `engine/` modules only as implemented responsibilities emerge: frame
schedule compiler, trusted primitive renderer, GSAP shot component and composition.
Use native Remotion for simple frame-derived values; use GSAP where choreography
adds value. Neither engine may overwrite a property owned by the other.

Test each supported boundary behavior with synthetic fixtures. Hold shared objects
in one continuity scope when continuity requires it. Keep all resources local and
ready before frame capture; no asynchronous work inside builders. Expose unsupported
plans as validation errors rather than approximated motion.

Exit: deterministic seeks/remounts, first/last frames, total-duration arithmetic,
complete boundary-window inspection and Player/still parity pass. Demonstrate the
supported mixed transitions without requiring a fixed transition ratio or one
new animation for every narration line.

### G4 — Player, timeline and scoped AI motion review

Dependency: G3 deterministic fixtures. Integrate manual fixture preview first,
then enable gateway motion proposals after preview comparison works.

Embed a client-only Remotion Player in `app/projects/[id]/visuals/`. Keep server
configuration and filesystem imports out of the browser. Provide play/pause,
scrubbing, frame stepping, shot selection, whole-boundary loop review and links
from narration. Display estimated timing until measured audio exists. Avoid autoplay;
retain static boards and respect reduced-motion UI preferences.

Add original/proposed comparison at the same composition frame, explicit motion
accept/reject, stale indicators, saved job progress/errors and reload recovery.
Send bounded shot context and the allowed motion vocabulary through CLIProxyAPI;
validate output before any preview. Model review is advice, not human acceptance.
No new autonomous agent framework is needed.

Reuse unchanged shot render inputs by verified content signatures, not array
position. A shot edit invalidates its preview, adjacent boundary checks and whole
composition receipts. A duration/order/overlap edit also invalidates downstream
frame offsets. Upstream identity changes make the motion manifest/acceptance stale;
unchanged shot caches may be reused only after validating their dependencies in a
new proposed manifest. Cache reuse never revives an approval automatically.

Exit: browser create/propose/compare/reject/accept/reload flow, failed/cancelled and
concurrent requests, scoped byte/value preservation, keyboard/mobile review and
actual moving-preview inspection pass. Run `npm run check` and `npm run build`.

### G5 — Production timing, gates and export

Dependency: G4; separately scoped production work after preview is reliable.

Integrate measured narration alignment, waveform/line timing and synchronized
audio preview. Timing changes create new revisions and stale affected approvals.
Bind formal Gate 1/Gate 2 receipts to exact creative plan, script, voice, motion,
assets and engine configuration. Implement guarded render jobs and verify the
export against the accepted preview inputs. Verify dimensions/fps/frame count,
full decode, audio presence/duration/synchronization and complete transition
windows. Check mobile readability, blank frames, flashing and camera stability.

Exit: independent human moving/audio review plus exact valid gate receipts and a
matching verified export. Neither storyboard acceptance nor motion acceptance
alone enables production rendering. Publishing/analytics remain later adapters.

## Implementation file map

| Area | Planned touch points |
| --- | --- |
| Isolated proof | New `benchmarks/remotion-gsap/`; new evidence under `docs/gsap/` |
| Contract and storage | New `workflow/motion.ts`, `server/motion-store.ts`; additive `server/database.ts` migration |
| Execution | New `server/motion.ts`, bounded motion API route; reuse `server/gateway.ts` and transport |
| Rendering | New `engine/` trusted modules; application package/lock only after G1 |
| Review | Existing visuals page/workspace and Server Actions; keep script editing independent |
| Verification | Motion fixtures, validation/persistence tests, browser evidence and frame comparisons |
| Documentation | This roadmap for sequencing; architecture.md for ownership; task/findings/progress for evidence |

## Handoff and stop conditions

Start with G1 only when implementation is requested. Record benchmark results
before advancing. A failed check blocks promotion of that phase, while unrelated
documentation can proceed. Do not install plugins, replace the renderer, refactor
the writing workflow or introduce a generalized animation framework for this slice.
Do not modify the relocated source plans, original benchmarks, v1, v2 or publishing.
No commits, pushes or subagents. Preserve local user changes.

Planning verification checks links, current package metadata and change scope.
It does not rerun the historical 45-test suite or claim that GSAP builds/renders.
