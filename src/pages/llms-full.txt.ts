// Expanded context file (/llms-full.txt) with full service breakdowns, case studies, and article bodies.
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site, services, steps, stats, statsNote, clients } from '../data/site';
import { erpPlatforms, erpTiers, erpFaqs } from '../data/erp-services';
import { projects } from '../data/projects';
import { skylimit, erateapp } from '../data/case-studies';

export async function GET(_context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const studies = [skylimit, erateapp];

  const lines: string[] = [
    `# ${site.name} — Full Context for Generative & Answer Engines`,
    '',
    `> Product-Minded Software Engineer (Backend, APIs & Automation) in ${site.location}. ${site.description}`,
    '',
    '## 1. Identity & Verified Proof Points',
    '',
    '- **Full Name**: Ahmed Abdelaziz Hanafy',
    '- **Known As**: Sanfor (`sanfor2004`)',
    '- **Role**: Product-Minded Software Engineer (Backend, APIs & Automation)',
    '- **Location**: Alexandria, Egypt',
    `- **Booking**: ${site.bookCall}`,
    `- **Email**: ${site.email}`,
    `- **Headline Metrics**: ${stats.map((s) => `${s.value} ${s.label}`).join(' · ')} (${statsNote} 339,000+ monthly messages and calls on Twilio/Plivo/Stripe).`,
    `- **Clients**: ${clients.map((c) => `${c.name} (${c.href})`).join(', ')} and more.`,
    '',
    '## 2. How Engagement Works',
    '',
    ...steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.desc}`),
    '',
    '## 3. Core Engineering Services',
    '',
    ...services.map((s) => `- **${s.title}**: ${s.desc}`),
    '',
    `## 4. ERP & Systems Integration (${site.url}/services/erp/)`,
    '',
    `Platforms: ${erpPlatforms.map((p) => p.label).join(', ')}.`,
    '',
    ...erpTiers.flatMap((t, i) => [
      `### Tier 0${i + 1}: ${t.title}`,
      t.desc,
      ...t.bullets.map((b) => `- ${b}`),
      `Tech stack: ${t.tags.join(', ')}`,
      '',
    ]),
    '### ERP Frequently Asked Questions',
    '',
    ...erpFaqs.flatMap((f) => [`**Q: ${f.q}**`, `A: ${f.a}`, '']),
    '## 5. Client Case Studies (In Depth)',
    '',
    ...studies.flatMap((cs) => [
      `### ${cs.seoTitle} (${site.url}/projects/${cs.slug}/)`,
      `- **Client**: ${cs.client}`,
      `- **Role**: ${cs.role} (${cs.years})`,
      `- **Stack**: ${cs.stack.join(', ')}`,
      `- **Key Stats**: ${cs.stats.map((s) => `${s.value} ${s.label}`).join(', ')}`,
      '',
      '**Problem:**',
      ...cs.problem.map((p) => `- ${p}`),
      '',
      '**Role & Ownership:**',
      ...cs.myRole.map((p) => `- ${p}`),
      '',
      '**What Was Built:**',
      ...cs.built.map((b) => `- **${b.title}**: ${b.desc}`),
      '',
      '**Results:**',
      ...cs.results.map((r) => `- ${r}`),
      '',
    ]),
    '## 6. Products & Open-Source Tools',
    '',
    ...projects.map((p) => {
      const link = p.href ? (p.href.startsWith('http') ? p.href : `${site.url}${p.href}`) : site.url;
      return `- **${p.title}** (${p.subtitle} · ${p.category}): ${p.result} | Stack: ${p.tags.join(', ')} | URL: ${link}`;
    }),
    '',
    '## 7. Published Technical Articles (Full Text)',
    '',
    ...articles.flatMap((a) => [
      '---',
      `### ${a.data.title}`,
      `- **URL**: ${site.url}/articles/${a.id}/`,
      `- **Published**: ${a.data.date.toISOString().slice(0, 10)}`,
      `- **Topic**: ${a.data.topic}`,
      `- **Tags**: ${a.data.tags.join(', ')}`,
      `- **Summary**: ${a.data.description}`,
      '',
      a.body ?? '',
      '',
    ]),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

