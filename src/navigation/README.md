# Authentication Navigation System

This directory contains the complete authentication navigation system for LittleMeals, including landscape orientation support, screen-to-screen navigation, and flow coordination.

## Components

### `AuthNavigator`
Manages navigation between authentication screens with proper state management.

**Features:**
- Handles OAuth and email authentication flows
- Manages family setup and joining flows
- Supports onboarding process
- Maintains user and family data throughout the flow
- Provides back navigation where appropriate

**Usage:**
```tsx
import { AuthNavigator } from './navigation/AuthNavigator';

<AuthNavigator
  initialScreen="welcome"
  onAuthComplete={(userData) => {
    // Handle successful authentication
  }}
  onError={(error) => {
    // Handle authentication errors
  }}
/>
```

### `AppFlowCoordinator`
Top-level coordinator that manages the transition between authentication and main app.

**Features:**
- Loading state management
- Authentication state persistence checking
- Seamless transition between auth flow and main app
- Error handling throughout the flow
- Future sign-out functionality

**Usage:**
```tsx
import { AppFlowCoordinator } from './navigation/AppFlowCoordinator';

<AppFlowCoordinator
  onAuthStateChange={(isAuthenticated, userData) => {
    // Track authentication state changes
  }}
>
  {/* Main app content goes here */}
  <MainAppTabs />
</AppFlowCoordinator>
```

## Screen Flow

### OAuth Flow
1. **WelcomeScreen** → OAuth provider selected
2. **OAuthCallbackScreen** (optional) → OAuth processing
3. **FamilySetupScreen** → User creates family
4. **OnboardingScreen** → Tutorial walkthrough
5. **Main App**

### Email Flow
1. **WelcomeScreen** → "Continue with Email"
2. **EmailAuthScreen** → Sign in/up with email
3. **FamilySetupScreen** → User creates family (new users)
4. **OnboardingScreen** → Tutorial walkthrough
5. **Main App**

### Join Family Flow
1. **WelcomeScreen** → "Continue with Email"
2. **EmailAuthScreen** → Sign in/up with email
3. **JoinFamilyScreen** → Join existing family with invite code
4. **OnboardingScreen** → Tutorial walkthrough
5. **Main App**

## Landscape Orientation Support

All authentication screens support landscape orientation with:
- **Side-by-side layouts** for better space utilization
- **Compact form elements** optimized for landscape
- **Responsive typography** that scales appropriately
- **Touch-optimized button sizes** maintained across orientations

## Navigation Features

### State Management
- **User data** preserved throughout auth flow
- **Family data** maintained after creation/joining
- **Error states** handled gracefully with user feedback
- **Loading states** with appropriate UI feedback

### Back Navigation
- **Contextual back navigation** based on user's path
- **Prevents navigation dead-ends** 
- **Smart routing** between related screens

### Error Handling
- **Network error recovery** with retry options
- **Form validation errors** with real-time feedback
- **Authentication failures** with clear user guidance
- **Graceful fallbacks** for edge cases

## Integration Example

Complete integration example for an app:

```tsx
import React from 'react';
import { AppFlowCoordinator } from './src/navigation';
import { MainAppTabs } from './src/components/MainAppTabs';

export default function App() {
  return (
    <AppFlowCoordinator
      onAuthStateChange={(isAuthenticated, userData) => {
        console.log('Auth state:', isAuthenticated, userData);
      }}
    >
      <MainAppTabs />
    </AppFlowCoordinator>
  );
}
```

## Future Enhancements

- **Deep linking** support for invite codes
- **Biometric authentication** integration
- **Social login** providers beyond Google/Apple
- **Multi-family** support for users
- **Offline authentication** state management