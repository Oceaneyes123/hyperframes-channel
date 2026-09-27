---
format: 1920x1080
duration: 110s
message: "DHCP automatically gives devices the network settings they need to communicate."
arc: "Concept-explainer with process"
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
mode: collaborative
music: none
---

## Video direction

- palette: dark neutral tech field `#0B0F14`, one blue accent `#59A8FF`, white text `#F5F7FA`, muted labels `#AAB7C4`
- visual system: local Font Awesome SVG icons and simple packet/connection shapes; icons carry the explanation, labels stay short
- motion grammar: staggered icon reveal, packet flight, broadcast expansion, layer-reveal, glow blooms, count-up, then held reads
- layout: keep icons modest and isolated; no icon exceeds roughly 15% of the frame unless it is the single hook subject; preserve clear spacing and the bottom caption safe area
- pacing: reveal one idea at a time, then hold the complete relationship long enough to read; avoid front-loaded all-at-once diagrams and ambient screensaver motion
- negative list: no avatars, stock imagery, remote assets, dense paragraphs, giant overlapping icons, or crossed labels/packet paths

## Frame 1 — The question

- scene: A laptop joins a Wi-Fi network while its IP field remains `not assigned`; the question is the only large text.
- duration: 6.709758281707764s
- poster: 3s
- transition_in: cut
- status: built
- src: compositions/frames/01-the-question.html
- voiceover: "Your laptop joins Wi-Fi. But it still does not know which IP address to use. How does it get one?"
- type: hook
- persuasion: Question→answer pairing + concretization
- beat: Curiosity
- blueprint: kinetic-type-beats

narrativeRole: Open with the everyday moment of joining Wi-Fi while making the invisible configuration gap visible.
keyMessage: Joining the network is not the same as already having an IP address.
focal: Wi-Fi signal and laptop with an empty IP badge
roles: laptop = foreground subject; Wi-Fi icon = supporting signal; `NOT ASSIGNED` badge = foreground label; dark LAN field = background
sfx: none

Scene 1 (0.0–2.0s): Wi-Fi and laptop enter through staggered icon reveal (`spring-pop-entrance`); layered-depth, centered pair.
Scene 2 (2.0–4.5s): an empty address badge opens beside the laptop as “does not know” lands via label reveal (`discrete-text-sequence`); rule-of-thirds.
Scene 3 (4.5–6.71s): the question card settles above the pair; held read with no extra motion.

## Frame 2 — Why manual setup breaks down

- scene: Laptop, phone, tablet, desktop, and printer each carry empty IP, subnet, gateway, and DNS slots; the repeated manual work collapses into clutter.
- duration: 9.006114959716797s
- poster: 4s
- transition_in: crossfade
- status: built
- src: compositions/frames/02-why-manual-setup-breaks-down.html
- voiceover: "Without DHCP, someone would configure every device: IP address, subnet mask, gateway, and DNS. That gets old fast."
- type: pain_point
- persuasion: Concretization + before/after
- beat: Recognition
- blueprint: comparison-split

narrativeRole: Make the scale problem tangible before introducing the service that removes it.
keyMessage: Manually configuring every device does not scale.
focal: repeated device icons and empty configuration slots
roles: five devices = foreground subjects; IP/mask/gateway/DNS slots = supporting burden; cluttered rules = background pressure
sfx: none

Scene 1 (0.0–2.2s): laptop, phone, tablet, desktop, and printer arrive as a clean triptych-to-row icon reveal (`waterfall-entry`); triptych.
Scene 2 (2.2–6.0s): empty IP, mask, gateway, and DNS chips populate one device at a time via layer-reveal (`dynamic-content-sequencing`); asymmetric 60/40.
Scene 3 (6.0–9.01s): the same chips repeat across the row, then stop in a cluttered but readable hold as “old fast” lands.

## Frame 3 — Meet DHCP

- scene: The cluttered setup resolves into one LAN containing a client, a distinct DHCP server, and a separate router role connected by a calm network line.
- duration: 10.44946575164795s
- poster: 4s
- transition_in: zoom-through
- status: built
- src: compositions/frames/03-meet-dhcp.html
- voiceover: "DHCP is the network service that hands out those settings automatically. The server and router are separate roles, even when one box provides both."
- type: product_intro
- persuasion: Analogy + progressive disclosure
- beat: Orientation
- blueprint: spatial-pan-stations

narrativeRole: Name DHCP and establish the client/server relationship without implying that a router must be the server.
keyMessage: DHCP automatically supplies configuration, and its server role is distinct from the gateway role.
focal: client, DHCP server, and router role
roles: laptop = client foreground; server rack = DHCP service foreground; router = gateway role foreground; connecting LAN line = supporting
sfx: none

Scene 1 (0.0–2.5s): laptop client appears on the left via spring-pop entrance (`spring-pop-entrance`); asymmetric 60/40.
Scene 2 (2.5–6.3s): DHCP server and router icons reveal separately on the right via staggered icon reveal (`waterfall-entry`); spaced stations.
Scene 3 (6.3–10.45s): one calm LAN line connects the three while the role labels settle; hold the distinct server/router relationship.

## Frame 4 — Discover

- scene: A new client emits a packet that expands as a broadcast across the LAN; the DHCP server is not targeted by address.
- duration: 9.225488662719727s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- src: compositions/frames/04-discover.html
- voiceover: "First: Discover. The new client broadcasts, “I am new here. Is there a DHCP server?” It does not yet know the server’s address."
- type: feature_showcase
- persuasion: Demonstration + subtractive framing
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Correct the most important first-contact misconception by showing the broadcast reaching the local network.
keyMessage: DHCP Discover is a local broadcast because the client does not yet know where the server is.
focal: DHCP DISCOVER packet and broadcast ring
roles: new laptop = foreground sender; broadcast ring = foreground motion; server and router = supporting stations; packet label = short cue
sfx: none

Scene 1 (0.0–2.4s): the new laptop raises a small `DISCOVER` packet via label reveal (`discrete-text-sequence`); layered-depth.
Scene 2 (2.4–6.3s): the packet expands into a local broadcast ring (`center-outward-expansion`) and reaches the LAN stations; full-width strip.
Scene 3 (6.3–9.23s): the ring holds around the network while the server remains unaddressed; clean held read.

## Frame 5 — Offer

- scene: The DHCP server returns one highlighted offer card with IP, subnet, gateway, DNS, and `Lease: 24 hours`; the card is visibly marked `PROPOSED`.
- duration: 15.28050422668457s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- src: compositions/frames/05-offer.html
- voiceover: "Next: Offer. The server proposes an address, such as 192.168.1.25, plus a subnet mask, gateway, DNS server, and lease time. It is an offer, not a final assignment."
- type: feature_showcase
- persuasion: Worked example with real numbers + progressive disclosure
- beat: Fascination
- blueprint: comparison-split

narrativeRole: Ground the abstract response in a readable configuration bundle while preserving the provisional status.
keyMessage: A DHCP offer can include the address and the basic settings needed to use it, but it is still provisional.
focal: proposed configuration card
roles: DHCP server = left foreground source; offer card = right foreground subject; config chips = supporting details; `PROPOSED` badge = status cue
sfx: none

Scene 1 (0.0–3.2s): server icon and return arrow reveal via packet flight (`nudge-curve`); split-screen.
Scene 2 (3.2–10.8s): the `OFFER` card opens and chips appear one at a time via layer-reveal (`dynamic-content-sequencing`); asymmetric 40/60.
Scene 3 (10.8–15.28s): `PROPOSED` gains a restrained glow bloom (`asr-keyword-glow`), then the card holds without covering the server.

## Frame 6 — Request

- scene: The client receives the proposed card, sends a single return packet labeled `DHCP REQUEST`, and unselected offer paths dim.
- duration: 9.691638946533203s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- src: compositions/frames/06-request.html
- voiceover: "Then: Request. The client says, “I want to use that offered address.” If other servers made offers, this also signals which one was chosen."
- type: feature_showcase
- persuasion: Demonstration + causal chain
- beat: Momentum
- blueprint: spatial-pan-stations

narrativeRole: Show selection as the bridge between a proposal and a confirmed lease.
keyMessage: DHCP Request selects the offered configuration.
focal: selected offer and DHCP REQUEST packet
roles: client = left foreground; selected offer = highlighted foreground card; dim alternatives = supporting context; request packet = foreground motion
sfx: none

Scene 1 (0.0–2.4s): client receives the highlighted offer via layer-reveal (`scale-swap-transition`); split-screen.
Scene 2 (2.4–6.8s): one `REQUEST` packet flies back toward the server (`motion-blur-streak`) while alternate paths dim.
Scene 3 (6.8–9.69s): the selected card locks to the client with a short connector glow; held read.

## Frame 7 — Acknowledge

- scene: The server sends `DHCP ACK`; the client changes from `not assigned` to `192.168.1.25`, and a clean connection line activates.
- duration: 11.520942687988281s
- poster: 6s
- transition_in: zoom-through
- status: built
- src: compositions/frames/07-acknowledge.html
- voiceover: "Finally: Acknowledge — ACK. The server confirms the lease, and the laptop can now use 192.168.1.25 to communicate."
- type: benefit_highlight
- persuasion: Before/after + payoff
- beat: Aha + confidence
- blueprint: kinetic-type-beats

narrativeRole: Deliver the payoff: the previously unconfigured device is now a usable network participant.
keyMessage: DHCP ACK confirms the lease and makes the assigned configuration usable.
focal: DHCP ACK packet and the client’s new IP badge
roles: server = right foreground sender; ACK packet = foreground motion; laptop = left foreground receiver; `192.168.1.25` badge and active line = payoff accents
sfx: none

Scene 1 (0.0–3.0s): server sends a compact `ACK` packet via packet flight (`nudge-curve`); rule-of-thirds.
Scene 2 (3.0–7.8s): the laptop’s `NOT ASSIGNED` badge swaps to `192.168.1.25` via scale-swap transition (`scale-swap-transition`).
Scene 3 (7.8–11.52s): the connection line activates with a restrained glow bloom (`asr-keyword-glow`); hold the usable-device payoff.

## Frame 8 — DORA and the configuration bundle

- scene: Discover, Offer, Request, Acknowledge stack into a large D-O-R-A mnemonic beside five compact configuration badges.
- duration: 11.586668014526367s
- poster: 6s
- transition_in: crossfade
- status: built
- src: compositions/frames/08-dora-and-configuration-bundle.html
- voiceover: "Remember DORA: Discover, Offer, Request, Acknowledge. DHCP often delivers the whole starter bundle: IP, subnet mask, gateway, DNS, and lease time."
- type: social_proof
- persuasion: Coined term / mnemonic + numbered enumeration
- beat: Mastery
- blueprint: constellation-hub

narrativeRole: Compress the four-step exchange into a memorable sequence and widen the viewer’s definition of what DHCP provides.
keyMessage: DORA is the mnemonic, and DHCP commonly provides more than an IP address.
focal: four-step DORA icon sequence and configuration bundle
roles: Discover/Offer/Request/Acknowledge icons = foreground sequence; D-O-R-A letters = supporting mnemonic; bundle card = right foreground subject; dark field = background
sfx: none

Scene 1 (0.0–2.8s): four modest icons reveal beside their D-O-R-A labels in a vertical stack via staggered icon reveal (`waterfall-entry`); asymmetric 40/60.
Scene 2 (2.8–6.7s): a single route line links the four steps in order; icons remain separated with no overlap.
Scene 3 (6.7–11.59s): IP, mask, gateway, DNS, and lease chips appear inside the right bundle card via layer-reveal; held read.

## Frame 9 — Leases renew

- scene: A `Lease: 24h` timer counts down toward a renewal point; the client sends a small renewal packet and the timer resets while the IP stays visible.
- duration: 11.691149711608887s
- poster: 7s
- transition_in: crossfade
- status: built
- src: compositions/frames/09-leases-renew.html
- voiceover: "That address is leased, not owned forever. Before the timer expires, the client contacts DHCP to renew. If renewal succeeds, it can usually keep using the same address."
- type: feature_showcase
- persuasion: Causal chain + time progression
- beat: Foresight
- blueprint: spatial-pan-stations

narrativeRole: Explain the lease as a living arrangement with a renewal loop rather than a permanent assignment.
keyMessage: A DHCP lease expires on a timer, and successful renewal can extend continued use.
focal: lease timer and renewal loop
roles: laptop = left foreground client; clock/timer = centered supporting time cue; renewal packet = foreground motion; server = right foreground station; IP badge = persistent anchor
sfx: none

Scene 1 (0.0–3.0s): laptop, clock, and server settle into a spaced triangle via spring-pop entrance (`spring-pop-entrance`); triangle framing.
Scene 2 (3.0–7.3s): `24h` counts down in the clock while the IP badge stays visible (`count-up`); centered timer stays smaller than the device icons.
Scene 3 (7.3–11.69s): a small renewal packet loops from client to server and the timer resets via packet flight (`nudge-curve`); hold the renewal relationship.

## Frame 10 — The payoff

- scene: Laptop, phone, and TV settle into one connected LAN with addresses `192.168.1.25`, `.26`, and `.27`; the central takeaway lands.
- duration: 10.47234058380127s
- poster: 7s
- transition_in: zoom-through
- status: built
- src: compositions/frames/10-the-payoff.html
- voiceover: "So when devices appear on a network, DHCP quietly gives each one the settings it needs. No manual address hunt — just a ready-to-communicate device."
- type: branding
- persuasion: Callback + distillation
- beat: Satisfaction
- blueprint: titlecard-reveal

narrativeRole: Return to the opening device and generalize the exchange across a small network.
keyMessage: DHCP turns a new device into a configured network participant with little manual work.
focal: three configured devices on one LAN
roles: laptop, phone, and TV = foreground device trio; IP badges = supporting proof; shared LAN line = background structure; takeaway = short titlecard
sfx: none

Scene 1 (0.0–2.8s): laptop, phone, and TV reveal as a clean triptych (`waterfall-entry`); triptych.
Scene 2 (2.8–6.8s): `.25`, `.26`, and `.27` badges attach one at a time via per-word reveal (`dynamic-content-sequencing`); labels stay clear of icons.
Scene 3 (6.8–10.47s): one shared LAN line completes and the takeaway lands via titlecard reveal (`kinetic-beat-slam`); hold the final frame.
