---
workflow: faceless-explainer
flow: automation
storyboard: yes
status: delivered
message: "High-quality render complete and verified. HTTPS lets a browser check a site's identity and encrypt the connection, but it does not prove the site is trustworthy."
destination: portrait social video
aspect: 1080x1920
fps: 30
language: en
audience: "Beginners and non-technical viewers"
length: 60–90 seconds; measured 71.053 seconds in audio_meta.json
angle: curiosity-driven causal explainer; follow one browser-to-server connection
captions: off
sound_effects: off
bgm: off
---

## Intent

Answer what the lock in a browser actually promises. Follow one browser's connection to a site through the TLS 1.3 handshake, certificate checks, key derivation and protected HTTP traffic, then show what a network observer can still see.

## Single takeaway

HTTPS lets the browser verify the site's domain and protects HTTP traffic in transit. It does not establish that the site itself is safe or honest.

## Creative contract

- Keep the same browser, server, domain and route visible throughout the short.
- Start with the lock and an unanswered question; reveal the handshake and its details progressively.
- Show hello messages and key shares before the certificate, matching TLS 1.3 message order. Explain the shares' purpose after their first visual appearance.
- Keep the certificate public key distinct from the temporary key shares and derived traffic keys.
- Use short spoken sentences, one continuous visual action per scene, and no narration without a visible counterpart.
- Use the local colored Icons8 assets in `ICON_PLAN.json`, with sparse labels and causal movement on the existing channel design system.
- Keep the observer outside the TLS tunnel; show traffic visibility without exposing message contents.

## Gate

Gate 1 approved the fact sheet, script, icon plan, persistent frame contract,
timed storyboard and actual-icon sketch board. Gate 2 approval was recorded in
`review/final-preview-approval.json` before rendering.

## Verified output

- File: `renders/https-actually-works.mp4`
- Render: high quality, 1080x1920, 30 fps, 71.067 seconds
- Streams: H.264 video and AAC-LC stereo audio at 48 kHz
- Full `ffmpeg` decode completed with exit code 0.
- A frame extracted at 65 seconds was visually inspected.
