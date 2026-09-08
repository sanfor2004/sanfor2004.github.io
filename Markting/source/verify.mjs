import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { chromium } from "playwright";

const pack = fileURLToPath(new URL("../", import.meta.url));
const posts = await readFile(path.join(pack, "posts.md"), "utf8");
const ids = ["LI-01", "LI-02", "X-01", "X-02", "X-03", "RD-01", "RD-02", "HN-01", "DEV-01", "FB-01", "IG-01", "UP-01"];
for (const id of ids) assert(posts.includes(`## ${id} —`), `Missing ${id}`);
for (const file of (await readdir(pack)).filter(f => f.endsWith(".md"))) {
  const text = await readFile(path.join(pack, file), "utf8");
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    await access(path.resolve(pack, match[1].split("#")[0]));
  }
}
const sections = posts.split(/^## (?=[A-Z]+-\d{2} —)/m).slice(1);
for (const section of sections) {
  const id = section.split(" ")[0];
  const blocks = [...section.matchAll(/```(?:text|markdown)\n([\s\S]*?)\n```/g)].map(m => m[1]);
  assert(blocks.length > 0, `Missing finished copy for ${id}`);
  if (id === "DEV-01") {
    const words = blocks.join(" ").split(/\s+/).length;
    assert(words >= 700 && words <= 1100, `DEV article length: ${words}`);
  }
  if (id.startsWith("X-")) {
    for (let i = 0; i < blocks.length; i++) {
      const raw = [...blocks[i]].length;
      const urlAdjusted = [...blocks[i].replace(/https?:\/\/\S+/g, "x".repeat(23))].length;
      assert(Math.max(raw, urlAdjusted) <= 280, `${id} part ${i + 1} too long`);
      console.log(`${id} part ${i + 1}: ${raw} raw / ${urlAdjusted} URL-adjusted characters`);
    }
  }
  if (blocks.length) console.log(`${id}: ${blocks.join(" ").split(/\s+/).length} words`);
}
const files = (await readdir(path.join(pack, "images"))).filter(f => f.endsWith(".png"));
assert.equal(files.length, 9);
for (const file of files) {
  const bytes = await readFile(path.join(pack, "images", file));
  const dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  const expected = file.includes("landscape") ? [1200, 630] : file.includes("square") ? [1080, 1080] : [1080, 1350];
  assert.deepEqual(dimensions, expected);
}
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1900 } });
  await page.goto(pathToFileURL(path.join(pack, "index.html")).href);
  await page.locator("img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
  assert.equal(await page.locator("img").count(), 9);
  await page.screenshot({ path: path.join(pack, "source", "contact-sheet.png"), fullPage: true });
} finally { await browser.close(); }
console.log("PASS: 12 copy IDs, local Markdown links, nine correctly sized decodable exports, gallery contact sheet");
