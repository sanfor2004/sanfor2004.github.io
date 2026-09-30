# UI kit

The component library for the 2026 redesign. Live showcase: **`/ui-kit/`**
(`src/pages/ui-kit.astro`) — every component with its variants, sizes and states,
plus the full token sheet.

Companion to [`brand-foundation.md`](./brand-foundation.md), which owns the palette
and the font roles. This file owns the components and the tokens built on top.

| Concern | Location |
|---|---|
| Raw tokens | `src/styles/tokens.css` |
| Tailwind mapping, base, utilities | `src/styles/global.css` |
| Components | `src/components/ui/<group>/` |
| Icon registry | `src/components/ui/icons/registry.ts` |
| Article prose | `src/styles/prose.css` (`.prose-sanfor`) |
| Form control CSS | `src/components/ui/forms/field.css` |
| Showcase-only helpers | `src/components/kit-docs/` |

---

## 1. Principles

1. **Tokens are the only source of colour, radius, duration and elevation.** No hex,
   no magic numbers in a component. Need a new value? Add a token.
2. **Dark only.** No light theme, no toggle, no `prefers-color-scheme` branch.
3. **Ink site-wide, Ember for the hero and special moments, signal sparingly.**
   Signal marks CTAs, focus, active states and tags — not decoration.
4. **React only for real client state.** Exactly one component qualifies
   (`SubscribeForm`). Everything else is Astro plus a class or attribute toggle.
5. **Native elements first.** The select is a real `<select>`; the checkbox, radio
   and switch keep a native input laid over the drawn control, so focus, clicks and
   form submission are the browser's job.
6. **State lives in ARIA, styling hangs off it.** Active is `aria-current`, open is
   `aria-expanded`, invalid is `aria-invalid`. The visual state and the announced
   state cannot drift because they are the same attribute.
7. **Every component takes `class`.** Passthrough lands last in the attribute; see
   the note in `src/components/ui/cx.ts` about which rules actually win.
8. **Reduced motion is respected everywhere.** Transitions collapse to ~1ms,
   the marquee stops duplicating and becomes a scrollable row, `Reveal` never hides
   anything, the skeleton shimmer is dropped. Only the button spinner keeps moving
   (slower), because it still means "working".

### Conventions

- One folder per group, `.astro` by default, `PascalCase.astro`.
- Every component exports a typed `Props` interface and destructures with
  `Astro.props as Props`.
- Component CSS is `<style is:global>` scoped by a `.ui-*` class prefix. It is
  global because several components style SVGs rendered by `<Icon />`, which lives
  in its own Astro style scope.
- Singleton scripts guard on `document.documentElement.dataset.*` so they attach
  once per page no matter how many instances are rendered.

> **Astro gotcha, worth knowing before you add an `as` prop.** A hand-written
> `interface Props` that contains `as` can silently lose its type: `astro check`
> resolves the component to `IntrinsicAttributes` (no props at all) and then
> rejects every attribute at the call site. `Eyebrow` and `Badge` hit this. The fix
> is Astro's `Polymorphic` helper:
>
> ```ts
> import type { HTMLTag, Polymorphic } from "astro/types";
> type Props<Tag extends HTMLTag = "span"> = Polymorphic<{ as: Tag; tone?: "a" | "b" }>;
> ```
>
> It also forwards the real attributes of whichever tag is chosen. Other `as`
> components (`Heading`, `Text`, `Container`, `Stack`, `Grid`, `Card`, `Stat`) type
> check correctly with a plain interface and were left alone.

---

## 2. Tokens

Raw values in `tokens.css`; the Tailwind utilities are generated from the `@theme`
block in `global.css`.

### Surfaces and borders

| Token | Value | Utility | Role |
|---|---|---|---|
| `--ink` | `#0A0E17` | `bg-ink` | Page background |
| `--silk` | `#1B2438` | `bg-silk` | Cards, panels |
| `--silk-raised` | `#232D45` | `bg-silk-raised` | A card on a card, hovered rows |
| `--overlay` | `ink @ 80%` | `bg-overlay` | Scrim behind modals and sheets |
| `--border-hairline` | `steel @ 10%` | `border-hairline` | Default card border |
| `--border-default` | `steel @ 20%` | `border-line` | Panels, form fields |
| `--border-strong` | `steel @ 35%` | `border-line-strong` | Emphasis, control borders |

### Text colour

| Token | Value | Utility | Role |
|---|---|---|---|
| `--frost` | `#EEF1F7` | `text-frost` | Main text |
| `--steel` | `#7C8AA8` | — | **Borders, guides, mixes.** Brand value, exact. |
| `--steel-text` | `#8895B0` | `text-steel` | Secondary **text** |
| `--signal` | `#EE5712` | — | **Fills, borders, focus rings, logo.** Brand value, exact. |
| `--signal-text` | `#F06D31` | `text-signal` | Accent **text** |

The two `-text` variants exist because the brand values fall just under WCAG AA as
small text on a raised surface (`steel` on `--silk-raised` is 3.95:1, `signal` on
`--silk` is 4.43:1). They are the same hues lifted ~9% and ~13% toward white and
clear 4.5:1 on every surface in the system. **The brand values themselves are
unchanged** — use them for anything that is not `color:`.

### Status

Meaning, never decoration. Do not reach for `--danger` because you want red.

| Token | Value | Utility |
|---|---|---|
| `--danger` | `#FF6B70` | `text-danger` |
| `--warning` | `#F2A93B` | `text-warning` |
| `--success` | `#3DD68C` | `text-success` |
| `--info` | `#5BA8F5` | `text-info` |

### Radii, shadows, motion, z-index, containers

| Group | Tokens |
|---|---|
| Radii | `rounded-sm` .25rem · `md` .5 · `lg` .75 · `xl` 1 · `2xl` 1.5 · `full` |
| Shadows | `shadow-soft` · `shadow-raised` · `shadow-overlay` · `shadow-glow-signal` (raw: `--elev-*`) |
| Duration | `--duration-fast` 150ms · `--duration-base` 250ms · `--duration-slow` 500ms |
| Easing | `--motion-standard` (state changes) · `--motion-emphasized` (things that travel or resize) |
| Z-index | `--z-base` 0 · `--z-dropdown` 30 · `--z-sticky` 40 · `--z-overlay` 50 · `--z-modal` 60 · `--z-toast` 70 |
| Section rhythm | `--section-sm/md/lg` (fluid clamps), `--gutter` |
| Containers | `max-w-prose` 68ch · `max-w-content` 1200px · `max-w-wide` 1440px |

Shadows are named `--elev-*` and easings `--motion-*` in `tokens.css` because
`--shadow-*` and `--ease-*` are Tailwind theme namespaces — reusing the names would
produce a circular `var()` and silently break them. Same reason the type tokens are
`--type-*`.

### Type scale

`text-display` and `text-h1` are fluid; the rest step. Each carries its own
line-height and tracking.

| Utility | Size |
|---|---|
| `text-display` | clamp 44 → 88px |
| `text-h1` | clamp 36 → 56px |
| `text-h2` | clamp 28 → 40px |
| `text-h3` / `text-h4` | 24 / 20px |
| `text-lead` / `text-body` / `text-small` | 19 / 16 / 14px |
| `text-label` | 12px, 0.18em tracking |

### Shared utilities

`focus-ring` · `section-sm|md|lg` · `sr-only-focusable` · `grain` · `grain-strong` ·
`ember-field` · `site-container`.

---

## 3. Icons

**One approach for the whole kit:** inline SVG from a typed registry, rendered by
`<Icon />`. No icon package, no runtime JS — an icon costs a string lookup at build
time.

- **UI icons: Lucide** (ISC). 24×24, stroked, `fill: none`, stroke-width 2.
- **Brand marks: Simple Icons** (CC0). 24×24, filled.
- LinkedIn is hand-authored: it is absent from both sets (Simple Icons removed it
  under its trademark policy).

Both families share one namespace and `isBrandIcon` resolves a clash in favour of
the brand, so **a new key must not collide with an existing one**. Simple Icons' `x`
is stored as `x-twitter` for exactly that reason — letting the brand mark win turned
every close button into a Twitter logo.

```astro
<Icon name="arrow-right" size={16} />
<Icon name="github" size={20} />
<Icon name="x" label="Close" />   <!-- only when the icon is the sole meaning -->
```

**Accessibility:** decorative by default (`aria-hidden`). Pass `label` only when the
icon carries meaning nothing else does.

---

## 4. Components

### Typography — `ui/typography/`

| Component | Purpose | Key props |
|---|---|---|
| `Heading` | Section and page headings | `as`, `size` (`display`…`h4`), `font` (`display`\|`expanded`), `weight`, `balance` |
| `Eyebrow` | Mono label above a heading | `tone` (`signal`\|`steel`), `dot`, `as` |
| `Text` | Body copy | `variant` (`lead`\|`body`\|`small`), `font` (`sans`\|`read`), `tone` (`default`\|`muted`\|`subtle`), `measure`, `as` |
| `Kbd` | A keyboard key | — |
| `InlineCode` | Identifier, flag, path | `tone` (`default`\|`signal`) |

```astro
<Eyebrow dot>Building now</Eyebrow>
<Heading as="h2" size="h1">I turn ideas into systems that ship.</Heading>
<Text variant="lead" font="read" tone="muted" measure="prose">…</Text>
```

`as` and `size` are separate on purpose: heading order must follow the document, not
the layout. The Eyebrow dot animates a ring, not the dot, so the text beside it never
moves; the pulse is decoration and must never be the only carrier of meaning.

### Layout — `ui/layout/`

| Component | Purpose | Key props |
|---|---|---|
| `Container` | Page width | `size` (`prose`\|`content`\|`wide`\|`full`), `flush`, `as` |
| `Section` | Section with eyebrow/title/intro/actions | `id`, `eyebrow`, `title`, `intro`, `space`, `width`, `titleSize`, `titleAs`, `divider`, `align` |
| `Stack` | Flex row/column | `direction`, `gap`, `align`, `justify`, `wrap`, `collapseAt` |
| `Grid` | Responsive grid | `cols`, `gap`, `min`, `align` |
| `GuideLines` | Editorial vertical rules | `columns`, `opacity`, `fade`, `inset` |
| `GrainOverlay` | Standalone noise layer | `opacity`, `scale`, `blend` |
| `EmberGlow` | Ember radial backdrop | `intensity`, `position`, `size`, `blur` |
| `Divider` | Rule, optionally labelled | `orientation`, `weight`, `label`, `labelAlign` |

```astro
<Section id="work" eyebrow="Selected" title="Work" intro="…" space="lg">
  <Grid cols={3} gap={6}>…</Grid>
  <Fragment slot="actions"><Button href="/work/">All projects</Button></Fragment>
</Section>
```

`Grid` and `Stack` set `min-inline-size: 0` on their children — grid and flex items
otherwise floor at their content width and an oversized child silently widens the
page. `GuideLines`, `GrainOverlay` and `EmberGlow` are absolutely positioned and need
a positioned parent; all three are `aria-hidden`. `Section` renders its header only
when something was supplied, so a bare `<Section>` is just vertical rhythm.

### Actions — `ui/actions/`

| Component | Purpose | Key props |
|---|---|---|
| `Button` | Primary control | `variant` (`primary`\|`secondary`\|`tertiary`\|`danger`), `size`, `href`, `external`, `disabled`, `loading`, `iconLeft`, `iconRight`, `iconOnly`, `label`, `block` |
| `TextLink` | Inline link | `href`, `external`, `tone`, `size` |
| `IconButton` | Square icon control | `icon`, `label` (required), `variant`, `size`, `href`, `pressed`, `disabled` |

```astro
<Button variant="primary" iconRight="arrow-right" href="https://calendly.com/…" external>
  Book a call
</Button>
<Button variant="secondary" loading>Saving</Button>
<IconButton icon="search" label="Search" variant="outline" />
```

`Button` renders `<a>` when given `href`, so a link that looks like a button stays a
link (middle-click, "open in new tab", correct announcement). Primary should appear
once per view. The trailing icon nudges 3px right on hover. `iconOnly` throws at build
time without a `label`. `IconButton` requires `label` for the same reason; `pressed`
sets `aria-pressed` for toggles.

### Data display — `ui/data/`

| Component | Purpose | Key props |
|---|---|---|
| `Badge` | Read-only status | `variant` (`signal`\|`neutral`\|`outline`\|`success`\|`warning`\|`danger`), `size`, `dot`, `icon`, `as` |
| `Chip` | Filter / tech tag | `value`, `href`, `active`, `removable`, `removeLabel`, `icon`, `size` |
| `Stat` | Headline number | `value`, `label`, `hint`, `size`, `tone`, `align`, `as` |
| `Avatar` | Image with initials fallback | `name`, `src`, `initials`, `size`, `shape`, `ring` |
| `Tooltip` | Hover/focus hint | `text`, `side`, `maxWidth` |

```astro
<Badge variant="signal" dot>Live</Badge>
<Chip removable value="postgres" removeLabel="Remove Postgres filter">Postgres</Chip>
<Stat value="5.4M+" label="Leads handled" size="lg" />
```

Badges are read-only; anything clickable or dismissable is a `Chip`. A removable chip
**does not remove itself** — it dispatches a bubbling `chip:remove` CustomEvent with
`{ value }` and lets the page decide. `Stat` uses tabular figures so a row of stats
does not jitter when values change.

`Tooltip` is CSS-only: the bubble is revealed by `:hover` and `:focus-within` on the
wrapper, so it works from the keyboard with no JS. A small script copies the bubble's
id onto the slotted trigger as `aria-describedby`. **A tooltip must only add detail** —
never put a control's only accessible name in one.

### Cards — `ui/cards/`

| Component | Purpose | Key props |
|---|---|---|
| `Card` | Base surface | `href`, `surface`, `padding`, `radius`, `interactive`, `grain`, `as` |
| `ProjectCard` | Project tile | `title`, `description`, `href`, `image`, `status`, `statusTone`, `stack` |
| `ArticleCard` | Article teaser | `title`, `href`, `excerpt`, `date`, `readTime`, `tag`, `image`, `variant` (`compact`\|`featured`) |
| `TestimonialCard` | Quote + attribution | `quote`, `name`, `role`, `company`, `avatar`, `mark` |
| `LogoTile` | Company logo | `src`, `name`, `href`, `framed` |
| `CaseStudyStat` | Figure + context line | `value`, `label`, `context`, `tone`, `size`, `rule` |

The richer cards stretch a pseudo-element from the **title link** across the whole
card rather than wrapping everything in one `<a>`. That keeps the accessible name on
the title, keeps nested links valid, and leaves stack chips hoverable (they sit at
`z-index: 2`). `TestimonialCard` uses `<figure>` + `<blockquote>` + `<figcaption>` so
the attribution is tied to the quote, not merely near it. `LogoTile` is greyscale
until hover **or focus**.

### Navigation — `ui/nav/`

| Component | Purpose | Key props |
|---|---|---|
| `NavLink` | Nav link with active state | `href`, `active`, `variant` (`bar`\|`stacked`), `external` |
| `MenuPanel` | Mega-menu surface | `width`, `sideWidth`, `sideHeading`, `footerLabel`, `footerHref`, `grain` |
| `MenuItem` | Mega-menu row | `title`, `description`, `href`, `tag`, `icon`, `isStatic` |
| `Accordion` | Container | `mode` (`single`\|`multiple`), `dividers` |
| `AccordionItem` | One fold | `title`, `id`, `open`, `headingLevel` |
| `SeeMore` | Collapsed overflow | `collapsedHeight`, `moreLabel`, `lessLabel`, `fade` |
| `Tabs` | Tabbed panels | `tabs`, `active`, `orientation`, `variant` (`line`\|`pill`), `name` |
| `Breadcrumb` | Trail | `items`, `label` |
| `Pagination` | Prev/next + numbers | `current`, `total`, `href`, `window`, `label` |

```astro
<Accordion mode="single">
  <AccordionItem title="What do you work on?" open>…</AccordionItem>
</Accordion>

<Tabs name="case" tabs={[{ id: "overview", label: "Overview" }]}>
  <Fragment slot="overview">…</Fragment>
</Tabs>
```

**Accessibility notes.**
`NavLink` active state is `aria-current="page"` and the styling keys off that
attribute. `Accordion` animates `grid-template-rows: 0fr → 1fr`, reaching the panel's
real height without measuring and without clipping; the trigger is a real `<button>`
inside a heading, wired with `aria-expanded`/`aria-controls`, and the panel points
back with `aria-labelledby`. `Tabs` follows the WAI-ARIA pattern with roving
tabindex: Left/Right (Up/Down when vertical) move, Home/End jump to the ends, and Tab
leaves the tablist for the panel rather than stepping through every tab.
`SeeMore` clips with max-height so in-page search still finds the text, marks the
folded region `inert` so its links stay out of the tab order, and hides its own
toggle when the content does not actually overflow. `Breadcrumb` renders the last
item as text with `aria-current="page"`, never as a link to the current page.
`Pagination` is all real links (Astro builds a URL per page); prev/next at the ends
are disabled `<span>`s, not links to nowhere.

`MenuPanel` and `MenuItem` are presentational building blocks. Positioning, open and
close behaviour, hover intent and focus management belong to whatever mounts them.

### Forms — `ui/forms/`

| Component | Purpose | Key props |
|---|---|---|
| `FormField` | Label + control + hint/error | `label`, `id`, `hint`, `error`, `required`, `hideLabel` |
| `Input` | Text input | `id`, `name`, `type`, `value`, `placeholder`, `invalid`, `describedBy`, `disabled`, `readonly` |
| `Textarea` | Multi-line | as `Input`, plus `rows` |
| `Select` | Native select | `options`, `placeholder`, `value`, `invalid`, `disabled` |
| `Checkbox` | Checkbox | `label`, `checked`, `hint`, `disabled`, `invalid` |
| `Radio` | Radio | `label`, `name`, `value`, `checked`, `hint`, `disabled` |
| `Switch` | Toggle | `label`, `checked`, `hint`, `disabled`, `labelFirst` |
| `SubscribeForm` | Inline email capture | `action`, `method`, `name`, `label`, `placeholder`, `buttonLabel`, `successMessage`, `errorMessage`, `hint` |

Astro has no render props, so `FormField` and its control share an id explicitly:

```astro
<FormField label="Email" id="email" hint="Work address" required>
  <Input id="email" type="email" describedBy="email-hint" required />
</FormField>

<FormField label="Budget" id="budget" error="Enter a number greater than zero.">
  <Input id="budget" type="number" invalid describedBy="budget-error" />
</FormField>
```

`FormField` derives `-hint` and `-error` ids from `id`; the error renders with
`role="alert"`. Set `invalid` on the control so `aria-invalid` and the red border
agree. Group radios in a `<fieldset>` with a `<legend>` so the group itself has a
label.

The checkbox, radio and switch keep the **native input** in the DOM, sized over the
drawn control at full opacity zero — so focus, hit target, form submission and the
accessibility tree are all native, and only the paint is ours. `Switch` adds
`role="switch"` so it is announced on/off. `Select` is deliberately the native
element: a custom listbox would have to reimplement typeahead and the mobile OS
picker and would be worse at both.

**`SubscribeForm` is the only React component in the kit.** It earns the island
because it holds real client state that changes over time in response to an async
call: `idle → loading → success | error`, plus the returned message. It is
provider-agnostic (POSTs `email` to whatever `action` it is given, any 2xx is
success) and falls back to a native form submission when `action` is omitted, so it
still works with JavaScript off. Mount `client:visible`. Its status message is a
polite live region, so it is announced without interrupting typing.

### Feedback — `ui/feedback/`

| Component | Purpose | Key props |
|---|---|---|
| `Callout` | Boxed aside, also for articles | `tone` (`info`\|`tip`\|`warning`\|`danger`), `title`, `icon` |
| `Skeleton` | Loading placeholder | `variant` (`text`\|`block`\|`circle`), `width`, `height`, `lines`, `radius` |
| `EmptyState` | Nothing-here panel | `title`, `description`, `icon`, `variant`, `size` |
| `Toast` | Transient notification host | `position` |

Each `Callout` tone carries its own icon as well as its own colour, so meaning never
depends on colour alone. `Skeleton` is `aria-hidden` and text-free — a skeleton is not
information; announce loading from a live region instead.

`Toast` is a host plus a tiny global. Mount it **once per page**, then:

```js
window.sanforToast({ message: "Copied", tone: "success", duration: 4000 });
```

The region is `aria-live="polite"`, so a toast is announced without stealing focus;
hovering pauses the countdown. Toasts are transient — never the only place important
information appears.

### Media & motion — `ui/media/`

| Component | Purpose | Key props |
|---|---|---|
| `Figure` | Framed image + caption | `src`, `alt`, `width`, `height`, `caption`, `ratio`, `grain`, `eager`, `radius` |
| `Marquee` | Infinite horizontal scroller | `duration`, `direction`, `pauseOnHover`, `gap`, `fade` |
| `SocialLink` | One profile link | `icon`, `href`, `label`, `showLabel`, `size` |
| `SocialIconRow` | Row of them | `links`, `size`, `showLabels`, `label`, `align` |
| `Reveal` | Fade-up on scroll | `delay`, `stagger`, `distance`, `direction`, `threshold`, `once`, `as` |

`Figure` **requires** `width` and `height`: without them the browser cannot reserve
the box and the page jumps when the image lands. That one rule is most of what keeps
layout shift at zero.

`Marquee` duplicates its track once and translates exactly `-50%`, so the loop is
seamless with no JavaScript; the duplicate is `aria-hidden`. Under reduced motion the
duplicate is removed entirely and it becomes a normal scrollable, wrapping row — not
a paused strip with half its content off-screen.

`Reveal` is the important one to get right: **content is visible by default**, and the
hidden start state is applied by script only after confirming that motion is allowed
and `IntersectionObserver` exists. If the start state lived in plain CSS, a reader
with JavaScript disabled would get permanently invisible content. The worst case here
is simply no animation.

`SocialLink` goes steel → signal on hover rather than using real brand colours; eight
brand hues would pull the page apart.

---

## 5. Prose

`.prose-sanfor` styles rendered Markdown so article bodies stay free of classes.
Apply it to the wrapper:

```astro
<article class="prose-sanfor"><Content /></article>
```

Covers headings (Syne, h4 in Archivo Expanded), paragraphs and lists (Sora, signal
bullets, mono ordered markers), links, blockquote + `cite`, inline code and code
blocks (JetBrains Mono on `--ink`, horizontally scrollable so they never widen the
page), tables, images, `hr`, footnotes, `mark`, `strong` and `abbr`. Heading anchor
links appear on hover and focus.

---

## 6. Verification

```sh
npm run build     # astro check, then static output
npm run preview   # then open http://localhost:4321/ui-kit/
```

Use `localhost`, not `127.0.0.1` — the preview daemon binds `::1` only (AGENTS.md §2).

**Contrast.** Every text/surface pairing in the kit meets WCAG AA (4.5:1) for normal
text; the lowest is `steel-text` on `--silk-raised` at 4.55:1. The `-text` token
variants and the `--danger` value exist to make that true — see §2.

**Keyboard.** Accordion (Enter/Space, single-mode sibling close), Tabs (arrows,
Home/End, wrap, roving tabindex), Tooltip (focus reveal + `aria-describedby`),
SeeMore (toggle + `inert` folded region), and the form controls (label/`for`,
`aria-invalid` → `role="alert"`, native Space toggle, `role="switch"`) are all
verified. The focus ring is 2px `--signal` at 2px offset, set once in the base layer.
