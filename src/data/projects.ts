export type ProjectCategory = 'client' | 'product' | 'oss';

export interface Project {
  slug: string;
  category: ProjectCategory;
  title: string;
  subtitle: string;
  result: string;
  tags: string[];
  /** Case study page, or the GitHub repo. Rows without one render as plain (non-link) rows. */
  href?: string;
}

export const categoryLabel: Record<ProjectCategory, string> = {
  client: 'Client work',
  product: 'Product',
  oss: 'Open source',
};

/** Order matters: client work first, then products, then open source. */
export const projects: Project[] = [
  { slug: 'skylimit', category: 'client', title: 'Lead-gen & loan platform', subtitle: 'Skylimit LLC', result: 'Built from scratch: 5.4M+ leads, 53,000+ orders, $1.35M+ in payments processed.', tags: ['PHP', 'Twilio', 'Plivo', 'Stripe', 'IVR'], href: '/projects/skylimit/' },
  { slug: 'erateapp', category: 'client', title: 'eRateApp.com', subtitle: 'School collaboration platform', result: 'Adopted by 200+ schools in its first two months.', tags: ['PHP', 'JavaScript', 'MySQL', 'WebSocket'], href: '/projects/erateapp/' },
  { slug: '360vision', category: 'product', title: '360Vision', subtitle: 'Browser-based 360° tour studio', result: 'Authoring, hotspots, floor plans and a viewer, end to end.', tags: ['Next.js', 'Three.js', 'Prisma', 'MySQL'], href: 'https://github.com/sanfor2004/360vision' },
  { slug: 'zomzam', category: 'product', title: 'Zomzam', subtitle: 'Professional operating system', result: 'Life, CRM and more on one identity. In progress.', tags: ['Product', 'Brand', 'Systems'] },
  { slug: 'php-hls-streamer', category: 'oss', title: 'php-hls-streamer', subtitle: 'HLS streaming backend', result: 'Chunked ingestion, async transcoding, renditions and cloud upload.', tags: ['PHP', 'FFmpeg', 'HLS'], href: 'https://github.com/sanfor2004/php-hls-streamer' },
  { slug: 'xgs', category: 'oss', title: 'XGS', subtitle: 'Recon & dorking utility', result: 'Searches standard and onion sites. 60+ GitHub stars.', tags: ['Python', 'Security'], href: 'https://github.com/sanfor2004/XGS' },
  { slug: 'xcve', category: 'oss', title: 'XCVE', subtitle: 'CVE lookup tool', result: 'Fast vulnerability research against CVE.MITRE.ORG.', tags: ['Python', 'Security'], href: 'https://github.com/sanfor2004/XCVE' },
  { slug: 'bigdpp', category: 'oss', title: 'BigDPP', subtitle: 'Discord operations bot', result: 'Moderation, audits and automation for a 450-member server.', tags: ['C++20', 'PostgreSQL', 'Docker'], href: 'https://github.com/sanfor2004/BigDPP' },
  { slug: 'design-patterns-23', category: 'oss', title: 'Design-Patterns-23', subtitle: 'All 23 GoF patterns', result: 'Plain-language docs with C++20 examples.', tags: ['C++20', 'Docs'], href: 'https://github.com/sanfor2004/23-Design-Patterns' },
  { slug: 'i18n-translator', category: 'oss', title: 'Multi-Region i18n Translator', subtitle: 'Localization system', result: 'Region-aware text and image delivery.', tags: ['JavaScript', 'PHP'], href: 'https://github.com/sanfor2004/Multi-Region-Tag-Translator-i18n' },
];
