---
format: 1080x1920
fps: 30
captions: off
bgm: off
duration: no fixed limit
mode: collaborative
---

# Timed storyboard — planning pass

Visual direction: dark full-portrait stage; oversized local colored icons; client stays left/lower, infrastructure stays center/right; one causal packet/query/decision per frame; NPS is visibly conditional while DHCP → DNS → DC is the normal path. Use actual icons from `ICON_PLAN.json` in `sketches/board.html`.

## Frame 1 — Hook
- duration: 10.170340s
- src: compositions/frames/line-1.html
- status: outline
- blueprint: compose
- Measured window: 0.000000–10.170340s`n- transition_in: cut
- voiceover: How does a Windows laptop go from no network access to talking to a Domain Controller? Four services may appear in the story, but they do different jobs.
- learning objective: establish the question and all four service roles without defining them yet.
- dominant visual: laptop, switch/AP, NPS, DHCP, DNS, and Domain Controller connected in one tall route.
- icon assets: public/icons/laptop.svg, public/icons/network-wired.svg, public/icons/shield-halved.svg, public/icons/server.svg, public/icons/globe.svg, public/icons/database.svg.
- required objects and counts: 1 laptop, 1 switch/AP, 4 service nodes, 1 route.
- text shown: How does a laptop reach the domain?; NPS; DHCP; DNS; DC.
- beginning state: laptop has no network-access check and no IP.
- ending state: all role nodes are visible; NPS node is amber/conditional, normal path is blue.
- continuity: preserve laptop and service coordinates into frames 2 and 5.
- animation: laptop connects to switch; route branches toward conditional NPS and normal DHCP path.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–2s | How does a Windows laptop | Laptop and infrastructure already visible; laptop has no access state | pending | not inspected |
| 2–5s | no network access... Domain Controller | blue route draws toward DHCP/DNS/DC; amber conditional branch points to NPS | pending | not inspected |
| 5–8s | four services... different jobs | role labels settle beside actual nodes | pending | not inspected |

- Sound-off check: viewer can see the client, conditional NPS branch, and normal service route.
- Intentional hold over 3s: none.

## Frame 2 — Conditional access
- duration: 13.444354s
- src: compositions/frames/line-2.html
- status: outline
- blueprint: comparison-split
- Measured window: 10.170340–23.614694s`n- transition_in: cut
- voiceover: First, ask whether the network itself requires authentication. On an ordinary network, the laptop can continue toward DHCP. On an 802.1X network, access is conditional.
- learning objective: separate ordinary network access from 802.1X-gated access.
- dominant visual: two vertical lanes, WITHOUT 802.1X and WITH 802.1X.
- icon assets: public/icons/laptop.svg, public/icons/network-wired.svg, public/icons/shield-halved.svg, public/icons/server.svg.
- required objects and counts: 2 lane labels, 1 laptop identity, 1 switch/AP, 1 NPS, 1 DHCP server.
- text shown: Without 802.1X; With 802.1X; Access is conditional.
- beginning state: hook route remains visible.
- ending state: the with-802.1X lane is highlighted; NPS appears only on that lane.
- continuity: laptop and switch/AP remain same visual identity.
- animation: ordinary lane lights DHCP; gated lane stops at an access lock and reveals NPS.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–2s | ask whether | split lanes appear with laptop at both starts | pending | not inspected |
| 2–5s | ordinary... DHCP | no-802.1X route reaches DHCP | pending | not inspected |
| 5–8s | 802.1X... conditional | gated route stops until NPS is shown | pending | not inspected |

- Sound-off check: NPS is absent from the ordinary lane and present in the gated lane.

## Frame 3 — 802.1X roles
- duration: 13.096054s
- src: compositions/frames/line-3.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 23.614694–36.710748s`n- transition_in: cut
- voiceover: The Windows laptop is the supplicant. The Wi-Fi access point or switch is the authenticator, and it acts as the RADIUS client. NPS is the RADIUS server that receives the request.
- learning objective: prevent the misconception that the laptop talks directly to NPS.
- dominant visual: three large roles in a vertical path: supplicant → authenticator/RADIUS client → NPS/RADIUS server.
- icon assets: public/icons/laptop.svg, public/icons/wifi.svg, public/icons/network-wired.svg, public/icons/shield-halved.svg.
- required objects and counts: 1 laptop, 1 AP/switch, 1 NPS, 2 labeled connectors.
- text shown: SUPPLICANT; AUTHENTICATOR; RADIUS CLIENT; NPS / RADIUS SERVER.
- beginning state: gated lane from frame 2.
- ending state: request token has reached NPS; AP/switch is visibly the intermediary.
- continuity: keep NPS coordinate for frame 4.
- animation: identity token travels laptop → AP/switch → NPS; no direct laptop-to-NPS path.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–2s | Windows laptop... supplicant | laptop and role labels visible | pending | not inspected |
| 2–6s | access point or switch... RADIUS client | token enters AP/switch and changes label to RADIUS request | pending | not inspected |
| 6–9s | NPS... receives | request arrives at NPS with receipt state | pending | not inspected |

- Sound-off check: the middle AP/switch is required for the RADIUS request.

## Frame 4 — NPS decision
- duration: 16.927347s
- src: compositions/frames/line-4.html
- status: outline
- blueprint: comparison-split
- Measured window: 36.710748–53.638095s`n- transition_in: cut
- voiceover: NPS checks the connection request against its network policies. Where configured, it validates the identity using Active Directory. NPS returns Access-Accept or Access-Reject, and the device gets normal network access only after an accept.
- learning objective: show policy evaluation, optional AD identity lookup, and the access consequence.
- dominant visual: NPS center, policy gate, AD lookup below, green accept and red reject outcomes.
- icon assets: public/icons/shield-halved.svg, public/icons/database.svg, public/icons/user.svg, public/icons/circle-check.svg, public/icons/circle-xmark.svg.
- required objects and counts: 1 NPS, 1 policy gate, 1 AD node, 2 outcomes, 1 laptop state.
- text shown: Network policies; Identity check; Access-Accept; Access-Reject.
- beginning state: request is held at NPS.
- ending state: Access-Accept opens the network gate; rejected branch remains visibly denied.
- continuity: accepted laptop enters the normal path for frame 5.
- animation: NPS evaluates → optionally queries AD → returns one decision → gate opens only on accept.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | checks... policies | request enters policy gate | pending | not inspected |
| 3–6s | validates... Active Directory | identity token travels NPS → AD and returns | pending | not inspected |
| 6–8s | Access-Accept or Access-Reject | green and red outcomes appear as alternatives | pending | not inspected |
| 8–10s | normal network access only after | green gate opens; laptop changes to allowed | pending | not inspected |

- Sound-off check: only green accept changes the laptop to network allowed.

## Frame 5 — Normal path
- duration: 15.046531s
- src: compositions/frames/line-5.html
- status: outline
- blueprint: compose
- Measured window: 53.638095–68.684626s`n- transition_in: cut
- voiceover: That NPS exchange is conditional. In the normal path without 802.1X, the laptop goes from the network to DHCP, then DNS, then the Domain Controller. NPS is not involved in every domain connection.
- learning objective: make NPS absence explicit in the ordinary path.
- dominant visual: clean blue route laptop → switch → DHCP → DNS → DC; NPS dimmed outside the route with “not required here”.
- icon assets: public/icons/laptop.svg, public/icons/network-wired.svg, public/icons/server.svg, public/icons/globe.svg, public/icons/database.svg, public/icons/shield-halved.svg.
- required objects and counts: 1 laptop, 1 switch, 1 DHCP, 1 DNS, 1 DC, 1 dimmed NPS.
- text shown: Without 802.1X; DHCP → DNS → DC; NPS not involved here.
- beginning state: accepted laptop from frame 4, now no gate.
- ending state: normal route is fully connected and NPS is visually excluded.
- continuity: keep client, DHCP, DNS, and DC positions for frames 6–11.
- animation: route packet passes switch and stops at DHCP as next action.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–2s | NPS exchange is conditional | NPS dims and lane label changes | pending | not inspected |
| 2–5s | normal path... DHCP, then DNS | route draws through DHCP to DNS | pending | not inspected |
| 5–8s | NPS is not involved | DC lights while NPS remains outside route | pending | not inspected |

- Sound-off check: normal path has no NPS hop.

## Frame 6 — DHCP Discover and Offer
- duration: 12.120816s
- src: compositions/frames/line-6.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 68.684626–80.805442s`n- transition_in: cut
- voiceover: Now DHCP. The client broadcasts Discover because it does not yet have an address. A DHCP server answers with an Offer: a proposed lease and network settings.
- learning objective: show the first two DORA messages and the client’s lack of address.
- dominant visual: laptop → broadcast ring → DHCP server → offer packet.
- icon assets: public/icons/laptop.svg, public/icons/server.svg, public/icons/network-wired.svg, public/icons/arrow-up.svg.
- required objects and counts: 1 laptop, 1 DHCP server, 1 broadcast ring, 2 message tokens.
- text shown: DHCP DISCOVER; DHCP OFFER; No IP yet; Proposed lease.
- beginning state: laptop has no IP badge.
- ending state: offer packet is visible at the laptop but marked proposed.
- continuity: keep DHCP server and laptop endpoints for frame 7.
- animation: Discover expands locally, Offer returns from server.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | client broadcasts Discover | broadcast ring reaches network, no target address | pending | not inspected |
| 3–6s | server answers with an Offer | offer packet travels server → laptop | pending | not inspected |
| 6–9s | proposed lease | offer badge settles as proposed | pending | not inspected |

- Sound-off check: Discover is broadcast; Offer returns from the DHCP server.

## Frame 7 — DHCP Request and Acknowledge
- duration: 12.956735s
- src: compositions/frames/line-7.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 80.805442–93.762177s`n- transition_in: cut
- voiceover: The client broadcasts Request for the offer it chose. The server replies with Acknowledge, confirming the lease. That four-step exchange is DORA: Discover, Offer, Request, Acknowledge.
- learning objective: complete DORA and make the mnemonic memorable.
- dominant visual: laptop and DHCP server with four-step DORA rail and request/ack return path.
- icon assets: public/icons/laptop.svg, public/icons/server.svg, public/icons/arrow-down.svg, public/icons/arrow-up.svg, public/icons/circle-check.svg.
- required objects and counts: 1 laptop, 1 DHCP server, 4 DORA steps, 2 message tokens.
- text shown: REQUEST; ACKNOWLEDGE; D O R A.
- beginning state: offer is selected on laptop.
- ending state: ACK reaches laptop and the DORA rail is complete.
- continuity: completed lease unlocks frame 8 configuration bundle.
- animation: Request travels to DHCP; ACK retraces to laptop; DORA steps illuminate in order.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | broadcasts Request | request travels laptop → DHCP | pending | not inspected |
| 3–6s | replies with Acknowledge | ACK travels DHCP → laptop and check appears | pending | not inspected |
| 6–9s | DORA | four labels illuminate in sequence | pending | not inspected |

- Sound-off check: the sequence and return direction are clear.

## Frame 8 — Configuration bundle
- duration: 23.427075s
- src: compositions/frames/line-8.html
- status: outline
- blueprint: comparison-split
- Measured window: 93.762177–117.189252s`n- transition_in: cut
- voiceover: The result is more than an IP address. This laptop receives IP 10.10.20.45, subnet mask 255.255.255.0, gateway 10.10.20.1, and DNS server 10.10.1.10. The DNS value is especially important in an Active Directory network.
- learning objective: show the four required settings and emphasize DNS.
- dominant visual: large laptop with four readable configuration values; DNS badge highlighted cyan and route points toward DNS/DC.
- icon assets: public/icons/laptop.svg, public/icons/server.svg, public/icons/globe.svg, public/icons/network-wired.svg.
- required objects and counts: 1 laptop, 4 value rows, 1 DHCP server, 1 DNS node.
- text shown: IP; MASK; GATEWAY; DNS; 10.10.20.45; 255.255.255.0; 10.10.20.1; 10.10.1.10.
- beginning state: laptop is network-allowed and lease acknowledged.
- ending state: all values visible; DNS row is emphasized.
- continuity: exact DNS value persists into frame 9 query.
- animation: DHCP packet deposits the bundle one value at a time; DNS value links to discovery path.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–4s | more than an IP | four rows reveal on laptop | pending | not inspected |
| 4–7s | IP... subnet... gateway | values lock into the client configuration | pending | not inspected |
| 7–10s | DNS... especially important | DNS row glows and connects to DNS node | pending | not inspected |

- Sound-off check: viewer can read the four settings and see DNS singled out.

## Frame 9 — DNS discovery
- duration: 13.514014s
- src: compositions/frames/line-9.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 117.189252–130.703265s`n- transition_in: cut
- voiceover: The client asks its configured DNS server where the Domain Controller for corp.example can be found. It is not simply broadcasting for a controller; it is using DNS-based service discovery.
- learning objective: show a directed DNS query and reject the broadcast misconception.
- dominant visual: laptop query arrow → DNS server; DNS server is the only receiver; no broadcast ring.
- icon assets: public/icons/laptop.svg, public/icons/globe.svg, public/icons/database.svg, public/icons/arrow-up.svg.
- required objects and counts: 1 laptop, 1 DNS, 1 DC, 1 directed query, 1 muted broadcast symbol.
- text shown: Where is the DC?; corp.example; DNS query; Directed lookup.
- beginning state: client configuration from frame 8 remains visible.
- ending state: query is received by DNS and a service-location answer begins.
- continuity: DNS and DC stay in place for frame 10.
- animation: directed query travels laptop → DNS; muted “not broadcast” marker stays off the route.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | client asks... DNS server | query leaves laptop and reaches DNS | pending | not inspected |
| 3–6s | Domain Controller... corp.example | query value appears at DNS | pending | not inspected |
| 6–9s | not simply broadcasting | no broadcast path; directed route is highlighted | pending | not inspected |

- Sound-off check: query has one directed DNS destination, not a broadcast.

## Frame 10 — SRV and Domain Controller
- duration: 15.743129s
- src: compositions/frames/line-10.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 130.703265–146.446395s`n- transition_in: cut
- voiceover: DNS returns an Active Directory service location, represented here by the SRV record underscore ldap dot tcp dot dc dot underscore msdcs dot corp dot example. The client uses that answer to reach a suitable Domain Controller.
- learning objective: introduce SRV at a high level and show DC discovery.
- dominant visual: DNS highlights a readable shortened SRV record; answer arrow travels DNS → DC; DC receives client connection.
- icon assets: public/icons/globe.svg, public/icons/database.svg, public/icons/laptop.svg, public/icons/arrow-down.svg.
- required objects and counts: 1 DNS, 1 SRV record label, 1 DC, 1 answer token, 1 laptop connection.
- text shown: SRV; _ldap._tcp.dc._msdcs.corp.example; DC found.
- beginning state: DNS holds client query.
- ending state: client is connected to the discovered DC.
- continuity: discovered DC is the same object used in frame 11.
- animation: SRV row illuminates → answer returns → client route reaches DC.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | returns... service location | SRV record becomes readable at DNS | pending | not inspected |
| 3–6s | SRV record... | answer token travels DNS → client | pending | not inspected |
| 6–10s | reach a suitable DC | client connection travels to the actual DC icon and check appears | pending | not inspected |

- Sound-off check: SRV answer visibly leads to the same DC node.

## Frame 11 — Domain authentication
- duration: 15.255510s
- src: compositions/frames/line-11.html
- status: outline
- blueprint: spatial-pan-stations
- Measured window: 146.446395–161.701905s`n- transition_in: cut
- voiceover: After it can reach the controller, the Windows client presents a user or computer identity to Active Directory. Kerberos is the common domain authentication protocol here. The controller provides authentication and other domain services.
- learning objective: explain high-level domain authentication without ticket internals.
- dominant visual: user/key identity token → Domain Controller → Active Directory database, with Kerberos label.
- icon assets: public/icons/laptop.svg, public/icons/user.svg, public/icons/key.svg, public/icons/database.svg, public/icons/circle-check.svg.
- required objects and counts: 1 laptop, 1 identity token, 1 DC, 1 AD database, 1 success state.
- text shown: Domain login; Kerberos; Active Directory; Identity verified.
- beginning state: client is connected to discovered DC.
- ending state: identity is verified and domain services are available.
- continuity: successful domain state carries into frame 13.
- animation: identity travels laptop → DC; DC checks AD; green verified state returns.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | presents... identity | user/key token travels to DC | pending | not inspected |
| 3–6s | Kerberos... common | Kerberos label anchors to the DC path | pending | not inspected |
| 6–9s | authentication... services | verified state returns and service line opens | pending | not inspected |

- Sound-off check: identity reaches DC/AD and a successful result returns.

## Frame 12 — Responsibilities
- duration: 18.877823s
- src: compositions/frames/line-12.html
- status: outline
- blueprint: constellation-hub
- Measured window: 161.701905–180.579728s`n- transition_in: cut
- voiceover: Keep the jobs separate. DHCP says, “Here are your network settings.” DNS says, “Here is where the domain service is.” NPS says, “Should this device or user get network access?” The Domain Controller says, “Who are you, and what domain services can you use?”
- learning objective: provide the explicit responsibility comparison.
- dominant visual: four large local icons in a 2x2 arrangement with one short speech label each.
- icon assets: public/icons/server.svg, public/icons/globe.svg, public/icons/shield-halved.svg, public/icons/database.svg.
- required objects and counts: 4 service icons, 4 short descriptions.
- text shown: DHCP — network settings; DNS — find domain; NPS — decide access; DC — identity/services.
- beginning state: previous successful flow is compressed into four service nodes.
- ending state: all four responsibilities are distinct and non-overlapping.
- continuity: same semantic colors and icons recur in frame 13.
- animation: each service receives one short question/answer packet; no extra concepts.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | Keep the jobs separate | four nodes appear in stable 2x2 | pending | not inspected |
| 3–7s | DHCP... DNS... NPS... | each node receives its one responsibility label | pending | not inspected |
| 7–10s | Domain Controller... | DC label completes the comparison | pending | not inspected |

- Sound-off check: four icons and four distinct jobs are readable.

## Frame 13 — Complete flow
- duration: 20.271020s
- src: compositions/frames/line-13.html
- status: outline
- blueprint: compose
- Measured window: 180.579728–200.850748s`n- transition_in: cut
- voiceover: So the complete enterprise flow is: if required, 802.1X authentication through the switch or access point and NPS; then network access; DHCP supplies IP, gateway, and DNS; DNS locates the Domain Controller; and the Domain Controller handles domain login and services.
- learning objective: replay the whole causal chain with NPS conditional.
- dominant visual: one tall complete flow with amber conditional prefix and blue normal path.
- icon assets: public/icons/laptop.svg, public/icons/wifi.svg, public/icons/network-wired.svg, public/icons/shield-halved.svg, public/icons/server.svg, public/icons/globe.svg, public/icons/database.svg, public/icons/circle-check.svg.
- required objects and counts: 1 laptop, 1 AP/switch, 1 NPS, 1 network-allowed gate, 1 DHCP, 1 DNS, 1 DC, 1 returning success.
- text shown: 802.1X if required; NETWORK ALLOWED; DHCP; IP + DNS + GATEWAY; DNS; DOMAIN CONTROLLER; DOMAIN LOGIN.
- beginning state: responsibility comparison complete.
- ending state: complete flow is resolved at domain login/services.
- continuity: exact node positions persist to final summary.
- animation: one token advances through each actual node; NPS branch is traversed only on the amber conditional beat.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–3s | if required... NPS | amber token travels laptop → AP/switch → NPS | pending | not inspected |
| 3–6s | network access; DHCP | accept opens gate; token reaches DHCP | pending | not inspected |
| 6–9s | IP... DNS; DNS locates | configuration appears; query travels to DNS | pending | not inspected |
| 9–12s | controller... login/services | answer reaches DC; final green state appears | pending | not inspected |

- Sound-off check: conditional NPS precedes DHCP; DNS precedes DC; final login is the consequence.

## Frame 14 — Takeaway
- duration: 12.887075s
- src: compositions/frames/line-14.html
- status: outline
- blueprint: titlecard-reveal
- Measured window: 200.850748–213.737823s`n- transition_in: cut
- voiceover: Remember the division of labor: NPS decides access, DHCP configures the network, DNS finds the domain, and the Domain Controller handles domain identity and services.
- learning objective: end on the four-part takeaway without introducing a new concept.
- dominant visual: four oversized icons with four verb-led statements; miniature resolved route remains behind them.
- icon assets: public/icons/shield-halved.svg, public/icons/server.svg, public/icons/globe.svg, public/icons/database.svg.
- required objects and counts: 4 service icons, 4 short statements, 1 resolved route.
- text shown: NPS decides; DHCP configures; DNS finds; DC authenticates.
- beginning state: complete flow is fully resolved.
- ending state: four statements remain readable; no new object appears.
- continuity: final state only; no outro card or subscription prompt.
- animation: four statements land in route order and hold.

| Local time | Spoken cue | Action / evidence | Implementation selector(s) | Inspected time / evidence / pass or fix |
|---|---|---|---|---|
| 0–4s | NPS decides... DHCP configures | first two statements land on their icons | pending | not inspected |
| 4–7s | DNS finds... DC handles | final two statements land on their icons | pending | not inspected |
| 7–9s | identity and services | complete takeaway holds for read | pending | not inspected |

- Sound-off check: the final division of labor is readable without narration.
- No concept follows this frame.
