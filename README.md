# SSG - Static Site Generator

A static site generator built with Astro 5.x, featuring Digital Garden / Wiki-style functionality with Neumorphism design.

## Features

### Content
- **Markdown Content** - Managed via Astro Content Collections
- **Wiki Links** - Support `[[page-name]]` syntax for interlinking posts
- **Code Highlighting** - Shiki syntax highlighting with dual theme support
- **LaTeX Math** - Render math equations via remark-math + rehype-katex
- **Code Copy Button** - One-click copy for code blocks

### Navigation
- **Table of Contents** - Auto-generated TOC with active section highlight
- **Graph View** - D3.js visualization of post connections (local & global)
- **Backlinks** - See which posts link to the current page
- **Tag System** - Tag overview page and individual tag pages
- **Archive** - Posts organized by year and month
- **Breadcrumb** - Navigation path with JSON-LD schema
- **Search** - Full-site search powered by Pagefind (Ctrl/Cmd + K)

### Design
- **Neumorphism Style** - Soft UI design with shadow-based depth
- **Dark/Light Theme** - Toggle theme with localStorage persistence
- **Responsive Design** - Mobile-first with hamburger menu
- **Floating Header** - Sticky header with backdrop blur
- **Image Lightbox** - Click to enlarge images

### SEO
- **JSON-LD Schema** - Article and WebSite structured data
- **Open Graph** - Social media meta tags
- **RSS Feed** - Full content RSS at `/rss.xml`
- **Sitemap** - Auto-generated with lastmod, changefreq, priority

## Tech Stack

- **Framework**: Astro 5.x
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4
- **Search**: Pagefind
- **Graph**: D3.js
- **Deployment**: Cloudflare Pages (static output)

## Quick Start

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build (includes Pagefind indexing)
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
│   ├── theme.css              # CSS variables, neumorphism shadows
│   └── global.css             # Global styles, component classes
├── components/
│   ├── Head.astro             # HTML head with JSON-LD
│   ├── Search.astro           # Pagefind search modal
│   ├── ThemeToggle.astro      # Theme toggle button
│   ├── TableOfContents.astro  # TOC with active highlight
│   ├── LocalGraph.astro       # Local graph view
│   ├── Backlinks.astro        # Reverse links
│   ├── Breadcrumb.astro       # Breadcrumb navigation
│   ├── CodeCopyButton.astro   # Code copy button
│   ├── Lightbox.astro         # Image lightbox
│   ├── TagList.astro          # Tag list
│   └── PostCard.astro         # Post card
├── layouts/
│   ├── BaseLayout.astro       # Base layout with header/footer
│   └── PostLayout.astro       # Post layout
├── pages/
│   ├── index.astro            # Home page
│   ├── archive.astro          # Archive page
│   ├── graph.astro            # Global graph page
│   ├── rss.xml.ts             # RSS Feed
│   ├── posts/[slug].astro     # Post pages
│   └── tags/
│       ├── index.astro        # All tags page
│       └── [tag].astro        # Tag pages
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

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open search |
| `Escape` | Close search/lightbox |

## Deployment

The project is configured for static output and can be deployed to any static hosting service:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

Built static files are located in the `dist/` directory.

## Development Notes

- **Pagefind**: Search index is generated during build. Run `pnpm build` before testing search.
- **Draft Mode**: Posts with `draft: true` won't appear in lists, RSS, or sitemap.
- **Images**: Place in `public/images/`, reference as `/images/filename.jpg`.

## License

MIT
