# Checked facts — NAT Explained Visually

One mental model, taught once: **NAT lets many devices that use private IP
addresses reach the Internet through one public IP, because the router keeps a
table that says which connection belongs to which device.** No further concept
is introduced at the end.

Everything below was checked against primary sources on 2026-09-19. No research
happens during frame work; if a claim is not here, it is not in the video.

## What the video asserts, and where it comes from

| Claim in the video | Source |
| --- | --- |
| Private address blocks `10/8`, `172.16/12`, `192.168/16` exist for private use, and every private network may reuse them. | [RFC 1918 §3](https://www.rfc-editor.org/rfc/rfc1918.html#section-3) |
| Packets with private source or destination addresses are not forwarded across the public Internet: "routing information about private networks shall not be propagated on inter-enterprise links, and packets with private source or destination addresses should not be forwarded across such links. Routers in networks not using private address space, especially those of Internet service providers, are expected to be configured to reject (filter out)" them. | [RFC 1918 §3](https://www.rfc-editor.org/rfc/rfc1918.html#section-3) |
| Traditional NAT maps a set of private addresses to globally valid addresses; the private addresses are "local to that domain and not valid outside the domain". | [RFC 3022 §2.1](https://www.rfc-editor.org/rfc/rfc3022.html#section-2.1) |
| With one public address, NAPT maps *(local IP, local port)* tuples to *(registered IP, assigned port)* tuples, which is how several hosts share a single address. This is the mechanism the video shows. | [RFC 3022 §2.2](https://www.rfc-editor.org/rfc/rfc3022.html#section-2.2) and [RFC 2663 §4.1.2](https://www.rfc-editor.org/rfc/rfc2663.html#section-4.1.2) |
| The mapping is created by the outbound packet and is what lets the reply come back: "the NAT assigns the session an external IP address and port number so that subsequent response packets from the external endpoint can be received by the NAT, translated, and forwarded to the internal endpoint." This is a mapping between an internal `IP:port` and an external `IP:port` tuple. | [RFC 4787 §4.1](https://www.rfc-editor.org/rfc/rfc4787.html#section-4.1) |
| On the way back the NAT translates the inbound packet's **destination** address and destination transport identifier. | [RFC 2663 §4.1.2](https://www.rfc-editor.org/rfc/rfc2663.html#section-4.1.2) |
| An inbound packet with no mapping to match is filtered out rather than forwarded. | [RFC 4787 §5](https://www.rfc-editor.org/rfc/rfc4787.html#section-5) — filtering behavior; the NAT "filters out" packets that do not correspond to an established mapping |
| NAT's filtering effect is a side effect of session tracking and is **not** a firewall: "Many people view traditional NAT router as a one-way (session) traffic filter, restricting sessions from external hosts into their machines… NAT routers may be used in conjunction with firewalls to filter unwanted traffic." | [RFC 2663 §9](https://www.rfc-editor.org/rfc/rfc2663.html#section-9) |
| Source ports in the `49152–65535` range are the dynamic / private / ephemeral ports; `1024–49151` are user (registered) ports. | [RFC 6335 §6](https://www.rfc-editor.org/rfc/rfc6335.html#section-6) |
| `203.0.113.0/24` is reserved for documentation, so `203.0.113.7` names no real host. | [RFC 5737 §3](https://www.rfc-editor.org/rfc/rfc5737.html#section-3) |

The RFC's own worked example is the same shape as this video's: host `10.0.0.10`
sending from source port `3017` leaves the NAT as `138.76.29.7:1024`, and the
reply addressed to `138.76.29.7:1024` is translated back to `10.0.0.10:3017`
(RFC 3022, Figure 3).

## Assumptions the example rests on

- A plain home network: one router that is the default gateway, NAT/NAPT enabled,
  and an inside subnet `192.168.1.0/24` with the devices already configured.
  Address assignment (DHCP), DNS, ARP and routing internals are out of scope and
  never shown.
- One public address on the router's outside interface, as with a typical SOHO
  service. A pool of several public addresses (basic NAT) is a different case and
  is not shown.
- The connection is described generically as a "connection" so that the lesson
  holds for TCP and UDP alike; no header field, flag or protocol detail appears.
- Ports: the devices' source ports (`51000`, `52000`) are in the dynamic range;
  the router's outside ports (`40001`, `40002`) are ordinary user-range values.
  The outside ports **differ** from the inside ports on purpose so that the
  table's role is visible.

## Simplifications kept visible

- A NAT may keep an outbound connection's source port unchanged when nothing
  collides; choosing a different outside port is normal too (RFC 4787 §4.2, port
  assignment behavior). The video shows different ports, and its wording says the
  router gives the connection "a port of its own" — never that the port always
  changes.
- Mappings are temporary: a mapping expires when the session goes idle (RFC 4787
  §4.3 sets a UDP mapping timer of at least two minutes, five or more
  recommended). The video says only that a mapping must exist for a reply to be
  matched; the timer itself is not discussed.
- Real NATs also rewrite header checksums (RFC 2663 §4.1.2). Checksums are part
  of the excluded deep-header detail and never appear.
- "Not unique on the Internet" is the *reason* the video gives for private
  addresses not being routable; the operational rule is the RFC 1918 filtering
  quoted above.
- Home routers commonly also run a firewall and other filters. The video's
  firewall beat states the difference in *reason* (matching a table entry vs.
  applying configured rules), not that a home router has no firewall.

## Explicitly excluded (from the brief)

IPv6 NAT debates, carrier-grade NAT, NAT traversal protocols (STUN/TURN/UPnP/
hole punching), VPNs, deep packet-header syntax, ALGs, hairpinning, and advanced
firewall configuration. Nothing in the script depends on them.
