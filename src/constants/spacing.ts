/**
 * LittleMeals Design System - Spacing System
 * 8px grid system for consistent spacing throughout the app
 * Scandinavian-minimal approach with generous whitespace
 */

// Base spacing unit - 8px for touch-friendly interfaces
const BASE_UNIT = 8;

// Spacing scale based on 8px grid
export const spacing = {
  0: 0,
  0.5: BASE_UNIT * 0.5,  // 4px  - Micro spacing
  1: BASE_UNIT * 1,      // 8px  - Tiny spacing
  1.5: BASE_UNIT * 1.5,  // 12px - Small spacing
  2: BASE_UNIT * 2,      // 16px - Base spacing
  2.5: BASE_UNIT * 2.5,  // 20px - Medium-small spacing
  3: BASE_UNIT * 3,      // 24px - Medium spacing
  4: BASE_UNIT * 4,      // 32px - Large spacing
  5: BASE_UNIT * 5,      // 40px - Extra large spacing
  6: BASE_UNIT * 6,      // 48px - Section spacing
  7: BASE_UNIT * 7,      // 56px - Large section spacing
  8: BASE_UNIT * 8,      // 64px - Extra large section spacing
  10: BASE_UNIT * 10,    // 80px - Screen margin spacing
  12: BASE_UNIT * 12,    // 96px - Large screen spacing
  16: BASE_UNIT * 16,    // 128px - Extra large screen spacing
  20: BASE_UNIT * 20,    // 160px - Hero spacing
} as const;

// Semantic spacing aliases for common use cases
export const semanticSpacing = {
  // Text and content spacing
  textTight: spacing[0.5],      // 4px - Between lines of related text
  textNormal: spacing[1],       // 8px - Standard text spacing
  textLoose: spacing[1.5],      // 12px - Loose text spacing
  
  // Component internal spacing
  componentTight: spacing[1],   // 8px - Tight internal padding
  componentNormal: spacing[2],  // 16px - Standard internal padding
  componentLoose: spacing[3],   // 24px - Loose internal padding
  
  // Element spacing
  elementTight: spacing[1.5],   // 12px - Between closely related elements
  elementNormal: spacing[2],    // 16px - Standard element spacing
  elementLoose: spacing[4],     // 32px - Between sections/groups
  
  // Screen and layout spacing
  screenPadding: spacing[4],    // 32px - Standard screen padding
  screenMargin: spacing[6],     // 48px - Screen content margins
  sectionSpacing: spacing[8],   // 64px - Between major sections
  heroSpacing: spacing[12],     // 96px - Hero section spacing
  
  // Touch targets and interactive elements
  touchTarget: 44,              // 44px - Minimum touch target size (iOS/Android standard)
  buttonPadding: spacing[2],    // 16px - Standard button padding
  inputPadding: spacing[2],     // 16px - Standard input padding
  cardPadding: spacing[3],      // 24px - Card internal padding
  
  // Form spacing
  formElementSpacing: spacing[3], // 24px - Between form elements
  formSectionSpacing: spacing[6], // 48px - Between form sections
  
  // Navigation and tab spacing
  tabBarHeight: 64,             // 64px - Tab bar height
  navigationPadding: spacing[2], // 16px - Navigation element padding
  
  // Modal and overlay spacing
  modalPadding: spacing[4],     // 32px - Modal content padding
  modalMargin: spacing[6],      // 48px - Modal screen margins
} as const;

// Border radius values - 0.75rem (12px) for gentle, approachable feel
export const borderRadius = {
  none: 0,
  xs: 4,     // 4px - Small radius for subtle rounding
  sm: 6,     // 6px - Small components
  base: 12,  // 12px - Default radius (0.75rem equivalent)
  md: 16,    // 16px - Medium components
  lg: 20,    // 20px - Large components
  xl: 24,    // 24px - Extra large components
  '2xl': 32, // 32px - Very large components
  full: 9999, // Full rounding for pills and circles
} as const;

// Shadow system - soft, subtle elevation
export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Subtle shadow for cards
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowColor: 'hsl(160, 8%, 15%)', // Dark blue-gray
    elevation: 2,
  },
  
  // Button press shadow
  button: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowColor: 'hsl(160, 8%, 15%)',
    elevation: 1,
  },
  
  // Modal shadow
  modal: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowColor: 'hsl(160, 8%, 15%)',
    elevation: 4,
  },
  
  // Floating action button shadow
  fab: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowColor: 'hsl(160, 8%, 15%)',
    elevation: 6,
  },
} as const;

// Layout dimensions for consistent sizing
export const dimensions = {
  // Button heights
  buttonSmall: 36,    // Small button height
  buttonMedium: 44,   // Medium button height (touch target)
  buttonLarge: 52,    // Large button height
  
  // Input heights
  inputSmall: 36,     // Small input height
  inputMedium: 44,    // Medium input height
  inputLarge: 52,     // Large input height
  
  // Navigation
  tabBarHeight: 64,   // Tab bar height
  headerHeight: 56,   // Header height
  
  // Cards
  cardMinHeight: 80,  // Minimum card height
  avatarSmall: 32,    // Small avatar size
  avatarMedium: 48,   // Medium avatar size
  avatarLarge: 64,    // Large avatar size
  
  // Icons
  iconSmall: 16,      // Small icon size
  iconMedium: 24,     // Medium icon size
  iconLarge: 32,      // Large icon size
  iconXLarge: 48,     // Extra large icon size
} as const;

// Grid system for layout consistency
export const grid = {
  columns: 12,        // 12-column grid system
  gutter: spacing[2], // 16px gutter between columns
  margin: spacing[4], // 32px screen margins
  
  // Breakpoints (though primarily mobile-first)
  breakpoints: {
    sm: 375,  // Small phones
    md: 768,  // Tablets
    lg: 1024, // Large tablets/small laptops
  },
} as const;

// Type definitions
export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Dimension = keyof typeof dimensions;