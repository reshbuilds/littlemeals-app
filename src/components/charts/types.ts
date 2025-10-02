/**
 * Chart Component Type Definitions
 * Shared types for all chart components in LittleMeals
 */

// Food Trends Chart Types
export interface FoodTrendData {
  name: string;
  acceptance: number[];
  dates: string[];
  totalAttempts: number;
}

export interface FoodTrendsChartProps {
  data: FoodTrendData[];
  selectedFood?: string;
  onFoodSelect?: (food: string) => void;
  chartType?: 'line' | 'bar';
  loading?: boolean;
  error?: string;
}

// Pattern Heatmap Types
export interface MealPatternData {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  acceptanceRate: number;
  mealCount: number;
}

export interface PatternHeatmapProps {
  data: MealPatternData[];
  selectedWeek?: number;
  onWeekSelect?: (week: number) => void;
  loading?: boolean;
  error?: string;
}

// Progress Chart Types
export interface ChildProgress {
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

export interface ProgressChartProps {
  data: ChildProgress[];
  selectedChild?: string;
  onChildSelect?: (childId: string) => void;
  loading?: boolean;
  error?: string;
}

// Common Chart Props
export interface BaseChartProps {
  loading?: boolean;
  error?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Chart Data Processing Types
export interface ChartDataPoint {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface ChartConfig {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Export utility types
export type ChartType = 'line' | 'bar' | 'pie' | 'heatmap' | 'progress';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ResponseType = 'eaten' | 'partial' | 'refused';