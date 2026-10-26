# Findings & Decisions

## Requirements
- Audit and complete V3 Card Declined (“Card Declined But I Have Money”) as a premium 72-78 second financial explainer.
- Validate prior audit issues against the current checkout before editing; reuse existing work.
- Track reusable test fixtures under `tests/fixtures/`; add essential project documentation under `docs/projects/card-declined/`; preserve local data and keep generated renders, temp data and private configuration untracked.
- Fact check payment authorization, participant roles, security restrictions, available funds, pending holds and decline codes 05/51. Preserve exact example: $205 current balance - $200 held = $5 available; $6 attempt is $1 over.
- Prepare, but do not accept, script/storyboard/motion or production export. No publish/push.
- Complete local software work if authorized gateway generation is unavailable; do not search for or bypass credentials.
- Technical proof and actual human creative/production approval are distinct.

## Research Findings
- No root `.codegraph/` exists; repository instruction says skip CodeGraph when absent.
- V3 package pins Remotion 4.0.537, `@remotion/gsap` 4.0.537, GSAP 3.15.0, Next 16.4.2 and React 19.3.1. Scripts include `check`, `build`, tests, lint, and typecheck.
- V3 `.gitignore` excludes `.next/`, `.data/`, `.env*` (except `.env.example`) and tsbuildinfo. No claim yet that all Card Declined generated artifacts are excluded.
- `tests/finance.test.ts` and `docs/projects/card-declined/REVIEW.md` exist. User-reported fixture break remains unverified pending file inspection.
- Existing child active plan `2026-10-25-advanced-motion-plan` records M9 live generation blocked by missing authorized gateway configuration; M10 candidate/rubric and production gates remain pending. This is historical evidence to verify against current project state, not permission to inspect secrets or to mark the new task complete.
- V3 `AGENTS.md` allows the current user task to supersede earlier setup-only limits, while still requiring synthetic proof and forbidding real production media, approval, publishing, commits, pushes, and subagents absent explicit authorization. It also requires reading `docs/PLAN.md`, `docs/PLAN2.md`, and `docs/architecture.md` first; they were read before any edits.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Existing advanced-motion plan remains untouched; this task has its own selected card-declined plan in the V3 project. | Avoids taking ownership of another active increment. |
| Authored static styleframes and deterministic synthetic proofs may be prepared as local review material, but they cannot be presented as generated production results or approval. | V3 boundaries and brief require this distinction. |
| No extra motion-graphics skill route: the target is a long narrated explainer, while that skill owns short unnarrated pieces. | HyperFrames entry and installed skill descriptions. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Initial plan directory resolution used an incorrect root binding. | Corrected to project-root binding and explicit selected plan ID. |
| Excessive broad search matched many numeric glyph/path data lines and produced truncated output. | Replace with bounded file enumeration and literal/filename-specific searches. |

## Resources
- User brief: `C:\Users\Dave\.codex\attachments\ce93b69a-b8b3-4af0-b399-82b82202a14f\Pasted text.txt`
- Project instructions: `AGENTS.md`, `docs/PLAN.md`, `docs/PLAN2.md`, `docs/architecture.md`
- Project: `D:\Project\Javascript\hyperframes-channel\2d-animation-v3`

## Verified repository audit
- `tests/finance.test.ts` imports `../videos/card-declined/technical-fixture.ts` and `style-directions.ts`.
- `2d-animation-v3/videos/card-declined/` is absent. V3 `.gitignore` ignores `videos/`. Focused finance test reproduced `ERR_MODULE_NOT_FOUND` for `technical-fixture.ts` on Node v24.6.0.
- Only `docs/projects/card-declined/REVIEW.md` is tracked under the project docs. It links to the missing ignored project sources and claims three styleframes plus an eight-second silent synthetic proof; those artifacts are not in the current `videos/card-declined` folder. Their existence elsewhere remains unverified.
- Existing registry includes `payment-terminal@1`, `banking-balance@1`, `numeric-display@1`, `approval-flow@1`, `api-flow@1`, and semantic diagram support. Current finance surfaces expose fixed `tap/processing/approved/declined` and `current/available/hold` parts; numeric amounts must come from separate source-bound actors. Need check generic flows and current renderer contracts before deciding if missing capability justifies a new component.

## Authoritative source review (2026-10-26)
- Visa Developer response-code table: code 05 = “Do not honor”; code 51 = “Not sufficient funds”. Use Visa's current table as the network-specific code source and scope labels to Visa's documented table.
- Stripe's payments guide describes the merchant/acquirer -> card network -> issuer path and says issuer examines account funds/credit and decides approval/decline; it distinguishes acquirer-side merchant/setup limits and says gateway/processor labels may differ from bank/network codes.
- Stripe's issuer-decline explanation says code 05 is generic and does not identify its cause; do not label it as a confirmed fraud/security decision or infer proprietary fraud tooling.
- CFPB says available balance is generally ledger balance plus made-available pending deposits, less pending authorized but unsettled debits; this is general background, not a universal account formula.
- Chase says its own pending card transactions affect available balance without posting, and timing/processing varies. Script should attribute the $200 hold and $205 current balance to a fictional illustrative bank example, not universal timing or policy.
- Sources: https://developer.visa.com/api-reference/request-response-codes ; https://stripe.com/resources/more/a-complete-list-of-decline-codes ; https://stripe.com/resources/more/do-not-honor-card-refusals ; https://www.consumerfinance.gov/compliance/circulars/consumer-financial-protection-circular-2022-06-unanticipated-overdraft-fee-assessment-practices/ ; https://www.chase.com/personal/checking/overdraft-services/how-transactions-post
- Read-only query of local `.data/studio.sqlite` found no title containing `declin`; local output directory is empty. This checkout has no card-declined project record or render source from which to recover the referenced production artifacts.
- `REVIEW.md` is a stale pointer to missing files under ignored `videos/card-declined/`, including script, research, storyboard, components, review page and technical evidence. Its claims about three styleframes and an eight-second synthetic proof are not independently verifiable in this checkout.
- The prior Oct. 24 graphics-overhaul evidence confirms the broad renderer/library infrastructure is already implemented and schema-v1 compatibility is intentional. Human visual/audio review and production approval were not performed there. Use the actual current source as primary evidence and avoid repeating that overhaul.
- Existing generic semantic diagrams are configurable, Zod-validated, source-schema-compatible `semantic-diagram@1`; existing visual `approval-flow@1` and `api-flow@1` render generic visuals but hard-code their endpoints and labels. Determine from renderer/Studio contracts whether the four-party authorization path can be authored using semantic-diagram without new component types.
- Existing `card-declined-example@1` source is tracked in `workflow/comparison-sources.json`: fictional USD cents, $205.00 current, $200.00 hold, $5.00 available, $6.00 purchase; the source note says no overdraft/partial approval/other pending items and that the hold is not a second posted debit. `numeric-display@1` requires exact source/hash/record IDs and a relationship for two endpoints, so no inline amounts are needed.
- Existing `semantic-diagram@1` accepts 2-8 labeled nodes, 1-12 labeled edges, including `processor`, `cloud`, `database`, `payment`, and `person` icons, with unique IDs and validated endpoints. It renders from declarative graph data and has deterministic fixed geometry. This is sufficient to express the four-party routing and request/response identity at scene level without inventing a payment-specific component.
- Existing `approval-flow@1` / `api-flow@1` use hard-coded generic document/server/database visuals and do not expose text/endpoints as data, so they are not a fit for the financial path.
- Existing finance `@1` surfaces have validated part-state color/reveal and exact endpoint status checks, but hard-code brand labels and presentation. `VisualComponent` already accepts a customizable top-level `label`, though `FinanceSurface` currently ignores it. Reuse labels and registered parts for a minimal brand customization; preserve finance part IDs and meaning for backwards compatibility.
- Existing previous financial tests expected `financeFixture` and `styleDirections`, neither file currently exists anywhere in tracked tests; current finance test fails before assertions. The checked-in `tests/fixtures/motion-components.ts` and `tests/fixtures/motion-presets.ts` provide reusable synthetic fixture builders; new finance fixtures belong alongside them under `tests/fixtures/`.
- Past graphics-overhaul memory is relevant because it confirms an earlier general graphics engine exists and schema-v1 immutability is important. Its actual source/verification summary was read; do not repeat the eight-family/general registry work.

## Licensed b-roll candidate
- Pexels asset `person-tapping-her-smartphone-to-pay-her-bill-5101679`, creator Gustavo Fring; Pexels page lists 3840x2160 (16:9), 14 seconds, free download. The page preview shows an unbranded POS terminal in shallow focus; no person or recognizable mark is visible in the inspected frame. Candidate fits only an ordinary tap/transaction-context insert, not a depiction of this person receiving a decline.
- Pexels says photos/video are free for commercial use with no attribution required, but its license prohibits implying endorsement and warns that depicted people/brands may carry separate rights. Keep a source/credit record, use the clip in a non-stigmatizing context, and inspect a multi-frame contact sheet before settling crop/use.
- Source page: https://www.pexels.com/video/person-tapping-her-smartphone-to-pay-her-bill-5101679/ ; license: https://www.pexels.com/license/ ; terms: https://www.pexels.com/terms-of-service/
- Downloaded the selected Pexels video to tracked project source path `public/media/card-declined/payment-terminal-pexels-5101679-4k.mp4` from the exact official download link exposed by its page; local file size is 12,228,603 bytes. Browser direct-CDN navigation was blocked by Chrome (`ERR_BLOCKED_BY_CLIENT`), while the official Pexels page exposed the licensed file and an explicit download link. This is an asset download within the user's direct b-roll request, not a render or publication.
- Browser access to the local media file was blocked, so no workaround was attempted. Only one remote preview frame was inspected; local multi-frame and crop review remain pending.

## Implementation and verification (2026-10-26)
- New tracked test fixture restores exact finance-source arithmetic, registered part/schema checks, source-bound numeric display, style directions, and an interpreter-3 terminal-to-balance synthetic fixture. `tests/fixtures/motion-presets.ts` now carries optional numeric references on mapped motion objects; production hydrator already had this behavior.
- `VisualComponent` now forwards `label` to `FinanceSurface`. Renderer displays the provided label or its previous default; finance part names and endpoint validation remain unchanged. `server/production-store.ts` already fingerprints this renderer path.
- Card Declined docs now contain source-qualified research, a 76-second proposed script, three unselected concepts, a scene storyboard, motion proposal, existing-component map, status/gates, and technical/creative reviews. All creative content remains proposed, not accepted.
- Review proof at `.data/card-declined-review-2026-10-26d/`: 3 styleframe PNGs, 8-second/240-frame/30-fps/1080x1920 silent H.264 MP4, and 7 out-of-order fresh seek images hash-matched to sequential frames. Reviewed styles plus sampled moving frames and 360x640 resize; no overlap in the final amount labels.
- Focused finance test file: 3 passed. Full `npm run check`: ESLint 0 errors/1 warning from `.planning/deepseek-v41-flash-short/author-motion.mjs`; TypeScript passed; 149/150 tests passed. The single failure is an unchanged tracked asset mismatch: `public/fonts/roboto-flex/LICENSE.txt` SHA-256 actual `9cbaed04b20c853f99840efe5dc96956f6f6120ed83a0ade35f9281a2b63e5d0`, expected by `workflow/variable-type-atlas.json` `b023c5d35f13b14327b1db316eb8660f9924edb1819906b97e2c7dfef1b683f0`.
- `npm run build` completed after 5.5 minutes of compile plus typecheck/static generation. Turbopack reported 9 dynamic filesystem-glob warnings in existing production-store/render code; no build error.
- Verified local source media file SHA-256 `e0d3008c04e393ad19920c3c425a5b1e7ae94ef72eac369d2c2189c05f171566` and license page. Only one remote preview frame was visually reviewed; multiple local source frames and crop remain a human-review gate. Browser local file URL was explicitly blocked; no workaround attempted.
