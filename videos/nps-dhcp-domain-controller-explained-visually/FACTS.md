# Fact sheet

Research pass: 2026-09-19. Authoritative sources are Microsoft Learn pages.

1. Microsoft describes IPv4 DHCP as Discover, Offer, Request, and Acknowledgement (DORA). DHCP provides an address lease, and common scope options include the subnet mask, router/default gateway, and DNS servers.
2. Active Directory publishes DNS SRV locator records. A client can query a record such as `_ldap._tcp.dc._msdcs.corp.example` to locate candidate domain controllers, then resolve the returned host to an IP address and contact the candidate.
3. DNS is therefore not just a general web lookup in an AD environment: the client needs the domain's DNS service to discover AD services through locator records.
4. Kerberos is the common Windows domain authentication protocol. The KDC runs on domain controllers and uses the Active Directory database; this explainer names Kerberos without showing ticket internals.
5. NPS is Microsoft's RADIUS server implementation. RADIUS clients are network access servers such as wireless access points and authenticating switches; client computers are not RADIUS clients.
6. NPS evaluates connection requests with network policies, performs authentication and authorization as a RADIUS server, and can use AD DS identity information. The result is an access decision such as Access-Accept or Access-Reject.
7. In an 802.1X example, the access point or switch is the authenticator/network access server. The device receives normal network access only after the network authentication succeeds; DHCP then supplies ordinary network configuration.

## Sources

- DHCP overview and options: https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server
- DHCP DORA: https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue
- AD DNS SRV records: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/verify-srv-dns-records-have-been-created
- Domain Controller location: https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adod/3078ef00-5bfc-4808-be80-c58b9c6cbb76
- Kerberos overview: https://learn.microsoft.com/windows-server/security/kerberos/kerberos-authentication-overview
- NPS overview and RADIUS roles: https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-top
- NPS network policies: https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-np-overview
- RADIUS client roles: https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-radius-clients-configure
