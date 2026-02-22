import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { themeConfig } from "../src/config/theme.config";
import { themes, themeNames } from "../src/styles/themes";
import type { ThemeColors } from "../src/styles/themes";

const selectedTheme = themeConfig.theme;

// Validate theme name
if (!(selectedTheme in themes)) {
  console.error(`Invalid theme: "${selectedTheme}"`);
  console.error(`Available themes: ${themeNames.join(", ")}`);
  process.exit(1);
}

const theme = themes[selectedTheme];

function generateColorVariables(colors: ThemeColors): string {
  return `  --color-background: ${colors.background};
  --color-secondary: ${colors.secondary};
  --color-foreground: ${colors.foreground};
  --color-muted: ${colors.muted};
  --color-primary: ${colors.primary};
  --color-primary-hover: ${colors.primaryHover};
  --color-border: ${colors.border};
  --color-code-bg: ${colors.codeBg};
  --color-code-text: ${colors.codeText};
  --color-code-border: ${colors.codeBorder};
  --color-graph-node: ${colors.graphNode};
  --color-graph-node-current: ${colors.graphNodeCurrent};
  --color-graph-link: ${colors.graphLink};
  --color-graph-text: ${colors.graphText};
  --color-blockquote-border: ${colors.blockquoteBorder};
  --color-blockquote-bg: ${colors.blockquoteBg};
  --color-heading-h1: ${colors.headingH1};
  --color-heading-h2: ${colors.headingH2};
  --color-heading-h3: ${colors.headingH3};
  --neu-shadow-light: ${colors.neuShadow};
  --neu-shadow-light-sm: ${colors.neuShadowSm};
  --neu-shadow-light-inset: ${colors.neuShadowInset};
  --neu-shadow-light-pressed: ${colors.neuShadowPressed};
  --neu-shadow-light-hover: ${colors.neuShadowHover};`;
}

const css = `/*
 * Auto-generated theme CSS
 * Theme: ${theme.name}
 * Do not edit manually - run 'pnpm generate-theme' to regenerate
 */

@theme {
${generateColorVariables(theme.light)}
}

[data-theme="dark"] {
${generateColorVariables(theme.dark)}
}
`;

const outputPath = resolve(
  import.meta.dirname,
  "../src/styles/themes/generated.css"
);
writeFileSync(outputPath, css, "utf-8");

console.log(`Theme generated: ${theme.name}`);
console.log(`Output: ${outputPath}`);
