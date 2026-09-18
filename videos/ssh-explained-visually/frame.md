# How SSH works — visual contract

1080x1920 portrait. Safe rectangle x=72..936/y=180..1600. Canvas `#0B1020`,
surface `#141D35`, ink `#F5F7FF`, muted `#AAB5CC`, rule `#33415F`.
Use client blue `#4DA3FF`, infrastructure indigo `#7067E8`, success green
`#63D69A`, external cyan `#4DD9E8`, storage violet `#B07CFF`, security
red-orange `#F06A5F`, warning amber `#F5B94D`.

Persistent geometry: client/laptop centered near y=360, network/globe and tunnel
through y=720–980, server centered near y=1250. Later scenes preserve these
identities and positions; use grid/flex for source/process/destination zones and
absolute positioning only for moving packets inside the diagram.

Use Barlow/Arial headings, IBM Plex Mono/monospace technical values. Headline
72–96px, labels 36px, values 40px. Labels are 1–4 words, headline ≤6 words,
visible copy near 16 words per scene, primary icons ≥240px. Maintain 24px label
gaps and 48px group gaps. Do not place important text in the right 144px or
bottom 320px platform-control areas.

The secure tunnel is a persistent red-orange/indigo path after Frame 4. Packets
inside it use lock-wrapped colored capsules; the observer in Frame 12 sees only
muted ciphertext blocks outside the tunnel. The host key in Frame 5 is distinct
from the user key pair in Frames 8–9.

Each frame starts with its important objects visible, shows one causal action,
and resolves with a visible consequence. No captions, SFX, BGM, random motion,
or decorative pulse-only movement.
