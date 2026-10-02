# How does a firewall decide what to block?

One takeaway: firewall permission depends on configured rules and connection state,
not a universal recognition of bad traffic.

Required information: inspection (3), rule order (4-5), state/replies (6), default
behavior (7), blocked traffic (8), capabilities/encryption (9), harmful allowed
traffic (10), legitimate blocked traffic (11), mechanism payoff (12).

Out of scope: configuration tutorials, vendors, inspection internals, routing/NAT,
full handshakes, promotional intro/outro. Language: English. Captions/SFX/BGM: off.
Duration revision: under 180s requested. 332 spoken words; 170s (2:50) conservative
planning estimate. Final timing must be measured from new WAVs after Gate 1 approval.
All required coverage and all 12 scenes are retained; no accelerated narration.
Display strings below are mechanism labels, not captions or scene titles.

## Line 1 - Two arrivals
**Display:** DEVICE; SITE; FIREWALL; ALLOWED; BLOCKED.
**Visual meaning / change:** a reply passes the boundary; an unrelated incoming attempt stops there. Present the question; reveal the causal checks later.
**Target:** 9s (estimated).

    A website's reply passes your firewall. Another incoming connection gets blocked. Both came from outside. Why the difference?

## Line 2 - Follow the browser
**Display:** DEVICE; SITE; FIREWALL; NEW.
**Visual meaning / change:** rewind to a fresh browser connection-opening packet arriving at the same boundary.
**Target:** 11s (estimated).

    Follow your browser connecting to a website. Traffic travels in small pieces called packets. This stateful firewall remembers connections.

## Line 3 - Available evidence
**Display:** FROM; TO; DEVICE:51514; SITE:443; PROTOCOL; TCP; OUTGOING.
**Visual meaning / change:** conceptual packet cutaway exposes metadata; the actual payload remains distinct.
**Target:** 18s (estimated).

    At arrival, it checks source and destination addresses, protocol, meaning communication method, and ports: numbers identifying the conversation's endpoints. It also checks the arrival side. This packet is going out to web port four forty-three.

## Line 4 - Rules for a fresh attempt
**Display:** STATE; NEW; RULES; LISTED; OUT / 443; BLOCK; ALLOW.
**Visual meaning / change:** state lookup misses; packet evidence visits the ordered policy strip; the second rule matches.
**Target:** 15s (estimated).

    It's new, with no existing state. Our example checks rules top to bottom: block listed destination addresses. This site isn't listed. Next: allow outgoing web connections. That matches.

## Line 5 - Why order matters
**Display:** LISTED; OUT / 443; BLOCK; ALLOW; FIRST MATCH.
**Visual meaning / change:** a fresh listed-destination attempt blocks; reverse the two overlapping rules and repeat the same evidence; it passes. Restore order afterward.
**Target:** 14s (estimated).

    Here, the first matching rule decides. Move the broad allowance above the block, and listed destinations pass before that block is checked. Firewalls can use different priorities.

## Line 6 - An expected reply
**Display:** STATE; DEVICE:51514; SITE:443; TCP; MATCH; ALLOWED.
**Visual meaning / change:** allowed attempt crosses; its connection record persists; handshake progress is elided; reply reverses endpoints, matches valid state, and crosses back.
**Target:** 19s (estimated).

    The allowed connection gets a temporary record of addresses, ports, protocol, and progress, updated as it develops. The website's reply has reversed endpoints and expected connection state, so it passes. That permission covers this conversation, not everyone outside.

## Line 7 - An unsolicited attempt
**Display:** OTHER:4444; DEVICE:51514; NO MATCH; DEFAULT; BLOCK.
**Visual meaning / change:** unrelated opening attempt cannot fit the stored record; no incoming allow applies; default block closes the gate.
**Target:** 18s (estimated).

    Another computer starts an incoming connection. It matches neither the record nor an allow rule. Our default is block: the fallback for unmatched traffic. Different rules or defaults could allow it; unsolicited doesn't automatically mean blocked.

## Line 8 - Drop or reject
**Display:** DROP; REJECT; LOG.
**Visual meaning / change:** dropped packet disappears at the boundary with no return; a separate reject demonstration creates a distinct refusal travelling only to the sender; optional log receives a record.
**Target:** 17s (estimated).

    Blocked traffic isn't forwarded. A silent drop discards the packet without replying; the sender may retry, then time out. A reject discards it and sends a refusal. Logging can record the decision if enabled.

## Line 9 - Different inspection capabilities
**Display:** RULES; STATE; CONTENT; HTTPS; DECRYPT.
**Display review:** DECRYPT identifies the additional capability mentioned in this line; the illustrated HTTPS wrapper stays closed. Production metadata only; approved narration is unchanged.
**Visual meaning / change:** compare inspection scopes at the same boundary; an opaque locked content wrapper stays closed for the illustrated firewall.
**Target:** 18s (estimated).

    Capabilities vary. Basic packet filters don't remember connections; stateful firewalls do. Some also examine application information or content. Ordinary network firewalls can't read encrypted HTTPS contents without additional decryption capability and configuration.

## Line 10 - Permission is not safety
**Display:** ALLOWED; HTTPS.
**Visual meaning / change:** matching permitted encrypted content passes the unchanged policy; the hazard becomes visible only after the device receives/decrypts it.
**Target:** 9s (estimated).

    A dangerous download can therefore pass inside an allowed web connection, unseen by this firewall. Permission doesn't guarantee safety.

## Line 11 - Legitimate traffic can fail
**Display:** APP; 8443; OUT / 443; DEFAULT; BLOCKED.
**Visual meaning / change:** new legitimate app attempt has no state; 8443 fails the 443-only allowance; default blocks it and the app's delivery remains incomplete.
**Target:** 10s (estimated).

    A legitimate app can fail too: its new connection needs a port our web-only rule doesn't allow, so default block stops it.

## Line 12 - Payoff
**Display:** RULES; STATE; ALLOW; BLOCK.
**Visual meaning / change:** replay both arrival paths with visible state/rule comparison: matched reply crosses; unmatched incoming attempt terminates at default block.
**Target:** 12s (estimated).

    A firewall doesn't simply recognize bad traffic. It compares available information with configured rules and, when applicable, connection state. The default handles unmatched traffic.
