import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { site } from "../site";

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: `${site.author} / Sanfor — Technical Articles`,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    description: site.description,
    site: context.site ?? new URL(site.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id.replace(/\.mdx?$/, "")}/`,
      categories: post.data.tags,
      customData: `<dc:creator>${site.author}</dc:creator>`,
    })),
  });
};
