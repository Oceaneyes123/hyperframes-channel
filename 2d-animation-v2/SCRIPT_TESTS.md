# Scriptwriting trials: historical baselines and payoff-first revisions

The 2026-10-19 trial below uses the complete F2, T1 and A2 drafts as its actual
before versions. The six historical drafts and their earlier critique remain
verbatim for provenance. Start at [the current trial](#payoff-first-trial-2026-10-19)
for the revised workflow evaluation. These are writing samples, not approved
production inputs.

## Historical trial: 2026-10-10

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

Historical checks recorded on 2026-10-10: all six drafts parsed with the existing narration parser; the
three baseline drafts match their previous versions exactly; both quoted verbal
seams match the final/opening spoken lines. Arithmetic, local document links,
UTF-8 and whitespace checks pass. Only four V2 Markdown files changed; channel
adaptations, OneTake production, TTS, gates and runtime contracts are unchanged.
No blinded independent review, synthesized speech, rendered seam or audience
retention test was performed. These drafts/checks are not Gate 1 approvals.

## Payoff-first trial: 2026-10-19

Use the same shared briefs, beginner audience, factual scope and available visual
actions as above. Before versions are **F2, T1 and A2**, not reconstructed weak
scripts. After versions are F3, T3 and A3 below. All are explainers: the usable
check at the end follows the mechanism rather than changing the promise into a
complete tool tutorial. Each new draft ends on its payoff; none needs a CTA or
loop. The narrative functions share passages instead of occupying five blocks.

### Planning before choosing hooks

| Topic | Viewer payoff fixed first | Evidence chain needed to earn it |
| --- | --- | --- |
| Finance | Explain why a 50% rebound fails to recover a 50% loss, and why the remaining 50 must double to restore 100. | Hypothetical 100 → 50; 50% of the new 50 is 25; balance 75; recovering 50 → 100 requires gaining 50 on a base of 50. Exclude fees/deposits. |
| Technology | Explain how an expired stored image can be reused after validation, and when a new body is needed. | One permitted fresh local copy; expiry leaves it stored; version-tag check; unchanged 304 reuses it; changed image requires its replacement. No claim about every request/reload. |
| AI | Explain why a plausible citation can be false and distinguish verifying a paper's existence from verifying its support for a claim. | Hypothetical citation; learned text patterns can produce its form; an illustrative quiz shows one guessing incentive; return to locating and reading the source. No intent or universal-cause claim. |

Original skill execution for these text samples: intake uses the shared briefs
and an educational goal of understanding the mechanism, with a conversational
tone. The installed SKILL.md and required patterns.md were read. Five distinct
hooks per topic below use its levers; selection considers its checklist with
the channel's accuracy, optional text, no artificial tension and no mandatory
bookend/CTA adaptations. Each candidate promises the payoff above.

### Hook comparison and selection

Levers retain the original skill's names. These are unspoken writing notes.
Each picture uses the same available objects as its baseline, rather than
giving the revision a richer visual budget. Proposed text is **none**, except
the Finance balances and the Technology status value where those aid comparison.
No captions or repeated narration are proposed.

| Topic / angle | Spoken candidate and levers | Opening picture; reason to select or reject |
| --- | --- | --- |
| Finance / recovery question **selected** | "You lost half. Would a fifty-percent gain get it back?" Curiosity gap + relatability. | Same hypothetical 100/50 pile and original target. Direct prediction the calculation answers; next sentence sets assumptions. "You" is the example, not a claim about an actual viewer loss. |
| Finance / disappointing rebound | "A fifty-percent rebound can still leave you short." Pattern + surprise; curiosity gap. | Same balance grows below 100. Accurate but "short" needs the loss stated sooner. |
| Finance / changing base | "Half of a hundred and half of fifty are different amounts." Pattern + surprise; curiosity gap. | Same piles compared. Concrete, but announces arithmetic before its recovery consequence. |
| Finance / stalled balance | "Your balance rose from fifty to seventy-five. Why are you still down?" Relatability + curiosity gap. | 75 beside original 100 target. Names the comparison but takes longer to establish it. |
| Finance / recovery obstacle | "After losing fifty dollars, how much growth would your remaining fifty need?" Conflict engine + curiosity gap. | Same 50 pile below 100 target. Real gap, but a denser first sentence. |
| Technology / expired copy **selected** | "Your browser can reuse an expired image without downloading it again." Pattern + surprise; curiosity gap. | Same stored image beside expired timer. Specific question for the middle: what lets that copy be reused? Next sentence establishes the reuse permission. |
| Technology / familiar revisit | "You reopen a page. Its saved image may need a check before it needs a download." Relatability + curiosity gap. | Same browser/store path. Familiar action, but request policy adds more setup. |
| Technology / conditional reply | "The server can reply about an image without sending the image." Pattern + surprise; curiosity gap. | Same reply path and stored image. Accurate, but less clear why the browser asked. |
| Technology / deletion assumption | "The image expired. Should your browser throw its copy away?" Relatability + curiosity gap. | Same timer and intact image. Specific, but emphasizes deletion over useful reuse. |
| Technology / comparison | "One image request brings back an image. Another brings back a status." Pattern + surprise; curiosity gap. | Same path with two possible replies. Needs cache setup before the difference makes sense. |
| AI / unusable citation **selected** | "An AI can give you a paper title that leads nowhere." Relatability + curiosity gap. | Same mock citation and empty source slot. Establishes the evidence problem; the next sentence marks the example hypothetical. |
| AI / evidence check | "Before you cite an AI answer, can you find the paper behind it?" Relatability + curiosity gap. | Same citation inspected. Useful, but opens as a verification task rather than a mechanism question. |
| AI / citation appearance | "A title, two authors and a year can belong to a made-up paper." Pattern + surprise; curiosity gap. | Same citation details assemble. Concrete but heavier list in the first breath. |
| AI / scoring incentive | "On a quiz that gives no points for uncertainty, a guess can score better." Conflict engine + pattern/surprise. | Same illustrative quiz. True within that toy scoring rule, but starts away from the citation promise. |
| AI / unsupported evidence | "You ask AI for a source. Could its citation need checking too?" Relatability + curiosity gap. | Same citation and source slot. Clear, but the selected version names the actual failure sooner. |

Selection favors an explicit recovery question, a concrete expired-copy premise
and a missing-source problem. Each next sentence adds the example's conditions.
The opening premise should arrive within roughly 1–3 seconds; whole-sentence
duration is unmeasured. No fixed 5–15-second introduction or accelerated speech.

### F3

~~~markdown
# Why the rebound falls short

## Line 1
    You lost half. Would a fifty-percent gain get it back?

## Line 2
    Say you started with a hundred dollars, which fell to fifty. We'll leave out fees and deposits.

## Line 3
    A fifty-percent gain now adds half of fifty: twenty-five dollars. That puts you at seventy-five.

## Line 4
    The gain starts from the smaller balance. You're still twenty-five dollars below your original hundred.

## Line 5
    To recover from fifty to a hundred, you'd need another fifty dollars. That's a hundred-percent gain on the fifty you have left. When comparing a loss and a gain, check the dollar amount each percentage starts from.

Narrative review: Hook L1; setup L2; core value L3–4; recovery payoff and usable comparison check L5. No CTA or loop. Original target stays visible while the same balance changes. Only necessary balance/percentage values appear as text.
~~~

### T3

~~~markdown
# Reusing an expired image

## Line 1
    Your browser can reuse an expired image without downloading it again.

## Line 2
    Say it saved an image the server allowed it to reuse for a minute. During that minute, it can use the saved copy without asking again.

## Line 3
    When the minute runs out, the copy can still be there. In this example, the browser saved a version tag with it.

## Line 4
    It sends that tag to the server to check whether the image changed. If it hasn't, the server replies, "304, Not Modified," and the browser reuses its copy.

## Line 5
    If the image has changed, the server sends the new one instead.

## Line 6
    So an expired image can still be useful: a check can confirm it's reusable and save downloading the image again.

Narrative review: Hook L1; setup and fresh reuse L2; expiry/check/outcomes L3–5; answer L6. No CTA or loop. Carry the same image through the check; compare the changed-image branch without a silent reset. Text: only 304 if needed to identify the reply, not spoken sentences.
~~~

### A3

~~~markdown
# Checking the paper behind an AI citation

## Line 1
    An AI can give you a paper title that leads nowhere.

## Line 2
    Imagine it gives you a title, two authors and a year. You search for the paper, but can't find it.

## Line 3
    A language model learns patterns in text. It can generate a citation in the right format without having checked that the paper exists.

## Line 4
    Picture a quiz: a right answer gets a point. Wrong answers and "I don't know" both get zero. A lucky guess can score more than admitting uncertainty.

## Line 5
    Training and evaluation incentives can favor guesses like that. That's one contributor to false answers, including plausible citations.

## Line 6
    Look for the paper on its publisher's site. If you find it, open it and check that it supports the claim before you cite it. If either check fails, leave that claim out.

Narrative review: Hook L1; hypothetical problem L2; patterns and one illustrative guessing incentive L3–5; separate existence/support checks L6. No CTA or loop. A failed search alone does not prove nonexistence. Carry the same mock citation into source inspection; no extra explanatory overlay.
~~~

### Concrete before-and-after judgments

| Dimension | Before, quoted from actual baseline | After and reason |
| --- | --- | --- |
| Finance opening | F2: "So you're up fifty percent—and still down." | F3 asks whether a 50% gain restores the loss. It stands alone on first viewing and gives the arithmetic a question to answer. |
| Finance payoff | F2: "Same rates, different starting piles. Your fifty-percent rebound only got you to seventy-five." | F3 ends with the required 100% recovery calculation and the instruction to check each percentage's dollar base. The ending gives the earlier arithmetic a use instead of repeating 75. |
| Technology progression | T1 L5 returns to "while a copy is fresh" after resolving the stale check. | T3 establishes permitted fresh reuse in L2, then follows expiry → tag check → unchanged/changed outcomes. It answers the opening without a second timer-aging cycle. |
| Technology naturalness | T1: "Throw it away? Not yet." / "A tiny reply travels back. The image doesn't." | T3 names the browser's check and its outcome in connected speech. These existing short lines are not inherently wrong; removing them trades punch for a more continuous explanation. |
| AI progression | A2: "Now picture a quiz" leads to "Training and evaluation can reward guesses like that." | A3 explicitly connects that incentive to false answers, including the citation in the opening. The quiz remains a toy example, not a theory of every error. |
| AI actionable payoff | A2: "Find the source, then check whether it supports the claim." | A3 names the publisher's site, opening the source, checking support and withholding an unverifiable claim. Locating a real paper alone does not validate the claim. |

Naturalness pass performed here: **text-only**, reading adjacent passages as one
continuous explanation, checking breath groups, referents and repeated cadence.
No human spoken read or synthesized delivery was performed. Revision examples:
the draft Finance ending "For this loss, recovery means doubling the fifty"
repeated L5's calculation, so it became the base-comparison check; the AI draft
"Verify source existence and claim support" became L6's concrete actions.

The same grammar can sound forced in another topic. Do not copy these openings
or ending forms into every future script. F3 still needs pauses around amounts;
T3 adds chronological setup before the expired-copy demonstration; A3's quiz
needs a clear handoff back to the citation. These are editorial tradeoffs to
review during a future authorized production, not solved delivery questions.

### Additional rejection cases

| Candidate | Why it fails | Repair target |
| --- | --- | --- |
| "Unlock financial freedom with AI. Find a profitable niche and scale." | Reusable hype, no specific task or supported outcome. | Name a concrete product decision, its evidence and necessary costs; no earnings guarantee. |
| "Watch until the end to learn which button saves your file." | Withholds an essential tutorial instruction to manufacture suspense. | Identify the control when the viewer needs it; earn the ending with a saved-file check. |
| "Today we'll explore caching. Caching is important. Now you understand caching." | Has an opening, middle and ending but no mechanism or useful payoff. | Follow one stored image through permitted reuse, expiry and validation as T3 does. |
| "Here's the secret: fifty percent is fifty percent." | Slogan conceals the changed base and gives no usable answer. | Calculate the dollar gain and recovery from the actual balance as F3 does. |
| "AI citations look convincing. So always trust verified-looking sources." | Appearance is still doing the verification; the promised evidence check is absent. | Locate the source and inspect support, with an explicit unverifiable outcome as A3 does. |
| Add "Reuse smarter" above T3's image | Decorative overlay duplicates the narration's point. | Keep the visible check and the necessary reply identifier; omit the slogan. |

These are manual rejection cases, not keyword bans: "but," a question, a short
sentence or an optional CTA can be useful in context. Reject the missing logic,
empty promise or unnecessary text rather than matching a fashionable phrase.

### Validation boundaries and reproduction

Run `python -m unittest discover -s tests -p "test_*.py"` from V2. The focused
sample regression uses the real channel parser on all nine complete drafts and
checks that their unindented editorial notes do not enter spoken passages.
It also locks the six historical drafts to their pre-change hashes so this
comparison cannot silently weaken its own baseline. This validates preservation
and parser compatibility, not whether a script is compelling.

The new samples preserve the shared factual boundaries. Arithmetic remains
100 × 0.5 = 50; 50 × 1.5 = 75; (100 − 50) / 50 = 100%. Technology was checked
against [RFC 9111, overview and validation](https://www.rfc-editor.org/rfc/rfc9111.html#section-4.3.3).
The AI incentive explanation was checked against the existing
[OpenAI research explanation](https://openai.com/index/why-language-models-hallucinate/).
The quiz is illustrative; no actual model experiment or deceptive intent is claimed.

Validation: **26 tests passed**, including baseline preservation, all nine
sample parses and the existing production guards. Installed skill integrity,
local document links, finance arithmetic and whitespace checks passed.

A separate native subagent read the original storytelling skill, patterns and
the complete comparisons. It agreed with the limited editorial judgments and
found two corrections: remove a remaining mandatory-surprise instruction and
make rejection explicit when either AI source check fails. Both were applied.
The reviewer saw the draft labels and this brief: this is not a blinded
experiment or evidence that the guide alone caused improvement.
No audience data, measured speaking duration, learning test or retention result.
No production files, original skills, narration, animation or video are generated
by this trial. Existing approval gates still apply to any future production.

## Humanizer inside the Scriptwriter: 2026-10-19

This continues the same Scriptwriter assignment, native identity
`/root/script_editor`. The completed F3/T3/A3 above are the actual before drafts;
all earlier samples remain intact. This is a labeled editorial trial, without
an audience experiment or a claim that the skills caused better retention.

Original sources read for this pass:

| Installed source | SHA-256 |
| --- | --- |
| `C:/Users/Dave/.codex/skills/storytelling-hooks/SKILL.md` | `5a2fae7641373f485a92e69638846aeb1c567dd83f14af9f17a5deb45829a264` |
| `C:/Users/Dave/.codex/skills/storytelling-hooks/patterns.md` | `c62489b929e7382cccdf464b62e7889b55a4e6a064b1d926a519005e18f4c86f` |
| `C:/Users/Dave/.codex/skills/humanizer/SKILL.md` | `0612f1dfb1672b0ea9b97e139bf1f06cabe98d8b27424fe8ff01e1fb4cc99cad` |

The entire original humanizer v3.1.0 was read; the local hash matches the
integration's pinned upstream revision `8c307f367c91bd974002f10f2be2965d642c13df`.
Its mark/draft/check/final procedure follows storytelling in this same role.
The journal below is unspoken audit evidence; the embedded humanizer output is
the final narration. No upstream pattern catalog or skill file is rewritten.

### Storytelling reapplication before humanizing

Present intake: English YouTube Shorts explainers for beginners trying to
understand percentage recovery, browser image reuse, or checking AI citations.
The goal is usable understanding; the tone addresses one curious person without
sales language. Required facts and visual possibilities remain the shared briefs.
Payoffs and evidence chains were fixed before reviewing hook choices:

| Topic / intended payoff | Evidence that earns it |
| --- | --- |
| Finance: explain the incomplete rebound and full recovery; compare percentage bases. | Hypothetical 100 to 50, then 50% of 50 adds 25 to reach 75; the deficit is 25. Recovering 50 to 100 requires another 50, a 100% gain on 50. Exclude fees/deposits. |
| Technology: explain permitted reuse after expiry and when a new image is needed. | Permitted one-minute reuse; stored copy can survive expiry; example version tag; unchanged 304 permits reuse; changed image brings a new image. |
| AI: explain plausible false citations and perform separate existence/support checks. | Hypothetical title/authors/year; learned patterns can form an unchecked citation; illustrative 1/0/0 quiz; guessing incentives are one contributor; find the publisher's paper, read for support, omit the claim if either check fails. |

The earlier trial records five labeled hooks per topic and full development.
This pass reread the original skill and patterns, then evaluated those existing
fifteen candidates; it does not claim to have generated fifteen new hooks.
Selection and full-script review were performed again against the original
checklist with the documented channel adaptations:

| Topic | Review of all five existing angles and selection |
| --- | --- |
| Finance | Recovery question: retains a specific prediction and familiar balance, selected. Disappointing rebound: needs the preceding loss sooner. Changing base: accurate but gives arithmetic before its consequence. Stalled balance: concrete, with a longer setup. Recovery obstacle: valid real difficulty, denser first breath. Keep the selected curiosity/relatability opening and develop its calculation through the recovery payoff. |
| Technology | Expired copy: specific apparent contradiction, selected. Familiar revisit: recognizable but needs policy context. Conditional reply: concrete, with the browser's reason to ask missing. Deletion assumption: answerable but centers disposal. Comparison: introduces request outcomes before cache setup. Keep the selected pattern/surprise plus curiosity opening; explain permitted fresh reuse, expiry, validation and both outcomes. |
| AI | Unusable citation: names the evidence failure, selected. Evidence check: useful but foregrounds a verification task. Citation appearance: concrete details cost a longer first breath. Scoring incentive: legitimate toy conflict but starts away from the citation. Unsupported evidence: recognizable request, less specific failure. Keep the selected relatability/curiosity opening; develop format, qualified incentive and source checks. |

Checklist application: the openings contain one specific question or premise and
identify the intended beginner through the subject, without manufacturing an
emotion or danger. Recovery, reuse and reliable citation supply real goals and
constraints. Each script moves through setup, explanation and a resolved answer;
the numerical result, small validation reply and missing source provide the
supported expectation changes. The original demand for a mandatory bookend/CTA
is overridden: these conclusions are complete without either. Opening visual,
spoken line and text decision are accounted for below; text may be none. Actual
two-second delivery is unmeasured, not a checked box. Humanizing preserves the
selected promise and full explanation rather than selecting a different hook.

### Humanizer mark, draft, check and final decisions

The whole completed F3/T3/A3 narration was inspected before drafting. Few tells
remain. An observed pattern is a reason to inspect its contribution, not proof
of AI authorship or a requirement to change it. Zero edits are valid when an
existing passage does its job.

| Draft | Quoted passage and diagnosis | Intermediate draft passage / remaining issue | Final decision and preservation check |
| --- | --- | --- | --- |
| F3 to F4 | "The gain starts from the smaller balance" recaps the preceding calculation. The accompanying "You're still twenty-five dollars below your original hundred" adds a useful deficit and must survive. Humanizer section 2 permits cutting a recap while retaining a new consequence. | "A fifty-percent gain on your remaining fifty dollars adds twenty-five. That puts you at seventy-five." This carries the smaller base into the calculation, but the merged passage still needs the explicit twenty-five-dollar deficit from F3. | Add that deficit to the same passage. Keep the hypothetical 100/50 setup, excluded fees/deposits, 50% gain, 75 result, 50-to-100 recovery, 100% gain and final base-comparison check. Other sentences need no cosmetic rewrite. |
| T3 to T4 | "So an expired image can still be useful" is a general evaluation before the specific payoff. Humanizer section 2 flags recap-only closers; retain the earned expiry/reuse conclusion while naming its condition directly. | "That check can save downloading the image again." After the changed-image branch, "that check" is a distant referent and the final sentence leaves the unchanged condition implicit. | Name the unchanged-image check and reuse of the expired copy in the ending. Leave L1 through L5 intact: their chronology, permissions, conditional wording and version-tag example are necessary. No unsupported universal reuse claim is added. |
| A3 to A4 | "A title, two authors and a year" names three real citation details; the quiz has three distinct scoring outcomes. These are useful specifics, not forced triads. "Wrong answers and 'I don't know' both get zero" is an informative comparison, not a staged negative contrast. No actionable tell found in the complete draft. | Retain the existing draft, including "That's one contributor to false answers, including plausible citations." Remaining issue is delivery: the illustrative quiz needs a clear spoken handoff. Text inspection cannot settle its pacing. | Zero prose edits. Preserve the hypothetical search, learned patterns, unchecked existence, all quiz scores, qualified incentive claim, publisher lookup, support check and rejection when either check fails. Do not add certainty or fake evidence to make the rewrite noticeable. |

The remaining-pattern pass checked contrasts, recap-only closers, forced triads,
dashes and decorative bold labels across complete narration. The retained
conditional comparisons carry real information; none requires a blanket ban.
No narration contains decorative labels or dash chains. A fact comparison with
the completed before drafts found no new name, date, quote, source, numerical
result, ranking or simultaneity claim. The unchanged AI phrasing is intentional.
This is a spoken-language review by text only: sentence connections and likely
breath groups were inspected, but no audible human read, TTS or listening occurred.
The original humanizer's aloud check therefore remains unperformed; full spoken
verification and delivery quality are not claimed.

### F4

~~~markdown
# Why the rebound falls short

## Line 1
    You lost half. Would a fifty-percent gain get it back?

## Line 2
    Say you started with a hundred dollars, which fell to fifty. We'll leave out fees and deposits.

## Line 3
    A fifty-percent gain on your remaining fifty dollars adds twenty-five. That puts you at seventy-five, still twenty-five dollars below your original hundred.

## Line 4
    To recover from fifty to a hundred, you'd need another fifty dollars. That's a hundred-percent gain on the fifty you have left. When comparing a loss and a gain, check the dollar amount each percentage starts from.

Narrative review: L1 gives the recovery question; L2 supplies the hypothetical starting balance and assumptions; L3 combines the smaller-base mechanism, result and deficit; L4 earns the recovery result and usable comparison check. Opening visual: the same hypothetical 100/50 pile and original target. Text: only balance/percentage values with a comparison job. No CTA or loop.
~~~

### T4

~~~markdown
# Reusing an expired image

## Line 1
    Your browser can reuse an expired image without downloading it again.

## Line 2
    Say it saved an image the server allowed it to reuse for a minute. During that minute, it can use the saved copy without asking again.

## Line 3
    When the minute runs out, the copy can still be there. In this example, the browser saved a version tag with it.

## Line 4
    It sends that tag to the server to check whether the image changed. If it hasn't, the server replies, "304, Not Modified," and the browser reuses its copy.

## Line 5
    If the image has changed, the server sends the new one instead.

## Line 6
    If the check confirms the image hasn't changed, your browser can reuse its expired copy without another image download.

Narrative review: L1 states the reuse premise; L2 supplies permitted fresh reuse; L3 explains expiry and the example's validator; L4 demonstrates the check and unchanged result; L5 preserves the changed-content limit; L6 resolves the expired-copy premise with its condition. Opening visual: the same image beside the expired timer. Text: none unless 304 is needed to identify the reply. No CTA or loop; retain the same image and distinguish the alternative changed branch.
~~~

### A4

~~~markdown
# Checking the paper behind an AI citation

## Line 1
    An AI can give you a paper title that leads nowhere.

## Line 2
    Imagine it gives you a title, two authors and a year. You search for the paper, but can't find it.

## Line 3
    A language model learns patterns in text. It can generate a citation in the right format without having checked that the paper exists.

## Line 4
    Picture a quiz: a right answer gets a point. Wrong answers and "I don't know" both get zero. A lucky guess can score more than admitting uncertainty.

## Line 5
    Training and evaluation incentives can favor guesses like that. That's one contributor to false answers, including plausible citations.

## Line 6
    Look for the paper on its publisher's site. If you find it, open it and check that it supports the claim before you cite it. If either check fails, leave that claim out.

Narrative review: L1 establishes the citation problem; L2 makes the example hypothetical; L3 explains how familiar format can lack verification; L4 illustrates the scoring incentive; L5 qualifies and reconnects it to false citations; L6 earns separate existence/support checks and the rejection condition. Opening visual: the same mock citation and empty source slot. Text: none. No CTA or loop. A failed search does not prove nonexistence. The complete narration is deliberately unchanged from A3.
~~~

These are final humanizer outputs, not a new specialist's handoff or production
approval. The edit claim is limited: F4 merges one recap into its calculation;
T4 makes its ending's condition explicit; A4 needs no prose change. This pass
does not establish greater engagement, natural delivery or learning. No tests,
audio, animation or video were run or generated by this Scriptwriter pass.

Integration validation by Director: **28 tests passed**. All twelve samples parse
without speaking their editorial notes; all nine before drafts retain their
recorded hashes. Regression fixtures exercise missing/partial refinement,
wrong or modified originals, missing/stale/empty evidence, path aliases and
escapes, justified zero edits, and revised plans losing the legacy exemption.
All six original skill-source checks and the unchanged approved HTTP-cache plan
pass. JSON, local links and `git diff --check` pass. A separate read-only review
of the integration code found no blocker; the Scriptwriter's own examples were
assessed by Director, without a blinded review or audience test.

Installation provenance: the supported Codex `install-skill-from-github.py` was
run with `--repo blader/humanizer --ref 8c307f367c91bd974002f10f2be2965d642c13df
--path . --name humanizer --dest TEMPORARY_DIRECTORY`. Its original SKILL.md and
LICENSE matched the existing installation byte for byte, so that installation
was reused without overwriting it. The pinned repository, installation path and
source hashes are in workflow/skills.json. Five specialist roles, OneTake,
handoff core fields and both approval gates remain; new script handoffs add the
refinement evidence documented in SCRIPT_GUIDE.md. No approved production file
or original skill was edited. No commit, push, narration, animation or video.
