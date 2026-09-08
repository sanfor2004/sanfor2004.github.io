# sanfor2004.github.io

Personal portfolio and technical blog for `sanfor2004`, built with Astro, React islands, Tailwind CSS 4, and daisyUI 5 for free hosting on GitHub Pages.

## Portfolio Documentation

- [Portfolio & Writing Handbook](docs/PORTFOLIO-HANDBOOK.md): product idea, audience, page strategy, architecture, content templates, and publishing workflow.
- [Brand Guide](docs/BRAND-GUIDE.md): naming, voice, logo use, colors, typography, layout, imagery, and motion.
- [AGENTS.md](AGENTS.md): instructions for coding and editorial agents, validation, and publishing boundaries.
- [Social Media Launch Framework](social_media_launch_framework.md): reusable instructions to inspect any target project, write complete problem/method/result posts, and create branded preview images and carousel slides.

## What Is Included

- Home, About, Projects, Learning, Blog, Contact, and tag pages.
- Content collections for Markdown-based projects and blog posts.
- Markdown project writeups and technical articles based on project evidence.
- RSS feed, sitemap integration, robots.txt, canonical URLs, Open Graph metadata, and structured data.
- GitHub Actions workflow for deploying the `main` branch to GitHub Pages.
- Sanfor logo, favicon, and brand banner assets copied into `public/`.
- Public contact links only; direct private contact details should be added only when intentionally approved for this site.
- A warm editorial landing page, original art gallery, persistent music player, and light/dark themes.

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
npm run build
```

The `build` script runs `astro check` before generating the static site in `dist/`.

## UI Components

- `SiteGrid.astro` and `AsciiLabel.astro` provide shared structure and technical labels.
- `ProjectEntry.astro` renders project cards; `PostCard.astro` is used on project tag archives.
- `MusicPlayer.astro` persists audio across internal navigation.
- `BusinessPanels.tsx` and `ui/SectionHeader.astro` remain available but are not used by current pages.

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
repo: "https://github.com/sanfor2004/example"
---

Describe the project, constraints, tradeoffs, and future improvements.
```

Optional fields include `updatedDate`, `demo`, and `draft`.

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
