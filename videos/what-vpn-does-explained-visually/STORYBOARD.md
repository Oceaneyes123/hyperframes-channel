---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# Timed storyboard — Gate 1 approved

One narration beat per scene, paired with the matching `SCRIPT.md` line. Scene durations now match the measured WAVs in `audio_meta.json` (130.194 seconds total). Broad local beat proportions guide visual pacing; they are not word-level alignment cues. `sketches/board.html` is the actual-icon overview; all diagrams use the downloaded local Icons8 assets.

## Frame 1 — Who sees the road?
- duration: 7.384s; src: sketches/board.html#frame-1; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-00-at-0.1s.png; middle 3.692s: review/scene-evidence-gate2/frame-01-at-3.692s.png; resolve 7.284s: review/scene-evidence-gate2/frame-02-at-7.284s.png; legibility and route placement pass.
- blueprint: compose; transition_in: cut; archetype: hero hook; verb: reroute
- voiceover: “You turn on a VPN, and your internet traffic takes a new exit. What can everyone along the way still see?”
- Objective: pose the visibility question while showing the objects immediately.
- Text: `WHO SEES THE ROAD?`; labels `DEVICE`, `LOCAL NET`, `VPN`, `SITE`.
- Objects/assets: laptop, router, server, globe; 4 teaching objects plus a route.
- Begin: device's normal connection path is faintly shown toward the site through the local network.
- Action: a bright route bends toward the VPN server; a small endpoint marker appears at the site side.
- End/continuity: device, local network, VPN server and site occupy fixed left-to-right roles for the next scene.
- Motion v1: `M.path` on `#route-main`; `M.routeReveal` on `#route-vpn`; persistent `.device`, `.local-router`, `.vpn-endpoint`, `.destination` IDs.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–14% show all four objects; 14–57% reroute the path; 57–100% hold the question over the new exit.
- Transition: hard cut; the question becomes a concrete consumer setup.
- Sound-off: the exit of the route changes from device-side to VPN-side.
- Holds >3s: final read is intentional; review opening, route change, settled endpoints.

## Frame 2 — The example
- duration: 7.384s; src: sketches/board.html#frame-2; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-03-at-7.484s.png; middle 3.692s: review/scene-evidence-gate2/frame-04-at-11.076s.png; resolve 7.284s: review/scene-evidence-gate2/frame-05-at-14.668s.png; legibility and route placement pass.
- blueprint: compose; transition_in: match-morph; archetype: journey; verb: connect
- voiceover: “First, your device opens an encrypted tunnel to a VPN server. We'll follow one website request through it.”
- Objective: establish the protected device-to-server connection and start following one request.
- Text: `TUNNEL CONNECTED`; labels `DEVICE`, `VPN SERVER`, `INTERNET`.
- Objects/assets: smartphone or laptop, server, globe; 3 objects plus tunnel.
- Begin: inherit device and VPN server positions from Frame 1.
- Action: a closed tunnel grows between device and server; server remains distinct from destination.
- End/continuity: tunnel endpoints are established; destination awaits traffic in Frame 3.
- Motion v1: `M.path`/`M.routeReveal` on named `#tunnel-path`; `#vpn-endpoint` keeps its ID and pose.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–20% settle on the device/server pair; 20–70% draw the tunnel; 70–100% hold the connected route.
- Transition: route continuation to the traffic entering the tunnel.
- Sound-off: a protected connection joins device to VPN server, not directly to website.
- Holds >3s: none.

## Frame 3 — The route
- duration: 10.310s; src: sketches/board.html#frame-3; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-06-at-14.868s.png; middle 5.155s: review/scene-evidence-gate2/frame-07-at-19.923s.png; resolve 10.21s: review/scene-evidence-gate2/frame-08-at-24.978s.png; legibility and route placement pass.
- blueprint: compose; transition_in: route-continuation; archetype: decision machine; verb: select
- voiceover: “The tunnel is ready. Route rules choose what enters it. Here, all internet traffic uses the tunnel—a consumer full-tunnel setup. Other settings vary.”
- Objective: show route rules sending internet traffic through the selected full-tunnel example.
- Text: `ROUTED TRAFFIC`; labels `ROUTE RULE`, `FULL TUNNEL`, `SITE`.
- Objects/assets: laptop, VPN server, globe, one packet; 4 objects including the route.
- Begin: tunnel from Frame 2 already exists at local time zero.
- Action: route rules send one website request through the tunnel to the VPN server, then onward to the site.
- End/continuity: the request uses the VPN route; save the bypass example for split tunneling in Frame 12.
- Motion v1: `M.path` reveals the device-to-server tunnel and server-to-site route; `M.travel` carries one request.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–22% inherit the active tunnel; 22–56% reveal the route rule; 56–89% carry the request through the VPN server; 89–100% settle at the site.
- Transition: match cut to the packet itself.
- Sound-off: the full-tunnel example sends the website request through the VPN server.
- Holds >3s: none.

## Frame 4 — The wrapper
- duration: 9.056s; src: sketches/board.html#frame-4; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-09-at-25.178s.png; middle 4.528s: review/scene-evidence-gate2/frame-10-at-29.605s.png; resolve 8.956s: review/scene-evidence-gate2/frame-11-at-34.033s.png; legibility and route placement pass.
- blueprint: compose; transition_in: match-morph; archetype: transformation; verb: encapsulate
- voiceover: “Your website request stays inside an outer packet addressed to the VPN server. That outer packet travels across the local network.”
- Objective: make encapsulation legible without protocol jargon.
- Text: `INSIDE → VPN SERVER`; labels `SITE REQUEST`, `OUTER ADDRESS`.
- Objects/assets: device, inner packet labeled `SITE`, outer packet labeled `VPN SERVER`; 3–4 objects.
- Begin: selected packet from Frame 3 remains intact and addressed to the website.
- Action: an outer envelope grows around it and gains the VPN server as its visible destination; inner destination stays unchanged.
- End/continuity: nested packet travels toward the same VPN endpoint in Frame 5.
- Motion v1: `M.state` grows `.outer-envelope`; `M.swap` changes outer-address label; `M.path` keeps inner and outer IDs attached.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–20% show the original site-bound packet; 20–50% wrap it; 50–80% change the outer destination to VPN server; 80–100% settle.
- Transition: route continuation; outer packet moves into the local network's view.
- Sound-off: the original site request remains inside a new packet addressed to the VPN server.
- Holds >3s: final nested-state read is intentional.

## Frame 5 — The local view
- duration: 12.678s; src: sketches/board.html#frame-5; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-12-at-34.233s.png; middle 6.339s: review/scene-evidence-gate2/frame-13-at-40.472s.png; resolve 12.578s: review/scene-evidence-gate2/frame-14-at-46.711s.png; legibility and route placement pass.
- blueprint: compose; transition_in: route-continuation; archetype: contrast; verb: reveal
- voiceover: “Your Wi-Fi and ISP can see that outer connection: the VPN server, when data moves, and roughly how much. If the tunnel works as intended, they can't read the protected traffic inside.”
- Objective: show visible endpoint/traffic pattern alongside hidden inner contents.
- Text: `ENDPOINT · TIME · VOLUME`; labels `VPN SERVER`, `VISIBLE`, `CONTENTS LOCKED`.
- Objects/assets: router, VPN server, moving outer packet; 3 objects.
- Begin: nested packet enters the local network from Frame 4.
- Action: observer callouts attach to the outer destination, pulse timing marks, and a coarse byte-volume bar; inner site request remains obscured.
- End/continuity: preserve visible VPN endpoint and protected inner contents as packet reaches server.
- Motion v1: `M.edges` reveals outer-route edges; `M.travel` packet; metadata marks use `M.stagger`, not moving paragraphs.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–20% show the outer destination; 20–40% mark connection timing; 40–60% grow the volume indicator; 60–80% show the inner request remains locked; 80–100% resolve visible versus hidden.
- Transition: camera reveal to the server endpoint.
- Sound-off: local observer sees the VPN server, timing and volume but not protected inner contents.
- Holds >3s: final contrast is intentional.

## Frame 6 — The exit
- duration: 7.384s; src: sketches/board.html#frame-6; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-15-at-46.911s.png; middle 3.692s: review/scene-evidence-gate2/frame-16-at-50.503s.png; resolve 7.284s: review/scene-evidence-gate2/frame-17-at-54.095s.png; legibility and route placement pass.
- blueprint: compose; transition_in: camera-reveal; archetype: transformation; verb: unwrap
- voiceover: “At the VPN server, that outer packet opens. The server forwards your original request to the website.”
- Objective: show tunnel termination and forwarding.
- Text: `TUNNEL ENDS HERE`; labels `OUTER OFF`, `SITE REQUEST`, `VPN EXIT`.
- Objects/assets: VPN server, de-encapsulated site-bound packet, globe; 3 objects.
- Begin: same nested packet reaches the same server from Frame 5.
- Action: outer envelope opens at server; inner packet continues on a new outward route toward the site.
- End/continuity: packet approaches the destination; server remains at the exit point.
- Motion v1: `M.swap` removes outer label/envelope; `M.path` moves inner packet along `#egress-route`.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–27% show packet arrival; 27–55% open the outer wrapper; 55–100% move the original request toward the site.
- Transition: route continuation to destination.
- Sound-off: VPN server ends the tunnel, recovers the inner request and forwards it.
- Holds >3s: none.

## Frame 7 — The destination
- duration: 8.429s; src: sketches/board.html#frame-7; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-18-at-54.295s.png; middle 4.214s: review/scene-evidence-gate2/frame-19-at-58.41s.png; resolve 8.329s: review/scene-evidence-gate2/frame-20-at-62.524s.png; legibility and route placement pass.
- blueprint: compose; transition_in: route-continuation; archetype: journey; verb: exit
- voiceover: “From the website's side, this request comes from the VPN server's public IP. That's the new exit for traffic using this route.”
- Objective: expose changed public source address and returning path.
- Text: `VPN SERVER IP`; labels `REQUEST`, `REPLY`, `PUBLIC IP`.
- Objects/assets: VPN server, globe, one request/reply packet; 3–4 objects.
- Begin: site-bound request arrives from the server route established in Frame 6.
- Action: globe returns a packet along the same path; destination label reads `VPN SERVER IP`; device's original IP remains visually separate.
- End/continuity: the return route points back to the device through the VPN server.
- Motion v1: `M.path` follows egress and retraces for reply; `M.impact` at globe/server arrivals.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–27% send request to site; 27–55% show site reply; 55–82% retrace the route; 82–100% reveal the server public IP.
- Transition: hard cut to a comparison of observers.
- Sound-off: the site exchanges traffic with the VPN exit address, not the device's public address.
- Holds >3s: IP comparison is an intentional read.

## Frame 8 — The trust shift
- duration: 8.568s; src: sketches/board.html#frame-8; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-21-at-62.724s.png; middle 4.284s: review/scene-evidence-gate2/frame-22-at-66.908s.png; resolve 8.468s: review/scene-evidence-gate2/frame-23-at-71.092s.png; legibility and route placement pass.
- blueprint: compose; transition_in: hard-cut; archetype: contrast; verb: shift
- voiceover: “Your local network sees less of the protected traffic. But now your VPN provider runs that exit point. Trust has shifted.”
- Objective: balance the visibility benefit with the new trust relationship.
- Text: `TRUST SHIFTS`; labels `LOCAL NETWORK`, `VPN PROVIDER`, `DESTINATION`.
- Objects/assets: router, VPN server, globe; 3 objects plus trust marker.
- Begin: the local-to-provider-to-site path remains the same as prior scenes.
- Action: visibility beam from local observer narrows at the tunnel; provider position illuminates at tunnel exit.
- End/continuity: provider is the emphasized intermediate party; avoid a “good/bad” provider judgement.
- Motion v1: `M.state` fades local visibility overlay and transfers focus to server; persistent endpoints stay fixed.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–33% show local observer view; 33–67% block the inner view; 67–100% highlight provider at the exit.
- Transition: match cut into two separate protection layers.
- Sound-off: less visibility for the local network comes with a VPN provider at the tunnel endpoint.
- Holds >3s: final trust state is intentional.

## Frame 9 — Two locks
- duration: 16.022s; src: sketches/board.html#frame-9; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-24-at-71.292s.png; middle 8.011s: review/scene-evidence-gate2/frame-25-at-79.203s.png; resolve 15.922s: review/scene-evidence-gate2/frame-26-at-87.114s.png; legibility and route placement pass.
- blueprint: compose; transition_in: match-morph; archetype: transformation; verb: layer
- voiceover: “What the provider can observe or keep depends on its service and setup. A VPN doesn't replace HTTPS. HTTPS is a separate lock that can protect page contents from your device to the website, even after the VPN tunnel ends.”
- Objective: distinguish VPN transport protection from HTTPS end-to-end content protection.
- Text: `VPN + HTTPS`; labels `TUNNEL`, `HTTPS`, `PAGE CONTENT`.
- Objects/assets: device, VPN server, globe, two lock marks; 3 main objects.
- Begin: retain device → VPN server → site geometry; the server remains a trusted endpoint, not the HTTPS endpoint.
- Action: draw the VPN tunnel to server, then a distinct HTTPS lock from device to website; page-content symbol stays inside the HTTPS span.
- End/continuity: two independently scoped locks remain visible for the next privacy limitation.
- Motion v1: two `M.routeReveal` paths with separate IDs and endpoints; `M.state` switches only the relevant layer.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–31% show tunnel boundary; 31–69% extend HTTPS protection to site; 69–100% hold the two protection scopes.
- Transition: hard cut to site-side identity signals.
- Sound-off: VPN and HTTPS protect different parts of the route; HTTPS continues to the website.
- Holds >3s: final scope comparison is intentional.

## Frame 10 — Still recognizable
- duration: 7.175s; src: sketches/board.html#frame-10; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-27-at-87.314s.png; middle 3.587s: review/scene-evidence-gate2/frame-28-at-90.802s.png; resolve 7.075s: review/scene-evidence-gate2/frame-29-at-94.289s.png; legibility and route placement pass.
- blueprint: compose; transition_in: hard-cut; archetype: decision machine; verb: identify
- voiceover: “A different exit doesn't hide who you are. Sign in or bring the same cookie, and the website may recognize you.”
- Objective: show two independent identity signals reaching the service.
- Text: `ACCOUNT · COOKIE`; labels `SIGNED IN`, `SAME COOKIE`, `RECOGNIZED`.
- Objects/assets: smartphone/laptop, cookies, globe; 3 objects.
- Begin: VPN route can remain faint in the background, but identity is shown at the app/service layer.
- Action: account badge and cookie travel with request to the same site; site matches them to a returning user.
- End/continuity: service recognition remains despite VPN route/IP change.
- Motion v1: `M.travel` carries account and cookie markers to `#destination`; `M.impact` marks the match.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–22% show alternate public IP; 22–67% carry account/cookie with request; 67–100% show site recognition.
- Transition: match cut from device to device security boundary.
- Sound-off: account and cookie connect a visit to the same service identity.
- Holds >3s: recognition result is an intentional read.

## Frame 11 — The device
- duration: 9.195s; src: sketches/board.html#frame-11; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-30-at-94.489s.png; middle 4.598s: review/scene-evidence-gate2/frame-31-at-98.987s.png; resolve 9.095s: review/scene-evidence-gate2/frame-32-at-103.484s.png; legibility and route placement pass.
- blueprint: compose; transition_in: match-morph; archetype: contrast; verb: intercept
- voiceover: “If a compromised device exposes information before traffic enters the tunnel, the VPN can't hide it. Protection starts at the device.”
- Objective: locate the VPN's protection boundary at the device and show the limitation.
- Text: `BEFORE THE TUNNEL`; labels `DEVICE`, `VPN START`, `EXPOSED`.
- Objects/assets: laptop, lock, VPN server, a simple threat mark; 3–4 objects.
- Begin: device remains the traffic source.
- Action: a compromised-device mark reaches the request before it enters the tunnel; the later tunnel wraps only traffic that reaches its boundary.
- End/continuity: protection begins at the VPN client boundary; device status remains visibly outside VPN control.
- Motion v1: `M.path` threat mark stops before tunnel; `.tunnel-path` starts only at device egress.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–22% locate VPN boundary; 22–56% expose data at device; 56–78% show tunnel cannot undo exposure; 78–100% hold the boundary distinction.
- Transition: route continuation to a traffic fork.
- Sound-off: a VPN protects a route after the device boundary, not a compromised endpoint.
- Holds >3s: none.

## Frame 12 — Not every route
- duration: 7.245s; src: sketches/board.html#frame-12; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-33-at-103.684s.png; middle 3.622s: review/scene-evidence-gate2/frame-34-at-107.207s.png; resolve 7.145s: review/scene-evidence-gate2/frame-35-at-110.729s.png; legibility and route placement pass.
- blueprint: compose; transition_in: route-continuation; archetype: decision machine; verb: split
- voiceover: “The tunnel may not carry every app. Split tunneling sends chosen connections out over a different route.”
- Objective: qualify app/connection routing and define split tunneling simply.
- Text: `SOME TRAFFIC BYPASSES`; labels `APP A`, `VPN`, `APP B`, `DIRECT`.
- Objects/assets: device, two app/request markers, VPN server, destination; 4–5 objects.
- Begin: inherit route fork from Frame 3, with tunnel still active.
- Action: App A's packet enters VPN; App B's packet follows an explicit direct branch outside tunnel.
- End/continuity: both paths reach destinations; do not imply the VPN has failed.
- Motion v1: separate `M.path` routes and `M.travel` channels; one packet uses tunnel, one bypasses.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–20% show active full-tunnel example; 20–50% branch app requests; 50–70% route App A through VPN; 70–100% route App B directly and settle.
- Transition: camera-reveal to the name lookup request.
- Sound-off: a route rule can keep some app traffic outside the VPN tunnel.
- Holds >3s: none.

## Frame 13 — DNS has a route
- duration: 7.732s; src: sketches/board.html#frame-13; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-36-at-110.929s.png; middle 3.866s: review/scene-evidence-gate2/frame-37-at-114.695s.png; resolve 7.632s: review/scene-evidence-gate2/frame-38-at-118.461s.png; legibility and route placement pass.
- blueprint: compose; transition_in: camera-reveal; archetype: contrast; verb: route
- voiceover: “Even a website lookup needs a route. DNS may go through the VPN, or somewhere else; the settings decide.”
- Objective: prevent the false assumption that DNS always follows the tunnel.
- Text: `DNS: CONFIGURATION MATTERS`; labels `LOOKUP`, `VIA VPN`, `OR OTHER ROUTE`.
- Objects/assets: device, router/resolver, VPN server; 3 objects plus two mutually exclusive query paths.
- Begin: current route branches remain visible at local time zero.
- Action: a domain lookup leaves the device; both possible route endpoints are shown, with one selected path at a time.
- End/continuity: selected path is marked `CONFIGURATION`, with no unsupported leak claim.
- Motion v1: `M.path` draws alternate SVG routes; `M.state` selects one demonstrative outcome without naming a universal default.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–22% show lookup; 22–67% reveal VPN and alternate resolver routes; 67–100% mark configuration as selector.
- Transition: match cut to the complete path.
- Sound-off: DNS can follow the tunnel or a different configured route.
- Holds >3s: route comparison is an intentional read.

## Frame 14 — A new exit, a new trust
- duration: 11.633s; src: sketches/board.html#frame-14; status: preview ready; Gate 2 pending
- Preview review: open 0.1s: review/scene-evidence-gate2/frame-39-at-118.661s.png; middle 5.817s: review/scene-evidence-gate2/frame-40-at-124.378s.png; resolve 11.533s: review/scene-evidence-gate2/frame-41-at-130.094s.png; legibility and route placement pass.
- blueprint: compose; transition_in: match-morph; archetype: constellation recap; verb: assemble
- voiceover: “So who sees the road? Your local network sees the VPN connection. The website sees the VPN server's address. The provider sits at the exit. New path, new trust.”
- Objective: resolve the opening question with the complete mental model.
- Text: `A NEW EXIT. A NEW TRUST.`; labels `DEVICE`, `ENCRYPTED TUNNEL`, `VPN EXIT`, `SITE`.
- Objects/assets: laptop, router, server, globe; 4 objects plus inner/outer route.
- Begin: known object identities and route rules return from prior scenes.
- Action: assemble the selected route; local observer sees the outer endpoint, website sees the VPN exit, provider sits at tunnel termination.
- End: settled takeaway: local network sees less of protected contents, destination sees VPN egress IP, provider is a new trust party.
- Motion v1: `M.path` assembles known routes; no new object or claim; `M.camera` pulls back only if labels remain in safe zone.
- Broad visual phases scaled to measured WAV (not word-level alignment): 0–25% show device-to-server tunnel; 25–44% reveal local observer view; 44–69% show server-to-site egress; 69–88% reveal public exit IP; 88–100% resolve hook and provider trust role.
- Transition: final hold; no generic outro.
- Sound-off: shows the new exit and all three visibility roles.
- Holds >3s: final read is intentional.

## Required-point coverage

| Required point | Scene(s) |
| --- | --- |
| Typical consumer full tunnel; protocols/configurations vary | 2, 3, 12, 13 |
| Device establishes tunnel; selected traffic routes through it | 2–3 |
| Original packet inside outer traffic addressed to VPN server | 4 |
| Local network/ISP sees VPN endpoint, timing/volume, not protected contents in a correctly working encrypted tunnel | 5 |
| VPN server receives/forwards; destination generally sees VPN public IP | 6–7 |
| Provider becomes trusted party; visibility/retention varies | 8–9 |
| Accounts/cookies can identify | 10 |
| VPN does not replace HTTPS | 9 |
| VPN does not protect a compromised device | 11 |
| Not every app/connection uses tunnel; split tunneling | 3, 12 |
| DNS handling depends on configuration | 13 |

## Visual and timing review status

- Design reference: `DESIGN.md` and `MOTION.md` inspected. The designated approved quality-reference folder is absent from this checkout; no reference frame was available to inspect.
- Script-to-visual update: Frames 2–3 separate tunnel setup from route selection; Frame 3 follows the request through the VPN server and ends the protected state at the exit. Frame 12 demonstrates the bypass route. The final payoff packet stops at the VPN exit.
- Preview: complete 14-scene v2 composition, 1080×1920 at 30 fps, 130.194 seconds. Forty-two captures cover each scene opening, midpoint and resolved state in `review/scene-evidence-gate2/`; five contact sheets are saved there.
- Checks: project preview validation passed; HyperFrames reported 0 lint/runtime/layout/motion issues across 60 layout samples and 47/47 text contrast checks passed WCAG AA.
- Audio: 14 local WAVs and measured timing match `audio_meta.json`. No human listening or word-level alignment review is recorded.
- Gate 2: complete preview awaits user review. No video render has been made.
