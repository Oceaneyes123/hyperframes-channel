# Beat sheets

Plan one visual event beside each narration line using the [quality bar](quality-bar.md): cause, changed state and receiver response, never filler shakes/pulses/camera drift. Stage compact actions and holds within each window; resolve final timing against measured narration.

Optional `beatSheet` metadata belongs to writing drafts/storyboard shots, never speech, approval, audio or measured word timing. Legacy artifacts may omit it. New sheets cover every scoped line exactly once in order. Each line begins at local frame zero with contiguous 30–60-frame beats at 30fps: estimated 1–2-second windows, not tween lengths.

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

| Field | Allowed meaning |
| --- | --- |
| `event` | `enter`, `exit`, `transform`, `counter`, `camera`, `background`, `hold` |
| `soundCue` | `none`, `click`, `pop`, `whoosh`, `impact`, `chime`; future local synthesis, never commands/URLs |
| `onScreenText` | One short label or `null` |

An object causes a visible result or carries information forward. Preserve useful holds/source qualifications; never invent motion, numbers or evidence to fill windows.

Writing stores sheets beside structured lines; import joins only `line.text`. Visual planning creates a sheet for each shot's exact accepted lines, never silently reuses one after edits. Motion maps saved storyboard intent to supported presets/actions. Sheets are not a second executable timeline: measured line/word anchors override estimates. Sound remains unimplemented until authorized audio work.

Markdown exports keep sheets in companion files, never notes inside indented narration:

```markdown
## Line 1
    Follow the message into review.

## Line 2
    Now the reviewer can inspect it.
```

No TTS parser changes. Validate actual normal-speed, phone-size playback; valid sheets cannot establish comprehension/quality.
