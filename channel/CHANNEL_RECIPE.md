# HyperFrames Channel Recipe v1

Use this for every new narrated technical explainer.

1. Create `BRIEF.md`, `FACTS.md`, `SCRIPT.md`, and `STORYBOARD.md`; every `## Line N` is one scene.
2. Add `channel.json` with `{ "design": "hyperframes-channel", "design_version": "1.0.0" }`, run `npm run sync:channel`, and import `channel/styles.css` from every scene.
3. Write `ICON_PLAN.json` after the timed storyboard: use `fontawesome` for monochrome technical/system objects and `icons8` only for production hero illustrations. Resolve every planned icon locally before sketches.
4. Build icon-first sketches using those exact local assets. Obtain approval and save `review/storyboard-approval.json` with the icon plan and sketch paths before narration.
5. Run `npm run tts -- --project videos/<project> --sync-index`. It writes the canonical narration, timing metadata, and `audio_timeline.html`, then updates only the existing audio tags.
6. Build scene markup normally; its audio element timings are generated, not hand-maintained.
7. Run `npm run validate -- --project videos/<project>` and `npx hyperframes check` before opening final preview. Save final-preview approval before rendering.

`ICON_PLAN.json` shape:

```json
{"icons":[{"id":"resolver","provider":"fontawesome","role":"system","path":"public/icons/server.svg"},{"id":"hero-browser","provider":"icons8","role":"hero","path":"public/icons8/browser.svg","source":"https://icons8.com/..."}]}
```

Use `npm run fontawesome-icon -- --name server --project videos/<project>` for Font Awesome. For an approved Icons8 SVG URL, use `npm run icons8-icon -- --name browser --url <svg-url> --attribution <icons8-page-url> --project videos/<project>`; retain the generated `.source.txt` attribution record.

Use the channel CSS variables and the diagram conventions in `DESIGN.md`. Do not add a second visual system in `frame.md`.
