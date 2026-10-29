# Motion graphics implementation plan

Source: [MOTION-GRAPHICS.md](MOTION-GRAPHICS.md). Prepared October 23, 2026 against the current workspace, including existing uncommitted changes.

This is the implementation backlog. Task status is recorded below; unmarked tasks remain pending. Each task should fit one focused implementation/review session; stop at its completion check before starting the next task. Estimates are deliberately omitted until the first preset establishes actual effort.

## Implementation status — October 24, 2026

- 01 complete: exact real inputs, existing exports, and current engine source frozen in `docs/motion-graphics/baseline/`.
- 02 partial: four sampled phone-size intervals audited; independent continuous review and verified external technique references remain pending.
- 03–07 implemented and technically verified: legacy output snapshots, interpreter-3 beats, immutable/scoped persistence, preset hashing, 350 sequential frames/11 fresh stills, stable continuous seam, and live phone-size backward/repeated seeks, playback and remount.
- 08–10 implemented: six semantic presets plus explicit hold. The 15-second proof passed 450 sequential frames, 14 fresh stills and full decode.
- 11–12 partial evaluation: 488-frame A/B clips use identical existing narration, drawing identities and facts; both decode and audio synchronization pass with zero lag. B visibly selects one candidate in sampled frames. This adapts the prototype to complete measured opening lines; independent moving/listening review remains pending.
- 13–16 implemented and verified: six safe versioned component families with named parts, clipping/masks, supplied chart values, shared static/animated rendering and constrained Visual Director registry. Final-source component proof passed 600 sequential frames, 14 fresh stills and full decode.
- 17–21 implemented and verified: additive schema-8 timing storage/import UI, immutable script/audio-bound corrections, measured anchors with explicit line fallback, source invalidation, constrained beat generation, four energy profiles and scoped preservation tests. Synthetic browser checks passed upload, range playback and stale-motion invalidation. No live model calls were made.
- 22–24 implemented and verified: deterministic diagnostic findings, shared renderer font metrics, preset usage, shot timeline, accepted/proposed finding counts, seek-to-issue and explicit targeted revision instructions. Full check passed 87 tests plus lint/typecheck; final build and desktop/mobile browser checks passed. The quality panel sits beside previews on desktop and stacks on mobile.
- 25 prepared, independent review pending: randomized review-only A/B/C packet at `.data/motion-evaluation-900586e9-90e4-493a-8ad3-d417d81e9fd8/review/index.html`. C is a Codex-authored component reference, not a live backend-model sample. All three clips use the same 488-frame measured excerpt and original narration; no winner is recorded.
- 26 pending: independently reviewed full 50–75-second rollout after the comparison decision. No human preference, production gates or full-video completion is inferred.

## Scope and working rules

- Keep Remotion, GSAP, the existing Player, and the immutable proposal/acceptance workflow. No new renderer, general agent framework, arbitrary generated SVG/JavaScript, or effects plugin is needed.
- Preserve existing local changes. Recheck overlapping files before each implementation session; this plan does not authorize overwriting them.
- Interpreters 1 and 2 retain their current output. New beats use a distinct versioned contract and explicit interpreter routing. Changing a preset implementation requires a new preset version.
- Prototype with manually authored, validated beats before adding model generation. Use synthetic fixtures and isolated storage for automated verification.
- Real narration generation, production media creation, and formal approvals require their applicable authorization. A test receipt or model response never counts as human approval. Do not commit, push, or publish without a request.
- Run focused tests while implementing. Finish each code increment with Node 24, `npm run check`, and `npm run build`. Read relevant installed Next.js guides before UI/route changes. Documentation-only increments need link/coverage checks, not a build.

## Current source and consequences

| Existing boundary | Verified behavior | Planning consequence |
| --- | --- | --- |
| `workflow/motion.ts` | `transform`, `fade`, `hold`; interpreters 1/2; exact drawing correspondence, final states, property ownership, hold and continuity validation | Add beats without weakening existing invariants or reinterpreting saved plans. |
| `engine/motion-composition.tsx`, `engine/compile-motion.ts` | Official `useGsapTimeline`; persistent actors across continuous shots; frame-driven composition | Reuse timeline and actor ownership. Do not create a second playback clock. |
| `server/motion.ts`, `server/motion-store.ts` | Full/scoped proposals and immutable acceptance; scoped completion currently forces interpreter 2 | Version dispatch must reach generation, hydration, storage, reads, scoped edits, preview, and export. |
| `workflow/visuals.ts`, `engine/visual-symbol.tsx` | Safe declarative primitives and two endpoint drawings | New components need stable part identities and endpoint correspondence, not just more primitive names. |
| `workflow/production.ts`, `server/production-store.ts` | Measured line timing; narration bound to accepted motion; full WAV duration must match within one frame | Narration-first direction needs a separate planning input with an acyclic dependency chain. |
| `server/production-store.ts` | Explicit `engineFiles` list enters production binding | Add every render-affecting preset/component dependency and test invalidation. New folders are not covered automatically. |
| `workflow/production.ts` | Existing `inspectMotion` diagnostics | Extend this entry point before creating a separate analyzer architecture. |
| `tests/`, `scripts/verify-motion-seeks.mjs`, `server/render.ts` | Synthetic store/engine tests and existing seek/export verification | Extend existing fixtures and checks. Do not rebuild the verification harness. |

## Order and delivery gates

1. **Baseline:** tasks 01–02.
2. **Smallest working slice:** tasks 03–07. One versioned beat, one preset, one deterministic preview.
3. **Expressive motion proof:** tasks 08–12. Six presets and a controlled 15–20-second comparison.
4. **Visual vocabulary:** tasks 13–16. Richer safe components, introduced one family at a time.
5. **Narration-aware direction:** tasks 17–21. Measured timing, constrained generation, energy controls, scoped revisions.
6. **Quality review:** tasks 22–24. Useful diagnostics and targeted correction in Studio.
7. **Release evidence:** tasks 25–26. Blind short comparison, then full-video validation.

Implement in this order. Task 17's dependency design can be reviewed earlier, but do not build timing storage before the preset proof. A failed creative gate returns to the relevant preset or component task; it does not justify a new engine.

## Baseline

### 01 — Freeze the current comparison inputs

**Depends on:** none. **Touches:** isolated evaluation artifacts and an evidence manifest, not application logic.

- Locate the existing clipping export and Reddit Micro-SaaS script. Verify exact revisions, narration availability, approvals, and media paths; do not assume historical pointers are current.
- Select one 15–20-second Reddit segment. Record script, storyboard, motion, audio/timing, engine/package versions, hashes, dimensions, and fps. Preserve the current implementation as variant A.
- If the real script/audio cannot be used yet, freeze a synthetic technical fixture separately and record the missing creative evaluation input. Do not call it the real baseline.

**Done when:** the manifest identifies reproducible inputs, labels real versus synthetic evidence, and lists any authorization/input needed before producing comparison media.

### 02 — Record concrete creative problems

**Depends on:** 01. **Touches:** a timestamped audit beside the baseline manifest.

- Inspect 3–5 weak intervals at phone size. Record action, entrance energy, interaction, rhythm, repetition, camera purpose, and readability.
- Record intentional holds separately from dead time. Map each proposed improvement to an observed issue.
- Study a few supplied or independently verified AI LABS/Byte Without Bite references for techniques; log provenance and timestamps. Do not copy graphics or invent reference observations.

**Done when:** every initial preset/prototype decision has a concrete baseline reason. If footage is unavailable, observations remain explicitly pending.

## Smallest working slice

### 03 — Lock legacy compatibility and define version boundaries

**Depends on:** 01. **Touches:** existing motion/engine/production fixtures and tests; a short contract decision.

- Freeze representative interpreter-1 and interpreter-2 plans and expected schedules, continuity behavior, and representative frames.
- Choose a discriminated new beat-plan version, with versioned preset IDs. Legacy and new contracts remain explicit; do not silently convert approved artifacts.
- Define whether presets expand into existing actions or need narrowly scoped new internal tween instructions. Prove the choice with snap/overshoot before generalizing.

**Done when:** legacy fixtures pass unchanged and the design names all read/write/render dispatch points. Existing source/package changes may invalidate approval bindings even when legacy visual output is preserved; document that distinction.

### 04 — Add the beat schema and boundary validation

**Depends on:** 03. **Touches:** `workflow/motion.ts`, motion fixtures, `tests/motion.test.ts`.

- Add bounded purpose, type, target IDs, frame interval, versioned preset ID, preset-specific parameters, importance, optional narration anchor, and continuity metadata.
- Start with snap/overshoot plus explicit hold. Reject unknown fields, IDs, preset versions, invalid numbers, out-of-shot intervals, and excessive expanded work.
- Keep approved drawings authoritative for initial/final visible states. Intermediate states may vary within validated bounds. Continuity metadata must reference real actors and agree with endpoint/camera rules.

**Done when:** a valid three-action shot parses; malformed targets/parameters, overlapping ownership, and hold violations fail with focused tests. Do not add every future component schema here.

### 05 — Implement one pure preset expansion

**Depends on:** 04. **Touches:** the first actual module under `engine/motion-presets/`, compiler, engine tests.

- Implement snap/overshoot with anticipation, impact, and settling using bounded parameters. Return deterministic instructions; no random state, selectors from model output, or wall-clock timers.
- Expand before ownership/budget/end-state validation so overshoot and subphases cannot bypass safety checks. Reserve target/property intervals consistently with holds.
- Include the new module in production engine hashing immediately.

**Done when:** fixed input produces fixed instructions, settles at the approved endpoint, respects actor/camera ownership, and a module change invalidates the production binding in an isolated test.

### 06 — Persist and render the new version end to end

**Depends on:** 05. **Touches:** `server/motion-store.ts`, compiler/composition, existing motion route/view consumers, production binding, tests.

- Support immutable save/read/validate/compile of a manually authored new-version plan through existing store boundaries. Reject unsupported versions cleanly.
- Route the new version through the existing GSAP adapter, Player, and renderer. Retain legacy execution paths.
- Test new-version scoped persistence without forcing interpreter 2 or changing unrelated shots. Do not enable model generation yet.

**Done when:** the same manual fixture loads in preview and export input, storage corruption/version failures preserve prior acceptance, and untouched shots retain identical serialized content.

### 07 — Prove seeking before expanding the library

**Depends on:** 06. **Touches:** existing synthetic verification scripts/fixtures and evidence receipts.

- Exercise anticipation, peak overshoot, settlement, hold, and a continuous-shot boundary.
- Compare fresh mount, forward playback, backward seek, repeated seek, and export at the same frames. Check actor identity, final positions, blank frames, and preview/export agreement.

**Done when:** automated frame checks pass and a phone-size preview remains readable. Technical completion does not imply independent creative approval.

## Six presets and short proof

### 08 — Add staggered cascade and converge/assemble

**Depends on:** 07. **Touches:** preset registry, schemas, compiler validation, engine fixtures/tests.

- Give cascade bounded order, stagger, and hierarchy. Give convergence explicit participating actors, meeting geometry, and a visible result/replacement actor.
- Keep object identity, labels, and drawing correspondence intact; use explicit entering/exiting actors for replacements.

**Done when:** multi-target sequences reveal a relationship, expanded staggers stay in bounds, conflicts fail, and all three presets settle correctly under seek tests.

### 09 — Add punch zoom

**Depends on:** 08. **Touches:** preset schema/expansion and camera tests.

- Implement bounded emphasis with a declared focus and camera ownership interval. Preserve continuity camera state.
- Prevent simultaneous competing camera beats. Test frame edges and repeated emphasis without cumulative drift.

**Done when:** the selected object remains visible/readable and repeated seek/export yields the same camera transform.

### 10 — Add flow/handoff and split/disperse

**Depends on:** 09. **Touches:** preset modules, schemas, actor/endpoint tests.

- Use known packet/source/destination actors for flow and explicit child actors for split. Coordinate downstream reactions instead of only moving positions.
- Keep the existing unsupported velocity-based `motion-match` transition rejected; this preset does not authorize that transition.

**Done when:** six distinct presets have meaningful fixtures, invalid IDs/overlaps fail, and no preset invents executable assets or silently changes boundaries.

### 11 — Author the connected prototype

**Depends on:** 10 and baseline inputs. **Touches:** isolated prototype artifacts, not general generation prompts.

- Author the roadmap sequence: complaint cards gather, weak ideas disappear, a promising card becomes a search interaction, then a community becomes the focus.
- Keep narration and facts identical to A. Adjust illustrative 0–3/3–6/6–10/10–15-second boundaries to actual recording; use 15–20 seconds if necessary.
- Demonstrate at least three meaningful actions in one scene and all six substantially different behaviors across the sequence. Keep holds and sparse text.

**Done when:** validated prototype B can be reproduced from frozen inputs. No dominant repeated default slide; no claim that illustrative UI is real software output.

### 12 — Compare A and B before expanding scope

**Depends on:** 11. **Touches:** comparison report and verification receipts.

- Compare frozen A with preset-enhanced B at phone size, using the same audio, duration, facts, and output settings.
- Run technical seek/remount/export/audio checks and record render cost separately from human clarity/energy observations.
- Inspect all short-prototype frames for clipping/overlap; record independent review status honestly.

**Done when:** evidence supports better purposeful motion without worse clarity. Otherwise return to tasks 08–11. Do not start broad component or AI work solely because tests pass.

## Visual vocabulary

### 13 — Add the first safe compound component

**Depends on:** 12. **Touches:** `workflow/visuals.ts`, visual store validation, `engine/visual-symbol.tsx` or one concrete component module, static planning frame, compiler, tests.

- Start with one browser/thread or inbox composition needed by the prototype. Define named internal parts with stable IDs, bounded content, grouping, clipping, and authored SVG.
- Render the same component in storyboard drawings and animated output. Define initial/end state and part ownership without changing old primitive semantics.
- Restrict assets to a validated local registry. Reject arbitrary markup, URLs, JavaScript, and unknown part selectors.

**Done when:** one component supports receive, highlight, extract, and handoff behavior while static/animated layouts agree and legacy fixtures pass.

### 14 — Add business workflow and technology components

**Depends on:** 13. **Touches:** only concrete component/registry entries, schemas, fixtures/tests.

- Add one reusable invoice/approval composition and one API/server/database process. Reuse current symbols and the flow preset.
- Give each component one useful internal action; avoid creating an empty component framework or exhaustive asset catalog.

**Done when:** each family explains cause and effect using safe named parts and independently seeks correctly.

### 15 — Add finance, typography, and metaphor capabilities

**Depends on:** 14. **Touches:** concrete chart/counter, text, and metaphor modules, schemas, fixtures/tests.

- Add a bounded chart/cost breakdown, kinetic phrase emphasis, and one funnel/bottleneck/branching composition. Numeric values remain supplied data, not invented earnings claims.
- Add mask reveal, focus shift, and controlled reframe capabilities needed by these examples. Keep text layout fixed during unsupported size changes; use validated replacement text actors when necessary.
- Give authored clip/mask IDs instance-specific names to prevent SVG collisions; bind assets/modules into engine provenance.

**Done when:** all six roadmap component families have an exercised example, with safe typography and no unapproved text/label morphing.

### 16 — Connect Visual Director selection

**Depends on:** 15. **Touches:** `server/visuals.ts`, existing visual guidance, visual schemas/store, planning preview UI, visual tests.

- Expose only installed registry entries and safe part/state options to the model. Preserve script references, concept selection, storyboard acceptance, and scoped-shot boundaries.
- Upgrade the short segment with the new vocabulary while keeping narration/facts fixed. Keep it as a candidate for C, not an accepted replacement.

**Done when:** fake-gateway tests exercise valid/invalid output and scoped preservation, and the 15-second explainer works without generic boxes as its main visual language.

## Narration-aware direction

### 17 — Define an acyclic timing input and persistence

**Depends on:** 12; complete before 18–21. **Touches:** production/timing contracts, store/database only if needed, compatibility tests.

- Current production narration requires accepted motion. Introduce an immutable planning timing input bound to exact script/audio hashes, independent of final motion acceptance.
- Reuse WAV inspection and line timing validation where applicable. Separate script/audio alignment validation from the later check that timing fits the chosen motion schedule.
- Record line spans and optional manually verified phrase/word spans, their provenance and correction revision. Never infer exact word times from constant reading speed.
- Define the chain: script/audio timing input, proposed motion, accepted motion, final narration binding, explicit production gates. Preserve legacy motion-first imports.

**Done when:** source changes make timing inputs stale, no artifact depends circularly on its own motion, and existing production records remain readable. Any database expansion has preservation, retry, and rollback tests.

### 18 — Resolve narration anchors into frame constraints

**Depends on:** 17 and 10. **Touches:** timing resolver, beat validation, motion/production tests.

- Resolve line/phrase/word anchors with explicit precedence and 30fps rounding. Validate script identity, span ordering, bounds, overlaps, and missing anchors.
- Use measured line timing as fallback when precise spans are absent. Report unresolved intent; do not fabricate word accuracy.
- Preserve reading holds and overlap-adjusted global shot schedules. Duration mismatch produces a proposed revision or actionable failure, not silent audio time-stretching.

**Done when:** fixtures cover anchors at shot/transition edges, missing words, changed scripts, and sufficient reading time.

### 19 — Generate constrained choreographed beats

**Depends on:** 16 and 18. **Touches:** `server/motion.ts`, generated/scoped schemas, hydration/store, gateway fixtures/tests.

- Supply exact visual parts, measured timing availability, preset versions, purpose, importance, and continuity constraints to the existing gateway.
- Generate beats, not selectors or executable timelines. Validate expansion and schedule before saving a proposal; failures preserve prior artifacts.
- Produce full Motion Director variant C from the same frozen segment/audio, with richer visual planning and choreography.

**Done when:** fake-gateway tests cover full/scoped generation, invalid presets/anchors, cancellation, stale context, and unchanged unrelated shots. Live calls are a separately authorized smoke check, not required for unit tests.

### 20 — Add energy profiles and Studio controls

**Depends on:** 19. **Touches:** new-version motion settings, motion workspace/request flow, tests.

- Add Calm, Balanced, Energetic, and Intense as bounded planning guidance; default new Shorts plans to Energetic. Persist the chosen profile in proposal provenance.
- Vary action character, density, stagger, emphasis, and camera restraint. Keep narration and reading constraints authoritative; never multiply every duration by one speed factor.
- Show selected profile and proposed changes with accessible labels, keyboard control, and existing acceptance actions.

**Done when:** selection reaches generation and survives reload, old plans retain behavior, and a long-text fixture keeps its required hold under every profile.

### 21 — Verify scoped revision and approval invalidation

**Depends on:** 20. **Touches:** motion/production stores, dependency hashes, UI comparison, regression tests.

- Exercise “make this reveal punchier; keep the result readable” on one shot. Keep unselected shots, actor identities, and the base artifact unchanged.
- If duration/continuity changes require adjacent edits, reject the scoped request with a clear explanation or create an explicitly broader proposal. Never silently change neighbors.
- Keep proposal generation separate from acceptance. New accepted motion, timing, preset/component code, or source assets must invalidate applicable production bindings/gates.

**Done when:** persistence tests prove scoped preservation, stale/conflicting decisions fail, and approval remains bound to exact reviewed inputs.

## Quality review

### 22 — Extend deterministic pacing diagnostics

**Depends on:** 21. **Touches:** `inspectMotion` and a small extracted quality module only if needed, quality fixtures/tests.

- Report stillness excluding intentional holds, repeated preset/camera patterns, slow important entrances, and competing effects.
- Use deterministic findings with rule ID, shot/beat, frame interval, evidence, severity, and a concrete correction suggestion. Freeze/version threshold configuration used by a report.

**Done when:** deliberately weak fixtures trigger specific findings and intentional-hold fixtures do not. No universal creative quality score.

### 23 — Add geometry and continuity diagnostics

**Depends on:** 22. **Touches:** analyzer, measured text/layout/render checks, fixtures/tests.

- Check crowding/clipping, size/contrast, and boundary anchor jumps. Use actual layout/frame evidence for assertions that metadata alone cannot support.
- Flag unchanged explanatory end states as a review prompt; do not claim an algorithm can prove whether an explanation is clear.
- Retain strict safety failures separately from editorial warnings and intentional overlaps/masks.

**Done when:** weak geometry/transition fixtures are detected, purposeful designs avoid known false positives, and every finding has inspectable evidence or an explicit heuristic label.

### 24 — Add Motion Quality review beside the Player

**Depends on:** 23. **Touches:** existing motion workspace/player UI and API only where required, UI verification.

- Show shot timeline, findings, preset usage, accepted/proposed comparison, and seek-to-issue actions. Reuse current shot selection and revision request flow.
- Prefill a selected-shot correction instruction; user submits and later accepts/rejects the resulting immutable proposal.
- Verify keyboard navigation, labels, narrow-screen layout, version switching, and accurate global frame navigation through overlaps.

**Done when:** a weak fixture can be inspected, targeted, revised, compared, and explicitly accepted without changing unrelated scenes or granting production approval.

## Release evidence

### 25 — Run the controlled A/B/C comparison

**Depends on:** 24 and frozen A/B/C inputs. **Touches:** evaluation artifacts/report.

- Use identical narration, facts, segment length, resolution, and fps. Label A=current baseline, B=existing storyboard plus presets, C=full visual/motion direction.
- Randomize presentation and use reviewers who have not been told which version is new. Record provenance exposure; developer/model opinion is not blind human evidence.
- Assess energy, clarity, pacing, variation, and explanatory value at phone size. Keep technical determinism/audio/performance receipts separate.

**Done when:** independent results support a winner with clarity at least as good as baseline. Otherwise revise the identified weak task and rerun only the affected comparison. If reviewers are unavailable, mark creative release blocked while retaining technical results.

### 26 — Validate one complete Short and document rollout

**Depends on:** 25 and applicable production authorization. **Touches:** one 50–75-second evaluation project, verification receipts, `docs/animation-workflow.md`, architecture notes.

- Apply the winning approach to the full script. Inspect every scene and listen through the full narration; use automated full-frame inspection plus exact seeks, preview/export comparison, decode, audio sync, and performance checks.
- Obtain independent full-video review. Preserve exact script/storyboard/motion/audio/engine bindings and explicit human gates. Never carry approvals from A to B/C or from the short segment to the full video.
- Document supported versions, presets, components, timing fallbacks, diagnostics limitations, and restoring a known-good source/storage snapshot. Preserve new artifacts during rollback; do not destructively downgrade storage.

**Done when:** code checks pass, all six presets and richer visuals are exercised, scoped revision/legacy regressions pass, and a real full output has independent creative/audio review. Publishing remains a separate task.

## Roadmap coverage

| Source requirement | Tasks |
| --- | --- |
| Phase 0: baseline and reference analysis | 01–02 |
| Phase 1: versioned causal beats and continuity | 03–07, 19, 21 |
| Phase 2: six reusable GSAP presets and deterministic playback | 05–12 |
| Phase 3: six component families, safe grouping/masks/internal actions | 13–16 |
| Phase 4: measured anchors, energy profiles, intentional holds | 17–20 |
| Phase 5: diagnostics, timeline, comparison, scoped correction | 21–24 |
| Phase 6: blind A/B/C and independent full-video evaluation | 25–26 |
| Compatibility, exact approvals, hashing, checks | 03, 06–07, 17, 21, 26 |

## First implementation session

Start with task 01. Confirm real comparison inputs and freeze provenance; do not begin by adding six preset modules. After baseline review, complete tasks 03–07 as the first code milestone. Defer more libraries, advanced effects, automatic word-alignment services, and broad component catalogs until demonstrated need.
