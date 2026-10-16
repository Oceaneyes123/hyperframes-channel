# Visual concept proposals

Art Director: `/root/art_director`. The user selected **A, the image lightbox**.
The three concept comparisons remain for decision provenance. The complete
selected static board is `sketches/board.html`; Gate 1 is pending.

## Plan

Teach one permitted browser-cache path to beginners. The persistent subject is
one locally stored image. Freshness is permission, an ETag identifies a saved
representation, and a 304 does not carry a replacement image body. Keep these
roles visually separate. Use large authored SVG objects; no external assets.

Three alternatives differ in staging, metaphor, shape language and instructional
emphasis. Each includes one 1080 × 1920 hook composition in
`sketches/concepts.html`. Frame copy is provisional visual copy, not narration.

### A. The image lightbox

- Hook: **Expired. Still here.** A large image sits on a powder-blue lightbox.
  Its orange freshness tab has expired, while the image remains completely intact.
- Carrying subject: the same framed hill-and-sun image, with a small corner notch
  making its identity recognizable. The supporting lightbox represents local
  browser storage, not a remote server or an actual browser interface.
- Look: spacious sky-blue workshop, heavy navy headline, one strong diagonal
  permission tab, oversized image. The image dominates; words explain its state.
- Layout: headline top left, image in the middle, storage caption below. Left
  alignment anchors the headline; the image is optically centered.

  ```text
  Expired.
  Still here.
       [freshness tab]
  +-------------------+
  |   stored image    |
  +-------------------+
  Browser cache
  ```

- Tokens: sky `#D7EEFA`, navy `#16334A`, paper `#FFFFFF`, signal `#BC3A12`,
  hill `#247B69`, sun `#E8B733`. Bahnschrift for display and technical labels;
  Segoe UI for support; fallbacks Arial and sans-serif. Display 116 px, support
  49–54 px, exact technical labels at least 50 px in the 1080 px composition.
- Teaching extension if selected: reuse the image in place while its permission
  tab changes; carry only its validator toward the server; a 304 returns no new
  picture; a 200 visibly replaces the picture. This is a feasibility description,
  not a timed sequence or storyboard.
- Rules out: deleting/fading out a stale picture, expiry countdowns suggesting
  deletion, floating network nodes, browser-shaped cards as decoration.
- Asset plan: one authored hill image SVG, one lightbox housing, one permission
  tab. No photos, logos, online icon packs, or paid assets.

### B. The dispatch desk

- Hook: **Send the tag. Keep the image.** A tiny validator slip is sent toward a
  distant server while a much larger picture remains visibly filed on a desk.
- Carrying subject: a thick plum image folder with the same sun-and-hill image.
  The small paper slip marked `ETag "v7"` refers to that image; it is not the
  body, not a security token and not a checksum guarantee.
- Look: playful paper engineering. Oversized lilac filing desk fills the lower
  half; a single orange folded slip cuts across the open upper space. A postage
  stamp silhouette suggests a request without pretending HTTP is postal mail.
- Layout: centered two-line hook; diagonal slip above a stable horizontal desk;
  cache label on the desk and server label at the far destination.

  ```text
       Send the tag.
       Keep the image.
               [server]
     [small tag] / 
  ===== saved-image desk =====
  ```

- Tokens: porcelain `#FAF5FF`, plum `#43265F`, lilac `#B7A0D2`, orange
  `#C44814`, ink `#271338`, paper `#FFFFFF`. Georgia bold for the hook;
  Segoe UI Semibold for object labels; fallbacks Times New Roman, Arial and
  sans-serif. Display 112 px, body 48 px, exact technical label 50 px.
- Teaching extension if selected: the folder can stay on the desk through fresh
  reuse and stale validation; the slip carries the stored validator, then a 304
  permits local reuse of the existing folder or a 200 delivers a replacement
  picture. The server never sends the saved folder back with a 304.
- Rules out: animating the whole image back to the server during validation,
  implying every load needs a round trip, literal mail costs or latency claims.
- Asset plan: authored image folder, desk/cubby cutaway, validator slip and server
  hatch. No decorative mail icons or character mascot required.

### C. The version comparison bench

- Hook: **Same version? Same picture.** Two large version tabs meet at a bench;
  the saved image remains under a magnifying frame. The match is about the
  selected image representation, not every item on a page.
- Carrying subject: one punched image plate with a cyan corner. A matching
  version tab identifies that plate. Its image is never replaced merely because
  freshness ends.
- Look: flat blue technical workshop, bright lemon comparison bracket, white
  and cyan geometry. Large equal sign, no fake dashboard chrome. It presents
  comparison itself as the memorable graphic.
- Layout: headline top left; saved/server version tabs side by side across the
  middle; an enormous comparison mark connects them to a local image below.

  ```text
  Same version?
  Same picture.
  [saved v7]   [server v7]
           =
      [local image plate]
  ```

- Tokens: blue `#2448A1`, white `#FFFFFF`, cyan `#9DE7F0`, lemon `#FFE479`,
  deep blue `#142D66`, hill `#4DB3AA`. Bahnschrift Condensed bold for display;
  Segoe UI for labels; Arial Narrow, Arial and sans-serif fallbacks. Display
  112 px, version values 100 px, body labels 50 px.
- Teaching extension if selected: freshness permits reuse without a comparison;
  after it becomes stale, the request sends the saved ETag; a match yields 304
  and the same plate; a changed representation can yield 200 and a new plate.
- Rules out: treating an ETag as an encryption key or a promise about a whole
  page, complex circuit boards, tiny code and decorative scrolling counters.
- Asset plan: two version tabs, comparison bracket and authored image plate;
  local SVG only. The technical exactness belongs in narration if selected.

## Review against the brief before build

The first draft idea was three framed-image layouts. Rejected: that changed
styling while repeating the mechanism. The revised candidates use a retained
object, a small-request/large-body contrast, and a version comparison respectively.
They support all six required claims without requiring a different metaphor
halfway through. No card grid, stock cloud/network diagram, generic gradient or
implied universal caching behavior is needed.

The orange state tab in A labels freshness explicitly; it does not label the
image itself as expired. B labels cache and server to avoid implying a server
must receive the image to identify it. C labels version tabs as an illustrative
ETag example and retains the local body below the match. None assumes user
selection. No animation, final narration, Gate 1, Gate 2 or render is authorized
by this board.

## Screenshot critique

Captured and inspected `sketches/concepts-wide.png` at 1440 px and
`sketches/concepts-phone.png` at 390 px. The hook and persistent object are
visually distinct in all three candidates. A keeps the expired marker separate
from the intact image; B separates the small request slip from the large stored
folder; C makes the version comparison dominant without shrinking the image
into a network diagram. The initial phone capture exposed undersized secondary
labels, so 44–46 px SVG labels were raised to 50 px and long caveat copy shortened.
At a 350 px frame width, the smallest support label is approximately 15.6 px;
support labels need another pass if selected for narrower playback. No clipped
text or horizontal page overflow was observed after the update.

The Motion Director identified a narrative-order constraint: A directly depicts
the expiry hook. B and C show their distinctive later mechanism. If B or C is
selected, its actual opening must first preserve the stale stored image, then
introduce dispatch or comparison at the corresponding narration. The concept
board does not set scene order. C's comparison belongs to server-side validation
after an outbound conditional request; do not imply the two tags meet locally
before a request exists.

Technical screenshots establish layout, not beginner comprehension, finished
video quality or motion quality. The independent reviewer
must apply the user-confirmed weighting: Jakub primary for readability/polish,
Jhey secondary for creative teaching motion, Emil selective for preview controls.


## Independent framing finding and revision

The Independent Reviewer found actual safe-area violations in the original
concepts: headings above y180, B's second headline beyond x936, and supporting
labels below y1600. The original HTML, screenshots and art evidence are preserved
under `sketches/before-revision/`. This was a real failure of the original phone
QA: checking page overflow did not check the channel's internal safe rectangle.

Recomposed all candidates: headings now begin below y180; B's headline is centered
within the asymmetric safe rectangle; lightbox, desk and comparison geometry
fit x72..936; lower labels were brought up into y180..1600. C's redundant example
caveat moved to its external caption. Teaching image bodies remain large (A
approximately 732 px wide; B 467 px; C 514 px); technical values remain readable.
This revision has fresh screenshots and explicit browser-measured bounds in
`sketches/framing-check.json`. Independent acceptance belongs to the Reviewer.

## Selected A: complete actual-asset static board

`sketches/board.html` covers every script line with before/action/result poses.
These are actual authored SVG compositions, not verbal descriptions or a timed
animation. `board-line-01.png` through `board-line-10.png` are complete three-pose
contact sheets. `board-L01-before-phone.png` through the corresponding L10 result
files capture every pose at a 390 px phone viewport (350 px frame width).

| Script line | Pose IDs | Visible teaching evidence |
| --- | --- | --- |
| 1 | L01-before / action / result | Expired freshness marker, intact notched local image. |
| 2 | L02-before / action / result | Freshness marker is separate from body and storage. |
| 3 | L03-before / action / result | Explicit Fresh case; local display uses retained body while server stays idle. |
| 4 | L04-before / action / result | Only freshness changes from Fresh to Stale; image does not fade or disappear. |
| 5 | L05-before / action / result | Saved v7 validator, outgoing label-only midpoint, arrival at server. |
| 6 | L06-before / action / result | Request label reaches server-current v7; saved body remains local and unobscured. |
| 7 | L07-before / action / result | Server match; status-only 304; local view of original body. |
| 8 | L08-before / action / result | Clearly separate changed-response alternative: new v8 body arrives before alternate cache replacement; main v7 stays visible below. |
| 9 | L09-before / action / result | Return emphasis to unchanged path; policy and retained-copy conditions; no eviction plot. |
| 10 | L10-before / action / result | Explicit unchanged-path bookend, matching check, same original image. |

After 304, the marker says **Prior expiry**, rather than asserting the current
freshness policy or implying that every validation universally resets freshness.
The local-display panel and freshness marker use separate free rows. The initial
selected-board critique caught their overlap; the marker was moved to y1430�1526
in the two-column workshop, keeping both readable. Request midpoint is beside,
not over, the retained image.

Stable semantic IDs use `data-object`; unique pose IDs use the enclosing figure.
The outer `data-scenario` provides the identity namespace. Main housing is
`main-lightbox-housing`, body `cache-body-v7`, notch `image-notch`, marker
`cache-freshness`. `local-display` is a view with `data-source="cache-body-v7"`,
never a newly downloaded body. The changed branch is `scenario-alt`, with
`alt-lightbox-housing`, `alt-cache-body-v7`, `incoming-body-v8` and
`alt-cache-body-v8`. Main `scenario-main/cache-body-v7` remains a still witness
through that alternative. Server shelf and response receipts are separate
objects. The Animator must preserve these identities or document an explicit map.

The large top text on key poses identifies the teaching state. It is not a second
narration track or permission to show a headline throughout every spoken line.
Motion Director controls sparse label presence, causal transitions and true rest.
No motion quality, final synchronization or approval is claimed by these stills.
