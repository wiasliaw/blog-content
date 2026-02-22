import type { Theme } from "./types";

export const defaultTheme: Theme = {
  name: "default",
  shiki: {
    light: "github-light",
    dark: "github-dark",
  },
  light: {
    background: "#e8ecef",
    secondary: "#dfe3e6",
    foreground: "#1a1a1a",
    muted: "#525252",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    border: "#e5e5e5",
    codeBg: "#f5f5f5",
    codeText: "#1a1a1a",
    codeBorder: "#d1d5db",
    graphNode: "#2563eb",
    graphNodeCurrent: "#dc2626",
    graphLink: "#a3a3a3",
    graphText: "#1a1a1a",
    blockquoteBorder: "#2563eb",
    blockquoteBg: "#f8fafc",
    headingH1: "#2563eb", // primary
    headingH2: "#3b82f6", // lighter blue
    headingH3: "#64748b", // slate, between primary and foreground
    neuShadow:
      "8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)",
    neuShadowSm:
      "4px 4px 8px rgba(163, 177, 198, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.8)",
    neuShadowHover:
      "10px 10px 20px rgba(163, 177, 198, 0.5), -10px -10px 20px rgba(255, 255, 255, 0.9)",
  },
  dark: {
    background: "#2d3436",
    secondary: "#252829",
    foreground: "#fafafa",
    muted: "#a3a3a3",
    primary: "#60a5fa",
    primaryHover: "#93c5fd",
    border: "#262626",
    codeBg: "#171717",
    codeText: "#fafafa",
    codeBorder: "#404040",
    graphNode: "#60a5fa",
    graphNodeCurrent: "#f87171",
    graphLink: "#525252",
    graphText: "#fafafa",
    blockquoteBorder: "#60a5fa",
    blockquoteBg: "#171717",
    headingH1: "#60a5fa", // primary
    headingH2: "#93c5fd", // lighter blue
    headingH3: "#94a3b8", // slate
    neuShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(70, 80, 82, 0.3)",
    neuShadowSm:
      "4px 4px 8px rgba(0, 0, 0, 0.35), -4px -4px 8px rgba(70, 80, 82, 0.25)",
    neuShadowInset:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(70, 80, 82, 0.25)",
    neuShadowPressed:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.45), inset -3px -3px 6px rgba(70, 80, 82, 0.25)",
    neuShadowHover:
      "10px 10px 20px rgba(0, 0, 0, 0.35), -10px -10px 20px rgba(70, 80, 82, 0.35)",
  },
};
