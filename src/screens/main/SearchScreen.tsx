import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard
} from 'react-native';
import { 
  Screen, 
  Container, 
  VStack, 
  HStack, 
  Card, 
  Button, 
  Input,
  H1, 
  H2, 
  H3, 
  Body, 
  Caption,
  PrimaryButton,
  colors
} from '@/components/design-system';

// Mock chat data
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

const mockSuggestions = [
  "When did Emma last eat bananas?",
  "What foods does Sam refuse most?",
  "Show me Dee's eating patterns this week",
  "What should I try serving for breakfast?",
  "How has acceptance improved lately?",
  "Generate a shopping list"
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your smart family meal assistant. I can help you understand eating patterns, find insights, and answer questions about your family's meals. What would you like to know?",
    isUser: false,
    timestamp: new Date(),
    suggestions: mockSuggestions.slice(0, 3)
  }
];


const SearchScreen = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateMockResponse(messageText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (userMessage: string): Message => {
    // Mock AI responses based on user input
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('banana') || lowerMessage.includes('when')) {
      return {
        id: Date.now().toString(),
        text: "Emma last had bananas 3 days ago at breakfast. She ate them completely! 🍌 Based on her history, she has a 87% acceptance rate with bananas. Would you like to see more details about her fruit preferences?",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Show fruit preferences", "What about other kids?", "Suggest similar foods"]
      };
    }
    
    if (lowerMessage.includes('refuse') || lowerMessage.includes('sam')) {
      return {
        id: Date.now().toString(),
        text: "Sam's most refused foods this month are: 1) Broccoli (refused 8/10 times), 2) Green beans (refused 6/8 times), 3) Cauliflower (refused 4/5 times). Tip: Try mixing these with foods he loves like cheese or pasta! 🧀",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Show mixing suggestions", "What does Sam love?", "Try different cooking methods"]
      };
    }
    
    if (lowerMessage.includes('pattern') || lowerMessage.includes('dee')) {
      return {
        id: Date.now().toString(),
        text: "Dee-Dee-Dee's eating patterns this week:\n• Breakfast: 95% acceptance (best time!)\n• Lunch: 72% acceptance\n• Dinner: 68% acceptance\n• Snacks: 85% acceptance\n\nShe's most adventurous on weekends and responds well to family-style meals. 📊",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Plan weekend meals", "Family meal ideas", "Best breakfast foods"]
      };
    }
    
    if (lowerMessage.includes('breakfast') || lowerMessage.includes('serve')) {
      return {
        id: Date.now().toString(),
        text: "Based on your family's preferences, here are great breakfast options:\n• Pancakes (95% family acceptance) 🥞\n• Yogurt with berries (88% acceptance)\n• Scrambled eggs (82% acceptance)\n• Oatmeal with banana (79% acceptance)\n\nWant me to create a breakfast rotation schedule?",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Create rotation schedule", "Show recipe ideas", "Nutrition balance tips"]
      };
    }
    
    if (lowerMessage.includes('shopping') || lowerMessage.includes('list')) {
      return {
        id: Date.now().toString(),
        text: "I've created a smart shopping list based on your family's preferences and recent meals:\n\n🥞 Breakfast items: Pancake mix, eggs, milk, berries\n🍎 Snacks: Apples, yogurt, cheese sticks\n🥕 Try-again foods: Carrots, sweet potato\n\nShould I organize this by store sections?",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Organize by store", "Add quantities", "Export to notes"]
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: "I understand you're asking about meal patterns and preferences. Let me help you with that! I can analyze your family's eating data to provide insights about acceptance rates, timing patterns, and food preferences. What specific aspect would you like to explore?",
      isUser: false,
      timestamp: new Date(),
      suggestions: ["Show acceptance rates", "Analyze meal timing", "Food preferences by child"]
    };
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const renderMessage = (message: Message) => {
    return (
      <VStack key={message.id} space={3} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] p-4 rounded-2xl ${
          message.isUser 
            ? 'bg-primary rounded-br-md' 
            : 'bg-background-card border border-border rounded-bl-md'
        }`}>
          <Body className={message.isUser ? 'text-primary-foreground' : 'text-foreground'}>
            {message.text}
          </Body>
        </View>
        
        {message.suggestions && (
          <VStack space={2} className="w-full">
            <Caption className="text-foreground-muted ml-2">Suggested questions:</Caption>
            <HStack space={2} className="flex-wrap">
              {message.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className="px-3 py-2 bg-background-secondary border border-border rounded-full"
                >
                  <Caption className="text-primary">{suggestion}</Caption>
                </TouchableOpacity>
              ))}
            </HStack>
          </VStack>
        )}
        
        <Caption className={`text-foreground-light ${message.isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Caption>
      </VStack>
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <Container>
          <VStack space={2} className="py-4 border-b border-border">
            <HStack className="items-center justify-center">
              <Text className="text-2xl mr-2">🤖</Text>
              <H1>Smart Search</H1>
            </HStack>
            <Caption className="text-center text-foreground-muted">
              Ask me anything about your family's meals
            </Caption>
          </VStack>
        </Container>

        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Container>
            <VStack space={4} className="py-4">
              {/* Quick Start Suggestions */}
              {messages.length === 1 && (
                <Card>
                  <VStack space={3}>
                    <H3>Popular questions:</H3>
                    <VStack space={2}>
                      {mockSuggestions.slice(3).map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSuggestionPress(suggestion)}
                          className="p-3 bg-background-secondary rounded-lg border border-border"
                        >
                          <HStack className="items-center justify-between">
                            <Body>{suggestion}</Body>
                            <Text className="text-primary">→</Text>
                          </HStack>
                        </TouchableOpacity>
                      ))}
                    </VStack>
                  </VStack>
                </Card>
              )}
              
              {/* Messages */}
              {messages.map(renderMessage)}
              
              {/* Typing Indicator */}
              {isTyping && (
                <HStack className="items-center space-x-2 ml-4">
                  <View className="w-8 h-8 bg-background-card border border-border rounded-full items-center justify-center">
                    <Text>🤖</Text>
                  </View>
                  <View className="px-4 py-2 bg-background-card border border-border rounded-2xl rounded-bl-md">
                    <HStack space={1} className="items-center">
                      <View className="w-2 h-2 bg-foreground-muted rounded-full opacity-40" />
                      <View className="w-2 h-2 bg-foreground-muted rounded-full opacity-60" />
                      <View className="w-2 h-2 bg-foreground-muted rounded-full opacity-80" />
                    </HStack>
                  </View>
                </HStack>
              )}
            </VStack>
          </Container>
        </ScrollView>

        {/* Input Area */}
        <Container>
          <VStack space={3} className="py-4 border-t border-border">
            <HStack space={3} className="items-end">
              <View className="flex-1">
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask about meals, patterns, or get suggestions..."
                  multiline
                  maxLength={500}
                  className="bg-background-card border border-border rounded-2xl px-4 py-3 text-base text-foreground min-h-[44px] max-h-[120px]"
                  placeholderTextColor={colors.foreground.muted}
                  onSubmitEditing={() => handleSendMessage()}
                  blurOnSubmit={false}
                />
              </View>
              
              <TouchableOpacity
                onPress={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() ? 'bg-primary' : 'bg-background-muted'
                }`}
              >
                <Text className={`text-xl ${inputText.trim() ? 'text-primary-foreground' : 'text-foreground-muted'}`}>
                  ↑
                </Text>
              </TouchableOpacity>
            </HStack>
            
            {/* Quick Actions */}
            <HStack space={2} className="flex-wrap">
              <TouchableOpacity
                onPress={() => handleSendMessage("Show me today's meal summary")}
                className="px-3 py-1 bg-background-secondary rounded-full border border-border"
              >
                <Caption>📊 Today's summary</Caption>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleSendMessage("What should I serve for dinner?")}
                className="px-3 py-1 bg-background-secondary rounded-full border border-border"
              >
                <Caption>🍽️ Dinner ideas</Caption>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleSendMessage("Generate shopping list")}
                className="px-3 py-1 bg-background-secondary rounded-full border border-border"
              >
                <Caption>🛒 Shopping list</Caption>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </Container>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default SearchScreen;