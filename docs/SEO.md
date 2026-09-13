# SEO and publishing

## Architecture

[SEO.astro](../src/components/SEO.astro) is used once by [BaseLayout](../src/layouts/BaseLayout.astro). It provides unique titles/descriptions, author, robots directives, canonical, Open Graph, Twitter cards, alternate languages, RSS discovery, verification tokens, and escaped JSON-LD. The homepage uses Ahmed Abdelaziz (Sanfor) and the systems/backend role; other titles end in `| Sanfor`. The visible SANFOR wordmark is preserved.

Canonical URLs use Astro's configured production origin and pathname, omitting queries and fragments. `trailingSlash: "always"` matches directory-style GitHub Pages URLs. Existing slugs and the 48 legacy Learning redirects remain intact. Do not rename published articles for shorter SEO URLs.

[seo.ts](../src/lib/seo.ts) supplies the real Person entity and breadcrumb schema. Home/About use ProfilePage with Person; other ordinary pages use WebPage. Engineering articles use TechArticle, projects with repositories use SoftwareSourceCode, and nested entries add BreadcrumbList. Person aliases connect Ahmed Abdelaziz, Sanfor, sanfor2004, and the existing full name. Only configured real profiles are included.

Article/project pages share [ArticleFrame](../src/components/ArticleFrame.astro) and [ArticleMeta](../src/components/ArticleMeta.astro). Updated dates appear only when authored. Structured modification time may fall back to publication time; it never uses build time. Short project entries remain accurate summaries; expand them only when source evidence supports additional engineering detail.

## Discovery outputs

- Official `@astrojs/sitemap` generates `https://sanfor2004.github.io/sitemap-index.xml` and its child sitemap. Prototype, 404, and Learning aliases are excluded.
- [robots.txt](../public/robots.txt) permits crawling and lists that sitemap.
- `/rss.xml` includes published blog entries, dates, descriptions, tags, links, and Dublin Core author metadata. Its discovery link is in every document head.
- Drafts are filtered from pages, listings, topic archives, and RSS; excluded routes cannot enter the generated sitemap. Future dates do not hide entries.
- `/404.html` provides useful navigation and is noindex. `/testblog/` keeps its existing noindex/nofollow and sitemap exclusion.

## Metadata and images

Keep existing `pubDate` and `updatedDate` fields; no frontmatter migration is needed. `seoTitle` is optional for blog/projects when a shorter visible title benefits from a more descriptive search title. Descriptions come from frontmatter. Pattern SEO titles are derived from stable pattern identities, preserving official visible names.

Blog covers require `image` and `imageAlt`; project covers are optional and support `imageAlt`, `imageWidth`, and `imageHeight`. Supply accurate positive dimensions and meaningful alternatives when adding a project image. Existing 360Vision artwork is reused on its case study. All other entries without a cover use the new 1200 × 630 SANFOR social card in metadata, without a decorative placeholder in the article. It is reproducible with `node scripts/render-social-card.mjs` using the unchanged logo and local Inter font; the former 1491 × 373 banner is retained.

Assets in `public/` are served unchanged. Preserve provenance, optimize new delivery files, reserve dimensions when known, and inspect mobile layout and image decoding. Existing favicon SVG remains the brand source; no unnecessary PWA manifest or install behavior is added.

## Topics and internal links

The first cornerstone remains `/blog/design-patterns-overview/`: all 23 patterns, three categories, tradeoffs, and reading order. Each pattern retains authored backlinks and related comparisons, with previous/next navigation following `design-pattern-series.mjs`. No duplicate hub URL is created.

The blog index exposes populated topics from existing tags, showing repeated topics rather than empty future pillars. Existing tag archive URLs remain valid. RelatedContent selects up to three published articles by shared tags and category, with deterministic ordering; unmatched content gets no artificial related list. Existing authored related-pattern links are retained without a duplicate generated related list. Both article and project endings link to Projects, About, and Contact. The 360Vision case study already links its detailed engineering article.

For future cornerstone guides, author a real Markdown hub, tag related entries consistently, and add contextual hub links. No new collection is needed until distinct content requirements justify it. Do not restore the removed Learning section.

## Google Search Console

1. Add the **URL-prefix property** `https://sanfor2004.github.io/` in [Search Console](https://search.google.com/search-console). You control this Pages site, not the parent `github.io` DNS zone.
2. Choose HTML tag verification. Copy only the token from its `content` attribute into GitHub Actions repository variable `PUBLIC_GOOGLE_SITE_VERIFICATION` (or `.env` for local inspection).
3. Rebuild/deploy, check the homepage source for `google-site-verification`, then click Verify. Keep the token configured afterward.
4. Submit `https://sanfor2004.github.io/sitemap-index.xml` in Sitemaps.
5. Use URL Inspection for the homepage, a case study, the patterns hub, and a pattern article. Test the live URL and request indexing when appropriate.
6. Monitor Performance (clicks, impressions, CTR, average position), Page indexing errors, and Core Web Vitals. Small sites may lack enough field data initially. Submission does not guarantee ranking or indexing.

See Google's [ownership verification](https://support.google.com/webmasters/answer/9008080) and [URL Inspection](https://support.google.com/webmasters/answer/9012289) documentation.

## Bing and IndexNow

Add the same site to [Bing Webmaster Tools](https://www.bing.com/webmasters/). Import your verified Search Console property or choose meta tag verification. Set `PUBLIC_BING_SITE_VERIFICATION` to the supplied content token, rebuild/deploy, then verify. Submit the same sitemap and inspect important URLs. See [Bing verification](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b) and [sitemaps](https://www4.bing.com/webmasters/help/sitemaps-3b5cf6ed).

IndexNow is practical without a backend: an owner-generated key can be published as `public/<key>.txt`, then a post-deployment script can submit only changed public canonical URLs after checking that the deployed key is available. Its [protocol](https://www.indexnow.org/documentation) supports a hosted key file and URL submissions. No key or automatic submission is added now: sitemap discovery is already configured, and a dependable change/deletion manifest and live deployment check should precede automation. Do not submit drafts, aliases, or the prototype. This is optional future deployment work, not an indexing guarantee.

## Article publishing checklist

- [ ] Clear reader question/search intent; technically accurate explanation
- [ ] One descriptive H1 (the layout supplies it; begin Markdown sections at H2)
- [ ] Unique title and description; optional `seoTitle` only when useful
- [ ] Descriptive stable slug; preserve existing public URLs
- [ ] Real published date, author, and optional genuine updated date
- [ ] Reused relevant tags/category, no empty doorway topics
- [ ] Real cover, descriptive alt text, matching dimensions, provenance
- [ ] Contextual internal links, related articles, parent hub link where applicable
- [ ] Canonical, TechArticle data, social preview verified in output
- [ ] No broken links, images, or unsupported claims
- [ ] Draft removed only when publication-ready
- [ ] Build passes; series verifier passes for pattern changes
- [ ] Desktop/mobile, both themes, keyboard and reduced motion checked

## Project publishing checklist

- [ ] Project title, clear explanation, problem, and solution
- [ ] Actual role, status, technologies, architecture/engineering details
- [ ] Supported outcome; no invented metrics or missing-evidence filler
- [ ] Genuine repository/demo links if available
- [ ] Unique SEO title and meta description
- [ ] Appropriate social image and accurate alternative/dimensions
- [ ] SoftwareSourceCode data reflects the real repository
- [ ] Relevant technical article links and clear next action
- [ ] Stable slug, accurate dates, publication flag, build and visual review

## Verification commands

```sh
npm ci
npm run dev
npm run build
npm run verify:patterns
npm run preview
node scripts/verify-site.mjs
```

The smoke verifier uses installed Chrome through Playwright, checks all generated pages and local link destinations, then exercises responsive/theme/navigation behavior. It blocks external network traffic. For an isolated production build with a test GA ID, run it against that directory with `--analytics`; it checks queued events, not live GA ingestion.

Build includes Astro/TypeScript diagnostics. Inspect `dist/index.html`, About, project/article samples, sitemap, robots, RSS, and 404. Production metadata must not contain localhost, loopback addresses, or filesystem paths. Analytics configuration and owner checks are in [ANALYTICS.md](ANALYTICS.md); long-term editorial work is in [GROWTH.md](GROWTH.md).
