import type { Theme } from "./types";

// Tokyo Night color palette
// https://github.com/enkia/tokyo-night-vscode-theme
export const tokyoNight: Theme = {
  name: "tokyo-night",
  shiki: {
    light: "tokyo-night-light",
    dark: "tokyo-night",
  },
  light: {
    background: "#d5d6db", // Tokyo Night Light bg
    secondary: "#cbccd1",
    foreground: "#343b58", // Tokyo Night Light fg
    muted: "#6172af",
    primary: "#34548a", // Tokyo Night Light blue
    primaryHover: "#5a4a78", // Tokyo Night Light purple
    border: "#c0c1c6",
    codeBg: "#cbccd1",
    codeText: "#343b58",
    codeBorder: "#9699a3",
    graphNode: "#34548a",
    graphNodeCurrent: "#8c4351", // Tokyo Night Light red
    graphLink: "#9699a3",
    graphText: "#343b58",
    blockquoteBorder: "#34548a",
    blockquoteBg: "#cbccd1",
    headingH1: "#34548a", // Tokyo Night Light blue
    headingH2: "#5a4a78", // Tokyo Night Light purple
    headingH3: "#6172af", // muted
    neuShadow:
      "8px 8px 16px rgba(150, 153, 163, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.7)",
    neuShadowSm:
      "4px 4px 8px rgba(150, 153, 163, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.7)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(150, 153, 163, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.7)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(150, 153, 163, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.7)",
    neuShadowHover:
      "10px 10px 20px rgba(150, 153, 163, 0.5), -10px -10px 20px rgba(255, 255, 255, 0.8)",
  },
  dark: {
    background: "#1a1b26", // Tokyo Night Storm bg
    secondary: "#24283b",
    foreground: "#a9b1d6", // Tokyo Night Storm fg
    muted: "#565f89",
    primary: "#7aa2f7", // Tokyo Night blue
    primaryHover: "#bb9af7", // Tokyo Night purple
    border: "#24283b",
    codeBg: "#24283b",
    codeText: "#a9b1d6",
    codeBorder: "#414868",
    graphNode: "#7aa2f7",
    graphNodeCurrent: "#f7768e", // Tokyo Night red
    graphLink: "#414868",
    graphText: "#a9b1d6",
    blockquoteBorder: "#7aa2f7",
    blockquoteBg: "#24283b",
    headingH1: "#7aa2f7", // Tokyo Night blue
    headingH2: "#bb9af7", // Tokyo Night purple
    headingH3: "#7dcfff", // Tokyo Night cyan
    neuShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(36, 40, 59, 0.5)",
    neuShadowSm:
      "4px 4px 8px rgba(0, 0, 0, 0.45), -4px -4px 8px rgba(36, 40, 59, 0.45)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(36, 40, 59, 0.45)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.55), inset -3px -3px 6px rgba(36, 40, 59, 0.45)",
    neuShadowHover:
      "10px 10px 20px rgba(0, 0, 0, 0.45), -10px -10px 20px rgba(36, 40, 59, 0.55)",
  },
};
