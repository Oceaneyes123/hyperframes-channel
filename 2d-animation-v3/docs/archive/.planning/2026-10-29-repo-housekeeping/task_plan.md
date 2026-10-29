# Repository housekeeping

## Authorization
Audit/proposal accepted October 29. User explicitly authorizes history rewriting and replacement commits; never push. No feature or production behavior changes. Preserve source plans and frozen evidence bytes.

## Phases
1. Archive and verify original tracked files and Git refs before removal. Complete.
2. Untrack generated media/logs; retain representative linked images and source assets. Complete.
3. Add ignore rules, restore instructions, size hooks/CI and focused tests. Complete; 8 tests pass.
4. Correct Terra labels in a separate review revision; preserve originals. Complete; verified 300-frame review.
5. Run required v3/v2/publishing checks and frozen hashes. Complete; build failure disclosed.
6. Rewrite history with the archived-path removal list; create cleanup commit; recheck. Complete; fresh-clone restoration proves 731/22 hashes.

## Limits
Keep v1/v2 directory names because runtime dependencies exist. Do not upload evidence or push.

## Completion
Housekeeping implemented and committed. GitHub unchanged. V3 check passes 176 tests; V2 28 and publishing 55 pass. V3 build fails with the existing Turbopack CSS-worker premature exit; no application change to bypass it. npm ci reports eight high-severity dependency findings. Backup locations, restoration and fresh-clone limitations are documented in the root housekeeping record.
