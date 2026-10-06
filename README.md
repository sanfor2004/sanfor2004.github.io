# sanfor2004.com

Portfolio of Ahmed (Sanfor). Astro 7 + Tailwind v4 + React islands, deployed to GitHub Pages.

## Run it
```bash
npm install
npm run dev        # http://localhost:4321  (draft articles visible here)
npm run verify     # token guard + type check + production build
```

## Deploy
Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
In the repo: Settings → Pages → Source: **GitHub Actions**. `public/CNAME` keeps the custom domain.

## Working with Claude Code
Open the folder and start every session with: "Read AGENTS.md first." It holds the rules, file map, frozen list and open placeholders.
