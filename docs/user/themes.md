# Themes

The site supports multiple color themes with a build-time theme preset system. Each theme includes light and dark mode variants.

## Available Themes

| Theme | Description |
|-------|-------------|
| `default` | Neutral gray palette |
| `nord` | Arctic, bluish palette |
| `tokyo-night` | Dark Tokyo cityscape colors |
| `catppuccin` | Soothing pastel palette |
| `github` | GitHub-inspired colors |

## Changing Theme

Edit `src/config/theme.config.ts`:

```typescript
export const themeConfig = {
  // Available themes: "default" | "nord" | "tokyo-night" | "catppuccin" | "github"
  theme: "catppuccin",
} as const;
```

After changing the theme, rebuild the site:

```bash
pnpm build
```

## Light/Dark Mode

Each theme has both light and dark color schemes. Users can toggle between modes using the theme toggle button in the header. The preference is saved to localStorage.

## Code Syntax Highlighting

Each theme includes matched Shiki syntax highlighting themes:

| Theme | Light Mode | Dark Mode |
|-------|------------|-----------|
| `default` | github-light | github-dark |
| `nord` | nord | nord |
| `tokyo-night` | vitesse-light | tokyo-night |
| `catppuccin` | catppuccin-latte | catppuccin-mocha |
| `github` | github-light | github-dark |

## Creating Custom Themes

To create a custom theme:

1. Create a new file in `src/styles/themes/` (e.g., `my-theme.ts`)
2. Define colors for both light and dark modes following the `Theme` type
3. Export from `src/styles/themes/index.ts`
4. Add the theme name to the union type comment in `theme.config.ts`

See existing theme files for reference.

## Theme Colors

Each theme defines the following color categories:

**Base colors:**
- `background` - Page background
- `secondary` - Card/element background
- `foreground` - Primary text
- `muted` - Secondary text

**Accent colors:**
- `primary` - Links, buttons
- `primaryHover` - Hover states
- `border` - Element borders

**Code block:**
- `codeBg`, `codeText`, `codeBorder`

**Graph visualization:**
- `graphNode`, `graphNodeCurrent`, `graphLink`, `graphText`

**Typography:**
- `headingH1`, `headingH2`, `headingH3` - Heading gradient colors
- `blockquoteBorder`, `blockquoteBg`

**Neumorphism shadows:**
- `neuShadow`, `neuShadowSm`, `neuShadowHover`, `neuShadowInset`, `neuShadowPressed`

## See Also

- [Getting Started](getting-started.md) - Initial setup
