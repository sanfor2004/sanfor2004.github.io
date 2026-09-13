# SANFOR SEO, analytics, and article layout upgrade

Local implementation and validation completed on 13 September 2026. GitHub Pages deployment status must be checked separately after a push.

## Result

Project details now use the blog article's shared frame, heading treatment, metadata sidebar, prose, and responsive behavior. Status, role, stack, tags, repository/demo, and accurate dates remain available. 360Vision reuses its genuine existing cover; short projects do not receive fabricated content or placeholder illustrations.

Central SEO now provides the Ahmed Abdelaziz / Sanfor identity, descriptive page titles, canonicals, social metadata, safe JSON-LD, and optional verification tags. The new default social card is 1200 × 630 and approximately 41 KB; it uses the unchanged logo. The older 1491 × 373 banner is retained.

The existing sitemap integration, robots.txt, RSS endpoint, tags, published URLs, 48 Learning redirects, and complete Design Patterns hub were reused. Existing authored pattern previous/next and related links were preserved. New generated related links serve other articles/projects; entry endings connect to Projects, About, and Contact. Repeated populated topics are exposed on the blog index. No empty tools or topic routes were created.

## Files created

| Path | Purpose |
| --- | --- |
| `.env.example` | Optional analytics and verification configuration |
| `src/components/SEO.astro` | Central metadata, social cards, canonical, verification, JSON-LD |
| `src/lib/seo.ts` | Person identity and breadcrumb schema |
| `src/components/Analytics.astro` | Production-only analytics configuration gate |
| `src/lib/analytics.ts` | Typed event helper and Astro navigation tracking |
| `src/components/ArticleFrame.astro` | Shared project/blog article presentation |
| `src/components/ArticleMeta.astro` | Shared author and semantic publication/update dates |
| `src/components/Breadcrumbs.astro` | Subtle accessible entry breadcrumbs |
| `src/components/RelatedContent.astro` | Relevant published article links and onward navigation |
| `src/pages/404.astro` | Branded noindex recovery page |
| `public/assets/brand/social-card.png` | New default social preview |
| `public/assets/brand/social-card.README.md` | Asset provenance and reproduction instructions |
| `scripts/render-social-card.mjs` | Reproducible HTML/CSS social-card rendering |
| `scripts/verify-site.mjs` | Static output and browser smoke checks with external requests blocked |
| `docs/SEO.md` | SEO architecture, publishing checklists, Search Console/Bing instructions |
| `docs/ANALYTICS.md` | GA4 configuration, events, privacy, Realtime/DebugView verification |
| `docs/GROWTH.md` | Evidence-based content clusters, GitHub backlinks, future tools approach |
| `docs/UPGRADE-REPORT.md` | This implementation and validation report |

## Files modified

| Path | Change |
| --- | --- |
| `src/layouts/BaseLayout.astro` | Delegates SEO/analytics; adds content identity and no-JS loader fallback |
| `src/site.ts` | Primary SEO name, role, concise description, full homepage title |
| `src/content.config.ts` | Optional SEO titles and project image alternatives/dimensions |
| `src/pages/blog/[...slug].astro` | Shared article presentation, TechArticle, breadcrumbs, pattern SEO titles, related discovery |
| `src/pages/projects/[...slug].astro` | Blog-matching layout, SoftwareSourceCode, real dates/images, next actions |
| `src/pages/blog/index.astro` | Descriptive SEO title, semantic H1, existing populated topic links and hub link |
| `src/pages/projects/index.astro` | Descriptive SEO title and semantic H1 |
| `src/pages/about.astro` | Person-focused SEO title; existing H1, biography, metrics retained |
| `src/pages/art.astro` | Descriptive art SEO title |
| `src/pages/contact.astro` | Descriptive identity/contact metadata |
| `src/pages/tags/[tag].astro` | Accurate project-topic titles and descriptions |
| `src/pages/rss.xml.ts` | Consistent feed identity and Dublin Core author metadata |
| `src/components/SiteFooter.astro` | Primary identity and existing LinkedIn profile link |
| `src/components/ThemeToggle.astro` | Guard storage writes so blocked storage cannot break the toggle |
| `src/styles.css` | Small brand-compatible breadcrumb/topic/discovery styles |
| `src/content/projects/360-vision.md` | Search title and reuse of existing 1600 × 900 cover |
| `src/content/projects/fitness-coach-website.md` | Accurate descriptive SEO title |
| `src/content/projects/multi-region-tag-translator.md` | Accurate descriptive SEO title |
| `src/content/projects/php-hls-streamer.md` | Accurate descriptive SEO title |
| `src/content/projects/xcve.md` | Accurate descriptive SEO title |
| `src/content/projects/xdge.md` | Accurate descriptive SEO title |
| `src/content/projects/xgs.md` | Accurate descriptive SEO title |
| `astro.config.mjs` | Explicit trailing slash policy and 404 sitemap exclusion |
| `.github/workflows/deploy.yml` | Passes optional repository variables to production build |
| `.gitignore` | Allows tracking `.env.example` while keeping actual env files ignored |
| `tsconfig.json` | Excludes generated/temporary output from diagnostics |
| `README.md` | Links setup guides and documents configuration/social-card reproduction |
| `AGENTS.md` | Updates implementation facts and maintenance map |
| `docs/PORTFOLIO-HANDBOOK.md` | Aligns identity, schema, discovery, dates, and interaction facts |
| `docs/SITE-ARCHITECTURE.md` | Aligns SEO, analytics, layout, footer, and storage documentation |
| `docs/BRAND-GUIDE.md` | Records primary SEO authorship and default sharing asset |

No package or lockfile changes. Existing Astro, sitemap, RSS, TypeScript, and Playwright packages were sufficient. `npm ci` installed 354 locked packages and reported zero vulnerabilities. The install initially hit an Astro-held Windows native-module lock; the project servers were stopped and successfully restarted after installation. npm reported a blocked esbuild postinstall; the installed platform executable nevertheless built the site successfully, so no install policy was changed.

## Validation

- `npm run build`: passes; latest Astro diagnostics report zero errors, warnings, or hints, and 101 generated pages plus compatibility redirects.
- `npm run verify:patterns` in the Visual Studio developer environment: 24 posts, 48 redirects, and all 23 C++20 examples pass, none skipped. A plain shell initially lacked MSVC include paths; rerunning in the required developer environment resolved that.
- Static smoke checks: 101 non-redirect HTML documents; one H1/title/canonical each; unique titles/descriptions; social fields; parseable JSON-LD; 3,348 internal link/image references; RSS author and 28 entries; correct production origin; sitemap exclusions and all 23 pattern navigation paths.
- Chrome browser checks: representative project, article, blog, and About pages at 390px and 1440px in both themes; no page overflow or broken decoded images; keyboard access, theme continuity, blocked storage, language/direction, reduced motion, normal loader completion, and no-JS fallback.
- GA disabled build: no Google tag request or global gtag.
- Isolated GA-enabled build with test tokens: Google script intercepted; exactly one queued page view per completed direct/internal/back/forward navigation, matching article/project views, and GitHub/LinkedIn/Contact events. One tag load per document session. Test query data is absent from queued events. Both verification meta tags are present.
- Screenshots were reviewed locally; temporary builds and screenshots remain ignored under `tmp/`.
- `git diff --check`: passes. Windows line-ending normalization notices are informational.

## Owner setup and deployment

1. GitHub repository Settings → Secrets and variables → Actions → Variables: set `PUBLIC_GA_MEASUREMENT_ID` to the intended `G-...` ID. The previous stream was `G-7B8D7CCSRQ`; reuse it if still correct. Local configuration belongs in ignored `.env`.
2. In GA4 Web stream Enhanced measurement settings, disable automatic page changes based on browser history events; this site sends explicit page views. See [ANALYTICS.md](ANALYTICS.md).
3. Optionally set `PUBLIC_GOOGLE_SITE_VERIFICATION` and `PUBLIC_BING_SITE_VERIFICATION` to the real content tokens. Never put sample tokens into production settings.
4. Keep Pages configured for GitHub Actions. Once deployment is authorized, the existing push-to-main workflow builds and deploys with these variables. Changing variables requires rebuilding.
5. In Search Console, verify the URL-prefix property `https://sanfor2004.github.io/`, then submit `https://sanfor2004.github.io/sitemap-index.xml`. Inspect representative live URLs and request indexing as appropriate.
6. In Bing Webmaster Tools, import the verified Search Console property or use the Bing meta token; submit the same sitemap.
7. Open production, confirm your GA Realtime session, navigate to articles/projects, and trigger the documented clicks. Use DebugView for detailed confirmation. Local mocks do not establish delivery to the account.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run preview
node scripts/verify-site.mjs
```

Use `npm.cmd` in Windows PowerShell when needed. Preview was restarted at `http://127.0.0.1:4321`; development was restarted at `http://127.0.0.1:4322`.

## Limits and future work

No account configuration, external messages, or external repository edits were performed. Indexing, ranking, GA ingestion, and real-user Core Web Vitals require live owner verification. Browser checks are targeted smoke coverage, not an exhaustive accessibility or device audit. Existing large gallery/source assets remain unchanged; several exceed 2 MB, so responsive delivery is a useful later performance task. Dormant audio stays unmounted. Several project summaries need real source evidence before they can become full case studies. IndexNow and future tools are documented approaches, not shipped endpoints. The pre-existing untracked `debug.log` was preserved.
