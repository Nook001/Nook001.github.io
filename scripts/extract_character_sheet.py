"""Deterministic, non-destructive ROI + alpha-component extraction. Pillow only.
Run with the bundled Python; source bytes are never modified.
ROIs are calibrated to this specific 1448x1086 sheet, not a general AI segmenter.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFilter
import json, hashlib, math

import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--source',type=Path,required=True)
parser.add_argument('--output',type=Path,required=True)
args=parser.parse_args()
ROOT=args.output.resolve()
ROOT.mkdir(parents=True,exist_ok=True)
SOURCE=args.source.resolve()
im = Image.open(SOURCE).convert('RGBA')
assert im.size == (1448,1086)
OUT = ROOT/'assets'
OUT.mkdir(exist_ok=True)
# x,y,w,h; ROI calibration is intentionally explicit and reviewable.
rois = {
 'hair_back':(8,8,320,462), 'hair_front':(336,8,337,462),
 'face_large':(668,36,251,229), 'outfit_with_arms':(637,260,310,264),
 'headband':(920,52,288,211), 'glasses':(1204,162,244,99),
 'arm_left':(933,294,109,207), 'arm_right':(1044,294,80,207),
 'leg_left':(1136,286,93,220), 'leg_right':(1230,286,96,220),
 'shoe_left':(1333,421,55,74), 'shoe_right':(1387,421,61,74),
 'face_open':(17,505,196,187), 'face_closed':(211,505,183,187),
 'face_smile':(395,505,173,187), 'face_surprised':(568,505,192,187),
 'eye_left':(765,517,110,91), 'eye_right':(894,517,111,91),
 'eyelid_left':(1006,541,91,49), 'eyelid_right':(1099,536,98,54),
 'mouth_flat':(1003,615,73,48), 'mouth_smile':(1076,610,72,58),
 'mouth_open':(1151,609,83,68), 'cheek_left':(1276,541,79,58),
 'lamp':(12,702,200,244), 'laptop':(209,761,363,184),
 'cup':(550,824,151,109), 'desk':(3,950,512,92),
 'bow':(663,733,81,78),
 'reference_seated':(738,704,483,374),
 'reference_standing':(1189,657,259,422)
}

def clean_islands(image):
    """Keep the main connected alpha object plus its original edge; no RGB keying."""
    alpha=image.getchannel('A'); w,h=image.size
    original=alpha.tobytes(); active=bytearray(a>10 for a in original)
    keep=bytearray(w*h)
    components=[]
    for seed in range(w*h):
        if not active[seed]: continue
        stack=[seed]; active[seed]=0; component=[]
        while stack:
            i=stack.pop(); component.append(i); x=i%w; y=i//w
            for n in (i-1 if x else -1,i+1 if x<w-1 else -1,i-w if y else -1,i+w if y<h-1 else -1):
                if n>=0 and active[n]: active[n]=0; stack.append(n)
        components.append(component)
    if components:
        for i in max(components,key=len):keep[i]=255
    # One pixel of original antialiasing around retained shapes.
    mask=Image.frombytes('L',(w,h),bytes(keep)).filter(ImageFilter.MaxFilter(3))
    out=image.copy();out.putalpha(ImageChops.multiply(alpha,mask));return out

images={}; provenance={}
for name,(x,y,w,h) in rois.items():
    images[name]=clean_islands(im.crop((x,y,x+w,y+h)))
    provenance[name]={'sourceRect':dict(x=x,y=y,w=w,h=h),'method':'calibrated ROI + alpha largest connected component + 1px original edge'}

# Four conservative long-hair groups. Whole crown pixels conceal the roots.
# Masks partition only existing art; no hidden pixels are inpainted or invented.
for group in ('front','back'):
    original=images['hair_'+group]; w,h=original.size
    masks=[]
    for side in ('left','right'):
        mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask)
        if side=='left':poly=[(0,214),(105,214),(132,285),(128,h),(0,h)]
        else:poly=[(w-105,214),(w,214),(w,h),(w-128,h),(w-132,285)]
        d.polygon(poly,fill=255);masks.append(mask)
        piece=original.copy();piece.putalpha(ImageChops.multiply(original.getchannel('A'),mask))
        name=f'hair_{group}_{side}';images[name]=piece
        provenance[name]={'derivedFrom':'hair_'+group,'maskPolygon':poly,'pivotPx':[88 if side=='left' else w-88,218],'limitation':'rotation-only group; root motion capped; not a separated painted strand'}
    combined=ImageChops.lighter(*masks)
    # Restore 12 px at root for an occluding cap; retains the source design at rest.
    ImageDraw.Draw(combined).rectangle((0,214,w,226),fill=0)
    crown=original.copy();crown.putalpha(ImageChops.multiply(original.getchannel('A'),ImageChops.invert(combined)))
    name='hair_'+group+'_crown';images[name]=crown
    provenance[name]={'derivedFrom':'hair_'+group,'rootOverlapPx':12}

atlas=Image.new('RGBA',(2048,4096));frames={}; x=y=2;row=0
for name,image in images.items():
    w,h=image.size
    if x+w+2>2048:x=2;y+=row+4;row=0
    assert y+h+2<4096
    atlas.alpha_composite(image,(x,y))
    frames[name]={'frame':dict(x=x,y=y,w=w,h=h),'rotated':False,'trimmed':False,
      'spriteSourceSize':dict(x=0,y=0,w=w,h=h),'sourceSize':dict(w=w,h=h),'anchor':{'x':0,'y':0}}
    image.save(OUT/(name+'.png'))
    x+=w+4;row=max(row,h)
height=y+row+2;atlas=atlas.crop((0,0,2048,height));atlas.save(OUT/'atlas.png',optimize=True)
data={'frames':frames,'meta':{'app':'Nook deterministic extraction prototype','version':'1','image':'atlas.png','format':'RGBA8888','size':{'w':2048,'h':height},'scale':'1'}}
(OUT/'atlas.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
provenance={'source':{'file':SOURCE.name,'width':1448,'height':1086,'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest()},'parts':provenance}
(OUT/'extraction.json').write_text(json.dumps(provenance,indent=2),encoding='utf-8')
# Rig-space is in source pixels, origin at neck. Absolute scale applied once to root.
rig={'units':'source pixels','origin':'neck','parts':{
 'hair_back':{'x':-164,'y':-248,'scale':1},
 'outfit_with_arms':{'x':-124,'y':-4,'scale':.8},
 'face_open':{'x':-103,'y':-190,'width':206,'height':190},
 'face_closed':{'x':-103,'y':-190,'width':206,'height':190},
 'hair_front':{'x':-168,'y':-248,'scale':1},
 'headband':{'x':-133,'y':-254,'width':266,'height':160},
 'glasses':{'x':-104,'y':-102,'width':208,'height':84}
},'springs':[
 {'name':'back_left','part':'hair_back_left','base':'hair_back','pivot':[88,218],'frequency':1.55,'dampingRatio':.42,'inertia':.75},
 {'name':'back_right','part':'hair_back_right','base':'hair_back','pivot':[232,218],'frequency':1.8,'dampingRatio':.48,'inertia':.65},
 {'name':'front_left','part':'hair_front_left','base':'hair_front','pivot':[88,218],'frequency':2.2,'dampingRatio':.5,'inertia':.55},
 {'name':'front_right','part':'hair_front_right','base':'hair_front','pivot':[249,218],'frequency':2.0,'dampingRatio':.46,'inertia':.6}
]}
rig['props']=[{'part':'desk','x':-305,'y':440,'width':610,'height':110},{'part':'lamp','x':-301,'y':258,'width':164,'height':200},{'part':'laptop','x':-187,'y':302,'width':333,'height':169},{'part':'cup','x':167,'y':383,'width':125,'height':91}]
(OUT/'rig.json').write_text(json.dumps(rig,indent=2),encoding='utf-8')
contact=Image.new('RGB',(1000,math.ceil(len(images)/5)*155),'#ddd9d1'); d=ImageDraw.Draw(contact)
for i,(name,part) in enumerate(images.items()):
    part=part.copy();part.thumbnail((190,125));xx=(i%5)*200;yy=(i//5)*155
    contact.paste(part,(xx+(190-part.width)//2,yy+20),part);d.text((xx+4,yy+3),name,fill='#141414')
contact.save(OUT/'contact-sheet.png')
print(f'{len(frames)} frames, atlas 2048x{height}; original SHA256 {provenance["source"]["sha256"]}')
