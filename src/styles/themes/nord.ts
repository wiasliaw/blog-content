import type { Theme } from "./types";

// Nord color palette
// https://www.nordtheme.com/
export const nord: Theme = {
  name: "nord",
  shiki: {
    light: "nord",
    dark: "nord",
  },
  light: {
    background: "#eceff4", // Nord Snow Storm 3
    secondary: "#e5e9f0", // Nord Snow Storm 2
    foreground: "#2e3440", // Nord Polar Night 1
    muted: "#4c566a", // Nord Polar Night 4
    primary: "#5e81ac", // Nord Frost 4
    primaryHover: "#81a1c1", // Nord Frost 3
    border: "#d8dee9", // Nord Snow Storm 1
    codeBg: "#e5e9f0",
    codeText: "#2e3440",
    codeBorder: "#d8dee9",
    graphNode: "#5e81ac",
    graphNodeCurrent: "#bf616a", // Nord Aurora Red
    graphLink: "#4c566a",
    graphText: "#2e3440",
    blockquoteBorder: "#5e81ac",
    blockquoteBg: "#e5e9f0",
    headingH1: "#5e81ac", // Nord Frost 4
    headingH2: "#81a1c1", // Nord Frost 3
    headingH3: "#4c566a", // Nord Polar Night 4
    neuShadow:
      "8px 8px 16px rgba(163, 174, 186, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)",
    neuShadowSm:
      "4px 4px 8px rgba(163, 174, 186, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(163, 174, 186, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(163, 174, 186, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.8)",
    neuShadowHover:
      "10px 10px 20px rgba(163, 174, 186, 0.5), -10px -10px 20px rgba(255, 255, 255, 0.9)",
  },
  dark: {
    background: "#2e3440", // Nord Polar Night 1
    secondary: "#3b4252", // Nord Polar Night 2
    foreground: "#eceff4", // Nord Snow Storm 3
    muted: "#d8dee9", // Nord Snow Storm 1
    primary: "#88c0d0", // Nord Frost 2
    primaryHover: "#8fbcbb", // Nord Frost 1
    border: "#3b4252",
    codeBg: "#3b4252",
    codeText: "#eceff4",
    codeBorder: "#4c566a",
    graphNode: "#88c0d0",
    graphNodeCurrent: "#bf616a",
    graphLink: "#4c566a",
    graphText: "#eceff4",
    blockquoteBorder: "#88c0d0",
    blockquoteBg: "#3b4252",
    headingH1: "#88c0d0", // Nord Frost 2
    headingH2: "#81a1c1", // Nord Frost 3
    headingH3: "#d8dee9", // Nord Snow Storm 1
    neuShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(59, 66, 82, 0.4)",
    neuShadowSm:
      "4px 4px 8px rgba(0, 0, 0, 0.35), -4px -4px 8px rgba(59, 66, 82, 0.35)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(59, 66, 82, 0.35)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.45), inset -3px -3px 6px rgba(59, 66, 82, 0.35)",
    neuShadowHover:
      "10px 10px 20px rgba(0, 0, 0, 0.35), -10px -10px 20px rgba(59, 66, 82, 0.45)",
  },
};
