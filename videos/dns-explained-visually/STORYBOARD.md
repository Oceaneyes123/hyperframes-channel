---
format: 1920x1080
duration: 166s
message: "DNS turns human-friendly domain names into the IP addresses computers use to communicate."
arc: "Concept-explainer with process"
audience: "Beginners, junior developers, IT students, homelab users, and non-technical viewers"
mode: collaborative
music: none
---

## Frame 1 — The question

- scene: An oversized browser and cursor type `google.com`; the question is only a small label.
- duration: 9.229312896728516s
- poster: 3s
- transition_in: cut
- status: built
- voiceover: "You type google.com. But how does your computer know where google.com is?"
- src: compositions/frames/01-the-question.html
- type: hook
- persuasion: Question→answer pairing
- beat: Curiosity
- blueprint: typewriter-reveal

narrativeRole: Open the everyday mystery in the viewer's own language.
keyMessage: A domain name is familiar to a person, but it is not yet a network destination.

## Frame 2 — Names need addresses

- scene: Giant name and IP glyphs split; text remains a small label beneath each icon.
- duration: 15.646997451782227s
- poster: 4s
- transition_in: crossfade
- status: built
- voiceover: "People remember names. Computers communicate with IP addresses — numerical network addresses. So before a browser can connect, it needs a translation."
- src: compositions/frames/02-names-need-addresses.html
- type: pain_point
- persuasion: Concretization + before/after
- beat: Recognition
- blueprint: comparison-split

narrativeRole: Establish why DNS exists before naming its parts.
keyMessage: Names are for people; IP addresses are the addresses computers use.

## Frame 3 — DNS is the translator

- scene: Large contact-card and translation arrows resolve into a DNS mark.
- duration: 15.275303840637207s
- poster: 4s
- transition_in: zoom-through
- status: built
- voiceover: "DNS is that translation system: like a contact list, it helps turn google.com into an address such as 142.x.x.x."
- src: compositions/frames/03-dns-is-the-translator.html
- type: product_intro
- persuasion: Analogy + distillation
- beat: Orientation
- blueprint: kinetic-type-beats

narrativeRole: Name the concept with one constrained analogy.
keyMessage: DNS translates a human-readable name into an IP address.

## Frame 4 — Ask the resolver

- scene: Large laptop, packet, and resolver icons carry the query; labels stay secondary.
- duration: 13.939305305480957s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- voiceover: "Your computer sends the question to a recursive DNS resolver — often run by your ISP, or a public DNS provider."
- src: compositions/frames/04-ask-the-resolver.html
- type: feature_showcase
- persuasion: Demonstration
- beat: Focus
- blueprint: spatial-pan-stations

narrativeRole: Introduce the resolver as the user's lookup helper.
keyMessage: The client asks a recursive resolver to find the answer.

## Frame 5 — Cache first

- scene: Oversized resolver and database icons branch into a quick return or onward route.
- duration: 14.860575675964355s
- poster: 5s
- transition_in: crossfade
- status: built
- voiceover: "First, the resolver checks its cache. A cache hit sends the saved answer straight back. A cache miss starts the full lookup."
- src: compositions/frames/05-cache-first.html
- type: benefit_highlight
- persuasion: Before/after + progressive disclosure
- beat: Aha
- blueprint: comparison-split

narrativeRole: Prevent the false assumption that all lookups visit every layer.
keyMessage: Cached answers are fast; only a miss needs the full route.

## Frame 6 — Root referral

- scene: Resolver and globe-scale root icon exchange a single `.com` referral chip.
- duration: 15.570154190063477s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- voiceover: "On a miss, the resolver asks the root. The root does not know the final IP. It says: for google.com, ask the .com servers."
- src: compositions/frames/06-root-referral.html
- type: feature_showcase
- persuasion: Subtractive framing + demonstration
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Correct the common misconception that root servers supply website IPs.
keyMessage: Root nameservers refer the resolver to the relevant TLD.

## Frame 7 — TLD referral

- scene: `.com` globe icon hands the route to a distinct authoritative-server icon.
- duration: 14.515302658081055s
- poster: 5s
- transition_in: push-slide RIGHT
- status: built
- voiceover: "The .com TLD servers do not normally return the website address either. They point the resolver to the authoritative nameserver for google.com."
- src: compositions/frames/07-tld-referral.html
- type: feature_showcase
- persuasion: Progressive disclosure + demonstration
- beat: Comprehension
- blueprint: spatial-pan-stations

narrativeRole: Show the second referral as a narrower direction, not the final answer.
keyMessage: The TLD layer identifies the authoritative nameserver for a domain.

## Frame 8 — The authoritative answer

- scene: One giant authoritative-server icon emits a compact DNS-record chip.
- duration: 14.333373069763184s
- poster: 7s
- transition_in: zoom-through
- status: built
- voiceover: "That authoritative server holds the DNS record. It returns the answer: google.com maps to 142.x.x.x."
- src: compositions/frames/08-authoritative-answer.html
- type: social_proof
- persuasion: Demonstration + payoff
- beat: Aha + confidence
- blueprint: kinetic-type-beats

narrativeRole: Deliver the lookup's visual payoff and source of truth.
keyMessage: The authoritative nameserver returns the requested DNS record.

## Frame 9 — DNS hands off

- scene: Response packet returns to the laptop, then a second bold connection line begins.
- duration: 17.646800994873047s
- poster: 5s
- transition_in: crossfade
- status: built
- voiceover: "The answer travels back through the resolver to your computer. Now the browser can connect to that IP. DNS found the destination; the website connection happens next."
- src: compositions/frames/09-dns-hands-off.html
- type: benefit_highlight
- persuasion: Causal chain + contrast
- beat: Clarity
- blueprint: spatial-pan-stations

narrativeRole: Separate finding a destination from connecting to it.
keyMessage: DNS resolves a location; it does not make the website request.

## Frame 10 — The whole route

- scene: A row of giant reusable icons lights sequentially; labels are tiny route markers.
- duration: 14.538337707519531s
- poster: 7s
- transition_in: zoom-through
- status: built
- voiceover: "The uncached path is simple: user, resolver, root, .com, authoritative server, IP address — then back to the user."
- src: compositions/frames/10-the-whole-route.html
- type: feature_showcase
- persuasion: Numbered enumeration + callback
- beat: Mastery
- blueprint: constellation-hub

narrativeRole: Compress the layered explanation into one replayable mental model.
keyMessage: The full lookup is a chain of referrals followed by one answer.

## Frame 11 — Faster next time

- scene: A giant cache/database icon keeps the resolved chip while the upstream icons dim.
- duration: 18.0363826751709s
- poster: 7s
- transition_in: crossfade
- status: built
- voiceover: "The resolver saves that answer for a while, so later requests can often skip the long trip. DNS turns human-friendly names into the IP addresses computers use to communicate."
- src: compositions/frames/11-faster-next-time.html
- type: branding
- persuasion: Callback + distillation
- beat: Satisfaction
- blueprint: titlecard-reveal

narrativeRole: Land the thesis and explain why caching makes DNS feel instant.
keyMessage: DNS translates names, and caching often avoids repeating the full lookup.
