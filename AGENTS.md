# Repository Instructions for Agents

## Scope and purpose

These instructions apply throughout this repository. Follow the user's current request and applicable higher-priority instructions. This file guides coding and editorial work; it does not authorize unrelated refactors, external messages, publishing, or changes to the owner's identity.

Sanfor is Ahmed Abdelaziz Hanafy's portfolio, technical blog, and art archive. Its professional focus is systems and backend engineering, Linux, networking, and performance. Preserve factual accuracy, personal voice, and the established warm visual identity.

## Read before changing

- Read [README.md](README.md) for local operation.
- Read [Portfolio Handbook](docs/PORTFOLIO-HANDBOOK.md) for product, content, route, and publication behavior.
- Read [Site Architecture](docs/SITE-ARCHITECTURE.md) for build flow, pattern articles, browser state, and maintenance paths.
- Read [Brand Guide](docs/BRAND-GUIDE.md) for visual or public-copy work.
- Inspect the relevant implementation. Proposed direction in documentation is not shipped functionality.
- Check `git status --short` and preserve unrelated user changes.

## Architecture and source of truth

This is an Astro static site at `https://sanfor2004.github.io`, using TypeScript, Tailwind CSS 4, daisyUI 5, and configured React integration. Current pages mostly use Astro markup and browser scripts. A server requirement is an architecture change for GitHub Pages.

| Concern | Source |
| --- | --- |
| Identity, contacts, navigation | `src/site.ts` |
| Shared shell, SEO, analytics, client router | `src/layouts/BaseLayout.astro` |
| Content schema/loaders | `src/content.config.ts` |
| Authored articles/projects | `src/content/blog/`, `src/content/projects/` |
| Pattern articles | `src/content/blog/design-pattern-*.md`, `src/content/blog/design-patterns-overview.md` |
| Stable series identities and legacy redirects | `src/data/design-pattern-series.mjs` |
| Article, asset, link, and C++ verification | `scripts/verify-pattern-posts.mjs` |
| Routes | `src/pages/` |
| Shared UI | `src/components/` |
| Themes and styling | `src/styles.css` |
| Music and attribution | `src/music.ts`, `public/audio/README.md` |
| Assets | `public/` |
| Deployment | `.github/workflows/deploy.yml` |
| Prepared campaign, outside the site build | `Markting/` |

Portfolio writeups describe separate projects; do not assume their source code exists here.

## Commands and environment

```sh
npm ci
npm run dev
npm run lint
npm run verify:patterns
npm run build
npm run preview
```

- CI uses Node 22; inspect package engines for compatibility issues.
- Use `npm.cmd` if Windows PowerShell blocks `npm.ps1`; do not change machine execution policy for routine npm use.
- `lint` runs `astro check`. `build` runs that check and generates `dist/`.
- There is no configured test script. Playwright availability does not imply a test suite.
- Missing `cross-env` can indicate unavailable dependencies; inspect installation state.
- Report unavailable checks and actual failures. Do not claim a successful build, test, or deployment without evidence.

## Implementation conventions

- Prefer Astro for static presentation; use hydrated React when interaction complexity warrants it.
- Reuse components and semantic CSS tokens. Follow two-space indentation, double-quoted TypeScript strings, and existing semicolon style.
- Keep text UTF-8. Read explicitly as UTF-8 when terminal punctuation appears corrupted; verify actual content before repairing apparent mojibake.
- Make focused changes without incidental dependency additions or broad formatting.
- Use patch-based edits. Do not fix source issues in generated output or dependencies.
- Preserve published URLs and root-relative paths for this root user Pages site.
- Blog and project collections load Markdown only. Learning and its MDX integration have been removed; do not restore them incidentally.
- Check references before deleting apparently unused components or styles.

## Client navigation and state

`BaseLayout` uses Astro `ClientRouter`. Enhancements must work on direct loads, internal navigation, and back/forward navigation.

- Initialize page DOM behavior on appropriate Astro lifecycle events, commonly `astro:page-load`.
- Guard against duplicate listeners and initialization on the same element.
- Avoid stale references to nodes replaced by navigation; inspect persistence before choosing a lifecycle strategy.
- MusicPlayer and MusicPrompt are not mounted. Do not restore them incidentally. If audio is restored, preserve `transition:persist` and verify playback continuity.
- The layout retains document language/direction support, but current articles are English. Former Arabic lesson URLs redirect to the corresponding English articles.
- Preserve theme state and accessible toggle labels across navigation.
- Handle blocked or malformed localStorage in new or modified storage code.
- Keep audio user-initiated and clean up animation/audio resources when a changed lifecycle requires it.

## Content and editorial rules

- Never invent achievements, metrics, employment, clients, qualifications, project behavior, URLs, sources, or ownership claims.
- Existing About metrics are published owner claims; preserve meaning and do not extrapolate.
- Blog entries require `title`, `description`, `pubDate`, `image`, `imageAlt`, and `category`.
- Optional `imageWidth` and `imageHeight` must be positive integers matching the actual cover; they supply layout dimensions and social metadata.
- Projects require `title`, `description`, `pubDate`, `status`, and `role`.
- Both support `tags`, `draft`, and optional `updatedDate`. Projects additionally support `stack`, optional `image`, `repo`, and `demo`.
- Use `draft: true` for unfinished content unless publication-ready work is requested. Drafts are excluded from ordinary routes, including local development.
- Future dates do not hide content. Publication filtering checks `draft`.
- Preserve original `pubDate`; use an accurate `updatedDate` for substantive revisions.
- Reuse tag spelling. Normalization only lowercases and replaces spaces; check collisions and punctuation.
- Blog topic links use `/blog/<tag>/`; project topics use `/tags/<tag>/`. Articles take precedence over matching blog tag slugs.
- Keep example frontmatter schema-valid and referenced assets real.
- Ground technical claims in appropriate primary evidence when needed; local facts can be established from source files.
- Keep private information and secrets out of content, assets, logs, and browser code.

## Pattern article maintenance

- The series is 24 English Markdown posts: one overview and 23 individual patterns. Titles use `Pattern Name (Creational Pattern)`, `(Structural Pattern)`, or `(Behavioral Pattern)`.
- Keep the overview linked to every pattern, and preserve backlinks, related-article links, repository links, code, expected output, and image explanations in each post.
- The source material is the owner's separate `23-Design-Patterns` repository. Published C++ snippets are actual examples from that repository, not the former four-language printing scaffold.
- `src/data/design-pattern-series.mjs` supplies stable identities and 48 legacy redirects. Keep old Learning URLs as redirects, excluded from the sitemap; do not recreate the removed section.
- Covers and SVG diagrams live in `public/images/writing/patterns/`. Preserve its README and SOURCE-LICENSE.txt. Original cover paths under `public/images/learning/patterns/` remain as compatibility assets.
- Edit articles directly; there is no lesson generator or MDX wrapper. Build does not require another checkout.
- Run `npm run verify:patterns` when changing the series. It checks publication structure and compiles the exact displayed C++20 code when a compiler is available; CI requires one. Use a Visual Studio developer shell for MSVC. Temporary output uses a unique `tmp/pattern-posts-*` directory removed after the run.
- Stdout checks validate the demonstrated scenarios, not every possible input or challenge. Preserve limitations on concurrency, ownership, and external effects.

## Brand, accessibility, and assets

- Preserve Sanfor/SANFOR naming and role unless the user requests a change.
- Reuse `SiteGrid`, `container-page`, `AsciiLabel`, and existing component patterns.
- Use semantic tokens such as `--color-bg`, `--color-text`, and `--color-accent`; inspect both themes.
- Maintain warm surfaces, orange accents, thin borders, strong headings, mono metadata, original art, and restrained motion.
- Preserve logo geometry and source artwork; do not automatically regenerate or overwrite them.
- Keep meaningful headings, image alternatives, keyboard access, focus, and control names.
- Do not nest links/buttons inside an encompassing card link.
- Respect reduced motion and avoid reliance solely on hover, color, sound, or the custom pointer.
- Size new assets for delivery. Files in `public/` do not receive automatic responsive optimization.
- Preserve audio attribution and new asset provenance; public availability does not establish reuse rights.

## SEO and integrations

For social launch or campaign requests, read [social_media_launch_framework.md](social_media_launch_framework.md) completely and follow its execution workflow. Use the explicitly requested project, or the active workspace by default. Produce finished copy and actual image files using that project's evidence, logo, and assets. An instruction to edit the framework does not itself request a campaign run. Keep external publication separate from preparation and follow the user's authorization.

- Preserve canonical URLs, descriptions, social images, RSS discovery, and appropriate structured data.
- Check generated routes, archives, sitemap, and RSS when changing collections or routing.
- `/testblog/` is an unlisted but generated visual prototype using published blog entries. Preserve its `noindex, nofollow` metadata and sitemap exclusion unless its publication scope is explicitly changed. It is not a private draft preview.
- Coordinate domain changes across site configuration, Astro configuration, robots.txt, and URL assumptions.
- Do not replace analytics identifiers or add tracking as incidental cleanup.
- Forms must have real submission behavior before displaying delivery success.
- Keep public channels in site configuration. Add private contacts only when supplied or requested for publication.

## Validation

For documentation-only changes, check relative links, paths, examples, factual consistency, and `git diff --check`. A build is generally unnecessary unless application or content loading behavior also changes.

For code/content changes, run `npm run build` when dependencies are available. Inspect generated routes when changing slugs, tags, drafts, or schemas. Add tests for meaningful behavior, not merely to mirror implementation.

Pattern changes additionally require `npm run verify:patterns` as described above. The ignored GoF PDF is private and must never be published or committed.

For visible changes, review affected pages at mobile and desktop widths in both themes. Check keyboard access, wrapping, image loading, overflow, and reduced motion. Shared-shell changes also require internal navigation, language/direction, and theme continuity checks; check music persistence only if the player is mounted. State any unavailable browser verification.

Review the final diff and report what changed, validation, and relevant unresolved limitations.

## Existing issues to inspect when relevant

This baseline is not a standing request to fix everything:

- Blog search now queries the count at document scope. Its search and masonry enhancement exists only on `/blog/`, not topic archives or `/testblog/`.
- `BusinessPanels`, `MusicPlayer`, `MusicPrompt`, `IllustrationSlot`, `PageHeader`, and `SectionHeader` have no current consumers; verify references before cleanup.
- IBM Plex Mono is named without an import; `--font-serif` is undefined.
- Loader reveal depends on JavaScript.
- The theme toggle click writes localStorage without a guard before applying the theme; layout restoration catches storage errors. Dormant music storage accesses are also unguarded.
- Optional project images and updated dates are not fully surfaced on detail pages.
- The deployment workflow uses the Ubuntu runner's C++ compiler for the article examples; there are no Go, Java, or Python example toolchain steps.

Update these notes when the implementation changes.

## Repository and publishing discipline

- Preserve user work and avoid destructive Git operations.
- Keep dependency changes intentional and lockfiles consistent.
- Do not commit secrets, caches, browser profiles, or temporary verification artifacts.
- Pushing to `main` triggers deployment. Push, publish, or dispatch only when authorized by the task or session.
- Do not send external messages without authorization.
- Keep these instructions and the handbook aligned with material architecture and workflow changes.
