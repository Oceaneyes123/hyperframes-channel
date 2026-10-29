# Findings
- Semantic diagram edges have stable renderer-owned paths in layoutDiagram. Existing reveal clips the full part horizontally.
- Node geometry remains fixed. Existing diagram part validation forbids x/y/scale changes. Destination emphasis must preserve geometry.
- Motion actions support fixed state fields and beats expand into actions. Edge-specific fields need strict target validation and final-state compatibility.
- Existing actor scope nests SVGs; MotionPath must align in the edge-local coordinate space and survive root transforms.
- MotionPath spike PASS: official GSAP adapter rendered 60 sequential frames and eight byte-identical fresh seeks under a moving translated/scaled root. Stored .data/connected-path-spike/result.json. Inspected a mid-route frame.
- Chosen contracts: persistent strokeProgress only on diagram edge parts; ephemeral traceProgress and arrivalPulse actions restricted to edge/node targets. Trace derives its destination from the approved graph. Existing @1 masks unchanged.
