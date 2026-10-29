# Findings
- Current dirty runtime files are the preceding connected-process increment; preserve and extend them.
- New features require matched storyboard correspondence, strict schema validation and production engine fingerprint coverage.
- Legacy text rendering must remain unchanged when typography is absent.

## Typography decisions
- Use opt-in inter-heading@1: pinned upstream Inter variable font under OFL-1.1; native FontFace loader verifies SHA-256 before loading. Keep old Arial/monospace path unchanged.
- New profile supports at most two authored lines; actual Canvas text metrics drive fitting and decoration width after font readiness.
- Optional text narration anchors share the existing beat-anchor shape and explicit line fallback; validate conflicts only after resolution.
