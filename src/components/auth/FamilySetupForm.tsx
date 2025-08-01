import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export interface FamilySetupFormProps {
  /**
   * Callback when family is created successfully
   */
  onFamilyCreated?: (familyData: { familyName: string; childrenNames: string[] }) => void;
  
  /**
   * Callback when user wants to join existing family instead
   */
  onJoinExistingFamily?: () => void;
  
  /**
   * Loading state
   */
  loading?: boolean;
}

export const FamilySetupForm: React.FC<FamilySetupFormProps> = ({
  onFamilyCreated,
  onJoinExistingFamily,
  loading = false,
}) => {
  const [familyName, setFamilyName] = useState('');
  const [childrenNames, setChildrenNames] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{ familyName?: string; children?: string }>({});

  // Add a new child name input
  const addChildInput = () => {
    if (childrenNames.length < 6) { // Reasonable limit for UI
      setChildrenNames([...childrenNames, '']);
    }
  };

  // Remove a child name input
  const removeChildInput = (index: number) => {
    if (childrenNames.length > 1) {
      const newNames = childrenNames.filter((_, i) => i !== index);
      setChildrenNames(newNames);
    }
  };

  // Update child name at specific index
  const updateChildName = (index: number, name: string) => {
    const newNames = [...childrenNames];
    newNames[index] = name;
    setChildrenNames(newNames);
    
    // Clear errors when user starts typing
    if (errors.children && name.trim()) {
      setErrors(prev => ({ ...prev, children: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { familyName?: string; children?: string } = {};

    if (!familyName.trim()) {
      newErrors.familyName = 'Family name is required';
    }

    const validChildrenNames = childrenNames.filter(name => name.trim());
    if (validChildrenNames.length === 0) {
      newErrors.children = 'At least one child name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const validChildrenNames = childrenNames
      .map(name => name.trim())
      .filter(name => name);

    onFamilyCreated?.({
      familyName: familyName.trim(),
      childrenNames: validChildrenNames,
    });
  };

  return (
    <StyledView style={{ flex: 1, paddingHorizontal: spacing[4] }}>
      {/* Header */}
      <StyledView style={{ marginBottom: spacing[6] }}>
        <StyledText
          style={{
            ...textStyles.h2,
            color: colors.foreground.DEFAULT,
            textAlign: 'center',
            marginBottom: spacing[2],
          }}
        >
          Set up your family
        </StyledText>
        <StyledText
          style={{
            ...textStyles.body,
            color: colors.foreground.muted,
            textAlign: 'center',
          }}
        >
          Tell us about your family so we can personalize your meal tracking experience
        </StyledText>
      </StyledView>

      {/* Family Name Input */}
      <StyledView style={{ marginBottom: spacing[5] }}>
        <StyledText
          style={{
            ...textStyles.label,
            color: colors.foreground.DEFAULT,
            marginBottom: spacing[2],
          }}
        >
          Family Name
        </StyledText>
        <StyledTextInput
          value={familyName}
          onChangeText={(text) => {
            setFamilyName(text);
            if (errors.familyName && text.trim()) {
              setErrors(prev => ({ ...prev, familyName: undefined }));
            }
          }}
          placeholder="The Smith Family"
          placeholderTextColor={colors.foreground.light}
          style={{
            ...textStyles.input,
            height: 50,
            paddingHorizontal: spacing[3],
            borderWidth: 1,
            borderColor: errors.familyName ? colors.error.DEFAULT : colors.border.DEFAULT,
            borderRadius: borderRadius.base,
            backgroundColor: colors.background.card,
            color: colors.foreground.DEFAULT,
          }}
          accessibilityLabel="Enter your family name"
          accessibilityHint="This will be used to identify your family"
          testID="family-name-input"
        />
        {errors.familyName && (
          <StyledText
            style={{
              ...textStyles.caption,
              color: colors.error.DEFAULT,
              marginTop: spacing[1],
            }}
          >
            {errors.familyName}
          </StyledText>
        )}
      </StyledView>

      {/* Children Names Section */}
      <StyledView style={{ marginBottom: spacing[6] }}>
        <StyledView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing[3],
          }}
        >
          <StyledText
            style={{
              ...textStyles.label,
              color: colors.foreground.DEFAULT,
            }}
          >
            Children's Names
          </StyledText>
          {childrenNames.length < 6 && (
            <StyledTouchableOpacity
              onPress={addChildInput}
              style={{
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
              }}
              accessibilityLabel="Add another child"
              accessibilityRole="button"
            >
              <StyledText
                style={{
                  ...textStyles.buttonSmall,
                  color: colors.primary.DEFAULT,
                }}
              >
                + Add Child
              </StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>

        {/* Child Name Inputs */}
        <StyledView style={{ gap: spacing[3] }}>
          {childrenNames.map((name, index) => (
            <StyledView
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <StyledTextInput
                value={name}
                onChangeText={(text) => updateChildName(index, text)}
                placeholder={`Child ${index + 1} name`}
                placeholderTextColor={colors.foreground.light}
                style={{
                  ...textStyles.input,
                  flex: 1,
                  height: 50,
                  paddingHorizontal: spacing[3],
                  borderWidth: 1,
                  borderColor: errors.children ? colors.error.DEFAULT : colors.border.DEFAULT,
                  borderRadius: borderRadius.base,
                  backgroundColor: colors.background.card,
                  color: colors.foreground.DEFAULT,
                }}
                accessibilityLabel={`Enter name for child ${index + 1}`}
                testID={`child-name-input-${index}`}
              />
              {childrenNames.length > 1 && (
                <StyledTouchableOpacity
                  onPress={() => removeChildInput(index)}
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  accessibilityLabel="Remove this child"
                  accessibilityRole="button"
                >
                  <StyledText
                    style={{
                      fontSize: 20,
                      color: colors.error.DEFAULT,
                    }}
                  >
                    ×
                  </StyledText>
                </StyledTouchableOpacity>
              )}
            </StyledView>
          ))}
        </StyledView>

        {errors.children && (
          <StyledText
            style={{
              ...textStyles.caption,
              color: colors.error.DEFAULT,
              marginTop: spacing[2],
            }}
          >
            {errors.children}
          </StyledText>
        )}
      </StyledView>

      {/* Action Buttons */}
      <StyledView style={{ gap: spacing[3], marginTop: 'auto', paddingBottom: spacing[4] }}>
        <PrimaryButton
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth
          size="large"
          testID="create-family-button"
        >
          Create My Family
        </PrimaryButton>

        <SecondaryButton
          onPress={onJoinExistingFamily}
          disabled={loading}
          fullWidth
          size="large"
          testID="join-family-button"
        >
          Join Existing Family Instead
        </SecondaryButton>
      </StyledView>
    </StyledView>
  );
};