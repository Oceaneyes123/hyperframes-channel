# Research facts — checked 2026-09-29

The release is one day old. “Best mid-range model” is presented as the video's
argument; current evidence supports a strong value case for selected work, not
a universal ranking across models and tasks.

## Supported claims

| ID | Claim and scope | Source |
| --- | --- | --- |
| F1 | Anthropic announced Claude Sonnet 5.5 on 2026-09-28 as a faster, lower-cost complement to Opus 5.5, focused on well-scoped everyday tasks. | [Anthropic announcement](https://www.anthropic.com/claude-sonnet-5-5) |
| F2 | Anthropic lists Sonnet 5.5 at $2 per million input tokens and $10 per million output tokens; Opus 5.5 is $4/$20. Sonnet's rates match Sonnet 5 and are half Opus's base token rates. Token price is not total task cost. | [Anthropic announcement, pricing table](https://www.anthropic.com/claude-sonnet-5-5) |
| F3 | Anthropic says Sonnet 5.5 generates output 30%+ faster than Sonnet 5 and uses fewer tokens per task, reducing task cost by up to 30% for most work. These are vendor claims; generation speed is not a guarantee that every end-to-end task finishes 30% faster. | [Anthropic announcement](https://www.anthropic.com/claude-sonnet-5-5) |
| F4 | In CursorBench 4.0, Anthropic reports Sonnet 5.5 at 55.5%, Sonnet 5 at 34.1%, and Opus 5.5 at 57.8%. The public leaderboard identifies the 55.5% and 57.8% results as Max effort. The benchmark uses ambiguous, multi-file tasks from real Cursor sessions. These are agent-and-effort-specific results, not a general intelligence score. | [Anthropic's benchmark table](https://www.anthropic.com/claude-sonnet-5-5), [CursorBench leaderboard](https://cursor.com/evals), [benchmark description](https://cursor.com/cursorbench) |
| F5 | Anthropic's launch table reports GDPval-AA v2.1 scores of 1844 for Sonnet 5.5 and 1846 for Opus 5.5; Sonnet 5 scores 1449. This is one knowledge-work evaluation, not evidence that the models are interchangeable. Anthropic says the pre-release deployment used for GDPval-AA and AA-Briefcase had a structured-output bug that could degrade answers; the bug was fixed and any score effect was expected to be small. | [Anthropic announcement and footnote](https://www.anthropic.com/claude-sonnet-5-5) |
| F6 | CodeRabbit's independent Signal code-review evaluation used 13 hard cases with known bugs and majority-vote judging. Sonnet 5.5 with thinking on caught 6/13 actionable issues; Opus 5.5 Standard caught 8/13 and Max caught 10/13. CodeRabbit explicitly says 13 cases show direction, not a settled decision. This is the concrete limitation: Opus did better on these difficult reviews. | [CodeRabbit results and methodology](https://www.coderabbit.ai/blog/sonnet-5-5-model-review) |
| F7 | In CodeRabbit's broader 44-pull-request run, model-call costs were $0.46 per Sonnet 5.5 review versus $1.16 for Sonnet 5 at Anthropic list rates. Their scoring on that larger run was pending; the cost figure covers Claude model calls in CodeRabbit's pipeline, not a universal per-task price. | [CodeRabbit results and methodology](https://www.coderabbit.ai/blog/sonnet-5-5-model-review) |
| F8 | Anthropic's FrontierCode v1.1 comparison says Sonnet 5.5 at High effort matches GPT-6 Sol's best score at about one-fifth of its cost per task. This is Anthropic's own evaluation and is not used to declare an overall market winner. | [Anthropic announcement](https://www.anthropic.com/claude-sonnet-5-5) |

## Benchmark guardrails

- Keep benchmark name, version, model effort and evaluation owner visible in
  supporting source notes. Never blend results from separate tests into one
  numeric capability score.
- CursorBench 4.0 is a model-in-agent evaluation. The same leaderboard exposes
  cost, tokens and steps; the 55.5% and 57.8% scores above compare Max effort.
- GDPval-AA's near tie is specific to that test and carries Anthropic's
  pre-release structured-output caveat.
- CodeRabbit's 13-case Signal result is small and pipeline-specific. Its 44-PR
  cost run had no completed judge scoring at publication.
- The 30%+ speed and up-to-30% task-cost figures are Anthropic's claims. Keep
  “output generation” distinct from end-to-end elapsed time.
- New independent evidence is sparse this soon after launch. No source here
  establishes that Sonnet 5.5 is the best model for every mid-range buyer.

## Not used as universal claims

- “30% faster at every task,” “30% cheaper on every request,” and “Opus-level
  overall” are unsupported.
- No claim that Sonnet 5.5 beats all similar-priced competitors.
- No claim that a benchmark score predicts an individual's daily results.

## Source notes

- Terminal-Bench 4.0 defines a versioned terminal-agent benchmark; it is not
  needed in the spoken script because CursorBench gives a more legible
  same-version coding comparison: [Terminal-Bench 4.0](https://www.tbench.ai/news/terminal-bench-4-0).
- Fresh-release check: Anthropic's own model overview lists release date
  September 28, 2026: [Sonnet 5.5 model documentation](https://platform.claude.com/docs/en/models/sonnet-5-5/overview).
