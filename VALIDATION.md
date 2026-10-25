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

- First visits without a stored choice follow the system. Browser checks passed
  light/dark/light system changes, including the button's icon and pressed state.
  A click chooses the opposite effective mode and persists across reloads and
  Home / Projects / Writing navigation, overriding later system changes.
- Header control is a 32x32px native sun/moon toggle, with a stable Dark mode label,
  aria-pressed state, Tab/Enter/Space support and a 2px visible focus outline.
  The three-state dropdown is removed; navigation stays one row at 320px.
- Both themes passed at 1440, 768, 390 and 320px on the homepage and reading fixture.
  No page overflow; logos/avatar loaded; reading tables retain native semantics.
- Neutral charcoal replaces forest-green surfaces. Semantic color pairs and the
  light-dark()/media-query fallback architecture are unchanged. Forty contrast
  pairs passed, with text >=4.72:1 and control/node boundaries >3:1.
- The homepage's profile, cards, timeline, headings and empty publications rail
  retain exact pre-theme geometry. Light screenshots below the header remain
  pixel-identical to the original baseline at all four required widths.
- Organization bitmaps retain their light backing. Warwick's responsive SVG supplies
  its white crest in Dark without image inversion. Asset files are unchanged.
- Sixteen isolated script cases passed: system detection, first-click direction,
  manual preference priority, old preference compatibility, early restore,
  blocked storage, tab sync, legacy media listener and history restoration.
  The existing bundled JS runtime was used for local tests only, not a build dependency.
- With JavaScript disabled, the button is hidden and CSS still follows the system.
  Forced Dark prints white paper/light text and hides the button. No animation or
  transition was added; the existing reduced-motion behavior remains unchanged.
- Content/release/build/output/article/whitespace checks passed. No test article is
  published. Current screenshots: charcoal-light/dark-1440.png and -390.png in the
  chat outputs; charcoal-dark-preview.png shows the revised header and surfaces.

## Limits and follow-up

- This theme branch is local only. No push, PR, merge, deployment or Pages change was
  made; source resume, CV policy and confirmed personal/project content are unchanged.
- Browser checks cover the current Chromium browser, responsive layout and keyboard
  operation; a full screen-reader/physical-device or historical browser audit was not run.
- Ruby dependencies still emit base64/bigdecimal migration warnings for future Ruby 3.4;
  Ruby 3.3 builds succeed. No dependency update is needed for this feature.
- See docs/THEMES.md for the color tokens, no-script/storage behavior and maintenance
  checks. If storage is blocked, manual switching works on the current page but cannot persist.
