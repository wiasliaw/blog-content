import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Frontmatter Schema
 * 
 * Required fields:
 * - title: string - The post title
 * - description: string - For SEO meta description
 * - created: date - Creation date
 * 
 * Optional fields:
 * - modified: date - Last modification date
 * - showCreated: boolean - Whether to display created date (default: true)
 * - showModified: boolean - Whether to display modified date (default: true)
 * - dateFormat: string - Date format pattern (default: 'YYYY-MM-DD')
 *   Supported patterns: YYYY, MM, DD, M, D
 *   Examples: 'YYYY-MM-DD', 'YYYY/MM/DD', 'MM-DD-YYYY', 'YYYY年MM月DD日'
 * - tags: string[] - Category tags
 * - draft: boolean - Hide from production
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    
    // Optional fields
    modified: z.coerce.date().optional(),
    showCreated: z.boolean().default(true),
    showModified: z.boolean().default(true),
    dateFormat: z.string().default('YYYY-MM-DD'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
