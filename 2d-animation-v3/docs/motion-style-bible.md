# V3 motion style bible

Injected into concepts, storyboards, motion and critique. Keep this direction self-contained: runtime does not follow Markdown links. [Quality bar](quality-bar.md) supplies review detail. These are user preferences, not retention measurements or guaranteed quality.

## Current direction from accepted user corrections

- Use visibly tactile `rough-paper@1`: coarse fibers, fixed ink flecks, irregular edges, layered tonal planes and quiet reading space. A pale wash with faint grain is insufficient. Keep noise static, contrast clear and palette coherent. Change editorial/geometric/technical structure with viewpoint; color swaps alone do not distinguish scenes.
- Compose editable essential text per scene: varied object-relative position, scale, alignment and emphasis; selective bold labels, marker highlights, drawn accents, offset stamps, ribbons or badges. Never repeat a uniform header band or identical boxed title. At most two essential short labels, readable at 360px width. Store decoration in drawings and move it with its label. No narration-filled canvas or constant motion while reading.
- Apply eligible text treatments throughout, including later scenes. Use all ten styles across a full sequence where existing copy, meaning and timing fit; reuse suitable styles, never add words for quotas. Settle root entrances first; preserve reading holds and stable continuity labels. Inspect reveals and settled states for hidden text.
- Plan initial relationship, causal action, changed state and receiver first. Use wide assembly, gathering, decisive transfer, replacement, unfolding and clear landings with a receiving-object reaction. Repeated small nudges, shaking, jitter, cosmetic pulses, entrances alone and camera drift are insufficient. A ten-frame tween needs readable pose, distance and consequence. Anticipation, acceleration and impact resolve the mechanism; settle once. Vary actions by meaning, not repeated launch/squash routines. Camera punch-ins clarify relationships after object-led action.
- Intense defaults at 30fps: 6–12-frame entrances, 8–18-frame focused actions and useful development roughly each second where teaching permits. Respect preset minima. Measured narration/comprehension holds override cadence; never speed speech, pad runtime, invent events or add filler to clear warnings.
- Review one representative narrated mechanism at normal speed and phone size before extending its direction. Valid JSON/contact sheets cannot prove motion quality. Review the full sequence with/without sound: first/middle/final states, seams, layering and foreground occlusion. Approval covers exact reviewed inputs, not unseen shots.
- Render 1080×1920 at 30fps. Keep teaching content within x=80..1000, y=220..1600, clear of interface controls. Root actors may travel between authored slots using supported actions; fixed component parts retain registered containment. Part constraints do not require tiny root movements. Inspect encoded frames at phone size.

## Surface palette

| Treatment | Background | Foreground | Use |
| --- | --- | --- | --- |
| Paper | #F7F3E9 | #203B3A | Object-led explanation |
| Ink | #203B3A | #FFFDF8 | Consequential question/result |
| Mint field | #C6DED3 | #203B3A | Connect steps |
| Light technical grid | #FFFDF8 | #203B3A | System relationships |
| Warm geometric | #F1D7C7 | #203B3A | Qualitative token/cost comparison |
| Atmospheric ink | #162D30 | #FFFDF8 | Hero object, restrained halo |

Alternate light/dark only to clarify. Coral #D9633F marks change. Background/content/foreground planes provide depth with bounded differential parallax. Glow is a quiet state accent, never a flash. Particles appear once at a meaningful result, then disappear; they do not explain it. Keep one focal action and settled reading holds.

## Objects and scenes

The registry has 46 immutable identities: 20 existing assets, 20 original symbols and six authored scenes. Original pack bytes stay unchanged. New geometry: `workflow/motion-kit.json`, built by `scripts/build-motion-assets.ts`; local SVGs/CC0 provenance: `public/media/motion-kit/`. Scene-named SVGs are registry icons; animated artwork lives in `engine/components/trusted-scene.tsx`.

All 46 also have individual SVGs and `provenance.json` under `public/media/vector-catalog/`. Regenerate with `scripts/export-vector-catalog.ts`; it reads validated nodes without rewriting packs/hashes.

| Trusted scene (`@1`) | Mechanism |
| --- | --- |
| `message-transform` | Geometric object transformation |
| `parallax-workspace` | Push/pull parallax |
| `counted-documents` | Counter bound to three drawn documents |
| `signal-burst` | Seeded-by-index particles |
| `elastic-token` | Anticipation, squash, follow-through |
| `loop-handoff` | Position/velocity-matched loop |

No arbitrary values/source metrics. Use ordinary `numeric-display` for sourced quantities. Geometry comes from reviewed local source, never generated code, SVG strings or URLs.

Select `graphic-asset@2` with the exact registered reference. Its reserved motion layer stores normalized scene time in `reveal`; `scene-play@1` advances 0 to 1 over at least 12 frames. This is trusted-scene time, not a clipping mask. Keep the layer visible, unit scale, zero offsets; roots retain normal motion/containment. Other assets retain prior reveal semantics.

Reuse original `owner-cutout@1`: neutral, look, concern, point-laptop, type-laptop, carry-document. Preserve hash, anatomy and fixed props; use registered rig actions instead of adding an incompatible character system.

The older 15-second retention candidate's no-overlay/one-text-actor rule is experiment-specific; current typography follows the direction above. Establish the question with an opening physical action. Keep the object/information visible through handoff and explain each change. Motion variety follows meaning, never a quota.

No third-party media/code is copied. Remotion commercial eligibility remains unresolved. Review renders grant neither production gates nor publication rights.
