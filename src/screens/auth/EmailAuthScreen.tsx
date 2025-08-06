import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { styled } from 'nativewind';
import { 
  PrimaryButton, 
  SecondaryButton,
  Screen,
  VStack,
  HStack,
  MessageAlert,
} from '../../components/design-system';
import { colors } from '../../constants/colors';
import { spacing, dimensions, borderRadius } from '../../constants/spacing';
import { textStyles, responsiveTextStyles } from '../../constants/typography';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Types and Interfaces
export type AuthMode = 'signin' | 'signup' | 'forgot-password';

export interface UserData {
  userId: string;
  email: string;
  name: string;
  isNewUser: boolean;
}

export interface EmailAuthScreenProps {
  /**
   * Callback when sign in is successful
   */
  onSignInSuccess?: (userData: UserData) => void;
  
  /**
   * Callback when sign up is successful
   */
  onSignUpSuccess?: (userData: UserData) => void;
  
  /**
   * Callback when user wants to go back to OAuth options
   */
  onNavigateBack?: () => void;
  
  /**
   * Callback when forgot password is requested
   */
  onForgotPassword?: (email: string) => void;
  
  /**
   * Initial mode for the screen
   */
  initialMode?: AuthMode;
  
  /**
   * Error handler
   */
  onError?: (error: string) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onSignInSuccess,
  onSignUpSuccess,
  onNavigateBack,
  onForgotPassword,
  initialMode = 'signin',
  onError,
}) => {
  // State Management
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
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
  
  // Refs for focus management
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Form Validation
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return undefined;
  };

  const validatePassword = (password: string, isSignUp: boolean = false): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    
    if (isSignUp && password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (isSignUp && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    // Password validation
    const passwordError = validatePassword(password, mode === 'signup');
    if (passwordError) newErrors.password = passwordError;
    
    // Confirm password validation (only for signup)
    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific error when user starts typing
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Authentication Handlers
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setErrors({});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different outcomes for demo
      const random = Math.random();
      
      if (random > 0.9) {
        throw new Error('network_error');
      } else if (random > 0.8) {
        throw new Error('invalid_credentials');
      } else if (random > 0.7) {
        throw new Error('account_not_found');
      }
      
      // Simulate successful sign in
      const userData: UserData = {
        userId: `email-user-${Date.now()}`,
        email: email.toLowerCase(),
        name: email.split('@')[0],
        isNewUser: false,
      };
      
      onSignInSuccess?.(userData);
      
    } catch (error: any) {
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.message === 'network_error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message === 'invalid_credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message === 'account_not_found') {
        errorMessage = 'No account found with this email. Would you like to create an account?';
      }
      
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setErrors({});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate different outcomes for demo
      const random = Math.random();
      
      if (random > 0.9) {
        throw new Error('network_error');
      } else if (random > 0.8) {
        throw new Error('email_already_exists');
      } else if (random > 0.7) {
        throw new Error('weak_password');
      }
      
      // Simulate successful sign up
      const userData: UserData = {
        userId: `email-user-${Date.now()}`,
        email: email.toLowerCase(),
        name: email.split('@')[0],
        isNewUser: true,
      };
      
      onSignUpSuccess?.(userData);
      
    } catch (error: any) {
      let errorMessage = 'Account creation failed. Please try again.';
      
      if (error.message === 'network_error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message === 'email_already_exists') {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.message === 'weak_password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    
    try {
      setLoading(true);
      setErrors({});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onForgotPassword?.(email);
      
      Alert.alert(
        'Password Reset Sent',
        `We've sent password reset instructions to ${email}. Please check your email and follow the instructions.`,
        [
          { text: 'OK', onPress: () => setMode('signin') }
        ]
      );
      
    } catch (error) {
      setErrors({ general: 'Failed to send password reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Mode switching
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Get screen content based on mode
  const getScreenTitle = (): string => {
    switch (mode) {
      case 'signin': return 'Welcome back';
      case 'signup': return 'Create your account';
      case 'forgot-password': return 'Reset your password';
      default: return 'Sign in';
    }
  };

  const getScreenSubtitle = (): string => {
    switch (mode) {
      case 'signin': return 'Sign in to continue tracking your family\'s meals';
      case 'signup': return 'Join thousands of families tracking meals together';
      case 'forgot-password': return 'Enter your email to receive password reset instructions';
      default: return '';
    }
  };

  const getPrimaryButtonText = (): string => {
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot-password': return 'Send Reset Instructions';
      default: return 'Continue';
    }
  };

  // Handle keyboard submission
  const handleKeyboardSubmit = () => {
    switch (mode) {
      case 'signin':
        handleSignIn();
        break;
      case 'signup':
        handleSignUp();
        break;
      case 'forgot-password':
        handleForgotPassword();
        break;
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'fair';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'fair';
    if (!/(?=.*[!@#$%^&*])/.test(password)) return 'good';
    return 'strong';
  };

  const getPasswordStrengthColor = (strength: string): string => {
    switch (strength) {
      case 'weak': return colors.error.DEFAULT;
      case 'fair': return colors.warning.DEFAULT;
      case 'good': return colors.primary.DEFAULT;
      case 'strong': return colors.success.DEFAULT;
      default: return colors.border.DEFAULT;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={colors.background.DEFAULT}
        barStyle="dark-content"
      />
      <Screen scrollable safeArea backgroundColor={colors.background.DEFAULT}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {isLandscape ? (
            // Landscape Layout: Side-by-side
            <HStack spacing="lg" padding="lg" className="flex-1">
              {/* Left Side: Header */}
              <VStack 
                spacing="md" 
                align="center" 
                justify="center"
                style={{ 
                  flex: 1,
                  maxWidth: '40%',
                  paddingVertical: spacing[4],
                }}
              >
                {/* App Logo */}
                <StyledView 
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 15,
                    backgroundColor: colors.primary.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing[3],
                    shadowColor: colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <StyledText style={{ fontSize: 24 }}>🍽️</StyledText>
                </StyledView>

                {/* Screen Title */}
                <StyledText
                  style={{
                    ...textStyles.h2,
                    color: colors.foreground.DEFAULT,
                    textAlign: 'center',
                    marginBottom: spacing[2],
                  }}
                >
                  {getScreenTitle()}
                </StyledText>

                {/* Screen Subtitle */}
                <StyledText
                  style={{
                    ...textStyles.bodySmall,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    maxWidth: 280,
                    lineHeight: 18,
                  }}
                >
                  {getScreenSubtitle()}
                </StyledText>
              </VStack>

              {/* Right Side: Form */}
              <VStack spacing="md" style={{ flex: 1, maxWidth: '60%' }}>
                {/* General Error Message */}
                {errors.general && (
                  <MessageAlert
                    type="error"
                    message={errors.general}
                    dismissible
                    onDismiss={() => clearError('general')}
                  />
                )}

                {/* Form Fields */}
                <VStack spacing="md">
                  {/* Email Input */}
                  <StyledView>
                    <StyledText
                      style={{
                        ...textStyles.label,
                        color: colors.foreground.DEFAULT,
                        marginBottom: spacing[1],
                      }}
                    >
                      Email Address
                    </StyledText>
                    <StyledTextInput
                      ref={emailRef}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        clearError('email');
                      }}
                      placeholder="your.email@example.com"
                      placeholderTextColor={colors.foreground.light}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      style={{
                        ...textStyles.input,
                        height: dimensions.inputMedium,
                        paddingHorizontal: spacing[3],
                        borderWidth: 1,
                        borderColor: errors.email ? colors.error.DEFAULT : colors.border.DEFAULT,
                        borderRadius: borderRadius.base,
                        backgroundColor: colors.background.card,
                        color: colors.foreground.DEFAULT,
                      }}
                      accessibilityLabel="Enter your email address"
                      testID="email-input"
                    />
                    {errors.email && (
                      <StyledText
                        style={{
                          ...textStyles.caption,
                          color: colors.error.DEFAULT,
                          marginTop: spacing[0.5],
                        }}
                      >
                        {errors.email}
                      </StyledText>
                    )}
                  </StyledView>

                  {/* Password Input */}
                  {mode !== 'forgot-password' && (
                    <StyledView>
                      <StyledText
                        style={{
                          ...textStyles.label,
                          color: colors.foreground.DEFAULT,
                          marginBottom: spacing[1],
                        }}
                      >
                        Password
                      </StyledText>
                      <StyledView style={{ position: 'relative' }}>
                        <StyledTextInput
                          ref={passwordRef}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            clearError('password');
                          }}
                          placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                          placeholderTextColor={colors.foreground.light}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType={mode === 'signup' ? 'next' : 'done'}
                          onSubmitEditing={() => {
                            if (mode === 'signup') {
                              confirmPasswordRef.current?.focus();
                            } else {
                              handleKeyboardSubmit();
                            }
                          }}
                          style={{
                            ...textStyles.input,
                            height: dimensions.inputMedium,
                            paddingHorizontal: spacing[3],
                            paddingRight: spacing[10],
                            borderWidth: 1,
                            borderColor: errors.password ? colors.error.DEFAULT : colors.border.DEFAULT,
                            borderRadius: borderRadius.base,
                            backgroundColor: colors.background.card,
                            color: colors.foreground.DEFAULT,
                          }}
                          accessibilityLabel="Enter your password"
                          testID="password-input"
                        />
                        
                        <StyledTouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: spacing[3],
                            top: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: dimensions.iconLarge,
                          }}
                          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                          testID="password-visibility-toggle"
                        >
                          <StyledText style={{ fontSize: 18 }}>
                            {showPassword ? '🙈' : '👁️'}
                          </StyledText>
                        </StyledTouchableOpacity>
                      </StyledView>
                      
                      {errors.password && (
                        <StyledText
                          style={{
                            ...textStyles.caption,
                            color: colors.error.DEFAULT,
                            marginTop: spacing[0.5],
                          }}
                        >
                          {errors.password}
                        </StyledText>
                      )}
                    </StyledView>
                  )}

                  {/* Confirm Password Input (only for signup in landscape) */}
                  {mode === 'signup' && (
                    <StyledView>
                      <StyledText
                        style={{
                          ...textStyles.label,
                          color: colors.foreground.DEFAULT,
                          marginBottom: spacing[1],
                        }}
                      >
                        Confirm Password
                      </StyledText>
                      <StyledTextInput
                        ref={confirmPasswordRef}
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          clearError('confirmPassword');
                        }}
                        placeholder="Confirm your password"
                        placeholderTextColor={colors.foreground.light}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleKeyboardSubmit}
                        style={{
                          ...textStyles.input,
                          height: dimensions.inputMedium,
                          paddingHorizontal: spacing[3],
                          borderWidth: 1,
                          borderColor: errors.confirmPassword ? colors.error.DEFAULT : colors.border.DEFAULT,
                          borderRadius: borderRadius.base,
                          backgroundColor: colors.background.card,
                          color: colors.foreground.DEFAULT,
                        }}
                        accessibilityLabel="Confirm your password"
                        testID="confirm-password-input"
                      />
                      
                      {errors.confirmPassword && (
                        <StyledText
                          style={{
                            ...textStyles.caption,
                            color: colors.error.DEFAULT,
                            marginTop: spacing[0.5],
                          }}
                        >
                          {errors.confirmPassword}
                        </StyledText>
                      )}
                    </StyledView>
                  )}
                </VStack>

                {/* Action Buttons */}
                <VStack spacing="sm" style={{ marginTop: spacing[4] }}>
                  <PrimaryButton
                    onPress={handleKeyboardSubmit}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    testID={`${mode}-submit-button`}
                  >
                    {getPrimaryButtonText()}
                  </PrimaryButton>

                  {/* Forgot Password Link (only in signin mode) */}
                  {mode === 'signin' && (
                    <StyledTouchableOpacity
                      onPress={() => switchMode('forgot-password')}
                      disabled={loading}
                      style={{
                        alignSelf: 'center',
                        paddingVertical: spacing[1],
                      }}
                      accessibilityLabel="Forgot your password?"
                      testID="forgot-password-link"
                    >
                      <StyledText
                        style={{
                          ...textStyles.bodySmall,
                          color: colors.primary.DEFAULT,
                          textDecorationLine: 'underline',
                        }}
                      >
                        Forgot your password?
                      </StyledText>
                    </StyledTouchableOpacity>
                  )}

                  {/* Mode Switch and Back Button */}
                  <VStack spacing="sm" style={{ marginTop: spacing[2] }}>
                    {mode !== 'forgot-password' && (
                      <StyledTouchableOpacity
                        onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                        disabled={loading}
                        style={{
                          alignSelf: 'center',
                          paddingVertical: spacing[1],
                        }}
                        testID="mode-switch-link"
                      >
                        <StyledText
                          style={{
                            ...textStyles.bodySmall,
                            color: colors.foreground.muted,
                            textAlign: 'center',
                          }}
                        >
                          {mode === 'signin' 
                            ? "Don't have an account? " 
                            : "Already have an account? "
                          }
                          <StyledText
                            style={{
                              color: colors.primary.DEFAULT,
                              fontWeight: textStyles.button.fontWeight,
                            }}
                          >
                            {mode === 'signin' ? 'Create one' : 'Sign in'}
                          </StyledText>
                        </StyledText>
                      </StyledTouchableOpacity>
                    )}

                    <SecondaryButton
                      onPress={onNavigateBack}
                      disabled={loading}
                      fullWidth
                      testID="back-to-oauth-button"
                    >
                      {mode === 'forgot-password' ? 'Back to Sign In' : 'Back to Sign In Options'}
                    </SecondaryButton>
                  </VStack>
                </VStack>
              </VStack>
            </HStack>
          ) : (
            // Portrait Layout: Original vertical layout
            <VStack spacing="lg" padding="lg" className="flex-1">
              {/* Header Section */}
              <VStack spacing="md" align="center" style={{ paddingTop: spacing[4] }}>
                {/* App Logo */}
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
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <StyledText style={{ fontSize: 32 }}>🍽️</StyledText>
                </StyledView>

                {/* Screen Title */}
                <StyledText
                  style={{
                    ...responsiveTextStyles.screenTitle,
                    color: colors.foreground.DEFAULT,
                    textAlign: 'center',
                    marginBottom: spacing[2],
                  }}
                >
                  {getScreenTitle()}
                </StyledText>

                {/* Screen Subtitle */}
                <StyledText
                  style={{
                    ...textStyles.body,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    maxWidth: 320,
                    lineHeight: 22,
                  }}
                >
                  {getScreenSubtitle()}
                </StyledText>
              </VStack>

            {/* General Error Message */}
            {errors.general && (
              <MessageAlert
                type="error"
                message={errors.general}
                dismissible
                onDismiss={() => clearError('general')}
              />
            )}

            {/* Form Section */}
            <VStack spacing="lg" style={{ marginTop: spacing[6] }}>
              {/* Email Input */}
              <StyledView>
                <StyledText
                  style={{
                    ...textStyles.label,
                    color: colors.foreground.DEFAULT,
                    marginBottom: spacing[2],
                  }}
                >
                  Email Address
                </StyledText>
                <StyledTextInput
                  ref={emailRef}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError('email');
                  }}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.foreground.light}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  style={{
                    ...textStyles.input,
                    height: dimensions.inputLarge,
                    paddingHorizontal: spacing[3],
                    borderWidth: 1,
                    borderColor: errors.email ? colors.error.DEFAULT : colors.border.DEFAULT,
                    borderRadius: borderRadius.base,
                    backgroundColor: colors.background.card,
                    color: colors.foreground.DEFAULT,
                  }}
                  accessibilityLabel="Enter your email address"
                  accessibilityHint="This will be used to sign in to your account"
                  testID="email-input"
                />
                {errors.email && (
                  <StyledText
                    style={{
                      ...textStyles.caption,
                      color: colors.error.DEFAULT,
                      marginTop: spacing[1],
                    }}
                  >
                    {errors.email}
                  </StyledText>
                )}
              </StyledView>

              {/* Password Input */}
              {mode !== 'forgot-password' && (
                <StyledView>
                  <StyledText
                    style={{
                      ...textStyles.label,
                      color: colors.foreground.DEFAULT,
                      marginBottom: spacing[2],
                    }}
                  >
                    Password
                  </StyledText>
                  <StyledView style={{ position: 'relative' }}>
                    <StyledTextInput
                      ref={passwordRef}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        clearError('password');
                      }}
                      placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                      placeholderTextColor={colors.foreground.light}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete={mode === 'signup' ? 'password-new' : 'password'}
                      returnKeyType={mode === 'signup' ? 'next' : 'done'}
                      onSubmitEditing={() => {
                        if (mode === 'signup') {
                          confirmPasswordRef.current?.focus();
                        } else {
                          handleKeyboardSubmit();
                        }
                      }}
                      style={{
                        ...textStyles.input,
                        height: dimensions.inputLarge,
                        paddingHorizontal: spacing[3],
                        paddingRight: spacing[10], // Space for eye icon
                        borderWidth: 1,
                        borderColor: errors.password ? colors.error.DEFAULT : colors.border.DEFAULT,
                        borderRadius: borderRadius.base,
                        backgroundColor: colors.background.card,
                        color: colors.foreground.DEFAULT,
                      }}
                      accessibilityLabel="Enter your password"
                      accessibilityHint={mode === 'signup' ? 'Create a secure password for your account' : 'Enter your account password'}
                      testID="password-input"
                    />
                    
                    {/* Password Visibility Toggle */}
                    <StyledTouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: spacing[3],
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: dimensions.iconLarge,
                      }}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      accessibilityRole="button"
                      testID="password-visibility-toggle"
                    >
                      <StyledText style={{ fontSize: 20 }}>
                        {showPassword ? '🙈' : '👁️'}
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                  
                  {errors.password && (
                    <StyledText
                      style={{
                        ...textStyles.caption,
                        color: colors.error.DEFAULT,
                        marginTop: spacing[1],
                      }}
                    >
                      {errors.password}
                    </StyledText>
                  )}
                  
                  {/* Password Strength Indicator (for signup) */}
                  {mode === 'signup' && password.length > 0 && (
                    <StyledView style={{ marginTop: spacing[2] }}>
                      <HStack align="center" spacing="sm">
                        <StyledText
                          style={{
                            ...textStyles.caption,
                            color: colors.foreground.muted,
                          }}
                        >
                          Password strength:
                        </StyledText>
                        <StyledText
                          style={{
                            ...textStyles.captionBold,
                            color: getPasswordStrengthColor(getPasswordStrength(password)),
                          }}
                        >
                          {getPasswordStrength(password).toUpperCase()}
                        </StyledText>
                      </HStack>
                    </StyledView>
                  )}
                </StyledView>
              )}

              {/* Confirm Password Input (only for signup) */}
              {mode === 'signup' && (
                <StyledView>
                  <StyledText
                    style={{
                      ...textStyles.label,
                      color: colors.foreground.DEFAULT,
                      marginBottom: spacing[2],
                    }}
                  >
                    Confirm Password
                  </StyledText>
                  <StyledView style={{ position: 'relative' }}>
                    <StyledTextInput
                      ref={confirmPasswordRef}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        clearError('confirmPassword');
                      }}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.foreground.light}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password-new"
                      returnKeyType="done"
                      onSubmitEditing={handleKeyboardSubmit}
                      style={{
                        ...textStyles.input,
                        height: dimensions.inputLarge,
                        paddingHorizontal: spacing[3],
                        paddingRight: spacing[10], // Space for eye icon
                        borderWidth: 1,
                        borderColor: errors.confirmPassword ? colors.error.DEFAULT : colors.border.DEFAULT,
                        borderRadius: borderRadius.base,
                        backgroundColor: colors.background.card,
                        color: colors.foreground.DEFAULT,
                      }}
                      accessibilityLabel="Confirm your password"
                      accessibilityHint="Re-enter your password to confirm"
                      testID="confirm-password-input"
                    />
                    
                    {/* Confirm Password Visibility Toggle */}
                    <StyledTouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: spacing[3],
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: dimensions.iconLarge,
                      }}
                      accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      accessibilityRole="button"
                      testID="confirm-password-visibility-toggle"
                    >
                      <StyledText style={{ fontSize: 20 }}>
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                  
                  {errors.confirmPassword && (
                    <StyledText
                      style={{
                        ...textStyles.caption,
                        color: colors.error.DEFAULT,
                        marginTop: spacing[1],
                      }}
                    >
                      {errors.confirmPassword}
                    </StyledText>
                  )}
                </StyledView>
              )}
            </VStack>

            {/* Action Buttons */}
            <VStack spacing="md" style={{ marginTop: spacing[6] }}>
              <PrimaryButton
                onPress={handleKeyboardSubmit}
                loading={loading}
                disabled={loading}
                fullWidth
                size="large"
                testID={`${mode}-submit-button`}
              >
                {getPrimaryButtonText()}
              </PrimaryButton>

              {/* Forgot Password Link (only in signin mode) */}
              {mode === 'signin' && (
                <StyledTouchableOpacity
                  onPress={() => switchMode('forgot-password')}
                  disabled={loading}
                  style={{
                    alignSelf: 'center',
                    paddingVertical: spacing[2],
                    paddingHorizontal: spacing[4],
                  }}
                  accessibilityLabel="Forgot your password?"
                  accessibilityRole="button"
                  testID="forgot-password-link"
                >
                  <StyledText
                    style={{
                      ...textStyles.button,
                      color: colors.primary.DEFAULT,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Forgot your password?
                  </StyledText>
                </StyledTouchableOpacity>
              )}
            </VStack>

            {/* Alternative Actions */}
            <VStack spacing="md" style={{ marginTop: 'auto', paddingBottom: spacing[4] }}>
              {/* Mode Switch Link */}
              {mode !== 'forgot-password' && (
                <StyledTouchableOpacity
                  onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                  disabled={loading}
                  style={{
                    alignSelf: 'center',
                    paddingVertical: spacing[3],
                    paddingHorizontal: spacing[4],
                  }}
                  accessibilityLabel={mode === 'signin' ? 'Create a new account' : 'Sign in to existing account'}
                  accessibilityRole="button"
                  testID="mode-switch-link"
                >
                  <StyledText
                    style={{
                      ...textStyles.body,
                      color: colors.foreground.muted,
                      textAlign: 'center',
                    }}
                  >
                    {mode === 'signin' 
                      ? "Don't have an account? " 
                      : "Already have an account? "
                    }
                    <StyledText
                      style={{
                        ...textStyles.body,
                        color: colors.primary.DEFAULT,
                        fontWeight: textStyles.button.fontWeight,
                      }}
                    >
                      {mode === 'signin' ? 'Create one' : 'Sign in'}
                    </StyledText>
                  </StyledText>
                </StyledTouchableOpacity>
              )}

              {/* Back to OAuth Options */}
              <SecondaryButton
                onPress={onNavigateBack}
                disabled={loading}
                fullWidth
                size="large"
                testID="back-to-oauth-button"
              >
                {mode === 'forgot-password' ? 'Back to Sign In' : 'Back to Sign In Options'}
              </SecondaryButton>

              {/* Terms and Privacy (only for signup) */}
              {mode === 'signup' && (
                <StyledText
                  style={{
                    ...textStyles.caption,
                    color: colors.foreground.muted,
                    textAlign: 'center',
                    marginTop: spacing[4],
                    lineHeight: 16,
                    maxWidth: 300,
                    alignSelf: 'center',
                  }}
                >
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </StyledText>
              )}
            </VStack>
          </VStack>
            )}
        </KeyboardAvoidingView>
      </Screen>
    </>
  );
};