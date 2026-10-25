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
$env:PATH = "$runtimeRoot\rubyinstaller-3.3.13-1-x64\bin;" + $env:PATH
Set-Location 'D:\Project\Nook001'
ruby scripts/check_content.rb
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --strict_front_matter --trace
python scripts/check_site.py
```

The temporary compiler and MSYS environment were removed in the follow-up cleanup after a successful build without them. The retained Ruby runtime includes the DLLs needed by the installed native dependencies. Future native-extension rebuilds should use RubyInstaller with Devkit as described in README; the removed compiler paths are no longer usable.

Windows tooling initially required additional setup: native dependencies compiled with a portable WinLibs UCRT compiler and MSYS make from official HTTPS sources. The default MSYS keyring initialization stalled; an attempted temporary-lock cleanup was rejected by automatic approval and was not executed. A portable Ruby 2.5 environment was downloaded as an exploratory fallback but was not used to build or validate the site. Those unused tools were removed during the follow-up cleanup below. The final build used Ruby 3.3 exclusively.

Sources: https://github.com/oneclick/rubyinstaller2, https://github.com/brechtsanders/winlibs_mingw, https://repo.msys2.org/msys/x86_64/.

## Initial limits and pending review

- No GitHub-hosted CI or deployment has run; the workflows were prepared locally. Linux dependencies were resolved, but execution on a Linux runner remains to be verified once a remote is authorized.
- Browser checks cover representative pages and widths, not a full screen-reader or device audit. Visual approval remains with the user.
- Jekyll's upstream dependencies print Ruby 3.4 migration warnings for base64/bigdecimal. The selected Ruby 3.3 build succeeds.
- Education wording, portrait, contact/CV links, experience dates, all project details and example article content require review before release.
- The preview server is local and temporary; rerun the README preview command to inspect later.

## Follow-up content, push and cleanup

On 25 October 2026 the user explicitly authorized connecting the named GitHub remote, attempting a push, retrying temporary-file cleanup and filling content from the supplied CV, public research and project code.

- Initial main push succeeded, and its GitHub `Validate site` workflow passed on Linux.
- Profile contact links, account avatar, CV summary, internship date ranges, three project entries and a source-based technical note were added on `content/resume-and-projects`. The original DOCX, phone number and detailed internal company information are not committed. See docs/CONTENT_SOURCES.md.
- Content validation passes for six Markdown documents. Production build and generated-site checks pass for nine HTML pages including the new CV. The CV has an explicit permalink to avoid Jekyll changing its output URL.
- The release gate still intentionally rejects the unreviewed education wording. This is not overridden to make the release pass.
- Temporary-file cleanup removed all eight explicitly inventoried targets: downloaded archives, the unused Ruby 2.5 fallback, WinLibs compiler and MSYS tree. Removed file content totals **1,458,150,021 bytes** (about 1.46 GB, 1.36 GiB). Every target was verified absent. A build passed both before and after removal, with only the retained Ruby runtime on the session PATH.
- Runtime and installed vendor dependencies are retained for future preview/builds. Source-generation scripts and cleanup inventory/results remain in ignored work folders as small execution records.

### Unexpected GitHub Pages deployment and correction

Immediately before the first push, GET Pages returned HTTP 404. After the first main push, GitHub automatically enabled legacy branch publishing and ran its built-in `pages build and deployment` workflow. This briefly published the initial placeholder site; the supplied CV content had not been pushed yet.

The Pages DELETE API returned 422 because GitHub disallows deactivating this user-site repository. The publishing source was changed to `workflow` to prevent further automatic branch deployments. The existing deployment was then removed using **Unpublish site** in the authenticated GitHub settings page. The UI confirmed **GitHub Pages unpublished** and the public site returned HTTP 404. The repository and its code remain intact.

No custom deployment workflow was dispatched. Future release remains manual, with the content gate. This correction is recorded rather than claiming that no deployment ever occurred.

References: [official unpublishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site), [Pages API build types](https://docs.github.com/en/rest/pages/pages#update-information-about-a-github-pages-site).

## User-approved first official release

On 25 October 2026 the user approved official publication after two changes: shorten education to CSE/CS with the Warwick year written as 27, and omit the CV for privacy.

- Profile now displays **HKUST · CSE** and **University of Warwick · CS ’27**. The approved wording clears the education review marker.
- The homepage CV item and its pending placeholder are omitted. The derived `cv.html` source page is removed from the current tree, and output checks reject both `/cv.html` and `/cv/` pages. The original DOCX was never committed. Existing Git history is not rewritten.
- Release validation no longer requires a CV; it explicitly requires the CV link to remain empty unless the user later opts in.
- Normal content validation, release content validation, production Jekyll build, generated-site checks and whitespace checks all passed locally. The output contains eight HTML pages, with no CV page or local CV links.
- Merge and manual deployment are authorized for this reviewed version. The Actions deployment record provides the final published commit and deployment outcome; future releases still require authorization.

## Sidebar homepage layout

The user supplied a two-column reference and requested a fixed profile area on the left, with the substantive content on the right. After seeing the local preview, the user explicitly authorized publishing this layout once checks pass.

- Homepage-only layout: a 260px desktop profile sidebar, with About, experience, selected projects and writing in the right column. The sidebar uses sticky positioning with a 36px top offset, keeping it in the document flow and clear of the footer.
- At widths below 900px, the profile returns to the normal flow above the content. Mobile profile details sit beside the avatar. Project cards use three, two or one column according to available width. Article/project reading layouts retain their existing width.
- Browser checks at 1440, 1024, 768, 390 and 320px showed no horizontal overflow. A 360px-high desktop viewport limits the sidebar height and allows its contents to scroll, keeping contact links reachable.
- After a 360px page scroll at desktop width, the sidebar remained at y=36px. The mobile sidebar is static. Desktop and mobile screenshots are saved in this chat's outputs folder as sidebar-layout-desktop.png and sidebar-layout-mobile.png.
- Existing content, approved education labels and the CV privacy preference remain intact. Production build, normal/release content checks, generated-site checks and Git whitespace checks are run for this release; no custom JavaScript or animation is introduced.

## Organization marks and text hierarchy

The user requested the proposed education/company marks, slightly larger supporting text and clearer font-color hierarchy. The existing approved layout and publishing workflow are retained.

- Six local organization marks were obtained from official site/media resources, with exact source links recorded in docs/LOGO_SOURCES.md. They render successfully as two education marks and four timeline nodes. Source files are unmodified; CSS preserves their aspect ratios.
- Education labels now use a `label`/`logo` data structure, and experience entries include a local `logo` path. Content validation checks these paths. Adjacent visible organization names make image alternatives redundant, so the marks are decorative for assistive technology.
- Text palette contrast was calculated using the WCAG relative-luminance formula. On the paper background: heading 11.71:1, body 8.41:1, secondary 6.11:1, muted 4.72:1 and accent 6.23:1. All also exceed 4.5:1 on the card background.
- Browser checks at 1440, 1024, 768, 390 and 320px confirmed all six images loaded and no horizontal overflow. Desktop and 390px screenshots are retained in the chat outputs as organization-marks-desktop.png and organization-marks-mobile.png.
- The rendered pages retain the approved degree labels and experience order. CV remains disabled. Local release content checks, production build and the eight-page generated-site checks pass.

## Experience card iteration

The user requested a first version of the proposed light-card timeline. Four experience cards now group company/role on the first line with the date directly underneath. The external logo rail is retained; the right-aligned date column and fixed company-name width are removed. Cards use a subtle background, 1px border and 12px vertical gaps, without new copy, hover effects or JavaScript.

Browser checks cover 1440, 1024, 768, 390 and 320px. There is no horizontal overflow, all four cards render, and dates remain below their title groups. Desktop and mobile captures are saved as experience-cards-desktop.png and experience-cards-mobile.png in this chat's outputs. Local production build, release content validation and the eight-page generated-site check pass; degree labels, logos, ordering and CV omission are preserved.
