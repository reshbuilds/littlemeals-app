import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
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
}

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const MealLoggingForm: React.FC<MealLoggingFormProps> = ({
  children,
  onSave,
  onReset,
  initialData
}) => {
  const [foodName, setFoodName] = useState(initialData?.foodName || '');
  const [selectedMealType, setSelectedMealType] = useState(initialData?.mealType || 'Breakfast');
  const [childResponses, setChildResponses] = useState<ChildResponse[]>(
    initialData?.childResponses || children.map(child => ({ childId: child.id, response: null }))
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleChildResponse = (childId: string, response: 'eaten' | 'partial' | 'refused' | null) => {
    setChildResponses(prev => 
      prev.map(cr => 
        cr.childId === childId ? { ...cr, response } : cr
      )
    );
  };

  const handleSave = () => {
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
      date: new Date(),
      childResponses,
      notes: notes.trim()
    };

    onSave(mealData);
  };

  const handleReset = () => {
    setFoodName('');
    setSelectedMealType('Breakfast');
    setChildResponses(children.map(child => ({ childId: child.id, response: null })));
    setNotes('');
    onReset?.();
  };

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
      {/* Meal Type Selection */}
      <Card>
        <VStack space={4}>
          <H3>Meal Type</H3>
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

      {/* Food Input */}
      <Card>
        <VStack space={4}>
          <H3>What did you serve?</H3>
          <Input
            placeholder="Enter food name..."
            value={foodName}
            onChangeText={setFoodName}
            size="large"
          />
        </VStack>
      </Card>

      {/* Child Responses */}
      <Card>
        <VStack space={4}>
          <H3>How did each child respond?</H3>
          
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