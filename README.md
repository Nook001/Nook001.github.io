# Nook — personal website

A lightweight personal homepage and technical blog for `Nook001/Nook001.github.io`.
Jekyll 3.10, Liquid, Markdown and native CSS; no Node build or external runtime.
A compact theme button switches Light / Dark and remembers the choice. On a first
visit, CSS follows the system automatically, including without JavaScript. The
reference-site warm-neutral light and dark palettes share the same layout. See [theme maintenance](docs/THEMES.md).

## Install and preview

Use Ruby 3.3 with Bundler and Python 3. On Windows, use RubyInstaller with Devkit
when installing native gems. Dependencies are pinned in Gemfile.lock.

```powershell
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open http://127.0.0.1:4000/; stop with Ctrl+C. For **public-source** draft review only,
add `--drafts`. Production output always excludes drafts and future posts.

## Validate

```powershell
ruby scripts/check_content.rb
ruby scripts/check_content.rb --release
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
git diff --check
```

For article/layout or validation changes, also run:

```powershell
bundle exec ruby scripts/check_articles.rb
```

This builds English/Chinese fixtures in ignored `work/`, tests rendering and draft
isolation, and prints a separate review-site path. It never adds real blog posts.
See [VALIDATION.md](VALIDATION.md) for browser acceptance and current results.

## Edit content

| Content | Edit |
| --- | --- |
| Profile, education, contact links | `_data/profile.yml` |
| Experience, in display order | `_data/experience.yml` |
| Articles, newest first | `_posts/YYYY-MM-DD-slug.md` |
| Unpublished but publicly visible source | `_drafts/` |
| Private material, ignored and excluded | `private-drafts/` |
| Projects, ascending `order` | `_projects/slug.md` |
| Page structure / styling | `_layouts/`, `_includes/`, `assets/css/main.css` |

Start from `templates/post.md` or `templates/project.md`; follow
[CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md). Adding articles/projects/experience needs
no manual index or validator edit. CV publication remains disabled.

## Review and publish

Use a local topic branch. Push, PR creation, merge and deployment require user
authorization. Validation runs on main pushes and PRs targeting main; it never
deploys. Publication stays a separate manual action on main with the exact
`PUBLISH` confirmation and passing release checks.

See [PUBLISHING.md](docs/PUBLISHING.md) for the single authoritative release procedure,
[AGENTS.md](AGENTS.md) for agent boundaries, and [CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md)
for facts. Asset provenance: [logos](docs/LOGO_SOURCES.md), [icons](docs/ICON_SOURCES.md).
