# Status

## 2026-09-30 — Clean slate for the redesign

**Done:**
- Removed `legacy/` (old site, archived — still recoverable from `main`), the
  UI kit under `src/components/ui/` + `kit-docs/`, the `/ui-kit` and
  `/styleguide` showcase pages, and dead/unreferenced files (`analytics.ts`,
  `music.ts`, `debug.log`).
- Removed the completed marketing campaign package (`Markting/`,
  `social_media_launch_framework.md`, `scripts/render-social-card.mjs`,
  `scripts/verify-site.mjs`) — all recoverable from `main` if needed later.
- Kept: `public/**`, content collections (`src/content/**`), the brand
  foundation (`src/styles/tokens.css`, `global.css`, `prose.css` — Ink/Ember
  palette, Syne/Space Grotesk/Sora/JetBrains Mono fonts), `src/site.ts`,
  `src/lib/{seo,sitemap,cn}.ts`, project config, and `docs/`.
- Fixed `src/styles/global.css` to drop the two `@import` lines and the
  `@source not` rule that pointed at now-deleted paths.
- Replaced the homepage with a minimal "Sanfor — redesign in progress"
  placeholder styled with the brand foundation. Build + `astro check` pass
  clean; verified visually at 1440px and 375px.
- All work is on `redesign`, pushed to `origin/redesign`. `main` is untouched.

**Flagged as outdated (not yet cleaned up):**
- `README.md` — describes the old file structure and palette, points at
  deleted pages.
- `docs/ui-kit.md` — documents the now-deleted UI kit.
- `docs/brand-foundation.md` — tokens/fonts still accurate, but links to the
  deleted `/styleguide/` page and `ui-kit.md`.
- `AGENTS.md` §4 (visual identity) — superseded by the Ink/Ember foundation
  per `docs/brand-foundation.md`.
- `public/assets/brand/social-card.README.md` and `AGENTS.md`'s `Markting/`
  references — now point at deleted files/folders.

## Next

- Doc cleanup pass: rewrite `README.md`, retire/rewrite `docs/ui-kit.md`,
  update `docs/brand-foundation.md` and `AGENTS.md` §4 to drop dead links.
- Start building the fresh component system in `src/components/` (currently
  empty).
- Rebuild real pages (about, projects, blog, contact, art) on top of the new
  foundation — all archived in `legacy/` on `main` for reference.
