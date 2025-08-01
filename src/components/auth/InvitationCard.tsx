import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styled } from 'nativewind';
import { PrimaryButton, SecondaryButton } from '../design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
    <StyledView
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
      <StyledView style={{ marginBottom: spacing[3] }}>
        <StyledView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[1],
          }}
        >
          <StyledText style={{ fontSize: 24, marginRight: spacing[2] }}>👨‍👩‍👧‍👦</StyledText>
          <StyledText
            style={{
              ...textStyles.h4,
              color: colors.foreground.DEFAULT,
              flex: 1,
            }}
          >
            {invitation.familyName}
          </StyledText>
          {isExpired && (
            <StyledView
              style={{
                backgroundColor: colors.error.light,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
                borderRadius: borderRadius.base,
              }}
            >
              <StyledText
                style={{
                  ...textStyles.caption,
                  color: colors.error.foreground,
                }}
              >
                Expired
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        <StyledText
          style={{
            ...textStyles.body,
            color: colors.foreground.muted,
            marginBottom: spacing[1],
          }}
        >
          Invited by {invitation.inviterName}
        </StyledText>

        {invitation.inviterEmail && (
          <StyledText
            style={{
              ...textStyles.caption,
              color: colors.foreground.light,
              marginBottom: spacing[1],
            }}
          >
            {invitation.inviterEmail}
          </StyledText>
        )}

        <StyledText
          style={{
            ...textStyles.caption,
            color: colors.foreground.light,
          }}
        >
          {getRelativeTime(invitation.invitedAt)}
          {invitation.childrenCount && invitation.childrenCount > 0 && (
            ` • ${invitation.childrenCount} ${invitation.childrenCount === 1 ? 'child' : 'children'}`
          )}
        </StyledText>
      </StyledView>

      {/* Invitation Message */}
      <StyledView
        style={{
          backgroundColor: colors.primary.light,
          padding: spacing[3],
          borderRadius: borderRadius.base,
          marginBottom: spacing[4],
        }}
      >
        <StyledText
          style={{
            ...textStyles.body,
            color: colors.foreground.DEFAULT,
            textAlign: 'center',
          }}
        >
          You've been invited to join this family and help track their meals together!
        </StyledText>
      </StyledView>

      {/* Action Buttons */}
      {!isExpired && (
        <StyledView
          style={{
            flexDirection: 'row',
            gap: spacing[3],
          }}
        >
          <StyledView style={{ flex: 1 }}>
            <SecondaryButton
              onPress={() => onDecline?.(invitation)}
              loading={declineLoading}
              disabled={isDisabled || acceptLoading}
              fullWidth
              testID={`decline-invitation-${invitation.id}`}
            >
              Decline
            </SecondaryButton>
          </StyledView>
          <StyledView style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => onAccept?.(invitation)}
              loading={acceptLoading}
              disabled={isDisabled || declineLoading}
              fullWidth
              testID={`accept-invitation-${invitation.id}`}
            >
              Accept
            </PrimaryButton>
          </StyledView>
        </StyledView>
      )}

      {isExpired && (
        <StyledView
          style={{
            padding: spacing[3],
            backgroundColor: colors.background.muted,
            borderRadius: borderRadius.base,
            alignItems: 'center',
          }}
        >
          <StyledText
            style={{
              ...textStyles.body,
              color: colors.foreground.muted,
              textAlign: 'center',
            }}
          >
            This invitation has expired. Please ask for a new invitation.
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};