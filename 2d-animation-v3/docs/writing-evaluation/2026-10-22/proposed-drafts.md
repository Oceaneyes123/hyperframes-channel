# Revised scripts from your feedback

These are author-edited proposals based on your preferred versions and the saved model revisions. The original comparison and raw model outputs are unchanged. The exact text below has not been approved, read aloud, or independently reviewed. No media was created.

## finance-recovery

If a hypothetical 100 loses 50%, why doesn’t a 50% gain bring it back?

Ignoring fees and deposits, a 50% loss takes 50 away from 100, leaving 50.

The 50% gain now starts from 50. Half of 50 is 25, so you reach 75.

Getting from 50 back to 100 means adding another 50—the whole amount you have left. Recovering from a 50% loss requires a 100% gain.

## http-cache-image

If a cached image expires, does the browser delete it? Not necessarily.

Expiry doesn't automatically erase the stored copy. Keeping a copy and being allowed to reuse it are different things.

If the cache rules allow it, a fresh copy may be reused without a network request.

A stale copy may need validation: asking the server whether the image has changed.

If it is unchanged, the server can reply with 304 and no new image body. The browser may reuse its copy if the cache rules permit it. A 304 doesn't guarantee renewed freshness; reload policy still matters.

If the image changed, a new image body may be needed. So expiry doesn't automatically mean another image download.

## ai-citation-check

AI citation looks real? That still doesn’t tell you whether it exists—or supports the claim.

Open the cited item and check its author, title, date, and publication details.

Find the passage behind the specific claim. Read it in context and check whether it actually supports that claim.

If you can't find the source or confirm the supporting evidence, leave the claim unverified. Don't invent a source to fill the gap.

A real source doesn't automatically support a claim.

## ai-invoice-check

Before using extracted invoice fields, match them back to the source—not just to each other.

Use a synthetic or permissioned invoice. In this fictional example, the source shows a subtotal of 100, a fee of 5, and a total of 105.

Put the source beside the extracted fields. Compare each subtotal, fee, and total with the original.

Then check the sum: 100 plus 5 equals 105.

If a field is missing from either the source or the extraction, leave it marked missing and flag it for review. Don't guess a value.

Correct arithmetic doesn't guarantee correct extraction—or verify the invoice.

## ai-newsletter-costs

In this hypothetical newsletter job, when does 200 become revenue—and why isn’t 170 automatically profit?

The 200 is gross revenue only if a client agrees to the job and pays.

Subtract the illustrative payment fee of 10 and tool allocation of 20. That leaves 170 after those two costs.

Labor, taxes, revisions, refunds, and other costs still haven't been counted.

Using AI doesn't remove any applicable permission requirements, fact checking, or human editing.

Money left after a few selected expenses isn't necessarily profit.
