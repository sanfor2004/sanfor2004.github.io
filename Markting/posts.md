# Sanfor social launch copy

Campaign: the Sanfor portfolio, not a separate 360Vision product launch. Copy is written in Ahmed's voice. Each copy block is ready to select; surrounding notes are not part of the post. External publication has not been performed. Image alt text is supplied in [assets.md](assets.md).

## LI-01 — LinkedIn / introduce the portfolio

Angle: show the reasoning behind the work. Attachment: [landscape preview](images/social-preview-landscape.png). Alt: Sanfor portfolio preview with its orange logo, a real home-page screenshot, and the headline The work. The thinking. The person.

### Copy to publish

```text
A project list can tell you what someone built. It takes more context to understand how they think.

That is the idea behind my portfolio, Sanfor.

I wanted the work and the explanation to sit together: the problem a project addresses, the decisions behind its implementation, and what is actually available today.

I built the site with Astro and organized it around projects, technical writing, an About page, and an original art archive. Project writeups point to the work. Articles make room for the details that do not fit inside a card: storage tradeoffs, failure behavior, review loops, and unfinished questions.

There are currently seven project writeups and four articles to explore, including a closer look at 360Vision and a note on background job reliability.

The result is a place where a visitor can move from a project overview to the reasoning behind it, then find the person and public contact channels behind the work.

My main focus is systems and backend engineering, Linux, networking, and performance. The art is there because it is part of me too.

Explore the portfolio: https://sanfor2004.github.io/
```

Publishing note: use the main landscape attachment. This is an introduction, not a claim that the site launched today. Evidence: project collections, blog collections, site navigation, About/Art/Contact routes.

## LI-02 — LinkedIn / one source for several reading paths

Angle: content architecture. Attachment: [carousel slide 3](images/carousel-03.png). Alt: Three connected portfolio sections: Projects for the build, Writing for the decisions, and About plus Art for the author.

### Copy to publish

```text
A small portfolio still has a content architecture problem: the same article needs to make sense in several places.

It has a page, a listing, topic links, a feed entry, and metadata for previews. Keeping each of those separate would create several places to maintain the same information.

For Sanfor, I use Astro content collections. A Markdown article supplies its title, description, date, image, category, and tags. The site uses that entry to generate the article and its surrounding discovery paths.

The result is practical: the 360Vision writeup appears in Writing, relevant topic archives, RSS, and the sitemap from the same content entry.

There is an important limit in the current implementation: a future date does not schedule publication. Draft filtering controls whether an entry is included. Small details like that belong in the documentation, because the next person editing content needs the real rule.

Browse the writing: https://sanfor2004.github.io/blog/
```

Publishing note: this explains repository behavior, not measured traffic improvement. Evidence: `src/content.config.ts`, blog routes, RSS endpoint, sitemap integration.

## X-01 — X / four-post launch thread

Angle: context for engineering work. Attach [landscape preview](images/social-preview-landscape.png) to post 1; posts 2–4 are text only. Use LI-01's alt text.

### Copy to publish — post 1

```text
1/4 A stack list tells you what tools someone used. It leaves the problem, decisions, and limits unexplained. I built Sanfor to connect my projects with the engineering notes behind them.
```

### Copy to publish — post 2

```text
2/4 The method: Markdown project writeups and articles, connected through Astro pages and topic archives. About gives professional context; Art keeps the portfolio personal.
```

### Copy to publish — post 3

```text
3/4 The result: seven project writeups and four articles in one place. Start with 360Vision, explore a background-job note, or read about the review loop behind a desktop companion.
```

### Copy to publish — post 4

```text
4/4 My focus is systems and backend engineering, Linux, networking, and performance. Pick one project and follow the reasoning behind it: https://sanfor2004.github.io/
```

Publishing note: publish sequentially as one thread. Evidence: current content inventory, navigation, and `src/site.ts`.

## X-02 — X / standalone announcement

Attachment: [square preview](images/social-preview-square.png). Alt: Sanfor's logo and home-page screenshot beneath The work. The thinking. The person.

### Copy to publish

```text
A project list leaves the reasoning out. I built Sanfor to connect project writeups, engineering notes, and the person behind them. Seven projects and four articles are ready to explore: https://sanfor2004.github.io/
```

Publishing note: an alternative to repeating the launch thread on the same day. Evidence: collections and connected routes.

## X-03 — X / technical follow-up

Attachment: text only.

### Copy to publish

```text
Keeping article pages, topic lists, and feeds in sync can mean repeated work. Sanfor uses one Markdown entry to generate those reading paths with Astro. Explore the resulting notes: https://sanfor2004.github.io/blog/
```

Publishing note: technical angle for a later day. Evidence: content schema, blog routes, RSS endpoint.

## RD-01 — Reddit / project-story draft

Audience: builders discussing personal portfolios; community not selected or eligibility-verified. Attachment: optional [landscape preview](images/social-preview-landscape.png), LI-01 alt text. Use only in a community/thread that permits this kind of self-promotion.

### Copy to publish

```text
Title: I built an Astro portfolio around the reasoning behind my projects

I'm Ahmed, and this is my personal portfolio, Sanfor.

The problem I wanted the site to address is pretty simple: a list of projects and technologies does not explain the decisions behind the work. Someone can see the stack and still have no idea what the constraints were, what tradeoffs mattered, or which parts are actually finished.

I organized the site into project writeups, technical articles, About, Art, and Contact. Astro content collections provide the project and article data, and the pages connect that content through lists and topic archives. There is also an RSS feed for the writing.

The current collection has seven project writeups and four articles. One article looks at the local JSON storage and spatial navigation in 360Vision; another discusses the failure behavior of background jobs. Some project summaries are still short, so this is an ongoing body of work rather than a claim that every case study is complete.

I also kept an original art archive in the main navigation. My engineering focus is systems and backend work, but I wanted the site to feel like a person built it.

The result is a straightforward path from a project to its explanation and then to the author. There are optional music controls and light/dark themes as well.

The site is here: https://sanfor2004.github.io/

When you review an engineer's portfolio, what detail makes a case study useful enough to keep reading?
```

Internal evidence: collection inventory, 360Vision article, background-job article, About/Art routes. No invented competitor or personal frustration story.

## RD-02 — Reddit / technical-discussion draft

Audience: developers discussing static content architecture; community not selected or eligibility-verified. Attachment: text only.

### Copy to publish

```text
Title: Using Astro collections to keep portfolio articles, archives, and RSS connected

I'm building and maintaining my own portfolio, Sanfor, with Astro. One problem I wanted to keep small was duplicated content: an article has a detail page, an index entry, tags, and a feed item, and those views should agree about what the article is.

The implementation starts with Markdown collections for projects and blog posts. Blog metadata includes a title, description, date, image and alt text, category, and tags. The routes read the collection to generate the individual pages and lists, while the RSS endpoint uses the same entries for the feed.

That gives me a useful result: a new article becomes available through several reading paths without manually writing a separate entry for each one. The recent 360Vision article appears in the Writing index, its topic archives, the feed, and the generated sitemap.

The current design has some boundaries that are worth explaining. Draft filtering is explicit; future dates do not schedule publication. Blog topics and project topics use separate routes. Tag normalization is deliberately simple, so spelling consistency matters and a more robust slug strategy could become useful later.

There is also a client-navigation layer. The shared music player persists across internal navigation, while page-specific interactions need initialization guards. That adds some browser lifecycle work even though the output itself is static.

I chose to keep the editorial content in the repository because that matches this site's current scale. It does not provide an editorial dashboard or a publishing scheduler, and I am not claiming that it is the right workflow for a larger team.

Source: https://github.com/sanfor2004/sanfor2004.github.io

For a small content-driven site, what would make you move from repository-based Markdown to a CMS: the number of authors, publication scheduling, or something else?
```

Internal evidence: collection schema, dynamic blog/tag paths, RSS endpoint, layout and MusicPlayer. Publishing note: ask for genuine architectural feedback where permitted; no moderation compatibility claimed.

## HN-01 — Hacker News / regular-submission options

This portfolio campaign is not framed as Show HN: its main offering is a portfolio and reading material. Official [Show HN guidance](https://news.ycombinator.com/showhn.html) directs reading material to regular submissions. No acceptance or placement is promised.

### Three title options

1. Sanfor: a personal portfolio connecting software projects and engineering notes
2. An Astro portfolio for project writeups, technical articles, and original art
3. Connecting the implementation and explanation in a personal engineering portfolio

Destination: https://sanfor2004.github.io/ — Attachment: text only.

### Copy to publish — author comment

```text
I'm the author of Sanfor. I built it around a gap in a typical project list: seeing the technology does not explain the problem or the reasoning behind the implementation.

The site connects Markdown project writeups and articles through Astro collections, with separate About and Art sections. The current result is seven project entries and four articles, including notes on a local panorama tour studio and background-job reliability.

It is a personal portfolio, not a new framework or hosted service. Some case studies are still brief, and the content workflow has no CMS or scheduling layer. I would be interested in which implementation details readers look for before a portfolio writeup becomes useful to them.
```

Internal evidence: current routes, content inventory, schemas. Publishing note: choose one title if making a suitable regular submission; do not submit all three variations.

## DEV-01 — DEV Community / complete companion article

Attachment: [landscape preview](images/social-preview-landscape.png), LI-01 alt text. Suggested tags: `astro`, `webdev`, `portfolio`, `writing`. Upload the local cover through the editor. The article below is a new campaign draft; it is not already published on the portfolio, so no duplicate canonical URL is asserted.

### Copy to publish

```markdown
# Building a Portfolio That Explains the Engineering Behind the Work

A project list is a useful introduction, but it rarely answers the questions I want an engineering portfolio to answer. What problem did the project address? Why was a particular approach chosen? What can someone actually use today, and what still needs work?

I built my personal portfolio, Sanfor, around those questions. The site brings together project writeups, technical articles, professional context, and an original art archive. My focus is systems and backend engineering, Linux, networking, and performance. The portfolio gives that work somewhere to be explained.

## The problem: a stack does not explain a decision

Technology names are compact. That makes them convenient for cards and resumes, but they leave out the part that makes a project interesting.

Two applications can use the same framework and solve very different problems. A local authoring tool has different storage assumptions from a shared hosted service. A background worker needs a failure story as well as a happy path. Those distinctions cannot be communicated by listing TypeScript or a database.

The goal for this site was to provide room for that context without making the first visit feel like opening a manual. A visitor should be able to scan, pick a project, and then choose how deeply to read.

## The method: give different questions a clear home

The site has five main destinations: About, Projects, Writing, Art, and Contact. Each answers a different question.

Projects explains what the work is. Writing gives more space to a specific investigation or decision. About provides professional context, while Contact offers public channels for a conversation. Art makes room for another part of my practice and keeps the portfolio personal.

The home page is intentionally brief. It establishes the name and engineering focus, then points to those destinations. The detailed explanations belong on the pages where someone has chosen to read them.

This separation also helps with editing. A short project description does not need to contain every technical lesson, and an article can focus on one question without repeating the whole biography.

## Keep the content connected through Astro

The implementation uses Astro with Markdown content collections. Projects and blog posts have separate schemas because they need different metadata. A project includes role, status, and stack; a blog post requires a category and a cover image with alternative text.

Those entries feed the pages and their surrounding reading paths. A blog article has an individual page, an index entry, topic archives, and an RSS item. A sitemap is generated as part of the static build.

The practical result is that adding a content entry does not mean separately authoring every place that points to it. The data is shared, while the presentation can adapt to the index, archive, or article page.

That does not make publication automatic in every sense. The current site filters entries using a draft flag. A future publication date does not schedule a release. Writing that rule down matters because the visible frontmatter can otherwise suggest a feature that is not implemented.

## Use a project to explain a concrete tradeoff

One current article looks at 360Vision, a local studio for connected panorama tours. The useful story is not simply that the application uses Next.js and Three.js.

The article explains why panorama hotspots use angular yaw and pitch, while floor-plan points use percentages. It also describes local JSON persistence and the difference between downloading a JSON document and backing up its referenced images.

Those details connect a design decision to a consequence. The reader can see the coordinate problem, the representation chosen to handle it, and the behavior that representation makes possible. The backup discussion also names a limit instead of implying complete media portability.

Another article discusses queues and background work. Its value comes from explaining retries, duplication, observability, and recovery. These are examples of the kind of reasoning I want the writing section to preserve.

## Give the site a recognizable visual language

The design uses warm paper colors, orange accents, visible borders, large headings, and compact technical labels. The original logo, portrait, and art give the presentation continuity with the person behind the work.

There are light and dark themes and optional music controls. The player persists through internal navigation, which means browser initialization and persistent state still need attention even on a statically generated site.

These details are part of the experience, but the core content must remain understandable without playing audio or inspecting a hover effect. The writing, navigation, and descriptions carry the meaning.

## The result and the remaining work

The current portfolio contains seven project writeups and four articles. A visitor can start from a project, follow a related explanation, read about the author, and find a public contact channel. Those are observable capabilities, not a claim about hiring outcomes or traffic growth.

Several project summaries are still short. There are also opportunities to improve auxiliary page consistency, image delivery, and small interaction details. A portfolio is an ongoing publishing practice, so the next improvement is often a clearer explanation rather than another visual effect.

My takeaway is to make the connection between problem, implementation, and result easy to follow. It gives a reader something more useful to assess than a stack list, and it gives me a structure for documenting the next project.

Explore [Sanfor](https://sanfor2004.github.io/) and pick one project to start with. What information makes an engineering case study useful to you?
```

Internal evidence: `src/site.ts`, collection schema, page routes, 360Vision article, background-job article, theme and music components, brand guide. Publishing note: this complete draft is intended for editorial review and upload, not an automated external post.

## FB-01 — Facebook / approachable portfolio introduction

Attachment: [square preview](images/social-preview-square.png), X-02 alt text.

### Copy to publish

```text
Seeing a finished project is only part of the story. I also wanted a place to explain the problem, the choices behind the build, and what the result can do.

That is what I am bringing together in Sanfor, my personal portfolio.

It has project writeups, engineering articles, an About page, and a collection of my original drawings. The projects and writing are connected, so you can start with an overview and explore the details when something catches your attention.

There are currently seven project writeups and four articles, covering topics including interactive panorama tours, background jobs, and creative development workflows.

My main focus is systems and backend engineering, but I wanted the site to show the person behind the code too.

Take a look: https://sanfor2004.github.io/
```

Internal evidence: content inventory, navigation, Art, and site identity. Publishing note: use the original post on your own profile/page; group rules require a separate check.

## IG-01 — Instagram / six-slide story

Upload these six slides in order. Headlines and supporting copy below match the image content; shared logo, step number, and footer are additional design elements.

| Slide | Copy | Matching visual |
| --- | --- | --- |
| 1 | What did you build? How did you think? / A closer look at Sanfor: the work, the reasoning, and the person. | [carousel-01.png](images/carousel-01.png): actual portfolio home screenshot |
| 2 | A stack list leaves questions unanswered. / Tools tell you what someone used. They do not explain the problem, decisions, or limits. | [carousel-02.png](images/carousel-02.png): three unanswered questions |
| 3 | Connect the build to the reasoning. / Case studies explain the project. Articles unpack the decisions. The About page gives context. | [carousel-03.png](images/carousel-03.png): Projects, Writing, About + Art sequence |
| 4 | Read the story behind the system. / 360Vision, background jobs, learning loops, and creative tooling. Notes you can explore. | [carousel-04.png](images/carousel-04.png): actual Writing page screenshot |
| 5 | More context. A clearer path. / Explore the project, read the decisions, meet the author, then start a conversation. | [carousel-05.png](images/carousel-05.png): 07 project writeups and 04 articles, labeled as content counts |
| 6 | Start with one project. / Ahmed Abdelaziz Hanafy / Software Engineer — Systems & Backend | [carousel-06.png](images/carousel-06.png): project logo and portfolio URL |

### Copy to publish — caption

```text
A list of tools cannot tell the whole story behind a project.

I built Sanfor to connect the work with the explanation: project writeups, technical articles, professional context, and original art.

The result is a place to explore what I build and how I think about it. Seven project writeups and four articles are there to start with, including 360Vision and background-job reliability.

Swipe through the idea, then visit sanfor2004.github.io to explore one project.

#SoftwareEngineering #Portfolio #Astro
```

Publishing note: the caption names a typeable address and does not assume a configured bio link. Add per-slide alt text from assets.md. Internal evidence: source inventory and captured pages.

## UP-01 — follow-up / invite useful feedback

Attachment: [portrait preview](images/social-preview-portrait.png). Alt: Portrait Sanfor campaign card combining the existing logo, project description, and actual home-page capture.

### Copy to publish — short

```text
A project card cannot explain every tradeoff. Sanfor connects the overview with longer engineering notes, so readers can follow the reasoning. Which detail do you look for first? https://sanfor2004.github.io/
```

### Copy to publish — medium

```text
One thing a project card struggles to show is the reasoning behind a decision.

For Sanfor, I connected concise project writeups with longer technical articles. That lets the overview stay readable while the article explains a narrower question, such as why panorama hotspots use angles or what a local JSON export leaves out.

The result is a choice for the reader: scan the work, then go deeper into a decision that interests you. It is also a structure I can keep using as the portfolio grows.

I would like to make the next writeups more useful. When you open a case study, which detail do you look for first: the problem, the architecture, the tradeoffs, or the evidence that it works?

Explore one example: https://sanfor2004.github.io/projects/360-vision/
```

Publishing note: select one length for a channel; this is a current lesson, not invented progress since launch. Internal evidence: project-to-article link and the 360Vision article's coordinate/backup sections.
