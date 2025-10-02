/**
 * LittleMeals Design System - Layout Components
 * 
 * Structural components for app layout and content organization:
 * - Screen: Root screen container with safe area handling
 * - Container: Content container with consistent padding
 * - Grid: Responsive grid layout system
 * - Stack: Vertical and horizontal stacking with consistent spacing
 */

import React from 'react';
import { View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, type Spacing } from '../../constants/spacing';


// Screen Component Props
export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  padding?: Spacing;
  safeArea?: boolean;
  keyboardAvoidingView?: boolean;
  className?: string;
  style?: ViewStyle;
}

// Container Component Props
export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: Spacing;
  centered?: boolean;
  className?: string;
  style?: ViewStyle;
}

// Grid Component Props
export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: Spacing;
  padding?: Spacing;
  className?: string;
  style?: ViewStyle;
}

// Stack Component Props
export interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: Spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
  style?: ViewStyle;
}

/**
 * Screen Component
 * Root container for all screens with safe area handling and optional scrolling
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  backgroundColor = 'bg-background-DEFAULT',
  padding,
  safeArea = true,
  className = '',
  style,
  ...props
}) => {
  const paddingClass = padding ? `p-${padding}` : '';
  const baseClassName = `flex-1 ${backgroundColor} ${paddingClass} ${className}`.trim();

  const content = scrollable ? (
    <ScrollView
      className={baseClassName}
      style={style}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={baseClassName} style={style}>
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className="flex-1">
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

/**
 * Container Component
 * Content container with consistent padding and max-width constraints
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'full',
  padding = 'md',
  centered = false,
  className = '',
  style,
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case 'full': return 'w-full';
      default: return 'w-full';
    }
  };

  const paddingClass = `p-${padding}`;
  const centerClass = centered ? 'mx-auto' : '';
  const baseClassName = `${getSizeClass()} ${paddingClass} ${centerClass} ${className}`.trim();

  return (
    <View className={baseClassName} style={style}>
      {children}
    </View>
  );
};

/**
 * Grid Component
 * Responsive grid layout system for organizing content
 */
export const Grid: React.FC<GridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  padding,
  className = '',
  style,
}) => {
  const gapClass = `gap-${gap}`;
  const paddingClass = padding ? `p-${padding}` : '';
  
  // Convert columns to flex basis percentage
  const getColumnWidth = () => {
    switch (columns) {
      case 1: return 'w-full';
      case 2: return 'w-1/2';
      case 3: return 'w-1/3';
      case 4: return 'w-1/4';
      case 6: return 'w-1/6';
      case 12: return 'w-1/12';
      default: return 'w-1/2';
    }
  };

  const baseClassName = `flex-row flex-wrap ${gapClass} ${paddingClass} ${className}`.trim();

  const gridChildren = React.Children.map(children, (child, index) => (
    <View key={index} className={getColumnWidth()}>
      {child}
    </View>
  ));

  return (
    <View className={baseClassName} style={style}>
      {gridChildren}
    </View>
  );
};

/**
 * Stack Component
 * Vertical or horizontal stacking with consistent spacing and alignment
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing: stackSpacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  style,
}) => {
  const getDirectionClass = () => {
    return direction === 'horizontal' ? 'flex-row' : 'flex-col';
  };

  const getAlignClass = () => {
    switch (align) {
      case 'start': return 'items-start';
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      case 'stretch': return 'items-stretch';
      default: return 'items-stretch';
    }
  };

  const getJustifyClass = () => {
    switch (justify) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
      case 'between': return 'justify-between';
      case 'around': return 'justify-around';
      case 'evenly': return 'justify-evenly';
      default: return 'justify-start';
    }
  };

  const getSpacingClass = () => {
    return direction === 'horizontal' ? `space-x-${stackSpacing}` : `space-y-${stackSpacing}`;
  };

  const wrapClass = wrap ? 'flex-wrap' : '';
  const baseClassName = `
    ${getDirectionClass()} 
    ${getAlignClass()} 
    ${getJustifyClass()} 
    ${getSpacingClass()} 
    ${wrapClass} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <View className={baseClassName} style={style}>
      {children}
    </View>
  );
};

/**
 * Specialized Stack variants for common use cases
 */
export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="vertical" />
);

export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

/**
 * Spacer Component
 * Flexible spacer for pushing content apart in stacks
 */
export interface SpacerProps {
  size?: Spacing | 'auto';
  direction?: 'vertical' | 'horizontal';
  className?: string;
  style?: ViewStyle;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'auto',
  direction = 'vertical',
  className = '',
  style,
}) => {
  const getSizeClass = () => {
    if (size === 'auto') {
      return 'flex-1';
    }
    return direction === 'horizontal' ? `w-${size}` : `h-${size}`;
  };

  const baseClassName = `${getSizeClass()} ${className}`.trim();

  return <View className={baseClassName} style={style} />;
};

/**
 * Divider Component
 * Visual separator between content sections
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  color?: string;
  className?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 'thin',
  color = 'border-border-DEFAULT',
  className = '',
  style,
}) => {
  const getThicknessClass = () => {
    const prefix = orientation === 'horizontal' ? 'border-b' : 'border-r';
    switch (thickness) {
      case 'thin': return `${prefix}`;
      case 'medium': return `${prefix}-2`;
      case 'thick': return `${prefix}-4`;
      default: return `${prefix}`;
    }
  };

  const getSizeClass = () => {
    return orientation === 'horizontal' ? 'w-full h-0' : 'h-full w-0';
  };

  const baseClassName = `${getSizeClass()} ${getThicknessClass()} ${color} ${className}`.trim();

  return <View className={baseClassName} style={style} />;
};