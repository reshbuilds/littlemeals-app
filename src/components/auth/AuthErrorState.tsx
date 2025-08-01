import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styled } from 'nativewind';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export type AuthErrorType = 
  | 'oauth_failed'
  | 'network_error'
  | 'server_error' 
  | 'invalid_invite'
  | 'family_creation_failed'
  | 'account_exists'
  | 'permission_denied'
  | 'timeout'
  | 'unknown';

export interface AuthErrorStateProps {
  /**
   * Type of error
   */
  errorType: AuthErrorType;
  
  /**
   * Custom error message (optional)
   */
  customMessage?: string;
  
  /**
   * Callback for retry action
   */
  onRetry?: () => void;
  
  /**
   * Callback for alternative action
   */
  onAlternativeAction?: () => void;
  
  /**
   * Loading state for retry
   */
  retryLoading?: boolean;
  
  /**
   * Whether to show contact support option
   */
  showSupport?: boolean;
  
  /**
   * Callback for contact support
   */
  onContactSupport?: () => void;
}

// Error configurations
const errorConfigs: Record<AuthErrorType, {
  emoji: string;
  title: string;
  message: string;
  retryText?: string;
  alternativeText?: string;
}> = {
  oauth_failed: {
    emoji: '🔐',
    title: 'Sign In Failed',
    message: 'We couldn\'t sign you in. This might be due to account permissions or a temporary issue.',
    retryText: 'Try Again',
    alternativeText: 'Use Different Method',
  },
  network_error: {
    emoji: '📡',
    title: 'Connection Issue',
    message: 'Please check your internet connection and try again.',
    retryText: 'Retry',
  },
  server_error: {
    emoji: '⚠️',
    title: 'Server Error',
    message: 'Our servers are experiencing issues. Please try again in a few moments.',
    retryText: 'Try Again',
  },
  invalid_invite: {
    emoji: '🎫',
    title: 'Invalid Invite Code',
    message: 'The invite code you entered is not valid or has expired. Please check with your family member for a new code.',
    retryText: 'Try Different Code',
    alternativeText: 'Create New Family',
  },
  family_creation_failed: {
    emoji: '👨‍👩‍👧‍👦',
    title: 'Family Setup Failed',
    message: 'We couldn\'t create your family. Please try again.',
    retryText: 'Try Again',
    alternativeText: 'Join Existing Family',
  },
  account_exists: {
    emoji: '👤',
    title: 'Account Already Exists',
    message: 'An account with this email already exists. Try signing in instead.',
    alternativeText: 'Sign In',
  },
  permission_denied: {
    emoji: '🚫',
    title: 'Permission Denied',
    message: 'You don\'t have permission to access this family. Please contact the family admin.',
    alternativeText: 'Join Different Family',
  },
  timeout: {
    emoji: '⏱️',
    title: 'Request Timed Out',
    message: 'The request took too long to complete. Please try again.',
    retryText: 'Try Again',
  },
  unknown: {
    emoji: '❓',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    retryText: 'Try Again',
  },
};

export const AuthErrorState: React.FC<AuthErrorStateProps> = ({
  errorType,
  customMessage,
  onRetry,
  onAlternativeAction,
  retryLoading = false,
  showSupport = true,
  onContactSupport,
}) => {
  const config = errorConfigs[errorType];
  const message = customMessage || config.message;

  return (
    <StyledView
      style={{
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.base,
        padding: spacing[6],
        margin: spacing[4],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.error.light,
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* Error Icon */}
      <StyledText 
        style={{ 
          fontSize: 48, 
          marginBottom: spacing[4] 
        }}
      >
        {config.emoji}
      </StyledText>

      {/* Error Title */}
      <StyledText
        style={{
          ...textStyles.h3,
          color: colors.foreground.DEFAULT,
          textAlign: 'center',
          marginBottom: spacing[3],
        }}
      >
        {config.title}
      </StyledText>

      {/* Error Message */}
      <StyledText
        style={{
          ...textStyles.body,
          color: colors.foreground.muted,
          textAlign: 'center',
          marginBottom: spacing[6],
          lineHeight: 22,
        }}
      >
        {message}
      </StyledText>

      {/* Action Buttons */}
      <StyledView style={{ width: '100%', gap: spacing[3] }}>
        {/* Primary Action (Retry) */}
        {config.retryText && onRetry && (
          <PrimaryButton
            onPress={onRetry}
            loading={retryLoading}
            disabled={retryLoading}
            fullWidth
            size="large"
            testID="error-retry-button"
          >
            {config.retryText}
          </PrimaryButton>
        )}

        {/* Alternative Action */}
        {config.alternativeText && onAlternativeAction && (
          <SecondaryButton
            onPress={onAlternativeAction}
            disabled={retryLoading}
            fullWidth
            size="large"
            testID="error-alternative-button"
          >
            {config.alternativeText}
          </SecondaryButton>
        )}
      </StyledView>

      {/* Support Link */}
      {showSupport && onContactSupport && (
        <StyledTouchableOpacity
          onPress={onContactSupport}
          style={{
            marginTop: spacing[4],
            paddingVertical: spacing[2],
          }}
          accessibilityLabel="Contact support"
          accessibilityRole="button"
        >
          <StyledText
            style={{
              ...textStyles.body,
              color: colors.primary.DEFAULT,
              textAlign: 'center',
            }}
          >
            Need help? Contact Support
          </StyledText>
        </StyledTouchableOpacity>
      )}
    </StyledView>
  );
};