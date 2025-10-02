import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { VStack, H3, Caption, colors } from '../design-system';

interface FoodTrendData {
  name: string;
  acceptance: number[];
  dates: string[];
  totalAttempts: number;
}

interface FoodTrendsChartProps {
  data: FoodTrendData[];
  selectedFood?: string;
  onFoodSelect?: (food: string) => void;
  chartType?: 'line' | 'bar';
  loading?: boolean;
  error?: string;
}

const FoodTrendsChart: React.FC<FoodTrendsChartProps> = ({
  data,
  selectedFood,
  onFoodSelect,
  chartType = 'line',
  loading = false,
  error
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // Account for padding
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };

  const getSelectedFoodData = () => {
    if (!selectedFood) return data[0];
    return data.find(item => item.name === selectedFood) || data[0];
  };

  const selectedData = getSelectedFoodData();

  // Calculate chart dimensions
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Create line chart points
  const createLineChart = () => {
    if (!selectedData || selectedData.acceptance.length === 0) return null;

    const maxValue = Math.max(...selectedData.acceptance);
    const minValue = Math.min(...selectedData.acceptance);
    const range = maxValue - minValue || 100; // Prevent division by zero
    
    const points = selectedData.acceptance.map((value, index) => {
      const x = padding.left + (index / (selectedData.acceptance.length - 1)) * plotWidth;
      const y = padding.top + ((maxValue - value) / range) * plotHeight;
      return { x, y, value };
    });

    return points;
  };

  // Create bar chart data
  const createBarChart = () => {
    return data.map((item, index) => {
      const avg = item.acceptance.reduce((sum, val) => sum + val, 0) / item.acceptance.length;
      const height = (avg / 100) * plotHeight;
      const width = plotWidth / data.length * 0.7; // 70% width with spacing
      const x = padding.left + (index * plotWidth / data.length) + (plotWidth / data.length - width) / 2;
      const y = padding.top + plotHeight - height;
      
      return {
        x,
        y,
        width,
        height,
        value: Math.round(avg),
        name: item.name
      };
    });
  };

  const linePoints = createLineChart();
  const barData = createBarChart();

  if (loading) {
    return (
      <VStack space={4} className="p-4">
        <View className="flex-row items-center justify-between">
          <H3>Food Acceptance Trends</H3>
          <View className="w-6 h-6 bg-primary-light rounded animate-pulse" />
        </View>
        <View 
          className="bg-background-secondary rounded-xl animate-pulse"
          style={{ height: 220 }}
        />
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack space={4} className="p-4">
        <H3>Food Acceptance Trends</H3>
        <View className="bg-background-secondary rounded-xl p-6 items-center justify-center" style={{ height: 220 }}>
          <Text className="text-2xl mb-2">📊</Text>
          <Caption className="text-foreground-muted text-center">{error}</Caption>
        </View>
      </VStack>
    );
  }

  return (
    <VStack space={4} className="p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <H3>Food Acceptance Trends</H3>
        <TouchableOpacity>
          <Caption className="text-primary">
            {chartType === 'line' ? 'Show Overview' : 'Show Trends'}
          </Caption>
        </TouchableOpacity>
      </View>

      {/* Food Selector for Line Chart */}
      {chartType === 'line' && data.length > 1 && (
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {data.map((food) => (
            <TouchableOpacity
              key={food.name}
              onPress={() => onFoodSelect?.(food.name)}
              className={`px-4 py-2 rounded-lg border ${
                selectedFood === food.name || (!selectedFood && food === data[0])
                  ? 'border-primary bg-primary-light'
                  : 'border-border bg-background-card'
              }`}
            >
              <Caption 
                className={
                  selectedFood === food.name || (!selectedFood && food === data[0])
                    ? 'text-primary-foreground'
                    : 'text-foreground'
                }
              >
                {food.name}
              </Caption>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Chart */}
      <View style={{ 
        backgroundColor: colors.background.card,
        borderRadius: 12,
        overflow: 'hidden',
        padding: 8
      }}>
        <Svg 
          width={chartWidth} 
          height={chartHeight}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={
            chartType === 'line' 
              ? `Food acceptance trend for ${selectedData?.name}: ${selectedData?.acceptance.join(', ')} percent over time`
              : `Average food acceptance rates: ${data.map(item => `${item.name} ${Math.round(item.acceptance.reduce((sum, val) => sum + val, 0) / item.acceptance.length)}%`).join(', ')}`
          }
          accessibilityHint="Double tap for more details"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = padding.top + ((100 - value) / 100) * plotHeight;
            return (
              <Line
                key={value}
                x1={padding.left}
                y1={y}
                x2={padding.left + plotWidth}
                y2={y}
                stroke={colors.border.DEFAULT}
                strokeWidth={0.5}
                opacity={0.3}
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = padding.top + ((100 - value) / 100) * plotHeight;
            return (
              <SvgText
                key={value}
                x={padding.left - 10}
                y={y + 4}
                fontSize="10"
                fill={colors.foreground.muted}
                textAnchor="end"
              >
                {value}%
              </SvgText>
            );
          })}

          {chartType === 'line' && linePoints ? (
            <>
              {/* Line path */}
              {linePoints.map((point, index) => {
                if (index === 0) return null;
                const prevPoint = linePoints[index - 1];
                return (
                  <Line
                    key={index}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke={colors.primary.DEFAULT}
                    strokeWidth={3}
                  />
                );
              })}
              
              {/* Data points */}
              {linePoints.map((point, index) => (
                <Circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill={colors.primary.DEFAULT}
                />
              ))}
            </>
          ) : (
            /* Bar chart */
            barData.map((bar, index) => (
              <Rect
                key={index}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={colors.primary.DEFAULT}
                rx={4}
              />
            ))
          )}
        </Svg>
      </View>

      {/* Insights */}
      {chartType === 'line' && selectedData && (
        <View className="bg-background-secondary rounded-lg p-4">
          <VStack space={2}>
            <View className="flex-row justify-between">
              <Caption className="text-foreground-muted">Current Trend</Caption>
              <Caption className="text-foreground font-medium">
                {selectedData.acceptance[selectedData.acceptance.length - 1]}% acceptance
              </Caption>
            </View>
            <View className="flex-row justify-between">
              <Caption className="text-foreground-muted">Total Attempts</Caption>
              <Caption className="text-foreground font-medium">{selectedData.totalAttempts}</Caption>
            </View>
          </VStack>
        </View>
      )}
    </VStack>
  );
};

export default FoodTrendsChart;