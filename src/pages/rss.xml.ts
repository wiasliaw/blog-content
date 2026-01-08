import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  
  const sortedPosts = posts.sort(
    (a, b) => b.data.created.valueOf() - a.data.created.valueOf()
  );

  return rss({
    title: 'My Digital Garden',
    description: 'A collection of notes, thoughts, and ideas',
    site: context.site ?? 'https://example.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.created,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-TW</language>`,
  });
}
