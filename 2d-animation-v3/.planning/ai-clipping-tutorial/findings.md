# Findings

The current V3 checkout implements a Remotion/GSAP Player and guarded production workflow. Older memory describing renderer integration as absent is superseded by the current source and animation-workflow.md.

Official OpusClip documentation was checked in this chat for transcription/highlight suggestions, trimming, manual reframing and caption correction:
- https://www.opus.pro/blog/best-youtube-transcript-extractors
- https://help.opus.pro/docs/article/trim-extend-the-video
- https://opusclip.canny.io/changelog/editor-20-intuitive-and-powerful
- https://help.opus.pro/docs/article/change-captions

No signed-in OpusClip execution or actual source clipping has occurred.

Visual direction: one source video object becomes a transcript, selected highlight, edited vertical clip and reviewed delivery package. Keep the selected segment identifiable across shots. Use concise teaching labels, continuous transformations, hard cuts for detail and split-screen comparisons. Use diagrams rather than fabricated interface recordings or invented speaker quotations.

Teach editorial judgment at selection; storytelling at opening/payoff; basic editing at trimming/pacing/reframing; proofreading and audio checks at review; client communication at scope and delivery. End with a package awaiting client approval. Include no income, demand or guaranteed-results claims.

User visual feedback identified detached connector lines, tiny unreadable typography, unrelated object movement and poor centering/symmetry. This project's source drawings used padded line icons as connector endpoints, long text labels that auto-shrank, and independently placed shapes. The scoped fix rebuilds project artifacts rather than changing the already-dirty renderer. Use exact filled-card edge geometry for connectors, the existing heading/caption primitives with local Arial glyph measurements, symmetric groups around x=50, and shared transform windows for cards, their words and connector geometry. Words such as CLIP and 9:16 become moving content inside the persistent card; caption proofreading selects the NAMES and NUMBERS word objects.
