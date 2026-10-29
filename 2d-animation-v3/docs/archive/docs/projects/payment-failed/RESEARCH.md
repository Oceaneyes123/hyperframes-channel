# Verified research — payment failed, balance reduced

Checked 2026-10-27. Scope: general educational explanation; card examples do not define all electronic transfer rules.

- A card authorization reserves funds; capture is a separate step. An uncaptured authorization can expire and release funds. [Stripe: Place a hold](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method).
- An authorization reversal seeks release of a hold before settlement; a refund applies after a captured or settled transaction. A timeout/unknown response is not confirmed failure, and the original transaction identifier helps retrieve status. [Visa Acceptance: reversing an authorization](https://support.visaacceptance.com/knowledgebase/article/000002054/en-us).
- A payment provider can cancel a payment before completion or refund a successful payment; processing and posting depend on provider, network and issuer. [Stripe: Refund and cancel payments](https://docs.stripe.com/refunds).
- GCash's linked Visa/Mastercard QR guidance distinguishes pending or processing transactions and directs users to check transaction history. Its instructions are specific to that service and product. [GCash: linked card payments](https://help.gcash.com/hc/en-us/articles/61492237482521-Can-t-pay-using-my-linked-debit-or-credit-card).
- Suspected unauthorized charges should be reported promptly rather than waiting for a hold to clear. U.S. guidance and legal timeframes are jurisdiction-specific. [CFPB: suspicious debits](https://www.consumerfinance.gov/consumer-tools/bank-accounts/watch-accounts-closely-when-card-data-is-hacked/).

Do not use 24–48 hours or seven days as a general promise. Stripe's card authorization tables apply to specified card types and circumstances; they are not a universal customer refund deadline. Reference numbers assist tracing, but do not claim they are mandatory to recover funds. Confirmation failure alone cannot establish whether a payment failed, was captured, or was reversed.
