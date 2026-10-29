# HyperFrames v3 — Advanced Motion Graphics Implementation Plan

**Objective:** Expand HyperFrames v3 with eight advanced motion-graphics capabilities while preserving the existing Remotion + GSAP engine, AI Art Director, Motion Director, Studio review workflow, and production safeguards.

**Reference implementation:** `2d-animation-v3` at commit `c98ce8f`.

**Creative target:** Energetic, high-effort, visually sophisticated educational animations for AI, finance, software, and business videos.

---

## Phase 0 — Foundation and integration architecture

**Goal:** Establish shared standards before implementing the eight features.

### 0.1 Preserve existing infrastructure

Extend these existing modules where appropriate:

| Existing module | Responsibility |
|---|---|
| `workflow/motion.ts` | Validated motion beats and instructions |
| `workflow/text-motion.ts` | Text animation effects |
| `workflow/components.ts` | Component identity and animated parts |
| `workflow/visuals.ts` | Visual and storyboard schemas |
| `workflow/typography.ts` | Approved fonts and measurements |
| `workflow/morphs.ts` | Curated shape transformations |
| `engine/motion-presets/` | GSAP choreography |
| `engine/motion-composition.tsx` | Frame-driven Remotion rendering |
| `engine/graphics/` | Rich visual composition |
| `server/visuals.ts` | AI visual planning |
| `server/motion.ts` | AI choreography planning |

Do not replace existing functionality or create a second timeline engine.

### 0.2 Establish capability contracts

Every new motion capability must define:

- A versioned identifier.
- Supported object and component types.
- Strictly validated parameters.
- Minimum and maximum animation duration.
- Required initial and final states.
- Permitted interaction with other animations.
- Narration-anchor support where meaningful.
- Reusable preview fixtures.
- Rendering and compatibility tests.
- Clear recommendations on when to use or avoid it.

Use the existing registries where practical rather than creating a separate, duplicate preset database.

### 0.3 Add a common preview standard

Expand the existing `/text-motion` and `/motion-library` interfaces.

Each capability should have a portrait-format demonstration, play/pause, frame scrubbing, parameter descriptions, a before/after view when applicable, and examples of suitable narration.

Support grouping by **Typography**, **Data**, **UI**, **Illustration**, **Transformation**, and **Camera**.

### 0.4 Freeze a creative baseline

Use the existing DeepSeek V4.1 Flash video as the benchmark.

Preserve its approved narration and the current visual/motion artifacts. Select three representative segments:

1. Customer inquiries overwhelming a business.
2. DeepSeek processing and categorizing an inquiry.
3. Human review of the AI-generated response.

Compare improvements against identical narration and factual content.

**Exit criteria:** The current project renders unchanged, the new capability format is documented, and a reproducible baseline exists.

---

## Phase 1 — Rolling numbers and odometer animations

**Priority:** 1 — High

**Goal:** Create visually engaging financial and statistical animations without compromising numerical accuracy.

### Features

| Preset | Description |
|---|---|
| `odometer-roll@1` | Each digit rolls vertically into its destination |
| `numeric-reveal@1` | Reveal an authoritative number with kinetic emphasis |
| `value-transition@1` | Animate between two explicitly supplied values |
| `percent-emphasis@1` | Emphasize a verified percentage |
| `currency-display@1` | Display and animate correctly formatted monetary values |

### Implementation

Create a reusable numeric-display component that accepts a source-bound value reference, formatting rules, animation style, and timing.

Support appropriate currency symbols, thousands separators, decimal precision, percentages, signed values, and large numbers.

Keep financial values in integer minor units or another explicitly defined numeric representation where appropriate.

Allow animated digits to visually pass through intermediate characters without representing those as observed measurements. A transition between values should only be used when both endpoints have a legitimate source and relationship.

**Integration:** Extend `workflow/comparison.ts`, numeric component contracts, the Remotion renderer and the existing Motion Director.

**Demo:** An API operating-cost display rolls into its documented value, followed by a source-bound comparison chart.

**Acceptance criteria:**
- Final displayed values match their source exactly.
- No invented financial figures or implied earnings.
- Correct formatting for supported currencies and units.
- No digit overflow, clipping or spacing jumps.
- Deterministic rendering and backward seeking.

---

## Phase 2 — Advanced kinetic typography and layout morphing

**Priority:** 2 — High

**Goal:** Transform complete typographic compositions rather than merely animating independent text entrances.

### Features

| Preset | Description |
|---|---|
| `text-layout-morph@1` | Multiple text elements move between approved compositions |
| `headline-recompose@1` | A large headline separates and reforms into a new layout |
| `word-to-ui@1` | An existing word becomes a recognizable interface label |
| `keyword-focus@1` | Supporting words move away while the key phrase becomes dominant |
| `typographic-match-cut@1` | A shared word visually connects adjacent scenes |

### Implementation

Introduce a versioned typographic composition component with stable element identities and authored layout states.

For example:

**“CUSTOMER QUESTIONS”**

can separate into two moving elements, reposition around an inquiry interface, and eventually become labels in the demonstrated workflow.

Use measured font geometry and deterministic authored positions. Do not depend on runtime DOM measurements that could vary between preview and export.

Reuse the existing Inter font integration and text-motion presets.

Support coordinated movement, scale, opacity, masks and hierarchy changes.

Preserve the identity and exact contents of each text element. Changes in labels require explicitly planned replacement objects.

**Demo:** “CUSTOMER INQUIRY” transitions into a realistic software interface without disappearing and being replaced by unrelated text.

**Acceptance criteria:**
- Multiple text objects transform cohesively.
- No collisions, unreadable overlaps or unintended reflow.
- Supports native portrait layout.
- Final positioning matches approved styleframes.
- Existing ten text presets continue rendering identically.

---

## Phase 3 — Cinematic UI state transitions

**Priority:** 3 — High

**Goal:** Animate recognizable software interfaces through meaningful application states.

This should be one of the most valuable upgrades for HyperFrames' AI and software tutorial niche.

### Features

Introduce reusable UI compositions:

- Browser interfaces and form submissions.
- Email and customer-support inboxes.
- Spreadsheets and structured records.
- Automation workflow editors.
- AI response panels.
- Approval and review dashboards.

Add UI-specific motion capabilities:

| Preset | Behavior |
|---|---|
| `ui-focus@1` | Direct attention to a relevant field or control |
| `ui-state-transition@1` | Transition between defined interface states |
| `ui-field-transfer@1` | Move information between two logical fields |
| `ui-panel-expand@1` | Expand a selected detail into a larger context |
| `ui-result-assemble@1` | Assemble structured output from validated fields |

### Architecture

Introduce a versioned UI component contract with approved states and named semantic elements.

Each state should describe what information exists, where it appears, and what triggers its transformation.

A UI transition should preserve data identity between states. For example, the same customer question appears in a form, a spreadsheet row and the review interface.

Keep UI state changes separate from real external-service actions. Simulated examples must not imply that a real customer was contacted or a real booking was approved.

### DeepSeek demonstration

Create a continuous sequence:

**Customer form → Google Sheets record → n8n trigger → DeepSeek output → human review dashboard.**

Preserve the originating inquiry through the entire sequence.

**Acceptance criteria:**
- Interfaces look like believable, carefully designed software.
- Information remains visually traceable.
- UI states have meaningful and validated transitions.
- No unintended loss, duplication or rewriting of content.
- Components are reusable across different videos.

---

## Phase 4 — Character rigging and cutout animation

**Priority:** 4 — High

**Goal:** Replace generic person icons with expressive illustrated characters that can perform actions.

### First character system

Create one original, reusable small-business-owner character.

Separate the illustration into animation-ready layers:

| Part | Supported behavior |
|---|---|
| Head and neck | Turning, tilting and attentive reactions |
| Eyes and eyebrows | Looking, blinking and expressing concern |
| Arms and hands | Pointing, typing and interacting with objects |
| Torso | Leaning and subtle body movement |
| Props | Laptop, phone, document and notification interaction |

### Initial motion presets

- `character-look@1`
- `character-react@1`
- `character-point@1`
- `character-type@1`
- `character-hand-off@1`

### Implementation

Create a versioned skeletal/cutout rig with defined pivots, joint relationships and approved pose states.

Use hierarchical SVG groups and bounded rotations/translations.

The Motion Director should choose meaningful actions, not randomly animate facial features.

For example, a salon owner notices a pile of inquiries, looks overwhelmed, opens the laptop and later reviews a prepared response.

Keep animation modest enough to preserve an elegant editorial style rather than exaggerating every gesture.

**Acceptance criteria:**
- The character can perform at least five distinct actions.
- Movements preserve correct body-part attachment and layering.
- Hands can interact with registered props.
- Character identity remains consistent across scenes.
- No unnatural distortion, joint detachment or accidental clipping.

---

## Phase 5 — Expanded shape morph library

**Priority:** 5 — High

**Goal:** Expand the existing `morph-shape@1` capability beyond its single curated message-to-record transformation.

### Initial morph collection

| Morph | Storytelling purpose |
|---|---|
| Message → structured record | Information extraction |
| Question → answer card | AI assistance |
| Document → checklist | Workflow organization |
| Multiple complaints → single problem | Problem discovery |
| Problem → product concept | SaaS ideation |
| Data blocks → chart | Financial explanation |
| Manual workflow → automated workflow | Business automation |

### Implementation

Continue using curated, reviewed source/target geometry and immutable hashes.

Each pair should specify compatible dimensions, shape correspondence, clipping behavior, fill/stroke rules, and timing constraints.

Use the existing GSAP MorphSVG integration where appropriate.

Support a carefully tested sequence of multiple morphs, not arbitrary AI-generated path strings.

For transformations between complex illustrations, combine shape morphing with layer reveals and object handoffs rather than forcing every element into one interpolated outline.

**Acceptance criteria:**
- At least six new approved semantic morph pairs.
- Clear identity between source and result.
- No distorted intermediate silhouettes.
- Accurate final geometry.
- Consistent seeking and export across repeated transitions.

---

## Phase 6 — Mixed-media collage animation

**Priority:** 6 — Medium

**Goal:** Introduce a richer editorial visual treatment that combines licensed imagery, vectors, typography and subtle textures.

### Visual capabilities

Support original or properly licensed:

- Photographs.
- Cutout subjects.
- Paper and print textures.
- Vector illustrations.
- Labels, stickers and annotations.
- Graphic frames and layered editorial backgrounds.

### Motion styles

- `collage-assemble@1`
- `paper-reveal@1`
- `cutout-slide@1`
- `editorial-focus@1`
- `layered-collage-transition@1`

### Asset pipeline

Extend the existing validated asset infrastructure to support approved local raster images alongside vector artwork.

Each asset must have a stable ID, content hash, provenance, license information, dimensions and intended use.

No arbitrary external image URLs should be accepted directly from generated motion instructions.

Allow an Art Director to select a collage treatment when photographic evidence or real-world context materially improves the explanation.

Preserve editing control over the individual collage elements.

**Demo:** A small-business collage combining an illustrated owner, a photographed workspace, floating inquiry cards and an annotated approval dashboard.

**Acceptance criteria:**
- Artwork is cohesive rather than a collection of disconnected pictures.
- Assets are properly sourced and authorized.
- No runtime dependence on external image services.
- Layering, cropping and compositing remain deterministic.
- The technique is used only where it improves the narrative.

---

## Phase 7 — 2.5D perspective camera system

**Priority:** 7 — Medium–High

**Goal:** Add cinematic depth and camera movement beyond the current bounded layer-offset effects.

### Capabilities

Support layered scenes with depth information and controlled camera actions.

| Camera preset | Purpose |
|---|---|
| `depth-push@1` | Move toward a focal object |
| `parallax-pan@1` | Pan across layered artwork |
| `depth-reveal@1` | Reveal a subject behind foreground elements |
| `perspective-reframe@1` | Change the focal composition |
| `depth-handoff@1` | Follow an object between scene layers |

### Implementation

Extend the existing layered-artwork contract with validated depth roles or depth coordinates.

Prototype a deterministic perspective projection or constrained 3D transform technique within the existing Remotion renderer.

Continue using GSAP for coordinated motion and Remotion frames for timeline authority.

Do not introduce a separate real-time scene engine unless the existing approach is demonstrated to be insufficient.

Support camera position, focal depth, safe movement ranges, occlusion order and clipping boundaries.

Use depth sparingly. Technical diagrams must retain correct relationships, and perspective should never make small labels harder to read.

**Demo:** The camera travels through a layered customer-support environment, focuses on an incoming inquiry, then moves toward the processing system.

**Acceptance criteria:**
- Foreground and background move at visibly different rates.
- Camera behavior is smooth and reproducible.
- No visible seams, unexpected occlusions or detached connectors.
- Text remains readable during camera movement.
- The effect works consistently in preview and final export.

---

## Phase 8 — Expressive variable typography

**Priority:** 8 — Medium

**Goal:** Animate typographic expression through font characteristics, not only position, scale and opacity.

### Features

- Animated font weight.
- Animated width where supported by the font.
- Controlled optical sizing where supported.
- Character-level emphasis.
- Typographic hierarchy changes.
- Responsive composition adjustments during known animations.

### Suggested presets

| Preset | Description |
|---|---|
| `weight-emphasis@1` | Text becomes visually stronger |
| `width-compress@1` | Condense or expand a short headline |
| `font-axis-morph@1` | Animate an approved variable-font axis |
| `type-hierarchy-shift@1` | Promote a supporting word into the visual headline |

### Implementation

Extend `workflow/typography.ts` with approved axis metadata for each bundled variable font.

Verify the axes supported by the actual font file. Do not assume every variable font supports width, weight and optical-size animation.

Use pinned licensed font files and reproducible font measurements.

Ensure text masks, highlights, line breaks and bounding boxes remain correct as glyph widths change.

**Demo:** A headline gradually changes weight and spatial emphasis as the narration shifts from a problem to its solution.

**Acceptance criteria:**
- Supported font axes are explicitly validated.
- No font substitution or layout flicker.
- Characters remain legible.
- Glyph measurement matches rendering.
- Existing text animation and legacy typography remain unchanged.

---

## Phase 9 — Integrate everything into the Art Director and Motion Director

**Goal:** Make the AI actually use these capabilities rather than generating the same generic animations repeatedly.

### Art Director responsibilities

The Art Director decides:

- Which scene composition best communicates the narration.
- Whether the scene needs illustration, UI, typography, data or character animation.
- Which visual components and assets are appropriate.
- The focal hierarchy and visual relationship between objects.
- What should remain consistent across neighboring shots.

### Motion Director responsibilities

The Motion Director chooses:

- Which registered technique serves each narrative beat.
- When the animation begins relative to narration.
- Which actors and parts participate.
- How actions overlap or hand off.
- Where to hold for comprehension.
- How the scene connects to the next one.

The system must not select effects randomly or prioritize variety over clarity.

For example, a customer inquiry scene may use a character reaction, a UI handoff, connector tracing and a typographic emphasis. These should form one coordinated explanation instead of four competing animations.

### Preset recommendation logic

Each registered capability should expose its teaching purpose, allowed target type, minimum duration, complexity and compatibility constraints.

The AI receives only supported effects and their validated parameters.

Unsupported techniques must fail clearly rather than silently degrade to basic fades or slides.

---

## Phase 10 — Studio and creative-quality improvements

Expand the current Motion Library and Studio review interface.

### Studio requirements

Provide a searchable or categorized capability gallery, adjustable supported parameters, timeline previews, selected-shot application, before/after comparisons, and clear warnings for incompatible effects.

Preserve the existing immutable proposal and acceptance workflow.

Applying a new effect must create a proposal; it must not silently mutate accepted artwork or approved motion.

### Motion QA requirements

Expand creative analysis to detect:

- Overuse of the same technique.
- Competing visual focal points.
- Excessive animation density.
- Unnecessarily slow transitions.
- Weak information continuity.
- Text clipping and unreadable movement.
- Character pose discontinuities.
- UI handoff errors.
- Perspective or morphing distortions.

Provide timestamped, specific revision suggestions.

Static-frame inspection must be supplemented by moving playback review where necessary.

---

## Implementation order and milestone gates

The eight capabilities retain their requested business priorities, but engineering should respect dependencies.

| Milestone | Scope | Required proof |
|---|---|---|
| M0 | Architecture and frozen baseline | Current projects render unchanged |
| M1 | Rolling values | Accurate, source-bound numeric animation |
| M2 | Kinetic layout | Two or more text elements recompose cleanly |
| M3 | Cinematic UI | Same inquiry remains identifiable through multiple interfaces |
| M4 | Character rig | One character completes five meaningful actions |
| M5 | Morph expansion | At least six curated additional morph pairs |
| M6 | Mixed-media collage | One licensed, editable and animated scene |
| M7 | Perspective camera | Stable 2.5D scene and deterministic camera movement |
| M8 | Variable typography | Verified font-axis animation |
| M9 | Art/Motion Director integration | AI generates valid proposals using new capabilities |
| M10 | Real-video comparison | Human-reviewed improvement against original DeepSeek video |

Every milestone should finish with a usable feature, actual preview, automated tests and documented limitations. Do not build all eight in isolation and integrate them only at the end.

---

## Testing and production safeguards

For each milestone:

1. Validate correct and invalid generated instructions using strict schemas.
2. Verify exact source references and approved asset identity.
3. Test deterministic rendering at arbitrary frames.
4. Test backward and repeated seeking in the mounted Studio Player.
5. Verify 1080×1920, 30fps output and complete video decoding.
6. Compare preview frames with exported frames.
7. Test scoped revisions and unchanged neighboring shots.
8. Preserve legacy artifacts, source bindings and existing human approvals.
9. Run `npm run check` and `npm run build` sequentially.
10. Complete visual inspection at phone size before declaring creative success.

Use the existing interpreter and schema-versioning approach. If a new capability requires incompatible semantics, introduce a new version rather than changing the meaning of existing approved plans.

Do not regenerate or alter approved narration solely to improve animation timing.

---

## Final validation — DeepSeek V4.1 Flash video

Use **“How to Start a Business Using DeepSeek V4.1 Flash”** as the primary real-video benchmark.

Create a candidate version using the expanded library while preserving the accepted script, voice track, intended meaning and factual claims.

Evaluate three important sequences:

**Business problem:** A character reacts to customer inquiries, while cinematic UI and typography show the workload.

**AI workflow:** A question travels through connected systems, morphs into structured data and appears in a review dashboard.

**Business value:** The finished service is demonstrated using high-quality UI animation, source-bound data visuals where applicable, and a purposeful camera reveal.

Evaluate against the current version for visual sophistication, energy, clarity, continuity, readability and editing effort.

A passing technical test suite is necessary but not sufficient. The final creative comparison requires moving visual review and listening with the narration.

---

## Definition of done

The upgrade is complete when:

- All eight capability categories have validated working implementations.
- Their demos are accessible from the existing Studio libraries.
- The AI can select them meaningfully in complete video proposals.
- Each is compatible with the existing review and approval workflow.
- Existing saved projects and historical renders remain reproducible.
- Technical verification passes across seeking, rendering and export.
- At least one complete educational video demonstrates a measurable improvement through structured human comparison.
- No new effect requires unrestricted model-generated code, unverified assets or bypassed production gates.

**Final objective:** HyperFrames should no longer rely primarily on sliding icons, appearing text and scaling rectangles. Its animation system should support expressive characters, evolving interfaces, sophisticated typography, data storytelling, meaningful morphs and cinematic compositions—all directed by the actual explanation.