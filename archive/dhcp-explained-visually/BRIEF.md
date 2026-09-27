---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "DHCP automatically gives devices the network settings they need to communicate."
destination: youtube
aspect: 1920x1080
language: en
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
length: 110s
angle: "concept-explainer with process"
---

## Intent

Teach a friendly, technically accurate visual walkthrough of how a new device joins a network, completes the common IPv4 DHCP DORA exchange, receives a temporary configuration, and renews its lease.

## Customizations

- Reusable illustrated client, router/LAN, DHCP server, packet, broadcast, configuration bundle, IP badge, and lease-timer language.
- Large high-contrast labels, dark neutral ground, restrained blue glow, and motion that reveals the exchange.
- Narration uses the repository Supertonic 3 production path after storyboard approval; captions and BGM remain off.

## Guardrails

- Keep DHCP server and router conceptually separate, even when drawn on one network.
- Show Discover as a local broadcast because the new client does not yet know the DHCP server's address.
- Treat Offer as proposed configuration and ACK as the confirmed lease.
- Use DHCPv4 terminology only; omit relays, DHCPv6, option numbers, and enterprise details.
