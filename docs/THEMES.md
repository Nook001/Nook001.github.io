# Color themes

The compact sun/moon button switches Light / Dark in one click. First visits
follow the system automatically. After a manual click the choice is remembered
across reloads and pages; there is no three-state menu. Light preserves the approved
palette; Dark uses charcoal surfaces with a slight blue cast and restrained sage accents.

## Implementation

- `assets/css/main.css` owns semantic light/dark color pairs, using `light-dark()`
  with an explicit CSS media-query fallback for older engines.
- No stored preference means no data-theme attribute, so CSS tracks the system live.
  `assets/js/theme.js` also listens to the system preference to keep the button state
  and icon correct. A click chooses the opposite of the currently effective theme.
- Manual choices use the existing `nook-theme` localStorage key. The synchronous
  `_includes/theme-init.html` restores that choice before the stylesheet. Keep it early.
- The native button has a stable `Dark mode` accessible label and aria-pressed state;
  its sun/moon artwork indicates the next action. Tab, Enter and Space work natively.
- Other tabs and restored history pages synchronize. Clearing this site's preference
  returns it to system-following behavior; no extra reset control or modifier gesture.
- Storage access is guarded. Blocked storage still allows toggling on the current
  page; with JavaScript disabled the button is hidden and CSS follows the system.

## Images and print

Organization marks use their native transparency, with no universal backing or
blanket image filter. HKUST(GZ) reuses the official transparent shared university crest;
CAS's circular seal is clipped only outside its circumference. Warwick's responsive
SVG supplies its own black/white artwork. Original assets remain available for
traceability; avatars and article images are unaffected. Only the dark-colored
HKUST and OPPO marks render single-ink white in Dark for legibility, with original
color retained in Light and print; their official sites provide white variants.
See LOGO_SOURCES.md. Never apply this scoped filter to every image.

Typography keeps the same sizes and weights in both themes. Check the actual
contrast and legibility before changing font metrics; do not globally embolden
all text merely because the surface is dark. The light-mode hierarchy/layout stays
stable. [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
sets 4.5:1 for ordinary text and notes that very thin strokes may need extra care.

Print always forces light tokens on white paper, hides the theme button/navigation
and wraps long code. No theme transitions, scrolling animations or new dependencies.

## Verify changes

Run README's checks. Confirm fresh visits follow both system schemes; a click
reverses the effective theme, remembers it across pages/reloads, and takes priority
over subsequent system changes. Check Tab/Enter/Space, a visible focus outline,
1440/768/390/320px, article/code/table/form colors, logos, no-JS and light printing.
Keep text contrast >=4.5:1 and the control boundary/focus distinguishable.

Reference: [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark),
[system preference change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event),
[accessible toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
