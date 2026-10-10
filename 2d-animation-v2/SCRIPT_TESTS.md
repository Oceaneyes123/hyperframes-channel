# Three-topic writing trial

Text-only trial, 2026-10-10. [SCRIPT_GUIDE.md](SCRIPT_GUIDE.md) owns the rules;
this file records examples and review evidence, not another writing framework.
No narration, assets, animation or video were generated. All timings are rough
planning estimates. Narration received a text rhythm/breath-group review, not
an audio listening test or audience test. These are drafts, not Gate 1 approvals.

## Comparison with previous V2 guidance

Baseline: AGENTS.md and PROMPT_TEMPLATE.md before this change already required
a concrete hook, cause and effect, a qualification, conversational speech and a
visible answer. They did not require hook alternatives, paired hook/payoff
planning, ending selection or a specific script review. The baseline examples
below are plausible applications of those instructions, not historical scripts
or evidence that the old workflow could not produce an engaging result.

| Topic | Previous-guidance opening / progression / ending | Revised draft and difference |
| --- | --- | --- |
| Finance | "A fifty-percent gain doesn't undo a fifty-percent loss." / Show 100, 50, 75; explain changed base. / "The percentage depends on the starting amount." | Starts with the recovery challenge; lets the failed recovery reveal the changing base; closes with the exact amount needed. Both versions are accurate. |
| Technology | "Your browser can reuse an image instead of downloading it again." / Define cache, freshness and validation. / "Caching saves transfers when a response can be reused." | Opens with a skipped download, then discovers expiry and a tiny validation response. Ends with the same image and returns visually to the next request. |
| AI | "An AI answer can sound correct and still be false." / Explain generated text and uncertainty. / "Check important claims against reliable sources." | Uses a citation as the visible puzzle, a clearly imaginary quiz to explain a possible incentive, and a payoff contrasting polished wording with evidence. |

The improvement demonstrated here is a repeatable selection and revision process,
not a measured retention advantage. Real engagement remains untested.

## Finance: why recovering a loss takes a larger percentage

Discovery: equal percentages applied to different balances do not cancel.
Payoff planned with the hook: fifty dollars must double to recover one hundred.
Ending: complete conclusion; a visual return to the original balance would risk
suggesting recovery actually occurred.

| Hook candidate | Curiosity | Clarity | Originality | Accuracy | Visual potential |
| --- | --- | --- | --- | --- | --- |
| "Lose half. Now you need double." | Why double? | Short, concrete | Recovery challenge | Double the remaining balance | Stack halves; recovery target stays |
| "A fifty-percent rebound still leaves you short." | How much short? | Requires an earlier loss | Failed rebound | Needs the fifty-percent-loss setup | Stack regrows only partway |
| "The same fifty dollars can be half—or all." | How can both be true? | "All" needs a base | Changing denominator | True only for different bases | Same coins against two balances |

Select the first: it establishes the challenge fastest while the next line
supplies the hypothetical balance and assumptions. Initial phrase "Lose half"
fits an estimated first second; the whole hook is roughly 2–3 seconds, unmeasured.

```markdown
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
```

Accuracy: hypothetical arithmetic, no return prediction. Calculations:
`100 * 0.5 = 50`; `50 * 1.5 = 75`; `(100 - 50) / 50 = 1` (100%). No external
investment recommendation is inferred. The numbers are independently checkable.

Review: hook **ready** (L1 sets a recoverable puzzle); progression **ready**
(L3's failed rebound leads to L4's changed base); narration **ready in text**
(short reaction breaks up the arithmetic); visuals **ready as a plan** (carry
the same coin stack and fixed 100 target); accuracy **ready** (L2 assumptions,
checked arithmetic); payoff **ready** (L5 answers "why double?"); loop **N/A**.
Revision: replaced a bare "down 50%, up 100%" opening with the recovery challenge
and added assumptions. Keep pauses around the numbers when timing after Gate 1.

## Technology: how a cache can avoid a second download

Discovery: even an expired stored copy can avoid another full download if a
validation check confirms it is unchanged. Sources:
[MDN's caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
and [RFC 9111, freshness and validation](https://www.rfc-editor.org/rfc/rfc9111.html).
Payoff: caching can save a transfer while checking whether a copy still applies.
Ending: visual loop, because the same image can serve another ordinary request.

| Hook candidate | Curiosity | Clarity | Originality | Accuracy | Visual potential |
| --- | --- | --- | --- | --- | --- |
| "Your browser can skip the download." | What replaces the trip? | Familiar subject | Missing action | "Can" keeps it conditional | Request stops beside stored image |
| "An expired copy might still be useful." | Why keep it? | Needs browser context | Expiry reversal | Depends on reuse or validation rules | Timer expires; image stays |
| "Your browser never asks twice." | Strong contradiction | Clear | Memorable absolute | Reject: validation can ask again | Would imply a false blocked path |

Select the first: it works without introducing cache terminology. The alternative
expiry hook is more surprising but costs setup. Estimated 2–3-second opening;
the stopped request establishes the surprise immediately, without measured timing.

```markdown
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
```

Accuracy boundary: one reusable HTTP image response, not the entire page, all
refresh behavior or every cache policy. Validation requires a suitable validator;
the planned server comparison uses an ETag. "Not Modified" represents HTTP 304.
Freshness expresses permitted reuse, not a guarantee that origin content cannot
change. The script's conditional wording preserves that distinction.

Loop seam: open with a fresh cached image, server and approaching request. After
L6, carry the same image into that opening composition, with the next request
approaching. Use the demonstrated unchanged/304 branch so the copy can be fresh
again. Do not magically erase age or undo a content update. Narration ends in a
complete sentence; returning to the image does not require a dangling phrase.
This is a planned visual loop, not a verified animated seam.

Review: hook **ready** (L1's missing download); progression **ready** (reuse,
expiry, validation, replacement); narration **ready in text** (short L3 payoff
before the L4 reversal); visuals **ready as a plan** (image persists as timer,
check and reply act on it); accuracy **ready** with the stated scope; payoff
**ready** (L6 answers how the trip can be saved); loop **ready as a plan**.
Revision: rejected "never asks twice"; changed "expiry deletes it" to validation;
made the returning fresh state depend on the unchanged response.

## AI: why a convincing citation can still be invented

Discovery: plausible wording is not evidence; incentives can favor guessing.
Source: [OpenAI's explanation of hallucination research](https://openai.com/index/why-language-models-hallucinate/).
Payoff: verify a citation's existence and support, rather than its appearance.
Ending: complete conclusion. No natural cyclic mechanism needs a loop here.

| Hook candidate | Curiosity | Clarity | Originality | Accuracy | Visual potential |
| --- | --- | --- | --- | --- | --- |
| "An AI can invent a convincing citation." | How does it look real? | Specific object | Evidence puzzle | Supported possibility | Citation unfolds; source check fails |
| "Sometimes guessing wins the quiz." | Why reward a guess? | AI subject missing | Incentive reversal | Needs the scoring assumptions | Two answer paths and a score |
| "AI lies to you on purpose." | Provocative motive | Clear accusation | Sensational | Reject: intent unsupported | Implies deceptive agency |

Select the first: a visible, checkable object beats an abstract claim about AI.
"AI can invent" lands early; full opening is estimated around three seconds,
not measured. A clearly fictitious citation is a prop, never claimed as a real paper.

```markdown
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
```

Accuracy: the quiz is an illustration, not an observed model experiment. This
research describes a contributor to hallucinations, not every cause, every
training scheme, intentional deception or a universal absence of verification.

Review: hook **ready** (L1 promises a specific contradiction); progression
**ready** (appearance, generation, incentive, evidence check); narration **ready
in text** (citation fragments contrast with the longer quiz); visuals **ready as
a plan** (carry the claim from citation to scoring comparison to source check);
accuracy **ready** (conditional claims, explicit illustration); payoff **ready**
(L6 resolves apparent credibility); loop **N/A**.
Revision: removed intentional-deception language and the overclaim that next-word
prediction alone explains every error; made the quiz hypothetical and causal
claim conditional. Source-check visuals must inspect support, not just find a URL.

## Lessons incorporated into the guide

The finance trial required a stated percentage base and a non-misleading visual
finish. The cache trial required a causally justified reset and a distinction
between freshness and guaranteed currency. The AI trial required separating
illustration, inference and intent. SCRIPT_GUIDE.md incorporates these as
domain checks, meaningful pattern interrupts and ending-alone/seam reviews.

All three drafts deliver partial answers before the ending and preserve a
concrete subject for OneTake. No numerical engagement score was used. Verbal-loop
grammar is supported by the guide but not demonstrated in this trial; the cache
example supplies the requested natural loop through its planned visual return.
Spoken timing, animation continuity and real viewer response remain untested.

Repository checks passed: all three fenced drafts parse through the existing
`narration_lines` function (5, 6 and 6 passages) without invoking synthesis;
arithmetic, local documentation links and whitespace checks pass. Changes are
limited to five V2 Markdown files. Channel adaptations, post-Gate-1 production
steps, gate renewal, project formats and runtime/review contracts remain intact.
