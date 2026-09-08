# Campaign validation

This is validation of the campaign artifacts, not a new application release or live search-index audit.

The renderer captured the existing local build with external network requests blocked. It used the original SVG logo and project fonts, rendered nine exports, and checked for canvas overflow. The verification script checks all twelve deliverable IDs, X text length, local document links, PNG dimensions, and browser image decoding, then creates a contact sheet for visual review.

Run from the repository root:

```sh
node Markting/source/render.mjs
node Markting/source/verify.mjs
```

Platform-specific community/account eligibility is not implied. See [project-brief.md](project-brief.md) for the official guidance consulted and remaining publishing checks.
