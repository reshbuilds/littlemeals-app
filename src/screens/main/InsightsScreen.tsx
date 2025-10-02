import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { 
  Screen, 
  Container, 
  VStack, 
  HStack,
  Body,
  Caption,
  H1
} from '../../components/design-system';
import {
  FoodTrendsChart,
  ProgressChart
} from '../../components/charts';
import { exportAsPDF, shareTextSummary } from '../../utils/exportUtils';

// Mock data for charts
const mockFoodTrends = [
  { 
    name: 'Pancakes', 
    acceptance: [95, 87, 92, 85, 90, 94, 88], 
    dates: ['2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26'],
    totalAttempts: 12 
  },
  { 
    name: 'Broccoli', 
    acceptance: [34, 28, 42, 38, 45, 52, 49], 
    dates: ['2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26'],
    totalAttempts: 22 
  },
  { 
    name: 'Banana', 
    acceptance: [87, 85, 90, 82, 88, 91, 86], 
    dates: ['2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26'],
    totalAttempts: 15 
  }
];

const mockChildProgress = [
  {
    id: '1',
    name: 'Sam',
    age: 4,
    avatar: '👦',
    metrics: {
      varietyScore: 0.85,
      acceptanceRate: 0.78,
      adventurinessScore: 0.72,
      consistencyScore: 0.88
    },
    weeklyChange: {
      variety: 0.08,
      acceptance: 0.12,
      adventuriness: 0.15,
      consistency: 0.02
    }
  },
  {
    id: '2',
    name: 'Sebbie',
    age: 2,
    avatar: '👶',
    metrics: {
      varietyScore: 0.62,
      acceptanceRate: 0.84,
      adventurinessScore: 0.45,
      consistencyScore: 0.76
    },
    weeklyChange: {
      variety: 0.04,
      acceptance: -0.02,
      adventuriness: 0.08,
      consistency: 0.06
    }
  }
];



const InsightsScreen = () => {
  const [selectedFood, setSelectedFood] = useState<string>('Pancakes');
  const [selectedChild, setSelectedChild] = useState<string>('1');

  const handleExportPDF = async () => {
    const selectedChildData = mockChildProgress.find(child => child.id === selectedChild);
    const exportData = {
      title: 'LittleMeals Family Report',
      timeframe: 'This Week',
      childName: selectedChildData?.name,
      totalMeals: 47,
      acceptanceRate: 78,
      foodTrends: mockFoodTrends.map(trend => ({
        name: trend.name,
        acceptance: Math.round(trend.acceptance.reduce((sum, val) => sum + val, 0) / trend.acceptance.length),
        attempts: trend.totalAttempts,
      })),
      insights: [
        `${selectedChildData?.name || 'Child'}'s acceptance rate has improved this week`,
        'Breakfast shows the highest success rate',
        'Nutrition balance is improving with more variety',
        'Consider introducing new vegetables gradually'
      ]
    };

    await exportAsPDF(exportData);
  };

  const handleShareSummary = async () => {
    const selectedChildData = mockChildProgress.find(child => child.id === selectedChild);
    const exportData = {
      title: 'LittleMeals Weekly Summary',
      timeframe: 'This Week',
      childName: selectedChildData?.name,
      totalMeals: 47,
      acceptanceRate: 78,
      foodTrends: mockFoodTrends.map(trend => ({
        name: trend.name,
        acceptance: Math.round(trend.acceptance.reduce((sum, val) => sum + val, 0) / trend.acceptance.length),
        attempts: trend.totalAttempts,
      })),
      insights: [
        `${selectedChildData?.name || 'Child'}'s acceptance rate has improved this week`,
        'Breakfast shows the highest success rate',
        'Nutrition balance is improving with more variety'
      ]
    };

    await shareTextSummary(exportData);
  };

  return (
    <Screen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Container>
          <VStack space={6} className="py-4">
            
            {/* Simple Header */}
            <H1 className="text-center">Family Insights</H1>
            
            {/* Food Trends Chart */}
            <FoodTrendsChart
              data={mockFoodTrends}
              selectedFood={selectedFood}
              onFoodSelect={setSelectedFood}
              chartType="line"
            />

            {/* Child Progress */}
            <ProgressChart
              data={mockChildProgress}
              selectedChild={selectedChild}
              onChildSelect={setSelectedChild}
            />
            

            <VStack space={3} className="pb-8">
              {/* Export Options */}
              <TouchableOpacity 
                className="p-4 bg-primary-light rounded-lg border border-primary"
                onPress={handleExportPDF}
              >
                <HStack className="items-center justify-between">
                  <HStack className="items-center">
                    <Text className="text-2xl mr-3">📄</Text>
                    <VStack space={1}>
                      <Body className="font-medium text-primary-foreground">Generate Pediatrician Report</Body>
                      <Caption className="text-primary-foreground">PDF report for healthcare provider</Caption>
                    </VStack>
                  </HStack>
                  <Text className="text-primary-foreground text-lg">→</Text>
                </HStack>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-4 bg-background-card rounded-lg border border-border"
                onPress={handleShareSummary}
              >
                <HStack className="items-center justify-between">
                  <HStack className="items-center">
                    <Text className="text-2xl mr-3">📱</Text>
                    <VStack space={1}>
                      <Body className="font-medium">Share Summary</Body>
                      <Caption className="text-foreground-muted">Quick text summary for family sharing</Caption>
                    </VStack>
                  </HStack>
                  <Text className="text-primary text-lg">→</Text>
                </HStack>
              </TouchableOpacity>
            </VStack>

          </VStack>
        </Container>
      </ScrollView>
    </Screen>
  );
};

export default InsightsScreen;