# Initial reference study

Checked **2026-10-17 (Asia/Manila)**. These are bounded studies of two openings,
not descriptions of either channel's entire style. The Director can use them
as starting references alongside future project-specific clips.

## Access and evidence

| ID | Channel and exact clip | Inspected range | Method and limits |
|---|---|---|---|
| A | [AI LABS](https://www.youtube.com/@AILABS-393), [GitHub's #1 Trending Skill Is Insane (5 Use Cases)](https://www.youtube.com/watch?v=rw0fqnrZgNM) | 00:00–00:08 | Actual YouTube playback, then ordered frame stepping with screenshots. A pre-roll ad was skipped; its footage is excluded. |
| B | [Byte Without Bite](https://www.youtube.com/@ByteWithoutBite), [Why AI Infrastructure Is Moving to Rust](https://www.youtube.com/watch?v=2j4_iPG5Aqk) | 00:00–00:16 | Actual YouTube decoded video frames, ordered frame stepping with screenshots and visible player times. |

[VIEWING_LOG.md](VIEWING_LOG.md) records the temporal inspection and visible
states. Screenshots were inspected in the tool session; image files and source
video are **not** retained. The log is a human-readable viewing record, not a
replayable frame archive. Timestamps are approximate to the displayed whole
second; they are not measured transition boundaries. Frame samples establish
the listed state changes, not frame-perfect easing or uninterrupted playback
quality. Reinspect the exact span before claiming a particular curve or timing.

The web text fetch returned only footer text for A and `Online fetch throttled`
for B. Those results were not animation evidence. The in-app browser initially
displayed `Unable to play media` while the players loaded; both subsequently
displayed actual decoded content. Neither selected clip remained inaccessible.
No media was downloaded, rendered, generated, or incorporated into production.

## Observations and reusable decisions

An observation describes inspected frames. The adaptation is a proposal for
our teaching purpose; it is not a technique claimed to exist in the reference.

| ID / span | Observed motion, hierarchy and storytelling | Reusable technique / use when | Adaptation and avoid when |
|---|---|---|---|
| A1 / 00:00–00:02 | The named REA entry moves from the fourth row through intermediate positions to the first row. Other rows redistribute. The destination row receives an orange tint/star while the surrounding list stays muted. | **Identity-preserving state change.** Use when a learner must track the same item through a change of status or position. | Keep one cached response recognizable as it changes from absent to stored to stale. Do not move it through a ranking: that would give caching a false meaning. |
| A2 / 00:02–00:05 | The established ranking panel shifts left. On the right, a small tool badge and two browser/app surfaces appear; their contents change into code-like lines while their window shapes remain. The earlier context stays visible. | **Restage before adding detail.** Use when a second view explains what an already established subject does. | Move the browser and cache aside to reveal the origin within the same world; retain the request/response identity. Avoid shrinking important labels to fit extra panels. |
| A3 / 00:06–00:08 | A row of small choices sits above many user silhouettes. Across successive frames, silhouettes move upward into a cluster beneath one choice; that choice becomes orange while others remain subdued. | **Choreography expresses distribution.** Use when the distribution of many actors is the actual subject. | If comparing repeated requests, show a small, countable set choosing the local path. Do not add crowds or swarm motion when one request teaches the mechanism more clearly. The exact 00:05–00:06 transition was not resolved by the samples. |
| B1 / 00:00–00:03 | Large `2023` type is followed by a bright source-post image against dark ground. This changes the frame from a single temporal anchor to source evidence. | **Brief anchor, then evidence.** Use when a date, exact label, or source must orient the learner. | Isolate `max-age=60`, then show it attached to the actual response object. Avoid an unrelated title card between each sentence. These samples do not establish the exact type entrance curve or cut duration. |
| B2 / 00:03–00:11 | Python appears left, Rust right, then a left-to-right arrow. An `AGI?` label and later `Language choice` appear while the logos retain their positions. Several later samples keep the arrangement stable. | **Progressive disclosure followed by a reading hold.** Use when the relation must be understood before its qualifier. | Reveal request path, then freshness condition, then hold while the learner reads it. An arrow alone does not explain caching: visibly carry an identified request and show the resulting response. |
| B3 / 00:12–00:14 | A source-post image occupies the center and visibly grows across successive frames; its text remains the subject. The surrounding dark field stays subordinate. | **Slow push into relevant detail.** Use when increased scale makes a particular detail easier to inspect. | Push toward the response's freshness badge only when the narration reaches that condition, then settle. Avoid a continuous drifting camera, cropping the key header, or adding a push that reveals no new information. This is a visible image-scale change, not evidence of a 3D camera rig. |
| B4 / 00:15–00:16 | The source image gives way to a diagram: xAI, a `Mostly Rust` label, and Rust; the X mark appears below in the next sample. The new relation is built in stages. | **Evidence-to-explanation handoff.** Use when the next picture interprets evidence already introduced. | Carry the header badge from a readable response close-up into a freshness decision. Do not adopt this reference's scene replacement when the same object can carry the explanation. Exact transition mechanics were not resolved. |

## How the roles use this study

- **Director:** choose an observation because it solves a teaching problem;
  identify its span and the proposed adaptation. Preserve the project's own
  metaphor, content order and identity. Do not transplant these clips' scene order.
- **Art Director:** keep stable object silhouettes, label anchors and accent
  meanings through the proposed transformation. A's muted context/active accent
  is a hierarchy principle, not a palette to copy.
- **Motion Director:** specify the subject, trigger, intermediate states,
  destination, pause and carried object. A1 suggests tracking one identity; B2
  suggests revealing one relation at a time; B3 suggests changing scale only
  when the teaching detail warrants it. Choose different techniques when the
  beat's meaning changes. Resolve curves and camera functions from installed
  OneTake; the other installed skills keep their existing advisory roles.
- **Animator:** implement only the chosen adaptation with OneTake's deterministic
  motion and rendering contracts. Do not reproduce logos, channel assets or
  exact compositions. No animation implementation or render was done for this study.
- **Independent Reviewer:** compare the intended change to actual temporal frames
  once a future project permits them. Check identity, causal order, reading holds,
  meaningful variation and boundary carries. A reference citation and static
  storyboard cannot establish smoothness, legibility during motion or success.

## Coverage limits

These samples support local observations of staging, position changes, emphasis,
progressive assembly, a hold and a slow scale change. They do **not** establish
full-film pacing, sound synchronization, easing parameters, camera paths,
motion-blur quality, 3D depth/parallax, shape morphs, or either channel's general
production method. The videos' technical claims were not fact-checked and are
not teaching sources for HTTP caching. OneTake's existing
`references/reference-deconstruction.md` remains the method for numerical
energy/cut/flow analysis of an accessible, authorized local reference; it was
read here but its `analyze_ref.py` was not run without a local source.

## Proposed candidates, not observed reference techniques

For a future HTTP-cache direction, a response can leave a persistent copy in a
cache pocket and, when rules permit fresh reuse, the next request can be served
there. Expiration changes a separate freshness marker while the cached body
stays put; a conditional request carries only its saved validator. A bodyless
`304` can then permit local reuse. A purposeful pullback can reveal the avoided
image-body transfer. These are
original teaching proposals, not animation attributed to A or B. Their factual
mapping, storyboard, narration timing and subsequent motion still require the
existing workflow and approval gates.
