# Sustainable discovery

The intended journey is Search → useful technical article → related explanation or project → About → GitHub/Contact. The site now supports this with descriptive metadata, genuine topic archives, article breadcrumbs, related links, project case studies, and concise closing navigation. These are discovery paths, not evidence of increased traffic or client conversion.

## Search and cornerstone resources

Choose real reader questions in Systems, Backend, Linux, C++, Networking, Databases, Performance, and Architecture. Build fewer, stronger resources with runnable examples, supported decisions, failure modes, and limitations. Keep standard engineering terminology and plain explanations.

The first complete cluster is Design Patterns in C++: the existing overview links 23 articles, each links its parent and related patterns, and sequential links provide a reading path. Contextual project links should be added only where implementation evidence supports them. Do not imply every project implements these patterns.

Future guides might cover Linux for Backend Engineers, networking fundamentals, or C++ systems programming. Start each as a draft Markdown article, gather evidence, then link genuine supporting articles. The current collection and tags already support hubs; do not create empty landing pages for planned content.

## GitHub and professional discovery

Keep Ahmed Abdelaziz (Sanfor) and Systems & Backend Software Engineer consistent across website, GitHub, LinkedIn, CV, and developer profiles where appropriate. Do not invent new accounts or claims.

For each repository already linked by a case study, add a concise README link back to that case study when editing that external repository is authorized. Suggested mapping:

| Repository | Website case study |
| --- | --- |
| `360vesion` | `https://sanfor2004.github.io/projects/360-vision/` |
| `php-hls-streamer` | `https://sanfor2004.github.io/projects/php-hls-streamer/` |
| `XDGe` | `https://sanfor2004.github.io/projects/xdge/` |
| `Multi-Region-Tag-Translator-i18n` | `https://sanfor2004.github.io/projects/multi-region-tag-translator/` |
| `Fitness-Coach-Website` | `https://sanfor2004.github.io/projects/fitness-coach-website/` |
| `XGS` | `https://sanfor2004.github.io/projects/xgs/` |
| `XCVE` | `https://sanfor2004.github.io/projects/xcve/` |
| `23-Design-Patterns` | `https://sanfor2004.github.io/blog/design-patterns-overview/` |

Use specific anchors such as “Architecture and limitations of the local tour studio.” Case studies already link their repositories. No external repositories were edited as part of this upgrade.

## Useful tools, when justified

No empty `/tools/` page is generated. When the first useful tool is ready, implement its route as `src/pages/tools/<slug>.astro` using BaseLayout, static instructions, and a small browser module. Keep inputs local; explain edge cases and provide accessible controls. Examples could include a timestamp converter or CIDR calculator, but neither exists yet.

Create a tools index only when it offers a real working destination. Add tool-specific structured data only when accurate, include it in navigation where useful, and add a typed `tool_use` event containing a fixed tool ID and no user input. Existing sitemap integration will discover the route. A backend is unnecessary for simple local transformations.

## Community distribution and measurement

Share the engineering lesson, experiment, or usable resource in relevant communities, with enough context to help readers before they visit. Respect community rules; avoid repeated portfolio-only promotion. RSS supports ongoing discovery without a newsletter backend. Campaign preparation remains governed by the separate social launch framework; this upgrade does not publish messages or run a campaign.

Review Search Console queries and landing pages to identify real reader needs. Use GA article/project views and GitHub/Contact actions to understand onward discovery. Compare trends over meaningful periods without inventing targets or attributing every change to SEO. Improve unclear resources and broken journeys before adding more pages. See [SEO.md](SEO.md) and [ANALYTICS.md](ANALYTICS.md) for owner setup and publishing checks.
