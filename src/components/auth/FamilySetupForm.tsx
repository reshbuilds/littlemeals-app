import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


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
  
  /**
   * Landscape orientation state
   */
  isLandscape?: boolean;
}

export const FamilySetupForm: React.FC<FamilySetupFormProps> = ({
  onFamilyCreated,
  onJoinExistingFamily,
  loading = false,
  isLandscape = false,
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
    <View style={{ flex: 1, paddingHorizontal: isLandscape ? spacing[2] : spacing[4] }}>
      {/* Header */}
      <View style={{ marginBottom: isLandscape ? spacing[4] : spacing[6] }}>
        <Text
          style={{
            ...(isLandscape ? textStyles.h3 : textStyles.h2),
            color: colors.foreground.DEFAULT,
            textAlign: 'center',
            marginBottom: isLandscape ? spacing[1] : spacing[2],
          }}
        >
          Set up your family
        </Text>
        <Text
          style={{
            ...(isLandscape ? textStyles.bodySmall : textStyles.body),
            color: colors.foreground.muted,
            textAlign: 'center',
            maxWidth: isLandscape ? 600 : undefined,
            alignSelf: 'center',
          }}
        >
          Tell us about your family so we can personalize your meal tracking experience
        </Text>
      </View>

      {/* Form Content - Use landscape layout if needed */}
      {isLandscape ? (
        <View 
          style={{
            flexDirection: 'row',
            gap: spacing[4],
            flex: 1,
          }}
        >
          {/* Left Column - Family Name */}
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: spacing[4] }}>
              <Text
                style={{
                  ...textStyles.label,
                  color: colors.foreground.DEFAULT,
                  marginBottom: spacing[2],
                }}
              >
                Family Name
              </Text>
              <TextInput
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
                  height: 44,
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
                <Text
                  style={{
                    ...textStyles.caption,
                    color: colors.error.DEFAULT,
                    marginTop: spacing[1],
                  }}
                >
                  {errors.familyName}
                </Text>
              )}
            </View>
          </View>

          {/* Right Column - Children Names */}
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: spacing[4] }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing[2],
                }}
              >
                <Text
                  style={{
                    ...textStyles.label,
                    color: colors.foreground.DEFAULT,
                  }}
                >
                  Children's Names
                </Text>
                {childrenNames.length < 6 && (
                  <TouchableOpacity
                    onPress={addChildInput}
                    style={{
                      paddingHorizontal: spacing[2],
                      paddingVertical: spacing[1],
                    }}
                    accessibilityLabel="Add another child"
                    accessibilityRole="button"
                  >
                    <Text
                      style={{
                        ...textStyles.buttonSmall,
                        color: colors.primary.DEFAULT,
                      }}
                    >
                      + Add Child
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Child Name Inputs - Compact for landscape */}
              <View style={{ gap: spacing[2] }}>
                {childrenNames.map((name, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                    }}
                  >
                    <TextInput
                      value={name}
                      onChangeText={(text) => updateChildName(index, text)}
                      placeholder={`Child ${index + 1} name`}
                      placeholderTextColor={colors.foreground.light}
                      style={{
                        ...textStyles.input,
                        flex: 1,
                        height: 40,
                        paddingHorizontal: spacing[2],
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
                      <TouchableOpacity
                        onPress={() => removeChildInput(index)}
                        style={{
                          width: 32,
                          height: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        accessibilityLabel="Remove this child"
                        accessibilityRole="button"
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: colors.error.DEFAULT,
                          }}
                        >
                          ×
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              {errors.children && (
                <Text
                  style={{
                    ...textStyles.caption,
                    color: colors.error.DEFAULT,
                    marginTop: spacing[2],
                  }}
                >
                  {errors.children}
                </Text>
              )}
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Portrait Layout - Original */}
          {/* Family Name Input */}
          <View style={{ marginBottom: spacing[5] }}>
            <Text
              style={{
                ...textStyles.label,
                color: colors.foreground.DEFAULT,
                marginBottom: spacing[2],
              }}
            >
              Family Name
            </Text>
            <TextInput
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
              <Text
                style={{
                  ...textStyles.caption,
                  color: colors.error.DEFAULT,
                  marginTop: spacing[1],
                }}
              >
                {errors.familyName}
              </Text>
            )}
          </View>

          {/* Children Names Section */}
          <View style={{ marginBottom: spacing[6] }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing[3],
              }}
            >
              <Text
                style={{
                  ...textStyles.label,
                  color: colors.foreground.DEFAULT,
                }}
              >
                Children's Names
              </Text>
              {childrenNames.length < 6 && (
                <TouchableOpacity
                  onPress={addChildInput}
                  style={{
                    paddingHorizontal: spacing[2],
                    paddingVertical: spacing[1],
                  }}
                  accessibilityLabel="Add another child"
                  accessibilityRole="button"
                >
                  <Text
                    style={{
                      ...textStyles.buttonSmall,
                      color: colors.primary.DEFAULT,
                    }}
                  >
                    + Add Child
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Child Name Inputs */}
            <View style={{ gap: spacing[3] }}>
              {childrenNames.map((name, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[2],
                  }}
                >
                  <TextInput
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
                    <TouchableOpacity
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
                      <Text
                        style={{
                          fontSize: 20,
                          color: colors.error.DEFAULT,
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {errors.children && (
              <Text
                style={{
                  ...textStyles.caption,
                  color: colors.error.DEFAULT,
                  marginTop: spacing[2],
                }}
              >
                {errors.children}
              </Text>
            )}
          </View>
        </>
      )}

      {/* Action Buttons - Responsive for landscape */}
      <View 
        style={{ 
          gap: isLandscape ? spacing[2] : spacing[3], 
          marginTop: 'auto', 
          paddingBottom: isLandscape ? spacing[2] : spacing[4],
          flexDirection: isLandscape ? 'row' : 'column',
        }}
      >
        <PrimaryButton
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth={!isLandscape}
          size={isLandscape ? "medium" : "large"}
          testID="create-family-button"
          style={isLandscape ? { flex: 1 } : undefined}
        >
          Create My Family
        </PrimaryButton>

        <SecondaryButton
          onPress={onJoinExistingFamily}
          disabled={loading}
          fullWidth={!isLandscape}
          size={isLandscape ? "medium" : "large"}
          testID="join-family-button"
          style={isLandscape ? { flex: 1 } : undefined}
        >
          Join Existing Family Instead
        </SecondaryButton>
      </View>
    </View>
  );
};