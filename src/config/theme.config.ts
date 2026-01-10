export const themeConfig = {
  // Available themes: "default" | "nord" | "tokyo-night"
  theme: "tokyo-night",
} as const;

export type ThemeName = typeof themeConfig.theme;
