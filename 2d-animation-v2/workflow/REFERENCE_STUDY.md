# Reference study inside the Director workflow

This is a handoff adapter for OneTake's original reference-deconstruction
procedure, not a new motion method, agent or rendering engine. Director owns
the study during Research; Art and Motion consume it before concept selection
and storyboarding. Animator verifies the chosen techniques against OneTake.

## Inspect, record, transfer

1. Copy templates/REFERENCES.json into a **new** project with production.json.
   Its `reference_study: true` enables this contract. Start with AI LABS and
   ByteWithoutBite; append supplied reference videos to the same list. A channel
   URL is discovery input, not inspected footage. Choose a relevant actual clip,
   record its permalink and why the sampled passage matters in the viewing log.
   Reuse [the initial study](references/INITIAL_STUDY.md) only for its recorded
   ranges: copy entries from references/REFERENCES.json into the project's report,
   copy VIEWING_LOG.md under reference-evidence/ and update its evidence paths.
   Retain source URLs/access dates and the lack of retained screenshots. Reinspect
   when a decision needs finer detail than the log supports. This study does not
   establish every video's or channel's style.
2. Inspect actual playback or an ordered frame sequence spanning the action.
   Record the source time, playback speed/frame cadence, start/key/end poses,
   inspected ranges and evidence in `reference-evidence/`. Separate the ad from
   the source clip. Replay transitions at normal speed; use denser frame steps
   for ambiguous transformations. Thumbnails, transcripts, metadata, isolated
   stills and an energy map alone cannot establish animation technique.
3. For an available local source, execute installed OneTake
   `scripts/analyze_ref.py SOURCE --out PROJECT/reference-evidence/CLIP/` and
   inspect its ordered sheets **and** moving action. Read original
   `references/reference-deconstruction.md`. Keep actual energy/cut/stillness/
   motion measurements with their analyzed range. With browser-only access,
   log visual observations and mark optical-flow/cut statistics unmeasured.
   Do not invent metrics or download media to bypass an access restriction.
4. Write bounded observations using the structure below. Cover transitions,
   camera, transformations, hierarchy, pacing, choreography and storytelling
   where the viewed range supports them; mark unseen dimensions unverified in
   `limitation`. A cutaway or static hold is a valid observation. Distinguish
   visible evidence from inferred intent or guessed production software.
5. Art takes composition, object/material rules and hierarchy into VISUAL.md and
   the three concepts. Motion links selected observations (`reference-id/obs-id`)
   to teaching beats in STORYBOARD.md: **adapt or reject, why, what changes, and
   what must remain legible**. Include rejected techniques when they would
   misteach or distract. No quota of borrowed moves, matching channel palette,
   camera density, scene order or shot length. Narration/facts determine the story.
6. Animator consumes the same hashed REFERENCES.json, chooses existing OneTake
   moves, and records deviations for Motion/Director. Reviewer checks transfer
   quality against actual preview playback, not resemblance to the reference.

## One inspected record

The following is a **schema illustration**, not a claim of inspected footage.
Replace every source, time, observation and evidence path with actual findings.
Observation times are source-video seconds; all times must fall inside an
inspected range. Use separate records for separate clips, with unique IDs.

```json
{
  "id": "clip-a",
  "source_url": "https://www.youtube.com/@CHANNEL",
  "video_url": "https://www.youtube.com/watch?v=ACTUAL_ID",
  "status": "inspected",
  "checked_on": "2026-10-17",
  "inspection": {
    "method": "playback",
    "viewed_ranges_s": [[12.0, 18.0]],
    "evidence": ["reference-evidence/clip-a.md"]
  },
  "observations": [{
    "id": "carry-1",
    "range_s": [13.0, 14.2],
    "observation": "Replace with visible start, intervening movement and end poses.",
    "technique": "Describe the transferable mechanism, not a style adjective.",
    "use_when": "Identify the teaching or attention problem this solves.",
    "avoid_when": "Identify the misleading implication or readability cost."
  }],
  "limitation": "Only the stated range viewed; audio and numerical motion metrics unverified."
}
```

`ordered-frames` is the other inspection method. Its viewing log must give
cadence and frame timestamps; sparse samples cannot prove a smooth curve or a
fast transition. Evidence can include a durable viewing log and frame captures.
Use retained local evidence paths, not transient browser tab IDs as file paths.

If inaccessible, set `status: "inaccessible"`, actual `checked_on`,
`inspection: null`, `observations: []`, and a concrete `limitation` describing
the attempted clip/channel, method and failure. Keep the exact clip URL if known.
Report the limitation before Gate 1; Director records a fallback decision in
production.json (original skills and topic-led choreography). This permits
planning without fabricated analysis. `pending` is incomplete and blocks a
reference-enabled plan. Partial access means `inspected` only for viewed ranges;
name inaccessible/unwatched portions in `limitation`.

## Existing guards, extended

Run `studio.py check --project PROJECT --stage references` during Research.
This read-only check validates IDs, status, dates, temporal ranges, local evidence
and bounded observations. `check --stage plan` also runs it for new projects;
Art/Motion/Animator/Reviewer handoffs must include REFERENCES.json in `inputs`.
They also include every referenced inspection-evidence file in `inputs`, with
its current hash; changing a viewing log invalidates consumers even if the
reference report itself is unchanged.
Gate 1 binds the report and its evidence hashes; changing them requires renewed
approval and affected handoffs. Gate 2 still binds preview/audit evidence.
No JSON or hash proves that somebody watched a video; Director verifies actual
execution provenance and Reviewer inspects playback independently.

Existing projects without `reference_study` retain their existing checks and
receipts. Do not retrofit approved examples. No new approval gate is introduced;
concept selection, Gate 1, narration synchronization, original audit weighting
confirmation and Gate 2 still apply.
