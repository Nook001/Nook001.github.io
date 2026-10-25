# Agent instructions

This is Nook's personal homepage and technical blog. Use Nook as the public display name, including the greeting and site metadata. Keep Jekyll 3.10-compatible Liquid, Markdown and native CSS. No Node build, JS framework, external font or analytics is needed.

- Read README.md and docs/CONTENT_GUIDE.md before editing content; inspect git status first. Preserve unrelated work.
- Maintain the homepage hierarchy: a sticky desktop profile sidebar (portrait/name/education/contact links), with About → HKUST(GZ), Tencent, CAS, Shopee, OPPO timeline → project grid → compact writing list in the right column. Below 900px use one column. Keep article and project-detail reading layouts separate from the homepage.
- Do not invent degree details, dates, job expansions, project ownership, metrics, source links or email addresses. The user confirmed Tencent's title as Solution Architect and HKUST(GZ) Research Assistant as ongoing since September 2026. Use a filled node only for a confirmed current role. Preserve visible placeholders until confirmed by the user.
- Keep sample content labeled. Do not clear `sample` or `education_pending` simply to make release validation pass. Confirm claims first or remove unpublished examples with user agreement.
- New content starts in `_drafts/` or with `published: false`. Draft review and publication are separate decisions.
- Keep layouts restrained, readable and responsive. Preserve keyboard focus, semantic headings, alt text, skip link and sufficient contrast. No unnecessary animations or skills badges.
- Run `ruby scripts/check_content.rb`, the production build, and `python scripts/check_site.py`. Report runtime/browser checks separately from static checks. Do not claim unrun checks.
- Use a topic branch and PR for ongoing changes once a remote exists. Do not push, create a remote/repository, merge, enable Pages, change deployment protections or run deployment without explicit user authorization. Local commits are allowed; never change global Git identity.
- PR validation must never deploy. Deployment stays manual on main, with release content checks. Do not add push-triggered deployment or bypass the release checks.
- Never publish docs, templates, drafts, validation records, credentials or private personal data. Keep development files in the Jekyll exclude list.
- The user approved the education labels `HKUST · CSE` and `University of Warwick · CS ’27`. Do not restore expected-graduation wording or expand these labels without a request.
- CV publication is disabled for privacy. Keep `profile.cv` empty, omit its homepage entry, and do not add a public CV page or file unless explicitly requested. Release and output checks enforce this preference.
