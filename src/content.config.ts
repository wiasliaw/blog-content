import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { loadConfig } from './lib/config';

const config = await loadConfig();

/**
 * Frontmatter Schema
 * 
 * Required fields:
 * - title: string - The post title
 * - description: string - For SEO meta description
 * - created: date - Creation date
 * 
 * Optional fields:
 * - modified (or custom name via config): date - Last modification date
 * - showCreated: boolean - Whether to display created date (default: true)
 * - showModified: boolean - Whether to display modified date (default: true)
 * - dateFormat: string - Date format pattern (default: 'YYYY-MM-DD')
 * - tags: string[] - Category tags
 * - draft: boolean - Hide from production
 */

// Build description field based on config
const descriptionField = config.schema.optionalDescription
  ? z.string().nullish().transform((v) => v ?? '')
  : z.string();

// Build tags field based on config
const tagsField = config.schema.optionalTags
  ? z.array(z.string()).nullish().transform((v) => v ?? [])
  : z.array(z.string()).default([]);

// Build the base schema
const baseFields: Record<string, z.ZodTypeAny> = {
  title: z.string(),
  description: descriptionField,
  created: z.coerce.date(),
  [config.schema.dateModifiedField]: z.coerce.date().optional(),
  showCreated: z.boolean().default(true),
  showModified: z.boolean().default(true),
  dateFormat: z.string().default('YYYY-MM-DD'),
  tags: tagsField,
  draft: z.boolean().default(false),
};

// Merge extra fields from config
if (config.schema.extraFields) {
  Object.assign(baseFields, config.schema.extraFields(z));
}

const posts = defineCollection({
  loader: glob({
    pattern: config.content.patterns.length === 1
      ? config.content.patterns[0]
      : `{${config.content.patterns.join(',')}}`,
    base: config.content.base,
  }),
  schema: z.object(baseFields),
});

export const collections = { posts };
