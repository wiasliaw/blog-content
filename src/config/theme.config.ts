export const themeConfig = {
  // Available themes: "default" | "nord" | "tokyo-night" | "catppuccin" | "github"
  theme: "catppuccin",
} as const;

export type ThemeName = typeof themeConfig.theme;
