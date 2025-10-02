/**
 * FoodAutocomplete - Smart food input with stable keyboard and suggestions
 * 
 * Features:
 * - Stable keyboard that never dismisses unexpectedly
 * - Inline suggestions below input (no modal overlay issues)
 * - Smart family food history with frequency-based ranking
 * - Optimized typing experience with fast selection
 * - Reliable focus management
 * - No layout shift or interference
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  lastUsed?: Date;
  frequency: number;
}

export interface FoodAutocompleteProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  /**
   * Current food name value
   */
  value: string;
  
  /**
   * Callback when food name changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Callback when a food item is selected from suggestions
   */
  onFoodSelect?: (food: FoodItem) => void;
  
  /**
   * Array of family's food history for suggestions
   */
  foodHistory?: FoodItem[];
  
  /**
   * Maximum number of suggestions to show
   */
  maxSuggestions?: number;
  
  /**
   * Custom container styling
   */
  style?: ViewStyle;
  
  /**
   * Custom input styling
   */
  inputStyle?: ViewStyle;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

// Mock food database - in real app this would come from family's meal history
const DEFAULT_FOODS: FoodItem[] = [
  { id: '1', name: 'pancakes', frequency: 15, category: 'breakfast' },
  { id: '2', name: 'banana', frequency: 12, category: 'fruit' },
  { id: '3', name: 'banana pancakes', frequency: 8, category: 'breakfast' },
  { id: '4', name: 'banana bread', frequency: 5, category: 'snack' },
  { id: '5', name: 'yogurt', frequency: 10, category: 'dairy' },
  { id: '6', name: 'oatmeal', frequency: 9, category: 'breakfast' },
  { id: '7', name: 'chicken nuggets', frequency: 7, category: 'protein' },
  { id: '8', name: 'pasta', frequency: 11, category: 'main' },
  { id: '9', name: 'broccoli', frequency: 3, category: 'vegetable' },
  { id: '10', name: 'cheese', frequency: 8, category: 'dairy' },
  { id: '11', name: 'apple slices', frequency: 9, category: 'fruit' },
  { id: '12', name: 'scrambled eggs', frequency: 6, category: 'protein' },
  // Added more foods for easier testing
  { id: '13', name: 'toast', frequency: 10, category: 'breakfast' },
  { id: '14', name: 'sandwich', frequency: 8, category: 'lunch' },
  { id: '15', name: 'rice', frequency: 9, category: 'main' },
  { id: '16', name: 'pizza', frequency: 7, category: 'dinner' },
  { id: '17', name: 'soup', frequency: 6, category: 'lunch' },
  { id: '18', name: 'cereal', frequency: 11, category: 'breakfast' },
  // Added foods you were searching for
  { id: '19', name: 'eggs', frequency: 8, category: 'protein' },
  { id: '20', name: 'boiled eggs', frequency: 5, category: 'protein' },
  { id: '21', name: 'fried eggs', frequency: 4, category: 'protein' },
  { id: '22', name: 'oats', frequency: 7, category: 'breakfast' },
  { id: '23', name: 'overnight oats', frequency: 6, category: 'breakfast' },
];

/**
 * Individual Suggestion Item Component
 */
interface SuggestionItemProps {
  food: FoodItem;
  searchTerm: string;
  onSelect: (food: FoodItem) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = React.memo(({
  food,
  searchTerm,
  onSelect,
}) => {
  // Highlight matching text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts;
  };

  const textParts = getHighlightedText(food.name, searchTerm);

  return (
    <TouchableOpacity
      onPress={() => onSelect(food)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${food.name}`}
      testID={`food-suggestion-${food.id}`}
    >
      {/* Search Icon */}
      <Text
        style={{
          fontSize: 16,
          color: colors.foreground.muted,
          marginRight: spacing[3],
        }}
      >
        🔍
      </Text>
      
      {/* Food Name with Highlighting */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: '#000000' }}>
          {typeof textParts === 'string' ? textParts : textParts.map((part, index) => (
            <Text
              key={index}
              style={{
                fontWeight: part.toLowerCase() === searchTerm.toLowerCase() ? '600' : '400',
                color: part.toLowerCase() === searchTerm.toLowerCase() 
                  ? colors.primary.DEFAULT 
                  : '#000000',
              }}
            >
              {part}
            </Text>
          ))}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

SuggestionItem.displayName = 'SuggestionItem';

/**
 * Main FoodAutocomplete Component
 */
export const FoodAutocomplete: React.FC<FoodAutocompleteProps> = ({
  value,
  onChangeText,
  onFoodSelect,
  foodHistory = DEFAULT_FOODS,
  maxSuggestions = 5,
  style,
  inputStyle,
  placeholder = "Enter food name...",
  testID = "food-autocomplete",
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Filter and sort suggestions based on input
  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 2) return [];

    const searchTerm = value.toLowerCase().trim();
    
    // Use DEFAULT_FOODS if foodHistory is empty
    const foodDatabase = foodHistory.length > 0 ? foodHistory : DEFAULT_FOODS;
    
    return foodDatabase
      .filter(food => food.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        // Prioritize exact matches
        const aStartsWith = a.name.toLowerCase().startsWith(searchTerm);
        const bStartsWith = b.name.toLowerCase().startsWith(searchTerm);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then sort by frequency
        return b.frequency - a.frequency;
      })
      .slice(0, maxSuggestions);
  }, [value, foodHistory, maxSuggestions]);

  // Handle input focus - simple and reliable
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Handle input blur - NO automatic blur delays that cause issues
  const handleBlur = useCallback(() => {
    // Only hide suggestions on blur, don't change focus state aggressively
    setShowSuggestions(false);
  }, []);

  // Handle text change - reset selection state when user types
  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
    setJustSelected(false); // Reset selection flag when user types
    // Show suggestions when typing and focused, hide when empty
    if (text.length >= 1 && isFocused) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [onChangeText, isFocused]);

  // Handle suggestion selection - dismiss keyboard to indicate completion
  const handleSuggestionSelect = useCallback((food: FoodItem) => {
    onChangeText(food.name);
    setShowSuggestions(false);
    setJustSelected(true); // Mark as just selected to prevent suggestions reappearing
    onFoodSelect?.(food);
    
    // Dismiss keyboard and blur input to indicate selection is complete
    inputRef.current?.blur();
    Keyboard.dismiss();
    setIsFocused(false);
  }, [onChangeText, onFoodSelect]);

  // Reset selection state when value is cleared externally (form reset)
  React.useEffect(() => {
    if (value === '') {
      setJustSelected(false);
      setShowSuggestions(false);
      setIsFocused(false);
    }
  }, [value]);

  return (
    <View style={style} testID={testID}>
      {/* Food Input Field - Maintains exact current styling */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.foreground.light}
        style={[
          {
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: isFocused ? colors.primary.DEFAULT : colors.border.DEFAULT,
            borderRadius: borderRadius.base,
            paddingHorizontal: 20,
            paddingVertical: 18,
            fontSize: 16,
            color: colors.foreground.DEFAULT,
            height: 56,
            textAlignVertical: 'center',
            includeFontPadding: false,
          },
          inputStyle,
        ]}
        accessibilityLabel="Enter food name"
        accessibilityHint="Type to get food suggestions"
        testID={`${testID}-input`}
        autoCorrect={false}
        autoCapitalize="none"
        {...textInputProps}
      />

      {/* Inline Food Suggestions - No Modal Issues */}
      {showSuggestions && suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.base,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            marginTop: 4,
            maxHeight: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            {suggestions.map((item) => (
              <SuggestionItem
                key={item.id}
                food={item}
                searchTerm={value}
                onSelect={handleSuggestionSelect}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FoodAutocomplete;