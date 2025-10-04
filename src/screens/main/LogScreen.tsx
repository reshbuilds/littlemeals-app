import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Platform, Modal, KeyboardAvoidingView, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FoodAutocomplete } from '../../components/forms/FoodAutocomplete';

// Mock data for demonstration
const mockChildren = [
  { id: '1', name: 'Sam', age: 4 },
  { id: '2', name: 'Sebbie', age: 2 },
  { id: '3', name: 'Dee-Dee-Dee', age: 6 }
];

const mockMealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

type ResponseType = 'eaten' | 'partial' | 'refused' | null;

interface ChildResponse {
  childId: string;
  response: ResponseType;
}


const LogScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [foodName, setFoodName] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [childResponses, setChildResponses] = useState<ChildResponse[]>(
    mockChildren.map(child => ({ childId: child.id, response: null }))
  );
  const [notes, setNotes] = useState('');

  const handleChildResponse = (childId: string, response: ResponseType) => {
    Keyboard.dismiss();
    setChildResponses(prev =>
      prev.map(cr =>
        cr.childId === childId ? { ...cr, response } : cr
      )
    );
  };

  const handleSaveMeal = () => {
    if (!foodName.trim()) {
      Alert.alert('Enter Food', 'Please enter what you served');
      return;
    }

    const allResponsesSet = childResponses.every(cr => cr.response !== null);
    if (!allResponsesSet) {
      Alert.alert('Set Responses', 'Please set response for each child');
      return;
    }

    // Scroll to top and dismiss keyboard before showing success
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    
    Alert.alert('Saved', 'Meal logged and synced', [
      { text: 'OK', onPress: () => resetForm() }
    ]);
  };

  const resetForm = () => {
    setFoodName('');
    setSelectedMealType('Breakfast'); // Reset to Breakfast
    setSelectedDate(new Date()); // Reset to current date
    setChildResponses(mockChildren.map(child => ({ childId: child.id, response: null })));
    setNotes('');
  };

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    
    // If it's today, just show "Today"
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // If it's yesterday, show "Yesterday"
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // For other dates, show simple format: "Aug 1, 2024"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    if (date) {
      setSelectedDate(date);
    }
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const confirmDateSelection = () => {
    setShowDatePicker(false);
    // Date is already updated via handleDateChange
  };

  const handleNotesGotFocus = () => {
    // Scroll to bottom when notes field is focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        <View className="px-6 pt-16 pb-8">
          
          {/* Clean Header */}
          <View className="mb-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-3xl font-light text-foreground mb-6">New Meal</Text>
                
                {/* Subtle Date Field - Left Aligned */}
                <TouchableOpacity 
                  onPress={openDatePicker}
                  className="self-start"
                >
                  <Text className="text-base text-foreground-muted">
                    {formatDisplayDate(selectedDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Clear Button - Only show when form has content */}
              {(foodName.trim() || notes.trim() || childResponses.some(cr => cr.response !== null)) && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('Clear Form', 'Clear all entries?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Clear', style: 'destructive', onPress: resetForm }
                    ]);
                  }}
                  className="px-3 py-1 items-center justify-center"
                >
                  <Text className="text-foreground-muted text-sm">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Meal Type - Single Line Pills */}
          <View className="mb-8">
            <View className="flex-row justify-between">
              {mockMealTypes.map((mealType) => (
                <TouchableOpacity
                  key={mealType}
                  onPress={() => setSelectedMealType(mealType)}
                  className={`px-2 py-2 rounded-full flex-1 mx-1 items-center ${
                    selectedMealType === mealType 
                      ? 'bg-primary' 
                      : 'bg-background-secondary'
                  }`}
                >
                  <Text 
                    className={`font-medium text-sm ${
                      selectedMealType === mealType ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {mealType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Food Input - With Autocomplete */}
          <View className="mb-8 relative" style={{ zIndex: 1000 }}>
            <FoodAutocomplete
              placeholder="Enter food"
              value={foodName}
              onChangeText={setFoodName}
            />
            {foodName.length > 0 && (
              <TouchableOpacity
                onPress={() => setFoodName('')}
                className="absolute right-4 top-4 w-6 h-6 items-center justify-center bg-background-secondary rounded-full z-10"
              >
                <Text className="text-foreground-muted text-sm">×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Child Responses - Clean Grid */}
          <View className="mb-8 space-y-6">
            {mockChildren.map((child) => {
              const childResponse = childResponses.find(cr => cr.childId === child.id);
              
              return (
                <View key={child.id} className="space-y-3">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-medium text-foreground">{child.name}</Text>
                    </View>
                    
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleChildResponse(child.id, 'eaten')}
                        className={`w-14 h-14 rounded-full items-center justify-center ${
                          childResponse?.response === 'eaten'
                            ? 'bg-success' 
                            : 'bg-background-secondary'
                        }`}
                      >
                        <Text className="text-2xl">✓</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => handleChildResponse(child.id, 'partial')}
                        className={`w-14 h-14 rounded-full items-center justify-center ${
                          childResponse?.response === 'partial'
                            ? 'bg-warning' 
                            : 'bg-background-secondary'
                        }`}
                      >
                        <Text className="text-lg">◐</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => handleChildResponse(child.id, 'refused')}
                        className={`w-14 h-14 rounded-full items-center justify-center ${
                          childResponse?.response === 'refused'
                            ? 'bg-error' 
                            : 'bg-background-secondary'
                        }`}
                      >
                        <Text className="text-xl">×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Notes - Optional */}
          <View className="mb-8 relative">
            <TextInput
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              onFocus={handleNotesGotFocus}
              multiline
              numberOfLines={2}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => {
                // Dismiss keyboard when return is pressed
              }}
              className="bg-background-card border border-border rounded-xl px-6 py-4 text-base text-foreground min-h-[60px]"
              placeholderTextColor="hsl(160, 6%, 50%)"
            />
            {notes.length > 0 && (
              <TouchableOpacity
                onPress={() => setNotes('')}
                className="absolute right-4 top-4 w-6 h-6 items-center justify-center bg-background-secondary rounded-full"
              >
                <Text className="text-foreground-muted text-sm">×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save Button - Prominent */}
          <TouchableOpacity
            onPress={handleSaveMeal}
            className="bg-primary py-4 rounded-xl items-center mb-4"
          >
            <Text className="text-lg font-semibold text-primary-foreground">
              Save
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      
      {/* Native Date Picker */}
      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={closeDatePicker}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-background rounded-t-3xl pb-4">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text className="text-primary text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-lg font-medium text-foreground">Select Date</Text>
                <TouchableOpacity onPress={confirmDateSelection}>
                  <Text className="text-primary text-base font-medium">Done</Text>
                </TouchableOpacity>
              </View>
              <View className="px-4 py-2 bg-background items-center">
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  themeVariant="light"
                  locale="en-US"
                  style={{
                    backgroundColor: 'hsl(35, 20%, 98%)',
                    height: 180,
                    width: 320
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default LogScreen;