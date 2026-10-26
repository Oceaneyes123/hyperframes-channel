# Research and claim boundaries

## What the supplied example says

The tracked record `card-declined-example@1` is fictional, denominated in USD cents, and supplies: current balance $205.00, pending hold $200.00, available balance $5.00, and a $6.00 purchase. Its note says the example has no overdraft, partial approval, or other pending items; the hold is not a second posted debit. It is a hypothetical illustration, not a real transaction record or evidence that a card was declined.

## How to explain the decline

The story should separate the balance shown from the amount the issuer may consider available for a new authorization. A $6.00 purchase exceeds the example’s $5.00 available figure. Say the authorization **could** be declined for insufficient available funds under the fictional example’s rules; do not claim this record proves why a real issuer declined a real purchase.

An authorization path commonly involves the merchant, acquirer or processor, card network, and issuer. The issuer makes the approve/decline decision. A response code can be returned along the route; exact code mappings and displayed descriptions can vary by network, processor, and issuer.

Visa’s published response-code table lists **05** as “Do not honor” and **51** as “Not sufficient funds.” Code 05 is generic and does not reveal the issuer’s specific reason; do not label it as proof of fraud or a security block. Keep code 51 scoped to Visa’s published table rather than presenting it as a universal mapping.

Available-balance practices vary. The CFPB describes a general available-balance calculation that can reflect posted funds, made-available deposits, and pending authorized debits. Chase says its own pending card transactions affect available balance before posting. Attribute those statements to their sources; do not imply that every bank uses the same timing, holds, or formula. A pending hold can later settle for a different amount or be released according to the issuer and merchant process.

## Sources

- [Visa Developer: Response codes](https://developer.visa.com/api-reference/request-response-codes) — Visa-specific code descriptions.
- [Stripe: A complete list of decline codes](https://stripe.com/resources/more/a-complete-list-of-decline-codes) — authorization route and variation across payment layers.
- [Stripe: “Do not honor” card refusals](https://stripe.com/resources/more/do-not-honor-card-refusals) — code 05 is generic; the issuer may not disclose the specific reason.
- [CFPB Circular 2022-06](https://www.consumerfinance.gov/compliance/circulars/consumer-financial-protection-circular-2022-06-unanticipated-overdraft-fee-assessment-practices/) — general description of available balance in the overdraft context.
- [Chase: How transactions post](https://www.chase.com/personal/checking/overdraft-services/how-transactions-post) — Chase-specific pending and available-balance handling.

Claims above were checked against these pages on 2026-10-26. Network and bank examples are source-qualified; no issuer-specific decision was verified.
