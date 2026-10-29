# Codex-authored storyboard proposal

Status: accepted by the user on 2026-10-27 through the explicit continuation after storyboard review. This storyboard was authored locally while the configured visual model was unavailable. It is not gateway output and is not production approval.

V3 project: `6f7f6053-5217-4b71-a5cc-79214a20206e`

Accepted script revision: `8cd530b7-598b-4bf0-946d-d52d65b65e27`

Selected concept: `2a9db5c2-9ee6-4697-a5ee-d7896fec849b`, option 0, “The Phone Window and the Bank’s Ledger.”

Accepted storyboard: `4c81ff87-4c01-40d3-a360-79adbd19d0d9`

Acceptance SHA-256: `11a53998198dd28745baf42134e384c94dc49dfaa2b983c237cc41842e122828`

Studio: <http://127.0.0.1:3003/projects/6f7f6053-5217-4b71-a5cc-79214a20206e/visuals?run=4c81ff87-4c01-40d3-a360-79adbd19d0d9>

## Shot order

| Shot | Narration line | Estimate | Teaching action |
| --- | --- | --- | --- |
| 1 | Pizza payment failure and missing money | 4 s | The terminal changes from processing to declined while the available meter shortens. |
| 2 | Merchant, network and bank exchange information | 11 s | A transaction token moves forward while the return path remains incomplete and status unclear. |
| 3 | Available funds versus a pending hold | 14 s | A coin moves from available funds into the pending-hold surface. No amount is invented. |
| 4 | Release, reconciliation and refund are alternatives | 15 s | One transaction record branches into three visibly different resolution paths. |
| 5 | Check the record and contact the provider | 16 s | The phone and bank return beside a neutral record for amount, date and reference. |

Estimated total: 60 seconds. This is not measured narration timing.

## Review artifacts

- [End-frame contact sheet](../../../output/playwright/payment-failed-storyboard/contact-sheet.png)
- [Full-size shot 1](../../../output/playwright/payment-failed-storyboard/Shot1End.png)
- [Full-size shot 2](../../../output/playwright/payment-failed-storyboard/Shot2End.png)
- [Full-size shot 3](../../../output/playwright/payment-failed-storyboard/Shot3End.png)
- [Full-size shot 4](../../../output/playwright/payment-failed-storyboard/Shot4End.png)
- [Full-size shot 5](../../../output/playwright/payment-failed-storyboard/Shot5End.png)

The graphic-quality inspector reports no deterministic findings. TypeScript passes. These software checks do not replace human review of composition, teaching clarity or phone-size readability.

After acceptance, a mechanical compatibility revision changed the hidden-state representation for the terminal and pending hold, marked the incomplete response path as already partial at the start, and replaced the unsupported shot 5 `match-cut` with a hard cut. Approved endpoint appearances remain effectively unchanged. The acceptance above binds the corrected storyboard.

## Next gate

Storyboard acceptance unlocks motion planning only. Motion, measured narration, Gate 1, independent Gate 2, explicit render authorization and publication remain separate decisions.
