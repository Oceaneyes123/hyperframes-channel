---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# NAT Explained Visually — timed storyboard

15 scenes, **119.258s measured** narration (Supertonic 3, voice M1, one WAV per
scene). Every duration and local beat below was retimed from the planning
estimates to the measured `audio_meta.json` values; that file stays the only
timing source. Scene windows are contiguous and start at zero.

Gate 1: approved by the user ("Please contiinue, I approve it"); `review/storyboard-approval.json`
records the scope. Evidence (measured, not assumed): `sketches/board.html` renders all 15 scenes with
the production icons and was measured in the browser against the safe rectangle — worst
overflow 0px in every scene, except frame 8's headline which reports a 4px left inset from
its negative letter-spacing em box while its ink starts on x=72 like every other headline.
`python scripts/validate_project.py --project videos/nat-explained-visually --stage plan`
exits 0. Normalized narration: 15 lines, 324 spoken words, fingerprint 0d2f65a8 (dry run
saved evidence printed at gate 1). No WAV exists yet and no frame is built.

`SCRIPT.md` owns narration and display copy. `frame.md` owns object IDs, bounds
and route attachment points. `ICON_PLAN.json` names the asset paths.
All scenes: 1080x1920, safe rectangle x=72..936 / y=180..1600. Movement always
happens on the `home-bus` / `outside-hop` route defined in `frame.md`; replies
retrace it in reverse and never swap device positions.

## Frame 1 — Two devices, one address
- duration: 7.035646s
- src: compositions/frames/line-1.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Your phone and your laptop have different private addresses. So why does the Internet see one public IP?
- Measured window: 0.000000–7.035646s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 1`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: pose the question — two different private addresses, one public address.
- Dominant visual: two blue source markers follow separate routes into the router; one cyan marker leaves it and reaches the website.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons8/globe.png`.
- Required objects and counts: 2 devices, 1 router, 2 private markers merging into 1 public marker, 1 public address, 1 Internet globe and 1 website.
- Text shown: `SAME PUBLIC IP?` (headline), `192.168.1.10`, `192.168.1.20`, `PUBLIC 203.0.113.7`, `INTERNET`.
- Animation: private markers follow the two drawn branches into the router; one cyan marker continues through the public address and Internet to the website, which lights on arrival.
- Beginning state: complete inside/outside diagram at local time 0, no packet.
- Ending state: two private addresses converge at the router; one public value is visible and the website lights as the outbound marker arrives.
- Transition: cut.
- Continuity: the same two devices, router and globe positions carry into frame 2; no entrance reset.
- Geometry source: `frame.md` `phone`, `laptop`, `router`, `globe`, `public-chip`.
- Scene archetype: Hero hook
- Primary motion verb: route and merge
- Transition grammar: opening scene; no incoming transition
- Complexity: 1 idea · 3 actions · 7 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.0–1.6s | Why does the Internet see one public IP? | Devices, router and real route are present immediately | `#line-1-phone`, `#line-1-laptop`, `#line-1-router`, `#line-1-bus` | 0.15s local — `review/improvement-pilot-final/frame-00-at-0.15s.png`; pass: full route and endpoints are visible before the tokens move. |
| 1.1–3.6s | different private addresses | Phone marker follows its branch into the router as its address appears | `#line-1-packet-phone`, `#line-1-addr-phone` | 3.2s local — `review/improvement-pilot-final/frame-01-at-3.2s.png`; pass: private value is visible and its blue marker follows the drawn branch. |
| 2.2–4.2s |  | Laptop marker follows the drawn branch into the same router | `#line-1-packet-laptop`, `#line-1-addr-laptop` | 4.2s local — `review/improvement-pilot-final/frame-02-at-4.2s.png`; pass: both private paths converge at the same router. |
| 4.1–6.2s | one public IP | One cyan marker leaves the router through the public address and reaches the Internet | `#line-1-packet-public`, `#line-1-public`, `#line-1-globe` | 5.3s local — `review/improvement-pilot-final/frame-03-at-5.3s.png`; pass: one cyan marker reaches the Internet with the public address visible. |
| 5.8–7.0s | the website | The marker touches the website route endpoint and the server lights on receipt | `#line-1-packet-public`, `#line-1-server`, `#line-1-server-glow` | 6.7s local — `review/improvement-pilot-final/frame-04-at-6.7s.png`; pass: marker reaches the server and its arrival glow turns on. |

- Intentional hold over 3s: none.
- Sound-off check: a viewer sees two devices, two different values, one router and one value on the outside — the question is legible without sound.
- Review samples (audio-local times): opening 0.15s; private route 3.2s; merge 4.2s; public route 5.3s; website receipt 6.7s.
- Adjacent-cut review: first scene — not applicable. Inspected 7.2s local in `review/improvement-pilot-final/frame-05-at-7.2s.png`; pass: phone, laptop, router and route keep their positions as the scene-local markers clear.

## Frame 2 — Private addresses inside the home
- duration: 10.657959s
- src: compositions/frames/line-2.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Inside your home, each device gets a private address from the router, like one ninety two dot one sixty eight dot one dot ten. Every home network reuses these ranges.
- Measured window: 7.035646–17.693605s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 2`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: these are private addresses handed out inside the home, and the same ranges exist in every home.
- Dominant visual: the two devices with their private addresses, held above the router.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`.
- Required objects and counts: 2 devices, 1 router, 2 address labels (addresses belong to the devices).
- Text shown: `PRIVATE ADDRESSES`, `192.168.1.10`, `192.168.1.20`.
- Animation: the two addresses highlight in turn, then both highlight together as "reused"; the router's inside face is emphasised.
- Beginning state: inherits frame 1's diagram and both addresses.
- Ending state: both private addresses highlighted as the "every home reuses these" pair.
- Transition: cut.
- Continuity: addresses and device positions persist into frame 3.
- Geometry source: `frame.md` `phone`, `laptop`, `phone-addr`, `laptop-addr`, `router`.
- Complexity: 1 idea · 1 action · 3 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–2.642s | Inside your home | `phone`, `laptop`, `router` visible; headline reads `PRIVATE ADDRESSES` | #line-2-hl-phone | 7.186s → fix→pass: the box was 90px wide and clipped the value; resized to the measured label box (x=126 w=248) |
| 2.642–6.377s | each device gets a private address … dot ten | `phone-addr` then `laptop-addr` highlight in sequence | #line-2-hl-laptop | 12.365s → pass: laptop address highlighted second |
| 6.377–10.658s | Every home network reuses these ranges | both addresses highlight together; a muted "reused everywhere" bracket spans them | #line-2-reuse, #line-2-addr-laptop | 17.494s → fix→pass: bracket resized to x=120 w=760 (was 96..946, past the safe edge); laptop value turns client blue |

- Intentional hold over 3s: none (the sequence highlight spans the whole scene).
- Sound-off check: two devices, two private values, one router giving them out.
- Review samples: opening, first address highlighted, both highlighted.
- Adjacent-cut review: frame 1 ends with the public chip and both addresses; frame 2 must open on the identical device positions with the chip still present — verify both.

## Frame 3 — Why private addresses cannot cross the Internet
- duration: 8.359184s
- src: compositions/frames/line-3.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Those addresses are not unique on the Internet. Millions of homes use the same ones, so no Internet router will deliver to them.
- Measured window: 17.693605–26.052789s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 3`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: a private address is not unique, so the public Internet will not deliver to it.
- Dominant visual: the phone's packet reaches the router and stops at an amber boundary marker short of the Internet.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons8/globe.png`, `public/icons/triangle-exclamation.svg`.
- Required objects and counts: 2 devices (laptop muted), 1 router, 1 packet, 1 amber boundary + warning glyph, 1 globe (5 meaningful objects).
- Text shown: `NOT UNIQUE` (headline), `192.168.1.10`, `INTERNET`.
- Animation: a packet leaves the phone with the private port chip, reaches the router, continues to the amber boundary marker, and is stopped there with a warning glyph; the globe stays dimmed beyond it.
- Beginning state: same diagram as frame 2, no packet.
- Ending state: packet halted at the boundary, private address visible on the stopped packet.
- Transition: cut.
- Continuity: no packet in frame 4; the devices, router and globe keep their coordinates.
- Geometry source: `frame.md` `phone`, `router`, `globe`, `packet`, `packet-port`; amber boundary at y=1180 spanning the safe width.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–2.043s | Those addresses are not unique | `phone-addr` chip on the packet; packet leaves the phone | #line-3-pkt-1 | 17.844s → pass: packet leaves the phone below its label |
| 2.043–5.016s | Millions of homes use the same ones | packet passes the router; amber boundary and warning glyph appear | #line-3-boundary, #line-3-warn | 21.873s → pass: amber boundary + warning glyph appear |
| 5.016–8.359s | no Internet router will deliver to them | packet stops at the boundary and is marked with the warning glyph; the globe stays dimmed | #line-3-globe | 25.853s → pass: packet stopped at the boundary, globe dimmed |

- Intentional hold over 3s: none.
- Sound-off check: a packet visibly fails to leave the home network.
- Review samples: opening, packet at the boundary, stopped state.
- Adjacent-cut review: frame 2 ends with both addresses highlighted; frame 3 opens on the same diagram — verify positions and that frame 2's highlight is cleared, not carried.

## Frame 4 — The router's public address
- duration: 9.682721s
- src: compositions/frames/line-4.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: On the outside, the router has one public address: two oh three dot zero dot one thirteen dot seven. That is the address the Internet sees.
- Measured window: 26.052789–35.735510s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 4`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the router owns exactly one public address, on its outside face.
- Dominant visual: the router between the private addresses above and the Internet below, with the public address called out beneath it.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons8/globe.png`.
- Required objects and counts: 2 devices, 1 router, 1 public chip, 1 globe.
- Text shown: `PUBLIC ADDRESS`, `203.0.113.7`, `192.168.1.10`.
- Animation: the amber boundary clears; the router's outside face is emphasised; the public chip locks into its permanent position and stays for the rest of the video.
- Beginning state: frame 3's diagram without the packet or the amber boundary.
- Ending state: public chip fixed below the router, linking the router to the globe.
- Transition: cut.
- Continuity: `public-chip` never moves again; the devices keep their coordinates.
- Geometry source: `frame.md` `router`, `public-chip`, `globe`.
- Complexity: 1 idea · 1 action · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–2.373s | On the outside | amber boundary disappears; the router's outside face highlights | #line-4-router-ring, #line-4-globe | 26.203s → pass: router's outside face ringed |
| 2.373–6.075s | one public address … dot seven | `public-chip` lands below the router and its value is written out | #line-4-public | 30.894s → pass: public chip landed below the router |
| 6.075–9.683s | That is the address the Internet sees | the highlighted value travels to the globe and the globe highlights | #line-4-hop, #line-4-globe | 35.536s → pass: route to the Internet brightened |

- Intentional hold over 3s: none.
- Sound-off check: one value sits between the router and the Internet; the private values stay above.
- Review samples: opening, chip landed, value linked to the globe.
- Adjacent-cut review: frame 3 ends on a stopped packet and an amber marker; frame 4 must open with both removed and the diagram identical otherwise — verify.

## Frame 5 — A device sends traffic out
- duration: 7.453605s
- src: compositions/frames/line-5.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Your phone opens a connection to a website. Its packet leaves with a private source address and a source port.
- Measured window: 35.735510–43.189116s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 5`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the packet leaves carrying the phone's private address and a source port.
- Dominant visual: the packet leaving the phone with `192.168.1.10:51000`, and the NAT table standing empty beside the router.
- Icon assets: `public/icons8/phone.png`, `public/icons8/router.png`, `public/icons/table-cells.svg`, `public/icons/arrow-down.svg`.
- Required objects and counts: 1 device (laptop muted), 1 packet, 1 router, 1 empty table (4 objects).
- Text shown: `OUT IT GOES`, `192.168.1.10:51000`, `NAT TABLE`.
- Animation: the phone's label grows to include the source port; the packet leaves and travels the trunk toward the router; the empty table (dashed slots) appears beside the router as the packet reaches it.
- Beginning state: frame 4's diagram, table not yet introduced.
- Ending state: packet resting just below the router (x=250, y=1120), table visible with two dashed empty slots.
- Transition: cut.
- Continuity: the table's position is fixed from here to frame 15.
- Geometry source: `frame.md` `phone-addr`, `packet`, `packet-port`, `home-bus`, `nat-panel`, `nat-slot-1`, `nat-slot-2`.
- Complexity: 1 idea · 1 action · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.816s | Your phone opens a connection | `phone` highlights; its label gains `:51000` | #line-5-addr-phone, #line-5-addr-phone-ext | 35.886s → pass: label gains :51000 |
| 1.816–4.396s | Its packet leaves | `packet` leaves the phone along `home-bus`; `packet-port` reads `51000` | #line-5-pkt-1 | 39.462s → pass: chip 51000 travels the trunk |
| 4.396–7.454s | a private source address and a source port | `nat-panel` appears with two empty dashed slots; packet reaches the router | #line-5-table, #line-5-table-icon, #line-5-table-title, #line-5-slot-1, #line-5-slot-2 | 42.989s → pass: empty table with two dashed slots |

- Intentional hold over 3s: none.
- Sound-off check: a packet with a private value is on its way and the router's table is visibly empty.
- Review samples: opening, packet mid-route, packet at the router with the empty table.
- Adjacent-cut review: frame 4 ends with the public chip locked; frame 5 opens on the same layout — verify the chip is still present and unmoved.

## Frame 6 — The router rewrites the source
- duration: 8.150204s
- src: compositions/frames/line-6.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The router replaces that private source with its public address and a port of its own, and writes the pair into its table.
- Measured window: 43.189116–51.339320s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 6`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the router substitutes its own address and port, and records the mapping.
- Dominant visual: the packet's value changing at the router while row 1 appears in the table.
- Icon assets: `public/icons8/router.png`, `public/icons8/phone.png`, `public/icons/arrow-right.svg`, `public/icons/table-cells.svg`.
- Required objects and counts: 1 router, 1 packet, 1 table + row 1, 1 device (muted) (4 objects).
- Text shown: `REWRITE SOURCE` (72px), `192.168.1.10:51000`, `203.0.113.7:40001`, `NAT TABLE`.
- Animation: the private packet collapses at the router; a cyan public packet snaps into the same position. The table writes the private/public pair and links the values with an arrow.
- Beginning state: packet at the router, empty table.
- Ending state: translated packet still at the router, row 1 written and highlighted.
- Transition: cut.
- Continuity: row 1 keeps its place and text for the rest of the video.
- Geometry source: `frame.md` `packet`, `packet-port`, `nat-slot-1`, `nat-row-1`, `nat-panel`.
- Scene archetype: Transformation
- Primary motion verb: snap and rewrite
- Transition grammar: hard cut introduces the router's translation step
- Complexity: 1 idea · 3 actions · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.0–3.71s | router replaces the private source | The private packet and its `51000` value hold at the router | `#line-6-pkt-1`, `#line-6-pkt-1-core`, `#line-6-router-ring` | 0.15s local — `review/improvement-pilot-nat-rewrite-final/frame-01-at-43.34s.png`; 3.71s local — `review/improvement-pilot-nat-rewrite-final/frame-02-at-46.9s.png`; pass: the private value holds before the rewrite. |
| 3.71–4.21s | with its public address and port | The private marker contracts away; the public `40001` marker snaps into the same point | `#line-6-pkt-1-core`, `#line-6-pkt-2-core`, `#line-6-pkt-2` | 3.71s local — `review/improvement-pilot-nat-rewrite-final/frame-02-at-46.9s.png`; 4.21s local — `review/improvement-pilot-nat-rewrite-final/frame-03-at-47.4s.png`; pass: the marker changes from `51000` to `40001` at the router. |
| 4.21–7.01s | the router writes the pair into its table | Row 1 records the private endpoint, arrow and public endpoint | `#line-6-row-1-in`, `#line-6-row-1-arrow`, `#line-6-row-1-out` | 4.21s local — `review/improvement-pilot-nat-rewrite-final/frame-03-at-47.4s.png`; 7.01s local — `review/improvement-pilot-nat-rewrite-final/frame-04-at-50.2s.png`; pass: the row builds to the complete private-to-public mapping. |
| 7.01–8.01s | sentence resolves | The complete mapping holds under one highlighted row | `#line-6-row-1-hl` | 7.01s local — `review/improvement-pilot-nat-rewrite-final/frame-04-at-50.2s.png`; 8.01s local — `review/improvement-pilot-nat-rewrite-final/frame-05-at-51.2s.png`; pass: the highlighted mapping persists to the cut. |

- Intentional hold over 3s: none.
- Sound-off check: the packet's value visibly changes and the same pair becomes a table row.
- Review samples (audio-local times): opening 0.15s, old value 3.71s, rewritten value 4.21s, complete row 7.01s, scene end 8.01s.
- Adjacent-cut review: frame 5 end → frame 6 opening inspected at 43.18s and 43.34s; pass: the router and private `51000` chip persist. Frame 6 end → frame 7 opening inspected at 51.2s and 51.5s; pass: the same public mapping row persists.

## Frame 7 — What the website sees
- duration: 9.055782s
- src: compositions/frames/line-7.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Outside, the packet carries the public address. The website sees one connection from your router, and replies to that address and port.
- Measured window: 51.339320–60.395102s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 7`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: beyond the router only the public address is visible.
- Dominant visual: the translated packet travelling from the router into the Internet and reaching the website.
- Icon assets: `public/icons8/router.png`, `public/icons8/globe.png`, `public/icons8/server.png`.
- Required objects and counts: 1 router, 1 packet, 1 globe, 1 server, 1 table row (5 objects).
- Text shown: `THE SITE SEES`, `203.0.113.7:40001`, `INTERNET`, `WEBSITE`.
- Animation: the packet leaves the router down the trunk, enters the globe, crosses the outside hop, and arrives at the server; the row-1 outside value highlights as the packet's chip matches it.
- Beginning state: frame 6's translated packet at the router.
- Ending state: packet at the website, chip reading `40001`, row 1's outside value still highlighted.
- Transition: cut.
- Continuity: the packet stays at the website into frame 8; router and table unchanged.
- Geometry source: `frame.md` `packet`, `packet-port`, `home-bus`, `outside-hop`, `globe`, `server`, `nat-row-1`.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–2.211s | Outside, the packet carries the public address | packet leaves the router; chip stays cyan `40001` | #line-7-pkt-1 | 51.489s → pass: leaves the router downward |
| 2.211–4.528s | The website sees one connection from your router | packet crosses the globe and `outside-hop` | #line-7-pkt-1 | 55.867s → pass: crosses the globe along the hop |
| 4.528–6.739s | and replies to that address and port | packet reaches `server`; the server highlights as the connection lands | #line-7-server-ring | 60.195s → pass: arrival ring at the website |
| 6.739–9.056s | sentence resolves | row 1's outside value stays highlighted as the source of this connection | #line-7-row-1-hl-on | 60.195s → pass: row 1's outside value stays the source of this connection |

- Intentional hold over 3s: none.
- Sound-off check: one packet leaves the router and arrives at a website carrying the public value only.
- Review samples: opening, mid-route through the globe, arrival at the website.
- Adjacent-cut review: frame 6 ends with the packet at the router; frame 7 opens with it leaving that exact position — verify no jump.

## Frame 8 — A second device joins
- duration: 7.174966s
- src: compositions/frames/line-8.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Now your laptop opens its own connection. It has a different private address and a different source port.
- Measured window: 60.395102–67.570068s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 8`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: a second device starts its own connection with its own private address and port.
- Dominant visual: the laptop's packet leaving with `192.168.1.20:52000` while the phone's connection is still out there.
- Icon assets: `public/icons8/laptop.png`, `public/icons8/phone.png`, `public/icons8/router.png`, `public/icons/table-cells.svg`.
- Required objects and counts: 2 devices, 2 packets, 1 router, 1 table with row 1 (5 objects).
- Text shown: `A SECOND DEVICE`, `192.168.1.20:52000`, `192.168.1.10:51000`.
- Animation: the laptop's label grows to include `:52000`; its packet leaves along the trunk; the first packet remains at the website.
- Beginning state: frame 7's arrival, with row 1 in the table.
- Ending state: second packet at the router; table still holding only row 1.
- Transition: cut.
- Continuity: the first packet stays at the website; the phone's row and the laptop's device keep their identity.
- Geometry source: `frame.md` `laptop-addr`, `packet` (second instance), `home-bus`, `nat-row-1`.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.845s | Now your laptop opens its own connection | `laptop` highlights; its label gains `:52000` | #line-8-addr-laptop, #line-8-addr-laptop-ext | 60.545s → pass: laptop label gains :52000 |
| 1.845–4.305s | It has a different private address | second packet leaves the laptop with `packet-port` `52000` | #line-8-pkt-3 | 63.983s → pass: second packet on the same trunk |
| 4.305–7.175s | and a different source port | second packet reaches the router; row 1 still the only entry | #line-8-pkt-3, #line-8-pkt-1 | 67.37s → pass: second packet below the router; table still one row |

- Intentional hold over 3s: none.
- Sound-off check: two devices, two different private values, one table row so far.
- Review samples: opening, second packet mid-route, second packet at the router.
- Adjacent-cut review: frame 7 ends at the website; frame 8 opens on the same state with the first packet still parked there — verify.

## Frame 9 — One address, two ports
- duration: 7.244626s
- src: compositions/frames/line-9.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The router gives it the same public address, but its own outside port, so it can tell the two connections apart.
- Measured window: 67.570068–74.814694s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 9`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: both connections leave through the same public address, told apart by their outside ports.
- Dominant visual: two complete rows in the table, with the two outside ports differing under one shared public value.
- Icon assets: `public/icons8/router.png`, `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons/table-cells.svg`, `public/icons/arrow-right.svg`.
- Required objects and counts: 1 router, 2 packets, 1 table with two rows, 2 devices (context) (5 objects).
- Text shown: `ONE ADDRESS` (76px); the two outside ports are read from the table rows.
- Animation: the second packet translates at the router; row 2 fills; both `40001` and `40002` highlight in sequence under the shared `203.0.113.7`; the second packet joins the first in the Internet.
- Beginning state: frame 8's second packet at the router, table with one row.
- Ending state: two rows complete, both packets out in the Internet, two different outside ports.
- Transition: cut.
- Continuity: both rows stay for the rest of the video; both packets remain outside until the reply sequence.
- Geometry source: `frame.md` `nat-row-1`, `nat-row-2`, `packet` (two instances), `public-chip`.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.767s | The router gives it the same public address | `public-chip` value highlights; second packet translates | #line-9-public | 67.72s → pass: shared public value highlighted |
| 1.767–3.622s | but its own outside port | `nat-row-2` fills with `192.168.1.20:52000` → `203.0.113.7:40002` | #line-9-row-2-in, #line-9-row-2-arrow, #line-9-row-2-out | 71.192s → fix→pass: row 2 written, and row 1 is now visible in this scene too |
| 3.622–5.389s | so it can tell the two connections apart | `40001` then `40002` highlight in turn beneath the shared public value | #line-9-port-1, #line-9-port-2 | 74.6s → fix→pass: boxes were 200px (cut the value) and then port-only (x=723 w=132); both now wrap the complete value line (x=512 w=344) in blue for row 1 and amber for row 2 |
| 5.389–7.245s | sentence resolves | both connections are outside at once: one parked at the website, one on the last hop | #line-9-pkt-1, #line-9-pkt-4 | 74.615s → fix→pass: two connections outside at once; the sideways slide that crossed under the table was removed |

- Intentional hold over 3s: none.
- Sound-off check: one public value, two different ports, two rows — the multiplexing is visible.
- Review samples: opening, row 2 written, both ports contrasted, both packets outside.
- Adjacent-cut review: frame 8 ends with the second packet at the router and one row; frame 9 opens on that exact state — verify.

## Frame 10 — The reply comes back
- duration: 6.130068s
- src: compositions/frames/line-10.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: A reply comes back from the website, addressed to the public address and the first port.
- Measured window: 74.814694–80.944762s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 10`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the reply is addressed to the public address and the first connection's outside port.
- Dominant visual: a reply packet leaving the website and travelling back toward the router.
- Icon assets: `public/icons8/server.png`, `public/icons8/globe.png`, `public/icons8/router.png`, `public/icons/arrow-down.svg`.
- Required objects and counts: 1 server, 1 reply packet, 1 router, 1 table with two rows (4 objects).
- Text shown: `THE REPLY RETURNS`, `203.0.113.7:40001`, `INTERNET`.
- Animation: the reply leaves the website, crosses the outside hop in reverse, and stops at the router; its chip reads `40001`; the second packet stays parked at the website.
- Beginning state: frame 9's two outbound packets at the website.
- Ending state: reply held at the router, table unchanged.
- Transition: cut.
- Continuity: the reply keeps the route in reverse; device coordinates never swap.
- Geometry source: `frame.md` `server`, `globe`, `outside-hop`, `packet` (reply), `nat-row-1`.
- Complexity: 1 idea · 1 action · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.582s | A reply comes back from the website | reply packet appears at `server` with chip `40001` | #line-10-pkt-2 | 74.965s → pass: reply appears at the website carrying 40001 |
| 1.582–3.065s | addressed to the public address | reply crosses `outside-hop` and the globe in reverse | #line-10-pkt-2 | 77.88s → fix→pass: the parked laptop packet no longer overlaps the returning reply |
| 3.065–4.647s | and the first port | reply reaches the router; its chip `40001` is legible at the router | #line-10-pkt-2 | 80.745s → pass: reply crosses the hop in reverse |
| 4.647–6.130s | sentence resolves | reply holds at the router facing the table | #line-10-pkt-2 | 80.745s → pass: reply stops below the router facing the table |

- Intentional hold over 3s: none.
- Sound-off check: a packet returns from the website carrying the public value and one port.
- Review samples: opening, mid-route, arrival at the router.
- Adjacent-cut review: frame 9 ends with both packets outside; frame 10 opens with those two still parked and the reply appearing at the website — verify no packet teleports.

## Frame 11 — The router matches the table
- duration: 7.662585s
- src: compositions/frames/line-11.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The router looks that port up in the table. It matches one entry, and the destination is rewritten back to the phone.
- Measured window: 80.944762–88.607347s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 11`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the reply's port selects the row, and the destination is translated back.
- Dominant visual: row 1 of the table highlighted while the reply's chip changes from the outside value to the phone's private value.
- Icon assets: `public/icons8/router.png`, `public/icons8/phone.png`, `public/icons/table-cells.svg`, `public/icons/check.svg`.
- Required objects and counts: 1 router, 1 reply packet, 1 table with row 1 highlighted, 1 phone (muted) (4 objects).
- Text shown: `MATCH THE TABLE`, `40001`, `192.168.1.10:51000`.
- Animation: the reply holds at the router; the `40001` chip and row 1's outside port highlight together; the chip then changes to the private value and turns client blue; a check confirms the match.
- Beginning state: frame 10's reply at the router.
- Ending state: reply translated back to `192.168.1.10:51000`, row 1 highlighted, ready to travel up.
- Transition: cut.
- Continuity: row 1 keeps its highlight into frame 12; the reply keeps its position at the router.
- Geometry source: `frame.md` `packet`, `packet-port`, `nat-row-1`, `router`.
- Complexity: 1 idea · 1 action · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.960s | The router looks that port up in the table | reply at the router; `40001` chip highlights | #line-11-row-1-hl-on, #line-11-check | 81.095s → pass: row 1 highlighted, check confirms the match |
| 1.960–3.831s | It matches one entry | `nat-row-1` highlights; a check glyph appears beside the row | #line-11-pkt-2, #line-11-pkt-5 | 84.776s → pass: chip translated back to 192.168.1.10:51000 |
| 3.831–5.702s | and the destination is rewritten back to the phone | chip changes to `192.168.1.10:51000` and turns client blue | #line-11-pkt-5 | 88.407s → pass: translated reply holds below the router |
| 5.702–7.663s | sentence resolves | translated reply holds at the router, row 1 still highlighted | #line-11-row-1-hl-on | 87.0s → pass: row 1 remains the matched entry at scene end |

- Intentional hold over 3s: none.
- Sound-off check: a port value selects exactly one row, and the packet's value changes to a private one.
- Review samples: opening, row highlighted, chip translated.
- Adjacent-cut review: frame 10 ends with an untranslated reply at the router; frame 11 opens on it with `40001` still showing — verify.

## Frame 12 — Back to the right device
- duration: 7.662585s
- src: compositions/frames/line-12.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: The reply travels to your phone. The laptop's reply uses the other entry, so each device gets only its own answers.
- Measured window: 88.607347–96.269932s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 12`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: the matching row routes the reply to exactly one device.
- Dominant visual: the reply climbing the trunk from the router to the phone, with row 1 highlighted and row 2 still available for the laptop.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons/check.svg`.
- Required objects and counts: 1 reply packet, 1 router, 2 devices, 1 table with two rows (5 objects).
- Text shown: `BACK TO PHONE` (76px), `192.168.1.10:51000`, `192.168.1.20:52000`.
- Animation: the reply travels up the trunk and into the phone; the phone shows a green receipt; row 2 briefly highlights to show the laptop's path would use it.
- Beginning state: frame 11's translated reply at the router.
- Ending state: reply delivered to the phone; row 2 highlighted as the laptop's own entry.
- Transition: cut.
- Continuity: row 2's brief highlight is cleared in frame 13; devices and table unchanged.
- Geometry source: `frame.md` `packet`, `home-bus`, `phone`, `nat-row-1`, `nat-row-2`.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.962s | The reply travels to your phone | reply leaves the router up the trunk | #line-12-pkt-5 | 88.757s → pass: reply climbs the trunk |
| 1.962–3.831s | The laptop's reply uses the other entry | `nat-row-2` highlights as the laptop's path | #line-12-row-2-hl-on | 92.439s → pass: laptop's row highlighted as its own entry |
| 3.831–5.700s | so each device gets only its own answers | reply arrives at `phone`; green check appears on the phone | #line-12-pkt-5 | 95.5s → pass: reply reaches the phone |
| 5.700–7.663s | sentence resolves | row 1 stays highlighted for the delivered reply; row 2 dims | #line-12-receipt | 95.5s → fix→pass: receipt renders at 72px after the scale tween was removed (it filled the frame before) |

- Intentional hold over 3s: none.
- Sound-off check: the reply visibly climbs back to the same device that sent, not the other one.
- Review samples: opening, reply mid-trunk, receipt at the phone.
- Adjacent-cut review: frame 11 ends with the reply at the router; frame 12 opens on it leaving — verify no position jump.

## Frame 13 — An unsolicited connection
- duration: 7.732245s
- src: compositions/frames/line-13.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: What if someone on the Internet connects in first? Nothing in the table matches that port, so the router drops the packet.
- Measured window: 96.269932–104.002177s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 13`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: without a mapping, an inbound connection finds no row and is dropped.
- Dominant visual: an outside packet arriving at the router with no matching row, then being discarded.
- Icon assets: `public/icons8/globe.png`, `public/icons8/server.png`, `public/icons8/router.png`, `public/icons/xmark.svg`, `public/icons/table-cells.svg`.
- Required objects and counts: 1 inbound packet, 1 router, 1 table (two rows, neither matching), 1 globe/server at the Internet, 1 drop mark (5 objects).
- Text shown: `NO MATCH`, `40003`, `NAT TABLE`.
- Animation: an outside packet with an unknown port (`40003`) approaches the router; both rows are checked and neither highlights; a red-orange x-mark replaces the packet and the packet disappears; the table rows stay intact.
- Beginning state: frame 12's delivered state; pointers cleared.
- Ending state: the unsolicited packet is gone, both legitimate rows untouched.
- Transition: cut.
- Continuity: rows 1 and 2 continue into frames 14 and 15.
- Geometry source: `frame.md` `packet` (inbound), `nat-row-1`, `nat-row-2`, `xmark`.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence or pass/fix |
| --- | --- | --- | --- | --- |
| 0.000–1.978s | What if someone on the Internet connects in first? | inbound packet appears at the globe with chip `40003` | #line-13-pkt-6 | 96.42s → pass: inbound packet with unknown port 40003 |
| 1.978–3.866s | Nothing in the table matches that port | packet reaches the router; both rows are compared and neither highlights | #line-13-scan-1, #line-13-scan-2 | 100.136s → pass: both rows compared, neither matches |
| 3.866–5.754s | so the router drops the packet | red-orange x-mark appears where the packet was; the packet is gone | #line-13-drop, #line-13-pkt-6 | 101.0s → pass: red-orange x replaces the dropped packet |
| 5.754–7.732s | sentence resolves | table rows 1 and 2 remain, unchanged and still highlighted as valid | #line-13-row-1-hl, #line-13-row-2-hl | 103.0s → pass: both valid rows intact at scene end |

- Intentional hold over 3s: none.
- Sound-off check: an inbound packet that matches nothing is destroyed at the router; the existing rows survive.
- Review samples: opening, comparison, dropped state.
- Adjacent-cut review: frame 12 ends with a green receipt at the phone; frame 13 opens with that receipt cleared and the table still holding both rows — verify.

## Frame 14 — NAT is not a firewall
- duration: 8.010884s
- src: compositions/frames/line-14.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: That is not the same as a firewall. NAT drops what it cannot match in its table; a firewall decides by rules someone set.
- Measured window: 104.002177–112.013061s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 14`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: NAT drops on a table match; a firewall decides from configured rules.
- Dominant visual: the router and its table on one side, a firewall shield on the other, each labelled by what drives it.
- Icon assets: `public/icons8/router.png`, `public/icons/shield-halved.svg`, `public/icons/table-cells.svg`, `public/icons/xmark.svg`.
- Required objects and counts: 1 router, 1 table with two rows, 1 firewall glyph, 2 labels (4 objects).
- Text shown: `NOT A FIREWALL` (76px), `MATCHES A TABLE` (client), `APPLIES RULES` (security),
  `FIREWALL` on the shield. The public chip is the one persistent object deliberately absent
  in this frame: the beat contrasts two reasons for dropping traffic, not addresses.
- Animation: the router and table stay in place; the shield glyph appears opposite them; `xmark` lands beside the table and a rule-list marker beside the shield, each under its label.
- Beginning state: frame 13's table with both rows; the inbound packet gone.
- Ending state: the two mechanisms contrasted side by side, table still intact.
- Transition: cut.
- Continuity: frame 15 returns to the single-path story with the same table and no shield.
- Geometry source: `frame.md` `router`, `nat-panel`, `nat-row-1`, `nat-row-2`; shield glyph 620,1330,220,220 in place of the server.
- Complexity: 1 idea · 1 action · 4 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.960s | That is not the same as a firewall | shield glyph appears where the website was; label `APPLIES RULES` lands | #line-14-shield, #line-14-fw-label | 106.5s → fix→pass: shield at normal size (scale tween removed); APPLIES RULES lands |
| 1.960–4.005s | NAT drops what it cannot match in its table | table highlights; `xmark` lands beside it under `MATCHES A TABLE` | #line-14-nat-label, #line-14-row-1-hl-on | 108.008s → pass: MATCHES A TABLE with the matching row highlighted |
| 4.005–5.966s | a firewall decides by rules someone set | shield pulses once; the rule marker beside it is revealed | #line-14-shield | 110.5s → pass: emphasis is an opacity dip, not a resize |
| 5.966–8.011s | sentence resolves | both mechanisms hold side by side; no new object appears | #line-14-nat-label, #line-14-fw-label | 110.5s → pass: both mechanisms hold side by side, no new object |

- Intentional hold over 3s: none.
- Sound-off check: two mechanisms, two different reasons for dropping traffic, clearly labelled.
- Review samples: opening, both labels landed, resolved state.
- Adjacent-cut review: frame 13 ends with an x-mark at the router and two rows; frame 14 opens with the router/table unchanged and the shield appearing — verify the x-mark is cleared from the router area.

## Frame 15 — The takeaway
- duration: 7.244626s
- src: compositions/frames/line-15.html
- status: animated
- blueprint: compose
- transition_in: cut
- voiceover: Many private devices, one public address. NAT keeps the table, so every reply finds the right device.
- Measured window: 112.013061–119.257687s (from `audio_meta.json`)
- Narration reference: `SCRIPT.md#Line 15`
- Timing source: `audio_meta.json` (measured Supertonic 3 WAV; do not hand-edit).
- Learning objective: recall the model in dependency order — many private devices, NAT, one public IP.
- Dominant visual: the private addresses above, the router with both table rows, one public chip below, the Internet beyond.
- Icon assets: `public/icons8/phone.png`, `public/icons8/laptop.png`, `public/icons8/router.png`, `public/icons8/globe.png`, `public/icons/table-cells.svg`.
- Required objects and counts: 2 devices, 1 router, 1 table with two rows, 1 public chip, 1 globe (5 objects).
- Text shown: `MANY PRIVATE DEVICES` (headline, 64px so the phrase fits the safe width), `NAT` on
  the router, both private addresses, and the highlighted public value.
- Animation: the two address labels highlight as a set; a `NAT` label lands on the router; both table rows stay visible; the single public value highlights last and stays.
- Beginning state: frame 14's table, shield gone.
- Ending state: the three-part takeaway with every persistent object in its place; no new concept.
- Transition: finish on the answer; no outro or subscription card.
- Continuity: final frame; no scene follows.
- Geometry source: `frame.md` all persistent objects.
- Complexity: 1 idea · 1 action · 5 objects

| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |
| --- | --- | --- | --- | --- |
| 0.000–1.866s | Many private devices | both addresses highlight together; label `MANY PRIVATE DEVICES` | #line-15-addr-set | 112.163s → fix→pass: set box resized to x=126 w=712 so it wraps both labels inside the safe width |
| 1.866–3.622s | one public address | `public-chip` highlights as the single outside value | #line-15-public-rect, #line-15-public | 114.0s → pass: the single outside value is highlighted |
| 3.622–5.488s | NAT keeps the table | `NAT` label lands on the router; both rows highlight in order | #line-15-router-label | 118.5s → pass: NAT label lands on the router |
| 5.488–7.245s | so every reply finds the right device | rows stay lit; resolved state holds to the end | #line-15-row-1-hl-on, #line-15-row-2-hl-on | 118.5s → fix→pass: both rows legible (blank before the reveal-flag fix); resolved state holds |

- Intentional hold over 3s: none.
- Sound-off check: the dependency chain many devices → NAT → one public address reads from the frame alone.
- Review samples: opening, public value highlighted, resolved state.
- Adjacent-cut review: frame 14 ends with the firewall contrast; frame 15 opens with the shield gone and the single path restored — verify.

Sound-off acceptance: a viewer can identify the two private addresses, the one
public address, the table rows as connections, which row a reply matched, and
that an unmatched inbound packet is dropped. Capture each scene's opening, main
action and 0.5s before its measured end, plus both sides of every cut. Compare
object counts and connections with the approved sketches. Neither source
validation nor those sketches prove final motion.
