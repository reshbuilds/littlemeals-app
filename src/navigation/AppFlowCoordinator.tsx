import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { AuthNavigator } from './AuthNavigator';
import { UserData } from '../screens/auth/EmailAuthScreen';
import { colors } from '../constants/colors';

const StyledView = styled(View);

export type AppState = 'loading' | 'unauthenticated' | 'authenticated';

export interface AppFlowCoordinatorProps {
  /**
   * Initial app state (for testing/demo purposes)
   */
  initialState?: AppState;
  
  /**
   * Callback when user authentication state changes
   */
  onAuthStateChange?: (isAuthenticated: boolean, userData?: UserData) => void;
  
  /**
   * Main app component to render when authenticated
   */
  children?: React.ReactNode;
}

export interface AppFlowState {
  appState: AppState;
  userData?: UserData;
  error?: string;
}

export const AppFlowCoordinator: React.FC<AppFlowCoordinatorProps> = ({
  initialState = 'loading',
  onAuthStateChange,
  children,
}) => {
  const [flowState, setFlowState] = useState<AppFlowState>({
    appState: initialState,
  });

  // Simulate checking authentication state on app start
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Simulate API call to check if user is authenticated
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, assume user is not authenticated initially
        // In a real app, this would check stored tokens, etc.
        const isAuthenticated = false;
        
        setFlowState({
          appState: isAuthenticated ? 'authenticated' : 'unauthenticated',
        });
        
        onAuthStateChange?.(isAuthenticated);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setFlowState({
          appState: 'unauthenticated',
          error: 'Failed to check authentication state',
        });
        
        onAuthStateChange?.(false);
      }
    };

    if (initialState === 'loading') {
      checkAuthState();
    }
  }, [initialState, onAuthStateChange]);

  // Handle successful authentication
  const handleAuthComplete = (userData: UserData) => {
    setFlowState({
      appState: 'authenticated',
      userData,
      error: undefined,
    });
    
    onAuthStateChange?.(true, userData);
  };

  // Handle authentication errors
  const handleAuthError = (error: string) => {
    setFlowState(prev => ({
      ...prev,
      error,
    }));
  };

  // Handle sign out (for future use)
  const handleSignOut = () => {
    setFlowState({
      appState: 'unauthenticated',
      userData: undefined,
      error: undefined,
    });
    
    onAuthStateChange?.(false);
  };

  // Render based on current app state
  const renderCurrentFlow = () => {
    switch (flowState.appState) {
      case 'loading':
        return (
          <StyledView 
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background.DEFAULT,
            }}
          >
            {/* Loading state - could be a splash screen or loading spinner */}
            <StyledView
              style={{
                width: 120,
                height: 120,
                borderRadius: 30,
                backgroundColor: colors.primary.light,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary.DEFAULT,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <StyledView style={{ fontSize: 48 }}>🍽️</StyledView>
            </StyledView>
          </StyledView>
        );

      case 'unauthenticated':
        return (
          <AuthNavigator
            onAuthComplete={handleAuthComplete}
            onError={handleAuthError}
          />
        );

      case 'authenticated':
        return (
          <StyledView style={{ flex: 1 }}>
            {children || (
              <StyledView 
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.background.DEFAULT,
                }}
              >
                {/* Placeholder for main app - would render the main app tabs/screens */}
                <StyledView style={{ fontSize: 48, marginBottom: 16 }}>🎉</StyledView>
                <StyledView>Welcome to LittleMeals!</StyledView>
                <StyledView>User: {flowState.userData?.name}</StyledView>
              </StyledView>
            )}
          </StyledView>
        );

      default:
        return null;
    }
  };

  return renderCurrentFlow();
};

// Hook for accessing flow coordinator functionality (for future use)
export const useAppFlow = () => {
  const [flowState, setFlowState] = useState<AppFlowState>({
    appState: 'loading',
  });

  const signOut = () => {
    setFlowState({
      appState: 'unauthenticated',
      userData: undefined,
      error: undefined,
    });
  };

  const signIn = (userData: UserData) => {
    setFlowState({
      appState: 'authenticated',
      userData,
      error: undefined,
    });
  };

  return {
    ...flowState,
    signOut,
    signIn,
  };
};