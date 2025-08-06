import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { 
  VStack, 
  HStack, 
  Card, 
  Button, 
  Input, 
  H3, 
  Body, 
  Caption,
  PrimaryButton,
  colors
} from '@/components/design-system';
import { FoodAutocomplete } from './FoodAutocomplete';
import { DatePicker } from './DatePicker';

export interface MealData {
  foodName: string;
  mealType: string;
  date: Date;
  childResponses: ChildResponse[];
  notes: string;
}

export interface ChildResponse {
  childId: string;
  response: 'eaten' | 'partial' | 'refused' | null;
}

export interface Child {
  id: string;
  name: string;
  age: number;
}

interface MealLoggingFormProps {
  children: Child[];
  onSave: (mealData: MealData) => void;
  onReset?: () => void;
  initialData?: Partial<MealData>;
  lastMealType?: string;
  foodHistory?: any[];
}

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Smart meal type based on current time
const getSmartMealType = (lastMealType?: string): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 19) return 'Dinner';
  return lastMealType || 'Snack';
};

export const MealLoggingForm: React.FC<MealLoggingFormProps> = ({
  children,
  onSave,
  onReset,
  initialData,
  lastMealType,
  foodHistory = []
}) => {
  const [foodName, setFoodName] = useState(initialData?.foodName || '');
  const [selectedMealType, setSelectedMealType] = useState(
    initialData?.mealType || getSmartMealType(lastMealType)
  );
  const [selectedDate, setSelectedDate] = useState(initialData?.date || new Date());
  const [childResponses, setChildResponses] = useState<ChildResponse[]>(
    initialData?.childResponses || children.map(child => ({ childId: child.id, response: null }))
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const foodInputRef = useRef<TextInput>(null);

  // Auto-focus food input when form loads
  useEffect(() => {
    const timer = setTimeout(() => {
      foodInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChildResponse = useCallback((childId: string, response: 'eaten' | 'partial' | 'refused' | null) => {
    setChildResponses(prev => 
      prev.map(cr => 
        cr.childId === childId ? { ...cr, response } : cr
      )
    );
  }, []);

  // Quick actions for all children
  const handleAllAte = useCallback(() => {
    setChildResponses(prev => 
      prev.map(cr => ({ ...cr, response: 'eaten' as const }))
    );
  }, []);

  const handleAllRefused = useCallback(() => {
    setChildResponses(prev => 
      prev.map(cr => ({ ...cr, response: 'refused' as const }))
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!foodName.trim()) {
      Alert.alert('Missing Food', 'Please enter what you served');
      return;
    }

    const allResponsesSet = childResponses.every(cr => cr.response !== null);
    if (!allResponsesSet) {
      Alert.alert('Missing Responses', 'Please set responses for all children');
      return;
    }

    const mealData: MealData = {
      foodName: foodName.trim(),
      mealType: selectedMealType,
      date: selectedDate,
      childResponses,
      notes: notes.trim()
    };

    onSave(mealData);
  }, [foodName, selectedMealType, selectedDate, childResponses, notes, onSave]);

  const handleReset = useCallback(() => {
    setFoodName('');
    setSelectedMealType(getSmartMealType(lastMealType));
    setSelectedDate(new Date());
    setChildResponses(children.map(child => ({ childId: child.id, response: null })));
    setNotes('');
    onReset?.();
    // Refocus food input after reset
    setTimeout(() => foodInputRef.current?.focus(), 100);
  }, [children, lastMealType, onReset]);

  const getResponseColor = (response: 'eaten' | 'partial' | 'refused' | null) => {
    switch (response) {
      case 'eaten': return colors.responses.eaten.DEFAULT;
      case 'partial': return colors.responses.partial.DEFAULT;
      case 'refused': return colors.responses.refused.DEFAULT;
      default: return colors.border.DEFAULT;
    }
  };

  const getResponseEmoji = (response: 'eaten' | 'partial' | 'refused' | null) => {
    switch (response) {
      case 'eaten': return '✅';
      case 'partial': return '🟡';
      case 'refused': return '❌';
      default: return '⚪';
    }
  };

  return (
    <VStack space={6}>
      {/* Date and Meal Type Selection */}
      <Card>
        <VStack space={4}>
          <HStack className="items-center justify-between">
            <H3>Meal Details</H3>
            <DatePicker 
              value={selectedDate}
              onChange={setSelectedDate}
              buttonStyle={{ paddingVertical: 8, paddingHorizontal: 12 }}
            />
          </HStack>
          <HStack space={2} className="flex-wrap">
            {mealTypes.map((mealType) => (
              <TouchableOpacity
                key={mealType}
                onPress={() => setSelectedMealType(mealType)}
                className={`px-4 py-2 rounded-lg border-2 ${
                  selectedMealType === mealType 
                    ? 'border-primary bg-primary-light' 
                    : 'border-border bg-background-card'
                }`}
              >
                <Body className={selectedMealType === mealType ? 'text-primary-foreground' : 'text-foreground'}>
                  {mealType}
                </Body>
              </TouchableOpacity>
            ))}
          </HStack>
        </VStack>
      </Card>

      {/* Food Input with Autocomplete */}
      <Card style={{ overflow: 'visible', zIndex: 1 }}>
        <VStack space={4} className="overflow-visible">
          <H3>What did you serve?</H3>
          <View style={{ overflow: 'visible', zIndex: 100 }}>
            <FoodAutocomplete
              value={foodName}
              onChangeText={setFoodName}
              foodHistory={foodHistory}
              placeholder="Start typing food name..."
              maxSuggestions={5}
            />
          </View>
        </VStack>
      </Card>

      {/* Child Responses */}
      <Card>
        <VStack space={4}>
          <HStack className="items-center justify-between">
            <H3>How did each child respond?</H3>
            <HStack space={2}>
              <TouchableOpacity
                onPress={handleAllAte}
                className="px-3 py-1 bg-responses-eaten-light border border-responses-eaten rounded-md"
              >
                <Caption className="text-responses-eaten-foreground font-medium">All Ate</Caption>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAllRefused}
                className="px-3 py-1 bg-responses-refused-light border border-responses-refused rounded-md"
              >
                <Caption className="text-responses-refused-foreground font-medium">All Refused</Caption>
              </TouchableOpacity>
            </HStack>
          </HStack>
          
          {children.map((child) => {
            const childResponse = childResponses.find(cr => cr.childId === child.id);
            
            return (
              <VStack key={child.id} space={3}>
                <HStack className="items-center justify-between">
                  <VStack space={1}>
                    <Body className="font-medium">{child.name}</Body>
                    <Caption className="text-foreground-muted">{child.age} years old</Caption>
                  </VStack>
                  <View className="w-8 h-8 rounded-full items-center justify-center border-2"
                        style={{ borderColor: getResponseColor(childResponse?.response || null) }}>
                    <Text className="text-lg">{getResponseEmoji(childResponse?.response || null)}</Text>
                  </View>
                </HStack>
                
                <HStack space={3}>
                  <TouchableOpacity
                    onPress={() => handleChildResponse(child.id, 'eaten')}
                    className={`flex-1 py-4 px-3 rounded-lg border-2 items-center ${
                      childResponse?.response === 'eaten'
                        ? 'border-responses-eaten bg-responses-eaten-light'
                        : 'border-border bg-background-card'
                    }`}
                  >
                    <Text className="text-2xl mb-1">✅</Text>
                    <Caption className="text-center font-medium">Eaten</Caption>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleChildResponse(child.id, 'partial')}
                    className={`flex-1 py-4 px-3 rounded-lg border-2 items-center ${
                      childResponse?.response === 'partial'
                        ? 'border-responses-partial bg-responses-partial-light'
                        : 'border-border bg-background-card'
                    }`}
                  >
                    <Text className="text-2xl mb-1">🟡</Text>
                    <Caption className="text-center font-medium">Some</Caption>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleChildResponse(child.id, 'refused')}
                    className={`flex-1 py-4 px-3 rounded-lg border-2 items-center ${
                      childResponse?.response === 'refused'
                        ? 'border-responses-refused bg-responses-refused-light'
                        : 'border-border bg-background-card'
                    }`}
                  >
                    <Text className="text-2xl mb-1">❌</Text>
                    <Caption className="text-center font-medium">Refused</Caption>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            );
          })}
        </VStack>
      </Card>

      {/* Notes */}
      <Card>
        <VStack space={3}>
          <H3>Notes (optional)</H3>
          <Input
            placeholder="Any observations about the meal?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </VStack>
      </Card>

      {/* Action Buttons */}
      <VStack space={3}>
        <PrimaryButton onPress={handleSave} size="large">
          <Text className="text-lg font-semibold text-primary-foreground">
            Save & Sync to Family
          </Text>
        </PrimaryButton>
        
        <Button variant="outline" onPress={handleReset} size="large">
          <Text className="text-primary">Clear Form</Text>
        </Button>
      </VStack>
    </VStack>
  );
};

export default MealLoggingForm;