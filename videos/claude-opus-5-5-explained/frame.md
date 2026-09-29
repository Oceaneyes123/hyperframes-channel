---
format: 1080x1920
fps: 30
design_version: "2.0.0"
motion_version: "1.0.0"
canvas: "#0B1020"
surface: "#141D35"
ink: "#F5F7FF"
muted: "#AAB5CC"
rule: "#33415F"
client: "#4DA3FF"
infrastructure: "#7067E8"
success: "#63D69A"
warning: "#F5B94D"
external: "#4DD9E8"
storage: "#B07CFF"
security: "#F06A5F"
display_font: "var(--hf-display)"
mono_font: "var(--hf-mono)"
safe_zone: {left: 72, right: 144, top: 180, bottom: 320}
---

# Persistent geometry — Gate 1 proposal

The model remains the same indigo object. Coding and work examples enter from the left; measured claims and evidence resolve to the right; safety-gate scenes branch to biology and cybersecurity. Each scene inherits the model's position and identity where it remains visible.

| ID | Asset / geometry | Role | Continuity |
| --- | --- | --- | --- |
| `model` | `public/icons8/artificial-intelligence.png`, `(380,500,320,320)` | model / indigo | Persistent anchor from hook to payoff. |
| `coding-task` | `public/icons8/code.png`, `(120,820,280,280)` | coding / blue | Moves toward the model in the multi-step work sequence. |
| `knowledge-task` | `public/icons8/document.png`, `(680,820,256,256)` | knowledge work / cyan | Joins coding as an intended task family. |
| `cost-meter` | `public/icons8/coins.png`, `(696,1100,240,240)` | cost / green | Persistent comparison object through token-price and payoff scenes. |
| `safeguard` | `public/icons8/shield.png`, `(385,990,310,310)` | restriction / red-orange | Gate between model and two risk domains. |
| `biology-risk` | `public/icons8/dna-helix.png`, `(120,1280,220,220)` | biology / amber | Restricted branch in safety scene. |
| `cyber-risk` | `public/icons8/bug.png`, `(676,1280,220,220)` | cybersecurity / red-orange | Restricted branch in safety scene. |
| `aa-index-card` | compact scorecard, `(100,520,260,310)` | independent index result / cyan | Repeats as one scoped outside-evaluation card. |
| `sonar-java-card` | compact test card, `(405,520,260,310)` | Java benchmark / blue | Keeps its mixed pass-rate and code-density marks together. |
| `metr-scope-card` | compact research card, `(710,520,260,310)` | preliminary AI R&D tasks / amber | Keeps METR's task and disclosure caveats attached. |
| `performance-claim` | outlined claim tile, `(95,1010,395,265)` | broader performance suite / indigo | Remains visibly unverified by launch-week outside tests. |
| `cost-claim` | outlined claim tile with coin icon, `(515,1010,420,265)` | typical-workload saving / green | The forty-percent claim remains attributed to Anthropic. |

Native visual coordinates use 1080×1920. Keep all essential copy and objects inside x=72..936, y=180..1600. Headlines ≤6 words, labels 1–4 words, ~16 visible words per scene. Use `var(--hf-display)` and `var(--hf-mono)` through `channel/motion.css`; do not override the channel font token.

