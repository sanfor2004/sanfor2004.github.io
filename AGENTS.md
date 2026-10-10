# AGENTS.md — rules for Claude Code on sanfor2004.com

Read this whole file before every task. It is the single source of truth.

## About the owner (as of 2026-10-10)
- **Ahmed Abdelaziz Hanafy**, known as **Sanfor** (handle `sanfor2004`). Alexandria, Egypt.
- Positioning everywhere: "Product-Minded Software Engineer (Backend, APIs & Automation)". Site tagline: "Backend & automation engineer".
- Goal: freelance clients now; own startup (Zomzam) later.
- Booking: https://cal.com/sanfor2004/free-call (Cal.com) everywhere. Calendly is retired: never use calendly.com.
- Email: contact@sanfor2004.com (business, the only one on the site). Personal 2004.sanfor@gmail.com stays off the site.
- Proof points, never inflate: at Skylimit LLC (2022 – 2026) built a lead-gen/loan platform from scratch: 5.4M+ leads, 53,000+ orders, $1.35M+ payments processed; Twilio/Plivo/Stripe handling 339,000+ messages and calls a month.
- Profiles: LinkedIn linkedin.com/in/sanfor2004 · GitHub github.com/sanfor2004 · Upwork upwork.com/freelancers/~0108502d49f0acdd84 · Contra contra.com/sanfor2004 · X x.com/Sanfor2004_ · Instagram instagram.com/sanfor2004.official · DEV dev.to/sanfor2004 · Medium medium.com/@Sanfor2004. Facebook, Twitch and Kick stay off /links/ unless the owner says otherwise.
- Updated to this positioning (2026-10-10): GitHub README, LinkedIn (About, Featured with the Cal card, Skylimit fix), Upwork (title, overview, skills, $30/h), Medium (About), Contra (headline, bio). Contra social links don't save after reload (likely their bug).
- Platform rules: Upwork profile has no contact info or off-platform links (Upwork bans them); Contra headline max 60 chars.
- Still to audit: Wellfound, Product Hunt, Indie Hackers, Stack Overflow, TryHackMe, NeetCode (rename from CoolPikachu138), YouTube, Behance, Dribbble, Twitch, Kick, X, Instagram, Threads, Facebook, Bluesky, Reddit, DEV.

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
src/data/case-studies.ts       client case studies (CaseStudy objects; empty fields = hidden blocks)
src/data/articles.ts           reading time + date helpers
src/content/articles/*.md      articles (files starting with _ are ignored; _template.md)
src/layouts/BaseLayout.astro   head/SEO, Cal.com loader, frame, navbar, CTA band, footer, mobile sticky CTA
src/components/ui/             primitives
src/components/layout/         Navbar, Footer, CtaBand, StickyCta, CalBooking, Analytics
src/components/sections/       Hero, Stats, Story, ServiceRow, Step, CaseStudy
src/components/islands/        React: DecryptedWord
src/pages/                     index, about, projects/, projects/skylimit, articles/, articles/[...slug], art, contact, links, 404
public/images/                 fig-01 … fig-05 paintings (WebP)
```

## FROZEN components
(Add a component here once Ahmed approves it. Example: `- Button — frozen 2026-10-05`)

## Open placeholders
None. Owner decided (2026-10-08) that case-study screenshots/quotes and art medium/year aren't needed.
Search the repo for `<Placeholder`, `TODO` before adding new ones. Draft articles (`draft: true`) are listed in docs/status.md.

## Decisions log
- 2026-10: Light mode "Paper & Ink"; Astro + Tailwind v4 + React islands; GitHub Pages with custom domain sanfor2004.com (no base path).
- 2026-10: Home = hero, stats, scroll story with 4 paintings (sticky right column on desktop, pinned strip on phone), story ends on its own CTA.
- 2026-10: Contrast fixes: muted #5e5a52, primary-text #a33a08.
- 2026-10-06: **Gradient Waves removed** from the hero (with `ogl`, the `ember` token, and the dark-panel experiment). On a light page the effect only reads as a soft haze; it needs a dark ground to show its layered hills, and in Firefox it showed as a flat gradient. Hero is plain paper again.
- 2026-10-06: **Launched from `main`** (the only branch; GitHub Pages deploys on push to main). Old live-site URLs (/blog, /learning/patterns, /tags, old /projects/<slug>) redirect via `src/data/redirects.mjs`, a snapshot that never needs new entries. RSS at /rss.xml; sitemap via @astrojs/sitemap.
- 2026-10-07: **Newsletter signup removed** (Subscribe section on /articles/ and every article): no email service behind it, so the form did nothing. Readers can follow via RSS (/rss.xml). Add a section back only together with a real provider.
- 2026-10-08: **Article share images**: og:image uses a 1200px JPG (or PNG for SVG covers) saved next to each cover; pages keep the WebP. New covers: add `<name>.jpg` beside `<name>.webp` or the share image falls back to the WebP. Job-pipeline article moved Systems → Backend so the Backend filter shows.
- 2026-10-08: **Case study template** (`sections/CaseStudy.astro` + `data/case-studies.ts`). One page file per client study (`pages/projects/<slug>.astro`), no dynamic route over `content/projects/`; open source stays as list rows → GitHub. Empty blocks are hidden and the section numbers close up, so no placeholder text ships.
- 2026-10-08: **GA4 re-wired** (`G-7B8D7CCSRQ`, the old site's property; `site.gaId`, not an env var). `layout/Analytics.astro`, production builds only. **No consent banner** (owner's decision, same as the old site; not GDPR-compliant for EU/UK visitors). Events: `book_call_click` and `book_call_booked`, param `cta_location` = the link's `data-cta` (`Button cta="..."`). Every new booking link must get a `cta` label.
- 2026-10-08: **Calendly → Cal.com** (`site.bookCall` = cal.com/sanfor2004/free-call). `layout/CalBooking.astro` loads the embed on every page, themes it from our tokens at runtime (paper, ink, orange fill with ink text, hairlines, radius 0) and opens every link to `site.bookCall` as a popup (own click handler: Cal's `data-cal-link` didn't cancel `target=_blank`). /contact/ has the inline calendar; no sticky bar there. The popup's open/close animation and the "Cal.com" mark are Cal's, outside our motion/branding rules.
- 2026-10-08: **Contact form removed** (it posted to `#`). Web3Forms was wired and tested, then dropped by the owner. /contact/ = Cal.com inline calendar (primary) + direct links. Add a form back only together with a real endpoint. Public email is now contact@sanfor2004.com everywhere (`site.email`).
- 2026-10-06: React Bits **Side Rays** tried and removed (with `ogl`): like Gradient Waves, a light-on-dark WebGL effect that reads as a grey veil on paper. Replaced by our own **GradientBand** (`ui/GradientBand.astro`): light peach/orange linear gradient rising from the bottom of the hero's left column, slowly drifting sideways. Pure CSS, tokens only, still under reduced motion. Hero text stays muted/graphite (≥5.4:1 measured over it).
