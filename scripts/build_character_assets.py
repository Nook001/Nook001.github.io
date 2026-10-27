"""Package approved local prototype frames for the homepage; does not edit source.
Requires Pillow only for this optional authoring step, never for Jekyll builds.
Usage: python scripts/build_character_assets.py --prototype work/chibi-prototype
"""
from pathlib import Path
from PIL import Image
import argparse,hashlib,json

parser=argparse.ArgumentParser();parser.add_argument('--prototype',type=Path,required=True)
args=parser.parse_args();root=Path(__file__).resolve().parents[1]
source=args.prototype.resolve();out=root/'assets/character';out.mkdir(exist_ok=True)
names=['hair_back_crown','hair_back_left','hair_back_right','outfit_with_arms',
       'face_open','face_closed','glasses','hair_front_crown','hair_front_left',
       'hair_front_right','headband','desk','lamp','laptop','cup']
sheet=Image.new('RGBA',(1024,2048));frames={};x=y=2;row=0
for name in names:
    image=Image.open(source/f'assets/{name}.png').convert('RGBA');w,h=image.size
    box=image.getchannel('A').getbbox();assert box is not None
    piece=image.crop(box);pw,ph=piece.size
    if x+pw+2>1024:x=2;y+=row+4;row=0
    assert y+ph+2<=2048
    sheet.alpha_composite(piece,(x,y))
    frames[name]={'frame':dict(x=x,y=y,w=pw,h=ph),'rotated':False,'trimmed':True,
      'spriteSourceSize':dict(x=box[0],y=box[1],w=pw,h=ph),'sourceSize':dict(w=w,h=h),
      'anchor':dict(x=0,y=0)}
    x+=pw+4;row=max(row,ph)
sheet=sheet.crop((0,0,1024,y+row+2));sheet.save(out/'atlas.webp',lossless=True,method=6)
(out/'atlas.json').write_text(json.dumps({'frames':frames,'meta':{'image':'atlas.webp','format':'RGBA8888','size':dict(w=sheet.width,h=sheet.height),'scale':'1'}},indent=2),encoding='utf-8')
rig=json.loads((source/'assets/rig.json').read_text(encoding='utf-8'))
(out/'rig.json').write_text(json.dumps(rig,indent=2),encoding='utf-8')
obsolete=out/'fallback.webp'
if obsolete.exists():obsolete.unlink() # Explicitly removed by the user; never emit a replacement.
origin=json.loads((source/'assets/extraction.json').read_text(encoding='utf-8'))
def digest(path):
    data=path.read_bytes()
    if path.suffix=='.json':data=data.replace(b'\r\n',b'\n')
    return hashlib.sha256(data).hexdigest()
manifest={'version':1,'source':origin['source'],'parts':{name:origin['parts'][name] for name in names},
 'atlas':'15 approved parts, transparent trim, original sourceSize/origin retained; lossless WebP',
 'files':{p.name:digest(p) for p in out.iterdir() if p.name!='provenance.json'}}
(out/'provenance.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
for p in out.iterdir():print(f'{p.name}: {p.stat().st_size:,} bytes')
