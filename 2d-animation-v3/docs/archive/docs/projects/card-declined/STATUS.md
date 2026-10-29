# Production status

**State: full-resolution production render verified.** The user approved the revised storyboard, Supertonic voice, and narrated review draft on 2026-10-26. Studio accepted storyboard `cc1f057e-7379-4d8f-96a6-fccd9285a237` and motion `bb0c252f-d95c-4361-8eba-64dee83e2ce6`; narration `fcd5d5d6-1704-4195-8cd8-4ee08f714b8b` is the unchanged 81.5667-second Supertonic assembly with measured line boundaries. Production binding `db10b647586319ec6120b9e667e304b23332888e93c0f3a0a10a2185bb244943` has Gate 1 and Gate 2 records. Render job `5204d22b-acee-47b4-9cd0-4b662bb44eb1` completed at 2026-10-26 02:07 UTC. Its export is `videos/74c7a9f3-f2c9-47df-8285-29615658348a/production/5204d22b-acee-47b4-9cd0-4b662bb44eb1/export.mp4`. The Fish WAV remains untouched. The missing `videos/card-declined/` files previously linked from this folder were ignored/unavailable; the source materials here are reconstructed proposals, not recovered originals.

## Production record

1. The phone-resolution review MP4 is `.data/card-declined-production-2026-10-26/card-declined-supertonic-review.mp4`. It passed full decode and source-audio alignment checks.
2. The accepted motion has 2,447 frames and two heuristic repeated-reveal warnings; it has no text-size or long-stillness warnings.
3. Gate 1 `d50f5769-9c5c-41bc-aba4-4084b7117455` and Gate 2 `b77056db-21c6-42cf-a2ce-8e99672867d3` bind the exact source above. The downloaded Pexels clip is not used in this storyboard.
4. The guarded export passed full decode, 2,447-frame visual comparison (minimum SSIM 0.995494, threshold 0.98), fresh seeks at shot boundaries, and audio correlation 0.9999635 at zero lag. It is 1080×1920 at 30 fps. Publication requires a separate decision.

The earlier review MP4 is an eight-second, silent, synthetic renderer proof. The current narrated review MP4 supported the user's approval; the production gates are recorded separately in Studio.

## Source media

`public/media/card-declined/payment-terminal-pexels-5101679-4k.mp4` is an unbranded point-of-sale context insert downloaded from the Pexels page. The creator is Gustavo Fring. Pexels lists it as free under its license; attribution is optional. Do not imply the depicted person, if visible in other frames, experienced a decline or endorses a product. Keep the clip to a short ordinary tap/context shot. See the [Pexels video page](https://www.pexels.com/video/person-tapping-her-smartphone-to-pay-her-bill-5101679/), [license](https://www.pexels.com/license/), and [terms](https://www.pexels.com/terms-of-service/).

Local file SHA-256: `e0d3008c04e393ad19920c3c425a5b1e7ae94ef72eac369d2c2189c05f171566`.
