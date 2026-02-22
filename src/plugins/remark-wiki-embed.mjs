/**
 * Remark plugin to transform Obsidian-style image embeds ![[image.png]]
 * into standard markdown images ![](/assets/image.png)
 */
import { visit } from 'unist-util-visit';

const EMBED_REGEX = /!\[\[([^\]]+\.(?:png|jpg|jpeg|gif|webp|svg|mp4))\]\]/g;

export function remarkWikiEmbed() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      if (!node.children) return;
      
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type !== 'text') continue;
        
        const match = EMBED_REGEX.exec(child.value);
        EMBED_REGEX.lastIndex = 0;
        
        if (match) {
          const filename = match[1];
          // Replace the text node with an image node
          node.children[i] = {
            type: 'image',
            url: `/assets/${filename}`,
            alt: filename,
          };
        }
      }
    });
  };
}
