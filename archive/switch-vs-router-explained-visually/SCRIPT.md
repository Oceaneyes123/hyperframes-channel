# SCRIPT — Switch vs Router Explained Visually

**Voice:** Supertonic 3 (repository production path)
**Voice direction:** Friendly, precise, curious at the questions, with short pauses after each traffic decision.

---

## Line 1 — The question (Frame 1)

**Time:** 0.0 – 6.0s
**Delivery:** Curious.

    If both switches and routers move network traffic, what’s the difference? The answer starts with where that traffic needs to go.

## Line 2 — Start inside the LAN (Frame 2)

**Time:** 6.0 – 14.0s
**Delivery:** Clear.

    Laptop A and Laptop B are on the same local network, connected through one switch. So what happens when A sends data to B?

## Line 3 — Two kinds of address (Frame 3)

**Time:** 14.0 – 22.0s
**Delivery:** Explanatory.

    A has IP address 192.168.1.10 and MAC address AA:AA. B has 192.168.1.20 and BB:BB. IP identifies the network destination; MAC identifies the local delivery target.

## Line 4 — The Ethernet frame (Frame 4)

**Time:** 22.0 – 32.0s
**Delivery:** Demonstrative.

    On this local link, A wraps the message in an Ethernet frame: source MAC AA:AA, destination MAC BB:BB. The frame reaches the switch.

## Line 5 — The switch forwards locally (Frame 5)

**Time:** 32.0 – 39.0s
**Delivery:** Payoff.

    The switch checks its MAC table, finds BB:BB on Port 3, and forwards the frame only there. It does not send this local frame everywhere.

## Line 6 — How the switch learns (Frame 6)

**Time:** 39.0 – 47.0s
**Delivery:** Matter-of-fact.

    How did it know? Switches learn by watching incoming frames: AA:AA arrived on Port 1, and BB:BB arrived on Port 3. MAC to port.

## Line 7 — A remote destination (Frame 7)

**Time:** 47.0 – 55.0s
**Delivery:** Curious.

    Now A wants 8.8.8.8. That address is outside 192.168.1.0 slash 24. Can the switch send it directly? Not to the right remote network.

## Line 8 — Meet the router (Frame 8)

**Time:** 55.0 – 64.0s
**Delivery:** Reassuring.

    A sends remote traffic toward its default gateway, the router at 192.168.1.1. The router connects the local IP network to another network.

## Line 9 — The router chooses a network (Frame 9)

**Time:** 64.0 – 74.0s
**Delivery:** Precise.

    The router reads the packet’s destination IP and consults routing information: 192.168.1.0 slash 24 goes to the LAN; the default route goes toward the internet. This is IP routing.

## Line 10 — Side by side (Frame 10)

**Time:** 74.0 – 81.0s
**Delivery:** Rhythmic.

    Switch: local Ethernet frames, MAC addresses, device to device. Router: IP packets, destination networks, one network to another.

## Line 11 — Same network (Frame 11)

**Time:** 81.0 – 88.0s
**Delivery:** Reinforcing.

    Same subnet? Laptop, switch, laptop. The router can stay quiet because the destination is already local.

## Line 12 — Different network, plus the home-box surprise (Frame 12)

**Time:** 88.0 – 97.0s
**Delivery:** Clarifying.

    Different network? Laptop, switch, router, remote server. And the box in a home often combines a router, a switch, and a Wi-Fi access point.

## Line 13 — The takeaway (Frame 13)

**Time:** 97.0 – 105.0s
**Delivery:** Confident close.

    So the short version is simple: a switch connects devices within a network. A router connects networks. Next, how does your computer decide whether an IP is local or remote?
