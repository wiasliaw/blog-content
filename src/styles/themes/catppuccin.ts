import type { Theme } from "./types";

// Catppuccin color palette
// https://github.com/catppuccin/catppuccin
export const catppuccin: Theme = {
  name: "catppuccin",
  shiki: {
    light: "catppuccin-latte",
    dark: "catppuccin-mocha",
  },
  light: {
    // Catppuccin Latte
    background: "#eff1f5", // Base
    secondary: "#e6e9ef", // Mantle
    foreground: "#4c4f69", // Text
    muted: "#6c6f85", // Subtext0
    primary: "#1e66f5", // Blue
    primaryHover: "#8839ef", // Mauve
    border: "#ccd0da", // Surface0
    codeBg: "#e6e9ef", // Mantle
    codeText: "#4c4f69", // Text
    codeBorder: "#bcc0cc", // Surface1
    graphNode: "#1e66f5", // Blue
    graphNodeCurrent: "#d20f39", // Red
    graphLink: "#9ca0b0", // Overlay0
    graphText: "#4c4f69", // Text
    blockquoteBorder: "#1e66f5", // Blue
    blockquoteBg: "#e6e9ef", // Mantle
    headingH1: "#1e66f5", // Blue
    headingH2: "#8839ef", // Mauve
    headingH3: "#7287fd", // Lavender
    neuShadow:
      "8px 8px 16px rgba(156, 160, 176, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)",
    neuShadowSm:
      "4px 4px 8px rgba(156, 160, 176, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(156, 160, 176, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(156, 160, 176, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8)",
    neuShadowHover:
      "10px 10px 20px rgba(156, 160, 176, 0.4), -10px -10px 20px rgba(255, 255, 255, 0.9)",
  },
  dark: {
    // Catppuccin Mocha
    background: "#1e1e2e", // Base
    secondary: "#313244", // Surface0
    foreground: "#cdd6f4", // Text
    muted: "#a6adc8", // Subtext0
    primary: "#89b4fa", // Blue
    primaryHover: "#cba6f7", // Mauve
    border: "#313244", // Surface0
    codeBg: "#313244", // Surface0
    codeText: "#cdd6f4", // Text
    codeBorder: "#45475a", // Surface1
    graphNode: "#89b4fa", // Blue
    graphNodeCurrent: "#f38ba8", // Red
    graphLink: "#6c7086", // Overlay0
    graphText: "#cdd6f4", // Text
    blockquoteBorder: "#89b4fa", // Blue
    blockquoteBg: "#313244", // Surface0
    headingH1: "#89b4fa", // Blue
    headingH2: "#cba6f7", // Mauve
    headingH3: "#b4befe", // Lavender
    neuShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(49, 50, 68, 0.5)",
    neuShadowSm:
      "4px 4px 8px rgba(0, 0, 0, 0.45), -4px -4px 8px rgba(49, 50, 68, 0.45)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(49, 50, 68, 0.45)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.55), inset -3px -3px 6px rgba(49, 50, 68, 0.45)",
    neuShadowHover:
      "10px 10px 20px rgba(0, 0, 0, 0.45), -10px -10px 20px rgba(49, 50, 68, 0.55)",
  },
};
