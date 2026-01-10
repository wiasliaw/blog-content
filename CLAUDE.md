# CLAUDE.md - Development Guide

This document provides reference information for Claude Code when developing this project.

## Project Overview

A static site generator built with Astro 5.x featuring Digital Garden / Wiki-style functionality with Neumorphism design style.

## Tech Stack

- **Framework**: Astro 5.x
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 (using CSS variables)
- **Search**: Pagefind (client-side search)
- **Graph**: D3.js (force simulation)
- **Deployment**: Cloudflare Pages (static output)

## Common Commands

```bash
pnpm dev      # Start dev server (localhost:4321)
pnpm build    # Build static site + run Pagefind indexing
pnpm preview  # Preview build result
```

## Directory Structure

```
content/posts/             # Markdown posts (root level)

src/
├── content.config.ts      # Content Collections schema definition
├── styles/
│   ├── theme.css          # CSS variables (colors, fonts, sizes, neumorphism shadows)
│   └── global.css         # Global styles, prose styles, neumorphism components
├── components/
│   ├── Head.astro         # HTML head with meta tags, JSON-LD schema
│   ├── Search.astro       # Pagefind search with modal
│   ├── ThemeToggle.astro  # Dark/light mode toggle
│   ├── PostCard.astro     # Post card with neumorphism style
│   ├── TagList.astro      # Tag display component
│   ├── TableOfContents.astro  # TOC with active section highlight
│   ├── LocalGraph.astro   # Local graph at post footer
│   ├── Backlinks.astro    # Reverse links to current post
│   ├── Breadcrumb.astro   # Breadcrumb navigation with JSON-LD
│   ├── CodeCopyButton.astro   # Copy button for code blocks
│   ├── Lightbox.astro     # Image lightbox on click
│   └── OptimizedImage.astro   # Astro image optimization wrapper
├── layouts/
│   ├── BaseLayout.astro   # Main layout with header, footer, mobile menu
│   └── PostLayout.astro   # Post page layout
├── pages/
│   ├── index.astro        # Homepage with recent posts
│   ├── archive.astro      # Archive page (posts by year/month)
│   ├── graph.astro        # Full graph visualization
│   ├── rss.xml.ts         # RSS feed with full content
│   ├── posts/[slug].astro # Individual post pages
│   └── tags/
│       ├── index.astro    # All tags page
│       └── [tag].astro    # Posts by tag
└── utils/
    ├── graph.ts           # Graph data builder, getBacklinks()
    └── date.ts            # Date formatting utilities
```

## Key Features

### 1. Neumorphism Design System

CSS variables in `theme.css`:
- `--neu-shadow-light`, `--neu-shadow-light-sm` - Raised elements
- `--neu-shadow-light-hover` - Hover state
- `--neu-shadow-light-pressed` - Active/pressed state
- `--neu-shadow-light-inset` - Concave/input elements

Component classes in `global.css`:
- `.neu-card` - Card with hover lift effect
- `.neu-button` - Button with press effect
- `.neu-input` - Input with inset shadow
- `.neu-tag` - Small tag elements
- `.neu-flat` - Flat raised element
- `.neu-concave` - Pressed/inset element

### 2. Responsive Design

Breakpoints:
- Mobile: default
- `sm:` (640px) - Small tablets
- `md:` (768px) - Desktop navigation visible
- `lg:` (1024px) - Larger spacing

Mobile features:
- Hamburger menu with icons
- Responsive font sizes
- Touch-friendly tap targets

### 3. Search (Pagefind)

- Lazy-loaded on first interaction
- Modal with backdrop blur
- Keyboard shortcut: Ctrl/Cmd + K
- Dynamically appended to body (avoids stacking context issues)

### 4. Graph Visualization

- Local graph: Shows connected posts at article footer
- Global graph: `/graph` page with all posts
- D3.js force simulation with zoom/pan
- Click nodes to navigate

### 5. Wiki Links

Uses `remark-wiki-link` plugin:
- Syntax: `[[post-slug]]` or `[[post-slug|Display Text]]`
- Automatically resolves to post URLs
- Styled with `.wiki-link` class

### 6. SEO

- JSON-LD schema for Article and WebSite
- Open Graph meta tags
- Sitemap with lastmod, changefreq, priority
- RSS feed with full content

## Schema Definition (`src/content.config.ts`)

Post frontmatter fields:
- `title`, `description`: Required strings
- `created`: Required date
- `modified`: Optional date
- `showCreated`, `showModified`: Booleans controlling date display
- `dateFormat`: Date format string (supports YYYY, MM, DD, M, D)
- `tags`: String array
- `draft`: Boolean, draft mode

## Theme System (`src/styles/theme.css`)

Colors defined via CSS variables:
- `--color-background`, `--color-foreground`
- `--color-primary`, `--color-secondary`
- `--color-muted`, `--color-border`

Dark mode toggled via `data-theme="dark"` on `<html>`.

## Adding New Posts

Create `.md` files in `content/posts/`:

```markdown
---
title: "Post Title"
description: "Post description"
created: 2026-01-08
tags: ["tag1", "tag2"]
---

Post content...

Link to another post: [[other-post-slug]]
```

## Layout Structure

### Header (floating)
- Sticky with `top-2 sm:top-4`
- Rounded corners with shadow
- Backdrop blur effect
- Mobile: hamburger menu with icons
- Desktop: horizontal navigation

### Main Content
- Max width: `--width-page`
- Centered with responsive padding

### Footer
- Background color differentiation
- Border top for separation

## Development Notes

1. **Scoped CSS**: Astro components use scoped CSS. For dynamically created elements (like search modal), use `:global()` selector.

2. **View Transitions**: Scripts use `astro:after-swap` event to reinitialize after page transitions.

3. **Pagefind**: Search index is auto-generated during `pnpm build`. Must build before search works.

4. **Images**: Place in `public/images/`, reference as `/images/filename.jpg`. For optimization, use `src/assets/` with OptimizedImage component.

5. **Draft Mode**: Posts with `draft: true` won't appear in lists, RSS, or sitemap.

6. **Dark Mode Neumorphism**: Shadow values are adjusted in dark mode for subtle effect on dark backgrounds.

## Completed Features

- [x] Neumorphism design system
- [x] Code copy button
- [x] TOC with active section highlight
- [x] Image lightbox
- [x] Backlinks
- [x] Tags overview page
- [x] Archive page (by year/month)
- [x] Breadcrumb navigation
- [x] JSON-LD structured data
- [x] Enhanced sitemap
- [x] RSS with full content
- [x] Responsive design with mobile menu
- [x] Search modal integration
- [x] Floating header design
