import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';


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
      <TouchableOpacity onPress={onPress} className={combinedClasses}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={combinedClasses}>
      {children}
    </View>
  );
};

// Simple layout components
export const VStack: React.FC<{ children: React.ReactNode; space?: number; className?: string }> = ({ 
  children, 
  space = 4, 
  className = '' 
}) => (
  <View className={`space-y-${space} ${className}`}>
    {children}
  </View>
);

export const HStack: React.FC<{ children: React.ReactNode; space?: number; className?: string }> = ({ 
  children, 
  space = 4, 
  className = '' 
}) => (
  <View className={`flex-row space-x-${space} ${className}`}>
    {children}
  </View>
);

// Simple typography components
export const H1: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <Text className={`text-3xl font-bold text-foreground ${className}`}>
    {children}
  </Text>
);

export const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <Text className={`text-xl font-semibold text-foreground ${className}`}>
    {children}
  </Text>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <Text className={`text-base text-foreground ${className}`}>
    {children}
  </Text>
);

export const Caption: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <Text className={`text-sm text-foreground-muted ${className}`}>
    {children}
  </Text>
);

// Screen and Container components
export const Screen: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <View className={`flex-1 bg-background ${className}`}>
    {children}
  </View>
);

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <View className={`px-4 ${className}`}>
    {children}
  </View>
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
    <TextInput
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
    <TouchableOpacity 
      onPress={onPress} 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </TouchableOpacity>
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