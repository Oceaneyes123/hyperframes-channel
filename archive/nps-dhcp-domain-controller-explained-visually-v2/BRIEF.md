# NPS, DHCP, and Domain Controller — visual explainer brief (v2 design)

**Status: delivered.** Rendered after explicit final-preview approval; see *Verified output* below.

- topic: NPS, DHCP, and Domain Controller explained visually — how a Windows device gets network access and reaches Active Directory
- audience: beginners, junior system administrators, help desk technicians, IT students, homelab users
- single takeaway: DHCP gives the device its network configuration, the Domain Controller provides Active Directory services such as authentication and DNS-backed domain discovery, and NPS makes the policy decision when the network itself requires authentication.
- language: English
- format: 1080x1920 portrait, 30 fps (repository v2 default; the pasted brief carried no landscape exception)
- destination: YouTube Shorts and Facebook/Instagram Reels
- duration: no fixed limit; completeness takes priority over a platform limit
- narration: Supertonic 3, one WAV per scene
- captions: off · sound effects: off · background music: off
- workflow: channel-v2-planning
- mode: collaborative
- project: videos/nps-dhcp-domain-controller-explained-visually-v2

## Scope

Follow the normal path first (device → DHCP → DNS discovery → Domain Controller →
domain authentication), then introduce NPS as a conditional network-access layer in
front of it (device → switch/AP → NPS → port opens → DHCP → DNS → DC).

## Excluded

Deep Kerberos ticket exchanges (AS-REQ/AS-REP/TGT/TGS), certificate enrolment
internals, full PKI architecture, DHCP failover, Group Policy processing, RADIUS
packet-field detail, advanced NPS constraints, VPN configuration.

## Measured duration and platform position

Measured narration (Supertonic 3, one WAV per scene, `audio_meta.json`) totals **180.628s**
across 21 scenes; measured speech landed ~5.5% faster than the 191.0s normalizer estimate.
That is **0.63s over** the 3-minute ceiling YouTube documents for vertical Shorts, so as built
this publishes as a regular video rather than a Short/Reel. No content was trimmed to fit; the
decision is the user's. No trailing silence was available to reclaim (silencedetect at
-45dB/0.25s finds none in the sampled WAVs), so closing the gap means cutting narration.

## Notes

- **New design, deliberately not the earlier build.** A sibling project
  `videos/nps-dhcp-domain-controller-explained-visually/` already holds a completed
  14-scene, 213.77s render of this topic. It is left untouched. This project replaces
  its **grid-of-glyph-tiles with a horizontal timeline rail** with a **two-column
  access stage**: large 280–360px local colored device artwork, a persistent client
  + access-gear column on the left, services in the right column, a drawn
  structured-cabling trunk between them, and a client configuration plate that
  carries state across scenes. No tile grid, no rail, no enclosing card.
- Scene count (21) and runtime exceed the repository's short-form *warning* targets
  (>10 scenes, >60s). The pasted brief explicitly chose completeness over a platform
  duration limit, so this is the recorded scope exception.
- Platform compatibility is reported separately after the measured preview; content
  is never shortened to fit a limit.

## Required-information coverage

| # | Required point | Scene(s) |
| --- | --- | --- |
| 1 | Windows client joining/connecting to a corporate network | L2 |
| 2 | DHCP Discover / Offer / Request / Acknowledge at beginner level | L3–L6 |
| 3 | DHCP assigning IP, subnet mask, default gateway, DNS server | L7 |
| 4 | Why the DNS server setting is critical in Active Directory | L8 |
| 5 | Client querying DNS to locate Active Directory services | L9 |
| 6 | SRV records at a high level | L10 |
| 7 | How the client discovers a Domain Controller | L10, L11 |
| 8 | Client communicating with the Domain Controller after discovery | L11 |
| 9 | Active Directory authentication at a high level | L12 |
| 10 | Kerberos as the common domain authentication protocol | L12 |
| 11 | Where NPS fits when network access requires authentication | L13 |
| 12 | 802.1X Wi-Fi or wired authentication example | L14 |
| 13 | AP / switch acting as the RADIUS client (NAS) | L15 |
| 14 | NPS receiving the RADIUS authentication request | L16 |
| 15 | NPS evaluating connection and network policies | L16 |
| 16 | NPS validating credentials/identity using Active Directory | L16 |
| 17 | NPS returning Access-Accept or Access-Reject | L17 |
| 18 | Network access only after successful network authentication | L17, L18 |
| 19 | Clear distinction between DHCP, NPS, DNS, DC responsibilities | L19, L21 |
| 20 | NPS is not involved in every normal DHCP-to-DC flow | L19 |

## Verified output

`nps-dhcp-domain-controller-explained-visually-v2.mp4` (project root, 11.7 MB)

| Property | Measured |
| --- | --- |
| Container / streams | h264 1080x1920 + aac 48 kHz stereo |
| Frame rate | 30/1 |
| Duration | 180.633s (narration 180.628027s; the 5 ms difference is frame rounding) |
| Full decode | `ffmpeg -i … -f null NUL` — no errors |
| Audio present | mean -26.6 dB, max -5.5 dB; speech RMS -31.8 / -28.2 / -27.7 dB at 30 / 100 / 170s |
| Frames captured | 5419 / 5419 (drawelement, hardware GPU) |
| Render time | 2m 28.4s (`--quality high`) |
| Evidence | `snapshots/` 63 samples + 8 contact sheets, `renders/rendered-check*.png` pulled from the MP4 itself |

## Unresolved

- **Platform duration.** 180.633s is 0.63s over the 3-minute ceiling YouTube documents for
  vertical Shorts, so this publishes as a regular video rather than a Short/Reel. Approved as
  built; no narration was trimmed. `silencedetect` finds no trailing silence to reclaim.
- **One cosmetic inconsistency found only in the rendered takeaway frame (scene 21).** The
  four-way comparison labels its objects at a size stepped down by length, so
  `DOMAIN CONTROLLER` renders at 26px against 36px for DHCP / DNS / NPS. Equality is the point
  of that frame, so a uniform size would read better. Deliberately **not** changed after
  approval: a composition change requires a fresh preview review before re-rendering.
