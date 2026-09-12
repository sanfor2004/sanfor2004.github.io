import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { learningRedirects } from "./src/data/design-pattern-series.mjs";

export default defineConfig({
  site: "https://sanfor2004.github.io",
  redirects: learningRedirects,
  integrations: [
    react(),
    sitemap({ filter: (page) => {
      const pathname = new URL(page).pathname;
      return pathname !== "/testblog/" && !pathname.startsWith("/learning/");
    } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
