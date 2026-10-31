# Current validation

Snapshot: 31 October 2026. User authorized publishing the reviewed homepage.

Scope: department labels, organization/role typography, RA supervisor link,
reusable section headings and the reviewed Writing-before-Projects order.
OPPO uses a descriptive English translation, not a verified official department name.
No article changes, dependencies, workflow changes or screenshots are included.

## Executed checks

- Content validation and release gate: passed (6 content files).
- Strict production Jekyll build: passed.
- Generated-site check: passed (8 HTML pages), including links, XML and exclusions.
- Whitespace check: passed.
- Focused desktop visual review: organization and department share ink color and
  weight 600; roles use secondary text and weight 400.
- Focused 390px browser review: departments precede roles, no overlap or page overflow.
- No new unit tests. Article regression suite is unchanged and runs in required CI.

Preview screenshots stay local in outputs/ and are excluded from publication.
The unrelated local CI upgrade and its notes are outside this release.
