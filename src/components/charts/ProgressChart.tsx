import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { VStack, HStack, H3, Body, Caption, colors } from '../design-system';

interface ChildProgress {
  id: string;
  name: string;
  age: number;
  avatar: string;
  metrics: {
    varietyScore: number; // 0-1: How many different foods tried
    acceptanceRate: number; // 0-1: Overall acceptance percentage
    adventurinessScore: number; // 0-1: Willingness to try new foods
    consistencyScore: number; // 0-1: Consistency in eating patterns
  };
  weeklyChange: {
    variety: number;
    acceptance: number;
    adventuriness: number;
    consistency: number;
  };
}

interface ProgressChartProps {
  data: ChildProgress[];
  selectedChild?: string;
  onChildSelect?: (childId: string) => void;
  loading?: boolean;
  error?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  selectedChild,
  onChildSelect,
  loading = false,
  error
}) => {
  const chartSize = 200;
  const radius = 60;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  const getSelectedChild = () => {
    if (!selectedChild) return data[0];
    return data.find(child => child.id === selectedChild) || data[0];
  };

  const selectedChildData = getSelectedChild();

  // Create circular progress rings
  const createProgressRing = (value: number, index: number, total: number) => {
    const strokeWidth = 8;
    const ringRadius = radius - (index * 15);
    const circumference = 2 * Math.PI * ringRadius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value * circumference);
    
    return {
      radius: ringRadius,
      strokeWidth,
      strokeDasharray,
      strokeDashoffset,
      circumference
    };
  };

  const getProgressColor = (score: number) => {
    if (score >= 0.8) return colors.responses.eaten.DEFAULT;
    if (score >= 0.6) return colors.responses.partial.DEFAULT;
    return colors.responses.refused.DEFAULT;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0.05) return { icon: '↗️', color: colors.responses.eaten.DEFAULT, text: 'Improving' };
    if (change < -0.05) return { icon: '↘️', color: colors.responses.refused.DEFAULT, text: 'Declining' };
    return { icon: '➡️', color: colors.foreground.muted, text: 'Stable' };
  };

  const getScoreDescription = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Needs Focus';
  };

  if (loading) {
    return (
      <VStack space={4} style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <H3>Child Progress Tracking</H3>
          <View style={{ 
            width: 24, 
            height: 24, 
            backgroundColor: colors.primary.light,
            borderRadius: 12
          }} />
        </View>
        <View style={{ 
          backgroundColor: colors.background.secondary,
          borderRadius: 12,
          padding: 24,
          height: 320
        }}>
          <VStack space={4} style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 160, 
              height: 160, 
              backgroundColor: colors.background.muted,
              borderRadius: 80
            }} />
            <VStack space={2} style={{ alignItems: 'center' }}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={{ 
                  width: 128, 
                  height: 16, 
                  backgroundColor: colors.background.muted,
                  borderRadius: 8
                }} />
              ))}
            </VStack>
          </VStack>
        </View>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack space={4} style={{ padding: 16 }}>
        <H3>Child Progress Tracking</H3>
        <View style={{ 
          backgroundColor: colors.background.secondary,
          borderRadius: 12,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          height: 320
        }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📈</Text>
          <Caption style={{ color: colors.foreground.muted, textAlign: 'center' }}>
            {error}
          </Caption>
        </View>
      </VStack>
    );
  }

  if (!selectedChildData) {
    return (
      <VStack space={4} style={{ padding: 16 }}>
        <H3>Child Progress Tracking</H3>
        <View style={{ 
          backgroundColor: colors.background.secondary,
          borderRadius: 12,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          height: 320
        }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>👶</Text>
          <Caption style={{ color: colors.foreground.muted, textAlign: 'center' }}>
            No child data available
          </Caption>
        </View>
      </VStack>
    );
  }

  return (
    <VStack space={4} style={{ padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <H3>Child Progress Tracking</H3>
        <TouchableOpacity>
          <Caption style={{ color: colors.primary.DEFAULT }}>View Details</Caption>
        </TouchableOpacity>
      </View>

      {/* Child Selector */}
      {data.length > 1 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {data.map((child) => {
            const isSelected = selectedChild === child.id || (!selectedChild && child === data[0]);
            return (
              <TouchableOpacity
                key={child.id}
                onPress={() => onChildSelect?.(child.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary.DEFAULT : colors.border.DEFAULT,
                  backgroundColor: isSelected ? colors.primary.light : colors.background.card,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text style={{ marginRight: 8 }}>{child.avatar}</Text>
                <Caption style={{ 
                  color: isSelected ? colors.primary.foreground : colors.foreground.DEFAULT
                }}>
                  {child.name} ({child.age}y)
                </Caption>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Progress Chart */}
      <View style={{ 
        backgroundColor: colors.background.card,
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <VStack space={4} style={{ padding: 16 }}>
          {/* Child Header */}
          <HStack space={3} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>{selectedChildData.avatar}</Text>
            <VStack space={1}>
              <Body style={{ fontWeight: '500' }}>{selectedChildData.name}</Body>
              <Caption style={{ color: colors.foreground.muted }}>
                {selectedChildData.age} years old
              </Caption>
            </VStack>
          </HStack>

          {/* Circular Progress Chart */}
          <View style={{ alignItems: 'center' }}>
            <Svg 
              width={chartSize} 
              height={chartSize}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`Progress chart for ${selectedChildData.name}: Variety ${Math.round(selectedChildData.metrics.varietyScore * 100)}%, Acceptance ${Math.round(selectedChildData.metrics.acceptanceRate * 100)}%, Adventure ${Math.round(selectedChildData.metrics.adventurinessScore * 100)}%, Consistency ${Math.round(selectedChildData.metrics.consistencyScore * 100)}%`}
              accessibilityHint="Progress tracking chart with multiple metrics"
            >
              {/* Background circles */}
              {[selectedChildData.metrics.varietyScore, selectedChildData.metrics.acceptanceRate, selectedChildData.metrics.adventurinessScore, selectedChildData.metrics.consistencyScore].map((_, index) => {
                const ring = createProgressRing(1, index, 4);
                return (
                  <Circle
                    key={`bg-${index}`}
                    cx={centerX}
                    cy={centerY}
                    r={ring.radius}
                    fill="transparent"
                    stroke={colors.background.muted}
                    strokeWidth={ring.strokeWidth}
                  />
                );
              })}
              
              {/* Progress circles */}
              {[
                { value: selectedChildData.metrics.varietyScore, color: colors.primary.DEFAULT },
                { value: selectedChildData.metrics.acceptanceRate, color: colors.responses.eaten.DEFAULT },
                { value: selectedChildData.metrics.adventurinessScore, color: colors.primary.light },
                { value: selectedChildData.metrics.consistencyScore, color: colors.responses.partial.DEFAULT }
              ].map((metric, index) => {
                const ring = createProgressRing(metric.value, index, 4);
                return (
                  <Circle
                    key={`progress-${index}`}
                    cx={centerX}
                    cy={centerY}
                    r={ring.radius}
                    fill="transparent"
                    stroke={metric.color}
                    strokeWidth={ring.strokeWidth}
                    strokeDasharray={ring.strokeDasharray}
                    strokeDashoffset={ring.strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${centerX} ${centerY})`}
                  />
                );
              })}
            </Svg>
          </View>
        </VStack>
      </View>

      {/* Detailed Metrics */}
      <View className="bg-background-secondary rounded-lg p-4">
        <VStack space={3}>
          <Caption className="text-foreground-muted">Progress Breakdown</Caption>
          
          {/* Variety */}
          <HStack className="items-center justify-between">
            <HStack space={2} className="items-center flex-1">
              <Text>🥗</Text>
              <VStack space={1} className="flex-1">
                <Body className="font-medium">Food Variety</Body>
                <Caption className="text-foreground-muted">
                  {getScoreDescription(selectedChildData.metrics.varietyScore)}
                </Caption>
              </VStack>
            </HStack>
            <HStack space={2} className="items-center">
              <Body 
                className="font-medium"
                style={{ color: getProgressColor(selectedChildData.metrics.varietyScore) }}
              >
                {Math.round(selectedChildData.metrics.varietyScore * 100)}%
              </Body>
              <View className="items-center">
                <Text>{getChangeIndicator(selectedChildData.weeklyChange.variety).icon}</Text>
              </View>
            </HStack>
          </HStack>

          {/* Acceptance */}
          <HStack className="items-center justify-between">
            <HStack space={2} className="items-center flex-1">
              <Text>✅</Text>
              <VStack space={1} className="flex-1">
                <Body className="font-medium">Acceptance Rate</Body>
                <Caption className="text-foreground-muted">
                  {getScoreDescription(selectedChildData.metrics.acceptanceRate)}
                </Caption>
              </VStack>
            </HStack>
            <HStack space={2} className="items-center">
              <Body 
                className="font-medium"
                style={{ color: getProgressColor(selectedChildData.metrics.acceptanceRate) }}
              >
                {Math.round(selectedChildData.metrics.acceptanceRate * 100)}%
              </Body>
              <View className="items-center">
                <Text>{getChangeIndicator(selectedChildData.weeklyChange.acceptance).icon}</Text>
              </View>
            </HStack>
          </HStack>

          {/* Adventuriness */}
          <HStack className="items-center justify-between">
            <HStack space={2} className="items-center flex-1">
              <Text>🌟</Text>
              <VStack space={1} className="flex-1">
                <Body className="font-medium">Adventuriness</Body>
                <Caption className="text-foreground-muted">
                  {getScoreDescription(selectedChildData.metrics.adventurinessScore)}
                </Caption>
              </VStack>
            </HStack>
            <HStack space={2} className="items-center">
              <Body 
                className="font-medium"
                style={{ color: getProgressColor(selectedChildData.metrics.adventurinessScore) }}
              >
                {Math.round(selectedChildData.metrics.adventurinessScore * 100)}%
              </Body>
              <View className="items-center">
                <Text>{getChangeIndicator(selectedChildData.weeklyChange.adventuriness).icon}</Text>
              </View>
            </HStack>
          </HStack>

          {/* Consistency */}
          <HStack className="items-center justify-between">
            <HStack space={2} className="items-center flex-1">
              <Text>🎯</Text>
              <VStack space={1} className="flex-1">
                <Body className="font-medium">Consistency</Body>
                <Caption className="text-foreground-muted">
                  {getScoreDescription(selectedChildData.metrics.consistencyScore)}
                </Caption>
              </VStack>
            </HStack>
            <HStack space={2} className="items-center">
              <Body 
                className="font-medium"
                style={{ color: getProgressColor(selectedChildData.metrics.consistencyScore) }}
              >
                {Math.round(selectedChildData.metrics.consistencyScore * 100)}%
              </Body>
              <View className="items-center">
                <Text>{getChangeIndicator(selectedChildData.weeklyChange.consistency).icon}</Text>
              </View>
            </HStack>
          </HStack>
        </VStack>
      </View>
    </VStack>
  );
};

export default ProgressChart;