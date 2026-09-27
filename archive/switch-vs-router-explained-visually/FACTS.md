# FACTS — Switch vs Router Explained Visually

## Teaching facts

- A host compares a destination IP with its local address and subnet mask. If the destination is on a connected network, the host sends directly to that destination; otherwise it sends the datagram to a gateway. [RFC 1122, §3.3.1](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1)
- A gateway/router forwards IP datagrams between networks using the destination IP address and routing information. [RFC 791, §2.3–2.4](https://www.rfc-editor.org/rfc/rfc791.html#section-2.3)
- An IP datagram is carried inside a local-network header for each link. The local header is removed at a gateway and a new local header is created for the next network. [RFC 791, §2.2](https://www.rfc-editor.org/rfc/rfc791.html#section-2.2)
- Ethernet bridges/switches learn source MAC addresses and associate them with incoming ports, then use the learned forwarding database to choose an egress port. The video uses a deliberately simplified table: `AA:AA → Port 1`, `BB:BB → Port 3`.
- A switch is shown as the local Ethernet forwarding point, not as a claim that every modern switch is only Layer 2. A router is shown as the IP-network boundary, not as a claim that routers only connect homes to the public internet.
- The home-device scene treats “router” as a consumer product label that may combine routing, Ethernet switching, and Wi-Fi access-point functions.

## Simplifications kept visible

- Addresses are shortened to `AA:AA` and `BB:BB`; the IP examples are IPv4 only.
- `192.168.1.0/24` is the local example network, `192.168.1.1` the example gateway, and `8.8.8.8` the remote destination supplied by the brief.
- The frame/packet distinction is visual and brief: the local Ethernet frame carries the IP packet across one link; the router makes the inter-network decision from the packet’s destination IP.
- ARP, VLANs, NAT, routing protocols, Layer 3 switches, and full headers are intentionally out of scope.

## Source note

The conceptual routing claims are checked against the RFC Editor copies above. The switch-learning explanation is presented as the standard beginner-level bridge forwarding model and intentionally avoids implementation-specific behavior.
