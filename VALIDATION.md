# Current validation

Snapshot: 27 October 2026, local branch `site/character-hover-look`.
The user approved committing, pushing, merging and deploying the hover-follow
revision on `site/character-hover-look`, with a 48px interaction halo and 48px
bottom clearance. No fallback artwork or buttons are introduced.

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

Optional production character math check, with an existing Node runtime:

```powershell
node scripts/check_character.mjs
```

The local retained Ruby can be added to the session PATH, without global changes:

```powershell
$runtimeBin = 'C:\Users\Nook\Documents\Codex\2026-10-25\referenced-chatgpt-conversation-this-is-an\work\rubyinstaller-3.3.13-1-x64\bin'
$env:PATH = $runtimeBin + ';' + $env:PATH
```

## Current integration

- Static illustration below desktop contacts is replaced by the
  approved transparent PixiJS rig. The reserved widget footprint is 680:570; at
  1440px it is about 254x213px. Other homepage columns, timeline, fonts and facts
  remain unchanged. Widget dimensions are unchanged by the hover/placement update.
- Automatic playback with no character buttons or debug controls, as requested.
  Typing stays at about 22 degrees downward. Entering the widget or its 32px geometric halo selects continuous Look.
  The visible box maps to full -1..1 pointer coordinates, clamped outside its edges.
  The old pause preference is ignored. No random Idle rotation.
- 15-frame lossless WebP atlas (~627KB), no fallback asset, pinned local PixiJS
  8.22.0 (~841KB). Source PNG is preserved under excluded sources/; authoring scripts
  and intermediate crops do not ship. No CDN, audio, analytics or Node build.
- Three 9x9 head perspective meshes; four independent hair springs. Private ticker
  capped at 30fps, fixed 120Hz physics; no custom shader or cloth system.

## Executed checks

| Check | Result |
| --- | --- |
| Content and release gates | PASS; 5 content files, profile and 5 experiences |
| Strict production build | PASS; Jekyll 3.10 / Ruby 3.3.13 |
| Generated website | PASS; 7 pages, local links/fragments, semantics/XML/exclusions |
| Character release checks | PASS; frame bounds/non-overlap, rig references, asset hashes, pinned runtime/MIT notice, homepage-only script |
| Article suite | PASS; bilingual fixtures, 9 pages, draft/privacy/content-gate regressions |
| Production projection/spring tests | PASS; 2187 vertex samples, neutral identity, no flips, damped return, typing cycle |
| Original source/hash | Preserved; source provenance and processing scripts included |
| Git whitespace | PASS |

## Browser evidence

- Chromium desktop: 32 rendered frames over 1.104s (~29fps), three meshes and actual
  Typing head movement. Pointer movement enters Look; leaving restores the cycle.
- Current controller has zero character buttons and plays automatically. Mouse
  entry targets Look immediately, including before or after any previous timer
  interval. Browser held Look continuously for 4.2s; typing bubble stayed hidden.
  Upper-left produced about -9.6 degree yaw / -6 degree pitch; lower-right moved
  yaw above +8.7 degrees. This uses actual pointer events, not a mock timer.
- Leaving cleared pointerKnown and returned to Typing, smoothly reaching >21-degree
  downward pitch. Another 8.5s observation remained Typing at 21.30-22.70 degrees,
  with no periodic head raise. Test evidence: character-hover-checks.json and
  character-hover-follow.png in the current chat outputs.
- Canvas at 1440px/DPR1 uses 508x426 backing pixels for 254x213 CSS px; each
  head layer uses 1024x1024 backing pixels, with no extra downloaded image bytes.
  Atlas remains 627,418 bytes vs 935,270-byte equivalent optimized PNG (32.9% less).
- Reduced Motion enabled during playback stops the real ticker, hides the canvas
  and leaves the reserved slot empty. A fresh Reduced Motion load requests no
  PixiJS, renderer or atlas; no canvas is created.
- Fresh mobile load likewise requests no animation resources, creates no canvas
  and keeps the existing compact stacked profile. Website is usable without JS; the slot is empty.
- Blocked atlas requests and WebGL context loss stop/hide the character and leave
  the reserved slot empty. There is no replacement artwork or placeholder.
- Offscreen state from real IntersectionObserver clipping stops the ticker at a
  360px-tall viewport. Email remains keyboard focused inside the visible sidebar;
  sidebar top was 88px, Header bottom ~53px, with no overlap.
- Hidden-document handler was tested with a temporary synthetic document.hidden
  override and a visibilitychange event; the ticker stopped, and the override was
  removed afterward. This is not a native background-tab/physical-browser audit.
- Print hides the widget and keeps white paper. No new transition or page animation
  was added; theme toggle behavior and original logo colors are retained.
- Both themes at 1440/1024/768/390/320px: no horizontal overflow. Desktop screenshots
  are sidebar-character-light/dark-1440.png; mobile evidence is
  sidebar-character-light/dark-390.png in the current chat outputs. Runtime records
  are sidebar-character-integration-checks.json and character-refinement-checks.json.

## Scope and limits

- Original art is frontal; small 2.5D perspective cannot reveal missing side views
  or separately articulated fingers. Blink uses whole-face frames. Source edge
  fringes can remain visible when enlarged. Production scale was visually checked.
- Existing reference-site theme palette, 70% Header tint / 10px blur, and all personal
  content are unchanged. CV remains disabled. Manual deployment workflow unchanged.
- Current Chromium and simulated widths were checked; no complete screen-reader,
  physical mobile GPU, Safari/Firefox or native background-tab audit was run.
- Ruby base64/bigdecimal migration warnings for future Ruby 3.4 remain non-fatal.
- See docs/CHARACTER.md for lifecycle/availability boundaries and reproducible asset steps.

## Current placement / interaction refinement

- Interaction halo expanded to 48px on all sides, using coordinates only. No DOM
  enlargement, overlay or intercepted clicks. Widget and sidebar widths stay intact.
- Desktop docking now leaves 48px above the viewport bottom (24px higher than the
  prior preview), or above the footer when visible. Short-height contact clearance
  and normal-flow behavior are retained.
- Only a focused local placement/halo browser check is needed for these parameter
  edits; no new unit tests or repeated viewport matrix. Existing required release
  checks run once before publication; CI and manual deployment keep their gates.
