# CLAUDE.md - Development Guide

This document provides reference information for Claude Code when developing this project.

## Project Overview

A static site generator built with Astro 5.x featuring Digital Garden / Wiki-style functionality.

## Tech Stack

- **Framework**: Astro 5.x
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 (using CSS variables)
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
│   ├── theme.css          # CSS variables (colors, fonts, sizes)
│   └── global.css         # Global styles, prose styles
├── components/            # Astro components
├── layouts/               # Layout components
├── pages/                 # Route pages
└── utils/                 # Utility functions
```

## Key Files

### Schema Definition (`src/content.config.ts`)

Defines post frontmatter fields:
- `title`, `description`: Required strings
- `created`: Required date
- `modified`: Optional date
- `showCreated`, `showModified`: Booleans controlling date display
- `dateFormat`: Date format string (supports YYYY, MM, DD, M, D)
- `tags`: String array
- `draft`: Boolean, draft mode

### Theme System (`src/styles/theme.css`)

Colors defined via CSS variables:
- `--color-background`, `--color-foreground`
- `--color-primary`, `--color-secondary`
- `--color-muted`, `--color-border`

Dark mode toggled via `.dark` class.

### Wiki Links

Uses `remark-wiki-link` plugin for `[[link]]` syntax.
Configuration in `astro.config.mjs`.

### Graph Visualization

- `src/utils/graph.ts`: Parses post link relationships
- `src/components/LocalGraph.astro`: Local graph at post footer
- `src/pages/graph.astro`: Global graph page

Uses D3.js force simulation.

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
```

## Development Notes

1. **TypeScript Warnings**: Project has some pre-existing TS config warnings that don't affect Astro runtime
2. **Pagefind**: Search index is auto-generated during `pnpm build`
3. **Images**: Place in `public/images/`, reference as `/images/filename.jpg`
4. **Draft Mode**: Posts with `draft: true` won't appear in lists or RSS

## TODO

- [ ] Integrate Search component into BaseLayout
- [ ] View Transitions
- [ ] Cloudflare Pages deployment configuration
