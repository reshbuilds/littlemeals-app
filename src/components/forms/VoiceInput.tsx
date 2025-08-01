import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';
import { 
  VStack, 
  HStack, 
  Card, 
  Button, 
  H3, 
  Body, 
  Caption,
  colors
} from '@/components/design-system';

interface VoiceInputProps {
  onVoiceResult?: (text: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onVoiceResult,
  onVoiceStart,
  onVoiceEnd,
  disabled = false,
  placeholder = "Tap to speak..."
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startRecording = () => {
    if (disabled) return;
    
    setIsRecording(true);
    setTranscriptText('');
    onVoiceStart?.();
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate voice recording process
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    onVoiceEnd?.();
    
    // Simulate voice-to-text conversion
    setTimeout(() => {
      const mockTranscript = "Breakfast pancakes - Sam ate, Sebbie refused, Dee ate some";
      setTranscriptText(mockTranscript);
      onVoiceResult?.(mockTranscript);
    }, 1000);
  };

  const clearTranscript = () => {
    setTranscriptText('');
  };

  return (
    <Card>
      <VStack space={4}>
        <HStack className="items-center">
          <Text className="text-2xl mr-2">🎤</Text>
          <H3>Voice Logging</H3>
        </HStack>
        
        <VStack space={4} className="items-center">
          {/* Voice Button */}
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className="items-center justify-center"
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
              className={`w-20 h-20 rounded-full items-center justify-center border-4 ${
                isRecording 
                  ? 'bg-error border-error' 
                  : disabled 
                    ? 'bg-background-muted border-border'
                    : 'bg-primary border-primary'
              }`}
            >
              <Text className="text-3xl">
                {isRecording ? '⏹️' : '🎤'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          {/* Status Text */}
          <VStack space={1} className="items-center">
            <Body className="font-medium text-center">
              {isRecording 
                ? 'Listening...' 
                : transcriptText 
                  ? 'Voice captured!' 
                  : placeholder
              }
            </Body>
            
            {isRecording && (
              <Caption className="text-foreground-muted text-center">
                Tap to stop recording
              </Caption>
            )}
          </VStack>
          
          {/* Audio Level Indicator */}
          {isRecording && (
            <HStack space={1} className="items-center">
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{
                    height: Math.random() * 20 + 10,
                    opacity: Math.random() * 0.5 + 0.5
                  }}
                />
              ))}
            </HStack>
          )}
        </VStack>
        
        {/* Transcript Display */}
        {transcriptText && (
          <VStack space={3}>
            <View className="p-3 bg-background-secondary rounded-lg border border-border">
              <Body className="text-foreground">{transcriptText}</Body>
            </View>
            
            <HStack space={2}>
              <TouchableOpacity 
                onPress={clearTranscript}
                className="flex-1 py-2 px-4 bg-background-card border border-border rounded-lg items-center"
              >
                <Caption className="text-foreground-muted">Clear</Caption>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {}}
                className="flex-1 py-2 px-4 bg-primary border border-primary rounded-lg items-center"
              >
                <Caption className="text-primary-foreground font-medium">Use This</Caption>
              </TouchableOpacity>
            </HStack>
          </VStack>
        )}
        
        {/* Tips */}
        {!isRecording && !transcriptText && (
          <VStack space={2}>
            <Caption className="text-foreground-muted font-medium">Voice tips:</Caption>
            <VStack space={1}>
              <Caption className="text-foreground-light">• Say meal type, food, then responses</Caption>
              <Caption className="text-foreground-light">• Example: "Breakfast pancakes - Sam ate, Dee refused"</Caption>
              <Caption className="text-foreground-light">• Speak clearly and at normal pace</Caption>
            </VStack>
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

export default VoiceInput;