# Storytelling for Finance, Technology and AI Shorts

These are channel constraints and editorial checks for the Scriptwriter executing
the original installed `storytelling-hooks` skill, followed by `blader/humanizer`
in the same Scriptwriter. Originals own their methods; storytelling-hooks also
requires its patterns reference. AGENTS.md owns production/approvals;
Motion Director plans choreography and OneTake alone implements it. The aim is
a task the viewer can complete or a mechanism they can understand.

**Think from the payoff, but tell the story from the hook.** Define the specific
result, realization or usable knowledge before choosing an opening. Research
and outline the evidence that earns it; the viewer hears the hook first.

## Choose the video type before writing

Classify the viewer's intended outcome, not just the title's first word. Record
the type and its promise in the existing BRIEF.md, then follow that type through
the opening, middle, visual evidence and ending.

| Type | Opening promise | Progression | Visual evidence | Ending |
| --- | --- | --- | --- | --- |
| Quick tutorial: how to do a task | Show the specific result the viewer will learn to produce. State essential prerequisites before the steps that need them. | Starting state → necessary actions in order → visible result → success check. Explain why only when it helps the viewer act or avoid a mistake. | Show the actual controls, inputs, settings and changed state needed to repeat the task. Verify current tool behavior; a metaphor alone is not a tutorial. | Show the completed result and how to confirm it worked, with any material limit. |
| Explainer: what something is or how it works | Establish a concrete question, observation or misconception; give a plain-language orientation early. | Familiar example → mechanism and cause/effect → useful qualification → mental model. | Show what changes, what causes it and where the analogy stops. Tool operation is optional unless needed to understand the mechanism. | Answer the opening question with the specific takeaway the demonstration earned. |

"How DNS works" is an explainer. "How to change your DNS settings" is a tutorial.
"Why run a model locally?" and "Five AI use cases" need a declared promise:
explain the tradeoff/applications, or teach a specific task. Do not force every
title containing "how" into a tutorial.

A tutorial must let a beginner repeat the task; a tour of benefits or a fictional
success story is insufficient. Use direct instructions and concrete examples.
Keep setup, essential validation and a success check, but skip unrelated theory.
Quick means a narrow, complete task, not accelerated narration or omitted steps.
Do not imply an illustrative demo was executed or that a hypothetical sale is
evidence of earnings. Report any unverified step in the unspoken review notes.

For the same topic, an automation tutorial might open: "Send each website inquiry
to Google Sheets, then email the coordinator. Here's the workflow to build."
Its middle must show the configured trigger, field checks, mapping, save and
notification, then test a valid and incomplete submission. An automation
explainer might open: "A customer fills in a form. Why does someone still have
to copy the details?" Its middle demonstrates how a configured handoff replaces
that work and why incomplete inquiries still need a person.

## Research translated into practice

- [YouTube's conversation with Jenny Hoyos and Todd Sherman](https://blog.youtube/creator-and-artist-stories/youtube-shorts-deep-dive/)
  emphasizes an immediate hook and a compact story with satisfaction. Adapt this
  as a concrete premise, task result or useful surprise in the first spoken
  sentence and opening picture, with the reason to watch apparent within 1–3
  seconds. Use surprise only when the subject supports it.
- [Hoyos on causal storytelling](https://www.linkedin.com/posts/jennyhoyos_the-most-misunderstood-skill-that-separates-activity-7464706854963720192-akRj)
  uses the **But → Therefore** principle: a change creates a consequence that
  drives the next beat. For education, the obstacle can be a mistaken expectation
  or a real constraint; never manufacture danger. These are logical links, not
  words to repeat in every sentence.
- [Andrew Stanton's TED talk](https://www.ted.com/talks/andrew_stanton_the_clues_to_a_great_story)
  describes working backward from the ending. Define the payoff before choosing
  the hook so the opening promises something the explanation actually delivers.
- [Gruber, Gelman and Ranganath's curiosity study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4252494/)
  found memory benefits in a trivia-learning experiment during high curiosity.
  Adapt this as a specific missing explanation, then reveal enough to let the
  viewer understand the answer. This was not a Shorts retention experiment.

Creator practices are useful craft evidence, not controlled proof of engagement.
The workflow below is our adaptation, not a creator's signature voice or formula.
Neither a checklist nor a score guarantees views, retention or learning.

## Original skill and channel integration

Resolve both skills with `studio.py skills`; read their original SKILL.md files
and storytelling-hooks' required patterns.md. Execute intake, five labeled variants,
selection, full-script development and checklist. Record actual outputs and
limitations in the handoff. The checks below supplement that execution, rather
than substitute a local rewritten storytelling skill. Its levers are craft
options: never invent emotion, conflict or suspense to satisfy its checklist.
Account for its visual, spoken and text layers, but record **text: none** when
the picture and narration suffice. Add a label or value only when it helps
identify, compare or qualify something; never add an overlay to fill a layer or
repeat speech. No mandatory CTA/captions, invented credentials, algorithm
guarantees or fixed cut rate. These are channel adaptations; keep the original
installed skill unchanged.

## Before the full script

1. **Define the payoff.** Research the topic first. For a tutorial,
   identify one reproducible task, starting requirements, exact result and
   success check. Build the outline around completing it, without requiring a
   surprise or withholding instructions. For an explainer, name the question the
   viewer should be able to answer and the mechanism and conditions that make
   that answer true. Write the intended final understanding in plain language.
   Reject a payoff that only says "understand AI" or "start earning."
2. **Build the evidence chain.** List the facts, necessary actions or causal links
   between the viewer's starting knowledge and that payoff. Choose one concrete
   example; map required facts and material limits to the progression. A real
   difficulty can supply stakes, but a straightforward task needs no invented
   obstacle. This chain determines what the opening can honestly promise.
3. **Generate at least five distinct hooks through the original skill.** Derive
   each from the same payoff and label its levers. For a tutorial, compare accurate
   result-first, problem-first or before/after openings for the same task. Start
   the demonstration promptly; do not add a mystery before the instructions.
   For an explainer, change the premise, not just the wording: an observed
   contradiction, a relatable moment with a hidden cause,
   or a prediction the viewer can test against a visible result. Include an
   opening picture for each: which expectation does it establish or break?
   Name the subject early and deliver the title's actual value. A specific fact
   or question can work when it gives a reason to continue and sentence two
   advances it; surprise is optional. Skip greetings and introductory context.
   A question is useful only when specific and answerable; skip generic "Did you
   know?", "What if AI changes everything?" and "You won't believe this."
4. **Compare, then select.** Use one compact table in SCRIPT.md's unspoken notes:

   | Angle + spoken hook | Payoff promised / next sentence | Clarity | Originality | Accuracy | Opening picture / needed text |
   | --- | --- | --- | --- | --- | --- |
   | Distinct premise, exact words | What will the viewer receive, and what does sentence two add? | Understood without setup | Topic-specific angle | Supported, with essential conditions | Visible expectation or result; text only with a reason |

   Give short reasons, not arbitrary points. Reject misleading hooks regardless
   of their other strengths. Judge the **first two sentences together**: the
   first establishes a specific task or itch; the second makes progress rather
   than defining the topic or repeating the tease. Ask "Why hear the next sentence?" If the
   answer is only "to learn about caching/AI/finance", rewrite the angle. Prefer
   the strongest accurate task promise or observation plus its visible evidence,
   not merely the shortest or safest-sounding fact. Explain the selection's
   tradeoff in one sentence. Estimate whether its result or curiosity lands in 1–3
   seconds at a comfortable pace; shorten or move the premise earlier if needed.
   Do not fill 5–15 seconds because a generic structure reserves that much time.
   Do not claim measured timing before TTS.
5. **Draft one connected narrative.** Use the functions below to develop the
   selected promise through the evidence chain to the payoff. Each section must
   move the viewer toward that same outcome. Deliver useful answers along the
   way; never delay essential instructions to create suspense. Choose an ending
   style only after the payoff works on a first viewing.
6. **Humanize, then recheck.** Preserve the completed storytelling draft and run
   the original humanizer on its narration using the integration below. Verify
   the final script still fulfills the opening promise. Complete the review
   below before Gate 1.
   Hook selection is the writer's decision, not an extra approval gate; user
   visual concept selection remains.

Keep the selected hook/payoff, ending choice and brief review in existing
SCRIPT.md notes. Keep refinement evidence in the existing review/ area, not in
spoken passages. No separate specialist, scoring system or production stage.

### Required humanizer handoff

Use humanizer's original embedded workflow; do not copy its pattern catalog or
use a local substitute. Pass only narration as the editing material, with the
brief's audience, payoff and factual boundaries as context. Return final prose
to the existing line sections. Preserve headings, indentation, notes, technical
identifiers, sources and required coverage. Do not invent anecdotes, feelings,
facts or sales claims to make the voice seem human. Keep a useful specific hook.
An already natural passage may remain unchanged after an actual review.

Save `review/scriptwriter-draft.md` before refinement. Save the marked tells,
intermediate rewrite, remaining-pattern check, final corrections and claim-by-
claim comparison in `review/scriptwriter-humanizer.md`. Follow the original's
spoken read instruction without TTS when possible; otherwise record text-only
breath/phrasing review and leave audible naturalness explicitly unverified.
Never report a spoken read from silent inspection or generated timing.

Keep the canonical handoff's primary `skill` as storytelling-hooks. Its existing
`procedures` describe that execution. Add `refinement` to the same report:

```json
{
  "status": "executed",
  "skill": {"path": "RESOLVED humanizer/SKILL.md", "sha256": "SOURCE_HASH"},
  "before": "review/scriptwriter-draft.md",
  "audit": "review/scriptwriter-humanizer.md",
  "procedures": ["Actual refinement work performed; cite journal passages"]
}
```

Put this object under `refinement`, not in place of the report. Hash the before
draft, journal and final SCRIPT.md in the existing `outputs` map; list both
review paths in `evidence`. Both stages belong to the same `agent_id`. Record
limitations in the existing field. Mark partial/blocked work honestly; reading
the originals or naming them is insufficient. Source hashes, artifact hashes
and completed statuses establish provenance, not quality or actual delivery.
Director inspects the journal's substantive changes and the full final script.

New or revised script handoffs require this evidence. Unchanged historical
handoffs without `refinement` remain readable only while their original Gate 1
receipt still matches the current approved plan. They do not imply humanizer
ran; a changed plan must supply the new evidence before renewed approval.

### Narrative functions, not five required sections

The audience experiences **Hook → Setup → Rising action / Core value → Climax &
Payoff → Optional CTA**. These functions can overlap within a passage. Merge
setup into the hook or first action when no separate setup is needed; omit the
CTA when it weakens the ending. Do not impose headings, numbered steps, fixed
durations or a dramatic twist on every script.

| Function | Job in an educational script |
| --- | --- |
| Hook | Establish a specific premise and promise derived from the payoff. Open curiosity about the actual subject without withholding basic orientation or inventing a mystery. |
| Setup | Supply only the problem, misconception, prerequisites or friction needed for the next action or explanation. Add context instead of repeating the hook; use stakes only when real. |
| Rising action / Core value | Connect actions, causes or discoveries. Each sentence adds information, a necessary condition or immediate utility. Use concrete examples and verified facts; let difficult ideas breathe. |
| Climax & Payoff | Resolve the question or demonstrate the completed task and success check. A final connection can be the climax; no spectacle is required. The result must follow from the middle, without a generic summary or motivational line. |
| Optional CTA | Add one short related resource or practical next action only when it serves the objective. No forced subscription, like or comment request. Stop on the payoff when it is the stronger ending. |

## Money and earning hooks

Videos about earning with AI may open on a figure, but the first line must be
true and its second line must still make progress. Choose one form and keep its
label honest:

| Form | Example opening | What it may claim |
| --- | --- | --- |
| Rate | "I'd charge $15 for this listing." | A price the creator would ask, not money received. |
| Illustrated example | "One product photo, one $15 listing." | A predicted rate or modeled total for an identified, fictional example; never a completed sale. |
| Own result | "This earned me $15." | Only the creator's real, documented result. Say it is yours, keep the evidence in FACTS.md, and do not extend it to the viewer. |

A figure alone stalls the hook. Pair it with the task or the catch so sentence
two adds information, such as "First, ..." or "The money is in the line the AI
made up." Aim for the number in roughly the first three seconds; this is an
estimate until measured.

A money hook must not promise or imply guaranteed, typical or repeatable income,
and must not present a hypothetical sale, an illustrative demo or an invented
figure as a result the viewer will reproduce. Show costs, fees and workload
separately, and prefer a concrete per-task rate to a vague monthly total. If no
honest figure exists, use a task or problem hook instead.

## Make the middle worth watching

- Build cause and effect: "The copy is old, **but** it may still match the server;
  **therefore** the browser can check without downloading it again." If the
  outline only connects through "and then", find the real dependency. Chronology
  and necessary context are allowed; do not invent conflict to fix a transition.
- Pay curiosity in installments. Reveal a result, demonstrate its cause, then
  uncover a meaningful limit or implication. Do not save the whole explanation
  for the last sentence. Surprise should change the viewer's understanding.
- Use a pattern interrupt when the model changes: the same money becomes a
  smaller percentage base; a request stops at a local copy; a polished answer
  loses its evidence. A short line, reversal or scale comparison can punctuate
  this discovery. Random jokes, glitch cuts and constant shouting add no answer.
- Let humor emerge from the situation or a useful analogy. Avoid generic hype,
  ominous narration, repetitive summaries and "the real secret" transitions.
- Talk to one curious person. Use ordinary verbs, contractions and concrete
  nouns. Mix a short reaction with a longer explanation; avoid identical sentence
  lengths and a rigid word rate. Explain jargon when it unlocks the next step.
  Give difficult numbers breathing room rather than accelerating speech.
- Reject generic AI hype, financial-freedom promises, "What if I told you...",
  polished corporate phrasing, repetitive teasers and motivational endings.
  "Find a profitable niche" or "scale your business" needs a specific action
  and check, or it goes. If a passage fits another topic after swapping a few
  nouns, rewrite the actual mechanism, decision or example. Fragments and
  slogans do not make compressed prose conversational.
- For every sentence, identify its job: direct a necessary action, verify its
  result, advance the causal explanation, create useful curiosity or resolve an
  earlier question. Necessary context and
  qualifications count. Cut lines that do none of these; preserve required scope.
- Describe evidence the picture can establish: before state, trigger, changed
  state. Let a subject, container or destination carry the discovery into the
  next beat. Tutorial narration directs actions; explainer narration explains
  causes. Objects demonstrate; sparse text identifies.
  Plan the teaching action here; Motion Director choreographs and OneTake
  implements its approved timing and moves.

## Teach a person, not a checklist

Quick tutorials need a connected teaching voice. Write as if guiding one beginner
through a task, not reading numbered instructions aloud. Direct instructions still
name the controls and inputs, but the listener should understand where they are,
why the next action matters and how to recognize its result.

- Connect dependent actions through the viewer's current state: "Once you've
  generated the candidates...", "Before you send one...", "After you've checked
  the opening..." or "Then drag the start handle...". Use the connection that fits
  the task; do not prefix every sentence with "then" or "after that".
- Explain the reason for a check or change when it helps the viewer act. Carry
  the result into the next instruction instead of starting a fresh command list.
- Speak warmly to one person. Anticipate a specific beginner uncertainty, offer
  a concrete way to resolve it, and acknowledge visible progress. Avoid scolding,
  repetitive "you have to", generic reassurance or pretending the task is easy.
- Keep the teaching flow when shortening narration. Remove repetition before
  cutting useful connections, reasons or success checks. Do not trade a natural
  explanation for a rapid checklist to meet a runtime target.

Checklist-like: "Generate clips. Review a candidate. Check the original. Trim it."

Connected: "Now you've got some clip candidates. Before sending one to a client,
play it beside the original. You're checking that it still says what the speaker
meant. If the opening needs context, adjust the start before fixing the captions."

This is a teaching example, not a fixed script template. Read adjacent passages
as continuous speech: a useful handoff should remain even when the scene or
`## Line N` changes. Warmth and connection must not replace precise actions,
required qualifications or the finished-result check.

## Endings: payoff first, loop second

| Style | When to choose it | Required finish |
| --- | --- | --- |
| Complete conclusion | A finite result, misconception or practical mental model | Resolve the opening promise with a specific, memorable takeaway. Stop without an unnecessary summary or promotion. |
| Seamless verbal loop | The explanation naturally returns to its starting idea | Deliver the payoff, then write final words and opening sentence as one continuous passage. Grammar, referents and meaning must work across replay, without a repeated redundant conclusion. |
| Visual loop | A cycle or reusable object can return to its opening composition | Finish the narration normally. Plan how the same subject and camera return to the opening visual state; the spoken ending need not lead into the first sentence. |

A conceptual callback can make the opening mean something new on replay without
being an exact verbal splice. Name it honestly; do not call it a seamless verbal
loop unless the spoken boundary works.

Test the **final two sentences** against the opening promise. If choosing a
verbal loop, concatenate the exact final sentence and opening sentence,
including punctuation. Record that seam verbatim in unspoken
notes: what does each connector or pronoun refer to, and what causal/contrast
link makes this continuing speech rather than a closing speech plus a restart?
Both ends must also work on a first viewing; do not add "so" or "but" just to
claim a loop. Reject dangling "because", forced questions, unexplained "this",
repeated identical conclusions, or an answer that only exists on replay.
Do not withhold the payoff to manufacture another view. Fall back to a complete
conclusion when the loop adds nothing. A useful next action may follow once;
omit generic sign-offs and engagement requests.

For a loop, add a seam note to STORYBOARD.md: final spoken words / opening words,
or final / opening visual states, carrying subject, and reset action. For a visual
seam compare object IDs, positions, scale, camera, labels and logical state.
Trace every changed state through an explained action or elapsed time. Returning
to the same picture is insufficient if an expired copy silently becomes fresh.
A reset must not imply a false event (for example, restoring an investment loss).
Gate 1 judges the planned seam; actual audio and visual continuity are checked
in the complete preview after measured narration, before Gate 2. Never rush or
clip a final word, useful hold or required explanation to make the loop fit.

## Review before presenting Gate 1

Quote the weakest passage, diagnose its specific problem, rewrite it, and record
what changed. A list of "ready" labels or a numerical verdict is not evidence.

| Check | Evidence to inspect / repair |
| --- | --- |
| Video type and payoff | State tutorial or explainer and the specific outcome defined before hooks. For tutorials, can a beginner repeat the actions with the shown inputs, prerequisites and success check? For explainers, can they describe the mechanism and its limits? Repair vague outcomes and mixed promises. |
| Hook and first three seconds | Quote the first two sentences and name the immediate visual. What specific task, result, mechanism question or observation makes the second sentence useful? Surprise is optional. Reject vague topic announcements. Tutorials should begin useful instruction promptly. For money hooks, state which form it is (rate, labeled example or the creator's own evidenced result) and confirm the figure is not presented as typical or guaranteed income. Timing is an estimate until measured. |
| Promise and progression | Trace the selected hook to the planned payoff and quote the setup's new information. Follow required actions or causal links to that outcome. Repair missing steps, delayed instruction, repeated openings, shallow middles or unrelated theory. Narrative functions can share a passage. |
| Natural narration | Read the text aloud without synthesis, or mark breath groups and awkward phrasing in a text-only pass. Read adjacent passages together: does this sound like guiding one beginner, or isolated commands? For tutorials, show the viewer's current state, why the next action matters and how to recognize success at useful handoffs. Repair robotic lists and repetitive connectors without losing exact controls. Vary rhythm; record which review actually happened. |
| Specificity and naturalness | Could this script fit another topic with minor word changes? Quote and replace the generic passage with a concrete example, decision or causal detail. Reject structurally correct scripts that still sound robotic, repetitive or unsatisfying. |
| Visual storytelling | Name a visible cause/result and carry for each beat. Replace text-only explanation with an observable action or comparison; keep comprehension holds. For each proposed text label, state its teaching job or remove it. |
| Accuracy and clarity | Trace factual lines and the hook to FACTS.md. Check numbers, conditions, jargon and analogy limits; distinguish evidence, hypothesis and illustration. |
| Final payoff and outro | Quote the final two sentences and the earlier discovery that earns them. Does the specific result fulfill the opening promise on first viewing? Cut redundant summaries, generic advice and unrelated claims. Include a CTA only with a clear purpose. |
| Loop, if selected | Quote the actual end + start or compare visual states. Diagnose dangling syntax, awkward repetition, false resets or missing answers; otherwise choose a complete conclusion. |

Revise each weak section and inspect the changed passage with its neighbors.
Present only the revised draft, with brief review evidence and material limits.
This script review does not approve TTS, animation or rendering.

When evaluating a guide change, compare **complete scripts** using identical
topics, audience, factual constraints and visual possibilities; preserve the
actual baseline, not a weaker reconstructed outline. Mask guide labels and vary
pair order for an independent reviewer when available. Report whether that
review actually occurred; author review is not blind. Include counterexamples
for flat hooks, misleading gaps, unfinished payoffs and broken seams, with
specific corrections. Text checks can expose these failures, not prove retention.

Finance: keep percentage bases, periods, fees and hypothetical assumptions
explicit where material; avoid promised returns or personalized recommendations.
Technology: state when the mechanism applies and where the analogy stops.
AI: distinguish generated language from verified evidence, model capability from
product/tool behavior, and research explanations from universal causes. Verify
time-sensitive claims against current primary sources before each new script.

Keep SCRIPT.md's contiguous `## Line N` headings and four-space-indented spoken
paragraphs. Hook alternatives, review notes, display labels and production cues
stay **unindented** so the existing TTS parser never speaks them.

See [SCRIPT_TESTS.md](SCRIPT_TESTS.md) for the three-topic writing trial and its
limits. These examples demonstrate decisions; do not reuse them as a fixed voice.
