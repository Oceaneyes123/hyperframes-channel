# SCRIPT — DHCP Explained Visually

**Voice:** Supertonic 3 (repository production path)
**Voice direction:** Friendly, precise, unhurried. Make each packet handoff feel intentional; emphasize the DORA initials.

---

## Line 1 — The question (Frame 1)

**Time:** 0.0 – 8.0s
**Delivery:** Curious.

    Your laptop joins Wi-Fi. But it still does not know which IP address to use. How does it get one?

## Line 2 — Why manual setup breaks down (Frame 2)

**Time:** 8.0 – 19.0s
**Delivery:** Recognizing, lightly brisk.

    Without DHCP, someone would configure every device: IP address, subnet mask, gateway, and DNS. That gets old fast.

## Line 3 — Meet DHCP (Frame 3)

**Time:** 19.0 – 28.0s
**Delivery:** Reassuring.

    DHCP is the network service that hands out those settings automatically. The server and router are separate roles, even when one box provides both.

## Line 4 — Discover (Frame 4)

**Time:** 28.0 – 40.0s
**Delivery:** Clear, with emphasis on “broadcast.”

    First: Discover. The new client broadcasts, “I am new here. Is there a DHCP server?” It does not yet know the server’s address.

## Line 5 — Offer (Frame 5)

**Time:** 40.0 – 51.0s
**Delivery:** Matter-of-fact.

    Next: Offer. The server proposes an address, such as 192.168.1.25, plus a subnet mask, gateway, DNS server, and lease time. It is an offer, not a final assignment.

## Line 6 — Request (Frame 6)

**Time:** 51.0 – 61.0s
**Delivery:** Decisive.

    Then: Request. The client says, “I want to use that offered address.” If other servers made offers, this also signals which one was chosen.

## Line 7 — Acknowledge (Frame 7)

**Time:** 61.0 – 72.0s
**Delivery:** Payoff.

    Finally: Acknowledge — ACK. The server confirms the lease, and the laptop can now use 192.168.1.25 to communicate.

## Line 8 — DORA and the configuration bundle (Frame 8)

**Time:** 72.0 – 84.0s
**Delivery:** Rhythmic recap.

    Remember DORA: Discover, Offer, Request, Acknowledge. DHCP often delivers the whole starter bundle: IP, subnet mask, gateway, DNS, and lease time.

## Line 9 — Leases renew (Frame 9)

**Time:** 84.0 – 98.0s
**Delivery:** Calm, explanatory.

    That address is leased, not owned forever. Before the timer expires, the client contacts DHCP to renew. If renewal succeeds, it can usually keep using the same address.

## Line 10 — The payoff (Frame 10)

**Time:** 98.0 – 110.0s
**Delivery:** Confident close.

    So when devices appear on a network, DHCP quietly gives each one the settings it needs. No manual address hunt — just a ready-to-communicate device.
