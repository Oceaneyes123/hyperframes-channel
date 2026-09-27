# DHCP Explained Visually — How Your Device Gets an IP Address

**Voice:** Supertonic 3 after Gate 1 approval  
**Voice direction:** Friendly, clear and unhurried. Give each packet handoff room; make D-O-R-A easy to hear.

## Line 1 — A new device arrives

**Timing:** measured in `audio_meta.json`
**Delivery:** Curious.

    Your laptop joins the network. It has no usable assigned IP yet. How does it get the settings it needs?

## Line 2 — Manual setup

**Timing:** measured in `audio_meta.json`
**Delivery:** Practical, lightly brisk.

    Without DHCP, someone could set up each device by hand: an IP address, subnet mask, default gateway, and DNS server. DHCP is a convenient option, not a requirement for every network.

## Line 3 — Meet the roles

**Timing:** measured in `audio_meta.json`
**Delivery:** Reassuring.

    With DHCP, the laptop is the client and a DHCP server offers network settings. The gateway is another role; a router and DHCP server can be separate devices, or one box can do both jobs.

## Line 4 — Discover

**Timing:** measured in `audio_meta.json`
**Delivery:** Open and inquisitive; emphasize broadcast.

    First, Discover. On a usual fresh join, the laptop does not know a DHCP server's address, so it broadcasts a call across the local network: “Is a DHCP server here?”

## Line 5 — Offer

**Timing:** measured in `audio_meta.json`
**Delivery:** Matter-of-fact; stress that this is a proposal.

    The server replies with an offer: this example proposes IP 192.168.1.25, subnet mask 255.255.255.0, gateway 192.168.1.1, DNS 192.168.1.1, and a 24-hour lease. It is not confirmed yet.

## Line 6 — Request

**Timing:** measured in `audio_meta.json`
**Delivery:** Decisive.

    Next, Request. The laptop tells the server it wants to use the offered settings. The offer is still only a proposal while the client asks for it.

## Line 7 — Acknowledge

**Timing:** measured in `audio_meta.json`
**Delivery:** Clear payoff; pause for the change.

    Then the server sends ACK: Acknowledge. That confirms the configuration. Watch the laptop change from no IP to 192.168.1.25, ready to use.

## Line 8 — More than an address

**Timing:** measured in `audio_meta.json`
**Delivery:** Explanatory.

    DHCP can provide more than the address: the subnet mask explains the local network, the gateway is the next stop for other networks, and DNS helps turn names into addresses.

## Line 9 — A lease has a timer

**Timing:** measured in `audio_meta.json`
**Delivery:** Calm.

    The laptop does not own that address forever. DHCP lends it for a lease period. Here the example lease is 24 hours; another network can choose a different duration.

## Line 10 — Renew before expiry

**Timing:** measured in `audio_meta.json`
**Delivery:** Reassuring, with a clear “before.”

    Before the lease expires, the client can ask to renew. If the server agrees, the lease is extended; the same address can continue, but a device is not guaranteed to get the same address every time.

## Line 11 — DORA, at a glance

**Timing:** measured in `audio_meta.json`
**Delivery:** Rhythmic recap; finish warm and confident.

    Discover, Offer, Request, Acknowledge: D-O-R-A. As devices join, DHCP automatically provides the network settings they need, while the router remains a separate job. The laptop is ready; then the phone and tablet join too.
