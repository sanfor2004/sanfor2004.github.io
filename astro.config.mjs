import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { learningRedirects } from "./src/data/design-pattern-series.mjs";

export default defineConfig({
  site: "https://sanfor2004.github.io",
  trailingSlash: "always",
  redirects: learningRedirects,
  integrations: [
    react(),
    sitemap({ filter: (page) => {
      const pathname = new URL(page).pathname;
      return !["/testblog/", "/404/", "/404.html"].includes(pathname) && !pathname.startsWith("/learning/");
    } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
