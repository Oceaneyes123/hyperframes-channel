# Approved script

One takeaway: A VPN creates an encrypted connection from your device to a VPN server. It changes what the local network and destination can see, while shifting some trust to the VPN provider.

Required information (map every point to storyboard scenes):
- Consumer full-tunnel example and implementation/configuration variability: Lines 2–3, 12–13
- Tunnel establishment and selected traffic routing: Lines 2–3
- Encapsulation: original traffic inside traffic addressed to VPN server: Line 4
- Local network/ISP sees VPN endpoint, timing and volume, not protected contents in a correctly operating encrypted tunnel: Line 5
- VPN server receives/forwards; destination generally sees server public IP: Lines 6–7
- Provider trust and variable visibility/retention: Lines 8–9
- Accounts/cookies still identify users: Line 10
- VPN does not replace HTTPS or protect a compromised device: Lines 9 and 11
- Not every app/connection automatically uses tunnel; split tunneling: Line 12
- DNS routing depends on configuration: Line 13

Out of scope: protocol/cipher deep dives, corporate site-to-site VPNs, provider rankings, unsupported privacy promises, promotional intro/outro, legal or security advice.
Measured narration: 322 spoken words across 14 scenes, 130.194 seconds total. `audio_meta.json` is canonical for per-scene timing.
Captions: off. Sound cues: off. BGM: off.

## Line 1 — Hook
**Display:** Who sees the road?
    You turn on a VPN, and your internet traffic takes a new exit. What can everyone along the way still see?

## Line 2 — The example
**Display:** TUNNEL CONNECTED
    First, your device opens an encrypted tunnel to a VPN server. We'll follow one website request through it.

## Line 3 — The route
**Display:** ROUTED TRAFFIC
    The tunnel is ready. Route rules choose what enters it. Here, all internet traffic uses the tunnel—a consumer full-tunnel setup. Other settings vary.

## Line 4 — The wrapper
**Display:** INSIDE → VPN SERVER
    Your website request stays inside an outer packet addressed to the VPN server. That outer packet travels across the local network.

## Line 5 — The local view
**Display:** ENDPOINT · TIME · VOLUME
    Your Wi-Fi and ISP can see that outer connection: the VPN server, when data moves, and roughly how much. If the tunnel works as intended, they can't read the protected traffic inside.

## Line 6 — The exit
**Display:** TUNNEL ENDS HERE
    At the VPN server, that outer packet opens. The server forwards your original request to the website.

## Line 7 — The destination
**Display:** VPN SERVER IP
    From the website's side, this request comes from the VPN server's public IP. That's the new exit for traffic using this route.

## Line 8 — The trust shift
**Display:** TRUST SHIFTS
    Your local network sees less of the protected traffic. But now your VPN provider runs that exit point. Trust has shifted.

## Line 9 — Two locks
**Display:** VPN + HTTPS
    What the provider can observe or keep depends on its service and setup. A VPN doesn't replace HTTPS. HTTPS is a separate lock that can protect page contents from your device to the website, even after the VPN tunnel ends.

## Line 10 — Still recognizable
**Display:** ACCOUNT · COOKIE
    A different exit doesn't hide who you are. Sign in or bring the same cookie, and the website may recognize you.

## Line 11 — The device
**Display:** BEFORE THE TUNNEL
    If a compromised device exposes information before traffic enters the tunnel, the VPN can't hide it. Protection starts at the device.

## Line 12 — Not every route
**Display:** SOME TRAFFIC BYPASSES
    The tunnel may not carry every app. Split tunneling sends chosen connections out over a different route.

## Line 13 — DNS has a route
**Display:** DNS: CONFIGURATION MATTERS
    Even a website lookup needs a route. DNS may go through the VPN, or somewhere else; the settings decide.

## Line 14 — Payoff
**Display:** A NEW EXIT. A NEW TRUST.
    So who sees the road? Your local network sees the VPN connection. The website sees the VPN server's address. The provider sits at the exit. New path, new trust.
