The task is to audit and improve the repository-level HyperFrames workflow so future networking and computer-concept explainer videos consistently produce simple, highly visual, colorful, educational short-form videos.

Do not optimize only one existing video. Improve the reusable system: `AGENTS.md`, `DESIGN.md`, channel recipe, templates/styles, validation, TTS preprocessing, icon workflow, storyboard conventions, and any supporting scripts necessary.

Preserve the useful parts of the existing HyperFrames workflow, approval gates, local assets, deterministic rendering, and per-scene narration architecture.

## Primary objective

Future videos should feel like:

**simple visual explanation + clear narration + meaningful animation**

rather than:

**presentation slides with narration**

A viewer should normally understand the main concept from the animation and icons even if most of the text is removed.

The channel covers topics such as DNS, DHCP, routers, switches, MAC addresses, IP addresses, HTTP, TCP, firewalls, ports, NAT, subnets, APIs, databases, operating systems, and other computer/networking concepts.

The audience is primarily beginners.

---

## 1. Convert the channel to portrait short-form

The default production format must become:

* 1080 × 1920
* 9:16 portrait
* designed natively for portrait
* never create a 16:9 composition and crop or scale it afterward

Search the repository for assumptions tied to:

* `1920x1080`
* landscape positioning
* landscape-safe spacing
* horizontal split layouts
* wide comparison tables
* wide diagrams

Update the permanent design system, CSS, templates, frame metadata, examples, documentation, and validation accordingly.

Establish portrait safe zones so important content stays clear of typical Shorts/Reels/TikTok UI overlays.

Prefer vertical information flow:

top → middle → bottom

or:

source → process → destination

rather than wide left-to-right desktop diagrams when that would create cramped layouts.

---

## 2. Make visuals carry the explanation

Reduce reliance on text dramatically.

For normal scenes:

* Prefer zero to one short headline.
* Prefer visual labels of 1–4 words.
* Do not put narration sentences on screen.
* Avoid paragraphs.
* Avoid explaining the same information both through text and narration.
* Avoid tables unless a table is absolutely necessary to teach the concept.
* Replace lists with sequential visual reveals.
* Replace descriptive text with icons, movement, spatial relationships, color, highlighting, arrows, packets, containers, and state changes.

Technical values such as:

`192.168.1.10`
`443`
`AA:BB:CC:DD:EE:FF`
`GET /`
`8.8.8.8`

may appear when they are educationally important.

However, supporting prose should usually remain in narration.

Create explicit text-density rules in the design system.

A scene that can be understood with an icon and animation should not add another explanatory sentence.

Use progressive disclosure. Never show all information at once.

---

## 3. Make the design icon-first

Expand the existing icon-first workflow.

Icons should be the primary vocabulary of the channel.

Examples:

computer → laptop/desktop icon
internet → globe icon
DNS → directory/address-book/search concept
server → server icon
database → database icon
security → shield/lock
packet → envelope/package/data packet
router → router/network-device icon
switch → switch/network-device icon
Wi-Fi → Wi-Fi icon
user → person icon
browser → browser/window icon
cloud service → cloud icon

Do not create a generic rectangle with text when a clear icon can communicate the same object.

Use local SVG assets so rendering remains deterministic.

---

## 4. Introduce colorful multi-colored icons

The current workflow relies too heavily on monochrome Font Awesome icons and restricts Icons8 mostly to hero illustrations.

Change this.

Allow colorful SVG icons throughout a scene when they improve comprehension.

Preferred visual hierarchy:

1. Colored Icons8 or other approved multi-colored local SVG illustrations when they clearly communicate an object.
2. Font Awesome for simple symbolic/supporting icons.
3. Custom simple SVG when neither provides the concept clearly.

Do not use random colors purely for decoration.

Use consistent semantic color families.

For example:

* computer/client: blue family
* server/infrastructure: purple or indigo family
* successful response: green
* warning/problem: amber/orange
* security: red/orange where appropriate
* internet/external network: cyan/blue
* storage/database: violet
* neutral/inactive components: muted gray

The result should feel colorful and friendly without becoming childish, neon, cluttered, or inconsistent.

Keep the dark background if it continues to work well with the brighter icons.

Update `ICON_PLAN.json` conventions if necessary so an icon can define:

* provider
* path
* role
* semantic meaning
* preferred visual color/style

Do not restrict Icons8 only to one hero asset.

---

## 5. Prevent overlapping elements by design

Do not rely only on fixing overlap after rendering.

Introduce layout rules that prevent it.

Establish reusable portrait regions and minimum spacing between:

* headline
* diagram
* icon
* labels
* arrows
* technical values

Create sensible safe margins.

Prefer layout containers, CSS grid, flexbox, or explicit reusable layout primitives instead of large numbers of manually positioned absolute elements.

Absolute positioning is acceptable for animation and diagrams, but the underlying scene should still have deliberate zones.

Add validation or linting where practical for:

* elements outside the canvas
* elements inside unsafe edge regions
* obvious bounding-box collisions
* oversized text
* too many text nodes
* too many visual elements
* insufficient spacing
* horizontal overflow
* inappropriate landscape dimensions

Do not silence layout warnings with `data-layout-allow-*` unless an overlap is intentionally required and visually verified.

---

## 6. Create an explicit scene-complexity budget

Add reusable design constraints.

A normal scene should focus on ONE idea.

Prefer roughly:

* 1 primary concept
* 1 dominant visual
* 2–5 important visual objects
* only a few short labels
* 1 main animation/action

If a scene requires several explanatory paragraphs, multiple tables, many badges, and several diagrams, split it into multiple scenes.

Do not try to maximize how much information fits on one screen.

Optimize for how quickly a beginner can understand the idea.

---

## 7. Optimize pacing for short-form educational video

The existing projects can become too long.

Create a default short-form production target.

Preferred default:

* approximately 45–60 seconds
* around 6–10 scenes
* hook within the first 1–2 seconds
* meaningful visual change every few seconds
* no long static holds
* no unnecessary intro
* no repeated conclusion

Longer duration is allowed only when the concept genuinely needs it.

During script/storyboard planning, estimate duration before production and flag a video that is becoming too long.

If the script exceeds the target substantially, simplify the lesson instead of speaking faster.

One video should normally teach one main mental model.

Complex topics should become a series rather than one overloaded video.

---

## 8. Separate spoken narration from display text

Fix the TTS architecture.

The text shown visually and the text sent to TTS should not need to be identical.

Introduce a narration normalization/pronunciation layer.

Examples:

Display:
`MAC AA:AA`

Spoken:
`MAC address A A, A A`

Display:
`192.168.1.0/24`

Spoken:
`one ninety-two dot one sixty-eight dot one dot zero, slash twenty-four`

or another natural pronunciation that is clear to beginners.

Display:
`8.8.8.8`

Spoken:
`eight dot eight dot eight dot eight`

The exact pronunciation strategy should be configurable.

Handle at least:

* MAC addresses
* IPv4 addresses
* IPv6 addresses where practical
* CIDR notation
* URLs
* domain names
* ports
* protocol acronyms
* common networking abbreviations
* filenames/extensions
* command examples
* symbols such as `/`, `:`, `->`, and `_`

Do not blindly replace all acronyms.

Maintain a small pronunciation dictionary for common technical terms such as:

DNS
DHCP
HTTP
HTTPS
TCP
UDP
IP
MAC
LAN
WAN
NAT
ARP
API
URL
SSH
SQL

Some should be spoken letter-by-letter, while others may have conventional pronunciations.

Create a clean architecture such as:

script/display text
→ narration normalization
→ TTS-ready text
→ Supertonic

Retain the original display text for frames.

Make it easy to inspect the final TTS-ready narration before synthesizing audio.

Add tests.

---

## 9. Improve storyboard requirements

The storyboard should specify visuals rather than simply restating narration.

For each scene include something like:

* narration
* learning objective
* dominant visual
* icon assets
* text shown on screen
* animation
* beginning state
* ending state
* transition
* complexity estimate

If the "text shown on screen" becomes excessive, revise the scene before implementation.

Require storyboard sketches to use the actual planned icons.

Do not approve text-only wireframes for icon-led scenes.

---

## 10. Improve educational clarity

Every video should answer:

1. What is it?
2. Why does it exist?
3. What happens?
4. What should the viewer remember?

But do not necessarily put these questions on screen.

Use concrete examples.

For networking, favor visual metaphors only when they remain technically accurate.

Prefer showing:

computer
↓
packet
↓
network device
↓
decision
↓
destination

rather than explaining the same chain as several sentences.

Avoid unnecessary protocol details unless they are required for the main idea.

Accuracy is important, but beginners should not be buried under edge cases.

Put secondary nuance into `FACTS.md`; not every fact belongs in the video.

---

## 11. Improve animation purpose

Animation should explain causality.

Good animation:

* packet moves from sender to receiver
* router chooses one path
* DNS name transforms into an IP result
* cache visibly answers immediately
* firewall blocks one packet
* switch learns a device location
* request goes out and response comes back
* subnet boundary visibly separates local and remote

Avoid motion that exists only to make the video look busy.

Every major motion should answer:

"What changed?"

Prefer sequential reveals instead of all elements appearing together.

---

## 12. Improve the hook

Short-form videos need immediate context.

Start with a visual question, misconception, familiar situation, or surprising behavior.

Examples:

"Why does your computer need both an IP address and a MAC address?"

"Your Wi-Fi router is actually doing several different jobs."

"When you type google.com, your computer doesn't know where Google is yet."

Do not spend 5–10 seconds introducing the topic before teaching something.

The first meaningful visual should appear almost immediately.

---

## 13. Add automated quality gates

Expand repository validation beyond file existence and narration metadata.

Where practical, detect or flag:

* wrong aspect ratio
* wrong canvas size
* excessive scene count
* excessive duration
* excessive on-screen text
* paragraphs in scene markup
* unusually high number of labels
* excessive DOM element count
* important content outside portrait safe zones
* obvious overlapping bounding boxes
* missing icons where the storyboard requested them
* missing pronunciation normalization
* script/TTS mismatch
* scene duration too short for required speech
* scene duration with excessive dead time

Do not make validation overly rigid.

Warnings are fine for subjective thresholds; failures should be reserved for strong production rules.

---

## 14. Simplify the workflow

Audit the entire current pipeline:

facts → script → timed storyboard → icon plan → icons → sketches → approval → TTS → frames → validation → preview → approval → render

Find duplicated work and places where one artifact re-describes another.

Keep one source of truth whenever possible.

The workflow should remain understandable to an agent starting a new video.

Avoid adding unnecessary files simply for process compliance.

Update `AGENTS.md` and `CHANNEL_RECIPE.md` so the preferred path is obvious.

---

## 15. Preserve what currently works

Do not remove useful existing behavior without a reason.

Preserve:

* fact checking before production
* storyboard/sketch approval gate
* final preview approval gate
* local deterministic assets
* per-scene narration files
* canonical narration timing metadata
* local Font Awesome support
* Icons8 attribution
* channel-level design tokens
* reusable validation
* final HyperFrames checks
* explicit approval before final render

Improve them instead of replacing them unnecessarily.

---

## 16. Review existing videos as regression examples

Use the existing projects, especially:

`videos/switch-vs-router-explained-visually`

as examples of what the new rules should improve.

Look specifically for:

* excessive on-screen text
* too many labels
* landscape assumptions
* crowded comparisons
* overlapping elements
* excessive duration
* monochrome icon treatment
* visual repetition
* scenes that look like presentation slides
* narration containing display-oriented syntax such as MAC addresses and CIDR notation

Do not spend the task redesigning every old video unless needed for verification.

Use one representative project to prove the new workflow works.

---

## Expected implementation outcome

After the changes, creating a new video should naturally result in:

* 1080×1920 portrait output
* short-form pacing
* significantly less text
* stronger use of icons
* colorful but consistent visuals
* no accidental element overlap
* simpler individual scenes
* technically accurate beginner explanations
* natural TTS pronunciation
* visual storytelling instead of narrated slides

Update tests and validation for any new behavior.

Run all relevant repository tests and validation after making changes.

Finally, summarize:

1. Problems discovered
2. Files changed
3. New design rules
4. New TTS/pronunciation behavior
5. New validation rules
6. Workflow changes
7. Any remaining limitations

Do not render a final production video unless explicitly requested.

For proving the redesign, sketches, validation output, and a representative preview are sufficient.
