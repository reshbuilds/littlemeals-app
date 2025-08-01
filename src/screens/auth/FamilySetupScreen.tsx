import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { FamilySetupForm } from '../../components/auth/FamilySetupForm';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);

export interface FamilySetupScreenProps {
  /**
   * Navigation handler when family setup is completed
   */
  onFamilySetupComplete?: (familyData: { familyName: string; childrenNames: string[] }) => void;
  
  /**
   * Navigation handler when user wants to join existing family
   */
  onNavigateToJoinFamily?: () => void;
  
  /**
   * Error handler
   */
  onError?: (error: string) => void;
}

export const FamilySetupScreen: React.FC<FamilySetupScreenProps> = ({
  onFamilySetupComplete,
  onNavigateToJoinFamily,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  // Handle family creation
  const handleFamilyCreated = async (familyData: { familyName: string; childrenNames: string[] }) => {
    try {
      setLoading(true);
      
      // Simulate API call to create family
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success
      if (Math.random() > 0.1) { // 90% success rate for demo
        onFamilySetupComplete?.(familyData);
      } else {
        throw new Error('Failed to create family. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create family. Please try again.';
      onError?.(errorMessage);
      Alert.alert('Setup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to join existing family
  const handleJoinExistingFamily = () => {
    onNavigateToJoinFamily?.();
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
            paddingTop: spacing[4],
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FamilySetupForm
            onFamilyCreated={handleFamilyCreated}
            onJoinExistingFamily={handleJoinExistingFamily}
            loading={loading}
          />
        </StyledScrollView>
      </StyledSafeAreaView>
    </>
  );
};