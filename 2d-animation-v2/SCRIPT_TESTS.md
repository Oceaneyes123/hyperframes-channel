# Paired script trial and seam checks

Text-only revision, 2026-10-10. [SCRIPT_GUIDE.md](SCRIPT_GUIDE.md) owns the rules.
Baseline: the three complete drafts previously generated under the guide,
preserved verbatim below. Revised drafts use the same topics, beginner audience,
English voice, factual scope and sparse causal visual options.

| Shared brief | Required facts / boundaries for both versions |
| --- | --- |
| Finance: a 50% loss followed by a 50% gain | Hypothetical 100 → 50 → 75; changed percentage base; doubling 50 restores 100; ignore fees/deposits; no return prediction or investment advice. |
| Technology: reuse of one HTTP image | Local cache; permitted freshness/reuse; expiry does not delete the copy; validator/check, unchanged 304 versus a changed image; no claim about all pages or reload policies. |
| AI: a fabricated citation | Plausible format is not evidence; learned text patterns; imaginary right=1, wrong/abstain=0 quiz; guessing incentives are one contributor; verify existence and support; no claim of deceptive intent. |

Pair IDs conceal provenance and order varies by topic. A reader can review the
scripts with this brief before looking at the key. **The author knew provenance:**
the critique below is not an independent blinded review or a controlled test of
the guide alone. No independent reviewer or audience experiment was used.
Changes include deliberate editorial revision; they cannot establish that the
guide alone caused better scripts. No measured timing or retention claims.

## Finance pair

### F1

~~~markdown
# Recovering a loss

## Line 1
    Lose half. Now you need double.

## Line 2
    Start with a hundred dollars. Ignore fees and deposits for this example. Your investment drops to fifty. You lost fifty percent.

## Line 3
    Then it gains fifty percent. Back to a hundred? Nope. Half of fifty is twenty-five. You're only at seventy-five.

## Line 4
    The percentage is working from a smaller pile now. To get from fifty back to a hundred, you need another fifty. That's a hundred-percent gain on what's left.

## Line 5
    So losing half and gaining half don't cancel. The starting pile changed. To recover this loss, the remaining money has to double.
~~~

### F2

~~~markdown
# The rebound that leaves you down

## Line 1
    So you're up fifty percent—and still down.

## Line 2
    Say your hundred dollars drops to fifty, with no fees or deposits. Then it gains fifty percent. Back to a hundred?

## Line 3
    But that gain is half of what you have now, not what you started with. Half of fifty is twenty-five.

## Line 4
    Add it, and you land at seventy-five. The rates matched. The dollars didn't.

## Line 5
    Getting from fifty back to a hundred needs another fifty: a hundred-percent gain on what's left. You need to double it.

## Line 6
    Same rates, different starting piles. Your fifty-percent rebound only got you to seventy-five.
~~~

## Technology pair

### T1

~~~markdown
# The expired image worth keeping

## Line 1
    This expired image can save another download.

## Line 2
    Your browser kept a copy in its cache. Its one-minute reuse timer ran out. Throw it away? Not yet.

## Line 3
    It saved a version tag too, so it can ask the server, "Still the same image?"

## Line 4
    If the versions match, the server replies, "Not Modified." A tiny reply travels back. The image doesn't.

## Line 5
    If it changed, the server sends the new image instead. And while a copy is fresh, the rules can let your browser reuse it without even asking.

## Line 6
    So expiry doesn't always mean "download again." Sometimes it means "check what you've already got."
~~~

### T2

~~~markdown
# Skipping a download

## Line 1
    Your browser can skip the download.

## Line 2
    Say it already saved an image. That's a cache: a stored response it can reuse. The server's rules can let that image stay fresh for a minute.

## Line 3
    Ask for it again while those rules allow reuse, and the browser can use its copy. No second download.

## Line 4
    But when that freshness expires, the copy isn't automatically deleted. The browser can ask the server whether it changed.

## Line 5
    If it hasn't, a tiny reply says, "Not Modified." The image stays put. If it has changed, the server sends the new one.

## Line 6
    So a cache isn't just a pile of old files. It's a way to reuse a response when the rules allow—and sometimes check without downloading it all again.
~~~

## AI pair

### A1

~~~markdown
# A convincing citation

## Line 1
    An AI can invent a convincing citation.

## Line 2
    Title. Authors. A year. It looks like a paper. But looking like a paper doesn't make it exist.

## Line 3
    A language model learns patterns in text. Those patterns can produce something plausible without making it true.

## Line 4
    Picture a quiz: a correct answer gets a point. A wrong answer gets zero. "I don't know" also gets zero. Guessing can sometimes win; admitting uncertainty never does.

## Line 5
    Training and evaluation incentives can encourage guesses like that. That's one reason a fluent answer can be false.

## Line 6
    Check whether the source exists and actually supports the claim. A convincing citation can still be fiction. Polish isn't proof.
~~~

### A2

~~~markdown
# The paper behind the citation

## Line 1
    But a fake AI citation can look real.

## Line 2
    Imagine a title, two authors and a year. It has all the familiar details—except an actual paper behind it.

## Line 3
    A language model learns patterns in text. It can produce the shape of a citation without a source that matches.

## Line 4
    Now picture a quiz. Right answers get a point. Wrong answers and "I don't know" both get zero. A lucky guess can win; admitting uncertainty can't.

## Line 5
    Training and evaluation can reward guesses like that. It's one reason models produce false answers.

## Line 6
    Find the source, then check whether it supports the claim. A title and a date don't prove a paper exists.
~~~

## Hook choices: distinct premises, not synonyms

Each candidate pairs words with a picture. The notes explain curiosity,
accuracy, visual evidence, clarity and originality rather than assigning scores.
These notes are unspoken.

| Topic / angle | Candidate and critique |
| --- | --- |
| Finance / result contradiction | **Selected:** "So you're up fifty percent—and still down." Why both? The next line supplies the loss. Applies after a 50% loss, not every gain. Picture: a rising balance stops at 75 below the original 100. Familiar dashboard result makes the contradiction visible. |
| Finance / prediction experiment | "A hundred loses half, then gains half. Where does it land?" Predict the result of hypothetical arithmetic. Picture: coins regrow toward a fixed target. Concrete, but setup delays the surprising observation. |
| Finance / same amount, different base | "The same fifty dollars can be half your money—or all of it." Which starting pile? Compare 100 with 50; show the same coins against two piles. Distinct denominator angle, but "all" needs more explanation. |
| Technology / expiry contradiction | **Selected:** "This expired image can save another download." Why keep it? The next line brings the timer into the story. Requires a stored copy/validator and unchanged server version. Picture: expired timer, intact image, tiny reply path. |
| Technology / relatable wait | "You reopened the page, but this image didn't make another trip." Where did it come from? One reusable response, not the entire page. Picture: local image beside an idle network path. Familiar, but longer; expiry arrives later. |
| Technology / prediction experiment | "Keep this expired image or fetch a new one?" Decide before the server check; neither is always right. Picture: same image at a fork. Clear choice, but hides the surprising outcome. |
| AI / appearance contradiction | **Selected:** "But a fake AI citation can look real." What makes fake evidence convincing? The next line isolates title/authors/year. Hypothetical citation, not an observed test. Picture: citation-shaped object with no source behind it. |
| AI / relatable request | "You asked AI for proof. It gave you a paper that doesn't exist." How did that happen? Hypothetical, not every answer. Picture: proof request becomes a mock citation. Familiar, but the second sentence carries the hook. |
| AI / inspection experiment | "Which detail makes this made-up paper feel real?" Inspect title, names and year; mock prop, not a measured credibility result. Picture: details assemble around an empty source slot. Participatory, but "feel real" is subjective. |

Selection follows the observation plus next-sentence progress, not word count.
The finance and AI connectors also serve the spoken seams below; remove them
if the ending changes. Interest must begin in the opening picture and sentence.
Whether the whole phrase lands within three seconds requires actual narration
timing; no artificial speech acceleration is justified.

## Paired critique and corrections

| Dimension | Finance: F1 versus F2 | Technology: T2 versus T1 | AI: A1 versus A2 |
| --- | --- | --- | --- |
| Opening / next sentence | F1 "need double" announces the solution before the puzzle. F2 presents the rising-yet-below-start result, then supplies the loss. F2 needs the visible 100/75 anchor so "down" is unambiguous. | T2 "skip the download" is an ordinary benefit; its next sentence defines a cache. T1 makes expiry the problem, then questions deletion. T1 needs an obviously expired timer, not merely an old-looking picture. | A1 announces an AI capability. A2 puts fake versus credible in tension, then exposes familiar details. "Imagine" must remain so it does not claim an experiment. |
| Curiosity progression | Both explain the changed base. F2 reaches the mistaken cancellation expectation sooner and shows unequal dollars before full recovery. No invented threat. | T2's expiry discovery waits until L4. T1 starts there; the check produces the small-reply/big-image reversal in L4, then covers changed and fresh branches. | Both have patterns and a quiz. A2 ties the middle to citation format; the quiz remains a possible incentive, not a complete theory of every error. |
| Conversational flow | F1 gives a separate "Ignore fees" instruction. F2 embeds the assumption in the example and follows the calculation with "The rates matched. The dollars didn't." Numbers still need breathing room. | T2's ending defines a cache again. T1's "A tiny reply travels back. The image doesn't." makes the reveal audible. "Version tag" is explained through its role. | A1 repeats "convincing citation" at the end. A2 ends with a source test and reason. L3 is still expository; keep the citation shape visible so it does not become a disconnected model lecture. |
| Visual story | Carry the same pile and original target. F2 starts with 75, then demonstrates the example; 100 stays a labeled target, not a recovered balance. | Carry the image through expiry, version comparison and 304. Its clock must advance honestly to close the visual loop. | Carry the mock citation through shape-building, illustrative scoring and source inspection. No fake URL or invented result presented as a sourced fact. |
| Payoff / loop | F1 concludes correctly but has no tested verbal seam. F2 delivers doubling before the 75 result feeds the opening's "So" without a hanging clause. | T2 has a valid conclusion but its old loop starts fresh. T1 opens expired; returning fresh would fail. Correction: visibly age the validated copy back to expired after the payoff. | A1's "Polish isn't proof" is useful but standalone. A2 supplies the evidence test, then a complete statement that the opening's "But" contrasts with. |

The revised drafts are preferred on these specific textual grounds. This is
editorial judgment, not audience preference. During revision, appending a loop
phrase felt bolted on; the final drafts instead pair the opening connector with
a completed causal/contrast statement. No dangling "because" was retained.

## Two complete verbal-loop seam checks

**Finance F2:** L5 already explains doubling to recover one hundred. Exact seam:

> Your fifty-percent rebound only got you to seventy-five. So you're up fifty percent—and still down.

Both sentences are complete. "So" follows from 75 being below the original 100;
"up" refers to the gain from 50 and "down" to the loss from 100. This is a causal
continuation, not a hanging clause or identical sentence repeated. The opening
picture supplies the comparison and L2 supplies setup; no answer requires replay.
Do not reset the actual balance to 100 to make the picture repeat.

**AI A2:** the source existence/support test is delivered before the seam:

> A title and a date don't prove a paper exists. But a fake AI citation can look real.

Both sentences are complete. "But" contrasts lack of proof with credible
appearance, not deliberate intent. Keep the same mock citation visible. The
opening is an apparent contradiction; "Imagine" identifies the example on first
viewing. Nothing depends on replay to finish the explanation.

These are text joins, not audio edits: pitch, breath, final-word decay and playback
continuity remain untested. If the voice sounds like a stop and restart, revise
delivery/wording under the existing gates or choose a complete conclusion.
Do not truncate the payoff to hide a cut.

## Visual-loop seam check: Technology T1

A planned state trace, not generated animation. Persistent objects: image-1,
browser-store, server, age-ring. Camera and object positions/scale match at
the seam. Opening and final composition: same image/ETag, timer at its 60-second
limit, "Expired" label, network path idle. No transient request/reply remains on
either seam frame; the next check starts afterward.

| State | Copy / version | Age and permission | Explained transition |
| --- | --- | --- | --- |
| Opening | image-1 / v1 | 60 seconds, stale | Saved copy's one-minute freshness has expired. |
| Check | same image / v1 | Still stale | Browser sends its validator; server's v1 is unchanged. |
| After 304 | same image / v1 | Fresh; example response supplies current Date, Age 0 and max-age=60 | 304 updates cache metadata; the image body never transfers. |
| Closing hold | same image / v1 | Advance from fresh to 60 seconds, stale again | After the spoken payoff, show a time-passage cue and the age ring filling. No silent jump or falsely expired fresh copy. |
| Seam | same image / v1 | Same stale state as opening | Same camera, geometry, labels and idle path; no teleport, erased age or fictitious content change. |

The changed-image branch is a comparison, not applied to image-1 before the
seam. Source stays v1 on the loop's actual branch. The clock shows age since
validation, not an absolute clock rewound on replay. Metadata renewal and aging
explain the return; matching geometry alone would not. The time cue may cost
runtime: preserve it or choose a complete conclusion. No pixel seam was tested.

## Counterexamples that must fail review

| Failure fixture | Specific failure | Correction demonstrated above |
| --- | --- | --- |
| "Today we're learning how browsers work." | Flat announcement; no missing explanation worth the next sentence. | T1 opens on useful expiry, not the subject category. |
| "This expired image never needs downloading again." | Promises permanent reuse, ignoring changed content. | T1 L5 includes the changed-image branch; L1 says "can". |
| "A fifty-percent rebound fixes any loss." | Wrong percentage base; 50 → 75 does not recover 100. | F2 computes 25 gained and 100% needed for 50 → 100. |
| "AI deliberately makes up every citation." | Unsupported intent and universal claim. | A2 uses a hypothetical possibility and qualified incentive explanation. |
| Ending: "Now you know how AI works." | Generic conclusion; citation puzzle unresolved. | A2's final two sentences require source existence and support. |
| Ending: "The rates differ, because" / opening: "So you're up fifty percent..." | False explanation plus dangling syntax; replay does not repair it. | F2 ends at 75; rates match and bases differ. |
| Ending and opening both: "Polish isn't proof." | Repeated slogan, no continuing thought. | A2 uses two distinct complete statements about proof and appearance. |
| Expired → fresh at the seam, no server reply | Unexplained logical reset. | T1 requires unchanged validation, then explicit aging back to stale. |
| 75 → 100 solely to match the opening | Unearned financial recovery. | F2 loops speech, not the balance; 100 remains a target. |

These checks expose concrete errors, not a numerical engagement score. No parser
can certify natural delivery or curiosity.

## Provenance, sources and validation

Key: F1/T2/A1 are the preserved previous drafts; F2/T1/A2 are revised drafts.
The baseline drafts are complete, not weakened reconstructions.

Finance arithmetic: 100 × 0.5 = 50, 50 × 1.5 = 75, (100 − 50) / 50 = 1.
Caching uses [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
and [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html), including validator
metadata and freshness rules. Freshness permits reuse; it does not guarantee
unchanged origin content. AI uses the
[hallucination research explanation](https://openai.com/index/why-language-models-hallucinate/)
and [research paper](https://arxiv.org/abs/2509.04664). The quiz is an illustration,
not an observed model test or the only source of hallucination.

Checks passed: all six drafts parse with the existing narration parser; the
three baseline drafts match their previous versions exactly; both quoted verbal
seams match the final/opening spoken lines. Arithmetic, local document links,
UTF-8 and whitespace checks pass. Only four V2 Markdown files changed; channel
adaptations, OneTake production, TTS, gates and runtime contracts are unchanged.
No blinded independent review, synthesized speech, rendered seam or audience
retention test was performed. These drafts/checks are not Gate 1 approvals.
