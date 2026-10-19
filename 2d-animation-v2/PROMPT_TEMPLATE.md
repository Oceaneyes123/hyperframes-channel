# Director production prompt

Open a chat rooted in V2 and fill the topic. Optional inputs use their defaults.

```text
Create a complete educational video in this workspace. Act as Director and
implement the native specialist workflow in AGENTS.md and workflow/DIRECTOR.md.
Resolve original installed skills with scripts/studio.py skills. Delegate each
substantial specialist task with its role card, exact skill path, accepted inputs,
exclusive output paths and acceptance criteria. Specialists execute originals;
record actual evidence and limitations. Do not duplicate their methods yourself.

Inputs:
- Topic: [TOPIC]
- Type: [quick tutorial or explainer; derive from viewer outcome if omitted]
- Audience: curious beginners with no prior knowledge
- Single takeaway: [TASK RESULT OR MENTAL MODEL; derive if omitted]
- Required coverage and conditions: [POINTS; research complete scope if omitted]
- Sources: [SOURCES; otherwise current primary sources]
- Tone: clear, engaging, playful when it helps teach
- Ending: [conclusion, verbal loop, visual loop; choose what earns the payoff]
- Visual reference or supplied concept: [OPTIONAL]
- Additional reference videos: [OPTIONAL exact URLs or local source paths]
- Initial creative references: https://www.youtube.com/@AILABS-393 and
  https://www.youtube.com/@ByteWithoutBite
- Language: English
- Duration: complete natural coverage, target within 180 seconds
- Format: native 1080 x 1920, 9:16, 30 fps
- Voice: existing Supertonic channel clone
- Captions, sound effects, music: off
- Folder: videos/[SLUG; derive a descriptive new slug if omitted]

Research, then Scriptwriter (storytelling-hooks followed by humanizer in that
same agent, with saved draft/refinement evidence), Art Director (original
Anthropic frontend-design), Motion Director (motion-design), Gate 1, measured
channel narration, Animator (onetake), independent Reviewer
(design-motion-principles), targeted revisions, Gate 2, OneTake rendering.
One writer per mutable artifact. Parallelize only independent work; no recursive
delegation or competing renderer. Keep approved decisions in production.json.
Use the new-project templates with reference_study enabled. During Research,
follow workflow/REFERENCE_STUDY.md: inspect moving frames of actual clips, record
timestamped observations and limitations, and report inaccessible references.
Pass REFERENCES.json to Art, Motion, Animator and Reviewer. Adapt useful
techniques to this topic; do not copy channel style or scene order. Connect
teaching beats through meaningful actions, persistent objects and cause/effect.
Vary composition and rhythm while keeping one visual identity. Prefer a still
hold when it teaches better. Use the existing beat table and independent audit;
passing structure checks never establishes animation quality.

Show three genuinely different visual concepts; let me select before storyboard.
Gate 1: complete revised script, visual direction, actual-asset board and storyboard.
Wait for explicit approval before final narration or animation. Obtain audit
perspective confirmation when the original Reviewer skill requires it.
Gate 2: complete synchronized, independently reviewed preview, measured duration
and resolved blocking findings. Wait for explicit approval before any MP4.
Use guarded studio.py production commands; record user approval against the
reviewed files. Do not treat checks or 'continue' as approval. If scope cannot
fit naturally, report incompatibility and ask for a scope/format decision.
Preserve unrelated projects. Do not commit, push, publish or deploy.
```

Gate 1 example: “I approve this complete script, visual direction and storyboard.
Build and review the full preview with measured narration. Do not render yet.”

Gate 2 example: “I approve this complete reviewed preview. Render and verify it.”
