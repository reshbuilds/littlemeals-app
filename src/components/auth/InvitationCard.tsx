import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export interface FamilyInvitation {
  id: string;
  familyName: string;
  inviterName: string;
  inviterEmail?: string;
  childrenCount?: number;
  invitedAt: Date;
  expiresAt?: Date;
}

export interface InvitationCardProps {
  /**
   * Invitation data
   */
  invitation: FamilyInvitation;
  
  /**
   * Callback when user accepts invitation
   */
  onAccept?: (invitation: FamilyInvitation) => void;
  
  /**
   * Callback when user declines invitation
   */
  onDecline?: (invitation: FamilyInvitation) => void;
  
  /**
   * Loading state for accept action
   */
  acceptLoading?: boolean;
  
  /**
   * Loading state for decline action
   */
  declineLoading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  acceptLoading = false,
  declineLoading = false,
  disabled = false,
}) => {
  const isExpired = invitation.expiresAt ? new Date() > invitation.expiresAt : false;
  const isDisabled = disabled || isExpired;

  // Format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <View
      style={{
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.base,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: isExpired ? colors.border.light : colors.border.DEFAULT,
        opacity: isExpired ? 0.6 : 1,
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
      {/* Family Info Header */}
      <View style={{ marginBottom: spacing[3] }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[1],
          }}
        >
          <Text style={{ fontSize: 24, marginRight: spacing[2] }}>👨‍👩‍👧‍👦</Text>
          <Text
            style={{
              ...textStyles.h4,
              color: colors.foreground.DEFAULT,
              flex: 1,
            }}
          >
            {invitation.familyName}
          </Text>
          {isExpired && (
            <View
              style={{
                backgroundColor: colors.error.light,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
                borderRadius: borderRadius.base,
              }}
            >
              <Text
                style={{
                  ...textStyles.caption,
                  color: colors.error.foreground,
                }}
              >
                Expired
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            ...textStyles.body,
            color: colors.foreground.muted,
            marginBottom: spacing[1],
          }}
        >
          Invited by {invitation.inviterName}
        </Text>

        {invitation.inviterEmail && (
          <Text
            style={{
              ...textStyles.caption,
              color: colors.foreground.light,
              marginBottom: spacing[1],
            }}
          >
            {invitation.inviterEmail}
          </Text>
        )}

        <Text
          style={{
            ...textStyles.caption,
            color: colors.foreground.light,
          }}
        >
          {getRelativeTime(invitation.invitedAt)}
          {invitation.childrenCount && invitation.childrenCount > 0 && (
            ` • ${invitation.childrenCount} ${invitation.childrenCount === 1 ? 'child' : 'children'}`
          )}
        </Text>
      </View>

      {/* Invitation Message */}
      <View
        style={{
          backgroundColor: colors.primary.light,
          padding: spacing[3],
          borderRadius: borderRadius.base,
          marginBottom: spacing[4],
        }}
      >
        <Text
          style={{
            ...textStyles.body,
            color: colors.foreground.DEFAULT,
            textAlign: 'center',
          }}
        >
          You've been invited to join this family and help track their meals together!
        </Text>
      </View>

      {/* Action Buttons */}
      {!isExpired && (
        <View
          style={{
            flexDirection: 'row',
            gap: spacing[3],
          }}
        >
          <View style={{ flex: 1 }}>
            <SecondaryButton
              onPress={() => onDecline?.(invitation)}
              loading={declineLoading}
              disabled={isDisabled || acceptLoading}
              fullWidth
              testID={`decline-invitation-${invitation.id}`}
            >
              Decline
            </SecondaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => onAccept?.(invitation)}
              loading={acceptLoading}
              disabled={isDisabled || declineLoading}
              fullWidth
              testID={`accept-invitation-${invitation.id}`}
            >
              Accept
            </PrimaryButton>
          </View>
        </View>
      )}

      {isExpired && (
        <View
          style={{
            padding: spacing[3],
            backgroundColor: colors.background.muted,
            borderRadius: borderRadius.base,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...textStyles.body,
              color: colors.foreground.muted,
              textAlign: 'center',
            }}
          >
            This invitation has expired. Please ask for a new invitation.
          </Text>
        </View>
      )}
    </View>
  );
};