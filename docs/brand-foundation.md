# Brand foundation — 2026 redesign

The colour and type foundation for the redesigned site. This file is the reference
for token names, font roles, and the Tailwind class names that expose them.

Established 2026-09-30 on branch `redesign/foundation`. Supersedes §4.2 (Palette) and
§4.3 (Typography) of `AGENTS.md`, which describe the pre-2026 warm-paper daisyUI
identity now archived in `legacy/`.

| Concern | File |
|---|---|
| Raw token values | `src/styles/tokens.css` |
| Tailwind mapping, base styles, utilities | `src/styles/global.css` |
| Live preview | `/styleguide/` (`src/pages/styleguide.astro`) |
| **Components built on this** | **[`ui-kit.md`](./ui-kit.md)** — the component library, its own tokens (surfaces, radii, shadows, motion, z-index, containers, type scale) and the `/ui-kit/` showcase |
| Archived old identity | `legacy/src/styles.css` |

> **The kit extends these tokens.** `tokens.css` now also carries the UI-kit layer:
> surfaces, borders, shadows, motion, z-index and section rhythm, plus two
> accessibility variants — `--steel-text` and `--signal-text`. The brand values
> `--steel` and `--signal` below are unchanged and remain correct for fills,
> borders, focus rings and the logo; the `-text` variants are for `color:` only,
> because the brand values fall just under WCAG AA as small text on a raised
> surface. See [`ui-kit.md` §2](./ui-kit.md#2-tokens).

---

## 1. Rules

1. **Tokens are the only source of colour.** Components use the Tailwind utilities
   below. Do not write hex literals, and do not use `var(--ink)` directly in a
   component when `bg-ink` will do.
2. **The site is dark only.** There is no light theme, no `prefers-color-scheme`
   branch, and no theme toggle. `color-scheme: dark` is declared once on `:root`.
3. **Ember is hero-only.** Everything outside the hero is Ink.
4. **daisyUI is not used.** The dependency stays installed for the archived UI, but
   no daisyUI plugin or theme is loaded by `global.css`. Do not use `base-100`,
   `primary`, or any other daisyUI semantic colour in new work.
5. **Pick type by role, not by family.** Use `font-read` because the text is long,
   not because you want Sora.

---

## 2. Colour

### Ink — site-wide

| Role | Token | Hex | Tailwind |
|---|---|---|---|
| Base background | `--ink` | `#0A0E17` | `bg-ink` |
| Surfaces, cards | `--silk` | `#1B2438` | `bg-silk` |
| Secondary text, borders, guides | `--steel` | `#7C8AA8` | `text-steel`, `border-steel` |
| Main text | `--frost` | `#EEF1F7` | `text-frost` |
| Primary accent, links, CTA | `--signal` | `#EE5712` | `text-signal`, `bg-signal` |

### Ember — hero only

| Role | Token | Hex | Tailwind |
|---|---|---|---|
| Hero core | `--ember-primary` | `#EE5712` | `bg-ember-primary` |
| Hero highlight | `--ember-glow` | `#FF8A3D` | `bg-ember-glow` |
| Hero midtone | `--ember-burnt` | `#C43A08` | `bg-ember-burnt` |
| Hero shadow | `--ember-deep` | `#5A1603` | `bg-ember-deep` |
| Hero edge | `--ember-night` | `#120805` | `bg-ember-night` |
| Text on Ember | `--ember-paper` | `#FFF3EA` | `text-ember-paper` |

`--frost` reads cold against Ember. Use `--ember-paper` for any text sitting on an
Ember surface.

Every colour utility accepts Tailwind's opacity modifier — `border-steel/25`,
`text-ember-paper/70` — because the `@theme` entries are real colour values.

---

## 3. Type

All five families are self-hosted through Fontsource. **No Google Fonts CDN**, no
external font requests: 27 `.woff2` files are emitted into the build.

| Role | Family | Tailwind | Package | Use for |
|---|---|---|---|---|
| Display | Syne Variable | `font-display` | `@fontsource-variable/syne` | The SANFOR wordmark and big headings |
| Sans | Space Grotesk | `font-sans` | `@fontsource/space-grotesk` | General UI and body text — the default on `<body>` |
| Expanded | Archivo Variable @ wdth 125 | `font-expanded` | `@fontsource-variable/archivo` | Strong, important **short** text |
| Read | Sora | `font-read` | `@fontsource/sora` | Long, clean readable text blocks only |
| Mono | JetBrains Mono | `font-mono` | `@fontsource/jetbrains-mono` | Labels, numbers, small-caps tags |

### Weights loaded

| Family | Axes / weights | Imported |
|---|---|---|
| Syne | variable `wght` 400–800 | `@fontsource-variable/syne/wght.css` |
| Space Grotesk | static 400, 500, 700 | three per-weight files |
| Archivo | variable `wdth` 62–125 + `wght` 100–900 | `@fontsource-variable/archivo/wdth.css` |
| Sora | static 400, 600 | two per-weight files |
| JetBrains Mono | static 400, 500 | two per-weight files |

Add a weight by importing its file in `global.css`. Do not reference a weight that
is not loaded — the browser will synthesise it and the result is visibly wrong.

### "Archivo Expanded"

Archivo's width axis runs **62–125**, so 125 is its widest real setting — the
requested ~125% is exactly the axis maximum, and no fallback was needed.

The width is attached to the font role itself, via a Tailwind theme sub-property:

```css
--font-expanded: var(--type-expanded);
--font-expanded--font-variation-settings: "wdth" 125;
```

So `class="font-expanded"` emits both the family and `font-variation-settings:
"wdth" 125`. **A component never sets the width separately.** This is applied as
`font-variation-settings` rather than `font-stretch` so the axis is hit exactly;
because only `wdth` is named, `font-weight` still controls the `wght` axis normally.

Verified in a real browser: `.font-expanded` computes to
`font-family: "Archivo Variable"` with `font-variation-settings: "wdth" 125`.

### Token naming

Raw type tokens in `tokens.css` are named `--type-*`, not `--font-*`, because
Tailwind 4's `@theme` writes its own `--font-*` variables into `:root`. Naming both
the same would produce a circular `var()` reference and silently break the stack.

---

## 4. Utilities

### `grain` / `grain-strong`

A static SVG `feTurbulence` film, inlined as a data URI — no network request, no
image asset. Painted on a `::after` pseudo-element at `mix-blend-mode: overlay`.

| Class | Opacity | Use |
|---|---|---|
| `grain` | `0.055` | Default. Flat surfaces, full pages. |
| `grain-strong` | `0.11` | Hero surfaces, where a broad gradient would otherwise band. |

Both set `position: relative` and `isolation: isolate` on the host. The overlay sits
at `z-index: 1`, so **content that must stay above it needs its own stacking
context** — add `relative z-10` to the inner wrapper:

```html
<div class="ember-field grain-strong">
  <div class="relative z-10">…</div>
</div>
```

The texture is static, so there is nothing for reduced-motion to switch off.

### `ember-field`

The hero's Ember gradient — a bottom-anchored radial running glow → primary → burnt
→ deep → night. It lives in `global.css` rather than in a component so the hero and
the styleguide cannot drift apart. Pair it with `grain-strong` and
`text-ember-paper`.

---

## 5. Build wiring

- `src/layouts/BaseLayout.astro` imports `global.css`; it is the only entry point.
- `global.css` imports Tailwind, then the fonts, then `tokens.css`, then declares
  `@theme`. Order matters.
- `@source not "../../legacy";` in `global.css` keeps Tailwind from scanning the
  archived UI, so old class names never reach the new stylesheet.
- `tsconfig.json` excludes `legacy`, so `astro check` skips it.
- `/styleguide/` is excluded from the sitemap in `src/lib/sitemap.ts`.

Preview it with `npm run build && npm run preview`, then open
`http://localhost:4321/styleguide/` — note `localhost`, not `127.0.0.1`
(`AGENTS.md` §2: the preview daemon binds `::1` only).
