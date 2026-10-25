"""Freeze actual variable-font glyphs and measured envelopes for authored expressions; offline."""
import hashlib, json, subprocess
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.roundingPen import RoundingPen
root=Path(__file__).resolve().parent.parent
sha=lambda b:hashlib.sha256(b).hexdigest()
fonts={
 'inter':{'path':'fonts/inter-heading/InterVariable.woff2','sha256':'693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3','licensePath':'fonts/inter-heading/LICENSE.txt'},
 'flex':{'path':'fonts/roboto-flex/RobotoFlex.ttf','sha256':'9b523f7d82593df0107173849ebb8c817471a1df4b4fb2c3cbf40cfd810c8281','licensePath':'fonts/roboto-flex/LICENSE.txt'}}
loaded={}
for key,meta in fonts.items():
 assert sha((root/'public'/meta['path']).read_bytes())==meta['sha256']
 f=TTFont(root/'public'/meta['path']);loaded[key]=f
 meta.update(license='OFL-1.1',licenseHash=sha((root/'public'/meta['licensePath']).read_bytes()),axes={a.axisTag:{'min':a.minValue,'default':a.defaultValue,'max':a.maxValue} for a in f['fvar'].axes},unitsPerEm=f['head'].unitsPerEm)
recipes=[
 ('weight','Review','inter',{'wght':400,'opsz':14},{'wght':850,'opsz':14},False),
 ('optical','Clear\nReview','inter',{'wght':700,'opsz':14},{'wght':700,'opsz':32},False),
 ('width','Make room','flex',{'wght':650,'opsz':32,'wdth':100},{'wght':650,'opsz':32,'wdth':65},False),
 ('hierarchy','Human\nReview','flex',{'wght':400,'opsz':14,'wdth':100},{'wght':850,'opsz':48,'wdth':85},False),
 ('character','REVIEW','flex',{'wght':400,'opsz':14,'wdth':100},{'wght':850,'opsz':32,'wdth':80},True)]
entries=[]
for key,label,font_id,start,end,characters in recipes:
 f=loaded[font_id];cmap=f.getBestCmap();states=[]
 assert set(start)==set(end) and all(tag in fonts[font_id]['axes'] and fonts[font_id]['axes'][tag]['min']<=v<=fonts[font_id]['axes'][tag]['max'] for pose in [start,end] for tag,v in pose.items())
 for step in range(121):
  axes={tag:start[tag]+(end[tag]-start[tag])*step/120 for tag in start};glyph_set=f.getGlyphSet(location=axes);glyphs={}
  for ch in sorted(set(label)-{'\n'}):
   glyph=glyph_set[cmap[ord(ch)]];pen=SVGPathPen(glyph_set);bounds=BoundsPen(glyph_set)
   glyph.draw(RoundingPen(pen,roundFunc=lambda x:round(x,3)));glyph.draw(bounds)
   glyphs[ch]={'path':pen.getCommands(),'bounds':list(bounds.bounds or (0,0,0,0)),'advance':glyph.width}
  states.append({'axes':axes,'glyphs':glyphs})
 # Independent per-character maxima also enclose the staggered combinations.
 widths={ch:max(max(s['glyphs'][ch]['advance'],s['glyphs'][ch]['bounds'][2])-min(0,s['glyphs'][ch]['bounds'][0]) for s in states) for ch in set(label)-{'\n'}}
 ascent=max(g['bounds'][3] for s in states for g in s['glyphs'].values());descent=max(-g['bounds'][1] for s in states for g in s['glyphs'].values())
 envelope={'width':max(sum(widths[ch] for ch in line) for line in label.split('\n')),'ascent':ascent,'descent':descent,'cells':widths}
 entry={'id':key+'@1','label':label,'font':font_id,'from':start,'to':end,'characters':characters,'steps':120,'envelope':envelope,'states':states}
 entry['contentHash']=sha(json.dumps(entry,separators=(',',':'),ensure_ascii=False).encode());entries.append(entry)
 print(key, '121 actual axis states, measured glyphs and conservative envelope')
assert len(entries)==5 and 'wdth' not in fonts['inter']['axes']
target=root/'workflow/variable-type-atlas.json';target.write_text(json.dumps({'fonts':fonts,'expressions':entries},separators=(',',':'),ensure_ascii=False)+'\n')
subprocess.run(['node','-e',"const fs=require('fs'),crypto=require('crypto'),p=process.argv[1],data=JSON.parse(fs.readFileSync(p));for(const entry of data.expressions){delete entry.contentHash;entry.contentHash=crypto.createHash('sha256').update(JSON.stringify(entry)).digest('hex')}fs.writeFileSync(p,JSON.stringify(data)+'\\n');",str(target)],check=True)
print(target, target.stat().st_size)
