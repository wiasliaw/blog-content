# Frontmatter

Frontmatter is YAML metadata at the top of each post, enclosed by `---`.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title |
| `description` | string | SEO meta description |
| `created` | date | Creation date |

**Minimal example:**

```yaml
---
title: "My Post"
description: "A brief description for SEO"
created: 2026-01-11
---
```

## Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `modified` | date | - | Last modification date |
| `showCreated` | boolean | `true` | Display creation date |
| `showModified` | boolean | `true` | Display modification date |
| `dateFormat` | string | `YYYY-MM-DD` | Date display format |
| `tags` | string[] | `[]` | Category tags |
| `draft` | boolean | `false` | Hide from production |

## Date Format Patterns

The `dateFormat` field supports the following patterns:

| Pattern | Output |
|---------|--------|
| `YYYY` | 4-digit year (2026) |
| `MM` | 2-digit month (01-12) |
| `DD` | 2-digit day (01-31) |
| `M` | Month without padding (1-12) |
| `D` | Day without padding (1-31) |

**Examples:**

| Format | Output |
|--------|--------|
| `YYYY-MM-DD` | 2026-01-11 |
| `YYYY/MM/DD` | 2026/01/11 |
| `MM-DD-YYYY` | 01-11-2026 |
| `YYYY年MM月DD日` | 2026年01月11日 |

## Full Example

```yaml
---
title: "Complete Guide to Frontmatter"
description: "Learn all available frontmatter options"
created: 2026-01-11
modified: 2026-01-15
showCreated: true
showModified: true
dateFormat: "YYYY-MM-DD"
tags: ["guide", "documentation"]
draft: false
---
```

## See Also

- [Tags and Drafts](tags-and-drafts.md) - More about tags and draft mode
