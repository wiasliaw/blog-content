import { defineConfig } from './src/lib/config';

export default defineConfig({
  content: {
    patterns: ['{articles,context,foundry_series}/**/*.md'],
    base: '.',
  },
  schema: {
    dateModifiedField: 'updated',
    optionalDescription: true,
    optionalTags: true,
    extraFields: (z) => ({
      permalink: z.string().nullish(),
    }),
  },
  remarkPlugins: [
    './src/plugins/remark-wiki-embed.mjs',
  ],
});
