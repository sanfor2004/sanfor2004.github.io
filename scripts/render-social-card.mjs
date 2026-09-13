// Deterministic brand composition using the existing logo and installed Inter font.
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
const logo = (await readFile("public/assets/brand/logo.svg")).toString("base64");
const font = (await readFile("node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2")).toString("base64");
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Inter; src: url(data:font/woff2;base64,${font}); font-weight: 700; }
    * { box-sizing: border-box; } body { margin: 0; background: #e7c99f; color: #25170e; font-family: Inter, sans-serif; }
    main { height: 630px; padding: 55px 75px; background-image: radial-gradient(#76583f55 1px, transparent 1px); background-size: 18px 18px; }
    .rails { position: absolute; inset: 0 48px; border-inline: 1px solid #76583f77; pointer-events: none; }
    header { display: flex; align-items: center; justify-content: space-between; }
    img { width: 90px; height: 66px; object-fit: contain; }
    .mono { font: 18px monospace; letter-spacing: 2px; }
    h1 { font-size: 112px; letter-spacing: -8px; line-height: 1; margin: 42px 0 24px; }
    h2 { font-size: 40px; letter-spacing: -1px; margin: 0 0 16px; }
    p { font-size: 25px; margin: 0; }
    footer { margin-top: 45px; padding-top: 22px; border-top: 1px solid #76583f88; display: flex; justify-content: space-between; }
    .accent { color: #c9521f; }
  </style></head><body><main><div class="rails"></div>
    <header><img src="data:image/svg+xml;base64,${logo}" alt=""><span class="mono">ENGINEERING / PROJECTS / WRITING</span></header>
    <h1>SANFOR<span class="accent">.</span></h1>
    <h2>Ahmed Abdelaziz</h2><p>Systems &amp; Backend Software Engineer</p>
    <footer class="mono"><span>C++ / LINUX / NETWORKING</span><span class="accent">sanfor2004.github.io</span></footer>
  </main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/assets/brand/social-card.png" });
  console.log("Created public/assets/brand/social-card.png (1200 × 630).");
} finally { await browser.close(); }
