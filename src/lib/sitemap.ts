const noIndexPaths = new Set(["/testblog/", "/ui-kit/", "/404/", "/404.html"]);

const redirectPathPrefixes = ["/learning/"];

/**
 * Keep only canonical, same-origin HTML pages in the sitemap.
 *
 * Astro's redirect routes and pages marked noindex are public URLs, but they
 * should not be submitted to search engines as crawlable content URLs.
 */
export function shouldIncludeInSitemap(page: string): boolean {
  const url = new URL(page);

  if (url.origin !== "http://sanfor2004.com") return false;
  if (url.search || url.hash) return false;
  if (noIndexPaths.has(url.pathname)) return false;
  if (redirectPathPrefixes.some((prefix) => url.pathname.startsWith(prefix))) return false;

  return url.pathname.endsWith("/");
}
