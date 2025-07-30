import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <StatusBar style="auto" />
      
      {/* App Title */}
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        LittleMeals
      </Text>
      
      <Text className="text-lg text-gray-600 text-center mb-8">
        Simple meal tracking for families
      </Text>

      {/* Sample Child Response Buttons */}
      <View className="w-full max-w-sm">
        <Text className="text-xl font-semibold text-gray-800 mb-4 text-center">
          How did Emma eat her pancakes?
        </Text>
        
        <View className="space-y-3">
          {/* Eaten Button */}
          <TouchableOpacity className="bg-success-500 py-4 px-6 rounded-xl">
            <Text className="text-white text-lg font-semibold text-center">
              ✅ Eaten
            </Text>
          </TouchableOpacity>
          
          {/* Partially Eaten Button */}
          <TouchableOpacity className="bg-warning-500 py-4 px-6 rounded-xl">
            <Text className="text-white text-lg font-semibold text-center">
              🤏 Partially Eaten
            </Text>
          </TouchableOpacity>
          
          {/* Refused Button */}
          <TouchableOpacity className="bg-primary-500 py-4 px-6 rounded-xl">
            <Text className="text-white text-lg font-semibold text-center">
              ❌ Refused
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-sm text-gray-500 mt-8 text-center">
        Development tools configured ✅
      </Text>
    </View>
  );
}