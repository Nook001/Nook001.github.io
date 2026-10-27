# Agent instructions

Read README.md and the relevant guide before editing; inspect Git status and preserve
unrelated work. This is Nook's personal homepage and technical blog.

## Architecture and design

- Keep GitHub Pages-compatible Jekyll 3.10, Liquid, Markdown and native CSS. No new
  framework, Node pipeline, remote font or analytics. The user-approved homepage
  character is the sole animation exception: lazy local PixiJS 8, desktop only,
  automatic playback without added buttons or fallback artwork. See docs/CHARACTER.md. Keep theme persistence;
  avoid unrelated scripts or animations.
- Content lives in `_data/`, `_posts/` and `_projects/`. Layouts/includes own structure;
  `assets/css/main.css` owns styles. Follow docs/CONTENT_GUIDE.md for field/ordering rules.
- Preserve the homepage: sticky desktop profile left; About, Experience/Publications,
  project grid and compact Writing list right. Profile stacks below 900px; the paired
  sections stack below 700px. Keep article reading layouts separate.
- Preserve the restrained palette, fonts, decorative heading icons and timeline geometry.
  Light and Dark use the reference-site neutral palette through semantic CSS variables. First visits follow
  the system; a single button toggles Light / Dark and remembers the choice. See docs/THEMES.md for theme maintenance and testing.
  Keep the compact frosted sticky header clear of the sticky profile; preserve the
  source palette and attribution documented in docs/THEMES.md.
  Publications' empty decorative rail is intentional; do not remove it or invent papers.
- Keep organization logos in their original colors; do not add CSS recoloring filters.
- Keep character source artwork under excluded `sources/`, authoring tools under
  `scripts/`, and runtime files under `assets/`. Never ship debug controls or work/.
  Respect Reduced Motion, hidden/offscreen state and mobile no-load. The user
  explicitly removed the character pause button: do not reintroduce controls or
  read the obsolete pause preference. Typing is the base; mouse glances are brief.
- Preserve semantic headings, alt text, keyboard focus/skip link and contrast. No gratuitous
  animation, skill badges or placeholder claims.

## Facts and privacy

- Never invent education, job titles/dates, ownership, metrics, links or contact details.
  Confirmed sources belong in docs/CONTENT_SOURCES.md; preserve current content unless asked.
- Keep review markers until the user confirms claims. Never clear `sample` or
  `education_pending` merely to pass a release check.
- `_drafts/` and `published: false` prevent website output, **not public GitHub exposure**.
  New public-safe writing starts there. Private material belongs in ignored/excluded
  `private-drafts/` or outside this repo; never force-add it.
- CV publication is disabled: keep `profile.cv` empty and omit public CV links/files.
  Do not commit the source resume, secrets, private research or personal data.
- Do not remove a published article without an explicit request; consider old URLs.

## Checks and delivery

- Run all README validation commands, including the release gate; report actual results.
  Run `bundle exec ruby scripts/check_articles.rb` for article/CSS/checker changes.
- For UI changes compare before/after screenshots and inspect responsive widths from
  VALIDATION.md. Distinguish static validation from browser/assistive-technology testing.
- Keep VALIDATION.md as a current snapshot, not a growing history of every CSS change.

## Git and publication

- Work on a local topic branch. Local commits are allowed; never rewrite existing history
  or change global Git identity. Push/PR/merge require explicit user authorization.
- Follow docs/PUBLISHING.md. Past release authorization is not standing permission.
- Deployment remains manual on main with release checks. Never enable automatic deploy,
  change Pages source/protections/permissions, bypass review, or deploy draft/fixture output.
- Development docs, scripts, templates, private material and fixtures must stay excluded
  from the generated website. Git-ignore alone does not control Jekyll output.
