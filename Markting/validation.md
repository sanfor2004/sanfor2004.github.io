# Campaign validation

This is validation of the campaign artifacts, not a new application release or live search-index audit.

## Results

- Passed: all 12 expected deliverable IDs contain finished copy.
- Passed: the DEV companion article contains 912 words, within the framework's editorial target.
- Passed: all six X post bodies fit within 280 characters, both with literal URLs and with a 23-character URL allowance. Raw counts are 187, 173, 181, 167, 216, and 216. No emoji-dependent weighting is used in those bodies.
- Passed: nine PNG files decode in Chrome and match their requested dimensions.
- Passed: campaign Markdown links resolve locally.
- Passed: the renderer's canvas overflow checks and repository diff whitespace checks.
- Visually reviewed: all nine exports in the gallery contact sheet, plus full-size main preview and result slide. The final slide points to the portfolio rather than asking readers to keep swiping.

LinkedIn drafts contain 182 and 149 words. Reddit drafts contain 246 and 296 words. The Facebook draft contains 126 words. Counts include titles where they are inside the copy block. These counts document editorial length; they do not certify account-specific publishing eligibility.

The contact sheet is available at [source/contact-sheet.png](source/contact-sheet.png). No new application build was necessary because this run adds campaign documents/rendering tools and updates the framework's output convention without changing application sources.

The renderer captured the existing local build with external network requests blocked. It used the original SVG logo and project fonts, rendered nine exports, and checked for canvas overflow. The verification script checks all twelve deliverable IDs, X text length, local document links, PNG dimensions, and browser image decoding, then creates a contact sheet for visual review.

Run from the repository root:

```sh
node Markting/source/render.mjs
node Markting/source/verify.mjs
```

Platform-specific community/account eligibility is not implied. See [project-brief.md](project-brief.md) for the official guidance consulted and remaining publishing checks.
