import { site } from "../site";

export const person = {
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.author,
  alternateName: ["Sanfor", site.handle, "Ahmed Abdelaziz Hanafy"],
  jobTitle: site.jobTitle,
  url: `${site.url}/about/`,
  sameAs: site.contactPlaceholders.map(({ href }) => href),
  knowsAbout: ["Systems engineering", "Backend engineering", "C++", "C", "Linux", "Networking", "Databases", "Performance", "Software architecture"],
};

export type Breadcrumb = { name: string; href: string };
export const breadcrumbSchema = (items: Breadcrumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: new URL(item.href, site.url).href,
  })),
});
