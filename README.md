# SSG - Static Site Generator

A static site generator built with Astro, featuring Digital Garden / Wiki-style functionality.

## Features

- **Markdown Content** - Managed via Astro Content Collections
- **Wiki Links** - Support `[[page-name]]` syntax for interlinking posts
- **Dark/Light Theme** - Toggle theme with localStorage persistence
- **Code Highlighting** - Shiki syntax highlighting with dual theme support
- **LaTeX Math** - Render math equations via remark-math + rehype-katex
- **Table of Contents** - Auto-generated TOC for articles
- **Graph View** - D3.js visualization of post connections
- **Tag System** - Auto-generated tag pages
- **RSS Feed** - Auto-generated at `/rss.xml`
- **Sitemap** - Auto-generated sitemap
- **Search** - Full-site search powered by Pagefind

## Tech Stack

- **Framework**: Astro 5.x
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4
- **Deployment**: Cloudflare Pages (static output)

## Quick Start

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```

## Project Structure

```
content/posts/                 # Markdown posts directory

src/
├── content.config.ts          # Content Collections schema
├── styles/
│   ├── theme.css              # CSS variables
│   └── global.css             # Global styles
├── components/
│   ├── Head.astro             # HTML head
│   ├── ThemeToggle.astro      # Theme toggle button
│   ├── TableOfContents.astro  # TOC component
│   ├── LocalGraph.astro       # Local graph view
│   ├── TagList.astro          # Tag list
│   ├── PostCard.astro         # Post card
│   └── Search.astro           # Search component
├── layouts/
│   ├── BaseLayout.astro       # Base layout
│   └── PostLayout.astro       # Post layout
├── pages/
│   ├── index.astro            # Home page
│   ├── graph.astro            # Global graph page
│   ├── rss.xml.ts             # RSS Feed
│   ├── posts/[...slug].astro  # Post pages
│   └── tags/[tag].astro       # Tag pages
└── utils/
    ├── graph.ts               # Graph data processing
    └── date.ts                # Date formatting utility
```

## Post Frontmatter

```yaml
---
title: "Post Title"            # Required
description: "Post description" # Required, for SEO
created: 2026-01-08            # Required: creation date
modified: 2026-01-09           # Optional: modification date
showCreated: true              # Optional: show creation date (default: true)
showModified: true             # Optional: show modification date (default: true)
dateFormat: "YYYY-MM-DD"       # Optional: date format (default: YYYY-MM-DD)
tags: ["tag1", "tag2"]         # Optional: tags
draft: false                   # Optional: draft mode (default: false)
---
```

### Date Format Examples

| Format | Output |
|--------|--------|
| `YYYY-MM-DD` | 2026-01-08 |
| `YYYY/MM/DD` | 2026/01/08 |
| `MM-DD-YYYY` | 01-08-2026 |
| `YYYY年MM月DD日` | 2026年01月08日 |

## Wiki Link Syntax

```markdown
[[page-name]]              # Links to /posts/page-name
[[page-name|Display Text]] # Custom display text
```

## Deployment

The project is configured for static output and can be deployed to any static hosting service:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

Built static files are located in the `dist/` directory.

## License

MIT
