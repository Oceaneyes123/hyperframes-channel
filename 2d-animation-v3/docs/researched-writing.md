# Evidence-grounded scriptwriting

The writing workspace at `/projects/<id>/writing` extends script review. It does
not create videos or independently browse/verify sources.

## Workflow

1. Enter the topic, intended viewer, teaching problem, concrete payoff, format,
   approximate duration and limits. Add source URLs/notes and supported claims;
   every claim must refer to supplied notes. URLs are references only, never fetched
   by the server. Reject embedded URL credentials and out-of-range input.
2. Save an immutable brief. Ask for hook options, each with a distinct angle,
   spoken opening, proposed first visual, optional teaching overlay, claim references
   and payoff connection. A model cannot select a hook for the user.
3. Choose a hook. Three separate model calls write the draft, apply the actual
   installed humanizer and review evidence/voice/teaching. The editor sees the
   final text, brief, chosen hook and user's change instructions, without the
   current writer's original draft, private notes or a prior verdict. The refiner
   receives the change instructions too, so requested endings survive refinement.
4. Inspect original/refined narration and line-specific editorial findings. A
   revision-needed result stays saved for inspection and cannot be imported. Address
   its findings in the brief/direction and explicitly request a new draft.
5. Import a ready-for-review draft into the script workspace. This creates a new
   revision, preserves existing text/history and does not accept it. Review facts
   and editorial quality before explicit script acceptance. No production gate
   follows from the model verdict or import.

The fixed channel profile follows PLAN.md: conversational English for one beginner,
concrete examples, no unsupported financial claims, invented personal experience,
forced CTA or generic motivational ending. Tutorials teach a complete narrow task;
explainers teach a mechanism. Duration is a writing target, not measured narration.

## Installed skills

Read original `storytelling-hooks/SKILL.md` plus `patterns.md` and
`humanizer/SKILL.md` from the user's installed `.codex/skills` directory. These are
used directly in stage prompts; no copied skill package or new dependency.
Each output records paths and SHA-256 values for the actual files used. Missing
files fail the request, rather than silently substituting rewritten guidance.
Source/caveat rules, sparse teaching overlays and no forced CTA take precedence
over conflicting skill advice. The reviewed copy-editing candidate is not installed
or claimed as executed.

## Storage and concurrency

Schema 4 adds `scriptwriting_runs`, parent references/hashes and an optional writing
source reference on script revision indexes. Immutable brief/hook/draft payloads
live at `<videos-dir>/<project-id>/writing/<run-id>.json`; SQLite owns job status,
instruction/model metadata, hashes and import references. There is no second
editable narration or source-note copy in SQLite.

Validate file hashes, identities, dependency kinds/hashes, chosen hook, known claim
IDs, preserved hook/claim coverage and valid editorial line references. These checks
do not prove prose is factually correct. A false statement with a valid claim ID
still requires editorial/human rejection.

Generated output never overwrites a script. Import runs inside the existing script
transaction, binds to the captured base revision and exact reviewed content, and
is idempotent. A concurrent script edit or a newer brief prevents stale imports.
A newer brief also makes an accepted imported script (and subsequent manual/scoped
revisions descended from it) stale and blocks reacceptance
until regenerated or deliberately revised. Corrupt dependencies fail closed.

Only one model-writing request per project runs across both writing workflows.
Each upstream call is bounded to 90 seconds/300,000 response bytes; the entire
draft workflow is bounded to five minutes. Interrupted runs expire after six
minutes on next store access. No automatic retry, background agent loop or model
tool access. Failed runs remain in history; interrupted/unindexed files are
preserved for manual recovery rather than imported, overwritten or deleted.

Upgrade is additive and transactional. Stop the old app and back up database and
project files together. Mixed app schema versions must not share storage; no
destructive downgrade is provided.

## Verification and quality boundary

Verification on 2026-10-21: 35 focused tests, clean lint/typecheck and production
build pass. Tests cover role isolation, rejection/import blocking, stale source and
script dependencies, inherited research staleness, corruption, rollback and orphan
preservation, interruption, cross-project scope and shared HTTP limits.

The existing synthetic browser database migrated from schema 3 to 4 with all six
preexisting table snapshots and nine manifest hashes preserved. Browser fixture
and real `gpt-6-luna` runs both passed explicit hook choice, writer/refinement/editor
output inspection and safe import/reload without automatic acceptance.

Real browser evidence is under ignored `.data/review-browser`:

- Source brief: `bd023935-2a69-491e-9e91-ad9350af77e8`.
- Real hook options: `837c1ff3-3959-4aef-a634-88fc42b1c4e7`.
- Real reviewed draft: `1f55667e-40d9-41fb-b33b-84d471ae3dd3`.
- Imported script revision 7: `6ced0d70-fe91-4d60-a86b-c1bd4add7a59`.
- Screenshot: `.data/review-browser/researched-writing-live.png`.

The technical workflow is separate from PLAN.md's quality acceptance:
the [five-brief comparison](writing-evaluation/README.md) now has matched-input
outputs, author factual review and one user's text preferences. Fully blinded
preference and natural read-aloud assessment remain unestablished.
Existing v2 outputs cover only three topics; do not invent missing historical
baselines or call the model editor an independent human reviewer.
The live openings were relatively long; the model's ready verdict is not evidence
that opening timing, read-aloud quality or audience preference passes.

The technical browser example uses paraphrased source notes from the
[MDN HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching).
It demonstrates integration, not a winning writing method or production-ready script.

## Writing evaluation continuation
On 2026-10-22, five real matched-input pairs were generated and checked; see
[the review packet](writing-evaluation/README.md). The baseline reconstructs the
v2 guide through shared transport. The user's A/A/B/B/B preferences and revision
directions are recorded separately; [the revised proposals](writing-evaluation/2026-10-22/proposed-drafts.md)
apply them. Exact revised-text acceptance and spoken delivery remain pending.
New hook IDs are assigned by the server; model-generated identifiers are not
trusted. Creative content, claim references and distinct-angle validation remain
strict. Existing saved hook identities and historical scripts are preserved.
Shared runtime narration guidance now covers the user's clarity, concision,
natural progression, restrained examples and earned-ending requirements across
full writing and scoped revisions. This is fixed guidance, not an editable voice
profile UI or an automatically approved example library.
