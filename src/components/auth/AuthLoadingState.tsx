import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);

export type AuthLoadingType = 
  | 'signing_in'
  | 'creating_family'
  | 'joining_family'
  | 'accepting_invitation'
  | 'loading_profile'
  | 'syncing_data'
  | 'verifying_account';

export interface AuthLoadingStateProps {
  /**
   * Type of loading state
   */
  loadingType: AuthLoadingType;
  
  /**
   * Custom loading message (optional)
   */
  customMessage?: string;
  
  /**
   * Whether to show progress dots animation
   */
  showProgressDots?: boolean;
  
  /**
   * Progress percentage (0-100) for specific operations
   */
  progress?: number;
}

// Loading configurations
const loadingConfigs: Record<AuthLoadingType, {
  emoji: string;
  title: string;
  message: string;
  duration?: number; // Expected duration in ms for progress
}> = {
  signing_in: {
    emoji: '🔐',
    title: 'Signing you in',
    message: 'Please wait while we authenticate your account...',
    duration: 3000,
  },
  creating_family: {
    emoji: '👨‍👩‍👧‍👦',
    title: 'Creating your family',
    message: 'Setting up your family profile and meal tracking...',
    duration: 4000,
  },
  joining_family: {
    emoji: '🤝',
    title: 'Joining family',
    message: 'Adding you to the family and syncing data...',
    duration: 3500,
  },
  accepting_invitation: {
    emoji: '✅',
    title: 'Accepting invitation',
    message: 'Processing your family invitation...',
    duration: 2500,
  },
  loading_profile: {
    emoji: '👤',
    title: 'Loading your profile',
    message: 'Getting your family and children information...',
    duration: 2000,
  },
  syncing_data: {
    emoji: '🔄',
    title: 'Syncing data',
    message: 'Updating your meal data across all devices...',
    duration: 3000,
  },
  verifying_account: {
    emoji: '🔍',
    title: 'Verifying account',
    message: 'Checking your account details...',
    duration: 2500,
  },
};

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  loadingType,
  customMessage,
  showProgressDots = true,
  progress,
}) => {
  const config = loadingConfigs[loadingType];
  const message = customMessage || config.message;
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Pulse animation for emoji
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  // Progress animation
  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(progressAnim, {
        toValue: progress / 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (config.duration) {
      // Auto progress based on expected duration
      Animated.timing(progressAnim, {
        toValue: 0.9, // Never quite reach 100% for auto progress
        duration: config.duration,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, config.duration, progressAnim]);

  return (
    <StyledView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing[6],
        backgroundColor: colors.background.DEFAULT,
      }}
    >
      {/* Animated Emoji */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          marginBottom: spacing[6],
        }}
      >
        <StyledText style={{ fontSize: 64 }}>
          {config.emoji}
        </StyledText>
      </Animated.View>

      {/* Loading Title */}
      <StyledText
        style={{
          ...textStyles.h2,
          color: colors.foreground.DEFAULT,
          textAlign: 'center',
          marginBottom: spacing[3],
        }}
      >
        {config.title}
      </StyledText>

      {/* Loading Message */}
      <StyledText
        style={{
          ...textStyles.body,
          color: colors.foreground.muted,
          textAlign: 'center',
          marginBottom: spacing[6],
          lineHeight: 22,
          maxWidth: 280,
        }}
      >
        {message}
      </StyledText>

      {/* Progress Bar (if progress is specified) */}
      {(progress !== undefined || config.duration) && (
        <StyledView
          style={{
            width: '100%',
            maxWidth: 200,
            height: 4,
            backgroundColor: colors.background.muted,
            borderRadius: 2,
            marginBottom: spacing[4],
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: colors.primary.DEFAULT,
              borderRadius: 2,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </StyledView>
      )}

      {/* Activity Indicator */}
      <ActivityIndicator
        size="large"
        color={colors.primary.DEFAULT}
        style={{ marginBottom: spacing[4] }}
      />

      {/* Progress Dots */}
      {showProgressDots && (
        <ProgressDots />
      )}

      {/* Helper Text */}
      <StyledText
        style={{
          ...textStyles.caption,
          color: colors.foreground.light,
          textAlign: 'center',
          marginTop: spacing[4],
        }}
      >
        This may take a few moments...
      </StyledText>
    </StyledView>
  );
};

// Progress Dots Component
const ProgressDots: React.FC = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSequence = () => {
      const dotSequence = Animated.sequence([
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]);

      Animated.loop(dotSequence).start();
    };

    animateSequence();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <StyledView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
      }}
    >
      {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary.DEFAULT,
            opacity: anim,
          }}
        />
      ))}
    </StyledView>
  );
};