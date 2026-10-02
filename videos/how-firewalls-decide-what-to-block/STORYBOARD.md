---
format: 1080x1920
fps: 30
captions: off
sound_effects: off
bgm: off
timing: measured-audio_meta.json
status: gate-2-preview-review
---

# Timed storyboard

Complete script and static actual-icon poses: sketches/board.html. Revised Gate 1
was explicitly approved on 2026-10-02, user message "I approved". Approved plan
snapshots and hashes: review/revisions/under-three-minute-gate1/ and
review/storyboard-approval.json. The 332-word approved narration is unchanged.

All production windows below use measured audio_meta.json timing and actual-WAV
motion_beats.json cues: 170.179048s (2:50.179), 12 scenes. Machine alignment is not
human listening. Headings and pose captions remain outside the video canvas.
SCRIPT.md owns display strings and narration. frame.md owns positions and layers.

Shared direction: Playful illustrated objects; restrained packet anticipation,
travel/landing deformation, heavier gate hinge, rigid evidence. Keep one dominant
causal action at a time. Small supporting marks do not become primary props.
Use ChannelMotion FAST/MORPH/IMPACT for packets, SLOW for gate, CAMERA only for
detail framing. No ambient bouncing or sound effects. Local props/FA marks only.

Shared example adaptation: examples/flow-motion README, Rejected request and
Packet cutaway, plus Packet match move. Reuse separate travel/body/part wrappers,
delayed flap/seal, ground-shadow response and matched endpoint poses. The sample's
8s timing is not adopted. A dropped packet does not recoil back to its sender;
the gate stops it and the packet is discarded. No cache/assembly behavior is
imported merely for variety. No overlapping scene-host transitions are planned.
One scene hosts any internal concept comparison; adjacent scenes use matched poses.

## Frame 1 - Two arrivals
- duration: 9.334422s
- src: compositions/frames/line-1.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: cut
- voiceover: A website's reply passes your firewall. Another incoming connection gets blocked. Both came from outside. Why the difference?
- Measured window: 0.000000-9.334422s. Sources: audio_meta.json and motion_beats.json line-1.
- Viewer question / learning objective: why do two incoming packets receive different outcomes?
- Scene payoff: outside origin alone does not determine permission; the mechanism remains to be revealed.
- Persistent object / dominant visual: firewall-boundary and firewall-gate, device and site; packet-reply and packet-other remain distinct.
- Required objects and counts: 1 boundary, 1 gate, 1 device, 1 site, 1 reply, 1 separate incoming attempt (introduced after reply).
- Icon assets: device, firewall-gate, packet, shield, incoming, check, ban from ICON_PLAN.json.
- Primary causal action / visible consequence: reply crosses the opening; independent attempt stops at the closed boundary.
- Beginning / ending state: established example reply approaches / reply at device, unrelated attempt outside boundary.
- Text shown: DEVICE, SITE, FIREWALL, ALLOWED, BLOCKED. Endpoint names identify roles; outcomes distinguish permissions without implying safety.
- Scene archetype / treatment: hero hook, object performance; curious difference with a readable finish.
- Expressive action / primary verb: gate lifts then closes; light packet compresses at stopping point. The gate is a metaphor.
- Depth/layer plan: frame.md shared order; arm occludes blocked crossing, not the allowed one.
- Transition / handoff / continuity: hard time-jump cut to main attempt's origin in Frame 2; boundary and endpoints retain pose. This hook is an outcome glimpse, not a preceding connection creation.
- Geometry source: frame.md overview; no camera movement.
- Energy / comprehension pause / next question: high hook, 1s final comparison hold; what information gets checked?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-3.220s | Reply / "pass" | packet-reply arrives; gate opens; reply crosses to device; device reacts only on arrival | SITE/DEVICE identity; ALLOWED marks permission | [data-composition-id="line-1"] .diagram / .gate-arm; inspected local 1.670s: review/preview/line-1-motion-1.png; visual pass, listening pending |
| 3.220-8.020s | Contrast / "gets blocked" | packet-other approaches; gate closes; separate attempt stops outside | BLOCKED distinguishes outcome | [data-composition-id="line-1"] .diagram / .gate-arm; inspected local 5.640s: review/preview/line-1-pose-1.png; visual pass, listening pending |
| 8.020-9.334s | Settle / "difference" | Hold the two outcomes on opposite sides | FIREWALL identifies boundary; no question text | [data-composition-id="line-1"] .diagram / .gate-arm; inspected local 8.820s: review/preview/line-1-pose-2.png; visual pass, listening pending |

- Production layout: allow/match labels sit beside the crossing lane at x=804; values remain rigid and the moving packet does not cover the outcome.

- Opening/settled review: local 0.030s and 9.284s; review/preview/line-1-opening.png and line-1-settled.png. Inspected at phone size.
- Adjacent-cut review: First scene: not applicable.

## Frame 2 - Follow the browser
- duration: 10.379320s
- src: compositions/frames/line-2.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: cut
- voiceover: Follow your browser connecting to a website. Traffic travels in small pieces called packets. This stateful firewall remembers connections.
- Measured window: 9.334422-19.713741s. Sources: audio_meta.json and motion_beats.json line-2.
- Viewer question / scene payoff: where does the decision begin? The browser's new opening packet arrives at the boundary.
- Persistent objects / counts: 1 device, 1 site, 1 boundary/gate, 1 packet-new. No state record yet.
- Icon assets: device, packet, firewall-gate, shield, outgoing.
- Primary causal action / visible consequence: browser launches packet-new on outward-route; it pauses at the decision point.
- Beginning / ending state: fresh connection, packet at device / same packet at boundary, unopened evidence.
- Text shown: DEVICE, SITE, FIREWALL, NEW; NEW establishes there is no prior conversation.
- Archetype / treatment / primary verb: journey; launch and approach. Laptop leans before launch, packet accelerates and settles; no completed-web-page reaction.
- Example adaptation / performance: flow rejection launch, travel separated from deformation; no return/recoil.
- Depth / handoff / continuity: shared layers; match-cut packet arrival pose into Frame 3, gate stays closed/pending.
- Geometry: frame.md outward-route; supporting travelling packet 180px, device 380px.
- Energy / pause / next question: medium, 1s arrival hold; which parts can the firewall see?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-1.400s | Setup / "connecting" | Time jump establishes fresh packet-new; device lid leans, packet prepares | NEW; remove hook outcomes | [data-composition-id="line-2"] .diagram / .gate-arm; inspected local 0.030s: review/preview/line-2-opening.png; visual pass, listening pending |
| 1.400-6.620s | Journey / "packets" | One representative opening packet travels from device to boundary; no HTTP payload implied | Endpoint names retained | [data-composition-id="line-2"] .diagram / .gate-arm; inspected local 4.010s: review/preview/line-2-motion-1.png; visual pass, listening pending |
| 6.620-10.379s | Settle / "remembers connections" | Arrival stops pending inspection; state slot is empty | FIREWALL identifies process | [data-composition-id="line-2"] .diagram / .gate-arm; inspected local 8.860s: review/preview/line-2-pose-2.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 10.329s; review/preview/line-2-opening.png and line-2-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 9.284s: review/preview/cut-1-before.png; after global 9.384s: review/preview/cut-1-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 3 - Available evidence
- duration: 18.250884s
- src: compositions/frames/line-3.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: At arrival, it checks source and destination addresses, protocol, meaning communication method, and ports: numbers identifying the conversation's endpoints. It also checks the arrival side. This packet is going out to web port four forty-three.
- Measured window: 19.713741-37.964626s. Sources: audio_meta.json and motion_beats.json line-3.
- Viewer question / payoff: what evidence is available? Header metadata and arrival side, not a safety judgement.
- Objects / counts: boundary/gate, 1 enlarged packet-new, 1 metadata sheet, 1 content tile; device remains as origin.
- Assets: packet/header/data flow layers, firewall-gate, shield, outgoing.
- Primary causal action / consequence: packet flap opens conceptually; metadata unfolds rigidly; FROM/TO ports align with endpoint roles; direction comes from route side.
- Beginning / ending state: same packet at boundary / available values visible and ready for comparison.
- Text shown: FROM, TO, DEVICE:51514, SITE:443, PROTOCOL, TCP, OUTGOING. Exact ports support reverse-endpoint comparison later; TCP names the communication method, not a safety mark. Endpoint labels substitute for unnecessary IP strings.
- Archetype / treatment: cutaway demonstration, fan out; source/destination shown before formal term.
- Performance / example: flow Packet cutaway; flap trails body; rigid labels never squash. No promise that all content is inspected. Opening packet contains connection setup, not an encrypted webpage.
- Depth / geometry: packet-cutaway / cutaway-metadata from frame.md; boundary stays at y=880. Keep content separate from metadata.
- Transition / handoff: match-cut metadata and pending gate into Frame 4; no invented IP translation.
- Energy / pause / next question: low detail, short read after each field; how do rules use those values?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-4.500s | Reveal / "source and destination" | Same packet opens; header fans up; source and destination anchor to device/site | FROM/TO and endpoint values essential | [data-composition-id="line-3"] .diagram / .gate-arm; inspected local 1.520s: review/preview/line-3-pose-0.png; visual pass, listening pending |
| 4.500-13.000s | Detail / "protocol" and "ports" | Protocol and port evidence separates from content; paired port brackets identify ends | PROTOCOL/TCP, 51514/443; no protocol internals | [data-composition-id="line-3"] .diagram / .gate-arm; inspected local 5.300s: review/preview/line-3-pose-1.png; visual pass, listening pending |
| 13.000-18.251s | Direction / "going out" | Trace approach from device side; rigid outgoing arrow; settle on SITE:443 | OUTGOING disambiguates arrival side | [data-composition-id="line-3"] .diagram / .gate-arm; inspected local 17.801s: review/preview/line-3-motion-2.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 18.201s; review/preview/line-3-opening.png and line-3-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 19.664s: review/preview/cut-2-before.png; after global 19.764s: review/preview/cut-2-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 4 - Rules for a fresh attempt
- duration: 14.767891s
- src: compositions/frames/line-4.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: It's new, with no existing state. Our example checks rules top to bottom: block listed destination addresses. This site isn't listed. Next: allow outgoing web connections. That matches.
- Measured window: 37.964626-52.732517s. Sources: audio_meta.json and motion_beats.json line-4.
- Viewer question / payoff: how does available evidence produce permission? No prior state; first applicable configured rule allows this new attempt.
- Objects / counts: 1 boundary/gate, 1 packet evidence, 1 empty state slot, 1 policy group with 2 ordered rules, device context.
- Assets: packet, metadata, gate, shield, list, check, ban, outgoing.
- Primary action / consequence: state lookup misses; compare SITE against listed addresses (miss), then outgoing TCP:443 against allow rule (match); allow latch prepares but packet has not crossed yet.
- Beginning / ending: metadata at pending gate / selected allow rule; main attempt held for Frame 6.
- Text shown: STATE, NEW, RULES, LISTED, OUT / 443, BLOCK, ALLOW. Real policy strips, not explanatory cards; colors and glyphs reinforce actions.
- Archetype / treatment / verb: decision machine, compare. Evidence slides between rules; failed rule does not react as an applied block.
- Performance / example: heavier hinge waits for comparison; flow gate timing adapted to cue intent. Values remain rigid.
- Layers / geometry: shared boundary, decision-zone, ordered rule strips; empty state slot below gate.
- Transition / handoff: hard concept cut to fresh listed-destination counterexample in Frame 5; main attempt's evidence is restored at its end.
- Energy / pause / next question: medium, 1s match hold; what if overlapping rules change order?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-5.740s | State / "no existing state" | Evidence attempts alignment with empty state slot, fails, then moves to rules | STATE/NEW identifies missing history | [data-composition-id="line-4"] .diagram / .gate-arm; inspected local 6.540s: review/preview/line-4-pose-0.png; visual pass, listening pending |
| 5.740-10.900s | First rule / "isn't listed" | SITE marker is absent from list; highlight compares, then moves downward without applying block | LISTED/BLOCK identify condition/action | [data-composition-id="line-4"] .diagram / .gate-arm; inspected local 6.540s: review/preview/line-4-pose-0.png; visual pass, listening pending |
| 10.900-14.768s | Next rule / "matches" | Direction/443 aligns to second rule; allowance latches after match, packet held | OUT / 443 and ALLOW retained | [data-composition-id="line-4"] .diagram / .gate-arm; inspected local 14.100s: review/preview/line-4-pose-2.png; visual pass, listening pending |

- Production layout: allow/match labels sit beside the crossing lane at x=804; values remain rigid and the moving packet does not cover the outcome.

- Opening/settled review: local 0.030s and 14.718s; review/preview/line-4-opening.png and line-4-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 37.915s: review/preview/cut-3-before.png; after global 38.015s: review/preview/cut-3-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 5 - Why order matters
- duration: 13.235374s
- src: compositions/frames/line-5.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: cut
- voiceover: Here, the first matching rule decides. Move the broad allowance above the block, and listed destinations pass before that block is checked. Firewalls can use different priorities.
- Measured window: 52.732517-65.967891s. Sources: audio_meta.json and motion_beats.json line-5.
- Viewer question / payoff: what if both rules could match? An earlier broad allowance preempts the block in this example.
- Objects / counts: boundary/gate, 1 fresh listed-destination evidence/packet, same 2 policy strips, device context. No inherited state for this fresh attempt.
- Assets: packet, gate, shield, list, check, ban, outgoing.
- Primary action / consequence: initially list rule blocks new LISTED:443 attempt; move broad outgoing allowance above it; replay same evidence and allow before reaching list rule.
- Beginning / ending: original block-first order / after comparison restore block-first order, original SITE evidence and pending main attempt for Frame 6.
- Text shown: LISTED, OUT / 443, BLOCK, ALLOW, FIRST MATCH. Short FIRST MATCH label identifies the stopping rule, not universal behavior.
- Archetype / treatment / verb: contrast, reorder-and-retry. Paper rules slide; gate's changed pose follows the changed priority.
- Example / performance: flow rejection check, meaningful comparison instead of extra bouncing; no literal returned packet on block.
- Layers / handoff / geometry: fixed boundary, decision-zone; all comparison states inside this scene, match cut after restoring main attempt. No duplicate firewall or split screen.
- Energy / pause / next question: high surprise, 1s contrasted result; what lets a reply pass?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-2.900s | Before / "first matching rule" | Fresh LISTED destination evidence matches first block; gate remains closed | LISTED + BLOCK identifies overlapping case | [data-composition-id="line-5"] .diagram / .gate-arm; inspected local 2.160s: review/preview/line-5-pose-0.png; visual pass, listening pending |
| 2.900-6.340s | Change / "above the block" | Same two strips swap order; same new attempt matches outgoing allowance first | OUT / 443, FIRST MATCH; lower block visibly unchecked | [data-composition-id="line-5"] .diagram / .gate-arm; inspected local 3.600s: review/preview/line-5-motion-1.png; visual pass, listening pending |
| 6.340-10.140s | Consequence / "pass" | Gate opens only after early allow match; packet crosses, lower block stays unapplied | ALLOW is permission, not safety | [data-composition-id="line-5"] .diagram / .gate-arm; inspected local 8.660s: review/preview/line-5-pose-2.png; visual pass, listening pending |
| 10.140-13.235s | Restore / "different priorities" | Restore original rule order and main SITE evidence; separate demonstration ends | No vendor names or priority tutorial | [data-composition-id="line-5"] .diagram / .gate-arm; inspected local 13.185s: review/preview/line-5-settled.png; visual pass, listening pending |

- Production layout: allow/match labels sit beside the crossing lane at x=804; values remain rigid and the moving packet does not cover the outcome.

- Production handoff: remove the isolated listed attempt; restore original rule order and main pending SITE attempt before Frame 6. This is a comparison reset, not traffic traveling backward. Labels briefly tuck away while the two paper rules exchange places, then return in their resolved order.

- Opening/settled review: local 0.030s and 13.185s; review/preview/line-5-opening.png and line-5-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 52.683s: review/preview/cut-4-before.png; after global 52.783s: review/preview/cut-4-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 6 - An expected reply
- duration: 19.504762s
- src: compositions/frames/line-6.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: The allowed connection gets a temporary record of addresses, ports, protocol, and progress, updated as it develops. The website's reply has reversed endpoints and expected connection state, so it passes. That permission covers this conversation, not everyone outside.
- Measured window: 65.967891-85.472653s. Sources: audio_meta.json and motion_beats.json line-6.
- Viewer question / payoff: why allow incoming replies? Valid state connects this reply to the permitted conversation, not to all outside senders.
- Objects / counts: 1 gate/boundary, device and site, packet-new then separate packet-reply, 1 state record. No unrelated packet moving simultaneously.
- Assets: device, packet, metadata, gate, shield, check, incoming.
- Primary action / consequence: allow opening packet, record identity/progress, advance elided connection setup, compare reversed reply endpoints and valid state, then cross to device.
- Beginning / ending: original SITE allow decision pending / reply at device, tracked state persists; no global inbound permission.
- Text shown: STATE, DEVICE:51514, SITE:443, TCP, MATCH, ALLOWED. Reversed fields align with the same row; progress nodes prevent an address-only match reading.
- Archetype / treatment / verb: transformation then journey; record and retrace. The ledger catches a record copy with a delayed paper settle; it is not a cache of webpage content.
- Example / performance: flow Packet match move for matched geometry; returned copy identity distinct from request. Gate opens for each matched transfer, no permanent open door.
- Layers / geometry: state-ledger, outward-route, packet-new/reply; content never appears readable at firewall.
- Transition / continuity: match cut holding record and boundary into Frame 7. Full handshakes are omitted; progress must visibly advance before web reply.
- Energy / pause / next question: medium-high payoff, 1s endpoint-match read and 1s arrival hold; does another outside sender fit?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-5.860s | Record / "temporary record" | Main packet passes after allow; metadata copy enters state-ledger; initial progress node appears | STATE + exact endpoint/port identity | [data-composition-id="line-6"] .diagram / .gate-arm; inspected local 2.640s: review/preview/line-6-pose-0.png; visual pass, listening pending |
| 5.860-9.460s | Progress / "updated" | Connection progress nodes advance before the expected reply (full handshake trace omitted); no webpage reply yet | TCP names method, no flag jargon | [data-composition-id="line-6"] .diagram / .gate-arm; inspected local 6.660s: review/preview/line-6-update.png; visual pass, listening pending |
| 9.460-13.440s | Match / "reversed endpoints" | Reply approaches same route; FROM SITE:443 / TO DEVICE:51514 aligns to record plus valid progress; gate opens after match | MATCH + reversed endpoint values essential | [data-composition-id="line-6"] .diagram / .gate-arm; inspected local 11.000s: review/preview/line-6-pose-1.png; visual pass, listening pending |
| 13.440-19.505s | Return / "so it passes" | Reply crosses to device; device reacts at arrival; record remains while gate returns to pending | ALLOWED identifies result; no safety badge | [data-composition-id="line-6"] .diagram / .gate-arm; inspected local 14.840s: review/preview/line-6-pose-2.png; visual pass, listening pending |

- Production layout: allow/match labels sit beside the crossing lane at x=804; values remain rigid and the moving packet does not cover the outcome.

- Opening/settled review: local 0.030s and 19.455s; review/preview/line-6-opening.png and line-6-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 65.918s: review/preview/cut-5-before.png; after global 66.018s: review/preview/cut-5-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 7 - An unsolicited attempt
- duration: 17.345306s
- src: compositions/frames/line-7.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: Another computer starts an incoming connection. It matches neither the record nor an allow rule. Our default is block: the fallback for unmatched traffic. Different rules or defaults could allow it; unsolicited doesn't automatically mean blocked.
- Measured window: 85.472653-102.817959s. Sources: audio_meta.json and motion_beats.json line-7.
- Viewer question / payoff: what distinguishes the unexpected arrival? It lacks matching state and permission under this policy.
- Objects / counts: device, OTHER external endpoint, boundary/gate, packet-other, existing ledger, rules/default as one group.
- Assets: device, packet, metadata, gate, shield, incoming, list, ban.
- Primary action / consequence: new OTHER:4444 attempt arrives, mismatches state despite same device port, misses outgoing permission, reaches default block. Device receives nothing.
- Beginning / ending: state from Frame 6 persists / blocked new attempt stays outside; ledger unchanged.
- Text shown: OTHER:4444, DEVICE:51514, NO MATCH, DEFAULT, BLOCK. Reusing device port proves a port/address alone is insufficient.
- Archetype / treatment / verb: decision machine; fail alignment then fall through. Packet tries to fit ledger slots, fails without changing its values; gate closes after fallback.
- Example / performance: rejection stops on outside face; restrained compression, not a network bounce.
- Layers / geometry / handoff: unsolicited-route ends at boundary; state-ledger unchanged, default strip below failed rules; matched blocked pose enters Frame 8.
- Energy / pause / next question: medium, 1s block hold; where does the blocked traffic go?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-3.480s | New arrival / "another computer" | OTHER launches packet-other; source/direction differ; approaches outside face | OTHER:4444 identifies different sender | [data-composition-id="line-7"] .diagram / .gate-arm; inspected local 1.750s: review/preview/line-7-motion-1.png; visual pass, listening pending |
| 3.480-5.180s | State / "matches neither" | Evidence aligns with ledger; source/port/progress fail; same device port alone does not open gate | NO MATCH + DEVICE:51514 | [data-composition-id="line-7"] .diagram / .gate-arm; inspected local 4.280s: review/preview/line-7-pose-1.png; visual pass, listening pending |
| 5.180-11.020s | Rules / "default is block" | Incoming attempt misses outgoing allowance; default block applies; gate closes | DEFAULT/BLOCK names fallback, not a universal default | [data-composition-id="line-7"] .diagram / .gate-arm; inspected local 8.300s: review/preview/line-7-pose-2.png; visual pass, listening pending |
| 11.020-17.345s | Qualification / "Different rules or defaults" | Hold this configured decision; policy group receives focus, no invented actual allow | No added prose | [data-composition-id="line-7"] .diagram / .gate-arm; inspected local 17.295s: review/preview/line-7-settled.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 17.295s; review/preview/line-7-opening.png and line-7-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 85.423s: review/preview/cut-6-before.png; after global 85.523s: review/preview/cut-6-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 8 - Drop or reject
- duration: 14.698231s
- src: compositions/frames/line-8.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: Blocked traffic isn't forwarded. A silent drop discards the packet without replying; the sender may retry, then time out. A reject discards it and sends a refusal. Logging can record the decision if enabled.
- Measured window: 102.817959-117.516190s. Sources: audio_meta.json and motion_beats.json line-8.
- Viewer question / payoff: does block mean a bounced packet? Drop has no reply; reject produces a separate refusal; neither forwards the attempt.
- Objects / counts: boundary/gate, blocked packet, OTHER/device context, 1 sender wait mark, 1 separate refusal, 1 optional log record.
- Assets: packet, gate, shield, device, ban, wait, log.
- Primary action / consequence: discard at boundary; sender wait persists; in separate reject alternative, discard new example packet then send distinct refusal to OTHER. Optional log receives decision copy.
- Beginning / ending: blocked pose from Frame 7 / neither alternative delivered to device; separate optional decision log.
- Text shown: DROP, REJECT, LOG; labels distinguish actual network outcomes. No "dropped packets bounce" path.
- Archetype / treatment / verb: contrast, discard versus refuse. Gate is heavy and still; packet flattens/fades locally, refusal is a small rigid ban-mark record.
- Example / performance: replace flow example recoil with local discard; sender-hourglass and distinct refusal make difference visible. No claim every sender retries or notices immediately.
- Depth / handoff / geometry: unsolicited route for refusal reversed to OTHER only; no branch crosses boundary; log off traffic route.
- Transition / continuity: match boundary into capability comparison; time-jump for each alternative explicitly reviewed outside stage.
- Energy / pause / next question: low comparison, 1s silence/wait hold; can this firewall inspect the actual content?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-7.660s | Drop / "without replying" | packet-other disappears at boundary; no return trace; sender waits, device unchanged | DROP distinguishes silent alternative | [data-composition-id="line-8"] .diagram / .gate-arm; inspected local 4.060s: review/preview/line-8-pose-0.png; visual pass, listening pending |
| 7.660-12.220s | Reject / "sends a refusal" | Separate blocked attempt discarded; separate refusal created and returned to OTHER; device unchanged | REJECT distinguishes active alternative | [data-composition-id="line-8"] .diagram / .gate-arm; inspected local 11.320s: review/preview/line-8-pose-2.png; visual pass, listening pending |
| 12.220-14.698s | Optional log / "if enabled" | Decision copy branches to optional-log, not through firewall to device | LOG identifies administrative record | [data-composition-id="line-8"] .diagram / .gate-arm; inspected local 13.020s: review/preview/line-8-log.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 14.648s; review/preview/line-8-opening.png and line-8-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 102.768s: review/preview/cut-7-before.png; after global 102.868s: review/preview/cut-7-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 9 - Different inspection capabilities
- duration: 20.340680s
- src: compositions/frames/line-9.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: Capabilities vary. Basic packet filters don't remember connections; stateful firewalls do. Some also examine application information or content. Ordinary network firewalls can't read encrypted HTTPS contents without additional decryption capability and configuration.
- Measured window: 117.516190-137.856871s. Sources: audio_meta.json and motion_beats.json line-9.
- Viewer question / payoff: what can different firewall types inspect? Rules-only, rules-plus-state, and additional content capability are distinct; locked HTTPS payload remains opaque here.
- Objects / counts: same boundary/gate, 1 packet header, 1 state record, 1 content tile, 1 lock. Device/context unchanged.
- Assets: metadata, content, packet, gate, shield, lock.
- Primary action / consequence: header engages rules, add state lens, extend an optional application lens, then wrap actual HTTPS content opaquely; metadata stays readable but content remains closed.
- Beginning / ending: boundary retained / current example is header-plus-state with opaque content, not an all-reading scanner.
- Text shown: RULES, STATE, CONTENT, HTTPS, DECRYPT. DECRYPT identifies an extra capability, inactive here. They identify inspection scope and encryption, not transcripts.
- Archetype / treatment / verb: assembly/cutaway, add capability then obscure content. Paper/header remains rigid; opaque wrapper snaps shut around same content.
- Example / performance: Packet cutaway exposes metadata only; lock/container prevents accidental plaintext disclosure at firewall. Additional-decryption alternative is narrated, not performed by this example firewall.
- Depth / geometry / handoff: decision-zone with 3 capability props, content-wrapper at boundary; match closed wrapper into Frame 10.
- Energy / pause / next question: low detail, 1s closed-wrapper read; can harmful content pass these checks?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-9.340s | Types / "Basic packet filters" | Header compares to rules without ledger; ledger then joins stateful scope | RULES/STATE name scopes | [data-composition-id="line-9"] .diagram / .gate-arm; inspected local 3.520s: review/preview/line-9-pose-0.png; visual pass, listening pending |
| 9.340-12.700s | Extra scope / "Some also" | Optional CONTENT lens added as a capability comparison, never all-firewall default | CONTENT identifies scope | [data-composition-id="line-9"] .diagram / .gate-arm; inspected local 10.740s: review/preview/line-9-pose-1.png; visual pass, listening pending |
| 12.700-20.341s | Encryption / "can't read" | HTTPS wrapper becomes opaque; lock closes; header stays outside; lens cannot reveal content | HTTPS identifies encrypted example | [data-composition-id="line-9"] .diagram / .gate-arm; inspected local 17.820s: review/preview/line-9-decryption.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 20.291s; review/preview/line-9-opening.png and line-9-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 117.466s: review/preview/cut-8-before.png; after global 117.566s: review/preview/cut-8-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 10 - Permission is not safety
- duration: 9.822041s
- src: compositions/frames/line-10.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: A dangerous download can therefore pass inside an allowed web connection, unseen by this firewall. Permission doesn't guarantee safety.
- Measured window: 137.856871-147.678912s. Sources: audio_meta.json and motion_beats.json line-10.
- Viewer question / payoff: why could dangerous content pass? The allowed web flow satisfies checks while its encrypted payload remains opaque at this firewall.
- Objects / counts: boundary/gate, device/site, 1 locked payload packet, 1 state record, hazard only after device arrival.
- Assets: device, packet/content, gate, shield, lock, check, hazard.
- Primary action / consequence: later allowed download matches recorded web flow, crosses, reaches device; device decrypts/reveals hazard locally. Firewall never displays a hazard-detection response.
- Beginning / ending: opaque payload from Frame 9 / hazard visible at device after receipt, unchanged permission policy.
- Text shown: ALLOWED, HTTPS. No SAFE badge or malicious label at the firewall.
- Archetype / treatment / verb: journey then reveal; wrapper opens only at destination. Arrival precedes the device's warning reaction.
- Example / performance / layers: flow travelling packet and delayed receiver response; payload hidden behind lock until delivery; no return copy from firewall.
- Geometry / handoff: outward-route retraced; device hazard overlay inside screen; keep ledger/closed gate into next scene.
- Energy / pause / next question: high twist, 1s device reveal hold; could harmless traffic fail?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-3.280s | Pass / "allowed web connection" | Encrypted payload approaches; valid recorded conversation matches; gate opens | HTTPS/ALLOWED define condition/outcome | [data-composition-id="line-10"] .diagram / .gate-arm; inspected local 1.760s: review/preview/line-10-pose-0.png; visual pass, listening pending |
| 3.280-4.780s | Deliver / "unseen by this firewall" | Closed wrapper crosses to device; only device opens it and reveals hazard | No hazard text; actual hazard glyph at device | [data-composition-id="line-10"] .diagram / .gate-arm; inspected local 4.080s: review/preview/line-10-pose-1.png; visual pass, listening pending |
| 4.780-9.822s | Settle / "doesn't guarantee" | Hold permission at boundary and hazard at destination as distinct facts | Remove any SAFE inference | [data-composition-id="line-10"] .diagram / .gate-arm; inspected local 9.120s: review/preview/line-10-pose-2.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 9.772s; review/preview/line-10-opening.png and line-10-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 137.807s: review/preview/cut-9-before.png; after global 137.907s: review/preview/cut-9-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 11 - Legitimate traffic can fail
- duration: 9.055782s
- src: compositions/frames/line-11.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: cut
- voiceover: A legitimate app can fail too: its new connection needs a port our web-only rule doesn't allow, so default block stops it.
- Measured window: 147.678912-156.734694s. Sources: audio_meta.json and motion_beats.json line-11.
- Viewer question / payoff: why can useful traffic fail? This new app attempt needs port 8443, which our 443-only permission does not cover.
- Objects / counts: 1 device with app overlay, boundary/gate, 1 new packet, policy/default group; old web state irrelevant to fresh app connection.
- Assets: device, packet, gate, shield, list, outgoing, ban.
- Primary action / consequence: fresh attempt has no matching state; destination port 8443 fails outgoing443 rule; default blocks; app remains waiting/incomplete.
- Beginning / ending: new app connection / packet stopped outside egress, app's intended delivery incomplete. No corrected configuration tutorial.
- Text shown: APP, 8443, OUT / 443, DEFAULT, BLOCKED. Exact differing port makes the miss inspectable; no rule-edit UI.
- Archetype / treatment / verb: contrast, fail criteria. App reaches with packet; gate stays firm after default decision, device's progress freezes.
- Example / performance / layers: flow rejection with local stopped packet, no unsafe bounce. Values never morph to match the rule.
- Geometry / handoff: outward-route up to device-side face of boundary, decision-zone; match boundary into Frame 12.
- Energy / pause / next question: medium, 1s mismatch hold; what is the governing principle?

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-5.400s | Fresh attempt / "legitimate app" | APP initiates packet with 8443 evidence; no matching web state | APP/8443 define new required connection | [data-composition-id="line-11"] .diagram / .gate-arm; inspected local 1.900s: review/preview/line-11-pose-0.png; visual pass, listening pending |
| 5.400-7.240s | Mismatch / "doesn't allow" | Compare 8443 to OUT / 443; separate values stay unchanged; fall through to default | OUT / 443 + DEFAULT essential | [data-composition-id="line-11"] .diagram / .gate-arm; inspected local 5.400s: review/preview/line-11-motion-2.png; visual pass, listening pending |
| 7.240-9.056s | Result / "block" | Gate stops packet on inside face; app completion remains empty | BLOCKED marks policy result | [data-composition-id="line-11"] .diagram / .gate-arm; inspected local 8.040s: review/preview/line-11-pose-2.png; visual pass, listening pending |

- Opening/settled review: local 0.030s and 9.006s; review/preview/line-11-opening.png and line-11-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 147.629s: review/preview/cut-10-before.png; after global 147.729s: review/preview/cut-10-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Frame 12 - Payoff
- duration: 13.444354s
- src: compositions/frames/line-12.html
- status: production-preview; phone motion/cuts/seeks inspected; human listening pending
- blueprint: compose
- transition_in: match-cut
- voiceover: A firewall doesn't simply recognize bad traffic. It compares available information with configured rules and, when applicable, connection state. The default handles unmatched traffic.
- Measured window: 156.734694-170.179048s. Sources: audio_meta.json and motion_beats.json line-12.
- Viewer question / final payoff: what made the two outside arrivals different? Visible state/rule/default comparisons produce the two outcomes.
- Objects / counts: same boundary/gate, device/site/OTHER context, same ledger and rule group; reply and unsolicited packet replay sequentially.
- Assets: device, packet, metadata, gate, shield, list, check, ban, incoming.
- Primary action / consequence: matching reply aligns to state and crosses; independent incoming attempt lacks match/allow, reaches fallback and ends outside.
- Beginning / ending: boundary at same location; replay earlier examples / matched reply inside, blocked unsolicited attempt outside, rules/state identify cause. No intro/outro.
- Text shown: RULES, STATE, ALLOW, BLOCK. No written takeaway paragraph or moral sorting labels.
- Archetype / treatment / verb: constellation recap through causal replay, compare-and-decide. Movements retrace established routes, no new mechanism.
- Example / performance / layers: gate and packet behavior already taught, quiet final settle; no new transition effect.
- Geometry / continuity: frame.md overview plus ledger/rules; never show two firewalls, never imply all incoming traffic blocked.
- Energy / comprehension pause: medium payoff then low 2s final hold. Next question: none.

| Local window | Beat / narration cue | Visual meaning and named causal change | Text necessity | Selectors / evidence |
| --- | --- | --- | --- | --- |
| 0.000-9.260s | Comparison / "configured rules" | Known metadata aligns to rules and state; no bad-traffic detector prop | RULES/STATE identify actual checks | [data-composition-id="line-12"] .diagram / .gate-arm; inspected local 4.900s: review/preview/line-12-pose-0.png; visual pass, listening pending |
| 9.260-11.560s | Replay / "connection state" | Reply crosses after valid match; separate unsolicited attempt then reaches fallback block | ALLOW/BLOCK distinguish decisions | [data-composition-id="line-12"] .diagram / .gate-arm; inspected local 9.810s: review/preview/line-12-motion-1.png; visual pass, listening pending |
| 11.560-13.444s | Payoff / "unmatched traffic" | Hold distinct causes and outcomes, gate closed pending next packet | No new copy or CTA | [data-composition-id="line-12"] .diagram / .gate-arm; inspected local 12.060s: review/preview/line-12-pose-2.png; visual pass, listening pending |

- Production layout: allow/match labels sit beside the crossing lane at x=804; values remain rigid and the moving packet does not cover the outcome.

- Opening/settled review: local 0.030s and 13.394s; review/preview/line-12-opening.png and line-12-settled.png. Inspected at phone size.
- Adjacent-cut review: before global 156.685s: review/preview/cut-11-before.png; after global 156.785s: review/preview/cut-11-after.png; inspected and passed. Deliberate time/concept cuts follow the scene's continuity plan above.

## Gate 2 Evidence

- Revised Gate 1 explicitly approved 2026-10-02: "I approved". This authorizes
  narration and frames, not rendering. The approved combined plan is preserved
  in review/revisions/under-three-minute-gate1/. The earlier 3:35 version and its
  audio/frame/approval/evidence baseline remain in review/revisions/full-length/.
- Measured narration: 170.179048s, 12 unique WAVs, shared channel voice, normal
  provider pace. All 332 approved narration words and required information remain.
  No speed-up, captions, music, effects, promotional intro/outro or MP4 export.
- review/preview-check.json: 1,350 safe-area/overlap samples with no failures,
  36 pixel-identical backward seeks, 12 decoded WAV duration checks, 36 meaningful
  setup/action/result poses, 36 motion samples, 24 opening/settled captures,
  progress/decryption/log detail stills and all 22 sides of 11 adjacent cuts.
- review/preview/all-scenes.png is the complete milestone contact sheet.
  contact-sheet-1/2.png, motion-sheet-1/2/3.png, cuts-sheet-1/2/3/4.png and
  boundaries-sheet-1/2/3.png were inspected with supporting detail stills.
- review/hyperframes-check.json: HyperFrames 0.8.108 lint, runtime, layout,
  motion and contrast passed without findings. 37 assertions, 300 motion
  samples, 140 layout samples, and 32/32 contrast checks passed.
- review/playback-check.json: complete silent and narration-enabled playback
  both reached 170.179048s. All 12 tracks were active in each pass; no audio drift
  above 450ms (133 silent samples, 95 narration-enabled samples). These are
  machine clock/mount checks, not approval of pronunciation or voice quality.
- Project preview validation, motion preset checks and all 36 Python tests pass.
  Broad scripts/test_motion.mjs remains blocked by the missing historical HTTPS
  GSAP fixture. No unrelated video was restored; target seeks pass independently.
- Production fixes: actual new cue phrases; negative download hinge start clamped;
  final replay delivers its expected reply before the unrelated attempt arrives.
  Capture fixes: sender-wait still precedes reject setup; final block is captured
  after settling. Opening captures are 30ms inside each host to avoid six-decimal
  assembly-rounding ambiguity, not evidence of a changed composition.
- Text review: only identity, endpoint/port/protocol, scope and short outcomes
  remain. DECRYPT identifies the qualified additional capability, not a claim
  that this ordinary firewall reads HTTPS. No written narration or chapter bars.
- Continuity: fixed boundary/hinge/device and matched retained packet/wrapper
  poses; Frame 5 restores the pending main attempt, valid web state survives an
  unrelated miss, drop never returns the blocked packet, reject creates a distinct
  refusal, and the harmful download is revealed only at its destination.

Human listening is pending. Machine transcription split "passes" as "pass is"
in Line 1, combined/approximated the web port (443) and "endpoints" in Line 3,
heard "Logging" as "Login" in Line 8, and approximated spelled HTTPS in Line 9.
Canonical narration retains the correct words; cues use nearby actual-WAV tokens.
Listen to these phrases in the complete preview before Gate 2 approval. Do not
mistake transcription differences for proof that either the audio or text is wrong.

Gate 2 remains pending. No render is authorized. The new complete preview needs
explicit approval, including listening; passing checks and renewed Gate 1 are
not render approval. A changed preview requires renewed Gate 2.

