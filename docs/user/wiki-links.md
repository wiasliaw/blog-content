# Wiki Links

Wiki links connect posts together using a simple `[[slug]]` syntax, enabling Digital Garden / Wiki-style navigation.

## Basic Syntax

### Simple Link

```markdown
[[post-slug]]
```

Links to `/posts/post-slug` and displays "post-slug" as the link text.

### Custom Display Text

```markdown
[[post-slug|Display Text]]
```

Links to `/posts/post-slug` but displays "Display Text".

## Slug Resolution

The slug is automatically processed:

1. Converted to lowercase
2. Spaces replaced with hyphens (`-`)

| Input | Resolved Slug | URL |
|-------|---------------|-----|
| `[[my-post]]` | `my-post` | `/posts/my-post` |
| `[[My Post]]` | `my-post` | `/posts/my-post` |
| `[[HELLO WORLD]]` | `hello-world` | `/posts/hello-world` |

## Examples

```markdown
For more details, see [[getting-started]].

Check out the [[advanced-features|advanced features guide]].

Related: [[math-examples]], [[wiki-links]]
```

## Styling

Wiki links automatically receive the `.wiki-link` CSS class. They appear with a distinct style to differentiate from regular links.

## Graph Visualization

Wiki links build the connection graph between posts:

- **Local Graph**: Shows connections at the bottom of each post
- **Global Graph**: View all connections at `/graph`

When you link posts with wiki links, they appear connected in the graph visualization.

## Best Practices

1. **Use existing slugs** - Ensure the target post exists
2. **Keep slugs simple** - Use lowercase, hyphenated names
3. **Add context** - Use custom display text when the slug isn't descriptive

```markdown
// Good
See [[getting-started|the getting started guide]] for setup instructions.

// Less clear
See [[getting-started]] for setup.
```

## See Also

- [Writing Posts](writing-posts.md) - File naming conventions
