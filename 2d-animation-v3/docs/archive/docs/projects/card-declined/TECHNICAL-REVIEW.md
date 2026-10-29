# Technical review

## Fixed

- The finance test imported missing files from the ignored `videos/card-declined/` directory and failed before assertions. Finance test data now lives in tracked `tests/fixtures/finance.ts`.
- The reusable test motion builder now carries numeric source references onto motion objects; this aligns its fixture output with the production motion hydrator.
- Finance surfaces previously ignored the caller’s `label`. `VisualComponent` now passes it through and `FinanceSurface` renders it, with the old ARC labels retained as defaults.
- The production engine hash list already includes `engine/components/finance-surface.tsx`; no extra engine binding change was necessary.

## Verification pending

## Completed checks

- Focused finance tests: **3 passed**.
- `npm run check`: ESLint completed with 0 errors and 1 existing warning in `.planning/deepseek-v41-flash-short/author-motion.mjs`; TypeScript passed; 149/150 tests passed. The only failure is `tests/variable-type.test.ts` checking the unchanged `public/fonts/roboto-flex/LICENSE.txt`: actual SHA-256 `9cbaed04b20c853f99840efe5dc96956f6f6120ed83a0ade35f9281a2b63e5d0`, expected `b023c5d35f13b14327b1db316eb8660f9924edb1819906b97e2c7dfef1b683f0`. This file is clean in Git and unrelated to Card Declined.
- `npm run build`: completed successfully. Turbopack emitted 9 existing dynamic filesystem-glob warnings in production/render code; no build error.
- `node scripts/verify-card-declined.mjs .data/card-declined-review-2026-10-26d`: rendered three 1080×1920 PNG styleframes and a silent 240-frame (8-second, 30 fps) H.264 proof. Seven out-of-order/fresh seeks matched sequential reference-frame SHA-256 values. `verification.json` records `syntheticOnly: true` and `productionApproval: false`.
- Visual review: inspected all three styleframes, ten sequential proof frames, and a 360×640 downscale. The amounts remain source-bound and readable with their labels in the reviewed frames.

The synthetic proof is not production output, and no user project state is migrated or changed. Production narration, source-media multi-frame inspection, human approvals, and the final render remain pending.
