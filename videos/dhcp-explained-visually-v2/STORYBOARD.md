---
format: 1080x1920
fps: 30
captions: off
sfx: off
bgm: off
---

# DHCP Explained Visually — measured storyboard

Eleven scenes; 151.531565 seconds measured across eleven Supertonic WAVs. `SCRIPT.md` owns spoken words; `audio_meta.json` owns measured scene durations and global starts. Timings below are scene-local action beats derived from each measured duration. The actual-icon approval sketches are in `sketches/board.html`.

The laptop, DHCP server, router and central route keep fixed positions through the DORA exchange. Request packets move down in blue; server offers and acknowledgments move up in indigo/green. The offer is amber and provisional. ACK is the only scene that changes the client to a usable IP.

| Frame | Measured global window | Scene-local action beats |
| --- | --- | --- |
| 1 | 0.000000–6.757007s | 0.54–3.38 join/network rings; 2.50–2.92 NO IP state; 3.92–4.37 question lands. |
| 2 | 6.757007–20.619320s | 1.66–10.98 four manual fields fill in order; 9.98–10.38 DHCP optional cue. |
| 3 | 20.619320–34.063673s | 1.08–6.72 client-to-server route draws; 6.45–6.90 role labels resolve. |
| 4 | 34.063673–47.090068s | 1.04–8.08 Discover packet reaches LAN; 5.21–11.72 broadcast spreads; 10.16 server receives. |
| 5 | 47.090068–75.114694s | 2.24–8.40 Offer retraces route; 5.04 card arrives; 6.73–8.39 five proposed values reveal; NO IP remains. |
| 6 | 75.114694–84.727755s | 1.15 offer selection; 2.11–7.68 Request travels client-to-server. |
| 7 | 84.727755–98.520408s | 1.65–7.45 ACK returns; 8.55–9.38 NO IP changes to confirmed address; 9.38 route turns green. |
| 8 | 98.520408–111.128844s | 1.51–4.64 configuration rows join; 7.07–7.52 network-role cues resolve. |
| 9 | 111.128844–123.110340s | 1.20–8.98 lease timer advances; 7.43–7.83 example-duration label lands. |
| 10 | 123.110340–135.788435s | 0.63–9.25 lease approaches expiry; 1.90–4.95 renewal request; 6.08–9.13 ACK returns; 9.64–10.91 timer resets and lease extends; 9.38–9.83 address caveat. |
| 11 | 135.788435–151.531565s | 4.41–8.01 example addresses appear; 8.84–9.39 DORA recap; 12.94–13.44 takeaway resolves. |

## Frame 1 — A new device arrives

- duration: 6.757007s
- measured window: 0.000000–6.757007s
- src: compositions/frames/line-1.html
- status: built
- Narration: `SCRIPT.md#Line 1`
- Objective: make the starting problem visible before explaining protocol names.
- Objects: 1 laptop, 1 Wi-Fi/network field, “NO IP” chip.
- Visible text: “New on Wi-Fi” / “NO IP”.
- Archetype / verb: Hero hook / joins.
- Beginning state: laptop has just entered the local network; no usable assigned IP.
- Action: Wi-Fi rings settle around the laptop; its address chip remains empty and marked NO IP.
- Ending state: viewer sees a connected device with no assigned IP.
- Sound-off check: no usable address is visually distinct from an assigned address.
- Measured action beats: see frame 1 in the timing table.
- Review: PASS, sound-off snapshots at 0.10s, 2.80s and 6.50s; `review/final-preview-evidence/frame-00-at-0.1s.png` through `frame-02-at-6.5s.png`.

## Frame 2 — Manual setup

- duration: 13.862313s
- measured window: 6.757007–20.619320s
- src: compositions/frames/line-2.html
- status: built
- Narration: `SCRIPT.md#Line 2`
- Objective: show the four settings someone would otherwise enter by hand and state that DHCP is optional.
- Objects: same laptop, four separate setting badges, hand cursor.
- Visible text: IP, SUBNET, GATEWAY, DNS; “Manual setup”.
- Archetype / verb: Contrast / attaches.
- Beginning state: same unconfigured laptop.
- Action: setting badges attach one by one; a small manual hand/cursor must visit each. The field never reads as four different steps of DORA.
- Ending state: configuration is complete only after the fourth badge.
- Sound-off check: a person could manually enter IP, mask, gateway and DNS.
- Measured action beats: see frame 2 in the timing table.
- Review: PASS, sound-off snapshots at 0.14s, 5.24s and 13.74s; `review/final-preview-evidence/frame-03-at-6.9s.png` through `frame-05-at-20.5s.png`.

## Frame 3 — Meet the roles

- duration: 13.444354s
- measured window: 20.619320–34.063673s
- src: compositions/frames/line-3.html
- status: built
- Narration: `SCRIPT.md#Line 3`
- Objective: introduce DHCP client/server and distinguish server from gateway/router.
- Objects: same laptop, DHCP server, router/gateway, one LAN path.
- Visible text: “CLIENT”, “DHCP SERVER”, “GATEWAY”.
- Archetype / verb: Constellation / connects.
- Beginning state: retain NO IP on the laptop; four manual settings collapse into the DHCP service role.
- Action: client and server join the same LAN; the separate router icon lands at the side with GATEWAY. No message has been sent yet.
- Ending state: stable DORA diagram is established.
- Sound-off check: server and gateway are visibly different roles.
- Measured action beats: see frame 3 in the timing table.
- Review: PASS, sound-off snapshots at 0.18s, 6.38s and 13.18s; `review/final-preview-evidence/frame-06-at-20.8s.png` through `frame-08-at-33.8s.png`.

## Frame 4 — Discover

- duration: 13.026395s
- measured window: 34.063673–47.090068s
- src: compositions/frames/line-4.html
- status: built
- Narration: `SCRIPT.md#Line 4`
- Objective: establish client broadcast as a local search when a fresh client does not know the DHCP server address.
- Objects: same client/server/router/route, one DISCOVER packet, expanding broadcast rings.
- Visible text: “DISCOVER” / “BROADCAST”.
- Archetype / verb: Journey / radiates.
- Beginning state: use the stable diagram from frame 3; client still says NO IP.
- Action: packet leaves laptop, expands into blue broadcast rings across the LAN, reaches the server; no known-address arrow appears.
- Ending state: server has received the call; client remains unconfigured.
- Sound-off check: Discover starts at client and reaches the local network broadly.
- Measured action beats: see frame 4 in the timing table.
- Review: PASS, sound-off snapshots at 0.14s, 7.94s and 12.74s; `review/final-preview-evidence/frame-09-at-34.2s.png` through `frame-11-at-46.8s.png`.

## Frame 5 — Offer

- duration: 28.024626s
- measured window: 47.090068–75.114694s
- src: compositions/frames/line-5.html
- status: built
- Narration: `SCRIPT.md#Line 5`
- Objective: show the server's proposed configuration as a response, not a final assignment.
- Objects: same four diagram entities, OFFER packet/card, five value rows.
- Visible text: IP 192.168.1.25; SUBNET 255.255.255.0; GATEWAY 192.168.1.1; DNS 192.168.1.1; LEASE 24 HOURS; “OFFER · NOT CONFIRMED”.
- Archetype / verb: Journey / returns.
- Beginning state: same endpoints, route and NO IP state.
- Action: server sends OFFER up the established route; the five settings unfold beside it; amber provisional mark remains on the proposed IP.
- Ending state: client can see the offer, but still has NO IP.
- Sound-off check: values are legible and “OFFER” is clearly provisional.
- Measured action beats: see frame 5 in the timing table.
- Review: PASS, sound-off snapshots at 0.11s, 5.91s and 26.41s; `review/final-preview-evidence/frame-12-at-47.2s.png` through `frame-14-at-73.5s.png`.

## Frame 6 — Request

- duration: 9.613061s
- measured window: 75.114694–84.727755s
- src: compositions/frames/line-6.html
- status: built
- Narration: `SCRIPT.md#Line 6`
- Objective: client explicitly requests the offered settings.
- Objects: same entities and route, selected IP chip, REQUEST packet.
- Visible text: “REQUEST” / “192.168.1.25”.
- Archetype / verb: Journey / selects.
- Beginning state: keep offer values and client NO IP visible at scene start.
- Action: client highlights the offered address; REQUEST packet leaves laptop and travels down to the server. OFFER changes to SELECTED, not confirmed.
- Ending state: request arrives at server; client still has no usable assignment.
- Sound-off check: client chooses and requests the displayed offer.
- Measured action beats: see frame 6 in the timing table.
- Review: PASS, sound-off snapshots at 0.09s, 2.89s and 9.39s; `review/final-preview-evidence/frame-15-at-75.2s.png` through `frame-17-at-84.5s.png`.

## Frame 7 — Acknowledge

- duration: 13.792653s
- measured window: 84.727755–98.520408s
- src: compositions/frames/line-7.html
- status: built
- Narration: `SCRIPT.md#Line 7`
- Objective: ACK is final confirmation and produces the strongest visible state change.
- Objects: same entities/route, ACK packet, client state chip, green connection line.
- Visible text: “ACK” then “192.168.1.25 ✓”.
- Archetype / verb: Transformation / confirms.
- Beginning state: request has reached server; laptop still says NO IP.
- Action: ACK travels server-to-client; on receipt the NO IP badge swaps to 192.168.1.25 ✓ and the laptop's network route turns green.
- Ending state: laptop visibly has a usable assigned address.
- Sound-off check: the transition occurs exactly when ACK reaches the client.
- Measured action beats: see frame 7 in the timing table.
- Review: PASS, sound-off snapshots at 0.17s, 7.27s and 13.57s; `review/final-preview-evidence/frame-18-at-84.9s.png` through `frame-20-at-98.3s.png`.

## Frame 8 — More than an address

- duration: 12.608435s
- measured window: 98.520408–111.128844s
- src: compositions/frames/line-8.html
- status: built
- Narration: `SCRIPT.md#Line 8`
- Objective: make the configuration bundle understandable, not just the IP address.
- Objects: same configured laptop, IP/subnet/gateway/DNS badges, local network and external path.
- Visible text: “IP”, “SUBNET”, “GATEWAY”, “DNS”; all four example values remain visible.
- Archetype / verb: Constellation / expands.
- Beginning state: preserve 192.168.1.25 ✓ and the green connected state.
- Action: reveal subnet, gateway and DNS badges around the client; gateway path points outward and DNS badge links to a name/server glyph.
- Ending state: full starter configuration bundle is visible.
- Sound-off check: DHCP supplies multiple usable network settings.
- Measured action beats: see frame 8 in the timing table.
- Review: PASS, sound-off snapshots at 0.18s, 5.48s and 12.38s; `review/final-preview-evidence/frame-21-at-98.7s.png` through `frame-23-at-110.9s.png`.

## Frame 9 — A lease has a timer

- duration: 11.981497s
- measured window: 111.128844–123.110340s
- src: compositions/frames/line-9.html
- status: built
- Narration: `SCRIPT.md#Line 9`
- Objective: explain that a lease is time-limited, and durations vary.
- Objects: same configured client, 24h lease timer, address badge.
- Visible text: “LEASE · 24 HOURS” / “EXAMPLE”.
- Archetype / verb: Transformation / counts down.
- Beginning state: same assigned address remains visible.
- Action: timer advances from 24h toward an approaching expiry mark while the address stays on the client; small “example” tag qualifies duration.
- Ending state: address remains usable for the lease period, not owned permanently.
- Sound-off check: address has an expiry/renewal period rather than permanent ownership.
- Measured action beats: see frame 9 in the timing table.
- Review: PASS, sound-off snapshots at 0.17s, 4.87s and 11.67s; `review/final-preview-evidence/frame-24-at-111.3s.png` through `frame-26-at-122.8s.png`.

## Frame 10 — Renew before expiry

- duration: 12.678095s
- measured window: 123.110340–135.788435s
- src: compositions/frames/line-10.html
- status: built
- Narration: `SCRIPT.md#Line 10`
- Objective: show a renewal attempt before zero and a successful extension without promising the same IP forever.
- Objects: same client/server/router positions, renewal REQUEST packet, ACK reply, lease timer and address badge.
- Visible text: “RENEW” / “LEASE EXTENDED”.
- Archetype / verb: Journey / loops.
- Beginning state: timer is approaching expiry; 192.168.1.25 is still present.
- Action: client request travels to server before timer reaches zero; ACK retraces the route, the timer resets, and “LEASE EXTENDED” appears. Address stays in this successful example; a later `.25` is explicitly not guaranteed.
- Ending state: same lease continues in this example, with caveat that future address may differ.
- Sound-off check: renewal happens before expiry and requires a server response.
- Measured action beats: see frame 10 in the timing table.
- Review: PASS, sound-off snapshots at 0.09s, 4.89s and 12.39s; `review/final-preview-evidence/frame-27-at-123.2s.png` through `frame-29-at-135.5s.png`.

## Frame 11 — DORA recap

- duration: 15.743129s
- measured window: 135.788435–151.531565s
- src: compositions/frames/line-11.html
- status: built
- Narration: `SCRIPT.md#Line 11`
- Objective: recap the message sequence and show automatic configuration across several devices.
- Objects: laptop, phone, tablet, DHCP server, separate router, compact DORA route.
- Visible text: “DORA” with DISCOVER / OFFER / REQUEST / ACK; example `.25`, `.26`, `.27` labels.
- Archetype / verb: Constellation / assembles.
- Beginning state: inherit the configured laptop as first device.
- Action: phone and tablet join, each receives an example address chip; short D-O-R-A packets assemble along the familiar request/response route.
- Ending state: multiple automatically configured devices share the LAN; single takeaway lands.
- Sound-off check: viewers can recall DORA and see each device receive configuration automatically.
- Measured action beats: see frame 11 in the timing table.
- Review: PASS, sound-off snapshots at 0.11s, 6.21s and 15.51s; `review/final-preview-evidence/frame-30-at-135.9s.png` through `frame-32-at-151.3s.png`.

## Continuity and sketch review

Across frames 4–7 and 10, keep the client, server, router, LAN path and route endpoints identical. Only the packet, provisional offer card, lease timer and state chip change. Review `sketches/board.html` as a phone-size grid; all hero icons are local project assets. The approved script and actual-icon sketches preceded narration and frame construction. The measured preview follows the same approved scene plan.
