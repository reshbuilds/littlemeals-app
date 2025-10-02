/**
 * ChildResponseGrid - Modular child response selection component
 * 
 * Maintains exact visual design of existing implementation while providing:
 * - Clean reusable component architecture
 * - Performance optimizations with memoization
 * - Comprehensive TypeScript interfaces
 * - Enhanced accessibility support
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { textStyles } from '../../constants/typography';


export type ResponseType = 'eaten' | 'partial' | 'refused' | null;

export interface Child {
  id: string;
  name: string;
  age: number;
}

export interface ChildResponse {
  childId: string;
  response: ResponseType;
}

export interface ChildResponseGridProps {
  /**
   * List of children in the family
   */
  children: Child[];
  
  /**
   * Current response state for each child
   */
  responses: ChildResponse[];
  
  /**
   * Callback when a child's response changes
   */
  onResponseChange: (childId: string, response: ResponseType) => void;
  
  /**
   * Callback for quick action - all children ate
   */
  onAllAte?: () => void;
  
  /**
   * Callback for quick action - all children refused
   */
  onAllRefused?: () => void;
  
  /**
   * Show quick action buttons
   */
  showQuickActions?: boolean;
  
  /**
   * Custom styling for the container
   */
  style?: ViewStyle;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Individual Child Response Row Component
 * Memoized to prevent unnecessary re-renders
 */
interface ChildResponseRowProps {
  child: Child;
  response: ResponseType;
  onResponseChange: (response: ResponseType) => void;
}

const ChildResponseRow: React.FC<ChildResponseRowProps> = memo(({
  child,
  response,
  onResponseChange,
}) => {
  return (
    <View className="space-y-3 mb-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium text-foreground">
            {child.name}
          </Text>
          <Text className="text-sm text-foreground-muted">
            {child.age} years
          </Text>
        </View>
        
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onResponseChange('eaten')}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              response === 'eaten'
                ? 'bg-success' 
                : 'bg-background-secondary'
            }`}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${child.name} as eaten`}
            accessibilityState={{ selected: response === 'eaten' }}
            testID={`child-response-${child.id}-eaten`}
          >
            <Text className="text-2xl">✓</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onResponseChange('partial')}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              response === 'partial'
                ? 'bg-warning' 
                : 'bg-background-secondary'
            }`}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${child.name} as partially eaten`}
            accessibilityState={{ selected: response === 'partial' }}
            testID={`child-response-${child.id}-partial`}
          >
            <Text className="text-lg">◐</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onResponseChange('refused')}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              response === 'refused'
                ? 'bg-error' 
                : 'bg-background-secondary'
            }`}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${child.name} as refused`}
            accessibilityState={{ selected: response === 'refused' }}
            testID={`child-response-${child.id}-refused`}
          >
            <Text className="text-xl">×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

ChildResponseRow.displayName = 'ChildResponseRow';

/**
 * Main ChildResponseGrid Component
 * Maintains exact visual design while providing modular architecture
 */
export const ChildResponseGrid: React.FC<ChildResponseGridProps> = ({
  children,
  responses,
  onResponseChange,
  onAllAte,
  onAllRefused,
  showQuickActions = false,
  style,
  testID = 'child-response-grid',
}) => {
  return (
    <View
      style={style}
      accessibilityRole="group"
      accessibilityLabel="Child response selection"
      testID={testID}
    >
      {/* Quick Action Buttons */}
      {showQuickActions && (onAllAte || onAllRefused) && (
        <View className="flex-row justify-end space-x-2 mb-4">
          {onAllAte && (
            <TouchableOpacity
              onPress={onAllAte}
              className="px-3 py-1 bg-success-light border border-success rounded-md"
              accessibilityRole="button"
              accessibilityLabel="Mark all children as ate"
              testID={`${testID}-all-ate`}
            >
              <Text className="text-xs font-medium text-success-foreground">
                All Ate
              </Text>
            </TouchableOpacity>
          )}
          {onAllRefused && (
            <TouchableOpacity
              onPress={onAllRefused}
              className="px-3 py-1 bg-error-light border border-error rounded-md"
              accessibilityRole="button"
              accessibilityLabel="Mark all children as refused"
              testID={`${testID}-all-refused`}
            >
              <Text className="text-xs font-medium text-error-foreground">
                All Refused
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Individual Child Responses */}
      {children.map((child) => {
        const childResponse = responses.find(r => r.childId === child.id);
        return (
          <ChildResponseRow
            key={child.id}
            child={child}
            response={childResponse?.response || null}
            onResponseChange={(response) => onResponseChange(child.id, response)}
          />
        );
      })}
    </View>
  );
};

export default ChildResponseGrid;