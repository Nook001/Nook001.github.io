# Yuanzhi Liu — personal website

A new, local Jekyll site for `Nook001/Nook001.github.io`. Plain Markdown, Liquid and CSS; no JavaScript, Node build, remote fonts, paid services or theme dependency. Nothing is connected or published by initialization.

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

## Content still requiring review

- Portrait, GitHub profile URL, email and local CV file.
- Exact education wording: “HKUST · Joint degree” and “University of Warwick · BSc Computer Science” are provisional.
- Dates for Tencent — SA, CAS — Distributed Systems, Shopee — Backend, OPPO — Android. SA has not been expanded.
- Project descriptions, ownership and links for Dynamic Shader, myWarwickPlus and Qingyin. All three entries are examples.
- Replace/remove the example article; write and review real content.

The regular checks allow visibly marked examples so the UI can be reviewed. `ruby scripts/check_content.rb --release` deliberately fails until the review fields are resolved. Never remove a marker merely to pass a check.

## Publishing policy

No remote is configured. `main` is the local default branch. After explicit authorization to create/connect the remote, use topic branches and reviewed PRs. CI validates pushes and PRs without deploying. A merge does not publish when Pages is configured to use **GitHub Actions**.

Only the manual deployment workflow can publish this setup: main branch + exact PUBLISH confirmation + passing release/content/build checks. A separate user instruction is required before an agent runs it. Do not select branch-based Pages publishing, which would bypass this manual workflow. See the publishing guide for the final setup steps.

## Design

Warm off-white, restrained olive accents, system body fonts and a serif name/title. The site has no animation or JavaScript. At narrow widths, projects stack and the timeline stays in the supplied order. SEO includes page titles/descriptions, canonical URLs, sitemap and RSS. The canonical site URL is the intended future GitHub Pages address, not a claim that it is live.

## References

- [GitHub Pages dependency versions](https://pages.github.com/versions/)
- [Testing a Jekyll site locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
