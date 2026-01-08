// @ts-check
import { defineConfig } from 'astro/config';
import remarkWikiLink from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Change this to your actual site URL
  site: 'https://example.com',

  output: 'static',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tags/'),
    }),
  ],

  markdown: {
    remarkPlugins: [
      [remarkWikiLink, {
        pageResolver: (/** @type {string} */ name) => [name.toLowerCase().replace(/ /g, '-')],
        hrefTemplate: (/** @type {string} */ permalink) => `/posts/${permalink}`,
        wikiLinkClassName: 'wiki-link',
        aliasDivider: '|',
      }],
      remarkMath,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});