"""Standard-library release checks for the optional homepage character assets."""
import hashlib,json
from pathlib import Path

def check_character(root):
    home=(root/'index.html').read_text(encoding='utf-8')
    if 'sidebar-character.js' not in home:return
    assert 'data-character-toggle' not in home,'User requested automatic character without added buttons'
    base=root/'assets/character'
    assert 'sidebar-illustration' not in home and 'fallback.webp' not in home,'User removed character fallback artwork'
    assert not (base/'fallback.webp').exists(),'Character fallback must not be shipped'
    manifest=json.loads((base/'provenance.json').read_text(encoding='utf-8'))
    for name,digest in manifest['files'].items():
        p=(base/name).resolve()
        assert p.is_relative_to(base.resolve()),'Character asset path escapes directory'
        data=p.read_bytes()
        if p.suffix=='.json':data=data.replace(b'\r\n',b'\n')
        assert hashlib.sha256(data).hexdigest()==digest,f'Character hash mismatch: {name}'
    atlas=json.loads((base/'atlas.json').read_text(encoding='utf-8'))
    width,height=atlas['meta']['size']['w'],atlas['meta']['size']['h'];rects=[]
    assert (base/atlas['meta']['image']).is_file(),'Character atlas image missing'
    for name,data in atlas['frames'].items():
        r=data['frame'];x,y,w,h=[r[k] for k in ['x','y','w','h']]
        assert 0<=x<x+w<=width and 0<=y<y+h<=height,f'Character frame outside atlas: {name}'
        for a,b,c,d in rects:assert x+w<=a or a+c<=x or y+h<=b or b+d<=y,'Character atlas frames overlap'
        rects.append((x,y,w,h))
        trim=data['spriteSourceSize'];original=data['sourceSize']
        assert trim['x']+trim['w']<=original['w'] and trim['y']+trim['h']<=original['h']
    rig=json.loads((base/'rig.json').read_text(encoding='utf-8'))
    required={s['part'] for s in rig['springs']}|{p['part'] for p in rig['props']}
    required|={'face_open','face_closed','outfit_with_arms','glasses','headband','hair_front_crown','hair_back_crown'}
    assert required<=atlas['frames'].keys(),'Character rig references missing frames'
    vendor=root/'assets/vendor/pixi-8.22.0.min.js'
    assert hashlib.sha256(vendor.read_bytes()).hexdigest()=='06d9ef9823e743518793083c296d801e752db128cb1f519fbabe37e1259567ea','PixiJS version/content changed without review'
    assert (root/'assets/licenses/pixi-MIT.txt').is_file(),'PixiJS license missing'
    for name in ['head-pose.js','spring.js','renderer.js','attention.js']:assert (root/'assets/js/character'/name).is_file()
    for page in root.rglob('*.html'):
        if page!=root/'index.html':assert 'sidebar-character.js' not in page.read_text(encoding='utf-8'),'Character script should only load on homepage'
    print(f'PASS: {len(rects)} production character frames, rig references, hashes, local runtime/license and homepage isolation.')

if __name__=='__main__':
    import sys
    check_character(Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve())
