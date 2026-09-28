# Facts and assumptions

## Core model

- This explainer models a common consumer full-tunnel configuration. A VPN client establishes a protected tunnel to a VPN server and routes the selected traffic through it. Real protocols, route policies, and device behavior differ; the pictures are conceptual, not a depiction of one vendor's implementation.
- Encapsulation means the original network packet is carried inside an outer packet addressed to the VPN endpoint. The outer connection must remain routable across the local network and Internet. RFC 4301 documents this for IPsec tunnel mode; WireGuard documents its own packet encapsulation and routing. Neither source makes every VPN identical.
- With a correctly operating encrypted tunnel, the local network and ISP can still observe the device's connection to the VPN endpoint and traffic timing/volume, while they cannot read the protected inner packet contents from that tunnel. This does not conceal every side channel or prove that a particular VPN is configured correctly.
- The VPN server terminates the tunnel and forwards routed traffic toward the destination. The destination generally receives a connection whose public source IP is the VPN server's egress address, assuming the traffic uses the tunnel and there is no bypass or leak.
- The VPN provider operates the tunnel endpoint and therefore becomes a party in the path. What it can observe or retain varies by protocol, configuration, other encryption such as HTTPS, service design, and provider practices. Do not claim all providers see, store, or handle the same data.
- HTTPS is independent end-to-end transport protection between the device's application and the website. A VPN does not replace it. Where HTTPS is correctly used, the VPN tunnel can wrap the connection without giving the VPN endpoint the HTTPS-protected page contents.
- A VPN changes a network path; it does not erase account sign-ins, cookies, browser identifiers, or other ways a service can recognize a user. Nor can it protect data exposed by a compromised device before traffic enters the tunnel.
- “Full tunnel” describes the example, not a promise about every app or connection. Route rules can bypass the tunnel; split tunneling intentionally sends some traffic outside it. DNS resolver selection and whether DNS queries use the tunnel depend on configuration.

## Assumptions and wording limits

- “Typical consumer full-tunnel” is the teaching example, not a claim about every consumer VPN default.
- “Encrypted tunnel” assumes the tunnel is correctly configured and operating. DNS, startup, failure, excluded routes, endpoint compromise, and implementation defects can change what is exposed.
- “Destination sees the VPN server's public IP” applies only to traffic that actually exits through that server.
- The simplified outer/inner packet drawing represents tunnel encapsulation at a conceptual level. It is not an IPsec-only or WireGuard-only protocol tutorial.
- DNS is shown as a configuration choice; no universal leak or universal protection claim is made.

## Sources

- NIST, [SP 800-77 Rev. 1: Guide to IPsec VPNs](https://csrc.nist.gov/pubs/sp/800/77/r1/final) (June 2020). IPsec-specific guidance and architecture; used for the qualification that VPN implementations and policies vary.
- Kent and Seo, [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html) (December 2005), especially §§3, 5.1.2 and 5.2. IPsec packet policy and tunnel-mode encapsulation; not treated as a specification for all VPNs.
- WireGuard, [Protocol and routing overview](https://www.wireguard.com/). An official example of an implementation that encrypts an inner IP packet and sends it to a peer endpoint using an outer transport packet; its behavior is not generalized to every VPN.
- Electronic Frontier Foundation, [Choosing the VPN That's Right for You](https://ssd.eff.org/module/vpn.html) (reviewed July 2026). Consumer-level limits, provider position, HTTPS-visible metadata, and non-anonymity caveat.
- Mozilla, [Firefox privacy notice](https://www.mozilla.org/en-US/privacy/firefox/). Documents that a scoped proxy feature does not make browsing fully anonymous and that cookies and web APIs remain available to sites.
- Federal Trade Commission, [How Websites and Apps Collect and Use Your Information](https://consumer.ftc.gov/articles/how-websites-and-apps-collect-and-use-your-information). Background for cookies, tracking pixels, identifiers and fingerprinting as ways services recognize users.

