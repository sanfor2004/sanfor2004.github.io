type EventName = "page_view" | "project_view" | "article_view" | "outbound_github_click" | "linkedin_click" | "contact_click";
type Parameters = { page_location?: string; page_referrer?: string; page_title?: string; article?: string; project?: string; destination?: string };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __sanforAnalytics?: boolean;
  }
}

export function trackEvent(name: EventName, parameters: Parameters = {}) {
  try { window.gtag?.("event", name, parameters); } catch { /* Analytics must never interrupt navigation. */ }
}

export function initializeAnalytics() {
  const id = document.querySelector<HTMLMetaElement>('meta[name="sanfor-ga-id"]')?.content;
  if (!id || window.__sanforAnalytics) return;
  window.__sanforAnalytics = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer?.push(arguments); };
  window.gtag("js", new Date());
  // Canonical URLs omit query strings and fragments, which can contain personal data.
  const location = () => document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href;
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).origin + "/" : ""; } catch { /* Ignore malformed referrers. */ }
  window.gtag("config", id, { send_page_view: false, page_location: location(), page_referrer: referrer, allow_google_signals: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
  let lastMain: Element | null = null;
  const pageView = () => {
    const main = document.querySelector<HTMLElement>("main");
    if (!main || main === lastMain) return;
    lastMain = main;
    const current = location();
    window.gtag?.("set", { page_location: current, page_referrer: referrer, page_title: document.title });
    trackEvent("page_view", { page_location: current, page_referrer: referrer, page_title: document.title });
    if (main.dataset.contentKind === "article") trackEvent("article_view", { article: main.dataset.contentId });
    if (main.dataset.contentKind === "project") trackEvent("project_view", { project: main.dataset.contentId });
    referrer = current;
  };
  document.addEventListener("astro:page-load", pageView);
  // Covers initialization after the initial lifecycle event without double counting.
  if (document.readyState === "complete") pageView();
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(link instanceof HTMLAnchorElement)) return;
    const url = new URL(link.href);
    if (url.hostname === "github.com") trackEvent("outbound_github_click", { destination: url.origin + url.pathname });
    else if (url.hostname === "www.linkedin.com") trackEvent("linkedin_click", { destination: "linkedin" });
    else if (url.origin === window.location.origin && url.pathname === "/contact/") trackEvent("contact_click");
  });
}
