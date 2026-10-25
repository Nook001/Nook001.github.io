# Color themes

The compact sun/moon button switches Light / Dark in one click. First visits
follow the system automatically. After a manual click the choice is remembered
across reloads and pages; there is no three-state menu. Both themes use the reference site's warm neutral surfaces and brick/coral accents.
No green or blue tint is added to the page background.


## Palette and source

Reference: [v587su.github.io](https://v587su.github.io/), public repository
[v587su/v587su.github.io](https://github.com/v587su/v587su.github.io).
The inline CSS in `index.html` was checked at revision
`8c406ea2e273a5037a671a75a7035aa55c1a0353` and compared with the live site's computed
styles on 25 October 2026. Source licence and copyright notice are distributed at
`assets/licenses/reference-site-BSD-2-Clause.txt` (BSD 2-Clause).

| Role / local token | Light | Dark |
| --- | --- | --- |
| Background / paper | #FAFAF7 | #111110 |
| Surface / card | #FFFFFF | #181817 |
| Secondary surface / code-bg | #F0F0EB | #212120 |
| Text / ink, body | #141414 | #ECECE8 |
| Muted / secondary, muted | #66665F | #9B9B95 |
| Border / line | #E0E0DA | #2C2C2A |
| Accent / accent | #C2402A | #E8705A |

All fourteen core values are unchanged from the source. Strong/soft accents and
muted blue, green and gold pairs also come from its CSS. Rouge maps keywords to
strong accent, names to blue, strings to green, numbers to gold and comments to
muted text. Diff additions/removals use the reference's green/red chip pairs.
Timeline rails use the decorative border token; nodes use muted text and the
current node uses the accent. Artwork remains in its original colors.

One separate accessibility adjustment: `control-line` is #8C8C83 / #696963 for
button and form boundaries (3.39:1 / 3.22:1 against the surface). Decorative source
borders are too subtle to be the sole control boundary. This does not alter the
core border token. Checked text pairs, including syntax colors, meet 4.5:1.

## Header and surfaces

The full-width sticky header uses a 70% background tint (more transparent than the reference, as requested) and 10px
backdrop blur, including the WebKit prefix. Browsers without backdrop filtering
receive an opaque background. The inner header is 52px high plus its border.
The desktop profile starts at 84px, leaving about 31px below the header; mobile
retains the existing stacked profile. Scroll padding leaves room for the header.
A focused skip link sits above it. Short-height profiles scroll internally.

Project cards retain their grid, dimensions and typography. They use the surface
token, a very subtle inset highlight and a 1px/2px shadow, intentionally weaker
than the source site's hover shadow. Hover and keyboard focus within the card
change its border to the accent with no animation. Font families, sizes, weights,
content architecture and timeline geometry are unchanged; the compact header
moves the whole main content upward relative to the previous taller header.

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
traceability; avatars and article images are unaffected. HKUST and OPPO keep their
original colors in both themes, as requested by the user. Do not recolor logos
with CSS filters. See LOGO_SOURCES.md.

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
