// @ts-check
import { defineConfig } from 'astro/config';
import remarkWikiLink from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Theme configuration
import { themeConfig } from './src/config/theme.config';
import { themes } from './src/styles/themes';

// SSG configuration
import { loadConfig } from './src/lib/config';

const ssgConfig = await loadConfig();

// Resolve user-defined remark plugins
const userRemarkPlugins = await Promise.all(
  ssgConfig.remarkPlugins.map(async (plugin) => {
    if (typeof plugin === 'string') {
      const mod = await import(/* @vite-ignore */ plugin);
      return mod.default ?? mod[Object.keys(mod)[0]];
    }
    if (Array.isArray(plugin) && typeof plugin[0] === 'string') {
      const mod = await import(/* @vite-ignore */ plugin[0]);
      const fn = mod.default ?? mod[Object.keys(mod)[0]];
      return [fn, plugin[1]];
    }
    return plugin;
  })
);

// https://astro.build/config
export default defineConfig({
  // Change this to your actual site URL
  site: 'https://example.com',

  output: 'static',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tags/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize: (item) => {
        // Posts get higher priority and monthly change frequency
        if (item.url.includes('/posts/')) {
          return {
            ...item,
            changefreq: 'monthly',
            priority: 0.8,
          };
        }
        // Homepage gets highest priority
        if (item.url.endsWith('/') && !item.url.includes('/posts/') && !item.url.includes('/archive') && !item.url.includes('/graph')) {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0,
          };
        }
        return item;
      },
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
      ...userRemarkPlugins,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
    ],
    shikiConfig: {
      themes: themes[themeConfig.theme].shiki,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
