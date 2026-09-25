# NPS, DHCP, and Domain Controller — visual explainer brief

- topic: NPS, DHCP, and Domain Controller explained visually
- audience: beginners, junior system administrators, help desk technicians, IT students, homelab users
- language: English
- format: 1080x1920 portrait, 30 fps
- destination: YouTube Shorts and Facebook/Instagram Reels
- duration: no fixed limit; completeness takes priority over platform limits
- takeaway: DHCP configures the network, DNS finds domain services, the Domain Controller provides domain identity and services, and NPS decides network access only when the network requires authentication.
- captions: off
- sound effects: off
- background music: off
- workflow: channel-v2-planning
- mode: collaborative
- project: videos/nps-dhcp-domain-controller-explained-visually

## Scope

Show the normal DHCP → DNS → Domain Controller path first, then introduce NPS as a conditional 802.1X/RADIUS network-access layer. Keep the switch or access point between the Windows client and NPS in the authenticated path.

## Excluded

Deep Kerberos ticket exchanges, certificate enrollment internals, full PKI architecture, DHCP failover, Group Policy processing, RADIUS packet fields, advanced NPS constraints, and VPN configuration.

## Platform note

The complete lesson is intentionally longer than a typical Shorts/Reels target may allow. Do not shorten or split it silently; assess platform compatibility after the measured preview.
