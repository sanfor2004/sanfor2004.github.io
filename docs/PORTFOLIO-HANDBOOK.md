# Sanfor Portfolio & Writing Handbook

Baseline: 9 September 2026. This document explains the portfolio's product idea, current implementation, editorial practice, and future direction. Recommendations are labeled **Direction**; they are not claims of shipped functionality.

Related documents: [Brand Guide](BRAND-GUIDE.md), [Agent Instructions](../AGENTS.md), [README](../README.md).

## 1. Purpose and positioning

Sanfor is the personal portfolio of Ahmed Abdelaziz Hanafy, a software engineer focused on systems and backend engineering. It connects professional experience, implemented projects, technical explanations, and original art under one recognizable identity.

The site helps visitors answer four questions: Who is Ahmed? What has he built? How does he reason about engineering? How can I contact him?

**Direction:** Treat the portfolio as a growing record of engineering judgment. Case studies explain decisions and outcomes, articles preserve investigations and lessons, and the art archive shows the person behind the software. Prioritize specific evidence, readable explanations, and clear next actions.

| Identity field | Current value |
| --- | --- |
| Brand | Sanfor |
| Display wordmark | SANFOR |
| Full author name | Ahmed Abdelaziz Hanafy |
| Short display name | Ahmed Abdelaziz |
| Handle | sanfor2004 |
| Role | Software Engineer — Systems & Backend |
| Site | https://sanfor2004.github.io |
| Focus | Systems programming, backend architecture, Linux, networking, performance |
| Public channels | GitHub, LinkedIn, TryHackMe |

The identity source is [src/site.ts](../src/site.ts). Security, automation, full-stack work, and creative experiments support this primary identity.

**Direction — suggested positioning:** “I build reliable backend services and practical software tools, and write about the decisions, experiments, and lessons behind them.” This is suggested copy, not an automatic replacement for current metadata.

## 2. Audience and journeys

| Audience | Need | Useful journey |
| --- | --- | --- |
| Hiring managers and engineering leads | Role fit, credible experience, technical depth | Home → About → case study → Contact |
| Collaborators and clients | Relevant work, ownership, communication | Projects → case study → public profile |
| Engineers and learners | Useful explanations and inspectable examples | Article → topic archive → repository or RSS |
| Creative visitors | Drawings and the author's personality | Home → Art → About |

**Direction:** Give each page one main purpose and an obvious next action. Evaluate success through useful conversations, project exploration, returning readers, and article usefulness. Do not invent analytics results or conversion targets.

## 3. Information architecture

| Route | Current behavior |
| --- | --- |
| `/` | Large SANFOR entrance, engineering identity, five destinations; internal-page header omitted |
| `/about/` | Portrait, biography, summary, seven most recent projects, experience disclosures, skills |
| `/projects/` | Published projects ordered by publication date |
| `/projects/<slug>/` | Markdown case study, status, role, stack, tags, optional repository/demo links |
| `/blog/` | Writing index with covers and browser-side search |
| `/blog/<slug>/` | Article or blog topic archive; article slugs win matching tag collisions |
| `/tags/<tag>/` | Project tag archive only |
| `/art/` | Fourteen artwork entries with captions and alternative text |
| `/contact/` | Public profiles; no submission backend |
| `/learning/` | Existing learning overview outside primary navigation |
| `/rss.xml` | Published blog metadata feed |

Navigation labels are About, Projects, Writing, Art, and Contact. “Writing” points to `/blog/`; some page copy uses “Blogs.” Preserve established URLs when changing labels. The footer adds RSS and GitHub.

The shared shell includes a persistent music player, horse drawing, footer, theme toggle, page loader, and custom pointer enhancement.

## 4. Page and portfolio strategy

### Home

Establish identity quickly through the wordmark, role, interests, and numbered navigation. Detailed biography and project explanations belong on their destination pages.

### About

The page combines portrait and introduction with summary, selected work, experience, and skills. Experience entries list Skylimit LLC and Fiverr. Existing impact figures are published owner claims, not independently audited results. Preserve their meaning and do not extrapolate accomplishments.

**Direction:** Connect skills to evidence, distinguish personal contribution from team output, and review dates and public metrics when substantive updates are requested.

### Projects

Seven writeups currently describe 360 Vision, PHP HLS Streamer, XDGe, Multi-Region Tag Translator, Fitness Coach Website, XGS, and XCVE. These are descriptions of separate repositories; their applications are not implemented here.

360 Vision has a fuller case study, while several entries remain short summaries. **Direction:** Expand them from real source material using problem, role, constraints, implementation, decisions, evidence, limitations, and next steps. A short accurate summary is better than invented depth.

### Writing

Four articles currently cover a technical learning loop, background job reliability, the AI/reference/review workflow behind Mint Woodland Pet, and the local 360Vision tour studio. The [360Vision article notes](360VISION-ARTICLE-NOTES.md) record its evidence, assets, and SEO handoff.

**Direction:** Make titles specific enough to reveal the question or result. Favor reproducible examples, explained failures, and explicit limits. Link to actual project evidence when an article describes personal work.

### Art and contact

Art is a first-class personal destination. Preserve accurate descriptions and distinguish authorship of drawings from ownership of any third-party characters depicted.

Contact directs visitors to public profiles. Add private contact details only when the owner requests or supplies them for publication. A new static form needs real message delivery before it can promise success.

## 5. Editorial pillars and voice

**Direction:** Use these pillars to choose topics; they do not require new navigation sections.

| Pillar | Subjects | Useful evidence |
| --- | --- | --- |
| Systems and backend | Queues, APIs, databases, concurrency | Decisions, failure cases, runnable examples |
| Linux, networking, performance | Processes, sockets, measurement, debugging | Commands, environment, measurements |
| Project engineering | Constraints, implementation, iteration | Screenshots, code, ownership, tested behavior |
| Security fundamentals | Authentication, validation, defensive review | Authorized scope, assumptions, safe examples |
| Learning and creative tooling | Study experiments, AI assets, native software | Process, rejected candidates, validation, limits |

Write in clear English with concrete verbs. Use first person for personal experience and neutral language for general explanations. The existing About page uses third person; keep each surface internally consistent.

Separate measurements from estimates and plans. Explain acronyms when needed. Do not invent benchmarks, clients, certifications, testimonials, deployments, or results. AI-assisted writing must preserve the author's actual experience. For creative AI workflows, describe the real roles of references, generation, selection, tooling, and review.

## 6. Content schema and publication behavior

[src/content.config.ts](../src/content.config.ts) is authoritative. Both collections load `**/*.md`. MDX is not configured merely because some route code strips `.mdx` extensions.

| Field | Blog | Projects |
| --- | --- | --- |
| `title`, `description`, `pubDate` | Required | Required |
| `updatedDate` | Optional date | Optional date |
| `image` | Required string | Optional string |
| `imageAlt`, `category` | Required strings | Not declared |
| `imageWidth`, `imageHeight` | Optional positive integer cover dimensions | Not declared |
| `tags` | String array, default `[]` | String array, default `[]` |
| `draft` | Boolean, default `false` | Boolean, default `false` |
| `status`, `role` | Not declared | Required strings |
| `stack` | Not declared | String array, default `[]` |
| `repo`, `demo` | Not declared | Optional valid URLs |

Filtering checks `draft`, not the current date. Future dates do not schedule publication. Drafts are excluded from generated routes and indexes, including ordinary local development. Previewing a draft requires Markdown review or an intentional temporary local publication setting; do not commit that temporary setting accidentally.

Lists sort by `pubDate`; `updatedDate` does not move an entry to the top. Articles display updated dates and include them in structured data. Project detail pages currently do not surface `updatedDate` or pass their optional image to social metadata.

### Blog starter

Create `src/content/blog/descriptive-article-slug.md`:

```md
---
title: "What I Learned from a Small Queue Experiment"
description: "An experiment in handling duplicate jobs and making worker failures visible."
image: "/images/writing/background-job-pipeline.svg"
imageAlt: "An API feeds a queue connected to workers, a retry path, and a database."
pubDate: 2026-09-09
category: "Systems"
tags: ["Backend", "Queues", "Reliability"]
draft: true
---

## The question

State the specific problem and why it matters.

## The experiment

Describe the real setup, assumptions, and reproducible steps.

## What happened

Report observations, failures, and evidence.

## Decisions and limits

Explain tradeoffs and what the experiment does not establish.

## What I would use again

Give a practical takeaway and relevant references.
```

This uses an existing illustration as an example. Choose a relevant final cover and accurate alt text, dates, and permissions before publication.

### Project starter

Create `src/content/projects/descriptive-project-slug.md`:

```md
---
title: "Project Name"
description: "Who the project serves and the concrete problem it solves."
pubDate: 2026-09-09
tags: ["Backend", "Developer Tools"]
status: "Prototype"
role: "Project owner and developer"
stack: ["TypeScript"]
draft: true
---

## Problem and context

## My role

## Implementation

## Decisions and tradeoffs

## Results and evidence

## Limitations and next steps
```

Replace placeholders with supported facts. Add `repo` and `demo` only when real destinations are available.

### Tags and URLs

Use descriptive lowercase, hyphen-separated filenames and preserve published slugs. Tag normalization currently lowercases and replaces spaces with hyphens; punctuation remains. Reuse existing spelling and check collisions or punctuation such as `C++` in generated routes.

Blog tags use `/blog/`; project tags use `/tags/`. Avoid naming an article exactly like a blog tag slug unless article precedence is intentional.

### Editorial workflow

1. Identify the reader's question and gather evidence.
2. Draft with `draft: true`, accurate metadata, and a relevant cover.
3. Review facts, ownership, examples, references, and alt text.
4. Inspect a rendered local preview, using an intentional draft-preview approach.
5. Check mobile reading, code overflow, metadata, and archive links.
6. Set `draft: false` when publication is intended and run the build.
7. Publish through the authorized repository workflow; pushing to `main` triggers deployment.
8. Preserve the URL and set an accurate `updatedDate` for substantive revisions.

## 7. Architecture and editing map

Astro generates static output. React integration is configured, but the retained `BusinessPanels.tsx` component is not used by current pages. Most UI uses Astro markup and browser scripts. Tailwind CSS 4 and daisyUI 5 integrate through Vite; custom CSS defines the portfolio's appearance.

| Location | Responsibility |
| --- | --- |
| `src/site.ts` | Identity, public links, navigation |
| `src/layouts/BaseLayout.astro` | Shared document, SEO, analytics, client router, global components |
| `src/pages/` | Routes and static path generation |
| `src/content.config.ts` | Content loading and validation |
| `src/content/` | Authored projects and articles |
| `src/components/` | Shared UI and interactions |
| `src/styles.css` | Tokens, themes, layout, responsive and motion rules |
| `src/music.ts` | Audio registry |
| `public/` | Files copied directly to output |
| `.github/workflows/deploy.yml` | Build and deployment |

`ClientRouter` handles internal navigation. Enhancements use Astro lifecycle events and initialization guards. Music uses `transition:persist` to survive navigation, Web Audio for spectrum bars, and localStorage for track and volume. Theme selection uses `sanfor-theme`, with light as the default.

There is no application database, authentication service, CMS, newsletter delivery, or contact backend in this repository. Adding one changes the architecture and product scope.

## 8. Discovery, analytics, and assets

The layout supplies titles, descriptions, canonical URLs, Open Graph/Twitter cards, RSS discovery, large-image preview permission, and default ProfilePage/Person structured data. Articles provide BlogPosting data, author links, social image alternatives and optional dimensions, and publication/modification metadata; projects provide CreativeWork data. A sitemap integration and robots.txt are configured.

Google Analytics is included in the layout. Presence of the script does not prove accurate navigation events or conversion tracking. Check internal navigation when changing analytics, and keep private information out of events.

Images under `public/` are served as provided. Several gallery files are large. **Direction:** Optimize delivery sizes and formats while retaining original creative source assets where appropriate. This is not an existing automatic optimization pipeline.

Audio attribution and stated licenses are documented in [public/audio/README.md](../public/audio/README.md). Preserve provenance when replacing tracks and keep playback user-initiated.

## 9. Development and quality

Use `npm ci`, `npm run dev`, and `npm run build`. The build runs `astro check` before generating `dist/`. `npm run lint` also runs `astro check`; there is no dedicated lint engine or configured test script. Playwright is a dependency, not evidence of an existing suite.

On Windows, use `npm.cmd` when PowerShell blocks `npm.ps1`. CI specifies Node 22; check installed package engines when resolving compatibility. Report missing dependencies and failures accurately.

For visible changes, review desktop/mobile layouts, both themes, keyboard focus, reduced motion, navigation, and the affected controls. Documentation-only work normally needs factual, link, and diff checks rather than a full browser run.

GitHub Actions builds on pushes to `main` or manual dispatch, installs dependencies, builds `dist/`, and deploys the artifact. Pages settings must use GitHub Actions. A successful local build does not establish successful live deployment.

## 10. Known gaps and future direction

These observations are not completed fixes or an instruction to change everything:

- Blog search looks for its count within the form, although the count is outside it. Filtering can work while the count remains unchanged.
- Older unused components and business/ASCII styles remain; check references before cleanup.
- IBM Plex Mono is named without a bundled import, and the art heading references an undefined `--font-serif` token.
- Learning and project tag pages retain older presentation patterns.
- The loader requires JavaScript to reveal content; consider progressive enhancement when improving resilience.
- Some existing music/theme localStorage accesses are unguarded.

**Direction — near term:** Expand supported case studies, address small interaction gaps, optimize image delivery, and align auxiliary page styling.

**Direction — later:** Add related articles, reading aids, or a richer learning archive when content volume supports them. Newsletter delivery, external search, a CMS, or a backend require an explicit product reason.

Update this handbook when routes, schemas, workflow, or known gaps change. Keep proposals labeled until implemented.
