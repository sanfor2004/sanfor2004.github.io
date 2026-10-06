// RSS feed of published articles at /rss.xml (newest first). Uses the `site` URL from astro.config.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${site.name} — Articles`,
    description: 'Notes on backend, automation, design patterns and systems, by Ahmed (Sanfor).',
    site: context.site ?? site.url,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: `/articles/${a.id}/`,
      categories: [a.data.topic, ...a.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
