# Local initialization validation

Date: 25 October 2026 (Europe/London).

## Starting state

- `D:\Project\Nook001` existed and was empty, including hidden files. It was not inside another Git repository.
- No parent AGENTS.md was found at D:\ or D:\Project.
- Git was available; Ruby, Bundler and Jekyll were not on PATH. No existing user files were overwritten.
- Initialized local `main`; no remote configured, no remote repository created, no push or deployment attempted.

## Executed checks

- Ruby content/front matter validation: PASS, five Markdown files plus profile and ordered experience data.
- Production Jekyll 3.10.0 build with strict front matter: PASS, eight HTML pages.
- Generated-site check: PASS, local links and fragments, single h1, page language/title/canonical/viewport, image alt attributes, RSS and sitemap XML, development-file exclusions.
- Release check: expected FAIL at the unreviewed education wording. This is an intentional publication gate, not a build failure.
- Local HTTP request to the built homepage: 200.
- Browser inspection: desktop 1200 px, mobile 390 px, and initial narrow pane around 319 px. Homepage content, three-column/one-column project grid, article navigation and project detail navigation were inspected. Homepage and article had no horizontal overflow at 390 px.
- Project-list heading hierarchy was corrected during inspection (h1 → h2 cards; homepage retains section h2 → card h3).
- Screenshots saved in this chat's outputs folder as `homepage-desktop.png` and `homepage-mobile.png`.
- Git whitespace check: PASS. Windows and x86_64 Linux dependency platforms recorded in Gemfile.lock.

## Reproduction environment

The working build used portable RubyInstaller 3.3.13 and Bundler 2.5.22, with isolated vendor/bundle dependencies. The runtime is in this chat workspace's `work/rubyinstaller-3.3.13-1-x64`; its absolute path is recorded below for a later local session. No system Ruby or global PATH was installed/changed.

```powershell
$runtimeRoot = 'C:\Users\Nook\Documents\Codex\2026-10-25\referenced-chatgpt-conversation-this-is-an\work'
$env:PATH = "$runtimeRoot\rubyinstaller-3.3.13-1-x64\bin;$runtimeRoot\mingw64\bin;" + $env:PATH
Set-Location 'D:\Project\Nook001'
ruby scripts/check_content.rb
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
```

For another native-extension installation in this isolated environment, additionally set MSYS2_PATH to `D:\Project\Nook001\work\msys64`, add its `usr\bin` to the session PATH, and set MAKE to `make`. Ordinary future installations should use RubyInstaller with Devkit as described in README.

Windows tooling required additional setup: native dependencies compiled with a portable WinLibs UCRT compiler and MSYS make from official HTTPS sources. The default MSYS keyring initialization stalled; an attempted temporary-lock cleanup was rejected by automatic approval and was not executed. A portable Ruby 2.5 environment was downloaded as an exploratory fallback but was not used to build or validate the site. Temporary tools remain in ignored work folders, outside the tracked website. The final build used Ruby 3.3 exclusively.

Sources: https://github.com/oneclick/rubyinstaller2, https://github.com/brechtsanders/winlibs_mingw, https://repo.msys2.org/msys/x86_64/.

## Limits and pending review

- No GitHub-hosted CI or deployment has run; the workflows were prepared locally. Linux dependencies were resolved, but execution on a Linux runner remains to be verified once a remote is authorized.
- Browser checks cover representative pages and widths, not a full screen-reader or device audit. Visual approval remains with the user.
- Jekyll's upstream dependencies print Ruby 3.4 migration warnings for base64/bigdecimal. The selected Ruby 3.3 build succeeds.
- Education wording, portrait, contact/CV links, experience dates, all project details and example article content require review before release.
- The preview server is local and temporary; rerun the README preview command to inspect later.
