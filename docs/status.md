# Status

## 2026-10-06 — RSS, sitemap check, redirects, launch to main

**Done:**
- RSS: `@astrojs/rss` + `src/pages/rss.xml.ts`: 32 published articles, newest
  first, topic + tags as categories; `<link rel="alternate">` in BaseLayout.
  Valid XML; every item link resolves.
- Sitemap (`@astrojs/sitemap`, already configured): 40 URLs = every built
  page, all https, no 404, no redirect pages. `robots.txt` now points at the
  https sitemap.
- 154 legacy redirects (`src/data/redirects.mjs`, generated from
  origin/main's routes): /blog + 32 posts, /learning/patterns (48), 7 old
  project pages → /projects/, 64 /tags → /articles/, /testblog + /ui-kit → /.
  Static meta-refresh pages, noindex + canonical to the new URL. All 154
  tested; whole-site link check: 1755 internal links, 0 broken.
- `.playwright-mcp/` added to .gitignore. Secret scan of all 172 committed
  files: clean.
- Git: committed `6f56ba7` (redesign) + `46952ab` (redirects) and
  fast-forwarded `main` to them (`2c3e9e7..46952ab`, no history rewritten),
  pushed, which triggered the GitHub Pages deploy. Deleted `redesign` (local +
  GitHub) and the two `claude/*` branches (all fully contained in main) plus
  their app worktree. **Only `main` remains.** An empty, git-ignored folder
  `.claude/worktrees/fetch-loop-spacing-144e4c` couldn't be removed (locked
  by a running process); it's harmless.

## Next
- Owner to supply: Zomzam start year and eRateApp.com year (About), `cv.pdf`.
- Per-project case study pages (old /projects/<slug> currently redirect to
  /projects/).
- After the deploy: spot-check https://sanfor2004.com/ (new home page),
  /articles/, an old /blog/<slug>/ link, /rss.xml and /sitemap-index.xml.

## 2026-10-06 — Old /blog/ links fixed; known dates filled

**Links:** 212 links in 26 articles pointed to the old `/blog/...` URLs (404
since the blog → articles migration). 210 went to `/blog/<slug>/` and were
rewritten to `/articles/<slug>/` only after confirming each article exists (26
targets, all matched, #anchors kept). The 2 "browse all my writing" links
`/blog/` → `/articles/`. 0 `/blog/` refs remain.
**Dates:** taken from the live site (`main`, old about.astro): Skylimit LLC
Dec 2022 – Feb 2026 → `2022 – 2026` (About + Skylimit case study "Years");
Fiverr Mar 2021 – Dec 2022 → `2021 – 2022`. Whole years match the page's
existing "2023 – 2027" style. **Not found anywhere** (all branches, files,
history): Zomzam start year and eRateApp.com year, so those are still `[YEAR]`.
Need them from the owner.
**Verified:** the build completed. New whole-site link check (follows every
internal page link + #anchor in dist/): 1601 links, 1 broken:
`/projects/360-vision/` from the 360Vision article (that project page doesn't
exist). Assets: only `/cv.pdf` and `/rss.xml` missing (no CV yet, no RSS
feed). Dates render at 1440 and 375 (`.playwright-mcp/dates/`).

## 2026-10-06 — Articles topic filter covers every topic

**Done:** the topic list now lives once in `src/data/articles.ts` (`topics`)
and is used by both `content.config.ts` (`z.enum(topics)`) and
`/articles/`. The filter shows "All" plus only the topics that have at least
one article in the list below the featured card, so no button is empty. It
now shows Design Patterns, Systems, C++, AI Engineering, Learning and Project
Engineering. Backend and Automation have 0 articles, so they're hidden until
one is published (before, they were empty buttons).
**Verified:** the build completed. Clicked every button at 1440 and 375: each
shows only its topic, all ≥1 article, and the topics sum to 31 = All (+1
featured above the filter). Desktop bar is 1 row; phone wraps to 3 rows with
no horizontal scroll. Screenshots in `.playwright-mcp/topic-filter/`.
**Found, not fixed:** 153 links in 26 articles point to `/blog/<slug>/`
(old URLs, now 404); they should be `/articles/<slug>/`. Mostly the
design-pattern series' cross-links (38 in the overview).

## 2026-10-06 — Article cover images shown

**Why they weren't showing:** the covers were restored to the article data
earlier today but only used for `og:image`. The article page had no cover
slot, and `/articles/` still had the `[FEATURED ARTICLE IMAGE]` placeholder.
**Done:**
- `articles/[...slug].astro`: cover at the top of the article column
  (`imageAlt`, width/height, `fetchpriority="high"`), with the prose image
  border.
- `articles/index.astro`: the featured card shows its cover (`aspect-16/10
  object-cover`, `alt=""` since the link title names it), with Placeholder as
  the fallback when an article has no image.
- Heavy PNG covers → WebP copies beside them (originals untouched), with
  frontmatter pointing at them: 360vision 888→83 KB, ai-reference
  1718→116 KB, technical-learning-loop 2452→193 KB. Added the missing
  imageWidth/Height for those and the SVG (240×150).
**Verified:** the build completed (`astro check` passed while the build failed
once on an HTML comment inside a JSX ternary; fixed). 32/32 article pages
contain their cover; featured slot = image; 0 broken assets (476 refs; only the
known /cv.pdf + /rss.xml missing); 1440 and 375 load with no horizontal scroll.
Screenshots in `.playwright-mcp/article-covers/`.
**Noticed, not changed:** the topic filter on /articles/ only offers
Backend / Automation / Design Patterns / Systems, so C++, AI Engineering,
Learning and Project Engineering posts only appear under "All".

## 2026-10-06 — "Links" in the main nav

**Done:** `site.ts` `nav` gets `{ label: 'Links', href: '/links/' }` after Art,
so it shows in both the desktop bar and the phone menu. With 5 links, the
"Book a free call" button wrapped to 2 lines at 768px, so in `Navbar.astro`
the md-only (768–1023px) spacing is tighter: brand `md:px-6`, nav
`gap-5 px-6`, CTA `px-6`. The CTA is now `shrink-0 whitespace-nowrap`; `lg:`
restores the original 8-unit spacing.
**Verified:** `npm run verify` clean; one row and no overflow at 1440 / 1024 /
800 / 768 (gap to CTA ≥51px at 768); CTA on one line; active underline intact;
phone menu lists Links. Screenshots in `.playwright-mcp/nav-links/`.
**Note:** `/links/` renders without the navbar (`chrome={false}`, link-in-bio
style), so visitors who arrive via "Links" have only the "sanfor2004.com"
button to go back.

## 2026-10-06 — Logo on /links/

**Done:** `links.astro` shows `assets/brand/logo.svg` above the name
(`h-14 w-auto self-start` = 83×56, true 56:38 ratio; `self-start` stops the
flex column from stretching it). `alt=""` because the name below names it. It
replaces the placeholder comment, whose suggested `size-22` would have squashed
the non-square mark. Logo is now in both places; removed from AGENTS.md open
placeholders. Verified: `npm run verify` clean; loads at 1440 and 375, ratio
1.47, no horizontal scroll. Screenshots in `.playwright-mcp/links-logo/`.

## 2026-10-06 — Painted self-portrait on /about/ and the article author card

**Done:**
- Owner saved `public/images/ahmed-self-portrait.png` (806×1003, painted).
  Made `ahmed-self-portrait.webp` (same size, 1.2 MB → 108 KB) and
  `ahmed-self-portrait-avatar.webp` (128px face crop) beside it; the PNG is
  untouched (hash checked).
- `site.ts` `portrait` now points to the self-portrait (new alt text, size,
  and a `fig` caption "Fig. — Self-portrait"). `/about/` reads the caption
  from it. Article author cards pick up the new avatar automatically.
- The old photo (`ahmed-abdelaziz.png/.webp/-avatar.webp`) is kept as the old
  version, unused.
**Verified:** `npm run verify` clean; 0 broken images across 443 asset refs
(the only 2 missing are the known `/cv.pdf` and `/rss.xml`); no horizontal
scroll at 1440 or 375; the whole painting is visible on phone. Screenshots in
`.playwright-mcp/self-portrait/`.

## 2026-10-06 — GradientBand a little stronger

**Done:** `GradientBand.astro` colour mix raised: peach 70% → 85%, primary
22% → 32%. Same size, motion and mask. Verified: `npm run verify` clean.
Worst contrast over the moving band: eyebrow 5.42, h1 ≥13.7, para ≥6.24,
button ≥11.6 (1440 and 375). Reduced motion still holds the gradient still.
**Waiting on:** owner's new painted self-portrait (shared in chat, not on
disk yet). Plan: save to `public/images/`, make a WebP copy, use it on
/about/ (caption "Fig. — Self-portrait") and as the article author crop;
original `ahmed-abdelaziz.png` stays as the old version.

## 2026-10-06 — Side Rays removed → our own GradientBand (supersedes the 2 Side Rays entries below)

**Why:** owner saw the rays as not reading like rays. Option C (React Bits
defaults on paper) also pushed the hero label to 2.4:1 and the paragraph to
3.9:1. Owner asked to remove the rays and build a light, animated bottom
gradient as a site component instead.
**Removed:** `islands/SideRays.jsx`, `SideRays.css`, `HeroRays.tsx` (never
committed); `ogl`; the corner-mask CSS in `Hero.astro`; the temporary
`tone="ink"` on Eyebrow (reverted to its exact previous code). Hero label and
paragraph are back to muted / graphite.
**Added:** `src/components/ui/GradientBand.astro`: decorative layer
(`aria-hidden`, `pointer-events-none`, `absolute inset-x-0 bottom-0 -z-10
h-1/2`). Horizontal peach ↔ faint-primary ramp (`color-mix` on tokens),
200% wide, drifting 18s ease-in-out alternate; upward mask fade; animation
off under reduced motion (gradient stays). The parent needs `relative
isolate`. Used once: the hero's left column.
**Verified:** `npm run verify` clean (36 files); nothing left referencing the
rays. At 1440 and 375: band present (bottom half), animating, no console
errors. Worst-case contrast over 6 frames: eyebrow 5.42, h1 ≥14.0, para
≥6.54, button ≥12.5. Reduced motion: animation none, gradient still drawn.
Screenshots are in `.playwright-mcp/gradient-band/`.

## 2026-10-06 — Side Rays: longer and a little faster

**Done:** `HeroRays.tsx`: speed 1.2 → 1.6, intensity 1.6 → 2.0, falloff
3.2 → 2.6 (the beams carry further). `Hero.astro` mask made taller along the
ray direction: desktop 70%×60% → 75%×95%, phones 40%×25% → 40%×55%. Widths
barely changed, to protect the small eyebrow label at top-left.
**Verified:** `npm run verify` clean. Worst-case contrast over 12 animation
frames: desktop eyebrow 4.97 / h1 11.2 / para 6.86 / button 14.9; phone
eyebrow **4.56** / h1 12.1 / para 7.32 / button 14.9. The phone eyebrow is now
close to the 4.5 limit, so any further increase in length/intensity needs
re-measuring (script pattern: hide text, sample the live canvas behind each
text line).

## 2026-10-06 — Side Rays corner glow in the hero

**Done:**
- `ogl` reinstalled. `src/components/islands/SideRays.jsx` + `SideRays.css` =
  React Bits source verbatim (header comment only).
  `HeroRays.tsx` = settings: colours from tokens (primary + peach),
  origin top-right, speed 1.2, intensity 1.6, blend 0.4, falloff 3.2, opacity
  0.55. Renders nothing under reduced motion.
- `Hero.astro`: left column `relative isolate`; rays layer `absolute inset-0
  -z-10`, `client:idle` (an SSR-empty island never fires `client:visible`);
  radial mask keeps the glow in the top-right corner (70%×60%, phones 40%×25%).
**Why the mask:** tested 6 variants at hero size (`.playwright-mcp/side-rays/`).
On paper, the full effect lays a grey-brown veil over the column. Owner picked
the corner glow. Unmasked, it dropped the small eyebrow label to 3.0:1 on
phones.
**Verified:** `npm run verify` clean. Worst-case contrast over the live rays
(text line boxes only): desktop eyebrow 5.22 / h1 12.7 / para 7.32 / button
14.9; phone eyebrow 4.91 / h1 14.9 / para 7.32 / button 14.9. Animates;
reduced motion = no canvas. WebGL1 shader (wider support than the removed
waves' WebGL2), but not tested in Firefox: Playwright's Firefox isn't installed.

## 2026-10-06 — Owner's own favicon.svg → favicon.ico

**Done:** the owner replaced `public/favicon.svg` with their own design (orange
rounded square, white logo, 68×68). Converted it as-is into
`public/favicon.ico` (PNG-in-ICO, 16/32/48px, transparent rounded corners
kept). `favicon.svg` itself is untouched. Head links unchanged (ico + svg).
Verified: `npm run verify` clean; built .ico matches and decodes (48×48).
Preview in `.playwright-mcp/favicon/user-ico-preview.png`.
**Open:** `apple-touch-icon.png` is still the earlier ink/orange version. It
should be regenerated from the new design so iPhone home screens match.

## 2026-10-06 — Favicon from the logo

**Done:** replaced the generic wave favicon with the logo mark (orange on an
ink square, square corners per the design rules):
- `public/favicon.svg`: modern browsers. Logo paths from `assets/brand/logo.svg`,
  stroke thickened 3 → 4.5 so it survives 16px (compared 3 / 4 / 4.5 / 5 at true
  16px and 32px; 4.5 was clearest).
- `public/favicon.ico`: PNG-in-ICO with 16, 32 and 48px images, for older
  browsers, Windows and search results.
- `public/apple-touch-icon.png`: 180px home-screen icon, finer stroke (3.5)
  and more padding because iOS rounds the corners.
- `BaseLayout.astro` `<head>`: ico (`sizes="32x32"`) + svg + apple-touch-icon.
**Verified:** `npm run verify` clean; all three served 200 with correct types;
.ico and .png decode in Chromium; SVG renders in `<img>`. Contact sheet in
`.playwright-mcp/favicon/`. Old favicon is still in git history.

## 2026-10-06 — Logo in the navbar

**Done:** `Navbar.astro` shows `public/assets/brand/logo.svg` (the orange mark)
before "Sanfor2004": `h-7` (41×28), `gap-3`, and width/height attrs to prevent
layout shift. `alt=""` because the link text already names it. Verified at 1440
and 375: loads, vertically centred, screen-reader name stays "Sanfor2004",
keyboard focus ring wraps logo and name, no horizontal scroll. Screenshots are
in `.playwright-mcp/navbar-logo/`.
**Next:** the same logo on `/links/` (placeholder comment still there).

## 2026-10-06 — Gradient Waves removed entirely (supersedes the two entries below)

**Why:** owner saw only a flat gradient in Firefox. On a light page the effect
only reads as a soft haze anyway.
**Removed:** `src/components/islands/GradientWaves.jsx`, `GradientWaves.css`,
`HeroWaves.tsx` (never committed, so they're not in git history; the original
source is on React Bits); the `ogl` dependency; the `--color-ember` token
(waves-only); the dark ink panel; the `surface="ink"` option on Button and
Eyebrow (reverted to their exact previous code). `--color-peach` stays: it's
used by the highlighter mark and text selection.
**Hero now:** plain paper again, same layout and copy. The old `<style>` block
was reduced to `shrink` on the text column.
**AGENTS.md:** motion rule no longer lists Gradient Waves; the Gradient Waves
rule is deleted (the "STOP and ask" rule is now #9); file map and decisions
log updated.
**Verified:** `npm run verify` clean (35 files); no references left in `src/`;
Chromium at 1440 and 375: no canvas, no console errors, no horizontal
scroll. Playwright's Firefox isn't installed; the hero is now plain HTML/CSS.
Screenshots: `.playwright-mcp/hero-waves/removed-chromium-*.png`.

## 2026-10-06 — Hero waves restyled to match the React Bits demo (dark panel)

**Finding:** the component was already the exact React Bits source. The demo's
layered-hills look comes from its **dark background**: the waves fade to
transparent with distance, so on light paper even the demo's own colours turn
into a soft haze. I verified this with a side-by-side render of 4 cases (demo
vs brand colours, dark vs paper), in `.playwright-mcp/hero-waves/cases.png`.
**Owner decision:** dark left panel.
**Changes:**
- `Hero.astro`: left column `bg-ink text-paper`; waves fill the whole column
  on desktop and phone (the old top mask and the phone-only band are gone);
  paragraph `text-paper-deep`; paper focus ring inside the panel; still ember
  glow for reduced motion only.
- `HeroWaves.tsx`: demo default wave shape; colours read from tokens at
  runtime (primary → ember → peach); zoom 0.7 and brightness 0.85 (see the
  AGENTS.md decision).
- `Button.astro`: new `surface="ink"` option (primary hovers to paper; outline
  = paper border on a solid ink fill). `Eyebrow.astro`: `surface="ink"` →
  `text-paper-deep`. Defaults unchanged everywhere else.
**Verified:** `npm run verify` clean. Worst-case WCAG contrast measured
against the live waves at 1440 and 375: eyebrow 12.6, h1 ≥7.6, paragraph
≥4.81, buttons ≥14.9. Keyboard focus ring is paper on both buttons. Reduced
motion: no canvas, still glow.
**Open:** mouse parallax is still inert (`pointer-events-none` on the waves).

## 2026-10-06 — Hero Gradient Waves actually render now

**Bug:** the React Bits Gradient Waves (already installed, identical to the
current React Bits source) never appeared. `HeroWaves` renders nothing on the
server, since it checks `prefers-reduced-motion` in the browser first. That left
an empty `<astro-island>`, and `client:visible` watches the island's children,
so with none it never hydrated. On phone, the 220px band was also anchored to
the bottom of the whole hero, which is behind the painting, so it was fully
covered.
**Fix (Hero.astro only):** `client:visible` → `client:idle`. The waves layer
moved inside the left text column (`relative isolate`, waves `-z-10`), so it
sits behind the headline and buttons only. Desktop: fills the left column with
the existing top fade. Phone: band behind the buttons at the bottom of the
first screen. `GradientWaves.jsx` untouched; settings still in
`HeroWaves.tsx`; reduced motion still gets the still peach haze.
Measured: canvas present and animating at 1440 and 375. Screenshots are in
`.playwright-mcp/hero-waves/`.

**Open:** the waves wrapper is `pointer-events-none`, so the mouse parallax
(`mouseInteraction` on desktop) can never trigger. Either drop that prop or
listen on the column. Owner's call.

## 2026-10-06 — Home Story: bottom line under the painting caption

**Bug:** on the home page (≥768px), the footer's top line showed under the left
column but not under the painting's caption ("Fig. 05 — Yours to keep").
**Cause:** `.story-art` keeps the phone layout's `z-index: 20` on desktop. As a
flex item, it still forms a stacking layer even when `position: static`, so the
painting column was drawn over the footer's overlapping top line.
**Fix:** `Story.astro` resets it to `z-index: auto` in the ≥768px media query.
`Footer.astro` is now `relative`, so it paints above sticky content. Measured at
1440, 1024 and 375: the footer sits on its top line under both columns, and the
navbar still stays above the painting mid-scroll. Screenshots are in
`.playwright-mcp/story-caption/`.

## 2026-10-06 — Footer top and bottom borders

**Done:** `Footer.astro` now has `border-y border-line`, plus `-mt-px` so its
top line sits on top of whatever line the section above ends with. The result
is one 1px line on every page, never a doubled 2px one. Measured on 6 pages at
1440 and 375: top and bottom are both 1px `line` color, with a 1px overlap. The
home page and `/links/` gain a top line they didn't have before. The bottom line
closes off the page frame. Screenshots are in `.playwright-mcp/footer-borders/`.

## 2026-10-06 — Gallery artworks and portrait wired in

**Done:**
- `/art/`: all 14 gallery pieces replace the 9 placeholders. Order, titles
  and alt text are copied verbatim from the live site's (`main`) art page.
  Data lives in `artworks` in `src/data/site.ts`.
- `/about/`: the portrait photo replaces the placeholder (same image pattern as
  the Hero). Caption changed from "Self-portrait" to "Portrait", because it's a
  photo, not a painting. Alt text is from the live site.
- Article author card: a 128px square face-crop avatar replaces the `[PHOTO]`
  placeholder.
- Web-sized WebP copies sit beside each original (long edge ≤1200px):
  ~30 MB of PNG/JPG → ~650 KB. The originals were not moved or touched, so their
  live URLs still work. The copies were encoded with the project's Playwright
  Chromium, so no new dependency was added.
- Verified: `npm run verify` clean; 0 broken images; no horizontal scroll;
  screenshots at 1440 and 375 in `.playwright-mcp/images-wiring/`.

**Open:**
- Captions show the title only; medium and year aren't known yet.
- The live alt text for "Tiger / line study" says "tiger head", but the drawing
  shows the whole crouching animal. Worth correcting.
- `images/art/Horse_Far_View.png` (used by the old site's hero) is still
  unused.

## 2026-10-06 — Image path audit

**Done:**
- Audited every image reference in `src/` and in the built `dist/` (314 asset
  refs): no broken image paths on any page.
- Restored `public/images/projects-sky-dither.webp` (deleted on this branch but
  served on the live site from `main`). Every image URL the live site serves
  still exists in the new build. Nothing was moved or deleted.
- Restored the cover image fields (`image`, `imageAlt`, `imageWidth`,
  `imageHeight`) on all 32 articles. The blog→articles migration had dropped
  them. Copied verbatim from the original posts; added as optional fields to the
  `articles` schema. Each article now uses its cover as `og:image`, except the
  one SVG cover (background-job pipeline), which falls back to the site
  default. Covers are not rendered on the article page (that's a design
  decision).
- Logo hint comments in `Navbar.astro` / `links.astro` pointed to a
  non-existent `/images/logo.svg`; now `/assets/brand/logo.svg`.
- `_template.md` documents the optional cover fields.

**Open (needs owner decision, nothing deleted):**
- Byte-identical duplicates: `hero-art.webp` + `story-1…4-*.webp` duplicate
  `fig-01…05-*.webp` (untracked, unused); `images/learning/patterns/*` duplicates
  `images/writing/patterns/*` (on the live site, unused by the new code).
- Unused on the new site: `images/art/gallery/*` (14 artworks; `/art/` still
  shows placeholders), `images/ahmed-abdelaziz.png` (`/about/` portrait is a
  placeholder), `og/default.png`, `assets/brand/social-card.png`.
- The default `og:image` is a WebP. Some platforms (notably LinkedIn) handle
  PNG/JPG more reliably.

## 2026-10-05 — Repo consolidation: sanfor2004.com/ merged into root

**What happened:** The repo had two parallel, fully-separate Astro projects —
the tracked root (an Ink/Ember dark redesign, barely started: just a nav bar
and an empty homepage) and an untracked `sanfor2004.com/` subfolder (a
further-along "warm paper / black ink / one orange" site with a real Hero,
Stats, Story, service/process sections, and working article/project pages).
The immediate ask was "add the GradientWaves background to the Hero instead
of a static gradient" — in the course of doing that the second project was
discovered, and the user chose to make it the real site.

**Done:**
- Archived every Ink/Ember-only file (components, styles, docs, the old
  `AGENTS.md`/`site.ts`, the ui-kit pages) into `legacy-ink-ember/` at the repo
  root, rather than deleting — nothing here is published, but it's kept for
  reference. `tsconfig.json` excludes it.
- Copied `sanfor2004.com/`'s entire `src/`, `public/`, `astro.config.mjs`,
  `package.json`, `tsconfig.json`, `AGENTS.md`, `README.md`,
  `.github/workflows/deploy.yml`, and `scripts/check-tokens.mjs` up to the
  repo root, then deleted the now-empty subfolder.
- Preserved everything root-only that didn't collide: `public/CNAME`,
  `robots.txt`, `BingSiteAuth.xml`, Google site-verification file, `og/`,
  `audio/`, the portrait photo, `.env.example`, and `src/content/projects/`
  (7 real project write-ups — `sanfor2004.com` had no projects collection at
  all, just a curated `src/data/projects.ts` list + one bespoke page,
  `skylimit.astro`).
- **Migrated all 32 real posts** from `src/content/blog/` (old schema:
  `category`/`pubDate`/image fields) into `src/content/articles/` (the
  schema `sanfor2004.com`'s `/articles/` pages actually query: `topic`/
  `date`, no images). Extended the `topic` enum in `content.config.ts` from
  4 values to 8 (`Backend`, `Automation`, `Design Patterns`, `Systems`, plus
  `C++`, `AI Engineering`, `Learning`, `Project Engineering` — the 4 real
  categories in use that didn't fit the original 4) so every post kept its
  real category verbatim, nothing relabeled or dropped. `featured` defaults
  to `false` on all 32 — nobody is flagged as the homepage's featured post
  yet, that's an editorial call for later.
- Fixed a real cross-platform bug in `scripts/check-tokens.mjs`: it built its
  root path with `new URL(...).pathname`, which leaves a stray leading slash
  before the drive letter on Windows (`/C:/...`) and crashed outright. Now
  uses `fileURLToPath`.
- Reinstalled dependencies against the merged `package.json` (dropped the
  unused Radix/gsap/daisyUI/motion stack that only the archived Ink/Ember
  kit used; kept `ogl` for GradientWaves, added `playwright` as a
  devDependency for the screenshot-verification workflow).
- Verified: `astro check` (0 errors), `node scripts/check-tokens.mjs` (0
  violations across 38 files), `astro build` (41 pages, all 32 articles plus
  the 2 project pages), and the Hero rendering correctly with no console
  errors at both 1440px and 375px.

**Known gaps, not done this session:**
- `src/content/projects/` (7 markdown write-ups) exists as a real content
  collection now, but nothing in `sanfor2004.com`'s architecture renders
  individual entries from it — the live `/projects/` pages are the hand-built
  `index.astro` (reading `src/data/projects.ts`) plus one bespoke page,
  `skylimit.astro`. The other 9 projects in that list have no detail page.
  Building those (or wiring the collection into a dynamic route) is real,
  separate design work.
- `.github/workflows/deploy.yml` is now `sanfor2004.com`'s simpler version
  (`withastro/action`) — it no longer runs the old `verify:patterns` script
  (written for the old blog schema, now archived in `legacy-ink-ember/`) or
  passes the `PUBLIC_GA_MEASUREMENT_ID` / site-verification env vars. If
  analytics/verification still matter, that needs re-wiring.
- No redirects from the 32 posts' old blog URLs to their new `/articles/...`
  URLs — `src/data/design-pattern-series.mjs` (the old redirect map) is
  archived, not ported.
- `src/content/articles/` drafts: none flagged `draft: true` by the
  migration (all carried over their original `draft` value verbatim) and
  none flagged `featured: true` — worth a pass to pick a homepage feature.
- Two pre-existing `astro check` warnings (unused `Props` interfaces in
  `Eyebrow.astro`/`Placeholder.astro`) weren't touched — cosmetic, not mine
  to fix unprompted this session.

## Next

- Decide what happens to `legacy-ink-ember/` long-term (keep as reference,
  or delete once confident nothing's needed from it).
- Build detail pages for the other 9 projects, or decide they don't need
  one.
- Re-wire CI (pattern verification equivalent if still wanted, GA/site
  verification env vars) if those matter going forward.
- Pick a featured article; review the 4 newly-added `topic` values with the
  site owner in case any should fold into an existing one instead.
