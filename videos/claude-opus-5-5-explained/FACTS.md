# Facts and assumptions

## Sourced facts

- Anthropic announced Claude Opus 5.5 on September 22, 2026, describing it as a model for long-running agentic coding and knowledge work. “Agentic” here means it can work through a task in steps, including using tools, rather than only replying once.
- Anthropic reports benchmark strengths in agentic coding, computer use, and professional knowledge work. Its benchmark table uses different effort settings in places; scores are results on defined test tasks, not a promise about every real job or user.
- Anthropic says its own default-setting tests estimate typical workloads cost 40% less than Opus 5. The API price is $4 per million input tokens and $20 per million output tokens. The per-token prices are each 20% below Opus 5; the larger typical-workload saving also depends on its claim that Opus 5.5 uses fewer tokens per task. A token is a small chunk of text the model receives or generates; it is not a fixed number of words.
- Independent external evidence available by September 28 is early and task-specific:
  - Artificial Analysis independently measured a score of 58 on its Intelligence Index at max effort and reported leading results on six of its ten evaluations. It also reported that Opus 5.5 did not lead every evaluation. This supports a strong result on that index, not universal superiority or guaranteed workplace performance.
  - Sonar evaluated a pre-release build on its Java benchmark. Across 544 test-backed HumanEval/MBPP tasks, it measured an 87.68% pass rate versus 88.6% for Opus 5. In its code analysis, bug density per million lines rose about 12%, while vulnerability density fell about 9% and code-smell density fell about 21%. This is a narrow result from Sonar's benchmark and analysis framework, not an all-language or general-ability verdict.
  - METR ran a preliminary pre-deployment AI R&D evaluation with API access over 10 business days and five tasks. It concluded that Opus 5.5 likely modestly improves on Fable 5.1 for those tasks but is unlikely to fully automate AI R&D. Anthropic had an opportunity to review and edit METR's public summary; METR signed off on the version in the system card. A separate internal-acceleration assessment shared conclusions without supporting evidence. METR explicitly says the work does not establish policy-threshold compliance or alignment properties.
- As of the source cutoff, the reviewed independent results do not verify Anthropic's complete performance suite or its estimate that typical workloads cost 40% less. The external evidence samples narrower tasks and should not be generalized to every user or workload.
- Safety: Anthropic says Opus 5.5 has safeguards similar to Fable 5.1 because of its biology and cybersecurity capabilities. Platform documentation says classifiers cover biology and cybersecurity; high-risk dual-use cyber activity is restricted while source-code vulnerability finding is allowed. Vetted organizations can apply through the Life Sciences Verification Program; Anthropic announced plans to expand the Cyber Verification Program to Opus 5.5. These controls do not establish that the model is risk-free or that every unsafe request will be caught.

## Assumptions and wording limits

- “Lower typical costs” refers to Anthropic's estimate at default settings, not a guaranteed saving on an individual API request or a subscription price.
- Keep company benchmarks explicitly labeled as Anthropic's. Do not compare models across unlike effort levels, harnesses, task sets, or metrics.
- Report external results with the evaluator, task scope, and material caveat. Do not treat launch-week evidence as a settled independent consensus.
- The shared risk-gate visual is a simplified explanation of classifiers, restrictions, and vetted access. It is not a map of Anthropic's internal implementation.
- The model, safeguards, program availability, and platform limits can change after the September 28, 2026 research cutoff.

## Sources

- Anthropic, [Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5), September 22, 2026. Announcement, attributed performance claims, cost estimate, token prices, and stated deployment safeguards.
- Anthropic, [Claude Opus 5.5 model overview](https://platform.claude.com/docs/en/models/opus-5-5/overview). Intended use, model ID, current API rates, and release date.
- Anthropic, [Prompting Claude Opus 5.5: safeguard refusals](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5). Current classifier behavior and biological/cyber policy boundaries.
- Artificial Analysis, [Claude Opus 5.5 on the Intelligence Index](https://artificialanalysis.ai/articles/claude-opus-5-5), September 22, 2026. Independent index results and coverage caveats.
- Sonar, [Claude Opus 5.5: an evaluation review and metrics benchmarks](https://www.sonarsource.com/blog/claude-opus-5-5-an-evaluation/), September 22, 2026. Pre-release Java benchmark setup and mixed code-analysis results.
- METR, [Summary of its predeployment evaluation of Claude Opus 5.5](https://metr.org/blog/2026-09-22-claude-opus-5-5/), September 22, 2026. Scope, conclusions, independence note, and disclosure limitations.
- YouTube Help, [Understand three-minute YouTube Shorts](https://support.google.com/youtube/answer/15424877). Current duration classification rule checked September 28, 2026.

