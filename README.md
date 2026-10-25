# Yuanzhi Liu — personal website

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

Warm off-white, restrained olive accents, system body fonts and a serif name/title. The site has no animation or JavaScript. At narrow widths, projects stack and the timeline stays in the supplied order. SEO includes page titles/descriptions, canonical URLs, sitemap and RSS. The canonical site URL is `https://nook001.github.io`.

## References

- [GitHub Pages dependency versions](https://pages.github.com/versions/)
- [Testing a Jekyll site locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
