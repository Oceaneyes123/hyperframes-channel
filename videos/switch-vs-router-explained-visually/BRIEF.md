---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "A switch moves traffic within a local network, while a router moves traffic between networks."
destination: youtube
aspect: 1920x1080
language: en
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
length: 105s
angle: "concept-explainer with same-subnet versus different-network process"
narration: yes
style_preset: broadside
---

## Intent

Create a 90–120 second, dark, premium technology explainer that makes the difference between a network switch and a router visible by following traffic through a small network. The viewer should leave with one memorable rule: a switch connects devices; a router connects networks.

## Customizations

- Use the established HyperFrames Channel design system: dark neutral canvas, high-contrast Barlow display type, IBM Plex Mono labels, sharp diagram objects, restrained blue request traffic, mint response traffic, muted inactive topology, and purposeful motion.
- Teach MAC-address-based Ethernet-frame forwarding inside a LAN and IP-address-based packet forwarding between networks without requiring OSI memorization.
- Use the same illustrated laptop, switch, router, server, and internet/cloud concepts throughout. Prefer colored local Icons8 SVGs for major entities and local Font Awesome SVGs for functional symbols; use custom HyperFrames shapes for frames, packets, badges, tables, and paths.
- Include the opening hook, same-subnet flow, simplified MAC table and switch learning, remote destination, default gateway, simplified routing table, side-by-side comparison, same/different network replay, home-router clarification, and final recap from the supplied brief.
- Keep captions and BGM off. Use native per-scene narration tracks with Supertonic 3 after storyboard approval.

## Guardrails

- Do not imply switches never have IP-related features, that routers only connect homes to the public internet, or that a router replaces a switch.
- Do not route ordinary same-subnet traffic through the default gateway just because a router is present.
- Keep Ethernet frames distinct from IP packets, and keep MAC addresses local-link delivery identifiers rather than end-to-end internet routing identifiers.
- Omit VLANs, Spanning Tree, Layer 3 switches, ARP deep dives, NAT, BGP, dynamic routing protocols, full headers, and enterprise architecture.
- Wait for explicit storyboard/sketch approval before building frames, and wait for explicit final-preview approval before rendering.

## Notes

- The user supplied a complete production brief and requested the repository workflow, actual icon assets during sketching, and review before rendering.
- The requested 90–120 second range is planned as approximately 105 seconds across 12 concise teaching beats; final duration follows measured narration.
