# Campaign images and alternatives

All nine final images are PNG files rendered from editable HTML/CSS compositions in [source/render.mjs](source/render.mjs). They extend the repository's existing logo and visual system. They are not AI-generated product mockups. Product views are fresh captures of the actual local portfolio build.

| Image | Dimensions | Alt text |
| --- | --- | --- |
| [Landscape preview](images/social-preview-landscape.png) | 1200 × 630 | Sanfor portfolio preview with its orange logo, a real home-page screenshot, and the headline The work. The thinking. The person. |
| [Square preview](images/social-preview-square.png) | 1080 × 1080 | Sanfor's logo and home-page screenshot beneath The work. The thinking. The person. |
| [Portrait preview](images/social-preview-portrait.png) | 1080 × 1350 | Portrait Sanfor campaign card combining the existing logo, project description, and actual home-page capture. |
| [Carousel 01](images/carousel-01.png) | 1080 × 1350 | What did you build? How did you think? Sanfor introduces the work, reasoning, and person alongside its real home page. |
| [Carousel 02](images/carousel-02.png) | 1080 × 1350 | A stack list leaves questions unanswered: what problem did it solve, why that implementation, and what works today? |
| [Carousel 03](images/carousel-03.png) | 1080 × 1350 | Connect the build to the reasoning: Projects explains the build, Writing the decisions, and About plus Art the person. |
| [Carousel 04](images/carousel-04.png) | 1080 × 1350 | Read the story behind the system, with a real screenshot of Sanfor's Writing page and its 360Vision article. |
| [Carousel 05](images/carousel-05.png) | 1080 × 1350 | Seven project writeups and four technical articles connect project, article, author, and contact. Counts describe content, not visitors. |
| [Carousel 06](images/carousel-06.png) | 1080 × 1350 | Start with one project. Ahmed Abdelaziz Hanafy, Software Engineer — Systems & Backend, invites readers to sanfor2004.github.io. |

## Source assets

- Existing logo: [logo.svg](../public/assets/brand/logo.svg), embedded without changing its geometry or orange strokes.
- Site design: [styles.css](../src/styles.css) and [Brand Guide](../docs/BRAND-GUIDE.md).
- [Home capture](source/captures/home.png) and [Writing capture](source/captures/writing.png): captured at 1440 × 1100 from the existing local static build.
- Fonts: the project's installed `@fontsource/inter` files, weights 400 and 800; local Consolas fallback for metadata. No external font downloads occur during rendering.

The browser renders the composition and exports screenshots. No product functionality, review, customer, or adoption metric is invented in the visuals. The 07/04 figures are the inspected content inventory. These assets carry the portfolio's existing creative rights; no new blanket license is asserted.

## Reproduce

From the repository root, with its dependencies installed and `dist/` available:

```sh
node Markting/source/render.mjs
node Markting/source/verify.mjs
```

Use the project build command first if source pages changed. The renderer uses the installed Google Chrome channel through Playwright, starts a temporary loopback server, captures the local site, renders all nine exports, and closes its browser/server. It blocks external requests during capture. No application source changes are needed.

The copy, dimensions, placement, and styles are editable in the render source. The script intentionally replaces its named generated exports on rerun; preserve a campaign in a dated subfolder before creating a separate version. The original logo and public assets remain untouched.

These are campaign export dimensions, not a guarantee of platform-specific acceptance. Check the destination's upload preview when publishing.
