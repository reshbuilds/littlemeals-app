import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { styled } from 'nativewind';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export type FamilyRole = 'admin' | 'caregiver' | 'viewer';

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: FamilyRole;
  avatar?: string;
  isCurrentUser?: boolean;
  joinedAt?: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  adminOnly?: boolean;
}

export interface PermissionManagerProps {
  /**
   * Current family members
   */
  members: FamilyMember[];
  
  /**
   * Current user ID for permission checking
   */
  currentUserId: string;
  
  /**
   * Available permissions to manage
   */
  permissions?: Permission[];
  
  /**
   * Callback when member role is changed
   */
  onRoleChange?: (memberId: string, newRole: FamilyRole) => Promise<void>;
  
  /**
   * Callback when member is removed
   */
  onRemoveMember?: (memberId: string) => Promise<void>;
  
  /**
   * Loading state for role changes
   */
  loading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

// Role definitions with permissions
const roleDefinitions = {
  admin: {
    label: 'Family Admin',
    emoji: '👑',
    description: 'Full access to manage family, children, and all settings',
    permissions: [
      'Add/remove family members',
      'Manage children profiles',
      'Change family settings',
      'View all meal data',
      'Export family reports',
      'Delete family account',
    ],
    color: colors.primary.DEFAULT,
    bgColor: colors.primary.light,
  },
  caregiver: {
    label: 'Caregiver',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Can log meals and manage children but limited admin access',
    permissions: [
      'Log meals for all children',
      'View meal history',
      'Update child preferences',
      'Use voice logging',
      'View basic insights',
    ],
    color: colors.success.DEFAULT,
    bgColor: colors.success.light,
  },
  viewer: {
    label: 'Viewer',
    emoji: '👀',
    description: 'Read-only access to view meal data and insights',
    permissions: [
      'View meal history',
      'View basic insights',
      'See family members',
    ],
    color: colors.foreground.muted,
    bgColor: colors.background.muted,
  },
} as const;

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  members,
  currentUserId,
  permissions = [],
  onRoleChange,
  onRemoveMember,
  loading = false,
  disabled = false,
}) => {
  const [changingRoleForMember, setChangingRoleForMember] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<FamilyRole | null>(null);

  const currentUser = members.find(m => m.id === currentUserId);
  const isCurrentUserAdmin = currentUser?.role === 'admin';

  // Handle role change
  const handleRoleChange = async (memberId: string, newRole: FamilyRole) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Prevent changing own role if you're the only admin
    if (member.isCurrentUser && member.role === 'admin') {
      const adminCount = members.filter(m => m.role === 'admin').length;
      if (adminCount === 1) {
        Alert.alert(
          'Cannot Change Role',
          'You cannot change your own role as you are the only admin. Please assign admin role to another family member first.'
        );
        return;
      }
    }

    // Confirm role change
    Alert.alert(
      'Change Family Role',
      `Change ${member.name}'s role to ${roleDefinitions[newRole].label}?\n\n${roleDefinitions[newRole].description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change Role',
          onPress: async () => {
            setChangingRoleForMember(memberId);
            try {
              await onRoleChange?.(memberId, newRole);
            } catch (error) {
              Alert.alert('Error', 'Failed to change role. Please try again.');
            } finally {
              setChangingRoleForMember(null);
            }
          },
        },
      ]
    );
  };

  // Handle member removal
  const handleRemoveMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    if (member.isCurrentUser) {
      Alert.alert(
        'Cannot Remove Yourself',
        'You cannot remove yourself from the family. Please ask another admin to remove you.'
      );
      return;
    }

    Alert.alert(
      'Remove Family Member',
      `Remove ${member.name} from your family?\n\nThey will lose access to all family meal data and will need a new invitation to rejoin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await onRemoveMember?.(memberId);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove member. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Render role badge
  const renderRoleBadge = (role: FamilyRole) => {
    const config = roleDefinitions[role];
    return (
      <StyledView
        style={{
          backgroundColor: config.bgColor,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.base,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <StyledText style={{ fontSize: 14, marginRight: spacing[1] }}>
          {config.emoji}
        </StyledText>
        <StyledText
          style={{
            ...textStyles.caption,
            color: config.color,
            fontWeight: '600',
          }}
        >
          {config.label}
        </StyledText>
      </StyledView>
    );
  };

  // Render member card
  const renderMemberCard = (member: FamilyMember) => {
    const canManage = isCurrentUserAdmin && !member.isCurrentUser;
    const isChangingRole = changingRoleForMember === member.id;

    return (
      <StyledView
        key={member.id}
        style={{
          backgroundColor: colors.background.card,
          borderRadius: borderRadius.base,
          padding: spacing[4],
          borderWidth: 1,
          borderColor: member.isCurrentUser ? colors.primary.light : colors.border.DEFAULT,
          marginBottom: spacing[3],
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Member Header */}
        <StyledView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[3],
          }}
        >
          {/* Avatar */}
          <StyledView
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.primary.light,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing[3],
            }}
          >
            <StyledText style={{ fontSize: 20 }}>
              {member.avatar || '👤'}
            </StyledText>
          </StyledView>

          {/* Member Info */}
          <StyledView style={{ flex: 1 }}>
            <StyledView
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing[1],
              }}
            >
              <StyledText
                style={{
                  ...textStyles.h4,
                  color: colors.foreground.DEFAULT,
                  marginRight: spacing[2],
                }}
              >
                {member.name}
                {member.isCurrentUser && ' (You)'}
              </StyledText>
              {renderRoleBadge(member.role)}
            </StyledView>
            <StyledText
              style={{
                ...textStyles.body,
                color: colors.foreground.muted,
              }}
            >
              {member.email}
            </StyledText>
            {member.joinedAt && (
              <StyledText
                style={{
                  ...textStyles.caption,
                  color: colors.foreground.light,
                  marginTop: spacing[1],
                }}
              >
                Joined {member.joinedAt.toLocaleDateString()}
              </StyledText>
            )}
          </StyledView>
        </StyledView>

        {/* Role Management (only for admins) */}
        {canManage && (
          <StyledView>
            <StyledText
              style={{
                ...textStyles.label,
                color: colors.foreground.muted,
                marginBottom: spacing[2],
              }}
            >
              Change Role
            </StyledText>
            
            <StyledView
              style={{
                flexDirection: 'row',
                gap: spacing[2],
                marginBottom: spacing[3],
              }}
            >
              {(Object.keys(roleDefinitions) as FamilyRole[]).map((role) => (
                <StyledTouchableOpacity
                  key={role}
                  onPress={() => handleRoleChange(member.id, role)}
                  disabled={member.role === role || isChangingRole || loading}
                  style={{
                    flex: 1,
                    paddingVertical: spacing[2],
                    paddingHorizontal: spacing[3],
                    borderRadius: borderRadius.base,
                    borderWidth: 1,
                    borderColor: member.role === role 
                      ? roleDefinitions[role].color 
                      : colors.border.DEFAULT,
                    backgroundColor: member.role === role 
                      ? roleDefinitions[role].bgColor 
                      : colors.background.DEFAULT,
                    opacity: member.role === role || isChangingRole ? 0.6 : 1,
                    alignItems: 'center',
                  }}
                  accessibilityLabel={`Change role to ${roleDefinitions[role].label}`}
                  accessibilityRole="button"
                >
                  <StyledText style={{ fontSize: 16, marginBottom: spacing[1] }}>
                    {roleDefinitions[role].emoji}
                  </StyledText>
                  <StyledText
                    style={{
                      ...textStyles.caption,
                      color: member.role === role 
                        ? roleDefinitions[role].color 
                        : colors.foreground.muted,
                      textAlign: 'center',
                    }}
                  >
                    {roleDefinitions[role].label}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>

            {/* Remove Member Button */}
            <StyledTouchableOpacity
              onPress={() => handleRemoveMember(member.id)}
              disabled={loading || isChangingRole}
              style={{
                paddingVertical: spacing[2],
                alignItems: 'center',
              }}
              accessibilityLabel={`Remove ${member.name} from family`}
              accessibilityRole="button"
            >
              <StyledText
                style={{
                  ...textStyles.caption,
                  color: colors.error.DEFAULT,
                }}
              >
                Remove from Family
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {/* Loading State */}
        {isChangingRole && (
          <StyledView
            style={{
              marginTop: spacing[2],
              padding: spacing[2],
              backgroundColor: colors.background.muted,
              borderRadius: borderRadius.base,
              alignItems: 'center',
            }}
          >
            <StyledText
              style={{
                ...textStyles.caption,
                color: colors.foreground.muted,
              }}
            >
              Updating role...
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    );
  };

  // Render role explanation
  const renderRoleExplanation = (role: FamilyRole) => {
    const config = roleDefinitions[role];
    const isExpanded = expandedRole === role;

    return (
      <StyledView
        key={role}
        style={{
          backgroundColor: colors.background.card,
          borderRadius: borderRadius.base,
          marginBottom: spacing[2],
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
        }}
      >
        <StyledTouchableOpacity
          onPress={() => setExpandedRole(isExpanded ? null : role)}
          style={{
            padding: spacing[3],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          accessibilityLabel={`${config.label} role information`}
          accessibilityRole="button"
        >
          <StyledView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <StyledText style={{ fontSize: 20, marginRight: spacing[2] }}>
              {config.emoji}
            </StyledText>
            <StyledView style={{ flex: 1 }}>
              <StyledText
                style={{
                  ...textStyles.h4,
                  color: colors.foreground.DEFAULT,
                  marginBottom: spacing[1],
                }}
              >
                {config.label}
              </StyledText>
              <StyledText
                style={{
                  ...textStyles.body,
                  color: colors.foreground.muted,
                }}
              >
                {config.description}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledText
            style={{
              fontSize: 16,
              color: colors.foreground.light,
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
            }}
          >
            ▼
          </StyledText>
        </StyledTouchableOpacity>

        {isExpanded && (
          <StyledView
            style={{
              paddingHorizontal: spacing[3],
              paddingBottom: spacing[3],
              borderTopWidth: 1,
              borderTopColor: colors.border.light,
            }}
          >
            <StyledText
              style={{
                ...textStyles.label,
                color: colors.foreground.muted,
                marginBottom: spacing[2],
                marginTop: spacing[2],
              }}
            >
              Permissions:
            </StyledText>
            {config.permissions.map((permission, index) => (
              <StyledView
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing[1],
                }}
              >
                <StyledText
                  style={{
                    fontSize: 12,
                    color: colors.success.DEFAULT,
                    marginRight: spacing[2],
                  }}
                >
                  ✓
                </StyledText>
                <StyledText
                  style={{
                    ...textStyles.body,
                    color: colors.foreground.DEFAULT,
                  }}
                >
                  {permission}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>
        )}
      </StyledView>
    );
  };

  return (
    <StyledScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StyledView style={{ padding: spacing[4] }}>
        {/* Header */}
        <StyledView style={{ marginBottom: spacing[6] }}>
          <StyledText
            style={{
              ...textStyles.h2,
              color: colors.foreground.DEFAULT,
              marginBottom: spacing[2],
              textAlign: 'center',
            }}
          >
            Family Permissions
          </StyledText>
          <StyledText
            style={{
              ...textStyles.body,
              color: colors.foreground.muted,
              textAlign: 'center',
            }}
          >
            Manage family member roles and permissions
          </StyledText>
        </StyledView>

        {/* Role Explanations */}
        <StyledView style={{ marginBottom: spacing[6] }}>
          <StyledText
            style={{
              ...textStyles.h3,
              color: colors.foreground.DEFAULT,
              marginBottom: spacing[4],
            }}
          >
            Family Roles
          </StyledText>
          {(Object.keys(roleDefinitions) as FamilyRole[]).map(renderRoleExplanation)}
        </StyledView>

        {/* Family Members */}
        <StyledView>
          <StyledText
            style={{
              ...textStyles.h3,
              color: colors.foreground.DEFAULT,
              marginBottom: spacing[4],
            }}
          >
            Family Members ({members.length})
          </StyledText>
          {members.map(renderMemberCard)}
        </StyledView>

        {/* Admin Note */}
        {!isCurrentUserAdmin && (
          <StyledView
            style={{
              backgroundColor: colors.background.muted,
              padding: spacing[4],
              borderRadius: borderRadius.base,
              marginTop: spacing[4],
            }}
          >
            <StyledText
              style={{
                ...textStyles.body,
                color: colors.foreground.muted,
                textAlign: 'center',
              }}
            >
              Only family admins can manage member roles and permissions.
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    </StyledScrollView>
  );
};