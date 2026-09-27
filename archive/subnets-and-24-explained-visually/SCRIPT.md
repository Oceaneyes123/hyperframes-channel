# SCRIPT — Subnets and /24 Explained Visually

**Voice:** Supertonic 3 (repository production path)
**Voice direction:** Friendly, calm, precise. Land slightly harder on the numbers, then a short pause before each conclusion. Curious at the hook, matter-of-fact at the recap.
**Display vs spoken:** Display copy stays on the frame ("Text shown" in `STORYBOARD.md`). Only the indented narration is sent to TTS. `scripts/narration_text.py` reads `pronunciation.json` (`ipv4_style: "short"`) and speaks `192.168.1.20` as "one ninety two dot one sixty eight dot one dot twenty", `/24` as "slash twenty four". Values the frame already displays in full are spoken by their changed part ("dot zero", "dot one") so the video stays inside the 90–120 second budget. Do not pre-spell numbers in the narration.
**Timing:** 286 spoken words, estimated 111.8s at 2.56 words/second (the pace measured in `videos/portrait-workflow-demo`). These targets are planning numbers; `audio_meta.json` replaces them after synthesis.

---

## Line 1 — Hook (Frame 1)

**Display:** Two laptops. Two addresses. `192.168.1.20` · `192.168.1.50`
**Target:** 13.5s — first visual within 1s
**Delivery:** Curious.

    Two laptops, one network: 192.168.1.20 and 192.168.1.50. Add /24. What does it mean?

## Line 2 — An IPv4 address is 32 bits (Frame 2)

**Display:** `192` · `168` · `1` · `20`
**Target:** 8.5s
**Delivery:** Slow, counting.

    An IP address is really 32 bits, written as four groups called octets. Eight bits, eight bits, eight bits, eight bits.

## Line 3 — What /24 marks (Frame 3)

**Display:** NETWORK `192.168.1` | HOST `20`
**Target:** 10.0s
**Delivery:** Explanatory, then a clear beat.

    /24 says the first 24 bits describe the network. So the first three octets name the network, and the last octet is left for hosts.

## Line 4 — The same boundary, written as a mask (Frame 4)

**Display:** `/24` = `255.255.255.0`
**Target:** 11.5s
**Delivery:** Matter-of-fact.

    That same boundary has a second name: the subnet mask. /24 and 255.255.255.0 are the same divide.

## Line 5 — Network address (Frame 5)

**Display:** NETWORK ADDRESS `192.168.1.0`
**Target:** 6.5s
**Delivery:** Demonstrative.

    Set every host bit to zero, and you get the network address: the name of this subnet.

## Line 6 — Range and broadcast (Frame 6)

**Display:** `192.168.1.0` → `192.168.1.255`
**Target:** 9.5s
**Delivery:** Flowing, ending on the boundary.

    Inside the subnet, addresses run from dot zero to dot two fifty five. The last one, all host bits set, is the broadcast address.

## Line 7 — Usable host addresses (Frame 7)

**Display:** `192.168.1.1` – `192.168.1.254`
**Target:** 8.0s
**Delivery:** Warm, listing.

    Reserve those two, and 254 addresses are left for devices. Here: a router, a laptop, a phone, and a server.

## Line 8 — Same subnet (Frame 8)

**Display:** SAME NETWORK
**Target:** 6.0s
**Delivery:** Payoff.

    Both laptops now. Same first 24 bits, so they reach each other through the switch.

## Line 9 — Different subnet (Frame 9)

**Display:** DIFFERENT NETWORK `192.168.1` vs `192.168.2`
**Target:** 9.0s
**Delivery:** A small surprise.

    Move one laptop to 192.168.2.50, and the network portions stop matching. Different subnets.

## Line 10 — Toward the router (Frame 10)

**Display:** DEFAULT GATEWAY `192.168.1.1`
**Target:** 7.5s
**Delivery:** Helpful, resolving.

    That destination is not local, so the laptop sends it to its default gateway, the router at dot one.

## Line 11 — Why subnets exist (Frame 11)

**Display:** LOCAL? yes → direct · no → router
**Target:** 9.0s
**Delivery:** Zooming out.

    Zoom out: two subnets, one router. Every device asks one simple question: is the destination local, or does it go to the router?

## Line 12 — Recap (Frame 12)

**Display:** `/24` — network `192.168.1` · host `20` · mask `255.255.255.0`
**Target:** 13.0s
**Delivery:** Confident close, then the tease.

    So /24 means the first 24 bits name the network, and the last 8 address the devices inside it. Same subnet, local. Different subnet, the router. Next: a switch, or a router?
