import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { styled } from 'nativewind';
import { InvitationCard, FamilyInvitation } from '../../components/auth/InvitationCard';
import { PrimaryButton, SecondaryButton } from '../../components/design-system/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles, responsiveTextStyles } from '../../constants/typography';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

export interface JoinFamilyScreenProps {
  /**
   * Callback when user successfully joins a family
   */
  onJoinSuccess?: (familyData: { familyId: string; familyName: string }) => void;
  
  /**
   * Callback when user wants to create new family instead
   */
  onCreateNewFamily?: () => void;
  
  /**
   * Error handler
   */
  onError?: (error: string) => void;
}

export const JoinFamilyScreen: React.FC<JoinFamilyScreenProps> = ({
  onJoinSuccess,
  onCreateNewFamily,
  onError,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [acceptingInvitation, setAcceptingInvitation] = useState<string | null>(null);
  const [decliningInvitation, setDecliningInvitation] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string>('');
  const [screenData, setScreenData] = useState(Dimensions.get('screen'));
  
  // Track orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ screen }) => {
        setScreenData(screen);
      }
    );
    
    return () => subscription?.remove();
  }, []);
  
  const isLandscape = screenData.width > screenData.height;

  // Mock data for pending invitations
  useEffect(() => {
    // Simulate loading pending invitations
    const mockInvitations: FamilyInvitation[] = [
      {
        id: '1',
        familyName: 'The Johnson Family',
        inviterName: 'Sarah Johnson',
        inviterEmail: 'sarah@example.com',
        childrenCount: 2,
        invitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        id: '2',
        familyName: 'The Smith Household',
        inviterName: 'Mike Smith',
        inviterEmail: 'mike.smith@example.com',
        childrenCount: 1,
        invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      },
    ];
    setPendingInvitations(mockInvitations);
  }, []);

  // Handle invite code submission
  const handleJoinWithCode = async () => {
    if (!inviteCode.trim()) {
      setCodeError('Please enter an invite code');
      return;
    }

    try {
      setLoading(true);
      setCodeError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success for certain codes
      if (inviteCode.toLowerCase().includes('family') || inviteCode.length >= 6) {
        onJoinSuccess?.({
          familyId: 'mock-family-id',
          familyName: 'Mock Family',
        });
      } else {
        throw new Error('Invalid invite code. Please check and try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join family. Please try again.';
      setCodeError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle invitation acceptance
  const handleAcceptInvitation = async (invitation: FamilyInvitation) => {
    try {
      setAcceptingInvitation(invitation.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, simulate success
      onJoinSuccess?.({
        familyId: invitation.id,
        familyName: invitation.familyName,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept invitation. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setAcceptingInvitation(null);
    }
  };

  // Handle invitation decline
  const handleDeclineInvitation = async (invitation: FamilyInvitation) => {
    try {
      setDecliningInvitation(invitation.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from pending invitations
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
      
      Alert.alert('Invitation Declined', 'You have declined the family invitation.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline invitation. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setDecliningInvitation(null);
    }
  };

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
            paddingHorizontal: isLandscape ? spacing[6] : spacing[4],
            paddingTop: isLandscape ? spacing[2] : spacing[4],
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <StyledView style={{ marginBottom: isLandscape ? spacing[4] : spacing[6] }}>
            <StyledText
              style={{
                ...(isLandscape ? textStyles.h2 : responsiveTextStyles.screenTitle),
                color: colors.foreground.DEFAULT,
                textAlign: 'center',
                marginBottom: isLandscape ? spacing[1] : spacing[2],
              }}
            >
              Join a Family
            </StyledText>
            <StyledText
              style={{
                ...(isLandscape ? textStyles.bodySmall : textStyles.body),
                color: colors.foreground.muted,
                textAlign: 'center',
                maxWidth: isLandscape ? 600 : undefined,
                alignSelf: 'center',
              }}
            >
              Join an existing family to start tracking meals together
            </StyledText>
          </StyledView>

          {/* Main Content - Responsive Layout */}
          {isLandscape && pendingInvitations.length > 0 ? (
            // Landscape Layout with Invitations: Side-by-side
            <StyledView 
              style={{
                flexDirection: 'row',
                gap: spacing[6],
                flex: 1,
                marginBottom: spacing[4],
              }}
            >
              {/* Left Side: Pending Invitations */}
              <StyledView style={{ flex: 1 }}>
                <StyledText
                  style={{
                    ...textStyles.h4,
                    color: colors.foreground.DEFAULT,
                    marginBottom: spacing[3],
                  }}
                >
                  Pending Invitations
                </StyledText>
                
                <StyledView style={{ gap: spacing[3] }}>
                  {pendingInvitations.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      onAccept={handleAcceptInvitation}
                      onDecline={handleDeclineInvitation}
                      acceptLoading={acceptingInvitation === invitation.id}
                      declineLoading={decliningInvitation === invitation.id}
                      disabled={acceptingInvitation !== null || decliningInvitation !== null}
                    />
                  ))}
                </StyledView>
              </StyledView>

              {/* Right Side: Invite Code */}
              <StyledView style={{ flex: 1 }}>
                <StyledText
                  style={{
                    ...textStyles.h4,
                    color: colors.foreground.DEFAULT,
                    marginBottom: spacing[3],
                  }}
                >
                  Enter Invite Code
                </StyledText>

                <StyledView style={{ marginBottom: spacing[4] }}>
                  <StyledText
                    style={{
                      ...textStyles.label,
                      color: colors.foreground.DEFAULT,
                      marginBottom: spacing[2],
                    }}
                  >
                    Family Invite Code
                  </StyledText>
                  <StyledTextInput
                    value={inviteCode}
                    onChangeText={(text) => {
                      setInviteCode(text);
                      if (codeError && text.trim()) {
                        setCodeError('');
                      }
                    }}
                    placeholder="Enter invite code (e.g., FAMILY123)"
                    placeholderTextColor={colors.foreground.light}
                    style={{
                      ...textStyles.input,
                      height: 44,
                      paddingHorizontal: spacing[3],
                      borderWidth: 1,
                      borderColor: codeError ? colors.error.DEFAULT : colors.border.DEFAULT,
                      borderRadius: borderRadius.base,
                      backgroundColor: colors.background.card,
                      color: colors.foreground.DEFAULT,
                      textAlign: 'center',
                      fontSize: 16,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                    accessibilityLabel="Enter family invite code"
                    accessibilityHint="Enter the invite code provided by a family member"
                    testID="invite-code-input"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  {codeError && (
                    <StyledText
                      style={{
                        ...textStyles.caption,
                        color: colors.error.DEFAULT,
                        marginTop: spacing[1],
                        textAlign: 'center',
                      }}
                    >
                      {codeError}
                    </StyledText>
                  )}
                </StyledView>

                <PrimaryButton
                  onPress={handleJoinWithCode}
                  loading={loading}
                  disabled={loading || !inviteCode.trim()}
                  fullWidth
                  size="medium"
                  testID="join-with-code-button"
                >
                  Join Family
                </PrimaryButton>
              </StyledView>
            </StyledView>
          ) : (
            // Portrait Layout or No Invitations: Original vertical layout
            <>
              {/* Pending Invitations Section */}
              {pendingInvitations.length > 0 && (
                <StyledView style={{ marginBottom: isLandscape ? spacing[4] : spacing[6] }}>
                  <StyledText
                    style={{
                      ...textStyles.h4,
                      color: colors.foreground.DEFAULT,
                      marginBottom: spacing[4],
                    }}
                  >
                    Pending Invitations
                  </StyledText>
                  
                  <StyledView style={{ gap: spacing[4] }}>
                    {pendingInvitations.map((invitation) => (
                      <InvitationCard
                        key={invitation.id}
                        invitation={invitation}
                        onAccept={handleAcceptInvitation}
                        onDecline={handleDeclineInvitation}
                        acceptLoading={acceptingInvitation === invitation.id}
                        declineLoading={decliningInvitation === invitation.id}
                        disabled={acceptingInvitation !== null || decliningInvitation !== null}
                      />
                    ))}
                  </StyledView>
                </StyledView>
              )}

              {/* Divider */}
              {pendingInvitations.length > 0 && (
                <StyledView 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: isLandscape ? spacing[4] : spacing[6],
                  }}
                >
                  <StyledView 
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border.DEFAULT,
                    }}
                  />
                  <StyledText
                    style={{
                      ...(isLandscape ? textStyles.bodySmall : textStyles.body),
                      color: colors.foreground.muted,
                      marginHorizontal: spacing[4],
                    }}
                  >
                    or use invite code
                  </StyledText>
                  <StyledView 
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border.DEFAULT,
                    }}
                  />
                </StyledView>
              )}

              {/* Invite Code Section */}
              <StyledView style={{ marginBottom: isLandscape ? spacing[4] : spacing[8] }}>
                <StyledText
                  style={{
                    ...textStyles.h4,
                    color: colors.foreground.DEFAULT,
                    marginBottom: spacing[4],
                    textAlign: pendingInvitations.length === 0 ? 'center' : 'left',
                  }}
                >
                  Enter Invite Code
                </StyledText>

                <StyledView style={{ marginBottom: spacing[4] }}>
                  <StyledText
                    style={{
                      ...textStyles.label,
                      color: colors.foreground.DEFAULT,
                      marginBottom: spacing[2],
                    }}
                  >
                    Family Invite Code
                  </StyledText>
                  <StyledTextInput
                    value={inviteCode}
                    onChangeText={(text) => {
                      setInviteCode(text);
                      if (codeError && text.trim()) {
                        setCodeError('');
                      }
                    }}
                    placeholder="Enter invite code (e.g., FAMILY123)"
                    placeholderTextColor={colors.foreground.light}
                    style={{
                      ...textStyles.input,
                      height: isLandscape ? 44 : 50,
                      paddingHorizontal: spacing[3],
                      borderWidth: 1,
                      borderColor: codeError ? colors.error.DEFAULT : colors.border.DEFAULT,
                      borderRadius: borderRadius.base,
                      backgroundColor: colors.background.card,
                      color: colors.foreground.DEFAULT,
                      textAlign: 'center',
                      fontSize: isLandscape ? 16 : 18,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                    accessibilityLabel="Enter family invite code"
                    accessibilityHint="Enter the invite code provided by a family member"
                    testID="invite-code-input"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  {codeError && (
                    <StyledText
                      style={{
                        ...textStyles.caption,
                        color: colors.error.DEFAULT,
                        marginTop: spacing[1],
                        textAlign: 'center',
                      }}
                    >
                      {codeError}
                    </StyledText>
                  )}
                </StyledView>

                <PrimaryButton
                  onPress={handleJoinWithCode}
                  loading={loading}
                  disabled={loading || !inviteCode.trim()}
                  fullWidth
                  size={isLandscape ? "medium" : "large"}
                  testID="join-with-code-button"
                >
                  Join Family
                </PrimaryButton>
              </StyledView>
            </>
          )}

          {/* Alternative Action */}
          <StyledView style={{ marginTop: 'auto', paddingBottom: isLandscape ? spacing[2] : spacing[4] }}>
            <SecondaryButton
              onPress={onCreateNewFamily}
              disabled={loading || acceptingInvitation !== null || decliningInvitation !== null}
              fullWidth
              size={isLandscape ? "medium" : "large"}
              testID="create-new-family-button"
            >
              Create New Family Instead
            </SecondaryButton>
          </StyledView>
        </StyledScrollView>
      </StyledSafeAreaView>
    </>
  );
};