"""Freeze the supported numeric glyphs from the pinned local Inter font; no network."""
import hashlib
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

root = Path(__file__).resolve().parent.parent
source = root / "public/fonts/inter-heading/InterVariable.woff2"
digest = hashlib.sha256(source.read_bytes()).hexdigest()
assert digest == "693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3", "Approved font changed"
font = instantiateVariableFont(TTFont(source), {"wght": 700, "opsz": 14}, inplace=True)
glyph_set, cmap = font.getGlyphSet(), font.getBestCmap()
glyphs = {}
for character in "0123456789$₱€£-,.%":
    name = cmap[ord(character)]
    pen, bounds = SVGPathPen(glyph_set), BoundsPen(glyph_set)
    glyph_set[name].draw(pen)
    glyph_set[name].draw(bounds)
    assert pen.getCommands() and bounds.bounds
    glyphs[character] = {"path": pen.getCommands(), "bounds": list(bounds.bounds)}
atlas = {"id": "inter-numeric-outlines@1", "sourceSha256": digest,
         "license": "OFL-1.1", "licensePath": "public/fonts/inter-heading/LICENSE.txt",
         "axes": {"wght": 700, "opsz": 14}, "unitsPerEm": font["head"].unitsPerEm,
         "glyphs": glyphs}
assert len(glyphs) == 18 and all(len(g["bounds"]) == 4 for g in glyphs.values())
target = root / "workflow/numeric-glyphs.json"
target.write_text(json.dumps(atlas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
assert json.loads(target.read_text(encoding="utf-8")) == atlas
print(f"Frozen {len(glyphs)} licensed numeric outlines")
