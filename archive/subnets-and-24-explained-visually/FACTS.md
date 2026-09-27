# FACTS — Subnets and /24 Explained Visually

## Teaching facts

- IPv4 addresses are 32 bits, conventionally written as four dotted decimal
  octets; a prefix length (CIDR notation) states how many leading bits are the
  network prefix. `/24` therefore means "24 leading network bits". [RFC 4632,
  §3.1 Basic Concept and Prefix Notation](https://www.rfc-editor.org/rfc/rfc4632.html#section-3.1)
- A host decides whether a destination is local with its address mask: bits
  extracted by the mask from the destination are compared with the same bits of
  its own address. Match -> the destination is on a connected network and the
  datagram is transmitted directly. No match -> the destination is reachable
  only through a gateway. [RFC 1122, §3.3.1.1 Local/Remote Decision](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1)
- The address mask is a 32-bit mask that selects the network and subnet fields
  of the corresponding IP address; a `/24` prefix is the mask
  `255.255.255.0` (24 leading ones, 8 trailing zeros). [RFC 1122, §3.3.1.1 step 1](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1)
- `192.168.0.0/16` is private address space; the `192.168.x.x` example in this
  video is private only as an example, not because CIDR is private-only. [RFC
  1918, §3 Private Address Space](https://www.rfc-editor.org/rfc/rfc1918.html#section-3)
- Conventional subnets reserve the all-zeros host portion as the network
  address and the all-ones host portion as the broadcast address: numbered
  subnets "in current practice ... do not use longer than a 30-bit subnet mask
  (in most cases), which requires four addresses per link - two host addresses,
  one all-zeros network, and one all-ones broadcast". For a `/24` that makes 256
  total addresses and the usual 254 host addresses after reserving the network
  and broadcast addresses. [RFC 3021, §1](https://www.rfc-editor.org/rfc/rfc3021.html#section-1)
- A gateway/router forwards datagrams between networks; the same RFC pair is
  what makes "local or send it to my router" the correct beginner model. [RFC
  1122, §3.3.1.2 Gateway Selection](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.2)

## Simplifications kept visible

- One prefix length (`/24`) is taught. The narration says the first 24 bits are
  the network "here", implying other sizes exist without teaching them.
- The video never converts binary beyond showing 8 + 8 + 8 + 8 = 32 and the
  24-ones / 8-zeros shape of the mask; decimal-to-binary conversion is not
  taught.
- "254 usable host addresses" is the conventional `/24` figure for ordinary
  subnetworks. `/31` point-to-point links and `/32` single hosts are real
  documented exceptions [RFC 3021] and stay in the fact sheet, not the video.
- The example device map (`192.168.1.1` router, `.20` laptop, `.50` phone,
  `.100` server) is an illustration of a plausible `/24`; no DHCP server,
  reservation, or lease behavior is shown.

## Source note

Addressing, mask, and local/remote-decision claims are checked against the RFC
Editor text of RFC 4632 (CIDR prefix notation), RFC 1122 (host local/remote
decision and gateway selection), RFC 1918 (private address space), and RFC 3021
(the all-zeros/network and all-ones/broadcast address arithmetic).
