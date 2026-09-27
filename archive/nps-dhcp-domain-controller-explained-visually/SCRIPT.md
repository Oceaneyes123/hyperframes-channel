# NPS, DHCP, and Domain Controller — script

One takeaway: NPS decides network access when required; DHCP configures the network; DNS finds the domain; the Domain Controller handles domain identity and services.
Required information: mapped to frames in STORYBOARD.md.
Out of scope: deep Kerberos ticket exchanges, certificate enrollment internals, full PKI, DHCP failover, Group Policy, RADIUS fields, advanced NPS constraints, VPN configuration.
Duration: no fixed limit; use enough scenes and natural narration.
Captions: off.
Sound cues: off. Background music: off.

## Line 1 — Hook
**Display:** How does a Windows laptop reach the domain?
**Target:** 7–8s

    How does a Windows laptop go from no network access to talking to a Domain Controller? Four services may appear in the story, but they do different jobs.

## Line 2 — Conditional access
**Display:** Network authentication — if required
**Target:** 7–8s

    First, ask whether the network itself requires authentication. On an ordinary network, the laptop can continue toward DHCP. On an 802.1X network, access is conditional.

## Line 3 — 802.1X roles
**Display:** Client → AP or switch → NPS
**Target:** 8–9s

    The Windows laptop is the supplicant. The Wi-Fi access point or switch is the authenticator, and it acts as the RADIUS client. NPS is the RADIUS server that receives the request.

## Line 4 — NPS decision
**Display:** Access-Accept / Access-Reject
**Target:** 9–10s

    NPS checks the connection request against its network policies. Where configured, it validates the identity using Active Directory. NPS returns Access-Accept or Access-Reject, and the device gets normal network access only after an accept.

## Line 5 — Normal path
**Display:** Without 802.1X
**Target:** 7–8s

    That NPS exchange is conditional. In the normal path without 802.1X, the laptop goes from the network to DHCP, then DNS, then the Domain Controller. NPS is not involved in every domain connection.

## Line 6 — DHCP Discover and Offer
**Display:** Discover → Offer
**Target:** 8–9s

    Now DHCP. The client broadcasts Discover because it does not yet have an address. A DHCP server answers with an Offer: a proposed lease and network settings.

## Line 7 — DHCP Request and Acknowledge
**Display:** Request → Acknowledge
**Target:** 8–9s

    The client broadcasts Request for the offer it chose. The server replies with Acknowledge, confirming the lease. That four-step exchange is DORA: Discover, Offer, Request, Acknowledge.

## Line 8 — Configuration bundle
**Display:** IP + mask + gateway + DNS
**Target:** 9–10s

    The result is more than an IP address. This laptop receives IP 10.10.20.45, subnet mask 255.255.255.0, gateway 10.10.20.1, and DNS server 10.10.1.10. The DNS value is especially important in an Active Directory network.

## Line 9 — DNS discovery
**Display:** Where is the domain?
**Target:** 8–9s

    The client asks its configured DNS server where the Domain Controller for corp.example can be found. It is not simply broadcasting for a controller; it is using DNS-based service discovery.

## Line 10 — SRV and Domain Controller
**Display:** SRV → Domain Controller
**Target:** 9–10s

    DNS returns an Active Directory service location, represented here by the SRV record underscore ldap dot tcp dot dc dot underscore msdcs dot corp dot example. The client uses that answer to reach a suitable Domain Controller.

## Line 11 — Domain authentication
**Display:** Identity → AD DS
**Target:** 8–9s

    After it can reach the controller, the Windows client presents a user or computer identity to Active Directory. Kerberos is the common domain authentication protocol here. The controller provides authentication and other domain services.

## Line 12 — Responsibilities
**Display:** Four jobs, four services
**Target:** 9–10s

    Keep the jobs separate. DHCP says, “Here are your network settings.” DNS says, “Here is where the domain service is.” NPS says, “Should this device or user get network access?” The Domain Controller says, “Who are you, and what domain services can you use?”

## Line 13 — Complete flow
**Display:** NPS if required → DHCP → DNS → DC
**Target:** 10–12s

    So the complete enterprise flow is: if required, 802.1X authentication through the switch or access point and NPS; then network access; DHCP supplies IP, gateway, and DNS; DNS locates the Domain Controller; and the Domain Controller handles domain login and services.

## Line 14 — Takeaway
**Display:** NPS decides. DHCP configures. DNS finds. DC authenticates.
**Target:** 8–10s

    Remember the division of labor: NPS decides access, DHCP configures the network, DNS finds the domain, and the Domain Controller handles domain identity and services.
