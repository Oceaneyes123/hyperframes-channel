# Generic explainer worked example

This is an optional example, not an additional rule owner. `SCRIPT_GUIDE.md`
owns storytelling; `DESIGN.md` owns visual identity; `MOTION.md` owns attention
and motion; `channel/templates/STORYBOARD.md` records the plan; `BUILD.md` and
`VERIFY.md` own implementation and review. No previous video, MP4, frame,
storyboard or project folder is required to create a new explainer. Permanent
references, templates, workflow and topic-specific research and assets suffice.

## Example: a repeated fetch

This generic example illustrates the narrative functions. It is not a script
to copy or a substitute for topic-specific research. Establish the saved-copy
condition; this does not imply every repeat request avoids a fetch.

| Function | Possible narration | Visible explanation |
| --- | --- | --- |
| Hook | Why can the second request return sooner? | Show the same object requested twice; leave the difference unanswered. |
| Setup | First, the device asks the server for a copy. | Follow one request to the server and one response back. |
| Problem / Question | Must it fetch the same thing again? | Keep the returned copy visible beside the device; prepare a repeat request. |
| Flow | It checks the copy it saved. | Redirect attention to that persistent copy and show the check. |
| Twist / Important Detail | If that copy is still fresh, it can reuse it. | Resolve the condition before selecting the saved copy. |
| Payoff | This time, it skips that server fetch. | Show the local return and compare the two routes, answering the hook. |

These functions may share a scene or span several scenes. Follow the owners
above for writing and timing rules rather than treating this table as a formula.

## One scene, several attention beats

A decision scene can keep the device and saved copy visible throughout:

1. The repeat request makes the saved copy relevant.
2. A freshness check prepares the decision.
3. The condition resolves around its measured narration cue.
4. The selected copy travels to the device; the device responds on arrival.
5. The result settles for comprehension, opening the next question if needed.

Keep these in the storyboard's action table. Use estimated local windows for
planning, then measured WAV cues after Gate 1. The same objects carry continuity;
the scene need not clear and refill the canvas between beats. No fixed interval
or decorative movement is needed.

## Motion implementation references

Use the [flow-motion guide](../examples/flow-motion/README.md) and
[composition source](../examples/flow-motion/index.html) for articulated local
props and playable motion patterns. The packet cutaway supports inspecting
contents; file assembly supports ordered arrivals; rejection supports a visible
decision; the cache drawer supports stored content, occlusion and a returned
copy. Their handoffs demonstrate matched geometry, wipe coverage and composited
zoom states; choose one only when it serves the actual explanation.

The cache-hit example begins with valid cached content. It does not implement
this narrative's first miss, storage or freshness decision. Plan and research
those additional beats for a complete repeated-fetch video. The four silent
examples are independent authoring demonstrations, not a script, a factual
end-to-end process or an approved preview for a new project. Owners above
control style, measured timing and the two gates.
