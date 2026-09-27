---
format: 1920x1080
duration: 146.36208200454712s
message: "A switch moves traffic within a local network, while a router moves traffic between networks."
arc: "Concept-explainer with same-subnet versus different-network process"
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
mode: collaborative
music: none
---

## Video direction

- Palette: `DESIGN.md` channel tokens — dark canvas, blue request path, mint response path, amber only for boundaries or warnings, Barlow display type, IBM Plex Mono technical labels.
- Motion grammar: VO-paced `reveal`, `draw-on`, `packet-travel`, `table-highlight`, `route-pulse`, and `glow-bloom`; progressive disclosure with short held reads, no decorative drift.
- Rhythm: active travel in Frames 4, 5, 7, 8, 9, 11, and 12; held comprehension beats in Frames 2, 3, 6, 10, and 13.
- Keep-out: no avatars, stock footage, neon gradients, decorative connectors, dense cards, captions, or BGM.

## Frame 1 — The question

- scene: Small network with Laptop A, Laptop B, switch, router, and internet; switch and router split into two bright jobs.
- duration: 7.809942722320557s
- poster: 3s
- transition_in: cut
- status: animated
- voiceover: "If both switches and routers move network traffic, what’s the difference? The answer starts with where that traffic needs to go."
- src: compositions/frames/01-the-question.html
- type: hook
- persuasion: Question→contrast
- beat: Curiosity
- blueprint: typewriter-reveal

narrativeRole: Open with the shared surface-level job, then promise a visible distinction.
keyMessage: The difference is the network boundary the traffic must cross.
focal: The switch/router contrast and the network boundary.
roles: `headline` opens; `switch-mark` and `router-mark` reveal as paired anchors; route line draws between them; final job labels hold.
sfx: none
Scene 1 [0.0-1.8s]: Reveal the question large, then bring in the two dim network nodes.
Scene 2 [1.8-5.1s]: Draw the local and remote paths with blue request traces; bloom the two job labels.
Scene 3 [5.1-7.8s]: Hold the contrast for the answer landing.

## Frame 2 — Start inside the LAN

- scene: Laptop A and Laptop B connect to one central switch inside a labeled `192.168.1.0/24` LAN boundary; router is present but quiet.
- duration: 8.209789276123047s
- poster: 4s
- transition_in: crossfade
- status: animated
- voiceover: "Laptop A and Laptop B are on the same local network, connected through one switch. So what happens when A sends data to B?"
- src: compositions/frames/02-start-inside-the-lan.html
- type: orientation
- persuasion: Concretization + question
- beat: Recognition
- blueprint: constellation-hub

narrativeRole: Establish the local topology before introducing addresses.
keyMessage: Both clients share one local network and one switch.
focal: The central switch hub inside the subnet.
roles: `headline` stays quiet; laptop nodes reveal first; switch hub and LAN boundary draw on; question marker arrives last.
sfx: none
Scene 1 [0.0-2.0s]: Reveal the two laptops and central switch as a sparse constellation.
Scene 2 [2.0-5.8s]: Draw the subnet boundary and local links, then light the shared `192.168.1.0/24` label.
Scene 3 [5.8-8.2s]: Hold the topology while the question resolves.

## Frame 3 — Two kinds of address

- scene: Two laptop icons carry paired IP and MAC badges; a quiet split marks `IP = destination network` and `MAC = local delivery`.
- duration: 16.757526397705078s
- poster: 4s
- transition_in: zoom-through
- status: animated
- voiceover: "A has IP address 192.168.1.10 and MAC address AA:AA. B has 192.168.1.20 and BB:BB. IP identifies the network destination; MAC identifies the local delivery target."
- src: compositions/frames/03-two-kinds-of-address.html
- type: concept
- persuasion: Comparison + concretization
- beat: Orientation
- blueprint: comparison-split

narrativeRole: Give each address one job without opening a protocol detour.
keyMessage: IP describes where; MAC delivers on the local link.
focal: The paired IP/MAC badges.
roles: `IP` and `MAC` badges reveal separately on the laptops; split labels slide in; the local-delivery line stays mint.
sfx: none
Scene 1 [0.0-4.0s]: Reveal Laptop A and Laptop B with their IP badges.
Scene 2 [4.0-11.5s]: Add MAC badges, then draw the split between network destination and local delivery.
Scene 3 [11.5-16.8s]: Hold both address jobs for a clean read.

## Frame 4 — The Ethernet frame

- scene: A sharp blue Ethernet frame travels from Laptop A to the switch with readable `SOURCE MAC: AA:AA` and `DEST MAC: BB:BB`; a smaller IP packet sits inside.
- duration: 11.055224418640137s
- poster: 5s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "On this local link, A wraps the message in an Ethernet frame: source MAC AA:AA, destination MAC BB:BB. The frame reaches the switch."
- src: compositions/frames/04-the-ethernet-frame.html
- type: demonstration
- persuasion: Demonstration
- beat: Focus
- blueprint: spatial-pan-stations

narrativeRole: Make the frame the physical object the switch receives.
keyMessage: The switch sees a local Ethernet frame addressed by MAC.
focal: The sharp Ethernet frame traveling to the switch.
roles: Laptop emits; `packet` travels on the blue line; source/destination MAC labels reveal on the frame; switch receives with a glow.
sfx: none
Scene 1 [0.0-2.5s]: Reveal the source laptop and destination switch.
Scene 2 [2.5-8.8s]: Draw the link and travel the frame across it; reveal the nested IP packet mid-flight.
Scene 3 [8.8-11.1s]: Hold the received frame and MAC labels.

## Frame 5 — The switch forwards locally

- scene: Switch MAC table enlarges beside the node; `BB:BB → Port 3` lights blue, while the other ports remain muted and only Laptop B receives the frame.
- duration: 10.128047943115234s
- poster: 4s
- transition_in: crossfade
- status: animated
- voiceover: "The switch checks its MAC table, finds BB:BB on Port 3, and forwards the frame only there. It does not send this local frame everywhere."
- src: compositions/frames/05-switch-forwards-locally.html
- type: payoff
- persuasion: Demonstration + subtraction
- beat: Aha
- blueprint: kinetic-type-beats

narrativeRole: Pay off the local example with one clear egress decision.
keyMessage: A switch forwards the frame toward the learned local port.
focal: The highlighted `BB:BB → Port 3` decision.
roles: MAC table reveals row by row; Port 3 highlights blue; only the destination link pulses; other ports remain muted.
sfx: none
Scene 1 [0.0-3.0s]: Bring the switch and table into focus.
Scene 2 [3.0-7.8s]: Highlight the learned row and send one packet down Port 3.
Scene 3 [7.8-10.1s]: Hold the single-egress payoff.

## Frame 6 — How the switch learns

- scene: Incoming arrows populate a compact table: `Port 1 ← AA:AA`, `Port 3 ← BB:BB`; the switch icon stays central and the explanation remains short.
- duration: 11.158363342285156s
- poster: 4s
- transition_in: crossfade
- status: animated
- voiceover: "How did it know? Switches learn by watching incoming frames: AA:AA arrived on Port 1, and BB:BB arrived on Port 3. MAC to port."
- src: compositions/frames/06-how-the-switch-learns.html
- type: explanation
- persuasion: Mechanism reveal
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Explain the table’s origin without diving into switching algorithms.
keyMessage: Source MAC observations create MAC-to-port knowledge.
focal: The compact learning table.
roles: Incoming source observations point into the switch; table rows appear in order; the `MAC → port` badge lands last.
sfx: none
Scene 1 [0.0-3.2s]: Reveal the central switch and incoming observations.
Scene 2 [3.2-8.6s]: Populate Port 1 and Port 3 rows with restrained draw-ons.
Scene 3 [8.6-11.2s]: Hold the table as the mechanism summary.

## Frame 7 — A remote destination

- scene: `8.8.8.8` sits outside a visible `192.168.1.0/24` boundary; Laptop A emits a blue IP packet through the switch, which stops at the boundary with a question marker.
- duration: 13.699894905090332s
- poster: 4s
- transition_in: hard-cut
- status: animated
- voiceover: "Now A wants 8.8.8.8. That address is outside 192.168.1.0 slash 24. Can the switch send it directly? Not to the right remote network."
- src: compositions/frames/07-a-remote-destination.html
- type: correction
- persuasion: Question→correction
- beat: Tension
- blueprint: kinetic-type-beats

narrativeRole: Change the destination so the viewer can feel the switch’s limit.
keyMessage: A remote IP destination requires a network-level decision.
focal: The subnet boundary and the stopped remote packet.
roles: Remote `8.8.8.8` appears beyond the boundary; packet travels to the edge; amber question marker stops the route.
sfx: none
Scene 1 [0.0-3.0s]: Reveal the local boundary and distant destination.
Scene 2 [3.0-10.5s]: Travel the blue packet through the switch to the boundary, then stop it.
Scene 3 [10.5-13.7s]: Hold the limitation question before the router reveal.

## Frame 8 — Meet the router

- scene: Router becomes the bright boundary node between LAN and `INTERNET / OTHER NETWORK`; a `DEFAULT GATEWAY 192.168.1.1` label receives the blue packet.
- duration: 12.245575904846191s
- poster: 5s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "A sends remote traffic toward its default gateway, the router at 192.168.1.1. The router connects the local IP network to another network."
- src: compositions/frames/08-meet-the-router.html
- type: introduction
- persuasion: Role reveal
- beat: Orientation
- blueprint: spatial-pan-stations

narrativeRole: Introduce the router as the boundary and next hop.
keyMessage: The default gateway is where remote traffic leaves the local network.
focal: The router as the bright boundary node.
roles: Router icon blooms between LAN and other network; `DEFAULT GATEWAY` badge locks to it; blue packet enters from the LAN.
sfx: none
Scene 1 [0.0-3.0s]: Reveal the two network regions and quiet local switch.
Scene 2 [3.0-9.5s]: Bloom the router, draw the gateway path, and send the packet through the boundary.
Scene 3 [9.5-12.2s]: Hold the next-hop relationship.

## Frame 9 — The router chooses a network

- scene: Packet reaches the router; a simple two-row routing table highlights `192.168.1.0/24 → LAN` or `0.0.0.0/0 → INTERNET` based on destination IP.
- duration: 15.404553413391113s
- poster: 5s
- transition_in: zoom-through
- status: animated
- voiceover: "The router reads the packet’s destination IP and consults routing information: 192.168.1.0 slash 24 goes to the LAN; the default route goes toward the internet. This is IP routing."
- src: compositions/frames/09-the-router-chooses-a-network.html
- type: demonstration
- persuasion: Mechanism reveal
- beat: Aha
- blueprint: comparison-split

narrativeRole: Contrast the router’s IP decision with the switch’s MAC-port decision.
keyMessage: A router chooses the next network using destination IP and routing information.
focal: The routing table row selected by destination IP.
roles: Packet arrives at router; two route rows reveal; matching row highlights blue; the outbound network line pulses.
sfx: none
Scene 1 [0.0-3.5s]: Reveal packet, router, and destination regions.
Scene 2 [3.5-12.5s]: Draw the table rows and highlight the matching local/default route.
Scene 3 [12.5-15.4s]: Hold the route decision and IP-routing label.

## Frame 10 — Side by side

- scene: Strong split composition: switch with frame/MAC/port labels on the left; router with packet/IP/network labels on the right; one active route in each column.
- duration: 10.469654083251953s
- poster: 4s
- transition_in: cut
- status: animated
- voiceover: "Switch: local Ethernet frames, MAC addresses, device to device. Router: IP packets, destination networks, one network to another."
- src: compositions/frames/10-side-by-side.html
- type: comparison
- persuasion: Distillation + contrast
- beat: Mastery
- blueprint: comparison-split

narrativeRole: Compress the lesson into a memorable visual pair.
keyMessage: Switches move frames within a network; routers move packets between networks.
focal: The side-by-side switch/router comparison.
roles: Left column reveals first with MAC/port; right column follows with IP/network; one active line per column, split rule stays still.
sfx: none
Scene 1 [0.0-3.0s]: Reveal the switch column and its local frame path.
Scene 2 [3.0-7.6s]: Reveal the router column and its between-networks path.
Scene 3 [7.6-10.5s]: Hold the distilled pair.

## Frame 11 — Same network

- scene: Replay path `Laptop A → Switch → Laptop B` inside the LAN; router is dimmed and the large label reads `SAME NETWORK`.
- duration: 7.328106880187988s
- poster: 4s
- transition_in: crossfade
- status: animated
- voiceover: "Same subnet? Laptop, switch, laptop. The router can stay quiet because the destination is already local."
- src: compositions/frames/11-same-network.html
- type: replay
- persuasion: Callback + subtraction
- beat: Clarity
- blueprint: constellation-hub

narrativeRole: Correct the common misconception that every local packet visits the router.
keyMessage: Same-subnet traffic normally stays on the local path.
focal: The local `Laptop → Switch → Laptop` replay.
roles: Same-network badge appears first; blue path travels across the switch; router dims and stays outside the route; return pulse is mint.
sfx: none
Scene 1 [0.0-2.0s]: Reveal the same-network label and endpoints.
Scene 2 [2.0-5.4s]: Draw and travel the local path through the switch.
Scene 3 [5.4-7.3s]: Hold the quiet router as the correction.

## Frame 12 — Different network and the home-box surprise

- scene: Two compact replays share one frame: `Laptop → Switch → Router → Remote Server` plus a home Wi-Fi box split into `ROUTER / SWITCH / WI-FI AP`.
- duration: 9.813301086425781s
- poster: 5s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "Different network? Laptop, switch, router, remote server. And the box in a home often combines a router, a switch, and a Wi-Fi access point."
- src: compositions/frames/12-home-router.html
- type: clarification
- persuasion: Callback + concretization
- beat: Recognition
- blueprint: comparison-split

narrativeRole: Resolve the product-label confusion with a familiar combined device.
keyMessage: A consumer “router” often bundles several network functions.
focal: The home box and its three labeled jobs.
roles: Remote path draws left to right; home box blooms; `ROUTER`, `SWITCH`, and `WI-FI AP` functions reveal one at a time.
sfx: none
Scene 1 [0.0-2.4s]: Reveal the remote path and home device together.
Scene 2 [2.4-7.4s]: Travel the path through switch then router; reveal the three bundled functions.
Scene 3 [7.4-9.8s]: Hold the familiar one-box surprise.

## Frame 13 — The takeaway

- scene: Final two-line recap with both stable icons and the paths `Device → Switch → Device` and `Device → Switch → Router → Other Network`; one closing statement dominates.
- duration: 12.28210163116455s
- poster: 5s
- transition_in: crossfade
- status: animated
- voiceover: "So the short version is simple: a switch connects devices within a network. A router connects networks. Next, how does your computer decide whether an IP is local or remote?"
- src: compositions/frames/13-the-takeaway.html
- type: closer
- persuasion: Distillation + open loop
- beat: Satisfaction
- blueprint: titlecard-reveal

narrativeRole: Land the rule and lightly tee up subnetting/default-gateway follow-up.
keyMessage: A switch connects devices. A router connects networks.
focal: The final two path rules and closing statement.
roles: Same-network row reveals first; different-network row follows; final statement scales in last; open-loop teaser remains small.
sfx: none
Scene 1 [0.0-3.0s]: Reveal the two stable icons and the local path.
Scene 2 [3.0-7.8s]: Draw the router-inclusive path and light the two labels.
Scene 3 [7.8-12.3s]: Land the closing statement and hold for recall.

