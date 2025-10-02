/**
 * LittleMeals Design System - Utility Components
 * 
 * Layout utility components for consistent spacing, alignment, and positioning:
 * - Box: Universal container with spacing, borders, and positioning
 * - Flex: Flexible layout container with alignment controls
 * - Center: Quick centering utility
 * - AspectRatio: Maintain aspect ratios for media content
 * - Pressable: Enhanced TouchableOpacity with consistent feedback
 */

import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  ViewStyle, 
  GestureResponderEvent,
  AccessibilityRole 
} from 'react-native';
import { spacing, type Spacing } from '../../constants/spacing';
import { colors } from '../../constants/colors';


// Spacing utility types
export type SpacingValue = Spacing | 'auto' | 'none';
export type SpacingObject = {
  top?: SpacingValue;
  right?: SpacingValue;
  bottom?: SpacingValue;
  left?: SpacingValue;
  horizontal?: SpacingValue;
  vertical?: SpacingValue;
  all?: SpacingValue;
};

// Box Component Props
export interface BoxProps {
  children?: React.ReactNode;
  
  // Spacing
  padding?: SpacingValue | SpacingObject;
  margin?: SpacingValue | SpacingObject;
  
  // Dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  
  // Background
  backgroundColor?: string;
  backgroundGradient?: string;
  
  // Borders
  borderWidth?: number | string;
  borderColor?: string;
  borderRadius?: number | string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Shadows
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadowColor?: string;
  
  // Position
  position?: 'relative' | 'absolute';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll';
  
  // Accessibility
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  className?: string;
  style?: ViewStyle;
}

// Flex Component Props
export interface FlexProps extends BoxProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  gap?: SpacingValue;
}

// Center Component Props
export interface CenterProps extends BoxProps {
  inline?: boolean;
}

// AspectRatio Component Props
export interface AspectRatioProps extends BoxProps {
  ratio: number; // width/height ratio (e.g., 16/9 = 1.78)
  children: React.ReactNode;
}

// Pressable Component Props
export interface PressableProps extends BoxProps {
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
  pressRetentionOffset?: number | { top?: number; bottom?: number; left?: number; right?: number };
  delayLongPress?: number;
  activeOpacity?: number;
  underlayColor?: string;
  feedback?: 'opacity' | 'highlight' | 'scale' | 'none';
  children: React.ReactNode;
}

/**
 * Utility function to convert spacing values to Tailwind classes
 */
const getSpacingClasses = (spacing: SpacingValue | SpacingObject | undefined, prefix: 'p' | 'm'): string => {
  if (!spacing) return '';
  
  if (typeof spacing === 'string') {
    if (spacing === 'none') return `${prefix}-0`;
    if (spacing === 'auto') return `${prefix}-auto`;
    return `${prefix}-${spacing}`;
  }
  
  if (typeof spacing === 'object') {
    const classes: string[] = [];
    
    if (spacing.all !== undefined) {
      const value = spacing.all === 'none' ? '0' : spacing.all === 'auto' ? 'auto' : spacing.all;
      classes.push(`${prefix}-${value}`);
    }
    
    if (spacing.horizontal !== undefined) {
      const value = spacing.horizontal === 'none' ? '0' : spacing.horizontal === 'auto' ? 'auto' : spacing.horizontal;
      classes.push(`${prefix}x-${value}`);
    }
    
    if (spacing.vertical !== undefined) {
      const value = spacing.vertical === 'none' ? '0' : spacing.vertical === 'auto' ? 'auto' : spacing.vertical;
      classes.push(`${prefix}y-${value}`);
    }
    
    if (spacing.top !== undefined) {
      const value = spacing.top === 'none' ? '0' : spacing.top === 'auto' ? 'auto' : spacing.top;
      classes.push(`${prefix}t-${value}`);
    }
    
    if (spacing.right !== undefined) {
      const value = spacing.right === 'none' ? '0' : spacing.right === 'auto' ? 'auto' : spacing.right;
      classes.push(`${prefix}r-${value}`);
    }
    
    if (spacing.bottom !== undefined) {
      const value = spacing.bottom === 'none' ? '0' : spacing.bottom === 'auto' ? 'auto' : spacing.bottom;
      classes.push(`${prefix}b-${value}`);
    }
    
    if (spacing.left !== undefined) {
      const value = spacing.left === 'none' ? '0' : spacing.left === 'auto' ? 'auto' : spacing.left;
      classes.push(`${prefix}l-${value}`);
    }
    
    return classes.join(' ');
  }
  
  return '';
};

/**
 * Box Component
 * Universal container with comprehensive styling options
 */
export const Box: React.FC<BoxProps> = ({
  children,
  padding,
  margin,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  backgroundColor,
  borderWidth,
  borderColor,
  borderRadius,
  borderStyle,
  shadow,
  position,
  top,
  right,
  bottom,
  left,
  zIndex,
  overflow,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className = '',
  style,
}) => {
  const paddingClasses = getSpacingClasses(padding, 'p');
  const marginClasses = getSpacingClasses(margin, 'm');
  
  const getShadowClass = () => {
    switch (shadow) {
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      case 'none': return 'shadow-none';
      default: return '';
    }
  };
  
  const getPositionClass = () => {
    return position ? `${position}` : '';
  };
  
  const getOverflowClass = () => {
    switch (overflow) {
      case 'hidden': return 'overflow-hidden';
      case 'scroll': return 'overflow-scroll';
      case 'visible': return 'overflow-visible';
      default: return '';
    }
  };
  
  const baseClassName = `
    ${paddingClasses}
    ${marginClasses}
    ${backgroundColor || ''}
    ${borderColor || ''}
    ${getShadowClass()}
    ${getPositionClass()}
    ${getOverflowClass()}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const dynamicStyle: ViewStyle = {
    ...(width && { width }),
    ...(height && { height }),
    ...(minWidth && { minWidth }),
    ...(minHeight && { minHeight }),
    ...(maxWidth && { maxWidth }),
    ...(maxHeight && { maxHeight }),
    ...(borderWidth && { borderWidth }),
    ...(borderRadius && { borderRadius }),
    ...(borderStyle && { borderStyle }),
    ...(top && { top }),
    ...(right && { right }),
    ...(bottom && { bottom }),
    ...(left && { left }),
    ...(zIndex && { zIndex }),
    ...style,
  };
  
  return (
    <View
      className={baseClassName}
      style={dynamicStyle}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {children}
    </View>
  );
};

/**
 * Flex Component
 * Flexible layout container with comprehensive flexbox controls
 */
export const Flex: React.FC<FlexProps> = ({
  direction = 'column',
  wrap = 'nowrap',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  alignContent,
  alignSelf,
  flex,
  flexGrow,
  flexShrink,
  flexBasis,
  gap,
  className = '',
  style,
  ...boxProps
}) => {
  const getDirectionClass = () => {
    switch (direction) {
      case 'row': return 'flex-row';
      case 'column': return 'flex-col';
      case 'row-reverse': return 'flex-row-reverse';
      case 'column-reverse': return 'flex-col-reverse';
      default: return 'flex-col';
    }
  };
  
  const getWrapClass = () => {
    switch (wrap) {
      case 'wrap': return 'flex-wrap';
      case 'wrap-reverse': return 'flex-wrap-reverse';
      case 'nowrap': return 'flex-nowrap';
      default: return 'flex-nowrap';
    }
  };
  
  const getJustifyClass = () => {
    switch (justifyContent) {
      case 'flex-start': return 'justify-start';
      case 'flex-end': return 'justify-end';
      case 'center': return 'justify-center';
      case 'space-between': return 'justify-between';
      case 'space-around': return 'justify-around';
      case 'space-evenly': return 'justify-evenly';
      default: return 'justify-start';
    }
  };
  
  const getAlignClass = () => {
    switch (alignItems) {
      case 'flex-start': return 'items-start';
      case 'flex-end': return 'items-end';
      case 'center': return 'items-center';
      case 'stretch': return 'items-stretch';
      case 'baseline': return 'items-baseline';
      default: return 'items-stretch';
    }
  };
  
  const getGapClass = () => {
    if (!gap) return '';
    if (gap === 'none') return 'gap-0';
    if (gap === 'auto') return '';
    return `gap-${gap}`;
  };
  
  const flexClassName = `
    flex
    ${getDirectionClass()}
    ${getWrapClass()}
    ${getJustifyClass()}
    ${getAlignClass()}
    ${getGapClass()}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const flexStyle: ViewStyle = {
    ...(alignContent && { alignContent }),
    ...(alignSelf && { alignSelf }),
    ...(flex && { flex }),
    ...(flexGrow && { flexGrow }),
    ...(flexShrink && { flexShrink }),
    ...(flexBasis && { flexBasis }),
    ...style,
  };
  
  return (
    <Box {...boxProps} className={flexClassName} style={flexStyle} />
  );
};

/**
 * Center Component
 * Quick centering utility for content
 */
export const Center: React.FC<CenterProps> = ({
  inline = false,
  className = '',
  ...boxProps
}) => {
  const centerClassName = `
    ${inline ? 'flex-row' : 'flex-col'}
    items-center
    justify-center
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <Box {...boxProps} className={centerClassName} />
  );
};

/**
 * AspectRatio Component
 * Maintain consistent aspect ratios for media content
 */
export const AspectRatio: React.FC<AspectRatioProps> = ({
  ratio,
  children,
  className = '',
  style,
  ...boxProps
}) => {
  const aspectStyle: ViewStyle = {
    aspectRatio: ratio,
    ...style,
  };
  
  return (
    <Box {...boxProps} className={className} style={aspectStyle}>
      {children}
    </Box>
  );
};

/**
 * Pressable Component
 * Enhanced TouchableOpacity with consistent feedback and styling
 */
export const Pressable: React.FC<PressableProps> = ({
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  disabled = false,
  hitSlop,
  pressRetentionOffset,
  delayLongPress,
  activeOpacity = 0.7,
  underlayColor,
  feedback = 'opacity',
  children,
  className = '',
  style,
  ...boxProps
}) => {
  const getFeedbackProps = () => {
    switch (feedback) {
      case 'opacity':
        return { activeOpacity };
      case 'highlight':
        return { activeOpacity: 1, underlayColor };
      case 'scale':
        return { activeOpacity: 1 };
      case 'none':
        return { activeOpacity: 1 };
      default:
        return { activeOpacity };
    }
  };
  
  const pressableClassName = `
    ${disabled ? 'opacity-50' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      onLongPress={disabled ? undefined : onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      pressRetentionOffset={pressRetentionOffset}
      delayLongPress={delayLongPress}
      {...getFeedbackProps()}
      className={pressableClassName}
      style={style}
      accessibilityState={{ disabled }}
    >
      <Box {...boxProps}>
        {children}
      </Box>
    </TouchableOpacity>
  );
};

/**
 * Row Component
 * Quick horizontal layout utility
 */
export const Row: React.FC<FlexProps> = (props) => (
  <Flex {...props} direction="row" />
);

/**
 * Column Component
 * Quick vertical layout utility
 */
export const Column: React.FC<FlexProps> = (props) => (
  <Flex {...props} direction="column" />
);

/**
 * Spacer Component (re-export from Layout for convenience)
 */
export { Spacer, Divider } from './Layout';