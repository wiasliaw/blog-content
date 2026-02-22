import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '{articles,context,foundry_series}/**/*.md', base: '.' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    modified: z.coerce.date().optional(),
    showCreated: z.boolean().default(true),
    showModified: z.boolean().default(true),
    dateFormat: z.string().default('YYYY-MM-DD'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
