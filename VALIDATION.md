# Current validation

Snapshot: 25 October 2026, local branch `site/warm-forest-dark`.
No push, PR, merge, Pages-setting change or deployment was performed in this review.
Earlier iteration records remain in Git history, outside the default reading path.

## Commands

Run from the repository with Ruby 3.3/Bundler and Python 3:

```powershell
ruby scripts/check_content.rb
ruby scripts/check_content.rb --release
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
bundle exec ruby scripts/check_articles.rb
git diff --check
```

The local retained Ruby runtime can be added to the current session PATH if needed:

```powershell
$runtimeBin = 'C:\Users\Nook\Documents\Codex\2026-10-25\referenced-chatgpt-conversation-this-is-an\work\rubyinstaller-3.3.13-1-x64\bin'
$env:PATH = $runtimeBin + ';' + $env:PATH
```

No global PATH or Git identity change is required. New native gem installations need
RubyInstaller with Devkit; the retained runtime is sufficient for the installed gems.

## Acceptance conditions

- Normal and release gates pass without clearing unresolved review/privacy markers.
- Production output contains no drafts, future/unpublished content, private draft
  directory, source resume/CV, development docs/scripts/templates or fixture site.
- Each generated page has a single h1, language/title/canonical/viewport and a main;
  images have alt attributes; local links/fragments, feed and sitemap resolve.
- New experience entries require only YAML edits. Dates use the documented format,
  current is boolean and agrees with Present, and referenced local logos exist.
- Review homepage and article at 1440, 1024, 768, 390 and 320 CSS px. No whole-page
  horizontal overflow; long code/tables scroll within their own containers.
- Preserve homepage timeline/columns/project-grid geometry, approved facts, colors
  and fonts. Compare before/after screenshots for CSS changes.
- Check skip link, keyboard focus, code/table keyboard scrolling, heading hierarchy,
  meaningful image alternatives and text contrast. Browser checks do not substitute
  for a full screen-reader/device audit.

## Latest executed results

| Check | Result |
| --- | --- |
| Normal content gate | PASS: five Markdown content files, profile and five schema-validated experiences |
| Release content gate | PASS: education, contacts, CV privacy and review markers |
| Production build with strict front matter and trace | PASS: Jekyll 3.10.0 / Ruby 3.3.13 |
| Generated site | PASS: seven HTML pages; links/fragments, semantics, XML and exclusions |
| Isolated article regression suite | PASS: two bilingual fixture pages; nine HTML pages in the separate test site |
| Workflow configuration inspection | PASS: only main push / PR-to-main validation, stale-run cancellation, read-only permissions |
| Manual deployment workflow | Byte-for-byte unchanged from the starting commit |
| Git whitespace check | PASS |

The fixture suite verifies headings/lists/quotes, Rouge tokens, image/figure/caption,
semantic table wrappers, language and home/blog/feed indexing. Drafts, future posts,
private files and unpublished posts/projects are excluded. Gate regression cases
accept an added organization and editorial ordering; reject invalid dates/current,
missing logo, public CV, samples, pending reviews and force-tracked private drafts.
Fixture builds live under ignored `work/article-check-*/`; they are never deployed.

## Browser and visual evidence

- Auto / Light / Dark: all six combinations with light/dark system settings passed.
  Auto follows live system changes without reload. All three choices survive Home /
  Projects / Writing navigation and reload; a second open tab synchronizes immediately.
- Header control: native select with accessible name, 64x32px footprint, Tab/arrow/Home/
  End keyboard operation and 2px visible focus. Navigation remains one row at 320px.
- Homepage: Light and Dark passed at 1440, 768, 390 and 320px. No page overflow;
  all logos/avatar loaded. Profile, timeline cards, empty publications rail, section
  headings and project cards retain their exact pre-change geometry. Light screenshots
  below the header match the baseline pixel-for-pixel.
- English/Chinese article fixtures: both themes passed at all four widths. Rouge code,
  quotes, captions, tables and native form controls use the theme tokens. Code/tables
  retain internal horizontal scrolling; images and long inline text fit the page.
- Organization bitmaps have a light backing in Dark. Warwick's original responsive SVG
  retains a transparent backing and supplies its own white crest; no artwork is inverted
  or modified. Avatars and article images are unaffected.
- CSS fallback: six preference/system combinations and light print output passed in
  an isolated fixture with light-dark() disabled. This exercises the fallback rules in
  the current browser; it is not a historical-browser engine certification.
- With JavaScript disabled, the control stays hidden and CSS still follows the system.
  Thirteen isolated script cases cover early restoration, invalid values, persistence,
  Auto removing the stored override, blocked storage, tab sync and history restoration.
  These used the already bundled JS runtime only for local checks, not a site/build dependency.
- Forty contrast pairs passed. Text minimum is 4.72:1 across its actual surfaces;
  new control boundaries and timeline node outlines exceed 3:1. Focus remains visible.
- Forced Dark + print produces white paper, original light text/code colors, wrapped
  long code and a hidden theme control. Reduced-motion emulation reports no transitions
  or animations, with scroll-behavior:auto.
- Screenshots and measurements are retained in the current chat outputs, including
  theme-light/dark-1440.png and theme-light/dark-390.png. No test article is published.

## Limits and follow-up

- This theme branch is local only. No push, PR, merge, deployment or Pages change was
  made; source resume, CV policy and confirmed personal/project content are unchanged.
- Browser checks cover the current Chromium browser, responsive layout and keyboard
  operation; a full screen-reader/physical-device or historical browser audit was not run.
- Ruby dependencies still emit base64/bigdecimal migration warnings for future Ruby 3.4;
  Ruby 3.3 builds succeed. No dependency update is needed for this feature.
- See docs/THEMES.md for the color tokens, no-script/storage behavior and maintenance
  checks. If storage is blocked, manual switching works on the current page but cannot persist.
