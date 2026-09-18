---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Local or router? — measured storyboard

45.905850s measured, seven scenes. `SCRIPT.md` owns narration.
`audio_meta.json` owns the measured timings used below.
The resolved-state sketches are in `sketches/board.html`.

All scenes: 1080x1920; safe rectangle x=72..936/y=180..1600. Large devices and
connections dominate the frame. Retain sender, switch and destination identity
across cuts. Use the actual local assets listed in `ICON_PLAN.json`.
No explanatory sentence on screen. No intentional static hold exceeds 3s.
Review opening/action/result states and the complete sound-off sequence.

## Frame 1 — Need a router?
- duration: 5.503129s
- src: compositions/frames/line-1.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Does every message from your laptop need the router? Watch these two devices.
- Measured window: 0.000000–5.503129s
- Narration reference: SCRIPT.md#Line 1
- Objective: pose the local-versus-remote question immediately.
- Required objects: 2 laptops, 1 switch, 1 packet.
- Icon assets: laptop.png twice, switch.svg, all under public/icons/.
- Beginning state: both endpoints and their local connection visible.
- Ending state: packet poised to move; route question established.
- Visible text: Need a router?
- Continuity: retain all three devices in scene 2; no entrance reset.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–0.917s | Does every message | Show endpoints immediately |
| 0.917–2.752s | need the router | Packet approaches the switch |
| 2.752–5.503s | these two devices | Highlight sender, then destination |

## Frame 2 — Compare the network
- duration: 8.568163s
- src: compositions/frames/line-2.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Here, both addresses use a slash twenty-four prefix. Their network portions match, even though the devices have different numbers.
- Measured window: 5.503129–14.071293s
- Narration reference: SCRIPT.md#Line 2
- Objective: show the matching network portions for this /24 example.
- Required objects: 2 laptops, 1 switch; addresses belong to endpoints.
- Icon assets: laptop.png twice, switch.svg.
- Beginning state: prior diagram; add address labels.
- Ending state: both 192.168.1 prefixes highlighted blue; host portions neutral.
- Visible text: 192.168.1.20/24, 192.168.1.50/24; Compare.
- Continuity: preserve addresses and device positions in scene 3.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–2.142s | both addresses | Reveal the two addresses |
| 2.142–4.284s | prefix | Divide prefix from host portion |
| 4.284–6.426s | network portions match | Highlight matching portions together |
| 6.426–8.568s | different numbers | Briefly highlight .20 and .50 |

## Frame 3 — Deliver locally
- duration: 6.130068s
- src: compositions/frames/line-3.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The destination is local. The laptop sends the packet through the switch to the other device.
- Measured window: 14.071293–20.201361s
- Narration reference: SCRIPT.md#Line 3
- Objective: show delivery through the switch on the connected network.
- Required objects: 2 laptops, 1 switch, 1 moving packet.
- Icon assets: laptop.png twice, switch.svg.
- Beginning state: matching prefixes retained.
- Ending state: packet reaches the destination; receiver displays a green check.
- Visible text: Local.
- Continuity: retain resolved local diagram into scene 4.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–1.751s | destination is local | Launch the packet |
| 1.751–3.503s | through the switch | Switch receives and forwards it |
| 3.503–5.254s | other device | Packet reaches receiver |
| 5.254–6.130s | sentence resolves | Hold receipt state |

## Frame 4 — Change the destination
- duration: 7.105306s
- src: compositions/frames/line-4.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Now change the destination's network. Those highlighted portions no longer match. The destination is remote.
- Measured window: 20.201361–27.306667s
- Narration reference: SCRIPT.md#Line 4
- Objective: show the mismatch that changes the routing decision.
- Required objects: 2 laptops, 1 switch.
- Icon assets: laptop.png twice, switch.svg.
- Beginning state: the same local diagram.
- Ending state: destination is 192.168.2.50/24 in an amber subnet region;
  the former local link is dimmed, not portrayed as a broken physical cable.
- Visible text: Different network; the two addresses.
- Continuity: keep sender and switch; make room for router at the boundary.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–2.030s | change the destination | Replace .1 with .2 in its network prefix |
| 2.030–4.060s | no longer match | Amber mismatch highlight |
| 4.060–6.090s | remote | Separate logical subnet regions |
| 6.090–7.105s | sentence resolves | Hold comparison |

## Frame 5 — Use the gateway
- duration: 5.572789s
- src: compositions/frames/line-5.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: In this simple setup, remote traffic goes to the default gateway: the router.
- Measured window: 27.306667–32.879456s
- Narration reference: SCRIPT.md#Line 5
- Objective: show the gateway as the next hop for this remote destination.
- Required objects: 2 laptops, 1 switch, 1 router, 1 packet (5 total).
- Icon assets: laptop.png twice, switch.svg, router.png.
- Beginning state: retain previous devices; insert router between subnet regions.
- Ending state: blue packet reaches router through the local switch.
- Visible text: Default gateway.
- Continuity: retain packet at router for scene 6; no reset or second send.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–1.592s | simple setup | Reveal router at the boundary |
| 1.592–3.184s | remote traffic goes | Packet passes through local switch |
| 3.184–4.777s | default gateway | Packet reaches router |
| 4.777–5.573s | the router | Brief emphasis on the receiving router |

## Frame 6 — Forward between networks
- duration: 5.921088s
- src: compositions/frames/line-6.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The router forwards the packet toward the other network, where it can reach the destination.
- Measured window: 32.879456–38.800544s
- Narration reference: SCRIPT.md#Line 6
- Objective: show forwarding into the destination network.
- Required objects: 2 laptops, 1 switch (muted), 1 router, 1 packet.
- Icon assets: laptop.png twice, switch.svg, router.png.
- Beginning state: packet at router, unchanged from previous scene.
- Ending state: packet received by destination, green check appears.
- Visible text: Delivered.
- Continuity: retain diagram for recap; do not re-explain the addresses.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–1.692s | router forwards | Packet leaves router |
| 1.692–3.383s | other network | Packet crosses the subnet boundary |
| 3.383–5.075s | reach the destination | Receiver lights green |
| 5.075–5.921s | sentence resolves | Brief result hold |

## Frame 7 — Local or router
- duration: 7.105306s
- src: compositions/frames/line-7.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Same subnet: local delivery. Different subnet: use a router. That is the decision to remember.
- Measured window: 38.800544–45.905850s
- Narration reference: SCRIPT.md#Line 7
- Objective: reinforce the decision with a sequential replay.
- Required objects: 2 laptops, 1 switch, optional router, 1 packet (maximum 5).
- Icon assets: laptop.png twice, switch.svg, router.png on the remote beat.
- Beginning state: return to matching prefixes; hide router for local replay.
- Ending state: different prefix; routed path resolved.
- Visible text: Local, then Router. No summary list.
- Transition: finish on the answer; no extra outro or subscription card.

| Local time | Spoken cue | Action |
| --- | --- | --- |
| 0.000–2.030s | same subnet | Replay local route |
| 2.030–4.060s | different subnet | Change prefix; reveal router |
| 4.060–6.090s | use a router | Replay gateway route |
| 6.090–7.105s | remember | Hold resolved answer |

Sound-off acceptance: the viewer can identify both endpoints, the matching or
different network portions, and the route taken. Capture 0.5s, the main action,
and 0.5s before each measured scene end. Compare object counts/connections with
these sketches. Neither source validation nor these sketches prove final motion.
