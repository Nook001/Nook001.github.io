# Current validation

Snapshot: 25 October 2026, local branch `site/reference-palette-refinement`.
The user authorized pushing, merging and deploying this version after requesting a
more transparent header. Pages settings and workflow permissions remain unchanged.
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
- Preserve homepage timeline/columns/project-grid geometry, approved facts and
  fonts. Keep the reference palette documented in docs/THEMES.md. Compare before/after screenshots for CSS changes.
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
| Workflow configuration | Unchanged by this branch; validation and manual deployment policies retained |
| Manual deployment workflow | Byte-for-byte unchanged from the starting commit |
| Git whitespace check | PASS |

The fixture suite verifies headings/lists/quotes, Rouge tokens, image/figure/caption,
semantic table wrappers, language and home/blog/feed indexing. Drafts, future posts,
private files and unpublished posts/projects are excluded. Gate regression cases
accept an added organization and editorial ordering; reject invalid dates/current,
missing logo, public CV, samples, pending reviews and force-tracked private drafts.
Fixture builds live under ignored `work/article-check-*/`; they are never deployed.

## Browser and visual evidence

- Reference source: v587su/v587su.github.io at
  `8c406ea2e273a5037a671a75a7035aa55c1a0353`; live computed colors match the
  source. All fourteen requested core palette values are preserved exactly.
- Homepage and isolated article passed Light / Dark at 1440, 1024, 768, 390 and
  320 CSS px without whole-page horizontal overflow. Code and tables keep their
  own scroll containers. Images and logos load; no image recoloring was added.
- Homepage profile, headings, timeline cards, empty publications rail and project
  cards retain their previous dimensions at all five widths. Font family, size,
  weight and line height remain unchanged. Only the compact header changes the
  main content's vertical starting position (previous header ~88px, now ~53px).
- Sticky header uses a 70% background tint and 10px blur. At desktop
  scroll, its bottom is ~53px and the profile starts at 84px: ~31px clearance.
  At a 360px-tall viewport, profile scrolling keeps the Email link reachable.
- Project hover and keyboard focus produce the accent border without movement;
  inset highlight and small shadow remain subtle. Tab focus and the skip link
  were checked; the skip link sits above the sticky header and focuses main.
- Fresh-origin visits follow Light / Dark / Light system changes and update the
  button. One click chooses the opposite effective mode and persists through
  reload and Projects navigation. Sixteen isolated toggle-script cases pass.
- Forty-four text contrast pairs pass, minimum 4.63:1, including syntax colors.
  Control borders use a separate accessibility token: 3.39:1 light / 3.22:1 dark
  against the surface. Decorative borders keep the reference's original values.
- Article screenshots were inspected for comments, keywords, strings, numbers,
  names, diffs and quotation hierarchy. Table headers and form fields use the
  secondary surface / surface tokens in both themes. Bilingual fixture checks pass.
- With scripts disabled, the control is hidden and system light/dark still works.
  A manually forced Dark page prints white paper/dark text, static header and
  wrapping code. Reduced-motion inspection found no animations or transitions.
- Actual visual comparison: warm-neutral backgrounds and muted text closely match
  the reference. Cards are only slightly lifted from the dark page; brick/coral
  accents remain localized. Header tint/blur match, while its shadow is restrained.
  Nook's existing fonts and compact information layout are intentionally retained.
- Review outputs include refinement-light/dark-desktop.png (1440x1100),
  refinement-light/dark-mobile.png (390x844), corresponding reference screenshots,
  article screenshots and visual-refinement-review.md in the current chat outputs.
  Physical image dimensions were verified. The reference's mobile page itself
  uses a wider CSS viewport; it was captured unchanged, not restyled for comparison.

## Limits and follow-up

- Release follows the existing PR checks and manual main deployment workflow.
  Source resume, CV policy, logo artwork and confirmed personal/project content are unchanged.
- Browser checks cover the current Chromium browser, responsive layout and keyboard
  operation; a full screen-reader/physical-device or historical browser audit was not run.
- Ruby dependencies still emit base64/bigdecimal migration warnings for future Ruby 3.4;
  Ruby 3.3 builds succeed. No dependency update is needed for this feature.
- See docs/THEMES.md for the color tokens, no-script/storage behavior and maintenance
  checks. If storage is blocked, manual switching works on the current page but cannot persist.
