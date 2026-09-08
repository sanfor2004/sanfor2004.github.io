import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "Markting");
const images = path.join(output, "images");
const captureDir = path.join(output, "source", "captures");
await mkdir(images, { recursive: true });
await mkdir(captureDir, { recursive: true });
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".ogg": "audio/ogg", ".mp3": "audio/mpeg" };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const base = path.resolve(root, "dist");
    let target = path.resolve(base, "." + decodeURIComponent(url.pathname));
    if (!target.startsWith(base + path.sep) && target !== base) throw new Error("Invalid path");
    if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
    res.setHeader("Content-Type", mime[path.extname(target)] || "application/octet-stream");
    res.end(await readFile(target));
  } catch { res.writeHead(404); res.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const data = async (file, type) => `data:${type};base64,${(await readFile(file)).toString("base64")}`;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
  await context.route("https://**/*", route => route.abort());
  const page = await context.newPage();
  for (const [name, url] of [["home", "/"], ["writing", "/blog/"]]) {
    await page.goto(origin + url);
    await page.locator(".page-loader.is-finished").waitFor({ state: "attached" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(captureDir, `${name}.png`) });
  }
  const logo = await data(path.join(root, "public/assets/brand/logo.svg"), "image/svg+xml");
  const home = await data(path.join(captureDir, "home.png"), "image/png");
  const writing = await data(path.join(captureDir, "writing.png"), "image/png");
  const font = await data(path.join(root, "node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2"), "font/woff2");
  const regular = await data(path.join(root, "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2"), "font/woff2");
  const definitions = [
    { name: "social-preview-landscape", w: 1200, h: 630, label: "SYSTEMS & BACKEND / PERSONAL PORTFOLIO", title: "The work.<br>The thinking.<br><em>The person.</em>", copy: "Projects, engineering notes, and original art. One place to explore.", mode: "hero", image: home },
    { name: "social-preview-square", w: 1080, h: 1080, label: "SYSTEMS & BACKEND", title: "The work.<br>The thinking.<br><em>The person.</em>", copy: "Projects, engineering notes, and original art. One place to explore.", mode: "hero", image: home },
    { name: "social-preview-portrait", w: 1080, h: 1350, label: "SYSTEMS & BACKEND", title: "The work.<br>The thinking.<br><em>The person.</em>", copy: "Projects, engineering notes, and original art. One place to explore.", mode: "hero", image: home },
    { name: "carousel-01", w: 1080, h: 1350, step: "01 / 06", label: "A PORTFOLIO WITH CONTEXT", title: "What did you build?<br><em>How did you think?</em>", copy: "A closer look at Sanfor: the work, the reasoning, and the person.", mode: "hero", image: home },
    { name: "carousel-02", w: 1080, h: 1350, step: "02 / 06", label: "THE PROBLEM", title: "A stack list<br>leaves questions<br><em>unanswered.</em>", copy: "Tools tell you what someone used. They do not explain the problem, decisions, or limits.", mode: "problem" },
    { name: "carousel-03", w: 1080, h: 1350, step: "03 / 06", label: "THE METHOD", title: "Connect the build<br>to the<br><em>reasoning.</em>", copy: "Case studies explain the project. Articles unpack the decisions. The About page gives context.", mode: "method" },
    { name: "carousel-04", w: 1080, h: 1350, step: "04 / 06", label: "SEE IT IN PRACTICE", title: "Read the story<br><em>behind the system.</em>", copy: "360Vision, background jobs, learning loops, and creative tooling. Notes you can explore.", mode: "hero", image: writing },
    { name: "carousel-05", w: 1080, h: 1350, step: "05 / 06", label: "THE RESULT", title: "More context.<br><em>A clearer path.</em>", copy: "Explore the project, read the decisions, meet the author, then start a conversation.", mode: "result" },
    { name: "carousel-06", w: 1080, h: 1350, step: "06 / 06", label: "EXPLORE SANFOR", title: "Start with<br><em>one project.</em>", copy: "Ahmed Abdelaziz Hanafy\nSoftware Engineer — Systems & Backend", mode: "end" },
  ];
  const bodyFor = d => d.mode === "hero" ? `<div class="screen"><div class="screenbar"><i></i><i></i><i></i><span>ACTUAL PORTFOLIO / ${d.image === writing ? "WRITING" : "HOME"}</span></div><img src="${d.image}" alt="Actual portfolio capture"></div>` : d.mode === "problem" ? `<div class="questions"><div><span>01</span> What problem did it solve?</div><div><span>02</span> Why that implementation?</div><div><span>03</span> What works today?</div></div>` : d.mode === "method" ? `<div class="steps"><div><span>01 / PROJECTS</span><strong>The thing I built</strong></div><div><span>02 / WRITING</span><strong>The decisions behind it</strong></div><div><span>03 / ABOUT + ART</span><strong>The person doing the work</strong></div></div>` : d.mode === "result" ? `<div class="metrics"><div><b>07</b><span>PROJECT WRITEUPS</span></div><div><b>04</b><span>TECHNICAL ARTICLES</span></div></div><div class="route">PROJECT → ARTICLE → AUTHOR → CONTACT</div><small>Content inventory, September 2026. Not usage metrics.</small>` : `<div class="destination"><img src="${logo}" alt="Sanfor logo"><strong>SANFOR</strong><p>Projects / Writing / Art</p><div>sanfor2004.github.io ↗</div></div>`;
  for (const d of definitions) {
    await page.setViewportSize({ width: d.w, height: d.h });
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face{font-family:Inter;src:url('${font}');font-weight:800}@font-face{font-family:Inter;src:url('${regular}');font-weight:400}
      *{box-sizing:border-box}body{margin:0;background:#16110d;color:#f7e9d8;font-family:Inter,sans-serif}main{width:${d.w}px;height:${d.h}px;padding:58px 64px 46px;display:flex;flex-direction:column;background:radial-gradient(circle at 1px 1px,#6a4c364a 1px,transparent 0);background-size:22px 22px;position:relative;overflow:hidden}
      main:before{content:'';position:absolute;left:36px;top:0;bottom:0;width:1px;background:#6a4c36}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:58px}header .brand{display:flex;align-items:center;gap:18px;font-size:23px;font-weight:800;letter-spacing:2px}header img{width:62px;height:auto}header span,.label,footer,.screenbar,.steps span,.metrics span,.route,small{font-family:Consolas,monospace}header>span{color:#c7ad92;font-size:18px}.label{color:#ff7a38;font-size:19px;letter-spacing:2px;margin:0 0 25px}h1{font-size:76px;line-height:1.02;letter-spacing:-3px;margin:0;font-weight:800}h1 em{font-style:normal;color:#ff7a38}.copy{color:#c7ad92;font-size:28px;line-height:1.5;max-width:840px;margin:28px 0 0;white-space:pre-line}.content{flex:1;display:flex;flex-direction:column;gap:34px;min-height:0}.screen{border:1px solid #916644;overflow:hidden;background:#e7c99f;min-height:0;flex:1;box-shadow:15px 15px 0 #352619}.screenbar{height:38px;display:flex;align-items:center;gap:7px;padding:0 16px;background:#352619;color:#c7ad92;font-size:12px}.screenbar i{width:5px;height:5px;background:#ff7a38;border-radius:50%}.screenbar span{margin-left:auto}.screen>img{width:100%;display:block;height:auto}footer{margin-top:37px;border-top:1px solid #6a4c36;padding-top:23px;display:flex;justify-content:space-between;font-size:17px;color:#c7ad92}footer strong{color:#f7e9d8;font-weight:400}.questions{margin-top:55px}.questions div{border-top:1px solid #6a4c36;padding:35px 0;font-size:31px}.questions span{color:#ff7a38;margin-right:26px;font-family:Consolas}.steps{margin-top:10px}.steps>div{padding:30px;border:1px solid #6a4c36;background:#211810;margin-bottom:16px}.steps span{font-size:19px;color:#ff7a38}.steps strong{display:block;font-size:32px;margin-top:13px}.metrics{display:flex;gap:70px;margin-top:20px}.metrics b{display:block;font-size:155px;color:#ff7a38;letter-spacing:-8px}.metrics span{font-size:20px}.route{background:#e7c99f;color:#25170e;padding:27px 22px;font-size:23px;margin-top:30px}small{font-size:16px;color:#c7ad92}.destination{border:1px solid #6a4c36;background:#211810;padding:38px;margin-top:24px}.destination img{width:100px;vertical-align:middle;margin-right:24px}.destination strong{font-size:70px;vertical-align:middle;letter-spacing:-3px}.destination p{font-size:28px;color:#c7ad92}.destination div{background:#ff7a38;color:#16110d;padding:23px;font-size:34px;font-weight:800}
      ${d.w > d.h ? `main{padding:34px 44px 30px}header{margin-bottom:28px}header img{width:48px}main:before{left:24px}.content{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:start}.label{font-size:12px;letter-spacing:1px;margin-bottom:18px}h1{font-size:62px;letter-spacing:-2.8px}.copy{font-size:19px;margin-top:20px}.screen{height:357px;margin-top:16px}.screen>img{width:100%;height:319px;object-fit:cover;object-position:top}.screenbar{font-size:9px}footer{margin-top:24px;padding-top:16px;font-size:13px}` : d.h === 1080 ? `header{margin-bottom:30px}h1{font-size:66px}.copy{font-size:25px}.content{gap:26px}.screen{min-height:290px}footer{margin-top:24px}` : ""}
      </style></head><body><main><header><div class="brand"><img src="${logo}" alt="Sanfor logo">SANFOR</div><span>${d.step || "ENGINEERING / NOTES / ART"}</span></header><div class="content"><section><p class="label">${d.label}</p><h1>${d.title}</h1><p class="copy">${d.copy}</p></section>${bodyFor(d)}</div><footer><strong>sanfor2004.github.io</strong><span>${d.mode === "end" ? "EXPLORE THE PORTFOLIO →" : d.step ? "SWIPE TO EXPLORE →" : "AHMED ABDELAZIZ HANAFY"}</span></footer></main></body></html>`;
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    const overflow = await page.evaluate(() => { const m = document.querySelector("main"); return m.scrollHeight > m.clientHeight || m.scrollWidth > m.clientWidth; });
    if (overflow) throw new Error(`Overflow in ${d.name}`);
    await page.screenshot({ path: path.join(images, `${d.name}.png`) });
    console.log(`${d.name}.png ${d.w}x${d.h}`);
  }
  await context.close();
} finally { await browser.close(); server.close(); }
