/**
 * LittleMeals Design System - Component Exports
 * 
 * Central export file for all design system components.
 * Import components from this file to ensure consistency across the app.
 * 
 * Usage:
 * import { Button, Input, Card } from '@/components/design-system';
 */

// Button Components
export {
  Button,
  PrimaryButton,
  SecondaryButton,
  ChildResponseButton,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
  type ChildResponseType,
} from './Button';

// Input Components
export {
  Input,
  SearchInput,
  AutocompleteInput,
  type InputProps,
  type InputVariant,
  type InputSize,
  type AutocompleteOption,
} from './Input';

// Card Components
export {
  Card,
  ElevatedCard,
  OutlinedCard,
  FlatCard,
  PressableCard,
  type CardProps,
  type CardVariant,
  type CardSize,
} from './Card';

// Re-export design constants for convenience
export {
  colors,
  semanticColors,
  gradients,
  type ColorKey,
  type SemanticColorKey,
  type GradientKey,
} from '../../constants/colors';

export {
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  dimensions,
  grid,
  type Spacing,
  type SemanticSpacing,
  type BorderRadius,
  type Shadow,
  type Dimension,
} from '../../constants/spacing';

export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  textStyles,
  responsiveTextStyles,
  type FontFamily,
  type FontWeight,
  type FontSize,
  type LineHeight,
  type LetterSpacing,
  type TextStyle,
  type ResponsiveTextStyle,
} from '../../constants/typography';