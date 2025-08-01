import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
export type CardSize = 'small' | 'medium' | 'large';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  pressable?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  style?: ViewStyle;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  pressable = false,
  onPress,
  fullWidth = false,
  style,
  className = '',
}) => {
  // Base card classes using NativeWind
  const cardClasses = `bg-background-card border border-border rounded-lg overflow-hidden ${
    variant === 'elevated' ? 'shadow-lg' : 
    variant === 'outlined' ? 'border-2' : 
    variant === 'flat' ? 'border-0' : ''
  } ${
    size === 'small' ? 'p-3' : 
    size === 'large' ? 'p-6' : 
    'p-4'
  } ${fullWidth ? 'w-full' : ''} ${className}`;

  if (pressable && onPress) {
    return (
      <StyledTouchableOpacity
        onPress={onPress}
        className={cardClasses}
        style={style}
      >
        {children}
      </StyledTouchableOpacity>
    );
  }

  return (
    <StyledView className={cardClasses} style={style}>
      {children}
    </StyledView>
  );
};

// Additional Card variants for convenience
export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="elevated" />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="outlined" />
);

export const FlatCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="flat" />
);

export const PressableCard: React.FC<Omit<CardProps, 'pressable'>> = (props) => (
  <Card {...props} pressable={true} />
);

export default Card;