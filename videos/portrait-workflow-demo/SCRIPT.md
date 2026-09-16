# DNS lookup demo draft (unapproved)

## Line 1 — Hook
**Display:** Where is example.com?
    When you type a site name, your computer still needs an IP address before it can contact that site.
## Line 2 — Ask
**Display:** Ask DNS
    It sends a name lookup to a DNS resolver, a service built to find addresses for names.
## Line 3 — Translate
**Display:** Name → address
    For this example, the resolver returns 192.0.2.10.
## Line 4 — Answer
**Display:** Answer returns
    The answer travels back to your computer, which can now send the real request to that address.
## Line 5 — Cache
**Display:** Cache hit
    Next time, while that cached answer is still valid, the resolver can answer nearby without asking upstream again.
## Line 6 — Remember
**Display:** Name in. Address out.
    Remember the model: a name goes in, an IP address comes out, and that address tells the request where to go.
