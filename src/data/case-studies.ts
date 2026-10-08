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
  // From the owner (2026-10-08).
  problem: [
    'Skylimit had to keep control of more than 5 million leads and over 2,000 accounts, with orders coming in on top.',
    'They needed one organized way to distribute those leads by set rules.',
  ],
  myRole: [
    'I was the engineer behind the platform end to end: architecture, telephony and payment integrations, the data pipeline and the reporting.',
    'The team ranged from 2 to 10 people over the years.',
  ],
  built: [
    { title: 'Telephony layer', desc: 'inbound and outbound calls, SMS and IVR flows on Twilio and Plivo.' },
    { title: 'Payments', desc: 'Stripe checkout and reconciliation for every order.' },
    { title: 'Data cleaning', desc: 'deduplication and validation so millions of leads stayed usable.' },
    { title: 'Reporting', desc: 'the numbers the business ran on, without spreadsheets.' },
  ],
  // None (owner, 2026-10-08: not needed). Hidden while empty.
  screens: [],
  results: [
    '5.4M+ leads processed, 53,341+ orders and $1.35M in payments through a system I built from an empty repo.',
    // Owner's estimate ("maybe more than 48h per week"), so it is worded as one.
    'An estimated 48+ hours of manual work saved every week.',
  ],
  // None (owner, 2026-10-08: not needed). Only ever a real quote from the client. Hidden while missing.
  quote: undefined,
  next: { eyebrow: 'Next project', title: 'eRateApp.com', href: '/projects/erateapp/' },
};

/** Known facts only (owner, 2026-10-08): lead developer, 2024, 200+ schools in two months,
 *  vanilla PHP + JS + MySQL, team of 5, 2–3 contracts per school, contract uploads, schools ↔ equipment, WebSocket live chat, government APIs. */
export const erateapp: CaseStudy = {
  slug: 'erateapp',
  seoTitle: 'Case study: eRateApp.com school platform',
  seoDescription: 'How Sanfor built eRateApp.com as lead developer in vanilla PHP and JavaScript: contract uploads, live chat over WebSocket and government APIs. 200+ schools onboarded in two months.',
  headline: 'A school platform for contracts, equipment and live chat.',
  intro: 'For school owners and top managers. As lead developer, I built it in vanilla PHP and JavaScript: contract uploads, schools connected with equipment, live chat over WebSocket and government API integrations.',
  client: 'eRateApp.com',
  role: 'Lead developer',
  years: '2024',
  stack: ['PHP', 'JavaScript', 'MySQL', 'WebSocket'],
  stats: [
    { value: '200+', label: 'schools onboarded' },
    // 200+ schools × 2–3 contracts each (owner): 400 is the safe low end.
    { value: '400+', label: 'contracts on the platform' },
    { value: '2 months', label: 'from launch to 200+ schools' },
  ],
  // From the owner (2026-10-08).
  problem: [
    'Schools were saving their contracts by hand.',
    "They couldn't easily tell which equipment fit their needs on the smallest budget.",
    'And information about each school had to be searched for, instead of being live in one place.',
  ],
  myRole: [
    'I was the lead developer, building the platform in vanilla PHP and JavaScript, with no framework.',
    'The team was 5 people.',
  ],
  built: [
    { title: 'Contract uploads', desc: 'contracts uploaded straight into the platform.' },
    { title: 'Schools and equipment', desc: 'connecting schools with equipment.' },
    { title: 'Live chat', desc: 'real-time messaging over WebSocket.' },
    { title: 'Government APIs', desc: 'integrations with government APIs.' },
    // From the About page (owner's live-site copy).
    { title: 'Admin and reporting', desc: 'an admin dashboard and financial reporting.' },
  ],
  // None (owner). Hidden while empty.
  screens: [],
  results: [
    'Adopted by 200+ schools in its first two months.',
    'Each school brought 2 to 3 contracts, so 400+ contracts moved through the platform.',
  ],
  // None (owner). Hidden while missing. Never write one on the client's behalf.
  quote: undefined,
  next: { eyebrow: 'More work', title: 'All projects', href: '/projects/' },
};
