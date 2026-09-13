# How the Sanfor site works

Updated 13 September 2026 after the SEO, analytics, and shared article layout upgrade. This describes the working tree, not live deployment. See the [handbook](PORTFOLIO-HANDBOOK.md) for editorial practice and [AGENTS.md](../AGENTS.md) for change discipline.

## From source to a page

1. [astro.config.mjs](../astro.config.mjs) configures the root Pages URL, React, sitemap generation, legacy redirects, and the Tailwind Vite plugin. No server adapter or MDX integration is configured.
2. [content.config.ts](../src/content.config.ts) loads Markdown blog/projects and validates frontmatter at build time.
3. Files in `src/pages/` define routes. Dynamic routes use `getStaticPaths()`; details call `render()`. Filtering and sorting are implemented in each route.
4. [BaseLayout](../src/layouts/BaseLayout.astro) provides the document, metadata, styles, navigation, and browser enhancements.
5. `npm run build` runs Astro diagnostics and generates static output in `dist/`. Files in `public/` are copied as supplied.
6. GitHub Actions verifies the pattern articles and Python and C++ examples, builds, uploads only dist, and deploys that artifact.

There is no application database, authentication, CMS, contact API, or server-side code execution. RSS is generated during the build. React is configured but no current page mounts a React island.

## Routes and content

| Route | Behavior |
| --- | --- |
| `/` | SANFOR entrance and five destinations from site configuration |
| `/about/` | Biography, skills, experience, and newest seven non-draft projects |
| `/projects/` | Non-draft projects, newest first, rendered with ProjectEntry |
| `/projects/<slug>/` | Markdown details, role, stack, status, repository/demo links |
| `/tags/<tag>/` | Project-only archive using PostCard, no explicit date sorting |
| `/blog/` | Non-draft articles, newest first, metadata search and enhanced desktop masonry |
| `/blog/<slug>/` | Article or blog topic archive; articles take precedence over matching tags |
| `/blog/design-patterns-overview/` | Starting article for the 24-post English series |
| `/blog/design-pattern-<slug>/` | One of 23 individual pattern articles |
| `/art/` | Fourteen image/caption records in the route source |
| `/contact/` | Public profile links from site.contactPlaceholders |
| `/rss.xml` | Published blog metadata, including the pattern series |
| `/testblog/` | Unlisted writing-layout prototype using published posts |
| Former `/learning/` routes | Redirect-only compatibility pages targeting the English blog series |

Current source inventory is 28 blog articles: four earlier articles, one pattern overview, and 23 individual patterns. There are seven project writeups. These are content counts, not audience metrics.

Blog/project IDs determine their slugs. Tag normalization only lowercases and replaces literal spaces; punctuation remains. Raw tags are deduplicated before normalization, so differently spelled tags can still collide. TagList defaults to `/tags`; blog details supply `/blog`. Tags inside encompassing card links remain unlinked spans.

Publication filtering checks `draft`, not the current date. Drafts are excluded even in development and the prototype. Lists sort by pubDate, not updatedDate; the overview's 12 September date places it ahead of the migrated individual posts, whose original 11 September publication dates are preserved. Future posts can naturally appear above it. The overview and each article's series links provide a stable reading order.

The prototype remains publicly accessible when deployed. It supplies `noindex, nofollow` and is excluded from the sitemap; it is not a private draft-preview mechanism.

## Design-pattern migration and maintenance

The old Learning hub, 46 localized MDX wrappers, three lesson components, catalog/printing scaffold, generation script, and related CSS have been removed. Navigation now has About, Projects, Writing, Art, and Contact. BaseLayout retains language/direction support for future use, but no Arabic lesson UI or code-language tabs are mounted.

| Source | Responsibility |
| --- | --- |
| [Overview article](../src/content/blog/design-patterns-overview.md) | Categories, class/object scope, prerequisites, all 23 links, comparisons, reading order |
| `src/content/blog/design-pattern-*.md` | Authored English explanations, complete Python and C++20 source and output, images, and cross-links |
| [design-pattern-series.mjs](../src/data/design-pattern-series.mjs) | Stable names/categories/slugs and 48 legacy redirects |
| [verify-pattern-posts.mjs](../scripts/verify-pattern-posts.mjs) | Publication structure, asset/link checks, and compilation/output checks |
| [Pattern image provenance](../public/images/writing/patterns/README.md) | Original cover history, migration, and copied diagram attribution |

Titles use `Pattern Name (Creational Pattern)`, `(Structural Pattern)`, or `(Behavioral Pattern)`. Blog category is Design Patterns. All articles link back to the overview, to related posts, and to the original repository source; individual posts also provide previous/next links.

The articles adapt the owner's separate [23-Design-Patterns repository](https://github.com/sanfor2004/23-Design-Patterns). Each presents its complete Python example first and then its C++20 example, with separate expected outputs. The source remains external, but the published Markdown and diagrams are self-contained: builds do not read a neighboring checkout or fetch repository content.

Edit the Markdown directly. There is no generator that can overwrite it. When changing code, keep its expected-output block synchronized and re-run verification. Preserve factual limits on ownership, thread safety, error handling, and external effects. Exact output checks cover demonstrated scenarios, not every input or challenge.

All 23 old WebP covers were copied unchanged into `public/images/writing/patterns/`; the former `public/images/learning/patterns/` paths remain available for existing image links. The directory also contains 23 warm SVG sketch maps shared with the source repository, provenance, and SOURCE-LICENSE.txt. Covers illustrate analogies; diagrams trace example roles and calls. The ignored purchased GoF PDF is private and is not part of the published assets.

## Legacy URLs

Astro configuration imports the explicit redirect map. `/learning/` and `/learning/patterns/` point to the overview. Each English and Arabic pattern URL points to its corresponding English article. The old section is not rendered.

GitHub Pages receives static redirect HTML rather than application-server 301 responses. The generated pages use immediate refresh, a destination link, and canonical metadata. The sitemap filter excludes legacy Learning URLs. Validate redirect destinations after renaming any article; preserving these aliases prevents old links from becoming dead ends.

## Shared shell and browser state

BaseLayout mounts PageLoader, SiteHeader except on home, main#content, AsciiSignal (the horse drawing), SiteFooter, ThemeToggle, and SiteCursor. Home supplies skip-to-navigation; internal pages have skip-to-content. The mobile header uses a native details menu. Footer navigation reuses navItems and adds RSS, GitHub, and LinkedIn.

ClientRouter replaces page DOM during internal navigation. Enhancements use Astro lifecycle events and initialization guards; new code should reacquire page-local nodes after swaps.

| Behavior | Current implementation |
| --- | --- |
| Theme | sanfor-theme stores light/dark; restored initially and after swaps, defaulting to light |
| Theme control | New buttons bind on page load; label and pressed state update; storage reads/writes catch blocked access |
| Language | Layout props and main data attributes synchronize document lang/dir on page load; current content is English |
| Blog search | Case-insensitive substring match over title, description, category, tags; updates hidden cards, live count, and empty message |
| Blog masonry | At 761px and wider, JS measures cards and assigns grid spans; recalculates on images, fonts, filtering, and resize; cleans observer/frame before swap |
| Loader | Split-panel reveal, normal completion after 950ms; reduced motion finishes immediately |
| Cursor | Square enhancement for fine pointers without reduced motion; queries current DOM on pointer events |

Search does not inspect article bodies, persist in the URL, or run on topic/prototype pages. A noscript fallback hides the loader when JavaScript is disabled.

MusicPlayer, MusicPrompt, BusinessPanels, IllustrationSlot, PageHeader, and ui/SectionHeader have no current consumers. Dormant music retains transition:persist, Web Audio, and track/volume storage. Audio files and attribution still ship because they are under public.

## Styling, metadata, and assets

[styles.css](../src/styles.css) imports local Inter weights 400–800, Tailwind, and daisyUI. The sanfor light theme and sanfor-dark overrides supply semantic colors and the rail container. The [brand guide](BRAND-GUIDE.md) records visual conventions. The removed Learning styles do not define the blog series' appearance.

BaseLayout delegates metadata to SEO.astro, which derives trailing-slash canonical URLs from the pathname and Astro site origin. Home/About use ProfilePage/Person; other ordinary routes use WebPage. Blog details supply TechArticle; projects with repositories supply SoftwareSourceCode. BreadcrumbList accompanies nested entries. RSS contains article metadata and author names, not full bodies. Sitemap excludes the prototype, 404, and old Learning aliases. See [SEO](SEO.md).

Analytics.astro enables the typed analytics helper only for production builds with a valid PUBLIC_GA_MEASUREMENT_ID. It handles astro:page-load and delegated discovery clicks. Google automatic history page views must be disabled in the stream settings; see [Analytics](ANALYTICS.md). ArticleFrame and ArticleMeta are shared by blog/project details; project covers and authored updated dates now surface. RelatedContent extends internal discovery; patterns preserve their existing authored related links and previous/next navigation.

Files in public are served as supplied, without automatic responsive conversion. Markting contains a separate prepared campaign and reproduction tools; it is outside the site output. Its Playwright tools use installed Chrome and capture dist through a temporary loopback server. Historical campaign and article reports describe their dated runs, not current validation.

## Commands and deployment

| Command | Effect |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Astro development server; draft filtering still applies |
| `npm run lint` | Astro diagnostics, not ESLint or formatting |
| `npm run verify:patterns` | Check 24 posts, assets, links, redirects, and available C++ compilation/output |
| `npm run build` | Astro diagnostics followed by static output |
| `npm run preview` | Serve the generated build |

The pattern verifier supports Python plus g++, clang++, and cl. MSVC must run inside a configured Visual Studio developer shell with headers and libraries available. Missing tools are reported as local skips; CI requires Python and a compiler. It extracts each complete Python and C++ block, runs it, compares stdout with its own expected-output block, and removes its unique temporary directory under tmp. It does not run the deliberately incomplete naive snippets.

[deploy.yml](../.github/workflows/deploy.yml) runs on main pushes or manual dispatch. Its Ubuntu job configures Node 22, installs dependencies, runs pattern verification with the runner's C++ compiler, builds, and uploads dist. The old Go/Java/Python setup steps are removed. The dependent job deploys to github-pages; pages concurrency has cancel-in-progress false. Pages settings and live status are external.

package.json has no project engines constraint. Inspect installed dependency requirements when resolving environment issues. TypeScript extends Astro strict and maps @/* to src/*. Use npm.cmd if PowerShell blocks npm.ps1.

## Maintenance checks

For content changes, inspect generated articles, archives, RSS, sitemap, images, and internal links. For series changes, also run the pattern verifier. For visible changes, review mobile/desktop, both themes, keyboard access, code/table overflow, image decoding, and reduced motion. Shell changes require direct, internal, and history navigation with theme continuity.

Known gaps remain in the [handbook](PORTFOLIO-HANDBOOK.md#10-known-gaps-and-future-direction). Updating content does not authorize deploying, posting externally, or repairing unrelated issues.
