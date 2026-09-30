# Design system — Sanfor

Single source of truth for tokens, architecture, and the component inventory.
`AGENTS.md` §4 points here. Voice/naming/logo usage live in
[`brand-guide.md`](./brand-guide.md); dated decisions in
[`decisions.md`](./decisions.md). This file did not exist before
2026-09-30 — it's authored fresh here, not migrated from an older version.

Direction: Apple's calm (space, restraint, precise type, quiet surfaces)
crossed with Google's boldness (confident color moments, clear hierarchy,
purposeful motion). Dark-only, premium-studio feel.

---

## 1. Tokens

All raw values live in `src/styles/tokens.css`. Components consume them
through the Tailwind `@theme` mapping in `src/styles/global.css`
(`bg-ink`, `text-frost`, …), never as raw hex/px. If a value doesn't exist
yet, add it to `tokens.css` (and map it in `global.css` if it needs a
Tailwind utility) before using it in a component.

### 1.1 Color — Ink (site-wide)

| Token | Hex | Role | Contrast vs `--ink` | vs `--silk` |
|---|---|---|---|---|
| `--ink` | `#0A0E17` | Base background | — | — |
| `--silk` | `#1B2438` | Surface, one step up from base | 1.25 | — |
| `--silk-raised` | `#232D45` | Raised surface (card on card, hover row) | 1.41 | 1.13 |
| `--steel` | `#7C8AA8` | Fills, borders, focus rings — **not text** | 5.57 | 4.47 |
| `--steel-text` | `#8895B0` | Secondary text (AA-safe on every surface) | 6.41 | 5.14 |
| `--frost` | `#EEF1F7` | Primary text | 17.06 | 13.69 |
| `--signal` | `#EE5712` | Fills, borders, focus — **not text** | 5.52 | 4.43 |
| `--signal-text` | `#F06D31` | Links, CTAs, accent text (AA-safe) | 6.38 | 5.12 |
| `--text-muted` | `color-mix(steel-text 70%, transparent)` | Tertiary/inactive text — below 4.5:1 by design, pair with an icon/label, never sole carrier of meaning | ~4:1 | lower |
| `--steel-muted` | `color-mix(steel 80%, ink)` | Large text (≥h3) or non-essential captions on ink/silk only. **Never** small text, never on silk-raised | 3.94 | 3.16 (AA-large only) |

**Rule**: raw `--steel`/`--signal` are for fills, borders, and focus rings
only. Anything you set `color:` on uses the `-text` variant (or the plain
Tailwind `steel`/`signal`/`frost` utilities, which already point at the
AA-safe variants — see §1.6).

### 1.2 Color — Ember (hero and rare high-emphasis moments only)

| Token | Hex | Role |
|---|---|---|
| `--ember-primary` | `#EE5712` | Same hex as `--signal` — hero gradient top |
| `--ember-glow` | `#FF8A3D` | Hero gradient highlight |
| `--ember-burnt` | `#C43A08` | Hero gradient mid |
| `--ember-deep` | `#5A1603` | Hero gradient low |
| `--ember-night` | `#120805` | Hero gradient floor; also the base for `--elev-*` shadows |
| `--ember-paper` | `#FFF3EA` | Text/icons **on** an Ember-colored fill (17.70:1 vs ink, so also fine standalone) |

Ember is not a second palette to reach for when you want variety — it's
reserved for the hero field (`ember-field` utility) and any surface that is
itself solid `--signal`/`--ember-primary` (e.g. a button's hover-filled
state), where `--ember-paper` is the correct text pairing instead of
`signal-text` (same-hue-on-same-hue is illegible — this exact bug was caught
and fixed in `interactive-hover-button.tsx`'s hover state).

### 1.3 Color — Status

| Token | Hex | Use | Contrast vs ink |
|---|---|---|---|
| `--danger` | `#FF6B70` | Destructive actions, error states | 6.97 |
| `--warning` | `#F2A93B` | Warning callouts | 9.66 |
| `--success` | `#3DD68C` | Success states | 10.29 |
| `--info` | `#5BA8F5` | Informational callouts | 7.69 |

Not decoration — don't reach for `--danger` because you want red. `--signal`
remains the only brand accent.

### 1.4 Borders

Three weights of the same steel hue, so every rule on the site reads as one
family:

| Token | Value |
|---|---|
| `--border-hairline` | `color-mix(steel 10%, transparent)` |
| `--border-default` | `color-mix(steel 20%, transparent)` |
| `--border-strong` | `color-mix(steel 35%, transparent)` |

### 1.5 Typography — 3 fonts, self-hosted (Fontsource, no Google CDN)

| Token | Family | Role |
|---|---|---|
| `--type-display` | Syne Variable | Wordmark, hero, h1–h2 |
| `--type-sans` | Space Grotesk | UI, body, buttons, nav, **labels/kickers** (uppercase + letter-spacing), short strong text — absorbs what used to be Archivo Expanded's job |
| `--type-read` | Sora | Long-form article prose only (`.prose-sanfor`) |
| `--type-code` | System stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`) | Code, tabular numerals — **not** one of the 3 brand fonts. Ships no webfont; it's a functional requirement (monospace alignment), not a voice. See `decisions.md` 2026-09-30. |

Tailwind utilities: `font-display`, `font-sans`, `font-read`, `font-mono`
(→ `--type-code`).

### 1.6 Type scale

`--text-display` … `--text-label`, each with paired `--text-*--line-height`
and (where set) `--text-*--letter-spacing`, defined in `global.css`'s
`@theme` block. Display/h1/h2 are fluid (`clamp()`); h3 down are fixed.

| Utility | Size | Line height | Typical role |
|---|---|---|---|
| `text-display` | `clamp(2.75rem, 1.6rem + 5.2vw, 5.5rem)` | 0.96 | Hero wordmark |
| `text-h1` | `clamp(2.25rem, 1.5rem + 3.4vw, 3.5rem)` | 1.04 | Page title |
| `text-h2` | `clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)` | 1.12 | Section heading |
| `text-h3` | `1.5rem` | 1.25 | Subsection |
| `text-h4` | `1.25rem` | 1.35 | Card/group title |
| `text-lead` | `1.1875rem` | 1.6 | Intro paragraph |
| `text-body` | `1rem` | 1.65 | Body copy |
| `text-small` | `0.875rem` | 1.55 | Secondary text |
| `text-label` | `0.75rem` | 1.4, `0.18em` tracking | Eyebrows, tags, table headers |

`Text`/`Heading` primitives (§3) operationalize this table as props instead
of raw utility classes.

### 1.7 Spacing, radii, shadows, motion, z-index

- **Section rhythm**: `--section-sm/md/lg` (fluid `clamp()`), `--gutter`
  (`clamp(1rem, 4vw, 2.5rem)`, the page's side gutter, shared by every
  container width).
- **Container widths**: `--container-prose` (68ch), `--container-content`
  (75rem/1200px, the default mid column), `--container-wide` (90rem).
- **Radii**: `--radius-sm` (0.25rem) → `--radius-2xl` (1.5rem); `rounded-full`
  is Tailwind's built-in.
- **Shadows**: `--elev-soft/raised/overlay/glow-signal` — tuned against
  `--ember-night`, not black (a pure-black shadow on blue-black reads as a
  hole).
- **Motion durations**: `--duration-fast` (150ms), `--duration-base`
  (250ms), `--duration-slow` (500ms). Reference via the arbitrary-property
  shorthand, e.g. `duration-(--duration-base)` — there's no `duration-*`
  Tailwind utility registered for these (would collide with the token's own
  name the way `--ease-*` would; see `tokens.css`'s comment on `--motion-*`).
- **Easing**: `--ease-standard` (most state changes), `--ease-emphasized`
  (things that travel/resize) — these **are** registered under `@theme`, so
  `ease-standard`/`ease-emphasized` work as plain Tailwind classes.
- **Z-index**: `--z-base/dropdown/sticky/overlay/modal/toast` — the only
  place a stacking value should ever be written.
- **Interaction state mixes**: `--state-hover-mix` (10%), `--state-active-mix`
  (16%) — hover/active are `color-mix()` transforms on whatever color is
  already in play, not fixed colors of their own. `--state-disabled-opacity`
  (0.45), paired with `pointer-events: none`.

---

## 2. Architecture

```
src/components/
  primitives/   Button, IconButton, Link, Icon, Text, Heading, Eyebrow,
                Badge, Tag, Kbd, Divider, Avatar, Spinner, VisuallyHidden
  forms/        Input, Textarea, Select, Checkbox, Radio, Switch,
                FormField, SubscribeForm
  components/   Card, ProjectCard, ArticleCard, TestimonialCard, LogoTile,
                Stat, Tooltip, Dropdown, MegaMenu, Accordion, SeeMore, Tabs,
                Dialog, Toast, Breadcrumb, Pagination, Callout, EmptyState,
                Skeleton, SocialLinks, Marquee
  layout/       Container, Section, Stack, Grid, GrainOverlay, EmberGlow,
                GuideLines
  motion/       Reveal, hero background
```

### 2.1 Astro by default

Most components need zero client JS: variant/size APIs are just
`class-variance-authority` (CVA) returning class strings, which works
identically in an `.astro` frontmatter as in React. Astro's native "render a
different tag from a prop" replaces the old kit's Radix-`Slot`-based
`asChild` pattern — no hydration cost for a polymorphic Button/Link/Heading.

### 2.2 React islands — only where real interactivity or a registry lives

A component becomes a `.tsx` island **only** when it wraps a Radix primitive
(real ARIA state machine: roving tabindex, focus trapping, typeahead) or has
genuine client state (`SubscribeForm`'s idle/loading/success/error). Every
island is documented with a one-line reason in the inventory (§4). Astro
renders an unhydrated React component to static HTML with zero JS — a
`client:` directive is only added when the component is actually used
somewhere that needs the interaction; the kit page itself decides per demo.

### 2.3 Native-first

Checkbox, Radio, Select-as-native-fallback, disclosure (`SeeMore`) all reach
for the platform element first. A native `<input type="checkbox">` already
satisfies every APG requirement — WAI-ARIA's own guidance is to use the
native control unless it's genuinely infeasible. `SeeMore` is a bare
`<details>/<summary>` — the native disclosure pattern.

### 2.4 Conventions

- `cn()` (`src/lib/cn.ts`, `clsx` + `tailwind-merge`) is the only class-merge
  helper — same contract as shadcn/ui's `cn`.
- Every component: typed `Props`, sensible defaults, a `class`/`className`
  passthrough, visible focus ring (`--signal`, via the global `:focus-visible`
  rule or the `focus-ring` utility for elements that suppress it).
- No raw hex, px spacing, or font names inside a component — tokens only.
- `prefers-reduced-motion` is honored everywhere motion appears (`Reveal`,
  `CardSwap`, `CountUp`, `Marquee`, `MegaMenu`/`Accordion` transitions).

---

## 3. Primitives reference

`Text`/`Heading` take an `as` prop (`"h1"`–`"h6"`/`"p"`/`"span"`) and a
`size` prop mapped to §1.6's scale, decoupling semantic level from visual
size (an `h2` doesn't have to look like `text-h2`). `Button`/`IconButton`
take `variant` (`solid | outline | ghost | link | destructive`) and `size`
(`sm | md | lg | icon`), plus `href` to render as `<a>` instead of
`<button>` — no `asChild`/Slot needed in Astro.

---

## 4. Component inventory

Status: 🔲 planned · 🟡 in progress · ✅ built.

| Component | Path | Status | Source |
|---|---|---|---|
| Container | `src/components/Container.astro` | ✅ | Custom |
| SiteHeader | `src/components/SiteHeader.astro` | ✅ | Custom |
| InteractiveHoverButton | `src/components/ui/interactive-hover-button.tsx` | ✅ | Registry: Magic UI `interactive-hover-button`, retokenized |
| **Primitives** | | | |
| Button | `src/components/primitives/Button.astro` | 🔲 | Custom (behavior ported from `main`'s `ui/button.tsx`, restyled, Slot dropped for Astro polymorphism) |
| IconButton | `src/components/primitives/IconButton.astro` | 🔲 | Custom |
| Link | `src/components/primitives/Link.astro` | 🔲 | Custom |
| Icon | `src/components/primitives/Icon.astro` | 🔲 | Custom |
| Text | `src/components/primitives/Text.astro` | 🔲 | Custom |
| Heading | `src/components/primitives/Heading.astro` | 🔲 | Custom |
| Eyebrow | `src/components/primitives/Eyebrow.astro` | 🔲 | Custom |
| Badge | `src/components/primitives/Badge.astro` | 🔲 | Custom (ported from `main`'s `ui/primitives.tsx`) |
| Tag | `src/components/primitives/Tag.astro` | 🔲 | Custom |
| Kbd | `src/components/primitives/Kbd.astro` | 🔲 | Custom |
| Divider | `src/components/primitives/Divider.astro` | 🔲 | Custom (ported from `main`'s `Separator`) |
| Avatar | `src/components/primitives/Avatar.astro` | 🔲 | Custom |
| Spinner | `src/components/primitives/Spinner.astro` | 🔲 | Custom |
| VisuallyHidden | `src/components/primitives/VisuallyHidden.astro` | 🔲 | Custom |
| **Forms** | | | |
| Input | `src/components/forms/Input.astro` | 🔲 | Custom (ported from `main`) |
| Textarea | `src/components/forms/Textarea.astro` | 🔲 | Custom (ported from `main`) |
| Select | `src/components/forms/Select.tsx` | 🔲 | Radix `@radix-ui/react-select` — React island: custom listbox/combobox panel needs Radix's ARIA wiring |
| Checkbox | `src/components/forms/Checkbox.astro` | 🔲 | Custom, native `<input>` |
| Radio | `src/components/forms/Radio.astro` | 🔲 | Custom, native `<input>` |
| Switch | `src/components/forms/Switch.tsx` | 🔲 | Radix `@radix-ui/react-switch` (ported from `main`'s `ui/interactive.tsx`) — React island: Radix state machine |
| FormField | `src/components/forms/FormField.astro` | 🔲 | Custom |
| SubscribeForm | `src/components/forms/SubscribeForm.tsx` | 🔲 | Custom — React island: idle/loading/success/error client state |
| **Components** | | | |
| Card | `src/components/components/Card.astro` | 🔲 | Custom (ported from `main`) |
| ProjectCard | `src/components/components/ProjectCard.astro` | 🔲 | Custom |
| ArticleCard | `src/components/components/ArticleCard.astro` | 🔲 | Custom |
| TestimonialCard | `src/components/components/TestimonialCard.astro` | 🔲 | Custom |
| LogoTile | `src/components/components/LogoTile.astro` | 🔲 | Custom |
| Stat | `src/components/components/Stat.astro` | 🔲 | Custom (ported from `main`) |
| Tooltip | `src/components/components/Tooltip.tsx` | 🔲 | Radix `@radix-ui/react-tooltip` (ported from `main`) — React island |
| Dropdown | `src/components/components/Dropdown.tsx` | 🔲 | Radix `@radix-ui/react-dropdown-menu` — React island: APG menu pattern |
| MegaMenu | `src/components/components/MegaMenu.tsx` | 🔲 | Radix `@radix-ui/react-navigation-menu` — React island |
| Accordion | `src/components/components/Accordion.tsx` | 🔲 | Radix `@radix-ui/react-accordion` — React island |
| SeeMore | `src/components/components/SeeMore.astro` | 🔲 | Custom, native `<details>` |
| Tabs | `src/components/components/Tabs.tsx` | 🔲 | Radix `@radix-ui/react-tabs` (ported from `main`) — React island |
| Dialog | `src/components/components/Dialog.tsx` | 🔲 | Radix `@radix-ui/react-dialog` (ported from `main`); `variant="sheet"` covers the Sheet case — React island |
| Toast | `src/components/components/Toast.tsx` | 🔲 | Radix `@radix-ui/react-toast` — React island |
| Breadcrumb | `src/components/components/Breadcrumb.astro` | 🔲 | Custom |
| Pagination | `src/components/components/Pagination.astro` | 🔲 | Custom |
| Callout | `src/components/components/Callout.astro` | 🔲 | Custom (ported from `main`'s `Alert`) |
| EmptyState | `src/components/components/EmptyState.astro` | 🔲 | Custom |
| Skeleton | `src/components/components/Skeleton.astro` | 🔲 | Custom (ported from `main`) |
| SocialLinks | `src/components/components/SocialLinks.astro` | 🔲 | Custom |
| Marquee | `src/components/components/Marquee.astro` | 🔲 | Registry: Magic UI `marquee`, ported to Astro/CSS |
| **Layout** | | | |
| Section | `src/components/layout/Section.astro` | 🔲 | Custom |
| Stack | `src/components/layout/Stack.astro` | 🔲 | Custom |
| Grid | `src/components/layout/Grid.astro` | 🔲 | Custom |
| GrainOverlay | `src/components/layout/GrainOverlay.astro` | 🔲 | Custom (wraps existing `grain`/`grain-strong` utilities) |
| EmberGlow | `src/components/layout/EmberGlow.astro` | 🔲 | Custom (wraps existing `ember-field` utility) |
| GuideLines | `src/components/layout/GuideLines.astro` | 🔲 | Custom |
| **Motion** | | | |
| Reveal | `src/components/motion/Reveal.tsx` | 🔲 | Custom, `motion` (motion.dev) — React island |
| Hero background | `src/components/motion/*` | 🔲 | Registry: React Bits `GradientWaves` if fetchable, else custom |
| **Bits (existing, pre-redesign)** | | | |
| CardSwap | `src/components/bits/CardSwap.tsx` | 🔲 | Custom (ported from `main`, GSAP) |
| CountUp | `src/components/bits/CountUp.tsx` | 🔲 | Custom (ported from `main`) |
| **Prose** | | | |
| `.prose-sanfor` | `src/styles/prose.css` | 🟡 | Custom — rewrite in progress to drop `--type-mono` label usage |

---

## 5. Accessibility rules

- Every interactive component follows its [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  pattern: Dialog → Dialog Modal, Tabs → Tabs, Tooltip → Tooltip, Switch →
  Switch, Select → Combobox/Listbox, Dropdown → Menu Button, MegaMenu →
  Disclosure Navigation, Accordion → Accordion, Toast → the `aria-live`
  region recommendation (not a discrete APG "pattern" page, but the same
  region-based approach APG uses elsewhere).
- Visible focus ring on every control — `--signal` via `:focus-visible`
  (global) or the `focus-ring` utility.
- AA contrast minimum for text; large text (≥ h3 / 19px+) may use the
  `-muted` tier tokens per §1.1's documented exceptions, never for essential
  body copy.
- `prefers-reduced-motion` collapses every animation to its resting/static
  state — no exceptions.
- Keyboard operability: Tab/Shift+Tab through all controls, Escape closes
  Dialog/Dropdown/MegaMenu panels, Arrow keys move within Tabs/Accordion/Menu
  per their APG pattern, native form controls get native keyboard behavior
  for free.

---

## 6. Known gaps

- `/ui-kit` shows every component's variants/sizes/states but is not a
  substitute for real-page integration testing — a component working in
  isolation doesn't guarantee it composes correctly on `/about/`, `/blog/`,
  etc.
- React Bits has no MCP/registry tool in this environment; the hero
  background candidate is fetched best-effort via `WebFetch` and may end up
  hand-built instead of a literal port (flagged at the point it happens, not
  claimed as a registry pull if it isn't one).
- Old-kit ports (`main` → here) carry over behavior, not tokens — every one
  is being restyled against §1, not copy-pasted.
