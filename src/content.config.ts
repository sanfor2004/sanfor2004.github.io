import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { topics } from './data/articles';

const articles = defineCollection({
  // Files starting with _ are ignored: keep drafts/templates as _name.md
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Cover image under public/ (root-relative path). Used as the article's
    // social preview; restored from the pre-merge blog posts.
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
    date: z.coerce.date(),
    // The list lives in src/data/articles.ts (shared with the /articles/ filter).
    topic: z.enum(topics),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Carried over from the pre-merge root project: no equivalent existed here.
// Content preserved as-is; individual case-study pages beyond /projects/skylimit
// are not wired up yet (see docs/status.md).
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    status: z.string(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
  }),
});

export const collections = { articles, projects };
