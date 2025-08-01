import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { 
  VStack, 
  HStack, 
  Card, 
  H3, 
  Body, 
  Caption,
  colors
} from '@/components/design-system';

export interface MealSummary {
  id: string;
  foodName: string;
  mealType: string;
  date: Date;
  childResponses: {
    childId: string;
    childName: string;
    response: 'eaten' | 'partial' | 'refused';
  }[];
  notes?: string;
}

interface MealSummaryCardProps {
  meal: MealSummary;
  onPress?: () => void;
  showChildren?: boolean;
}

export const MealSummaryCard: React.FC<MealSummaryCardProps> = ({
  meal,
  onPress,
  showChildren = true
}) => {
  const getResponseEmoji = (response: 'eaten' | 'partial' | 'refused') => {
    switch (response) {
      case 'eaten': return '✅';
      case 'partial': return '🟡';
      case 'refused': return '❌';
    }
  };

  const getResponseCount = () => {
    const eaten = meal.childResponses.filter(r => r.response === 'eaten').length;
    const partial = meal.childResponses.filter(r => r.response === 'partial').length;
    const refused = meal.childResponses.filter(r => r.response === 'refused').length;
    const total = meal.childResponses.length;

    return { eaten, partial, refused, total };
  };

  const counts = getResponseCount();
  const successRate = Math.round(((counts.eaten + counts.partial * 0.5) / counts.total) * 100);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress}>
      <Card>
        <VStack space={3}>
          {/* Header */}
          <HStack className="items-center justify-between">
            <VStack space={1}>
              <H3>{meal.foodName}</H3>
              <Caption className="text-foreground-muted">
                {meal.mealType} • {meal.date.toLocaleDateString()}
              </Caption>
            </VStack>
            
            {onPress && (
              <Text className="text-primary">→</Text>
            )}
          </HStack>

          {/* Success Rate */}
          <HStack className="items-center">
            <View className="flex-1">
              <HStack className="items-center justify-between mb-1">
                <Caption className="text-foreground-muted">Success Rate</Caption>
                <Caption 
                  className="font-medium"
                  style={{ 
                    color: successRate >= 75 ? colors.success.DEFAULT : 
                           successRate >= 50 ? colors.warning.DEFAULT : 
                           colors.error.DEFAULT 
                  }}
                >
                  {successRate}%
                </Caption>
              </HStack>
              <View className="h-2 bg-background-muted rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${successRate}%`,
                    backgroundColor: successRate >= 75 ? colors.success.DEFAULT : 
                                   successRate >= 50 ? colors.warning.DEFAULT : 
                                   colors.error.DEFAULT
                  }}
                />
              </View>
            </View>
          </HStack>

          {/* Child Responses */}
          {showChildren && (
            <VStack space={2}>
              <Caption className="text-foreground-muted font-medium">Responses:</Caption>
              <HStack space={3} className="flex-wrap">
                {meal.childResponses.map((response) => (
                  <HStack key={response.childId} className="items-center">
                    <Text className="mr-1">{getResponseEmoji(response.response)}</Text>
                    <Caption>{response.childName}</Caption>
                  </HStack>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Notes */}
          {meal.notes && (
            <View className="p-2 bg-background-secondary rounded border border-border">
              <Caption className="text-foreground-muted italic">"{meal.notes}"</Caption>
            </View>
          )}
        </VStack>
      </Card>
    </Wrapper>
  );
};

export default MealSummaryCard;