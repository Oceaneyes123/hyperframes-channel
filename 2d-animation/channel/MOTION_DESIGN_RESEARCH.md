# Established animation and motion-design research

Research date: 2 October 2026. This extends the earlier
[creator-workflow research](OPUS_ANIMATION_RESEARCH.md) with professional
animation teaching, studio case studies and published motion systems.
The target is observable craft, not an unmeasured claim of parity with Opus 5.5.

**On this page**

- [Evidence and limits](#evidence-and-limits)
- [Primary sources and transferable findings](#primary-sources-and-transferable-findings)
- [What this changes in the repository](#what-this-changes-in-the-repository)
- [Example application: an original proposed cache explanation](#example-application-an-original-proposed-cache-explanation)
- [How to study a reference for a particular scene](#how-to-study-a-reference-for-a-particular-scene)

## Evidence and limits

### Observed evidence

The sources below were read directly. The Ordinary Folk Manifesto player was
also opened and selected film frames inspected: simple geometric staging and
dimensional character staging were visible. This was a sampled visual study,
not a complete timing, frame-by-frame or listening audit. Other film lessons
below come from their creators' descriptions/interviews, not claimed playback
analysis. No new channel video or comparative model run was produced.

### Limits of creator examples

The old creator examples establish possible workflows. They are insufficient
as the sole artistic standard: an engine, prompt or model name does not specify
pose quality, rhythm, composition or editorial judgment.

## Primary sources and transferable findings

### [Dave Burgess: Timing, Animation Mentor](https://www.animationmentor.com/blog/timing-the-12-basic-principles-of-animation/)

- **Finding:** The animator describes refining key-pose holds and quick connecting actions, including his work on the Genie in *Aladdin*. Evenly exposed poses initially lack rhythm and weight.

- **Channel application and boundary:** Protect the pose that communicates the idea. Do not copy character-specific frame counts or the source's 24 fps into our 30 fps production.

### [Jason Martinsen: Timing and Spacing, Animation Mentor](https://www.animationmentor.com/blog/tutorial-animate-with-timing-and-spacing-in-mind/)

- **Finding:** The published tutorial summary separates spacing, weight and stylized rhythm, with reference, blocking and refinement.

- **Channel application and boundary:** Author the distribution of movement, not just a duration and ease name. The written summary was studied; the embedded workshop was not audited.

### [IBM: Classic principles](https://www.ibm.com/design/language/animation/classic-principles/)

- **Finding:** Applies staging, key poses, overlap, secondary action and material behavior to graphic forms.

- **Channel application and boundary:** Use dependency and readable performance. IBM's restrictions on bounce, stretch and arcs express its brand; they are not universal prohibitions for our playful channel.

### [IBM: Tips and techniques](https://www.ibm.com/design/language/animation/tips-and-techniques/)

- **Finding:** Relates motion complexity to visual density; addresses focal transfer, clean intermediate forms and consistent behavior.

- **Channel application and boundary:** Review mid-motion composition as carefully as final poses. Reduce competing movement around dense technical evidence. Do not import its universal-looking stylistic restrictions without considering context.

### [IBM: Animation overview](https://www.ibm.com/design/language/animation/overview/)

- **Finding:** Distinguishes efficient, functional motion from more expressive performances and values contrast between them.

- **Channel application and boundary:** Give routine operations a stable vocabulary and meaningful discoveries more expression. Constant high energy is not the target.

### [Google Material: Choreography](https://m1.material.io/motion/choreography.html)

- **Finding:** Shared elements maintain focus across transitions; new surfaces relate to their origin.

- **Channel application and boundary:** Let transitions explain relationships. This is historical UI guidance, not a narrated-film timing specification; do not import its 20 ms stagger advice.

### [Google Material: Transforming material](https://m1.material.io/motion/transforming-material.html)

- **Finding:** Container dimensions may change at different rates while contents retain their aspect ratio. Joining and separation have spatial behavior.

- **Channel application and boundary:** Deform the container or mask independently of its labels; design the intermediate shape. Do not extrapolate to arbitrary SVG morphing.

### [Ordinary Folk: Process](https://www.ordinaryfolk.co/process)

- **Finding:** Message and visual development precede animation; audio is considered throughout.

- **Channel application and boundary:** Block the approved idea before polishing curves and effects. Keep our existing approval sequence and narration-first timing; the source does not authorize music/SFX.

### [Ordinary Folk: School of Motion Manifesto](https://www.ordinaryfolk.co/project/school-of-motion-manifesto)

- **Finding:** The studio describes a progression from basic shapes and lines to more complex dimensional design as an expression of learning.

- **Channel application and boundary:** Let visual development carry narrative progress. Our application is increasing explanatory depth within one art direction, not switching styles for spectacle.

### [Kuntzel + Deygas: Catch Me If You Can, creator interview](https://www.artofthetitle.com/title/catch-me-if-you-can/)

- **Finding:** The creators connect their stamp-based technique to the protagonist and explain that color signals changes of place/time.

- **Channel application and boundary:** Derive recurring visual motifs from the subject. Do not imitate the film's identity or replace the channel's semantic colors with unrelated scene palettes.

## What this changes in the repository

The runtime already supports transforms, routes, layered wrappers, masks and
deterministic timing. The current gap is specifying and judging performances.
These are research-informed channel decisions, not claims that every source
prescribes the same style:

- Treat **timing and spacing separately**. A cue locates the event; pose
  spacing, acceleration and holds determine how it feels.
- Specify the **breakdown pose**, meaning the designed pose between key poses.
  It establishes arc, leading part, silhouette and clearance. Automated
  interpolation cannot choose those intentions for us.
- Establish a **motion vocabulary** for recurring operations, then use a
  purposeful exception to reveal a changed condition. Consistency makes the
  exception informative.
- Choose transitions by **relationship**: same entity, inside/outside,
  continuation, comparison or conceptual break. An impressive transition
  that asserts the wrong relationship fails.
- Polish in order: **readable mechanism, timing/spacing, secondary performance,
  depth, finish**. Surface effects should amplify an already readable sequence.

Canonical direction lives in [MOTION.md](../MOTION.md), visual form in
[DESIGN.md](../DESIGN.md), reusable adaptations in
[MOTION_LIBRARY.md](MOTION_LIBRARY.md), and inspection in
[VERIFY.md](../VERIFY.md). This report records provenance and rationale; it is
not another mandatory rulebook or a second beat schedule.

## Example application: an original proposed cache explanation

This is an application of the research, not an observation from a cited film
and not an approved storyboard. Facts and narration still need project-specific
research. Choose a cacheable resource and distinguish a stored copy from a
returned copy.

| Explanatory beat | Directed movement | Why the movement matters |
| --- | --- | --- |
| First lookup misses | Evidence reaches an empty slot; the expected local response does not occur; attention follows the request onward | An absence has a visible test and consequence, not just a MISS label |
| Response is stored | One copy settles behind the container front while another continues to the requester | Layering explains retention versus delivery |
| A later lookup hits | Repeat the established approach, then branch into the local drawer and return its copy | The changed path is surprising because the earlier motion established an expectation |
| Explain the shortcut | Align the route views at the same scale; emphasize the omitted origin trip | Comparison carries the payoff without pretending illustrative travel time is measured latency |

## How to study a reference for a particular scene

### Record the study

Use the storyboard's existing Example adaptation field. Record the source,
the exact viewed interval (or explicitly say text/stills only), the mechanism
to adapt, and the reason it fits. Study start, decisive pose, breakdown and
result, then watch the interval at normal speed. Identify what carries the eye
into the next shot. Distinguish direct observation from interpretation.

### Transfer principles and respect reuse boundaries

Transfer a principle, not a complete shot: change assets, geometry and staging
for the actual explanation. Reference media are for study; do not bundle them
as production assets without appropriate rights. A source link or an attractive
styleframe does not establish that the target video executes the principle.

### Acceptance scope

No additional approval gate, animation engine, fixed effects quota or mandatory
3D treatment is introduced. Actual improvements must be demonstrated in the
next project's complete preview before its existing Gate 2 render approval.
