# Frame packet: 07-http-request

## Project inputs

- Project: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer
- Design tokens: D:\Project\Javascript\hyperframes-channel\videos\google-browser-explainer\frame.md
- RULES_DIR: D:\Project\Javascript\hyperframes-channel\.agents\skills\hyperframes-animation\rules

## Assigned storyboard block

## Frame 7 — Request the page

- scene: A single packet labeled `GET /` leaves the browser through the now-locked route; a small request card shows the browser asking for the page.
- duration: 7.9s
- transition_in: push-slide RIGHT
- status: built
- voiceover: "With the secure connection ready, the browser sends an HTTP request: essentially, please send me this page."
- src: compositions/frames/07-http-request.html
- type: feature_showcase
- persuasion: Concretization
- beat: Clarity
- blueprint: prompt-type-submit-generate

narrativeRole: Names the actual request in familiar language.
keyMessage: HTTP is the browser's request for the page.

blueprint: compose
focal: `GET /` request packet
roles: GET card = foreground; secure route = supporting; orange field = background
sfx: none

Scene 1 (0.0–3.0s): `GET /` types into the request card via type-on with caret (`discrete-text-sequence`); asymmetric 60/40.
Scene 2 (3.0–6.1s): the card travels down the route with motion-blur streak (`motion-blur-streak`) as “send me this page” lands.
Scene 3 (6.1–7.9s): card reaches server; hold.

## Selected blueprint: prompt-type-submit-generate

# prompt-type-submit-generate — Prompt, Submit, Generate

**intent**: The AI-era demo shot — a `[prompt / query / command]` types character-by-character into a REAL product input (chat composer, search bar, terminal prompt, URL bar, sidebar assistant) and the machine answers: status theater into a streaming answer / agent action log / diff cards / chart / generated artifact — or the clip cuts at the submit and the ask itself is the show. The keyboard is the actor and the product is the responder. Distinct from `typewriter-reveal` (a line typed as bare typography on an empty field — no product surface, nothing answers) and from `cursor-ui-demo` (a cursor clicking a reconstructed UI through states — there the pointer drives every change; here any cursor work only primes the input or lands the submit, and every state change after that is the machine's own doing).

**roles served**

- Hook (from `app-window-push-in-prompt-typing`): when the opener is "watch me ask" — typed headline beat(s), ONE eased push-in lands tight on the product's input, the prompt types and the clip ends at / just after submission (sub-shape A).
- Hook (from `typed-command-output-scroll`): when the demo loop ITSELF is the hook — command in, output builds and scrolls, and a second command / retype starts before the cut, ending mid-action (sub-shapes B/C with the restart ending).
- Product_Intro (from `prompt-typing-composer`): when the first look at the product IS its composer — a brand beat opens onto the input surface, a long prompt types with hovers / attachments / dropdown picks, and the camera steers gently toward the input or the confirming control (sub-shape A, occasionally running through to an agent-log payoff).
- Product_Intro (from `search-query-walkthrough`): when the product is introduced through its search affordance — a short `[query]` types with a blinking caret, autocomplete / results populate LIVE, and a confirm click settles the result state (sub-shape C, search skin).
- Key_Feature (from `prompt-type-submit-generate`): when the capability is demoed as ONE prompt→response round trip — submit into thinking/status states, then a streaming answer, action-log rows with brand icons, green diff cards, a chart drawing itself, or an instant generated-app reveal (sub-shapes A/B/C — the family's widest role).
- CTA (from `install-command-end-card`): the install-command end card — the closing `[headline]` DEMOTES (shrinks, grays, lifts) to make room for a `[terminal pill]` that springs in and stretches wide, the `[install command]` types out with a blinking cursor, flanking metadata and a `[tool-icon row]` pop in, and the finished card holds long. No submit, no response — the typed command IS the ask (sub-shape A, terminal skin).

**duration**: 5.2–12s (A prompt-as-hook 5.2–12s, incl. the ~7.4s CTA end card; B full generate loop 5.45–11.9s; C instant-result surface 5.7–11.9s — a long-form family: most members run 7–12s because the response needs room to arrive)

**shot structure** (a `[product input]` on/inside a `[product surface — app window, web page, terminal, browser chrome, sidebar]` over `[bg color]`; the input is the gravitational center — the camera makes at most one or two purposeful moves toward or away from it and is otherwise LOCKED; typing is character-by-character behind a visible caret, and response content arrives progressively, never dumped; three folded sub-shapes — **(A) prompt-as-hook**: the clip ends at / just after the submit (or mid-word), the ask is the show; **(B) full generate loop**: submit → status theater → the output builds block by block; **(C) instant-result surface**: the machine answers with a finished surface, often re-queried before the cut)

- **Scene 0 (optional, 0.0–~2s) — lead-in beat.** ONE establishing move before the input owns the shot: a `[headline]` types on centered and clears; a `[title card]` hard-cuts away; a brand beat (`[logo/mascot]` centered, `[serif title]` building in word groups, logo shrinking-and-rising to dock top-center); an `[orb / mark]` forms with a glowing rim; the `[app window]` flies in with motion blur and settles; or a full-frame `[thumbnail grid]` parts at its vertical centerline to clear the stage. Keep it ≤2s — the input is the star.
  - _Variant — Hook_: typed headline beats carry the intro — "[Introducing X]" types on, holds, is replaced by the `[tagline]` typing in the identical style; the typing register is established before the product ever appears.
  - _Variant — Key_Feature_: the capability claim types as a bare title ("[Run a task across multiple models.]") then hard-cuts to the surface — or skip Scene 0 entirely and open on the live surface mid-workflow.
  - _Variant — CTA_: the `[closing line]` types on in two steps ("[Designed.] [Not generated.]") and holds — it will demote in Scene 2.

- **Scene 1 (~1–3s) — the input takes focus.** The `[product input]` arrives or is primed: a `[pill bar]` EXPANDS sideways from the mark/chip; a `[prompt palette / card]` SPRINGS in at center with a soft shadow; ONE smooth eased/accelerating push-in crops tight onto the composer inside the `[app window]` (headline chrome slides out of frame); a `[⌘K search modal]` springs to center while the page blurs behind it; a cursor clicks a `[menu row / Assistant button]` and the prompt block appears; or a `[✕ clear button]` empties the previous query back to `[placeholder]`. Optional composer ritual (pick 1–2, before or during typing): an `[attachment]` drags in and settles in a tray below the input; a `[model / option dropdown]` opens beneath the selector, rows hover-highlight, a checkmark lands and the toolbar label updates.
  - _Variant — Product_Intro_: the ritual is the introduction — a `[chip grid]` fades in and the cursor arcs across 2–3 hover highlights before clicking the one that opens the composer; the affordances are the tour.
  - _Variant — Key_Feature_: the surface already carries an old `[query]` and its previous `[result panel]` — clearing it says "this is a working tool, not a mockup".

- **Scene 2 (~2–6s) — the prompt types (the engine).** The `[prompt text]` types rapidly character-by-character behind a blinking caret; the input card GROWS downward / wraps as text fills, pushing footer controls and attachments down; a typed `[token]` may convert into an inline `[brand pill]` mid-typing (`[@browser]` → a colored `[Browser]` chip, typing continues around it); the camera may run ONE slow continuous push-in toward the input, decelerating to a near-hold on the typed ask. Sub-shape (A) may END here — cut mid-word with the caret blinking, or held on the finished prompt.
  - _Variant — Hook (A)_: the typed ask is the cliffhanger — end on the completed prompt, or on the submit click as the interface DIMS at the cut.
  - _Variant — Product_Intro (A)_: the camera dives toward the bottom input while `[option pills]` cascade in above it; the prompt is still mid-word at the cut — the product is introduced as something you talk to.
  - _Variant — CTA (A, install end card)_: the Scene-0 headline DEMOTES — scales ~50%, desaturates to gray, lifts upward — as a small `[$ chip]` spring-pops below and STRETCHES horizontally into a wide `[terminal pill]`; the `[install command]` types out inside it; a faint `[repo link]` and a "[Works with]" label fade in quietly; a row of `[tool icons]` pops in one after another with soft spring scale; the finished composition holds long, only the caret blinking.

- **Scene 3 (~4–7s) — submit + machine theater.** The `[submit control]` is clicked (cursor glide + press dip; the button may have MORPHED state on first keystroke — waveform → up-arrow — and may flip to a `[stop]` control while streaming) or the retype implies enter. The surface answers instantly with a working state: prior content VANISHES (chip grid gone, panel collapses to its slim header, whole layout swaps); then the theater — `[status phrases]` cross-dissolve with a left-to-right shimmer sweep ("[Thinking]" → "[Modeling…]" → "[Planning…]"), a `[spinner]` rotates over a loading strip, a row of `[loading cards]` lines up, or a `[checklist]` populates and its items flip one by one to green checks with strikethrough while a `[status heading]` flips tense ("[Using X]" → "[Used X]").
  - _Variant — (A) status-flare exit_: end the clip ON the theater — "[Generating…]" / the rotating spinner — the flare is the button; the answer is left to the imagination.

- **Scene 4 (rest) — the answer arrives.** Choose by sub-shape:
  - **Sub-shape B (full generate loop)**: the output BUILDS progressively, each block pushing content down — `[answer text]` streams paragraph by paragraph; `[action-log rows]` pop in sequentially, each with a `[brand icon]`; `[diff cards]` expand with green-highlight added lines; `[chart lines]` draw staggered left-to-right from a shared origin; an `[ASCII / summary table]` draws in; live counters tick; the surface auto-scrolls vertically to follow the newest line (page, terminal, or in-card scroll) — often under ONE slow continuous push-in on the result window.
  - **Sub-shape C (instant-result surface)**: the machine answers with a finished surface — the matching `[result / article]` renders in place; `[autocomplete chips]` stagger-pop below the bar WHILE the query types (the machine answers every keystroke), then a hover fills the `[Search button]` solid and a click confirms; the `[generated page]` rises as a rounded card and SCROLLS continuously beneath the pinned prompt; a blur-whip resolves onto the `[artifact window]` and a tab click FLIPS code → preview; or a zoom-out reveals the prompt pill was inside a full `[workspace]` where the `[content]` rewrites itself live.

- **Scene 5 (final beat) — resolve.** Diverges by role and sub-shape:
  - _Variant — Key_Feature (hold)_: HOLD on the completed output — chart finished, diff cards + `[action buttons]` fully rendered; no fade-out, no blank end frame.
  - _Variant — Product_Intro (confirm)_: the cursor lands the confirming click (`[Create PR]` / `[Generate]` / `[Search]`) as the clip ends, or extras fade and a final push-in leaves the clean end state; one member hard-cuts to a minimal `[end card]` — the submit button alone at dead center with a settle pop.
  - _Variant — Hook (restart — the signature)_: a SECOND `[prompt / command]` starts typing at a fresh prompt line, or the query BACKSPACES-AND-RETYPES and the output swaps wholesale to `[result 2]` — the clip ends MID-ACTION, mid-scroll or mid-word: the loop is endless, and that is the point.
  - _Variant — CTA_: the end card from Scene 2 simply holds to the last frame; the blinking cursor is the only motion.

**motion vocabulary**: character-by-character typing with blinking caret / block cursor; typed-headline beats replacing each other; input pill grows / wraps downward into a multi-line box; prompt palette / card springs in; pill bar expands sideways from a mark or chip; orb formation with glowing rim; typed token → inline brand-pill morph mid-typing; placeholder clear; ✕-click query clear; backspace-and-retype query swap; attachment drag-in and tray settle; dropdown open + row hover-highlight + checkmark select + toolbar label update; chip-grid hover dance; cursor glide / arc with hover highlight fills; click press dip; submit-button state morph (waveform→up-arrow, submit→stop); hover fill-state swap on a Search button; content vanish / panel collapse / layout swap on submit; status-phrase cross-dissolves with left-to-right shimmer sweep; pulsing "Thinking"; spinner rotation; loading strip; animated trailing dots; loading model-card row; status-heading tense flip (Using→Used); checklist squares flipping to green checks with strikethrough; action-log rows popping in sequentially with brand icons; streaming text blocks pushing content down; green-highlight diff cards expanding; staggered left-to-right chart line-draws; ASCII / summary table draw-in; count-up ticker; vertical output scroll (page / terminal / in-card) following the newest line; generated page rising as a rounded card and scrolling beneath a pinned prompt; autocomplete chips rapid stagger-pop; code↔preview instant flip on tab click; blur-whip transition; prompt jumps to a heading on submit; zoom-out reveal from prompt pill to full UI window; single eased / accelerating push-in landing on the input; slow continuous push-in on the result window; window fly-in with motion blur; zoom + pan cropping browser chrome; ⌘K modal spring-in with background blur; full-frame grid parting at the vertical centerline; headline demotion (scale-down + desaturate + lift); chip horizontal-stretch into a wide terminal pill; quiet low-contrast metadata fade-ins; sequential spring pop-ins of an icon row; second prompt typing at the cut; interface dim / fade at the cut; long static end hold with blinking cursor.

**rule mapping**

- character-by-character typing, placeholder clear, backspace-and-retype, second prompt at the cut, typed-headline beats → `discrete-text-sequence` (typing / typos / holds / backspace) backed by `gsap-effects` (typewriter recipe)
- blinking caret / block cursor (persisting through holds) → `context-sensitive-cursor`
- prompt / status / output phrase windows, script-driven beat durations → `dynamic-content-sequencing`
- input card grows downward / wraps as text fills → `anchored-layout-expand` (top-anchored downward growth, stepped at wrap boundaries)
- typed token → inline brand-pill morph mid-typing → composition: `scale-swap-transition` (token→chip swap at the conversion threshold) + `card-morph-anchor` (the reflow around the chip)
- prompt palette / modal / dropdown springs in; loading cards, log rows, diff cards, autocomplete chips, icon rows arriving staggered → `spring-pop-entrance` (single hero or staggered group)
- pill bar expands sideways from a mark; chip stretches into a wide terminal pill → `card-morph-anchor` (container morph)
- cursor glide to a control, press, ripple → `cursor-click-ripple`; the press dip + recovery → `press-release-spring` (or `physics-press-reaction` for cursor+button compressed together)
- hover highlight fills, Search-button instant solid fill, UI keyword accents → `asr-keyword-glow` (static-timeline glow variant) or `press-release-spring` (color-transition variation)
- attachment drag-in with cursor → `context-sensitive-cursor` (pointer↔grab) + `spring-pop-entrance` (tray settle)
- content vanish / layout swap / panel collapse on submit; code↔preview instant flip → `scale-swap-transition` (paired same-center swap) or a hard `tl.set` state swap via `discrete-text-sequence` semantics
- prompt jumps to a heading on submit → FLIP reposition — see `hyperframes-keyframes` (FLIP); the travel itself via `nudge-curve` (slow-fast-slow group slide)
- status-phrase cross-dissolves with shimmer sweep → `discrete-text-sequence` (phrase swaps) + `ambient-glow-bloom` (Shimmer sweep variation — single-pass traveling sheen, clipped to the text)
- spinner rotation, animated trailing dots, pulsing loader glyphs → `svg-icon-enrichment` (rotating / pulsing internal SVG elements); the bounded "Thinking" pulse → `sine-wave-loop` (finite repeats — this pulse PERFORMS status, it is not idle wobble)
- checklist state flips, status-heading tense flip, status-pill swaps → `discrete-text-sequence` (discrete state stepping); the checkmark stamp → `svg-path-draw` or `spring-pop-entrance`
- streaming text blocks / log rows pushing content down → `dynamic-content-sequencing` (per-block windows) + `spring-pop-entrance` (per-row arrival)
- vertical output scroll following the newest line (page / terminal / in-card) → composition: content translateY keyed to the same timeline as the content windows + a matched `viewport-change` counter-pan when the frame itself travels
- generated page as a rounded card whose internal content scrolls → `3d-page-scroll` (flat variant — internal scroll of a page card)
- staggered chart line-draws → `svg-path-draw` (stroke-dashoffset, staggered starts)
- count-up ticker / live counters → `counting-dynamic-scale`; result bars / fills → `stat-bars-and-fills`
- single eased push-in landing on the input; slow continuous push-in on the result → `multi-phase-camera` (push phase) with the destination framed via `coordinate-target-zoom`
- zoom-out reveal from prompt pill to full workspace; zoom + pan cropping chrome → `viewport-change` (composite pan+scale on the `.world` wrapper)
- window fly-in with motion blur; blur-whip transition → `motion-blur-streak`
- ⌘K modal with background blur → `depth-of-field-blur` (blur the page plane, keep the modal sharp) + `spring-pop-entrance`
- full-frame grid parting at the vertical centerline → `center-outward-expansion` (halves glide outward in lockstep)
- orb formation with glowing rim → `ambient-glow-bloom` + `spring-pop-entrance`
- headline demotion (scale-down + desaturate + lift) → `gsap-effects` (plain composite tween; no dedicated rule needed)
- interface dim at the cut, hard cut to a minimal end card, end mid-word / mid-scroll → exit conventions, no rule needed
- long static end hold with only the caret blinking → `context-sensitive-cursor` (the blink is the sanctioned residual motion)

**camera modifier** (the camera always serves the ask or the answer; many members are fully camera-static — typing, submit theater, and streaming carry the shot)

- ONE smooth eased / accelerating push-in that lands tight on the input and LOCKS (Hook, Product_Intro) → `multi-phase-camera` (push) + `coordinate-target-zoom` (target the input) — the defining move of the "watch me ask" opener.
- ONE slow continuous push-in running under the typing or under the output build, decelerating to a near-hold (Product_Intro, Key_Feature) → `multi-phase-camera` — gives the response weight without stealing from it.
- ONE zoom-out reveal — the prompt pill turns out to live inside a full workspace (Key_Feature, sub-shape C) → `viewport-change` (pull-back) — the inverse move; the ask was closer to the product than you thought.
- Entry-only flourishes: window fly-in with motion blur (`motion-blur-streak`), zoom + pan cropping browser chrome (`viewport-change`) — both settle before typing starts.
- Never more than two real viewport moves per shot; the frame is LOCKED during submit theater and streaming (the content scrolls, the camera does not).

## Selected motion rule: discrete-text-sequence

---
name: discrete-text-sequence
description: Replace entire text states at frame thresholds for non-linear typing effects — typos, bulk additions, pauses, backspaces, simulated thinking.
metadata:
  tags: text, typing, discrete, threshold, non-linear, sequence
---

# Discrete Text Sequence

Instead of character-by-character typewriter, replace entire string states at time thresholds — enabling non-linear effects (typos, backspaces, bulk paste, "thinking" gaps) that smooth per-char typing can't achieve. If your effect is "type each character, no edits", this rule is overkill — use the smooth-slice variation below.

## How It Works

The typing is authored as a sparse array of `{ t, text }` states; on every `onUpdate` a **reverse search** finds the latest entry whose `t` has passed and renders its text. Display jumps between states with no animation between them — the realism comes from the schedule shape: fast keystroke clusters (0.06–0.20s apart), pauses at word breaks (0.3–0.6s), a typo, backspaces peeling back to the fork, then a bulk paste replacing many chars in one entry. A block cursor blinks via a deterministic sin square wave on the same timeline.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="terminal">
  <div class="prompt">$</div>
  <div class="text-wrap">
    <span class="text" id="text"></span><span class="cursor" id="cursor">_</span>
  </div>
</div>
```

```css
.terminal {
  font-family: {monoFont}; /* monospace required — proportional jitters even in a fixed box */
  display: flex;
  align-items: baseline;
  font-size: TERMINAL_FONT_SIZE;
}
.text-wrap {
  display: inline-flex;
  align-items: baseline;
  min-width: TEXT_WRAP_MIN_WIDTH; /* ≥ widest state — stops right-edge jitter */
  white-space: nowrap;
}
.cursor {
  display: inline-block; /* inline ignores width */
  width: CURSOR_WIDTH;
}
```

```js
// Each entry shows from its t until the NEXT entry's t.
// Shape: keystrokes → typo → backspace to the fork → bulk paste → completion mark.
const SEQUENCE = [
  { t: 0.0, text: "" },
  { t: T_K1, text: "{p1}" }, // first keystrokes (~3-5 chars, 0.1-0.2s apart)
  { t: T_K2, text: "{p1 + ' ' + p2_typo}" }, // continuation containing a typo
  { t: T_BS, text: "{p1 + ' ' + p2_partial}" }, // backspace(s) — peel back to the fork
  { t: T_BULK, text: "{fullCorrectedText}" }, // bulk paste — many chars in one jump
  { t: T_DONE, text: "{fullCorrectedText + ' ✓'}" }, // completion marker
];

// Reverse-search for the latest entry whose t has passed
function textAt(time) {
  for (let i = SEQUENCE.length - 1; i >= 0; i--) {
    if (time >= SEQUENCE[i].t) return SEQUENCE[i].text;
  }
  return "";
}

const textEl = document.getElementById("text");
const cursorEl = document.getElementById("cursor");

const driver = { t: 0 };
tl.to(
  driver,
  {
    t: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      textEl.textContent = textAt(driver.t);
    },
  },
  0,
);

// Cursor blink — deterministic sin square wave, never a CSS animation
const blink = { p: 0 };
tl.to(
  blink,
  {
    p: Math.PI * 2 * BLINK_CYCLES,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      cursorEl.style.opacity = Math.sin(blink.p) > 0 ? "1" : "0";
    },
  },
  0,
);
```

## Variations

- **Smooth character slice** (continuous typewriter — no pauses, no edits): faster to author but uniformly "machine-typed", missing the human realism:

```js
const fullText = "{fullPhrase}";
const len = { v: 0 };
tl.to(
  len,
  {
    v: fullText.length,
    duration: TYPE_DUR,
    ease: "power1.inOut",
    onUpdate: () => {
      textEl.textContent = fullText.substring(0, Math.floor(len.v));
    },
  },
  0,
);
```

- **Thinking pause** — hold one state for `THINK_HOLD_DUR` (0.8–2.0s; under 0.5s reads as a stutter, not thought) simply by leaving a gap before the next entry's `t`.
- **State pulse on completion** — when the final state lands, `tl.to(".text", { scale: 1.03–1.08, duration: 0.15–0.3, yoyo: true, repeat: 1 }, T_DONE)`.
- **Per-state color shift** — in `onUpdate`, branch on `driver.t` vs the milestones: success color after `T_DONE`, dim mid-edit, normal while typing.

## Values

| token               | range                                        | notes                                                                  |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| TERMINAL_FONT_SIZE  | 48–96px                                      | full-bleed comps; smaller for terminal-style detail                    |
| TEXT_WRAP_MIN_WIDTH | ≥ widest state                               | measure with a hidden probe after `document.fonts.ready` if unsure     |
| milestone `t`s      | keystrokes 0.06–0.20s apart; pauses 0.3–0.6s | monotonically increasing; `T_DONE ≤ TOTAL_DURATION − ~1s` climax dwell |
| TYPE_DUR (smooth)   | `chars × 0.06–0.12s`                         | fast → relaxed                                                         |
| BLINK_CYCLES        | one cycle per 0.5–0.8s                       | `TOTAL_DURATION / 0.8 ≤ BLINK_CYCLES ≤ TOTAL_DURATION / 0.5`           |
| CURSOR_WIDTH        | ~0.3× font size                              | gap to text single-digit px so the cursor feels attached               |

## Critical Constraints

- **Reverse-search the array each frame** — O(n) with small n (≤30 typical); don't index by frame, the sequence is sparse.
- **`min-width` on the text wrap is mandatory** — without it the right edge jitters as state length changes.
- **Discrete jumps must be INSTANT** — any transition on the text turns the jump into a smear and kills the "typing" feel.
- **Cursor blink is sin/sequence-driven on the timeline**, `display: inline-block`, monospace font, `white-space: nowrap` (wrapping mid-state breaks the illusion; trailing spaces must survive).
- **Discrete vs smooth** — use discrete only for non-linear states (typos, pauses, bulk paste); plain typing takes the smooth-slice variation.

## See also

`context-sensitive-cursor` (same SEQUENCE pattern + segment-colored cursor) · `3d-text-depth-layers` (discrete text with layered depth) · `counting-dynamic-scale` (discrete label beside a smooth counter) · `press-release-spring` (post-completion press beat).

## Selected motion rule: motion-blur-streak

---
name: motion-blur-streak
description: Fake directional velocity blur on a fast entrance or camera push-through — blur peaks at max speed and resolves to 0 at the settle, so the element streaks in then snaps sharp. Two paths — SVG feGaussianBlur on the motion axis, or an echo/ghost trail that collapses into the lead.
metadata:
  tags: motion-blur, velocity, streak, entrance, fly-in, ghost, echo, svg-filter, kinetic, camera, snap
---

# Motion-Blur Streak

Real motion blur isn't available to a seeked renderer (it integrates over shutter time), so this rule **fakes** it for a fast fly-in or hard camera push-through. The whole point is the _coupling_: the blur envelope rides the **same ease and window** as the position tween, so peak blur lands exactly on peak speed and the element is razor-sharp the instant it stops. Two paths:

- **(A) Directional SVG blur** — inline `<feGaussianBlur stdDeviation="X 0">` (X on the motion axis, 0 across it), tweened via a proxy. Cleanest; a true directional smear.
- **(B) Echo / ghost trail** — 2–4 duplicates at decreasing opacity, offset backward along the motion vector, collapsing into the lead as it settles. No filter cost; a stylized "speed-line" trail.

**Entrances and mid-shot moves only — never a mid-composition exit.** A blurred element fleeing off-frame mid-composition reads as a glitch; a hard exit between scenes is the transition's job (`../transitions/overview.md`). One sanctioned scope extension: the envelope may ride the **camera wrapper** during a travel leg — see the Camera-Travel Carve-Out.

## How It Works

A fast `out`-eased move front-loads velocity — fastest off the start, bleeding to zero at the settle. Map the blur/echo envelope onto that same curve: position travels from an off-frame / pushed-back start to rest over `MOVE_DUR`; in lockstep on the same window and ease the smear goes `PEAK_BLUR → 0` (A) or the ghosts collapse onto the lead (B). By the settle the element is fully crisp and dwells ≥1 s — the contrast between violent streak and still, sharp settle IS the effect. GSAP can't tween an SVG attribute directly: tween a plain `{ v }` proxy and write `setAttribute("stdDeviation", …)` in `onUpdate`, seeding it once at setup so a seek to t=0 shows the streaked start.

## Recipe

```html
<!-- inside a standard scene clip; overflow: hidden on the scene (the smear extends past rest) -->
<svg width="0" height="0" aria-hidden="true" style="position: absolute">
  <filter id="streak" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur id="streak-blur" in="SourceGraphic" stdDeviation="0 0" />
  </filter>
</svg>
<div class="streak-el" id="streak-el" style="filter: url(#streak)">{phrase}</div>
<!-- Path B instead: N-1 aria-hidden .streak-ghost duplicates BEHIND the lead, no filter -->
```

```js
// Path A — proxy-tweened directional blur.
const blurNode = document.getElementById("streak-blur");
const blurProxy = { v: PEAK_BLUR };
const writeBlur = () => blurNode.setAttribute("stdDeviation", `${blurProxy.v} 0`); // X axis only
writeBlur(); // seed frame 0 — a seek to t=0 must show the streaked start, not a sharp pre-frame

tl.fromTo(
  "#streak-el",
  { x: ENTER_FROM_X, opacity: 0 },
  { x: 0, opacity: 1, duration: MOVE_DUR, ease: MOVE_EASE },
  MOVE_START,
);
tl.to(blurProxy, { v: 0, duration: MOVE_DUR, ease: MOVE_EASE, onUpdate: writeBlur }, MOVE_START);

// Path B — ghosts on the SAME window/ease; per-ghost variation by index.
gsap.utils.toArray(".streak-ghost").forEach((g) => {
  const i = Number(g.dataset.i); // 1..N-1, set in HTML
  tl.fromTo(
    g,
    { x: ENTER_FROM_X - i * ECHO_STEP_PX, opacity: GHOST_BASE_OPACITY / i },
    { x: 0, opacity: 0, duration: MOVE_DUR, ease: MOVE_EASE },
    MOVE_START,
  );
});
```

## Variations

- **Vertical streak** — swap axes: `y`, `stdDeviation="0 Y"`, vertical echo offsets.
- **Camera push-through** — `scale: SCALE_FROM → 1` with a symmetric `"B B"` envelope (depth-wise smear, not directional): the wordmark punches out of soft focus and snaps crisp at the lock.
- **Staggered grid streak-in** — each card streaks into its slot at `MOVE_START + i * CARD_STAGGER` with its own blur proxy / ghosts; sharp the instant it lands.
- **Hold-the-streak** — blur on a marginally slower curve than position (position `expo.out`, blur `power3.out`) so the last wisp resolves just after arrival. Sparingly; default is locked envelopes.

## Camera-Travel Carve-Out

The envelope is also sanctioned at **wrapper level**: on the `.world` / camera wrapper of a virtual-camera scene ([viewport-change.md](viewport-change.md), [multi-phase-camera.md](multi-phase-camera.md), [3d-camera-flight.md](3d-camera-flight.md)) during a **travel leg** — a dive, a whip sweep, a violent final push. This does **not** violate "never a mid-composition exit": the world never leaves frame — the camera travels _through_ it, and every leg ends with the world at rest, sharp, inside the frame. Each leg is an **arrival** at the next pose, so the entrance doctrine applies leg by leg. Three deltas from the element-level recipe:

- **Envelope follows the leg's ease.** An `out` leg (dive, final push) uses the base recipe unchanged. An `inOut` repositioning leg peaks mid-leg: split the envelope at the velocity peak — `0 → PEAK` on the in-half ease over the first half, `PEAK → 0` on the out-half over the second. Seed the proxy at **0** for these (the streaked state lives mid-leg, not at t=0; seed-at-`PEAK_BLUR` belongs to the entrance shape, where the first frame IS the fastest).
- **Filter placement.** 2D camera: `filter: url(#streak)` on the `.world` wrapper. 3D flight: on the **perspective stage** above the 3D context — a `filter` on a `preserve-3d` element flattens it and collapses every `translateZ`. Never per-element inside the world: one frame-wide envelope, not N desynced ones.
- **Full-frame blur is heavy** — cap `PEAK_BLUR` ~18–20 at wrapper level (vs 30 for one element); a brief whip may touch ~24. Axis rule as usual: `"X 0"` for a lateral whip/pan, `"B B"` for a dive/push.

### Whip sweep (named composition)

The heavily-blurred lateral whip that resolves into the next region — two rules on one window:

1. **Position** — [nudge-curve.md](nudge-curve.md)'s three-phase chain on the camera state, tuned burst-dominant (tail still ≥3× ramp-in in time).
2. **Blur** — `0 → PEAK` across the ramp-in, held at `PEAK` through the linear burst (constant velocity = constant smear), `PEAK → 0` across the tail.

Swap or reveal the next region's content DURING the burst — the smear masks the change; the `power4.out` tail lands it sharp. Reveal during the burst, read after the tail.

```js
tl.to(cam, { x: WHIP_X * 0.1, duration: 0.12, ease: "power3.in", onUpdate: applyCamera }, WHIP_AT);
tl.to(
  cam,
  { x: WHIP_X * 0.75, duration: 0.1, ease: "none", onUpdate: applyCamera },
  WHIP_AT + 0.12,
);
tl.to(
  cam,
  { x: WHIP_X, duration: 0.35, ease: "power4.out", onUpdate: applyCamera },
  WHIP_AT + 0.22,
);

tl.to(blurProxy, { v: PEAK_BLUR, duration: 0.12, ease: "power3.in", onUpdate: writeBlur }, WHIP_AT);
// blur holds at PEAK through the linear burst (no tween needed — value rests at PEAK)
tl.to(blurProxy, { v: 0, duration: 0.35, ease: "power4.out", onUpdate: writeBlur }, WHIP_AT + 0.22);
```

## Values

| token              | range                                              | notes                                                                                           |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| MOVE_EASE          | `expo.out` / `power4.out` (default) / `power3.out` | `out`-family ONLY — `in`/`inOut` puts peak speed in the wrong place; position and blur share it |
| MOVE_DUR           | 0.25–0.6s                                          | over ~0.7s reads as a focus pull, not velocity                                                  |
| ENTER_FROM_X/Y     | 40–120% of the element's own dimension             | enough runway for the streak to read                                                            |
| PEAK_BLUR          | 8–30 (default 18)                                  | >30 erases the glyph at the start; ~18–20 cap at wrapper level                                  |
| SCALE_FROM         | 1.3–2.5                                            | push-through variation                                                                          |
| N (ghosts)         | 2–4                                                | >4 reads as strobe, not streak                                                                  |
| ECHO_STEP_PX       | 12–40px                                            | `N × step ≲ ENTER_FROM` so the furthest ghost starts inside the runway                          |
| GHOST_BASE_OPACITY | 0.3–0.6                                            | opaque ghosts read as duplicate elements                                                        |
| CARD_STAGGER       | 0.05–0.12s                                         | one assembling wave, not separate arrivals                                                      |

## Critical Constraints

- Blur peaks at peak speed and resolves to 0 at the settle — share the ease and window between position and envelope. A blur that lingers after the stop reads as a focus pull.
- Entrances / mid-shot arrivals only — never a mid-composition exit; wrapper-level use only per the carve-out.
- Seed `stdDeviation` at setup: at `PEAK_BLUR` for the entrance shape, at 0 for a whip / `inOut` leg.
- Generous filter region (`x="-50%" y="-50%" width="200%" height="200%"`) or the smear clips at the element's box edge.
- Directional axis: `"X 0"` horizontal, `"0 Y"` vertical, `"B B"` only for a depth/scale move — symmetric blur on a sideways move looks like defocus.
- Dwell ≥1 s sharp after the snap; a streak landing at the last beat reads as "flashed and gone".
- Heavy element on a solid field — thin type (< ~120px / 800 weight) or a busy backdrop swallows the smear.
- `overflow: hidden` on the scene — the smear / furthest ghost extends past the resting position during travel.

## See also

`kinetic-beat-slam` (streak as one beat's entrance) · `center-outward-expansion` (grid streak-in) · `scale-swap-transition` (same-footprint morph — not an arrival) · `nudge-curve` (the whip sweep's position half) · `3d-camera-flight` / `viewport-change` (the carve-out's wrappers).
