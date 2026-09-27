# NPS / DHCP / Domain Controller — frame contract

1080x1920 portrait, safe x=72..936/y=180..1600. Canvas `#0B1020`; surface `#141D35`; ink `#F5F7FF`; muted `#AAB5CC`; rule `#33415F`. Client blue `#4DA3FF`; infrastructure indigo `#7067E8`; success `#63D69A`; warning `#F5B94D`; external/network cyan `#4DD9E8`; storage violet `#B07CFF`; security red-orange `#F06A5F`.

Use Barlow/Arial for headlines and IBM Plex Mono for technical values. Headline 72–96px, labels 36px, values 40px. Primary icons are 280–360px where space allows. No enclosing card by default; only draw a boundary for the real 802.1X trust/access zone or the final flow lane. Keep 2–5 meaningful objects per frame and about 16 visible words.

Persistent spatial identity: Windows laptop lower-left or left; AP/switch center; service servers upper-right. DHCP server is indigo infrastructure, DNS is cyan discovery, NPS is security red-orange, Domain Controller is violet directory/storage, successful access is green, rejected access is amber/red. Use vertical source → process → destination zones and keep route endpoints stable across adjacent frames.

Assets are local under `public/icons/`: laptop, network-wired, wifi, server, shield-halved, user, key, database, diagram-project, circle-check, circle-xmark, arrow-down, arrow-up, globe. Use actual icon artwork at the sketch gate; do not use emoji or placeholder rectangles for primary objects.

Animation contract for later build: one paused seekable timeline per frame, action is always a packet/query/decision traveling to its actual destination with a visible consequence. Shared objects inherit their previous state at local time zero. Mount one unique scene-local narration WAV after approval; captions, SFX, and BGM remain off.
