# Nook — personal website

A Jekyll site for `Nook001/Nook001.github.io`. Plain Markdown, Liquid and CSS; no JavaScript, Node build, remote fonts, paid services or theme dependency. The remote is connected; website deployment remains a separate manual action.

## Preview and validate

Use Ruby 3.3 with Bundler and Python 3. On Windows, install **RubyInstaller with Devkit** if Ruby is not already available; native Jekyll dependencies require the compiler. The initial verification runtime is isolated outside this repository; see VALIDATION.md.

```powershell
bundle config set --local path vendor/bundle
bundle install
ruby scripts/check_content.rb
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open http://127.0.0.1:4000. Stop with Ctrl+C. For a draft review only, use `bundle exec jekyll serve --drafts`; do not deploy draft output. The repository includes Gemfile.lock for repeatability across Windows and Linux. Updating dependencies is an intentional maintenance task followed by the checks above.

## Edit map

| Content | Location |
| --- | --- |
| Name, degree wording, portrait and contact links | `_data/profile.yml` |
| Ordered career timeline | `_data/experience.yml` |
| School/company marks and their sources | `assets/images/organizations/`, `docs/LOGO_SOURCES.md` |
| Blog posts | `_posts/YYYY-MM-DD-slug.md` |
| Unpublished notes | `_drafts/` |
| Project entries | `_projects/slug.md` |
| Reusable Markdown starters | `templates/` |
| Page structure / styles | `_layouts/`, `_includes/`, `assets/css/main.css` |

See [content guide](docs/CONTENT_GUIDE.md) and [publishing guide](docs/PUBLISHING.md). Codex can maintain all of these files directly; no UI development is required to add a post or project.

## Content

- Profile email and four internship date ranges come from the supplied CV. GitHub profile and account avatar were checked against Nook001.
- CV publication is disabled at the user's request. The homepage has no CV entry, the former CV page has been removed, and release checks reject a public CV link or generated CV page. The original DOCX was never committed.
- The user approved the concise education labels “HKUST · CSE” and “University of Warwick · CS ’27”, with `education_pending: false`.
- The three projects have short, sourced descriptions and verified public links. Dynamic Shader links to Nexus Mods rather than its private source repository. No benchmark, download or adoption figures were added.
- The sample article was moved to `_drafts/`. A short technical note now explains stale-event handling in Qingyin, based on its public implementation and tests.
- See [content sources](docs/CONTENT_SOURCES.md) for the basis of these edits. Review the resulting text before publication.

Run `ruby scripts/check_content.rb --release` before publication. Education wording has been approved, and CV omission is now an explicit privacy requirement. Never remove a review marker merely to pass a check.

## Publishing policy

The remote is `https://github.com/Nook001/Nook001.github.io.git`. Ongoing content changes use topic branches and reviewed PRs. CI validates pushes and PRs without deploying. After an initial unintended legacy deployment was withdrawn, the user explicitly authorized the first official release after simplifying education and removing the CV. Publishing uses **GitHub Actions**, not branch publishing. See the publishing guide.

Only the manual deployment workflow can publish this setup: main branch + exact PUBLISH confirmation + passing release/content/build checks. A separate user instruction is required before an agent runs it. Do not select branch-based Pages publishing, which would bypass this manual workflow. See the publishing guide for the final setup steps.

## Design

Warm off-white, restrained olive accents, system body fonts and a serif name/title. The homepage uses a sticky profile sidebar on desktop, with About, experience, projects and writing in the right column. Below 900px it becomes a single column; project cards also stack on phones. Short desktop viewports can scroll the profile itself so contact links stay reachable. Article and project-detail layouts retain their reading width. The site has no animation or JavaScript. SEO includes page titles/descriptions, canonical URLs, sitemap and RSS. The canonical site URL is `https://nook001.github.io`.

Local organization marks identify education and experience. Deep green headings, softer body text and muted dates establish the text hierarchy; every text palette color has at least 4.5:1 contrast against the paper and card backgrounds. Project descriptions and experience roles use slightly larger type for readability. Asset origins are documented in `docs/LOGO_SOURCES.md`.

Experience uses transparent 300px cards with a fine border, shrinking to fit narrow screens. A quiet left-hand axis extends 36px beyond the first and last event centers, fading at its ends. The current HKUST(GZ) Research Assistant role (Sep 2026 - Present) has a filled node; previous roles have hollow nodes. All nodes are 10px and have a 3px paper-colored clearance. Short horizontal guides leave a 6px gap after each node and an 8px gap before each card. Logos sit inside the upper-left corner, beside separate company and role lines. Dates align to the top-right using abbreviated English months and full years at both ends, such as Apr 2026 - Aug 2026. On narrow phones, dates occupy the first row so they cannot collide with company names. Tencent's approved title is Solution Architect.

Experience and Publications occupy opposite edges of the content area, each up to 340px wide, leaving the remaining space between them (at least 40px). Titles remain left-aligned within each column. Publications has an empty decorative timeline only; no papers, placeholder entries, dates or event nodes are shown. Below 700px the pair stacks; the empty timeline then uses a shorter 160px area. Projects remain below the pair, followed by Writing.

The stylesheet URL includes a build timestamp so that a newly published page does not reuse cached CSS from a previous layout. All pages in one build share the same stylesheet version; no JavaScript is involved.

## References

- [GitHub Pages dependency versions](https://pages.github.com/versions/)
- [Testing a Jekyll site locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
