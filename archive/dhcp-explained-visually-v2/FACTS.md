# DHCP facts and scope

## Claims used

- DHCPv4 commonly starts with DHCPDISCOVER, DHCPOFFER, DHCPREQUEST and DHCPACK. A fresh client normally broadcasts Discover on its local network to locate available servers; a known server can change that behavior, so the board says “usual fresh join.”
- DHCPOFFER proposes configuration parameters. DHCPREQUEST identifies the offer the client wants to use. DHCPACK confirms the committed address and configuration.
- DHCP configuration may include an IP address, subnet mask, router/default gateway, DNS server and lease duration.
- A lease is a time-bounded allocation in the usual dynamic case. The client can request renewal before expiry; a successful renewal extends use. A later assignment is not guaranteed to be the same address.
- Manual configuration is also possible. DHCP is a common convenience, not a requirement for every network.
- The router/default gateway is a different network role from the DHCP server; one physical device may provide both services, but the explainer draws them separately.

## Example values

The proposed configuration uses IP `192.168.1.25`, subnet mask `255.255.255.0`, gateway `192.168.1.1`, DNS `192.168.1.1`, and a 24-hour lease. These are illustrative values for one small IPv4 network, not defaults or a promise that another device receives the same address or lease duration.

## Primary sources

- [RFC 2131 — Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html), especially §§1, 3.1, 4.4.1, 4.4.5. Defines client/server roles, the Discover/Offer/Request/ACK exchange, broadcast discovery, leases, and renewal.
- [RFC 2132 — DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132.html), especially §§3.3, 3.5, 3.8 and 9. Defines the subnet mask, router, and DNS-server configuration options.

## Simplifications

- “DORA” is a teaching mnemonic for the common first-time DHCPv4 exchange. The four displayed messages describe the usual new-client path, not every possible DHCP interaction.
- The lease shown as 24 hours is only an example. Lease policy varies; an address is not permanently owned by the device.
- The initial Discover is shown as a local broadcast because the fresh client usually has not learned a server address. RFC 2131 permits use of a known server address in other states.
- The router and DHCP server are shown as separate appliances to clarify their roles. A real home router may perform both.
- We omit relay agents, enterprise architecture, DHCP options numbers, packet headers and DHCPv6 as requested.
