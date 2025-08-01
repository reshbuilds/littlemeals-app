import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export interface ChildProfile {
  id?: string;
  name: string;
  birthDate?: Date;
  emoji?: string;
  notes?: string;
}

export interface ChildProfileCardProps {
  /**
   * Child profile data (optional for new child)
   */
  child?: ChildProfile;
  
  /**
   * Whether this is in edit mode
   */
  editing?: boolean;
  
  /**
   * Whether this is a new child being added
   */
  isNew?: boolean;
  
  /**
   * Callback when child is saved
   */
  onSave?: (child: ChildProfile) => void;
  
  /**
   * Callback when editing is cancelled
   */
  onCancel?: () => void;
  
  /**
   * Callback when child is deleted
   */
  onDelete?: (childId: string) => void;
  
  /**
   * Callback when edit is started
   */
  onEdit?: () => void;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

// Available child emoji options
const childEmojis = ['👶', '🧒', '👧', '👦', '🧑', '👨', '👩', '😊', '🌟', '🎈', '🚀', '🦄', '🌈', '🐻', '🐶', '🐱'];

export const ChildProfileCard: React.FC<ChildProfileCardProps> = ({
  child,
  editing = false,
  isNew = false,
  onSave,
  onCancel,
  onDelete,
  onEdit,
  loading = false,
  disabled = false,
}) => {
  const [editedChild, setEditedChild] = useState<ChildProfile>(
    child || {
      name: '',
      emoji: childEmojis[0],
    }
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditing = editing || isNew;

  // Handle name change
  const handleNameChange = (name: string) => {
    setEditedChild(prev => ({ ...prev, name }));
    if (errors.name && name.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setEditedChild(prev => ({ ...prev, emoji }));
    setShowEmojiPicker(false);
  };

  // Handle birth date change (simplified - just age for now)
  const handleNotesChange = (notes: string) => {
    setEditedChild(prev => ({ ...prev, notes }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!editedChild.name.trim()) {
      newErrors.name = 'Child name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;
    onSave?.(editedChild);
  };

  // Handle cancel
  const handleCancel = () => {
    if (child) {
      setEditedChild(child);
    } else {
      setEditedChild({ name: '', emoji: childEmojis[0] });
    }
    setErrors({});
    onCancel?.();
  };

  // Handle delete
  const handleDelete = () => {
    if (!child?.id) return;
    
    Alert.alert(
      'Delete Child Profile',
      `Are you sure you want to remove ${child.name} from your family? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(child.id!)
        },
      ]
    );
  };

  const displayChild = isEditing ? editedChild : child;

  return (
    <StyledView
      style={{
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.base,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        opacity: disabled ? 0.6 : 1,
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Child Header */}
      <StyledView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing[3],
        }}
      >
        {/* Emoji/Avatar */}
        <StyledTouchableOpacity
          onPress={isEditing ? () => setShowEmojiPicker(!showEmojiPicker) : undefined}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary.light,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing[3],
            borderWidth: isEditing ? 2 : 0,
            borderColor: showEmojiPicker ? colors.primary.DEFAULT : 'transparent',
          }}
          disabled={!isEditing}
          accessibilityLabel={isEditing ? 'Select emoji for child' : 'Child avatar'}
          accessibilityRole={isEditing ? 'button' : 'image'}
        >
          <StyledText style={{ fontSize: 24 }}>
            {displayChild?.emoji || '👶'}
          </StyledText>
        </StyledTouchableOpacity>

        {/* Name */}
        <StyledView style={{ flex: 1 }}>
          {isEditing ? (
            <StyledView>
              <StyledTextInput
                value={editedChild.name}
                onChangeText={handleNameChange}
                placeholder="Child's name"
                placeholderTextColor={colors.foreground.light}
                style={{
                  ...textStyles.h4,
                  color: colors.foreground.DEFAULT,
                  borderBottomWidth: 1,
                  borderBottomColor: errors.name ? colors.error.DEFAULT : colors.border.DEFAULT,
                  paddingBottom: spacing[1],
                  backgroundColor: 'transparent',
                }}
                accessibilityLabel="Enter child's name"
                testID="child-name-input"
              />
              {errors.name && (
                <StyledText
                  style={{
                    ...textStyles.caption,
                    color: colors.error.DEFAULT,
                    marginTop: spacing[1],
                  }}
                >
                  {errors.name}
                </StyledText>
              )}
            </StyledView>
          ) : (
            <StyledText
              style={{
                ...textStyles.h4,
                color: colors.foreground.DEFAULT,
              }}
            >
              {displayChild?.name || 'New Child'}
            </StyledText>
          )}
        </StyledView>

        {/* Action Button */}
        {!isEditing && !disabled && (
          <StyledTouchableOpacity
            onPress={onEdit}
            style={{
              padding: spacing[2],
            }}
            accessibilityLabel="Edit child profile"
            accessibilityRole="button"
          >
            <StyledText style={{ fontSize: 18 }}>✏️</StyledText>
          </StyledTouchableOpacity>
        )}
      </StyledView>

      {/* Emoji Picker */}
      {showEmojiPicker && isEditing && (
        <StyledView
          style={{
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.base,
            padding: spacing[3],
            marginBottom: spacing[3],
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing[2],
          }}
        >
          {childEmojis.map((emoji) => (
            <StyledTouchableOpacity
              key={emoji}
              onPress={() => handleEmojiSelect(emoji)}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                backgroundColor: editedChild.emoji === emoji 
                  ? colors.primary.light 
                  : 'transparent',
              }}
              accessibilityLabel={`Select ${emoji} emoji`}
              accessibilityRole="button"
            >
              <StyledText style={{ fontSize: 20 }}>{emoji}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      )}

      {/* Notes/Additional Info */}
      {isEditing && (
        <StyledView style={{ marginBottom: spacing[4] }}>
          <StyledText
            style={{
              ...textStyles.label,
              color: colors.foreground.muted,
              marginBottom: spacing[2],
            }}
          >
            Notes (optional)
          </StyledText>
          <StyledTextInput
            value={editedChild.notes || ''}
            onChangeText={handleNotesChange}
            placeholder="Any allergies, preferences, or notes..."
            placeholderTextColor={colors.foreground.light}
            multiline
            numberOfLines={3}
            style={{
              ...textStyles.body,
              color: colors.foreground.DEFAULT,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              borderRadius: borderRadius.base,
              padding: spacing[3],
              backgroundColor: colors.background.DEFAULT,
              textAlignVertical: 'top',
              minHeight: 80,
            }}
            accessibilityLabel="Enter notes about child"
            testID="child-notes-input"
          />
        </StyledView>
      )}

      {/* Action Buttons for Editing */}
      {isEditing && (
        <StyledView
          style={{
            flexDirection: 'row',
            gap: spacing[3],
          }}
        >
          <StyledView style={{ flex: 1 }}>
            <StyledTouchableOpacity
              onPress={handleCancel}
              disabled={loading}
              style={{
                height: 44,
                backgroundColor: colors.background.secondary,
                borderRadius: borderRadius.base,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border.DEFAULT,
              }}
              accessibilityLabel="Cancel editing"
              accessibilityRole="button"
            >
              <StyledText
                style={{
                  ...textStyles.button,
                  color: colors.foreground.muted,
                }}
              >
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView style={{ flex: 1 }}>
            <StyledTouchableOpacity
              onPress={handleSave}
              disabled={loading || !editedChild.name.trim()}
              style={{
                height: 44,
                backgroundColor: colors.primary.DEFAULT,
                borderRadius: borderRadius.base,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: loading || !editedChild.name.trim() ? 0.6 : 1,
              }}
              accessibilityLabel="Save child profile"
              accessibilityRole="button"
            >
              <StyledText
                style={{
                  ...textStyles.button,
                  color: colors.primary.foreground,
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      )}

      {/* Delete Button for Existing Children (only when not editing) */}
      {!isEditing && !isNew && child?.id && (
        <StyledView style={{ marginTop: spacing[3] }}>
          <StyledTouchableOpacity
            onPress={handleDelete}
            disabled={disabled}
            style={{
              padding: spacing[2],
              alignItems: 'center',
            }}
            accessibilityLabel="Delete child profile"
            accessibilityRole="button"
          >
            <StyledText
              style={{
                ...textStyles.caption,
                color: colors.error.DEFAULT,
              }}
            >
              Remove from family
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  );
};