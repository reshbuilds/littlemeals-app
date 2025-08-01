import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { AuthLoadingState } from '../../components/auth/AuthLoadingState';
import { AuthErrorState, AuthErrorType } from '../../components/auth/AuthErrorState';
import { colors } from '../../constants/colors';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);

export interface OAuthCallbackScreenProps {
  /**
   * OAuth provider being processed
   */
  provider: 'google' | 'apple' | 'email';
  
  /**
   * Authorization code or token from OAuth provider
   */
  authCode?: string;
  
  /**
   * Error from OAuth provider
   */
  error?: string;
  
  /**
   * Callback when OAuth processing is successful
   */
  onSuccess?: (userData: { userId: string; email: string; name: string; isNewUser: boolean }) => void;
  
  /**
   * Callback when OAuth processing fails
   */
  onError?: (error: string) => void;
  
  /**
   * Callback to retry OAuth process
   */
  onRetry?: () => void;
  
  /**
   * Callback to try different authentication method
   */
  onTryDifferentMethod?: () => void;
}

type ProcessingState = 'loading' | 'error' | 'success';

export const OAuthCallbackScreen: React.FC<OAuthCallbackScreenProps> = ({
  provider,
  authCode,
  error,
  onSuccess,
  onError,
  onRetry,
  onTryDifferentMethod,
}) => {
  const [processingState, setProcessingState] = useState<ProcessingState>('loading');
  const [errorType, setErrorType] = useState<AuthErrorType>('unknown');
  const [retryLoading, setRetryLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Process OAuth callback
  useEffect(() => {
    if (error) {
      // Handle OAuth provider errors
      handleOAuthError(error);
      return;
    }

    if (authCode) {
      processOAuthCode(authCode);
    } else {
      // No auth code provided
      setErrorType('oauth_failed');
      setProcessingState('error');
    }
  }, [authCode, error]);

  // Handle OAuth provider errors
  const handleOAuthError = (errorMessage: string) => {
    console.log('OAuth Error:', errorMessage);
    
    // Map specific OAuth errors to our error types
    if (errorMessage.includes('cancelled') || errorMessage.includes('denied')) {
      // User cancelled OAuth flow - don't show error, just go back
      onTryDifferentMethod?.();
      return;
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      setErrorType('network_error');
    } else if (errorMessage.includes('timeout')) {
      setErrorType('timeout');
    } else if (errorMessage.includes('permission')) {
      setErrorType('permission_denied');
    } else {
      setErrorType('oauth_failed');
    }
    
    setProcessingState('error');
    onError?.(errorMessage);
  };

  // Process OAuth authorization code
  const processOAuthCode = async (code: string) => {
    try {
      setProcessingState('loading');
      setProgress(0);

      // Simulate progressive steps of OAuth processing
      const steps = [
        { message: 'Verifying authorization code...', progress: 20, delay: 800 },
        { message: 'Exchanging for access token...', progress: 40, delay: 1000 },
        { message: 'Fetching user profile...', progress: 60, delay: 800 },
        { message: 'Creating user session...', progress: 80, delay: 600 },
        { message: 'Finalizing setup...', progress: 100, delay: 400 },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // Simulate API call to exchange code for user data
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo purposes, simulate different outcomes
      const random = Math.random();
      
      if (random > 0.9) {
        // Simulate server error (10% chance)
        throw new Error('server_error');
      } else if (random > 0.85) {
        // Simulate network error (5% chance)
        throw new Error('network_error');
      } else if (random > 0.8) {
        // Simulate account already exists (5% chance)
        throw new Error('account_exists');
      }

      // Simulate successful OAuth processing
      const mockUserData = {
        userId: `${provider}-user-${Date.now()}`,
        email: `user@${provider === 'google' ? 'gmail.com' : provider === 'apple' ? 'icloud.com' : 'example.com'}`,
        name: `${provider.charAt(0).toUpperCase()}${provider.slice(1)} User`,
        isNewUser: random > 0.5, // 50% chance of being new user
      };

      setProcessingState('success');
      onSuccess?.(mockUserData);

    } catch (error: any) {
      console.log('OAuth Processing Error:', error);
      
      // Map processing errors to error types
      if (error.message === 'server_error') {
        setErrorType('server_error');
      } else if (error.message === 'network_error') {
        setErrorType('network_error');
      } else if (error.message === 'account_exists') {
        setErrorType('account_exists');
      } else if (error.message?.includes('timeout')) {
        setErrorType('timeout');
      } else {
        setErrorType('oauth_failed');
      }
      
      setProcessingState('error');
      onError?.(error.message || 'OAuth processing failed');
    }
  };

  // Handle retry
  const handleRetry = async () => {
    setRetryLoading(true);
    
    try {
      if (authCode) {
        await processOAuthCode(authCode);
      } else {
        onRetry?.();
      }
    } catch (error) {
      console.log('Retry failed:', error);
    } finally {
      setRetryLoading(false);
    }
  };

  // Handle trying different method
  const handleTryDifferentMethod = () => {
    onTryDifferentMethod?.();
  };

  // Handle contact support
  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'If you continue to experience issues, please contact our support team at support@littlemeals.com',
      [
        { text: 'OK', style: 'default' },
        { text: 'Copy Email', onPress: () => {
          // In a real app, this would copy to clipboard
          Alert.alert('Email copied to clipboard');
        }},
      ]
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={colors.background.DEFAULT}
        barStyle="dark-content"
      />
      <StyledSafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: colors.background.DEFAULT 
        }}
      >
        <StyledView style={{ flex: 1 }}>
          {processingState === 'loading' && (
            <AuthLoadingState
              loadingType="signing_in"
              progress={progress}
              showProgressDots={true}
            />
          )}

          {processingState === 'error' && (
            <AuthErrorState
              errorType={errorType}
              onRetry={authCode ? handleRetry : onRetry}
              onAlternativeAction={handleTryDifferentMethod}
              retryLoading={retryLoading}
              showSupport={true}
              onContactSupport={handleContactSupport}
            />
          )}

          {processingState === 'success' && (
            <AuthLoadingState
              loadingType="loading_profile"
              customMessage="Sign in successful! Loading your profile..."
              showProgressDots={true}
            />
          )}
        </StyledView>
      </StyledSafeAreaView>
    </>
  );
};