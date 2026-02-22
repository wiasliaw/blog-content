import { defineConfig } from './src/lib/config';

export default defineConfig({
  // Content loader configuration
  // content: {
  //   patterns: ['**/*.md'],
  //   base: './content/posts',
  // },

  // Schema configuration
  // schema: {
  //   dateModifiedField: 'modified',
  //   optionalDescription: false,
  //   optionalTags: false,
  //   extraFields: (z) => ({
  //     permalink: z.string().nullish(),
  //   }),
  // },

  // Additional remark plugins
  // remarkPlugins: [
  //   './src/plugins/my-plugin.mjs',
  // ],
});
