# Findings

- Requested output is a workable implementation plan, not feature implementation.
- No .codegraph directory at repository or V3 root.
- Existing changes overlap engine, visual planning, tests, and UI. Preserve them and the untracked source roadmap.
- V3 AGENTS.md requires immutable artifacts, explicit production approvals, Node 24, and checks for implementation.
- Read introductory scope of docs/PLAN.md, docs/PLAN2.md, and docs/architecture.md.
- Installed dependencies: Remotion and @remotion/gsap 4.0.537, GSAP 3.15.0.
- Existing motion, engine, visual, production, and route tests have synthetic fixtures.
- Future code checks: npm run check and npm run build.
- Roadmap requires versioned beats, six presets, richer visuals, narration timing, diagnostics, and controlled evaluation.
- Plan ID: 2026-10-23-motion-graphics-implementation. Initializer updated V3 active pointer; use explicit PLAN_ID with multiple plans.

## Source mapping discoveries
- workflow/motion.ts supports only transform/fade/hold and interpreters 1/2. Validation enforces drawing correspondence, final states, reading holds, property ownership, and continuous-anchor camera continuity.
- engine/motion-composition.tsx uses official useGsapTimeline; compile-motion.ts retains continuous actor identity and rejects motion-match and text dimension tweening.
- server/motion.ts generates estimated timing from script text, not measured narration.
- production-store.ts binds narration to accepted motion and requires full audio duration within one frame. Narration-first planning needs an explicit input/dependency design to avoid circular version references.
- Motion scoped revisions currently force interpreter 2; future version routing must update this path too.

## Additional source findings
- Production engine hashing uses an explicit engineFiles list in server/production-store.ts; presets, components, and relevant assets must enter that binding.
- Existing inspectMotion in workflow/production.ts should be extended before creating an analyzer framework.
- Full motion and scoped revisions share the existing gateway/store. Motion store reads validate artifacts and source integrity before compilation.
- New visual parts must preserve start/end correspondence, fixed text layout restrictions, and continuous actor identity.

## Final planning decisions
- Created docs/MOTION-GRAPHICS-IMPLEMENTATION-PLAN.md with 26 pending tasks and a source-phase coverage table.
- Sequence: baseline; one-preset vertical slice; six-preset short proof; safe components; timing and AI direction; diagnostics/Studio; independent full-output evaluation.
- Technical fixtures and independent creative evidence remain separate. Missing footage or reviewers cannot be replaced with model judgments.
- Timing design preserves current motion-first import and introduces a script/audio-bound planning input before final motion binding.
- Deferred new engines, effects plugins, broad catalogs, and automatic word-alignment services until needed.

## Component architecture decisions
- Compound components use versioned primitive IDs and named parts. Parts have validated canvas-relative offsets, scale, opacity, color and reveal, derived from authoritative start/end drawings.
- Initial part state is a derived motion value validated against source drawings, like existing root initial geometry. Models cannot provide markup or selectors.
- Cross-actor geometric presets use root actors; moving between parts needs explicit world geometry before enabling it. Root packet actors can perform handoff after an internal extraction.
- Compound dimensions stay fixed within an actor to preserve static/animated layout agreement; use scale or explicit replacement actors for size changes.
- cost-chart values are supplied nonnegative integer units, never invented currency or earnings. Kinetic phrases are one to five words.

## Verified final boundaries
- Complete check: 87 tests plus lint/typecheck; final build and synthetic Studio browser proof passed. Quality review only selects/seeks/prefills; it never submits a model revision automatically.
- Isolated timing-upload browser QA needs canonical Host/Origin forwarding because production intentionally allows port 3003. Native multipart passed; no production policy relaxation was needed.
- A/B/C packet contains a Codex-authored reference C. It cannot establish live backend-model quality, independent preference, listening approval or full-video release readiness.
