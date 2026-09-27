# NAT Explained Visually — visual contract (channel v2 portrait)

1080x1920, safe rectangle x=72..936 / y=180..1600. One persistent mental map:
**inside devices on top, the router as the boundary in the middle-left, the
router's NAT table beside it, the Internet at the bottom.** The packet route is a
single vertical line on the left (x=250) from the devices, through the router,
down into the Internet; the table is a callout that never moves once introduced.

Canvas `#0B1020`, surface `#141D35`, ink `#F5F7FF`, muted `#AAB5CC`,
rule `#33415F`, client `#4DA3FF`, infrastructure `#7067E8`, success `#63D69A`,
warning `#F5B94D`, external `#4DD9E8`, security `#F06A5F`.
Barlow 850 for headlines (88px, at most 6 words, at most two lines from y=180).
IBM Plex Mono for every value and label: values 36–40px, table rows 32px,
labels 28–34px uppercase. No narration text on screen.

No enclosing card around a scene. Two real groupings are allowed and are drawn
only when they teach something: the NAT table panel (the router's own ledger)
and, in frame 3, an amber marker that says private addresses stop at the
boundary. Backgrounds may bleed; every essential object stays inside the safe
rectangle.

## Persistent objects

Coordinates are frame pixels, `x,y,width,height`. A scene that shows an object
uses these exact values.

| ID | Asset | Bounds | Role |
| --- | --- | --- | --- |
| `phone` | `public/icons8/phone.png` | 130,340,240,280 | left device, always the first sender (center x=250) |
| `laptop` | `public/icons8/laptop.png` | 560,340,300,280 | right device, second sender (center x=710) |
| `phone-addr` | text mono 34 client | centered x=250, baseline y=676 | `192.168.1.10` |
| `laptop-addr` | text mono 34 client | centered x=710, baseline y=676 | `192.168.1.20` |
| `home-bus` | path, rule, 8px | stubs 250,706→250,748 and 710,706→710,748; horizontal y=748 x=250→710; trunk x=250 y=748→1340 | the home network path |
| `router` | `public/icons8/router.png` | 110,830,280,280 | the boundary object (center x=250) |
| `nat-panel` | rect, stroke rule 3px | 430,830,490,350 | the NAT table; a 40px connector from 390,970 to 430,970 attaches it to the router |
| `router-nat-label` | text mono 32 infrastructure | x=112, baseline y=810 | `NAT`, only in frame 15; the router is otherwise left unlabelled so nothing competes with the packet's port chip |
| `nat-title` | `public/icons/table-cells.svg` 36px + text mono 34 ink | glyph 430,846,36,36; text x=482, baseline y=880 | `NAT TABLE` |
| `nat-slot-1` / `nat-slot-2` | rect, stroke rule 2px, dashed | 446,900,428,110 / 446,1020,428,110 | empty state before a mapping exists |
| `nat-row-1` | two text lines mono 32 | x=452 baseline y=942 (inside, client) and x=484 baseline y=986 (outside, external) | `192.168.1.10:51000` → `203.0.113.7:40001` |
| `nat-row-2` | two text lines mono 32 | x=452 baseline y=1062 and x=484 baseline y=1106 | `192.168.1.20:52000` → `203.0.113.7:40002` |
| `globe` | `public/icons8/globe.png` | 140,1330,220,220 | the Internet (center x=250) |
| `globe-label` | text mono 34 external | centered x=250, baseline y=1596 | `INTERNET` |
| `server` | `public/icons8/server.png` | 630,1330,220,220 | the website being visited (center x=740) |
| `server-label` | text mono 30 muted | centered x=740, baseline y=1596 | `WEBSITE` |
| `outside-hop` | path, rule, 8px | y=1440, x=360→630 (visible segment between the two artworks) | the last hop |
| `public-chip` | rect 354,1192,400,68 + rule 8px connector 250,1226→354,1226 | label mono 28 muted + value mono 36 external | `PUBLIC` `203.0.113.7` |
| `packet` | circle r=24, client fill, ink stroke 3px | travels `home-bus` then `outside-hop` | the moving token |
| `packet-port` | attached chip, mono 30 | x = packet x + 36, vertically centered | the port of the packet's current source or destination (`51000`, `40001`) |

At the boundary the packet rests just below the router (x=250, y=1120) so its port chip
clears both the router artwork and the table panel; delivered states put it next to the
device it reached.

The amber boundary in frame 3 is a dashed warning line at y=1180 across x=72..936, with a
72px warning glyph beside the stopped packet.

`public-chip` appears from frame 4 onward and never moves, with one deliberate exception:
frame 14 omits it so the two comparison labels (`MATCHES A TABLE` at x=430/baseline 1225,
`APPLIES RULES` at x=430/baseline 1285) sit alone under the table and the shield. The NAT table appears
from frame 5 onward (empty slots first, rows as mappings are created). Frames 1–4
use the right-hand region for their own object and must not imply a table there.

## Accent geometry

Address highlight boxes are sized from the measured label box, never by eye: a
12-character mono-32 value is 230.4px wide — 134.8..365.2 centred on x=250 and
594.8..825.2 centred on x=710 — with its box at y=643..685. Add about 8px of
padding (x=126 w=248 / x=586 w=248, y=634 h=58) and keep any two-label set inside
the safe width (x=126 w=712 covers both).

Table-row accents are sized the same way. A row's outside value
`203.0.113.7:40001` starts at x=520 and is 326.4px long, so an accent box for it
is x=512, w=344, h=52, on that line's own band (y=944 for row 1, y=1064 for row
2). The box wraps the whole value — never a slice of it, and never just the port
digits: that partial ring is the defect this rule exists to prevent.

## Identity rules

- `phone` always sends first and always receives the first reply; `laptop` never
  swaps position with it. A reply reverses the token's travel, not the layout.
- The translated value is a colour change on the same object: blue inside,
  external cyan outside (`203.0.113.7`), success mint only for "delivered".
- Two identical device icons mean "two different devices"; never replace the
  pair with one device and a sentence.
- The table keeps row order: row 1 is the phone's mapping, row 2 the laptop's.
  A row is never re-drawn in a new position; it appears once and stays.

## Motion rules

One paused GSAP timeline per frame, registered under the frame's exact
composition id; every tween is seekable. `/51000` and `/40001` style chips ride
with the packet. Nothing fades the whole scene in: the situation is visible at
local time 0. No idle pulsing, no random motion, no timers, no loops. A
meaningful visual change happens every few seconds; no unexplained static hold
over 3s. Frames are 1080x1920 with an explicit root, a full-duration background
clip, and no audio of their own — the parent index mounts the per-scene WAVs.
