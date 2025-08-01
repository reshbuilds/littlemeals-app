import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing, dimensions, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);

export type OAuthProvider = 'google' | 'apple' | 'email';

export interface OAuthButtonProps {
  /**
   * OAuth provider type
   */
  provider: OAuthProvider;
  
  /**
   * Press handler
   */
  onPress?: () => void;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Full width button (default: true)
   */
  fullWidth?: boolean;
  
  /**
   * Custom accessibility label
   */
  accessibilityLabel?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

// Provider-specific configurations
const providerConfig = {
  google: {
    label: 'Continue with Google',
    backgroundColor: colors.white,
    borderColor: colors.border.DEFAULT,
    textColor: colors.foreground.DEFAULT,
    icon: '🟢', // Placeholder - in real app would use proper Google icon
  },
  apple: {
    label: 'Continue with Apple',
    backgroundColor: colors.black,
    borderColor: colors.black,
    textColor: colors.white,
    icon: '🍎', // Placeholder - in real app would use proper Apple icon
  },
  email: {
    label: 'Continue with Email',
    backgroundColor: colors.background.card,
    borderColor: colors.border.DEFAULT,
    textColor: colors.foreground.DEFAULT,
    icon: '✉️', // Placeholder - in real app would use proper email icon
  },
} as const;

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityLabel,
  testID,
}) => {
  const config = providerConfig[provider];
  
  const buttonStyles = {
    height: dimensions.buttonLarge, // Large touch target
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.base,
    backgroundColor: disabled ? colors.background.muted : config.backgroundColor,
    borderWidth: 1,
    borderColor: disabled ? colors.border.light : config.borderColor,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { opacity: 0.6 }),
    // Add shadow for better visual hierarchy
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  };

  const textColor = disabled ? colors.foreground.muted : config.textColor;

  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    return `${config.label}, double tap to sign in`;
  };

  return (
    <StyledTouchableOpacity
      style={buttonStyles}
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={`Sign in using your ${provider} account`}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID || `oauth-button-${provider}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <StyledView className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={textColor}
            style={{ marginRight: spacing[2] }}
          />
          <StyledText
            style={{
              ...textStyles.buttonLarge,
              color: textColor,
            }}
          >
            Signing in...
          </StyledText>
        </StyledView>
      ) : (
        <StyledView className="flex-row items-center">
          <StyledText
            style={{
              fontSize: 20,
              marginRight: spacing[3],
            }}
          >
            {config.icon}
          </StyledText>
          <StyledText
            style={{
              ...textStyles.buttonLarge,
              color: textColor,
            }}
          >
            {config.label}
          </StyledText>
        </StyledView>
      )}
    </StyledTouchableOpacity>
  );
};

// Specialized components for each provider
export const GoogleButton: React.FC<Omit<OAuthButtonProps, 'provider'>> = (props) => (
  <OAuthButton {...props} provider="google" />
);

export const AppleButton: React.FC<Omit<OAuthButtonProps, 'provider'>> = (props) => (
  <OAuthButton {...props} provider="apple" />
);

export const EmailButton: React.FC<Omit<OAuthButtonProps, 'provider'>> = (props) => (
  <OAuthButton {...props} provider="email" />
);