# DHCP fact sheet

Source-backed facts retained for the script and storyboard. The video simplifies packet-level details for beginners while preserving the common IPv4 relationship.

- DHCP is the Dynamic Host Configuration Protocol. A client can use it to obtain configuration parameters, including an IP address and lease time.
- The common first-contact sequence is DHCPDISCOVER → DHCPOFFER → DHCPREQUEST → DHCPACK: Discover, Offer, Request, Acknowledge.
- A new client initially has no usable assigned IPv4 address and does not know the DHCP server's address, so the first request is sent as a broadcast on the local network.
- An offer is a proposed configuration, not the final confirmation. The request selects the offer; the acknowledgment confirms the lease and parameters.
- DHCP options can provide more than an address, including subnet mask, router/default gateway, and domain name servers.
- A lease is time-limited. A client can request renewal before expiry and can continue using the configuration when the lease is renewed.
- The DHCP server and default gateway/router may be separate devices; this explainer draws them as separate roles.
- A DHCP deployment may offer different lease durations and does not guarantee that a device always receives the same address.

## Primary references

- RFC 2131, Dynamic Host Configuration Protocol: https://www.rfc-editor.org/rfc/rfc2131.html
- RFC 2132, DHCP Options and BOOTP Vendor Extensions: https://www.rfc-editor.org/rfc/rfc2132.html
