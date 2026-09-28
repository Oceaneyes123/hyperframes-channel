---
format: 1080x1920
fps: 30
design_version: "2.0.0"
motion_version: "1.0.0"
canvas: "#0B1020"
surface: "#141D35"
ink: "#F5F7FF"
muted: "#AAB5CC"
rule: "#33415F"
client: "#4DA3FF"
infrastructure: "#7067E8"
success: "#63D69A"
warning: "#F5B94D"
external: "#4DD9E8"
storage: "#B07CFF"
security: "#F06A5F"
display_font: "var(--hf-display)"
mono_font: "var(--hf-mono)"
safe_zone: {left: 72, right: 144, top: 180, bottom: 320}
---

# Persistent geometry

One visual world follows a device's traffic through a local network, an encrypted tunnel, a VPN server, and a destination. Keep identity and route meaning stable when the camera reframes.

| ID | Asset | Native bounds (x,y,w,h) | Semantic role | Notes |
| --- | --- | --- | --- | --- |
| `device` | `public/icons8/laptop.png` or `smartphone.png` | `(96,650,300,300)` | client / blue | Same device identity in every scene. |
| `local-router` | `public/icons8/router.png` | `(408,650,264,264)` | local network / client | The nearby network hop; do not imply it is always the ISP. |
| `vpn-endpoint` | `public/icons8/server.png` | `(642,650,276,276)` | VPN infrastructure / indigo | Same server before and after tunnel termination. |
| `destination` | `public/icons8/globe.png` | `(660,1170,260,260)` | external destination / cyan | Site endpoint; route label and response inherit this identity. |
| `protected-packet` | simple rounded rectangle with inner packet glyph | `(330,1020,420,144)` | encrypted tunnel / security | Nested packet demonstrates encapsulation; keep inner destination intact. |
| `https-lock` | `public/icons8/lock.png` | `(744,1050,132,132)` | HTTPS / security | Separate application-to-site lock, distinct from VPN tunnel. |
| `identity-cookie` | `public/icons8/cookies.png` | `(720,1032,160,160)` | site recognition / external | Appears with signed-in account, never as a VPN effect. |

Routes are explicit SVG paths between icon centers, never through display labels. Tunnel color is security red-orange while active; the outer route/endpoints stay visibly addressable. Use only the current scene's necessary objects, 2–5 meaningful objects, and inherited poses at cuts. Headline ≤6 words; labels 1–4 words; target ~16 visible words per scene.

Typography, palette, icon size and spacing inherit `DESIGN.md` and `channel/motion.css`. No Arial override. New compositions opt into `channel/motion.js` v1 with paused GSAP, persistent state, explicit root-scoped selectors, arc-length SVG routes and audio-aligned named cues after WAV generation.

