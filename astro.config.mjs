// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { legacyRedirects } from './src/data/redirects.mjs';

export default defineConfig({
  site: 'https://sanfor2004.com',
  // Old live-site URLs (/blog/..., /learning/patterns/..., /tags/..., old /projects/<slug>/) -> new pages.
  redirects: legacyRedirects,
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
