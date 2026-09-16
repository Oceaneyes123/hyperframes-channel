---
brand: "HyperFrames Channel"
version: "1.0.0"
format: "1920x1080"
colors:
  canvas: "#0B0F14"
  surface: "#101C29"
  surfaceLift: "#193F66"
  ink: "#F5F7FA"
  muted: "#AAB7C4"
  rule: "#2A3A4A"
  request: "#59A8FF"
  response: "#71D7B2"
  warning: "#F6B450"
  emphasis: "#E85D26"
typography:
  display: "Barlow, Arial, sans-serif"
  mono: "IBM Plex Mono, ui-monospace, monospace"
spacing:
  unit: "24px"
  frameInset: "96px"
components:
  corners: "sharp; browser chrome and circular nodes are the only exceptions"
  borders: "2px for active diagram objects; 1px for quiet structure"
---

# HyperFrames Channel Design System

This is the permanent visual identity for this channel's technical explainers. It should make an invisible system feel physical, traceable, and easy to remember: a viewer follows a request, sees who handles it, and understands what comes back.

Use these tokens and rules for every new channel composition. A project-specific `frame.md` may refine them, but may not quietly replace the channel's readability, diagram, or motion rules.

## Brand

Calm technical confidence, not sci-fi spectacle. The work should feel like a precise field manual brought to life: dark, spacious, high-contrast, and purposeful. Explain one causal chain at a time. Make the active step unmistakable; keep everything else as supporting context.

The visual language is diagram-first. Text names the action, but packets, nodes, paths, and state changes carry the explanation.

## Typography

Use Barlow at 800–900 for large, lowercase display statements. It is a graphic shape as much as a headline. Use IBM Plex Mono at 500 for labels, protocols, addresses, record values, packet payloads, timestamps, and route metadata.

- Display: 96–154px, line-height .86–.96, tracking −.04em to −.06em.
- Section title: 56–84px, line-height .95.
- Body/explanation: 30–42px, line-height 1.2–1.35.
- Diagram labels: 20–28px, uppercase, tracking .12em–.16em.
- Payload/code: 24–34px, mono, never smaller than needed to read in a 1080p frame.

If the intended font is not locally available or vendored, use the declared fallback; never depend on a remote font fetch during render.

## Colors

| Role | Token | Use |
| --- | --- | --- |
| Canvas | `#0B0F14` | Default full-frame background; never pure black. |
| Surface | `#101C29` | Browser, client, server, packet, and panel fills. |
| Surface lift | `#193F66` | Focused area, localized glow, selected node background. |
| Ink | `#F5F7FA` | Headline and essential labels. |
| Muted | `#AAB7C4` | Secondary labels and inactive state. |
| Rule | `#2A3A4A` | Grids, rails, quiet borders, and inactive connections. |
| Request | `#59A8FF` | Outbound query, forward movement, and active client intent. |
| Response | `#71D7B2` | Returned answer, success, cache hit, and confirmed state. |
| Warning | `#F6B450` | Referral, delay, miss, or attention—not failure. |
| Emphasis | `#E85D26` | One exceptional action or HTTP/browser callout; never a second default accent. |

Use one active signal color per beat. A request/response exchange is the explicit exception: blue leaves, mint returns. Do not introduce arbitrary scene-specific colors, cyan/purple neon, or gradient text.

## Backgrounds

Start with the canvas token, then add two to five quiet, meaningful layers: a topology grid, ghost protocol word, localized radial node glow, clipped route rail, or faint coordinate marks. These layers establish depth without competing with the active packet.

Avoid full-screen linear gradients, generic star fields, glassmorphism, and decorative lines with no endpoints. A background may breathe or drift subtly, but it must stay subordinate to the diagram.

## Networking Diagram Conventions

Every diagram answers three questions at a glance:

1. Who is acting now?
2. Where is the message going?
3. What changed because it arrived?

Place the active path on a readable left-to-right or outward-and-return route. Keep inactive nodes muted. Name a line's source, destination, and purpose; remove any connector that cannot do all three.

### Server design

Servers are sharp rectangular racks: `2px` active border, two or three horizontal slot rules, an uppercase mono role label, and one value or state inside. Use a stable silhouette for a server across the whole video; change its border, payload, or glow to show state, not its shape.

### Client design

Clients are restrained browser or device surfaces: a recognisable top chrome, a single address or action field, and no faux product UI. Browser chrome may use small rounded corners; its content panels remain sharp. The active client emits request blue.

### Packet design

A packet is a compact sharp rectangle, not a floating pill. Include a mono label such as `A?`, `GET /`, `DNS QUERY`, or `ANSWER`, plus a small directional marker only when the route itself does not establish direction. Packets move from a real sender to a real receiver and briefly settle on arrival.

### Router design

Routers are small diamond or circular junctions with four visible ports. Keep them smaller than clients and servers. Their job is routing, not decoration: use them only where a path branches, changes network, or needs a decision point.

### Database design

Databases use a simple stacked-cylinder silhouette with two horizontal ellipses or rack layers. A cache is the same family at smaller scale, with a `CACHE` label and a response-green hit state. Do not use generic cloud icons for storage.

## Connection Lines

Use `2–4px` square-ended lines. Quiet topology is `rule`; active routes inherit the packet's signal color. Prefer orthogonal or deliberate shallow-diagonal paths. Keep line crossings rare; when unavoidable, show a clear bridge, gap, or level change.

Lines animate as a draw from source to destination. A completed route holds briefly so the viewer can read it. A line must terminate at a node, payload, or named state—never in empty space.

## DNS Request and Response Styling

| Exchange | Appearance | Motion |
| --- | --- | --- |
| Recursive query | Request-blue packet and solid blue route | Leaves client/resolver, draws toward next authority. |
| Referral | Warning-amber label or chip on a muted route | Arrives, points to the next named authority, then yields. |
| Authoritative answer | Response-mint packet and solid mint return route | Resolves at the authority, returns along the visible chain. |
| Cache hit | Small response-mint packet with a short direct route | Returns quickly; upstream nodes remain dim. |
| Cache miss | Request-blue path continues beyond cache | The cache dims and the next lookup node becomes active. |

The response must visually retrace or clearly answer the request. Never use the same color and direction treatment for both; the viewer should understand the return path with sound off.

## Animation Principles

Build every scene in three phases: build (0–30%), breathe (30–70%), resolve (70–100%). Start the first motion after a `0.1–0.3s` beat; do not dump the full diagram at frame zero.

- Animate hierarchy: active packet or node first, its route second, labels last.
- Entrances use `*.out`; exits use `*.in`; repositioning uses `*.inOut`.
- Use 0.15–0.3s for signal hits, 0.3–0.6s for ordinary entrances, and 0.5–0.8s for meaningful spatial moves.
- Overlap related entries, but keep a stagger sequence below 500ms.
- Give each scene one seekable ambient motion at most: a node glow, route pulse, grid drift, or cache breath. Stillness after an answer is a deliberate payoff.
- Animate transforms with `x`, `y`, `scale`, and `rotation`; keep all motion in the registered paused timeline.

## Transition Principles

Transitions express the relationship between beats.

- Hard cut for a question, correction, or change of system layer.
- Crossfade for continuation within the same mental model.
- Push/slide in the packet's direction when the request advances to another node.
- Zoom-through only when a viewer is moving into a node, record, or browser surface.
- The outgoing scene must make space for the incoming scene; do not stack unrelated diagrams during a transition.

Use one transition language per sequence. A scene change should last about 0.35–0.6s and must preserve the active path or establish the next one immediately.

## Spacing and Scene Density

Use a 24px base unit. Keep primary content inside a 96px frame inset; use 48px for related groups and 72–96px between diagram zones. Let diagrams occupy 60–80% of the frame width when they carry the main idea.

Each scene needs three layers: a meaningful background treatment, a dominant diagram or typographic focal point, and foreground information chrome such as labels, rules, or payloads. Aim for two focal points and four to eight visual roles, not an evenly weighted card grid. White space is for hierarchy, not emptiness.

## Do / Don't

| Do | Don't |
| --- | --- |
| Show one blue query travel from a browser to a named resolver. | Show every DNS layer as equally bright before the query reaches it. |
| Let a mint answer retrace the route and settle at the client. | Teleport an answer into view with no visible source. |
| Use a large display phrase plus small mono evidence. | Fill a scene with UI-sized text or a paragraph card. |
| Use sharp panels, rails, and deliberate asymmetric zones. | Center every element in a soft rounded dashboard. |
| Keep one active signal color per beat. | Mix several saturated accents because they look "technical." |
| Make transitions continue or interrupt the story on purpose. | Crossfade every scene by habit. |
| Make lines connect real entities and carry a message. | Add arcs, scan lines, or arrows that point into empty space. |
