import type { Theme } from "./types";

// GitHub color palette
// Based on GitHub's Primer design system
export const github: Theme = {
  name: "github",
  shiki: {
    light: "github-light",
    dark: "github-dark",
  },
  light: {
    // GitHub Light
    background: "#ffffff",
    secondary: "#f6f8fa",
    foreground: "#1f2328",
    muted: "#656d76",
    primary: "#0969da",
    primaryHover: "#8250df", // Purple
    border: "#d0d7de",
    codeBg: "#f6f8fa",
    codeText: "#1f2328",
    codeBorder: "#d0d7de",
    graphNode: "#0969da",
    graphNodeCurrent: "#cf222e", // Red
    graphLink: "#8c959f",
    graphText: "#1f2328",
    blockquoteBorder: "#0969da",
    blockquoteBg: "#f6f8fa",
    headingH1: "#0969da",
    headingH2: "#8250df",
    headingH3: "#656d76",
    neuShadow:
      "8px 8px 16px rgba(140, 149, 159, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.9)",
    neuShadowSm:
      "4px 4px 8px rgba(140, 149, 159, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.9)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(140, 149, 159, 0.25), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(140, 149, 159, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.9)",
    neuShadowHover:
      "10px 10px 20px rgba(140, 149, 159, 0.25), -10px -10px 20px rgba(255, 255, 255, 1)",
  },
  dark: {
    // GitHub Dark
    background: "#0d1117",
    secondary: "#161b22",
    foreground: "#e6edf3",
    muted: "#8b949e",
    primary: "#58a6ff",
    primaryHover: "#a371f7", // Purple
    border: "#30363d",
    codeBg: "#161b22",
    codeText: "#e6edf3",
    codeBorder: "#30363d",
    graphNode: "#58a6ff",
    graphNodeCurrent: "#f85149", // Red
    graphLink: "#484f58",
    graphText: "#e6edf3",
    blockquoteBorder: "#58a6ff",
    blockquoteBg: "#161b22",
    headingH1: "#58a6ff",
    headingH2: "#a371f7",
    headingH3: "#8b949e",
    neuShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(22, 27, 34, 0.5)",
    neuShadowSm:
      "4px 4px 8px rgba(0, 0, 0, 0.45), -4px -4px 8px rgba(22, 27, 34, 0.45)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(22, 27, 34, 0.45)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.55), inset -3px -3px 6px rgba(22, 27, 34, 0.45)",
    neuShadowHover:
      "10px 10px 20px rgba(0, 0, 0, 0.45), -10px -10px 20px rgba(22, 27, 34, 0.55)",
  },
};
