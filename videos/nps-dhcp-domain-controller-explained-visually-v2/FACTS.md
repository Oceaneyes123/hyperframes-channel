# FACTS — how a Windows device gets network access and reaches Active Directory

Researched once, before the script. Primary sources only (RFCs + Microsoft Learn).
Quoted sentences are the support for each claim; they are not spoken.

## 1. DHCP is a client/server protocol that supplies configuration automatically

> "Dynamic Host Configuration Protocol (DHCP) is a client/server protocol that
> automatically provides an Internet Protocol (IP) host with its IP address and
> other related configuration information."
> — Microsoft Learn, *What is DHCP Server in Windows Server?*
> https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top

> "All Windows-based client operating systems include the DHCP client as part of
> TCP/IP, and DHCP client is enabled by default." — same page.

## 2. The four DORA messages, at the level the video uses them

> "DHCPDISCOVER - Client broadcast to locate available servers."
> "DHCPOFFER - Server to client in response to DHCPDISCOVER with offer of
> configuration parameters."
> "DHCPREQUEST - Client message to servers either (a) requesting offered parameters
> from one server and implicitly declining offers from all others..."
> "DHCPACK - Server to client with configuration parameters, including committed
> network address."
> — RFC 2131 §3.1 message table, https://www.rfc-editor.org/rfc/rfc2131.txt

Note the wording the video must respect: Discover is a **broadcast to locate**
servers; the Offer is an offer of parameters (provisional); the Request selects;
the ACK commits the address.

## 3. What DHCP actually hands over (option codes)

> "The code for the subnet mask option is 1, and its length is 4 octets." — RFC 2132 §3.3
> "The router option specifies a list of IP addresses for routers on the client's
> subnet. ... The code for the router option is 3." — RFC 2132 §3.5
> "The domain name server option specifies a list of Domain Name System (STD 13,
> RFC 1035) name servers available to the client. ... The code for the domain name
> server option is 6." — RFC 2132 §3.8
> https://www.rfc-editor.org/rfc/rfc2132.txt

So "IP + subnet mask + default gateway (router option) + DNS server (option 6)" is
literally what a DHCP reply carries, and the video can name all four without
over-claiming.

## 4. Why the DNS setting matters in an Active Directory environment

> "Active Directory Domain Services (AD DS) uses Domain Name System (DNS) name
> resolution services to make it possible for clients to locate domain controllers
> and for the domain controllers that host the directory service to communicate
> with each other."
> — Microsoft Learn, *DNS and AD DS*
> https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/dns-and-ad-ds

A client that received a bad DNS server from DHCP cannot locate a domain controller
even though its IP configuration is otherwise valid.

## 5. Domain controller discovery (DC Locator) is a DNS query, not a broadcast

> "Domain controller locator (DC locator) algorithm ... : Locator finds which domain
> controllers are registered. Locator submits a query to locate a domain controller
> in the specified domain. An LDAP User Datagram Protocol (UDP) lookup is then sent
> to one or more of the domain controllers listed in the response to ensure their
> availability. Finally, the Netlogon service caches the discovered domain
> controller to aid in resolving future requests."
> — Microsoft Learn, *Locating Active Directory Domain Controllers in Windows and Windows Server*
> https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/dc-locator

> "Domain controllers register various SRV records in DNS ... Clients query DNS for
> the appropriate SRV records and then ping those servers by using UDP-based LDAP
> pings." — same page.

> "When a workstation signs in to a Windows-based domain, it queries DNS for SRV
> records in the format `_<service>._<protocol>.<DnsDomainName>`. Clients querying
> DNS for an LDAP server for the domain using the following format, where
> DnsDomainName is the domain name. `_ldap._tcp.DnsDomainName`" — same page.

> "To locate domain controller (DC) hosting NC N, the client machine issues a DNS
> query for the SRV record `_ldap._tcp.dc._msdcs.N` ... To locate a DC hosting NC N in
> site Y, the client machine issues a DNS query for the SRV record
> `_ldap._tcp.Y._sites.dc._msdcs.N` ... The DNS query returns a list of SRV records
> that match this query. The target field of the SRV record contains the FQDN (2) of
> the server. Upon receiving the DNS query results, the client machine retrieves the
> IP addresses corresponding to each server (via DNS A/AAAA queries) and sends an
> LDAP ping to the retrieved addresses..."
> — [MS-ADTS] 6.3.6.1 DNS-Based Discovery
> https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/7fcdce70-5205-44d6-9c3a-260e616a2f04

> "UDP/389: This port is required to discover AD services."
> — Microsoft Learn, *Troubleshoot domain controller location issues in Windows*

## 6. SRV record form (level used here)

> "The format of the SRV RR ... `_Service._Proto.Name TTL Class SRV Priority Weight
> Port Target`. The priority of this target host. A client MUST attempt to contact
> the target host with the lowest-numbered priority it can reach..."
> — RFC 2782, https://www.rfc-editor.org/rfc/rfc2782.txt

The video shows one readable record name and says it "names the host and address".
It does not teach SRV field syntax or weighting.

## 7. Active Directory authentication, and Kerberos

> "Kerberos is an authentication protocol that is used to verify the identity of a
> user or host." ... "The Kerberos Key Distribution Center (KDC) is integrated with
> other Windows Server security services that run on the domain controller. The KDC
> uses the domain's Active Directory Domain Services database as its security account
> database. Active Directory Domain Services is required for default Kerberos
> implementations within the domain or forest."
> — Microsoft Learn, *Kerberos authentication overview*
> https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview

So: identification/credential check happens at the domain controller, against
Active Directory; Kerberos is the default protocol. Ticket internals are out of
scope by brief.

## 8. NPS, RADIUS and 802.1X

> "You can use NPS to centrally configure and manage network access authentication,
> authorization, and accounting." ... "RADIUS server. NPS performs centralized
> authentication, authorization, and accounting for wireless, authenticating switch,
> remote access dial-up, and virtual private network (VPN) connections. When you use
> NPS as a RADIUS server, you configure the following components: Network access
> servers, such as wireless access points and VPN servers. You configure them as
> RADIUS clients in NPS. Network policies that NPS uses to authorize connection
> requests."
> — Microsoft Learn, *Network Policy Server (NPS) overview*
> https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-top

> "A network access server (NAS) is a device that provides some level of access to a
> larger network. A NAS using a RADIUS infrastructure is also a RADIUS client,
> sending connection requests and accounting messages to a RADIUS server for
> authentication, authorization, and accounting." ... "Client computers, such as
> laptop computers and other computers running client operating systems, are not
> RADIUS clients. RADIUS clients are network access servers - such as wireless access
> points, 802.1X authenticating switches, virtual private network (VPN) servers, and
> dial-up servers - because they use the RADIUS protocol to communicate with RADIUS
> servers such as Network Policy Server (NPS) servers."
> — Microsoft Learn, *RADIUS Clients*
> https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-radius-clients

This is the misconception the video must not create: the laptop is not the RADIUS
client, and the laptop does not send the RADIUS request.

## 9. NPS policy evaluation and the verdict

> "The user credentials are checked and the dial-in properties of the user account
> are obtained by using a secure connection to a domain controller. The connection
> attempt is authorized with both the dial-in properties of the user account and
> network policies. If the connection attempt is both authenticated and authorized,
> the NPS sends an Access-Accept message to the access server. If the connection
> attempt is either not authenticated or not authorized, the NPS sends an
> Access-Reject message to the access server."
> — Microsoft Learn, *Connection Request Processing*
> https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-crp-top

> "RADIUS Access-Request messages are processed or forwarded by NPS only if the
> settings of the incoming message match at least one of the connection request
> policies configured on the NPS." ... "If the settings of an incoming RADIUS
> Access-Request message do not match at least one of the connection request
> policies, an Access-Reject message is sent to the RADIUS client and the user or
> computer attempting to connect to the network is denied access."
> — Microsoft Learn, *Connection Request Policies*
> https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-crp-crpolicies

So: two policy layers (connection request policy, network policy) plus the identity
check against AD, then exactly one of two messages.

> "Access-Request ... Access-Accept ... Access-Reject" — RFC 2865 §4
> https://www.rfc-editor.org/rfc/rfc2865.txt

## 10. The three 802.1X roles

> "Authenticator: An Authenticator is an entity that requires authentication from the
> Supplicant."
> "Authentication Server: An Authentication Server is an entity that provides an
> Authentication Service to an Authenticator. This service verifies, from the
> credentials provided by the Supplicant, the claim of identity made by the
> Supplicant."
> "Supplicant: A Supplicant is an entity that is being authenticated by an
> Authenticator."
> — RFC 3580 §1.2 (IEEE 802.1X RADIUS usage), https://www.rfc-editor.org/rfc/rfc3580.txt

Mapped to this lesson: Supplicant = the Windows laptop; Authenticator = the switch or
access point (which is also the RADIUS client); Authentication Server = NPS.

## Simplifications kept visible

These are deliberate, and the narration/visuals must not claim more than the sources:

1. **One DHCP server, no relay, flat LAN.** Real enterprise traffic crosses a relay
   agent and often a routed VLAN. Skipped; the brief excludes DHCP failover and the
   relay makes no difference to the DORA message order.
2. **The Offer looks like the final configuration.** RFC 2131 makes the Offer
   provisional and the ACK committing; the video shows values appearing at the Offer
   and *locking* at the ACK, and says "an address it is willing to lend".
3. **No DHCPNAK / DECLINE / RELEASE.** Not required and they are failure paths.
4. **DNS is drawn as its own service object.** In practice the DNS zone that holds
   the AD SRV records is very often hosted *on* the domain controllers, and DHCP may
   hand out a DC's own address as the DNS server. The video shows DNS and the Domain
   Controller as separate objects for clarity, and never says they cannot be the same
   machine.
5. **One SRV lookup.** The real DC Locator issues a site-specific query, then an
   A/AAAA lookup, then an LDAP UDP ping to a chosen DC, and caches the result. The
   video shows: query → SRV answer naming a DC → client contacts that DC. It does not
   claim the first answered DC is chosen by weight or priority.
6. **Kerberos with no ticket internals.** As excluded by the brief. The video says
   Kerberos is the protocol Windows uses for domain sign-in and that the account is
   checked in Active Directory; it does not name AS-REQ/TGT/TGS.
7. **NPS as the authenticator's decision point only.** NPS can also act as a RADIUS
   proxy and do accounting (RFC 2865 accounting, NPS docs). Both are out of scope;
   the video shows NPS as the RADIUS server that authenticates and authorizes.
8. **A port that "opens".** 802.1X authorizes a controlled port; on a successful
   Access-Accept the authenticator moves the port to the authorized state. The video
   says "the port opens" as shorthand for that state change.
9. **802.1X and DHCP are sequential, not intertwined.** In reality EAP exchange,
   DHCP and DC location can interleave (e.g. re-authentication). The video presents
   the readable order: authenticate the port, then configure, then find, then sign in.
