/**
 * LittleMeals Design System - Component Showcase
 * 
 * Demonstrates how all structural and interaction components work together.
 * This file serves as both documentation and testing for component integration.
 * 
 * Usage:
 * Import and use in development/storybook environment to test components
 */

import React, { useState } from 'react';
import {
  Screen,
  Container,
  VStack,
  HStack,
  Grid,
  H1,
  H2,
  H3,
  Body,
  Caption,
  Label,
  Button,
  Card,
  LoadingSpinner,
  LoadingOverlay,
  MessageAlert,
  ProgressIndicator,
  Toast,
  FadeIn,
  SlideIn,
  ScaleIn,
  Bounce,
  Pulse,
  Box,
  Flex,
  Center,
  Divider,
  Spacer,
  type ProgressStep,
} from './index';

/**
 * Component Showcase Demo
 * Shows all components working together in realistic layouts
 */
export const ComponentShowcase: React.FC = () => {
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const progressSteps: ProgressStep[] = [
    { id: '1', label: 'Setup Family', description: 'Create your family profile' },
    { id: '2', label: 'Add Children', description: 'Add your children\'s profiles' },
    { id: '3', label: 'First Meal', description: 'Log your first meal' },
    { id: '4', label: 'Complete Setup', description: 'Finish onboarding' },
  ];

  const handleNextStep = () => {
    if (currentProgress < progressSteps.length - 1) {
      setCurrentProgress(currentProgress + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentProgress > 0) {
      setCurrentProgress(currentProgress - 1);
    }
  };

  return (
    <Screen scrollable padding="none">
      {/* Header Section */}
      <Container padding="lg">
        <FadeIn duration="slow">
          <VStack spacing="md" align="center">
            <H1 align="center" color="text-primary-DEFAULT">
              LittleMeals Design System
            </H1>
            <Caption align="center" variant="muted">
              Structural and interaction components showcase
            </Caption>
          </VStack>
        </FadeIn>
      </Container>

      <Divider />

      {/* Layout Components Section */}
      <Container padding="lg">
        <SlideIn direction="up" delay={200}>
          <VStack spacing="lg">
            <H2>Layout Components</H2>
            
            {/* Grid Layout Example */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Grid Layout</H3>
                <Grid columns={2} gap="md">
                  <Card variant="outlined" padding="sm">
                    <Body size="sm" align="center">Item 1</Body>
                  </Card>
                  <Card variant="outlined" padding="sm">
                    <Body size="sm" align="center">Item 2</Body>
                  </Card>
                  <Card variant="outlined" padding="sm">
                    <Body size="sm" align="center">Item 3</Body>
                  </Card>
                  <Card variant="outlined" padding="sm">
                    <Body size="sm" align="center">Item 4</Body>
                  </Card>
                </Grid>
              </VStack>
            </Card>

            {/* Stack Layout Example */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Stack Layouts</H3>
                
                <Label>Vertical Stack (VStack):</Label>
                <VStack spacing="sm" className="bg-background-secondary p-3 rounded">
                  <Box className="bg-primary-light p-2 rounded">
                    <Body size="sm" align="center">Item A</Body>
                  </Box>
                  <Box className="bg-primary-light p-2 rounded">
                    <Body size="sm" align="center">Item B</Body>
                  </Box>
                  <Box className="bg-primary-light p-2 rounded">
                    <Body size="sm" align="center">Item C</Body>
                  </Box>
                </VStack>

                <Label>Horizontal Stack (HStack):</Label>
                <HStack spacing="sm" className="bg-background-secondary p-3 rounded">
                  <Box className="bg-success-light p-2 rounded flex-1">
                    <Body size="sm" align="center">Left</Body>
                  </Box>
                  <Box className="bg-warning-light p-2 rounded flex-1">
                    <Body size="sm" align="center">Center</Body>
                  </Box>
                  <Box className="bg-error-light p-2 rounded flex-1">
                    <Body size="sm" align="center">Right</Body>
                  </Box>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </SlideIn>
      </Container>

      <Divider />

      {/* Typography Section */}
      <Container padding="lg">
        <SlideIn direction="up" delay={400}>
          <VStack spacing="lg">
            <H2>Typography Hierarchy</H2>
            
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H1 size="2xl">Heading 1 - Hero Title</H1>
                <H2 size="xl">Heading 2 - Section Title</H2>
                <H3 size="lg">Heading 3 - Subsection</H3>
                <H4 size="md">Heading 4 - Content Header</H4>
                
                <Spacer size="sm" />
                
                <Body size="lg" variant="primary">
                  Large body text for important content and introductions.
                </Body>
                <Body size="md" variant="primary">
                  Regular body text for main content areas and descriptions.
                </Body>
                <Body size="sm" variant="secondary">
                  Small body text for secondary information.
                </Body>
                
                <Caption size="sm" variant="muted">
                  Caption text for metadata and additional context
                </Caption>
                
                <Label size="md" required>
                  Form Label (Required)
                </Label>
                <Label size="sm" disabled>
                  Disabled Label
                </Label>
              </VStack>
            </Card>
          </VStack>
        </SlideIn>
      </Container>

      <Divider />

      {/* Feedback Components Section */}
      <Container padding="lg">
        <SlideIn direction="up" delay={600}>
          <VStack spacing="lg">
            <H2>Feedback Components</H2>
            
            {/* Loading States */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Loading States</H3>
                
                <HStack spacing="lg" align="center">
                  <VStack spacing="sm" align="center">
                    <LoadingSpinner size="small" />
                    <Caption>Small</Caption>
                  </VStack>
                  <VStack spacing="sm" align="center">
                    <LoadingSpinner size="medium" />
                    <Caption>Medium</Caption>
                  </VStack>
                  <VStack spacing="sm" align="center">
                    <LoadingSpinner size="large" />
                    <Caption>Large</Caption>
                  </VStack>
                </HStack>

                <Button
                  variant="secondary"
                  onPress={() => setShowLoadingOverlay(true)}
                >
                  Show Loading Overlay (3s)
                </Button>
              </VStack>
            </Card>

            {/* Message Alerts */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Message Alerts</H3>
                
                <MessageAlert
                  type="success"
                  title="Success!"
                  message="Your meal has been logged successfully."
                />
                
                <MessageAlert
                  type="warning"
                  title="Warning"
                  message="Please check your internet connection."
                  dismissible
                  onDismiss={() => console.log('Warning dismissed')}
                />
                
                <MessageAlert
                  type="error"
                  title="Error"
                  message="Failed to save meal. Please try again."
                  action={{
                    label: 'Retry',
                    onPress: () => console.log('Retry pressed'),
                  }}
                />
                
                <MessageAlert
                  type="info"
                  message="Tip: You can use voice commands to log meals faster!"
                />
              </VStack>
            </Card>

            {/* Progress Steps */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Progress Indicator</H3>
                
                <ProgressIndicator
                  steps={progressSteps}
                  currentStep={currentProgress}
                  showLabels
                />
                
                <HStack spacing="md" justify="center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onPress={handlePrevStep}
                    disabled={currentProgress === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={handleNextStep}
                    disabled={currentProgress === progressSteps.length - 1}
                  >
                    Next
                  </Button>
                </HStack>
              </VStack>
            </Card>

            {/* Toast */}
            <Card variant="elevated" padding="md">
              <VStack spacing="md">
                <H3>Toast Notifications</H3>
                <Button
                  variant="primary"
                  onPress={() => setShowToast(true)}
                >
                  Show Toast Message
                </Button>
              </VStack>
            </Card>
          </VStack>
        </SlideIn>
      </Container>

      <Divider />

      {/* Animation Components Section */}
      <Container padding="lg">
        <SlideIn direction="up" delay={800}>
          <VStack spacing="lg">
            <H2>Animation Components</H2>
            
            <Grid columns={2} gap="md">
              <Card variant="outlined" padding="md">
                <Center>
                  <VStack spacing="md" align="center">
                    <ScaleIn loop>
                      <Box className="w-16 h-16 bg-primary-DEFAULT rounded-full" />
                    </ScaleIn>
                    <Caption>Scale In</Caption>
                  </VStack>
                </Center>
              </Card>
              
              <Card variant="outlined" padding="md">
                <Center>
                  <VStack spacing="md" align="center">
                    <Bounce loop>
                      <Box className="w-16 h-16 bg-success-DEFAULT rounded-full" />
                    </Bounce>
                    <Caption>Bounce</Caption>
                  </VStack>
                </Center>
              </Card>
              
              <Card variant="outlined" padding="md">
                <Center>
                  <VStack spacing="md" align="center">
                    <Pulse loop>
                      <Box className="w-16 h-16 bg-warning-DEFAULT rounded-full" />
                    </Pulse>
                    <Caption>Pulse</Caption>
                  </VStack>
                </Center>
              </Card>
              
              <Card variant="outlined" padding="md">
                <Center>
                  <VStack spacing="md" align="center">
                    <FadeIn loop>
                      <Box className="w-16 h-16 bg-error-DEFAULT rounded-full" />
                    </FadeIn>
                    <Caption>Fade In</Caption>
                  </VStack>
                </Center>
              </Card>
            </Grid>
          </VStack>
        </SlideIn>
      </Container>

      {/* Integration Example - Meal Logging Card */}
      <Container padding="lg">
        <SlideIn direction="up" delay={1000}>
          <VStack spacing="lg">
            <H2>Real-World Integration Example</H2>
            
            <Card variant="elevated" padding="lg">
              <VStack spacing="md">
                <HStack justify="between" align="center">
                  <H3>Today's Breakfast</H3>
                  <Caption variant="muted">8:30 AM</Caption>
                </HStack>
                
                <Body>Ragi oat banana pancakes</Body>
                
                <Divider />
                
                <VStack spacing="sm">
                  <Label>Children's Responses:</Label>
                  
                  <HStack spacing="md" wrap>
                    <Flex direction="row" align="center" className="bg-success-light px-3 py-2 rounded-full">
                      <Body size="sm" weight="medium">Sam: Eaten ✅</Body>
                    </Flex>
                    <Flex direction="row" align="center" className="bg-warning-light px-3 py-2 rounded-full">
                      <Body size="sm" weight="medium">Sebbie: Partial 🟡</Body>
                    </Flex>
                    <Flex direction="row" align="center" className="bg-error-light px-3 py-2 rounded-full">
                      <Body size="sm" weight="medium">Dee: Refused ❌</Body>
                    </Flex>
                  </HStack>
                </VStack>
                
                <Caption variant="muted">
                  "Dee refused because he could see the banana in the pancake"
                </Caption>
                
                <HStack spacing="md" justify="end">
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <Button variant="primary" size="sm">
                    Share
                  </Button>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </SlideIn>
      </Container>

      {/* Bottom spacing */}
      <Spacer size="lg" />

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={showLoadingOverlay}
        message="Processing meal data..."
        onAnimationEnd={() => {
          setTimeout(() => setShowLoadingOverlay(false), 3000);
        }}
      />

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        type="success"
        message="Components are working perfectly together! 🎉"
        onHide={() => setShowToast(false)}
      />
    </Screen>
  );
};

export default ComponentShowcase;