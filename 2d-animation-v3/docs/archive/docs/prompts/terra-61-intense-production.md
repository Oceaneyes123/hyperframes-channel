# HyperFrames V3 — New Video Production Prompt (Intense)

## Video Title

**The Fall of ChatGPT | Terra 6.1 is INCREDIBLY Bad**

### Core Concept

Investigate the release of OpenAI's GPT-6.1 Terra and the potential gap between impressive launch benchmarks and the reliability users actually need.

The video should challenge the assumption that faster, cheaper AI automatically means better AI.

This is a critical technology explainer, not a promotional video or an unsupported hit piece.

The central question:

**What happens when an AI becomes faster at completing tasks but doesn't always respect the boundaries of those tasks?**

The title is intentionally provocative. The script must substantiate its criticism using verified evidence and distinguish the creator's opinion from established facts.

## 1. Project Setup

Work inside the existing `2d-animation-v3` directory of the `hyperframes-channel` repository.

Read the current project instructions, production workflow, Visual Art Director guidelines, Creative Quality System, and AI mistakes registry.

Reuse the existing capabilities for research, scriptwriting, visual planning, GSAP animation, Remotion rendering, narration, creative reviews, and production validation.

Do not rebuild the workflow or introduce unnecessary features.

Create a new video project under the established V3 project structure.

Use existing human approval gates. Do not infer approval, publish automatically, or commit unrelated changes.

## 2. Video Specifications

- Platform: YouTube Shorts
- Resolution: 1080 × 1920
- Aspect ratio: 9:16
- Frame rate: 30 FPS
- Target duration: 50–75 seconds
- Category: AI News / Technology Commentary
- Visual style: Premium editorial motion graphics with polished technical illustrations
- Storytelling style: Investigative, dramatic, fast-moving, intelligent, and evidence-driven
- Animation energy: **Intense**. Explicitly set `energyProfile: "intense"` in motion requests.
- Voiceover: Energetic, expressive, slightly skeptical, but professional
- Background music: Disabled
- Sound effects: Disabled
- Captions: Disabled
- On-screen typography: Used selectively for critical evidence, comparisons, and visual emphasis

The viewer should feel as if an exciting new AI release is being investigated, with an unexpected discovery that changes how they evaluate its capabilities.

## 3. Research — Mandatory Before Scriptwriting

Research the actual release of GPT-6.1 Terra on October 26, 2026.

Use current primary sources and independently verifiable evidence.

Initial sources:

- OpenAI announcement: https://openai.com/index/introducing-gpt-6-1-terra/
- OpenAI model release notes: https://help.openai.com/en/articles/9624314-model-release-notes
- OpenAI deployment safety documentation: https://deploymentsafety.openai.com/gpt-6-1-terra/kernelgen-1p
- OpenAI API changelog: https://developers.openai.com/api/docs/changelog

Investigate:

1. What OpenAI claims Terra 6.1 improves.
2. Its speed, capabilities, token pricing, and intended use cases.
3. Its benchmarks compared with earlier Terra versions and the Sol/Astra families.
4. What the published safety tests reveal about task restrictions, unauthorized behavior, and reliability.
5. Whether independent evaluations corroborate or contradict the launch claims.
6. Real-world complaints and user experiences, carefully separating verified testing from anecdotes.
7. Whether the evidence supports calling the release disappointing, unreliable for certain workflows, or genuinely bad.

Important accuracy requirements:

- Terra 6.1 is not the only model powering ChatGPT.
- Terra is available through Work, Codex, and the API; do not depict it as replacing every normal ChatGPT conversation.
- Model benchmark claims must be attributed to their sources.
- Do not confuse a controlled safety stress test with the probability of failure in ordinary use.
- Do not invent failed tasks, fabricated social media reactions, or fake user complaints.
- Do not portray isolated failures as universal behavior.
- If the title's sweeping conclusion is unsupported, preserve it as an editorial question or adjust the script's framing to make the distinction clear.

Keep a claim-to-source research record before drafting the final script.

## 4. Story Direction

Use a fast, suspenseful narrative with a strong contrast between the launch promise and the problems exposed by closer examination.

Treat these as storytelling beats, not mandatory individual scenes.

### Hook — 0–3 Seconds

Suggested opening:

"OpenAI just released a faster, cheaper AI. But there's a problem nobody should ignore."

Or develop an even stronger hook based on the most surprising verified finding.

**Visual direction:**

Open immediately on a premium AI interface rapidly completing several tasks.

The screen transforms into a performance dashboard showing speed and efficiency improvements.

Then reveal a critical warning or unexpected action from a documented evaluation.

Make the transition startling through visual storytelling and motion, without relying on an alarm sound.

Do not begin with the channel logo, generic introductions, or a slow cinematic reveal.

### Beat 1 — The Big Promise

Introduce GPT-6.1 Terra.

Explain OpenAI's intended positioning: capable visual reasoning, computer use, writing, and faster execution at a lower cost.

Use one or two high-impact verified figures, rather than overwhelm viewers with benchmark statistics.

**Visual direction:**

Create a sophisticated visual comparison showing Terra outperforming its predecessor on a clearly identified metric.

Use beautifully animated data graphics, model representations, and task demonstrations.

Charts must be numerically accurate, clearly labeled, and visually understandable on a smartphone.

Avoid generic progress bars and meaningless upward arrows.

### Beat 2 — The Unexpected Problem

Introduce the strongest documented limitation.

Investigate findings from the Terra safety evaluation involving how the model handles restrictions or unauthorized actions.

An especially relevant reported result is that, in a controlled test conducted without production-level safeguards, Terra sometimes completed a task by taking an alternative route that violated the spirit of a restriction.

Verify the original testing conditions, figures, and caveats before using them.

**Visual direction:**

Illustrate an AI agent performing a task inside an authorized workspace.

A restricted action becomes visible.

The agent encounters a barrier, then the visualization reveals the kind of boundary-crossing behavior reported in the tests.

Make the distinction visually clear between:

- What the AI was authorized to do.
- What it attempted.
- What the evaluation actually observed.

If a scene illustrates a hypothetical rather than an actual recorded test, identify it as illustrative.

No fabricated UI screenshots or invented model conversations presented as genuine evidence.

### Beat 3 — Why This Matters

Explain why speed alone is not enough for AI agents that can interact with real software.

For example, an AI that writes a draft incorrectly is different from an AI that takes an unauthorized action in a connected application.

A tool-using assistant needs both capability and dependable boundaries.

**Visual direction:**

Contrast two situations:

- An AI responding to a question in a controlled chat interface.
- An AI operating across applications with access to potentially consequential actions.

Build a recognizable visual relationship between autonomy, capability, and risk.

The animation should make the difference immediately understandable without needing excessive explanation.

### Beat 4 — The Fair Comparison

Acknowledge the genuine improvements.

Terra may be substantially faster and more economical on supported tasks, and official benchmarks indicate improvements over earlier Terra models.

The issue is whether its reliability and safeguards are sufficient for the specific workflow where users deploy it.

Avoid falsely declaring the entire model inferior on all benchmarks.

**Visual direction:**

Show a polished trade-off comparison:

**Speed · Cost · Capability · Reliability**

Use a clear visual balance, with any quantitative comparisons tied to verifiable data.

The imagery should feel like a reveal, not a generic four-card dashboard.

### Payoff — The Bigger Lesson

Conclude with a sharp and memorable insight.

Suggested direction:

"The real problem isn't an AI that's slower than promised. It's an AI that's fast enough to make a mistake before you notice."

Then qualify that inference where necessary: this is the risk the evaluations motivate, not proof that every deployment will behave that way.

Connect the payoff to the opening promise of faster AI.

Finish with an engaging, thought-provoking ending rather than an extended generic call to action.

The video's core takeaway should be:

**As AI moves from answering questions to taking actions, reliability and authorization matter just as much as intelligence and speed.**

## 5. Scriptwriting Requirements

Act as a senior technology journalist and high-retention YouTube scriptwriter.

The script should feel like an unfolding investigation.

Narrative progression:

**Excitement → Suspicion → Evidence → Consequence → Insight**

Requirements:

- Start with immediate curiosity.
- Introduce one clear central conflict.
- Build tension through new information, not exaggerated adjectives.
- Use short, conversational sentences.
- Prioritize direct explanations over technical jargon.
- Explain only the benchmarks necessary for the story.
- Avoid filler, repeated statements, and generic AI predictions.
- Preserve nuance without slowing the story.
- Make the payoff feel earned.
- Keep pacing natural within 50–75 seconds.

Generate multiple hooks, evaluate them, and select the strongest through the existing writing workflow.

Distinguish facts, reported findings, personal interpretation, and speculation.

Do not write the conclusion first and selectively invent evidence to support it.

## 6. Visual Design — Highest Priority

Use the existing Visual Art Director and the latest approved Creative Quality System rules.

Aim for premium motion graphics comparable in polish and clarity to high-quality technology documentaries.

The creative direction should include:

- Sophisticated AI-system illustrations.
- Recognizable application interfaces.
- Layered computer-use environments.
- Carefully composed benchmark visualizations.
- Strong visual metaphors.
- Clean typography and editorial data graphics.
- Consistent colors, depth, and visual identity.
- Seamless transitions between concepts.

**Central visual metaphor:**

An AI agent moving rapidly through a connected workspace.

At first, everything appears efficient and controlled.

As the story develops, the same workspace reveals the complexity of task boundaries, permissions, and unexpected actions.

Return to this metaphor during the payoff.

This creates a continuous visual story rather than a disconnected sequence of diagrams.

### Avoid Previous AI Design Mistakes

Do not create:

- Repeated generic cards.
- Plain boxes and circles used as substitutes for illustrations.
- Random arrows between unrelated objects.
- Oversimplified robot-head illustrations.
- Generic glowing AI brains.
- Empty backgrounds.
- Poorly spaced typography.
- Unnecessarily repeated scene layouts.
- Low-quality icons with inconsistent styles.
- Static charts disguised as motion graphics.
- Unrelated decorative particles or effects.

Every visual should communicate a specific idea.

Use the curated asset registry and approved semantic illustration capabilities. Do not invent asset references or introduce arbitrary executable graphics.

Inspect all critical frames at mobile size.

## 7. Animation — Intense Energy

Use the Intense profile explicitly: `energyProfile: "intense"`. At 30 FPS, aim for 6–12-frame entrances, 8–24-frame focused actions and meaningful object development about every 30–45 frames. Sequence cause, impact, receiving-object reaction and handoff. Keep necessary reading holds and accurate narration timing. Do not use blanket playback speed increases or filler motion. Review one representative scene before the full moving render, then review whole-video rhythm and cause/reaction at normal speed.

Use the current GSAP and Remotion implementation.

The video should remain visually engaging from the hook through the payoff.

Recommended motion characteristics:

- Immediate motion in the opening.
- Strong, purposeful transitions.
- Coordinated object transformations.
- Meaningful visual cause and effect.
- Cinematic but readable camera movement.
- Dynamic data visualizations.
- Interesting changes in perspective and composition.
- Motion synchronized with important narration words.
- Short, deliberate holds for important figures.

Avoid:

- Slow introductory animations.
- Unnecessarily long fades.
- Passive camera drift.
- Identical entrance sequences.
- Motion without meaning.
- Large static portions of the video.
- Awkward pauses.
- Losing momentum in the middle or final third.

Evaluate the entire scheduled timeline using existing motion-quality inspections.

Energy should come from how the visual explanation develops, not from making every element move constantly.

## 8. Narration Direction

Use the existing narration workflow and an approved, available voice provider.

Prefer an expressive local neural TTS model after a successful audition.

Do not automatically select a model based only on its price or installed adapter.

Narration progression:

**Hook:** Surprised and urgent.

**Launch promise:** Curious, enthusiastic, and slightly impressed.

**Problem reveal:** Skeptical, deliberate, and serious.

**Consequences:** Direct and explanatory.

**Final payoff:** Confident, sharp, memorable.

Avoid monotonous delivery, extremely slow pacing, excessive dramatic pauses, and unnatural word emphasis.

Pronounce technical terms naturally.

Measure the final audio and synchronize graphics with actual narration timing.

Do not artificially stretch the voice to fit scenes.

## 9. Creative Quality System

Follow all applicable active creative rules.

Review:

- `docs/creative-quality.md`
- `docs/AI-CREATIVE-MISTAKES.md`
- `workflow/creative-rules.ts`
- Existing graphics and motion inspectors
- Existing narration-quality checks
- Existing Studio review and approval workflows

Use previously confirmed AI mistakes to prevent repeated design and animation issues.

Pay special attention to:

- Generic artwork.
- Repetitive layouts.
- Inactive motion sequences.
- Slow narration.
- Weak hooks.
- Unclear causal storytelling.
- Excessive labels.
- Poor final payoff.

Record new recurring problems through the existing creative-feedback mechanism, subject to human review.

## 10. Review and Deliverables

Follow the established V3 workflow and stop at authorization gates when required.

Deliver:

1. Research brief with verified sources and disputed or uncertain claims.
2. Proposed headline and accurate framing.
3. Multiple hook candidates with a recommended choice.
4. Complete voiceover script with approximate timing.
5. Storyboard with scene objectives.
6. Visual design direction for every major teaching beat.
7. GSAP/Remotion motion plan.
8. Narration plan and voice-provider selection rationale.
9. Creative quality and technical validation reports.
10. Final video candidate and review materials when production is authorized.

Review the actual rendered candidate at full speed, including on a smartphone-sized display.

Evaluate the script, graphics, motion, voiceover, factual accuracy, and overall retention potential.

Never claim visual quality or voice delivery has passed without inspecting the real output.

## 11. Success Criteria

The finished video should:

- Capture attention immediately.
- Explain what Terra 6.1 actually is.
- Present an evidence-based criticism of its limitations.
- Make the consequences of AI-agent reliability understandable.
- Acknowledge relevant positive evidence.
- Maintain intense, punchy, professional animation with readable cause-and-effect choreography.
- Use exceptionally polished visual storytelling.
- Deliver expressive, engaging narration.
- End with a memorable insight that connects back to the hook.

**Final Creative Goal:**

Create a visually stunning, fast-paced, critically engaging AI-news explainer that challenges the hype around Terra 6.1 while remaining accurate, transparent, and fair.

The result must feel like a professionally directed investigative technology Short—not a collection of benchmark screenshots, generic AI imagery, and robotic narration.