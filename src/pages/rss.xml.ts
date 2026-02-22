import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const sortedPosts = posts.sort(
    (a, b) => b.data.created.valueOf() - a.data.created.valueOf()
  );

  const siteUrl = context.site?.href || 'https://example.com';

  return rss({
    title: 'My Digital Garden',
    description: 'A collection of notes, thoughts, and ideas',
    site: context.site ?? 'https://example.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.created,
      description: post.data.description,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `
      <language>zh-TW</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${siteUrl}rss.xml" rel="self" type="application/rss+xml"/>
    `,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
