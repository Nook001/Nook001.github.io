# Current validation

Snapshot: 27 October 2026, local branch `content/pixel-watch-first-post`.
User authorized publishing the reading refinement and the Pixel Watch article.
The article is now a dated post, with unverified reproduction steps and missing
script/step-by-step records explicitly disclosed. No claims of fresh hardware
reproduction were added.

## Executed checks

- `ruby scripts/check_content.rb` and `--release`: passed (6 content files).
- Production `bundle exec jekyll build --strict_front_matter --trace`: passed.
- `python scripts/check_site.py`: passed, 8 production HTML pages; other drafts excluded.
- `bundle exec ruby scripts/check_articles.rb`: passed bilingual rendering,
  Rouge, tables/images, listings, draft isolation and content-gate regressions.
- Draft-only build to ignored `work/blog-review`: passed; served locally on 4005.
- `git diff --check`: passed.

No new unit tests or dependencies were added. Existing Ruby 3.4 future-library
warnings are non-fatal under the pinned Ruby 3.3 runtime.

## Focused browser review

- 1440x1000 desktop: right sticky TOC, 19 heading links and 32 code toolbars.
  No page horizontal overflow. Active section and progress respond to navigation.
  Subsequent local refinement removes the TOC heading, scrollbar chrome, percentage
  and back-to-top link; mobile disclosure uses an accessible icon. Draft rebuild
  and whitespace check passed. Browser reconnection failed for this final refinement;
  no new visual acceptance is claimed.
- 390x844: collapsed TOC after summary, expands and navigates to sections;
  no page horizontal overflow. Code retains internal horizontal scrolling.
- Anchor offset corrected to avoid double-counting the global header scroll padding;
  the target subsection is approximately 96px below viewport top and marked current.
- Code copy reported success. No browser console errors observed.
- Light and Dark visually inspected; viewport override cleared and original Dark
  preference restored. Local preview remains open for human visual acceptance.
- Print styles hide reading navigation, progress and code tools. Print output and
  screen-reader behavior were not manually exercised in this iteration.

Reading assets load only in the post layout. Homepage and project layouts remain
unchanged. Content remains readable without JS; the interactive TOC and copy tools
are progressive enhancements. See docs/CONTENT_GUIDE.md for authoring guidance.
