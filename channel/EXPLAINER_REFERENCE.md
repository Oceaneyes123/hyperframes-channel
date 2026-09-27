# Short-form writing and worked example

Use this as the writing reference when planning a new narrated short.
`DESIGN.md`, `MOTION.md`, `BUILD.md` and `VERIFY.md` still own visual identity,
motion, assembly and verification rules; this reference does not change the
production workflow or approval gates.

## Narration pattern

Start immediately with a curiosity hook, question, surprising fact or familiar
situation. Skip greetings, branding, slow setup and filler. Keep sentences
short, conversational, active and easy to say. Explain one idea at a time with
concrete examples and visible consequences. Show an idea before naming its
technical term. Reveal information step by step, creating a small question only
when the next visible action answers it. Transitions such as “but here’s the
problem” can help when they sound natural; they are optional, not catchphrases.

When it fits, use this arc:

1. **Hook:** create curiosity immediately.
2. **Setup:** show a familiar situation.
3. **Problem / Question:** make clear what needs to happen.
4. **Flow:** follow the object, request or data through the system.
5. **Twist / Important Detail:** reveal what viewers commonly misunderstand.
6. **Payoff:** answer the opening hook.

Keep one narration beat per scene. A beat may use several short sentences when
they all describe one continuous visual action. Every line should advance the
explanation and correspond to something visibly changing or becoming clear.
Build narration and visuals together; if a line cannot be represented with the
existing icon-first language—primarily colored Icons8 assets, with Font Awesome
for supporting symbols—rewrite it. Keep the language accessible without an IT
background and technically accurate. Use concise wording for pace; preserve
required information and extend runtime rather than rushing. End on the payoff,
without a generic conclusion unless it adds a useful final idea.

Use only these broad qualities of fast, curiosity-driven educational
storytelling. Do not imitate ZAC D films or any creator's recognizable voice,
wording, catchphrases, jokes or scripts.

For example, for a DNS explainer:

> You type a website name. How does your computer find the right server?
> It asks a lookup server for an address. That lookup is called DNS.

The narration sets up one question, shows the lookup action, then names it.

`videos/local-or-router-short/` is the approved compact reference project.
Inspect its project artifacts directly:

| Artifact | What it demonstrates |
| --- | --- |
| `frame.md` | persistent object IDs, bounds and route endpoints |
| `STORYBOARD.md` | one idea per scene and action-to-evidence rows |
| `ICON_PLAN.json` | exact local assets and attribution |
| `sketches/board.html` | actual-icon layout before frame implementation |
| `compositions/frames/` | seekable scene compositions |
| `audio_meta.json` | measured, scene-local narration timing |

Use the causal pattern only when it fits: state the decision, show both
destinations, change one condition, move the packet to the correct endpoint,
and make the result visible there. The example's topic, duration, artwork and
approval are specific to that project. Do not copy its narration, approval
records or generated files into a new explainer.
