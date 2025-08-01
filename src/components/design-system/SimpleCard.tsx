import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export interface SimpleCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({ 
  children, 
  onPress, 
  className = '' 
}) => {
  const baseClasses = "bg-background-card p-6 rounded-lg border border-border shadow-sm";
  const combinedClasses = `${baseClasses} ${className}`;

  if (onPress) {
    return (
      <StyledTouchableOpacity onPress={onPress} className={combinedClasses}>
        {children}
      </StyledTouchableOpacity>
    );
  }

  return (
    <StyledView className={combinedClasses}>
      {children}
    </StyledView>
  );
};

// Simple layout components
export const VStack: React.FC<{ children: React.ReactNode; space?: number; className?: string }> = ({ 
  children, 
  space = 4, 
  className = '' 
}) => (
  <StyledView className={`space-y-${space} ${className}`}>
    {children}
  </StyledView>
);

export const HStack: React.FC<{ children: React.ReactNode; space?: number; className?: string }> = ({ 
  children, 
  space = 4, 
  className = '' 
}) => (
  <StyledView className={`flex-row space-x-${space} ${className}`}>
    {children}
  </StyledView>
);

// Simple typography components
export const H1: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledText className={`text-3xl font-bold text-foreground ${className}`}>
    {children}
  </StyledText>
);

export const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledText className={`text-xl font-semibold text-foreground ${className}`}>
    {children}
  </StyledText>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledText className={`text-base text-foreground ${className}`}>
    {children}
  </StyledText>
);

export const Caption: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledText className={`text-sm text-foreground-muted ${className}`}>
    {children}
  </StyledText>
);

// Screen and Container components
export const Screen: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledView className={`flex-1 bg-background ${className}`}>
    {children}
  </StyledView>
);

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <StyledView className={`px-4 ${className}`}>
    {children}
  </StyledView>
);

// Input component
export const Input: React.FC<{
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ placeholder, value, onChangeText, multiline, numberOfLines, className = '', size = 'medium' }) => {
  const sizeClasses = size === 'large' ? 'py-4 px-4 text-lg' : size === 'small' ? 'py-2 px-3 text-sm' : 'py-3 px-4 text-base';
  
  return (
    <StyledTextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`bg-white border border-border rounded-lg text-foreground ${sizeClasses} ${className}`}
      placeholderTextColor="hsl(160, 6%, 50%)"
    />
  );
};

// Button components
export const Button: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ children, onPress, variant = 'secondary', size = 'medium', className = '' }) => {
  const baseClasses = 'rounded-lg items-center justify-center';
  const sizeClasses = size === 'large' ? 'py-4 px-6' : size === 'small' ? 'py-2 px-4' : 'py-3 px-5';
  const variantClasses = 
    variant === 'primary' ? 'bg-primary' : 
    variant === 'outline' ? 'border-2 border-primary bg-transparent' : 
    'bg-background-secondary border border-border';
  
  return (
    <StyledTouchableOpacity 
      onPress={onPress} 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </StyledTouchableOpacity>
  );
};

export const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ children, onPress, size = 'medium', className = '' }) => (
  <Button variant="primary" size={size} onPress={onPress} className={className}>
    {children}
  </Button>
);

export default SimpleCard;