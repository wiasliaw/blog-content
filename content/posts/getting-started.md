---
title: "Getting Started"
description: "Learn how to use this static site generator with Astro"
created: 2026-01-08
# modified: 2026-01-08      # Optional: last modification date
# showCreated: true         # Optional: whether to display created date (default: true)
# showModified: true        # Optional: whether to display modified date (default: true)
# dateFormat: "YYYY-MM-DD"  # Optional: date format (default: YYYY-MM-DD)
tags: ["tutorial", "astro", "guide"]
---

## Welcome

This is a minimal static site generator built with [Astro](https://astro.build). It supports:

- Markdown content with wiki-style linking
- Dark/Light theme toggle
- Syntax highlighting for code blocks
- LaTeX math equations
- Table of contents
- Graph visualization of note connections

## Wiki Links

You can link to other notes using the `[[wiki-link]]` syntax. For example, check out [[advanced-features]] to learn more about this site's capabilities.

## Code Blocks

Here's an example of syntax-highlighted code:

```typescript
// src/utils/helper.ts
interface Post {
  title: string;
  pubDate: Date;
  tags: string[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

## Math Equations

This site supports LaTeX math. Inline math: $E = mc^2$

Block equations:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Images

Place your images in `public/images/` and reference them like this:

```markdown
![Alt text](/images/your-image.jpg)
```

## Next Steps

- Read [[advanced-features]] for more details
- Check out [[math-examples]] for more LaTeX examples
- Visit the [Graph](/graph) page to see all connections
