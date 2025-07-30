## Root Directory Structure
```
littlemeals/
├── src/                          # All source code
├── __tests__/                    # All test files
├── assets/                       # Images, fonts, icons
├── docs/                         # Documentation
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js           # NativeWind configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler configuration
└── .env                         # Environment variables
```

## Source Code Structure (`src/`)
```
src/
├── components/                   # All reusable components
│   ├── design-system/           # Core design system components
│   │   ├── Button.tsx           # Primary, secondary, OAuth buttons
│   │   ├── Input.tsx            # Text inputs, search, autocomplete
│   │   ├── Card.tsx             # Meal cards, child profile cards
│   │   ├── Typography.tsx       # Heading, body, caption components
│   │   ├── Layout.tsx           # Screen containers, grids, spacing
│   │   ├── Feedback.tsx         # Loading, success, error states
│   │   ├── Navigation.tsx       # Tab bar, navigation components
│   │   └── index.ts             # Export all design system components
│   ├── auth/                    # Authentication-specific components
│   │   ├── OAuthButton.tsx      # Google/Apple sign-in buttons
│   │   ├── InvitationCard.tsx   # Family invitation display
│   │   ├── FamilyMemberCard.tsx # Family member profile display
│   │   └── PermissionManager.tsx # Role/permission management
│   ├── forms/                   # Form-specific components
│   │   ├── MealLoggingForm.tsx  # Main meal entry form
│   │   ├── ChildResponseGrid.tsx # Child response buttons grid
│   │   ├── FoodAutocomplete.tsx # Food search and selection
│   │   ├── DatePicker.tsx       # Date selection component
│   │   ├── MealTypeSelector.tsx # Breakfast/lunch/dinner/snack
│   │   └── VoiceInput.tsx       # Voice recording interface
│   ├── charts/                  # Data visualization components
│   │   ├── FoodTrendsChart.tsx  # Food acceptance trends
│   │   ├── PatternHeatmap.tsx   # Meal timing patterns
│   │   ├── ProgressChart.tsx    # Child eating progress
│   │   └── NutritionOverview.tsx # Food group summaries
│   ├── chat/                    # AI chat related components
│   │   ├── ChatInterface.tsx    # Main chat UI
│   │   ├── MessageBubble.tsx    # Individual chat messages
│   │   ├── TypingIndicator.tsx  # AI typing animation
│   │   └── QuickActions.tsx     # Quick query buttons
│   └── family/                  # Family management components
│       ├── ChildProfile.tsx     # Child profile card
│       ├── FamilyMemberList.tsx # List of family members
│       ├── InviteCaregiver.tsx  # Family invitation flow
│       └── FamilySettings.tsx   # Family configuration
├── screens/                     # Screen components for navigation
│   ├── auth/                    # Authentication screens
│   │   ├── WelcomeScreen.tsx    # Welcome with OAuth options
│   │   ├── OAuthCallbackScreen.tsx # OAuth callback handling
│   │   ├── EmailAuthScreen.tsx  # Email/password fallback
│   │   ├── FamilySetupScreen.tsx # First-time family creation
│   │   ├── JoinFamilyScreen.tsx # Accept family invitation
│   │   └── OnboardingScreen.tsx # Post-auth user onboarding
│   ├── main/                    # Main app screens
│   │   ├── LogScreen.tsx        # Main meal logging screen
│   │   ├── InsightsScreen.tsx   # Dashboard and analytics
│   │   ├── SearchScreen.tsx     # Smart search/AI chat
│   │   └── SettingsScreen.tsx   # App and family settings
│   ├── family/                  # Family management screens
│   │   ├── FamilyInviteScreen.tsx # Send family invitations
│   │   ├── ChildManagementScreen.tsx # Add/edit children
│   │   ├── FamilyMembersScreen.tsx # View/manage family members
│   │   └── FamilySettingsScreen.tsx # Family preferences and settings
│   └── insights/                # Detailed insight screens
│       ├── FoodHistoryScreen.tsx # Food consumption history
│       ├── PatternAnalysisScreen.tsx # Eating pattern analysis
│       └── ReportsScreen.tsx    # Pediatrician reports
├── services/                    # External service integrations
│   ├── supabase/               # Supabase database operations
│   │   ├── client.ts           # Supabase client configuration
│   │   ├── auth.ts             # OAuth (Google/Apple) and email auth
│   │   ├── families.ts         # Family creation, invitations, member management
│   │   ├── meals.ts            # Meal CRUD operations
│   │   ├── children.ts         # Child profile operations
│   │   ├── foods.ts            # Food database operations
│   │   └── realtime.ts         # Real-time subscriptions
│   ├── openai/                 # OpenAI API integration
│   │   ├── client.ts           # OpenAI client setup
│   │   ├── chat.ts             # Chat completion handling
│   │   ├── context.ts          # Family meal context building
│   │   └── parsing.ts          # Natural language parsing
│   ├── speech/                 # Voice processing
│   │   ├── recognition.ts      # Speech-to-text
│   │   ├── synthesis.ts        # Text-to-speech (optional)
│   │   └── processing.ts       # Voice command parsing
│   └── analytics/              # App analytics and tracking
│       ├── events.ts           # Event tracking
│       ├── performance.ts      # Performance monitoring
│       └── crashes.ts          # Crash reporting
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts             # OAuth and email authentication state
│   ├── useFamily.ts           # Family data, invitations, member management
│   ├── useMeals.ts            # Meal logging and retrieval
│   ├── useChildren.ts         # Child profile management
│   ├── useFoods.ts            # Food database operations
│   ├── useVoice.ts            # Voice recording and processing
│   ├── useChat.ts             # AI chat functionality
│   ├── useRealtime.ts         # Real-time data synchronization
│   ├── useOffline.ts          # Offline functionality
│   ├── usePermissions.ts      # Family role and permission management
│   └── useInsights.ts         # Data analysis and insights
├── utils/                     # Utility functions
│   ├── validation.ts          # Form validation functions
│   ├── formatting.ts          # Date, text formatting
│   ├── storage.ts             # Local storage operations
│   ├── permissions.ts         # Device permissions handling
│   ├── network.ts             # Network status checking
│   ├── analytics.ts           # Analytics helper functions
│   ├── export.ts              # PDF generation and sharing
│   └── constants.ts           # App-wide constants
├── types/                     # TypeScript type definitions
│   ├── auth.ts               # OAuth, email auth, user session types
│   ├── family.ts             # Family, member, invitation, permission types
│   ├── meals.ts              # Meal and food types
│   ├── chat.ts               # AI chat types
│   ├── insights.ts           # Analytics and chart types
│   ├── api.ts                # API response types
│   └── navigation.ts         # Navigation types
├── constants/                # App configuration constants
│   ├── colors.ts             # Design system colors
│   ├── typography.ts         # Font sizes and families
│   ├── spacing.ts            # Margin, padding values
│   ├── animations.ts         # Animation configurations
│   ├── config.ts             # App configuration
│   └── api.ts                # API endpoints and keys
├── contexts/                 # React context providers
│   ├── AuthContext.tsx       # Authentication context
│   ├── FamilyContext.tsx     # Family data context
│   ├── ThemeContext.tsx      # Design system theme
│   └── OfflineContext.tsx    # Offline state management
└── navigation/               # Navigation configuration
    ├── AppNavigator.tsx      # Main app navigation
    ├── AuthNavigator.tsx     # Authentication flow
    ├── TabNavigator.tsx      # Main tab navigation
    └── types.ts              # Navigation type definitions
```

## Test Structure (`__tests__/`)
```
__tests__/
├── components/               # Component unit tests
│   ├── design-system/       # Design system component tests
│   ├── forms/              # Form component tests
│   ├── charts/             # Chart component tests
│   └── family/             # Family component tests
├── screens/                # Screen integration tests
│   ├── auth/               # Authentication screen tests
│   ├── main/               # Main screen tests
│   └── family/             # Family screen tests
├── services/               # Service integration tests
│   ├── supabase/           # Database operation tests
│   ├── openai/             # AI service tests
│   └── speech/             # Voice processing tests
├── hooks/                  # Custom hook tests
├── utils/                  # Utility function tests
├── e2e/                    # End-to-end tests
│   ├── meal-logging.e2e.ts # Core meal logging flow
│   ├── family-sync.e2e.ts  # Family synchronization
│   ├── voice-logging.e2e.ts # Voice input flow
│   └── ai-chat.e2e.ts      # AI chat interaction
├── mocks/                  # Test mocks and fixtures
│   ├── supabase.ts         # Supabase mock
│   ├── openai.ts           # OpenAI mock
│   ├── speech.ts           # Speech API mock
│   └── data.ts             # Sample test data
└── setup/                  # Test configuration
    ├── jest.setup.js       # Jest configuration
    ├── test-utils.tsx      # Testing utilities
    └── mocks.ts            # Global mocks
```

## Key File Examples

### OAuth Button Component (`src/components/auth/OAuthButton.tsx`)
```typescript
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styled } from 'nativewind';

interface OAuthButtonProps {
  provider: 'google' | 'apple' | 'email';
  onPress: () => void;
  disabled?: boolean;
}

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

export const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onPress, disabled }) => {
  // OAuth button implementation with provider-specific styling and icons
};
```

### Family Service (`src/services/supabase/families.ts`)
```typescript
import { supabase } from './client';
import { Family, FamilyInvitation, FamilyMember } from '@/types/family';

export class FamilyService {
  static async createFamily(name: string, createdBy: string): Promise<Family> {
    // Family creation with invite code generation
  }

  static async inviteFamilyMember(familyId: string, email: string): Promise<FamilyInvitation> {
    // Send family invitation via email/SMS
  }

  static async acceptInvitation(inviteCode: string, userId: string): Promise<void> {
    // Accept family invitation and join family
  }

  static async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    // Get all family members with roles and permissions
  }
}
```

### Custom Hook (`src/hooks/useMeals.ts`)
```typescript
import { useState, useEffect } from 'react';
import { MealService } from '@/services/supabase/meals';
import { Meal } from '@/types/meals';

export const useMeals = (familyId: string) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook implementation
  
  return { meals, loading, createMeal, updateMeal };
};
```

## Environment Configuration (`.env`)
```
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=https://api.littlemeals.com
```

## Package.json Scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "detox test",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android"
  }
}
```

## File Naming Conventions
- **Components**: PascalCase (e.g., `MealLoggingForm.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useMeals.ts`)
- **Services**: camelCase (e.g., `meals.ts`)
- **Types**: camelCase (e.g., `meals.ts`)
- **Constants**: camelCase (e.g., `colors.ts`)
- **Utilities**: camelCase (e.g., `validation.ts`)

## Import/Export Patterns
```typescript
// Absolute imports from src/
import { Button } from '@/components/design-system';
import { useMeals } from '@/hooks/useMeals';
import { MealService } from '@/services/supabase/meals';

// Relative imports for nearby files
import { validateMealForm } from '../utils/validation';
```

