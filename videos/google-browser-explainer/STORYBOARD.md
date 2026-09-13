---
format: 1920x1080
duration: 87.4s
message: "A browser turns google.com into a secure, rendered webpage through a short chain of network requests."
arc: "Hook → Address lookup → Secure request → Resources → Render → Recap"
audience: "Non-technical people curious about how the internet works"
mode: collaborative
music: none
---

## Video direction

Dark ink-black and fire-orange Broadside system; large lowercase Barlow type, sharp geometric diagrams, no photographic media, no rounded cards or gradients. Each frame reveals only the visual named by the narration, uses smooth power3-style settles, and holds cleanly after its final cue. The sequence alternates type-led statements, diagrams, and browser surfaces to avoid a slide-deck rhythm.

## Frame 1 — A name is not an address

- scene: A minimal browser address bar receives `google.com`; the letters become a glowing destination pin with a question mark.
- duration: 6.4s
- transition_in: cut
- status: animated
- voiceover: "You type google.com, press Enter, and your browser begins a tiny trip across the internet."
- src: compositions/frames/01-name-not-address.html
- type: hook
- persuasion: Imagine scenario + curiosity gap
- beat: Curiosity
- blueprint: typewriter-reveal

narrativeRole: Opens on the familiar action and makes the hidden journey feel worth seeing.
keyMessage: A web address starts a process; it is not itself the destination a network can route to.

blueprint: compose
focal: `google.com` address-bar wordmark
roles: address bar = foreground subject; orange field = background; destination-pin question mark = supporting
sfx: none

Scene 1 (0.0–2.1s): `google.com` types into a left-anchored browser bar via type-on with caret (`discrete-text-sequence`); orange cover, asymmetric 60/40.
Scene 2 (2.1–4.7s): as “tiny trip” lands, the letters cluster then expand into a route-pin and first network line via cluster→outward expansion (`center-outward-expansion`); layered-depth.
Scene 3 (4.7–6.4s): the address and pin settle; hold the read, no ambient drift.

## Frame 2 — Find the numeric address

- scene: The word `google.com` sits on one side of a clean split-stage while an empty numeric-address slot waits on the other.
- duration: 7.5s
- transition_in: crossfade
- status: animated
- voiceover: "But networks do not use names. They need a numeric address—an IP address—to know where to send the request."
- src: compositions/frames/02-find-ip.html
- type: pain_point
- persuasion: Familiar-language contrast
- beat: Recognition
- blueprint: comparison-split

narrativeRole: States the first problem the browser must solve.
keyMessage: DNS translates the human-friendly name into a network address.

blueprint: compose
focal: name-to-IP comparison
roles: domain name = left foreground; IP slot = right foreground; dividing rule = supporting; dark field = background
sfx: none

Scene 1 (0.0–2.4s): `google.com` enters on the left through per-word staggered reveal (`dynamic-content-sequencing`); split-screen.
Scene 2 (2.4–5.3s): the right numeric-address slot draws in as “numeric address” is spoken via SVG self-draw (`svg-path-draw`); balanced comparison.
Scene 3 (5.3–7.5s): the arrow connects both sides as “send the request” lands; hold still.

## Frame 3 — Ask DNS

- scene: A DNS resolver sits at the center of a sparse network map; a small packet leaves the browser and follows a short path through labeled lookup nodes.
- duration: 11.3s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "First, the browser checks what it already knows. If needed, it asks a DNS resolver, which follows the internet's directory—from root, to .com, to Google's records."
- src: compositions/frames/03-ask-dns.html
- type: feature_showcase
- persuasion: Progressive disclosure + signposting
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Shows the simplified lookup rather than treating DNS as magic.
keyMessage: A DNS resolver can follow a hierarchy of directories to locate the right record.

blueprint: compose
focal: resolver-to-record network path
roles: resolver = foreground hub; root/.com/Google nodes = supporting; route line = supporting; dark grid = background
sfx: none

Scene 1 (0.0–3.0s): browser and resolver appear first via spring-pop entrance with smooth settle (`spring-pop-entrance`); full-width strip.
Scene 2 (3.0–8.8s): root, `.com`, and Google nodes reveal one by one as named via cluster→outward expansion (`center-outward-expansion`); horizontal stations.
Scene 3 (8.8–11.3s): a single orange packet completes the path; hold on the full route.

## Frame 4 — DNS answers

- scene: The lookup path contracts into one clear reply packet labeled `IP address`; the address fills the previously empty destination slot.
- duration: 7.0s
- transition_in: crossfade
- status: animated
- voiceover: "A reply comes back with an IP address: the network location the browser can actually contact."
- src: compositions/frames/04-dns-answer.html
- type: feature_showcase
- persuasion: Answer reveal
- beat: Aha
- blueprint: titlecard-reveal

narrativeRole: Resolves the address-lookup question with a visible return packet.
keyMessage: DNS gives the browser a routeable destination.

blueprint: compose
focal: IP-address reply packet
roles: reply packet = foreground subject; return path = supporting; orange ground = background
sfx: none

Scene 1 (0.0–2.3s): route line self-draws back toward the browser (`svg-path-draw`); asymmetric 60/40.
Scene 2 (2.3–5.4s): reply packet enters from the right with motion-blur streak (`motion-blur-streak`) as “IP address” is spoken.
Scene 3 (5.4–7.0s): packet locks into the numeric slot; hold.

## Frame 5 — Open a secure route

- scene: Browser and server nodes draw a direct line; the line first appears open, then gains a precise lock-shaped encryption layer.
- duration: 7.4s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "Now the browser opens a connection to that server—and for a site like Google, it needs that route to be secure."
- src: compositions/frames/05-secure-route.html
- type: product_intro
- persuasion: Causal chain
- beat: Anticipation
- blueprint: constellation-hub

narrativeRole: Bridges address discovery to a safe conversation with the correct server.
keyMessage: Knowing the address lets the browser begin a secure connection.

blueprint: compose
focal: browser-to-server secure route
roles: browser and server nodes = foreground subjects; route = supporting; lock = foreground accent; dark field = background
sfx: none

Scene 1 (0.0–2.7s): browser and server nodes arrive from opposing sides via split-tilt cards (`split-tilt-cards`); split-screen.
Scene 2 (2.7–5.8s): the route draws between them via SVG self-draw (`svg-path-draw`) as “connection” lands.
Scene 3 (5.8–7.4s): lock closes on “secure”; hold.

## Frame 6 — The HTTPS handshake

- scene: Three clean exchanges travel between browser and server: `hello`, `identity proof`, and `shared secret`; a lock closes only after the final exchange.
- duration: 13.0s
- transition_in: crossfade
- status: animated
- voiceover: "In the HTTPS handshake, the browser says hello, the server proves its identity with a certificate, and both agree on encryption keys. After that, their messages are private in transit."
- src: compositions/frames/06-https-handshake.html
- type: feature_showcase
- persuasion: Progressive disclosure + causal chain
- beat: Confidence
- blueprint: kinetic-type-beats

narrativeRole: Makes TLS tangible without burying the viewer in cryptography.
keyMessage: HTTPS checks the server's identity and protects the conversation with encryption.

blueprint: compose
focal: three-message HTTPS handshake
roles: hello/certificate/key messages = foreground; browser/server labels = supporting; connector rails = background
sfx: none

Scene 1 (0.0–3.5s): “hello” crosses first via nudge-curve (`nudge-curve`); full-width strip.
Scene 2 (3.5–8.4s): certificate and identity label cross back on their spoken cue via nudge-curve (`nudge-curve`).
Scene 3 (8.4–13.0s): shared-key packet crosses, then the lock gains a subtle keyword glow (`asr-keyword-glow`) and holds.

## Frame 7 — Request the page

- scene: A single packet labeled `GET /` leaves the browser through the now-locked route; a small request card shows the browser asking for the page.
- duration: 7.9s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "With the secure connection ready, the browser sends an HTTP request: essentially, please send me this page."
- src: compositions/frames/07-http-request.html
- type: feature_showcase
- persuasion: Concretization
- beat: Clarity
- blueprint: prompt-type-submit-generate

narrativeRole: Names the actual request in familiar language.
keyMessage: HTTP is the browser's request for the page.

blueprint: compose
focal: `GET /` request packet
roles: GET card = foreground; secure route = supporting; orange field = background
sfx: none

Scene 1 (0.0–3.0s): `GET /` types into the request card via type-on with caret (`discrete-text-sequence`); asymmetric 60/40.
Scene 2 (3.0–6.1s): the card travels down the route with motion-blur streak (`motion-blur-streak`) as “send me this page” lands.
Scene 3 (6.1–7.9s): card reaches server; hold.

## Frame 8 — Resources return

- scene: The server packages HTML, CSS, JavaScript, images, and fonts into distinct geometric resource cards that stream back toward the browser.
- duration: 10.4s
- transition_in: push-slide RIGHT
- status: animated
- voiceover: "The server sends back the building blocks: HTML for structure, CSS for appearance, JavaScript for behavior, plus images and fonts."
- src: compositions/frames/08-resources-return.html
- type: feature_showcase
- persuasion: Labeled enumeration
- beat: Fascination
- blueprint: grid-card-assemble

narrativeRole: Shows that a webpage is a package of cooperating resources, not a single file.
keyMessage: The response contains the ingredients the browser needs to make the page.

blueprint: compose
focal: five resource cards
roles: HTML/CSS/JS/image/font cards = foreground; server-to-browser lane = supporting; dark field = background
sfx: none

Scene 1 (0.0–2.3s): server packet opens into HTML and CSS cards via scale-swap (`scale-swap-transition`); triptych.
Scene 2 (2.3–7.7s): JavaScript, images, and fonts join sequentially via waterfall-entry (`waterfall-entry`) as named.
Scene 3 (7.7–10.4s): cards form a clean stream toward the browser; hold.

## Frame 9 — Render what you see

- scene: Resource cards pass into a browser canvas; a wireframe becomes layout, painted shapes, text, and finally a complete Google search page.
- duration: 8.7s
- transition_in: zoom-through
- status: animated
- voiceover: "The browser reads those pieces, lays them out, paints the pixels, and runs the code. A moment after Enter, the webpage appears."
- src: compositions/frames/09-render-page.html
- type: benefit_highlight
- persuasion: Demonstration
- beat: Satisfaction
- blueprint: zoom-out-workspace-reveal

narrativeRole: Turns the invisible response into the familiar visual result.
keyMessage: Rendering converts returned resources into the page on screen.

blueprint: compose
focal: browser canvas turning into a search page
roles: render verbs = foreground rail; page canvas = foreground subject; dark field = background
sfx: none

Scene 1 (0.0–3.2s): `read` and `layout` reveal in a left rail via per-word staggered reveal (`dynamic-content-sequencing`); asymmetric 60/40.
Scene 2 (3.2–6.7s): `paint` gains accent and the page surface self-draws via SVG self-draw (`svg-path-draw`).
Scene 3 (6.7–8.7s): `run` lands and the finished search page resolves through scale-swap (`scale-swap-transition`); hold.

## Frame 10 — The whole trip

- scene: The full sequence condenses into one illuminated route: name → DNS → IP → secure connection → request → resources → rendered page.
- duration: 7.8s
- transition_in: crossfade
- status: animated
- voiceover: "So one address becomes a lookup, a secure conversation, a request, a response, and the page in front of you."
- src: compositions/frames/10-whole-trip.html
- type: branding
- persuasion: Distillation + callback
- beat: Now I get it
- blueprint: titlecard-reveal

narrativeRole: Compresses the process into a memorable mental model.
keyMessage: Typing a URL triggers a fast, coordinated sequence that ends in a rendered webpage.

blueprint: compose
focal: name-to-page summary route
roles: route labels = foreground sequence; final page = foreground payoff; orange field = background
sfx: none

Scene 1 (0.0–3.5s): name, DNS, and secure appear sequentially along the route via per-word staggered reveal (`dynamic-content-sequencing`); full-width strip.
Scene 2 (3.5–6.2s): request and render snap on via kinetic beat-slam (`kinetic-beat-slam`) as the summary names them.
Scene 3 (6.2–7.4s): route resolves to `page`; hold the final takeaway.
