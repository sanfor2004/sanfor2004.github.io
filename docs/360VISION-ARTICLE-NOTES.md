# 360Vision Article: Evidence and SEO Handoff

Article: [360Vision: Building a 360° Virtual Tour Studio in Next.js](../src/content/blog/360vision-nextjs-virtual-tour-studio.md).

Intended public URL after deployment: `https://sanfor2004.github.io/blog/360vision-nextjs-virtual-tour-studio/`.

## Evidence reviewed

The 9 September 2026 working tree at `C:/www/360vesion` supplied the facts. This was source inspection, not a fresh end-to-end verification of that separate application.

| Source in 360Vision | Article evidence |
| --- | --- |
| `README.md`, `docs/project-status.md`, `docs/technical-plan.md` | Current local scope, features, setup, removed account/publication model, remaining work |
| `lib/types.ts`, `lib/schema.ts` | Shared scene/hotspot/floor model, angular coordinates, percentage bounds |
| `lib/store.ts` | Temporary file replacement, in-process mutation queue, readable JSON storage |
| `lib/storage.ts` | Local uploaded files |
| `app/api/upload/route.ts` | Ratio and width validation, full/mobile/thumbnail JPEG variants |
| `components/studio/SphereStudio.tsx` | One-second debounce and visible save state |
| `components/viewer/TourViewerInner.tsx` | Scene viewing and automatic tour behavior |
| `public/markting/README.md` | Existing campaign assets and their provenance |

Some older comments still mention authentication. Current code and current product documentation establish the local unauthenticated scope. The older portfolio case study was updated to remove contradictory Prisma/Auth.js/publication claims.

## Assets

Copied without editing from the existing campaign into `public/images/writing/360vision/`:

- `images/blog-cover.png` → `cover.png` (1600 × 900).
- `screenshots/floor-plan-navigation.png` → `floor-plan.png` (1440 × 900).
- `screenshots/studio-desktop.png` → `studio.png` (1440 × 900).

Screenshots show the bundled Cedar House demo. The source campaign separately discloses AI-generated lifestyle and hardware illustrations; the article does not present these as customer evidence.

## Search and sharing implementation

- Descriptive title and short summary centered on 360Vision and virtual-tour authoring in Next.js.
- Stable readable URL, visible author linked to About, published/modified timestamps.
- Existing canonical URL, BlogPosting JSON-LD, RSS, sitemap, blog index, and topic archive generation.
- Article language/category/URL in JSON-LD and more specific author URL.
- Open Graph site name, locale, image description/dimensions, article dates/author/category, and Twitter image alt text.
- Large image preview permission through `max-image-preview:large`.
- Explicit cover dimensions, priority loading, lazy body screenshots, semantic sections, contents links, and useful FAQ text.
- Contextual internal links and a reciprocal project case-study link.

No fake reviews, keyword meta tags, fabricated metrics, or FAQ rich-result promises were added. Indexing, rich results, and virality remain outside the implementation's control.

References checked: [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) and [Google Discover guidance](https://developers.google.com/search/docs/appearance/google-discover). Google describes article metadata as helping it understand content and recommends large relevant images for Discover. Eligibility is not a guarantee of appearance.

## After authorized deployment

Local validation completed: production build generated 72 pages with zero Astro diagnostic errors, warnings, or hints. Browser checks at 390px and 1440px verified both themes, image decoding, article anchors and internal links, canonical/social/JSON-LD metadata, four-post indexing, filtering, and theme/music DOM persistence during navigation. The article was present in generated RSS and sitemap output. Documentation links and `git diff --check` passed. This does not substitute for live indexing or a fresh 360Vision application test.

1. Confirm the live article, images, canonical URL, feed, and sitemap resolve.
2. Check the public page in Google's Rich Results Test and Search Console URL Inspection if the owner has access.
3. Request indexing and submit the sitemap if appropriate; neither is performed by these source changes.
4. Share the article through the owner's chosen channels when authorized, using a real feature and clear question as the hook.
5. Review actual impressions, visits, and useful conversations before adjusting content.

Suggested social copy, not posted: “A panorama shows a room. A tour needs to connect it to the rest of a property. I built 360Vision with Next.js, angular hotspots, interactive floor plans, and local JSON storage. Here is the engineering story—and why exporting JSON is not the same as backing up a project.”
