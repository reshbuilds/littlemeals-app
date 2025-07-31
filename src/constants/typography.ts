/**
 * LittleMeals Design System - Typography
 * System font stack for optimal platform consistency and readability
 * Scandinavian-minimal approach with clear hierarchy
 */

import { Platform } from 'react-native';

// Font families optimized for each platform
export const fontFamilies = {
  // System font stack - native to each platform
  system: Platform.select({
    ios: 'SF Pro Display', // iOS system font
    android: 'Roboto', // Android system font
    default: 'system-ui', // Web fallback
  }),
  
  // Fallback font stack
  systemFallback: Platform.select({
    ios: '-apple-system, SF Pro Display, system-ui',
    android: 'Roboto, system-ui',
    default: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),

  // Monospace for code/data
  mono: Platform.select({
    ios: 'SF Mono, Menlo',
    android: 'Roboto Mono',
    default: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  }),
} as const;

// Font weights
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// Font sizes - based on 16px base with harmonious scale
export const fontSizes = {
  xs: 12,      // Captions, labels
  sm: 14,      // Small text, secondary info
  base: 16,    // Body text, default
  lg: 18,      // Large body text
  xl: 20,      // Small headings
  '2xl': 24,   // Medium headings
  '3xl': 28,   // Large headings
  '4xl': 32,   // Extra large headings
  '5xl': 36,   // Display text
  '6xl': 42,   // Hero text
} as const;

// Line heights - optimized for readability
export const lineHeights = {
  none: 1,
  tight: 1.2,
  snug: 1.3,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

// Letter spacing for specific use cases
export const letterSpacing = {
  tighter: -0.02,
  tight: -0.01,
  normal: 0,
  wide: 0.01,
  wider: 0.02,
  widest: 0.03,
} as const;

// Typography scale - predefined text styles
export const textStyles = {
  // Display text - for hero sections and primary CTAs
  display: {
    fontSize: fontSizes['5xl'],
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Headings
  h1: {
    fontSize: fontSizes['4xl'],
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  h2: {
    fontSize: fontSizes['3xl'],
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  
  h3: {
    fontSize: fontSizes['2xl'],
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  
  h4: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  
  body: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  bodySmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // UI text
  button: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },

  // Input and form text
  input: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Small text
  caption: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  captionBold: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Special text
  mono: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// Responsive typography helpers
export const responsiveTextStyles = {
  // Hero text that scales appropriately
  hero: {
    fontSize: Platform.select({
      ios: fontSizes['6xl'],
      android: fontSizes['5xl'],
      default: fontSizes['5xl'],
    }),
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // Screen titles
  screenTitle: {
    fontSize: Platform.select({
      ios: fontSizes['3xl'],
      android: fontSizes['2xl'],
      default: fontSizes['2xl'],
    }),
    fontFamily: fontFamilies.system,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
} as const;

// Type definitions
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TextStyle = keyof typeof textStyles;
export type ResponsiveTextStyle = keyof typeof responsiveTextStyles;