# SCRIPT — NAT Explained Visually

**One takeaway:** NAT lets many devices that use private IP addresses reach the
Internet through one public IP, because the router keeps a table that says which
connection belongs to which device.

**Voice:** Supertonic 3 (repository production path), one WAV per scene.
**Voice direction:** Calm, curious, precise. A small pause after each question,
a slightly harder landing on the words "table", "matches" and "one".
**Display vs spoken:** `STORYBOARD.md` owns the on-frame copy. Only the indented
paragraph in each section is sent to TTS. `pronunciation.json` sets
`ipv4_style: "short"` so `192.168.1.10` speaks as
"one ninety two dot one sixty eight dot one dot ten", and speaks the acronym
`NAT` as the word "nat". Values the frame already displays in full are spoken
only when the pronunciation itself teaches the lesson; the frames carry the
rest.
**Timing:** estimates only. `audio_meta.json` replaces every number here after
synthesis; do not hand-edit timings.

---

## Line 1 — Two devices, one address

**Display:** Same public IP?
**Target:** 6s — the question lands inside 2s
**Delivery:** Curious.

    Your phone and your laptop have different private addresses. So why does the Internet see one public IP?

## Line 2 — Private addresses inside the home

**Display:** PRIVATE · 192.168.1.10 · 192.168.1.20
**Target:** 11s
**Delivery:** Explanatory, slow on the address.

    Inside your home, each device gets a private address from the router, like one ninety two dot one sixty eight dot one dot ten. Every home network reuses these ranges.

## Line 3 — Why private addresses cannot cross the Internet

**Display:** NOT UNIQUE
**Target:** 9s
**Delivery:** Matter-of-fact.

    Those addresses are not unique on the Internet. Millions of homes use the same ones, so no Internet router will deliver to them.

## Line 4 — The router's public address

**Display:** PUBLIC ADDRESS · 203.0.113.7
**Target:** 10s
**Delivery:** Clear, then a beat on the address.

    On the outside, the router has one public address: two oh three dot zero dot one thirteen dot seven. That is the address the Internet sees.

## Line 5 — A device sends traffic out

**Display:** OUT IT GOES · packet 192.168.1.10:51000
**Target:** 9s
**Delivery:** Observational.

    Your phone opens a connection to a website. Its packet leaves with a private source address and a source port.

## Line 6 — The router rewrites the source

**Display:** REWRITE SOURCE · new table row
**Target:** 10s
**Delivery:** Deliberate, landing on "table".

    The router replaces that private source with its public address and a port of its own, and writes the pair into its table.

## Line 7 — What the website sees

**Display:** THE SITE SEES · 203.0.113.7:40001
**Target:** 9s
**Delivery:** Payoff.

    Outside, the packet carries the public address. The website sees one connection from your router, and replies to that address and port.

## Line 8 — A second device joins

**Display:** A SECOND DEVICE · packet 192.168.1.20:52000
**Target:** 8s
**Delivery:** Lighter, new event.

    Now your laptop opens its own connection. It has a different private address and a different source port.

## Line 9 — One address, two ports

**Display:** ONE ADDRESS · two table rows
**Target:** 10s
**Delivery:** Emphatic on "one" and "two".

    The router gives it the same public address, but its own outside port, so it can tell the two connections apart.

## Line 10 — The reply comes back

**Display:** THE REPLY RETURNS · destination 203.0.113.7:40001
**Target:** 8s
**Delivery:** Steady.

    A reply comes back from the website, addressed to the public address and the first port.

## Line 11 — The router matches the table

**Display:** MATCH THE TABLE · row 1 highlighted
**Target:** 10s
**Delivery:** Precise, landing on "matches".

    The router looks that port up in the table. It matches one entry, and the destination is rewritten back to the phone.

## Line 12 — Back to the right device

**Display:** BACK TO PHONE
**Target:** 9s
**Delivery:** Resolving.

    The reply travels to your phone. The laptop's reply uses the other entry, so each device gets only its own answers.

## Line 13 — An unsolicited connection

**Display:** NO MATCH
**Target:** 10s
**Delivery:** A small surprise, then flat.

    What if someone on the Internet connects in first? Nothing in the table matches that port, so the router drops the packet.

## Line 14 — NAT is not a firewall

**Display:** NOT A FIREWALL · MATCHES A TABLE / APPLIES RULES
**Target:** 10s
**Delivery:** Corrective, without preaching.

    That is not the same as a firewall. NAT drops what it cannot match in its table; a firewall decides by rules someone set.

## Line 15 — The takeaway

**Display:** MANY PRIVATE DEVICES · NAT · ONE PUBLIC IP
**Target:** 9s
**Delivery:** Confident close.

    Many private devices, one public address. NAT keeps the table, so every reply finds the right device.
