export const site = {
  name: 'Sanfor2004',
  url: 'https://sanfor2004.com',
  description:
    'Backend, automation, AI integration and payments that save businesses hours of manual work. By Ahmed (Sanfor), Alexandria.',
  email: 'contact@sanfor2004.com',
  bookCall: 'https://cal.com/sanfor2004/free-call',
  calLink: 'sanfor2004/free-call', // Cal.com embed: user/event
  calNamespace: 'free-call',
  gaId: 'G-7B8D7CCSRQ', // GA4 (public measurement ID)
  linkedin: 'https://www.linkedin.com/in/sanfor2004',
  upwork: 'https://www.upwork.com/freelancers/~0108502d49f0acdd84',
  contra: 'https://contra.com/sanfor2004',
  location: 'Alexandria, EG',
};

/** /contact/ direct links. */
export const contact = {
  links: [
    { k: 'Email', v: site.email, href: `mailto:${site.email}` },
    { k: 'LinkedIn', v: site.linkedin.replace('https://www.', ''), href: site.linkedin },
    { k: 'Upwork', v: 'Hire me on Upwork', href: site.upwork },
    { k: 'Contra', v: site.contra.replace('https://', ''), href: site.contra },
  ],
};

export const nav = [
  { label: 'About', href: '/about/' },
  { label: 'Work', href: '/projects/' },
  { label: 'Articles', href: '/articles/' },
  { label: 'Art', href: '/art/' },
  { label: 'Links', href: '/links/' },
];

export const footerLinks = [
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'GitHub', href: 'https://github.com/sanfor2004' },
  { label: 'Upwork', href: site.upwork },
  { label: 'X', href: 'https://x.com/Sanfor2004_' },
  { label: 'YouTube', href: 'https://youtube.com/@sanfor2004' },
];

export const linkGroups = [
  { name: 'Freelance', links: [
    { label: 'Upwork', href: site.upwork },
    { label: 'Contra', href: site.contra },
    { label: 'Cal.com', href: site.bookCall },
  ]},
  { name: 'Writing', links: [
    { label: 'DEV', href: 'https://dev.to/sanfor2004' },
    { label: 'Medium', href: 'https://medium.com/@Sanfor2004' },
  ]},
  { name: 'Founder & tech', links: [
    { label: 'GitHub', href: 'https://github.com/sanfor2004' },
    { label: 'Product Hunt', href: 'https://producthunt.com/@sanfor2004' },
    { label: 'Indie Hackers', href: 'https://indiehackers.com/sanfor2004' },
    { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/33080645/ahmed-abdelaziz-sanfor' },
    { label: 'TryHackMe', href: 'https://tryhackme.com/p/sanfor2004' },
  ]},
  { name: 'Design & video', links: [
    { label: 'Behance', href: 'https://be.net/sanfor2004' },
    { label: 'Dribbble', href: 'https://dribbble.com/sanfor2004' },
    { label: 'YouTube', href: 'https://youtube.com/@sanfor2004' },
  ]},
  { name: 'Social', links: [
    { label: 'LinkedIn', href: site.linkedin },
    { label: 'X', href: 'https://x.com/Sanfor2004_' },
    { label: 'Instagram', href: 'https://instagram.com/sanfor2004.official' },
    { label: 'Threads', href: 'https://threads.com/@sanfor2004.official' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/sanfor2004.com' },
    { label: 'Reddit', href: 'https://reddit.com/user/sanfor2004' },
  ]},
];

/** The painted story series. Order matters: it is the story. */
export const figures = {
  quietMachine: { src: '/images/fig-01-quiet-machine.webp', fig: 'Fig. 01 — The quiet machine', alt: 'Painting: a young man at a wooden workbench watching a small paper machine, orange paper strips flowing across the floor like waves' },
  nightShift: { src: '/images/fig-02-night-shift.webp', fig: 'Fig. 02 — The night shift', alt: 'Painting: the same man late at night, buried in stacks of paper, copying numbers by hand under a desk lamp' },
  runsOnItsOwn: { src: '/images/fig-03-runs-on-its-own.webp', fig: 'Fig. 03 — It runs on its own', alt: 'Painting: he relaxes with a cup of tea while the machine runs on its own, orange paper strips flowing out the window toward the city' },
  firstConversation: { src: '/images/fig-04-first-conversation.webp', fig: 'Fig. 04 — The first conversation', alt: 'Painting: he and a client talk across the workbench over tea while a hand sketches a simple diagram' },
  yoursToKeep: { src: '/images/fig-05-yours-to-keep.webp', fig: 'Fig. 05 — Yours to keep', alt: 'Painting: at sunrise he hands a client a small wrapped paper machine at the workshop door' },
};

/**
 * About page self-portrait (painting); `avatar` is a square face crop for the article author card.
 * Originals kept beside them. The previous photo (ahmed-abdelaziz.png/.webp) stays as the old version.
 */
export const portrait = {
  src: '/images/ahmed-self-portrait.webp',
  avatar: '/images/ahmed-self-portrait-avatar.webp',
  alt: 'Painted self-portrait of Ahmed at a wooden desk by a window, sketching a diagram with an orange pencil',
  fig: 'Fig. — Self-portrait',
  width: 806,
  height: 1003,
};

/**
 * /art/ gallery. Order, titles and alt text carried over from the previous site.
 * Files are web-sized WebP copies; the full-resolution originals sit beside them.
 */
export const artworks = [
  { src: '/images/art/gallery/lameees.webp', width: 924, height: 1200, title: 'Lameees / portrait', alt: 'Original anime-style digital portrait of a brown-haired character with Pikachu ears and green clothing.' },
  { src: '/images/art/gallery/charmeleon.webp', width: 1200, height: 1200, title: 'Charmeleon study', alt: 'Original digital fan-art drawing of Charmeleon with an orange flaming tail on a dark gray background.' },
  { src: '/images/art/gallery/horse-drawing.webp', width: 1200, height: 900, title: 'Horse portrait', alt: 'Original sepia horse portrait drawing by Ahmed Abdelaziz, showing a horse head, flowing mane, and hand-drawn signature.' },
  { src: '/images/art/gallery/lameees-2.webp', width: 924, height: 1200, title: 'Lameees / wink', alt: 'Original anime-style digital portrait of a brown-haired character with Pikachu ears, winking.' },
  { src: '/images/art/gallery/flower.webp', width: 934, height: 918, title: 'Orange bloom', alt: 'Original digital drawing of a bright orange five-petal flower with a green stem.' },
  { src: '/images/art/gallery/bulbasaur.webp', width: 1200, height: 1200, title: 'Bulbasaur / garden cap', alt: 'Original digital drawing of Bulbasaur wearing a dark green hat with a white flower.' },
  { src: '/images/art/gallery/butterflyfree.webp', width: 1200, height: 1200, title: 'Butterfly creature', alt: 'Original digital drawing of a purple butterfly-inspired creature with pink antennae and blue details.' },
  { src: '/images/art/gallery/pidgey.webp', width: 1200, height: 1200, title: 'Pidgey / call', alt: 'Original digital drawing of Pidgey with an open beak and layered brown feathers.' },
  { src: '/images/art/gallery/wartortle.webp', width: 1200, height: 1200, title: 'Wartortle / focus', alt: 'Original digital drawing of Wartortle with blue ears and determined eyes.' },
  { src: '/images/art/gallery/gum.webp', width: 1200, height: 895, title: 'Violet portrait', alt: 'Original chibi-style digital portrait of a purple-haired character with closed eyes and pink cheeks.' },
  { src: '/images/art/gallery/rattata.webp', width: 1200, height: 1200, title: 'Rattata / run', alt: 'Original digital drawing of a purple Rattata in a crouching pose.' },
  { src: '/images/art/gallery/kakuna.webp', width: 1200, height: 1200, title: 'Kakuna study', alt: 'Original digital drawing of Kakuna, a yellow cocoon-like creature, on a white background.' },
  { src: '/images/art/gallery/tiger.webp', width: 1200, height: 626, title: 'Tiger / line study', alt: 'Original golden line-art drawing of a tiger head on a transparent background.' },
  { src: '/images/art/gallery/hand.webp', width: 1200, height: 479, title: 'Hands and orb', alt: 'Original digital drawing of yellow cartoon hands holding a pale orb.' },
  { src: '/images/art/gallery/horse-far-view.webp', width: 1200, height: 651, title: 'Horse / gallop', alt: 'Original sepia line drawing of a galloping horse with a flowing mane and tail, hatched shading and a hand-drawn signature, on a transparent background.' },
];

export const stats = [
  { value: '5.4M', label: 'leads processed' },
  { value: '53k', label: 'orders handled' },
  { value: '$1.35M', label: 'in payments processed' },
];
/** Context line under the home stats. Owner-approved; no company name on purpose. */
export const statsNote = "Across 3+ years building a client's lead-gen, telephony and payments systems.";

export const services = [
  { title: 'Backend & APIs', desc: 'Laravel, Django and Node services that stay fast under real traffic.' },
  { title: 'Automation', desc: 'Spreadsheet and copy-paste work, turned into pipelines that run themselves.' },
  { title: 'AI integration', desc: 'LLMs wired into real workflows, with guardrails, not demos.' },
  { title: 'Payments', desc: 'Checkout, subscriptions and payouts that reconcile to the cent.' },
];

export const steps = [
  { title: 'A free call', desc: "Show me the manual work. I'll tell you honestly if I can fix it." },
  { title: 'Plan & quote', desc: 'A short written plan: scope, timeline, fixed price.' },
  { title: 'Build & hand off', desc: 'Shipped, documented, yours. No lock-in.' },
];
