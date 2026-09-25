---
workflow: faceless-explainer
flow: channel
storyboard: yes
message: "DHCP automatically gives a device the network configuration it needs when it joins a network."
destination: portrait social video
aspect: 1080x1920
fps: 30
language: en
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
length: no fixed limit; planned near 100 seconds, final length follows measured narration
angle: concept explainer with causal process
captions: off
sound_effects: off
bgm: off
---

## Intent

Follow one new laptop from joining the network with no usable assigned IPv4 address, through the usual DHCPv4 DORA exchange, to a confirmed and usable configuration. Then show what else is supplied, why the address is leased, how renewal works, and how several devices can be configured automatically.

## Single takeaway

DHCP automatically gives a device the network configuration it needs when it joins a network.

## Creative contract

- Portrait 1080x1920 at 30 fps, with essential content in x=72..936/y=180..1600.
- Reuse one laptop, DHCP server, router and route geometry through the DORA sequence.
- Discover radiates as a local broadcast because a fresh client typically does not know a DHCP server address. Offer, Request and ACK travel server-to-client, client-to-server, and server-to-client.
- Keep the DHCP server and router as separate visible roles.
- The offered settings remain visually provisional until ACK changes the laptop from “No IP” to “192.168.1.25 ✓”.
- Use sparse labels, local assets, and packet motion/state change so the board reads without narration.
- Treat 24 hours and the final device addresses as examples. DHCP can be optional, lease durations vary, and a device may get a different address later.

## Gate

The first review package is FACTS.md, SCRIPT.md, ICON_PLAN.json, frame.md, STORYBOARD.md, and the actual-icon storyboard at sketches/board.html. Narration synthesis, measured timing, animated scenes and preview wait for approval of the script and sketches.
