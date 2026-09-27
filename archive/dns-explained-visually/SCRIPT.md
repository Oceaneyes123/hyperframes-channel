# SCRIPT — DNS Explained Visually

**Voice:** Supertonic 3 (repository production path)
**Voice direction:** Friendly, precise, unhurried. Let each referral feel like a useful handoff.

---

## Line 1 — Hook (Frame 1)

**Time:** 0.0 – 6.0s
**Delivery:** Curious.

    You type google.com. But how does your computer know where google.com is?

## Line 2 — Names need addresses (Frame 2)

**Time:** 6.0 – 14.0s
**Delivery:** Clear.

    People remember names. Computers communicate with IP addresses — numerical network addresses. So before a browser can connect, it needs a translation.

## Line 3 — DNS overview (Frame 3)

**Time:** 14.0 – 22.0s
**Delivery:** Reassuring.

    DNS is that translation system: like a contact list, it helps turn google.com into an address such as 142.x.x.x.

## Line 4 — Ask the resolver (Frame 4)

**Time:** 22.0 – 31.0s
**Delivery:** Matter-of-fact.

    Your computer sends the question to a recursive DNS resolver — often run by your ISP, or a public DNS provider.

## Line 5 — Cache first (Frame 5)

**Time:** 31.0 – 40.0s
**Delivery:** Slightly quicker on “cache hit.”

    First, the resolver checks its cache. A cache hit sends the saved answer straight back. A cache miss starts the full lookup.

## Line 6 — Root referral (Frame 6)

**Time:** 40.0 – 50.0s
**Delivery:** Emphasize “not the final IP.”

    On a miss, the resolver asks the root. The root does not know the final IP. It says: for google.com, ask the .com servers.

## Line 7 — TLD referral (Frame 7)

**Time:** 50.0 – 60.0s
**Delivery:** Steady.

    The .com TLD servers do not normally return the website address either. They point the resolver to the authoritative nameserver for google.com.

## Line 8 — Authoritative answer (Frame 8)

**Time:** 60.0 – 72.0s
**Delivery:** Payoff.

    That authoritative server holds the DNS record. It returns the answer: google.com maps to 142.x.x.x.

## Line 9 — Browser handoff (Frame 9)

**Time:** 72.0 – 81.0s
**Delivery:** Distinguish the two jobs.

    The answer travels back through the resolver to your computer. Now the browser can connect to that IP. DNS found the destination; the website connection happens next.

## Line 10 — Full lookup (Frame 10)

**Time:** 81.0 – 93.0s
**Delivery:** Rhythmic recap.

    The uncached path is simple: user, resolver, root, .com, authoritative server, IP address — then back to the user.

## Line 11 — Cache and landing (Frame 11)

**Time:** 93.0 – 105.0s
**Delivery:** Confident close.

    The resolver saves that answer for a while, so later requests can often skip the long trip. DNS turns human-friendly names into the IP addresses computers use to communicate.
