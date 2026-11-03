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

