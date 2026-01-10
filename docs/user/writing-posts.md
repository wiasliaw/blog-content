# Writing Posts

## File Location

All posts are stored in `content/posts/` directory as Markdown (`.md`) files.

```
content/posts/
├── hello-world.md
├── my-second-post.md
└── guides/
    └── setup-guide.md    # Nested directories supported
```

## File Naming

The filename becomes the URL slug:

| Filename | URL |
|----------|-----|
| `hello-world.md` | `/posts/hello-world` |
| `my-post.md` | `/posts/my-post` |

**Conventions:**
- Use lowercase letters
- Separate words with hyphens (`-`)
- Avoid spaces, underscores, or special characters

## Post Structure

Every post has two sections:

```markdown
---
title: "Post Title"
description: "SEO description"
created: 2026-01-11
tags: ["tag1", "tag2"]
---

Your Markdown content here...
```

1. **Frontmatter** (between `---`) - Metadata in YAML format
2. **Content** - Markdown body

## Supported Markdown

Standard Markdown syntax is fully supported:

### Headings

```markdown
## Heading 2
### Heading 3
#### Heading 4
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

### Lists

```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

### Blockquotes

```markdown
> This is a quote
```

### Code Blocks

````markdown
```javascript
const greeting = "Hello";
console.log(greeting);
```
````

Syntax highlighting themes are determined by the site theme. See [Themes](themes.md).

### Links and Images

```markdown
[Link text](https://example.com)
![Alt text](/images/photo.jpg)
```

## Images

Place images in `public/images/` and reference them with absolute paths:

```markdown
![My Image](/images/my-image.jpg)
```

**Directory structure:**
```
public/
└── images/
    ├── photo.jpg
    └── diagrams/
        └── architecture.png
```

**Reference nested images:**
```markdown
![Architecture](/images/diagrams/architecture.png)
```

## See Also

- [Frontmatter](frontmatter.md) - All frontmatter fields
- [Wiki Links](wiki-links.md) - Link between posts
- [Math Support](math-support.md) - LaTeX formulas
