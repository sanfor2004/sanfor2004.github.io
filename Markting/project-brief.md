# Sanfor campaign brief

Target: this workspace, `sanfor2004.github.io`. Source revision: `601715a` plus the local framework/documentation changes. Campaign preparation date: 9 September 2026. Language: English. This is an introduction to an existing portfolio, not an assertion of a new product release.

## Project facts

| Field | Finding |
| --- | --- |
| Name and ownership | Sanfor, Ahmed Abdelaziz Hanafy, handle sanfor2004 |
| Type | Personal engineering portfolio, technical writing, original art archive |
| Audience | Engineering peers, hiring leads, prospective collaborators, technical readers |
| Problem | A project/technology list alone leaves decisions, constraints, and author context unexplained |
| Method | Dedicated project writeups, articles, About/Art/Contact pages, connected through Astro routes and content collections |
| Result | Seven project writeups and four articles with routes from overview to explanation, author, and contact |
| Stack | Astro, TypeScript, Tailwind CSS, daisyUI; React integration configured but current pages primarily Astro |
| Brand | Warm tan surfaces, dark brown, orange accents, Inter headings, mono metadata, original SVG logo |
| CTA | Explore one project at https://sanfor2004.github.io/ |
| Repository | https://github.com/sanfor2004/sanfor2004.github.io |

The problem is an editorial rationale derived from what the site organizes, not a documented account of a customer complaint. Results are functional content/navigation outcomes, not measured conversion gains.

## Messaging foundation

**One sentence:** Sanfor brings Ahmed's software projects, engineering explanations, and original art into one personal portfolio.

**Two-sentence summary:** A project list leaves important decisions unexplained. Sanfor connects project writeups, technical articles, and author context so readers can explore the work and the reasoning behind it.

**Problem-led hook:** A stack list tells you the tools. Where do you find the decisions?

**Implementation-led hook:** One Markdown entry, several ways to find the article.

**Outcome-led hook:** Explore the project, read the reasoning, meet the author.

**Problem → method → result:** Project listings need context; the portfolio connects case studies, articles, and author pages; readers can follow a project from overview to a fuller explanation and a public contact channel.

## Evidence map

| Claim | Local evidence |
| --- | --- |
| Identity and public links | `src/site.ts` |
| Five main destinations | `src/pages/index.astro`, `src/site.ts` |
| Seven project entries | `src/content/projects/*.md` and generated project index |
| Four published articles | `src/content/blog/*.md` and generated blog index |
| Shared content-driven routes | `src/content.config.ts`, blog routes, `src/pages/rss.xml.ts` |
| Blog discovery and SEO | BaseLayout, RSS endpoint, Astro sitemap integration |
| Case study connects to article | `src/content/projects/360-vision.md` |
| Coordinates and JSON backup discussion | 360Vision blog article |
| Optional music and persistent player | `src/components/MusicPlayer.astro`, BaseLayout |
| Original art and author context | Art/About page data and brand guide |
| Visual identity | `src/styles.css`, `public/assets/brand/logo.svg`, `docs/BRAND-GUIDE.md` |

## Boundaries and checks

No traffic, business outcome, or customer metrics were used. No open-source license claim was made for the portfolio because a public repository alone does not establish that license. Several project entries are short summaries; the campaign does not call all of them comprehensive case studies.

Existing source and the previously built static site were inspected for this campaign. Captures were made from that local build; campaign work changes no application behavior. A prior production build passed, but this campaign does not represent a new build or a new accessibility audit. The web tool could not retrieve the live homepage during this execution, so fresh live availability is unconfirmed. The domain is grounded in the site's canonical configuration and existing deployment workflow.

## Channel checks

- [X posting help](https://help.x.com/en/using-x/how-to-post) documents ordinary posts up to 280 characters. This pack's short X copy is counted in `validation.md`; it does not depend on Premium long posts.
- [Show HN guidance](https://news.ycombinator.com/showhn.html) distinguishes things to try from reading material. This portfolio pack uses regular-submission alternatives, not a Show HN promise.
- Reddit drafts are community-neutral. No specific subreddit eligibility has been verified; select an appropriate permitted thread/community before publication.
- Other copy lengths and canvas sizes are editorial defaults. Current account-specific upload/editor restrictions were not independently validated.

All destinations are supplied for manual publication. Nothing has been posted, submitted, or scheduled externally.
