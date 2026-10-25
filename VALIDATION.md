# Current validation

Snapshot: 25 October 2026, local branch `maintenance/blog-readiness`.
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

- Homepage: all five widths passed with loaded logos/avatar, five entries and one
  current node. Before/after geometry matched for cards, headings, empty publications
  axis and project grid. Screenshot crops above Writing matched pixel-for-pixel.
- English and Chinese article fixtures: all five widths passed without page overflow;
  language is respectively en / zh-CN. Long links/inline code wrap, images fit, Rouge
  colors apply, and long code/tables scroll independently. Native table display stays table.
- Qingyin project detail: all five widths retain a single h1 and no page overflow.
- Keyboard: homepage Tab exposes the skip link; Enter moves focus to main. Code and
  table regions show a 2px focus outline and ArrowRight advances their scroll position.
- Text: existing body/heading/muted text on paper/card remains >=4.5:1; new code token
  colors on the code surface are >=4.9:1. Fine decorative rails are not text.
- Before/after screenshots, measurements and a reading preview are retained in the
  current chat outputs. The only homepage content removal is the explicitly requested
  Qingyin playback-events article; no replacement example is published.

## Limits and follow-up

- This branch's updated workflow has not run on a GitHub-hosted runner; local checks
  and YAML/permission inspection passed. Remote verification awaits authorization.
- Ruby dependencies emit base64/bigdecimal migration warnings for future Ruby 3.4;
  the selected Ruby 3.3 build succeeds. No dependency upgrade is required this round.
- The removed article's old URL will become 404 only after a separately authorized
  deployment. No replacement destination was supplied, so no redirect is invented.
- Publications remains deliberately empty. Hiding it would shift desktop balance and
  remove the mobile empty gap; defer that visual decision until requested/real papers exist.
