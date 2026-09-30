# legacy/ — archived pre-2026 UI

**Date archived:** 2026-09-30
**Branch of origin:** `redesign/foundation`
**Status:** reference only. **Not built, not shipped, not type-checked, not linted.**

---

## Why this exists

The 2026 redesign replaces the site's entire visual layer (the warm-paper daisyUI
`sanfor` / `sanfor-dark` themes, Inter + Instrument Serif, and every page section).
Rather than delete that work, the old UI is parked here so the new build can be
written from scratch while the previous implementation stays readable — and stays in
`git log`, since every file was moved with `git mv`.

This folder sits **outside `src/`**, so Astro never discovers it as a route, layout,
component, or style entry point.

## What is in it

| Area | Contents |
|---|---|
| `legacy/src/pages/` | Every old route: home, about, art, contact, 404, the blog and projects indexes and detail routes, tag archives, `rss.xml.ts`, plus the `testblog` and `ui-kit` prototypes |
| `legacy/src/layouts/` | `BaseLayout.astro` — the old shared shell (PageLoader, SiteHeader, AsciiSignal, SiteFooter, ThemeToggle, SiteCursor, `ClientRouter`) |
| `legacy/src/components/` | 31 files: the `.astro` component set, the `bits/` GSAP islands, the `react/` panels and kit gallery, and the `ui/` shadcn-pattern primitives on Radix |
| `legacy/src/styles.css` | 3,759 lines: the `@plugin "daisyui"` setup, both daisyUI themes, the old `:root` token block, and all page-level CSS |

Browser-side enhancements (theme persistence via `sanfor-theme`, the split-panel
loader, blog search, blog masonry, the custom square cursor) were written as inline
`<script>` blocks inside the `.astro` files above — they travelled with their
components and are not stored separately.

## What was deliberately left behind

These were **not** moved, because they are content, data, assets, docs, or config
rather than UI:

- `public/` — logo, favicon, OG and social cards, the art gallery, audio, and the
  design-pattern diagrams. The new UI keeps using these paths.
- `src/content/` and `src/content.config.ts` — 31 blog posts (including the 23-part
  design-pattern series), 7 project writeups, and the Zod schemas.
- `src/data/design-pattern-series.mjs` — series identities and legacy redirects;
  imported by `astro.config.mjs` and by `scripts/verify-*.mjs`.
- `src/site.ts` — identity, contacts, navigation.
- `src/lib/` — `sitemap.ts` is imported by `astro.config.mjs`. `cn.ts`,
  `analytics.ts` and `seo.ts` now have no consumers until the new UI reaches them;
  they were kept rather than archived so the folder stays intact.
- `src/music.ts` — the dormant track list pointing at `public/audio/`.
- `AGENTS.md`, `README.md`, `social_media_launch_framework.md`, `Markting/`.
- `astro.config.mjs`, `package.json`, `tsconfig.json`, `.github/workflows/deploy.yml`.

## How it is kept out of the build

| Mechanism | Where |
|---|---|
| Outside `src/` | Astro's route/content discovery never sees it |
| `"exclude": [… "legacy"]` | `tsconfig.json` — keeps `astro check` off these files |
| `@source not "../legacy";` | `src/styles/global.css` — keeps Tailwind 4 from scanning legacy class names into the new stylesheet |

## Reusing something from here

Copy it forward deliberately; do not import across the boundary. Anything pulled into
`src/` must be rewritten against the new Ink/Ember tokens and the new font roles in
`docs/brand-foundation.md` — the legacy files reference daisyUI semantic colours
(`base-100`, `primary`, …) and the old `--color-bg` / `--color-text` aliases, none of
which exist in the new theme.

## File map — old path → legacy path

| Old path | Legacy path |
|---|---|
| `src/components/Analytics.astro` | `legacy/src/components/Analytics.astro` |
| `src/components/ArticleFrame.astro` | `legacy/src/components/ArticleFrame.astro` |
| `src/components/ArticleMeta.astro` | `legacy/src/components/ArticleMeta.astro` |
| `src/components/AsciiLabel.astro` | `legacy/src/components/AsciiLabel.astro` |
| `src/components/AsciiSignal.astro` | `legacy/src/components/AsciiSignal.astro` |
| `src/components/Breadcrumbs.astro` | `legacy/src/components/Breadcrumbs.astro` |
| `src/components/ExperienceEntry.astro` | `legacy/src/components/ExperienceEntry.astro` |
| `src/components/IllustrationSlot.astro` | `legacy/src/components/IllustrationSlot.astro` |
| `src/components/MusicPlayer.astro` | `legacy/src/components/MusicPlayer.astro` |
| `src/components/MusicPrompt.astro` | `legacy/src/components/MusicPrompt.astro` |
| `src/components/PageHeader.astro` | `legacy/src/components/PageHeader.astro` |
| `src/components/PageLoader.astro` | `legacy/src/components/PageLoader.astro` |
| `src/components/PostCard.astro` | `legacy/src/components/PostCard.astro` |
| `src/components/ProjectEntry.astro` | `legacy/src/components/ProjectEntry.astro` |
| `src/components/RelatedContent.astro` | `legacy/src/components/RelatedContent.astro` |
| `src/components/SEO.astro` | `legacy/src/components/SEO.astro` |
| `src/components/SiteCursor.astro` | `legacy/src/components/SiteCursor.astro` |
| `src/components/SiteFooter.astro` | `legacy/src/components/SiteFooter.astro` |
| `src/components/SiteGrid.astro` | `legacy/src/components/SiteGrid.astro` |
| `src/components/SiteHeader.astro` | `legacy/src/components/SiteHeader.astro` |
| `src/components/TagList.astro` | `legacy/src/components/TagList.astro` |
| `src/components/ThemeToggle.astro` | `legacy/src/components/ThemeToggle.astro` |
| `src/components/bits/CardSwap.tsx` | `legacy/src/components/bits/CardSwap.tsx` |
| `src/components/bits/CountUp.tsx` | `legacy/src/components/bits/CountUp.tsx` |
| `src/components/bits/art.tsx` | `legacy/src/components/bits/art.tsx` |
| `src/components/react/BusinessPanels.tsx` | `legacy/src/components/react/BusinessPanels.tsx` |
| `src/components/react/UiKitGallery.tsx` | `legacy/src/components/react/UiKitGallery.tsx` |
| `src/components/ui/SectionHeader.astro` | `legacy/src/components/ui/SectionHeader.astro` |
| `src/components/ui/button.tsx` | `legacy/src/components/ui/button.tsx` |
| `src/components/ui/interactive.tsx` | `legacy/src/components/ui/interactive.tsx` |
| `src/components/ui/primitives.tsx` | `legacy/src/components/ui/primitives.tsx` |
| `src/layouts/BaseLayout.astro` | `legacy/src/layouts/BaseLayout.astro` |
| `src/pages/404.astro` | `legacy/src/pages/404.astro` |
| `src/pages/about.astro` | `legacy/src/pages/about.astro` |
| `src/pages/art.astro` | `legacy/src/pages/art.astro` |
| `src/pages/blog/[...slug].astro` | `legacy/src/pages/blog/[...slug].astro` |
| `src/pages/blog/index.astro` | `legacy/src/pages/blog/index.astro` |
| `src/pages/contact.astro` | `legacy/src/pages/contact.astro` |
| `src/pages/index.astro` | `legacy/src/pages/index.astro` |
| `src/pages/projects/[...slug].astro` | `legacy/src/pages/projects/[...slug].astro` |
| `src/pages/projects/index.astro` | `legacy/src/pages/projects/index.astro` |
| `src/pages/rss.xml.ts` | `legacy/src/pages/rss.xml.ts` |
| `src/pages/tags/[tag].astro` | `legacy/src/pages/tags/[tag].astro` |
| `src/pages/testblog.astro` | `legacy/src/pages/testblog.astro` |
| `src/pages/ui-kit.astro` | `legacy/src/pages/ui-kit.astro` |
| `src/styles.css` | `legacy/src/styles.css` |

