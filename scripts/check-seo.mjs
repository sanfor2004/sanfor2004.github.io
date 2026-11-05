// SEO snippet check for the built site. Run after `npm run build`:
//   node scripts/check-seo.mjs            report + exit 1 on any failure
//   node scripts/check-seo.mjs --json f   also write { route: { title, description } } to f
//
// Flags, per indexable page in dist/**/*.html:
//   - <title> longer than 60 characters (Google cuts it off around there)
//   - meta description missing or outside 120–160 characters
//   - the same title or description on more than one page
// Skipped: redirect stubs (meta refresh / noindex), 404.html, and HTML copied as-is from public/.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

if (!existsSync(DIST)) {
  console.error('check-seo: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();

const len = (s) => [...s].length;

// Attribute value of the first <meta> whose `attr` equals `value` (attribute order doesn't matter).
const meta = (html, attr, value) => {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = tag.match(new RegExp(`\\b${attr}\\s*=\\s*["']([^"']*)["']`, 'i'));
    if (a && a[1].toLowerCase() === value) {
      const c = tag.match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i);
      return c ? decode(c[1] ?? c[2]) : '';
    }
  }
  return null;
};

const pages = [];
const skipped = [];
for (const file of walk(DIST).sort()) {
  const rel = relative(DIST, file).split(sep).join('/');
  const route = '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const robots = meta(html, 'name', 'robots') ?? '';
  // public/*.html (verification files, the email-signature helper) are copied as-is, not site pages.
  const passthrough = existsSync(join('public', rel));
  if (rel === '404.html' || passthrough || meta(html, 'http-equiv', 'refresh') !== null || /noindex/i.test(robots)) {
    skipped.push(route);
    continue;
  }
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  pages.push({ route, title: t ? decode(t[1]) : null, description: meta(html, 'name', 'description') });
}

const failures = [];
for (const p of pages) {
  if (!p.title) failures.push([p.route, 'missing <title>']);
  else if (len(p.title) > TITLE_MAX) failures.push([p.route, `title ${len(p.title)} chars (> ${TITLE_MAX}): ${p.title}`]);
  if (!p.description) failures.push([p.route, 'missing meta description']);
  else if (len(p.description) < DESC_MIN || len(p.description) > DESC_MAX)
    failures.push([p.route, `description ${len(p.description)} chars (want ${DESC_MIN}–${DESC_MAX}): ${p.description}`]);
}
for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const p of pages) if (p[key]) seen.set(p[key], [...(seen.get(p[key]) ?? []), p.route]);
  for (const [value, routes] of seen)
    if (routes.length > 1) failures.push([routes.join(', '), `duplicate ${key}: ${value}`]);
}

const jsonAt = process.argv.indexOf('--json');
if (jsonAt !== -1 && process.argv[jsonAt + 1]) {
  writeFileSync(
    process.argv[jsonAt + 1],
    JSON.stringify(Object.fromEntries(pages.map((p) => [p.route, { title: p.title, description: p.description }])), null, 2),
  );
}

console.log(`check-seo: ${pages.length} pages checked, ${skipped.length} skipped (redirects, 404, public/ files).`);
if (failures.length) {
  for (const [where, msg] of failures) console.log(`  ✗ ${where}  ${msg}`);
  console.log(`check-seo: ${failures.length} problem(s).`);
  process.exit(1);
}
console.log('check-seo: all titles ≤ 60, descriptions 120–160, no duplicates.');
