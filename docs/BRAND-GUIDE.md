# Sanfor Brand Guide

Baseline: 9 September 2026. This guide explains the existing identity and rules for extending it. **Direction** labels proposed conventions. It is a repository design guide, not a claim of trademark registration or an independent rights assessment.

See the [Portfolio Handbook](PORTFOLIO-HANDBOOK.md) for audience, editorial strategy, and publication workflow.

## 1. Brand idea

Sanfor combines systems engineering precision with the individuality of a personal sketchbook. Technical labels, visible grid rails, clear typography, and restrained motion organize the work. Warm paper colors, orange accents, original drawings, and optional classical music give the experience personal character.

The brand should feel clear, capable, curious, and human. Credibility comes from specific work and thoughtful explanation. The design supports reading and exploration.

## 2. Naming and voice

| Context | Use |
| --- | --- |
| Brand in prose and metadata | Sanfor |
| Large display and compact navigation wordmark | SANFOR |
| Full authorship | Ahmed Abdelaziz Hanafy |
| Short portrait/about heading | Ahmed Abdelaziz |
| Account handle | sanfor2004 |
| Role line | Software Engineer — Systems & Backend |

Keep spelling consistent across copy, metadata, and social previews. Use the handle for accounts and the full name for formal authorship.

Write plainly and confidently. State what software does, what was tested, and what was learned. Technical shorthand belongs in labels and metadata; paragraphs should read naturally. Use short actions such as “Read article,” “Case study,” and “Contact.”

**Direction — voice examples:**

| Purpose | Suitable wording | Avoid |
| --- | --- | --- |
| Project | “A tool for creating interactive panorama tours.” | “A revolutionary platform transforming everything.” |
| Article | “What failed when I retried the same job twice.” | “The ultimate guide to perfect reliability.” |
| Limitation | “Mixed-DPI behavior still needs testing.” | Unsupported claims of complete platform support |
| Contact | “Discuss a project” | Unverified availability or response-time promises |

## 3. Logo and asset system

| Asset | Path | Current use |
| --- | --- | --- |
| Logo | `public/assets/brand/logo.svg` | Home and navigation |
| Favicon | `public/favicon.svg` | Browser identity and loader |
| Social preview | `public/assets/brand/sanfor-linkedin-preview-2026.png` | Default social image |
| Portrait | `public/images/ahmed-abdelaziz.png` | About page |
| Horse drawing | `public/images/art/Horse_Far_View.png` | Shared closing illustration |

Use existing SVG geometry as the source of truth and preserve aspect ratio. The large home SANFOR heading is live text. Do not redraw, stretch, rotate, or automatically recolor the logo during routine layout work.

**Direction:** Leave clear space of at least one quarter of the displayed mark height. This is a working convention, not a preexisting formal specification. No audited minimum reproduction size is established; test small sizes visually. Some markup uses nominal 56 × 38 dimensions, with CSS determining display size.

For a new lockup, align the existing mark and SANFOR text clearly and check both themes. Create any needed monochrome variant explicitly rather than applying broad image filters that could affect artwork.

## 4. Color system

The implementation is in [src/styles.css](../src/styles.css). Use semantic variables in new components.

| Role | Light | Dark | Token |
| --- | --- | --- | --- |
| Page background | `#e7c99f` | `#16110d` | `--color-bg` |
| Secondary surface | `#ddba89` | `#211810` | `--color-bg-secondary` |
| Third base surface | `#c99e64` | `#352619` | `--color-base-300` |
| Main text | `#25170e` | `#f7e9d8` | `--color-text` |
| Muted text | `#76583f` | `#c7ad92` | `--color-muted` |
| Accent / primary | `#c9521f` | `#ff7a38` | `--color-accent`, `--color-primary` |
| Text on primary | `#fff8ed` | `#1b1009` | `--color-primary-content` |
| Border | Mixed from third surface and text | `#6a4c36` | `--color-border` |

The light border is `color-mix(in oklch, var(--color-base-300), var(--color-base-content) 16%)`. Background dots mix text color with transparency and repeat on an 18px grid.

Use secondary surfaces to separate reading areas and metadata, main text for essential information, and orange for emphasis, links, focus, and small marks. Keep success/error/info/warning colors semantic.

Theme names are `sanfor` and `sanfor-dark`. Light is the default. These values are implementation facts, not proof that every color pairing passes contrast requirements. Check foreground, background, size, and state for each new combination. Use non-color cues for state and errors.

## 5. Typography

| Use | Current treatment |
| --- | --- |
| Body and general headings | Inter with system sans-serif fallbacks |
| Labels, navigation, dates, badges, controls | Mono stack beginning with IBM Plex Mono |
| About name | Georgia / Times New Roman / serif |
| Home wordmark | Large uppercase Inter, weight 800 |
| Article prose | Approximately 1.05rem with 1.8 line height |

Inter weights 400, 500, 600, 700, and 800 are imported locally through `@fontsource/inter`. IBM Plex Mono is named but not bundled, so fallbacks affect rendering. Some CSS requests intermediate weights; do not assume a variable-font import exists.

The art heading references undefined `--font-serif`. Define an intentional token if standardizing this typography; do not describe an unimplemented typeface as established.

**Direction:** Maintain one primary heading, clear section headings, readable body text, and compact metadata. Reserve uppercase mono styling for short labels. Use existing fluid `clamp()` patterns and allow long titles to wrap.

## 6. Grid, spacing, and shape

The layout uses vertical rails with an `80rem` maximum. `container-page` computes width from page padding and supplies gutters and side borders. `SiteGrid` supplies the wrapper.

| Setting | Current value |
| --- | --- |
| Content maximum | `80rem` |
| Page padding | `clamp(1rem, 3vw, 5rem)` |
| Rail gutter | `clamp(0.9rem, 2vw, 1.5rem)` |
| Border width | `1px` |
| Main mobile breakpoint | `760px` |
| Tablet music layout | `761px`–`1080px` |

Most custom components use square corners, thin borders, visible alignment, large headings, and generous section spacing. Metadata is denser. Artwork brings broader colors into this structure.

**Direction:** Reuse rails and spacing before introducing a new container system. Prefer boundaries and spacing to heavy shadows. Retained older rounded daisyUI components are not the dominant direction for new pages.

## 7. Component language

| Component | Role |
| --- | --- |
| `AsciiLabel` | Technical marker with a colored number or `::`; pair with meaningful headings |
| `SiteGrid`, `container-page` | Common section alignment |
| `SiteHeader` | Compact mark, uppercase navigation, native mobile disclosure |
| `ProjectEntry` | Ownership, status, description, stack, and destination links |
| Blog rows | Editorial headline and description paired with a cover |
| `ExperienceEntry` | Native disclosure for deeper professional detail |
| `TagList` | Compact topic metadata with correct archive destinations |
| `ThemeToggle` | Fixed square control with accessible state |
| `MusicPlayer` | Optional atmosphere with explicit controls |

Keep titles understandable without hover. Avoid nested links or buttons within clickable cards. Preserve focus visibility and usable touch targets.

## 8. Imagery and art direction

Portraits establish authorship, artwork adds personality, and editorial covers identify topics. Do not present an illustration as a screenshot or measured result.

**Direction:** New covers should have a focused composition, readable structure, and colors compatible with the site. Article-specific colors are acceptable. Keep important material away from crop edges because index cards and full articles display images differently.

Alt text should explain essential content or meaning. Decorative duplicates can use empty alt text. Avoid making an image the only source of an important explanation.

Preserve artwork proportions where possible and review intentional crops on mobile. Record source and permissions for new imagery or recordings. Original drawing authorship does not imply ownership of depicted third-party characters, and public availability does not imply unrestricted reuse rights.

## 9. Motion and audio

Current motion includes split-panel page reveal, small hover shifts, image zoom, a square custom cursor on fine pointers, and spectrum bars. CSS includes reduced-motion rules; loader and cursor also handle the preference explicitly.

**Direction:** Keep motion brief and useful. Check reduced-motion behavior in the actual interaction: the audio visualizer uses JavaScript animation frames, so CSS alone does not establish that it stops.

Music begins through a user gesture. Keep pause, volume, seeking, and track information discoverable, and preserve playback across internal navigation. Audio must remain optional.

## 10. Brand beyond the website

**Direction:** Carry naming, role, palette, and the existing mark into social banners, repository graphics, presentations, and article previews. These are extension rules, not existing deliverables.

- Social graphics: prioritize name and one short role line; allow room for cropping.
- Repository covers: make the project name and function primary, with Sanfor as authorship.
- Article previews: use a specific title and relevant visual, with minimal small text.
- Presentations: use readable contrast, one clear idea per slide, and technical labels sparingly.

Verify export dimensions for the destination when creating assets. The existing preview filename alone does not establish a size standard.

## 11. Review checklist

- Correct name, role, and logo geometry.
- Consistent rails, typography hierarchy, and semantic colors.
- Clear main message before small metadata.
- Readable light/dark states and visible keyboard focus.
- Mobile wrapping and crops preserve content.
- Reduced motion and audio controls remain usable.
- Claims, asset sources, and permissions are accurate.
- Proposed conventions remain labeled until implemented.

When source and guide diverge, inspect the change and update the relevant implementation or guidance intentionally.
