/**
 * LittleMeals Design System - Component Exports
 * 
 * Central export file for all design system components.
 * Import components from this file to ensure consistency across the app.
 * 
 * Usage:
 * import { Button, Input, Card, Screen, H1, LoadingSpinner } from '@/components/design-system';
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

// Layout Components
export {
  Screen,
  Container,
  Grid,
  Stack,
  VStack,
  HStack,
  Spacer,
  Divider,
  type ScreenProps,
  type ContainerProps,
  type GridProps,
  type StackProps,
  type SpacerProps,
  type DividerProps,
} from './Layout';

// Typography Components
export {
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  Caption,
  Label,
  Code,
  Link,
  type HeadingProps,
  type BodyProps,
  type CaptionProps,
  type LabelProps,
  type CodeProps,
  type LinkProps,
} from './Typography';

// Feedback Components
export {
  LoadingSpinner,
  LoadingOverlay,
  MessageAlert,
  ProgressIndicator,
  Toast,
  Skeleton,
  type LoadingSpinnerProps,
  type LoadingOverlayProps,
  type MessageAlertProps,
  type MessageType,
  type ProgressIndicatorProps,
  type ProgressStep,
  type ToastProps,
  type SkeletonProps,
} from './Feedback';

// Utility Components
export {
  Box,
  Flex,
  Center,
  AspectRatio,
  Pressable,
  Row,
  Column,
  type BoxProps,
  type FlexProps,
  type CenterProps,
  type AspectRatioProps,
  type PressableProps,
  type SpacingValue,
  type SpacingObject,
} from './Utilities';

// Animation Components
export {
  FadeIn,
  SlideIn,
  ScaleIn,
  RotateIn,
  Bounce,
  Pulse,
  Shimmer,
  AnimatedLayout,
  useStaggerAnimation,
  animationTiming,
  animationEasing,
  layoutAnimations,
  type FadeProps,
  type SlideProps,
  type ScaleProps,
  type RotateProps,
  type BounceProps,
  type PulseProps,
  type ShimmerProps,
  type AnimatedLayoutProps,
} from './Animations';

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