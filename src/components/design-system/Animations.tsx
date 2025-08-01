/**
 * LittleMeals Design System - Animation Components
 * 
 * Smooth, accessible animations for enhanced user experience:
 * - FadeIn/FadeOut: Opacity transitions
 * - SlideIn/SlideOut: Position-based transitions  
 * - ScaleIn/ScaleOut: Scale-based transitions
 * - RotateIn/RotateOut: Rotation animations
 * - Bounce: Playful bounce animation
 * - Pulse: Attention-grabbing pulse effect
 * - Shimmer: Loading state animation
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Easing, 
  ViewStyle, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import { Box, type BoxProps } from './Utilities';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Animation timing configurations
export const animationTiming = {
  fast: 200,
  normal: 300,
  slow: 500,
  extraSlow: 800,
} as const;

export const animationEasing = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.quad),
  easeOut: Easing.out(Easing.quad),
  easeInOut: Easing.inOut(Easing.quad),
  spring: Easing.elastic(1),
  bounce: Easing.bounce,
} as const;

// Base Animation Props
interface BaseAnimationProps extends BoxProps {
  children: React.ReactNode;
  visible?: boolean;
  duration?: keyof typeof animationTiming | number;
  easing?: keyof typeof animationEasing;
  delay?: number;
  loop?: boolean;
  autoPlay?: boolean;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

// Fade Animation Props
export interface FadeProps extends BaseAnimationProps {
  from?: number;
  to?: number;
}

// Slide Animation Props
export interface SlideProps extends BaseAnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

// Scale Animation Props
export interface ScaleProps extends BaseAnimationProps {
  from?: number;
  to?: number;
}

// Rotate Animation Props
export interface RotateProps extends BaseAnimationProps {
  from?: string;
  to?: string;
  clockwise?: boolean;
}

// Bounce Animation Props
export interface BounceProps extends BaseAnimationProps {
  intensity?: 'subtle' | 'normal' | 'strong';
}

// Pulse Animation Props
export interface PulseProps extends BaseAnimationProps {
  minOpacity?: number;
  maxOpacity?: number;
  scale?: boolean;
}

// Shimmer Animation Props
export interface ShimmerProps extends BoxProps {
  children?: React.ReactNode;
  colors?: string[];
  speed?: keyof typeof animationTiming | number;
  angle?: number;
}

/**
 * Get animation duration value
 */
const getDuration = (duration: keyof typeof animationTiming | number | undefined): number => {
  if (typeof duration === 'number') return duration;
  if (duration && animationTiming[duration]) return animationTiming[duration];
  return animationTiming.normal;
};

/**
 * Get easing function
 */
const getEasing = (easing: keyof typeof animationEasing | undefined) => {
  if (easing && animationEasing[easing]) return animationEasing[easing];
  return animationEasing.easeOut;
};

/**
 * FadeIn Component
 * Smooth opacity transition from transparent to opaque
 */
export const FadeIn: React.FC<FadeProps> = ({
  children,
  visible = true,
  from = 0,
  to = 1,
  duration = 'normal',
  easing = 'easeOut',
  delay = 0,
  loop = false,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const fadeAnim = useRef(new Animated.Value(from)).current;

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.timing(fadeAnim, {
      toValue: visible ? to : from,
      duration: getDuration(duration),
      easing: getEasing(easing),
      delay,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [visible, autoPlay]);

  return (
    <Box {...boxProps}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * SlideIn Component
 * Position-based slide transitions from any direction
 */
export const SlideIn: React.FC<SlideProps> = ({
  children,
  visible = true,
  direction = 'up',
  distance = 50,
  duration = 'normal',
  easing = 'easeOut',
  delay = 0,
  loop = false,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  const getInitialValue = () => {
    switch (direction) {
      case 'up': return distance;
      case 'down': return -distance;
      case 'left': return distance;
      case 'right': return -distance;
      default: return distance;
    }
  };

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.timing(slideAnim, {
      toValue: visible ? 0 : getInitialValue(),
      duration: getDuration(duration),
      easing: getEasing(easing),
      delay,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    slideAnim.setValue(getInitialValue());
    if (autoPlay) {
      startAnimation();
    }
  }, [visible, autoPlay, direction]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return [{ translateY: slideAnim }];
      case 'left':
      case 'right':
        return [{ translateX: slideAnim }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Box {...boxProps}>
      <Animated.View style={{ transform: getTransform() }}>
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * ScaleIn Component
 * Scale-based transitions for dramatic entrances
 */
export const ScaleIn: React.FC<ScaleProps> = ({
  children,
  visible = true,
  from = 0,
  to = 1,
  duration = 'normal',
  easing = 'easeOut',
  delay = 0,
  loop = false,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.timing(scaleAnim, {
      toValue: visible ? to : from,
      duration: getDuration(duration),
      easing: getEasing(easing),
      delay,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [visible, autoPlay]);

  return (
    <Box {...boxProps}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * RotateIn Component
 * Rotation-based animations
 */
export const RotateIn: React.FC<RotateProps> = ({
  children,
  visible = true,
  from = '0deg',
  to = '360deg',
  clockwise = true,
  duration = 'normal',
  easing = 'linear',
  delay = 0,
  loop = false,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.timing(rotateAnim, {
      toValue: visible ? 1 : 0,
      duration: getDuration(duration),
      easing: getEasing(easing),
      delay,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [visible, autoPlay]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [from, to],
  });

  return (
    <Box {...boxProps}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * Bounce Component
 * Playful bounce animation for attention-grabbing elements
 */
export const Bounce: React.FC<BounceProps> = ({
  children,
  visible = true,
  intensity = 'normal',
  duration = 'normal',
  delay = 0,
  loop = false,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const getIntensityScale = () => {
    switch (intensity) {
      case 'subtle': return 0.05;
      case 'normal': return 0.1;
      case 'strong': return 0.2;
      default: return 0.1;
    }
  };

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: getDuration(duration) / 4,
        easing: animationEasing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: -0.5,
        duration: getDuration(duration) / 4,
        easing: animationEasing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0.3,
        duration: getDuration(duration) / 4,
        easing: animationEasing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: getDuration(duration) / 4,
        easing: animationEasing.easeOut,
        useNativeDriver: true,
      }),
    ]);

    if (loop) {
      Animated.loop(animation, { iterations: -1 }).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    if (autoPlay && visible) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoPlay]);

  const scale = bounceAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1 - getIntensityScale(), 1, 1 + getIntensityScale()],
  });

  return (
    <Box {...boxProps}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * Pulse Component
 * Attention-grabbing pulse effect with opacity and optional scale
 */
export const Pulse: React.FC<PulseProps> = ({
  children,
  visible = true,
  minOpacity = 0.5,
  maxOpacity = 1,
  scale = false,
  duration = 'normal',
  delay = 0,
  loop = true,
  autoPlay = true,
  onAnimationStart,
  onAnimationEnd,
  ...boxProps
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    onAnimationStart?.();
    
    const animation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: getDuration(duration) / 2,
        easing: animationEasing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: getDuration(duration) / 2,
        easing: animationEasing.easeInOut,
        useNativeDriver: true,
      }),
    ]);

    if (loop) {
      Animated.loop(animation, { iterations: -1 }).start(onAnimationEnd);
    } else {
      animation.start(onAnimationEnd);
    }
  };

  useEffect(() => {
    if (autoPlay && visible) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoPlay]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity],
  });

  const scaleValue = scale ? pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  }) : 1;

  return (
    <Box {...boxProps}>
      <Animated.View 
        style={{ 
          opacity,
          transform: scale ? [{ scale: scaleValue }] : undefined,
        }}
      >
        {children}
      </Animated.View>
    </Box>
  );
};

/**
 * Shimmer Component
 * Loading state animation with gradient shimmer effect
 */
export const Shimmer: React.FC<ShimmerProps> = ({
  children,
  colors = ['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)'],
  speed = 'normal',
  angle = 45,
  className = '',
  ...boxProps
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: getDuration(speed),
        easing: animationEasing.linear,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    animation.start();

    return () => animation.stop();
  }, [speed]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerClassName = `
    overflow-hidden
    ${className}
  `.trim();

  return (
    <Box {...boxProps} className={shimmerClassName}>
      {children}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <Box
          className="w-full h-full"
          style={{
            background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          }}
        />
      </Animated.View>
    </Box>
  );
};

/**
 * Layout Animation Utilities
 * Smooth automatic layout transitions
 */
export const layoutAnimations = {
  easeInEaseOut: LayoutAnimation.Presets.easeInEaseOut,
  linear: LayoutAnimation.Presets.linear,
  spring: LayoutAnimation.Presets.spring,
  
  custom: (duration: number) => ({
    duration,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  }),
};

/**
 * Animated Layout Component
 * Automatically animates layout changes
 */
export interface AnimatedLayoutProps extends BoxProps {
  children: React.ReactNode;
  animation?: keyof typeof layoutAnimations | 'custom';
  duration?: number;
}

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({
  children,
  animation = 'easeInEaseOut',
  duration = 300,
  ...boxProps
}) => {
  useEffect(() => {
    if (animation === 'custom') {
      LayoutAnimation.configureNext(layoutAnimations.custom(duration));
    } else {
      LayoutAnimation.configureNext(layoutAnimations[animation]);
    }
  });

  return <Box {...boxProps}>{children}</Box>;
};

/**
 * Stagger Animation Hook
 * Creates staggered animations for lists of items
 */
export const useStaggerAnimation = (
  itemCount: number,
  delay: number = 100,
  duration: number = 300
) => {
  const animations = useRef<Animated.Value[]>([]).current;

  // Initialize animations array
  useEffect(() => {
    animations.length = 0;
    for (let i = 0; i < itemCount; i++) {
      animations.push(new Animated.Value(0));
    }
  }, [itemCount]);

  const startStagger = () => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: index * delay,
        easing: animationEasing.easeOut,
        useNativeDriver: true,
      })
    );

    Animated.parallel(staggeredAnimations).start();
  };

  const resetStagger = () => {
    animations.forEach(anim => anim.setValue(0));
  };

  return {
    animations,
    startStagger,
    resetStagger,
  };
};