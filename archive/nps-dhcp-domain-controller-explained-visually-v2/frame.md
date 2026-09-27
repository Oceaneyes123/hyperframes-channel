# NPS / DHCP / Domain Controller v2 — visual contract

Native 1080x1920, 30 fps. Safe rectangle x=72..936, y=180..1600. Drawn from
`DESIGN.md` v2 and **deliberately not the earlier same-topic build**: that one is a
grid of ~80px Font Awesome glyph tiles over a horizontal timeline rail. This one is a
two-column access stage with large local colored device art, one drawn cabling riser,
and a client configuration plate that carries state across scenes. No tile grid, no
rail, no enclosing card.

Canvas `#0B1020` · surface `#141D35` · ink `#F5F7FF` · muted `#AAB5CC` · rule `#33415F`.
Barlow 850 for headlines, IBM Plex Mono for every label, value and chip.

## Semantic color is the explanation

| Role | Token | Color | Never used for |
| --- | --- | --- | --- |
| Windows client, client traffic | client | `#4DA3FF` | services |
| Access gear (switch, access point) | infrastructure | `#7067E8` | services |
| DHCP service and its traffic | infrastructure | `#7067E8` | the switch in the same frame |
| DNS service, discovery | external | `#4DD9E8` | policy |
| Domain Controller, Active Directory | storage | `#B07CFF` | network services |
| NPS, network access policy | security | `#F06A5F` | the client |
| Delivered / accepted result | success | `#63D69A` | — |
| Refused, provisional, blocked | warning | `#F5B94D` | — |
| Cabling between devices | rule | `#33415F` | — |

Device artwork keeps its own flat Icons8 palette; the semantic color arrives as the
object's glow ellipse and its label, so a device is never recolored between scenes.

## Coordinate table (the only source of geometry)

| Slot | Bounds (x,y,w,h) | Label baseline | Meaning |
| --- | --- | --- | --- |
| `CLIENT` | 72,1180,332,332 | — | Windows laptop, lower left, every stage scene |
| `ACCESS` | 196,760,288,288 | 1096 | switch or access point, centre of the stage |
| `LEFTSVC` | 72,412,288,288 | 744 | the one left-column service/role object a scene needs |
| `SVC_A` | 628,500,308,308 | 864 | primary service, upper right |
| `SVC_B` | 628,1160,240,240 | 1456 | secondary service, lower right |
| `Q1..Q4` | 88/492,470/960,300,300 | 826 / 1316 | four-way comparison (frame 21 only) |
| outcome rows | 590,900 / 984 / 1068,346,68 | — | verdict or result rows, right column |
| legend chips | 72,420 (+72 per token),520,60 | — | a travelling token's message name; `legend_y` per scene |
| plate rows | 72/404,1496/1550,320/440,48 | — | client configuration, four rows |

Headline: **centred on the safe rectangle (x=504, `text-anchor="middle"`)**, first baseline
276, stepped down to 84/80/76/72/68 when the string needs it. A second line sits at
`276 + max(96, 1.22 x size)` so the two em boxes clear the 2px layout tolerance. Labels step down
36/30/26px with length so they stay inside x=936. Every accent and chip box is sized
from the measured text box, never by eye; the widest chip text is 33 characters at
26px mono.

## Routes (drawn once, reused, never re-invented)

`CLIENT` bottom-left → `ACCESS` → centre riser x=560 → service column x=628.

- `CABLE` (238,1180)→(238,1048) — the laptop's link to the access gear.
- `TRUNK` (484,904)→(560,904)→(560,654)→(628,654) — access gear to `SVC_A`.
- `TRUNKB` (484,904)→(560,904)→(560,1280)→(628,1280) — access gear to `SVC_B`.
- `SVCLINK` (628,654)→(560,654)→(560,1280)→(628,1280) — `SVC_A` to `SVC_B` on the
  same riser, so a response retraces the route instead of swapping endpoints.
- `DC_TO_AD` (628,1280)→(560,1280)→(560,536)→(360,536) — controller to directory.
- `DIRECT_BAD` (470,1300)→(800,660) — the client-to-NPS path that frame 15 strikes out.

A return leg reverses along the same polyline. The client never moves. Nothing is
drawn that does not carry a packet, a query or a reply.

## Motion contract

- One paused, seekable GSAP timeline per frame, registered under its own composition
  id; beats are fractions of the scene's measured duration (`const t = f => f * D`).
- A travelling token is a plain 24px circle with a 3px ink outline. Its message name is
  a **static legend chip** in the left band, never a chip riding the token — a moving
  chip used to land on the device artwork.
- Action is always: the token follows the drawn polyline to its real destination, and
  the destination then changes visibly (glow up, plate row appears, port lock swaps).
- Emphasis is an opacity change on an object's glow ellipse. `scale` is never tweened
  on a group carrying a baked transform, and whole-scene fade-ins are not used: every
  frame opens on the state the previous frame ended with.
- No camera moves, no idle pulses, no decorative tunnels.

## Assets

Local only, resolved before sketching. `public/icons8/laptop.png` (Icons8, attribution
in `public/icons8/laptop.source.txt`), the repo's existing `public/icons/switch-lan.svg`,
and five custom flat-palette SVGs authored for this video: `ap-ceiling`, `srv-dhcp`,
`srv-dns`, `srv-dc`, `srv-nps`. Six inline Font Awesome glyphs (sitemap, key, lock,
lock-open, circle-check, circle-xmark) are inlined as `<symbol>` paths so they inherit
the semantic color. gsap is vendored at `public/vendor/gsap.min.js`; no frame loads a
runtime or plays audio — the parent index owns both.

## Divergence from the brief, recorded

the brief named `videos/nps-dhcp-domain-controller-explained-visually`;
the user chose a new sibling folder so the completed earlier build and its 213.77s
render stay untouched.

## Post-approval adjustments

Gate 1 was approved on the centred-headline build. Three implementation-level changes landed
afterwards, none of which alter the approved composition or the required-information coverage:
the `LEFTSVC` slot moved down 20px so a two-line headline cannot touch it; the provisional
`OFFERED -> LEASED` plate swap became a cross-cut state change (a `text` op is not seek-safe
without TextPlugin); and every frame now emits the Font Awesome sprite, without which all inline
glyphs rendered blank while every automated check still passed.
