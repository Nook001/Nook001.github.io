# Sidebar character

The user approved integrating the tested local Q-style maid rig below the desktop
profile's contact links. This is the only approved animated illustration, not a
general animation system. Homepage content, fonts, navigation and other columns
remain unchanged. The widget is about 254x213px at a 1440px viewport.

## Runtime boundaries

- HTML is in `index.html`, appearance in `assets/css/main.css`, lazy controller in
  `assets/js/sidebar-character.js`, and rig renderer/math in `assets/js/character/`.
- Only the homepage includes the small controller. PixiJS and the atlas load only
  at >=901px, while the document and widget are visible and Reduced Motion is off.
  The widget remains hidden in mobile's existing compact profile and in print.
- PixiJS 8.22.0 is vendored locally; there is no CDN request, Node build, framework,
  audio, tracking or network interaction beyond fetching local static assets.
- Transparent canvas, original character colors, three 9x9 perspective meshes and
  four damped hair groups. Typing is the base action, with about 22-degree downward pitch, small nods and
  occasional glance upward. No random Idle/action rotation and no debug sliders.
- Pointer coordinates are kept only in memory on this page, never transmitted.
  First mouse glance starts after 6-8 active animation seconds, lasts 2.4 seconds,
  then returns to Typing. Subsequent rest gaps are 12-18 seconds. During a glance
  the character follows the current pointer across the page, without head-snapping
  on every mouse event. An unknown or departed pointer leaves the character typing.
- The private ticker is capped at 30fps. CPU projection and fixed 120Hz spring
  integration are retained from the approved prototype; no custom shader.
- Per the user's latest request, playback is automatic with no character buttons.
  The obsolete nook-character-paused preference is ignored; no animation preference
  is read or written. The site's existing theme control remains unchanged.
- Background, offscreen, narrow viewport and print stop the ticker. Reduced Motion
  leaves the reserved slot empty. Reloading with Reduced Motion
  or on mobile does not request PixiJS or the atlas.
- Script disabled, blocked/missing assets, unsupported WebGL or context loss use
  no alternate image or placeholder; failure leaves the slot empty and does not
  block site content or expose an error panel.
  The footprint is reserved before loading to avoid moving surrounding content.

## Render clarity and compression

Canvas resolution is at least 2x CSS size, follows high-DPI displays up to 3x, and
keeps the same CSS footprint. Each 512x512 logical head layer now uses resolution
2: 1024x1024 backing pixels. This reduces double-resampling softness without
increasing image downloads. It cannot restore detail absent from the original art.

The atlas stays lossless WebP with alpha (627,418 bytes). Re-encoding its identical
pixels as optimized PNG yielded 935,270 bytes: WebP is 32.9% smaller in this actual
asset. All 15 frame alpha/visible-pixel comparisons against approved PNGs passed.
No extra codec library, lossy atlas conversion or artificial source enlargement.

## Assets and provenance

- `sources/character/maid-sprite-sheet.png`: user's supplied 1448x1086 RGBA sheet,
  original bytes preserved, SHA256
  `cadf9dcb616e3b8e33301328ebdbcc50b4566a58102fe14b18932f6a2ffaa964`.
  `sources/` is explicitly excluded from Jekyll output.
- Original static desk illustration is preserved only at
  `sources/character/original-desk-illustration.png`, excluded from the website.
  There is no fallback image, placeholder, spinner or replacement animation.
- Runtime atlas uses only 15 approved parts (~627KB, lossless WebP). Transparent
  margins are trimmed, but sourceSize and spriteSourceSize preserve original
  coordinates and pivots. `rig.json` contains the layout and spring parameters.
- `assets/character/provenance.json` records source coordinates, masks and hashes.
  Missing hidden anatomy is not fabricated: baked-eye whole-face Blink is retained,
  and separate arms/legs are not forcibly fitted. Head yaw/pitch stays restrained
  because the source is frontal, not a complete 3D or layered turnaround.
- Local PixiJS bundle is ~841KB. MIT notice is `assets/licenses/pixi-MIT.txt`.
  Vendor SHA256 is pinned by the standard-library output checker. Upgrading it
  requires an explicit dependency review and rerunning browser/availability checks.

## Rebuild artwork (optional authoring task)

Normal builds use checked-in static assets; no extra build dependency is needed.
To regenerate them, use a Python environment with Pillow (the existing bundled
Codex Python has it):

```powershell
python scripts/extract_character_sheet.py --source sources/character/maid-sprite-sheet.png --output work/character-assets
python scripts/build_character_assets.py --prototype work/character-assets
```

The first step performs reviewable calibrated ROI crops, largest-alpha-component
cleanup and masked strand grouping; it is not a general AI auto-segmenter. It keeps
the original intact. The second packs only the runtime frames and emits hashes.
Intermediate crops/contact sheet stay in ignored and excluded `work/`.

## Verify

Run all README commands and the article suite. `check_site.py` also checks character
frame bounds/non-overlap, rig references, asset hashes, pinned local PixiJS and MIT
notice, exclusion of sources/work, and homepage-only script inclusion.

With an existing Node runtime, `node scripts/check_character.mjs` checks the actual
production projection/spring modules, neutral identity and mesh orientation.
Node is an optional test tool, not a production or Jekyll build requirement.

Browser checks: both themes at 1440/1024/768/390/320px; automatic playback even with
an obsolete stored pause value, no character buttons, periodic pointer tracking
and return to Typing, offscreen/background stop, Reduced Motion cold
visit and changes, mobile cold no-download, no-JS, blocked atlas and WebGL failure (empty slot, no replacement),
short-height sidebar accessibility and light print. Inspect actual geometry and
artwork; numerical checks do not replace human animation review.

The original independent demo stays under `work/chibi-prototype`; it is not shipped.
No workflow or deployment setting changes are required. Publication still needs
explicit authorization for the reviewed version.
