# Local or router — approved visual contract

1080x1920, safe x=72..936/y=180..1600. Canvas #0B1020, panels #141D35,
ink #F5F7FF, muted #AAB5CC, path #33415F. Client blue #4DA3FF,
success #63D69A, remote mismatch #F5B94D, infrastructure #7067E8.
Arial/sans-serif for headings/labels; monospace for technical addresses.
Headlines 76px, labels 36px, address values 44px. No full narration on screen.

Match the confirmed sketches. Keep sender at x354/y360/300x300, switch
x354/y720/300x240, receiver x354/y1255/300x300. Images are local colored
assets: public/icons/laptop.png, public/icons/switch.svg, public/icons/router.png.
Use SVG <image> or CSS backgrounds for the two repeated laptop assets.
Main SVG viewBox 0 0 1080 1920 may hold diagram overlays; grid/flex containers
establish the source/process/destination zones. Title at x72/y180, height92.
Address baselines y705 and y1220, centered at x504; break connector segments
around these label bands. All ids and classes except #root must use line-N prefix.

Local frame: one rounded region x72/y340/864x1240, blue outline. Remote frame:
upper region x72/y340/864x620, lower region x72/y1170/864x410, amber lower outline.
Router x384/y950/240x240, linking the regions. The muted switch remains visible
when the router is in the story. The same endpoint positions persist throughout.
Address labels show 192.168.1.20 /24 and 192.168.1.50 /24 (remote: 192.168.2.50).
Use separate prefix and host tspans so matching/mismatching portions can change.

One moving packet is a 22px blue circle. Destination receipt is a green check
inside its screen. The local connector is a logical path, not a broken cable.
Animate the packet along the vertical route, crossing the switch/router; don't
swap the scene for a sentence. Keep the main devices visible at t=0. No whole-scene
fade-in/out, no constant pulsing, no screensaver motion. Headline optional.

Per-scene timelines scale beat timing to the measured duration in the packet.
One paused timeline registered by matching composition id; all motion seekable.
CSS hidden accents must be revealed by the timeline. Scope every selector to
the scene id. Add @import url("channel/styles.css") inside <template> style.
Root #root explicitly 1080x1920; include a separate full-duration background
clip with data-start=0, measured duration, data-track-index=0. Do not load GSAP
inside frames: the shared parent supplies a local runtime. Do not add audio:
the parent mounts the unique per-scene WAVs. Captions, SFX, BGM are off.
