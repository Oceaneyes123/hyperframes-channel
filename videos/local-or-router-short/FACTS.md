# Checked facts

A host compares its own and the destination's network portions using its mask.
A local destination is reachable directly on the connected network; otherwise
the host selects a gateway. This example assumes an ordinary switched Ethernet
LAN, a default gateway, and working routes to a second network.

Source: [RFC 1122, sections 3.3.1.1 and 3.3.1.2](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1), checked 2026-09-17.

The /24 illustration highlights the first three octets only for this prefix.
It does not imply all subnets use /24 or every remote route uses the same gateway.
ARP, firewalls, routing-table exceptions and return routes are out of scope.
Packet receipt is an example outcome, not a promise that delivery always succeeds.
