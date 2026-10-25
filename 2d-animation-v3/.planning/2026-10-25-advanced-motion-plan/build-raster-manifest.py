from pathlib import Path
from PIL import Image
import hashlib, json

p = Path('public/media/collage')
im = Image.new('RGBA', (64, 64))
im.putdata([(32, 59, 58, (x*17+y*31+x*y*7) % 19) for y in range(64) for x in range(64)])
im.save(p/'paper-grain-v1.png')
assets = []
for id, name, license, source in [
    ('fictional-desk@1', 'fictional-desk-v1.png', 'AI-generated output; no third-party stock license asserted', 'OpenAI ImageGen, 2026-10-25; original fictional desk still life generated for this project'),
    ('paper-grain@1', 'paper-grain-v1.png', 'CC0-1.0', 'Original procedural RGBA grain authored for HyperFrames V3'),
]:
    b = (p/name).read_bytes()
    im = Image.open(p/name)
    im.verify()
    im = Image.open(p/name)
    assets.append(dict(id=id, path='media/collage/'+name, contentHash=hashlib.sha256(b).hexdigest(), byteLength=len(b), width=im.width, height=im.height, mime='image/png', format='png', animated=False, hasAlpha=im.mode=='RGBA', license=license, source=source, intendedUse='Fictional editorial collage only; not evidence of an actual business'))
    print(id, im.size, im.mode, len(b))
Path('workflow/raster-assets.json').write_text(json.dumps(assets, indent=2)+'\n', encoding='utf-8')
