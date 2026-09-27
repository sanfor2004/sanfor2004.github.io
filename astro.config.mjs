import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { learningRedirects } from "./src/data/design-pattern-series.mjs";
import { shouldIncludeInSitemap } from "./src/lib/sitemap";

export default defineConfig({
  site: "http://sanfor2004.com",
  trailingSlash: "always",
  redirects: learningRedirects,
  integrations: [
    react(),
    sitemap({ filter: shouldIncludeInSitemap }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
