# Reusable component mapping

The current V3 library already covers the required teaching visuals; this proposal adds no payment-specific component type.

| Need | Existing component | Use and limit |
|---|---|---|
| Terminal tap / processing / endpoint | `payment-terminal@1` | Reuse its registered `tap`, `processing`, `approved`, and `declined` parts. Show only one terminal endpoint at once. |
| Current / available / hold rows | `banking-balance@1` | Reuse its `current`, `available`, and `hold` parts. Amounts remain separate actors. |
| Exact dollars | `numeric-display@1` + `card-declined-example@1` | Bind each amount to the source ID, content hash, and record ID. No inline invented values or digit transformations. |
| Merchant / processor / network / issuer path | `semantic-diagram@1` | Use validated labeled nodes and edges; animate request and response on the same explicit route. |
| Code 51 / 05 explanation | Existing text, card, or diagram primitives | Keep the network/source label visible. A generic `api-flow@1` has fixed server/database endpoints and is not suitable. |

`FinanceSurface` now respects the existing top-level `label` field for the brand text, preserving the current default labels and the registered part IDs. The engine hash already includes `engine/components/finance-surface.tsx`; no production hash-list change is needed.
