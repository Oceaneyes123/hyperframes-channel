# G1 — GSAP adapter proof

G1 passes for the synthetic fixture. The official adapter works with exact
Remotion 4.0.537 and GSAP 3.15.0 without a custom synchronization layer. This is
an engine integration result, not a production-video or editorial approval.

- Both engines: 360 sequential PNG frames match 20 fresh nonsequential stills
  each. Eight 12-second silent exports pass full decode and exact 1080×1920,
  30fps, 360-frame metadata; decoded-frame hashes repeat within each engine.
- Between engines, 326/360 lossless frames are identical. Six intermediate morph
  frames and 28 moving-camera frames have bounded edge differences. At worst
  frame 207, GSAP rounds scale 1.03946 to 1.0395: observed width difference is
  about 0.034 output pixels. Settled poses match. The initial bounding-box-origin
  error was fixed with svgOrigin 0 0; its failed/partial round remains retained.
- Warm render medians: native 34.656 seconds, GSAP 34.305 seconds. This does not
  establish a speed advantage. The 20% slowdown investigation threshold was not
  reached. Node-parent RSS excludes Chromium/encoder memory. Other desktop work
  was not isolated; measurements are a local diagnostic.
- Seek-to-two-paint median: native 40.6 ms, GSAP 40.15 ms, in IAB (version not
  exposed). This includes paint scheduling, not just animation computation.
  Unmount/engine replacement leaves zero GSAP timelines/tweens; rebuilding the
  paper shot retains one timeline/two tweens. The scoped color edit changes only
  the selected shot in independent lossless PNG checks.

Live Player observations showed morph, camera movement and a reading hold.
The [transition sheet](g1-transition-windows.png) covers every frame from 59–91,
174–213 and 264–276, inspected for meaningful state changes and blank frames.
These synthetic checks do not replace future human motion/audio review.
[Full viewport preview](benchmark-preview.jpg) records the inspection UI.

Clipped IAB captures were rejected: that backend reflowed the page and returned
JPEG, so earlier clipped hashes are not lossless engine-pixel evidence. Authoritative
pixel checks use native renderer PNGs. The [receipt](g1-verification.json) records
measurements, exact hashes, failed rounds, resource counts and package versions.

Installation audit: zero findings. Vite still warns about the Player use-client
directive in a non-RSC preview and a roughly 651 KB bundle. Next integration
must be tested separately. Adapter metadata says MIT; GSAP uses its own standard
license referenced by installed README/source headers. The Player's license
notice remains visible; organizational eligibility was not determined here.

Next: [G2 motion contracts and persistence](../GSAP-IMPLEMENTATION-PLAN.md), using
accepted synthetic boards first. Production gates, voice and export remain later.
