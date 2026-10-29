# Preliminary art direction and storyboard

Status: the V3 concept is selected, and a Codex-authored five-shot storyboard is proposed in [STORYBOARD.md](STORYBOARD.md). The storyboard is not accepted. All times are rough and depend on the accepted script and measured narration.

Visual world: dark navy ink, warm white, restrained coral for failure, teal for verified release, amber for uncertainty. A tactile phone, bank account and merchant surface share one continuous illustrated world. Use registered assets and existing semantic components; do not invent asset availability. Favor layered surfaces and recognizable transaction records over interchangeable cards. At 360 px, use large numerals and no more than two short explanatory labels per view.

| Estimate | Focal image and teaching action | Motion direction |
| --- | --- | --- |
| 0–4 s | A pizza order on a payment phone displays a failure while its available balance drops. | Immediate status change and number change, closely synchronized; no title card. |
| 4–15 s | Pull through the phone into three distinct bank, network and merchant structures. A transaction token moves forward; its return confirmation stops short. | Trace one persistent token; interrupt the returning signal. No red checkmark declaring the bank's outcome. |
| 15–23 s | Close on a wallet balance: part becomes visibly reserved, while the settled balance remains distinguishable. | A portion moves into a temporary hold; retain the original transaction record. |
| 23–29 s | The record changes state into transfer checking or a posted charge. | Morph one record into alternative states, rather than showing every path as simultaneous. |
| 29–44 s | Three distinct paths: hold release, transfer return/check, posted charge investigation/refund. | Sequential branches with clear state changes; keep enough reading time and no automatic guarantee. |
| 44–65 s | Return to the opening phone; expand its transaction detail, showing pending/posted and a reference. | Match the opening composition; highlight the saved details, then connect back to the underlying record. |

Production: after script and board acceptance, use V3's declarative Remotion/GSAP motion, measured audio and line timing. Inspect for clipping, contrast, repeated layouts, passive shots and overly long holds. Review full playback with and without narration at desktop and phone sizes. No music, sound effects or captions.

Narration: recommend testing configured local Qwen3 or Chatterbox only if weights, runtime and licensing are confirmed, then listening to an actual take. The existing approved Fish Audio free cloud audition is a fallback candidate only with explicit selection; its default voice may not remain identical. No local neural voice is currently verified for this project. Do not use a system voice or paid cloud fallback silently.

