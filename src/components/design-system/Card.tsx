import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  Image,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadows } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
export type CardSize = 'small' | 'medium' | 'large';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Card variant
   */
  variant?: CardVariant;
  
  /**
   * Card size
   */
  size?: CardSize;
  
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card subtitle
   */
  subtitle?: string;
  
  /**
   * Card description
   */
  description?: string;
  
  /**
   * Header image
   */
  image?: ImageSourcePropType;
  
  /**
   * Image alt text for accessibility
   */
  imageAlt?: string;
  
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Whether card is pressable
   */
  pressable?: boolean;
  
  /**
   * Press handler
   */
  onPress?: () => void;
  
  /**
   * Full width card
   */
  fullWidth?: boolean;
  
  /**
   * Custom card style
   */
  style?: ViewStyle;
  
  /**
   * Custom content style
   */
  contentStyle?: ViewStyle;
  
  /**
   * Custom header style
   */
  headerStyle?: ViewStyle;
  
  /**
   * Custom footer style
   */
  footerStyle?: ViewStyle;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  title,
  subtitle,
  description,
  image,
  imageAlt,
  footer,
  pressable = false,
  onPress,
  fullWidth = false,
  style,
  contentStyle,
  headerStyle,
  footerStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  // Get card container styles
  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: borderRadius.base,
      overflow: 'hidden',
    };

    // Size-specific styles
    const sizeStyles: Record<CardSize, ViewStyle> = {
      small: {
        padding: spacing[2],
      },
      medium: {
        padding: spacing[3],
      },
      large: {
        padding: spacing[4],
      },
    };

    // Variant-specific styles
    const variantStyles: Record<CardVariant, ViewStyle> = {
      default: {
        backgroundColor: colors.background.card,
        ...shadows.card,
      },
      elevated: {
        backgroundColor: colors.background.card,
        ...shadows.modal,
      },
      outlined: {
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
      },
      flat: {
        backgroundColor: colors.background.card,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(pressable && { 
        ...shadows.button,
        transform: [{ scale: 1 }] // Ensures transform property exists for animations
      }),
    };
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => ({
    flex: 1,
  });

  // Get header styles
  const getHeaderStyles = (): ViewStyle => ({
    marginBottom: (title || subtitle || description) ? spacing[2] : 0,
  });

  // Get footer styles
  const getFooterStyles = (): ViewStyle => ({
    marginTop: footer ? spacing[2] : 0,
    borderTopWidth: footer ? 1 : 0,
    borderTopColor: colors.border.light,
    paddingTop: footer ? spacing[2] : 0,
  });

  // Get title styles
  const getTitleStyles = (): TextStyle => ({
    ...textStyles.h3,
    color: colors.foreground.DEFAULT,
    marginBottom: subtitle || description ? spacing[0.5] : 0,
  });

  // Get subtitle styles
  const getSubtitleStyles = (): TextStyle => ({
    ...textStyles.bodySmall,
    color: colors.foreground.muted,
    marginBottom: description ? spacing[0.5] : 0,
  });

  // Get description styles
  const getDescriptionStyles = (): TextStyle => ({
    ...textStyles.body,
    color: colors.foreground.DEFAULT,
  });

  // Generate accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    
    const parts = [];
    if (title) parts.push(title);
    if (subtitle) parts.push(subtitle);
    if (description) parts.push(description);
    
    return parts.length > 0 ? parts.join(', ') : 'Card';
  };

  const CardContent = (
    <StyledView style={[getCardStyles(), style]}>
      {/* Image Header */}
      {image && (
        <StyledImage
          source={image}
          style={{
            width: '100%',
            height: 120,
            marginBottom: spacing[2],
            borderRadius: borderRadius.sm,
          }}
          accessibilityLabel={imageAlt}
          accessible={!!imageAlt}
        />
      )}

      {/* Text Header */}
      {(title || subtitle || description) && (
        <StyledView style={[getHeaderStyles(), headerStyle]}>
          {title && (
            <StyledText style={getTitleStyles()}>
              {title}
            </StyledText>
          )}
          
          {subtitle && (
            <StyledText style={getSubtitleStyles()}>
              {subtitle}
            </StyledText>
          )}
          
          {description && (
            <StyledText style={getDescriptionStyles()}>
              {description}
            </StyledText>
          )}
        </StyledView>
      )}

      {/* Main Content */}
      <StyledView style={[getContentStyles(), contentStyle]}>
        {children}
      </StyledView>

      {/* Footer */}
      {footer && (
        <StyledView style={[getFooterStyles(), footerStyle]}>
          {footer}
        </StyledView>
      )}
    </StyledView>
  );

  if (pressable) {
    return (
      <StyledTouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={accessibilityHint}
        testID={testID}
        activeOpacity={0.95}
        style={{ transform: [{ scale: 1 }] }} // Enables press animation
      >
        {CardContent}
      </StyledTouchableOpacity>
    );
  }

  return (
    <StyledView
      accessibilityLabel={getAccessibilityLabel()}
      testID={testID}
    >
      {CardContent}
    </StyledView>
  );
};

// Specialized card components for common use cases
export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="elevated" />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="outlined" />
);

export const FlatCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="flat" />
);

export const PressableCard: React.FC<Omit<CardProps, 'pressable'> & { onPress: () => void }> = (props) => (
  <Card {...props} pressable={true} />
);