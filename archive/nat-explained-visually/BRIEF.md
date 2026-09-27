---
workflow: faceless-explainer
flow: automation
storyboard: yes
status: rendered
format: 1080x1920
fps: 30
destination: YouTube Shorts, Facebook and Instagram Reels
length: 119.258s measured (15 scenes, Supertonic 3, one WAV per scene)
narration: Supertonic 3, one WAV per scene
captions: off
sfx: off
bgm: off
---

# NAT Explained Visually — how multiple devices share one public IP

One beginner takeaway: NAT lets many devices that use private IP addresses reach
the Internet through one public IP, because the router keeps a table that says
which connection belongs to which device.

## Intent

Phone and laptop sit inside a home network with private addresses. The router is
the boundary and owns one public address and a NAT table. A packet leaves the
phone, the router rewrites its source and records the mapping, the packet reaches
a website, the reply returns to the router, the table sends it back to the phone,
a second device gets its own mapping, an unsolicited inbound packet finds no
mapping and is dropped, and NAT is distinguished from a firewall.

## Required information → scene map

| Required point | Scene |
| --- | --- |
| private IP addresses inside a home or local network | Frame 2 |
| the router's public IP address | Frame 4 |
| why private addresses are not directly routed across the public Internet | Frame 3 |
| a device sending traffic toward the Internet | Frame 5 |
| the router translating the source address | Frame 6 |
| source port translation / PAT | Frames 6 and 9 |
| a simple NAT translation table | Frames 5 (empty), 6, 9, 11, 15 |
| two local devices accessing the Internet at the same time | Frames 8–9 |
| both appearing externally through the same public IP | Frame 9 |
| an Internet response returning to the router | Frame 10 |
| the table forwarding each response back to the correct local device | Frames 11–12 |
| unsolicited inbound connection with no existing mapping | Frame 13 |
| NAT distinguished from a firewall | Frame 14 |
| the single takeaway, reinforced | Frame 15 |

## Customizations

- Channel design v2: portrait 1080x1920, dark canvas, Barlow headlines, IBM Plex
  Mono values, semantic colour only (blue inside, cyan outside, mint success,
  amber warning, indigo infrastructure, red-orange security).
- Colored local Icons8 artwork for the five real objects (phone, laptop, router,
  globe, server); local Font Awesome glyphs inlined with semantic colour for
  supporting symbols (table, arrows, check, x, warning, shield).
- The NAT table is the second main character: a bordered ledger beside the router
  whose rows appear as mappings are created and highlight when a reply matches.
- One packet with a compact port chip rides a single fixed route; replies retrace
  the same route in reverse.
- Native per-scene Supertonic narration after gate 1. Captions, SFX and BGM off.

## Guardrails

- `192.168.1.10` / `192.168.1.20` are example private addresses; `203.0.113.7` is
  a documentation address (RFC 5737) that names no real host.
- The outside ports (`40001`, `40002`) differ from the inside ports on purpose;
  FACTS.md records that a NAT may also keep the same source port, and the
  narration claims only that the router gives the connection a port of its own.
- "Connection" is used generically; no TCP/UDP/header detail appears.
- One public address is assumed (SOHO case). Address pools, DHCP, DNS and routing
  internals stay out of the video.
- The firewall beat explains the difference in reason (table match vs. configured
  rules) and does not claim a home router has no firewall.
- Out of scope per the brief: IPv6 NAT, carrier-grade NAT, NAT traversal, VPNs,
  header syntax, advanced firewall configuration.
- Gate 1: fact sheet, script, timed storyboard, icon plan and the icon-first
  sketch board are approved together. Gate 2: explicit approval of the assembled
  preview before the single render.

## Build status

Gate 1 approved. Frames built, index assembled, preview validation and
`npx hyperframes check` pass (0 errors; the 4 remaining audio warnings are the
checker's rounded end-times, disproved against the WAV durations). 45 sample
frames inspected; 54 storyboard action rows carry selectors and inspected times.
Gate 2 approved ("That is better. Now render the video"); `review/final-preview-approval.json`
records it. Rendered once to `nat-explained-visually.mp4` and verified with ffprobe
(1080x1920, H.264, 30 fps, AAC stereo 48 kHz, container 119.266667s against a
119.257687s narration timeline — 3578 frames at 30 fps), a clean full decode, and two
frames extracted from the actual MP4 (`review/render-check.png`, `review/render-check-s2.png`).

## Notes

- The pasted brief asks for no fixed duration and "completeness over a short-form
  runtime target", so the plan spends 15 scenes / ~126.5s estimated instead of
  the repository's 45–60s short-form default. This is an explicit user scope
  choice, not a silent override.
- Platform compatibility, flagged separately for the user's decision: YouTube
  Shorts allows up to 3 minutes (support.google.com/youtube/answer/10059070) and
  Instagram Reels up to 3 minutes (about.instagram.com/features/reels), so a
  ~2:07 cut fits both. Meta's Facebook Reels limit could not be verified in this
  run — their business help pages returned 404 or would not load — and the
  commonly cited 90-second Reels limit would exclude this runtime. Decide
  separately whether to publish to Facebook Reels or as a regular Facebook video.
- Address pronunciation: `pronunciation.json` sets `ipv4_style: "short"` and
  speaks the acronym as the word "nat".
