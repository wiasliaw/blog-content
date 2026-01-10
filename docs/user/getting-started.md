# Getting Started

## Requirements

- Node.js 18+ (LTS recommended)
- pnpm

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ssg

# Install dependencies
pnpm install
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server at `localhost:4321` |
| `pnpm build` | Build static site and generate search index |
| `pnpm preview` | Preview the built site |

## Site Configuration

Edit `astro.config.mjs` to set your site URL:

```js
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

## Create Your First Post

Create a Markdown file in `content/posts/`:

```bash
touch content/posts/hello-world.md
```

Add the required frontmatter:

```markdown
---
title: "Hello World"
description: "My first post"
created: 2026-01-11
---

Your content here...
```

Start the dev server and visit `http://localhost:4321/posts/hello-world`.

## Next Steps

- [Writing Posts](writing-posts.md) - Learn about file structure and Markdown syntax
- [Frontmatter](frontmatter.md) - Explore all available frontmatter fields
- [Wiki Links](wiki-links.md) - Connect your posts together
