import React, { useState } from 'react';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { EmailAuthScreen, UserData } from '../screens/auth/EmailAuthScreen';
import { FamilySetupScreen } from '../screens/auth/FamilySetupScreen';
import { JoinFamilyScreen } from '../screens/auth/JoinFamilyScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { OAuthCallbackScreen } from '../screens/auth/OAuthCallbackScreen';

export type AuthScreen = 
  | 'welcome'
  | 'email-auth'
  | 'family-setup'
  | 'join-family'
  | 'onboarding'
  | 'oauth-callback';

export interface AuthNavigatorProps {
  /**
   * Initial screen to show
   */
  initialScreen?: AuthScreen;
  
  /**
   * Callback when authentication flow is completed
   */
  onAuthComplete?: (userData: UserData) => void;
  
  /**
   * Callback for navigation errors
   */
  onError?: (error: string) => void;
}

export interface AuthState {
  currentScreen: AuthScreen;
  userData?: UserData;
  familyData?: {
    familyName: string;
    childrenNames: string[];
  };
  inviteCode?: string;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  initialScreen = 'welcome',
  onAuthComplete,
  onError,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    currentScreen: initialScreen,
  });

  // Navigation helper
  const navigateTo = (screen: AuthScreen, data?: Partial<AuthState>) => {
    setAuthState(prev => ({
      ...prev,
      currentScreen: screen,
      ...data,
    }));
  };

  // OAuth success handler
  const handleOAuthSuccess = (provider: 'google' | 'apple') => {
    // For OAuth users, they might already have a family or need to create one
    // For demo purposes, let's assume OAuth users need to set up their family
    const mockUserData: UserData = {
      id: `oauth_${provider}_${Date.now()}`,
      email: `user@${provider === 'google' ? 'gmail.com' : 'icloud.com'}`,
      name: 'OAuth User',
      provider,
    };
    
    setAuthState(prev => ({
      ...prev,
      userData: mockUserData,
    }));
    
    navigateTo('family-setup');
  };

  // OAuth error handler
  const handleOAuthError = (error: string) => {
    onError?.(error);
  };

  // Email authentication success
  const handleEmailAuthSuccess = (userData: UserData) => {
    setAuthState(prev => ({
      ...prev,
      userData: userData,
    }));
    
    // New users go to family setup, existing users might skip to onboarding
    if (userData.isNewUser) {
      navigateTo('family-setup');
    } else {
      navigateTo('onboarding');
    }
  };

  // Family setup completion
  const handleFamilySetupComplete = (familyData: { familyName: string; childrenNames: string[] }) => {
    setAuthState(prev => ({
      ...prev,
      familyData,
    }));
    
    navigateTo('onboarding');
  };

  // Join family success
  const handleJoinFamilySuccess = (familyData: { familyId: string; familyName: string }) => {
    setAuthState(prev => ({
      ...prev,
      familyData: {
        familyName: familyData.familyName,
        childrenNames: [], // Will be loaded from family
      },
    }));
    
    navigateTo('onboarding');
  };

  // Onboarding completion
  const handleOnboardingComplete = () => {
    if (authState.userData) {
      onAuthComplete?.(authState.userData);
    }
  };

  // Skip onboarding
  const handleOnboardingSkip = () => {
    if (authState.userData) {
      onAuthComplete?.(authState.userData);
    }
  };

  // Back navigation handler
  const handleBackNavigation = () => {
    switch (authState.currentScreen) {
      case 'email-auth':
        navigateTo('welcome');
        break;
      case 'family-setup':
        // If OAuth user, go back to welcome, if email user, go back to email-auth
        if (authState.userData?.provider) {
          navigateTo('welcome');
        } else {
          navigateTo('email-auth');
        }
        break;
      case 'join-family':
        navigateTo('welcome');
        break;
      case 'onboarding':
        // Can't go back from onboarding - family is already set up
        break;
      case 'oauth-callback':
        navigateTo('welcome');
        break;
      default:
        break;
    }
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (authState.currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onOAuthSuccess={handleOAuthSuccess}
            onOAuthError={handleOAuthError}
            onNavigateToEmailAuth={() => navigateTo('email-auth')}
          />
        );

      case 'email-auth':
        return (
          <EmailAuthScreen
            onSignInSuccess={handleEmailAuthSuccess}
            onSignUpSuccess={handleEmailAuthSuccess}
            onNavigateBack={handleBackNavigation}
            onError={onError}
          />
        );

      case 'family-setup':
        return (
          <FamilySetupScreen
            onFamilySetupComplete={handleFamilySetupComplete}
            onNavigateToJoinFamily={() => navigateTo('join-family')}
            onError={onError}
          />
        );

      case 'join-family':
        return (
          <JoinFamilyScreen
            onJoinSuccess={handleJoinFamilySuccess}
            onCreateNewFamily={() => navigateTo('family-setup')}
            onError={onError}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            userName={authState.userData?.name?.split(' ')[0] || 'there'}
            familyName={authState.familyData?.familyName || 'your family'}
            childrenNames={authState.familyData?.childrenNames}
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'oauth-callback':
        return (
          <OAuthCallbackScreen
            onSuccess={(provider) => handleOAuthSuccess(provider)}
            onError={handleOAuthError}
            onCancel={() => navigateTo('welcome')}
          />
        );

      default:
        return (
          <WelcomeScreen
            onOAuthSuccess={handleOAuthSuccess}
            onOAuthError={handleOAuthError}
            onNavigateToEmailAuth={() => navigateTo('email-auth')}
          />
        );
    }
  };

  return renderCurrentScreen();
};