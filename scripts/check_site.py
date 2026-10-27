"""Check real Jekyll output, using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
import xml.etree.ElementTree as ET
from check_character_assets import check_character

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
assert root.is_dir(), f'Build output missing: {root}'
check_character(root)
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.h1, self.title, self.canonical = set(), [], 0, False, False
        self.main, self.lang, self.viewport = False, None, False
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id: {a["id"]}'
            self.ids.add(a['id'])
        self.h1 += tag == 'h1'
        self.title |= tag == 'title'
        self.main |= tag == 'main'
        if tag == 'html': self.lang = a.get('lang')
        self.viewport |= tag == 'meta' and a.get('name') == 'viewport'
        self.canonical |= tag == 'link' and a.get('rel') == 'canonical'
        if tag == 'img':
            assert 'alt' in a, 'Image missing alt text'
        for key in ('href', 'src'):
            if key in a: self.links.append(a[key])

pages = {path: Page(path) for path in root.rglob('*.html')}
assert pages, 'No HTML generated'
for path, page in pages.items():
    for check in ('title', 'main', 'lang', 'viewport', 'canonical'):
        assert getattr(page, check), f'{path}: missing {check}'
    assert page.h1 == 1, f'{path}: expected one h1'
    text = path.read_text(encoding='utf-8')
    assert '{%' not in text and '{{' not in text, f'{path}: unresolved template'
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc: continue
        target = (root / unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)).resolve()
        if target.is_dir(): target /= 'index.html'
        assert target.is_relative_to(root), f'{path}: link escapes site: {link}'
        assert target.is_file(), f'{path}: broken local link: {link}'
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f'{path}: missing fragment: {link}'
for file in ('sitemap.xml', 'feed.xml'):
    ET.parse(root / file)
for forbidden in ('README.md', 'AGENTS.md', 'VALIDATION.md', 'Gemfile', 'Gemfile.lock', 'docs', 'scripts', 'sources', 'templates', '_drafts', 'private-drafts', 'work', 'outputs', 'vendor'):
    assert not (root / forbidden).exists(), f'Development file leaked: {forbidden}'
# Derive draft slugs instead of permanently naming one starter note.
source = Path(__file__).resolve().parent.parent
for draft in (source / '_drafts').rglob('*.md'):
    assert not any(path.stem == draft.stem or path.parent.name == draft.stem
                   for path in pages), f'Draft slug leaked: {draft.name}'
assert not (root / 'cv.html').exists() and not (root / 'cv').exists(), 'CV must not be published'
assert not list(root.rglob('*.docx')), 'Private Word document leaked'
print(f'PASS: {len(pages)} HTML pages; local links/fragments, semantics, XML and output exclusions.')
