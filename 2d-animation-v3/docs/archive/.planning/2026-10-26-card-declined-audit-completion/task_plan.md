# Task Plan: Card Declined V3 audit and production preparation

## Goal
Make the V3 Card Declined project reproducible, fact-checked, visually coherent, reusable in Studio, and ready for review while preserving every human approval and publishing gate.

## Next Step
Hand off the current production state in `docs/projects/card-declined/HANDOFF.md`. Later continuation should review the pending motion candidate, measure line timing against the approved WAV without a local model, then continue through Gate 1 and Gate 2.

## Current Phase
Phase 5 - Delivery

## Phases

### Phase 1: Requirements and audit
- [x] Parse brief, workflow rules, constraints, and project scope
- [x] Inspect project artifacts, Git state, and reported audit issues
- [x] Record verified findings and blockers
- **Status:** complete

### Phase 2: Plan and factual research
- [x] Inspect authoritative payment/banking sources and current financial source record
- [x] Decide fixture/docs changes and reuse existing finance/diagram/numeric capabilities
- [x] Document assumptions and exact approval gates
- **Status:** complete

### Phase 3: Implementation and creative prep
- [x] Fix clean-checkout finance test reproducibility with tracked fixtures
- [x] Improve finance renderer presentation/customization without breaking component part contracts
- [x] Prepare fact-checked 72-78s proposed script, visual specification, storyboard, and full motion proposal
- [x] Generate local review-only styleframe screenshots and an 8-second synthetic renderer proof if the existing renderer allows
- **Status:** complete

### Phase 4: Verification and review artifacts
- [x] Run applicable tests, lint, typecheck, and production build sequentially
- [x] Inspect actual styleframe screenshots, phone-size readability, and moving proof
- [x] Write technical and creative review reports with honest limits
- **Status:** complete with one unrelated pre-existing test failure

### Phase 5: Delivery
- [x] Recheck approval/configuration gates and working diff
- [x] Mark complete only for achieved work; report pending gates
- **Status:** audit complete; script and storyboard accepted; narration approved; motion candidate pending review with quality warnings; line timing, Gate 1, Gate 2, and final video remain pending

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Keep this isolated card-declined plan under the V3 project; do not overwrite the existing advanced-motion plan. | Distinct task scope. |
| Keep script, storyboard, motion acceptance, Gate 1/Gate 2, final production render, and publishing explicit. | The brief prohibits automatic acceptance/publishing and reserves production render approval. |
| Do not use local models. Use the configured remote gateway for motion only after the user approves the proposed production; do not send narration to a new external alignment/transcription service without authorization. | The user explicitly approved production and narration, then instructed "Dont use local model." No local model inference was run. |
| Do not add payment-specific component types yet. | Existing versioned `semantic-diagram@1`, `payment-terminal@1`, `banking-balance@1`, and source-bound `numeric-display@1` cover requested scenes; avoid duplicating generic flow components. |
| Add a narrow `label` prop from `VisualComponent` to `FinanceSurface`, retaining default brand labels and all existing part IDs. | Current renderer ignores a caller-provided label, limiting customization; no schema or production-data migration is needed. |
| Use the existing Remotion register/snapshot scripts for synthetic review outputs, not a nonexistent HyperFrames CLI. | Local package uses Remotion 4.0.537 and existing `renderStill`/`renderMedia` scripts; `hyperframes` executable is not installed. |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| Incorrect PWF root binding returned no selected plan. | Corrected to project-root binding and explicit plan ID. |
| Combined init/cleanup command was rejected before execution. | Initialized in its own command; no cleanup retry. |
| Focused finance test fails before assertions with `ERR_MODULE_NOT_FOUND` for ignored `videos/card-declined/technical-fixture.ts`. | Create a tracked fixture and update the import; retain the failure as pre-change baseline. |
| Broad recursive search matched numeric glyph paths and truncated output. | Replaced with exact file and symbol searches. |
- [x] Select a licensed Pexels POS-terminal clip for the opening transaction-context insert
- [x] Download the page-selected 4K source clip into project media and record provenance
