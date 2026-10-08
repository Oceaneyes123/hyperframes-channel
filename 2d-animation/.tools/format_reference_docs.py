from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
GROUPS = {
    'DESIGN.md': [
        ('Safe canvas and visible structure', 'Use native 1080×1920 portrait.'),
        ('Object scale and spacing', 'Compose asymmetrically and anchor objects'),
        ('Layered backdrop', 'Use a dark navy base'),
        ('Fonts and sizes', 'Use Geist or Space Grotesk'),
        ('Semantic colors', 'Color carries meaning:'),
        ('Labels and exact values', 'Default to no text.'),
        ('Copy restrictions', 'Do not add narration summaries,'),
        ('Temporary and kinetic text', 'A title or large word'),
        ('Coherent artwork family', 'For new videos, the teaching stage'),
        ('Depth and occlusion', 'For illustrated depth,'),
        ('Motion-v1 fonts and label placement', 'Motion-v1 projects bundle Barlow'),
        ('Asset records and local files', 'Use one coherent family of colored'),
        ('Intermediate poses', 'Design the silhouette between key poses'),
        ('Phone-size review and continuity', 'Each frame has one dominant focal'),
    ],
    'MOTION.md': [
        ('Beat sequence and storyboard ownership', 'Plan **setup → anticipation'),
        ('Choose the explanation', 'Choose the visual explanation in this order:'),
        ('Comprehension holds', 'Avoid long periods without meaningful change'),
        ('Preserve narration and runtime', 'For new videos and explicitly requested redesigns,'),
        ('Cover the full narration window', 'Choreograph the full narration window'),
        ('Dominant and supporting layers', 'Layer one dominant action'),
        ('Topic-specific background detail', 'Use the layered backdrop direction'),
        ('Readability and quiet intervals', 'Keep background movement lower contrast,'),
        ('Deterministic implementation', 'All background and secondary motion'),
        ('Cue-driven performance', 'Animate necessary text under'),
        ('Rigid glyphs and exact values', 'Rigid labels means undistorted'),
        ('Cause and result', 'Use one dominant motion event'),
        ('Encryption and rejection examples', 'For encryption, close a lock'),
        ('Inherited states', 'Prefer moving, transforming, opening,'),
        ('Persistent identity and factual boundaries', 'Keep important objects alive'),
        ('Motivated camera movement', 'Move the camera to reveal'),
        ('Transitions between ideas', 'A hard cut starts a new concept'),
        ('Choose treatment from meaning', 'New videos should feel like illustrated'),
        ('Object behavior and metaphor boundaries', 'Give important objects behavior:'),
        ('Discoveries and payoffs', 'Plan playful moments throughout'),
        ('Secondary motion and audio', 'Build secondary motion into the same event:'),
        ('Record direction and reuse examples', 'Record the visual treatment,'),
        ('Compose overlapping transitions', 'For a transition with visual overlap,'),
        ('Phrase anchors', 'Align an important action with'),
        ('Measured timing and cue ownership', 'Estimate cue intent for Gate 1.'),
        ('Onset, contact and resolved pose', 'Distinguish **onset**,'),
        ('Runtime and transform ownership', 'Future design-v2 videos should opt'),
        ('Sampling and review', 'Use pure drawing attached to a paused'),
    ],
    'SCRIPT_GUIDE.md': [
        ('Sentence purpose', 'Every sentence must do at least'),
        ('Pacing and complete coverage', 'Remove filler, repeated setup,'),
        ('Pair narration with a visible mechanism', 'Prefer showing an idea visually'),
        ('Scene passages and planning cues', 'Keep one coherent narration passage'),
        ('Originality', 'Write original educational narration.'),
        ('Handoff review', 'Before handoff, trace the hook,'),
    ],
    'BUILD.md': [
        ('Generate narration after Gate 1', 'After Gate 1, dry-run'),
        ('Shared voice and pronunciation', 'All new HyperFrames narration uses'),
        ('Measured metadata', '`audio_meta.json` is canonical:'),
        ('Phrase cues and audio mounts', 'Use optional `motion_beats.json`'),
        ('Resolve and stage local assets', 'Resolve local assets before sketching'),
        ('Asset paths and semantic color', 'Never load a render-time CDN asset.'),
        ('Frame timelines and inherited state', 'Each frame is sized 1080×1920'),
        ('Generators and rebuilds', 'For more than eight scenes,'),
        ('Enable and stage motion v1', 'Set `motion_version` to'),
        ('Adapt articulated props and handoffs', 'For articulated props and complete'),
        ('Regeneration and audio changes', 'If the target project uses a scene generator,'),
    ],
    'VERIFY.md': [
        ('Scene and cut evidence', 'Review the complete sequence at phone size.'),
        ('Sound-off and narration review', 'Play the preview once sound-off'),
        ('Motion-v1 sample points', 'For motion-v1 scenes, inspect onset,'),
        ('Required checks and target preview', 'Run `node scripts/test_motion.mjs`'),
        ('Optional historical regression check', '`scripts/test_motion_browser.mjs` is an optional'),
        ('Snapshot evidence', "HyperFrames snapshot overwrites the project's"),
        ('Story and causal clarity', '- Does the script naturally'),
        ('Timing, continuity and sustained motion', '- Do important actions happen around'),
        ('Background and text performance', '- Is the backdrop designed'),
        ('Treatment, performance and factual boundaries', '- Which effects, transitions'),
        ('Depth and composited handoffs', '- For performances and depth,'),
        ('Review priorities and constraints', 'Prioritize viewer retention,'),
        ('Evidence status', "Use the storyboard's existing action rows"),
        ('Planned versus actual evidence', 'At Gate 1 a pass means'),
        ('Craft inspection', 'For the research-backed craft principles'),
        ('Inactive windows and changed previews', 'Review gaps between meaningful events'),
        ('Flag and resolve text issues', 'Flag transcript duplication,'),
        ('Gate 2 approval', 'After all scene and cut reviews pass,'),
        ('Export verification', 'Inspect a frame from the exported MP4.'),
        ('Capture behavior and timing', 'Keep ordinary HyperFrames preview'),
        ('Dependencies and export limits', 'The script reuses installed HyperFrames dependencies'),
        ('Before-approval stills', 'Before approval, capture representative'),
        ('Comparison and capture cost', 'Use matching times in preview mode'),
    ],
    'channel/CHANNEL_RECIPE.md': [
        ('Scope and canonical beat plan', 'Give a frame worker only'),
        ('Chosen example and adaptation', 'For significant choreography,'),
        ('Shot progression and inherited pose', 'Include the shot progression,'),
    ],
    'channel/EXPLAINER_REFERENCE.md': [
        ('Choose a relevant pattern', 'Use the [flow-motion guide]'),
        ('Cache-hit example boundaries', 'The cache-hit example begins'),
    ],
    'channel/MOTION_API.md': [
        ('Mounting and selector scope', '`mount` uses a GSAP property setter,'),
        ('Transform writers and route coordinates', 'One writer owns each transform.'),
        ('Scene scheduling and overlap', 'These are visual states, not clip scheduling.'),
        ('Local handoff examples', 'See the [complete local handoffs]'),
        ('Validation, provenance and audio changes', 'The other source value is'),
        ('Semantic intent and listening review', '`MOTION.md` owns cue intent.'),
    ],
    'channel/MOTION_LIBRARY.md': [
        ('Timing starting points', 'Choose timing by role,'),
        ('Scope and limitations', 'The entrance and exit `kind` names'),
        ('Container transformations', 'For a container transformation,'),
        ('Wrappers and parallax', 'Use separate nested wrappers for world camera,'),
        ('Scene boundaries and overlapping states', 'Scene hosts remain contiguous.'),
        ('Adapt the local example', 'For complete playful technical-flow implementations'),
        ('Sample and review', 'Review onset, midpoint, arrival,'),
    ],
    'channel/OPUS_ANIMATION_RESEARCH.md': [
        ('Code-based authoring and production context', 'The useful capability is code-based'),
        ('Model claims and evaluation limits', "Anthropic's [Opus 5.5 announcement]"),
        ('Transferable direction', 'There is no single “Opus style.”'),
        ('Example metaphors and boundaries', 'Examples: a queue builds'),
        ('Existing runtime and limitations', 'Use the existing paused GSAP timeline,'),
        ('Permanent rule owners', 'The permanent application lives'),
        ('Local implementation evidence', 'The [local example source]'),
        ('Two-gate acceptance', 'At Gate 1 review actual-asset sketches'),
    ],
    'channel/MOTION_DESIGN_RESEARCH.md': [
        ('Observed evidence', 'The sources below were read directly.'),
        ('Limits of creator examples', 'The old creator examples establish'),
        ('Record the study', "Use the storyboard's existing Example adaptation field."),
        ('Transfer principles and respect reuse boundaries', 'Transfer a principle,'),
        ('Acceptance scope', 'No additional approval gate,'),
    ],
    'examples/flow-motion/README.md': [
        ('Body acting and articulated parts', 'Travel belongs to the outer prop;'),
        ('Handoff boundaries', 'The transitions connect independent'),
        ('Shadows, parallax and occlusion', 'Depth uses the existing SVG gradients,'),
        ('Browser-check evidence', 'The browser check exercises'),
        ('Playback and raster tolerance', 'Inspect playback as well as stills;'),
        ('Intentional hinge warning', 'HyperFrames may report'),
    ],
}

# Only wide, prose-heavy catalogs become vertical entries. Compact lookup
# tables remain tables so their relationships can still be scanned together.
TABLES = {
    'channel/MOTION_LIBRARY.md': ['Preset', 'Treatment'],
    'channel/OPUS_ANIMATION_RESEARCH.md': ['Reference'],
    'channel/MOTION_DESIGN_RESEARCH.md': ['Source'],
}

def stack_tables(text, names):
    lines = text.splitlines()
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        cells = [cell.strip() for cell in line.strip('|').split('|')]
        if line.startswith('| ') and cells[0] in names:
            headers = cells
            i += 2
            while i < len(lines) and lines[i].startswith('| '):
                cells = [cell.strip() for cell in lines[i].strip('|').split('|')]
                assert len(cells) == len(headers)
                out += ['### ' + cells[0], '']
                for label, content in zip(headers[1:], cells[1:]):
                    out += ['- **' + label + ':** ' + content, '']
                i += 1
        else:
            out.append(line)
            i += 1
    return '\n'.join(out) + '\n'

def outside_fences(text):
    return re.sub(r'^```[^\n]*\n.*?^```[^\n]*$', '', text, flags=re.M | re.S)

def slug(heading):
    heading = re.sub(r'[`*_]', '', heading).lower()
    return re.sub(r'[^\w\- ]', '', heading).replace(' ', '-')

originals = {name: (ROOT / name).read_text(encoding='utf-8') for name in GROUPS}
backup = ROOT / '.tools/reference-docs-before-format.json'
assert not backup.exists(), 'Keep the original snapshot; do not overwrite it.'
backup.write_text(json.dumps(originals, ensure_ascii=False, indent=2), encoding='utf-8')

for name, original in originals.items():
    text = original
    for heading, anchor in GROUPS[name]:
        assert text.count(anchor) == 1, (name, anchor)
        # A few anchors start inside an existing paragraph. Split the block
        # without changing the sentence itself.
        text = text.replace(anchor, '\n\n### ' + heading + '\n\n' + anchor, 1)
    text = stack_tables(text, TABLES.get(name, []))
    text = re.sub(r'\n{3,}', '\n\n', text)
    headings = re.findall(r'^## (.+)$', outside_fences(text), re.M)
    if len(headings) >= 5:
        toc = '**On this page**\n\n' + '\n'.join(
            '- [' + h + '](#' + slug(h) + ')' for h in headings
        ) + '\n\n'
        pos = text.index('## ')
        text = text[:pos] + toc + text[pos:]
    (ROOT / name).write_text(text, encoding='utf-8', newline='\n')
    print(name)
