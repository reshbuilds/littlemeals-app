import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { ChildProfileCard, ChildProfile } from '../../components/family/ChildProfileCard';
import { PrimaryButton } from '../../components/design-system/Button';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { textStyles, responsiveTextStyles } from '../../constants/typography';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export interface ChildManagementScreenProps {
  /**
   * Existing children in the family
   */
  initialChildren?: ChildProfile[];
  
  /**
   * Callback when children management is completed
   */
  onComplete?: (children: ChildProfile[]) => void;
  
  /**
   * Callback for navigation back
   */
  onBack?: () => void;
  
  /**
   * Error handler
   */
  onError?: (error: string) => void;
}

export const ChildManagementScreen: React.FC<ChildManagementScreenProps> = ({
  initialChildren = [],
  onComplete,
  onBack,
  onError,
}) => {
  const [children, setChildren] = useState<ChildProfile[]>(initialChildren);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-generate IDs for children without them
  useEffect(() => {
    setChildren(prev => prev.map(child => ({
      ...child,
      id: child.id || `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })));
  }, []);

  // Handle saving child (new or edited)
  const handleSaveChild = async (childData: ChildProfile) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isAddingChild) {
        // Adding new child
        const newChild: ChildProfile = {
          ...childData,
          id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        setChildren(prev => [...prev, newChild]);
        setIsAddingChild(false);
      } else if (editingChildId) {
        // Editing existing child
        setChildren(prev => prev.map(child => 
          child.id === editingChildId ? { ...childData, id: editingChildId } : child
        ));
        setEditingChildId(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save child. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle canceling edit/add
  const handleCancel = () => {
    setEditingChildId(null);
    setIsAddingChild(false);
  };

  // Handle deleting child
  const handleDeleteChild = async (childId: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setChildren(prev => prev.filter(child => child.id !== childId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete child. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle starting to edit a child
  const handleEditChild = (childId: string) => {
    if (isAddingChild) {
      setIsAddingChild(false);
    }
    setEditingChildId(childId);
  };

  // Handle adding new child
  const handleAddNewChild = () => {
    if (editingChildId) {
      setEditingChildId(null);
    }
    setIsAddingChild(true);
  };

  // Handle completing the management
  const handleComplete = () => {
    if (children.length === 0) {
      Alert.alert(
        'No Children Added',
        'You need to add at least one child to continue. Would you like to add a child now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Child', onPress: handleAddNewChild },
        ]
      );
      return;
    }

    onComplete?.(children);
  };

  const hasAnyEditing = editingChildId !== null || isAddingChild;

  return (
    <>
      <StatusBar
        backgroundColor={colors.background.DEFAULT}
        barStyle="dark-content"
      />
      <StyledSafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: colors.background.DEFAULT 
        }}
      >
        <StyledScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing[4],
            paddingTop: spacing[4],
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <StyledView style={{ marginBottom: spacing[6] }}>
            <StyledText
              style={{
                ...responsiveTextStyles.screenTitle,
                color: colors.foreground.DEFAULT,
                textAlign: 'center',
                marginBottom: spacing[2],
              }}
            >
              Manage Children
            </StyledText>
            <StyledText
              style={{
                ...textStyles.body,
                color: colors.foreground.muted,
                textAlign: 'center',
              }}
            >
              Add and manage your children's profiles for meal tracking
            </StyledText>
          </StyledView>

          {/* Children List */}
          <StyledView style={{ marginBottom: spacing[6], gap: spacing[4] }}>
            {children.map((child) => (
              <ChildProfileCard
                key={child.id}
                child={child}
                editing={editingChildId === child.id}
                onSave={handleSaveChild}
                onCancel={handleCancel}
                onDelete={handleDeleteChild}
                onEdit={() => handleEditChild(child.id!)}
                loading={loading}
                disabled={hasAnyEditing && editingChildId !== child.id}
              />
            ))}

            {/* Add New Child Card */}
            {isAddingChild && (
              <ChildProfileCard
                isNew
                editing
                onSave={handleSaveChild}
                onCancel={handleCancel}
                loading={loading}
              />
            )}
          </StyledView>

          {/* Add Child Button */}
          {!hasAnyEditing && (
            <StyledView style={{ marginBottom: spacing[6] }}>
              <StyledTouchableOpacity
                onPress={handleAddNewChild}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 12,
                  padding: spacing[4],
                  borderWidth: 2,
                  borderColor: colors.primary.light,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                }}
                accessibilityLabel="Add new child"
                accessibilityRole="button"
                testID="add-child-button"
              >
                <StyledText style={{ fontSize: 32, marginBottom: spacing[2] }}>➕</StyledText>
                <StyledText
                  style={{
                    ...textStyles.h4,
                    color: colors.primary.DEFAULT,
                    textAlign: 'center',
                  }}
                >
                  Add Another Child
                </StyledText>
                <StyledText
                  style={{
                    ...textStyles.body,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    marginTop: spacing[1],
                  }}
                >
                  Tap to add a new child to your family
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}

          {/* Empty State */}
          {children.length === 0 && !isAddingChild && (
            <StyledView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: spacing[8],
              }}
            >
              <StyledText style={{ fontSize: 64, marginBottom: spacing[4] }}>👶</StyledText>
              <StyledText
                style={{
                  ...textStyles.h3,
                  color: colors.foreground.DEFAULT,
                  textAlign: 'center',
                  marginBottom: spacing[2],
                }}
              >
                No Children Added Yet
              </StyledText>
              <StyledText
                style={{
                  ...textStyles.body,
                  color: colors.foreground.muted,
                  textAlign: 'center',
                  marginBottom: spacing[6],
                  maxWidth: 280,
                }}
              >
                Add your children's profiles to start tracking their meals and eating patterns
              </StyledText>
              <PrimaryButton
                onPress={handleAddNewChild}
                size="large"
                testID="add-first-child-button"
              >
                Add Your First Child
              </PrimaryButton>
            </StyledView>
          )}

          {/* Action Buttons */}
          {!hasAnyEditing && children.length > 0 && (
            <StyledView style={{ marginTop: 'auto', paddingBottom: spacing[4] }}>
              <PrimaryButton
                onPress={handleComplete}
                fullWidth
                size="large"
                testID="complete-children-setup-button"
              >
                Continue with {children.length} {children.length === 1 ? 'Child' : 'Children'}
              </PrimaryButton>
              
              {onBack && (
                <StyledTouchableOpacity
                  onPress={onBack}
                  style={{
                    alignItems: 'center',
                    paddingTop: spacing[3],
                  }}
                  accessibilityLabel="Go back"
                  accessibilityRole="button"
                >
                  <StyledText
                    style={{
                      ...textStyles.body,
                      color: colors.foreground.muted,
                    }}
                  >
                    ← Back
                  </StyledText>
                </StyledTouchableOpacity>
              )}
            </StyledView>
          )}
        </StyledScrollView>
      </StyledSafeAreaView>
    </>
  );
};