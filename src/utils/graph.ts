import { getCollection } from 'astro:content';

export interface GraphNode {
  id: string;
  title: string;
  tags: string[];
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Parse wiki links from markdown content
 * Matches patterns like [[page-name]] or [[page-name|display text]]
 */
function parseWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links: string[] = [];
  let match;
  
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkTarget = match[1].toLowerCase().replace(/ /g, '-');
    if (!links.includes(linkTarget)) {
      links.push(linkTarget);
    }
  }
  
  return links;
}

/**
 * Build graph data from all posts
 * Returns nodes and links for D3 visualization
 */
export async function buildGraphData(): Promise<GraphData> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();
  
  // Create nodes for all posts
  for (const post of posts) {
    const node: GraphNode = {
      id: post.id,
      title: post.data.title,
      tags: post.data.tags,
    };
    nodes.push(node);
    nodeIds.add(post.id);
  }
  
  // Parse wiki links and create edges
  for (const post of posts) {
    const content = post.body || '';
    const linkedSlugs = parseWikiLinks(content);
    
    for (const targetSlug of linkedSlugs) {
      // Only create link if target node exists
      if (nodeIds.has(targetSlug) && targetSlug !== post.id) {
        links.push({
          source: post.id,
          target: targetSlug,
        });
      }
    }
  }
  
  return { nodes, links };
}

/**
 * Get local graph data for a specific post
 * Returns only the current node and its directly connected neighbors
 */
export async function getLocalGraphData(currentSlug: string): Promise<GraphData> {
  const { nodes, links } = await buildGraphData();
  
  // Find connected node IDs
  const connectedIds = new Set<string>([currentSlug]);
  
  for (const link of links) {
    if (link.source === currentSlug) {
      connectedIds.add(link.target);
    }
    if (link.target === currentSlug) {
      connectedIds.add(link.source);
    }
  }
  
  // Filter nodes and links
  const localNodes = nodes.filter(n => connectedIds.has(n.id));
  const localLinks = links.filter(
    l => connectedIds.has(l.source) && connectedIds.has(l.target)
  );
  
  return {
    nodes: localNodes,
    links: localLinks,
  };
}
