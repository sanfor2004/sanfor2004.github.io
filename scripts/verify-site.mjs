// Static output and browser smoke checks. Google requests are intercepted, never sent.
import assert from "node:assert/strict";
import { readFile, readdir, stat, mkdir } from "node:fs/promises";
import { resolve, join, extname, relative } from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";
import { designPatterns, patternArticlePath, patternOverview } from "../src/data/design-pattern-series.mjs";

const root = resolve(process.argv[2] ?? "dist");
const enabled = process.argv.includes("--analytics");
const origin = "https://sanfor2004.github.io";
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml" };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://local").pathname);
    let file = resolve(root, `.${pathname}`);
    assert(!relative(root, file).startsWith(".."));
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end("Not found"); }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const titles = new Set();
  const descriptions = new Set();
  const files = (await readdir(root, { recursive: true })).filter((file) => file.endsWith(".html") && !file.replaceAll("\\", "/").startsWith("learning/"));
  const sitemap = await readFile(join(root, "sitemap-0.xml"), "utf8");
  let linkCount = 0;
  for (const file of files) {
    const html = await readFile(join(root, file), "utf8");
    // Parse without executing scripts or loading assets.
    const data = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = (name) => doc.querySelector(`meta[name="${name}"],meta[property="${name}"]`)?.content;
      return {
        title: doc.title, description: meta("description"), canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        robots: meta("robots"), h1: doc.querySelectorAll("h1").length,
        titles: doc.querySelectorAll("title").length, canonicals: doc.querySelectorAll('link[rel="canonical"]').length,
        social: ["og:title", "og:description", "og:image", "og:url", "og:site_name", "twitter:title", "twitter:description", "twitter:image", "twitter:card"].map(meta),
        schemas: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((el) => JSON.parse(el.textContent)),
        links: [...doc.querySelectorAll("a[href],img[src]")].map((el) => el.getAttribute("href") ?? el.getAttribute("src")),
        noAlt: doc.querySelectorAll("img:not([alt])").length,
        unsafeLinks: [...doc.querySelectorAll('a[target="_blank"]')].filter((a) => !a.rel.includes("noopener") || !a.rel.includes("noreferrer")).length,
        ga: meta("sanfor-ga-id"), google: meta("google-site-verification"), bing: meta("msvalidate.01"),
      };
    }, html);
    assert.equal(data.titles, 1, file); assert.equal(data.canonicals, 1, file); assert.equal(data.h1, 1, file);
    assert(data.description && data.social.every(Boolean), `Metadata missing: ${file}`);
    assert(!titles.has(data.title), `Duplicate title: ${file}`); titles.add(data.title);
    assert(!descriptions.has(data.description), `Duplicate description: ${file}`); descriptions.add(data.description);
    assert(data.canonical.startsWith(origin + "/"), file);
    assert(!/localhost|127\.0\.0\.1|C:\\/.test(JSON.stringify([data.canonical, data.social, data.schemas])), file);
    assert.equal(Boolean(data.ga), enabled, `Analytics configuration: ${file}`);
    if (enabled) { assert(data.google, `Google token: ${file}`); assert(data.bing, `Bing token: ${file}`); }
    assert.equal(data.noAlt, 0, file); assert.equal(data.unsafeLinks, 0, file);
    if (data.robots.includes("noindex")) assert(!sitemap.includes(`<loc>${data.canonical}</loc>`), file);
    else assert(sitemap.includes(`<loc>${data.canonical.replaceAll("&", "&amp;")}</loc>`), `Sitemap missing: ${file}`);
    for (const href of data.links) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const path = decodeURIComponent(new URL(href, origin).pathname);
      const target = join(root, path);
      const info = await stat(target).catch(() => null);
      assert(info, `Broken internal link: ${file} → ${href}`);
      if (info.isDirectory()) await stat(join(target, "index.html"));
      linkCount++;
    }
  }
  const overview = await readFile(join(root, patternOverview, "index.html"), "utf8");
  for (let i = 0; i < designPatterns.length; i++) {
    const pattern = designPatterns[i];
    const path = patternArticlePath(pattern.slug);
    assert(overview.includes(`href="${path}"`));
    const html = await readFile(join(root, path, "index.html"), "utf8");
    assert(html.includes(`href="${patternOverview}"`));
    assert(html.includes('"@type":"TechArticle"'));
    for (const neighbor of [designPatterns[i - 1], designPatterns[i + 1]].filter(Boolean)) assert(html.includes(`href="${patternArticlePath(neighbor.slug)}"`));
  }
  const rss = await readFile(join(root, "rss.xml"), "utf8");
  assert.equal((rss.match(/<item>/g) ?? []).length, 28);
  assert(rss.includes("<dc:creator>Ahmed Abdelaziz</dc:creator>"));
  assert((await readFile(join(root, "robots.txt"), "utf8")).includes(`${origin}/sitemap-index.xml`));
  assert(!sitemap.includes(`${origin}/learning/`) && !sitemap.includes(`${origin}/testblog/`) && !sitemap.includes(`${origin}/404`));
  console.log(`Static checks: ${files.length} pages, ${linkCount} internal links/assets, unique metadata, schemas, sitemap, RSS, and 23 pattern navigation paths passed.`);
  await page.close();

  const errors = [];
  const context = await browser.newContext({ reducedMotion: "reduce" });
  let googleLoads = 0;
  await context.route("**/*", (route) => {
    if (route.request().url().startsWith(base)) return route.continue();
    if (route.request().url().startsWith("https://www.googletagmanager.com/gtag/js")) {
      googleLoads++;
      return route.fulfill({ contentType: "text/javascript", body: "/* Google tag intercepted for offline verification. */" });
    }
    return route.abort();
  });
  const tab = await context.newPage();
  tab.on("pageerror", (error) => errors.push(error.message));
  await tab.goto(`${base}/projects/360-vision/?private=test#top`);
  await tab.waitForFunction(() => document.querySelector("[data-theme-toggle]")?.getAttribute("data-theme-bound") === "true");
  const waitViews = async (count) => {
    if (!enabled) return;
    try { await tab.waitForFunction((count) => window.dataLayer?.filter((entry) => entry[1] === "page_view").length === count, count, { timeout: 5000 }); }
    catch (error) { console.log("Queued analytics", await tab.evaluate(() => window.dataLayer?.map((entry) => Array.from(entry)))); throw error; }
  };
  await waitViews(1);
  await tab.locator("[data-theme-toggle]").click();
  assert.equal(await tab.locator("html").getAttribute("data-theme"), "sanfor-dark");
  await tab.locator('main a[href="/blog/360vision-nextjs-virtual-tour-studio/"]').first().click();
  await tab.waitForURL("**/blog/360vision-nextjs-virtual-tour-studio/");
  await tab.waitForFunction(() => document.querySelector("[data-theme-toggle]")?.getAttribute("aria-pressed") === "true");
  await waitViews(2);
  await tab.goBack(); await tab.waitForURL("**/projects/360-vision/**");
  await waitViews(3);
  await tab.goForward(); await tab.waitForURL("**/blog/360vision-nextjs-virtual-tour-studio/");
  await waitViews(4);
  await tab.waitForFunction(() => document.documentElement.lang === "en" && document.documentElement.dir === "ltr");
  if (enabled) {
    await tab.waitForFunction(() => window.dataLayer?.filter((entry) => entry[1] === "page_view").length === 4);
    const events = await tab.evaluate(() => window.dataLayer.map((entry) => Array.from(entry)));
    assert.equal(events.filter((entry) => entry[1] === "project_view").length, 2);
    assert.equal(events.filter((entry) => entry[1] === "article_view").length, 2);
    assert(!JSON.stringify(events).includes("private="));
    assert.equal(googleLoads, 1);
    await tab.evaluate(() => {
      const prevent = (event) => event.preventDefault();
      document.addEventListener("click", prevent);
      document.querySelector('footer a[href*="github.com"]').click();
      document.querySelector('footer a[href*="linkedin.com"]').click();
      document.querySelector('footer a[href="/contact/"]').click();
      document.removeEventListener("click", prevent);
    });
    const names = await tab.evaluate(() => window.dataLayer.filter((entry) => entry[0] === "event").map((entry) => entry[1]));
    for (const name of ["outbound_github_click", "linkedin_click", "contact_click"]) assert(names.includes(name), name);
  } else {
    assert.equal(googleLoads, 0);
    assert.equal(await tab.evaluate(() => typeof window.gtag), "undefined");
  }
  const shots = resolve("tmp/seo-review"); await mkdir(shots, { recursive: true });
  for (const width of [390, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    for (const theme of ["light", "dark"]) {
      await tab.evaluate((theme) => localStorage.setItem("sanfor-theme", theme), theme);
      for (const path of ["/projects/360-vision/", "/projects/xcve/", "/blog/design-pattern-factory-method/", "/blog/", "/about/"]) {
        await tab.goto(base + path); await tab.waitForLoadState("networkidle");
        const checks = await tab.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
          theme: document.documentElement.dataset.theme,
        }));
        assert(!checks.overflow, `Overflow: ${width} ${path}`); assert.deepEqual(checks.broken, [], path);
        assert.equal(checks.theme, theme === "dark" ? "sanfor-dark" : "sanfor");
        await tab.screenshot({ path: join(shots, `${path.replaceAll("/", "-")}-${width}-${theme}.png`), fullPage: false });
      }
    }
  }
  await tab.keyboard.press("Tab");
  assert(await tab.evaluate(() => document.activeElement !== document.body));
  // Blocked storage must not break the theme control.
  await tab.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Storage blocked"); }; });
  const before = await tab.locator("html").getAttribute("data-theme");
  await tab.locator("[data-theme-toggle]").click();
  assert.notEqual(await tab.locator("html").getAttribute("data-theme"), before);
  assert.deepEqual(errors, []);
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage(); await staticPage.goto(`${base}/projects/xcve/`);
  assert.equal(await staticPage.locator(".page-loader").evaluate((el) => getComputedStyle(el).display), "none");
  await noJS.close(); await context.close();
  const motion = await browser.newContext({ reducedMotion: "no-preference" });
  await motion.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ contentType: "text/javascript", body: "" }));
  const motionPage = await motion.newPage();
  await motionPage.goto(`${base}/projects/xcve/`);
  await motionPage.waitForFunction(() => document.querySelector(".page-loader")?.classList.contains("is-finished"));
  await motion.close();
  console.log(`Browser checks: both themes at 390/1440px, images, overflow, keyboard, blocked storage, no-JS, client/history navigation, and analytics ${enabled ? "events (mocked)" : "disabled"} passed. Screenshots: tmp/seo-review/`);
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
