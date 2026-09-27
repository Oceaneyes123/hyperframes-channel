---
format: 1080x1920
fps: 30
duration: 111.8s (estimate — replaced by measured Supertonic timings before any frame work)
scenes: 12
narration: per-scene WAV, one track per scene
captions: off
bgm: off
---

# Timed storyboard — Subnets and /24 Explained Visually

Timing source for planning is the estimate table below; after gate 1 approval the
per-scene WAVs are synthesized and `audio_meta.json` (`start_s`, `duration_s`)
becomes the only timing source. Every scene maps to one narration beat and one
narration WAV; tracks are never concatenated.

Measured audio is the sole timing source; the frame `duration` fields below are
copied from `audio_meta.json` and the assembled total is 111.664 seconds.

## Colour and layout contract (all scenes)

- Canvas `#0B1020`, surfaces `#141D35`, rules `#33415F`, ink `#F5F7FF`, muted `#AAB5CC`.
- Blue `#4DA3FF` = client device and the active / selected address portion.
- Mint `#63D69A` = local, same-network, usable host range.
- Amber `#F5B94D` = boundary address (network, broadcast) or mismatch.
- Indigo `#7067E8` = infrastructure (switch, router, subnet container, network portion label).
- Cyan `#4DD9E8` = the remote subnet beyond the router.
- Muted grey = inactive bits, stale octets, out-of-scope networks.
- Portrait safe rectangle `x=72..936`, `y=180..1600`. Vertical source → process →
  destination flow. Address blocks are monospace values (IBM Plex Mono), 40–64px;
  headlines ≤6 words (Barlow, 72–96px); labels 1–4 words, 36px.

---

## Video direction

- Palette: canvas `#0B1020`, surface `#141D35`, ink `#F5F7FF`, muted `#AAB5CC`, blue client traffic, mint local success, amber boundaries/mismatch, indigo infrastructure, cyan remote subnet.
- Motion grammar: one paused seek-safe timeline per frame; smooth long-tail entrances; every reveal follows the spoken cue and the final resolved diagram holds still. No front-loaded slideshow, no screensaver motion, no decorative text sentences.
- Rhythm: frames 5 and 8 hold their resolved answer briefly; frames 9–11 carry the turn and route decision; frame 12 is the quiet recap hold.
- Layout: portrait source → process → destination flow, 24px label spacing, 48px group spacing, content above the 1600px keep-out line.

## Frame 1 — Hook · measured 0.0–12.190s
- Narration reference: `SCRIPT.md#Line 1`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: recognise two local addresses and that `/24` is the unknown
- Dominant visual: two laptops facing each other, `192.168.1.20` and `192.168.1.50`, then a `/24` badge snapping onto the first address
- Icon assets: `public/icons8/laptop.png` (twice, one per laptop)
- Text shown: `192.168.1.20` · `192.168.1.50` · `/24` (headline optional: "One boundary")
- duration: 12.190s
- status: animated
- transition_in: cut
- src: compositions/frames/s01-hook.html
- voiceover: "Two laptops, one network: 192.168.1.20 and 192.168.1.50. Add /24. What does it mean?"
- type: hook
- persuasion: Question to contrast
- beat: curiosity
- blueprint: compose
- focal: `/24` badge
- roles: laptops and addresses = foreground subjects · dark field = background · question implied by muted context = supporting
- Scene 1 (0.0–2.4s): two laptop silhouettes enter in layered-depth top/bottom balance; spring-pop entrance, first address appears below the upper laptop.
- Scene 2 (2.4–6.8s): second laptop settles opposite; second address types on in a vertical split-screen; per-word reveal.
- Scene 3 (6.8–10.0s): `/24` drops onto the first address and becomes the centered focal badge; scale-slam.
- Scene 4 (10.0–12.190s): surrounding objects dim while `/24` holds alone in the upper-third; deliberate held read.
- Beginning state: empty dark canvas
- Ending state: two laptops lit, `/24` badge is the only accent element, question mark implied by dimming the rest
- Transition: cut
- Complexity: 1 idea · 2 actions · 3 objects

## Frame 2 — An IPv4 address is 32 bits · measured 12.190–21.385s
- Narration reference: `SCRIPT.md#Line 2`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: an address is 32 bits shown as four octets
- Dominant visual: `192.168.1.20` splitting into four octet blocks, each opening into 8 bit slots; a counter reading `8+8+8+8 = 32`
- Icon assets: none (custom HyperFrames graphics: octet blocks, bit strip)
- Text shown: `192` · `168` · `1` · `20` · `8+8+8+8` · `32 bits`
- duration: 9.195s
- status: animated
- transition_in: push down
- src: compositions/frames/s02-ipv4-bits.html
- voiceover: "An IP address is really 32 bits, written as four groups called octets. Eight bits, eight bits, eight bits, eight bits."
- type: concept
- persuasion: concretization
- beat: orientation
- blueprint: compose
- focal: 32-bit strip
- roles: octet blocks and bits = foreground subject · dark field = background · count label = supporting
- Scene 1 (0.0–2.0s): dotted address expands into four stacked octet blocks; anchored-layout-expand.
- Scene 2 (2.0–6.2s): each octet fans into eight bit slots in sequence; waterfall-entry across the four groups.
- Scene 3 (6.2–9.195s): all 32 slots highlight as one blue run and `32 bits` lands below; count-up, then hold.
- Beginning state: single dotted address line
- Ending state: four blocks, 32 bits lit, `32 bits` value
- Transition: push down
- Complexity: 1 idea · 1 action · 4 blocks + bit strip

## Frame 3 — What /24 marks · measured 21.385–31.904s
- Narration reference: `SCRIPT.md#Line 3`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: the first 24 bits are the network, the rest are hosts
- Dominant visual: the 32-bit run cut by a vertical divider after bit 24; left side blue "NETWORK 192.168.1", right side mint-outlined "HOST 20"
- Icon assets: none (custom divider, brackets, labels)
- Text shown: `NETWORK` · `HOST` · `192.168.1` · `20` · `/24`
- duration: 10.519s
- status: animated
- transition_in: cut
- src: compositions/frames/s03-prefix-boundary.html
- voiceover: "/24 says the first 24 bits describe the network. So the first three octets name the network, and the last octet is left for hosts."
- type: concept
- persuasion: progressive disclosure
- beat: comprehension
- blueprint: compose
- focal: network/host divider
- roles: divided bit strip = foreground subject · field = background · labels and `/24` marker = supporting
- Scene 1 (0.0–2.4s): undivided 32-bit strip fills the upper half; muted bits hold.
- Scene 2 (2.4–5.8s): divider draws after bit 24 and `/24` lands at the seam; svg-path-draw.
- Scene 3 (5.8–8.4s): first 24 bits fill blue while the final eight remain muted; layer-reveal.
- Scene 4 (8.4–10.519s): `NETWORK 192.168.1` and `HOST 20` separate into stacked groups and hold; control-target-sync.
- Beginning state: undivided 32-bit run from scene 2
- Ending state: NETWORK | HOST split with `/24` marker at the divider
- Transition: cut
- Complexity: 1 idea · 1 action · 2 groups + divider

## Frame 4 — The same boundary as a mask · measured 31.904–42.771s
- Narration reference: `SCRIPT.md#Line 4`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: `/24` and `255.255.255.0` are the same divide
- Dominant visual: the bit run above, now labelled as the mask: 24 ones then 8 zeros, with `255.255.255.0` assembled underneath it and an `=` between `/24` and the mask
- Icon assets: `public/icons/equals.svg`, `public/icons/calculator.svg`
- Text shown: `/24` = `255.255.255.0` · `11111111.11111111.11111111.00000000`
- duration: 10.867s
- status: animated
- transition_in: push down
- src: compositions/frames/s04-subnet-mask.html
- voiceover: "That same boundary has a second name: the subnet mask. /24 and 255.255.255.0 are the same divide."
- type: demonstration
- persuasion: equivalence
- beat: clarity
- blueprint: compose
- focal: `/24` = `255.255.255.0`
- roles: mask rows = foreground subject · field = background · calculator and equals glyphs = supporting
- Scene 1 (0.0–3.0s): 24 blue ones and eight muted zeros settle into four octet groups; layer-reveal.
- Scene 2 (3.0–7.2s): three `255` blocks and a `0` rise beneath their groups; waterfall-entry.
- Scene 3 (7.2–10.867s): equals mark lands between `/24` and the mask, then the aligned equation holds; spring-pop entrance.
- Beginning state: bit run with the divider
- Ending state: mask row aligned under the bit groups with `=`
- Transition: push down
- Complexity: 1 idea · 1 action · 2 rows + equals

## Frame 5 — Network address · measured 42.771–48.762s
- Narration reference: `SCRIPT.md#Line 5`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: clearing the host bits gives the network address
- Dominant visual: the host portion draining to zero, `192.168.1.20` → `192.168.1.0`, then a container labelled `192.168.1.0/24` closing around it
- Icon assets: none (custom container and NETWORK ADDRESS badge)
- Text shown: `192.168.1.20` → `192.168.1.0` · `NETWORK ADDRESS` · `192.168.1.0/24`
- duration: 5.991s
- status: animated
- transition_in: cut
- src: compositions/frames/s05-network-address.html
- voiceover: "Set every host bit to zero, and you get the network address: the name of this subnet."
- type: demonstration
- persuasion: transformation
- beat: payoff
- blueprint: compose
- focal: `192.168.1.0/24` subnet container
- roles: network address = foreground subject · container = infrastructure/supporting · field = background
- Scene 1 (0.0–2.0s): `192.168.1.20` holds centered; host digits fade and replace with `0`; discrete-text-sequence.
- Scene 2 (2.0–4.3s): indigo subnet outline draws around the new address; svg-path-draw.
- Scene 3 (4.3–5.991s): `NETWORK ADDRESS` badge lands beneath and holds; deliberate held read.
- Beginning state: masked address from scene 4
- Ending state: `192.168.1.0` inside an indigo subnet container
- Transition: cut
- Complexity: 1 idea · 1 action · 3 objects

## Frame 6 — Range and broadcast · measured 48.762–57.400s
- Narration reference: `SCRIPT.md#Line 6`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: the subnet covers `.0` to `.255`; the last address is the broadcast
- Dominant visual: an address bar filling from `192.168.1.0` to `192.168.1.255`; the final cell flips to amber and is labelled BROADCAST
- Icon assets: `public/icons/triangle-exclamation.svg`
- Text shown: `192.168.1.0` → `192.168.1.255` · `BROADCAST`
- duration: 8.638s
- status: animated
- transition_in: push down
- src: compositions/frames/s06-range-broadcast.html
- voiceover: "Inside the subnet, addresses run from dot zero to dot two fifty five. The last one, all host bits set, is the broadcast address."
- type: dataviz
- persuasion: range reveal
- beat: boundary
- blueprint: compose
- focal: address range bar
- roles: range bar = foreground subject · endpoint badges = warning/supporting · subnet field = background
- Scene 1 (0.0–3.2s): full-width address bar grows from `.0` toward `.255`; stat-bars-and-fills.
- Scene 2 (3.2–6.2s): first endpoint becomes amber-outlined and last endpoint amber-filled; layer-reveal.
- Scene 3 (6.2–8.638s): `BROADCAST` label lands over the final cell and the endpoints hold; deliberate held read.
- Beginning state: container with `.0`
- Ending state: full range with both endpoints marked, broadcast labelled
- Transition: push down
- Complexity: 1 idea · 1 action · 3 objects

## Frame 7 — Usable host addresses · measured 57.400–66.595s
- Narration reference: `SCRIPT.md#Line 7`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: 256 total, 254 usable, and devices live in that range
- Dominant visual: the range bar with the two endpoints dimmed to muted and the middle lit mint; four device icons dock at example addresses
- Icon assets: `public/icons8/router.png`, `public/icons8/laptop.png`, `public/icons8/phone.png`, `public/icons8/server.png`
- Text shown: `192.168.1.1` – `192.168.1.254` · `254 hosts` · device addresses
- duration: 9.195s
- status: animated
- transition_in: cut
- src: compositions/frames/s07-usable-hosts.html
- voiceover: "Reserve those two, and 254 addresses are left for devices. Here: a router, a laptop, a phone, and a server."
- type: enumeration
- persuasion: concretization
- beat: recognition
- blueprint: compose
- focal: mint usable host span
- roles: usable range = foreground subject · four devices = supporting subjects · endpoints = muted boundaries
- Scene 1 (0.0–2.2s): `.0` and `.255` shrink to muted while the middle span opens; anchored-layout-expand.
- Scene 2 (2.2–6.9s): router, laptop, phone, and server dock onto `.1`, `.20`, `.50`, and `.100` in a top-to-bottom stack; waterfall-entry.
- Scene 3 (6.9–9.195s): `254 HOSTS` lands beside the mint span and the devices hold.
- Beginning state: full range with both boundary endpoints
- Ending state: mint usable span with four devices placed inside it
- Transition: cut
- Complexity: 1 idea · 1 action · 4 devices + bar

## Frame 8 — Same subnet · measured 66.595–72.865s
- Narration reference: `SCRIPT.md#Line 8`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: matching network portions talk directly through the switch
- Dominant visual: two laptops either side of a switch; the shared `192.168.1` portion highlighted blue and identical on both addresses; a mint path pulses straight through
- Icon assets: `public/icons8/laptop.png`, `public/icons/switch-lan.svg`, `public/icons/check.svg`, `public/icons/arrow-right.svg`
- Text shown: `192.168.1.20` · `192.168.1.50` · `SAME NETWORK`
- duration: 6.269s
- status: animated
- transition_in: cut
- src: compositions/frames/s08-same-subnet.html
- voiceover: "Both laptops now. Same first 24 bits, so they reach each other through the switch."
- type: demonstration
- persuasion: payoff
- beat: success
- blueprint: compose
- focal: mint direct path through switch
- roles: two laptops and shared prefix = foreground subjects · switch = infrastructure · check and label = supporting
- Scene 1 (0.0–2.0s): two laptops appear top and bottom with `192.168.1` highlighted blue on both; control-target-sync.
- Scene 2 (2.0–4.5s): mint connector draws straight through the switch; svg-path-draw.
- Scene 3 (4.5–6.269s): check mark and `SAME NETWORK` land in the center and hold; spring-pop entrance.
- Beginning state: two laptops with their addresses
- Ending state: lit direct path with success label
- Transition: cut
- Complexity: 1 idea · 1 action · 4 objects

## Frame 9 — Different subnet · measured 72.864–81.432s
- Narration reference: `SCRIPT.md#Line 9`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: a changed network portion is a different subnet
- Dominant visual: Laptop B's address swapping to `192.168.2.50`; the two network portions (`192.168.1` vs `192.168.2`) flashing amber disagreement; the direct path breaking
- Icon assets: `public/icons8/laptop.png`, `public/icons/triangle-exclamation.svg`
- Text shown: `192.168.1` vs `192.168.2` · `DIFFERENT NETWORK`
- duration: 8.568s
- status: animated
- transition_in: cut
- src: compositions/frames/s09-different-subnet.html
- voiceover: "Move one laptop to 192.168.2.50, and the network portions stop matching. Different subnets."
- type: contrast
- persuasion: mismatch
- beat: turn
- blueprint: compose
- focal: mismatched network portions
- roles: laptop addresses = foreground subjects · amber mismatch markers = supporting · broken path = consequence
- Scene 1 (0.0–2.6s): lower laptop's third octet rolls from `1` to `2`; discrete-text-sequence.
- Scene 2 (2.6–5.4s): `192.168.1` and `192.168.2` pulse amber as a pair; control-target-sync.
- Scene 3 (5.4–7.961s): mint path retracts into a broken grey stub and `DIFFERENT NETWORK` holds; nudge-curve.
- Beginning state: same-network scene with a direct path
- Ending state: mismatched network portions, dead local path
- Transition: cut
- Complexity: 1 idea · 1 action · 3 objects

## Frame 10 — Toward the router · measured 81.432–87.980s
- Narration reference: `SCRIPT.md#Line 10`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: non-local traffic goes to the default gateway
- Dominant visual: Laptop → switch → router vertical path, destination container on the far subnet (cyan), gateway `192.168.1.1` labelled on the router
- Icon assets: `public/icons8/laptop.png`, `public/icons/switch-lan.svg`, `public/icons8/router.png`, `public/icons/globe.svg`, `public/icons/arrow-down.svg`
- Text shown: `DEFAULT GATEWAY` · `192.168.1.1` · `other subnet`
- duration: 6.548s
- status: animated
- transition_in: push down
- src: compositions/frames/s10-default-gateway.html
- voiceover: "That destination is not local, so the laptop sends it to its default gateway, the router at dot one."
- type: demonstration
- persuasion: resolution
- beat: route
- blueprint: compose
- focal: routed packet path
- roles: laptop, switch, router, remote subnet = foreground diagram · packet trail = active signal · field = background
- Scene 1 (0.0–1.8s): grey stub grows from laptop through switch; svg-path-draw.
- Scene 2 (1.8–3.6s): router illuminates indigo and `DEFAULT GATEWAY` lands beside `192.168.1.1`; spring-pop entrance.
- Scene 3 (3.6–6.270s): blue packet trails downward through router toward the cyan remote subnet; nudge-curve, then hold.
- Beginning state: broken local path from scene 9
- Ending state: complete routed path
- Transition: push down
- Complexity: 1 idea · 1 action · 4 objects

## Frame 11 — Why subnets exist · measured 87.980–97.384s
- Narration reference: `SCRIPT.md#Line 11`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: subnets answer "is it local?"
- Dominant visual: two subnet containers side by side with the router between them; one question bar reading `LOCAL?`; a mint arrow into the same subnet and an amber arrow toward the router
- Icon assets: `public/icons/switch-lan.svg`, `public/icons8/router.png`, `public/icons/network-wired.svg`, `public/icons/arrow-right.svg`, `public/icons/arrow-down.svg`
- Text shown: `LOCAL?` · `direct` · `router`
- duration: 9.404s
- status: animated
- transition_in: cut
- src: compositions/frames/s11-why-subnets.html
- voiceover: "Zoom out: two subnets, one router. Every device asks one simple question: is the destination local, or does it go to the router?"
- type: synthesis
- persuasion: zoom out
- beat: principle
- blueprint: compose
- focal: `LOCAL?` decision bar
- roles: two subnet containers = foreground diagram · router = infrastructure · direct/router answers = supporting
- Scene 1 (0.0–2.5s): two subnet containers scale in with the router between them; spring-pop entrance.
- Scene 2 (2.5–4.6s): `LOCAL?` types across the center seam; discrete-text-sequence.
- Scene 3 (4.6–7.0s): mint `direct` path draws into the local subnet; svg-path-draw.
- Scene 4 (7.0–9.195s): amber `router` path draws through the router to the remote subnet; svg-path-draw, then hold.
- Beginning state: routed path from scene 10
- Ending state: two subnets and one router with both decisions drawn
- Transition: cut
- Complexity: 1 idea · 2 actions · 4 objects

## Frame 12 — Recap · measured 97.384–111.665s
- Narration reference: `SCRIPT.md#Line 12`
- Timing source: estimate; `audio_meta.json` after synthesis
- Learning objective: one composition that restates the whole model
- Dominant visual: `192.168.1.20/24` at the top, then its four derived rows — network `192.168.1`, host `20`, mask `255.255.255.0`, network address `192.168.1.0`, usable `192.168.1.1–192.168.1.254` — then a two-lane footer: mint `same subnet → local`, amber `different subnet → router`
- Icon assets: `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons/check.svg`, `public/icons/arrow-right.svg`, `public/icons/triangle-exclamation.svg`
- Text shown: values only, one column, no sentences
- duration: 14.280s
- status: animated
- transition_in: cut
- src: compositions/frames/s12-recap.html
- voiceover: "So /24 means the first 24 bits name the network, and the last 8 address the devices inside it. Same subnet, local. Different subnet, the router. Next: a switch, or a router?"
- type: recap
- persuasion: summary
- beat: close
- blueprint: compose
- focal: `/24` recap stack
- roles: address and derived rows = foreground subject · same/different lanes = supporting · field = background
- Scene 1 (0.0–2.8s): `/24` and `192.168.1.20` settle at the top; spring-pop entrance.
- Scene 2 (2.8–8.8s): network, host, mask, and network-address rows reveal top-to-bottom on their spoken cues; waterfall-entry.
- Scene 3 (8.8–11.8s): usable range row lands and holds; stat-bars-and-fills.
- Scene 4 (11.8–14.280s): mint `same subnet → local` and amber `different subnet → router` footer lanes draw last and hold; svg-path-draw.
- Beginning state: address at the top, empty rows
- Ending state: full recap held still for the closing line
- Transition: cut to black
- Complexity: 1 idea · 2 actions · 5 rows

---

## Gate 1 checklist

- [x] `FACTS.md` fact-checked with RFC sources
- [x] `SCRIPT.md` — 12 lines, display copy separate from narration, values kept on screen
- [x] Timed table agreed with the script (one narration beat per scene)
- [x] `ICON_PLAN.json` — every asset resolved locally (`public/icons8/*.png`, `public/icons/*.svg`), Icons8 attribution recorded
- [x] Icon-first sketches in `sketches/board.html` using the production assets (no placeholder rectangles)
- [ ] Explicit user approval of this board and the sketches (recorded in `review/storyboard-approval.json`)
- [ ] Measured TTS timings replace the estimate column
