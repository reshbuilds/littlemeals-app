/**
 * LittleMeals Design System - Typography Components
 * 
 * Consistent text styling components with proper hierarchy:
 * - Heading: H1-H6 with semantic levels and responsive sizing
 * - Body: Regular body text with size variants  
 * - Caption: Small text for metadata and secondary information
 * - Label: Form labels and UI element labels
 * - Code: Inline and block code formatting
 */

import React from 'react';
import { Text, TextStyle } from 'react-native';
import { 
  fontFamilies, 
  fontWeights, 
  fontSizes, 
  lineHeights, 
  textStyles,
  type FontFamily,
  type FontWeight,
  type FontSize,
} from '../../constants/typography';
import { semanticColors } from '../../constants/colors';


// Base Typography Props
interface BaseTypographyProps {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: FontWeight;
  family?: FontFamily;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  className?: string;
  style?: TextStyle;
  onPress?: () => void;
  testID?: string;
}

// Heading Component Props
export interface HeadingProps extends BaseTypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

// Body Component Props
export interface BodyProps extends BaseTypographyProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted';
}

// Caption Component Props
export interface CaptionProps extends BaseTypographyProps {
  size?: 'xs' | 'sm';
  variant?: 'default' | 'muted' | 'error' | 'success' | 'warning';
}

// Label Component Props
export interface LabelProps extends BaseTypographyProps {
  size?: 'sm' | 'md';
  required?: boolean;
  disabled?: boolean;
}

// Code Component Props
export interface CodeProps extends BaseTypographyProps {
  variant?: 'inline' | 'block';
  language?: string;
}

/**
 * Heading Component
 * Semantic heading levels with consistent styling and hierarchy
 */
export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  size,
  color = 'text-foreground-DEFAULT',
  align = 'left',
  weight,
  family = 'sans',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  // Determine size based on level if not explicitly provided
  const getDefaultSize = (): FontSize => {
    switch (level) {
      case 1: return '3xl';
      case 2: return '2xl';
      case 3: return 'xl';
      case 4: return 'lg';
      case 5: return 'md';
      case 6: return 'sm';
      default: return 'xl';
    }
  };

  // Determine weight based on level if not explicitly provided
  const getDefaultWeight = (): FontWeight => {
    switch (level) {
      case 1: 
      case 2: return 'bold';
      case 3: 
      case 4: return 'semibold';
      case 5:
      case 6: return 'medium';
      default: return 'bold';
    }
  };

  const finalSize = size || getDefaultSize();
  const finalWeight = weight || getDefaultWeight();

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = () => `text-${finalSize}`;
  const getFontWeightClass = () => `font-${finalWeight}`;
  const getFontFamilyClass = () => `font-${family}`;

  const baseClassName = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getFontFamilyClass()}
    ${getAlignClass()}
    ${color}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
      accessibilityRole="header"
      accessibilityLevel={level}
    >
      {children}
    </Text>
  );
};

/**
 * Heading variants for common use cases
 */
export const H1: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={1} />
);

export const H2: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={2} />
);

export const H3: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={3} />
);

export const H4: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={4} />
);

export const H5: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={5} />
);

export const H6: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading {...props} level={6} />
);

/**
 * Body Component
 * Regular body text with size and color variants
 */
export const Body: React.FC<BodyProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  color,
  align = 'left',
  weight = 'normal',
  family = 'sans',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  const getVariantColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'primary': return 'text-foreground-DEFAULT';
      case 'secondary': return 'text-foreground-muted';
      case 'muted': return 'text-foreground-light';
      default: return 'text-foreground-DEFAULT';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = () => `text-${size}`;
  const getFontWeightClass = () => `font-${weight}`;
  const getFontFamilyClass = () => `font-${family}`;

  const baseClassName = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getFontFamilyClass()}
    ${getAlignClass()}
    ${getVariantColor()}
    leading-relaxed
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </Text>
  );
};

/**
 * Caption Component
 * Small text for metadata, descriptions, and secondary information
 */
export const Caption: React.FC<CaptionProps> = ({
  children,
  size = 'sm',
  variant = 'default',
  color,
  align = 'left',
  weight = 'normal',
  family = 'sans',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  const getVariantColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'default': return 'text-foreground-muted';
      case 'muted': return 'text-foreground-light';
      case 'error': return 'text-error-foreground';
      case 'success': return 'text-success-foreground';
      case 'warning': return 'text-warning-foreground';
      default: return 'text-foreground-muted';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = () => `text-${size}`;
  const getFontWeightClass = () => `font-${weight}`;
  const getFontFamilyClass = () => `font-${family}`;

  const baseClassName = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getFontFamilyClass()}
    ${getAlignClass()}
    ${getVariantColor()}
    leading-normal
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </Text>
  );
};

/**
 * Label Component
 * Form labels and UI element labels with accessibility support
 */
export const Label: React.FC<LabelProps> = ({
  children,
  size = 'md',
  required = false,
  disabled = false,
  color,
  align = 'left',
  weight = 'medium',
  family = 'sans',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  const getLabelColor = () => {
    if (color) return color;
    if (disabled) return 'text-foreground-light';
    return 'text-foreground-DEFAULT';
  };

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = () => `text-${size}`;
  const getFontWeightClass = () => `font-${weight}`;
  const getFontFamilyClass = () => `font-${family}`;

  const baseClassName = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getFontFamilyClass()}
    ${getAlignClass()}
    ${getLabelColor()}
    leading-normal
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
      accessibilityRole="text"
    >
      {children}
      {required && (
        <Text className="text-error-DEFAULT ml-1">*</Text>
      )}
    </Text>
  );
};

/**
 * Code Component
 * Inline and block code formatting with monospace font
 */
export const Code: React.FC<CodeProps> = ({
  children,
  variant = 'inline',
  language,
  color = 'text-foreground-DEFAULT',
  align = 'left',
  weight = 'normal',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'inline':
        return 'bg-background-secondary px-1 py-0.5 rounded text-sm font-mono';
      case 'block':
        return 'bg-background-secondary p-3 rounded-lg text-sm font-mono leading-relaxed';
      default:
        return 'font-mono text-sm';
    }
  };

  const baseClassName = `
    ${getVariantStyles()}
    ${getAlignClass()}
    ${color}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
      accessibilityRole="text"
      accessibilityHint={language ? `Code in ${language}` : 'Code snippet'}
    >
      {children}
    </Text>
  );
};

/**
 * Link Component
 * Clickable text with link styling and accessibility
 */
export interface LinkProps extends BaseTypographyProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted';
  underline?: boolean;
  disabled?: boolean;
  external?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  underline = true,
  disabled = false,
  external = false,
  color,
  align = 'left',
  weight = 'medium',
  family = 'sans',
  numberOfLines,
  ellipsizeMode = 'tail',
  className = '',
  style,
  onPress,
  testID,
}) => {
  const getLinkColor = () => {
    if (color) return color;
    if (disabled) return 'text-foreground-light';
    
    switch (variant) {
      case 'primary': return 'text-primary-DEFAULT';
      case 'secondary': return 'text-foreground-muted';
      case 'muted': return 'text-foreground-light';
      default: return 'text-primary-DEFAULT';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = () => `text-${size}`;
  const getFontWeightClass = () => `font-${weight}`;
  const getFontFamilyClass = () => `font-${family}`;
  const getUnderlineClass = () => underline && !disabled ? 'underline' : '';

  const baseClassName = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getFontFamilyClass()}
    ${getAlignClass()}
    ${getLinkColor()}
    ${getUnderlineClass()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Text
      className={baseClassName}
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={disabled ? undefined : onPress}
      testID={testID}
      accessibilityRole="link"
      accessibilityHint={external ? 'Opens in external app' : undefined}
      accessibilityState={{ disabled }}
    >
      {children}
      {external && ' ↗'}
    </Text>
  );
};