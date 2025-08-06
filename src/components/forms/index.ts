/**
 * LittleMeals Form Components
 * 
 * Specialized form components optimized for fast meal logging with:
 * - Sub-5-second logging capability
 * - Smart defaults and auto-focus
 * - Family-friendly touch targets
 * - Scandinavian minimal design
 * - Comprehensive TypeScript interfaces
 */

export { 
  MealLoggingForm, 
  type MealData, 
  type ChildResponse, 
  type Child 
} from './MealLoggingForm';

export { 
  FoodAutocomplete,
  type FoodItem,
  type FoodAutocompleteProps
} from './FoodAutocomplete';

export { 
  DatePicker,
  type DatePickerProps
} from './DatePicker';

export { 
  ChildResponseGrid,
  type ChildResponseGridProps,
  type ResponseType
} from './ChildResponseGrid';

export { VoiceInput } from './VoiceInput';