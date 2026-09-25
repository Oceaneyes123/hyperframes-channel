# Script — NPS, DHCP, and Domain Controller explained visually

One takeaway: DHCP configures the network, DNS finds the domain, the Domain
Controller provides domain identity and services, and NPS decides network access
when the network itself requires authentication.

Required information (map every point to storyboard scenes): see `BRIEF.md`, which
carries the point-to-scene coverage table. Every required point is mapped there and
cross-checked here before approval.

Out of scope: deep Kerberos ticket exchanges, certificate enrolment internals, full
PKI architecture, DHCP failover, Group Policy processing, RADIUS packet-field
detail, advanced NPS constraints, VPN configuration.

Duration: no fixed limit; 21 scenes cover the required information at a natural pace.
Captions: off. Sound cues: off. Background music: off.

Display copy stays short (≤6-word headline, 1–4-word labels, ~16 visible words per
scene). Only the indented paragraph in each line is sent to TTS.

## Line 1 — The question
**Display:** HOW DOES IT REACH THE DOMAIN?
**Target:** 6–8s (objects visible within 1s; the question lands within 2s)

    Your Windows laptop has no network access. How does it reach your company's domain? Four different services make that happen.

## Line 2 — Plugging in
**Display:** NO ADDRESS
**Target:** 5–7s

    First the laptop connects, by cable or by Wi-Fi. It is on the network now, but it still has no address of its own.

## Line 3 — Discover
**Display:** DISCOVER
**Target:** 6–8s

    So it asks. DHCP Discover goes out as a broadcast across the local network. Is there a DHCP server here?

## Line 4 — Offer
**Display:** OFFER
**Target:** 6–8s

    A DHCP server answers with an offer, an address it is willing to lend before anything is confirmed.

## Line 5 — Request
**Display:** REQUEST
**Target:** 5–7s

    The laptop replies with a request, asking that server to keep that exact offer for it.

## Line 6 — Acknowledge
**Display:** ACKNOWLEDGE
**Target:** 6–8s

    The server acknowledges. The lease is committed, and the laptop has working network settings.

## Line 7 — The configuration bundle
**Display:** IP · MASK · GATEWAY · DNS
**Target:** 7–9s

    DHCP delivered four things: an IP address, a subnet mask, a default gateway, and a DNS server.

## Line 8 — Why the DNS setting matters
**Display:** DNS MATTERS MOST
**Target:** 8–10s

    In a domain, that last setting matters most. A wrong DNS server still lets you browse the internet, but you will never find the domain.

## Line 9 — The discovery question
**Display:** WHERE IS THE DC?
**Target:** 6–8s

    So the laptop asks DNS a direct question: where is a domain controller for the domain corp dot example?

## Line 10 — The service record
**Display:** _ldap._tcp.dc._msdcs.corp.example
**Target:** 7–9s

    DNS answers with a service record, an S R V record, that names the domain controller's host and its address.

## Line 11 — Contacting the Domain Controller
**Display:** DC FOUND
**Target:** 6–8s

    With a name and an address, the laptop now contacts that domain controller directly, to confirm it is alive and reachable.

## Line 12 — Domain sign-in
**Display:** KERBEROS
**Target:** 8–10s

    The user signs in. The identity travels to the domain controller, Kerberos carries the authentication, and the account is checked in Active Directory.

## Line 13 — A different kind of network
**Display:** THE PORT IS CLOSED
**Target:** 7–9s

    That is the normal path. But some corporate networks will not hand out a working port at all until the device proves who it is.

## Line 14 — The three roles
**Display:** SUPPLICANT · AUTHENTICATOR · RADIUS SERVER
**Target:** 8–10s

    That is where 802.1X comes in. The laptop is the supplicant. The switch or access point is the authenticator. And NPS is the RADIUS server behind it.

## Line 15 — Who sends the RADIUS request
**Display:** RADIUS REQUEST
**Target:** 7–9s

    The laptop never talks to NPS. The switch or access point sends the RADIUS request on its behalf, because that is the device holding the port.

## Line 16 — NPS decides
**Display:** POLICY + IDENTITY
**Target:** 8–10s

    NPS receives the request, matches it against its connection and network policies, and checks the identity against Active Directory.

## Line 17 — The verdict
**Display:** ACCESS-ACCEPT / ACCESS-REJECT
**Target:** 7–9s

    Then it answers. Access-Accept opens the port. Access-Reject leaves the device with no network access at all.

## Line 18 — And then the normal path
**Display:** THEN DHCP → DNS → DC
**Target:** 6–8s

    Once the port opens, everything you already saw happens next. DHCP, then DNS, then the domain controller.

## Line 19 — NPS is conditional
**Display:** WITHOUT 802.1X
**Target:** 7–9s

    On a network without 802.1X, NPS never appears in this flow. DHCP and DNS take the device straight to the domain.

## Line 20 — The complete flow
**Display:** THE FULL FLOW
**Target:** 8–10s

    Put it together. Authenticate at the port, get your settings from DHCP, find the domain in DNS, and sign in at the domain controller.

## Line 21 — The takeaway
**Display:** FOUR JOBS
**Target:** 9–11s

    Four services, four jobs. NPS decides access. DHCP configures the network. DNS finds the domain. The domain controller handles identity and domain services.
