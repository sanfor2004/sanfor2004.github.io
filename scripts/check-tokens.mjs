// Fails the build if anything off-system sneaks into src/.
// Rules: no arbitrary Tailwind values (p-[13px]), no inline style="", no raw hex colors
// outside styles/global.css. React islands (components/islands) are exempt.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../src', import.meta.url));
const EXEMPT = ['components/islands', 'styles/global.css', 'content/'];
const RULES = [
  { name: 'arbitrary Tailwind value', re: /\b[a-z][a-z0-9:-]*-\[[^\]]+\]/g },
  { name: 'inline style attribute', re: /\sstyle=["{]/g },
  { name: 'raw hex color', re: /#[0-9a-fA-F]{3,8}\b(?![\w-])/g },
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|tsx?|jsx?|css)$/.test(name)) files.push(p);
  }
};
walk(ROOT);

let problems = 0;
for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  if (EXEMPT.some((e) => rel.startsWith(e))) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('check-tokens-ignore')) return;
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.re)) {
        // allow URL fragments like href="#main" and anchors built from slugs
        if (rule.name === 'raw hex color' && /href=|#\$\{|`#/.test(line)) continue;
        console.error(`✖ ${rel}:${i + 1}  ${rule.name}: ${m[0].trim()}`);
        problems++;
      }
    }
  });
}
if (problems) {
  console.error(`\n${problems} off-system value(s). Use tokens from src/styles/global.css.`);
  process.exit(1);
}
console.log(`✓ tokens check passed (${files.length} files)`);
