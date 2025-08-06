import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { styled } from 'nativewind';
import { GoogleButton, AppleButton, EmailButton } from '../../components/auth/OAuthButton';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { textStyles, responsiveTextStyles } from '../../constants/typography';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

export interface WelcomeScreenProps {
  /**
   * Navigation handler for OAuth success
   */
  onOAuthSuccess?: (provider: 'google' | 'apple') => void;
  
  /**
   * Navigation handler for OAuth error
   */
  onOAuthError?: (error: string) => void;
  
  /**
   * Navigation handler for email authentication
   */
  onNavigateToEmailAuth?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOAuthSuccess,
  onOAuthError,
  onNavigateToEmailAuth,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null);
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

  // Handle OAuth button press
  const handleOAuthPress = async (provider: 'google' | 'apple') => {
    try {
      setLoadingProvider(provider);
      
      // Simulate OAuth flow (in real app, this would trigger actual OAuth)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, simulate success
      if (Math.random() > 0.1) { // 90% success rate for demo
        onOAuthSuccess?.(provider);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      onOAuthError?.(errorMessage);
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  // Handle email authentication navigation
  const handleEmailAuth = () => {
    onNavigateToEmailAuth?.();
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
            paddingHorizontal: spacing[4],
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLandscape ? (
            // Landscape Layout: Side-by-side
            <StyledView 
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing[4],
                gap: spacing[6],
              }}
            >
              {/* Left Side: Hero Content */}
              <StyledView 
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* App Icon/Logo */}
                <StyledView 
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    backgroundColor: colors.primary.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing[4],
                    shadowColor: colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <StyledText style={{ fontSize: 32 }}>🍽️</StyledText>
                </StyledView>

                {/* App Name */}
                <StyledText
                  style={{
                    ...textStyles.h1,
                    color: colors.foreground.DEFAULT,
                    textAlign: 'center',
                    marginBottom: spacing[2],
                  }}
                >
                  LittleMeals
                </StyledText>

                {/* Tagline */}
                <StyledText
                  style={{
                    ...textStyles.body,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    maxWidth: 300,
                    marginBottom: spacing[4],
                    lineHeight: 20,
                  }}
                >
                  Track your family's meals faster than writing in Apple Notes
                </StyledText>

                {/* Key Benefits - Compact */}
                <StyledView style={{ gap: spacing[2] }}>
                  <BenefitItem 
                    emoji="👨‍👩‍👧‍👦" 
                    text="Family meal tracking" 
                    compact={true}
                  />
                  <BenefitItem 
                    emoji="🔄" 
                    text="Real-time sync" 
                    compact={true}
                  />
                  <BenefitItem 
                    emoji="🤖" 
                    text="AI-powered insights" 
                    compact={true}
                  />
                </StyledView>
              </StyledView>

              {/* Right Side: Auth Options */}
              <StyledView 
                style={{
                  flex: 1,
                  maxWidth: 400,
                  gap: spacing[3],
                }}
              >
                <GoogleButton
                  onPress={() => handleOAuthPress('google')}
                  loading={loadingProvider === 'google'}
                  disabled={loadingProvider !== null}
                />
                
                <AppleButton
                  onPress={() => handleOAuthPress('apple')}
                  loading={loadingProvider === 'apple'}
                  disabled={loadingProvider !== null}
                />

                {/* Divider */}
                <StyledView 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: spacing[1],
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
                      ...textStyles.caption,
                      color: colors.foreground.muted,
                      marginHorizontal: spacing[3],
                    }}
                  >
                    or
                  </StyledText>
                  <StyledView 
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border.DEFAULT,
                    }}
                  />
                </StyledView>

                <EmailButton
                  onPress={handleEmailAuth}
                  loading={false}
                  disabled={loadingProvider !== null}
                />

                {/* Terms and Privacy */}
                <StyledText
                  style={{
                    ...textStyles.caption,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    marginTop: spacing[2],
                    lineHeight: 14,
                  }}
                >
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </StyledText>
              </StyledView>
            </StyledView>
          ) : (
            // Portrait Layout: Original vertical layout
            <>
              {/* Hero Section */}
              <StyledView className="flex-1 justify-center items-center pt-8">
            {/* App Icon/Logo */}
            <StyledView 
              style={{
                width: 120,
                height: 120,
                borderRadius: 30,
                backgroundColor: colors.primary.light,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing[6],
                shadowColor: colors.primary.DEFAULT,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <StyledText style={{ fontSize: 48 }}>🍽️</StyledText>
            </StyledView>

            {/* App Name */}
            <StyledText
              style={{
                ...responsiveTextStyles.hero,
                color: colors.foreground.DEFAULT,
                textAlign: 'center',
                marginBottom: spacing[3],
              }}
            >
              LittleMeals
            </StyledText>

            {/* Tagline */}
            <StyledText
              style={{
                ...textStyles.bodyLarge,
                color: colors.foreground.muted,
                textAlign: 'center',
                maxWidth: 280,
                marginBottom: spacing[8],
                lineHeight: 24,
              }}
            >
              Track your family's meals faster than writing in Apple Notes
            </StyledText>

            {/* Key Benefits */}
            <StyledView 
              style={{
                marginBottom: spacing[8],
                paddingHorizontal: spacing[2],
              }}
            >
              <BenefitItem 
                emoji="👨‍👩‍👧‍👦" 
                text="Family meal tracking for all children" 
              />
              <BenefitItem 
                emoji="🔄" 
                text="Real-time sync across all devices" 
              />
              <BenefitItem 
                emoji="🤖" 
                text="AI-powered insights and patterns" 
              />
            </StyledView>
          </StyledView>

          {/* Auth Buttons Section */}
          <StyledView 
            style={{
              paddingBottom: spacing[6],
              gap: spacing[3],
            }}
          >
            {/* Primary OAuth Options */}
            <GoogleButton
              onPress={() => handleOAuthPress('google')}
              loading={loadingProvider === 'google'}
              disabled={loadingProvider !== null}
            />
            
            <AppleButton
              onPress={() => handleOAuthPress('apple')}
              loading={loadingProvider === 'apple'}
              disabled={loadingProvider !== null}
            />

            {/* Divider */}
            <StyledView 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: spacing[2],
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
                  ...textStyles.caption,
                  color: colors.foreground.muted,
                  marginHorizontal: spacing[3],
                }}
              >
                or
              </StyledText>
              <StyledView 
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.border.DEFAULT,
                }}
              />
            </StyledView>

            {/* Email Option */}
            <EmailButton
              onPress={handleEmailAuth}
              loading={false}
              disabled={loadingProvider !== null}
            />

            {/* Terms and Privacy */}
            <StyledText
              style={{
                ...textStyles.caption,
                color: colors.foreground.muted,
                textAlign: 'center',
                marginTop: spacing[4],
                lineHeight: 16,
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </StyledText>
          </StyledView>
              </>
            )}
        </StyledScrollView>
      </StyledSafeAreaView>
    </>
  );
};

// Helper component for benefit items
interface BenefitItemProps {
  emoji: string;
  text: string;
  compact?: boolean;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ emoji, text, compact = false }) => (
  <StyledView 
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: compact ? spacing[1] : spacing[3],
    }}
  >
    <StyledText 
      style={{
        fontSize: compact ? 16 : 20,
        marginRight: compact ? spacing[2] : spacing[3],
      }}
    >
      {emoji}
    </StyledText>
    <StyledText
      style={{
        ...(compact ? textStyles.bodySmall : textStyles.body),
        color: colors.foreground.muted,
        flex: 1,
      }}
    >
      {text}
    </StyledText>
  </StyledView>
);