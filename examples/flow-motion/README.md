# Technical flow motion examples

Four silent, eight-second authoring examples in one seekable 1080x1920
HyperFrames composition. This is a reusable motion reference, not a finished
narrated video, an approved storyboard or a benchmark against another model.
It uses the existing ChannelMotion runtime and original layered local SVG art.

From the repository root:

```powershell
python scripts/sync_channel_assets.py --project examples/flow-motion
npx hyperframes preview examples/flow-motion --background --no-open --port 3033
```

Open `http://localhost:3033/#project/flow-motion`. Scrub the timeline or play
it to inspect the complete actions. Channel files are staged rather than
duplicated in source control; the included local GSAP vendor file is the same
runtime already used by this repository, with its license header retained.
No audio, MP4 render, publication or existing-video migration is performed.

## Examples

| Global window | Action | What makes it engaging | Teaching boundary |
| --- | --- | --- | --- |
| 0-8s | Rejected request | Device leans in anticipation; request launches; gate checks/closes; request recoils and settles. | Recoil is a visual rejection metaphor. A firewall need not send a response or bounce a real packet. |
| 8-16s | Packet cutaway | Flap pivots; header and data fan apart with delayed motion; parts return to the same container. | Packets do not physically open. This is a conceptual header/payload view, not a protocol-specific format. |
| 16-24s | File assembly | Four separated chunks rotate and snap into their slots; completion appears only after the last arrival. | Four chunks are a teaching simplification. Arrival order and reassembly must follow the chosen protocol in a factual video. |
| 24-32s | Cached response | A new request arrives; drawer opens; a content copy travels to the device while the stored copy remains. | Starts with valid content already cached. Does not demonstrate the first miss, caching policy, expiry or invalidation. |

Each eight-second action window contains preparation, action, payoff and a deliberate
comprehension hold. These example timings are authored, not audio-derived.
For a real video, replace them with that project's measured narration cues and
review the complete preview under the existing two approval gates.

## Object performances, transitions and depth

Travel belongs to the outer prop; deformation belongs to an inner body. The
rejected packet compresses before launch, stretches in flight, compresses at
contact and recovers, with a delayed seal reaction. The smaller cache request
uses less deformation. The gate and drawer move slowly with a short settle;
chunks arrive in sequence with small landing reactions. Labels stay rigid.
These are authored `ChannelMotion.state` sequences and existing presets, not
new runtime effects. Adjust their amplitude and timing to suit the material.

| Handoff | Window | Continuity |
| --- | --- | --- |
| Packet match move | 7.15-8.4s | A single foreground packet inherits the rejection endpoint, grows into the cutaway position, then hands off at identical geometry. Source and target packets are hidden during the move. |
| Content wipe | 15.2-16.8s | An enlarged content tile crosses the viewport. It covers the whole frame at the 16s scene change; file assembly is revealed on the trailing edge. |
| Zoom and iris reveal | 23.3-24.8s | Push into the assembled file, reveal the cache at the same focal region, then pull back. Both visual states remain composed until the incoming mask covers the outgoing state. |

The transitions connect independent authoring examples; they do not establish
that one real packet passes through all four mechanisms. In a factual video,
choose handoffs that preserve the actual process and replace these timings
with measured cues. Camera moves finish before the next action and reading hold.

Depth uses the existing SVG gradients, a quiet background plane, contact
shadows and selective parallax during the zoom. A flying packet's shadow stays
on the floor, shrinking and softening with lift. Tile shadows tighten on
landing. Cache content sits between the body and drawer front: it is partly
occluded when closed and exposed when open. The returned copy is a separate
foreground object. Keep this layer order when reusing the cache metaphor.

## Layered artwork

The source is `channel/artwork/flow-props.svg`. Every symbol uses a 400x400
viewBox. Instantiate parts separately with `<use>` on a sized wrapper, as in
`index.html`; using an entire flattened SVG prevents independent part acting.
`sync_channel_assets.py` stages this file into Motion v1 projects only.

| Prop | Layers | Pivot / behavior |
| --- | --- | --- |
| Device | `shadow`, `device-body`, `device-lid`, `device-screen` | Lid and screen hinge at 50% 75%; body stays planted. |
| Packet | Ground shadow, inner body containing `packet-back`, `packet-front`, `packet-flap`, `packet-seal` | Body deforms at 50% 72%; flap hinges at 50% 32%. Ground shadow stays outside travel and deformation. |
| Gate | `shadow`, `gate-posts`, `gate-arm`, `gate-badge` | Arm pivots at 14.5% 53.75%; badge reacts after the decision. |
| Cache | `shadow`, `cache-body`, stored data, `cache-drawer` | Back-to-front order establishes occlusion. Drawer translates independently; stored data and returned copy are separate objects. |
| File | `file-outline`, `chunk`, `success` | Place chunk instances in authored slots; show success after all required parts arrive. |
| Content | `header`, `data` | Independent parts allow cutaways, copies and transformations without changing identity. |

Keep technical labels outside deformation wrappers. Preserve semantic colors.
The props are coherent illustrated metaphors; existing production device icons
remain available and published videos keep their approved art. Source and roles
are recorded in `ICON_PLAN.json`.

## Verification

```powershell
npx hyperframes check examples/flow-motion --at 0.5,1.8,2.6,4,7.15,7.8,8.4,10.8,15.6,16,16.4,18.8,20,23.5,24.1,24.8,27,30 --json
node scripts/test_flow_examples.mjs --url http://localhost:3033/api/projects/flow-motion/preview
python -m unittest discover -s scripts -p test_motion_beats.py
```

The browser check exercises the actual compiled composition, checks body acting,
lift-responsive shadows, occlusion order, matched endpoints, full wipe coverage,
overlapping zoom states, visible consequences and retained content. It compares
poses/pixels after nine backward/random seeks and saves stills, action and
transition contact sheets under ignored `review/`.
Inspect playback as well as stills; test success is not render approval.
Poses must match exactly; hardware raster rounding may differ by at most one
unit per color channel (1/255), not by changed geometry or missing objects.
HyperFrames may report `rotation_pivot_drift` on the gate arm: its intended
hinge is off-center, at the left post, rather than the arm's bounding-box center.
Inspect the hinge at opening/closing samples; do not recenter it to silence
the warning.

## Suggested next video

**Why does a website load faster the second time?** Explain a cacheable resource:
first miss, origin response, stored copy, later hit, then expiry or revalidation.
The packet cutaway and cache drawer provide the visual language. Do not imply
that every response is cached or that a browser cache and CDN are the same cache.
Source starting point: [Cloudflare's cache explanation](https://www.cloudflare.com/learning/cdn/what-is-caching/).

Other directions: how a download becomes a file; how a firewall decides what to
allow; how a load balancer distributes requests; what happens after pressing
Send on an email. These are topic suggestions, not researched scripts.
