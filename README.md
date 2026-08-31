# sanfor2004.github.io

Personal portfolio and technical blog for `sanfor2004`, built with Astro, React islands, Tailwind CSS 4, and daisyUI 5 for free hosting on GitHub Pages.

## What Is Included

- Home, About, Projects, Learning, Blog, Contact, and tag pages.
- Content collections for Markdown-based projects and blog posts.
- A first project writeup for 360 Vision based on defensible project facts.
- RSS feed, sitemap integration, robots.txt, canonical URLs, Open Graph metadata, and structured data.
- GitHub Actions workflow for deploying the `main` branch to GitHub Pages.
- Sanfor logo, favicon, and brand banner assets copied into `public/`.
- Public contact links only; direct private contact details should be added only when intentionally approved for this site.
- A business-style landing page with reusable Astro and React UI components.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

## Verify

```bash
npm run lint
npm run build
```

The `build` script runs `astro check` before generating the static site in `dist/`.

## UI Components

- `src/components/ui/SectionHeader.astro` provides consistent section headings and spacing.
- `src/components/react/BusinessPanels.tsx` provides React-powered metrics and clickable service panels inspired by React Bits interaction patterns.
- `src/components/PostCard.astro` renders fully clickable blog and project cards.

## Astro Docs MCP

This repository includes a project-local Codex MCP configuration at `.codex/config.toml` for the official Astro Docs MCP server.

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
pubDate: 2026-08-27
category: "Learning"
tags: ["Programming", "Cybersecurity"]
---

Write the post here.
```

Set `draft: true` in frontmatter to keep a post out of production builds.

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
- Replace `public/assets/brand/sanfor-banner.png` if you want a different Open Graph image.

## GitHub Pages

This is a root user Pages repository, so the Astro site URL is configured as:

```txt
https://sanfor2004.github.io
```

After pushing to `main`, the included GitHub Actions workflow builds the static site and deploys the `dist/` artifact to GitHub Pages. The repository settings still need Pages configured to use GitHub Actions if they are not already.
