# sanfor2004.github.io

Sanfor is Ahmed Abdelaziz Hanafy's portfolio, technical blog, English design-pattern article series, and art archive. Astro generates a static site for GitHub Pages. The UI uses Astro components, browser scripts, Tailwind CSS 4, and daisyUI 5; React integration is configured but no React island is currently mounted.

## Portfolio Documentation

- [Portfolio & Writing Handbook](docs/PORTFOLIO-HANDBOOK.md): product idea, audience, page strategy, architecture, content templates, and publishing workflow.
- [Site Architecture](docs/SITE-ARCHITECTURE.md): source-to-page flow, route inventory, browser behavior, pattern maintenance, and deployment details.
- [Brand Guide](docs/BRAND-GUIDE.md): naming, voice, logo use, colors, typography, layout, imagery, and motion.
- [AGENTS.md](AGENTS.md): instructions for coding and editorial agents, validation, and publishing boundaries.
- [Social Media Launch Framework](social_media_launch_framework.md): reusable instructions to inspect any target project, write complete problem/method/result posts, and create branded preview images and carousel slides.

## What Is Included

- Home, About, Projects, Blog, Art, Contact, and tag pages.
- A 24-post English design-pattern series: an overview plus all 23 GoF patterns, preserving the earlier illustrations and adding the owner's C++20 examples and diagrams.
- Content collections for Markdown-based projects and blog posts.
- Markdown project writeups and technical articles based on project evidence.
- RSS feed, sitemap integration, robots.txt, canonical URLs, Open Graph metadata, and structured data.
- GitHub Actions workflow for deploying the `main` branch to GitHub Pages.
- Sanfor logo, favicon, and brand banner assets copied into `public/`.
- Public contact links only; direct private contact details should be added only when intentionally approved for this site.
- A warm editorial landing page, original art gallery, and light/dark themes.

## Local Development

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro.

CI uses Node 22. On Windows, use `npm.cmd` when PowerShell blocks `npm.ps1`.

## Verify

```bash
npm run lint
npm run verify:patterns
npm run build
```

The `build` script runs `astro check` before generating the static site in `dist/`.
`verify:patterns` checks all 24 series posts, images, internal links, and legacy redirects. It compiles the 23 published C++20 examples and compares their output when a compiler is available; CI requires a compiler. With MSVC, run from a Visual Studio developer shell so headers and libraries are available.

Use `npm run preview` to serve the completed `dist/` build locally. There is no general `npm test` script or configured browser test suite.

## Design Patterns

The series starts at `/blog/design-patterns-overview/`. Each individual article uses `/blog/design-pattern-<slug>/` and a title such as **Abstract Factory (Creational Pattern)**. The overview links all 23 posts; each post links back, to related articles, and to the original repository source.

Edit the Markdown files in `src/content/blog/` directly. Examples and diagrams were adapted from the owner's [23-Design-Patterns repository](https://github.com/sanfor2004/23-Design-Patterns); this site does not depend on a neighboring checkout at build time. Stable slugs and legacy redirect mappings live in `src/data/design-pattern-series.mjs`.

Learning is no longer a navigation destination or a content collection. Its 48 former hub/English/Arabic URLs redirect to the English blog series. No Arabic lesson UI remains. New covers and diagrams are in `public/images/writing/patterns/`; old cover URLs are retained for compatibility. Source attribution and image provenance are recorded beside the new assets.

The purchased GoF PDF remains private and ignored. Do not commit or publish it.


## UI Components

- `SiteGrid.astro` and `AsciiLabel.astro` provide shared structure and technical labels.
- `ProjectEntry.astro` renders project cards; `PostCard.astro` is used on project tag archives.
- `MusicPlayer.astro` remains available in source but is not mounted in the shared layout.
- `BusinessPanels.tsx`, `MusicPrompt`, `IllustrationSlot`, `PageHeader`, and `ui/SectionHeader.astro` remain available but are not used by current pages.

The shared layout handles metadata, client navigation, theme restoration, document language/direction, the page loader, footer, horse illustration, and custom cursor. Blog search filters title, description, category, and tags in the browser; it does not search article bodies.

`/testblog/` is a generated visual prototype using published posts. It is unlisted, marked `noindex, nofollow`, and excluded from the sitemap; it is still publicly accessible when deployed.

## Astro Docs MCP

An optional local configuration can connect to the official Astro Docs MCP server. `.codex/` is ignored and is not part of this tracked checkout.

- Server: `Astro Docs`
- URL: `https://mcp.docs.astro.build/mcp`
- Transport: Streamable HTTP through `mcp-remote`

Codex can use this MCP server to consult current Astro documentation while working on the site.

## Add A Blog Post

Create a Markdown file in `src/content/blog`.

```md
---
title: "Post Title"
description: "One sentence summary for SEO and cards."
image: "/images/writing/background-job-pipeline.svg"
imageAlt: "An API feeds a queue connected to workers, a retry path, and a database."
pubDate: 2026-08-27
category: "Learning"
tags: ["Programming", "Cybersecurity"]
draft: true
---

Write the post here.
```

Choose a relevant image and accurate alt text. Set `draft: true` to exclude unfinished posts from generated routes, including local development. Future dates do not schedule publication. See the handbook for complete templates.

## Add A Project

Create a Markdown file in `src/content/projects`.

```md
---
title: "Project Name"
description: "What the project does and why it matters."
pubDate: 2026-08-27
tags: ["TypeScript", "Security"]
status: "Active project"
role: "Project owner and developer"
stack: ["Astro", "TypeScript"]
draft: true
---

Describe the project, constraints, tradeoffs, and future improvements.
```

Replace the sample metadata with real project facts. Optional fields include `updatedDate`, `image`, `repo`, and `demo`; only add repository/demo URLs that exist. Remove `draft: true` when ready to publish.

## Edit Site Details

- Update site-wide title, description, GitHub URL, and public contact links in `src/site.ts`.
- Edit biography and experience text in `src/pages/about.astro`.
- Replace `public/assets/brand/sanfor-linkedin-preview-2026.png` if you want a different Open Graph image.

## GitHub Pages

This is a root user Pages repository, so the Astro site URL is configured as:

```txt
https://sanfor2004.github.io
```

After pushing to `main`, the included GitHub Actions workflow builds the static site and deploys the `dist/` artifact to GitHub Pages. The repository settings still need Pages configured to use GitHub Actions if they are not already.

The workflow runs pattern verification before the build and also supports manual dispatch. Local build success does not confirm deployment. Only `dist/` is uploaded: repository documentation and the prepared [Markting campaign](Markting/README.md) are not site routes. Files in `public/`, including retained audio and provenance files, are copied to output even when no page links to them.
