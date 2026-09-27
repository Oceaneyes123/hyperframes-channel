# How HTTPS Actually Works — persistent visual contract

1080x1920 at 30 fps. Use the channel safe area x=72..936, y=180..1600 and the
tokens in `../../DESIGN.md`. Gate 1 approved this persistent geometry; frame
work should preserve it across all eight scenes.

## Persistent objects and geometry

- `browser`: Icons8 laptop, centered near x=540/y=1360, 320x320. Keep the client
  endpoint in this position across all scenes.
- `server`: Icons8 server, centered near x=540/y=445, 320x320. Keep the origin
  endpoint in this position across all scenes.
- `route`: one vertical path centered at x=540 between the endpoints. Start
  muted; show handshake messages on it; turn it into the encrypted TLS tunnel
  only after authentication succeeds.
- `certificate`: use the local certificate icon around x=540/y=860, 210x210.
  The page label names `example.com`; the attached key is labeled as the
  certificate's public key.
- `trust-badge`: use the verified-account icon near x=790/y=845, 180x180 while
  checking the issuer chain. It represents a trusted authority, not a website
  reputation score.
- `handshake`: use the local handshake icon near x=540/y=990, 180x180 during the hello
  exchange; remove it when the route resolves.
- `key-shares`: use two labeled key icons near x=275 and x=800/y=830 for the temporary
  shares. The share values cross the route; the derived traffic keys remain at
  their endpoints.
- `observer`: show the local person icon outside the route near x=840/y=820,
  145x145. Keep it outside the encrypted tunnel.
- `http-request` and `http-response`: draw small, labeled message packets on
  the route. Show readable HTTP labels before TLS protection and opaque content
  after it; never use packet color alone to imply encryption.

## Visual rules

Use the dark navy canvas, semantic channel colors, measured labels and real
local Icons8 assets. The browser and server stay visible as the same endpoints;
certificate identity, certificate public key and temporary key shares remain
visually distinct. Use 2–5 important objects per frame. Headlines are optional
and at most six words; keep labels to 1–4 words and visible text near 16 words.
No decorative cards, emoji, full narration captions, or final-frame code.

One route changes state: muted during setup, active for the hello and proof,
then enclosed/glowing only after the handshake finishes. An observer can point
to the route but never reveal the plaintext after encryption. This file owns
persistent positions; `STORYBOARD.md` owns each scene's starting and resolved
states.

## Motion-v1 pilot overrides (Frames 2, 4, 7)

Endpoints remain at their original positions, outside the camera wrapper.
Frames 2 and 7 use SVG world coordinates x=540, y=1170 to y=690; replies
reverse the same route. Contents change inside one persistent message shell.
Frame 4 inherits the actual Frame 3 certificate box (450,760,180,180), promotes
it with scale 1.65 and offset (-125,-25), then ends near Frame 5's identity area
(145,790,190,190). Its connector endpoint follows the certificate.
The authority badge stays near (730,650); the proof key stays beside the server.
Camera focus changes only the central diagram. Labels remain inside the safe
rectangle; headlines and endpoint labels do not zoom. Exact cues and WAV
fingerprints belong to motion_beats.json, not this geometry contract.
