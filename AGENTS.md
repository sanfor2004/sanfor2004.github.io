# AGENTS.md — rules for Claude Code on sanfor2004.com

Read this whole file before every task. It is the single source of truth.

## The design system
The live reference is the Sanfor2004 design system (Claude artifact). In code, the system IS:
- `src/styles/global.css` — every token (colors, type, spacing, radius, widths) in `@theme`, plus named grid utilities.
- `src/components/ui/*` — Button, Eyebrow, Tag, Placeholder, FigureCaption, Mark, ArrowUpRight, GradientBand.
- One-line summary: warm paper, black ink, one orange pen. Art is soft; UI is sharp and quiet.

## Hard rules
1. **Tokens only.** No arbitrary Tailwind values (`p-[13px]`, `text-[#fff]`, `grid-cols-[...]`), no inline `style=`, no raw hex outside `global.css`. Need a new grid? Add an `@utility` in `global.css`. `npm run check:tokens` enforces this.
2. **One component per task.** Never restyle a component listed under FROZEN unless told "unfreeze X".
3. **Pages only compose components and data.** Content lives in `src/data/*.ts` and `src/content/articles/*.md`.
4. **Borders, not shadows. Lines, not cards.** No box-shadows, no rounded cards, square corners everywhere (radius only on tags and the status dot).
5. **Orange:** `bg-primary` fills (with `text-ink`), `text-primary-text` when orange is text. Never white on orange, never `text-primary` on paper. One orange moment per section.
6. **Type:** Syne (`font-display`) for headings/numbers/wordmark, Sora (`font-body`) for everything read. No other fonts.
7. **Icons:** only `ArrowUpRight` (Lucide, stroke 1.5) and the menu icon. No emoji, no decorative icons.
8. **Motion:** only GradientBand (hero, CSS drift), DecryptedWord, the story crossfade, rough-notation marks and the mobile sticky CTA. All respect `prefers-reduced-motion`. No WebGL backgrounds (see decisions log).
9. If a request conflicts with these rules, STOP and ask.

## Verify loop (every task)
`npm run verify` → token check + `astro check` + build must pass with zero errors. Then list every file you changed.

## File map
```
src/styles/global.css          tokens + base + named grids
src/data/site.ts               nav, links, figures (paintings), stats, services, steps
src/data/projects.ts           Work page list
src/data/articles.ts           reading time + date helpers
src/content/articles/*.md      articles (files starting with _ are ignored; _template.md)
src/layouts/BaseLayout.astro   head/SEO, frame, navbar, CTA band, footer, mobile sticky CTA
src/components/ui/             primitives
src/components/layout/         Navbar, Footer, CtaBand, StickyCta
src/components/sections/       Hero, Stats, Story, ServiceRow, Step, Subscribe
src/components/islands/        React: DecryptedWord
src/pages/                     index, about, projects/, projects/skylimit, articles/, articles/[...slug], art, contact, links, 404
public/images/                 fig-01 … fig-05 paintings (WebP)
```

## FROZEN components
(Add a component here once Ahmed approves it. Example: `- Button — frozen 2026-10-05`)

## Open placeholders
Search the repo for `[YEAR]`, `<Placeholder`, `TODO`:
- Skylimit problem story, team size, hours saved, 2 screenshots
- Articles (replace `example-article.md`, keep `_template.md`)
- Medium and year for each artwork on /art/ (only titles are known)
- `public/cv.pdf`
- Contact form + newsletter `action` endpoints (GitHub Pages can't process forms: use Formspree/Web3Forms and Buttondown or similar)
- Budget ranges and reply time on /contact/

## Decisions log
- 2026-10: Light mode "Paper & Ink"; Astro + Tailwind v4 + React islands; GitHub Pages with custom domain sanfor2004.com (no base path).
- 2026-10: Home = hero, stats, scroll story with 4 paintings (sticky right column on desktop, pinned strip on phone), story ends on its own CTA.
- 2026-10: Contrast fixes: muted #5e5a52, primary-text #a33a08.
- 2026-10-06: **Gradient Waves removed** from the hero (with `ogl`, the `ember` token, and the dark-panel experiment). On a light page the effect only reads as a soft haze; it needs a dark ground to show its layered hills, and in Firefox it showed as a flat gradient. Hero is plain paper again.
- 2026-10-06: **Launched from `main`** (the only branch; GitHub Pages deploys on push to main). Old live-site URLs (/blog, /learning/patterns, /tags, old /projects/<slug>) redirect via `src/data/redirects.mjs`, a snapshot that never needs new entries. RSS at /rss.xml; sitemap via @astrojs/sitemap.
- 2026-10-06: React Bits **Side Rays** tried and removed (with `ogl`): like Gradient Waves, a light-on-dark WebGL effect that reads as a grey veil on paper. Replaced by our own **GradientBand** (`ui/GradientBand.astro`): light peach/orange linear gradient rising from the bottom of the hero's left column, slowly drifting sideways. Pure CSS, tokens only, still under reduced motion. Hero text stays muted/graphite (≥5.4:1 measured over it).
