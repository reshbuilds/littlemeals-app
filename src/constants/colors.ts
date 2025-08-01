/**
 * LittleMeals Design System - Color Palette
 * Scandinavian-minimal color scheme with warm, family-friendly tones
 * All colors meet WCAG AA accessibility standards
 */

export const colors = {
  // Primary sage green palette
  primary: {
    DEFAULT: 'hsl(140, 25%, 45%)', // Primary sage green
    foreground: 'hsl(35, 25%, 98%)', // Primary green foreground (cream white)
    light: 'hsl(140, 20%, 90%)', // Very light sage accent
    dark: 'hsl(140, 30%, 35%)', // Darker sage for pressed states
  },

  // Background colors - warm cream tones
  background: {
    DEFAULT: 'hsl(35, 20%, 98%)', // Main background - warm cream
    card: 'hsl(35, 25%, 96%)', // Card background - soft cream
    secondary: 'hsl(35, 30%, 92%)', // Secondary background - light cream
    muted: 'hsl(35, 15%, 88%)', // Muted background for disabled states
  },

  // Text colors - deep blue-gray for readability
  foreground: {
    DEFAULT: 'hsl(160, 8%, 15%)', // Primary text - deep blue-gray
    muted: 'hsl(160, 6%, 50%)', // Secondary text - softer gray
    light: 'hsl(160, 4%, 70%)', // Tertiary text - light gray
    inverse: 'hsl(35, 25%, 98%)', // Text on dark backgrounds
  },

  // Border colors
  border: {
    DEFAULT: 'hsl(35, 15%, 88%)', // Default border
    light: 'hsl(35, 10%, 92%)', // Light border
    strong: 'hsl(35, 20%, 80%)', // Strong border
  },

  // Status colors
  success: {
    DEFAULT: 'hsl(120, 40%, 50%)', // Success green
    light: 'hsl(120, 40%, 90%)', // Light success background
    foreground: 'hsl(120, 100%, 25%)', // Success text
  },

  warning: {
    DEFAULT: 'hsl(45, 90%, 60%)', // Warning yellow
    light: 'hsl(45, 90%, 95%)', // Light warning background
    foreground: 'hsl(45, 100%, 25%)', // Warning text
  },

  error: {
    DEFAULT: 'hsl(0, 65%, 55%)', // Error red
    light: 'hsl(0, 65%, 95%)', // Light error background
    foreground: 'hsl(0, 70%, 35%)', // Error text
  },

  // Child response colors - playful but not childish
  responses: {
    eaten: {
      DEFAULT: 'hsl(120, 40%, 50%)', // Green for eaten
      light: 'hsl(120, 40%, 90%)',
      foreground: 'hsl(120, 100%, 25%)',
    },
    partial: {
      DEFAULT: 'hsl(45, 90%, 60%)', // Yellow for partially eaten
      light: 'hsl(45, 90%, 95%)',
      foreground: 'hsl(45, 100%, 25%)',
    },
    refused: {
      DEFAULT: 'hsl(0, 65%, 55%)', // Red for refused
      light: 'hsl(0, 65%, 95%)',
      foreground: 'hsl(0, 70%, 35%)',
    },
  },

  // Special colors
  white: 'hsl(0, 0%, 100%)',
  black: 'hsl(0, 0%, 0%)',
  transparent: 'transparent',
} as const;

// Gradient definitions
export const gradients = {
  primary: 'linear-gradient(135deg, hsl(140, 25%, 45%), hsl(140, 30%, 55%))',
  soft: 'linear-gradient(180deg, hsl(35, 25%, 96%), hsl(35, 20%, 94%))',
  warm: 'linear-gradient(45deg, hsl(35, 30%, 92%), hsl(140, 20%, 90%))',
  card: 'linear-gradient(180deg, hsl(35, 25%, 96%), hsl(35, 20%, 96%))',
} as const;

// Semantic color aliases for easier usage
export const semanticColors = {
  // Text
  textPrimary: colors.foreground.DEFAULT,
  textSecondary: colors.foreground.muted,
  textTertiary: colors.foreground.light,
  textInverse: colors.foreground.inverse,

  // Backgrounds
  bgPrimary: colors.background.DEFAULT,
  bgSecondary: colors.background.secondary,
  bgCard: colors.background.card,
  bgMuted: colors.background.muted,

  // Interactive
  interactive: colors.primary.DEFAULT,
  interactiveHover: colors.primary.dark,
  interactivePressed: colors.primary.dark,
  interactiveDisabled: colors.background.muted,

  // Borders
  borderDefault: colors.border.DEFAULT,
  borderLight: colors.border.light,
  borderStrong: colors.border.strong,

  // Status
  positive: colors.success.DEFAULT,
  negative: colors.error.DEFAULT,
  warning: colors.warning.DEFAULT,
  info: colors.primary.light,
} as const;

export type ColorKey = keyof typeof colors;
export type SemanticColorKey = keyof typeof semanticColors;
export type GradientKey = keyof typeof gradients;