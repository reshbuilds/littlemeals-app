/**
 * Form Validation Utilities for LittleMeals
 * 
 * Comprehensive validation functions for meal logging forms
 */

import { 
  MealData, 
  Child, 
  ChildResponse, 
  FormValidationError, 
  ValidationResult,
  MealLoggingError 
} from '@/types/forms';

/**
 * Validates meal data before saving
 */
export const validateMealData = (mealData: Partial<MealData>, children: Child[]): ValidationResult => {
  const errors: FormValidationError[] = [];

  // Food name validation
  if (!mealData.foodName || !mealData.foodName.trim()) {
    errors.push({
      field: 'foodName',
      message: 'Please enter what you served',
      code: 'REQUIRED_FIELD'
    });
  } else if (mealData.foodName.trim().length < 2) {
    errors.push({
      field: 'foodName',
      message: 'Food name must be at least 2 characters',
      code: 'MIN_LENGTH'
    });
  } else if (mealData.foodName.trim().length > 100) {
    errors.push({
      field: 'foodName',
      message: 'Food name cannot exceed 100 characters',
      code: 'MAX_LENGTH'
    });
  }

  // Meal type validation
  const validMealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  if (!mealData.mealType) {
    errors.push({
      field: 'mealType',
      message: 'Please select a meal type',
      code: 'REQUIRED_FIELD'
    });
  } else if (!validMealTypes.includes(mealData.mealType)) {
    errors.push({
      field: 'mealType',
      message: 'Invalid meal type selected',
      code: 'INVALID_VALUE'
    });
  }

  // Date validation
  if (!mealData.date) {
    errors.push({
      field: 'date',
      message: 'Please select a date',
      code: 'REQUIRED_FIELD'
    });
  } else {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

    if (mealData.date > tomorrow) {
      errors.push({
        field: 'date',
        message: 'Cannot log meals for future dates',
        code: 'INVALID_DATE_FUTURE'
      });
    } else if (mealData.date < thirtyDaysAgo) {
      errors.push({
        field: 'date',
        message: 'Cannot log meals older than 30 days',
        code: 'INVALID_DATE_PAST'
      });
    }
  }

  // Child responses validation
  if (!mealData.childResponses || mealData.childResponses.length === 0) {
    errors.push({
      field: 'childResponses',
      message: 'Please set responses for all children',
      code: 'REQUIRED_FIELD'
    });
  } else {
    // Check that all children have responses
    const childIds = children.map(c => c.id);
    const responseChildIds = mealData.childResponses.map(cr => cr.childId);
    
    for (const childId of childIds) {
      const hasResponse = mealData.childResponses.find(cr => 
        cr.childId === childId && cr.response !== null
      );
      
      if (!hasResponse) {
        const child = children.find(c => c.id === childId);
        errors.push({
          field: 'childResponses',
          message: `Please set response for ${child?.name || 'child'}`,
          code: 'MISSING_CHILD_RESPONSE'
        });
      }
    }

    // Validate individual responses
    mealData.childResponses.forEach((response, index) => {
      const validResponses = ['eaten', 'partial', 'refused'];
      if (response.response && !validResponses.includes(response.response)) {
        errors.push({
          field: `childResponses[${index}].response`,
          message: 'Invalid response type',
          code: 'INVALID_RESPONSE_TYPE'
        });
      }

      if (response.childId && !childIds.includes(response.childId)) {
        errors.push({
          field: `childResponses[${index}].childId`,
          message: 'Invalid child ID',
          code: 'INVALID_CHILD_ID'
        });
      }
    });
  }

  // Notes validation (optional but if provided, should be reasonable)
  if (mealData.notes && mealData.notes.length > 500) {
    errors.push({
      field: 'notes',
      message: 'Notes cannot exceed 500 characters',
      code: 'MAX_LENGTH'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates food name input
 */
export const validateFoodName = (foodName: string): ValidationResult => {
  const errors: FormValidationError[] = [];

  if (!foodName.trim()) {
    errors.push({
      field: 'foodName',
      message: 'Food name is required',
      code: 'REQUIRED_FIELD'
    });
  } else if (foodName.trim().length < 2) {
    errors.push({
      field: 'foodName',
      message: 'Food name must be at least 2 characters',
      code: 'MIN_LENGTH'
    });
  } else if (foodName.trim().length > 100) {
    errors.push({
      field: 'foodName',
      message: 'Food name cannot exceed 100 characters',
      code: 'MAX_LENGTH'
    });
  }

  // Check for potentially harmful input
  const harmfulPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
  if (harmfulPatterns.some(pattern => pattern.test(foodName))) {
    errors.push({
      field: 'foodName',
      message: 'Invalid characters in food name',
      code: 'INVALID_CHARACTERS'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates date selection
 */
export const validateMealDate = (date: Date): ValidationResult => {
  const errors: FormValidationError[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

  if (!date || isNaN(date.getTime())) {
    errors.push({
      field: 'date',
      message: 'Please select a valid date',
      code: 'INVALID_DATE'
    });
  } else if (date > tomorrow) {
    errors.push({
      field: 'date',
      message: 'Cannot log meals for future dates',
      code: 'INVALID_DATE_FUTURE'
    });
  } else if (date < thirtyDaysAgo) {
    errors.push({
      field: 'date',
      message: 'Cannot log meals older than 30 days',
      code: 'INVALID_DATE_PAST'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates child responses
 */
export const validateChildResponses = (
  responses: ChildResponse[], 
  children: Child[]
): ValidationResult => {
  const errors: FormValidationError[] = [];
  const validResponses = ['eaten', 'partial', 'refused'];
  const childIds = children.map(c => c.id);

  // Check that all children have responses
  for (const child of children) {
    const hasResponse = responses.find(r => 
      r.childId === child.id && r.response !== null
    );
    
    if (!hasResponse) {
      errors.push({
        field: 'childResponses',
        message: `Please set response for ${child.name}`,
        code: 'MISSING_CHILD_RESPONSE'
      });
    }
  }

  // Validate individual responses
  responses.forEach((response, index) => {
    if (response.response && !validResponses.includes(response.response)) {
      errors.push({
        field: `childResponses[${index}].response`,
        message: 'Invalid response type',
        code: 'INVALID_RESPONSE_TYPE'
      });
    }

    if (!childIds.includes(response.childId)) {
      errors.push({
        field: `childResponses[${index}].childId`,
        message: 'Invalid child ID',
        code: 'INVALID_CHILD_ID'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes user input to prevent XSS and other attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 1000); // Reasonable max length
};

/**
 * Creates user-friendly error messages
 */
export const getErrorMessage = (error: FormValidationError): string => {
  const messages: Record<string, string> = {
    'REQUIRED_FIELD': 'This field is required',
    'MIN_LENGTH': 'Input is too short',
    'MAX_LENGTH': 'Input is too long',
    'INVALID_VALUE': 'Invalid value selected',
    'INVALID_DATE': 'Please select a valid date',
    'INVALID_DATE_FUTURE': 'Cannot select future dates',
    'INVALID_DATE_PAST': 'Date is too far in the past',
    'MISSING_CHILD_RESPONSE': 'Please set responses for all children',
    'INVALID_RESPONSE_TYPE': 'Invalid response selected',
    'INVALID_CHILD_ID': 'Invalid child selected',
    'INVALID_CHARACTERS': 'Contains invalid characters'
  };

  return messages[error.code] || error.message || 'Validation error';
};

/**
 * Throws a standardized error for form validation failures
 */
export const throwValidationError = (
  message: string, 
  code: string, 
  field?: string
): never => {
  throw new MealLoggingError(message, code, field);
};

/**
 * Combines multiple validation results
 */
export const combineValidationResults = (
  ...results: ValidationResult[]
): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};