# Visual design system — editorial-workflow@1

This is the first illustrated-workflow direction, not a complete design system for every video. Its executable tokens and asset metadata live in `workflow/graphic-assets.ts`.

## Meaning and composition

The browser shows recurring work complaints. The same coral marks reappear in grouped excerpts under a magnifier, then in a candidate tool on a laptop. The tool is an idea to validate, not evidence of demand, earnings or a completed product.

Use the 900×1200 illustration as one root actor on a 1080×1920 portrait canvas. Its diagonal composition connects an upper-left browser, middle-right grouping and lower-left laptop. Background wash, path and ground establish depth without becoming separate storyboard shapes.

The reference placement is x=8%, y=14%, width=84%, height=63%. Width and height must preserve 3:4 artwork proportions in canvas pixels. On the portrait percentage grid, `height = width * 0.75`. Keep this illustration large enough for its repeated marks to read at 360×640. It is specialized for complaint research; do not reuse it for unrelated narration.

## Tokens and typography

| Role | Value |
|---|---|
| Paper | #F7F3E9 |
| Ink | #203B3A |
| Supporting ink | #607570 |
| Accent | #D9633F |
| Mint | #C6DED3 |
| Light surface | #FFFDF8 |
| Background line | #D7DFD4 |
| Main stroke / radius | 4 / 22 artwork units |

Only the accent role is customizable through the shape color and layer colors. Other roles stay fixed for this version. Gradients, a vector grid, soft silhouettes and a small ground shadow provide depth; there are no random textures, filters, fonts or remote dependencies.

No text is baked into the illustration. Keep any essential narration labels as separate editable V3 text actors using the existing text renderer. Avoid paragraphs and transcripts. The reference needs no on-canvas text, font download or decorative motion.

## Named layers and motion

- `complaints`: browser, repeated marked excerpts and cursor.
- `cluster`: grouped excerpts and magnifier.
- `packet`: extracted shared pain, moved into the candidate tool.
- `opportunity`: laptop candidate and idea bulb.

The background remains static. The example reveals grouping, carries one packet, reveals the candidate and holds the result. Layer offsets use the existing canvas-percentage contract, including in the 360-wide Studio preview. Each layer supports the existing opacity, position, scale, color and reveal-mask fields. Root geometry remains fixed; use scale or replacement actors instead of width/height animation.

## Version and safety

`complaint-workflow@1` is original local CC0 artwork compiled from reviewed TSX. Models can select its exact registered ID/hash and bounded part states; they cannot submit SVG, JavaScript, URLs, event handlers or arbitrary markup. The static reference binds the normalized source SHA-256. The production engine hash additionally includes the asset source, theme/registry, renderer and schemas.

Visual artifacts containing this artwork use schema 2. Existing primitive/component artifacts continue to use schema 1. No existing component's authored artwork was changed. New assets or artwork revisions require a new version, hash, focused tests and rendered review. Never replace approved artwork under an existing asset ID.

The other seven composition directions, external asset import/sanitization and a larger icon library are outside this first slice.
