import assert from "node:assert/strict";
import { readFile, access, mkdir, mkdtemp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { designPatterns, learningRedirects, patternOverview, patternArticlePath } from "../src/data/design-pattern-series.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const overview = await read("src/content/blog/design-patterns-overview.md");
assert.equal(designPatterns.length, 23);
assert.equal(Object.keys(learningRedirects).length, 48);
assert.match(overview, /draft: false/);
assert.match(overview, /## Class scope and object scope/);
const compiler = ["g++", "clang++", "cl"].find((command) => {
  const result = spawnSync(command, command === "cl" ? [] : ["--version"], { encoding: "utf8" });
  return !result.error;
});
if (process.env.CI && !compiler) throw new Error("CI requires a C++20 compiler to verify the published examples.");

await mkdir(path.join(root, "tmp"), { recursive: true });
const temporary = await mkdtemp(path.join(root, "tmp", "pattern-posts-"));
let compiled = 0;
function run(command, args) {
  const result = spawnSync(command, args, { cwd: temporary, encoding: "utf8" });
  assert.equal(result.status, 0, `${command} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout.replaceAll("\r\n", "\n");
}

try {
  for (const pattern of designPatterns) {
    const post = await read(`src/content/blog/design-pattern-${pattern.slug}.md`);
    assert.ok(post.includes(`title: "${pattern.name} (${pattern.category} Pattern)"`), pattern.slug);
    assert.match(post, /category: "Design Patterns"/);
    assert.match(post, /draft: false/);
    assert.ok(post.includes(`](${patternOverview})`), `Missing overview backlink: ${pattern.slug}`);
    assert.ok(overview.includes(`](${patternArticlePath(pattern.slug)})`), `Missing overview link: ${pattern.slug}`);
    assert.equal(learningRedirects[`/learning/patterns/${pattern.slug}/`], patternArticlePath(pattern.slug));
    assert.equal(learningRedirects[`/learning/patterns/${pattern.slug}/ar/`], patternArticlePath(pattern.slug));
    const cover = `public/images/writing/patterns/${pattern.slug}.webp`;
    await access(path.join(root, cover));
    await access(path.join(root, `public/images/writing/patterns/diagrams/${pattern.slug}.svg`));
    assert.ok(post.includes(`image: "/images/writing/patterns/${pattern.slug}.webp"`));
    assert.match(post, /## Reading the illustration/);
    const code = post.match(/## Modern C\+\+20 Example\s+```cpp\n([\s\S]*?)\n```/)?.[1];
    const expected = post.match(/## Example Output\s+```text\n([\s\S]*?)\n```/)?.[1];
    assert.ok(code && expected, `Missing code or expected output: ${pattern.slug}`);
    // Ignore fenced examples when resolving Markdown links: C++ lambdas also use []().
    const prose = post.replace(/```[^\n]*\n[\s\S]*?```/g, "");
    for (const [, href] of prose.matchAll(/\]\((\/[^)]+)\)/g)) {
      const target = href.split("#")[0];
      if (target.startsWith("/blog/")) {
        await access(path.join(root, "src/content", `${target.slice(1).replace(/\/$/, "")}.md`));
      } else {
        await access(path.join(root, "public", target));
      }
    }
    if (compiler) {
      const { writeFile } = await import("node:fs/promises");
      const source = path.join(temporary, `${pattern.slug}.cpp`);
      const binary = path.join(temporary, `${pattern.slug}${process.platform === "win32" ? ".exe" : ""}`);
      await writeFile(source, `${code}\n`, "utf8");
      if (compiler === "cl") run(compiler, ["/nologo", "/std:c++20", "/EHsc", "/utf-8", "/W4", source, `/Fe:${binary}`]);
      else run(compiler, ["-std=c++20", "-Wall", "-Wextra", "-pedantic", source, "-o", binary]);
      assert.equal(run(binary, []), `${expected}\n`, `Output mismatch: ${pattern.slug}`);
      compiled += 1;
    }
  }
} finally {
  // Only remove the unique directory created by this run within the workspace's tmp directory.
  await rm(temporary, { recursive: true, force: true });
}
console.log(`Pattern series: 24 posts, 23 covers/diagrams, overview links and 48 redirects verified. C++ examples: ${compiled} passed, ${23 - compiled} skipped${compiler ? "" : " (no local compiler)"}.`);
