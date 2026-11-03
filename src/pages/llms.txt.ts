// Machine-readable index for generative AI engines (/llms.txt specification).
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site, services, stats, statsNote, clients } from '../data/site';
import { erpPlatforms, erpTiers, erpFaqs } from '../data/erp-services';
import { projects } from '../data/projects';

export async function GET(_context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const clientProjects = projects.filter((p) => p.category === 'client');
  const productProjects = projects.filter((p) => p.category === 'product');
  const ossProjects = projects.filter((p) => p.category === 'oss');

  const lines: string[] = [
    `# ${site.name} — Ahmed Abdelaziz Hanafy (Sanfor)`,
    '',
    `> Product-Minded Software Engineer (Backend, APIs & Automation) based in ${site.location}. ${site.description}`,
    '',
    '## Summary & Verified Track Record',
    '',
    `- **Name**: Ahmed Abdelaziz Hanafy (known online as **Sanfor**, handle \`sanfor2004\`)`,
    `- **Positioning**: Product-Minded Software Engineer (Backend, APIs & Automation)`,
    `- **Location**: Alexandria, Egypt (working remotely with international clients)`,
    `- **Track Record**: ${stats.map((s) => `${s.value} ${s.label}`).join(', ')} (${statsNote} Telephony & payments pipelines on Twilio, Plivo and Stripe handling 339,000+ messages and calls a month).`,
    `- **Trusted By**: ${clients.map((c) => `[${c.name}](${c.href})`).join(', ')} and more.`,
    `- **Book a Free Call**: [Cal.com](${site.bookCall})`,
    `- **Business Email**: ${site.email}`,
    `- **Full Context File**: [${site.url}/llms-full.txt](${site.url}/llms-full.txt)`,
    '',
    '## Core Services',
    '',
    ...services.map((s) => `- **${s.title}**: ${s.desc}`),
    '',
    `## ERP & Systems Integration ([${site.url}/services/erp/](${site.url}/services/erp/))`,
    '',
    `Supported platforms: ${erpPlatforms.map((p) => p.label).join(', ')}.`,
    '',
    ...erpTiers.map(
      (t, i) =>
        `- **Tier 0${i + 1} — ${t.title}**: ${t.desc} (${t.bullets.join('; ')})`
    ),
    '',
    '### ERP Frequently Asked Questions',
    '',
    ...erpFaqs.map((f) => `- **${f.q}** ${f.a}`),
    '',
    '## Client Case Studies',
    '',
    ...clientProjects.map((p) => {
      const url = p.href ? new URL(p.href, site.url).toString() : site.url;
      return `- [${p.title} — ${p.subtitle}](${url}): ${p.result} (Stack: ${p.tags.join(', ')})`;
    }),
    '',
    '## Products',
    '',
    ...productProjects.map((p) => {
      const label = p.href ? `[${p.title}](${p.href})` : `**${p.title}**`;
      return `- ${label} (${p.subtitle}): ${p.result} (Stack: ${p.tags.join(', ')})`;
    }),
    '',
    '## Open-Source Software & Tools',
    '',
    ...ossProjects.map(
      (p) =>
        `- [${p.title}](${p.href}) (${p.subtitle}): ${p.result} (Stack: ${p.tags.join(', ')})`
    ),
    '',
    '## Technical Articles',
    '',
    ...articles.map(
      (a) =>
        `- [${a.data.title}](${site.url}/articles/${a.id}/) (${a.data.topic}): ${a.data.description}`
    ),
    '',
    '## Key Pages & Profiles',
    '',
    `- [Home](${site.url}/)`,
    `- [About Ahmed (Sanfor)](${site.url}/about/)`,
    `- [ERP & Systems Integration Services](${site.url}/services/erp/)`,
    `- [Work & Case Studies](${site.url}/projects/)`,
    `- [Articles](${site.url}/articles/)`,
    `- [Art Gallery](${site.url}/art/)`,
    `- [Contact & Booking](${site.url}/contact/)`,
    `- [RSS Feed](${site.url}/rss.xml)`,
    `- [LinkedIn](${site.linkedin})`,
    '- [GitHub](https://github.com/sanfor2004)',
    `- [Upwork](${site.upwork})`,
    `- [Contra](${site.contra})`,
    '- [DEV](https://dev.to/sanfor2004)',
    '- [Medium](https://medium.com/@Sanfor2004)',
    '- [X](https://x.com/Sanfor2004_)',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

