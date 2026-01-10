# Tags and Drafts

## Tags

Tags help organize and categorize your posts.

### Adding Tags

Add tags in the frontmatter as a string array:

```yaml
---
title: "My Post"
description: "Description"
created: 2026-01-11
tags: ["guide", "tutorial", "astro"]
---
```

### Tag Pages

- `/tags/` - Lists all tags with post counts
- `/tags/[tag]` - Shows all posts with a specific tag

### Naming Conventions

- Use lowercase letters
- Keep tags short and descriptive
- Use hyphens for multi-word tags: `getting-started`

**Examples:**

```yaml
tags: ["javascript", "web-dev", "tutorial"]
tags: ["notes", "personal"]
tags: ["project", "open-source"]
```

## Draft Mode

Draft posts are hidden from production but accessible during development.

### Enabling Draft Mode

Set `draft: true` in frontmatter:

```yaml
---
title: "Work in Progress"
description: "Not ready yet"
created: 2026-01-11
draft: true
---
```

### Draft Behavior

When `draft: true`:

| Feature | Draft Visible? |
|---------|----------------|
| Post lists (homepage, archive) | No |
| Tag pages | No |
| RSS feed | No |
| Sitemap | No |
| Graph visualization | No |
| Direct URL access (dev mode) | Yes |

### Workflow

1. Create new post with `draft: true`
2. Write and preview locally via direct URL
3. Remove `draft: true` (or set to `false`) when ready to publish

### Publishing a Draft

Simply remove the draft field or set it to `false`:

```yaml
# Before (draft)
draft: true

# After (published)
draft: false
# Or just remove the line entirely
```

## See Also

- [Frontmatter](frontmatter.md) - All frontmatter fields
