/**
 * LittleMeals Form Types
 * 
 * Comprehensive TypeScript interfaces for form components and meal logging
 */

// Core data types
export interface Child {
  id: string;
  name: string;
  age: number;
  birthdate?: Date;
  preferences?: string[];
  allergies?: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  lastUsed?: Date;
  frequency: number;
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export type ResponseType = 'eaten' | 'partial' | 'refused' | null;

export interface ChildResponse {
  childId: string;
  response: ResponseType;
  notes?: string;
  timestamp?: Date;
}

export interface MealData {
  id?: string;
  foodName: string;
  mealType: MealType;
  date: Date;
  childResponses: ChildResponse[];
  notes: string;
  familyId?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Meal types
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

// Form validation
export interface FormValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// Form component props interfaces
export interface MealLoggingFormProps {
  children: Child[];
  onSave: (mealData: MealData) => void;
  onReset?: () => void;
  initialData?: Partial<MealData>;
  lastMealType?: MealType;
  foodHistory?: FoodItem[];
  disabled?: boolean;
  showValidationErrors?: boolean;
}

export interface FoodAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onFoodSelect?: (food: FoodItem) => void;
  foodHistory?: FoodItem[];
  maxSuggestions?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  disabled?: boolean;
  error?: string;
}

export interface ChildResponseGridProps {
  children: Child[];
  responses: ChildResponse[];
  onResponseChange: (childId: string, response: ResponseType) => void;
  onAllAte?: () => void;
  onAllRefused?: () => void;
  showQuickActions?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface VoiceInputProps {
  onVoiceResult?: (text: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

// Form state management
export interface FormState {
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: FormValidationError[];
  lastSaved?: Date;
}

// Meal logging optimization types
export interface MealLoggingPerformance {
  startTime: number;
  completionTime?: number;
  inputFocusTime?: number;
  firstResponseTime?: number;
  totalDuration?: number;
}

export interface SmartDefaults {
  suggestedMealType: MealType;
  recentFoods: FoodItem[];
  frequentResponses: Record<string, ResponseType>;
  lastMealData?: Partial<MealData>;
}

// Family context types
export interface Family {
  id: string;
  name: string;
  children: Child[];
  members: FamilyMember[];
  settings: FamilySettings;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'caregiver' | 'other';
  permissions: string[];
}

export interface FamilySettings {
  timezone: string;
  mealTimeReminders: boolean;
  shareWithAllMembers: boolean;
  allowVoiceLogging: boolean;
  defaultMealTypes: MealType[];
}

// Analytics and insights types
export interface MealPattern {
  childId: string;
  foodName: string;
  acceptanceRate: number;
  lastServed: Date;
  frequency: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface EatingInsight {
  type: 'preference' | 'pattern' | 'concern' | 'success';
  title: string;
  description: string;
  data: any;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Error types
export class MealLoggingError extends Error {
  code: string;
  field?: string;

  constructor(message: string, code: string, field?: string) {
    super(message);
    this.name = 'MealLoggingError';
    this.code = code;
    this.field = field;
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;