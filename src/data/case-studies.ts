/**
 * Client case studies, rendered by sections/CaseStudy.astro.
 * One page file per study (src/pages/projects/<slug>.astro); only client work gets one.
 * Empty arrays / missing optional fields hide that block, and the section numbers close up,
 * so a study can go live before every piece of content exists. Never ship placeholder text.
 */
export interface CaseStudy {
  slug: string;
  /** <title> and meta description */
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
  client: string;
  role: string;
  years: string;
  stack: string[];
  stats: { value: string; label: string }[];
  /** Paragraphs: what was slow, manual or broken before. */
  problem: string[];
  /** Paragraphs: what I owned, team size, who I worked with. */
  myRole: string[];
  built: { title: string; desc: string }[];
  /** Two screenshots, ideally; files in public/images/projects/. `fig` is the caption. */
  screens: { src: string; alt: string; width: number; height: number; fig: string }[];
  /** Paragraphs: what changed for the business. */
  results: string[];
  quote?: { text: string; name: string; role: string };
  next: { eyebrow: string; title: string; href: string };
}

export const skylimit: CaseStudy = {
  slug: 'skylimit',
  seoTitle: 'Case study: Skylimit lead-gen platform',
  seoDescription: "How Sanfor built Skylimit's lead-generation and loan platform from scratch: 5.4M+ leads, 53,341+ orders, $1.35M in payments.",
  headline: 'A lead-gen and loan platform, built from scratch.',
  intro: 'For Skylimit LLC, a Sacramento company, as their remote full-stack engineer: calls, texts, IVR, payments and reporting in one system.',
  client: 'Skylimit LLC · Sacramento, CA',
  role: 'Full-stack engineer (remote)',
  years: '2022 – 2026',
  stack: ['PHP', 'Twilio', 'Plivo', 'Stripe', 'IVR', 'MySQL'],
  stats: [
    { value: '5.4M+', label: 'leads processed' },
    { value: '53,341+', label: 'orders' },
    { value: '$1.35M', label: 'in payments' },
  ],
  // TODO(owner): the problem story: who handled the leads before, what was done by hand,
  // what it cost in hours or missed calls. Hidden while empty.
  problem: [],
  myRole: [
    'I was the engineer behind the platform end to end: architecture, telephony and payment integrations, the data pipeline and the reporting.',
    // TODO(owner): team size and who I worked with, as a second paragraph.
  ],
  built: [
    { title: 'Telephony layer', desc: 'inbound and outbound calls, SMS and IVR flows on Twilio and Plivo.' },
    { title: 'Payments', desc: 'Stripe checkout and reconciliation for every order.' },
    { title: 'Data cleaning', desc: 'deduplication and validation so millions of leads stayed usable.' },
    { title: 'Reporting', desc: 'the numbers the business ran on, without spreadsheets.' },
  ],
  // TODO(owner): 2 screenshots (dashboard, reporting), sensitive data blurred. Hidden while empty.
  screens: [],
  results: [
    '5.4M+ leads processed, 53,341+ orders and $1.35M in payments through a system I built from an empty repo.',
    // TODO(owner): one sentence on hours saved or what the team stopped doing by hand.
  ],
  // TODO(owner): client quote { text, name, role }, if there is one. Hidden while missing.
  quote: undefined,
  // TODO(task 5): point to eRateApp's case study once it exists.
  next: { eyebrow: 'More work', title: 'All projects', href: '/projects/' },
};
