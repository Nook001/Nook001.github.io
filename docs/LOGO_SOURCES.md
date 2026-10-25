# Organization marks

Retrieved on 25 October 2026 from the organizations' public websites. Files are hosted locally, preserved in their downloaded form and displayed with CSS `object-fit: contain`; no external logo service or runtime request is required.

| Organization | Local file under assets/images/organizations/ | Source |
| --- | --- | --- |
| HKUST | hkust.ico | [Official homepage icon](https://hkust.edu.hk/themes/custom/hkust/favicon.ico), linked by [hkust.edu.hk](https://hkust.edu.hk/) |
| HKUST(GZ) | hkust.ico (transparent shared university crest); original hkust-gz.png retained | [192px site icon](https://material.hkust-gz.edu.cn/wp-content/uploads/2023/04/cropped-favicon-1-1-192x192.png), linked by [hkust-gz.edu.cn](https://www.hkust-gz.edu.cn/) |
| University of Warwick | warwick.svg | [Responsive crest](https://d36jn9qou1tztq.cloudfront.net/static_war/render/id7/images/crest-dynamic.svg.481631441674), linked by [warwick.ac.uk](https://warwick.ac.uk/) |
| Tencent | tencent.png | [Tencent Icon Blue](https://www.tencent.com/wp-content/uploads/2024/05/04_Tencent_Graphics2-2.png), provided on the [media resources page](https://www.tencent.com/newsroom/media-resources/logos/) |
| Chinese Academy of Sciences | cas.png | [Official website icon](https://www.cas.cn/lib/images/favicon.png), linked by [cas.cn](https://www.cas.cn/) |
| Shopee | shopee.png | [96px site icon](https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/icon_favicon_1_96.1ce0e05fc18a86e5.png), linked by [shopee.sg](https://shopee.sg/) |
| OPPO | oppo.ico | [Official site icon](https://www.oppo.com/jimu/oppo-site/resources/images/favicon.ico), linked by [oppo.com](https://www.oppo.com/en/) |

The marks identify entries in the owner's education and experience. They do not imply endorsement. Trademarks and artwork remain with their respective owners. Source availability is not a statement of a separate trademark licence.

Education uses small 20px marks (18px on narrow phones). Experience uses 24px marks inside the cards, separate from the timeline nodes. Adjacent text supplies each organization name, so the images have empty alt text and `aria-hidden="true"` to avoid repetitive screen-reader announcements. HKUST(GZ) is the newly confirmed current role above the existing four experiences; approved education wording is unchanged.

Content validation checks each local source file, and the generated-site check verifies the image references. If an organization updates its assets, inspect its official site and replace the local file intentionally rather than adding a runtime fetch.

Logo alpha was audited locally: HKUST, Tencent, Shopee and OPPO already have
transparent backgrounds. No CSS backing is applied to them. HKUST(GZ)'s favicon
embeds the shared blue/gold university crest on white; its entry now reuses the
existing official transparent HKUST crest file. Both source files are retained.
Warwick's SVG continues to switch its own black/white artwork with color-scheme.
CAS's original PNG is opaque: a 46% circular CSS clip removes only the outside
white corners while retaining the seal's white internal artwork.

The original HKUST crest and OPPO icon are too dark on the blue-gray surface.
Only these marks render as single-ink white in Dark using a scoped CSS filter;
their shape/alpha and original files remain intact, and Light/print keep color.
White renditions are supported by the organizations' own assets:
[HKUST white SVG](https://brand.hkust.edu.hk/profiles/ust/modules/custom/hkust_signature_affiliate/assets/images/hkust_logo_small.svg)
and [OPPO white navigation SVG](https://www.oppo.com/jimu/oppo-site-nav/resources/images/svg/brand-icon-en-light.svg),
linked by their official websites. No filter is applied to Tencent, Shopee, CAS,
Warwick, avatars or article images. See THEMES.md.
