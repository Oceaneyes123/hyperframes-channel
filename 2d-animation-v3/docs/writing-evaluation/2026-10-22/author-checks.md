# Author factual and editorial diagnostics

Read the blind packet and record your responses **before opening this file**.
This review knows provenance. It is not blinded human preference, audible review,
production approval, or evidence that v3 writes better than v2.

The final run is `4cadfc94-8b1d-4da2-92f4-58624d1a2a0d`, using configured model
alias `gpt-6-luna`. Five pairs completed without failed stages in this round.
The [provenance file](provenance.json) preserves all hooks, author selections,
writer/refiner outputs, model findings, source hashes and request-stage history.
[Verification](verification.json) checks immutable dependencies, exact shared
openings/references, structural claim coverage, alternating request order, and
zero imported or accepted scripts.

## Factual checks and required revisions

| Brief | Check against supplied evidence | Author disposition |
| --- | --- | --- |
| Finance | Both preserve hypothetical 100 → 50 → 75 and the 100% gain from 50 to 100; fees/deposits are excluded. Arithmetic was checked locally. | No contradictory calculation found. V3 line 2 explains the changing base without claimIds; link that derived explanation to the supporting claims before relying on annotations. Its model verdict is ready, which does not resolve this annotation gap or establish spoken quality. |
| Cache | Both distinguish keeping a copy, permitted fresh reuse, unchanged validation without a new image body, and changed-content body transfer. | V3 line 5 makes reuse after a matching 304 sound automatic. The later caveat helps, but qualify reuse at that step. The model also requests this revision. Baseline already includes the applicable-rules qualifier. |
| AI citation | Both require source existence and actual passage support, and keep unavailable evidence unverified. V3's tool/time sentence is explicitly hypothetical, not a real performance claim. | No empirical result or failure-rate claim is established. V3's example does not show an actual claim/passage comparison and the ending repeats earlier instructions; its model verdict is revise. Baseline also repeats its checklist. Human clarity/preference is pending. |
| Invoice | Both retain the fictional 100 + 5 = 105 example, source-field comparisons, and the limit that arithmetic does not verify the document/tool. | V3 line 5 addresses a field missing **from the source**. The task also concerns fields missing from the extraction. Broaden the stop/review condition to cover either case, even though its model verdict is ready. Neither script is a live invoice/tool test. |
| Newsletter | Both preserve conditional payment of hypothetical 200, illustrative deductions 10 and 20, remaining 170, omitted costs and no established net-profit claim. | Clarify applicable permission requirements; do not imply a universal requirement merely because AI is used. The model flags v3 line 6; baseline's final permission wording also needs care. No client, demand, sale, earnings or legal determination is established. |

The cache checks use [RFC 9111 §§4–4.3](https://www.rfc-editor.org/rfc/rfc9111)
for reuse, freshness and validation, and
[RFC 9110 §15.4.5](https://httpwg.org/specs/rfc9110.html#status.304) for the absence
of response content in a 304. The citation checks use
[University of Arizona Libraries](https://ask.library.arizona.edu/faq/387173),
which distinguishes a source's existence from its support for the cited claim.
Financial/invoice figures are fictional calculations supplied in the packet.

## Concrete follow-up edits

These are proposed corrections, not replacements silently applied to the frozen
comparison. Review and save a new revision when applying them.

- Cache, v3 line 5: “If the representation is unchanged, the server can respond
  with 304, which has no new image body. The stored copy may be reused if the
  applicable cache rules permit it.” Retain the later freshness/reload caveat.
- Citation: use an explicitly fictional claim/passage contrast, such as a passage
  saying one sample was tested versus a claim that all samples passed. Do not
  attribute it to a real study. End with the verified/unverified decision rather
  than another identical checklist.
- Invoice, v3 line 5: “If a field is missing from the extraction or cannot be
  confirmed in the source, leave it marked missing and flag it for review.
  Don’t guess a value.”
- Newsletter: “AI assistance does not remove any applicable permission
  requirements, fact checking, or human editing.”
- Finance: connect the derived changing-base sentence to the supplied arithmetic
  claims. Claim-ID presence alone cannot verify semantic support.

## Interpretation limits

The baseline reconstructs the v2 guide through the shared JSON gateway; it does
not execute every v2 workflow/handoff. Both conditions share author-selected
hooks and supplied facts. Hook selection, automated research and full production
quality are outside this comparison. Prompts differ, so no single-skill causal
effect can be inferred.

Both conditions target 55 seconds, but actual spoken duration was not measured.
Whitespace word counts are descriptive only:

| Brief | Baseline words | V3 words | Model editorial advice |
| --- | ---: | ---: | --- |
| Finance | 111 | 107 | ready |
| Cache | 157 | 159 | revise |
| Citation | 122 | 124 | revise |
| Invoice | 155 | 144 | ready |
| Newsletter | 96 | 135 | revise |

The newsletter pair differs materially in length. A later preference cannot
isolate wording quality from that difference. The provider build, default
sampling and seed are not pinned. Five single samples are not an audience study.

Two aborted ID-format diagnostic runs and one complete bookkeeping-contaminated
round remain preserved under ignored `.data/writing-evaluation/`; their IDs and
dispositions are in provenance. They are not hidden alternatives used to select
a stylistic winner. The final packet is a new run after concrete implementation
and protocol fixes. Source PLAN.md/PLAN2.md, v1/v2 and publishing are unchanged.

Human read-aloud observations, blinded preferences and subsequent revision
acceptance remain pending. No voice, video, formal gate or publishing action ran.
Anyone who has read this file or condition-specific discussion in the chat must
disclose that exposure. Their review cannot establish fully blinded preference;
use an independent reviewer given only the blind packet when available.
