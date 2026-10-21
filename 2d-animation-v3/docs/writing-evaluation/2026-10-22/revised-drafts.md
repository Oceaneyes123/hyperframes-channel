# Revised drafts after user feedback

These are new proposals from your preferred texts. The comparison is unchanged. Model editorial advice is not human acceptance. Spoken naturalness and measured duration remain unassessed; no media was created.

## finance-recovery

### Revised narration

1. If a hypothetical 100 loses 50%, why doesn’t a 50% gain bring it back?

2. Ignoring fees and deposits, a 50% loss takes 50 away from 100, leaving 50.

3. Then the 50% gain is calculated on the new amount, 50. Half of 50 is 25, so the total rises to 75.

4. The percentages use different starting amounts, which is why they don’t cancel each other out.

5. To return from 50 to 100, the amount has to gain 50. Since 50 is the whole starting amount, that increase is 100%.

6. So after a 50% loss, getting back to the original amount requires a 100% gain. This is a hypothetical arithmetic example, not a prediction or promised return.

### Model editorial advice

revise: The arithmetic and explanation are clear, but the ending repeats the recovery calculation and adds a disclaimer that interrupts the takeaway.

- Line 6: This repeats line 5’s conclusion, and the prediction/return disclaimer is unnecessary for a clearly hypothetical arithmetic example. Proposed change: Remove this line and let line 5 deliver the ending.

## http-cache-image

### Revised narration

1. If a cached image expires, does the browser delete it? Not necessarily.

2. Imagine a browser has already stored a copy of an image. Expiry alone does not erase that copy; it affects whether the copy can be reused without checking.

3. Under applicable cache rules, a fresh copy may be reused without a network request. A stale copy can remain stored, but it may need validation before reuse.

4. Keep three ideas separate: the stored copy is the image on hand, freshness permission determines whether it can be reused without checking, and validation checks whether it still matches.

5. If validation finds the representation unchanged, the server can reply with a 304, which has no new image body. The browser may reuse its stored copy if the cache rules allow.

6. A 304 does not guarantee that the copy becomes fresh again. If the content has changed, a response can include a new image body.

7. So an expired image can still be stored, and validation can avoid sending the image body again when it is unchanged. Whether the copy can be reused depends on the applicable cache rules and reload policy.

### Model editorial advice

ready: The script answers the opening question and clearly distinguishes the stored image, permission to reuse it without checking, and validation. Its caveats about cache rules, reload policy, and 304 responses are preserved.



## ai-citation-check

### Revised narration

1. AI citation looks real? That still doesn’t tell you whether it exists—or supports the claim.

2. Use the citation as a lead. Open the cited item and check whether you can find it.

3. Next, compare its publication details with the citation. Finding an item with a similar-looking reference is not enough to establish that the details match.

4. Then locate the passage the claim relies on and read it. Check whether that passage actually supports the specific claim you are verifying.

5. For a hypothetical example, suppose a citation leads to a real publication, but you cannot find support for the claim in its text. The publication exists; the claim remains unverified.

6. If the source or supporting passage is unavailable, leave the claim unverified. Don’t fill the gap by inventing a source.

### Model editorial advice

ready: The tutorial gives a concrete sequence for checking whether a citation exists and whether its text supports a claim, then explains what to do if the evidence is unavailable.



## ai-invoice-check

### Revised narration

1. Before using extracted invoice fields, match them back to the source—not just to each other.

2. Use a synthetic or permissioned invoice. In this fictional example, the source shows a subtotal of 100, a listed fee of 5, and a total of 105.

3. Place the source beside the extracted fields, then compare the subtotal, fee, and total one by one.

4. Check the arithmetic too: 100 plus 5 equals 105.

5. If a field is missing from the source or the extraction, leave it missing and send it for review. Don’t infer a value as fact.

6. Even when the numbers add up, that alone doesn’t verify the document or prove the extraction is accurate. Match every value to the source before using it.

### Model editorial advice

ready: The script gives a clear, concrete source-to-extraction check, uses only the supplied fictional numbers, and preserves the key caveats about missing fields and arithmetic.



## ai-newsletter-costs

### Revised narration

1. In this hypothetical newsletter job, when does 200 become revenue—and why isn’t 170 automatically profit?

2. Treat the 200 as conditional: it counts as gross revenue only if a client agrees to the job and pays.

3. This is an example for understanding the arithmetic. It does not claim there is a client, a sale, market demand, or actual earnings.

4. Now subtract the illustrative payment fee of 10 and tool allocation of 20. In this calculation, 170 remains after those two costs.

5. That 170 is not established net profit. The calculation leaves out labor, taxes, revisions, refunds, and other costs, so it also does not establish take-home pay or passive income.

6. If AI helps draft the newsletter, permission, fact checking, and human editing are still needed.

7. So read the 170 as money left after two selected costs, with other costs still uncounted, not as proven profit.

### Model editorial advice

revise: The hypothetical calculation and its caveat are clear, but the ending repeats an earlier point and one phrase groups unlike financial terms together.

- Line 5: “Take-home pay” and “passive income” are not parallel measures of whether this calculation establishes profit; naming both here makes the explanation less precise. Proposed change: Keep the point that omitted costs mean 170 is not established net profit. Avoid grouping it with passive income; if you retain the take-home-pay caveat, state it separately and plainly.
- Line 7: This restates line 5’s conclusion that 170 is not proven profit, so the ending adds little after the caveat has already been explained. Proposed change: Replace the restatement with a concise takeaway that connects the opening terms: 200 is conditional gross revenue, and 170 is only what remains after the two listed costs.
- Line 6: “Permission” is vague without context, and “are still needed” may sound like a broader claim than the supplied note. Proposed change: Keep the supplied point narrowly: AI assistance does not remove permission requirements, fact checking, or human editing.
