---
workflow: channel-explainer
flow: two-gates
status: gate-2-pending
format: 1080x1920
fps: 30
language: English
captions: off
sound_effects: off
bgm: off
---

# How does a firewall decide what to block?

Audience: beginners with no prior knowledge.

One takeaway: a firewall compares connection attempts with configured rules and,
when applicable, existing connection state. Permission is not proof of safety.

Scope: an outgoing web connection, its expected reply, and an unsolicited incoming
attempt, from arrival at one stateful network firewall through allow/block.
Follow the browser's connection to carry a web request. Do not imply the first
connection-opening packet already contains the encrypted web request.

Required coverage: inspectable information; ordered rules and default behavior;
expected replies and connection state; drop versus reject; harmful allowed traffic;
legitimate blocked traffic; capability differences; encrypted-content limits.
Coverage mapping is in SCRIPT.md and FACTS.md.

Exclude configuration instructions, vendor comparisons, deep packet inspection
details, unexplained jargon, captions, promotional opening/closing, music and SFX.

Creative direction: playful illustrated object performance. One persistent
firewall boundary divides a device below from the internet above. Use the current
local flow-props family: articulated laptop, elastic packet, hinged gate, header,
and content. Adapt the gate/check, cutaway and matched-packet behaviors from
examples/flow-motion, with factual corrections described in STORYBOARD.md.
Rules and state remain distinguishable. A silent drop never draws a return path.
Sparse labels, large actual local artwork, stable endpoint identity.

Duration revision requested 2026-10-02: under 180 seconds. The complete 332-word
script and all 12 scenes are retained. Revised Gate 1 approved 2026-10-02,
user message "I approved". New narration measured 170.179048s (2:50.179),
9.820952s below three minutes. No speed-up, split or omitted required information.
audio_meta.json owns timing; FACTS.md records platform compatibility separately.

The full-length 215.055782s baseline is preserved in review/revisions/full-length/.
The approved shortened plan is in review/revisions/under-three-minute-gate1/.
All frames and cues now use the new measured audio. Complete checks and preview
are ready for renewed Gate 2 review. Human listening and export remain unverified.
No MP4 render, commit, push or publication is authorized.

Gate 1 deliverable: this brief, sourced facts, complete script, timed storyboard,
resolved ICON_PLAN.json, frame.md geometry, and sketches/board.html presenting
the complete script with setup/comparison/result sketches for every scene.
No final narration, animated compositions or video export before approval.

Gate 2 deliverable after Gate 1: measured per-scene narration, audio_meta.json,
audio-derived semantic cues, all scenes, checks, motion/seek/cut evidence, listening
review limitations, and an opened complete preview. Explicit Gate 2 approval is
required before rendering. A revised preview requires renewed approval.

Keep all work local. Preserve existing edits/videos. No commit, push or publication.
