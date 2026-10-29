# Beat sheets

Beat sheets plan a visual event beside each narration line. They do not contain
spoken directions, approve a script, create audio, or establish word timing.
Writing drafts and storyboard shots may carry optional `beatSheet` metadata.
Historical artifacts can omit it. A newly generated sheet must cover every line
in its scope exactly once, in order. Each line starts at local frame zero with
contiguous 30–60-frame beats at 30 fps; these 1–2-second spans are estimates.

```json
{
  "timing": "estimated",
  "lines": [{
    "lineNumber": 1,
    "beats": [{
      "startFrame": 0,
      "endFrame": 45,
      "event": "transform",
      "motionVerb": "route the message into review",
      "soundCue": "click",
      "onScreenText": null
    }, {
      "startFrame": 45,
      "endFrame": 90,
      "event": "hold",
      "motionVerb": "hold the received message",
      "soundCue": "none",
      "onScreenText": null
    }]
  }]
}
```

Events are `enter`, `exit`, `transform`, `counter`, `camera`, `background` or `hold`.
Sound cues are `none`, `click`, `pop`, `whoosh`, `impact` or `chime`, describing
future local synthesis rather than executable commands or asset URLs. A text
value is one short label or `null`. One object should cause a visible result or
carry information into the next state. Holds remain useful; never invent motion,
numbers or evidence to fill a beat. Source qualifications stay accurate.

Writing stores the sheet beside its structured spoken lines. Draft import joins
only `line.text`; the sheet does not enter the accepted narration. Visual planning
creates a sheet for the exact accepted lines in each shot. It does not silently
reuse a writing sheet after script edits. Motion consumes the saved storyboard
sheet as intent and maps it to existing supported presets/actions. The sheet is
not an additional executable timeline: measured line/word anchors override these
estimates, and sound remains unimplemented until the authorized audio phase.

For Markdown script exports, preserve this narration layout and keep the sheet in
a companion file. Never append notes inside indented narration:

```markdown
## Line 1
    Follow the message into review.

## Line 2
    Now the reviewer can inspect it.
```

No TTS parser was changed. Test the actual moving sequence at normal speed and at
phone size; a valid sheet does not establish comprehension or quality.
