---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "/24 means the first 24 bits identify the network; the remaining 8 bits address hosts inside that subnet."
destination: youtube
format: portrait
aspect: 1080x1920
fps: 30
language: en
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
length: 111.8s (estimate; measured Supertonic timings replace it)
angle: "concept explainer with same-subnet versus different-subnet decision"
narration: yes
captions: off
bgm: off
design: "hyperframes-channel v2.0.0 (DESIGN.md)"
---

## Intent

Explain what a subnet is, what `/24` means, and how a device decides whether
another IP address is local. The viewer leaves with one mental model: an IPv4
address splits into a network portion and a host portion, and the first
`/24` bits draw that line.

## Customizations

- Repository channel design system v2: portrait 1080x1920, dark neutral canvas,
  Barlow display type, IBM Plex Mono values, semantic color only.
- Request blue for active traffic and selected address portions, response mint
  for local/success states, warning amber for boundary or mismatch, muted grey
  for inactive bits, devices, and networks.
- Colored local Icons8 renders for the major entities (laptop, phone, router,
  server); local Font Awesome SVGs for compact symbols (network, arrows,
  equals, check, boundary and status markers); custom HyperFrames graphics
  (author-built SVG and CSS) for octet blocks, binary bit strips, the
  network/host divider, subnet containers, address-range bars, and badges.
- The same icon stands for the same concept in every scene.
- Native per-scene narration tracks with Supertonic 3 after gate 1 approval.
- Captions and BGM off unless requested.

## Guardrails

- `/24` is one prefix length among many; the video says so and never claims it
  is universal.
- `255.255.255.0` is the mask for this example only; the frame labels it as
  "here".
- The final octet is the host portion **in this example** because the prefix is
  24 bits; the video states the rule as "prefix bits = network, remaining bits
  = host".
- CIDR applies to public and private addresses alike.
- 254 conventional host addresses is presented as the usual `/24` convention,
  with the special cases (`/31` links, `/32` hosts) named in `FACTS.md` and left
  out of the video.
- Devices on different subnets cannot talk directly; the router/default gateway
  path is shown.
- Subnetting is not DHCP: no address-assignment server appears in the video.
- Addresses describe logical IP networks, not physical topology.
- Out of scope: VLSM, IPv6, route summarization, wildcard masks, classful
  history, `/27` `/29` `/30` examples, dense subnetting tables.
- Gate 1: approve this fact sheet, script, timed storyboard, icon plan, and the
  icon-first sketches before any frame is built. Gate 2: explicit approval of
  the assembled preview before rendering.

## Notes

- The supplied brief asked for landscape 1920x1080; the repository v2 design
  contract fixes the channel to native portrait 1080x1920, and the user
  confirmed portrait at intake.
- The supplied brief asked for 90-120 seconds; the user kept that scope, so the
  plan targets ~112 seconds across 12 scenes (the repository 45-60 second
  default is flagged, not silently applied).
