/**
 * ERP & Systems Integration service tiers.
 * Rendered by src/components/sections/ErpServices.astro and the /services/erp/ page.
 */

export const erpPlatforms = [
  { id: 'odoo',     label: 'Odoo' },
  { id: 'sap',      label: 'SAP' },
  { id: 'd365',     label: 'Microsoft Dynamics 365' },
  { id: 'netsuite', label: 'NetSuite' },
] as const;

export type PlatformId = (typeof erpPlatforms)[number]['id'];

export interface ErpTier {
  title: string;
  desc: string;
  /** Specific deliverables, shown as bulleted rows inside the card. */
  bullets: string[];
  /** Tech stack shown as Tag components. */
  tags: string[];
  /** Which platform logos to show on this tier's card. */
  platforms: PlatformId[];
}

export const erpTiers: ErpTier[] = [
  {
    title: 'Custom ERP Integrations & API Connectors',
    desc: 'Connect your e-commerce stack to Odoo, SAP or Dynamics 365 with clean, documented pipelines that hold up under real traffic.',
    bullets: [
      'Shopify / WooCommerce → Odoo / SAP / D365 order pipelines',
      'E-invoicing connectors (UBL, Factur-X, ZUGFeRD)',
      'Custom REST & SOAP middleware with retry and dead-letter queues',
      'Webhook management and real-time event routing',
    ],
    tags: ['Python', 'REST APIs', 'SOAP', 'Node.js', 'Webhooks', 'Odoo', 'SAP'],
    platforms: ['odoo', 'sap', 'd365', 'netsuite'],
  },
  {
    title: 'End-to-End ERP Setup & Deployment',
    desc: 'Full configuration from a clean slate — modules, database, access control and data migration — without business interruption.',
    bullets: [
      'Module selection, configuration and chart-of-accounts setup',
      'Clean PostgreSQL / MySQL database initialisation',
      'Role-based access control (RBAC) and multi-company setup',
      'Legacy data migration with validation and reconciliation reports',
    ],
    tags: ['Odoo', 'PostgreSQL', 'MySQL', 'RBAC', 'Data Migration', 'D365'],
    platforms: ['odoo', 'd365', 'netsuite'],
  },
  {
    title: 'Module Customisation & Workflow Automation',
    desc: 'Custom Python modules, PDF document layouts and multi-tier approval rules built exactly to your business logic — not bolted on top of defaults.',
    bullets: [
      'Custom Odoo Python modules (ORM models, wizards, views)',
      'QWeb PDF templates: invoices, delivery slips, purchase orders',
      'Multi-tier approval workflows (purchase, expense, leave)',
      'Automated scheduled actions and server-side hooks',
    ],
    tags: ['Python', 'Odoo', 'QWeb', 'PostgreSQL', 'Approval Workflows'],
    platforms: ['odoo'],
  },
  {
    title: 'Migration Recovery & Maintenance',
    desc: 'Fix broken integrations, resolve sync bottlenecks and keep your ERP running cleanly month over month.',
    bullets: [
      'Broken webhook diagnosis and rebuild',
      'Sync bottleneck profiling and resolution',
      'API rate-limit handling and back-off strategies',
      'PostgreSQL query tuning and index optimisation',
    ],
    tags: ['PostgreSQL', 'Redis', 'REST APIs', 'Performance', 'Monitoring'],
    platforms: ['odoo', 'sap', 'd365'],
  },
];

export interface ErpFaq {
  q: string;
  a: string;
}

export const erpFaqs: ErpFaq[] = [
  {
    q: 'Which ERP platforms do you integrate and customise?',
    a: 'I work across Odoo, SAP, Microsoft Dynamics 365 and Oracle NetSuite, connecting them with e-commerce platforms (Shopify, WooCommerce), payment processors (Stripe), telephony (Twilio, Plivo), e-invoicing standards (UBL, Factur-X, ZUGFeRD) and custom REST or SOAP APIs.',
  },
  {
    q: 'Can you fix a broken ERP sync or migration without rebuilding from scratch?',
    a: 'Yes. Tier 04 covers migration recovery and maintenance: diagnosing silent webhook failures, profiling database and queue bottlenecks, adding idempotent retry and dead-letter handling, and tuning PostgreSQL or MySQL queries so your existing integration holds up under production load.',
  },
  {
    q: 'How do you prevent duplicate orders or lost data between Shopify and an ERP?',
    a: 'Every connector is built around idempotency keys, verified webhook signatures, persistent retry queues with exponential back-off and dead-letter alerting. If an ERP endpoint times out or rate-limits, events are queued and replayed cleanly without duplicating orders or invoices.',
  },
  {
    q: 'Do you build custom Odoo modules and QWeb PDF reports?',
    a: 'Yes. I write custom Python modules on Odoo ORM (models, views, wizards, scheduled actions, multi-tier purchase and expense approval rules) and custom QWeb PDF layouts for invoices, delivery slips and purchase orders—isolated in clean add-on modules so upgrades stay straightforward.',
  },
  {
    q: 'How does an ERP project start and how is pricing structured?',
    a: 'We start with a free call on Cal.com where you walk me through the workflow or broken sync. You then receive a short written plan with a clear scope, timeline and fixed price. Once delivered, all code and documentation are yours to keep with no vendor lock-in.',
  },
];


