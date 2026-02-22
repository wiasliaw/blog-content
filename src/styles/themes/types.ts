export interface ThemeColors {
  background: string;
  secondary: string;
  foreground: string;
  muted: string;
  primary: string;
  primaryHover: string;
  border: string;
  codeBg: string;
  codeText: string;
  codeBorder: string;
  graphNode: string;
  graphNodeCurrent: string;
  graphLink: string;
  graphText: string;
  blockquoteBorder: string;
  blockquoteBg: string;
  // Heading colors (gradient hierarchy)
  headingH1: string;
  headingH2: string;
  headingH3: string;
  // Neumorphism shadows
  neuShadow: string;
  neuShadowSm: string;
  neuShadowInset: string;
  neuShadowPressed: string;
  neuShadowHover: string;
}

export interface ShikiThemes {
  light: string;
  dark: string;
}

export interface Theme {
  name: string;
  shiki: ShikiThemes;
  light: ThemeColors;
  dark: ThemeColors;
}
