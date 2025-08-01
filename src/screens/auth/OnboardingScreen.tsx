import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { OnboardingStep } from '../../components/auth/OnboardingStep';
import { ChildResponseButton } from '../../components/design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export interface OnboardingScreenProps {
  /**
   * User's name for personalization
   */
  userName?: string;
  
  /**
   * Family name for context
   */
  familyName?: string;
  
  /**
   * Children names for demo
   */
  childrenNames?: string[];
  
  /**
   * Callback when onboarding is completed
   */
  onComplete?: () => void;
  
  /**
   * Callback when user skips onboarding
   */
  onSkip?: () => void;
}

type OnboardingStepType = 'welcome' | 'meal_logging' | 'family_sync' | 'ai_insights' | 'ready';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  userName = 'there',
  familyName = 'your family',
  childrenNames = ['Emma', 'Jake'],
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStepType>('welcome');
  const [loading, setLoading] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<Record<string, 'eaten' | 'partial' | 'refused'>>({});

  const steps: OnboardingStepType[] = ['welcome', 'meal_logging', 'family_sync', 'ai_insights', 'ready'];
  const currentStepIndex = steps.indexOf(currentStep);

  // Handle next step
  const handleNext = async () => {
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex >= steps.length) {
      // Complete onboarding
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate setup
      setLoading(false);
      onComplete?.();
    } else {
      setCurrentStep(steps[nextStepIndex]);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
    }
  };

  // Handle skip onboarding
  const handleSkip = () => {
    Alert.alert(
      'Skip Tutorial?',
      'You can always access the tutorial later from Settings. Are you sure you want to skip?',
      [
        { text: 'Continue Tutorial', style: 'cancel' },
        { text: 'Skip', style: 'default', onPress: onSkip },
      ]
    );
  };

  // Handle child response selection (for demo)
  const handleChildResponseSelect = (childName: string, response: 'eaten' | 'partial' | 'refused') => {
    setSelectedResponses(prev => ({
      ...prev,
      [childName]: response,
    }));
  };

  // Demo meal logging component
  const MealLoggingDemo = () => (
    <StyledView
      style={{
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.base,
        padding: spacing[4],
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
      }}
    >
      {/* Meal Info */}
      <StyledView style={{ marginBottom: spacing[4] }}>
        <StyledText
          style={{
            ...textStyles.h4,
            color: colors.foreground.DEFAULT,
            marginBottom: spacing[1],
          }}
        >
          🥞 Banana Pancakes
        </StyledText>
        <StyledText
          style={{
            ...textStyles.body,
            color: colors.foreground.muted,
          }}
        >
          Breakfast • Today
        </StyledText>
      </StyledView>

      {/* Child Responses */}
      <StyledView style={{ gap: spacing[3] }}>
        {childrenNames.map((childName) => (
          <StyledView key={childName}>
            <StyledText
              style={{
                ...textStyles.label,
                color: colors.foreground.DEFAULT,
                marginBottom: spacing[2],
              }}
            >
              {childName}
            </StyledText>
            <StyledView style={{ flexDirection: 'row', gap: spacing[2] }}>
              {(['eaten', 'partial', 'refused'] as const).map((response) => (
                <StyledView key={response} style={{ flex: 1 }}>
                  <ChildResponseButton
                    responseType={response}
                    onPress={() => handleChildResponseSelect(childName, response)}
                    style={{
                      opacity: selectedResponses[childName] === response ? 1 : 0.6,
                      borderWidth: selectedResponses[childName] === response ? 2 : 1,
                    }}
                  >
                    {response === 'eaten' ? '✅' : response === 'partial' ? '🟡' : '❌'}
                  </ChildResponseButton>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        ))}
      </StyledView>
    </StyledView>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <OnboardingStep
            emoji="👋"
            title={`Welcome to LittleMeals, ${userName}!`}
            description="Let's take a quick tour to show you how easy meal tracking can be with your family."
            primaryActionText="Let's Start"
            onPrimaryAction={handleNext}
            skipText="Skip Tutorial"
            onSkip={handleSkip}
            stepNumber={1}
            totalSteps={5}
            loading={loading}
          />
        );

      case 'meal_logging':
        return (
          <OnboardingStep
            emoji="🍽️"
            title="Log Meals in Seconds"
            description="Track what each child ate with just a few taps. Try selecting responses for your children below!"
            primaryActionText="That's Easy!"
            onPrimaryAction={handleNext}
            secondaryActionText="Back"
            onSecondaryAction={handlePrevious}
            skipText="Skip Tutorial"
            onSkip={handleSkip}
            stepNumber={2}
            totalSteps={5}
            loading={loading}
            demoContent={<MealLoggingDemo />}
          />
        );

      case 'family_sync':
        return (
          <OnboardingStep
            emoji="🔄"
            title="Real-Time Family Sync"
            description={`When you log a meal, everyone in ${familyName} sees it instantly. No more asking "Did Emma eat lunch?"`}
            primaryActionText="Love It!"
            onPrimaryAction={handleNext}
            secondaryActionText="Back"
            onSecondaryAction={handlePrevious}
            skipText="Skip Tutorial"
            onSkip={handleSkip}
            stepNumber={3}
            totalSteps={5}
            loading={loading}
          />
        );

      case 'ai_insights':
        return (
          <OnboardingStep
            emoji="🤖"
            title="AI-Powered Insights"
            description="Ask questions like 'When did Emma last eat broccoli?' or get pattern insights for your pediatrician."
            primaryActionText="Amazing!"
            onPrimaryAction={handleNext}
            secondaryActionText="Back"
            onSecondaryAction={handlePrevious}
            skipText="Skip Tutorial"
            onSkip={handleSkip}
            stepNumber={4}
            totalSteps={5}
            loading={loading}
          />
        );

      case 'ready':
        return (
          <OnboardingStep
            emoji="🎉"
            title="You're All Set!"
            description={`${familyName} is ready to start tracking meals together. Let's log your first meal!`}
            primaryActionText="Start Tracking Meals"
            onPrimaryAction={handleNext}
            secondaryActionText="Back"
            onSecondaryAction={handlePrevious}
            stepNumber={5}
            totalSteps={5}
            loading={loading}
          />
        );

      default:
        return null;
    }
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
        {renderStep()}
      </StyledSafeAreaView>
    </>
  );
};