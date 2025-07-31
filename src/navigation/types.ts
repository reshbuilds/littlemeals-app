import { Href } from 'expo-router';

// Expo Router Route Parameters
// Main Tab Routes (current structure)
export type TabRoutes = {
  '/(tabs)': undefined;
  '/(tabs)/log': undefined;
  '/(tabs)/insights': undefined;
  '/(tabs)/search': undefined;
  '/(tabs)/settings': undefined;
};

// Future Auth Routes (when implemented)
export type AuthRoutes = {
  '/(auth)': undefined;
  '/(auth)/welcome': undefined;
  '/(auth)/oauth-callback': { provider: 'google' | 'apple' };
  '/(auth)/email-auth': undefined;
  '/(auth)/family-setup': undefined;
  '/(auth)/join-family': { inviteCode?: string };
  '/(auth)/onboarding': undefined;
};

// Future Family Management Routes (nested in settings)
export type FamilyRoutes = {
  '/family/invite': undefined;
  '/family/children': undefined;
  '/family/members': undefined;
  '/family/settings': undefined;
};

// Future Insights Routes (nested in insights)
export type InsightsRoutes = {
  '/insights/dashboard': undefined;
  '/insights/food-history': { childId?: string };
  '/insights/pattern-analysis': { childId?: string };
  '/insights/reports': undefined;
};

// Future Meal Routes
export type MealRoutes = {
  '/meal/new': undefined;
  '/meal/edit': { mealId: string };
  '/meal/history': undefined;
  '/meal/voice': undefined;
};

// Combined Route Types
export type AppRoutes = TabRoutes & AuthRoutes & FamilyRoutes & InsightsRoutes & MealRoutes;

// Route Helper Types
export type AppHref = Href<keyof AppRoutes>;

// Screen Component Props (for future use)
export interface ScreenProps<T extends keyof AppRoutes = keyof AppRoutes> {
  route?: T;
  params?: AppRoutes[T];
}

// Current Tab Screen Props (ready to use)
export type LogScreenProps = ScreenProps<'/(tabs)/log'>;
export type InsightsScreenProps = ScreenProps<'/(tabs)/insights'>;
export type SearchScreenProps = ScreenProps<'/(tabs)/search'>;
export type SettingsScreenProps = ScreenProps<'/(tabs)/settings'>;

// Future Auth Screen Props (for when auth is implemented)
export type WelcomeScreenProps = ScreenProps<'/(auth)/welcome'>;
export type FamilySetupScreenProps = ScreenProps<'/(auth)/family-setup'>;
export type JoinFamilyScreenProps = ScreenProps<'/(auth)/join-family'>;
export type OnboardingScreenProps = ScreenProps<'/(auth)/onboarding'>;

// Navigation Helpers
export const Routes = {
  // Current Tab Routes
  LOG: '/(tabs)/log' as const,
  INSIGHTS: '/(tabs)/insights' as const,
  SEARCH: '/(tabs)/search' as const,
  SETTINGS: '/(tabs)/settings' as const,
  
  // Future Auth Routes
  WELCOME: '/(auth)/welcome' as const,
  OAUTH_CALLBACK: '/(auth)/oauth-callback' as const,
  EMAIL_AUTH: '/(auth)/email-auth' as const,
  FAMILY_SETUP: '/(auth)/family-setup' as const,
  JOIN_FAMILY: '/(auth)/join-family' as const,
  ONBOARDING: '/(auth)/onboarding' as const,
  
  // Future Feature Routes
  FAMILY_INVITE: '/family/invite' as const,
  FAMILY_CHILDREN: '/family/children' as const,
  FAMILY_MEMBERS: '/family/members' as const,
  FAMILY_SETTINGS: '/family/settings' as const,
  
  INSIGHTS_DASHBOARD: '/insights/dashboard' as const,
  FOOD_HISTORY: '/insights/food-history' as const,
  PATTERN_ANALYSIS: '/insights/pattern-analysis' as const,
  REPORTS: '/insights/reports' as const,
  
  NEW_MEAL: '/meal/new' as const,
  EDIT_MEAL: '/meal/edit' as const,
  MEAL_HISTORY: '/meal/history' as const,
  VOICE_MEAL: '/meal/voice' as const,
} as const;

// Type for route constants
export type RouteConstants = typeof Routes[keyof typeof Routes];