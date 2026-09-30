# Decisions

One line per decision, dated. Newest first.

- **2026-09-30** — Type roles cut from five to three: Syne (display), Space Grotesk
  (UI/body/labels — absorbs the old Archivo Expanded short-text role), Sora (long
  reading). Archivo Expanded and JetBrains Mono dropped as brand voices; code/tabular
  numerals now use `--type-code`, a system monospace stack with no hosted font, since
  it's a functional requirement (alignment) rather than a 4th brand voice. Supersedes
  the "five type roles locked" entry below. `docs/design-system.md` is being written
  for the first time as part of this pivot — it never existed on any branch before.
- **2026-09-30** — Docs rewritten: `docs/design-system.md` is now the single source of
  truth for tokens/architecture/components; `docs/brand-guide.md` (renamed from
  `brand-foundation.md`) owns voice/naming/logo; `docs/ui-kit.md` deleted (documented
  deleted code); `AGENTS.md` §4 now points at both instead of embedding them.
- **2026-09-30** — Direction set for `docs/design-system.md`: Apple's calm (space,
  restraint, precise type, quiet surfaces) crossed with Google's boldness (confident
  color moments, clear hierarchy, purposeful motion). Dark-only, premium-studio feel.
- **2026-09-30** — `redesign` branch cleared to a blank slate: `legacy/` (old site),
  the just-built UI kit under `src/components/ui/`, and the `/ui-kit`/`/styleguide`
  showcase pages all removed. Rebuilding the component kit from scratch against the
  new spec rather than keeping the first pass — nothing lost, all recoverable from
  `main`.
- **2026-09-30** — Branch strategy: `main` stays the live site, untouched, until the
  redesign is ready to merge; all redesign work happens on `redesign`; never push to
  `main` or deploy without explicit sign-off.
- **2026-09-30** — Ink/Ember palette locked as the only brand colors: Ink
  (`#0A0E17`/`#1B2438`/`#7C8AA8`/`#EEF1F7`/`#EE5712`) runs the whole site; Ember
  (`#EE5712`→`#120805`, paper `#FFF3EA`) is reserved for the hero and rare
  high-emphasis moments only.
- **2026-09-30** — Five type roles locked, each self-hosted via Fontsource (no Google
  Fonts CDN): Syne (wordmark/display/h1–h2), Space Grotesk (UI/body), Archivo Expanded
  at wdth 125 (strong short text, h3–h4, stats), Sora (long reading), JetBrains Mono
  (labels/numbers).
- **2026-09-30** — Site is dark only: no light theme, no `prefers-color-scheme`
  branch, no toggle. Supersedes the old site's light-default warm-paper theme.
