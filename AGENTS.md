# AGENTS.md — Sanfor

Single source of truth for this repository: architecture, design system, content
rules, SEO, and change discipline. It is the only general doc tree; `docs/` holds
single-topic references that this file points at, not a parallel handbook.

Sanfor is Ahmed Abdelaziz Hanafy's portfolio, technical blog, and art archive. Its
professional focus is systems and backend engineering, Linux, networking, and
performance. Preserve factual accuracy, personal voice, and the visual identity
described in §4.

---

## 1. Scope

These instructions apply throughout the repository. They guide coding and editorial
work. They do **not** authorize unrelated refactors, external messages, publishing,
deployment, or changes to the owner's identity.

Before changing anything:

- Read the section of this file covering the area you're touching.
- Inspect the actual implementation. Documented intent is not shipped behavior.
- Check `git status --short` and preserve unrelated user changes.

---

## 2. Stack and commands

An Astro static site deployed to GitHub Pages at `https://sanfor2004.github.io`
(custom domain `sanfor2004.com`).

| Layer | Choice |
|---|---|
| Framework | **Astro 7**, static output, `ClientRouter` for internal navigation |
| Language | **TypeScript**, Astro strict, `@/*` → `src/*` |
| Styling | **Tailwind 4** via the Vite plugin, plus `src/styles.css` |
| Islands | **React 19** via `@astrojs/react` |
| Components | daisyUI 5 (existing pages) + a **shadcn/ui-pattern** kit on Radix for new work |
| Fonts | Inter + Instrument Serif, local via `@fontsource`; mono from the system stack |

There is no database, auth, CMS, contact API, or server-side execution. A server
requirement is an architecture change, not a feature.

```sh
npm ci
npm run dev              # dev server; draft filtering still applies
npm run lint             # astro check (diagnostics only, not ESLint)
npm run verify:patterns  # design-pattern series checks
npm run build            # astro check, then static output to dist/
npm run preview          # serve the build
```

- CI uses Node 22. `package.json` declares no engines constraint.
- Use `npm.cmd` if PowerShell blocks `npm.ps1`. Do not change execution policy.
- `astro preview` runs as a **detached daemon on `::1` (IPv6) only** — connect to
  `localhost:4321`, not `127.0.0.1:4321`, and stop it with `astro preview stop`.
- Report unavailable checks and real failures. Never claim a successful build, test,
  or deployment without evidence.

---

## 3. Source of truth by concern

| Concern | Source |
|---|---|
| Identity, contacts, navigation | `src/site.ts` |
| Shared shell, SEO, analytics, router | `src/layouts/BaseLayout.astro`, `src/components/SEO.astro`, `src/components/Analytics.astro` |
| Design tokens | `src/styles.css` (the `:root` block at the top) |
| Component kit | `src/components/ui/`, `src/components/bits/` |
| Kit gallery | `src/pages/ui-kit.astro` |
| Content schema | `src/content.config.ts` |
| Articles / projects | `src/content/blog/`, `src/content/projects/` |
| Pattern series identities + legacy redirects | `src/data/design-pattern-series.mjs` |
| Pattern verification | `scripts/verify-pattern-posts.mjs` |
| Routes | `src/pages/` |
| Sitemap filtering | `src/lib/sitemap.ts` |
| Assets | `public/` |
| Deployment | `.github/workflows/deploy.yml` |
| Prepared campaign (outside the build) | `Markting/`, `social_media_launch_framework.md` |

Portfolio writeups describe separate projects; do not assume their source exists here.

---

## 4. Design system

### 4.0 2026 redesign — read this first

A full redesign is in progress on `redesign/foundation`. Its colour and type
foundation is **`docs/brand-foundation.md`**: the Ink and Ember palettes, the five
font roles (Syne / Space Grotesk / Archivo Expanded / Sora / JetBrains Mono), the
Tailwind class names, and the `grain` and `ember-field` utilities. The component
library built on it is **`docs/ui-kit.md`**, with a live showcase at `/ui-kit/`.

For new work, that file supersedes §4.2 and §4.3 below. The identity those two
sections describe — warm paper, daisyUI `sanfor` / `sanfor-dark`, Inter and
Instrument Serif — is archived in `legacy/` (see `legacy/README.md`) and is no longer
built. §4.1 and §4.4–§4.8 still hold. The rest of §4 will be revised as the redesign
lands its sections; it is left intact here rather than rewritten ahead of the work.

### 4.1 The governing idea

> **Art is soft, atmospheric and heavily textured. UI is sharp, thin and quiet.**

A dithered hero is art; the panel on top of it is UI. Nothing is half of each.

### 4.2 Palette

Warm paper surfaces, dark brown text, burnt orange as the accent. Defined at the
top of `src/styles.css` as a daisyUI theme plus semantic aliases.

| Role | Token | Light (`sanfor`) | Dark (`sanfor-dark`) |
|---|---|---|---|
| Page background | `--color-bg` | `#E7C99F` | `#16110D` |
| Secondary surface | `--color-bg-secondary` | `#DDBA89` | `#211810` |
| Third surface | `--color-base-300` | `#C99E64` | `#352619` |
| Main text | `--color-text` | `#25170E` | `#F7E9D8` |
| Muted text | `--color-muted` | `#76583F` | `#C7AD92` |
| Border | `--color-border` | mixed from base-300 + text | `#6A4C36` |
| Accent / primary | `--color-accent` | `#C9521F` | `#FF7A38` |

Light is the default. Use secondary surfaces to separate reading areas, main text
for essential information, and orange for emphasis, links, focus and small marks.

**Usage ratio: ~85% neutral, ~10% art, ≤5% accent.** Orange is a *signal*, not
decoration. Never let colour carry meaning alone — pair it with a number or label,
and check contrast for every new pairing in both themes.

### 4.3 Typography

| Role | Face | Notes |
|---|---|---|
| Body, UI, headings | **Inter** | weights 400–800, local via `@fontsource/inter` |
| Labels, dates, badges, controls | mono stack | `--font-mono`, headed by IBM Plex Mono |
| Home wordmark | Inter | uppercase, weight 800 |
| Article prose | Inter | ~1.05rem / 1.8 line height |
| Display accent italic | **Instrument Serif** | `--font-serif`, used by `/ui-kit` |

> **IBM Plex Mono is named in `--font-mono` but not bundled**, so mono text renders
> from the fallbacks. Importing it (or repointing the stack) changes the look of
> every label on the site — do it deliberately, not as incidental cleanup.

`--font-serif` is now defined; it was previously referenced but undefined.

Reserve uppercase mono for short labels. Use the existing fluid `clamp()` patterns.

### 4.4 Tokens are the only source of colour

**Never hard-code a colour, radius, font or duration in a component or page.** The
theme block at the top of `src/styles.css` drives the entire site; the 3,600 lines
below it consume `--color-bg`, `--color-text`, `--color-accent`, `--color-border`,
`--font-*`. Repointing the top repalettes everything.

The **UI kit token layer** at the bottom of the same file aliases those semantic
tokens into Tailwind utilities via `@theme inline`: `bg-surface`, `bg-surface-2`,
`text-body`, `text-subtle`, `border-line`, `text-accent`, `bg-accent-soft`,
`text-paper-bright`. The kit carries no palette of its own — it inherits the site's,
so **a component never branches on light vs dark**, and retheming the site rethemes
the kit.

> **Hazard if you ever lighten the palette.** `styles.css` lightens and darkens
> surfaces with `color-mix(in oklch, <colour>, white N%)`. Chrome treats a
> *near-neutral* colour's OKLCH hue as **powerless**, so mixing two of them yields
> hue `none`, which paints at hue 0 — visibly **pink**. The current tan
> (`#E7C99F`, hue ≈ 76) is saturated enough that this never triggers; verified by
> sampling the painted pixel, not the computed string, which can serialize `none`
> while painting something else entirely. If the palette is ever moved toward a
> low-chroma cream or grey, switch those mixes to `in srgb` or mix toward a hued
> endpoint instead of bare `white`/`black`.

### 4.5 Grid, shape, motion

| Setting | Value |
|---|---|
| Content maximum | `80rem` |
| Page padding | `clamp(1rem, 3vw, 5rem)` |
| Component gutter | `clamp(0.9rem, 2vw, 1.5rem)` — applied by components, not `container-page` |
| Border width | `1px` |
| Mobile breakpoint | `760px` |
| Radii | 2px / 4px / 8px (`--radius-sm/md/lg`) |

`container-page` computes width from page spacing and supplies side borders with no
inline padding; `SiteGrid` is the wrapper. Prefer boundaries and spacing over shadows
— shadows are only for things that genuinely float (dialog, tooltip, swap deck).

Motion is brief and useful: 150–300ms, `--ease-quiet` to enter, `--ease-move` to move.
Everything must degrade under `prefers-reduced-motion`; check it in the real
interaction, not just the CSS.

### 4.6 Art direction

Original drawings, editorial covers and warm surfaces. Portraits establish
authorship; artwork adds personality. Do not present an illustration as a
screenshot or a measured result.

A CSS/SVG art layer ships in `src/components/bits/art.tsx` — `StippleField`,
`Halftone`, `Grain`, `DecryptedText`. It is available to the kit but **not used by
any site page**. Art layers are decorative: `aria-hidden`, `pointer-events: none`,
and never the only thing carrying information.

Design-pattern covers are original AI-generated sketchbook scenes built around each
lesson's analogy — text-free, warm, hand-drawn, distinct from the source
repository's SVG structure diagrams. Composite the existing SVG logo after
generation rather than asking a model to redraw it. Per-image provenance is in
`public/images/writing/patterns/README.md`.

### 4.7 Logo and assets

| Asset | Path |
|---|---|
| Logo | `public/assets/brand/logo.svg` |
| Favicon | `public/favicon.svg` |
| Social preview (1200×630) | `public/assets/brand/social-card.png` |
| Portrait | `public/images/ahmed-abdelaziz.png` |
| Closing illustration | `public/images/art/Horse_Far_View.png` |

The SVG geometry is the source of truth. Do not redraw, stretch, rotate or auto-recolor
it during layout work. Clear space: at least ¼ of the displayed mark height. The large
home SANFOR heading is live text, not an image.

### 4.8 Naming and voice

| Context | Use |
|---|---|
| Brand in prose | Sanfor |
| Display / nav wordmark | SANFOR |
| Authorship / SEO | Ahmed Abdelaziz |
| Alternate full name | Ahmed Abdelaziz Hanafy |
| Handle | sanfor2004 |
| Role line | Software Engineer — Systems & Backend |

Write plainly and confidently. State what software does, what was tested, what was
learned. Short actions: "Read article", "Case study", "Contact".

| Purpose | Write | Avoid |
|---|---|---|
| Project | "A tool for creating interactive panorama tours." | "A revolutionary platform transforming everything." |
| Article | "What failed when I retried the same job twice." | "The ultimate guide to perfect reliability." |
| Limitation | "Mixed-DPI behavior still needs testing." | Unsupported claims of complete support |
| Contact | "Discuss a project" | Unverified availability promises |

---

## 5. Component kit

| Location | Contents |
|---|---|
| `src/components/ui/button.tsx` | `Button` — CVA variants, `asChild` |
| `src/components/ui/primitives.tsx` | Card, Badge, Separator, Skeleton, Alert, Input, InputUnderline, Textarea, Label, Progress, Stat |
| `src/components/ui/interactive.tsx` | Dialog, Tabs, Tooltip, Switch — Radix-backed |
| `src/components/bits/CardSwap.tsx` | Stacked-card carousel (GSAP) |
| `src/components/bits/CountUp.tsx` | Animated number |
| `src/components/bits/art.tsx` | Halftone, StippleField, Grain, DecryptedText |
| `src/pages/ui-kit.astro` | The gallery — noindex, excluded from the sitemap |

The kit is **available but not yet adopted by site pages**. Existing pages still use
their own Astro markup and the daisyUI components they were built with; the kit is
for new work. Adopting it on an existing page is a deliberate redesign, not cleanup.

Astro renders these React components to **static HTML with zero JavaScript** unless
you add a `client:` directive — so `Badge`, `Card`, `Button` and friends cost nothing
on a static page. Hydrate only what genuinely needs it.

**Rules**

- New interactive UI should use this kit. daisyUI is still installed and still used
  by existing pages — leave that markup alone unless you are deliberately migrating it.
- Prefer Astro for static presentation. Use a React island only when interaction
  complexity warrants it, and hydrate as late as possible (`client:visible` over
  `client:load`).
- Components take `ReactNode` slots, not domain types.
- Every interactive element is a real control with a visible focus ring, an accessible
  name, and keyboard operation.
- **If a component isn't on `/ui-kit`, it isn't finished.** Check changes there first.

**React Bits adaptations.** The upstream components were modified to behave on a
content site, and these properties must be preserved: the real value renders before
hydration, animation starts on scroll-into-view, everything pauses off-screen and when
the tab is hidden, and reduced motion collapses to a static state.

---

## 6. Routes and content

| Route | Behavior |
|---|---|
| `/` | SANFOR entrance, five destinations from site config |
| `/about/` | Biography, skills, experience, newest seven non-draft projects |
| `/projects/`, `/projects/<slug>/` | Non-draft projects, newest first |
| `/tags/<tag>/` | Project-only archive |
| `/blog/` | Non-draft articles, metadata search, desktop masonry |
| `/blog/<slug>/` | Article **or** blog topic archive — articles take precedence |
| `/blog/design-patterns-overview/` | Entry point for the 24-post series |
| `/blog/design-pattern-<slug>/` | One of 23 pattern articles |
| `/art/`, `/contact/` | Image records; public profile links |
| `/rss.xml` | Article metadata, not bodies |
| `/ui-kit/` | Kit gallery — noindex, sitemap-excluded |
| `/testblog/` | Unlisted layout prototype — noindex, sitemap-excluded |
| Former `/learning/` | Redirect-only compatibility pages |

### Frontmatter

- **Blog** requires `title`, `description`, `pubDate`, `image`, `imageAlt`, `category`.
  Optional `imageWidth` / `imageHeight` must be positive integers matching the real cover.
- **Projects** require `title`, `description`, `pubDate`, `status`, `role`; optionally
  `stack`, `image`, `repo`, `demo`.
- Both support `tags`, `draft`, `updatedDate`.

### Publication rules

- `draft: true` hides content everywhere, including local dev. Future dates do **not**
  hide anything — filtering checks `draft` only.
- Preserve original `pubDate`; use an accurate `updatedDate` for substantive revisions.
- Lists sort by `pubDate`, not `updatedDate`.
- Tag normalization only lowercases and replaces literal spaces — punctuation survives,
  and differently spelled tags can still collide. Reuse existing spellings.
- Blog topics link `/blog/<tag>/`; project topics `/tags/<tag>/`.
- Blog and project collections load **Markdown only**. MDX and the Learning section were
  removed; do not restore them incidentally.

### Editorial rules

- **Never invent** achievements, metrics, employment, clients, qualifications, project
  behavior, URLs, sources, or ownership claims.
- Existing About metrics are published owner claims — preserve meaning, do not extrapolate.
- Keep example frontmatter schema-valid and referenced assets real.
- Keep private information and secrets out of content, assets, logs, and browser code.
- Alt text explains essential meaning; decorative duplicates take empty alt. An image is
  never the only source of an important explanation.
- Record source and permissions for new imagery or audio. Public availability does not
  establish reuse rights, and original drawing authorship does not imply ownership of
  depicted third-party characters.

---

## 7. Design-pattern series

24 English Markdown posts: one overview plus 23 patterns. Titles use
`Pattern Name (Creational Pattern)` / `(Structural Pattern)` / `(Behavioral Pattern)`;
blog category is Design Patterns.

- Source material is the owner's separate `23-Design-Patterns` repository. Published
  C++ snippets are real examples from it. Builds are self-contained — they do not read a
  neighboring checkout or fetch anything.
- Each post presents its complete Python example, then its C++20 example, each with its
  own expected-output block. Keep code and expected output synchronized.
- Keep the overview linked from every pattern, and preserve backlinks, related links,
  repository links, images, and previous/next navigation.
- `src/data/design-pattern-series.mjs` supplies stable identities and **48 legacy
  redirects**. Old Learning URLs stay as redirects, excluded from the sitemap. GitHub
  Pages serves static redirect HTML (refresh + link + canonical), not 301s. Validate
  destinations after renaming any article.
- Covers and SVG diagrams live in `public/images/writing/patterns/`; preserve its README
  and `SOURCE-LICENSE.txt`. Original cover paths under `public/images/learning/patterns/`
  remain as compatibility assets.
- Edit the Markdown directly — there is no generator.
- Run `npm run verify:patterns` on any series change. It checks structure, assets and
  links, runs the Python, and compiles the C++20 where a toolchain exists (MSVC needs a
  VS developer shell). Temporary output goes to a unique `tmp/pattern-posts-*` removed
  after the run. Output checks cover the demonstrated scenarios only — preserve stated
  limits on concurrency, ownership and external effects.
- The ignored GoF PDF is private and must never be published or committed.

---

## 8. Shared shell and browser state

`BaseLayout` mounts PageLoader, SiteHeader (except on home), `main#content`,
AsciiSignal, SiteFooter, ThemeToggle, SiteCursor. Home supplies skip-to-navigation;
internal pages skip-to-content.

`ClientRouter` replaces page DOM on internal navigation. Enhancements must work on
direct load, internal navigation, and back/forward:

- Initialize on the right Astro lifecycle event, usually `astro:page-load`.
- Guard against duplicate listeners and re-initialization on the same element.
- Reacquire page-local nodes after swaps; never hold stale references.
- Handle blocked or malformed `localStorage` in any new storage code.
- Preserve theme state and accessible toggle labels across navigation.

| Behavior | Implementation |
|---|---|
| Theme | `sanfor-theme` stores light/dark; restored initially and after swaps; defaults to light |
| Blog search | Case-insensitive substring over title, description, category, tags; updates cards, live count, empty message. Does not read bodies, persist in the URL, or run on topic/prototype pages |
| Blog masonry | ≥761px, JS measures cards and assigns grid spans; recalculates on images, fonts, filtering, resize; cleans up before swap |
| Loader | Split-panel reveal, ~950ms; reduced motion finishes immediately; noscript hides it |
| Cursor | Square enhancement for fine pointers without reduced motion |

MusicPlayer, MusicPrompt, BusinessPanels, IllustrationSlot, PageHeader and
`ui/SectionHeader.astro` have **no current consumers** — verify references before
cleanup. Dormant music keeps `transition:persist`, Web Audio and track/volume storage.
If audio is restored it must be user-initiated and expose pause, volume, seek and track
information.

---

## 9. SEO, analytics, deployment

- `SEO.astro` derives trailing-slash canonical URLs from the pathname and site origin.
  Home/About use ProfilePage/Person; ordinary routes WebPage; blog details TechArticle;
  projects with repos SoftwareSourceCode; BreadcrumbList accompanies nested entries.
- Pass `robots="noindex, nofollow"` for unlisted pages **and** add the path to
  `noIndexPaths` in `src/lib/sitemap.ts`. Both are required.
- RSS carries article metadata and author names, not bodies.
- `Analytics.astro` enables the typed helper only for production builds with a valid
  `PUBLIC_GA_MEASUREMENT_ID`, handling `astro:page-load` and delegated discovery clicks.
  Google automatic history page views must be **disabled** in stream settings or page
  views double-count.
- Do not replace analytics identifiers or add tracking as incidental cleanup.
- Forms must have real submission behavior before showing delivery success.
- Preserve published URLs and root-relative paths — this is a root user Pages site.
- Coordinate domain changes across site config, Astro config, robots.txt and URL
  assumptions.
- `deploy.yml` runs on main pushes or manual dispatch: Node 22, install, pattern
  verification with the runner's C++ compiler, build, upload `dist`, deploy to
  github-pages. Pages concurrency has `cancel-in-progress: false`.
- **Pushing to `main` deploys.** Push, publish or dispatch only when the task or session
  explicitly authorizes it. Never send external messages without authorization.

For campaign work, read `social_media_launch_framework.md` completely and follow its
workflow. An instruction to edit that file is not a request to run a campaign. Keep
external publication separate from preparation.

---

## 10. Conventions

- Two-space indentation, double-quoted TypeScript strings, existing semicolon style.
- Keep text UTF-8. Read explicitly as UTF-8 when punctuation looks corrupted; verify
  actual content before "repairing" apparent mojibake.
- Make focused changes. No incidental dependency additions or broad reformatting.
- Use patch-based edits. Do not fix source issues in generated output or dependencies.
- Check references before deleting apparently unused components or styles.
- Keep dependency changes intentional and lockfiles consistent.
- Do not commit secrets, caches, browser profiles, or temporary verification artifacts.
- Never nest links or buttons inside an encompassing card link.
- Do not rely solely on hover, colour, sound, or the custom pointer to convey anything.
- Size assets for delivery — files in `public/` get no automatic optimization.

---

## 11. Validation

**Documentation-only changes:** check relative links, paths, examples, factual
consistency, and `git diff --check`. A build is usually unnecessary.

**Code or content changes:** run `npm run build`. Inspect generated routes when
changing slugs, tags, drafts or schemas. Series changes also require
`npm run verify:patterns`.

**Visible changes:** review affected pages at mobile and desktop widths **in both
themes**. Check keyboard access, wrapping, image loading, overflow, and reduced motion.
Shared-shell changes also require internal navigation and theme continuity checks.

Screenshots are available without a browser extension — Playwright is a devDependency.
Build, start `npm run preview`, and drive `localhost:4321`. Verify rendered pixels when
a colour looks wrong; computed-style strings can serialize a hue as `none` while
painting something quite different (§4.4).

State any verification you could not perform. Review the final diff and report what
changed, what you validated, and what remains unresolved.

---

## 12. Known gaps

Not a standing request to fix everything — inspect when relevant.

- Blog search and masonry exist only on `/blog/`, not topic archives or `/testblog/`.
- `BusinessPanels`, `MusicPlayer`, `MusicPrompt`, `IllustrationSlot`, `PageHeader` and
  `ui/SectionHeader.astro` have no consumers.
- Dormant music storage is unguarded against blocked `localStorage`; the theme toggle
  is guarded.
- `/testblog/` is publicly reachable when deployed. It is a prototype, not a private
  draft preview, and not the source of truth for the writing index.
- The deploy workflow provides only a C++ toolchain for article examples — no Go, Java
  or Python setup steps.
- `Markting/` and `social_media_launch_framework.md` are prepared campaign material
  outside the site build; their historical reports describe dated runs, not current
  validation.

Update this section when the implementation changes.
