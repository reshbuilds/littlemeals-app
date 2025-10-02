/**
 * LittleMeals Design System - Feedback Components
 * 
 * Interactive feedback components for user interaction states:
 * - LoadingSpinner: Animated loading indicator
 * - LoadingOverlay: Full-screen loading state
 * - MessageAlert: Success/Error/Warning/Info messages
 * - ProgressIndicator: Step-by-step progress tracking
 * - Toast: Non-intrusive feedback messages
 */

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  Easing, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors, semanticColors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';


// Loading Spinner Props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  style?: ViewStyle;
}

// Loading Overlay Props
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  className?: string;
  style?: ViewStyle;
}

// Message Alert Props
export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface MessageAlertProps {
  type: MessageType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  className?: string;
  style?: ViewStyle;
}

// Progress Indicator Props
export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
  style?: ViewStyle;
}

// Toast Props
export interface ToastProps {
  visible: boolean;
  type: MessageType;
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onHide?: () => void;
  className?: string;
  style?: ViewStyle;
}

/**
 * Loading Spinner Component
 * Animated loading indicator for async operations
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = semanticColors.interactive,
  className = '',
  style,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    spin();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  };

  return (
    <View className={`items-center justify-center ${className}`} style={style}>
      <ActivityIndicator size={size === 'small' ? 'small' : 'large'} color={color} />
    </View>
  );
};

/**
 * Loading Overlay Component
 * Full-screen loading state with optional message
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  size = 'large',
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  className = '',
  style,
}) => {
  if (!visible) return null;

  return (
    <View
      className={`absolute inset-0 items-center justify-center z-50 ${className}`}
      style={[{ backgroundColor }, style]}
    >
      <View className="bg-background-card p-6 rounded-lg items-center shadow-lg">
        <LoadingSpinner size={size} />
        {message && (
          <Text className="text-foreground-DEFAULT text-base mt-4 text-center">
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Message Alert Component
 * Contextual feedback messages with different severity levels
 */
export const MessageAlert: React.FC<MessageAlertProps> = ({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  style,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-success-light border-success-DEFAULT',
          icon: '✅',
          titleColor: 'text-success-foreground',
          messageColor: 'text-success-foreground',
        };
      case 'error':
        return {
          container: 'bg-error-light border-error-DEFAULT',
          icon: '❌',
          titleColor: 'text-error-foreground',
          messageColor: 'text-error-foreground',
        };
      case 'warning':
        return {
          container: 'bg-warning-light border-warning-DEFAULT',
          icon: '⚠️',
          titleColor: 'text-warning-foreground',
          messageColor: 'text-warning-foreground',
        };
      case 'info':
        return {
          container: 'bg-primary-light border-primary-DEFAULT',
          icon: 'ℹ️',
          titleColor: 'text-primary-DEFAULT',
          messageColor: 'text-foreground-DEFAULT',
        };
      default:
        return {
          container: 'bg-background-secondary border-border-DEFAULT',
          icon: 'ℹ️',
          titleColor: 'text-foreground-DEFAULT',
          messageColor: 'text-foreground-muted',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <View
      className={`border-l-4 p-4 rounded-r-lg ${styles.container} ${className}`}
      style={style}
    >
      <View className="flex-row items-start">
        <Text className="text-lg mr-3">{styles.icon}</Text>
        
        <View className="flex-1">
          {title && (
            <Text className={`font-semibold text-base mb-1 ${styles.titleColor}`}>
              {title}
            </Text>
          )}
          <Text className={`text-sm leading-5 ${styles.messageColor}`}>
            {message}
          </Text>
          
          {action && (
            <TouchableOpacity
              onPress={action.onPress}
              className="mt-3 py-2 px-4 bg-primary-DEFAULT rounded-md self-start"
            >
              <Text className="text-primary-foreground font-medium text-sm">
                {action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {dismissible && onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            className="ml-3 p-1"
          >
            <Text className="text-foreground-muted text-lg">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Progress Indicator Component
 * Visual progress tracking for multi-step processes
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  showLabels = true,
  className = '',
  style,
}) => {
  const isHorizontal = orientation === 'horizontal';

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success-DEFAULT border-success-DEFAULT',
          text: 'text-success-foreground',
          connector: 'bg-success-DEFAULT',
        };
      case 'current':
        return {
          circle: 'bg-primary-DEFAULT border-primary-DEFAULT',
          text: 'text-primary-DEFAULT',
          connector: 'bg-border-DEFAULT',
        };
      case 'upcoming':
        return {
          circle: 'bg-background-muted border-border-DEFAULT',
          text: 'text-foreground-muted',
          connector: 'bg-border-DEFAULT',
        };
      default:
        return {
          circle: 'bg-background-muted border-border-DEFAULT',
          text: 'text-foreground-muted',
          connector: 'bg-border-DEFAULT',
        };
    }
  };

  return (
    <View
      className={`${isHorizontal ? 'flex-row items-center' : 'flex-col'} ${className}`}
      style={style}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const stepStyles = getStepStyles(status);
        const isLast = index === steps.length - 1;

        return (
          <View
            key={step.id}
            className={`${isHorizontal ? 'flex-row items-center' : 'flex-col items-start'} ${
              isLast ? '' : 'flex-1'
            }`}
          >
            {/* Step Circle */}
            <View
              className={`
                w-8 h-8 rounded-full border-2 items-center justify-center
                ${stepStyles.circle}
              `}
            >
              {status === 'completed' ? (
                <Text className="text-white text-sm font-bold">✓</Text>
              ) : (
                <Text className={`text-sm font-medium ${stepStyles.text}`}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Step Label */}
            {showLabels && (
              <View className={`${isHorizontal ? 'ml-2' : 'mt-2'} flex-1`}>
                <Text className={`font-medium text-sm ${stepStyles.text}`}>
                  {step.label}
                </Text>
                {step.description && (
                  <Text className="text-foreground-muted text-xs mt-1">
                    {step.description}
                  </Text>
                )}
              </View>
            )}

            {/* Connector Line */}
            {!isLast && (
              <View
                className={`
                  ${isHorizontal ? 'h-0.5 flex-1 mx-4' : 'w-0.5 h-6 ml-4 mt-2'}
                  ${stepStyles.connector}
                `}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

/**
 * Toast Component
 * Non-intrusive temporary feedback messages
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  type,
  message,
  duration = 3000,
  position = 'bottom',
  onHide,
  className = '',
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(position === 'bottom' ? 100 : -100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'bottom' ? 100 : -100,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-success-DEFAULT', text: 'text-white', icon: '✅' };
      case 'error':
        return { bg: 'bg-error-DEFAULT', text: 'text-white', icon: '❌' };
      case 'warning':
        return { bg: 'bg-warning-DEFAULT', text: 'text-warning-foreground', icon: '⚠️' };
      case 'info':
        return { bg: 'bg-primary-DEFAULT', text: 'text-primary-foreground', icon: 'ℹ️' };
      default:
        return { bg: 'bg-foreground-DEFAULT', text: 'text-background-DEFAULT', icon: 'ℹ️' };
    }
  };

  const typeStyles = getTypeStyles();

  if (!visible) return null;

  return (
    <Animated.View
      className={`
        absolute left-4 right-4 z-50
        ${position === 'bottom' ? 'bottom-20' : 'top-20'}
        ${className}
      `}
      style={[
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <View
        className={`
          ${typeStyles.bg} px-4 py-3 rounded-lg shadow-lg
          flex-row items-center
        `}
      >
        <Text className="text-lg mr-3">{typeStyles.icon}</Text>
        <Text className={`${typeStyles.text} text-sm font-medium flex-1`}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

/**
 * Skeleton Loader Component
 * Placeholder content while data is loading
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  className = '',
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    shimmer();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={`bg-background-muted ${className}`}
      style={[
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};