# Sourced facts

Research checked 2026-10-01. Original educational wording; sources are not narration.

| ID | Claim and qualification | Source | Script scenes |
| --- | --- | --- | --- |
| F1 | Packet filters can use source/destination addresses, ports, protocol, interface and direction. Ports identify numbered communication endpoints, not whether content is safe. | S1 section 2.1.1, printed pp. 2-2 to 2-3 | 2, 3 |
| F2 | Stateful filtering retains connection information and can admit matching return traffic. A matching address alone is insufficient; protocol, ports and valid state matter. States are temporary. | S2 Stateful Filtering; S3 opening and Idle connection tracking timeout | 1, 4, 6, 7 |
| F3 | First-match processing is a chosen example, supported by ordinary pfSense interface rules. Other engines have different evaluation orders. An earlier broad match can prevent a later exception taking effect. | S2 Rule Processing Order; S4 Default action order and Strict evaluation order | 4, 5 |
| F4 | Unmatched traffic follows default behavior. Default block is our example, not universal; defaults and rule priorities depend on the engine/policy. | S2 Default Deny; S4 Default actions | 7, 12 |
| F5 | A drop discards traffic; a reject also sends an appropriate refusal. Both stop forwarding. Refusal format/support depends on protocol and implementation. Logging is configurable. | S2 Block vs. Reject; S5 Standard rules and Suricata compatible strings | 8 |
| F6 | Stateless filters, stateful filters and application-aware firewalls offer different inspection capabilities. Encrypted application data is unreadable without suitable decryption capability/access. | S1 sections 2.1.1 to 2.1.4 and 2.3 | 9 |
| F7 | A permitted flow may carry harmful content beyond the chosen firewall's inspection. A legitimate flow may fail policy criteria. These are consequences of F1-F6, not claims that every firewall behaves identically. | S1 section 2.3; S4 default/order mechanics | 10, 11, 12 |

## Sources

- S1: [NIST SP 800-41 Rev. 1, Guidelines on Firewalls and Firewall Policy](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf). September 2009; foundational mechanism reference, not a current-product feature inventory.
- S2: [Netgate, Firewall Fundamentals](https://docs.netgate.com/pfsense/en/latest/firewall/fundamentals.html). Implementation evidence only; no product name or recommendation in narration.
- S3: [AWS, EC2 security group connection tracking](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html). Corroborates tracked return traffic and expiry; security groups are not the illustrated ordered deny/allow ruleset.
- S4: [AWS, Managing evaluation order for Suricata compatible rules](https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html). Supports explicit qualification that order/default behavior varies.
- S5: [AWS, Defining rule actions](https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-action.html). Supports drop/reject/logging distinctions; do not universalize its TCP-only reject implementation.

## Deliberate example assumptions

One routed stateful firewall; traffic traverses it both ways. Address translation,
routing, name lookup and full connection/encryption handshakes are outside the
decision scope. They are neither attributed to the firewall nor denied to exist.

Opening packet: DEVICE:51514 to SITE:443, TCP. SITE is not on the blocked-address
list. TCP is a communication protocol; the script calls it a communication method.
443 is a typical encrypted-web service port, not proof of HTTPS or harmlessness.
51514 is an illustrative browser-side port. Labels substitute for addresses to
avoid asking beginners to read unnecessary IP numbers.

Example rules for new connections: first block listed destination addresses;
then allow outgoing TCP to web port 443; otherwise block. There is no incoming
allow rule. The order demonstration uses a separate fresh attempt to a LISTED
destination, initially blocked, then allowed when the broad outgoing rule is
moved first. Restore the original rule order before following the main reply.

Matching reply: SITE:443 to DEVICE:51514 with valid tracked state. A separate
OTHER:4444 to DEVICE:51514 opening attempt has no matching state and no allow rule.
No state match does not intrinsically mean block: rules/default still decide.
The reply route includes omitted handshake progress before the web reply.

Harmful-content example: a later permitted encrypted web download. A hidden hazard
is revealed only at the device after arrival, never recognized by this firewall.
Legitimate-block example: a fresh outgoing app connection to port 8443; the example
443-only allowance misses, so default block applies. No connection state exists
for that fresh attempt. Neither port nor outside origin determines moral intent.

## Platform compatibility, separate from editorial completeness

Revised measured preview: 170.179048s (2:50.179), portrait 9:16. All 332 approved
narration words and 12 scenes are retained. The original 215.055782s baseline
is archived. MP4 export is unauthorized and unverified.

- YouTube Shorts: [YouTube's three-minute Shorts guidance](https://support.google.com/youtube/answer/15424877?hl=en) classifies square/vertical uploads up to 3 minutes as Shorts. The old preview exceeds that by 35.056s. The revised complete preview is 9.820952s below the 180s limit, so it is Shorts-length compatible. Export duration, format and upload eligibility remain unverified. No required information is removed.
- Facebook: [Meta's video-to-Reels announcement](https://about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/) says the updated Reels flow has no length or format restrictions. Account rollout/upload path must be checked before publication; none is being tested here.
- Instagram: the [official record-a-Reel help page](https://help.instagram.com/225190788256708) was inaccessible and its Facebook mirror redirected to login during research. Current upload and recommendation limits are unverified. Do not claim eligibility; confirm against the intended account after measuring the complete export. The complete explanation is being tightened in place; account eligibility remains unverified.
