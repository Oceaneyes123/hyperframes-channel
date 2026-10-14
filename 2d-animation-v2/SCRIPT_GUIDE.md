# Storytelling for Finance, Technology and AI Shorts

This is V2's single source of truth for storytelling, hook selection, narration,
endings and script review. AGENTS.md owns production, accuracy records and approval
gates; the installed OneTake skill owns motion. Use this guide before drafting.
The aim is a task the viewer can complete or a mechanism they can understand.

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
  as a concrete surprise in the first spoken sentence and opening picture, with
  the reason to watch apparent within 1–3 seconds. Prefer discovery over shock.
- [Hoyos on causal storytelling](https://www.linkedin.com/posts/jennyhoyos_the-most-misunderstood-skill-that-separates-activity-7464706854963720192-akRj)
  uses the **But → Therefore** principle: a change creates a consequence that
  drives the next beat. For education, the obstacle can be a mistaken expectation
  or a real constraint; never manufacture danger. These are logical links, not
  words to repeat in every sentence.
- [Andrew Stanton's TED talk](https://www.ted.com/talks/andrew_stanton_the_clues_to_a_great_story)
  describes working backward from the ending. Write the payoff alongside the
  hook so the opening promises something the explanation actually delivers.
- [Gruber, Gelman and Ranganath's curiosity study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4252494/)
  found memory benefits in a trivia-learning experiment during high curiosity.
  Adapt this as a specific missing explanation, then reveal enough to let the
  viewer understand the answer. This was not a Shorts retention experiment.

Creator practices are useful craft evidence, not controlled proof of engagement.
The workflow below is our adaptation, not a creator's signature voice or formula.
Neither a checklist nor a score guarantees views, retention or learning.

## Optional skill inputs

`viral-hooks` and `viral-short-form` were not found in the standard user skill
folders on 2026-10-10 and are not in this session's skill catalog. Their upstream
[hook skill](https://github.com/vyralcontent/content-skills/blob/main/skills/viral-hooks/SKILL.md)
and [script skill](https://github.com/vyralcontent/content-skills/blob/main/skills/viral-short-form/SKILL.md)
were inspected. We adapt varied angles, spoken/visual alignment and pinpointed
critique of a weak opening, stalled middle or buried payoff. If installed later,
consult them as optional idea/critique inputs; this guide remains the authority.
If unavailable, continue here without installation or another required document.
Do not import mandatory CTAs/captions, creator imitation, invented credentials,
algorithm guarantees, fixed cuts or removal of useful breaths and holds.

## Before the full script

1. **Find the task or discovery.** Research the topic first. For a tutorial,
   identify one reproducible task, starting requirements, exact result and
   success check. Build the outline around completing it, without requiring a
   surprise or withholding instructions. For an explainer, write the audience's
   likely expectation, the surprising fact or mechanism, its conditions, and one useful
   takeaway. Choose a concrete example that makes the difference visible. If the
   surprise needs an exaggerated claim, choose another angle.
2. **Generate at least three distinct hooks.** For a tutorial, compare accurate
   result-first, problem-first or before/after openings for the same task. Start
   the demonstration promptly; do not add a mystery before the instructions.
   For an explainer, change the premise, not just the wording: an observed
   contradiction, a relatable moment with a hidden cause,
   or a prediction the viewer can test against a visible result. Include an
   opening picture for each: which expectation does it establish or break?
   Name the subject early. An accurate fact announcement is not enough: show
   what is odd, missing or personally recognizable about it.
   A question is useful only when specific and answerable; skip generic "Did you
   know?", "What if AI changes everything?" and "You won't believe this."
3. **Compare, then select.** Use one compact table in SCRIPT.md's unspoken notes:

   | Angle + spoken hook | Reason to continue / next sentence | Clarity | Originality | Accuracy | Opening picture |
   | --- | --- | --- | --- | --- | --- |
   | Distinct premise, exact words | What must I hear next, and what does sentence two add? | Understood without setup | Topic-specific angle | Supported, with essential conditions | Visible expectation, contradiction or result |

   Give short reasons, not arbitrary points. Reject misleading hooks regardless
   of their other strengths. Judge the **first two sentences together**: the
   first establishes a specific task or itch; the second makes progress rather
   than defining the topic or repeating the tease. Ask "Why hear the next sentence?" If the
   answer is only "to learn about caching/AI/finance", rewrite the angle. Prefer
   the strongest accurate task promise or observation plus its visible evidence,
   not merely the shortest or safest-sounding fact. Explain the selection's
   tradeoff in one sentence. Estimate whether its result or curiosity lands in 1–3
   seconds at a comfortable pace; shorten or move the reveal earlier if needed.
   Do not claim measured timing before TTS.
4. **Pair hook and payoff.** Write the opening promise and final answer together.
   Choose an ending style below. The takeaway must be earned by the mechanism,
   understandable on a first viewing and still useful without replay.
5. **Connect the actions or discoveries.** For a tutorial, order the necessary
   actions by their dependencies, then verify the result. For an explainer,
   outline what the viewer expects, what changes that expectation, what follows, and the qualification
   that makes the answer true. Each discovery should answer something and, when
   useful, expose the next specific question. Keep one main unresolved question;
   do not stack unrelated mysteries or delay the basic answer with teasing.
6. **Draft and revise.** Write the explanation between the chosen opening and
   payoff. Map required facts to lines and storyboard evidence. Complete the
   review below before Gate 1. Hook candidates are a writing choice made by the
   writer, not an extra approval gate; OneTake's visual concept selection remains.

Keep the selected hook/payoff, ending choice and brief review in existing
SCRIPT.md notes. No separate hook report, scoring system or new production file.

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
- For every sentence, identify its job: direct a necessary action, verify its
  result, advance the causal explanation, create useful curiosity or resolve an
  earlier question. Necessary context and
  qualifications count. Cut lines that do none of these; preserve required scope.
- Describe evidence the picture can establish: before state, trigger, changed
  state. Let a subject, container or destination carry the discovery into the
  next beat. Tutorial narration directs actions; explainer narration explains
  causes. Objects demonstrate; sparse text identifies.
  Plan the teaching action here; OneTake chooses its choreography and timing.

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

Test the **final two sentences**, then concatenate the exact final sentence and
opening sentence, including punctuation. Record that seam verbatim in unspoken
notes: what does each connector or pronoun refer to, and what causal/contrast
link makes this continuing speech rather than a closing speech plus a restart?
Both ends must also work on a first viewing; do not add "so" or "but" just to
claim a loop. Reject dangling "because", forced questions, unexplained "this",
repeated identical conclusions, or an answer that only exists on replay.
Do not withhold the payoff to manufacture another view. Fall back to a complete
conclusion when the loop adds nothing. No "like and subscribe" or generic outro.

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
| Video type and viewer outcome | State tutorial or explainer and its promise. For tutorials, can a beginner repeat the actions with the shown inputs, prerequisites and success check? For explainers, can they describe the mechanism and its limits? Repair mixed promises. |
| Hook and first three seconds | Quote the first two sentences and name the immediate visual. What specific task/result or surprising observation makes the second sentence useful? Reject vague topic announcements. Tutorials should begin useful instruction promptly. For money hooks, state which form it is (rate, labeled example or the creator's own evidenced result) and confirm the figure is not presented as typical or guaranteed income. Timing is an estimate until measured. |
| Progression | For tutorials, trace required actions to the result and success check; repair missing steps, delayed instruction or unrelated theory. For explainers, name the opening question and the discoveries that answer it; repair a stalled middle, redundant tease or unresolved promise. |
| Natural narration | Read the text aloud without synthesis, or mark breath groups and awkward phrasing in a text-only pass. Read adjacent passages together: does this sound like guiding one beginner, or isolated commands? For tutorials, show the viewer's current state, why the next action matters and how to recognize success at useful handoffs. Repair robotic lists and repetitive connectors without losing exact controls. Vary rhythm; record which review actually happened. |
| Visual storytelling | Name a visible cause/result and carry for each beat. Replace text-only explanation with an observable action or comparison; keep comprehension holds. |
| Accuracy and clarity | Trace factual lines and the hook to FACTS.md. Check numbers, conditions, jargon and analogy limits; distinguish evidence, hypothesis and illustration. |
| Final payoff | Quote the final two sentences and the earlier discovery that earns them. Is the opening question answered without replay, generic advice or an unrelated new claim? |
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
