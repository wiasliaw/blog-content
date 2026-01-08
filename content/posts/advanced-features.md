---
title: "Advanced Features"
description: "Explore the advanced features of this static site generator"
created: 2026-01-07
tags: ["tutorial", "features", "customization"]
---

## Theme Customization

The theme can be customized by editing the CSS variables in `src/styles/theme.css`. Here are the main variables you can modify:

```css
/* src/styles/theme.css */
@theme {
  /* Colors */
  --color-background: #ffffff;
  --color-foreground: #1a1a1a;
  --color-primary: #2563eb;
  
  /* Typography */
  --font-sans: system-ui, sans-serif;
  --width-content: 65ch;
}
```

## Wiki-Style Linking

This site uses [[getting-started|wiki-style links]] that work like Obsidian. The syntax is:

- `[[page-name]]` - Link to a page
- `[[page-name|display text]]` - Link with custom display text

All links are automatically indexed and visualized in the Graph view.

## Graph Visualization

The graph view shows connections between your notes:

- **Full Graph**: Visit `/graph` to see all connections
- **Local Graph**: Each post shows its immediate connections at the bottom

The graph is built using D3.js and supports:

- Drag and drop nodes
- Zoom and pan (on the full graph page)
- Click to navigate

## Content Organization

### Tags

Add tags to your posts in the frontmatter:

```yaml
---
title: "My Post"
description: "A brief description for SEO"
pubDate: 2026-01-08
tags: ["tutorial", "astro"]
---
```

Tags create automatic category pages at `/tags/[tag]`.

### Drafts

Set `draft: true` in frontmatter to hide a post from the site:

```yaml
---
title: "Work in Progress"
description: "This post is not ready yet"
pubDate: 2026-01-08
draft: true
---
```

## Related Notes

- [[getting-started]] - Basic introduction
- [[math-examples]] - LaTeX examples
