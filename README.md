# Sanfor

Portfolio, technical blog, and art archive for **Ahmed Abdelaziz Hanafy** — systems and
backend engineering, Linux, networking, performance.

Live at **[sanfor2004.com](https://sanfor2004.com)**. Astro static site, deployed to
GitHub Pages.

## Quick start

```bash
npm ci
npm run dev        # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (drafts stay hidden) |
| `npm run lint` | `astro check` diagnostics |
| `npm run build` | Diagnostics, then static output to `dist/` |
| `npm run preview` | Serve the build |
| `npm run verify:patterns` | Check the 24-post design-pattern series |

## Layout

```
AGENTS.md                  # the only manual — read it first
src/styles.css             # design tokens; the whole palette lives at the top
src/components/ui/         # shadcn/ui-pattern kit on Radix
src/components/bits/       # React Bits motion + the duotone art layer
src/pages/ui-kit.astro     # /ui-kit — every component on one page
src/content/               # blog + project Markdown
```

## Design system

Cream ground, deep navy-black ink, orange as the single accent. Inter for UI,
JetBrains Mono for anything countable, Instrument Serif for one italic phrase per
headline. Light and dark themes share the same orange.

Two rules worth knowing before you touch anything:

1. **Tokens only.** No hard-coded colours, sizes, radii or durations. Repointing the
   `:root` block in `src/styles.css` repalettes the entire site.
2. **Check `/ui-kit`.** If a component isn't on that page, it isn't finished.

Everything else — architecture, content schema, the pattern series, SEO, deploy
discipline — is in **[AGENTS.md](AGENTS.md)**. There is no `docs/` tree.
