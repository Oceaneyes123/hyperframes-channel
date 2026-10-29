# Findings
- No .codegraph directory at repository or V3 root; use targeted rg.
- Node v24.6.0. Existing staged documentation moves and unstaged documentation edits preserved.
- Terra export: 2244 frames / 74.8 s; verified MP4 hash 406535eca6acd98fcafe119eb83c04976ff2655e19f30a6477a01422de05fe56.
- Motion ID 370b9586-071f-4c52-a1a2-298a59f671c1. Original intense example has motion.json and board.json.
- Reporter must distinguish plan diagnostics from measured video perception; count actual property changes rather than beat labels or hold instructions.
- Gateway/render preflights passed. Qwen failed: local Python/model/version/speaker/device configuration absent. No downloads or synthesis attempted. Reporter is standalone and reuses motion schema, preset expansion and schedule; no engine/client changes.
- Final Terra: 74.8 s, 8 shots, 101 event onsets, 12/38 onset-free windows; snap-overshoot 14/34 (41.2%). Intense: 10 s, 6 shots, 77 onsets, 0/5 onset-free windows; snap 5/17 (29.4%). Each uses four illustration signatures; console repeats in 4/8 versus 2/6 shots. Visibility and event-count limitations are explicit in REPORT.md and JSON.
