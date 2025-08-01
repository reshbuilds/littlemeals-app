import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { 
  Screen, 
  Container, 
  VStack, 
  HStack, 
  Card, 
  Button, 
  H1, 
  H2, 
  H3, 
  Body, 
  Caption,
  colors
} from '@/components/design-system';

// Mock data for demonstration
const mockChildren = [
  { id: '1', name: 'Sam', age: 4, avatar: '👦' },
  { id: '2', name: 'Sebbie', age: 2, avatar: '👶' },
  { id: '3', name: 'Dee-Dee-Dee', age: 6, avatar: '🧒' }
];

const mockWeeklyStats = {
  totalMeals: 47,
  averageAcceptanceRate: 78,
  mostLovedFood: 'Pancakes',
  challengingFood: 'Broccoli',
  bestMealTime: 'Breakfast'
};

const mockFoodTrends = [
  { food: 'Pancakes', acceptance: 95, attempts: 12 },
  { food: 'Banana', acceptance: 87, attempts: 15 },
  { food: 'Yogurt', acceptance: 82, attempts: 18 },
  { food: 'Chicken nuggets', acceptance: 91, attempts: 8 },
  { food: 'Broccoli', acceptance: 34, attempts: 22 }
];

const mockRecentInsights = [
  "Sam's acceptance rate has improved 15% this week!",
  "Breakfast shows the highest success rate across all children",
  "Dee-Dee-Dee is more likely to try new foods on weekends",
  "Family meal times have the best acceptance rates"
];

const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const InsightsScreen = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedChild, setSelectedChild] = useState('all');

  const getAcceptanceColor = (percentage: number) => {
    if (percentage >= 80) return colors.responses.eaten.DEFAULT;
    if (percentage >= 60) return colors.responses.partial.DEFAULT;
    return colors.responses.refused.DEFAULT;
  };

  const renderChartPlaceholder = (title: string, height: number = 150) => (
    <View 
      className="border-2 border-dashed border-border rounded-lg items-center justify-center bg-background-secondary"
      style={{ height }}
    >
      <Text className="text-4xl mb-2">📊</Text>
      <Caption className="text-foreground-muted text-center">{title}</Caption>
      <Caption className="text-foreground-light text-center mt-1">Chart coming soon</Caption>
    </View>
  );

  const timeframeOptions = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: '3 Months' }
  ];

  return (
    <Screen>
      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Container>
          <VStack space={6} className="py-4">
            
            {/* Header Section */}
            <VStack space={4}>
              <H1 className="text-center">Family Insights</H1>
              
              {/* Time Range Selector */}
              <HStack space={2} className="justify-center">
                {timeframeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setSelectedTimeframe(option.key)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedTimeframe === option.key 
                        ? 'border-primary bg-primary-light' 
                        : 'border-border bg-background-card'
                    }`}
                  >
                    <Caption className={selectedTimeframe === option.key ? 'text-primary-foreground' : 'text-foreground'}>
                      {option.label}
                    </Caption>
                  </TouchableOpacity>
                ))}
              </HStack>
            </VStack>

            {/* Quick Stats Overview */}
            <Card>
              <VStack space={4}>
                <H3>Weekly Overview</H3>
                
                <HStack space={4} className="justify-between">
                  <VStack space={1} className="items-center flex-1">
                    <Text className="text-2xl font-bold text-primary">{mockWeeklyStats.totalMeals}</Text>
                    <Caption className="text-center">Meals Logged</Caption>
                  </VStack>
                  
                  <VStack space={1} className="items-center flex-1">
                    <Text className="text-2xl font-bold" style={{ color: getAcceptanceColor(mockWeeklyStats.averageAcceptanceRate) }}>
                      {mockWeeklyStats.averageAcceptanceRate}%
                    </Text>
                    <Caption className="text-center">Acceptance Rate</Caption>
                  </VStack>
                  
                  <VStack space={1} className="items-center flex-1">
                    <Text className="text-2xl">🥞</Text>
                    <Caption className="text-center">Most Loved</Caption>
                  </VStack>
                </HStack>
              </VStack>
            </Card>

            {/* Child Selector */}
            <Card>
              <VStack space={3}>
                <H3>View by Child</H3>
                <HStack space={2} className="flex-wrap">
                  <TouchableOpacity
                    onPress={() => setSelectedChild('all')}
                    className={`px-4 py-2 rounded-lg border-2 flex-row items-center ${
                      selectedChild === 'all' 
                        ? 'border-primary bg-primary-light' 
                        : 'border-border bg-background-card'
                    }`}
                  >
                    <Text className="mr-2">👨‍👩‍👧‍👦</Text>
                    <Body className={selectedChild === 'all' ? 'text-primary-foreground' : 'text-foreground'}>
                      All Children
                    </Body>
                  </TouchableOpacity>
                  
                  {mockChildren.map((child) => (
                    <TouchableOpacity
                      key={child.id}
                      onPress={() => setSelectedChild(child.id)}
                      className={`px-4 py-2 rounded-lg border-2 flex-row items-center ${
                        selectedChild === child.id 
                          ? 'border-primary bg-primary-light' 
                          : 'border-border bg-background-card'
                      }`}
                    >
                      <Text className="mr-2">{child.avatar}</Text>
                      <Body className={selectedChild === child.id ? 'text-primary-foreground' : 'text-foreground'}>
                        {child.name}
                      </Body>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </VStack>
            </Card>

            {/* Eating Patterns Chart */}
            <Card>
              <VStack space={4}>
                <HStack className="items-center justify-between">
                  <H3>Eating Patterns</H3>
                  <TouchableOpacity>
                    <Caption className="text-primary">View Details</Caption>
                  </TouchableOpacity>
                </HStack>
                {renderChartPlaceholder("Weekly eating patterns by meal time", 180)}
              </VStack>
            </Card>

            {/* Food Acceptance Trends */}
            <Card>
              <VStack space={4}>
                <H3>Food Acceptance Trends</H3>
                
                {mockFoodTrends.map((item, index) => (
                  <HStack key={index} className="items-center justify-between">
                    <VStack space={1} className="flex-1">
                      <Body className="font-medium">{item.food}</Body>
                      <Caption className="text-foreground-muted">{item.attempts} attempts</Caption>
                    </VStack>
                    
                    <VStack space={1} className="items-end">
                      <Body className="font-medium" style={{ color: getAcceptanceColor(item.acceptance) }}>
                        {item.acceptance}%
                      </Body>
                      <View className="w-20 h-2 bg-background-muted rounded-full overflow-hidden">
                        <View 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${item.acceptance}%`,
                            backgroundColor: getAcceptanceColor(item.acceptance)
                          }}
                        />
                      </View>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Card>

            {/* Nutrition Balance Chart */}
            <Card>
              <VStack space={4}>
                <HStack className="items-center justify-between">
                  <H3>Nutrition Balance</H3>
                  <TouchableOpacity>
                    <Caption className="text-primary">Export Report</Caption>
                  </TouchableOpacity>
                </HStack>
                {renderChartPlaceholder("Food group distribution over time", 160)}
              </VStack>
            </Card>

            {/* AI Insights */}
            <Card>
              <VStack space={4}>
                <HStack className="items-center">
                  <Text className="mr-2">🤖</Text>
                  <H3>Smart Insights</H3>
                </HStack>
                
                <VStack space={3}>
                  {mockRecentInsights.map((insight, index) => (
                    <HStack key={index} className="items-start">
                      <View className="w-2 h-2 rounded-full bg-primary mt-2 mr-3" />
                      <Body className="flex-1">{insight}</Body>
                    </HStack>
                  ))}
                </VStack>
                
                <TouchableOpacity className="mt-2">
                  <HStack className="items-center justify-center py-2">
                    <Text className="text-primary mr-2">Ask AI a question</Text>
                    <Text className="text-primary">→</Text>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </Card>

            {/* Quick Actions */}
            <Card>
              <VStack space={4}>
                <H3>Quick Actions</H3>
                
                <VStack space={3}>
                  <TouchableOpacity className="p-4 bg-background-secondary rounded-lg border border-border">
                    <HStack className="items-center justify-between">
                      <HStack className="items-center">
                        <Text className="text-2xl mr-3">📄</Text>
                        <VStack space={1}>
                          <Body className="font-medium">Generate Pediatrician Report</Body>
                          <Caption className="text-foreground-muted">Weekly eating summary</Caption>
                        </VStack>
                      </HStack>
                      <Text className="text-primary">→</Text>
                    </HStack>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="p-4 bg-background-secondary rounded-lg border border-border">
                    <HStack className="items-center justify-between">
                      <HStack className="items-center">
                        <Text className="text-2xl mr-3">🛒</Text>
                        <VStack space={1}>
                          <Body className="font-medium">Smart Shopping List</Body>
                          <Caption className="text-foreground-muted">Based on preferences</Caption>
                        </VStack>
                      </HStack>
                      <Text className="text-primary">→</Text>
                    </HStack>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="p-4 bg-background-secondary rounded-lg border border-border">
                    <HStack className="items-center justify-between">
                      <HStack className="items-center">
                        <Text className="text-2xl mr-3">📊</Text>
                        <VStack space={1}>
                          <Body className="font-medium">Export Data</Body>
                          <Caption className="text-foreground-muted">CSV or PDF format</Caption>
                        </VStack>
                      </HStack>
                      <Text className="text-primary">→</Text>
                    </HStack>
                  </TouchableOpacity>
                </VStack>
              </VStack>
            </Card>

            <View className="pb-8" />

          </VStack>
        </Container>
      </StyledScrollView>
    </Screen>
  );
};

export default InsightsScreen;