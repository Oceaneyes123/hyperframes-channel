# Matched writing evaluation

The 2026-10-22 continuation compares five freshly generated pairs using
[the prepared briefs](../phase0/scripting-briefs.json). It is text-only and runs
in isolated storage. It never accepts a script or invokes media tooling.

Start with [the completed blind packet](2026-10-22/blind-review.md). All five
final pairs exist. The user has supplied text preferences and revision directions;
see [the applied-feedback report](feedback-applied.md) and
[revised proposals](2026-10-22/proposed-drafts.md). Read-aloud and fully blinded
attestations remain unreported. For a new independent reviewer, open the separate author
diagnostics/provenance only after saving your blind responses. The final run is
4cadfc94-8b1d-4da2-92f4-58624d1a2a0d.

Both conditions receive the same evidence, audience, 55-second target, selected
opening and configured model alias. The author selects shared hooks before seeing
complete drafts. This holds the opening constant; it does not compare hook quality.
Request order alternates by brief. Each condition gets one sample. Failed stages
are recorded, never automatically retried or replaced with an unreported sample.

- Baseline: the frozen v2 SCRIPT_GUIDE.md and original installed storytelling-hooks,
  then original humanizer, reconstructed through v3's strict JSON transport.
  This is not execution of the complete v2 workflow or a historical v2 output.
- Trial: actual v3 writer, original installed humanizer, and separate editorial call.
  The editor's advice does not rewrite the output or supply human acceptance.

Different prompts and stochastic requests prevent attributing any difference to
one skill. The provider model build, default temperature/top_p and seed are not
exposed or pinned. The shared gateway sends stream=true and max_tokens=8192;
source hashes and the configured model alias are recorded before generation.
The packet's model/settings recording rule belongs to this runner, not to the
viewer narration. It is excluded from the brief's spoken-content boundaries.
No measured reading duration, retention or efficacy claim follows from word counts.

The initial complete diagnostic round (2b0a905f-12a2-405a-bad7-0442fa0fa191) exposed
that separation error: an invoice draft spoke the bookkeeping instruction and
its editor rejected it. It remains preserved under .data and is not the final
comparison. Two earlier aborted ID-format diagnostic runs also remain recorded.

## Running the local check

Run from 2d-animation-v3 with the existing ignored .env file. These commands make
real model requests. Do not run them just to view the completed review packet.

```powershell
node --env-file-if-exists=.env --env-file-if-exists=.env.local scripts/evaluate-writing.ts hooks
```

The command prints a run UUID and saves five hook sets. Inspect them, then create
`.data/writing-evaluation/<run UUID>/selections.json` with exactly one
`{id, hookId, reason}` entry per brief. Selection belongs to a named author;
it is not a blind-review response or user production approval.

```powershell
node --env-file-if-exists=.env --env-file-if-exists=.env.local scripts/evaluate-writing.ts drafts <run UUID>
node --env-file-if-exists=.env --env-file-if-exists=.env.local scripts/evaluate-writing.ts export <run UUID>
```

Saved stages are reused on an explicit resume. A source/model change requires a
separate run, preventing silent prompt drift. A schema-invalid saved stage requires
a new run; do not edit it into a success. Export refuses to overwrite an existing
packet or key. Runtime artifacts and request-stage events remain under ignored
.data. A curated dated packet is retained here for review.

## Human review

Read only the dated `blind-review.md` first. Save a copy with your responses before
opening provenance or author diagnostics. Check facts and missing conditions first,
then hook/payoff fit, useful teaching and actual read-aloud quality. Prefer A, B,
tie, or neither, with concrete lines and reasons. Disclose if provenance was seen.
Prior condition-specific discussion in this chat also counts as provenance
exposure. Such a review must not be reported as fully blinded. Give the packet
alone to an independent reviewer who has not seen those notes when available.
Use separate copies for multiple reviewers; preserve disagreements. One review is
one person's evidence, not a representative audience study.

The source notes use [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) and
[RFC 9110 §15.4.5](https://httpwg.org/specs/rfc9110.html#status.304) for caching,
and [University of Arizona Libraries](https://ask.library.arizona.edu/faq/387173)
for verifying citation existence and support. Financial, newsletter and invoice
numbers are explicitly fictional arithmetic, not sourced business results.
