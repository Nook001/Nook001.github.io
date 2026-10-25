# Color themes

The header's native select offers Auto / Light / Dark. Auto is the default and
tracks system changes live through CSS. Light preserves the approved palette;
Warm Forest Dark uses warm off-white text, forest surfaces and muted sage accents.
There are no theme/page transitions or animations, including under reduced motion.

## Implementation

- `assets/css/main.css`: each semantic color has one `-light` / `-dark` pair.
  Existing component variables use `light-dark()` when supported. The explicit
  `@supports not` fallback uses the same values, system media query and data attribute.
- `<html data-theme="light|dark">` forces `color-scheme`. Auto removes the attribute.
  Native controls and scrollbars inherit the scheme; print always forces light.
- `_includes/theme-init.html`: a small synchronous inline script before the stylesheet
  reads the saved choice before the first styled paint. Keep it early; do not defer it.
- `assets/js/theme.js`: the deferred script exposes the native control, saves manual
  choices as `nook-theme` in localStorage, removes the key for Auto, and synchronizes
  other tabs and restored history pages. No cookies, network calls or dependencies.
- Storage access is guarded. If blocked, CSS still follows the system and manual
  changes work for the current page; persistence cannot be guaranteed. With JS disabled,
  the select remains hidden and the site follows the system through CSS.

## Images and print

Organization bitmap logos receive a warm light backing in dark mode. Original files,
aspect ratios, sizes and adjacent accessible names remain unchanged; photos/avatars
and article illustrations are never inverted. Warwick's official responsive SVG
has internal light/dark artwork; it keeps a transparent backing so its white crest
is visible directly on the forest surface. It follows the page's color-scheme,
including forced Light/Dark. Recheck this when replacing that particular asset.

Print uses light text tokens on white paper even after a forced dark choice; the
selector/navigation are hidden and long code wraps. Do not let a screen fallback
override print, or hardcode a dark text color into a reading component.

## Verify theme changes

Run README's content/release/build/output/article checks. In the browser:

1. Auto responds to both system schemes without reload. Light and Dark override
   either system setting and survive reload, Home → Projects → Writing navigation.
2. Returning to Auto removes the override; another open tab follows the preference.
3. Check header and content at 1440, 768, 390 and 320px in both themes; compare the
   light homepage content geometry/screenshots with the pre-change baseline.
4. Check article code, tables, captions, quotes and native controls in both themes.
5. Tab/arrow keys operate the selector with a visible focus outline. Text contrast
   must be >=4.5:1; the control boundary/focus indicator must remain distinguishable.
6. Check logos individually, print while Dark is selected, reduced motion and the
   fallback palette. No fixture content may enter the production blog.

Reference behavior: [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark),
[color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme),
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
