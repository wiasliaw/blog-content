export type { Theme, ThemeColors, ShikiThemes } from "./types";

export { defaultTheme } from "./default";
export { nord } from "./nord";
export { tokyoNight } from "./tokyo-night";
export { catppuccin } from "./catppuccin";
export { github } from "./github";

import { defaultTheme } from "./default";
import { nord } from "./nord";
import { tokyoNight } from "./tokyo-night";
import { catppuccin } from "./catppuccin";
import { github } from "./github";
import type { Theme } from "./types";

export const themes: Record<string, Theme> = {
  default: defaultTheme,
  nord,
  "tokyo-night": tokyoNight,
  catppuccin,
  github,
};

export const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
