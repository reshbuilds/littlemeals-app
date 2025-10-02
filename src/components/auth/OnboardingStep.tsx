import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export interface OnboardingStepProps {
  /**
   * Step emoji/icon
   */
  emoji: string;
  
  /**
   * Step title
   */
  title: string;
  
  /**
   * Step description
   */
  description: string;
  
  /**
   * Primary action text
   */
  primaryActionText: string;
  
  /**
   * Primary action handler
   */
  onPrimaryAction: () => void;
  
  /**
   * Secondary action text (optional)
   */
  secondaryActionText?: string;
  
  /**
   * Secondary action handler (optional)
   */
  onSecondaryAction?: () => void;
  
  /**
   * Skip action text (optional)
   */
  skipText?: string;
  
  /**
   * Skip handler (optional)
   */
  onSkip?: () => void;
  
  /**
   * Current step number
   */
  stepNumber: number;
  
  /**
   * Total number of steps
   */
  totalSteps: number;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Additional demo content (optional)
   */
  demoContent?: React.ReactNode;
  
  /**
   * Landscape orientation state
   */
  isLandscape?: boolean;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  emoji,
  title,
  description,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  skipText,
  onSkip,
  stepNumber,
  totalSteps,
  loading = false,
  demoContent,
  isLandscape = false,
}) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: isLandscape ? spacing[6] : spacing[4] }}>
      {/* Progress Indicator */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: isLandscape ? spacing[2] : spacing[4],
          marginBottom: isLandscape ? spacing[4] : spacing[8],
        }}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index < stepNumber 
                ? colors.primary.DEFAULT 
                : colors.background.muted,
              marginHorizontal: spacing[1],
            }}
          />
        ))}
      </View>

      {isLandscape ? (
        // Landscape Layout: Side-by-side
        <View 
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[6],
          }}
        >
          {/* Left Side: Content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Emoji/Icon */}
            <Text 
              style={{ 
                fontSize: 60, 
                marginBottom: spacing[4],
                textAlign: 'center',
              }}
            >
              {emoji}
            </Text>

            {/* Title */}
            <Text
              style={{
                ...textStyles.h2,
                color: colors.foreground.DEFAULT,
                textAlign: 'center',
                marginBottom: spacing[3],
              }}
            >
              {title}
            </Text>

            {/* Description */}
            <Text
              style={{
                ...textStyles.body,
                color: colors.foreground.muted,
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: demoContent ? spacing[4] : 0,
                maxWidth: 400,
              }}
            >
              {description}
            </Text>
          </View>

          {/* Right Side: Demo Content or Actions */}
          <View style={{ flex: 1 }}>
            {/* Demo Content */}
            {demoContent && (
              <View style={{ marginBottom: spacing[4], width: '100%' }}>
                {demoContent}
              </View>
            )}

            {/* Action Buttons - Landscape */}
            <View style={{ gap: spacing[2] }}>
              {/* Primary Action */}
              <PrimaryButton
                onPress={onPrimaryAction}
                loading={loading}
                disabled={loading}
                fullWidth
                size="medium"
                testID={`onboarding-primary-${stepNumber}`}
              >
                {primaryActionText}
              </PrimaryButton>

              {/* Secondary Action */}
              {secondaryActionText && onSecondaryAction && (
                <SecondaryButton
                  onPress={onSecondaryAction}
                  disabled={loading}
                  fullWidth
                  size="medium"
                  testID={`onboarding-secondary-${stepNumber}`}
                >
                  {secondaryActionText}
                </SecondaryButton>
              )}

              {/* Skip Option */}
              {skipText && onSkip && (
                <TouchableOpacity
                  onPress={onSkip}
                  disabled={loading}
                  style={{
                    alignItems: 'center',
                    paddingVertical: spacing[2],
                    marginTop: spacing[1],
                  }}
                  accessibilityLabel={skipText}
                  accessibilityRole="button"
                >
                  <Text
                    style={{
                      ...textStyles.bodySmall,
                      color: colors.foreground.muted,
                    }}
                  >
                    {skipText}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Step Counter */}
              <Text
                style={{
                  ...textStyles.caption,
                  color: colors.foreground.light,
                  textAlign: 'center',
                  marginTop: spacing[1],
                }}
              >
                {stepNumber} of {totalSteps}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // Portrait Layout: Original vertical layout
        <>
          {/* Main Content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Emoji/Icon */}
            <Text 
              style={{ 
                fontSize: 80, 
                marginBottom: spacing[6],
                textAlign: 'center',
              }}
            >
              {emoji}
            </Text>

            {/* Title */}
            <Text
              style={{
                ...textStyles.h1,
                color: colors.foreground.DEFAULT,
                textAlign: 'center',
                marginBottom: spacing[4],
              }}
            >
              {title}
            </Text>

            {/* Description */}
            <Text
              style={{
                ...textStyles.bodyLarge,
                color: colors.foreground.muted,
                textAlign: 'center',
                lineHeight: 26,
                marginBottom: spacing[8],
                maxWidth: 320,
              }}
            >
              {description}
            </Text>

            {/* Demo Content */}
            {demoContent && (
              <View style={{ marginBottom: spacing[8], width: '100%' }}>
                {demoContent}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={{ paddingBottom: spacing[6] }}>
            {/* Primary Action */}
            <PrimaryButton
              onPress={onPrimaryAction}
              loading={loading}
              disabled={loading}
              fullWidth
              size="large"
              testID={`onboarding-primary-${stepNumber}`}
            >
              {primaryActionText}
            </PrimaryButton>

            {/* Secondary Action */}
            {secondaryActionText && onSecondaryAction && (
              <View style={{ marginTop: spacing[3] }}>
                <SecondaryButton
                  onPress={onSecondaryAction}
                  disabled={loading}
                  fullWidth
                  size="large"
                  testID={`onboarding-secondary-${stepNumber}`}
                >
                  {secondaryActionText}
                </SecondaryButton>
              </View>
            )}

            {/* Skip Option */}
            {skipText && onSkip && (
              <TouchableOpacity
                onPress={onSkip}
                disabled={loading}
                style={{
                  alignItems: 'center',
                  paddingVertical: spacing[3],
                  marginTop: spacing[2],
                }}
                accessibilityLabel={skipText}
                accessibilityRole="button"
              >
                <Text
                  style={{
                    ...textStyles.body,
                    color: colors.foreground.muted,
                  }}
                >
                  {skipText}
                </Text>
              </TouchableOpacity>
            )}

            {/* Step Counter */}
            <Text
              style={{
                ...textStyles.caption,
                color: colors.foreground.light,
                textAlign: 'center',
                marginTop: spacing[2],
              }}
            >
              {stepNumber} of {totalSteps}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};