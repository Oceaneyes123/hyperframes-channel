# DNS fact sheet

- DNS maps human-readable domain names to IP addresses; browsers use the resulting address to reach Internet resources.
- A recursive resolver can answer from cache; an uncached resolution typically asks root, then the relevant TLD, then an authoritative nameserver.
- Root nameservers provide a referral to the applicable TLD, not the final website address. A TLD referral identifies the domain's authoritative nameserver.
- The authoritative nameserver returns the requested DNS record. The resolver then replies to the client.
- Cached records can avoid upstream queries until their TTL expires. The sequence shown is an uncached teaching model, not every request.
- DNS resolution precedes the website request; it does not itself establish HTTP, TLS, or the page connection.
- Server-role labels represent distributed services, not one physical server each; the root system has many instances worldwide.

Sources: [Cloudflare — What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/); [Cloudflare — DNS server types](https://www.cloudflare.com/learning/dns/dns-server-types/); [IANA — Root Servers](https://www.iana.org/domains/root/servers).
