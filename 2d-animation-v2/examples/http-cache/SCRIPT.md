# Why an expired image can still work

Unspoken status: writing executed for the representative workflow trial; the user
selected visual concept A, the image lightbox. Motion/Art own its selected board
and storyboard handoff. Gate 1 remains pending. This is an explainer, not a browser
operation tutorial. No final TTS, measured duration, animation or render.

## Intake and scope

The brief supplies the intake: curious technology beginners; YouTube Shorts;
understanding the HTTP-cache mechanism rather than follows, sales or saves;
clear, playful, precise English. Native portrait is a channel constraint. The
target runtime is within 180 seconds; fit and opening delivery remain unmeasured.
The teaching question is why freshness expiry need not delete an image or force
another image download. The example assumes permitted storage and reuse, an ETag,
and a stored body that has not been evicted. These are illustrative states, not
captured network traffic.

The original storytelling-hooks skill supplies the writing procedure. Local
overrides remove its promotional CTA and recurring overlays; sparse identifying
labels remain allowed. Opening pictures below describe semantic evidence only.
They do not select an art direction, movement, timing or storyboard.

## Hook candidates

Each candidate has all three hook layers. The label complements the spoken gap;
it is not a caption. Lever numbers refer to the original skill.

| Candidate, levers and spoken opening | Reason to hear sentence two | Clarity / originality / accuracy | Proposed first-frame evidence | Sparse label |
| --- | --- | --- | --- | --- |
| A — curiosity (1), relatability (4), surprise (5): “This browser's image copy expired. So why is it still here?” | A visible expired marker conflicts with a still-present local image; the explanation must distinguish freshness from deletion. | Concrete beginner question; specific contradiction; accurate for the stated retained-copy example. | A browser's local compartment still contains one image beside an expired freshness marker. | HTTP cache |
| B — curiosity (1), conflict (3), surprise (5): “Your browser asks about an image—and gets no image back. How can that help?” | The missing body demands an explanation of what a successful validation actually returns. | Strong question but starts at the protocol's middle; true for the illustrated 304 path only. | A saved image exists locally beside a response with no image body. | 304 |
| C — relatability (4), curiosity (1), surprise (5): “You open the same page again. Why might its image stay on your device instead of making another trip?” | Connects a familiar revisit to the hidden local copy. | Familiar setting; weaker immediate contradiction; “might” preserves policy limits. | The same image is present in a device and on a server; the local copy is emphasized. | Stored copy |
| D — conflict (3), curiosity (1), surprise (5): “A website changed its image. How does your browser know the copy it kept needs replacing?” | The browser needs an answer about version identity rather than an unexplained replacement. | Clear obstacle; changed-version premise is distinct; requires a later return to the unchanged path. | Two visibly different image versions with the browser holding the older one. | ETag |
| E — curiosity (1), relatability (4), surprise (5): “An expired browser copy can still be useful. What expired—the picture, or permission to reuse it freely?” | Offers an understandable distinction to resolve, without implying corrupted pixels. | Direct mental-model puzzle; slightly abstract “permission”; “freely” would need careful qualification. | One intact image beside a freshness marker that has ended. | Freshness |

## Selection against the original checklist

Choose A. It qualifies the subject immediately through “browser,” gives a
beginner's plausible confusion a visible object, and keeps one question open.
Its tradeoff is a quieter opening than B; the local-copy-to-validation sequence
is easier to teach from its beginning. This is an editorial judgment, not a
retention result.

| Original checklist item | Selection evidence or unresolved check |
| --- | --- |
| Curiosity gap in under two seconds | The contradiction is visible in the intended first frame; “expired” appears in the first sentence. Spoken delivery under two seconds is unverified until measured narration. |
| Real feeling rather than a dry fact | Mild confusion at “expired, yet still here”; no fear, loss or danger is invented. |
| Goal plus obstacle | Reuse the image when allowed; a stale copy may require a server check. |
| Relatable and qualified | A browser keeping an image is everyday technology; no unrelated mass-audience bait. |
| All three hook layers | A's first-frame evidence, exact spoken opening and “HTTP cache” label are specified above. |
| Expectation breaks | Freshness expiry leaves the body intact; a 304 response supplies no replacement image body. |
| Setup, problem, resolution | Stored fresh copy; freshness expires; conditional validation selects reuse or replacement. |
| Closing bookend | “Expired copy” returns as useful after the matching check. No promotional CTA. |

## Line 1

    This browser's image copy expired. So why is it still here?

Semantic intention: the saved image is still present when its freshness marker
shows expired. “Expired” describes HTTP freshness, not broken pixels.

## Line 2

    Because expiration ends its freshness, not its existence. A browser cache can keep a stored response, including the image.

Semantic intention: identify a local stored response. Separate the freshness
marker from the retained body; avoid a deletion-clock metaphor.

## Line 3

    If the rules allow it, a fresh copy can be reused without checking with the server. That saves another transfer of the image.

Semantic intention: demonstrate permitted fresh reuse from the local copy. The
server still exists; this is not a universal promise about every page request.

## Line 4

    But once this copy becomes stale, the browser may need to check before reusing it. Stale doesn't mean deleted.

Semantic intention: freshness changes while the same saved body remains. Eviction
is a separate possibility, not an automatic result of becoming stale.

## Line 5

    For this example, the server gave the image an ETag: a label for that version. The browser sends that saved label in a conditional request.

Semantic intention: identify the saved validator and the outgoing conditional
request. An illustrative ETag is not a measured value or a whole-page checksum.

## Line 6

    It's asking, “Does your current image still match this version?” The request carries the label; it doesn't send the saved image back.

Semantic intention: distinguish the small validator from the saved image body.
The question is an explanation of the request, not a literal HTTP message.

## Line 7

    If the version still matches, the server can reply “304 Not Modified.” No new image body comes with that reply, so the browser reuses its stored body.

Semantic intention: a bodyless 304 response permits reuse of the retained body
in this example. Applicable response metadata may also be updated; no new body
should appear to arrive from the server.

## Line 8

    If the image has changed instead, the server can reply “200 OK” with the new image. The browser can store that response and use the replacement.

Semantic intention: compare the successful changed-representation branch with
304. This alternative outcome is not a second simultaneous response.

## Line 9

    These are permitted cache paths, not a rule for every request or reload. Cache instructions and whether the copy is still stored matter.

Semantic intention: qualify the demonstrated paths without a dense policy list.
An image that was evicted cannot be reused from the local body shown earlier.

## Line 10

    So an expired copy can still be useful. A matching server check can let your browser reuse the image it already has.

Semantic intention: answer the opening with the retained copy and the earned
matching-check condition. Complete conclusion with a conceptual callback.

## Revision and review evidence

This is a new trial draft. There was no existing SCRIPT.md or complete historical
baseline. The quoted draft passages below are this writer's initial wording;
they are not a reconstructed prior video or a controlled comparison.

Initial first two sentences: “Your browser has a cache. It stores images to make
pages load faster.” Problem: topic announcement and benefit, with no concrete
reason to hear the next sentence. Revised first two sentences: “This browser's
image copy expired. So why is it still here?” The second sentence makes the
visible contradiction explicit; line 2 then supplies the distinction rather
than repeating the question.

Weak initial middle: “When the image expires, the browser checks the server.”
Problem: implies checking is universal and conflates the image with freshness.
Revised: “But once this copy becomes stale, the browser may need to check before
reusing it. Stale doesn't mean deleted.” The neighboring fresh-reuse line states
the permission condition; the following ETag line supplies the checking mechanism.

Initial final two sentences: “That's how caching makes things faster. Now you
know why your browser uses a cache.” Problem: generic summary; does not answer
why expiry can leave a usable image. Revised final two sentences: “So an expired
copy can still be useful. A matching server check can let your browser reuse the
image it already has.” Lines 4–7 earn that conclusion through retained body,
validator, matching response and reuse.

Ending choice: complete conclusion with a conceptual bookend, not a seamless
verbal loop. Exact end-plus-start seam: “A matching server check can let your
browser reuse the image it already has. This browser's image copy expired.”
The second sentence begins a new demonstration; no connector makes it continuing
speech. Do not claim audio or visual loop continuity.

Coverage against FACTS.md: retained local response—line 2; permitted fresh
reuse—line 3; stale without automatic deletion—line 4; ETag and conditional
validation—lines 5–6; unchanged 304 and retained body—line 7; changed 200 with new
body—line 8; request-policy and retained-copy limits—line 9. The 304 metadata
update is in unspoken intention rather than required narration. This is one
permitted cache mechanism, not every reload or caching policy.

Review performed: text-only pass over adjacent narration, causal dependencies,
first/final pairs, jargon and claim conditions against the supplied FACTS.md.
Breath groups use sentence boundaries and the quoted version question. No
human aloud reading, synthesized playback, independent review, measured phrase
timing or audience test was performed by this writer. Source verification is
the Researcher's handoff dated 2026-10-15; this writer did not independently
retrieve the RFC or MDN pages. The full passage is a proposal pending Director
and independent reviewer acceptance and Gate 1. Visual concept A is user-selected;
that selection does not approve narration synthesis, animation or rendering.
