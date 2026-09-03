import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const shared = {
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    ...shared,
    image: z.string(),
    imageAlt: z.string(),
    category: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    ...shared,
    status: z.string(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
  }),
});

export const collections = { blog, projects };
