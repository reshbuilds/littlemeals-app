import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing, dimensions, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export type InputVariant = 'default' | 'search' | 'autocomplete';
export type InputSize = 'small' | 'medium' | 'large';

export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  subtitle?: string;
}

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Input variant
   */
  variant?: InputVariant;
  
  /**
   * Input size
   */
  size?: InputSize;
  
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Input value
   */
  value?: string;
  
  /**
   * Value change handler
   */
  onChangeText?: (text: string) => void;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Required field indicator
   */
  required?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Full width input
   */
  fullWidth?: boolean;
  
  /**
   * Left icon/component
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon/component
   */
  rightIcon?: React.ReactNode;
  
  /**
   * For autocomplete variant - list of options
   */
  autocompleteOptions?: AutocompleteOption[];
  
  /**
   * For autocomplete - option selection handler
   */
  onAutocompleteSelect?: (option: AutocompleteOption) => void;
  
  /**
   * For autocomplete - maximum number of options to show
   */
  maxAutocompleteOptions?: number;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom input style
   */
  inputStyle?: ViewStyle;
  
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'medium',
  label,
  placeholder,
  value = '',
  onChangeText,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  autocompleteOptions = [],
  onAutocompleteSelect,
  maxAutocompleteOptions = 5,
  containerStyle,
  inputStyle,
  textStyle,
  testID,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Filter autocomplete options based on input value
  const filteredOptions = autocompleteOptions
    .filter(option => 
      option.label.toLowerCase().includes(value.toLowerCase()) ||
      option.value.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxAutocompleteOptions);

  // Container styles
  const getContainerStyles = (): ViewStyle => ({
    width: fullWidth ? '100%' : undefined,
  });

  // Input container styles
  const getInputContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.base,
      borderWidth: 1,
      paddingHorizontal: spacing[2],
      backgroundColor: disabled ? colors.background.muted : colors.background.card,
    };

    // Size-specific styles
    const sizeStyles: Record<InputSize, ViewStyle> = {
      small: {
        height: dimensions.inputSmall,
        paddingHorizontal: spacing[1.5],
      },
      medium: {
        height: dimensions.inputMedium,
        paddingHorizontal: spacing[2],
      },
      large: {
        height: dimensions.inputLarge,
        paddingHorizontal: spacing[3],
      },
    };

    // State-specific styles
    const stateStyles: ViewStyle = {
      borderColor: error 
        ? colors.error.DEFAULT
        : isFocused 
          ? colors.primary.DEFAULT
          : colors.border.DEFAULT,
    };

    // Variant-specific styles
    const variantStyles: Record<InputVariant, ViewStyle> = {
      default: {},
      search: {
        borderRadius: borderRadius.full,
      },
      autocomplete: {},
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...stateStyles,
      ...variantStyles[variant],
    };
  };

  // Input text styles
  const getInputTextStyles = (): TextStyle => {
    const baseTextStyle = textStyles.input;
    
    return {
      ...baseTextStyle,
      flex: 1,
      color: disabled ? colors.foreground.muted : colors.foreground.DEFAULT,
      paddingHorizontal: (leftIcon || rightIcon) ? spacing[1] : 0,
    };
  };

  // Label styles
  const getLabelStyles = (): TextStyle => ({
    ...textStyles.label,
    color: error ? colors.error.foreground : colors.foreground.DEFAULT,
    marginBottom: spacing[0.5],
  });

  // Helper/error text styles
  const getHelperTextStyles = (): TextStyle => ({
    ...textStyles.caption,
    color: error ? colors.error.foreground : colors.foreground.muted,
    marginTop: spacing[0.5],
  });

  const handleFocus = () => {
    setIsFocused(true);
    if (variant === 'autocomplete') {
      setShowAutocomplete(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding autocomplete to allow for option selection
    setTimeout(() => setShowAutocomplete(false), 150);
  };

  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    onAutocompleteSelect?.(option);
    onChangeText?.(option.value);
    setShowAutocomplete(false);
    Keyboard.dismiss();
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    if (variant === 'autocomplete') {
      setShowAutocomplete(text.length > 0 && filteredOptions.length > 0);
    }
  };

  return (
    <StyledView style={[getContainerStyles(), containerStyle]}>
      {/* Label */}
      {label && (
        <StyledText style={getLabelStyles()}>
          {label}
          {required && <StyledText style={{ color: colors.error.DEFAULT }}> *</StyledText>}
        </StyledText>
      )}

      {/* Input Container */}
      <StyledView style={[getInputContainerStyles(), inputStyle]}>
        {/* Left Icon */}
        {leftIcon && (
          <StyledView style={{ marginRight: spacing[1] }}>
            {leftIcon}
          </StyledView>
        )}

        {/* Text Input */}
        <StyledTextInput
          ref={inputRef}
          style={[getInputTextStyles(), textStyle]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.foreground.light}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          accessibilityLabel={label || placeholder}
          accessibilityHint={helperText || error}
          accessibilityState={{
            disabled,
            expanded: showAutocomplete,
          }}
          testID={testID}
          {...textInputProps}
        />

        {/* Right Icon */}
        {rightIcon && (
          <StyledView style={{ marginLeft: spacing[1] }}>
            {rightIcon}
          </StyledView>
        )}
      </StyledView>

      {/* Autocomplete Options */}
      {variant === 'autocomplete' && showAutocomplete && filteredOptions.length > 0 && (
        <StyledView
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.base,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            maxHeight: 200,
            zIndex: 1000,
            marginTop: spacing[0.5],
          }}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledTouchableOpacity
                style={{
                  padding: spacing[2],
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.light,
                }}
                onPress={() => handleAutocompleteSelect(item)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${item.label}`}
              >
                <StyledText style={textStyles.body}>
                  {item.label}
                </StyledText>
                {item.subtitle && (
                  <StyledText style={[textStyles.caption, { color: colors.foreground.muted }]}>
                    {item.subtitle}
                  </StyledText>
                )}
              </StyledTouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </StyledView>
      )}

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <StyledText style={getHelperTextStyles()}>
          {error || helperText}
        </StyledText>
      )}
    </StyledView>
  );
};

// Specialized input components for common use cases
export const SearchInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input {...props} variant="search" />
);

export const AutocompleteInput: React.FC<Omit<InputProps, 'variant'> & {
  autocompleteOptions: AutocompleteOption[];
  onAutocompleteSelect: (option: AutocompleteOption) => void;
}> = (props) => (
  <Input {...props} variant="autocomplete" />
);