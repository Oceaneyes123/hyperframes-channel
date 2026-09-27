---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Timed storyboard

Measured with Supertonic 3: one WAV per scene, timings from `audio_meta.json`.
Local times below are retimed from the measured duration.

## Frame 1 — The question
- duration: 8.29s
- src: compositions/frames/line-1.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: Your Windows laptop has no network access. How does it reach your company's domain? Four different services make that happen.
- Planned window: 0.0–8.3s
- Narration reference: `SCRIPT.md#Line 1`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Frame the concrete question and place all five actors before any definition.
- Dominant visual: One stage: Windows laptop and access switch on the left, DHCP / DNS / NPS on the right.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, ap-ceiling.svg, srv-dhcp.svg, srv-dns.svg, srv-nps.svg
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 DNS server, 1 NPS appliance (5 objects)
- Text shown: HOW DOES A LAPTOP REACH THE DOMAIN? / SWITCH / AP · DHCP SERVER · DNS · NPS · NO ADDRESS
- Headline: ['How does a laptop', 'reach the domain?']
- Animation: Cable and trunk stroke on in three steps, then each service's glow lights in narration order.
- Beginning state: Nothing has happened yet; the laptop is on the network with no configuration plate values.
- Ending state: All four services are on stage and named; the plate still reads NO ADDRESS.
- Transition: cut
- Continuity: Client and access switch keep their coordinates for the rest of the video; DHCP stays right-top.
- Geometry source: frame.md slots ACCESS, CLIENT, LEFTSVC, SVC_A, SVC_B
- Complexity: 1 idea · 7 actions · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.5–1.0s | no network access | the laptop's cable to the access switch is drawn | `#r_cable` | not inspected |
| 1.0–1.5s |  | the trunk to the first service is drawn | `#r_trunk` | not inspected |
| 1.5–2.0s |  | the trunk branch to the second service is drawn | `#r_trunkb` | not inspected |
| 2.5–3.2s | four different services | DHCP server lights up as the first of four services | `#dhcp` | not inspected |
| 3.6–4.3s |  | DNS lights up as the second service | `#dns` | not inspected |
| 4.8–5.5s | company's domain | NPS lights up as the fourth service | `#nps` | not inspected |
| 6.0–6.6s |  | the plate still reads NO ADDRESS: nothing is configured yet | `#nps` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Viewer sees a laptop, an access switch and four named services with the question above them.
- Review samples: opening 0.6s, action 4.6s, resolved 7.5s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: First scene: not applicable.

## Frame 2 — Plugging in
- duration: 8.011s
- src: compositions/frames/line-2.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: First the laptop connects, by cable or by Wi-Fi. It is on the network now, but it still has no address of its own.
- Planned window: 0.0–8.0s
- Narration reference: `SCRIPT.md#Line 2`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Separate physical attachment from network configuration.
- Dominant visual: Laptop and access point joined by one drawn cable, with an empty configuration plate below.
- Icon assets: icons8 laptop.png; custom ap-ceiling.svg
- Required objects and counts: 1 laptop, 1 access point, 1 cable (3 objects)
- Text shown: ON THE NETWORK, NO ADDRESS / ACCESS POINT · NO ADDRESS
- Headline: No address yet
- Animation: The cable draws on, the access point glows, then the empty plate row is re-emphasised.
- Beginning state: Inherits frame 1's stage with the services removed; the plate is empty.
- Ending state: Laptop attached, plate still empty and emphasised.
- Transition: cut
- Continuity: The access point keeps its coordinate; DHCP returns to the right column.
- Geometry source: frame.md slots ACCESS, CLIENT
- Complexity: 1 idea · 4 actions · 2 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.8–1.9s | the laptop connects | the link between laptop and access point comes up | `#r_cable` | not inspected |
| 2.2–3.2s |  | the access point lights as the device the laptop attached to | `#access` | not inspected |
| 4.2–5.1s | on the network now | the plate under the laptop stays empty: no address was issued | `#access` | not inspected |
| 5.6–6.6s | no address of its own | NO ADDRESS is re-emphasised as the laptop's actual state | `#pD` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Viewer sees a working link above an empty configuration plate.
- Review samples: opening 0.6s, action 4.4s, resolved 7.2s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 1 end → 2 opening: client and access positions unchanged; service objects leave, the plate stays.

## Frame 3 — Discover
- duration: 8.15s
- src: compositions/frames/line-3.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: So it asks. DHCP Discover goes out as a broadcast across the local network. Is there a DHCP server here?
- Planned window: 0.0–8.2s
- Narration reference: `SCRIPT.md#Line 3`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Show Discover as a broadcast with an unknown destination.
- Dominant visual: A dashed route with a DISCOVER token running from the laptop to the DHCP server.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 DISCOVER token, 1 dashed route (5 objects)
- Text shown: IS ANYONE OUT THERE? / SWITCH · DHCP SERVER · DISCOVER
- Headline: Is anyone out there?
- Animation: Object reveal, then the dashed broadcast path strokes on, then the token follows the drawn polyline.
- Beginning state: Inherits frame 2's link; no DHCP server yet.
- Ending state: The DHCP server is lit; the token has arrived; the plate is still empty.
- Transition: cut
- Continuity: The switch stays; the dashed broadcast path is replaced by a solid reply route.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 5 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.7–1.3s | so it asks | the laptop is linked to the switch | `#r_cable` | not inspected |
| 1.6–2.4s |  | the DHCP server appears as the unknown destination | `#dhcp` | not inspected |
| 2.1–3.3s | goes out as a broadcast | a DASHED path is drawn: the client does not know the server's address | `#r_bcast` | not inspected |
| 2.8–5.1s | Discover | the DISCOVER token travels from the laptop through the switch to the server | `#t_disc` | not inspected |
| 4.6–5.7s | is there a DHCP server | the server answers the broadcast it just received | `#dhcp` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A dashed line plus a moving DISCOVER token reads as 'asking the whole network', arriving at the lit server.
- Review samples: opening 0.6s, action 4.5s, resolved 7.3s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 2 end → 3 opening: client and access unchanged; the frame adds the server and the dashed path.

## Frame 4 — Offer
- duration: 7.105s
- src: compositions/frames/line-4.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: A DHCP server answers with an offer, an address it is willing to lend before anything is confirmed.
- Planned window: 0.0–7.1s
- Narration reference: `SCRIPT.md#Line 4`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Show the Offer as a returned candidate configuration, not a final commitment.
- Dominant visual: OFFER token running the established route back, with the plate gaining an amber address.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 OFFER token (4 objects)
- Text shown: AN ADDRESS, OFFERED / SWITCH · DHCP SERVER · OFFER · IP 10.10.20.45 · OFFERED
- Headline: An address, offered
- Animation: The token travels the established polyline in reverse; then two plate rows reveal in amber.
- Beginning state: Inherits frame 3's found server; the reply route is solid, not dashed.
- Ending state: Plate shows IP 10.10.20.45 and OFFERED; the route is established.
- Transition: cut
- Continuity: The route, the server and the offered address all persist into the request scene.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 4 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.8s | a DHCP server answers | the OFFER token retraces the same route back to the laptop | `#t_offer` | not inspected |
| 3.1–4.0s | with an offer | the plate gains IP 10.10.20.45 — an offer, not yet a commitment | `#pA` | not inspected |
| 3.6–4.4s |  | the plate state is marked OFFERED | `#pD` | not inspected |
| 4.7–5.5s | before anything is confirmed | the laptop has a candidate address but nothing is confirmed | `#client` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: The same route travelled in reverse with an OFFER token, ending in an amber address on the laptop.
- Review samples: opening 0.6s, action 3.9s, resolved 6.4s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 3 end → 4 opening: same three devices and same route; only direction and the plate change.

## Frame 5 — Request
- duration: 5.503s
- src: compositions/frames/line-5.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: The laptop replies with a request, asking that server to keep that exact offer for it.
- Planned window: 0.0–5.5s
- Narration reference: `SCRIPT.md#Line 5`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Show Request as the selection step between offer and acknowledgement.
- Dominant visual: REQUEST token on the established route, server lit in reply.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 REQUEST token (4 objects)
- Text shown: ASKING TO KEEP IT / REQUEST · DHCP SERVER · OFFERED
- Headline: Asking to keep it
- Animation: Token travel along the route, then emphasis glows at the two endpoints.
- Beginning state: Inherits frame 4: address on the plate, marked OFFERED.
- Ending state: Server has been asked; the plate is unchanged and still provisional.
- Transition: cut
- Continuity: The plate values and the route persist into the ACK scene.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 3 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–3.1s | the laptop replies | the REQUEST token travels the same route toward the server | `#t_req` | not inspected |
| 3.3–4.1s | that exact offer | the server receives the selection of that exact offer | `#dhcp` | not inspected |
| 4.2–4.8s |  | the laptop still holds the offered address while it waits for confirmation | `#client` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A REQUEST token travelling to the lit server explains selection without narration.
- Review samples: opening 0.6s, action 3.0s, resolved 5.0s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 4 end → 5 opening: identical stage and plate; only the token's direction changes.

## Frame 6 — Acknowledge
- duration: 6.409s
- src: compositions/frames/line-6.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: The server acknowledges. The lease is committed, and the laptop has working network settings.
- Planned window: 0.0–6.4s
- Narration reference: `SCRIPT.md#Line 6`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Close DORA and show the committed configuration.
- Dominant visual: ACK token returning; the plate completing; a green LEASE ACTIVE mark.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg; Font Awesome circle-check
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 ACK token, 1 result mark (5 objects)
- Text shown: THE LEASE IS COMMITTED / ACK · GW 10.10.20.1 · DNS 10.10.1.10 · LEASED
- Headline: Lease committed
- Animation: Return travel, the remaining plate rows revealing, then the LEASED state and the result mark.
- Beginning state: Inherits frame 5: address offered, awaiting confirmation.
- Ending state: Plate complete and marked LEASED; LEASE ACTIVE visible.
- Transition: cut
- Continuity: The full plate is inherited by every later scene, so the viewer can always see what DHCP gave.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 4 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.9–2.6s | the server acknowledges | the ACK token returns along the same route to the laptop | `#t_ack` | not inspected |
| 2.8–3.6s | the lease is committed | the plate gains the default gateway | `#pB` | not inspected |
| 3.2–3.8s |  | the plate gains the DNS server — the setting the next scene depends on | `#pC` | not inspected |
| 4.5–5.4s | working network settings | LEASE ACTIVE confirms the committed configuration | `#o_lease` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A returning ACK, a filling plate and a green result mark prove the exchange finished.
- Review samples: opening 0.6s, action 3.5s, resolved 5.8s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 5 end → 6 opening: same stage, same plate; this frame is the first to show a result mark.

## Frame 7 — The configuration bundle
- duration: 7.872s
- src: compositions/frames/line-7.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: DHCP delivered four things: an IP address, a subnet mask, a default gateway, and a DNS server.
- Planned window: 0.0–7.9s
- Narration reference: `SCRIPT.md#Line 7`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Enumerate exactly what DHCP supplied, and single out the DNS value.
- Dominant visual: Four stacked value rows in the left band beside the lit DHCP server.
- Icon assets: icons8 laptop.png; custom srv-dhcp.svg
- Required objects and counts: 1 laptop, 1 DHCP server, 4 value rows (6 objects)
- Text shown: WHAT DHCP HANDED OVER / IP · MASK · GATEWAY · DNS
- Headline: What DHCP handed over
- Animation: Four rows reveal in order; the DNS row's color changes at the end.
- Beginning state: Inherits frame 6: the plate is complete and marked LEASED.
- Ending state: Four listed values with the DNS row in the discovery color.
- Transition: cut
- Continuity: The listed values and the DNS emphasis carry into the 'why DNS matters' scene unchanged.
- Geometry source: frame.md slots CLIENT, SVC_A
- Complexity: 1 idea · 6 actions · 2 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.8–1.6s | DHCP delivered four things | the server that supplied the bundle stays lit | `#dhcp` | not inspected |
| 1.3–2.2s |  | the IP address is listed first | `#q1` | not inspected |
| 2.2–3.0s | a subnet mask | the subnet mask is added | `#q2` | not inspected |
| 3.1–3.9s | a default gateway | the default gateway is added — the way off this subnet | `#q3` | not inspected |
| 4.4–5.4s | and a DNS server | the DNS server is added as the fourth value | `#q4` | not inspected |
| 5.8–6.9s |  | the DNS row changes color: it is the one the domain depends on | `#q4` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Four labelled values appear one by one; the last changes color.
- Review samples: opening 0.6s, action 4.3s, resolved 7.1s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 6 end → 7 opening: same client and server; the result mark is replaced by the value list.

## Frame 8 — Why the DNS setting matters
- duration: 9.125s
- src: compositions/frames/line-8.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: In a domain, that last setting matters most. A wrong DNS server still lets you browse the internet, but you will never find the domain.
- Planned window: 0.0–9.1s
- Narration reference: `SCRIPT.md#Line 8`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Make the DNS server setting the single critical value for a domain client.
- Dominant visual: Query token to DNS, then DNS lighting the Domain Controller with a green / amber verdict pair.
- Icon assets: icons8 laptop.png; custom srv-dns.svg, srv-dc.svg; Font Awesome circle-check, circle-xmark
- Required objects and counts: 1 laptop, 1 DNS server, 1 Domain Controller, 1 query token, 2 verdict rows (6 objects)
- Text shown: DNS IS THE ONE THAT MATTERS / NAME QUERY · DOMAIN FOUND · NO DOMAIN
- Headline: ['DNS is the one', 'that matters']
- Animation: Token travel, two glows along the chain, then two verdict rows reveal.
- Beginning state: Inherits frame 7: the four supplied values are established, with DNS emphasised.
- Ending state: DNS and the Domain Controller both lit, with both verdicts visible.
- Transition: cut
- Continuity: The DNS and Domain Controller coordinates persist; the query token is replaced by the DC locator query.
- Geometry source: frame.md slots CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 5 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.9–2.2s | that last setting matters most | the laptop sends a name query along the established route to DNS | `#t_q` | not inspected |
| 2.7–4.0s | a wrong DNS server | DNS holds the record that points at the domain controller | `#dns` | not inspected |
| 4.2–5.5s | you will never find the domain | with the right DNS answer the Domain Controller is reachable | `#dc` | not inspected |
| 5.7–6.6s |  | DOMAIN FOUND: the query resolved to a directory service | `#o_ok` | not inspected |
| 6.8–7.8s |  | NO DOMAIN is shown as the consequence of a wrong DNS server | `#o_bad` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A token reaching DNS and then the DC, plus a green and an amber verdict, explains the dependency.
- Review samples: opening 0.6s, action 5.0s, resolved 8.2s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 7 end → 8 opening: client and plate identical; the value list leaves, DNS enters at the top right.

## Frame 9 — The discovery question
- duration: 7.593s
- src: compositions/frames/line-9.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: So the laptop asks DNS a direct question: where is a domain controller for the domain corp dot example?
- Planned window: 0.0–7.6s
- Narration reference: `SCRIPT.md#Line 9`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Frame domain controller location as a directed DNS lookup.
- Dominant visual: Query token to a lit DNS server with the question stated above the client.
- Icon assets: icons8 laptop.png; custom srv-dns.svg
- Required objects and counts: 1 laptop, 1 DNS server, 1 query token, 1 question row (4 objects)
- Text shown: WHERE IS THE DC? / DNS QUERY · WHERE IS THE DC FOR CORP.EXAMPLE?
- Headline: Where is the DC?
- Animation: The question row reveals, the token travels the route, DNS glows on arrival.
- Beginning state: Inherits frame 8's client, DNS position and the established route.
- Ending state: Query delivered; DNS lit; the question still on screen.
- Transition: cut
- Continuity: DNS keeps its position; the answer and the located Domain Controller follow.
- Geometry source: frame.md slots CLIENT, SVC_A
- Complexity: 1 idea · 3 actions · 2 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.1–2.3s | asks DNS a direct question | the question the client must answer is stated as a query, not a broadcast | `#qask` | not inspected |
| 1.8–4.3s | where is a domain controller | the query token travels the established route to DNS | `#t_dnsq` | not inspected |
| 4.7–5.9s | for the domain | DNS receives a directed lookup about the domain | `#dns` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A token reaching DNS with the literal question on screen shows a lookup, not a broadcast.
- Review samples: opening 0.6s, action 4.2s, resolved 6.8s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 8 end → 9 opening: DNS stays top-right; the Domain Controller and verdicts leave the frame.

## Frame 10 — The service record
- duration: 7.941s
- src: compositions/frames/line-10.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: DNS answers with a service record, an S R V record, that names the domain controller's host and its address.
- Planned window: 0.0–7.9s
- Narration reference: `SCRIPT.md#Line 10`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Explain SRV at the level of 'a record that names a service host', and hand the client a target.
- Dominant visual: The SRV record name above the client and an answer token from DNS to the located Domain Controller.
- Icon assets: icons8 laptop.png; custom srv-dns.svg, srv-dc.svg; Font Awesome circle-check
- Required objects and counts: 1 laptop, 1 DNS server, 1 Domain Controller, 1 SRV token, 2 answer rows (6 objects)
- Text shown: THE SRV ANSWER / SRV RECORD · HOST: DC01 · IP: 10.10.1.10
- Headline: The SRV answer
- Animation: Record name reveals; a new route strokes down the gutter; the controller appears; the token travels; two rows resolve.
- Beginning state: Inherits frame 9: DNS lit, query delivered.
- Ending state: Domain Controller visible with host and address resolved beneath it.
- Transition: cut
- Continuity: The Domain Controller keeps its SVC_B position for the connection and sign-in scenes.
- Geometry source: frame.md slots CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 6 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.8–1.7s | DNS answers with a service record | the SRV name DNS holds is shown as read-only evidence | `#qrec` | not inspected |
| 1.9–3.2s |  | a route is drawn from DNS down to the directory | `#r_svclink` | not inspected |
| 2.4–4.4s | an SRV record | the Domain Controller appears as the record's target | `#dc` | not inspected |
| 3.2–5.4s |  | the SRV answer travels from DNS to the located controller | `#t_srv` | not inspected |
| 5.6–6.5s | that names the host and its address | the record names the host | `#o_host` | not inspected |
| 6.4–7.3s |  | and the address the client will use | `#o_addr` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A named record, a drawn route and two resolved rows show DNS handing over a target.
- Review samples: opening 0.6s, action 4.4s, resolved 7.1s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 9 end → 10 opening: DNS unchanged; this frame adds the directory below it.

## Frame 11 — Contacting the Domain Controller
- duration: 8.22s
- src: compositions/frames/line-11.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: With a name and an address, the laptop now contacts that domain controller directly, to confirm it is alive and reachable.
- Planned window: 0.0–8.2s
- Narration reference: `SCRIPT.md#Line 11`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Close the discovery loop with a real exchange to the located controller.
- Dominant visual: A direct route to the Domain Controller with a contact token and a green result.
- Icon assets: icons8 laptop.png; custom srv-dns.svg, srv-dc.svg; Font Awesome circle-check
- Required objects and counts: 1 laptop, 1 DNS server (dimmed), 1 Domain Controller, 1 contact token, 1 result row (5 objects)
- Text shown: REACHING THE DC / LDAP PING · DC IS ALIVE
- Headline: Reaching the DC
- Animation: A direct route strokes, the token travels it, the controller glows, then the result reveals.
- Beginning state: Inherits frame 10: controller located with host and address on screen.
- Ending state: Controller confirmed reachable; DNS stays visible but dimmed.
- Transition: cut
- Continuity: The controller stays in place; the next scene adds the user's identity.
- Geometry source: frame.md slots CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 4 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.8s | with a name and an address | the client now addresses the controller directly | `#r_linkb` | not inspected |
| 2.5–5.4s | contacts that domain controller directly | the contact token travels from the laptop to the located controller | `#t_ldap` | not inspected |
| 5.8–6.7s |  | the controller answers: it is running and reachable | `#dc` | not inspected |
| 6.9–7.7s | alive and reachable | DC IS ALIVE confirms the discovery ended in a working endpoint | `#o_alive` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: The token reaching the lit controller and a green result prove the connection happened.
- Review samples: opening 0.6s, action 4.5s, resolved 7.4s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 10 end → 11 opening: identical objects; the answer rows are replaced by the live exchange.

## Frame 12 — Domain sign-in
- duration: 10.101s
- src: compositions/frames/line-12.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: The user signs in. The identity travels to the domain controller, Kerberos carries the authentication, and the account is checked in Active Directory.
- Planned window: 0.0–10.1s
- Narration reference: `SCRIPT.md#Line 12`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Give the high-level shape of domain authentication without ticket internals.
- Dominant visual: Identity token to the controller, then an account check from the controller into Active Directory.
- Icon assets: icons8 laptop.png; custom srv-dc.svg; Font Awesome sitemap, key, circle-check
- Required objects and counts: 1 laptop, 1 Domain Controller, 1 directory object, 2 tokens, 1 credential mark, 1 result row (7 objects)
- Text shown: WHO ARE YOU? / IDENTITY · KERBEROS · ACCOUNT CHECK · SIGNED IN
- Headline: Who are you?
- Animation: Identity token travel, credential reveal, a new route strokes, the account token travels, result reveals.
- Beginning state: Inherits frame 11: controller confirmed reachable.
- Ending state: Identity verified; the directory is on stage and marked checked.
- Transition: cut
- Continuity: The directory object and the controller persist into the 802.1X half of the video.
- Geometry source: frame.md slots CLIENT, LEFTSVC, SVC_B
- Complexity: 1 idea · 6 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–3.4s | the user signs in | the user's identity leaves the laptop along the established route | `#t_ident` | not inspected |
| 3.0–5.9s | the identity travels | it arrives at the domain controller — Kerberos carries the sign-in | `#t_ident` | not inspected |
| 4.6–5.9s | Kerberos carries the authentication | a credential mark appears beside the directory as the check begins | `#g_key` | not inspected |
| 5.7–7.5s |  | a route is drawn from the controller into the directory | `#r_dc2ad` | not inspected |
| 6.5–8.7s |  | the account check travels from the controller to Active Directory | `#t_check` | not inspected |
| 8.7–9.7s | checked in Active Directory | SIGNED IN: the identity was verified against the directory | `#o_signin` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Two tokens and a green result show an identity being checked against a directory.
- Review samples: opening 0.6s, action 5.6s, resolved 9.1s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 11 end → 12 opening: controller unmoved; this frame adds the directory and the identity exchange.

## Frame 13 — A different kind of network
- duration: 8.29s
- src: compositions/frames/line-13.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: That is the normal path. But some corporate networks will not hand out a working port at all until the device proves who it is.
- Planned window: 0.0–8.3s
- Narration reference: `SCRIPT.md#Line 13`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Introduce the conditional case: network access can itself require authentication.
- Dominant visual: A locked switch port, a blocked dashed route, and NPS appearing in the right column.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-nps.svg; Font Awesome lock
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 1 port lock, 1 blocked route, 1 result row (6 objects)
- Text shown: NOT EVERY PORT IS OPEN / SWITCH PORT · NPS · PORT LOCKED · NO NETWORK
- Headline: Not every port opens
- Animation: Lock reveals, result row reveals, NPS appears, the blocked dashed route strokes on, NPS glows.
- Beginning state: Inherits the client and the DNS/DC stage, but the services have left: this is a different network.
- Ending state: Locked port, blocked path, NPS present; the plate reads NO NETWORK.
- Transition: cut
- Continuity: NPS keeps the SVC_A position for the RADIUS and verdict scenes; the switch keeps the access position.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 5 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.2s | that is the normal path | a lock appears on the switch port: it is not open yet | `#g_lock` | not inspected |
| 2.0–3.2s |  | PORT LOCKED states the device's situation | `#o_locked` | not inspected |
| 3.3–4.5s | some corporate networks | NPS is the service that will decide whether the port opens | `#nps` | not inspected |
| 4.1–5.3s |  | the blocked path shows there is no route to the network behind it | `#r_trunk` | not inspected |
| 6.0–7.1s | until the device proves who it is | the decision belongs to NPS, not to the device | `#nps` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A padlock on the port and a blocked path explain the gate without narration.
- Review samples: opening 0.6s, action 4.6s, resolved 7.5s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 12 end → 13 opening: client and its route unchanged; a deliberate scene change to the conditional path.

## Frame 14 — The three roles
- duration: 11.981s
- src: compositions/frames/line-14.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: That is where 802.1X comes in. The laptop is the supplicant. The switch or access point is the authenticator. And NPS is the RADIUS server behind it.
- Planned window: 0.0–12.0s
- Narration reference: `SCRIPT.md#Line 14`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Attach the correct 802.1X name to each of the three devices.
- Dominant visual: Three labelled role rows beside the frame's three-device chain, with a token running it.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-nps.svg; Font Awesome sitemap
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 1 directory object, 1 token, 3 role rows (8 objects)
- Text shown: THREE ROLES / SUPPLICANT · AUTHENTICATOR · RADIUS SERVER
- Headline: Three roles
- Animation: Role rows reveal in order with matching glows, then the token runs the whole chain.
- Beginning state: Inherits frame 13: locked port, NPS present.
- Ending state: All three roles labelled; the identity token has reached NPS; the directory is lit.
- Transition: cut
- Continuity: The three objects keep their positions; the next scene isolates the switch-to-NPS leg.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 6 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.4s | 802.1X | the laptop is named as the supplicant | `#c_sup` | not inspected |
| 2.2–3.6s |  | the supplicant is the entity being authenticated | `#client` | not inspected |
| 3.6–5.0s | the authenticator | the switch is named as the authenticator | `#c_aut` | not inspected |
| 5.0–6.5s | RADIUS server | NPS is named as the RADIUS server | `#c_rad` | not inspected |
| 6.0–8.6s |  | an identity token travels from the laptop through the switch to NPS | `#t_id14` | not inspected |
| 9.3–10.8s | Active Directory | Active Directory stands behind NPS as the identity store | `#ad` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Three labelled rows tied to three objects, plus a token running between them.
- Review samples: opening 0.6s, action 6.6s, resolved 10.8s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 13 end → 14 opening: the lock and the blocked path give way to the role legend and the chain.

## Frame 15 — Who sends the RADIUS request
- duration: 9.543s
- src: compositions/frames/line-15.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: The laptop never talks to NPS. The switch or access point sends the RADIUS request on its behalf, because that is the device holding the port.
- Planned window: 0.0–9.5s
- Narration reference: `SCRIPT.md#Line 15`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Kill the misconception that the client talks to NPS directly.
- Dominant visual: A struck-out direct path above the real switch-to-NPS path carrying a RADIUS token.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-nps.svg; Font Awesome circle-xmark
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 2 routes, 1 strike mark, 1 token, 1 result row (8 objects)
- Text shown: THE SWITCH ASKS, NOT YOU / RADIUS ACCESS-REQUEST · NOT FROM THE DEVICE
- Headline: ['The switch asks,', 'not you']
- Animation: Wrong path draws, strike mark appears, real path draws, RADIUS token travels, result row reveals.
- Beginning state: Inherits frame 14's three objects and the established client route.
- Ending state: RADIUS request delivered to NPS by the switch; the direct path visibly rejected.
- Transition: cut
- Continuity: NPS keeps its position and its request; the next scene opens the decision itself.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 5 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.5s | the laptop never talks to NPS | a dashed path from the laptop straight to NPS is drawn to be disproved | `#r_bad` | not inspected |
| 2.3–3.4s |  | that direct path is struck out: the device does not send RADIUS | `#g_x` | not inspected |
| 3.8–5.2s | the switch or access point sends | the real path runs from the switch to NPS | `#r_trunk` | not inspected |
| 5.0–7.3s | the RADIUS request | the RADIUS access-request token travels from the switch to NPS | `#t_rad` | not inspected |
| 7.6–8.8s | on its behalf | NOT FROM THE DEVICE closes the misconception | `#o_notdev` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A crossed-out line and a lit real path answer 'who sends this?' without narration.
- Review samples: opening 0.6s, action 5.2s, resolved 8.6s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 14 end → 15 opening: same three objects; the role legend is replaced by the RADIUS exchange.

## Frame 16 — NPS decides
- duration: 9.334s
- src: compositions/frames/line-16.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: NPS receives the request, matches it against its connection and network policies, and checks the identity against Active Directory.
- Planned window: 0.0–9.3s
- Narration reference: `SCRIPT.md#Line 16`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Show what NPS actually evaluates, and that AD identity is an input, not NPS's substitute.
- Dominant visual: NPS with three check rows and a drawn route from Active Directory into it.
- Icon assets: custom srv-nps.svg; Font Awesome sitemap, circle-check; icons8 laptop.png; custom switch-lan.svg
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 1 directory object, 1 token, 3 check rows (8 objects)
- Text shown: POLICIES, THEN IDENTITY / CONNECTION POLICY · NETWORK POLICY · IDENTITY IN AD
- Headline: Policies, then identity
- Animation: Request token arrives; three check rows reveal in sequence; a route strokes from the directory into NPS.
- Beginning state: Inherits frame 15: the RADIUS request has been delivered by the switch.
- Ending state: All three checks visible; NPS lit; the directory connected to it.
- Transition: cut
- Continuity: The three checks and the request stay; the next scene produces the answer.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 6 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.7–2.8s | NPS receives the request | the access-request arrives at NPS from the switch | `#t_rad16` | not inspected |
| 2.8–4.1s | connection and network policies | the request is matched against a connection request policy | `#o_crp` | not inspected |
| 3.9–5.2s |  | a network policy then authorises or refuses the connection | `#o_np` | not inspected |
| 5.0–6.3s | checks the identity | a route is drawn from the directory into NPS: identity is checked in AD | `#r_adsvc` | not inspected |
| 6.2–7.5s |  | IDENTITY IN AD confirms the credential check | `#o_id` | not inspected |
| 7.7–8.8s | against Active Directory | NPS holds the combined result and is ready to answer | `#nps` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Three ticked rows and a drawn AD connection show what the decision is made of.
- Review samples: opening 0.6s, action 5.1s, resolved 8.4s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 15 end → 16 opening: the same NPS and switch, now with the directory beside them.

## Frame 17 — The verdict
- duration: 7.593s
- src: compositions/frames/line-17.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: Then it answers. Access-Accept opens the port. Access-Reject leaves the device with no network access at all.
- Planned window: 0.0–7.6s
- Narration reference: `SCRIPT.md#Line 17`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Show the two possible answers and the port-state consequence of each.
- Dominant visual: One switch port between separate amber reject and green accept fields; the accepted reply unlocks that same port.
- Icon assets: custom srv-nps.svg, switch-lan.svg; Font Awesome lock, lock-open, circle-check, circle-xmark
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 2 sequential replies, 2 verdict rows, 1 port shown closed then open.
- Text shown: ONE OF TWO ANSWERS / ACCESS-ACCEPT · ACCESS-REJECT
- Headline: One of two answers
- Scene archetype: Decision machine
- Primary motion verb: compare and lock
- Animation: The reject reply retraces NPS→switch and holds the port shut; after it clears, the accept reply follows the same route and unlocks the port.
- Beginning state: Inherits frame 16: the decision inputs are all visible at NPS.
- Ending state: Access-Accept shown with an open port; the reject case visible for contrast.
- Transition: hard cut
- Transition grammar: the identity checks give way to their two possible port verdicts
- Continuity: The open port is the precondition for the normal path that follows.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 2 verdict states · 3 persistent devices

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.2–0.8s | then it answers | One connected route lights from NPS back to the switch | `#r_trunk` | 0.63s local (134.1s global) — `review/improvement-pilot/frame-01-at-134.1s.png`; pass: route and persistent endpoints are visible. |
| 0.8–2.4s | Access-Reject | The reject reply follows that route and arrives at the switch | `#t_no` | 2.43s local (135.9s global), 3.03s (136.5s) — `frame-02-at-135.9s.png`, `frame-03-at-136.5s.png`; pass: the amber reply travels to the same switch. |
| 2.4–3.3s | leaves the device with no network access | The reject result appears and the switch port is visibly closed | `#o_no`, `#g_closed` | 3.03s local (136.5s global) — `frame-03-at-136.5s.png`; pass: reject is shown beside a closed port. |
| 3.4–3.8s |  | Reject marker clears before the alternate reply | `#t_no` | 4.63s local (138.1s global) — `frame-04-at-138.1s.png`; pass: reject token has cleared before the green reply arrives. |
| 3.9–5.5s | Access-Accept | The accept reply follows the same route to the same switch | `#t_ok` | 4.63s local (138.1s global) — `frame-04-at-138.1s.png`; pass: green token follows the established route toward that switch. |
| 5.5–6.9s | opens the port | The accept result appears and that port changes to open | `#o_ok`, `#g_closed`, `#g_open`, `#access` | 7.03s local (140.5s global) — `frame-05-at-140.5s.png`; pass: accept is shown and the same port is open. |

- Intentional hold over 3s: none
- Sound-off check: A closed lock becoming an open lock next to the two verdict rows is readable with sound off.
- Review samples (audio-local times): opening 0.63s; reject in transit 2.43s; reject/closed 3.03s; accept in transit 4.63s; accept/open 7.03s.
- Inspected evidence: `review/improvement-pilot/contact-sheet.jpg` (133.4–141.2s global); pass: reject closes the switch port, accept retraces the same route and opens it, with no visible text overlap.
- Adjacent-cut review: frame 16 end → 17 opening inspected at 133.4s and 134.1s; pass: the switch and NPS remain in place. Frame 17 end → 18 opening inspected at 140.5s and 141.2s; pass: the accepted/open port state persists.

## Frame 18 — And then the normal path
- duration: 7.663s
- src: compositions/frames/line-18.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: Once the port opens, everything you already saw happens next. DHCP, then DNS, then the domain controller.
- Planned window: 0.0–7.7s
- Narration reference: `SCRIPT.md#Line 18`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Re-attach the normal path after the conditional gate.
- Dominant visual: Two tokens running the established chain from the laptop to DHCP and on to the controller.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg, srv-dc.svg; Font Awesome lock-open
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 Domain Controller, 2 tokens, 1 result row (7 objects)
- Text shown: THEN THE NORMAL PATH / DHCP · DHCP SERVER · SIGN-IN · DC NEXT
- Headline: Then the normal path
- Animation: The open lock is re-emphasised, then two tokens travel the chain in order, then the result reveals.
- Beginning state: Inherits frame 17: the port has been opened by an accepted RADIUS reply.
- Ending state: The chain replayed in order with the destination named.
- Transition: cut
- Continuity: The same chain is then contrasted with a network that has no 802.1X at all.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 4 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.8–1.5s | once the port opens | the port is already open, so the normal path can start | `#g_open` | not inspected |
| 1.2–3.5s |  | the DHCP exchange runs again on this network | `#t_dhcp` | not inspected |
| 4.0–5.5s | then DNS | the DNS lookup and the sign-in follow the same chain | `#t_dc` | not inspected |
| 6.0–6.9s | then the domain controller | DC NEXT names the destination of the chain | `#o_next` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Ordered token travel along already-learned routes shows the sequence without narration.
- Review samples: opening 0.6s, action 4.2s, resolved 6.9s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 17 end → 18 opening: the open port persists; NPS leaves and DHCP returns to the right column.

## Frame 19 — NPS is conditional
- duration: 10.101s
- src: compositions/frames/line-19.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: On a network without 802.1X, NPS never appears in this flow. DHCP and DNS take the device straight to the domain.
- Planned window: 0.0–10.1s
- Narration reference: `SCRIPT.md#Line 19`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: State clearly that NPS is conditional, not part of every DHCP-to-DC flow.
- Dominant visual: The open-switch chain with a dimmed NPS object and no policy route.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-dhcp.svg, srv-nps.svg; Font Awesome lock-open, circle-check
- Required objects and counts: 1 laptop, 1 switch, 1 DHCP server, 1 dimmed NPS, 1 result row (5 objects)
- Text shown: NPS IS NOT IN EVERY FLOW / PORT OPEN · NPS — NOT IN THIS FLOW
- Headline: ['NPS is not in', 'every flow']
- Animation: Open port emphasised, result row reveals, DHCP glows, NPS dims to grey, the free chain strokes on.
- Beginning state: Inherits frame 18's chain and open port; this scene removes the gate.
- Ending state: Chain running with NPS visibly excluded; contrast stated.
- Transition: cut
- Continuity: The contrast is then compressed into the complete flow and the closing summary.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A, SVC_B
- Complexity: 1 idea · 5 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.0–2.2s | a network without 802.1X | with no 802.1X the port is open from the start | `#g_open` | not inspected |
| 2.6–3.8s |  | PORT OPEN states the contrast with the gated network | `#o_open` | not inspected |
| 4.2–5.7s | NPS never appears in this flow | DHCP is the first thing the device meets, not NPS | `#dhcp` | not inspected |
| 5.9–7.1s |  | NPS is dimmed: it is present in the diagram but unused here | `#nps` | not inspected |
| 7.3–8.7s | straight to the domain | the chain to the domain runs without any policy decision | `#r_self` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: A dimmed NPS beside a green open port and a running chain states the contrast visually.
- Review samples: opening 0.6s, action 5.6s, resolved 9.1s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 18 end → 19 opening: same client, switch and DHCP; the controller is replaced by the dimmed NPS.

## Frame 20 — The complete flow
- duration: 9.334s
- src: compositions/frames/line-20.html
- status: built
- blueprint: icon-led-diagram
- transition_in: cut
- voiceover: Put it together. Authenticate at the port, get your settings from DHCP, find the domain in DNS, and sign in at the domain controller.
- Planned window: 0.0–9.3s
- Narration reference: `SCRIPT.md#Line 20`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Reassemble all four responsibilities into one ordered flow.
- Dominant visual: Four numbered step rows lighting in turn beside the running identity chain.
- Icon assets: icons8 laptop.png; custom switch-lan.svg, srv-nps.svg
- Required objects and counts: 1 laptop, 1 switch, 1 NPS appliance, 1 token, 4 step rows, 1 plate (8 objects)
- Text shown: PUT IT TOGETHER / 1 AUTHENTICATE · 2 DHCP · 3 DNS · 4 SIGN IN
- Headline: Put it together
- Animation: Token travel plus four step rows recoloring in narration order.
- Beginning state: Inherits the full stage: client, switch, NPS and the plate from the agreed values.
- Ending state: Four ordered steps lit; nothing new introduced.
- Transition: cut
- Continuity: The final scene reduces these four to their jobs.
- Geometry source: frame.md slots ACCESS, CLIENT, SVC_A
- Complexity: 1 idea · 5 actions · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.7–2.8s | put it together | the identity travels from the device through the switch to NPS | `#t_flow` | not inspected |
| 1.1–2.2s |  | step 1 is the network authentication at the port | `#s1` | not inspected |
| 3.2–4.3s | get your settings from DHCP | step 2 is DHCP configuring the device | `#s2` | not inspected |
| 5.2–6.3s | find the domain in DNS | step 3 is DNS locating the domain | `#s3` | not inspected |
| 6.9–8.0s | sign in at the domain controller | step 4 is the sign-in at the domain controller | `#s4` | not inspected |

- Intentional hold over 3s: none
- Sound-off check: Four numbered rows lighting in order beside the running chain give the whole flow with no sound.
- Review samples: opening 0.6s, action 5.1s, resolved 8.4s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 19 end → 20 opening: the stage returns to client, switch and NPS with the plate intact.

## Frame 21 — The takeaway
- duration: 12.469s
- src: compositions/frames/line-21.html
- status: built
- blueprint: responsibility-quad
- transition_in: cut
- voiceover: Four services, four jobs. NPS decides access. DHCP configures the network. DNS finds the domain. The domain controller handles identity and domain services.
- Planned window: 0.0–12.5s
- Narration reference: `SCRIPT.md#Line 21`
- Timing source: audio_meta.json `start_s`/`duration_s`
- Learning objective: Close on the one-line job of each service.
- Dominant visual: Four equal service objects on one stage, each with a short job line.
- Icon assets: custom srv-dhcp.svg, srv-dns.svg, srv-nps.svg, srv-dc.svg
- Required objects and counts: 4 service objects, each with a name and a job line (4 objects)
- Text shown: FOUR SERVICES, FOUR JOBS / SETS NETWORK · FINDS DOMAIN · DECIDES ACCESS · IDENTITY + AD
- Headline: ['Four services,', 'four jobs']
- Animation: Each object's glow lights in narration order; nothing moves between them.
- Beginning state: A clean stage: the earlier two-column diagram is replaced by the comparison.
- Ending state: All four jobs stated; the video ends here.
- Transition: cut
- Continuity: Final scene.
- Geometry source: frame.md slots Q1, Q2, Q3, Q4
- Complexity: 1 idea · 4 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 1.2–3.0s | NPS decides access | NPS is named first: it decides access | `#q_nps` | not inspected |
| 3.7–5.5s | DHCP configures the network | DHCP configures the network | `#q_dhcp` | not inspected |
| 6.5–8.2s | DNS finds the domain | DNS finds the domain | `#q_dns` | not inspected |
| 9.2–11.2s | identity and domain services | the Domain Controller handles identity and domain services | `#q_dc` | not inspected |

- Intentional hold over 3s: n/a — each object is lit within 1.5s of the previous.
- Sound-off check: Four labelled objects with distinct job lines summarise the whole lesson without sound.
- Review samples: opening 0.6s, action 6.9s, resolved 11.2s
- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state
- Adjacent-cut review: Frame 20 end → 21 opening: deliberate stage change to the four-way comparison for the close.

