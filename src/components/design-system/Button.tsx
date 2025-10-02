import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, dimensions, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export type ButtonVariant = 'primary' | 'secondary' | 'child-response';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ChildResponseType = 'eaten' | 'partial' | 'refused';

export interface ButtonProps {
  /**
   * Button content - can be string or React node
   */
  children: React.ReactNode;
  
  /**
   * Button style variant
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * For child-response variant, specify the response type
   */
  responseType?: ChildResponseType;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Loading state - shows spinner
   */
  loading?: boolean;
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Press handler
   */
  onPress?: () => void;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  
  /**
   * Custom style override
   */
  style?: ViewStyle;
  
  /**
   * Custom text style override
   */
  textStyle?: TextStyle;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  responseType = 'eaten',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
  testID,
}) => {
  // Get button styles based on variant and state
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: spacing[3],
    };

    // Size-specific styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        height: dimensions.buttonSmall,
        paddingHorizontal: spacing[2],
      },
      medium: {
        height: dimensions.buttonMedium,
        paddingHorizontal: spacing[3],
      },
      large: {
        height: dimensions.buttonLarge,
        paddingHorizontal: spacing[4],
      },
    };

    // Variant-specific styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? colors.background.muted : colors.primary.DEFAULT,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: disabled ? colors.background.muted : colors.background.card,
        borderWidth: 1,
        borderColor: disabled ? colors.border.light : colors.border.DEFAULT,
      },
      'child-response': {
        backgroundColor: disabled 
          ? colors.background.muted 
          : colors.responses[responseType].light,
        borderWidth: 2,
        borderColor: disabled 
          ? colors.border.light 
          : colors.responses[responseType].DEFAULT,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.6 }),
    };
  };

  // Get text styles based on variant and state
  const getTextStyles = (): TextStyle => {
    const baseTextStyle = size === 'small' 
      ? textStyles.buttonSmall 
      : size === 'large' 
        ? textStyles.buttonLarge 
        : textStyles.button;

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: disabled ? colors.foreground.muted : colors.primary.foreground,
      },
      secondary: {
        color: disabled ? colors.foreground.muted : colors.foreground.DEFAULT,
      },
      'child-response': {
        color: disabled 
          ? colors.foreground.muted 
          : colors.responses[responseType].foreground,
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
    };
  };

  // Determine accessibility role
  const accessibilityRole: AccessibilityRole = 'button';

  // Generate accessibility label if not provided
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    
    if (variant === 'child-response') {
      const responseLabels = {
        eaten: 'Mark as eaten',
        partial: 'Mark as partially eaten',
        refused: 'Mark as refused',
      };
      return responseLabels[responseType];
    }
    
    return typeof children === 'string' ? children : 'Button';
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.primary.foreground : colors.primary.DEFAULT}
          style={{ marginRight: spacing[1] }}
        />
      )}
      
      {typeof children === 'string' ? (
        <Text style={[getTextStyles(), textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

// Specialized button components for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const ChildResponseButton: React.FC<Omit<ButtonProps, 'variant'> & { responseType: ChildResponseType }> = (props) => (
  <Button {...props} variant="child-response" />
);