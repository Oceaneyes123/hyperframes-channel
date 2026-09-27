# DHCP — persistent visual contract

Canvas: 1080×1920 at 30 fps. Keep essential objects in x=72..936/y=180..1600. Use `DESIGN.md` v2 tokens: canvas #0B1020, surface #141D35, ink #F5F7FF, muted #AAB5CC, client #4DA3FF, infrastructure #7067E8, success #63D69A, warning #F5B94D, external #4DD9E8. Use bold sans-serif headings and monospace addresses.

## Persistent DORA diagram

- `dhcp-client`: laptop hero, center x=540, y=470, visual bounds 220×220 (use the approved local Icons8 laptop asset); persistent blue identity.
- `dhcp-server`: custom local rack illustration, center x=540, y=1370, visual bounds 250×230; persistent indigo identity and “DHCP SERVER” label.
- `router-gateway`: local router asset, center x=825, y=890, visual bounds 160×135; persistent indigo role label “GATEWAY”. Keep it separate from the DHCP server and outside the DORA packet route.
- `lan-route`: x=540 from y=650 to y=1240, width 8, muted at rest. Packet begins at the sender edge, travels only on this route, and resolves at the receiving device.
- `packet`: 30px circle with 1–3 word protocol badge; blue for client requests, indigo for server offer, green for ACK/confirmed state.
- `client-state`: “NO IP” on the laptop before ACK; only the ACK scene changes it to “192.168.1.25 ✓”.
- `offer-config`: five rows, IP / SUBNET / GATEWAY / DNS / LEASE, with example values. Amber “OFFER” / “NOT CONFIRMED” state persists until ACK.

## Sketch geometry and continuity

Headlines start at y=250. Main devices stay in the same positions through Discover, Offer, Request and ACK; scene changes must not reset the sender, receiver, gateway or route. Do not show a direct, pre-known server address during Discover. Broadcast rings expand around the LAN and reach the server. Offer and ACK travel back up; Request travels down. At ACK receipt, replace the “NO IP” chip with the confirmed address and activate the laptop's network line.

## Final constellation

Keep the server at the lower edge and router separate. Laptop, phone and tablet use three example leases shown with compact `.25`, `.26`, `.27` suffixes; label the addresses as examples. A thin blue LAN path links the devices. A short D-O-R-A trace recaps the four known packet moves without adding another concept.
