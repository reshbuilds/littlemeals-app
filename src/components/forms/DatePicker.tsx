/**
 * DatePicker - Cross-platform mobile-optimized date selection
 * 
 * Features:
 * - Reliable iOS and Android support
 * - Smart date formatting (Today/Yesterday/Date)
 * - Modal presentation with proper dismissal
 * - Accessible date selection
 * - Maintains existing visual design
 * - Production-ready error handling
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  ViewStyle,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export interface DatePickerProps {
  /**
   * Currently selected date
   */
  value: Date;
  
  /**
   * Callback when date changes
   */
  onChange: (date: Date) => void;
  
  /**
   * Minimum selectable date (default: 30 days ago)
   */
  minimumDate?: Date;
  
  /**
   * Maximum selectable date (default: today)
   */
  maximumDate?: Date;
  
  /**
   * Display mode for the picker
   */
  mode?: 'date' | 'time' | 'datetime';
  
  /**
   * Custom date format function
   */
  formatDate?: (date: Date) => string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom container styling
   */
  style?: ViewStyle;
  
  /**
   * Custom button styling
   */
  buttonStyle?: ViewStyle;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Smart date formatting with Today/Yesterday labels
 */
const formatDisplayDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Reset time for accurate comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  }
  
  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday';
  }
  
  // Format as "Aug 1, 2024" for other dates
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * iOS Modal Date Picker Component
 */
interface IOSDatePickerModalProps {
  visible: boolean;
  date: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const IOSDatePickerModal: React.FC<IOSDatePickerModalProps> = ({
  visible,
  date,
  minimumDate,
  maximumDate,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = useCallback((event: any, newDate?: Date) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedDate);
  }, [selectedDate, onConfirm]);

  // Reset selected date when modal opens
  React.useEffect(() => {
    if (visible) {
      setSelectedDate(date);
    }
  }, [visible, date]);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: colors.background.DEFAULT,
            borderTopLeftRadius: borderRadius['2xl'],
            borderTopRightRadius: borderRadius['2xl'],
            paddingBottom: spacing[4],
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
              borderBottomWidth: 1,
              borderBottomColor: colors.border.DEFAULT,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{ padding: spacing[1] }}
              accessibilityRole="button"
              accessibilityLabel="Cancel date selection"
            >
              <Text
                style={{
                  ...textStyles.body,
                  color: colors.primary.DEFAULT,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            
            <Text
              style={{
                ...textStyles.h4,
                color: colors.foreground.DEFAULT,
              }}
            >
              Select Date
            </Text>
            
            <TouchableOpacity
              onPress={handleConfirm}
              style={{ padding: spacing[1] }}
              accessibilityRole="button"
              accessibilityLabel="Confirm date selection"
            >
              <Text
                style={{
                  ...textStyles.body,
                  fontWeight: '600',
                  color: colors.primary.DEFAULT,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          <View
            style={{
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2],
              alignItems: 'center',
            }}
          >
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant="light"
              locale="en-US"
              style={{
                backgroundColor: colors.background.DEFAULT,
                height: 180,
                width: 320,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Main DatePicker Component
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minimumDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  maximumDate = new Date(), // Today
  mode = 'date',
  formatDate = formatDisplayDate,
  disabled = false,
  style,
  buttonStyle,
  accessibilityLabel = 'Select date',
  testID = 'date-picker',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Handle date picker opening
  const handlePress = useCallback(() => {
    if (disabled) return;
    setShowPicker(true);
  }, [disabled]);

  // Handle date picker dismissal
  const handleDismiss = useCallback(() => {
    setShowPicker(false);
  }, []);

  // Handle date selection
  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      
      if (event.type === 'dismissed') {
        return; // User cancelled
      }
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  }, [onChange]);

  // Handle iOS date confirmation
  const handleIOSConfirm = useCallback((selectedDate: Date) => {
    onChange(selectedDate);
    setShowPicker(false);
  }, [onChange]);

  return (
    <View style={style} testID={testID}>
      {/* Date Display Button */}
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[
          {
            paddingVertical: spacing[2],
            paddingHorizontal: spacing[1],
            opacity: disabled ? 0.5 : 1,
          },
          buttonStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}, currently ${formatDate(value)}`}
        accessibilityHint="Double tap to change date"
        accessibilityState={{ disabled }}
        testID={`${testID}-button`}
      >
        <Text
          style={{
            ...textStyles.body,
            color: disabled ? colors.foreground.muted : colors.foreground.muted,
          }}
        >
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      {/* Platform-specific Date Picker */}
      {Platform.OS === 'ios' && (
        <IOSDatePickerModal
          visible={showPicker}
          date={value}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onConfirm={handleIOSConfirm}
          onCancel={handleDismiss}
        />
      )}

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;